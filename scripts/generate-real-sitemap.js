/**
 * Sitemap SOLO con URLs indexables de calidad.
 * Excluye /comer/ (thin), /guia/ antigua, assets y basura.
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
const MAX_URLS_PER_SITEMAP = 45000;

const MOMENTS = new Set([
  'desayuno', 'almuerzo', 'merienda', 'cena', 'brunch', 'media-manana', 'noche'
]);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      walk(file, out);
    } else if (entry.name.toLowerCase() === 'index.html') {
      out.push(file);
    }
  }
}

function toUrl(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const route = rel === 'index.html' ? '/' : `/${rel.slice(0, -'index.html'.length)}`;
  return SITE + route;
}

function shouldInclude(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  // Excluir capas thin / basura
  if (rel.startsWith('comer/')) return false;
  if (rel.startsWith('guia/')) return false;
  if (rel.includes('/assets/')) return false;
  // Excluir si el HTML tiene noindex
  try {
    const html = fs.readFileSync(file, 'utf8');
    if (/content=["'][^"']*noindex/i.test(html)) return false;
  } catch (_) {}
  return true;
}

function priorityFor(url) {
  const pathPart = url.replace(SITE, '') || '/';
  if (pathPart === '/') return '1.0';
  const parts = pathPart.split('/').filter(Boolean);
  if (parts.length === 1) return '0.8';
  if (parts.length === 2 && MOMENTS.has(parts[1])) return '0.7';
  if (parts.length === 3 && MOMENTS.has(parts[1])) return '0.65';
  return '0.5';
}

function xmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function writeSitemap(file, urls) {
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map((url) => {
      const pri = priorityFor(url);
      return `  <url>\n    <loc>${xmlEscape(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${pri}</priority>\n  </url>`;
    })
    .join('\n');
  fs.writeFileSync(
    file,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    'utf8'
  );
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');

  const htmlFiles = [];
  walk(DIST, htmlFiles);
  const urls = [...new Set(htmlFiles.filter(shouldInclude).map(toUrl))].sort();

  const chunks = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_SITEMAP) {
    chunks.push(urls.slice(i, i + MAX_URLS_PER_SITEMAP));
  }

  for (const name of fs.readdirSync(DIST)) {
    if (/^sitemap/i.test(name) && name.endsWith('.xml')) {
      fs.rmSync(path.join(DIST, name), { force: true });
    }
  }

  const childNames = [];
  chunks.forEach((chunk, index) => {
    const name = `sitemap-${index + 1}.xml`;
    writeSitemap(path.join(DIST, name), chunk);
    childNames.push(name);
  });

  if (childNames.length === 1) {
    // Un solo sitemap: también como sitemap.xml directo (más simple para GSC)
    fs.copyFileSync(path.join(DIST, childNames[0]), path.join(DIST, 'sitemap.xml'));
  } else {
    const indexEntries = childNames
      .map((name) => `  <sitemap><loc>${SITE}/${name}</loc></sitemap>`)
      .join('\n');
    fs.writeFileSync(
      path.join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries}\n</sitemapindex>\n`,
      'utf8'
    );
  }

  // robots.txt
  fs.writeFileSync(
    path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\n# Capas thin: noindex en HTML; no hace falta Disallow agresivo\n\nSitemap: ${SITE}/sitemap.xml\n`,
    'utf8'
  );

  console.log(
    `[real-sitemap] ${urls.length} URLs INDEXABLES (sin /comer ni /guia) en ${childNames.length} sitemap(s).`
  );
  return urls.length;
}

if (require.main === module) run();
module.exports = { run };
