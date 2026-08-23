/**
 * SEO Post-process for Ruleta de Comida
 * - Aplica titles y meta descriptions optimizados
 * - Inyecta tabla + FAQ en páginas de ciudad
 * Se ejecuta desde static-build.js tras extraer el ZIP
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TITLES_FILE = path.join(ROOT, 'seo', 'titles-descriptions-ciudades.json');
const SNIPPET_FILE = path.join(ROOT, 'seo', 'city-table-faq-snippet.html');

const CITY_SLUG_TO_NAME = {
  madrid: 'Madrid',
  barcelona: 'Barcelona',
  valencia: 'Valencia',
  sevilla: 'Sevilla',
  zaragoza: 'Zaragoza',
  malaga: 'Málaga',
  murcia: 'Murcia',
  palma: 'Palma',
  'las-palmas': 'Las Palmas',
  bilbao: 'Bilbao',
  alicante: 'Alicante',
  cordoba: 'Córdoba',
  valladolid: 'Valladolid',
  vigo: 'Vigo',
  gijon: 'Gijón',
  granada: 'Granada',
  oviedo: 'Oviedo',
  badalona: 'Badalona',
  cartagena: 'Cartagena',
  jerez: 'Jerez',
  mostoles: 'Móstoles',
  pamplona: 'Pamplona',
  almeria: 'Almería',
  fuenlabrada: 'Fuenlabrada',
  leganes: 'Leganés',
  santander: 'Santander',
  burgos: 'Burgos',
  alcorcon: 'Alcorcón',
  getafe: 'Getafe',
  salamanca: 'Salamanca',
  huelva: 'Huelva',
  logrono: 'Logroño',
  badajoz: 'Badajoz',
  leon: 'León',
  tarragona: 'Tarragona',
  cadiz: 'Cádiz',
  lleida: 'Lleida',
  marbella: 'Marbella',
  mataro: 'Mataró',
  ourense: 'Ourense',
  girona: 'Girona',
  aviles: 'Avilés',
  barakaldo: 'Barakaldo',
  'alcala-de-henares': 'Alcalá de Henares',
  ceuta: 'Ceuta',
  melilla: 'Melilla'
};

function loadTitles() {
  if (!fs.existsSync(TITLES_FILE)) return new Map();
  const data = JSON.parse(fs.readFileSync(TITLES_FILE, 'utf8'));
  const map = new Map();
  for (const p of data.pages || []) {
    const key = (p.path || '/').replace(/\/$/, '') || '/';
    map.set(key, p);
  }
  return map;
}

function loadSnippet() {
  if (!fs.existsSync(SNIPPET_FILE)) return '';
  return fs.readFileSync(SNIPPET_FILE, 'utf8');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyTitleDescription(html, title, description) {
  if (title) {
    if (/<title>[\s\S]*?<\/title>/i.test(html)) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    } else {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n<title>${escapeHtml(title)}</title>`);
    }
  }
  if (description) {
    if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
      html = html.replace(
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" content="${escapeHtml(description)}">`
      );
    } else {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n<meta name="description" content="${escapeHtml(description)}">`);
    }
  }
  return html;
}

function injectTableFaq(html, cityName, snippet) {
  if (!snippet || !cityName) return html;
  if (html.includes('rf-data-table') || html.includes('rf-faq-semantic')) return html;

  const block = snippet.replace(/\{\{CIUDAD\}\}/g, cityName);

  // Insertar antes del footer o antes de </main> o antes de </body>
  if (/<footer[\s>]/i.test(html)) {
    return html.replace(/<footer[\s>]/i, `${block}\n<footer`);
  }
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${block}\n</main>`);
  }
  if (/<div class="rf-final-footer"/i.test(html)) {
    return html.replace(/<div class="rf-final-footer"/i, `${block}\n<div class="rf-final-footer"`);
  }
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

function pathFromFile(filePath) {
  let rel = path.relative(DIST, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -10);
  else if (rel.endsWith('.html')) rel = rel.slice(0, -5);
  if (!rel.startsWith('/')) rel = '/' + rel;
  return rel.replace(/\/$/, '') || '/';
}

function walkHtml(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, cb);
    else if (/\.html$/i.test(entry.name)) cb(full);
  }
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[seo-postprocess] No existe dist/, nada que hacer.');
    return { titles: 0, faqs: 0 };
  }

  const titlesMap = loadTitles();
  const snippet = loadSnippet();
  let titlesApplied = 0;
  let faqsApplied = 0;

  walkHtml(DIST, (filePath) => {
    let html = fs.readFileSync(filePath, 'utf8');
    const urlPath = pathFromFile(filePath);
    const meta = titlesMap.get(urlPath);
    let changed = false;

    if (meta) {
      html = applyTitleDescription(html, meta.title, meta.description);
      titlesApplied++;
      changed = true;
    }

    // Página de ciudad pura: /madrid/ → un solo segmento conocido
    const segments = urlPath.split('/').filter(Boolean);
    if (segments.length === 1 && CITY_SLUG_TO_NAME[segments[0]]) {
      const cityName = CITY_SLUG_TO_NAME[segments[0]];
      const before = html;
      html = injectTableFaq(html, cityName, snippet);
      if (html !== before) {
        faqsApplied++;
        changed = true;
      }
    }

    if (changed) fs.writeFileSync(filePath, html, 'utf8');
  });

  console.log(`[seo-postprocess] Titles/descriptions: ${titlesApplied} | Tablas+FAQ ciudad: ${faqsApplied}`);
  return { titles: titlesApplied, faqs: faqsApplied };
}

if (require.main === module) {
  run();
}

module.exports = { run };
