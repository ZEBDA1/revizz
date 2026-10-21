/* Outils de révision extraits du texte vérifié : aucun fait extérieur n'est ajouté. */
const StudyTools = (() => {
  const plain = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const clean = value => String(value || '').replace(/\u0000/g, '').replace(/[ \t]+/g, ' ').trim();
  const sentences = text => clean(text.replace(/\n+/g, ' ')).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ÿ0-9«])/u).filter(s => s.length > 12);
  const shortHeading = line => {
    const value = clean(line).replace(/^#{1,6}\s+/, '');
    if (!value || value.length > 100 || /^[•–—*-]\s/.test(value) || /[=→↔]/.test(value) || /\b(?:est|sont|permet|utilise|désigne|transporte)\b/iu.test(value)) return false;
    return !/[.!?;,]$/.test(value) && (value.match(/\p{L}/gu) || []).length >= 3;
  };
  function sections(raw) {
    const lines = String(raw).replace(/\r\n?/g, '\n').split('\n');
    const result = [];
    let title = '', body = [], page = null;
    const flush = () => {
      let text = body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
      if (text) result.push({ title: title || `Notion ${result.length + 1}`, text, ...(page ? { page } : {}) });
      title = ''; body = [];
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\u0000/g, '').trim();
      const marker = line.match(/^Page\s+(\d+)\s*[—–-]/i);
      if (marker) { flush(); page = Number(marker[1]); continue; }
      if (!line) { if (body.length && body.at(-1) !== '') body.push(''); continue; }
      const next = lines.slice(i + 1).find(l => clean(l));
      const explicit = /^#{1,6}\s|^(?:[IVX]{1,5}|\d{1,2})[.)]\s/u.test(line) || (line === line.toUpperCase() && /\p{L}/u.test(line));
      const heading = shortHeading(line) && !!next && (explicit || (((!title && !body.length) || (!clean(lines[i - 1]) && body.length > 0)) && (clean(next).length > 35 || /[=→↔]/.test(next))));
      if (heading) { flush(); title = line.replace(/^#{1,6}\s+/, ''); continue; }
      const previous = body.at(-1);
      const structured = /^(?:[•–—*-]\s|\d+[.)]\s)|[=→↔]|\t|\|/.test(line);
      if (previous && !structured && !/[.!?:;]$/.test(previous) && !/^[•–—*-]\s|[=→↔]|\||\t/.test(previous)) body[body.length - 1] += ' ' + line;
      else body.push(line);
    }
    flush();
    return result.filter(s => s.text.length >= 15);
  }
  function metadata(text, filename = '') {
    const parsed = sections(text);
    const first = parsed[0]?.title;
    const fallback = filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
    const title = first && !/^Notion \d+$/.test(first) ? first : fallback || 'Mon nouveau cours';
    const value = plain(text);
    const subjects = [
      ['SVT', ['photosynthese', 'chloroplaste', 'cellulaire', 'mitochondrie', 'biodiversite', 'genetique']],
      ['Mathématiques', ['derivee', 'derivation', 'equation', 'fonction', 'theoreme', 'geometrie']],
      ['Histoire', ['guerre', 'revolution', 'empire', 'historique', 'urss', 'napoleon']],
      ['Physique-chimie', ['onde', 'celerite', 'frequence', 'mecanique', 'electrique', 'molecule', 'chimique']],
      ['Français', ['grammaire', 'poesie', 'metaphore', 'litterature', 'conjugaison']],
      ['Philosophie', ['philosophie', 'conscience', 'liberte', 'verite', 'justice']]
    ].map(([name, words]) => ({ name, score: words.filter(w => value.includes(w)).length })).sort((a, b) => b.score - a.score);
    const subject = subjects[0].score > 0 && subjects[0].score > subjects[1].score ? subjects[0].name : 'Autre';
    return { title: title.slice(0, 100), subject };
  }
  function cards(course) {
    const stop = new Set('permet permet de sont cette celles lequel laquelle plusieurs lorsque principalement toujours directement correspond explique utilise partir pendant devient produit produire notion existe ensuite autres chaque'.split(' '));
    const groups = course.sections.map((section, source) => {
      const result = [], sourceSentences = sentences(section.text);
      const add = (q, a, type) => { if (q.length < 500 && a.length <= 650 && a.length > 1) result.push({ q, a, type, source }); };
      for (const sentence of sourceSentences) {
        const location = sentence.match(/^(.{3,90}?)\s+(se déroule|a lieu|se situe)\s+(.+)$/iu);
        const definition = sentence.match(/^(.{3,80}?)\s+(?:est|sont|désigne|se définit comme|correspond à)\s+(.{8,})$/iu);
        if (location) add(`Où ${location[2]} ${location[1].charAt(0).toLowerCase() + location[1].slice(1)} ?`, sentence, 'lieu');
        else if (definition && !/[=→]/.test(sentence)) add(`Comment définir « ${definition[1]} » ?`, sentence, 'définition');
        const year = sentence.match(/\b(?:1\d{3}|20\d{2})\b/);
        if (year) add('Complète la date : ' + sentence.replace(year[0], '[…]'), year[0], 'date');
        if (/[=→↔]/.test(sentence)) add(`Quelle relation retenir pour « ${section.title} » ?`, sentence, 'formule');
      }
      const key = sourceSentences[0] || section.text;
      if (key.length <= 650 && !result.some(c => c.a === key)) add(`Que retenir de « ${section.title} » ?`, key, 'notion');
      for (const sentence of sourceSentences.slice(0, 3)) {
        if (sentence.length > 300 || /[=→↔]/.test(sentence)) continue;
        const word = (sentence.match(/[\p{L}’'-]{6,}/gu) || []).filter(w => !stop.has(plain(w))).sort((a, b) => b.length - a.length)[0];
        if (word) add('Complète : ' + sentence.replace(word, '[…]'), word, 'texte à trous');
      }
      if (!result.length) add(`Quelles sont les idées de « ${section.title} » ?`, section.text.slice(0, 650), 'notion');
      return result;
    });
    const result = [], seen = new Set();
    for (let round = 0; round < Math.max(0, ...groups.map(g => g.length)); round++) {
      for (const group of groups) {
        const card = group[round]; if (!card) continue;
        const key = plain(card.q + '|' + card.a);
        if (!seen.has(key)) { result.push(card); seen.add(key); }
      }
    }
    return result.slice(0, 60);
  }
  function quiz(course, generatedCards = course.cards || cards(course)) {
    const questions = [], used = new Set();
    for (const card of generatedCards) {
      if (used.has(card.q) || card.a.length > 400) continue;
      const candidates = generatedCards.filter(other => plain(other.a) !== plain(card.a));
      candidates.sort((a, b) => Number(b.type === card.type) - Number(a.type === card.type));
      const alternatives = [...new Set(candidates.map(c => c.a))].filter(a => a.length < 300).slice(0, 3);
      if (!alternatives.length) continue;
      const options = [...alternatives];
      const correctIndex = questions.length % (options.length + 1);
      options.splice(correctIndex, 0, card.a);
      questions.push({ q: card.q, options, correct: [correctIndex], explanation: card.a, source: card.source });
      used.add(card.q);
      if (questions.length >= 12) break;
    }
    if (!questions.length && course.sections.length) {
      const section = course.sections[0], answer = sentences(section.text)[0] || section.text;
      questions.push({ q: `Le passage « ${section.title} » contient-il cet énoncé : « ${answer} » ?`, options: ['Oui, cet énoncé est présent.', 'Non, cet énoncé est absent.'], correct: [0], explanation: answer, source: 0 });
    }
    if (course.sections.length > 1) {
      for (let i = 0; i < course.sections.length; i++) {
        const right = sentences(course.sections[i].text).filter(s => s.length < 220).slice(0, 2);
        const wrong = course.sections.filter((_, j) => j !== i).flatMap(s => sentences(s.text)).filter(s => s.length < 220 && !right.includes(s)).slice(0, 2);
        if (right.length === 2 && wrong.length) {
          const options = [right[0], wrong[0], right[1], ...wrong.slice(1)];
          questions.unshift({ q: `Quels énoncés figurent dans le passage « ${course.sections[i].title} » ?`, options, correct: [0, 2], explanation: right.join(' '), source: i });
          break;
        }
      }
    }
    return questions;
  }
  function summaryText(course, format, index) {
    const edited = course.notes?.[format]?.[index];
    if (edited != null) return edited;
    const generated = course.generated?.summaries?.[format]?.[index];
    if (generated != null) return generated;
    const text = course.sections[index]?.text || '';
    if (format === 'complete') return text;
    const list = sentences(text);
    if (format === 'last') return list.find(s => /[=→↔]|\b(?:1\d{3}|20\d{2})\b/.test(s)) || list[0] || text;
    return list.slice(0, 2).join(' ') || text;
  }
  function pack(course) {
    const generatedCards = cards(course), generatedQuiz = quiz(course, generatedCards);
    const summaries = Object.fromEntries(['express', 'complete', 'last'].map(format => [format, course.sections.map((_, i) => summaryText(course, format, i))]));
    const written = generatedCards.filter(c => c.type !== 'texte à trous' && c.type !== 'date').slice(0, 4).map(c => ({ q: c.q, answer: c.a, explanation: c.a, source: c.source, written: true }));
    return { cards: generatedCards, quiz: generatedQuiz, generated: { version: 2, summaries, assessment: written, at: new Date().toISOString() } };
  }
  return { sections, metadata, cards, quiz, pack, summaryText };
})();
