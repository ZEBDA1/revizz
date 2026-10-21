import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleAI, aiStatus, CLOUDFLARE_MODEL, sourceCatalog } from './lib/revision-ai.mjs';

const course = { title: 'Les ondes mécaniques', subject: 'Physique-chimie', level: 'Terminale', sections: [
  { title: 'Définition', text: 'Une onde mécanique est une perturbation qui se propage dans un milieu matériel. Elle transporte de l’énergie sans transport global de matière.' },
  { title: 'Célérité', text: 'La célérité est la vitesse de propagation de l’onde. Elle vérifie v = d / Δt.' },
] };
const source = { citation: 0 };
const displayedSource = { source: 0, sourceQuote: course.sections[0].text };
const card = { q: 'Que transporte une onde mécanique ?', a: 'De l’énergie, sans transport global de matière.', type: 'compréhension', difficulty: 'easy', ...source };
const quiz = { q: 'Que transporte l’onde ?', options: ['De l’énergie', 'Globalement de la matière', 'Le milieu matériel'], correct: [0], explanation: 'Le cours précise un transport d’énergie sans transport global de matière.', difficulty: 'easy', ...source };
const summaries = { p0: 'Propagation dans un milieu matériel, sans transport global de matière.', p1: 'Célérité : v = d / Δt.' };
const pack = { overview: 'Comprendre la propagation et la célérité.', warnings: [], cards: [card, { ...card, q: 'L’onde emporte-t-elle la matière ?', a: 'Non, elle transporte de l’énergie.' }], quiz: [quiz, { ...quiz, q: 'Le transport de matière est-il global ?' }], summaries: { express: summaries, complete: summaries, last: summaries }, assessment: [{ q: 'Explique le déplacement d’un bouchon sur une vague.', answer: 'Il peut osciller sans être emporté globalement.', explanation: 'Le transport global concerne l’énergie.', points: 3, ...source }] };
const config = { key: 'test-credential-not-real', accountId: 'a'.repeat(32) };
const request = (mode = 'generate', extra = {}, headers = {}) => new Request('https://revizz.test/api/ai', { method: 'POST', headers: { Origin: 'https://revizz.test', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ mode, course, ...extra }) });
const provider = result => async () => Response.json({ success: true, errors: [], messages: [], result: { response: result } });
const run = (req, transport = provider(pack)) => handleAI(req, true, config, transport);

test('le statut ne divulgue aucune clé', async () => {
  assert.deepEqual(await aiStatus(config, true).json(), { configured: true, authenticated: true, provider: 'Cloudflare Workers AI' });
  assert.equal((await aiStatus({ ...config, accountId: '' }, true).json()).configured, false);
});
test('authentification, origine et activation contrôlées avant tout appel', async () => {
  const never = async () => { throw new Error('Unexpected upstream request'); };
  assert.equal((await handleAI(request(), false, config, never)).status, 401);
  assert.equal((await handleAI(request('generate', {}, { Origin: 'https://other.test' }), true, config, never)).status, 403);
  const disabled = await handleAI(request(), true, { key: '' }, never);
  assert.equal(disabled.status, 503); assert.equal((await disabled.json()).code, 'not_configured');
  for (const accountId of ['', '../other', 'a'.repeat(31), 'https://other.test']) {
    assert.equal((await handleAI(request(), true, { ...config, accountId }, never)).status, 503);
  }
});
test('appel Workers AI natif avec schéma et compte validé, jeton exclusivement côté serveur', async () => {
  const response = await run(request(), async (url, options) => {
    assert.equal(url, 'https://api.cloudflare.com/client/v4/accounts/' + config.accountId + '/ai/run/' + CLOUDFLARE_MODEL);
    assert.equal(options.headers.Authorization, 'Bearer ' + config.key);
    const body = JSON.parse(options.body);
    assert.equal(body.model, undefined);
    assert.equal(body.response_format.type, 'json_schema');
    assert.equal(body.response_format.json_schema.additionalProperties, false);
    assert.equal(body.messages[0].role, 'system');
    const inputCourse=JSON.parse(body.messages[1].content).course;
    assert.equal(inputCourse.excerpts[1].text, course.sections[1].text);
    assert.equal(inputCourse.sections[1].text, undefined);
    assert.deepEqual(body.response_format.json_schema.properties.cards.items.properties.citation.enum,[0,1]);
    assert.deepEqual(body.response_format.json_schema.properties.summaries.properties.complete.required, ['p0', 'p1']);
    assert.equal(options.body.includes(config.key), false);
    assert.equal(body.max_tokens, 10000); assert.equal(body.stream, false);
    return provider(pack)();
  });
  assert.equal(response.status, 200);
  const { result } = await response.json();
  assert.equal(result.generated.mode, 'ai'); assert.equal(result.cards.length, 2);
  assert.equal(result.generated.provider, 'Cloudflare Workers AI');
  assert.equal(result.generated.model, CLOUDFLARE_MODEL);
  assert.equal(JSON.stringify(result).includes(config.key), false);
  assert.equal(result.generated.summaries.complete[1], summaries.p1);
  assert.equal(result.generated.assessment[0].written, true);
  assert.equal(result.cards[0].sourceQuote,course.sections[0].text);
  assert.equal(result.cards[0].citation,undefined);
});
test('une citation inventée bloque tout le pack', async () => {
  const bad = structuredClone(pack); bad.cards[0].sourceQuote = 'Une onde se propage dans le vide.';
  const result = await run(request(), provider(bad));
  assert.equal(result.status, 502); assert.equal((await result.json()).code, 'invalid_output');
});
test('une source inexistante est rejetée', async () => {
  const bad = structuredClone(pack); bad.cards[0].citation = 99;
  assert.equal((await run(request(), provider(bad))).status, 502);
});
test('QCM avec doublons, index hors limites ou toutes réponses correctes rejetés', async () => {
  for (const patch of [{ options: ['A', 'A', 'B'] }, { correct: [3] }, { correct: [0, 1, 2] }, { correct: [0, 0] }]) {
    const bad = structuredClone(pack); Object.assign(bad.quiz[0], patch);
    assert.equal((await run(request(), provider(bad))).status, 502);
  }
});
test('une fiche qui oublie un passage est rejetée', async () => {
  const bad = structuredClone(pack); delete bad.summaries.last.p1;
  assert.equal((await run(request(), provider(bad))).status, 502);
});
test('question sur le cours avec réponse sourcée', async () => {
  const answer = { answer: 'Elle transporte de l’énergie.', supported: true, sources: [source] };
  const response = await run(request('ask', { question: 'Que transporte cette onde ?' }), provider(answer));
  assert.deepEqual((await response.json()).result, { ...answer, sources: [displayedSource] });
});
test('réponse non sourcée ou refus de compléter une lacune', async () => {
  const answer = { answer: 'Le cours ne précise pas cette donnée.', supported: false, sources: [] };
  assert.equal((await run(request('ask', { question: 'Quelle est la valeur dans le vide ?' }), provider(answer))).status, 200);
  assert.equal((await run(request('ask', { question: 'Que transporte cette onde ?' }), provider({ ...answer, supported: true }))).status, 502);
});
test('retour sémantique avec source, sans note', async () => {
  const feedback = { overview: 'Le transport est à préciser.', points: [{ status: 'à corriger', title: 'Transport', explanation: 'L’énergie se propage, sans transport global de matière.', ...source }], questions: ['Que fait le milieu après le passage de l’onde ?'] };
  const response = await run(request('feedback', { question: 'Une onde transporte globalement toute la matière.' }), provider(feedback));
  assert.deepEqual((await response.json()).result, { ...feedback, points: [{ status: 'à corriger', title: 'Transport', explanation: 'L’énergie se propage, sans transport global de matière.', ...displayedSource }] });
});
test('tous les extraits des longs passages sont conservés, y compris leur fin', async()=>{
  const text=('Une notion suivie de son explication. '.repeat(100))+'Dernière notion à mémoriser.';
  const longCourse={...course,sections:[{title:'Un long passage',text}]};
  const excerpts=sourceCatalog(longCourse);
  assert.equal(excerpts.map(x=>x.text).join(' ').replace(/\s+/g,' '),text.replace(/\s+/g,' '));
  assert.ok(excerpts.every(x=>x.text.length<=800&&x.source===0));
  const answer={answer:'La dernière notion figure à la fin du cours.',supported:true,sources:[{citation:excerpts.length-1}]};
  const response=await run(request('ask',{course:longCourse,question:'Que retenir de la fin du cours ?'}),provider(answer));
  assert.equal(response.status,200);
  const result=(await response.json()).result;
  assert.ok(result.sources[0].sourceQuote.endsWith('Dernière notion à mémoriser.'));
  assert.equal(result.sources[0].source,0);
});
test('erreurs fournisseur et réponses incomplètes ne créent pas de contenu local', async () => {
  for (const status of [400, 401, 403, 429, 500]) {
    const response = await run(request(), async () => new Response('', { status }));
    const body = await response.json(); assert.ok(body.error); assert.equal(body.result, undefined);
  }
  for (const reason of ['length', 'model_length', 'error', 'tool_calls']) {
    assert.equal((await run(request(), async () => Response.json({ success: true, result: { finish_reason: reason, response: pack } }))).status, 502);
  }
  assert.equal((await run(request(), async () => Response.json({ success: true, result: { response: 'Je ne peux pas traiter ce contenu.' } }))).status, 502);
  assert.equal((await run(request(), async () => Response.json(null))).status, 502);
});
test('la réponse JSON sérialisée de Cloudflare est également acceptée', async () => {
  const response = await run(request(), async () => Response.json({ success: true, result: { response: JSON.stringify(pack) } }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).result.generated.overview, pack.overview);
});
test('quota gratuit, saturation, modèle payant et accès sont distingués', async () => {
  for (const [providerCode, status, code] of [[3036,429,'provider_quota'],[3040,429,'provider_busy'],[5035,403,'provider_plan'],[5016,403,'provider_model_access'],[3006,413,'too_large']]) {
    const response=await run(request(),async()=>Response.json({success:false,errors:[{code:providerCode,message:'Provider detail must not leak'}]},{status}));
    const body=await response.json(); assert.equal(body.code,code); assert.equal(JSON.stringify(body).includes('Provider detail'),false); assert.equal(body.result,undefined);
  }
  assert.equal((await run(request(),async()=>Response.json({success:false,errors:[{code:3036}]}))).status,429);
});
test('un compte ou un modèle fourni dans le navigateur ne change pas le transport serveur', async () => {
  const response=await run(request('generate',{accountId:'b'.repeat(32),model:'@cf/paid/model'}),async(url,options)=>{
    assert.ok(url.includes('/accounts/'+config.accountId+'/'));
    assert.ok(url.endsWith('/'+CLOUDFLARE_MODEL));
    assert.equal(JSON.parse(options.body).model,undefined);
    return provider(pack)();
  });
  assert.equal(response.status,200);
});
test('limites de taille et format, sans troncature silencieuse', async () => {
  assert.equal((await run(request('generate', { course: { ...course, sections: [{ title: 'Texte', text: 'a'.repeat(61000) }] } }))).status, 400);
  assert.equal((await run(request('generate', { course: { ...course, sections: [{ title: 'Texte', text: 'a'.repeat(24001) }] } }))).status, 400);
  assert.equal((await run(request('generate', { course: { ...course, sections: Array(31).fill(course.sections[0]) } }))).status, 400);
  assert.equal((await run(request('ask', { question: 'a'.repeat(10001) }))).status, 400);
  assert.equal((await run(request('generate', { excess: 'a'.repeat(200000) }))).status, 413);
  assert.equal((await run(request('generate', {}, { 'Content-Type': 'text/plain' }))).status, 415);
});
