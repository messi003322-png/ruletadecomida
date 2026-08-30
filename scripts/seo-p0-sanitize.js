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

  // Repair legacy pages whose plain-text H1 was emitted with an H2 closing tag.
  // The conservative text-only pattern avoids touching valid nested markup.
  html = html.replace(/<h1([^>]*)>([^<]*)<\/h2>/gi, '<h1$1>$2</h1>');

  // The homepage contains one primary H1; these two injected section headings are H2s.
  html = html.replace(/<h1([^>]*\bid=["'](?:local-h1|pillar-h1)["'][^>]*)>/gi, '<h2$1>');
  // Only headings whose opening tag was explicitly converted above may use a closing H2.
  // Never rewrite every closing H1: that produces invalid markup on all guide pages.
  html = html.replace(/(<h2[^>]*\bid=["'](?:local-h1|pillar-h1)["'][^>]*>[\s\S]*?)<\/h1>/gi, '$1</h2>');

  if (html !== original) {
    if (html.match(/<h2[^>]*\bid=["'](?:local-h1|pillar-h1)["']/gi)) secondaryH1sFixed += 1;
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
});

console.log(`[seo-p0-sanitize] ${changed} HTML files changed; ${ratingSchemasRemoved} rating schema blocks removed; ${secondaryH1sFixed} files with secondary homepage headings fixed.`);
