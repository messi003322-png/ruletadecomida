const fs=require('fs');
const path=require('path');
const DIST=path.join(__dirname,'..','dist');
const MOMENTS=[['desayuno','Desayuno','desayunar'],['almuerzo','Almuerzo','almorzar'],['merienda','Merienda','merendar'],['cena','Cena','cenar']];
const citySkip=new Set(['assets','css','js','images']);
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function run(){
 if(!fs.existsSync(DIST)) return;
 const cities=fs.readdirSync(DIST,{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('.')&&!citySkip.has(e.name));
 let repaired=0, foodsFound=new Set();
 for(const city of cities){
  for(const [m] of MOMENTS){
   const dir=path.join(DIST,city.name,m);
   if(!fs.existsSync(dir)) continue;
   for(const e of fs.readdirSync(dir,{withFileTypes:true})) if(e.isDirectory()&&fs.existsSync(path.join(dir,e.name,'index.html'))) foodsFound.add(e.name);
  }
 }
 for(const city of cities){
  for(const [target,targetLabel,targetVerb] of MOMENTS){
   const targetDir=path.join(DIST,city.name,target); fs.mkdirSync(targetDir,{recursive:true});
   for(const food of foodsFound){
    const out=path.join(targetDir,food,'index.html'); if(fs.existsSync(out)) continue;
    let source=null,sourceMoment=null;
    for(const [src] of MOMENTS){const p=path.join(DIST,city.name,src,food,'index.html');if(fs.existsSync(p)){source=fs.readFileSync(p,'utf8');sourceMoment=src;break;}}
    if(!source) continue;
    const labels={desayuno:'Desayuno',almuerzo:'Almuerzo',merienda:'Merienda',cena:'Cena'};
    const verbs={desayuno:'desayunar',almuerzo:'almorzar',merienda:'merendar',cena:'cenar'};
    const srcLabel=labels[sourceMoment],srcVerb=verbs[sourceMoment];
    let html=source;
    html=html.replaceAll(`/${sourceMoment}/${food}/`,`/${target}/${food}/`);
    html=html.replaceAll(`>${srcLabel} en `,`>${targetLabel} en `);
    html=html.replaceAll(`/${sourceMoment}/`, `/${target}/`);
    html=html.replaceAll(`para ${srcVerb}`,`para ${targetVerb}`);
    html=html.replaceAll(`durante el ${srcLabel.toLowerCase()}`,`durante el ${targetLabel.toLowerCase()}`);
    fs.mkdirSync(path.dirname(out),{recursive:true}); fs.writeFileSync(out,html,'utf8'); repaired++;
   }
  }
 }
 console.log(`[repair-all-food-routes] OK: ${foodsFound.size} comidas detectadas; ${repaired} rutas faltantes reparadas.`);
}
if(require.main===module)run();
module.exports={run};
