const fs = require('fs');
const path = require('path');

const DIST = path.join(process.cwd(), 'dist');
// Use the site's actual canonical host so Google receives 200 OK sitemap URLs,
// instead of sitemap children that redirect between bare and www hosts.
const SITE = 'https://www.ruletadecomida.es';
const MAX_URLS_PER_SITEMAP = 45000;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else if (entry.name.toLowerCase() === 'index.html') out.push(file);
  }
}

function toUrl(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const route = rel === 'index.html' ? '/' : `/${rel.slice(0, -'index.html'.length)}`;
  return SITE + route;
}

function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function writeSitemap(file, urls) {
  const body = urls.map(url => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n');
  fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, 'utf8');
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');

  const htmlFiles = [];
  walk(DIST, htmlFiles);
  const urls = [...new Set(htmlFiles.map(toUrl))].sort();

  const chunks = [];
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_SITEMAP) {
    chunks.push(urls.slice(i, i + MAX_URLS_PER_SITEMAP));
  }

  for (const name of fs.readdirSync(DIST)) {
    if (/^sitemap-\d+\.xml$/i.test(name)) fs.rmSync(path.join(DIST, name), { force: true });
  }

  const childNames = [];
  chunks.forEach((chunk, index) => {
    const name = `sitemap-${index + 1}.xml`;
    writeSitemap(path.join(DIST, name), chunk);
    childNames.push(name);
  });

  const indexEntries = childNames.map(name => `  <sitemap><loc>${SITE}/${name}</loc></sitemap>`).join('\n');
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries}\n</sitemapindex>\n`, 'utf8');

  console.log(`[real-sitemap] ${urls.length} URLs reales en ${childNames.length} sitemaps.`);
  console.log(`[real-sitemap] sitemap.xml = índice completo; cada hijo <= ${MAX_URLS_PER_SITEMAP} URLs.`);
  return urls.length;
}

if (require.main === module) run();
module.exports = { run };
