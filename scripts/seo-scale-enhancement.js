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

function getMeta(html, name) {
  const re = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'i');
  return html.match(re)?.[0] || '';
}
function getProperty(html, property) {
  const re = new RegExp(`<meta\\s+[^>]*property=["']${property}["'][^>]*>`, 'i');
  return html.match(re)?.[0] || '';
}
function attr(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}
function insertOnce(html, tag, pattern) {
  return pattern.test(html) ? html : html.replace(/<\/head>/i, `${tag}\n</head>`);
}

walk(OUT, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || 'Ruleta de Comida';
  const descriptionTag = getMeta(html, 'description');
  const description = attr(descriptionTag, 'content') || 'Ideas para decidir qué comer hoy con Ruleta de Comida.';

  html = insertOnce(html, '<meta name="theme-color" content="#e85d04">', /name=["']theme-color["']/i);
  html = insertOnce(html, '<meta name="twitter:card" content="summary">', /name=["']twitter:card["']/i);
  html = insertOnce(html, `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">`, /name=["']twitter:title["']/i);
  html = insertOnce(html, `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">`, /name=["']twitter:description["']/i);
  html = insertOnce(html, '<meta property="og:site_name" content="Ruleta de Comida">', /property=["']og:site_name["']/i);

  // Remove duplicate metadata tags introduced by historical build scripts, keeping the first.
  for (const [kind, value] of [['name', 'description'], ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:url']]) {
    const re = new RegExp(`<meta\\s+[^>]*${kind}=["']${value}["'][^>]*>`, 'gi');
    let seen = 0;
    html = html.replace(re, (tag) => (++seen === 1 ? tag : ''));
  }

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed += 1;
  }
});

console.log(`[seo-scale-enhancement] ${changed} HTML files enriched with social metadata and duplicate-meta cleanup.`);
