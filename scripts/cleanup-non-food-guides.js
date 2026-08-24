const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SKIP=new Set(['assets','css','js','images']);
const NON_FOOD=new Set([
  'comida barata','cena rapida','qué cenar hoy','que cenar hoy','no sé qué cenar','no se que cenar',
  'comida saludable','comida sana','comida rápida','comida rapida','comida para llevar','comida casera'
]);
function norm(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
function cleanName(s){return String(s).replace(/^d[oó]nde comer\s+/i,'').replace(/^qu[eé] comer en\s+/i,'').trim()}
function run(){
 if(!fs.existsSync(DIST))return;
 let changed=0;
 function walk(dir,parts=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   if(e.isDirectory()){
    if(SKIP.has(e.name)||e.name.startsWith('.'))continue;
    walk(path.join(dir,e.name),parts.concat(e.name));
   }else if(e.name==='index.html'&&parts.length===1){
    const file=path.join(dir,e.name);let html=fs.readFileSync(file,'utf8');const before=html;
    const h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);if(!h1)continue;
    const raw=h1[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const name=cleanName(raw);if(!NON_FOOD.has(norm(name)))continue;
    // These are thematic SEO/category pages, not food pages. Remove the food-guide component.
    html=html.replace(/<section class="rf-food-guide">[\s\S]*?<\/section>/gi,'');
    html=html.replace(/<style id="rf-food-category-guide">[\s\S]*?<\/style>/gi,'');
    html=html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i,`<h1$1>${esc(name)}</h1>`);
    html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(name)} | Ruleta de Comida</title>`);
    if(html!==before){fs.writeFileSync(file,html,'utf8');changed++;}
   }
  }
 }
 walk(DIST);
 console.log(`[cleanup-non-food-guides] ${changed} páginas temáticas limpiadas; no se tratan como comidas.`);
}
if(require.main===module)run();
module.exports={run};
