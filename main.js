/* ============================================================
   guizweb — données des réalisations + bascule d'univers
   ============================================================ */

// TODO: remplacer par le vrai lien Calendly de Guillaume
const CALENDLY_URL = 'https://calendly.com/';

const DEFAULT_THEME = {
  bg: '#07070d',
  accent: '#7b2cbf',
  accent2: '#00b4d8',
  text: '#f5f5f4',
  light: false,
  serif: false,
  ambiance: 'un univers par praticien',
};

// Couleurs extraites des vraies chartes graphiques de chaque site
const SITES = [
  {
    name: 'Agapè Médium',
    activity: 'Médium · contact défunts & lecture d’âme',
    url: 'https://agape-medium.fr/',
    theme: { bg: '#fbfaf6', accent: '#c9a24b', accent2: '#a37e2c', text: '#0b1530', light: true, serif: true, ambiance: 'doré · crème · sacré · lumineux' },
  },
  {
    name: 'Anandina',
    activity: 'Hypnose & soins énergétiques',
    url: 'https://anandina.fr/',
    theme: { bg: '#000000', accent: '#f3cd67', accent2: '#ffbc7d', text: '#f3cd67', light: false, serif: true, ambiance: 'nocturne · doré · mystique · précieux' },
  },
  {
    name: 'Semons la Vie',
    activity: 'Naturopathie & sophrologie',
    url: 'https://semons-la-vie.vercel.app/',
    theme: { bg: '#f7f5f2', accent: '#5b5eab', accent2: '#7aa476', text: '#382d2d', light: true, serif: false, ambiance: 'végétal · doux · sauge · organique' },
  },
  {
    name: 'Entre Ciel et Terre',
    activity: 'Médium & thérapeute énergétique',
    url: 'https://lucile-frichet-entre-ciel-et-terre.fr/',
    theme: { bg: '#f4f0ef', accent: '#d7a697', accent2: '#2f5468', text: '#2b2c2e', light: true, serif: true, ambiance: 'poudré · terracotta · apaisant · aérien' },
  },
  {
    name: 'La Plume Bleue',
    activity: 'Soins énergétiques & akashiques',
    url: 'https://la-plume-bleue.vercel.app/',
    theme: { bg: '#faf7f2', accent: '#0891b2', accent2: '#d4a574', text: '#0f2d4a', light: true, serif: true, ambiance: 'céleste · azur · plume · lumineux' },
  },
  {
    name: 'La Porte des Rêves',
    activity: 'Hypnose transpersonnelle',
    url: 'https://la-porte-des-reves.vercel.app/',
    theme: { bg: '#07060e', accent: '#c9a961', accent2: '#7b52b5', text: '#eeeaf5', light: false, serif: true, ambiance: 'nocturne · violet · doré · onirique' },
  },
  {
    name: 'La Maison VEDA',
    activity: 'Retraite yoga · Sri Lanka',
    url: 'https://2027-retraite.lamaisonveda.com/',
    theme: { bg: '#002d2c', accent: '#b99b64', accent2: '#b49174', text: '#f5f5f5', light: false, serif: true, ambiance: 'jungle · vert profond · or · sacré' },
  },
  {
    name: 'Given & Received',
    activity: 'Reiki & coaching de vie',
    url: 'https://guillaumelacroix1-hash.github.io/given-and-received/',
    theme: { bg: '#f5e8d4', accent: '#c18749', accent2: '#a56b2f', text: '#4a321f', light: true, serif: true, ambiance: 'sable · terracotta · chaleureux · solaire' },
  },
];

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
  root.setProperty('--font-display', t.serif ? "'Cormorant Garamond', serif" : "'Cabinet Grotesk', sans-serif");
  document.body.classList.toggle('light', !!t.light);

  const note = document.getElementById('foot-ambiance');
  if (note) note.textContent = t.ambiance;
}

/* ---------- rendu de la liste ---------- */

const list = document.getElementById('works-list');

SITES.forEach((site, i) => {
  const li = document.createElement('li');
  li.className = 'work';
  li.innerHTML = `
    <a class="work-link" href="${site.url}" target="_blank" rel="noopener">
      <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="work-name">${site.name}</span>
      <span class="work-activity">${site.activity}</span>
      <span class="work-arrow">↗</span>
    </a>`;

  const link = li.querySelector('.work-link');
  link.addEventListener('mouseenter', () => applyTheme(site.theme));
  link.addEventListener('focus', () => applyTheme(site.theme));
  list.appendChild(li);
});

list.addEventListener('mouseleave', () => applyTheme(DEFAULT_THEME));
list.addEventListener('focusout', (e) => {
  if (!list.contains(e.relatedTarget)) applyTheme(DEFAULT_THEME);
});

/* ---------- CTA + divers ---------- */

document.getElementById('cta-top').href = CALENDLY_URL;
document.getElementById('cta-bottom').href = CALENDLY_URL;
document.getElementById('year').textContent = new Date().getFullYear();
