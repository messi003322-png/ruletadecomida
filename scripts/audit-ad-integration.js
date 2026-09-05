const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'dist');
let html = 0;
let quge5 = 0;
let wrongQuge5Count = 0;
let adcash = 0;
let previous = 0;
let examples = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) check(file);
  }
}
function check(file) {
  html += 1;
  const text = fs.readFileSync(file, 'utf8');
  const q = (text.match(/https:\/\/quge5\.com\/88\/tag\.min\.js/gi) || []).length;
  if (q === 1) quge5 += 1;
  else {
    wrongQuge5Count += 1;
    if (examples.length < 10) examples.push(`${path.relative(root, file)} quge5=${q}`);
  }
  if (/acscdn\.com|adbpage\.com|adcash|zxsbhnljps|aclib\.runAutoTag|adcash-anti-adblock/gi.test(text)) adcash += 1;
  if (/al5sm\.com|monetag|impassabletroubledwistful|profitableratecpmnetwork|adsterra|popads/gi.test(text)) previous += 1;
}
walk(root);
console.log(`[ad-audit] HTML=${html} quge5ExactlyOnce=${quge5} wrongQuge5Count=${wrongQuge5Count} pagesWithAdcash=${adcash} pagesWithPreviousNetworks=${previous}`);
if (examples.length) console.log(examples.join('\n'));
if (html !== 204049 || quge5 !== html || wrongQuge5Count || adcash || previous) process.exitCode = 1;
