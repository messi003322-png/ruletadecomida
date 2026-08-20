const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP = 'ruletadecomida_MRMND_5_ANUNCIOS_RESPONSIVE.zip';
const OUT = path.join(process.cwd(), 'dist');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const zip = new AdmZip(ZIP);
zip.extractAllTo(OUT, true);

function cleanAds(file) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/<style[^>]*id=["']mrmnd-ad-layout["'][^>]*>[\\s\\S]*?<\\/style>/gi, '');
  text = text.replace(/<script\\b[^>]*(?:mrmnd\\.com|monetag)[^>]*>[\\s\\S]*?<\\/script>/gi, '');
  text = text.replace(/<div[^>]*class=["'][^"']*mrmnd-ad-slot[^"']*["'][^>]*>[\\s\\S]*?<\\/div>\\s*<\\/div>/gi, '');
  text = text.replace(/\\s+data-mnd[a-z0-9-]+=["'][^"']*["']/gi, '');
  fs.writeFileSync(file, text);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\\.(html?|css|js|json|xml)$/i.test(entry.name)) cleanAds(full);
  }
}

walk(OUT);
console.log('Static site extracted and Monetag/mrmnd ad code removed.');
