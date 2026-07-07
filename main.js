/* ============================================================
   guizweb — carousel 3D + bascule d'univers par réalisation
   ============================================================ */

// Couleurs ET polices extraites des vraies chartes graphiques de
// chaque site (la police de titres de l'univers = celle du site,
// ou son équivalent Google Fonts le plus proche)
const SITES = [
  {
    id: 'agape',
    name: 'Agapè Médium',
    activity: 'Médium · contact défunts & lecture d’âme',
    url: 'https://agape-medium.fr/',
    logo: 'assets/logos/agape.png',
    theme: { bg: '#fbfaf6', accent: '#c9a24b', accent2: '#a37e2c', text: '#0b1530', light: true, font: "'Cormorant Garamond', serif", ambiance: 'doré · crème · sacré · lumineux' },
  },
  {
    id: 'anandina',
    name: 'Anandina',
    activity: 'Hypnose & soins énergétiques',
    url: 'https://anandina.fr/',
    logo: 'assets/logos/anandina.svg',
    // le site utilise Adobe Caslon Pro (Typekit) → Libre Caslon en équivalent
    theme: { bg: '#000000', accent: '#f3cd67', accent2: '#ffbc7d', text: '#f3cd67', light: false, font: "'Libre Caslon Display', serif", ambiance: 'nocturne · doré · mystique · précieux' },
  },
  {
    id: 'semons-la-vie',
    name: 'Semons la Vie',
    activity: 'Naturopathie & sophrologie',
    url: 'https://semons-la-vie.vercel.app/',
    logo: 'assets/logos/semons-la-vie.svg',
    // titres « Arches » → Playfair Display (fallback officiel de leur CSS)
    theme: { bg: '#f7f5f2', accent: '#5b5eab', accent2: '#7aa476', text: '#382d2d', light: true, font: "'Playfair Display', serif", ambiance: 'végétal · doux · sauge · organique' },
  },
  {
    id: 'entre-ciel-et-terre',
    name: 'Entre Ciel et Terre',
    activity: 'Médium & thérapeute énergétique',
    url: 'https://lucile-frichet-entre-ciel-et-terre.fr/',
    logo: 'assets/logos/entre-ciel-et-terre.svg',
    theme: { bg: '#f4f0ef', accent: '#d7a697', accent2: '#2f5468', text: '#2b2c2e', light: true, font: "'Playfair Display', serif", ambiance: 'poudré · terracotta · apaisant · aérien' },
  },
  {
    id: 'plume-bleue',
    name: 'La Plume Bleue',
    activity: 'Soins énergétiques & akashiques',
    url: 'https://la-plume-bleue.vercel.app/',
    logo: 'assets/logos/plume-bleue.png',
    theme: { bg: '#faf7f2', accent: '#0891b2', accent2: '#d4a574', text: '#0f2d4a', light: true, font: "'Fraunces', serif", ambiance: 'céleste · azur · plume · lumineux' },
  },
  {
    id: 'porte-des-reves',
    name: 'La Porte des Rêves',
    activity: 'Hypnose transpersonnelle',
    url: 'https://la-porte-des-reves.vercel.app/',
    logo: 'assets/logos/porte-des-reves.svg',
    theme: { bg: '#07060e', accent: '#c9a961', accent2: '#7b52b5', text: '#eeeaf5', light: false, font: "'Cormorant Garamond', serif", ambiance: 'nocturne · violet · doré · onirique' },
  },
  {
    id: 'maison-veda',
    name: 'La Maison VEDA',
    activity: 'Retraite yoga · Sri Lanka',
    url: 'https://2027-retraite.lamaisonveda.com/',
    logo: 'assets/logos/maison-veda.svg',
    theme: { bg: '#002d2c', accent: '#b99b64', accent2: '#b49174', text: '#f5f5f5', light: false, font: "'Playfair Display', serif", ambiance: 'jungle · vert profond · or · sacré' },
  },
  {
    id: 'given-received',
    name: 'Given & Received',
    activity: 'Reiki & coaching de vie',
    url: 'https://guillaumelacroix1-hash.github.io/given-and-received/',
    logo: 'assets/logos/given-received.png',
    theme: { bg: '#f5e8d4', accent: '#c18749', accent2: '#a56b2f', text: '#4a321f', light: true, font: "'Cormorant Garamond', serif", ambiance: 'sable · terracotta · chaleureux · solaire' },
  },
];

const N = SITES.length;

/* ---------- helpers ---------- */

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function applyTheme(t) {
  const root = document.documentElement.style;
  root.setProperty('--bg', t.bg);
  root.setProperty('--accent', t.accent);
  root.setProperty('--accent-2', t.accent2);
  root.setProperty('--text', t.text);
  root.setProperty('--text-soft', hexToRgba(t.text, 0.72));
  root.setProperty('--text-muted', hexToRgba(t.text, 0.5));
  root.setProperty('--border', hexToRgba(t.text, t.light ? 0.14 : 0.1));
  const font = t.font || "'Cabinet Grotesk', sans-serif";
  root.setProperty('--font-display', font);
  // les serifs Google chargées en 500/600, Cabinet Grotesk en 800
  root.setProperty('--display-weight', font.includes('Cabinet') ? '800' : '600');
  document.body.classList.toggle('light', !!t.light);

  const note = document.getElementById('foot-ambiance');
  if (note) note.textContent = t.ambiance;
}

/* ---------- rendu des cards ---------- */

const scene = document.getElementById('scene');
const stage = document.getElementById('stage');

const cards = SITES.map((site, i) => {
  const a = document.createElement('a');
  a.className = 'work-card';
  a.href = site.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.draggable = false;
  a.style.setProperty('--card-bg', site.theme.bg);
  a.innerHTML = `
    <span class="work-visual">
      <img class="work-shot" src="assets/shots/${site.id}.jpg" alt="Aperçu du site ${site.name}" draggable="false">
      <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
    </span>
    <span class="work-meta">
      <span class="work-logo"><img src="${site.logo}" alt="" draggable="false"></span>
      <span class="work-text">
        <span class="work-name">${site.name}</span>
        <span class="work-activity">${site.activity}</span>
      </span>
      <span class="work-arrow">↗</span>
    </span>`;
  scene.appendChild(a);
  return a;
});

/* ---------- carousel 3D ---------- */

let current = 0;

// offset le plus court en boucle : -N/2 .. +N/2
function wrapOffset(i) {
  return ((i - current + N + N / 2) % N) - N / 2;
}

function layout() {
  cards.forEach((el, i) => {
    const off = wrapOffset(i);
    const abs = Math.abs(off);
    const sign = Math.sign(off);
    const visible = abs <= 3.5;
    // coverflow : toutes les cards latérales à la même profondeur et au
    // même angle ; le pas horizontal est corrigé de la projection
    // perspective pour des écarts réguliers à l'écran (mesurés)
    const x = sign * (84 + (abs - 1) * 101 + Math.max(0, abs - 2) * 18);
    const scale = i === current ? 1.16 : 1;
    el.style.transform = i === current
      ? `translate(-50%, -50%) scale(${scale})`
      : `translate(calc(-50% + ${x}%), -50%)` +
        ` rotateY(${sign * -35}deg)` +
        ` translateZ(-260px)`;
    el.style.zIndex = String(100 - Math.round(abs * 10));
    el.style.opacity = visible ? String(1 - abs * 0.08) : '0';
    el.style.pointerEvents = visible ? 'auto' : 'none';
    el.classList.toggle('is-active', i === current);
    el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    el.tabIndex = i === current ? 0 : -1;
  });

  applyTheme(SITES[current].theme);
  document.getElementById('nav-counter').textContent =
    `${String(current + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
}

function go(delta) {
  current = (current + delta + N) % N;
  layout();
}

/* clic : card centrée = ouvrir le site, card latérale = la centrer
   (et donc changer l'univers) */
cards.forEach((el, i) => {
  // empêche le focus au clic — sinon le navigateur scrolle la page
  // (overflow caché) pour amener le lien en vue et décale tout le layout
  el.addEventListener('pointerdown', (e) => e.preventDefault());
  el.addEventListener('click', (e) => {
    if (suppressClick) { e.preventDefault(); return; }
    if (i !== current) {
      e.preventDefault();
      current = i;
      layout();
    }
  });
});

/* filet de sécurité : si un scroll parasite décale quand même la page
   (focus clavier, ancre…), on le neutralise immédiatement.
   Exception : l'intérieur du modal a le droit de scroller. */
document.addEventListener('scroll', (e) => {
  const el = e.target === document ? document.documentElement : e.target;
  if (el.closest && el.closest('.modal')) return;
  if (el.scrollLeft) el.scrollLeft = 0;
  if (el.scrollTop) el.scrollTop = 0;
}, { capture: true, passive: true });

/* flèches */
document.getElementById('nav-prev').addEventListener('click', () => go(-1));
document.getElementById('nav-next').addEventListener('click', () => go(1));

/* clavier */
addEventListener('keydown', (e) => {
  if (modalOpen) { if (e.key === 'Escape') closeModal(); return; }
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowRight') go(1);
});

/* molette / trackpad (throttle) */
let wheelLock = 0;
addEventListener('wheel', (e) => {
  if (modalOpen) return;
  const now = Date.now();
  if (now - wheelLock < 450) return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(d) < 12) return;
  wheelLock = now;
  go(d > 0 ? 1 : -1);
}, { passive: true });

/* drag / swipe */
let dragStartX = null;
let suppressClick = false;

stage.addEventListener('pointerdown', (e) => {
  dragStartX = e.clientX;
  suppressClick = false;
});

addEventListener('pointermove', (e) => {
  if (dragStartX === null) return;
  const dx = e.clientX - dragStartX;
  if (Math.abs(dx) > 55) {
    suppressClick = true;
    dragStartX = e.clientX;
    go(dx < 0 ? 1 : -1);
  }
});

addEventListener('pointerup', () => {
  dragStartX = null;
  setTimeout(() => { suppressClick = false; }, 50);
});

/* ---------- tilt 3D suivant la souris ---------- */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

if (!reduceMotion) {
  addEventListener('mousemove', (e) => {
    const nx = (e.clientX / innerWidth) * 2 - 1;   // -1 .. 1
    const ny = (e.clientY / innerHeight) * 2 - 1;
    targetRY = nx * 7;
    targetRX = ny * -5;
  });

  (function tick() {
    curRX += (targetRX - curRX) * 0.06;
    curRY += (targetRY - curRY) * 0.06;
    scene.style.transform = `rotateX(${curRX.toFixed(3)}deg) rotateY(${curRY.toFixed(3)}deg)`;
    requestAnimationFrame(tick);
  })();
}

/* ---------- modal contact (Resend via /api/contact) ---------- */

const modal = document.getElementById('modal');
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
let modalOpen = false;

function openModal() {
  modal.hidden = false;
  modalOpen = true;
  requestAnimationFrame(() => modal.classList.add('open'));
  form.querySelector('input[name="name"]').focus({ preventScroll: true });
}

function closeModal() {
  modal.classList.remove('open');
  modalOpen = false;
  setTimeout(() => { modal.hidden = true; }, 300);
}

document.getElementById('cta-open').addEventListener('click', openModal);
modal.querySelectorAll('[data-close]').forEach((el) =>
  el.addEventListener('click', closeModal));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const send = document.getElementById('form-send');
  send.disabled = true;
  formStatus.classList.remove('error');
  formStatus.textContent = 'Envoi en cours…';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!res.ok) throw new Error(String(res.status));
    form.hidden = true;
    formStatus.textContent = '';
    document.getElementById('modal-success').hidden = false;
  } catch {
    formStatus.classList.add('error');
    formStatus.innerHTML =
      'Oups, l’envoi a échoué. Écrivez-moi directement : ' +
      '<a href="mailto:guillaumelacroix1@gmail.com" style="color:inherit">guillaumelacroix1@gmail.com</a>';
    send.disabled = false;
  }
});

/* ---------- init ---------- */

document.getElementById('year').textContent = new Date().getFullYear();
layout();
