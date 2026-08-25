const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
const stats = Object.fromEntries([
  'charset','viewport','lang','robots','themeColor','ogType','ogSiteName','ogUrl','twitterCard','canonicalDedup','titleTrim','descriptionTrim','emptyLinks','externalRel','mainRole'
].map(k => [k, 0]));

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else if (/\.html$/i.test(entry.name)) callback(full);
  }
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
function meta(name, content) { return `<meta name="${name}" content="${esc(content)}">`; }
function prop(name, content) { return `<meta property="${name}" content="${esc(content)}">`; }

walk(OUT, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const relative = path.relative(OUT, path.dirname(file)).replace(/\\/g, '/');
  const url = relative ? `${SITE}/${relative}/` : `${SITE}/`;
  if (!/<meta\s+charset=/i.test(html)) { html = html.replace(/<head([^>]*)>/i, '<head$1><meta charset="utf-8">'); stats.charset++; }
  if (!/<meta\s+[^>]*name=["']viewport["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, '<head$1><meta name="viewport" content="width=device-width, initial-scale=1">'); stats.viewport++; }
  if (!/<html[^>]*\blang=/i.test(html)) { html = html.replace(/<html(\s|>)/i, '<html lang="es"$1'); stats.lang++; }
  if (!/<meta\s+[^>]*name=["']robots["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${meta('robots', 'index,follow')}`); stats.robots++; }
  if (!/<meta\s+[^>]*name=["']theme-color["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${meta('theme-color', '#fffaf5')}`); stats.themeColor++; }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim();
  const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || url;
  if (!/<meta\s+[^>]*property=["']og:type["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${prop('og:type', 'website')}`); stats.ogType++; }
  if (!/<meta\s+[^>]*property=["']og:site_name["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${prop('og:site_name', 'Ruleta de Comida')}`); stats.ogSiteName++; }
  if (!/<meta\s+[^>]*property=["']og:url["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${prop('og:url', canonical)}`); stats.ogUrl++; }
  if (!/<meta\s+[^>]*name=["']twitter:card["']/i.test(html)) { html = html.replace(/<head([^>]*)>/i, `<head$1>${meta('twitter:card', 'summary')}`); stats.twitterCard++; }
  const canonicalTags = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) || [];
  if (canonicalTags.length > 1) { let seen = false; html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, tag => { if (seen) return ''; seen = true; return tag; }); stats.canonicalDedup++; }
  if (title && title.length > 60) { html = html.replace(/(<title[^>]*>)[\s\S]*?(<\/title>)/i, `$1${esc(title.slice(0, 57).replace(/[|,:;\-\s]+$/, '').trim())}$2`); stats.titleTrim++; }
  html = html.replace(/<a\b([^>]*?)href=["']\s*["']([^>]*)>/gi, '<a$1$2>');
  const beforeExternal = html;
  html = html.replace(/<a\b([^>]*?)target=["']_blank["']([^>]*)>/gi, (m, a, b) => /\brel=["'][^"']*noopener/i.test(m) ? m : `<a${a}target="_blank" rel="noopener noreferrer"${b}>`);
  if (html !== beforeExternal) stats.externalRel++;
  if (/<main\b/i.test(html) && !/<main\b[^>]*\brole=["']main["']/i.test(html)) { html = html.replace(/<main(\s|>)/i, '<main role="main"$1'); stats.mainRole++; }
  if (html !== original) fs.writeFileSync(file, html, 'utf8');
});
console.log(`[seo-html-hardening] ${Object.entries(stats).map(([k,v]) => `${k}=${v}`).join(' ')}`);
