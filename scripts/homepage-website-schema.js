const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'dist', 'index.html');
const marker = 'schema-website-ruleta';
if (!fs.existsSync(file)) throw new Error('dist/index.html no existe');
let html = fs.readFileSync(file, 'utf8');
if (!html.includes(marker)) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.ruletadecomida.es/#website',
    name: 'Ruleta de Comida',
    url: 'https://www.ruletadecomida.es/'
  };
  const tag = `<script type="application/ld+json" id="${marker}">${JSON.stringify(schema)}</script>`;
  html = html.replace(/<\/head>/i, `${tag}</head>`);
  fs.writeFileSync(file, html, 'utf8');
  console.log('[homepage-website-schema] WebSite schema added to homepage.');
} else {
  console.log('[homepage-website-schema] WebSite schema already present.');
}
