const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SKIP=new Set(['assets','css','js','images']);
const pretty=s=>String(s).split('-').map(x=>x?x[0].toUpperCase()+x.slice(1):x).join(' ');
function run(){
  if(!fs.existsSync(DIST))return;
  let changed=0;
  function walk(dir,parts=[]){
    for(const e of fs.readdirSync(dir,{withFileTypes:true})){
      if(e.isDirectory()){
        if(SKIP.has(e.name)||e.name.startsWith('.'))continue;
        walk(path.join(dir,e.name),parts.concat(e.name));
      }else if(e.name==='index.html'&&parts.length>=3){
        const [city,moment,food]=parts.slice(-3);
        const file=path.join(dir,e.name);let html=fs.readFileSync(file,'utf8');
        if(!html.includes('Guía de comida ·'))return;
        const foodName=pretty(food), cityName=pretty(city);
        const title=`Dónde comer ${foodName} en ${cityName} | Ruleta de Comida`;
        const desc=`Descubre dónde comer ${foodName.toLowerCase()} en ${cityName}: ideas, consejos, tiempo, presupuesto y alternativas para elegir qué comer.`;
        html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${title}</title>`);
        html=html.replace(/<meta name="description" content="[^"]*">/i,`<meta name="description" content="${desc.replace(/"/g,'&quot;')}">`);
        html=html.replace(/Guía de comida · [^<]+/g,`Dónde comer ${foodName} · ${cityName}`);
        html=html.replace(/<h1>[\s\S]*?<\/h1>/i,`<h1>Dónde comer ${foodName} en ${cityName}</h1>`);
        html=html.replace(/No es solo una lista:[\s\S]*?<\/p>/i,`¿Buscas ${foodName.toLowerCase()}? Aquí tienes una guía para decidir qué opción elegir hoy y cómo adaptarla a tu tiempo, hambre y presupuesto.</p>`);
        fs.writeFileSync(file,html,'utf8');changed++;
      }
    }
  }
  walk(DIST);
  console.log(`[food-page-wording] OK: ${changed} guías individuales actualizadas con “Dónde comer”`);
}
if(require.main===module)run();
module.exports={run};
