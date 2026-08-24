const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const BLOCK = `<h3 class="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500"><span class="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] text-white">1</span> Momento del día</h3><div id="dir-momentos" class="mt-3 flex flex-wrap gap-2"><button type="button" data-m="desayuno" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Desayuno</button><button type="button" data-m="almuerzo" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Almuerzo</button><button type="button" data-m="merienda" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Merienda</button><button type="button" data-m="cena" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Cena</button></div>`;

const SCRIPT = `<script id="rf-restore-moment-js">(function(){function add(){var d=document.getElementById('directorio');if(!d)return;var m=document.getElementById('dir-momentos');if(m)return;var h=Array.from(d.querySelectorAll('h3')).find(function(x){return /momento del d[ií]a/i.test(x.textContent)});if(h)return;var city=document.getElementById('dir-ciudades'),citiesH=city&&city.previousElementSibling;var anchor=citiesH&&/ciudad/i.test(citiesH.textContent)?citiesH:null;if(!anchor){anchor=Array.from(d.querySelectorAll('h3')).find(function(x){return /ciudad/i.test(x.textContent)});}if(anchor){anchor.insertAdjacentHTML('beforebegin',${JSON.stringify(BLOCK)});return;}var plato=document.getElementById('dir-platos')||document.getElementById('dir-comidas');if(plato){plato.insertAdjacentHTML('beforebegin',${JSON.stringify(BLOCK)});}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();})();</script>`;

function run(){
  if(!fs.existsSync(INDEX)) return false;
  let html=fs.readFileSync(INDEX,'utf8');
  html=html.replace(/<script id="rf-restore-moment-js">[\s\S]*?<\/script>/i,'');
  html=html.replace(/<\/body>/i,SCRIPT+'</body>');
  fs.writeFileSync(INDEX,html,'utf8');
  return true;
}
if(require.main===module)run();
module.exports={run};
