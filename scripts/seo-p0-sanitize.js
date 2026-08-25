const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
let changed = 0;
let ratingSchemasRemoved = 0;
let secondaryH1sFixed = 0;

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else if (/\.html$/i.test(entry.name)) callback(full);
  }
}

walk(OUT, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;

  // Never publish invented ratings/review counts in JSON-LD.
  html = html.replace(/,?\"aggregateRating\"\s*:\s*\{[^{}]*\}/gi, () => {
    ratingSchemasRemoved += 1;
    return '';
  });

  // The homepage contains one primary H1; these two injected section headings are H2s.
  html = html.replace(/<h1([^>]*\bid=["'](?:local-h1|pillar-h1)["'][^>]*)>/gi, '<h2$1>');
  html = html.replace(/<\/h1>/gi, (closing, offset, full) => {
    const before = full.slice(0, offset);
    const openH1 = (before.match(/<h1\b/gi) || []).length;
    const closeH1 = (before.match(/<\/h1>/gi) || []).length;
    return openH1 > closeH1 ? '</h2>' : closing;
  });

  if (html !== original) {
    if (html.match(/<h2[^>]*\bid=["'](?:local-h1|pillar-h1)["']/gi)) secondaryH1sFixed += 1;
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
});

console.log(`[seo-p0-sanitize] ${changed} HTML files changed; ${ratingSchemasRemoved} rating schema blocks removed; ${secondaryH1sFixed} files with secondary homepage headings fixed.`);
