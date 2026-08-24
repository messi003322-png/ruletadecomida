const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const sourceZip = path.join(process.cwd(), 'sitio_usuario_estatico.zip');
const outputDir = path.join(process.cwd(), 'dist');
const footerPolish = `<style id="rf-footer-mobile-polish">.rf-final-footer{margin-top:72px!important;background:radial-gradient(circle at 92% 0%,rgba(248,104,22,.22),transparent 20rem),linear-gradient(145deg,#28150b 0%,#120907 64%,#080605 100%)!important;border-top:1px solid rgba(255,174,104,.2)!important;color:#fff!important}@media(max-width:767px){.rf-final-footer{margin-top:52px!important}.rf-final-footer .rf-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.rf-final-footer #seo-map-ciudades{padding-bottom:112px!important}}</style>`;
function addFooterPolish(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const target=path.join(dir,entry.name);if(entry.isDirectory())addFooterPolish(target);else if(/\.html$/i.test(entry.name)){let html=fs.readFileSync(target,'utf8');html=html.replace(/<style id="rf-footer-mobile-polish">[\s\S]*?<\/style>/i,'');html=html.replace(/<\/head>/i,`${footerPolish}</head>`);fs.writeFileSync(target,html,'utf8')}}}
if(!fs.existsSync(sourceZip))throw new Error('No se encontró sitio_usuario_estatico.zip.');
fs.rmSync(outputDir,{recursive:true,force:true});fs.mkdirSync(outputDir,{recursive:true});
const zip=new AdmZip(sourceZip);const entries=zip.getEntries();
for(const entry of entries){const normalized=entry.entryName.replace(/\\/g,'/');if(normalized.startsWith('/')||normalized.split('/').includes('..'))throw new Error(`Ruta no permitida en el ZIP: ${entry.entryName}`)}
zip.extractAllTo(outputDir,true);addFooterPolish(outputDir);
try{require('./scripts/seo-postprocess.js').run()}catch(e){console.warn('[static-build] SEO:',e.message)}
try{require('./scripts/ultra-design.js').run()}catch(e){console.warn('[static-build] ultra-design:',e.message)}
try{require('./scripts/fix-chips.js').run()}catch(e){console.warn('[static-build] fix-chips:',e.message)}
try{require('./scripts/home-faq-seo.js').run()}catch(e){console.warn('[static-build] home-faq:',e.message)}
try{require('./scripts/generate-meal-layers.js').run()}catch(e){console.warn('[static-build] meal-layers:',e.message)}
try{require('./scripts/home-meal-filters.js').run()}catch(e){console.warn('[static-build] meal-filters:',e.message)}
// Insert Momento before wiring the guide events.
try{require('./scripts/restore-guide-moment.js').run()}catch(e){console.warn('[static-build] restore-moment:',e.message)}
try{require('./scripts/home-guide-moment.js').run()}catch(e){console.warn('[static-build] guide-moment:',e.message)}
// Prevent the guide from repeatedly re-rendering itself through a MutationObserver.
try{require('./scripts/disable-guide-observer.js').run()}catch(e){console.warn('[static-build] guide-observer:',e.message)}
for(const required of ['index.html','sitemap.xml','robots.txt']){if(!fs.existsSync(path.join(outputDir,required)))throw new Error(`El ZIP no contiene el archivo obligatorio: ${required}`)}
console.log('Sitio construido: filtros + guía Momento → Comida → Ciudad.');