const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'dist');
let htmlCount = 0;
let fragmentErrors = 0;
let buttonsWithoutType = 0;
const examples = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) audit(full);
  }
}

function audit(file) {
  htmlCount++;
  const html = fs.readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]));
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["'](#([^"']*))\2?["'][^>]*>/gi)) {
    const fragment = match[2] || '';
    if (fragment && !ids.has(fragment)) {
      fragmentErrors++;
      if (examples.length < 20) examples.push(`${path.relative(root, file)} -> #${fragment}`);
    }
  }
  for (const match of html.matchAll(/<button\b([^>]*)>/gi)) {
    if (!/\btype\s*=\s*["'][^"']+["']/i.test(match[1])) {
      buttonsWithoutType++;
      if (examples.length < 20) examples.push(`${path.relative(root, file)} -> button without type`);
    }
  }
}

walk(root);
console.log(`[interactive-markup] HTML=${htmlCount} fragmentErrors=${fragmentErrors} buttonsWithoutType=${buttonsWithoutType}`);
if (examples.length) console.log(examples.join('\n'));
if (fragmentErrors || buttonsWithoutType) process.exitCode = 1;
