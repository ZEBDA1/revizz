/* Same-origin client: no API credential is accepted or stored in the browser. */
const RevizzAI = (() => {
  let status = null;
  const payload = c => ({ title: c.title, subject: c.subject, level: c.level, sections: c.sections.map(s => ({ title: s.title, text: s.text })) });
  async function check() {
    try {
      const response = await fetch('/api/ai', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error();
      status = await response.json();
    } catch { status = { configured: false, authenticated: false, unavailable: true }; }
    document.querySelectorAll('[data-ai-status]').forEach(el => { el.textContent = label(); });
    return status;
  }
  function label() { return status === null ? 'Vérification de l’IA…' : status.unavailable ? 'IA indisponible' : status.configured ? 'IA Cloudflare configurée' : 'IA à activer pour cet espace'; }
  async function request(mode, course, question) {
    let response;
    try {
      response = await fetch('/api/ai', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, course: payload(course), ...(question ? { question } : {}) }), signal: AbortSignal.timeout(125000) });
    } catch { throw new Error('L’IA ne répond pas pour le moment. Vérifie ta connexion ; ton texte est conservé.'); }
    let data;
    try { data = await response.json(); } catch { throw new Error('Le service IA est indisponible pour le moment. Ton texte est conservé.'); }
    if (!response.ok) { const error = new Error(data.error || 'L’analyse n’a pas abouti. Réessaie.'); error.code = data.code; throw error; }
    if (!data.result) throw new Error('Aucun résultat reçu. Ton cours est conservé.');
    return data.result;
  }
  return { check, label, generate: c => request('generate', c), ask: (c, q) => request('ask', c, q), feedback: (c, q) => request('feedback', c, q) };
})();
function aiDisclosure() {
  return 'Le texte vérifié de ce cours sera envoyé à Cloudflare pour cette activité. Les photos restent sur ton appareil. Relis les réponses : l’IA peut se tromper.';
}
function aiCoursePanel(c) {
  const generated = c.generated?.mode === 'ai';
  return `<section class="ai-course-panel"><div class="ai-panel-title"><span class="tile-icon purple">${ico('sparkle')}</span><div><span class="eyebrow">TON COURS, MIEUX COMPRIS</span><h2>Un coup de pouce de l’IA</h2><p class="small muted" data-ai-status>${esc(RevizzAI.label())}</p></div></div><p>${generated ? esc(c.generated.overview) : 'Des questions qui font réfléchir, des fiches qui vont à l’essentiel et des réponses aux notions qui te bloquent.'}</p><div class="ai-actions">${btn(generated ? 'Recréer mes outils avec l’IA' : 'Préparer mes outils avec l’IA', 'ai-upgrade', 'sparkle', 'primary', `data-id="${c.id}"`)}${btn('Poser une question sur ce cours', 'ai-ask', 'help', 'secondary', `data-id="${c.id}"`)}${c.previousTools ? btn('Revenir aux outils précédents', 'ai-restore', 'back', 'plain', `data-id="${c.id}"`) : ''}</div>${generated ? `<p class="small muted">Créé avec l’IA · Sources reliées au cours · À relire avant de réviser</p>` : `<p class="small muted">Tes outils actuels ${c.user ? 'ont été extraits en mode local' : 'sont ceux du cours d’exemple'}. La génération IA n’a pas encore été effectuée.</p>`}${c.generated?.warnings?.length ? `<div class="ai-warnings" role="note"><strong>À vérifier dans ton cours</strong><ul>${c.generated.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>` : ''}</section>`;
}
function aiErrorHTML(error) {
  return `<div class="scan-error" role="alert">${esc(error.message)}</div>${error.code === 'sign_in' ? '<p><a class="btn btn-primary" target="_top" href="/signin-with-chatgpt?return_to=/">Se connecter à cet espace</a></p>' : ''}`;
}
function aiUpgradeModal(c) {
  openModal('Ton cours mérite des outils sur mesure.', `<p>Revizz va analyser « ${esc(c.title)} » pour préparer des flashcards, trois fiches, un QCM expliqué et un entraînement adapté à ton niveau.</p><div class="notice">${esc(aiDisclosure())}</div><p class="small muted">Tes outils actuels seront remplacés. Une copie te permettra de revenir en arrière. Tes notes de fiche restent conservées.</p><div id="ai-upgrade-result"></div><div class="modal-actions">${btn('Annuler', 'close-modal', '', 'secondary')}${btn('Analyser et créer mes outils', 'ai-generate-existing', 'sparkle', 'primary', `data-id="${c.id}"`)}</div>`);
}
async function aiGenerateExisting(c, button) {
  if (button.disabled) return;
  const target = $('#ai-upgrade-result'); button.disabled = true;
  target.innerHTML = '<p class="ai-busy" role="status"><span class="spinner"></span> Analyse du cours et préparation des outils… Cela peut prendre une minute.</p>';
  try {
    const pack = await RevizzAI.generate(c);
    c.previousTools = { cards: c.cards, quiz: c.quiz, generated: c.generated || null };
    Object.assign(c, pack);
    Object.keys(db.reviews).filter(k => k.startsWith(c.id + '-')).forEach(k => delete db.reviews[k]);
    save(); closeModal(); navigate('generated', c.id); toast('Tes outils personnalisés sont prêts.');
  } catch (error) { if (target.isConnected) target.innerHTML = aiErrorHTML(error); else toast(error.message); }
  finally { button.disabled = false; }
}
function aiAskModal(c) {
  openModal('Une notion te bloque ?', `<p>Pose ta question sur « ${esc(c.title)} ». Revizz s’appuie sur le texte de ce cours et te montre ses sources.</p><form id="ai-question-form" data-ai-course="${c.id}"><div class="field"><label for="ai-question">Ma question</label><textarea id="ai-question" name="question" required minlength="5" maxlength="3000" rows="3" placeholder="Pourquoi… ? Quelle différence entre… ? Comment appliquer… ?"></textarea></div><p class="small muted">${esc(aiDisclosure())}</p><div class="modal-actions"><button class="btn btn-primary" type="submit">${ico('sparkle')} M’aider à comprendre</button></div></form><div id="ai-answer" aria-live="polite"></div>`, true);
}
async function aiSubmitQuestion(form) {
  const c = course(form.dataset.aiCourse), question = new FormData(form).get('question').trim();
  const button = form.querySelector('button[type="submit"]'), target = $('#ai-answer');
  if (!c || button.disabled) return;
  button.disabled = true; target.innerHTML = '<p class="ai-busy" role="status"><span class="spinner"></span> Je cherche dans ton cours…</p>';
  try {
    const result = await RevizzAI.ask(c, question);
    if (target.isConnected) target.innerHTML = `<article class="ai-answer"><div class="eyebrow">${result.supported ? 'EXPLICATION À PARTIR DU COURS' : 'LE COURS NE SUFFIT PAS'}</div><p>${esc(result.answer)}</p>${result.sources.map(s => `<blockquote>${esc(s.sourceQuote)}</blockquote><button class="source-btn" data-action="source" data-course-source="${c.id}" data-index="${s.source}">${ico('book')} Passage ${s.source + 1} · ${esc(c.sections[s.source]?.title)}</button>`).join('')}<p class="small muted">Réponse IA à vérifier avec ton cours.</p></article>`;
  } catch (error) { if (target.isConnected) target.innerHTML = aiErrorHTML(error); }
  finally { button.disabled = false; }
}
function aiFeedbackView(c, s) {
  const result = s.aiFeedback;
  return `<div class="practice-feedback"><h2>Ce que ton explication révèle</h2><p>${esc(result.overview)}</p>${result.points.map(p => `<div class="concept-row ${p.status === 'acquis' ? '' : 'missing'}">${ico(p.status === 'acquis' ? 'check' : 'refresh')}<div>${tag(p.status, p.status === 'acquis' ? 'green' : 'orange')}<h3>${esc(p.title)}</h3><p>${esc(p.explanation)}</p><button class="source-btn" data-action="source" data-index="${p.source}">${ico('book')} Vérifier dans le cours</button></div></div>`).join('')}<div class="notice"><strong>Pour vérifier que tu as compris</strong><ul>${result.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul></div><p class="small muted">Retour de l’IA, à vérifier · Aucune note n’est attribuée à cette activité.</p><div class="modal-actions">${btn('Améliorer mon explication', 'practice-retry', 'edit', 'secondary')}${btn('Passer aux flashcards', 'start-cards', 'cards', 'primary', `data-id="${c.id}"`)}</div></div>`;
}
document.addEventListener('submit', event => {
  if (event.target.id !== 'ai-question-form') return;
  event.preventDefault(); aiSubmitQuestion(event.target);
});
