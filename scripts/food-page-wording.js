const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SKIP=new Set(['assets','css','js','images']);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cleanFoodName(s){return String(s).replace(/^Gu[ií]a(?:s)? de comida\s*/i,'').replace(/^Qu[eé] comer en\s*/i,'').replace(/^D[oó]nde comer\s*/i,'').trim();}
function run(){
  if(!fs.existsSync(DIST))return;
  let changed=0;
  function walk(dir,parts=[]){
    for(const e of fs.readdirSync(dir,{withFileTypes:true})){
      if(e.isDirectory()){
        if(SKIP.has(e.name)||e.name.startsWith('.'))continue;
        walk(path.join(dir,e.name),parts.concat(e.name));
      }else if(e.name==='index.html'){
        const file=path.join(dir,e.name);let html=fs.readFileSync(file,'utf8');
        const isFoodCategory=(parts.length===1 && /Elige el momento del día|páginas individuales|opciones de comida/i.test(html));
        if(!isFoodCategory)return;
        const h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if(!h1)return;
        const raw=h1[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
        const foodName=cleanFoodName(raw)||parts[0].replace(/[-_]+/g,' ').trim();
        const title=`${foodName} | Ruleta de Comida`;
        const desc=`Opciones de ${foodName}: elige el momento del día y descubre opciones de comida con páginas individuales.`;
        html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(title)}</title>`);
        html=html.replace(/<meta name="description" content="[^"]*">/i,`<meta name="description" content="${esc(desc)}">`);
        html=html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i,`<h1$1>${esc(foodName)}</h1>`);
        html=html.replace(/(?:D[oó]nde comer|Qu[eé] comer en)\s+[^<.]*/gi,esc(foodName));
        html=html.replace(/Gu[ií]as? de comida(?:\s+para)?[^<.]*/gi,esc(foodName));
        html=html.replace(/Elige el momento del d[ií]a[^<]*/i,'Elige el momento del día y descubre opciones de comida con páginas individuales.');
        fs.writeFileSync(file,html,'utf8');changed++;
      }
    }
  }
  walk(DIST);
  console.log(`[food-page-wording] OK: ${changed} páginas de comida limpiadas; guías individuales intactas.`);
}
if(require.main===module)run();
module.exports={run};
