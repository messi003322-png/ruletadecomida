/**
 * Directorio guía en 3 bloques:
 * 1) Momento → 2) 20 platos según momento → 3) Ciudad
 * Ver guía → /{ciudad}/{momento}/
 */
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
        </div>
`;

const GUIDE_JS = `<script id="rf-guide-moment-js">
(function(){
  var PLATOS = {
    desayuno: [
      'Tostadas con tomate','Huevos revueltos','Yogur con fruta','Avena con frutos secos','Café con bollería',
      'Churros o porras','Tostada de aguacate','Zumo y tostada integral','Tortilla francesa','Bowl de fruta',
      'Porridge de avena','Croissant','Bocadillo de jamón','Pan con aceite','Smoothie verde',
      'Huevos revueltos con jamón','Crepes dulces','Queso fresco con miel','Cereal con leche','Tostada integral'
    ],
    almuerzo: [
      'Menú del día','Ensalada completa','Pasta al pesto','Bocadillo contundente','Arroz con verduras',
      'Tortilla de patatas','Pollo a la plancha','Lentejas express','Wrap de pollo','Gazpacho',
      'Paella rápida','Ensalada de quinoa','Hamburguesa casera','Bowl de poke','Pizza de sartén',
      'Curry de garbanzos','Noodles salteados','Sopa de verduras','Fajitas de pollo','Arroz frito'
    ],
    merienda: [
      'Yogur con fruta','Tostada con mermelada','Café y galleta','Batido de plátano','Frutos secos',
      'Chocolate a la taza','Sándwich vegetal','Zumo y magdalena','Pieza de fruta','Bizcocho casero',
      'Tostada con aceite','Helado','Churros','Galletas con leche','Batido de cacao',
      'Hummus con pan','Queso y pan','Smoothie de frutos rojos','Barrita de cereales','Café solo'
    ],
    cena: [
      'Pasta cremosa','Tacos de pollo','Ramen de miso','Tortilla de patatas','Salmón a la plancha',
      'Pizza de sartén','Arroz frito','Quesadillas','Ensalada de garbanzos','Crema de calabaza',
      'Hamburguesa casera','Noodles salteados','Wrap de pollo','Sopa de tomate','Pollo al ajillo',
      'Tortilla francesa','Ensalada César','Pasta al pesto','Pescado a la plancha','Revuelto de verduras'
    ]
  };
  var LABEL_M = { desayuno:'Desayuno', almuerzo:'Almuerzo', merienda:'Merienda', cena:'Cena' };
  var state = { momento:'', plato:'', ciudad:'' };

  function $(id){ return document.getElementById(id); }

  function cls(on, kind){
    if(kind==='ciudad') return on
      ? 'js-ciudad chip-btn is-on rounded-full border border-stone-900 bg-stone-900 px-3 py-1.5 text-sm font-medium text-white shadow-md'
      : 'js-ciudad chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand';
    if(kind==='moment') return on
      ? 'js-moment chip-btn is-on rounded-full border border-brand bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-md'
      : 'js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand';
    return on
      ? 'js-plato chip-btn is-on rounded-full border border-brand bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-md'
      : 'js-plato chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand';
  }

  function renderPlatos(){
    var box = $('dir-platos') || $('dir-comidas');
    if(!box) return;
    if(!state.momento){
      box.innerHTML = '<p class="rf-muted-hint">Elige un momento arriba y aquí aparecerán <strong>20 platos</strong> de ese momento.</p>';
      state.plato = '';
      return;
    }
    var list = PLATOS[state.momento] || [];
    box.innerHTML = list.map(function(name){
      return '<button type="button" data-plato="'+name.replace(/"/g,'"')+'" class="'+cls(state.plato===name,'plato')+'">'+name+'</button>';
    }).join('');
  }

  function updateGo(){
    var sel = $('dir-selection');
    var go = $('dir-go');
    if(!sel || !go) return;
    var ciudadLabel = '';
    if(state.ciudad){
      var b = document.querySelector('#dir-ciudades [data-ci="'+state.ciudad+'"]');
      ciudadLabel = b ? b.textContent.trim() : state.ciudad;
    }
    var bits = [];
    if(state.momento) bits.push(LABEL_M[state.momento]);
    if(state.plato) bits.push(state.plato);
    if(ciudadLabel) bits.push(ciudadLabel);

    if(state.momento && state.ciudad){
      sel.textContent = bits.join(' · ');
      go.href = '/' + encodeURIComponent(state.ciudad) + '/' + encodeURIComponent(state.momento) + '/';
      go.className = 'mt-4 inline-flex rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand';
      go.style.pointerEvents = 'auto';
      go.removeAttribute('aria-disabled');
      go.tabIndex = 0;
      return;
    }
    if(state.momento && !state.ciudad){
      sel.textContent = (LABEL_M[state.momento]||'') + (state.plato ? ' · '+state.plato : '') + ' · ahora elige ciudad';
    } else {
      sel.textContent = '1) Momento → 2) Plato → 3) Ciudad';
    }
    go.href = '#';
    go.className = 'mt-4 inline-flex rounded-full bg-stone-300 px-6 py-2.5 text-sm font-semibold text-white pointer-events-none';
    go.style.pointerEvents = 'none';
    go.setAttribute('aria-disabled','true');
    go.tabIndex = -1;
  }

  function relabel(){
    var platos = $('dir-platos') || $('dir-comidas');
    if(platos){
      var h = platos.previousElementSibling;
      if(h && h.tagName==='H3'){
        h.innerHTML = '<span class="grid h-5 w-5 place-items-center rounded-full bg-stone-900 text-[10px] text-white">2</span> Comida <span class="normal-case font-medium tracking-normal text-stone-400">(20 platos según el momento)</span>';
      }
    }
    var ci = $('dir-ciudades');
    if(ci){
      var h2 = ci.previousElementSibling;
      if(h2 && h2.tagName==='H3'){
        h2.innerHTML = '<span class="grid h-5 w-5 place-items-center rounded-full bg-stone-900 text-[10px] text-white">3</span> Ciudad';
      }
    }
    var root = $('directorio');
    if(root){
      var lead = root.querySelector('p.mt-2, p.text-center');
      if(lead) lead.textContent = '1 Momento · 2 Plato (20 por tipo) · 3 Ciudad';
    }
  }

  function wire(){
    var platosBox = $('dir-platos') || $('dir-comidas');
    if(platosBox && platosBox.id === 'dir-comidas') platosBox.id = 'dir-platos';
    platosBox = $('dir-platos');
    var ciudadesBox = $('dir-ciudades');
    var momentos = $('dir-momentos');

    if(platosBox) platosBox.onclick = null;

    relabel();
    renderPlatos();
    updateGo();

    if(momentos){
      momentos.addEventListener('click', function(e){
        var btn = e.target.closest('[data-m]');
        if(!btn) return;
        var m = btn.getAttribute('data-m');
        state.momento = (state.momento === m) ? '' : m;
        state.plato = '';
        momentos.querySelectorAll('.js-moment').forEach(function(b){
          b.className = cls(b.getAttribute('data-m') === state.momento, 'moment');
        });
        renderPlatos();
        updateGo();
      });
    }

    if(platosBox){
      platosBox.addEventListener('click', function(e){
        var btn = e.target.closest('[data-plato]');
        if(!btn) return;
        var p = btn.getAttribute('data-plato');
        state.plato = (state.plato === p) ? '' : p;
        platosBox.querySelectorAll('.js-plato').forEach(function(b){
          b.className = cls(b.getAttribute('data-plato') === state.plato, 'plato');
        });
        updateGo();
      });
    }

    if(ciudadesBox){
      ciudadesBox.addEventListener('click', function(e){
        var btn = e.target.closest('[data-ci]');
        if(!btn) return;
        state.ciudad = btn.getAttribute('data-ci');
        ciudadesBox.querySelectorAll('.js-ciudad').forEach(function(b){
          b.className = cls(b.getAttribute('data-ci') === state.ciudad, 'ciudad');
        });
        updateGo();
      }, true);
    }
  }

  function boot(){
    var tries = 0;
    (function wait(){
      tries++;
      var ci = $('dir-ciudades');
      if(ci && ci.children.length > 5){ wire(); return; }
      if(tries < 50) setTimeout(wait, 100);
      else wire();
    })();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) {
    console.warn('[home-guide-moment] sin index');
    return false;
  }
  let html = fs.readFileSync(INDEX, 'utf8');

  html = html.replace(/<style id="rf-guide-3blocks-css">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<\/head>/i, GUIDE_CSS + '</head>');

  html = html.replace(/<h3[^>]*>[\s\S]*?Momento del d[ií]a[\s\S]*?<\/h3>\s*<div id="dir-momentos"[\s\S]*?<\/div>/gi, '');

  if (!html.includes('id="dir-momentos"')) {
    if (/id="dir-comidas"/.test(html) || /id="dir-platos"/.test(html)) {
      html = html.replace(
        /(<h3[^>]*>[\s\S]{0,200}?Comida[\s\S]{0,120}?<\/h3>\s*<div id="dir-(?:comidas|platos)")/i,
        MOMENT_BLOCK + '\n$1'
      );
    }
  }

  html = html.replace(/id="dir-comidas"/, 'id="dir-platos"');

  html = html.replace(
    /20 comidas · 79 ciudades · Toca una de cada para abrir la guía/g,
    '1 Momento · 2 Plato (20 por tipo) · 3 Ciudad'
  );
  html = html.replace(
    /Momento · comida · ciudad · Toca para abrir la guía/g,
    '1 Momento · 2 Plato (20 por tipo) · 3 Ciudad'
  );

  html = html.replace(/<script id="rf-guide-moment-js">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<\/body>/i, GUIDE_JS + '</body>');

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-guide-moment] 3 bloques: Momento → 20 platos → Ciudad');
  return true;
}

if (require.main === module) run();
module.exports = { run };
