/**
 * Fix chip grids sitewide
 * Handles: footer.seo-map, footerclass="seo-map", #seo-map-ciudades, .links
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

const CHIP_CSS = `<style id="rf-chips-fix">
/* ===== CHIP GRID UNIVERSAL (fuerza máxima) ===== */
footer.seo-map,
.seo-map,
footer[class*="seo-map"]{
  max-width:720px!important;
  margin:40px auto 24px!important;
  padding:28px 18px 32px!important;
  border-top:1px solid rgba(0,0,0,.06)!important;
  background:transparent!important;
  color:#1a1210!important;
  text-align:left!important;
  font-size:inherit!important;
}
footer.seo-map h3,
.seo-map h3{
  display:block!important;
  width:100%!important;
  margin:0 0 14px!important;
  padding:0!important;
  color:#1a1210!important;
  font-size:1.05rem!important;
  font-weight:800!important;
  letter-spacing:-.02em!important;
  line-height:1.3!important;
}
footer.seo-map h3:not(:first-of-type),
.seo-map h3:not(:first-of-type){margin-top:28px!important}

/* CONTENEDOR: flex + oculta cualquier texto suelto (·) */
footer.seo-map .links,
.seo-map .links,
footer.seo-map .rf-chip-grid,
.seo-map .rf-chip-grid,
div.links{
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  gap:8px!important;
  margin:0 0 8px!important;
  padding:0!important;
  font-size:0!important;
  line-height:0!important;
  letter-spacing:0!important;
  word-spacing:0!important;
  color:transparent!important;
}

/* CHIPS */
footer.seo-map .links a,
.seo-map .links a,
footer.seo-map .rf-chip-grid a,
.seo-map .rf-chip-grid a,
div.links a{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  min-height:40px!important;
  margin:0!important;
  padding:8px 14px!important;
  border:1.5px solid rgba(0,0,0,.1)!important;
  border-radius:999px!important;
  background:#fff!important;
  color:#3d2e28!important;
  font-size:.84rem!important;
  font-weight:650!important;
  line-height:1.25!important;
  letter-spacing:-.01em!important;
  text-decoration:none!important;
  white-space:nowrap!important;
  box-shadow:0 1px 3px rgba(0,0,0,.05)!important;
  transition:border-color .2s,color .2s,background .2s,transform .2s,box-shadow .2s!important;
}
footer.seo-map .links a:hover,
.seo-map .links a:hover,
div.links a:hover{
  border-color:#ff6b1a!important;
  color:#c2410c!important;
  background:#fff7ed!important;
  transform:translateY(-1px)!important;
  box-shadow:0 4px 12px rgba(255,100,30,.14)!important;
}

footer.seo-map > p,
.seo-map > p{
  margin:20px 0 0!important;
  font-size:.9rem!important;
  line-height:1.5!important;
  color:#7a6358!important;
}
footer.seo-map > p a,
.seo-map > p a{
  color:#c2410c!important;
  font-weight:700!important;
  font-size:.9rem!important;
}

/* Home dark footer */
#seo-map-ciudades{
  max-width:1120px!important;
  margin:0 auto!important;
  padding:28px 20px 48px!important;
}
#seo-map-ciudades > p.font-semibold,
#seo-map-ciudades > .rf-chip-title{
  display:block!important;
  margin:0 0 12px!important;
  color:#fff0e2!important;
  font-size:.78rem!important;
  font-weight:850!important;
  letter-spacing:.1em!important;
  text-transform:uppercase!important;
  line-height:1.3!important;
}
#seo-map-ciudades > p.mb-4,
#seo-map-ciudades > .rf-chip-grid{
  display:flex!important;
  flex-wrap:wrap!important;
  gap:8px!important;
  margin:0 0 8px!important;
  font-size:0!important;
  line-height:0!important;
  color:transparent!important;
}
#seo-map-ciudades a{
  display:inline-flex!important;
  align-items:center!important;
  min-height:40px!important;
  margin:0!important;
  padding:8px 14px!important;
  border:1px solid rgba(255,255,255,.14)!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.08)!important;
  color:#f0e0d4!important;
  font-size:.82rem!important;
  font-weight:650!important;
  line-height:1.25!important;
  text-decoration:none!important;
  white-space:nowrap!important;
}
#seo-map-ciudades a:hover{
  background:rgba(255,120,40,.22)!important;
  border-color:rgba(255,160,80,.45)!important;
  color:#fff!important;
}

@media(max-width:767px){
  footer.seo-map,.seo-map{padding:24px 14px 28px!important;margin:28px 0 16px!important}
  footer.seo-map .links a,.seo-map .links a,div.links a{
    min-height:38px!important;padding:7px 12px!important;font-size:.8rem!important;
  }
  #seo-map-ciudades{padding:22px 16px 100px!important}
  #seo-map-ciudades a{min-height:38px!important;padding:7px 12px!important;font-size:.78rem!important}
}
</style>`;

function extractLinks(htmlFragment) {
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(htmlFragment)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (text) links.push({ href: m[1], text });
  }
  return links;
}

function chipGrid(links) {
  return (
    '<div class="rf-chip-grid links">' +
    links.map((l) => `<a href="${l.href}">${l.text}</a>`).join('') +
    '</div>'
  );
}

/** Reescribe CUALQUIER div.links que tenga 2+ anchors */
function fixAllLinksDivs(html) {
  return html.replace(
    /<div\s+class=["'][^"']*links[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    (m, content) => {
      const links = extractLinks(content);
      if (links.length < 2) return m;
      return chipGrid(links);
    }
  );
}

/** Normaliza footerclass / footer class seo-map */
function fixSeoMapFooter(html) {
  // Primero arreglar el typo footerclass=
  html = html.replace(/<footer\s*class=/gi, '<footer class=');

  return html.replace(
    /<footer\s+class=["'][^"']*seo-map[^"']*["'][^>]*>([\s\S]*?)<\/footer>/gi,
    (full, inner) => {
      let out = fixAllLinksDivs(inner);
      // Quitar · restantes en texto suelto
      out = out.replace(/\s*·\s*/g, ' ');
      return `<footer class="seo-map">${out}</footer>`;
    }
  );
}

function fixSeoMapCiudades(html) {
  return html.replace(
    /<div\s+id=["']seo-map-ciudades["'][^>]*>([\s\S]*?)<\/div>/gi,
    (full, inner) => {
      let out = inner.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (m, attrs, content) => {
        const links = extractLinks(content);
        if (links.length >= 2) return chipGrid(links);
        if (/font-semibold|Ciudades|Antojos/i.test(attrs + content)) {
          const text = content.replace(/<[^>]+>/g, '').trim();
          return `<p class="rf-chip-title font-semibold">${text}</p>`;
        }
        return m;
      });
      return full.replace(inner, out);
    }
  );
}

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, cb);
    else if (/\.html$/i.test(e.name)) cb(p);
  }
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[fix-chips] dist/ no existe');
    return 0;
  }
  let n = 0;
  walk(DIST, (file) => {
    let html = fs.readFileSync(file, 'utf8');
    const before = html;

    html = fixSeoMapFooter(html);
    html = fixAllLinksDivs(html);
    html = fixSeoMapCiudades(html);

    html = html.replace(/<style id="rf-chips-fix">[\s\S]*?<\/style>/i, '');
    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, CHIP_CSS + '</head>');
    }

    if (html !== before) {
      fs.writeFileSync(file, html, 'utf8');
      n++;
    }
  });
  console.log(`[fix-chips] Procesadas ${n} páginas`);
  return n;
}

if (require.main === module) run();
module.exports = { run };
