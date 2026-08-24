const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const SKIP=new Set(['assets','css','js','images']);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');}
function cleanFoodName(s){return String(s).replace(/^Gu[ií]a(?:s)? de comida\s*/i,'').replace(/^Qu[eé] comer en\s*/i,'').replace(/^D[oó]nde comer\s*/i,'').trim();}
function cleanLegacyLabels(html){
  html=html.replace(/D[oó]nde comer\s+Qu[eé] comer en\s+([^<.!?]+)(?=<|[.!?])/gi,'Dónde comer $1');
  html=html.replace(/Qu[eé] comer en\s+([^<.!?]+)(?=<|[.!?])/gi,'Dónde comer $1');
  return html;
}
function guideFor(food){
  const f=esc(food);
  const lower=String(food).toLowerCase();
  let extra='';
  if(lower.includes('pizza')) extra='<h2>Qué buscar en una buena pizza</h2><p>Para encontrar una buena pizza, fíjate en la calidad de la masa, el punto de horneado, los ingredientes y el equilibrio entre sabor y precio. Una <strong>pizza artesanal</strong> suele destacar por una masa bien fermentada, ingredientes frescos y un horneado cuidado.</p><h3>Cómo elegir una buena pizzería</h3><ul><li>Revisa opiniones recientes y comentarios sobre la comida.</li><li>Comprueba qué tipo de horno utiliza y cómo describe su masa.</li><li>Busca ingredientes frescos y una carta que tenga especialización.</li><li>Compara precios con tamaño, calidad y ubicación.</li><li>Elige el estilo que prefieras: masa fina, crujiente, napolitana u otras variedades.</li></ul><p>Si buscas <strong>dónde comer pizza</strong>, compara varias opciones de tu zona y prioriza la calidad de la masa, los ingredientes y las reseñas recientes antes de decidir.</p>';
  else extra='<h2>Cómo elegir un buen lugar para comer '+f+'</h2><p>Elegir dónde comer '+f+' depende de la calidad, el precio, la ubicación y tus preferencias. Compara restaurantes y establecimientos, revisa opiniones recientes y comprueba qué ingredientes o especialidades ofrecen.</p><h3>Qué valorar antes de elegir</h3><ul><li><strong>Calidad:</strong> busca ingredientes frescos y una preparación cuidada.</li><li><strong>Opiniones:</strong> presta atención a reseñas recientes y comentarios sobre el plato.</li><li><strong>Precio:</strong> compara el coste con las cantidades y la calidad ofrecida.</li><li><strong>Ubicación:</strong> considera distancia, horarios y facilidad para comer allí.</li><li><strong>Preferencias:</strong> elige el estilo de '+f+' que mejor encaje contigo.</li></ul><p>Si buscas <strong>dónde comer '+f+'</strong>, comparar varias opciones antes de elegir te ayudará a encontrar un lugar que combine buena comida, precio razonable y una experiencia acorde a lo que buscas.</p>';
  return `<section class="food-seo-guide" aria-label="Guía para elegir dónde comer ${f}"><h2>Guía para elegir dónde comer ${f}</h2><p>Aprende a encontrar un buen lugar donde comer ${f} y descubre qué factores conviene revisar antes de elegir.</p>${extra}</section>`;
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
            if(!html.includes('class="food-seo-guide"')){
              const guide=guideFor(foodName);
              html=html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i,`$1${guide}`);
            }
          }
        }
        if(html!==before){fs.writeFileSync(file,html,'utf8');changed++;}
      }
    }
  }
  walk(DIST);
  console.log(`[food-page-wording] OK: ${changed} HTML procesados; títulos "Dónde comer [comida]" y guías SEO añadidas.`);
}
if(require.main===module)run();
module.exports={run};
