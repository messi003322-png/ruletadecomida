const fs=require('fs');
const path=require('path');
const INDEX=path.join(__dirname,'..','dist','index.html');
function run(){
  if(!fs.existsSync(INDEX))return false;
  let html=fs.readFileSync(INDEX,'utf8');
  const old="g.href=ok?'/'+state.city+'/'+G[state.moment]+'/':'#'";
  const next="g.href=ok?'/'+state.city+'/'+G[state.moment]+'/'+encodeURIComponent(String(state.meal).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))+'/':'#'";
  if(!html.includes(old)){
    if(html.includes(next))return true;
    throw new Error('No se encontró el enlace de resultado de la ruleta para corregirlo.');
  }
  html=html.replace(old,next);
  fs.writeFileSync(INDEX,html,'utf8');
  console.log('[fix-roulette-guide-link] OK: la ruleta abre la guía individual seleccionada.');
  return true;
}
if(require.main===module)run();
module.exports={run};
