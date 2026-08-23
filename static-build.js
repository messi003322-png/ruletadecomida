const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const sourceZip = path.join(process.cwd(), 'sitio_usuario_estatico.zip');
const outputDir = path.join(process.cwd(), 'dist');

const footerPolish = `
<style id="rf-footer-mobile-polish">
.rf-final-footer{margin-top:72px!important;background:radial-gradient(circle at 92% 0%,rgba(248,104,22,.22),transparent 20rem),linear-gradient(145deg,#28150b 0%,#120907 64%,#080605 100%)!important;border-top:1px solid rgba(255,174,104,.2)!important;color:#fff!important}
.rf-final-footer .rf-footer-inner{max-width:1120px!important;padding:46px 22px 24px!important}
.rf-final-footer .rf-footer-brand{display:block!important;margin:0!important;text-align:left!important}
.rf-final-footer .rf-footer-brand>span,.rf-final-footer .rf-footer-brand strong{display:block!important;color:#fff!important;font-family:Georgia,"Times New Roman",serif!important;font-size:1.55rem!important;font-weight:700!important;letter-spacing:-.03em!important}
.rf-final-footer .rf-footer-brand p{max-width:34rem!important;margin:8px 0 0!important;color:#d8c2b2!important;font-size:.96rem!important;line-height:1.55!important}
.rf-final-footer .rf-footer-brand+p{display:flex!important;flex-wrap:wrap!important;gap:8px!important;margin:19px 0 0!important}
.rf-final-footer .rf-footer-brand+p span{display:none!important}
.rf-final-footer .rf-footer-brand+p a{display:inline-flex!important;align-items:center!important;min-height:36px!important;padding:7px 11px!important;border:1px solid rgba(255,191,133,.23)!important;border-radius:999px!important;background:rgba(255,255,255,.07)!important;color:#ffe0c6!important;font-size:.78rem!important;font-weight:800!important;line-height:1.2!important;text-decoration:none!important}
.rf-final-footer .rf-footer-brand+p a:hover{background:rgba(255,122,40,.2)!important;color:#fff!important}
.rf-final-footer .rf-footer-links{margin-top:27px!important;padding-top:22px!important;border-top:1px solid rgba(255,255,255,.12)!important}
.rf-final-footer .rf-footer-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
.rf-final-footer .rf-footer-grid a{display:flex!important;align-items:center!important;min-height:38px!important;padding:7px 9px!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:10px!important;background:rgba(255,255,255,.045)!important;color:#e8ddd5!important;font-size:.82rem!important;font-weight:650!important;line-height:1.25!important;text-decoration:none!important}
.rf-final-footer .rf-footer-grid a:hover{border-color:rgba(255,151,73,.55)!important;background:rgba(255,129,51,.13)!important;color:#fff!important}
.rf-final-footer .rf-footer-copy{margin:25px 0 0!important;padding-top:18px!important;border-top:1px solid rgba(255,255,255,.1)!important;color:#aa9586!important;font-size:.8rem!important;text-align:left!important}
.rf-final-footer #seo-map-ciudades{max-width:1120px!important;margin:0 auto!important;padding:24px 22px 38px!important;border-top:1px solid rgba(255,255,255,.1)!important;color:#bca798!important}
.rf-final-footer #seo-map-ciudades p{margin:0 0 15px!important;line-height:1.65!important}
.rf-final-footer #seo-map-ciudades p:nth-child(1),.rf-final-footer #seo-map-ciudades p:nth-child(3){margin-top:19px!important;color:#fff0e2!important;font-size:.78rem!important;font-weight:850!important;letter-spacing:.08em!important;text-transform:uppercase!important}
.rf-final-footer #seo-map-ciudades a{display:inline-flex!important;align-items:center!important;margin:0 5px 7px 0!important;padding:7px 9px!important;border:1px solid rgba(255,255,255,.1)!important;border-radius:9px!important;background:rgba(255,255,255,.045)!important;color:#d6c5b8!important;font-size:.78rem!important;font-weight:650!important;line-height:1.2!important;text-decoration:none!important}
.rf-final-footer #seo-map-ciudades a:hover{background:rgba(255,129,51,.13)!important;color:#fff!important}
@media(max-width:767px){
  .rf-final-footer{margin-top:52px!important}
  .rf-final-footer .rf-footer-inner{padding:32px 16px 18px!important}
  .rf-final-footer .rf-footer-brand>span,.rf-final-footer .rf-footer-brand strong{font-size:1.38rem!important}
  .rf-final-footer .rf-footer-brand p{font-size:.9rem!important}
  .rf-final-footer .rf-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
  .rf-final-footer .rf-footer-grid a{min-height:42px!important;padding:8px!important;font-size:.76rem!important}
  .rf-final-footer .rf-footer-copy{text-align:center!important}
  .rf-final-footer #seo-map-ciudades{padding:22px 16px 112px!important}
  .rf-final-footer #seo-map-ciudades a{margin:0 4px 6px 0!important;padding:7px 8px!important;font-size:.73rem!important}
  .rf-share-float{right:15px!important;bottom:16px!important}
}
.rf-share-float.rf-share-footer-away{opacity:0!important;pointer-events:none!important;transform:translateY(16px) scale(.9)!important}
</style>
<script id="rf-footer-share-avoid">
(function(){
  function setup(){
    var footer=document.querySelector('.rf-final-footer');
    var share=document.querySelector('.rf-share-float');
    if(!footer||!share){setTimeout(setup,250);return;}
    if(!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function(entries){
      share.classList.toggle('rf-share-footer-away',entries.some(function(entry){return entry.isIntersecting;}));
    },{threshold:.04}).observe(footer);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
</script>`;

function addFooterPolish(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) addFooterPolish(target);
    else if (/\.html$/i.test(entry.name)) {
      let html = fs.readFileSync(target, 'utf8');
      html = html.replace(/<style id="rf-footer-mobile-polish">[\s\S]*?<\/style>/i, '');
      html = html.replace(/<\/head>/i, `${footerPolish}</head>`);
      fs.writeFileSync(target, html, 'utf8');
    }
  }
}

if (!fs.existsSync(sourceZip)) {
  throw new Error('No se encontró sitio_usuario_estatico.zip.');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const zip = new AdmZip(sourceZip);
const entries = zip.getEntries();

for (const entry of entries) {
  const normalized = entry.entryName.replace(/\\/g, '/');
  if (normalized.startsWith('/') || normalized.split('/').includes('..')) {
    throw new Error(`Ruta no permitida en el ZIP: ${entry.entryName}`);
  }
}

zip.extractAllTo(outputDir, true);
addFooterPolish(outputDir);

// SEO: titles, descriptions, tablas y FAQ de ciudad
try {
  const seo = require('./scripts/seo-postprocess.js');
  seo.run();
} catch (err) {
  console.warn('[static-build] SEO postprocess omitido:', err.message);
}

for (const required of ['index.html', 'sitemap.xml', 'robots.txt']) {
  if (!fs.existsSync(path.join(outputDir, required))) {
    throw new Error(`El ZIP no contiene el archivo obligatorio: ${required}`);
  }
}

console.log(`Sitio estático del usuario publicado: ${entries.length} entradas extraídas, pie refinado y SEO post-process en dist/.`);
