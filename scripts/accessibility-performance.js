const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
let changed = 0;

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
  let imageIndex = 0;
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    imageIndex += 1;
    let next = tag;
    if (!/\bdecoding=/i.test(next)) next = next.replace(/>$/, ' decoding="async">');
    // Keep the first image eager; defer below-the-fold images to reduce initial work.
    if (imageIndex > 1 && !/\bloading=/i.test(next)) next = next.replace(/>$/, ' loading="lazy">');
    // Missing alt is made explicitly decorative rather than exposing an unnamed image.
    if (!/\balt=/i.test(next)) next = next.replace(/>$/, ' alt="">');
    return next;
  });
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
});
console.log(`[accessibility-performance] ${changed} HTML files processed for image loading, decoding and alt defaults.`);
