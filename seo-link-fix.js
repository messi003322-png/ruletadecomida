const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
const EXTERNAL = 'https://www.aesan.gob.es/nutricion';

if (!fs.existsSync(OUT)) throw new Error('dist not found');

// Keep footer links short and avoid repeating the same anchor labels used by
// the main navigation. This addresses duplicate/overly-long internal anchors.
const links = [
  ['Guía de cenas', '/que-cenar-hoy/'],
  ['Ideas rápidas', '/cena-rapida/'],
  ['Comida económica', '/comida-barata/'],
  ['Cena para uno', '/cena-para-una-persona/'],
  ['Guía pizza', '/pizza/'],
  ['Guía sushi', '/sushi/'],
  ['Guía paella', '/paella/'],
  ['Guía tapas', '/tapas/'],
  ['Comer en Madrid', '/madrid/'],
  ['Comer en Barcelona', '/barcelona/'],
  ['Comer en Valencia', '/valencia/']
];

function esc(value) {
  return String(value).replace(/[&<>\"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
  }[c]));
}

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else if (entry.name.toLowerCase().endsWith('.html')) callback(full);
  }
}

function footerHtml() {
  const internal = links.map(([label, href]) =>
    `<a href="${SITE}${href}">${esc(label)}</a>`
  ).join('');
  const external = `<a href="${EXTERNAL}" target="_blank" rel="noopener noreferrer">Nutrición — AESAN</a>`;

  return `<footer class="rf-final-footer"><div class="rf-footer-inner">` +
    `<div class="rf-footer-brand"><strong>Ruleta de Comida</strong>` +
    `<p>Decide qué comer o cenar en segundos. 20 comidas · 79 ciudades.</p></div>` +
    `<nav class="rf-footer-links" aria-label="Guías y recursos de comida">` +
    `<div class="rf-footer-grid">${internal}${external}</div></nav>` +
    `<p class="rf-footer-copy">© 2026 Ruleta de Comida</p>` +
    `</div></footer>`;
}

walk(OUT, file => {
  let html = fs.readFileSync(file, 'utf8');
  const next = html.replace(/<footer\b[\s\S]*?<\/footer>/gi, footerHtml());
  if (next !== html) fs.writeFileSync(file, next, 'utf8');
});

console.log('SEO link improvements complete: concise internal anchors, no duplicate footer labels, and one authoritative external link.');
