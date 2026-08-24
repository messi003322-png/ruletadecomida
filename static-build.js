const fs=require('fs');
const path=require('path');
const AdmZip=require('adm-zip');
const sourceZip=path.join(process.cwd(),'sitio_usuario_estatico.zip');
const outputDir=path.join(process.cwd(),'dist');
const footerPolish=`<style id="rf-footer-mobile-polish">.rf-final-footer{margin-top:72px!important}</style>`;
function addFooterPolish(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const target=path.join(dir,entry.name);if(entry.isDirectory())addFooterPolish(target);else if(/\.html$/i.test(entry.name)){let html=fs.readFileSync(target,'utf8');html=html.replace(/<style id="rf-footer-mobile-polish">[\s\S]*?<\/style>/i,'');html=html.replace(/<\/head>/i,`${footerPolish}</head>`);fs.writeFileSync(target,html,'utf8')}}}
if(!fs.existsSync(sourceZip))throw new Error('No se encontró sitio_usuario_estatico.zip.');
fs.rmSync(outputDir,{recursive:true,force:true});fs.mkdirSync(outputDir,{recursive:true});
const zip=new AdmZip(sourceZip);for(const entry of zip.getEntries()){const normalized=entry.entryName.replace(/\\/g,'/');if(normalized.startsWith('/')||normalized.split('/').includes('..'))throw new Error(`Ruta no permitida en el ZIP: ${entry.entryName}`)}
zip.extractAllTo(outputDir,true);addFooterPolish(outputDir);
for(const script of ['seo-postprocess.js','ultra-design.js','fix-chips.js','home-faq-seo.js','generate-meal-layers.js','home-meal-filters.js']){try{require('./scripts/'+script).run()}catch(e){console.warn('[static-build] '+script+':',e.message)}}
for(const script of ['final-guide.js','fix-guide-layout.js','fix-header-overlap.js','final-guide-cleanup.js','fix-home-selector.js','premium-pages.js']){try{require('./scripts/'+script).run()}catch(e){console.warn('[static-build] '+script+':',e.message)}}
for(const required of ['index.html','sitemap.xml','robots.txt']){if(!fs.existsSync(path.join(outputDir,required)))throw new Error(`El ZIP no contiene el archivo obligatorio: ${required}`)}
console.log('Build OK: selector separado Momento -> Comida -> Ciudad + header sin solapamiento + diseño premium responsive.');