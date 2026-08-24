const fs=require('fs');
const path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SITE='https://www.ruletadecomida.es';
const MOMENTS=[['desayuno','Desayuno'],['almuerzo','Almuerzo'],['merienda','Merienda'],['cena','Cena']];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function shell(title,desc,body){return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${SITE}${locationPath}"></head><body><main style="max-width:900px;margin:auto;padding:24px;font-family:system-ui"><p><a href="${SITE}/">Ruleta de Comida</a></p>${body}</main></body></html>`}
function write(dir,html){fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html,'utf8')}
function run(){
 if(!fs.existsSync(DIST))return {pages:0};
 let guideCount=0, parentCount=0;
 const cityDirs=fs.readdirSync(DIST,{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('.')&&!['assets','css','js','images'].includes(e.name));
 for(const city of cityDirs){
  const citySlug=city.name;
  const cityDir=path.join(DIST,citySlug);
  const momentLinks=[];
  for(const [moment,label] of MOMENTS){
   const momentDir=path.join(cityDir,moment);
   if(!fs.existsSync(momentDir))continue;
   const foodDirs=fs.readdirSync(momentDir,{withFileTypes:true}).filter(e=>e.isDirectory());
   guideCount+=foodDirs.length;
   const links=foodDirs.map(f=>`<li><a href="${SITE}/${citySlug}/${moment}/${f.name}/">${esc(f.name.replace(/-/g,' '))}</a></li>`).join('');
   const momentUrl=`/${citySlug}/${moment}/`;
   const momentBody=`<h1>${label} en ${esc(citySlug.replace(/-/g,' '))}</h1><p>Guías de comida para ${label.toLowerCase()}.</p><ul>${links}</ul>`;
   const old=global.locationPath;global.locationPath=momentUrl;write(momentDir,`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(label)} en ${esc(citySlug.replace(/-/g,' '))} | Ruleta de Comida</title><meta name="description" content="Guías de ${label.toLowerCase()} y comidas en ${esc(citySlug.replace(/-/g,' '))}."><meta name="robots" content="index,follow"><link rel="canonical" href="${SITE}${momentUrl}"></head><body><main style="max-width:900px;margin:auto;padding:24px;font-family:system-ui"><p><a href="${SITE}/">Ruleta de Comida</a></p>${momentBody}</main></body></html>`);global.locationPath=old;
   momentLinks.push(`<li><a href="${SITE}/${citySlug}/${moment}/">${label}</a></li>`);parentCount++;
  }
  const cityUrl=`/${citySlug}/`;
  write(cityDir,`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Qué comer en ${esc(citySlug.replace(/-/g,' '))} | Ruleta de Comida</title><meta name="description" content="Guías para decidir qué comer en ${esc(citySlug.replace(/-/g,' '))} según el momento del día."><meta name="robots" content="index,follow"><link rel="canonical" href="${SITE}${cityUrl}"></head><body><main style="max-width:900px;margin:auto;padding:24px;font-family:system-ui"><p><a href="${SITE}/">Ruleta de Comida</a></p><h1>Qué comer en ${esc(citySlug.replace(/-/g,' '))}</h1><ul>${momentLinks.join('')}</ul></main></body></html>`);
 }
 if(guideCount!==6320)throw new Error(`Matriz de guías incompleta: ${guideCount}/6320`);
 console.log(`[ensure-guide-routes] OK: ${guideCount} guías + ${parentCount} páginas de momento + ${cityDirs.length} páginas de ciudad`);
 return {guides:guideCount,parentCount,cities:cityDirs.length};
}
if(require.main===module)run();
module.exports={run};
