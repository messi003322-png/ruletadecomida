const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
let changed = 0;
const skip = '<a class="rf-skip-link" href="#main-content">Saltar al contenido principal</a><style id="rf-skip-link-style">.rf-skip-link{position:absolute;left:8px;top:-48px;z-index:9999;padding:10px 14px;background:#1c1917;color:#fff;border-radius:8px;font-weight:700}.rf-skip-link:focus{top:8px}</style>';

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
  if (!html.includes('rf-skip-link')) html = html.replace(/<body([^>]*)>/i, `<body$1>${skip}`);
  if (!/id=["']main-content["']/i.test(html)) {
    if (/<main(\s|>)/i.test(html)) {
      html = html.replace(/<main(\s|>)/i, '<main id="main-content"$1');
    } else if (/<div[^>]*class=["'][^"']*\bwrap\b[^"']*["'][^>]*>/i.test(html)) {
      html = html.replace(/(<div[^>]*class=["'][^"']*\bwrap\b[^"']*["'][^>]*)>/i, '$1 id="main-content">');
    } else {
      html = html.replace(/<body([^>]*)>/i, '<body$1><div id="main-content">');
      html = html.replace(/<\/body>/i, '</div></body>');
    }
  }
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
});
console.log(`[accessibility-navigation] ${changed} HTML files received skip-link and main landmark support.`);
