const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const MOMENTS = [
  ['desayuno', 'Desayuno'],
  ['almuerzo', 'Almuerzo'],
  ['merienda', 'Merienda'],
  ['cena', 'Cena']
];
const FOODS = [
  'Menú del día casero','Ensalada completa','Pasta al pesto','Bocadillo contundente','Arroz con verduras','Tortilla de patatas','Pollo a la plancha','Lentejas express','Wrap de pollo','Gazpacho','Paella de verduras','Macarrones con tomate','Arroz con pollo','Garbanzos con espinacas','Filete con ensalada','Pasta boloñesa','Crema de verduras','Burrito de pollo','Ensalada de pasta','Croquetas con ensalada'
];
const CITIES = [
  ['madrid','Madrid'],['barcelona','Barcelona'],['valencia','Valencia'],['sevilla','Sevilla'],['zaragoza','Zaragoza'],['malaga','Málaga'],['murcia','Murcia'],['palma','Palma'],['las-palmas','Las Palmas'],['bilbao','Bilbao'],['alicante','Alicante'],['cordoba','Córdoba'],['valladolid','Valladolid'],['vigo','Vigo'],['gijon','Gijón'],['hospitalet','Hospitalet'],['vitoria','Vitoria'],['coruna','A Coruña'],['elche','Elche'],['granada','Granada'],['terrassa','Terrassa'],['badalona','Badalona'],['oviedo','Oviedo'],['sabadell','Sabadell'],['cartagena','Cartagena'],['jerez','Jerez'],['mostoles','Móstoles'],['alcala-de-henares','Alcalá de Henares'],['fuenlabrada','Fuenlabrada'],['leganes','Leganés'],['getafe','Getafe'],['alcorcon','Alcorcón'],['burgos','Burgos'],['santander','Santander'],['logrono','Logroño'],['badajoz','Badajoz'],['huelva','Huelva'],['salamanca','Salamanca'],['marbella','Marbella'],['lleida','Lleida'],['dos-hermanas','Dos Hermanas'],['tarragona','Tarragona'],['torrejon-de-ardoz','Torrejón de Ardoz'],['parla','Parla'],['mataro','Mataró'],['algeciras','Algeciras'],['santa-coloma','Santa Coloma'],['cadiz','Cádiz'],['alcobendas','Alcobendas'],['ourense','Ourense'],['reus','Reus'],['telde','Telde'],['barakaldo','Barakaldo'],['girona','Girona'],['roquetas-de-mar','Roquetas de Mar'],['santiago-de-compostela','Santiago de Compostela'],['caceres','Cáceres'],['lorca','Lorca'],['coslada','Coslada'],['las-rozas','Las Rozas'],['san-fernando','San Fernando'],['el-puerto-de-santa-maria','El Puerto de Santa María'],['san-sebastian-de-los-reyes','San Sebastián de los Reyes'],['cornella','Cornellà'],['melilla','Melilla'],['ceuta','Ceuta'],['pozo-alcon','Pozo Alcón'],['elgoibar','Elgoibar'],['alza','Alza'],['las-arte','Las Arte'],['vinaros','Vinaròs'],['torrelavega','Torrelavega'],['rivas-vaciamadrid','Rivas-Vaciamadrid'],['chiclana','Chiclana'],['torrent','Torrent'],['getxo','Getxo'],['velez-malaga','Vélez-Málaga'],['gandia','Gandía'],['aviles','Avilés']
];

const slug = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const CSS = `<style id="rf-separated-guide-selector">
.rf-guide-picker{max-width:1180px;margin:28px auto 0;padding:0 16px 10px}
.rf-guide-step{background:#fff;border:1px solid #eadfd7;border-radius:22px;padding:20px;margin:14px 0;box-shadow:0 8px 24px rgba(0,0,0,.05)}
.rf-guide-step[hidden]{display:none!important}.rf-guide-step-title{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:1.05rem}.rf-guide-step-number{display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:#fff0e5;color:#c2410c;font-weight:900}
.rf-guide-options{display:flex;flex-wrap:wrap;gap:8px}.rf-guide-option{appearance:none;border:1px solid #e7ddd5;background:#fff;border-radius:999px;padding:9px 13px;font:700 14px/1.2 system-ui,sans-serif;color:#3d2e28;cursor:pointer}.rf-guide-option:hover{border-color:#f97316}.rf-guide-option.is-active{background:#fff0e5;border-color:#f97316;color:#c2410c}
.rf-guide-city-search{width:100%;box-sizing:border-box;border:1px solid #e7ddd5;border-radius:14px;padding:12px 14px;margin:0 0 12px;font:inherit}.rf-guide-result{display:none;margin-top:16px;text-align:center}.rf-guide-result.is-visible{display:block}.rf-guide-result a{display:inline-block;background:#ef6c18;color:#fff;border-radius:999px;padding:12px 20px;font-weight:800;text-decoration:none}
@media(max-width:600px){.rf-guide-step{padding:16px;border-radius:18px}.rf-guide-option{font-size:13px;padding:9px 11px}}
</style>`;

function buildUI(){
  const momentButtons = MOMENTS.map(([slugValue,name]) => `<button class="rf-guide-option" type="button" data-guide-moment="${slugValue}">${name}</button>`).join('');
  const foodButtons = FOODS.map(name => `<button class="rf-guide-option" type="button" data-guide-food="${slug(name)}" data-guide-food-label="${esc(name)}">${esc(name)}</button>`).join('');
  const cityButtons = CITIES.map(([slugValue,name]) => `<button class="rf-guide-option" type="button" data-guide-city="${slugValue}">${esc(name)}</button>`).join('');
  return `<section class="rf-guide-picker" id="rfSeparatedGuidePicker" aria-label="Selector de guía por momento, comida y ciudad">
    <div class="rf-guide-step" data-guide-step="moment"><h3 class="rf-guide-step-title"><span class="rf-guide-step-number">1</span> Momento del día</h3><div class="rf-guide-options">${momentButtons}</div></div>
    <div class="rf-guide-step" data-guide-step="food" hidden><h3 class="rf-guide-step-title"><span class="rf-guide-step-number">2</span> Comida</h3><div class="rf-guide-options">${foodButtons}</div></div>
    <div class="rf-guide-step" data-guide-step="city" hidden><h3 class="rf-guide-step-title"><span class="rf-guide-step-number">3</span> Ciudad</h3><input class="rf-guide-city-search" id="rfGuideCitySearch" type="search" placeholder="Buscar ciudad…" aria-label="Buscar ciudad"><div class="rf-guide-options" id="rfGuideCities">${cityButtons}</div><div class="rf-guide-result" id="rfGuideResult"><a id="rfGuideResultLink" href="#">Ver guía →</a></div></div>
  </section>`;
}

const SCRIPT = `<script id="rf-separated-guide-selector-js">(function(){
function init(){
 var oldHeading=[].slice.call(document.querySelectorAll('h1,h2,h3,h4,p,div')).find(function(el){return el.children.length===0 && /^(elige comida y ciudad|selecciona una comida y una ciudad)$/i.test(el.textContent.trim());});
 if(!oldHeading)return;
 var oldContainer=oldHeading.closest('section')||oldHeading.parentElement;
 if(!oldContainer||oldContainer.id==='rfSeparatedGuidePicker'||document.getElementById('rfSeparatedGuidePicker'))return;
 var replacement=document.createElement('div'); replacement.innerHTML=${JSON.stringify(buildUI())};
 var picker=replacement.firstElementChild;
 oldContainer.replaceWith(picker);
 var moment=null, food=null, city=null;
 var foodStep=picker.querySelector('[data-guide-step="food"]'), cityStep=picker.querySelector('[data-guide-step="city"]');
 function update(){
   var link=picker.querySelector('#rfGuideResultLink');
   var result=picker.querySelector('#rfGuideResult');
   if(moment&&food&&city){link.href='/'+city+'/'+moment+'/'+food+'/';result.classList.add('is-visible');}
   else result.classList.remove('is-visible');
 }
 picker.addEventListener('click',function(e){
   var b=e.target.closest('.rf-guide-option'); if(!b)return;
   if(b.dataset.guideMoment){moment=b.dataset.guideMoment;picker.querySelectorAll('[data-guide-moment]').forEach(function(x){x.classList.toggle('is-active',x===b)});food=null;city=null;foodStep.hidden=false;cityStep.hidden=true;picker.querySelectorAll('[data-guide-food],[data-guide-city]').forEach(function(x){x.classList.remove('is-active')});update();return;}
   if(b.dataset.guideFood){food=b.dataset.guideFood;picker.querySelectorAll('[data-guide-food]').forEach(function(x){x.classList.toggle('is-active',x===b)});city=null;cityStep.hidden=false;picker.querySelectorAll('[data-guide-city]').forEach(function(x){x.classList.remove('is-active')});update();cityStep.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
   if(b.dataset.guideCity){city=b.dataset.guideCity;picker.querySelectorAll('[data-guide-city]').forEach(function(x){x.classList.toggle('is-active',x===b)});update();}
 });
 var search=picker.querySelector('#rfGuideCitySearch'); if(search)search.addEventListener('input',function(){var q=this.value.toLowerCase().trim();picker.querySelectorAll('[data-guide-city]').forEach(function(b){b.hidden=q && b.textContent.toLowerCase().indexOf(q)<0});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();</script>`;

function run(){
  if(!fs.existsSync(INDEX)) return false;
  let html=fs.readFileSync(INDEX,'utf8');
  if(html.includes('rf-separated-guide-selector')) return true;
  const injection = CSS + SCRIPT;
  html = html.replace(/<\/body>/i, injection + '</body>');
  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[fix-home-selector] Selector Momento -> Comida -> Ciudad añadido.');
  return true;
}
module.exports={run};
if(require.main===module)run();
