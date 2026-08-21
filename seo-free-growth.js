const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
const LOGO = SITE + '/logo.png';

if (!fs.existsSync(OUT)) throw new Error('dist not found');

function esc(value) {
  return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
}

function pageUrl(file) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  let u = '/' + rel;
  if (u.endsWith('/index.html')) u = u.slice(0, -10);
  else if (u.endsWith('.html')) u = u.slice(0, -5);
  if (u === '/index') u = '/';
  return SITE + (u === '/' ? '' : u);
}

function titleFromFile(file) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  if (rel.toLowerCase() === 'index.html') return 'Ruleta de Comida | ¿Qué comer hoy? Ideas para cenar';
  const slug = rel.replace(/\/index\.html$/i, '').replace(/\.html$/i, '').replace(/[-_]+/g, ' ').trim();
  const nice = slug.replace(/\b\w/g, c => c.toUpperCase());
  return (nice ? nice + ' | Ruleta de Comida' : 'Ruleta de Comida | ¿Qué comer hoy?').slice(0, 60);
}

function descriptionFromFile(file) {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  if (rel.toLowerCase() === 'index.html') return '¿Qué comer hoy? Gira la ruleta de comida y descubre una idea rápida. Gratis, sin registro y con guías para elegir comida según tus gustos y situación.';
  const slug = rel.replace(/\/index\.html$/i, '').replace(/\.html$/i, '').replace(/[-_]+/g, ' ').trim();
  return ('Ideas prácticas para ' + slug + '. Descubre qué comer o cenar según tu tiempo, presupuesto, gustos y ciudad.').slice(0, 158);
}

function injectHead(file, html) {
  if (!html.includes('</head>')) return html;
  const url = pageUrl(file);
  const title = titleFromFile(file);
  const description = descriptionFromFile(file);
  html = html.replace(/<meta\s+name=[\"']viewport[\"'][^>]*>\s*/gi, '');
  html = html.replace(/<link\s+rel=[\"']canonical[\"'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+name=[\"']description[\"'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+property=[\"']og:[^\"']+[\"'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+name=[\"']twitter:[^\"']+[\"'][^>]*>\s*/gi, '');
  html = html.replace(/<script\s+type=[\"']application\/ld\+json[\"'][^>]*>\s*\{[\s\S]*?<\/script>\s*/gi, '');

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {'@type':'WebSite','name':'Ruleta de Comida','url':SITE},
      {'@type':'WebApplication','name':'Ruleta de Comida','url':SITE,'applicationCategory':'FoodApplication','operatingSystem':'Web','offers':{'@type':'Offer','price':'0','priceCurrency':'EUR'}},
      {'@type':'WebPage','name':title,'description':description,'url':url}
    ]
  };

  const head = [
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<link rel="canonical" href="' + esc(url) + '">',
    '<meta name="description" content="' + esc(description) + '">',
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<meta property="og:title" content="' + esc(title) + '">',
    '<meta property="og:description" content="' + esc(description) + '">',
    '<meta property="og:url" content="' + esc(url) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:image" content="' + LOGO + '">',
    '<meta property="og:site_name" content="Ruleta de Comida">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(title) + '">',
    '<meta name="twitter:description" content="' + esc(description) + '">',
    '<meta name="twitter:image" content="' + LOGO + '">',
    '<script type="application/ld+json">' + JSON.stringify(graph) + '</script>'
  ].join('\n') + '\n';

  return html.replace('</head>', head + '</head>');
}

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else if (entry.name.toLowerCase().endsWith('.html')) callback(full);
  }
}

walk(OUT, file => {
  const original = fs.readFileSync(file, 'utf8');
  const updated = injectHead(file, original);
  if (updated !== original) fs.writeFileSync(file, updated);
});

const resourcesDir = path.join(OUT, 'recursos');
fs.mkdirSync(resourcesDir, {recursive:true});
fs.writeFileSync(path.join(resourcesDir, 'index.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Recursos gratuitos de Ruleta de Comida</title><meta name="description" content="Recursos gratuitos de Ruleta de Comida para blogs, webs y proyectos gastronómicos. Usa la ruleta y enlaza a la herramienta original."><link rel="canonical" href="${SITE}/recursos/"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow"></head><body style="margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#fafaf9;color:#1c1917"><main style="max-width:900px;margin:0 auto;padding:56px 20px"><p><a href="${SITE}/">← Volver a Ruleta de Comida</a></p><h1>Recursos gratuitos de Ruleta de Comida</h1><p>Herramientas y recursos gratuitos para decidir qué comer o cenar. Si tienes un blog, web o proyecto relacionado con gastronomía, puedes compartir esta página y enlazar a la herramienta.</p><section style="background:white;border:1px solid #e7e5e4;border-radius:20px;padding:28px;margin:28px 0"><h2>Ruleta de Comida</h2><p>Una ruleta gratuita para elegir una comida en segundos.</p><p><a href="${SITE}/" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#e85d04;color:white;text-decoration:none;font-weight:700">Abrir la ruleta</a></p></section><section style="background:white;border:1px solid #e7e5e4;border-radius:20px;padding:28px;margin:28px 0"><h2>¿Quieres compartirla?</h2><p>Puedes enlazar directamente a ${SITE}/ desde artículos sobre comida, cenas, recetas o restaurantes. No necesitas pagar ni pedir permiso.</p><pre style="white-space:pre-wrap;background:#f5f5f4;padding:16px;border-radius:12px">&lt;a href="${SITE}/"&gt;Ruleta de Comida&lt;/a&gt;</pre></section><section style="background:white;border:1px solid #e7e5e4;border-radius:20px;padding:28px;margin:28px 0"><h2>Guías útiles</h2><p><a href="${SITE}/que-cenar-hoy/">Qué cenar hoy</a> · <a href="${SITE}/cena-rapida/">Cena rápida</a> · <a href="${SITE}/comida-barata/">Comida barata</a> · <a href="${SITE}/madrid/">Comida en Madrid</a> · <a href="${SITE}/barcelona/">Comida en Barcelona</a></p></section><p>© 2026 Ruleta de Comida</p></main></body></html>`);

const sitemapPath = path.join(OUT, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes(`${SITE}/recursos/`)) sitemap = sitemap.replace('</urlset>', `<url><loc>${SITE}/recursos/</loc></url></urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
}

fs.writeFileSync(path.join(OUT, 'llms.txt'), `# Ruleta de Comida\n\nSitio web gratuito para decidir qué comer o cenar en segundos.\n\n- Sitio: ${SITE}/\n- Recursos: ${SITE}/recursos/\n- Sitemap: ${SITE}/sitemap.xml\n`);

console.log('Free SEO growth improvements complete: metadata, social cards, structured data, resources page, sitemap entry and llms.txt.');
