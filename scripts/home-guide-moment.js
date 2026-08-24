const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const GUIDE_CSS = `<style id="rf-guide-3blocks-css">
#directorio #dir-platos{min-height:2.5rem}
#directorio #dir-platos .rf-muted-hint{width:100%;color:#78716c;font-size:.9rem;padding:.35rem 0}
#directorio .js-plato.is-on,#directorio .js-moment.is-on{border-color:#f97316!important;background:#f97316!important;color:#fff!important}
#directorio .js-ciudad.is-on{border-color:#1c1917!important;background:#1c1917!important;color:#fff!important}
</style>`;

const MOMENT_BLOCK = `
<h3 class="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500">
<span class="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] text-white">1</span> Momento del día
</h3>
<div id="dir-momentos" class="mt-3 flex flex-wrap gap-2">
<button type="button" data-m="desayuno" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Desayuno</button>
<button type="button" data-m="almuerzo" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Almuerzo</button>
<button type="button" data-m="merienda" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Merienda</button>
<button type="button" data-m="cena" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">Cena</button>
</div>`;

const GUIDE_JS = `<script id="rf-guide-moment-js">
(function(){
var PLATOS={
desayuno:['Tostadas con tomate','Huevos revueltos','Yogur con fruta','Avena con frutos secos','Café con bollería','Churros o porras','Tostada de aguacate','Zumo y tostada integral','Tortilla francesa','Bowl de fruta','Porridge de avena','Croissant','Bocadillo de jamón','Pan con aceite','Smoothie verde','Huevos revueltos con jamón','Crepes dulces','Queso fresco con miel','Cereal con leche','Tostada integral'],
almuerzo:['Menú del día','Ensalada completa','Pasta al pesto','Bocadillo contundente','Arroz con verduras','Tortilla de patatas','Pollo a la plancha','Lentejas express','Wrap de pollo','Gazpacho','Paella rápida','Ensalada de quinoa','Hamburguesa casera','Bowl de poke','Pizza de sartén','Curry de garbanzos','Noodles salteados','Sopa de verduras','Fajitas de pollo','Arroz frito'],
merienda:['Yogur con fruta','Tostada con mermelada','Café y galleta','Batido de plátano','Frutos secos','Chocolate a la taza','Sándwich vegetal','Zumo y magdalena','Pieza de fruta','Bizcocho casero','Tostada con aceite','Helado','Churros','Galletas con leche','Batido de cacao','Hummus con pan','Queso y pan','Smoothie de frutos rojos','Barrita de cereales','Café solo'],
cena:['Pasta cremosa','Tacos de pollo','Ramen de miso','Tortilla de patatas','Salmón a la plancha','Pizza de sartén','Arroz frito','Quesadillas','Ensalada de garbanzos','Crema de calabaza','Hamburguesa casera','Noodles salteados','Wrap de pollo','Sopa de tomate','Pollo al ajillo','Tortilla francesa','Ensalada César','Pasta al pesto','Pescado a la plancha','Revuelto de verduras']};
var LABEL={desayuno:'Desayuno',almuerzo:'Almuerzo',merienda:'Merienda',cena:'Cena'},state={momento:'',plato:'',ciudad:''};
function $(id){return document.getElementById(id)}
function cls(on,k){return k==='ciudad'?(on?'js-ciudad chip-btn is-on rounded-full border border-stone-900 bg-stone-900 px-3 py-1.5 text-sm font-medium text-white shadow-md':'js-ciudad chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm'):k==='moment'?(on?'js-moment chip-btn is-on rounded-full border border-brand bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-md':'js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm'):(on?'js-plato chip-btn is-on rounded-full border border-brand bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-md':'js-plato chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm')}
function renderPlatos(){var box=$('dir-platos');if(!box)return;if(!state.momento){box.innerHTML='<p class="rf-muted-hint">Elige un momento arriba y aquí aparecerán <strong>20 platos</strong>.</p>';return}box.innerHTML=PLATOS[state.momento].map(function(n){return '<button type="button" data-plato="'+n.replace(/"/g,'&quot;')+'" class="'+cls(state.plato===n,'plato')+'">'+n+'</button>'}).join('')}
function updateGo(){var sel=$('dir-selection'),go=$('dir-go');if(!sel||!go)return;var ci=$('dir-ciudades'),b=ci&&state.ciudad?ci.querySelector('[data-ci="'+CSS.escape(state.ciudad)+'"]'):null,label=b?b.textContent.trim():state.ciudad;var bits=[];if(state.momento)bits.push(LABEL[state.momento]);if(state.plato)bits.push(state.plato);if(label)bits.push(label);if(state.momento&&state.ciudad){sel.textContent=bits.join(' · ');go.href='/'+encodeURIComponent(state.ciudad)+'/'+encodeURIComponent(state.momento)+'/';go.className='mt-4 inline-flex rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white';go.style.pointerEvents='auto';go.removeAttribute('aria-disabled');go.tabIndex=0}else{sel.textContent=state.momento?(LABEL[state.momento]+(state.plato?' · '+state.plato:'')+' · ahora elige ciudad'):'1) Momento → 2) Plato → 3) Ciudad';go.href='#';go.className='mt-4 inline-flex rounded-full bg-stone-300 px-6 py-2.5 text-sm font-semibold text-white pointer-events-none';go.style.pointerEvents='none';go.setAttribute('aria-disabled','true');go.tabIndex=-1}}
function wire(){var platos=$('dir-platos')||$('dir-comidas'),ci=$('dir-ciudades'),momentos=$('dir-momentos');if(!platos||!ci)return;if(platos.id==='dir-comidas')platos.id='dir-platos';renderPlatos();updateGo();
if(momentos&&!momentos.dataset.wired){momentos.dataset.wired='1';momentos.addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;state.momento=state.momento===b.dataset.m?'':b.dataset.m;state.plato='';momentos.querySelectorAll('.js-moment').forEach(function(x){x.className=cls(x.dataset.m===state.momento,'moment')});renderPlatos();updateGo()})}
if(platos&&!platos.dataset.wired){platos.dataset.wired='1';platos.addEventListener('click',function(e){var b=e.target.closest('[data-plato]');if(!b)return;state.plato=state.plato===b.dataset.plato?'':b.dataset.plato;platos.querySelectorAll('.js-plato').forEach(function(x){x.className=cls(x.dataset.plato===state.plato,'plato')});updateGo()})}
if(ci&&!ci.dataset.wired){ci.dataset.wired='1';ci.addEventListener('click',function(e){var b=e.target.closest('[data-ci]');if(!b)return;state.ciudad=b.dataset.ci;ci.querySelectorAll('.js-ciudad').forEach(function(x){x.className=cls(x.dataset.ci===state.ciudad,'ciudad')});updateGo()},true)}}
function boot(){var tries=0;(function wait(){tries++;var ci=$('dir-ciudades'),pl=$('dir-platos')||$('dir-comidas');if(ci&&pl){if(pl.id==='dir-comidas')pl.id='dir-platos';wire();return}if(tries<100)setTimeout(wait,100)})()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();</script>`;

function run(){if(!fs.existsSync(INDEX)){console.warn('[home-guide-moment] sin index');return false}let html=fs.readFileSync(INDEX,'utf8');html=html.replace(/<style id="rf-guide-3blocks-css">[\s\S]*?<\/style>/i,'');html=html.replace(/<\/head>/i,GUIDE_CSS+'</head>');html=html.replace(/<h3[^>]*>[\s\S]*?Momento del d[ií]a[\s\S]*?<\/h3>\s*<div id="dir-momentos"[\s\S]*?<\/div>/gi,'');if(!html.includes('id="dir-momentos"')&&(html.includes('id="dir-comidas"')||html.includes('id="dir-platos"')))html=html.replace(/(<h3[^>]*>[\s\S]{0,200}?Comida[\s\S]{0,120}?<\/h3>\s*<div id="dir-(?:comidas|platos)")/i,MOMENT_BLOCK+'\n$1');html=html.replace(/id="dir-comidas"/g,'id="dir-platos"');html=html.replace(/<script id="rf-guide-moment-js">[\s\S]*?<\/script>/i,'');html=html.replace(/<\/body>/i,GUIDE_JS+'</body>');fs.writeFileSync(INDEX,html,'utf8');return true}
if(require.main===module)run();module.exports={run};
