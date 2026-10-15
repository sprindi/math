'use strict';
(() => {
const $ = id => document.getElementById(id);
const data = window.MATH_CONTENT;
if (!data) { $('lesson-detail').append(document.createTextNode(' Le contenu interactif n’a pas pu se charger. Recharge la page.')); return; }
const el = (tag, text, cls) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; };
const button = (text, fn, cls) => { const b = el('button', text, cls); b.type = 'button'; b.addEventListener('click', fn); return b; };
let saved = {mastered:[], mistakes:[]}, persistent = true;
try { const raw = JSON.parse(localStorage.getItem('declic-v1')); if(raw && typeof raw === 'object') for(const k of ['mastered','mistakes']) if(Array.isArray(raw[k])) saved[k] = [...new Set(raw[k].filter(id => data.exercises.some(q => q.id === id)))]; } catch { persistent = false; }
let lessonId = data.lessons[0].id, queue = [], pos = 0, chosen = null, answered = false, revealed = false;
function progress() {
 $('progress').max = data.exercises.length; $('progress').value = saved.mastered.length;
 $('progress-text').textContent = `${saved.mastered.length} / ${data.exercises.length} réussis sans correction · ${saved.mistakes.length} à revoir${persistent ? '' : ' · sauvegarde indisponible'}`;
}
function save() { try { localStorage.setItem('declic-v1', JSON.stringify(saved)); } catch { persistent = false; } progress(); }
$('reset').addEventListener('click', () => { if(confirm('Effacer les réussites et les erreurs enregistrées sur cet appareil ?')) {saved = {mastered:[],mistakes:[]};save();} });
function view(name) {
 for(const tab of document.querySelectorAll('[data-view]')) tab.setAttribute('aria-pressed', String(tab.dataset.view === name));
 for(const mode of ['learn','practice','exam','resources']) $(`${mode}-view`).hidden = mode !== name;
}
for (const tab of document.querySelectorAll('[data-view]')) tab.addEventListener('click', () => {view(tab.dataset.view); if(tab.dataset.view === 'practice') resetQueue();});
function steps(items) { const list = el('ol'); items.forEach(s => list.append(el('li',s)));return list; }
function renderLesson(id) {
 lessonId=id; const l=data.lessons.find(l=>l.id===id); const area=$('lesson-detail');area.replaceChildren();
 for(const b of $('lesson-list').children) b.setAttribute('aria-current',String(b.dataset.id===id));
 area.append(el('span',`${l.minutes} min · L’idée avant la formule`,'pill'),el('h3',l.title),el('p',l.idea));
 const ul=el('ul',undefined,'rule-list'); l.rules.forEach(r=>ul.append(el('li',r)));area.append(ul);
 const example=el('div',undefined,'example');example.append(el('h4','Un exemple, pas à pas'),steps(l.example));area.append(example);
 const trap=el('aside',undefined,'notice');trap.append(el('strong','Le piège à éviter'),el('p',l.trap));area.append(trap);
 area.append(button('J’essaie les exercices →',()=>{$('topic').value=lessonId;view('practice');resetQueue();},'primary'));
}
data.lessons.forEach((l,i)=>{const b=button('',()=>renderLesson(l.id),'lesson-button');b.dataset.id=l.id;b.append(el('span',String(i+1).padStart(2,'0'),'number'),el('span',l.title));$('lesson-list').append(b);const o=el('option',l.title);o.value=l.id;$('topic').append(o);});
function resetQueue() {const value=$('topic').value;queue=data.exercises.filter(q=>value==='all'||(value==='mistakes'?saved.mistakes.includes(q.id):q.topic===value));pos=0;renderQuestion();}
$('topic').addEventListener('change',resetQueue);
function renderQuestion() {
 const a=$('exercise-area');a.replaceChildren();chosen=null;answered=false;revealed=false;
 if(!queue.length){a.append(el('h3','Rien à revoir pour le moment.'),el('p','Les questions ratées pendant l’entraînement apparaîtront ici.'),button('Tout le chapitre',()=>{$('topic').value='all';resetQueue();},'primary'));return;}
 if(pos>=queue.length){a.append(el('h3','Série terminée.'),el('p','Refais les erreurs sans regarder la correction. Une bonne réponse reconnue n’est pas encore une méthode maîtrisée.'),button('Recommencer cette série',resetQueue,'primary'));return;}
 const q=queue[pos]; a.append(el('span',`${pos+1} / ${queue.length} · ${['','Application','Méthode','Raisonnement'][q.level]}`,'pill'),el('h3',q.title),el('p',q.prompt));
 const options=el('div',undefined,'options');options.setAttribute('role','group');options.setAttribute('aria-label','Choisir une réponse');
 const check=button('Vérifier ma réponse',()=>grade(),'primary');check.disabled=true;
 q.options.forEach((text,i)=>{const b=button('',()=>{chosen=i;for(const c of options.children)c.setAttribute('aria-pressed',String(c===b));check.disabled=false;},'option');b.setAttribute('aria-pressed','false');b.append(el('span',String.fromCharCode(65+i),'number'),el('span',text));options.append(b);});a.append(options);
 const feedback=el('div');feedback.setAttribute('aria-live','polite');
 const hint=button('Un indice',()=>{feedback.replaceChildren(el('p',q.hint));});
 const show=button('Voir la méthode',()=>{if(!answered){revealed=true;saved.mastered=saved.mastered.filter(id=>id!==q.id);if(!saved.mistakes.includes(q.id))saved.mistakes.push(q.id);save();}finish(false);});
 const actions=el('div',undefined,'actions');actions.append(check,hint,show);a.append(actions,feedback);
 function finish(isCorrect) {
  answered=true;check.disabled=true;hint.disabled=true;show.disabled=true;
  [...options.children].forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');else if(i===chosen)b.classList.add('wrong');});
  feedback.className=`feedback${isCorrect?'':' error'}`;feedback.replaceChildren(el('h4',isCorrect?'Bien joué. Vérifie aussi ton raisonnement.':revealed?'Méthode consultée · à refaire sans aide.':'Pas encore. Voici comment raisonner.'),steps(q.steps));
  actions.append(button(pos+1===queue.length?'Terminer la série →':'Question suivante →',()=>{pos++;renderQuestion();},'primary'));
 }
 function grade(){if(answered||chosen===null)return;const ok=chosen===q.correct;
  if(ok&&!revealed){if(!saved.mastered.includes(q.id))saved.mastered.push(q.id);saved.mistakes=saved.mistakes.filter(id=>id!==q.id);}else{saved.mastered=saved.mastered.filter(id=>id!==q.id);if(!saved.mistakes.includes(q.id))saved.mistakes.push(q.id);}save();finish(ok);
 }
}
if(window.DeclicExam) window.DeclicExam.mount($('exam-area'));
function resources(){const r=window.MATH_RESOURCES,area=$('resource-list');if(!r){area.append(el('p','Les ressources n’ont pas pu se charger. Recharge la page.'));return;}
 for(const [key,title]of [['videos','Vidéos ciblées'],['papers','La fiche d’exercices']]){area.append(el('h3',title));const grid=el('div',undefined,'resources-grid');r[key].forEach(item=>{const card=el('article',undefined,'card resource');const lang=item.language ? (item.language.startsWith('Arabe')?'Arabe · termes français':'Français') : 'Ressource générale';card.append(el('span',lang,'pill'),el('h4',item.title));if(item.focus)card.append(el('p',item.focus));const provenance=el('details');provenance.append(el('summary','Source et limites'),el('p',item.note));card.append(provenance);const link=el('a',key==='videos'?'Ouvrir la vidéo ↗':'Ouvrir la ressource ↗');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);if(key==='papers'&&r.correction){const c=el('div',undefined,'example');c.append(el('strong',r.correction.title),el('p',r.correction.note));const pdf=el('a','Télécharger le corrigé PDF ↗');pdf.href=r.correction.url;pdf.target='_blank';pdf.rel='noopener noreferrer';const html=el('a','Lire le corrigé en ligne ↗');html.href=r.correction.html;html.target='_blank';html.rel='noopener noreferrer';c.append(pdf,el('br'),html);card.append(c);}grid.append(card);});area.append(grid);}const audit=el('details');audit.append(el('summary','Comment ces liens ont été vérifiés'),el('p',r.verificationNote));area.append(audit);
}
progress();renderLesson(lessonId);resources();
})();
