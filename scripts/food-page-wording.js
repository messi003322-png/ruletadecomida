const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SKIP=new Set(['assets','css','js','images']);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cleanFoodName(s){return String(s).replace(/^Gu[ií]a(?:s)? de comida\s*/i,'').replace(/^Qu[eé] comer en\s*/i,'').replace(/^D[oó]nde comer\s*/i,'').trim();}
function cleanLegacyLabels(html){
  html=html.replace(/D[oó]nde comer\s+Qu[eé] comer en\s+([^<.!?]+)(?=<|[.!?])/gi,'Dónde comer $1');
  html=html.replace(/Qu[eé] comer en\s+([^<.!?]+)(?=<|[.!?])/gi,'Dónde comer $1');
  return html;
}
function run(){
  if(!fs.existsSync(DIST))return;
  let changed=0;
  function walk(dir,parts=[]){
    for(const e of fs.readdirSync(dir,{withFileTypes:true})){
      if(e.isDirectory()){
        if(SKIP.has(e.name)||e.name.startsWith('.'))continue;
        walk(path.join(dir,e.name),parts.concat(e.name));
      }else if(/\.html$/i.test(e.name)){
        const file=path.join(dir,e.name);let html=fs.readFileSync(file,'utf8');
        const before=html;
        html=cleanLegacyLabels(html);
        const isFoodCategory=(parts.length===1 && /Elige el momento del día|páginas individuales|opciones de comida/i.test(html));
        if(isFoodCategory){
          const h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          if(h1){
            const raw=h1[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
            const foodName=cleanFoodName(raw)||parts[0].replace(/[-_]+/g,' ').trim();
            const title=`Dónde comer ${foodName} | Ruleta de Comida`;
            const desc=`Guía para elegir un buen lugar donde comer ${foodName}: qué valorar, qué preguntar y cómo escoger la mejor opción según tus preferencias.`;
            html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(title)}</title>`);
            html=html.replace(/<meta name="description" content="[^"]*">/i,`<meta name="description" content="${esc(desc)}">`);
            html=html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i,`<h1$1>Dónde comer ${esc(foodName)}</h1>`);
            html=html.replace(/Elige el momento del d[ií]a[^<]*/i,`Aprende a elegir un buen lugar donde comer ${esc(foodName)} y descubre opciones según tus preferencias.`);
          }
        }
        if(html!==before){fs.writeFileSync(file,html,'utf8');changed++;}
      }
    }
  }
  walk(DIST);
  console.log(`[food-page-wording] OK: ${changed} HTML procesados; páginas de comida convertidas a guías "Dónde comer [comida]".`);
}
if(require.main===module)run();
module.exports={run};
