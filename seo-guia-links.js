const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

const homePath = path.join(OUT, 'index.html');
if (fs.existsSync(homePath)) {
  let html = fs.readFileSync(homePath, 'utf8');
  
  // Add link to the new guide in the home explore section
  const newLink = `<a class="seo-card" href="${SITE}/guia-completa-de-comidas/"><strong>Guía Completa de Comidas</strong><span>Ideas para desayuno, almuerzo, merienda y cena en una sola guía.</span></a>`;
  
  if(html.includes('seo-hub-grid')){
    html = html.replace(/<div class=["']seo-hub-grid["'][^>]*>/i, `$&${newLink}`);
    fs.writeFileSync(homePath, html, 'utf8');
    console.log('Guía enlazada en la portada.');
  }
}

// Add link in the footer for global discoverability
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, cb);
    else if (/\.html$/i.test(e.name)) cb(f);
  }
}

let count = 0;
walk(OUT, file => {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('rf-final-footer')) {
    // Inject a subtle link in the footer brand section
    const footerLink = `<p style="margin-top:12px!important"><a href="${SITE}/guia-completa-de-comidas/" style="color:inherit;text-decoration:underline">Ver Guía Completa de Comidas</a><span aria-hidden="true"> · </span><a href="${SITE}/comidas-por-ciudad/" style="color:inherit;text-decoration:underline">Explorar comidas por ciudad</a></p>`;
    html = html.replace(/(<div class=["']rf-footer-brand["'][^>]*>[\s\S]*?<\/div>)/i, `$1${footerLink}`);
    fs.writeFileSync(file, html, 'utf8');
    count++;
  }
});
console.log(`Enlace de footer inyectado en ${count} páginas.`);
