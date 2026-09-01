/**
 * Fuerza indexabilidad de URLs buenas y saca del índice las thin.
 *
 * - /comer/** → noindex,follow (no compiten por crawl budget)
 * - /guia/** → noindex (rutas legacy)
 * - Guías ciudad/momento/comida → index,follow + canonical self www
 * - Home → canonical www + index
 * - Borra sitemap-chunk-*.xml basura si existen
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const MOMENTS = new Set([
  'desayuno', 'almuerzo', 'merienda', 'cena', 'brunch', 'media-manana', 'noche'
]);

function setMetaRobots(html, content) {
  if (/<meta\s+[^>]*name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(
      /<meta\s+[^>]*name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${content}">`
    );
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><meta name="robots" content="${content}">`);
}

function setCanonical(html, url) {
  html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
  const tag = `<link rel="canonical" href="${url}">`;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${tag}\n</head>`);
  return tag + html;
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[gsc-force-index] sin dist');
    return;
  }

  let noindex = 0;
  let indexable = 0;

  // Borrar sitemaps basura
  for (const name of fs.readdirSync(DIST)) {
    if (/^sitemap-chunk/i.test(name) || /^sitemap_\d/i.test(name)) {
      fs.rmSync(path.join(DIST, name), { force: true });
    }
  }

  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.')) continue;
        walk(full);
      } else if (e.name === 'index.html') {
        const rel = path.relative(DIST, full).replace(/\\/g, '/');
        let html = fs.readFileSync(full, 'utf8');
        const route =
          rel === 'index.html' ? '/' : '/' + rel.slice(0, -'index.html'.length);
        const canonical = SITE + (route.endsWith('/') ? route : route + '/');
        // home special
        const canUrl = rel === 'index.html' ? SITE + '/' : canonical;

        if (rel.startsWith('comer/') || rel.startsWith('guia/')) {
          html = setMetaRobots(html, 'noindex,follow');
          html = setCanonical(html, canUrl);
          fs.writeFileSync(full, html, 'utf8');
          noindex++;
          continue;
        }

        // URLs buenas: index + canonical www self
        html = setMetaRobots(html, 'index,follow');
        html = setCanonical(html, canUrl);
        fs.writeFileSync(full, html, 'utf8');
        indexable++;
      }
    }
  }

  walk(DIST);

  console.log(
    `[gsc-force-index] indexable=${indexable} noindex_thin=${noindex} (comer+guia)`
  );
}

if (require.main === module) run();
module.exports = { run };
