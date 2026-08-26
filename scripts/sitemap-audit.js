const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
if (!fs.existsSync(OUT)) throw new Error('dist no existe; ejecuta npm run build primero');
const files = fs.readdirSync(OUT).filter(f => /^sitemap-\d+\.xml$/.test(f)).sort((a,b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
const urls = [];
const errors = [];
for (const file of files) {
  const xml = fs.readFileSync(path.join(OUT, file), 'utf8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  if (matches.length > 45000) errors.push(`${file}: ${matches.length} URLs; máximo permitido 45000`);
  urls.push(...matches);
}
const seen = new Set();
for (const url of urls) {
  if (seen.has(url)) errors.push(`URL duplicada: ${url}`);
  seen.add(url);
  if (!url.startsWith(`${SITE}/`)) errors.push(`Host canónico incorrecto: ${url}`);
}
const indexPath = path.join(OUT, 'sitemap.xml');
if (!fs.existsSync(indexPath)) errors.push('Falta sitemap.xml');
else {
  const index = fs.readFileSync(indexPath, 'utf8');
  for (const file of files) if (!index.includes(`${SITE}/${file}`)) errors.push(`El índice no referencia ${file}`);
}
const report = { generatedAt: new Date().toISOString(), childSitemaps: files.length, sitemapUrls: urls.length, uniqueUrls: seen.size, errors };
fs.writeFileSync(path.join(OUT, 'sitemap-audit-report.json'), JSON.stringify(report, null, 2));
if (errors.length) { console.error(`[sitemap-audit] FAIL: ${errors.length} errores`); console.error(errors.slice(0, 30).join('\n')); process.exit(1); }
console.log(`[sitemap-audit] PASS: ${files.length} sitemaps, ${urls.length} URLs, ${seen.size} únicas, host canónico correcto.`);
