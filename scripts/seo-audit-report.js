const fs = require('fs');
const path = require('path');

const DIST = path.join(process.cwd(), 'dist');
if (!fs.existsSync(DIST)) throw new Error('dist no existe; ejecuta npm run build primero');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.html$/i.test(entry.name)) out.push(full);
  }
  return out;
}
function count(html, pattern) { return (html.match(pattern) || []).length; }
function first(html, pattern) { return html.match(pattern)?.[1]?.trim() || ''; }
function route(file) { return path.relative(DIST, file).replace(/\\/g, '/'); }

const files = walk(DIST);
const report = { generatedAt: new Date().toISOString(), htmlFiles: files.length, checks: {}, samples: {} };
const issues = { missingTitle: [], longTitle: [], missingDescription: [], longDescription: [], missingCanonical: [], multipleCanonical: [], multipleH1: [], ratingSchema: [], missingRobots: [] };

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const r = route(file);
  const title = first(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)?.[1] || '';
  const canonicals = count(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi);
  const h1s = count(html, /<h1\b/gi);
  if (!title) issues.missingTitle.push(r); else if (title.length > 60) issues.longTitle.push({ route: r, length: title.length });
  if (!description) issues.missingDescription.push(r); else if (description.length > 160) issues.longDescription.push({ route: r, length: description.length });
  if (!canonicals) issues.missingCanonical.push(r); else if (canonicals > 1) issues.multipleCanonical.push({ route: r, count: canonicals });
  if (r === 'index.html' ? h1s !== 1 : h1s === 0) issues.multipleH1.push({ route: r, count: h1s });
  if (/aggregateRating|ratingValue|reviewCount|"@type"\s*:\s*"Review"/i.test(html)) issues.ratingSchema.push(r);
  if (!/<meta\s+[^>]*name=["']robots["']/i.test(html)) issues.missingRobots.push(r);
}

for (const [key, value] of Object.entries(issues)) report.checks[key] = { count: value.length, ok: value.length === 0 };
report.issues = issues;
const out = path.join(DIST, 'seo-audit-report.json');
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`[seo-audit-report] ${files.length} HTML audited -> ${out}`);
for (const [key, value] of Object.entries(report.checks)) console.log(`${value.ok ? 'OK' : 'WARN'} ${key}: ${value.count}`);
