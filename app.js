(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = CONFIG, RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SIDE = location.hash.slice(1) === 'bride' ? 'bride' : 'default';
let lang = localStorage.getItem('lang') || 'en';
try { lang = localStorage.getItem('lang') || 'en'; } catch (e) {}
const T = () => I18N[lang];
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function letters(txt, base = 0) { // letter by letter (English) / word by word (Punjabi)
  const parts = lang === 'pa' ? txt.split(' ') : [...txt];
  return '<span class="w">' + parts.map((p, i) => p === ' ' ? ' ' : `<span class="l" style="--i:${base + i}">${esc(p)}</span>`).join(lang === 'pa' ? ' ' : '') + '</span>';
}
const names = () => { const n = C.couple[lang]; return letters(n[0]) + `<span class="amp">&amp;</span>` + letters(n[1], n[0].length + 3); };
const fmtDate = id => T().dates[id];

function render() {
  const t = T();
  document.documentElement.lang = lang === 'pa' ? 'pa' : 'en'; document.body.classList.toggle('pa', lang === 'pa');
  $$('[data-i18n]').forEach(e => e.textContent = t[e.dataset.i18n]);
  $$('[data-lang-toggle]').forEach(e => e.textContent = t.lang);
  $('#mus').setAttribute('aria-label', t.sound);
  ['gNames', 'hNames', 'eNames'].forEach(id => { const el = $('#' + id); if (el) el.innerHTML = names(); });
  ['gDate', 'hDate', 'eDate'].forEach(id => { const el = $('#' + id); if (el) el.textContent = fmtDate('anand'); });
  $$('.names').forEach(n => n.classList.remove('in')); requestAnimationFrame(() => $$('.names').forEach(n => { if (n.id === 'gNames' || (n.id !== 'hNames' && visible(n)) || (n.id === 'hNames' && document.body.classList.contains('go'))) n.classList.add('in'); }));
  const c = C.card;
  $('#verse').innerHTML = c.verse.map(esc).join('<br>');
  $('#quote').innerHTML = c.quote.map(esc).join('<br>');
  const L = (a, cls = 'cs') => a.map(x => `<p class="${cls}">${esc(x)}</p>`).join('');
  const sch = (i, j) => C.events[1].schedule.slice(i, j).map(s => `<p class="cs">${s[0].toUpperCase()} ........ ${s[1]}</p>`).join('');
  const nm = a => `<p class="cn big2">${letters(a[0])}</p><p class="cs">${esc(a[1])}</p>`;
  $('#cardBody').innerHTML = `<img class="mono" src="${C.assets.monogram}" alt="" loading="lazy">` + `<p class="cn">${esc(c.host[0])}</p><p class="cn" style="font-size:22px">${esc(c.host[1])}</p>` +
    `<div class="div in"><b></b></div>` + `<p class="cs">${esc(c.p1[0])}</p><p class="cs b">${esc(c.p1[1])}</p><p class="cs">${esc(c.p1[2])}</p>` + nm(c.bride) + `<p class="cs b">WITH</p>` + nm(c.groom) +
    `<p class="cn" style="font-size:24px;margin-top:18px">On Friday, 22nd January, 2027</p><p class="cs">6:30 PM ONWARDS</p><p class="cs">FOLLOWED BY COCKTAIL &amp; DINNER</p><p class="cs">VENUE:</p><p class="cs b">${esc(C.events[0].venue)}</p><p class="cs">EMAAR MOHALI HILLS, SECTOR-109, MOHALI (PB.)</p>` +
    `<div class="div in"><b></b></div>` +
    `<p class="cn" style="font-size:24px;margin-top:18px">On Sunday, 24th January, 2027</p>` + sch(0, 2) +
    `<p class="cs">AT</p><p class="cs b">${esc(C.events[1].venue)}</p><p class="cs">PHASE - 5, MOHALI (PB.)</p>` +`<div class="div in"><b></b></div>` + sch(2, 4) + `<p class="cs">VENUE:</p><p class="cs b">${esc(C.events[1].lunch.venue)}</p><p class="cs">LANDRAN - BANUR ROAD</p><p class="cs">NEAR IT CHOWK, MOHALI (PB.)</p>`;
  $$('.cn', $('#cardBody')).forEach(e => e.innerHTML.includes('<span') || (e.dataset.plain = 1));
  $('#events').innerHTML = C.events.map((e, i) => `<article class="ev" data-i="${i}"><h4>${t[e.id]}</h4><p class="t">${fmtDate(e.id)} · ${t.times[e.id]}</p>
    <p class="v">${esc(e.venue)}</p><p>${esc(e.addr)}</p>
    ${e.note ? `<p>${t.note}</p>` : ''}
    ${e.schedule ? `<ul>${t.sched.map(s => `<li><span>${s[0]}</span><span>${s[1]}</span></li>`).join('')}</ul><p>${t.lunch} <b>${esc(e.lunch.venue)}</b>, ${esc(e.lunch.addr)}</p>` : ''}
    ${e.etiquette ? `<p class="et">${t.etiq}</p>` : ''}
    <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.map)}">${t.dir}</a>
    <a class="btn" target="_blank" rel="noopener" href="${gcal(e)}">${t.cal} · ${t.g}</a><button class="btn" data-ics="${i}">${t.cal} · ${t.icsl}</button>
    ${e.film && hasVideo ? `<button class="btn" id="filmBtn">${t.film}</button>` : ''}</article>`).join('');
  $$('[data-ics]').forEach(b => b.onclick = () => ics(C.events[b.dataset.ics]));
  const fb = $('#filmBtn'); if (fb) fb.onclick = () => { $('#vid').src = C.assets.video; $('#vm').hidden = false; $('#vid').play(); pauseMusic(true); };
  $('#grid').innerHTML = C.gallery.map((g, i) => g.src ? `<button class="ph" data-i="${i}"><img loading="lazy" src="${g.src}" alt=""></button>` : `<button class="ph t${i % 3 + 1}" data-i="${i}">${t.soon}</button>`).join('');
  $$('.ph').forEach(p => p.onclick = () => lb(+p.dataset.i));
  $('#rsvp').innerHTML = C.rsvp.names.map(n => `<p>${n}</p>`).join('') + `<p>M : ${C.rsvp.phones.map(p => `<a href="tel:+91${p}">${p}</a>`).join(', ')}</p>`;
  $('#comp').innerHTML = C.card.compliments.map(esc).join('<br>');
  const url = shareUrl(); $('#bWa').href = 'https://wa.me/?text=' + encodeURIComponent(t.shareMsg + '\n' + url);
  observe(); tick();
}
const visible = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
const shareUrl = () => (C.siteUrl || location.href.split('#')[0]) + (SIDE === 'bride' ? '#bride' : '');

/* calendar */
const stamp = (d, t) => d.replace(/-/g, '') + 'T' + t.replace(':', '') + '00';
function gcal(e) { const q = new URLSearchParams({ action: 'TEMPLATE', text: `${C.couple.en.join(' & ')} · ${I18N.en[e.id]}`, dates: `${stamp(e.date, e.time)}/${stamp(e.date, e.end)}`, ctz: 'Asia/Kolkata', location: `${e.venue}, ${e.addr}` }); return 'https://calendar.google.com/calendar/render?' + q; }
function ics(e) {
  const s = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation//EN', 'BEGIN:VEVENT', 'UID:' + e.id + '@invitation', 'DTSTAMP:20261001T000000Z', `DTSTART;TZID=Asia/Kolkata:${stamp(e.date, e.time)}`, `DTEND;TZID=Asia/Kolkata:${stamp(e.date, e.end)}`,
    `SUMMARY:${C.couple.en.join(' & ')} - ${I18N.en[e.id]}`, `LOCATION:${e.venue}\\, ${e.addr}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([s], { type: 'text/calendar' })); a.download = e.id + '.ics'; a.click();
}

/* reveal + thread + mandala */
let io;
function observe() {
  io && io.disconnect(); io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { if (x.target.id === 'hNames' && !document.body.classList.contains('go')) return; x.target.classList.add('in'); if (x.target.matches('.names,.cn')) x.target.classList.add('in'); } }), { threshold: .2 });
  $$('.rv,.ev,.boxes,.names,.cn,.div').forEach(e => io.observe(e));
  $$('.rv').forEach((e, i) => e.style.setProperty('--d', (i % 3) * .12 + 's'));
}

/* countdown */
const target = new Date(C.ceremony.start), until = new Date(C.ceremony.nowUntil);
function tick() {
  const n = new Date(), box = $('#cdBoxes'), msg = $('#cdMsg'), t = T();
  if (n >= until) { box.hidden = true; msg.textContent = t.done; return; }
  if (n >= target) { box.hidden = true; msg.textContent = t.now; return; }
  box.hidden = false; msg.textContent = '';
  let d = Math.floor((target - n) / 1000); const v = [Math.floor(d / 86400), Math.floor(d % 86400 / 3600), Math.floor(d % 3600 / 60), d % 60], k = ['d', 'h', 'm', 's'];
  if (!box.children.length || box.dataset.l !== lang) { box.dataset.l = lang; box.innerHTML = k.map((x, i) => `<div class="box" style="--i:${i}"><b></b><small>${t[x]}</small></div>`).join(''); observe(); }
  $$('.box b', box).forEach((b, i) => b.textContent = String(v[i]).padStart(2, '0'));
}
setInterval(tick, 1000);

/* gallery lightbox */
let li = 0;
function lb(i) { li = (i + C.gallery.length) % C.gallery.length; const g = C.gallery[li]; $('#lbc').innerHTML = g.src ? `<img src="${g.src}" alt="">` : `<div class="ph t3" style="color:#fff;border-color:#C5A46D;background:none">${T().soon}</div>`; $('#lb').hidden = false; }
$('#lb .x').onclick = () => $('#lb').hidden = true; $('#lb .pv').onclick = () => lb(li - 1); $('#lb .nx').onclick = () => lb(li + 1);
addEventListener('keydown', e => { if ($('#lb').hidden) { if (e.key === 'Escape') closeVid(); return; } if (e.key === 'ArrowLeft') lb(li - 1); if (e.key === 'ArrowRight') lb(li + 1); if (e.key === 'Escape') $('#lb').hidden = true; });
let sx = 0; $('#lb').addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
$('#lb').addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) lb(li + (d < 0 ? 1 : -1)); });

/* audio + video */
let hasVideo = false;
const audio = new Audio(C.assets.song); audio.loop = true; audio.volume = .5; let wanted = false, vidOpen = false;
audio.addEventListener('error', () => $('#mus').hidden = true);
fetch(C.assets.video, { method: 'HEAD' }).then(r => { hasVideo = r.ok; if (hasVideo) render(); }).catch(() => {});
const setMus = () => $('#mus').textContent = wanted ? '❚❚' : '♪';
function pauseMusic(v) { if (v) { audio.pause(); vidOpen = true; } }
function closeVid() { $('#vm').hidden = true; $('#vid').pause(); vidOpen = false; if (wanted) audio.play().catch(() => {}); }
$('#vm .x').onclick = closeVid;
$('#mus').onclick = () => { wanted = !wanted; wanted ? audio.play().catch(() => {}) : audio.pause(); setMus(); };
document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); else if (wanted && !vidOpen) audio.play().catch(() => {}); });

/* gate */
$('#openBtn').onclick = () => {
  const g = $('#gate'); g.classList.add('open'); document.body.classList.add('go');
  audio.play().then(() => { wanted = true; setMus(); }).catch(() => {}); $('#mus').hidden = false;
  if (!RM) petals.burst();
  setTimeout(() => { g.remove(); document.body.classList.remove('locked'); $$('#hero .names').forEach(n => n.classList.add('in')); }, RM ? 50 : 2200);
};
$$('[data-lang-toggle]').forEach(b => b.onclick = () => { lang = lang === 'en' ? 'pa' : 'en'; try { localStorage.setItem('lang', lang); } catch (e) {} render(); });

/* share */
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2000); };
$('#bShare').onclick = () => navigator.share ? navigator.share({ title: document.title, text: T().shareMsg, url: shareUrl() }).catch(() => {}) : $('#bWa').click();
$('#bCopy').onclick = () => (navigator.clipboard ? navigator.clipboard.writeText(shareUrl()) : Promise.reject()).then(() => toast(T().copied)).catch(() => prompt('', shareUrl()));

/* scroll effects */
let sy = scrollY, vel = 0;
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight; vel += scrollY - sy; sy = scrollY;
  const tl = $('.tl'); if (tl) { const r = tl.getBoundingClientRect(); $('#fill').style.height = Math.max(0, Math.min(r.height, innerHeight * .6 - r.top)) + 'px'; }
  if (!RM) $$('.mandala').forEach(m => m.style.setProperty('--rot', (scrollY * .03) + 'deg'));
}, { passive: true });

/* petals: one canvas, flower follows section, 3 depth layers */
const FL = { hero: ['#F1D9D7', '#E8BFC0', '#FFFDF6'], bless: ['#E9BE6E', '#EFCB85', '#E2AE55'], inv: ['#FFFDF6', '#F1D9D7', '#F6E7E2'], cd: ['#F6DDE6', '#EBC4D3', '#FFF5F8'], fn: ['#A9BC9C', '#C2D1B5', '#E9BE6E'], gal: ['#D7A0BB', '#E2B5CB', '#C98AA9'], end: ['#F1D9D7', '#E8BFC0', '#C5A46D'] };
const petals = (() => {
  const cv = $('#petals'), cx = cv.getContext('2d'); let W, H, P = [], cur = 'hero', run = !RM;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; size(); addEventListener('resize', size);
  const mk = (top = false) => { const z = Math.random() < .4 ? 0 : Math.random() < .6 ? 1 : 2, f = FL[cur]; return { x: Math.random() * W, y: top ? -20 : Math.random() * H, z, s: [4, 7, 12][z] * (.7 + Math.random() * .6), vy: [.3, .7, 1.3][z] * (.7 + Math.random() * .6), ph: Math.random() * 6.28, fs: .01 + Math.random() * .02, r: Math.random() * 6.28, c: f[Math.random() * f.length | 0], a: [.45, .7, .9][z], g: cur === 'end' && Math.random() < .4, leaf: cur === 'fn' && Math.random() < .5 }; };
  const sec = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) cur = e.target.dataset.flower; }), { threshold: .5 });
  $$('[data-flower]').forEach(s => sec.observe(s));
  function frame() {
    if (!run) return; cx.clearRect(0, 0, W, H); const v = Math.max(-40, Math.min(40, vel)); vel *= .9;
    while (P.length < (W < 600 ? 28 : 55)) P.push(mk());
    P = P.filter(p => { p.ph += p.fs * 6; p.y += p.vy - v * [.05, .12, .25][p.z]; p.x += Math.sin(p.ph) * .5 + v * [.04, .1, .2][p.z] * .3; p.r += .01;
      if (p.y > H + 20 || p.y < -60) return false; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(1, Math.cos(p.ph)); cx.globalAlpha = p.a; if (p.z === 0) cx.filter = 'blur(1px)';
      cx.fillStyle = p.g ? '#C5A46D' : p.leaf ? '#B5C6A8' : p.c; cx.beginPath(); p.g ? cx.rect(-p.s / 3, -p.s / 3, p.s / 1.5, p.s / 1.5) : cx.ellipse(0, 0, p.s * .6, p.s, 0, 0, 6.28); cx.fill(); cx.restore(); return true; });
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { run = !RM && !document.hidden; if (run) requestAnimationFrame(frame); });
  if (!RM) requestAnimationFrame(frame);
  return { burst() { for (let i = 0; i < 70; i++) P.push(mk(true)), P[P.length - 1].y = -Math.random() * H * .8; } };
})();

/* scratch card */
(() => {
  const cv = $('#sc'), cx = cv.getContext('2d'), box = $('#scratch'), dpr = devicePixelRatio || 1; let done = false, drawing = false;
  const w = cv.width = Math.round(cv.clientWidth * dpr), h = cv.height = Math.round(cv.clientHeight * dpr);
  const g = cx.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#F8F4EB'); g.addColorStop(.5, '#EEE8DC'); g.addColorStop(1, '#F8F4EB'); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
  cx.strokeStyle = 'rgba(125,141,114,.16)'; for (let x = -h; x < w; x += 14 * dpr) { cx.beginPath(); cx.moveTo(x, h); cx.lineTo(x + h, 0); cx.stroke(); }
  const reveal = () => { if (done) return; done = true; cv.style.opacity = 0; cv.style.pointerEvents = 'none'; box.classList.add('started'); if (!RM) petals.burst(); };
  const scratch = e => { if (done) return; const r = cv.getBoundingClientRect(); cx.globalCompositeOperation = 'destination-out'; cx.beginPath(); cx.arc((e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr, 34 * dpr, 0, 6.3); cx.fill(); box.classList.add('started'); };
  const check = () => { const d = cx.getImageData(0, 0, w, h).data; let c = 0, t = 0; for (let i = 3; i < d.length; i += 64) { t++; if (!d[i]) c++; } if (c / t > .5) reveal(); };
  cv.addEventListener('pointerdown', e => { drawing = true; cv.setPointerCapture(e.pointerId); scratch(e); });
  cv.addEventListener('pointermove', e => { if (drawing) scratch(e); });
  const up = () => { if (drawing) { drawing = false; check(); } }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
})();

render();
if (location.hash === '#bride') document.title = C.couple.en.join(' & ') + ' · Wedding Invitation';
addEventListener('hashchange', () => { if (location.hash === '#bride' || location.hash === '') location.reload(); });
})();
