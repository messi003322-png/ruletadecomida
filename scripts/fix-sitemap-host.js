const fs = require('fs');
const path = require('path');

const dist = path.join(process.cwd(), 'dist');
const sitemapDir = dist;
const canonicalHost = 'https://www.ruletadecomida.es';

if (!fs.existsSync(dist)) throw new Error('dist no existe');

const urls = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') {
      const rel = path.relative(dist, path.dirname(full)).replace(/\\/g, '/');
      urls.push(rel ? `${canonicalHost}/${rel}/` : `${canonicalHost}/`);
    }
  }
}
walk(dist);

const unique = [...new Set(urls)].sort();
const chunkSize = 45000;
const childNames = [];

for (let i = 0; i < unique.length; i += chunkSize) {
  const name = `sitemap-${childNames.length + 1}.xml`;
  const chunk = unique.slice(i, i + chunkSize);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(sitemapDir, name), xml);
  childNames.push(name);
}

const index = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${childNames.map(n => `  <sitemap><loc>${canonicalHost}/${n}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`;
fs.writeFileSync(path.join(sitemapDir, 'sitemap.xml'), index);
console.log(`[fix-sitemap-host] ${unique.length} URLs reales; ${childNames.length} sitemaps bajo ${canonicalHost}`);
