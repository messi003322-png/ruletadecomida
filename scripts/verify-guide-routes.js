const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SITE='https://www.ruletadecomida.es';
const MOMENTS=['desayuno','almuerzo','merienda','cena'];
const EXPECTED_CITIES=79;
const EXPECTED_FOODS=78;
const EXPECTED_GUIDES=EXPECTED_CITIES*MOMENTS.length*EXPECTED_FOODS;
function hideSitemapLinks(){function walk(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(/\.html$/i.test(e.name)){let html=fs.readFileSync(file,'utf8');html=html.replace(/<a\b[^>]*href=["'][^"']*\/sitemap\.xml(?:\?[^"']*)?["'][^>]*>[\s\S]*?<\/a>/gi,'');html=html.replace(/\s*[·•]\s*Sitemap\b/gi,'');html=html.replace(/>\s*Sitemap\s*</gi,'><');fs.writeFileSync(file,html,'utf8')}}}walk(DIST)}
function hasFoodIndex(cityDir){return MOMENTS.some(m=>{const d=path.join(cityDir,m);return fs.existsSync(d)&&fs.readdirSync(d,{withFileTypes:true}).some(e=>e.isDirectory()&&fs.existsSync(path.join(d,e.name,'index.html')));});}
function run(){
 if(!fs.existsSync(DIST))throw new Error('dist no existe');
 let guides=0,bad=[];
 const allDirs=fs.readdirSync(DIST,{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('.')&&!['assets','css','js','images'].includes(e.name));
 const cities=allDirs.filter(city=>MOMENTS.every(moment=>fs.existsSync(path.join(DIST,city.name,moment))&&fs.readdirSync(path.join(DIST,city.name,moment),{withFileTypes:true}).some(e=>e.isDirectory()&&fs.existsSync(path.join(DIST,city.name,moment,e.name,'index.html'))))&&hasFoodIndex(path.join(DIST,city.name)));
 const globalFoods=new Set();
 for(const city of cities){for(const moment of MOMENTS){const dir=path.join(DIST,city.name,moment);const foods=fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(dir,e.name,'index.html')));foods.forEach(f=>globalFoods.add(f.name));if(foods.length!==EXPECTED_FOODS)bad.push(`${city.name}/${moment}: ${foods.length}/${EXPECTED_FOODS} comidas`);for(const food of foods){const file=path.join(dir,food.name,'index.html');const html=fs.readFileSync(file,'utf8');const canonical=`${SITE}/${city.name}/${moment}/${food.name}/`;if(!html.includes(canonical)||(!html.includes('Guía de comida ·')&&!html.includes('Dónde comer '))||html.includes('20 ideas para'))bad.push(`${city.name}/${moment}/${food.name}: no parece guía individual`);guides++;}}}
 if(cities.length!==EXPECTED_CITIES)bad.push(`ciudades generadas: ${cities.length}/${EXPECTED_CITIES}`);
 if(globalFoods.size!==EXPECTED_FOODS)bad.push(`comidas únicas: ${globalFoods.size}/${EXPECTED_FOODS}`);
 if(guides!==EXPECTED_GUIDES||bad.length)throw new Error(`VERIFICACIÓN FALLIDA: ${guides}/${EXPECTED_GUIDES} guías; ${bad.length} problemas. ${bad.slice(0,10).join(' | ')}`);
 hideSitemapLinks();console.log(`[verify-guide-routes] OK: ${EXPECTED_GUIDES} guías individuales válidas (${EXPECTED_CITIES} ciudades × 4 momentos × ${EXPECTED_FOODS} comidas), 0 errores.`);
}
if(require.main===module)run();
module.exports={run};
