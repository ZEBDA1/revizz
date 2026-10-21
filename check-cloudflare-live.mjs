// Run explicitly with: node --env-file=.env.local check-cloudflare-live.mjs
// Uses the account's inference allowance. Never prints credentials or provider bodies.
import { handleAI } from './lib/revision-ai.mjs';

const key = process.env.CLOUDFLARE_API_TOKEN?.trim();
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
if (!key || !/^[a-f0-9]{32}$/i.test(accountId || '')) {
  console.log('Activation en attente : renseigne CLOUDFLARE_ACCOUNT_ID et CLOUDFLARE_API_TOKEN dans .env.local.');
  process.exitCode = 1;
} else {
  const course = {
    title: 'Les ondes mécaniques', subject: 'Physique-chimie', level: 'Terminale',
    sections: [
      { title: 'Définition', text: 'Une onde mécanique est une perturbation qui se propage dans un milieu matériel. Elle transporte de l’énergie sans transport global de matière.' },
      { title: 'Célérité', text: 'La célérité est la vitesse de propagation de l’onde. Elle vérifie v = d / Δt. La distance d est exprimée en mètres et la durée Δt en secondes. La célérité v est exprimée en mètres par seconde.' },
    ],
  };
  const request = new Request('https://revizz.test/api/ai', {
    method: 'POST', headers: { Origin: 'https://revizz.test', 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'generate', course }),
  });
  const started = Date.now();
  const response = await handleAI(request, true, { key, accountId });
  const data = await response.json();
  console.log(JSON.stringify({
    status: response.status, code: data.code, error: data.error,
    seconds: Math.round((Date.now() - started) / 1000), provider: data.result?.generated.provider,
    cards: data.result?.cards.length, quiz: data.result?.quiz.length,
    summaryFormats: Object.keys(data.result?.generated.summaries || {}),
    assessment: data.result?.generated.assessment.length,
  }));
  if (!response.ok) process.exitCode = 1;
}
