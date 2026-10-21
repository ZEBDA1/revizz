/* Parcours de scan, outils générés et commandes pour les appareils portables. */
function resolvedTheme() {
  return db.theme === 'system' ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : db.theme === 'dark' ? 'dark' : 'light';
}
function themeButton() {
  const dark = resolvedTheme() === 'dark';
  return `<button class="icon-btn theme-toggle" data-action="theme" aria-label="${dark ? 'Activer le mode clair' : 'Activer le mode sombre'}" aria-pressed="${dark}" title="${dark ? 'Mode clair' : 'Mode sombre'}">${ico(dark ? 'sun' : 'moon')}</button>`;
}
function applyTheme() {
  const dark = resolvedTheme() === 'dark';
  document.body.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.documentElement.style.background = dark ? '#171821' : '#f7f8fb';
  $('meta[name="theme-color"]')?.setAttribute('content', dark ? '#171821' : '#f7f8fb');
  $$('[data-action="theme"]').forEach(button => {
    button.innerHTML = ico(dark ? 'sun' : 'moon');
    button.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('title', dark ? 'Mode clair' : 'Mode sombre');
  });
}
function themeSettings() {
  return `<div class="theme-settings"><span class="tile-icon purple">${ico('sun')}</span><div><strong>Apparence de ton espace</strong><p>${db.theme === 'system' ? 'Suit le thème de ton appareil' : resolvedTheme() === 'dark' ? 'Mode sombre activé' : 'Mode clair activé'}</p></div>${btn('Automatique', 'theme-system', '', 'soft')}</div>`;
}
function mobileNavigation(active) {
  const item = (route, label, icon) => `<a href="#${route}" data-nav="${route}" class="${active === route ? 'active' : ''}" ${active === route ? 'aria-current="page"' : ''}>${ico(icon)}<span>${label}</span></a>`;
  return `<nav class="mobile-bottom-nav" aria-label="Navigation mobile">${item('dashboard', 'Accueil', 'grid')}${item('library', 'Mes cours', 'book')}<button class="scan-nav ${state.route === 'scanner' ? 'active' : ''}" data-action="add" aria-label="Scanner un cours"><span class="scan-nav-mark">${ico('camera')}</span><span>Scanner</span></button>${item('revision', 'Réviser', 'cards')}${item('planning', 'Planning', 'calendar')}</nav>`;
}
function scanInputs() {
  return '<input hidden type="file" id="file-input" multiple accept="image/*,.pdf,.txt"><input hidden type="file" id="camera-input" accept="image/*" capture="environment">';
}
function scanPage() {
  const step = state.generating ? 3 : state.scanStep;
  return heading('Du scan à tes prochaines révisions.', 'Une photo, une relecture, et tous tes outils sont créés automatiquement.') +
    `<div class="steps"><div class="step ${step === 1 ? 'active' : ''}"><span>${step > 1 ? '✓' : '1'}</span> Scanner</div><div class="step-line"></div><div class="step ${step === 2 ? 'active' : ''}"><span>${step > 2 ? '✓' : '2'}</span> Vérifier</div><div class="step-line"></div><div class="step ${step === 3 ? 'active' : ''}"><span>3</span> Générer</div></div><div class="scanner-panel"><div class="panel">${state.generating ? generationLoading() : state.scanBusy ? `<div class="scan-status" role="status" aria-live="polite"><div class="spinner"></div><h2>On déchiffre ton cours…</h2><p class="subheading" id="scan-label">Analyse des documents · ${state.scanProgress}%</p><div class="session-progress" style="margin:25px auto 0;max-width:350px"><span id="scan-bar" style="width:${state.scanProgress}%"></span></div><p class="scan-note">Le premier scan télécharge les outils de lecture. Garde cette page ouverte pendant le traitement.</p></div>` : state.scanStep === 1 ? scanUploadPage() : scanEditorPage()}${scanInputs()}</div></div>`;
}
function scanUploadPage() {
  return `<div class="generation-banner">${ico('sparkle')}<div><h3>Scanne ton cours. L’IA prépare la suite.</h3><p>Flashcards, 3 fiches, QCM expliqués et entraînement sont créés à partir de tes notions, après ta relecture.</p><p class="small muted" data-ai-status>${esc(RevizzAI.label())}</p></div></div><div id="drop-zone" class="upload-zone"><span class="tile-icon purple">${ico('camera')}</span><h2>Ton cours tient dans une photo.</h2><p>Prends une photo nette, ou importe tes images et PDF.<br>Plusieurs documents · 15 Mo par fichier</p><div class="flex">${btn('Photographier mon cours', 'camera', 'camera')}${btn('Importer des images ou PDF', 'choose-files', 'upload', 'secondary')}</div></div><div class="privacy-note">${ico('shield')}<span>Le scan est lu sur ton appareil. Après ta relecture, le texte est envoyé à Cloudflare pour créer tes outils avec l’IA. Les manuscrits et les formules complexes peuvent nécessiter une correction manuelle.</span></div>${state.scanError ? `<div class="scan-error" role="alert">${esc(state.scanError)} Tu peux aussi coller le texte de ton cours ci-dessous.</div>` : ''}<div class="or-divider">OU COLLE DIRECTEMENT TON TEXTE</div><div class="field"><label for="paste-text">Le texte de ton cours</label><textarea id="paste-text" rows="6" placeholder="Les titres, définitions, formules et exemples de ton cours…">${esc(state.scanText)}</textarea></div><div class="flex between">${btn('Voir un exemple', 'demo-scan', 'sparkle', 'soft')}${btn('Vérifier puis générer', 'verify-text', 'arrow')}</div>`;
}
function captureScanDraft() {
  if ($('#transcript')) state.scanText = $('#transcript').value;
  if ($('#course-title')) state.scanTitle = $('#course-title').value;
  if ($('#course-subject')) state.scanSubject = $('#course-subject').value;
  if ($('#course-chapter')) state.scanChapter = $('#course-chapter').value;
  if ($('#course-level')) state.scanLevel = $('#course-level').value;
}
function scanEditorPage() {
  const count = (state.scanText.match(/\[(?:à vérifier|illisible)[^\]]*\]/gi) || []).length;
  return `<div class="section-heading"><div><h2>Vérifie. On prépare le reste.</h2><p>Ton cours sera la seule source de tes révisions.</p></div>${tag('2 / 3', 'purple')}</div>${state.scanFiles.length ? `<div class="scan-file-count">${ico('file')} ${state.scanFiles.length} document${state.scanFiles.length > 1 ? 's' : ''} ajouté${state.scanFiles.length > 1 ? 's' : ''}</div>` : ''}<div class="scan-quality ${count ? 'uncertain' : ''}">${ico(count ? 'search' : 'check')}<span>${count ? `${count} passage${count > 1 ? 's' : ''} à vérifier. Corrige les indications [à vérifier] avant de générer tes outils.` : 'Texte extrait. Vérifie les mots, les dates et les formules : une bonne transcription donne de meilleures cartes.'}</span></div>${state.scanError ? `<div class="scan-error" role="alert">${esc(state.scanError)} Le texte déjà lu a été conservé.</div>` : ''}${state.scanAuthRequired ? '<p><a class="btn btn-primary" target="_top" href="/signin-with-chatgpt?return_to=%2F%23scanner">Se connecter à cet espace</a></p>' : ''}${state.scanCanLocal ? `<div class="scan-local-action">${btn('Continuer en mode local, sans IA', 'scan-local', '', 'secondary')}<p class="small muted">Extraction simple de phrases du cours. Tu pourras améliorer ces outils avec l’IA plus tard.</p></div>` : ''}<div class="scan-extra-actions">${btn('Scanner une autre page', 'scan-more-camera', 'camera', 'secondary')}${btn('Ajouter un document', 'scan-more-files', 'plus', 'secondary')}</div>${scanPreviewUrls.length ? `<details style="margin-bottom:22px"><summary class="small">Comparer avec mes photos (${scanPreviewUrls.length})</summary><div class="flex" style="overflow:auto;padding:15px 0">${scanPreviewUrls.map((u, i) => `<img loading="lazy" src="${u}" alt="Photo ${i + 1} du cours à comparer" style="max-height:300px;max-width:100%;object-fit:contain;border:1px solid var(--line);border-radius:10px">`).join('')}</div></details>` : ''}<form id="save-course-form"><div class="field"><label for="course-title">Titre du cours</label><input id="course-title" name="title" required maxlength="100" value="${esc(state.scanTitle || '')}" placeholder="Ex. Les ondes mécaniques"></div><details class="scan-metadata" style="margin:0 0 22px"><summary class="small" style="cursor:pointer;padding:10px 0;color:var(--purple)">${esc(state.scanSubject || 'Autre')} · ${esc(state.scanLevel || db.level)} · Modifier le classement</summary><div class="two-fields" style="margin-top:16px"><div class="field"><label for="course-subject">Matière</label><select id="course-subject" name="subject">${['SVT', 'Mathématiques', 'Histoire', 'Physique-chimie', 'Français', 'Philosophie', 'Anglais', 'Autre'].map(s => `<option ${s === (state.scanSubject || 'Autre') ? 'selected' : ''}>${s}</option>`).join('')}</select></div><div class="field"><label for="course-level">Niveau</label><select id="course-level" name="level">${['6e', '5e', '4e', '3e', 'Seconde', 'Première', 'Terminale', 'Études supérieures'].map(s => `<option ${s === (state.scanLevel || db.level) ? 'selected' : ''}>${s}</option>`).join('')}</select></div></div><div class="field"><label for="course-chapter">Chapitre</label><input id="course-chapter" name="chapter" maxlength="100" value="${esc(state.scanChapter || '')}" placeholder="Le chapitre de ton cours"></div></details><div class="field"><label for="transcript">Transcription à corriger</label><textarea id="transcript" name="text" required rows="13" spellcheck="true">${esc(state.scanText)}</textarea></div><label class="check-label scan-verify-box"><input type="checkbox" name="verified" required><span>J’ai relu le texte et corrigé les passages incertains. En mode IA, le texte sera envoyé à Cloudflare pour créer mes outils. Les réponses restent à vérifier.</span></label><div class="scan-actions">${btn('Retour', 'scan-back', 'back', 'secondary')}<button type="submit" class="btn btn-primary">${ico('sparkle')} Créer mes outils avec l’IA</button></div><p class="scan-note">Automatique : flashcards, textes à trous, 3 fiches, QCM et questions d’entraînement. Chaque contenu garde son passage source.</p></form>`;
}
function generationLoading() {
  if (state.generationMode === 'local') return '<div class="generation-loading" role="status"><div class="spinner"></div><h2>Extraction des outils en mode local.</h2><p>Les phrases sont extraites du cours, sans appel à l’IA.</p></div>';
  return `<div class="generation-loading" role="status" aria-live="polite"><div class="spinner"></div><h2>L’IA prépare tes outils.</h2><p>Analyse du cours, questions ciblées et corrections expliquées. Cela peut prendre une minute. Garde cette page ouverte.</p><ol><li>${ico('check')} Organisation des notions</li><li>${ico('cards')} Création des flashcards et textes à trous</li><li>${ico('file')} Préparation des trois fiches</li><li>${ico('target')} Création du QCM et de l’entraînement</li></ol></div>`;
}
async function createCourseFromScan(form, local = false) {
  if (state.generating) return;
  const fields = new FormData(form);
  const text = fields.get('text').trim(), title = fields.get('title').trim();
  if (text.length < 40 || !title) { toast('Ajoute un titre et quelques phrases de cours pour créer tes outils.'); return; }
  if (/\[(?:à vérifier|illisible)[^\]]*\]/i.test(text)) { toast('Corrige ou supprime les passages [à vérifier] avant de continuer.'); $('#transcript').focus(); return; }
  if (!fields.get('verified')) { toast('Relis ton texte et coche la confirmation avant de continuer.'); return; }
  const sections = StudyTools.sections(text);
  if (!sections.length) { toast('Aucun passage exploitable. Ajoute des phrases complètes à la transcription.'); return; }
  captureScanDraft();
  const existing = db.courses.find(c => c.id === state.editingId);
  const subject = fields.get('subject');
  const [color, icon] = ({ SVT: ['green', 'leaf'], Mathématiques: ['purple', 'function'], Histoire: ['orange', 'globe'], 'Physique-chimie': ['blue', 'waves'] })[subject] || ['purple', 'book'];
  state.generating = true; state.generationMode = local ? 'local' : 'ai'; state.scanError = ''; render();
  try {
    await new Promise(resolve => requestAnimationFrame(resolve));
    const c = { id: existing?.id || 'cours-' + crypto.randomUUID(), title, subject, level: fields.get('level'), chapter: fields.get('chapter').trim() || title, color, icon, date: todayKey(), mastery: 0, pages: state.scanFiles.length || 1, sections, user: true, origin: state.scanFiles.length ? 'scan' : 'text' };
    Object.assign(c, local ? StudyTools.pack(c) : await RevizzAI.generate(c));
    if (!c.cards.length || !c.quiz.length) throw new Error('Ce texte ne contient pas encore assez de notions pour générer des outils.');
    if (existing) {
      db.courses = db.courses.map(old => old.id === c.id ? c : old);
      Object.keys(db.reviews).filter(k => k.startsWith(c.id + '-')).forEach(k => delete db.reviews[k]);
      db.history = db.history.filter(h => h.courseId !== c.id);
      db.errors = db.errors.filter(e => e.courseId !== c.id);
    } else db.courses.unshift(c);
    state.editingId = null; state.generating = false; state.scanText = ''; state.scanCanLocal = false; state.courseTab = 'cards'; save();
    navigate('generated', c.id);
    toast(`${c.cards.length} flashcards, 3 fiches et ton QCM sont prêts.`);
  } catch (error) {
    state.generating = false; state.scanStep = 2; state.scanCanLocal = true; state.scanAuthRequired = error.code === 'sign_in'; state.scanError = error.message || 'La création n’a pas abouti. Ton texte est conservé : vérifie-le puis réessaie.'; render();
  }
}
function generatedView() {
  const c = course(); if (!c) return library();
  const writtenCount = c.generated?.assessment?.length || Math.min(c.cards.length, 4);
  return `<section class="ready-header"><span class="tile-icon green">${ico('check')}</span><div class="eyebrow">DE TON COURS À TES RÉVISIONS</div><h1>Tes outils sont prêts.</h1><p>${c.generated?.mode === 'ai' ? 'L’IA a préparé des outils sur mesure à partir de ton texte vérifié. Relis-les, puis commence à réviser.' : 'Outils extraits en mode local, sans IA. Tu peux les utiliser ou les améliorer avec l’IA depuis ton cours.'}</p><div class="ready-course">${tag(c.subject, c.color)}${tag(c.level, 'purple')}<span class="small muted">${esc(c.title)}</span></div></section>${c.generated?.warnings?.length ? `<div class="ai-warnings"><strong>À vérifier</strong><ul>${c.generated.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>` : ''}<div class="ready-primary-action">${btn('Commencer mes flashcards', 'start-cards', 'play', 'primary', `data-id="${c.id}"`)}</div><section class="ready-tools" aria-label="Outils créés automatiquement"><button class="ready-tool" data-action="start-cards" data-id="${c.id}"><span class="tile-icon green">${ico('cards')}</span><strong>${c.cards.length}</strong><h3>Flashcards</h3><p>Notions, définitions, dates, formules et textes à trous selon ton cours.</p><span class="ready-link">Mémoriser ${ico('arrow')}</span></button><button class="ready-tool" data-action="generated-summary" data-id="${c.id}"><span class="tile-icon purple">${ico('file')}</span><strong>3</strong><h3>Fiches de révision</h3><p>Résumé express, fiche complète et dernière minute. Modifiables et exportables.</p><span class="ready-link">Voir mes fiches ${ico('arrow')}</span></button><button class="ready-tool" data-action="start-quiz" data-id="${c.id}"><span class="tile-icon blue">${ico('target')}</span><strong>${c.quiz.length}</strong><h3>Questions de QCM</h3><p>Une correction expliquée et le passage du cours à retrouver.</p><span class="ready-link">Me tester ${ico('arrow')}</span></button><button class="ready-tool" data-action="start-assessment" data-id="${c.id}"><span class="tile-icon orange">${ico('calendar')}</span><strong>1</strong><h3>Entraînement prêt</h3><p>${writtenCount} question${writtenCount > 1 ? 's' : ''} rédigée${writtenCount > 1 ? 's' : ''} disponible${writtenCount > 1 ? 's' : ''}, un barème et une note estimée.</p><span class="ready-link">M’entraîner ${ico('arrow')}</span></button></section><div class="ready-lower"><section class="panel"><div class="section-heading"><h2>Un aperçu de tes cartes</h2>${btn('Les modifier', 'generated-cards', 'edit', 'plain', `data-id="${c.id}"`)}</div><div class="preview-cards">${c.cards.slice(0, 2).map(card => `<article class="preview-card">${tag(card.type || 'Question / réponse', c.color)}<h3>${esc(card.q)}</h3><details><summary>Voir la réponse</summary><p>${esc(card.a)}</p></details><button class="source-btn" data-action="source" data-index="${card.source}">${ico('book')} Voir le passage source</button></article>`).join('')}</div></section><aside class="panel"><span class="tile-icon purple">${ico('shield')}</span><h3 style="margin-top:15px">Tes cours gardent le dernier mot.</h3><p>Les outils utilisent uniquement le texte que tu as validé. Une carte te paraît imprécise ? Modifie-la ou retrouve son passage source.</p>${btn('Voir mon cours et ses outils', 'generated-course', 'book', 'secondary', `data-id="${c.id}"`)}<p class="scan-note">L’écriture manuscrite et les symboles complexes restent à vérifier après le scan.</p></aside></div>`;
}
function mobileAgenda() {
  const sessions = planSessions().filter(s => s.date >= todayKey());
  const exams = db.exams.filter(e => e.date >= todayKey());
  const dates = [...new Set([...sessions.map(s => s.date), ...exams.map(e => e.date)])].sort().slice(0, 10);
  return `<section class="mobile-agenda"><div class="section-heading"><h2>${state.showCalendar ? 'Ton calendrier' : 'Tes prochaines séances'}</h2>${btn(state.showCalendar ? 'Vue agenda' : 'Calendrier', 'toggle-calendar', state.showCalendar ? 'file' : 'calendar', 'soft')}</div>${state.showCalendar ? '' : dates.length ? dates.map(date => `<section class="agenda-day"><h3>${date === todayKey() ? 'Aujourd’hui' : prettyDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</h3>${exams.filter(e => e.date === date).map(e => `<button class="agenda-exam" data-action="exam-detail" data-id="${e.id}"><span class="tile-icon purple">${ico('flag')}</span><span><strong>${esc(e.name)}</strong><small>Contrôle · ${esc(course(e.courseId)?.subject || '')}</small></span>${ico('chevron')}</button>`).join('')}${sessions.filter(s => s.date === date).map(s => `<div class="agenda-session"><label class="agenda-check"><input type="checkbox" data-plan="${s.id}" ${db.planDone.includes(s.id) ? 'checked' : ''}><span><strong>${esc(course(s.courseId)?.title || 'Mon cours')}</strong><small>${s.kind} · ${s.minutes} min</small></span></label>${btn('Réviser', 'plan-activity', 'play', 'soft', `data-id="${s.courseId}"`)}</div>`).join('')}</section>`).join('') : `<div class="panel empty-state"><span class="tile-icon purple">${ico('calendar')}</span><h2>Ton prochain objectif commence ici.</h2><p>Ajoute la date d’un contrôle pour répartir tes révisions.</p>${btn('Planifier un contrôle', 'add-exam', 'plus')}</div>`}</section>`;
}
async function prepareScanImage(file) {
  let image, url;
  try {
    if (typeof createImageBitmap === 'function') {
      try { image = await createImageBitmap(file); } catch { /* Repli pour les navigateurs mobiles. */ }
    }
    if (!image) {
      url = URL.createObjectURL(file);
      image = await new Promise((resolve, reject) => {
        const photo = new Image();
        photo.onload = () => resolve(photo);
        photo.onerror = () => reject(new Error('Le format de cette photo ne peut pas être lu. Choisis une image JPG ou PNG.'));
        photo.src = url;
      });
    }
    const width = image.width || image.naturalWidth, height = image.height || image.naturalHeight;
    if (!width || !height) throw new Error('La photo semble vide. Essaie une autre prise de vue.');
    const scale = Math.min(1, 2400 / Math.max(width, height), Math.sqrt(4000000 / (width * height)));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    image?.close?.();
    if (url) URL.revokeObjectURL(url);
  }
}
