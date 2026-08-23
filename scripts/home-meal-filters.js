/**
 * Filtros de momento del día en la ruleta HOME.
 * FIX: no romper la sintaxis de DISHES (antes: paréntesis sin cerrar → ruleta en blanco).
 */
const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const MERENDA_DISHES = `
window.__RF_MERENDA = [
  { name:'Yogur con fruta', meal:'Merienda', time:5, budget:'€', desc:'Ligero y rápido.' },
  { name:'Tostada con mermelada', meal:'Merienda', time:5, budget:'€', desc:'Clásico de tarde.' },
  { name:'Café y galleta', meal:'Merienda', time:5, budget:'€', desc:'Pausa corta.' },
  { name:'Batido de plátano', meal:'Merienda', time:8, budget:'€', desc:'Energía fácil.' },
  { name:'Puñado de frutos secos', meal:'Merienda', time:2, budget:'€', desc:'Sin platos.' },
  { name:'Chocolate a la taza', meal:'Merienda', time:10, budget:'€', desc:'Para días fríos.' },
  { name:'Sándwich vegetal', meal:'Merienda', time:10, budget:'€', desc:'Algo más contundente.' },
  { name:'Zumo y magdalena', meal:'Merienda', time:5, budget:'€', desc:'Simple y efectivo.' }
];
`;

const FILTER_CSS = `<style id="rf-meal-filters-css">
.rf-meal-filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px auto 4px;max-width:560px;padding:0 12px;position:relative;z-index:5}
.rf-meal-filters button{min-height:38px;padding:8px 14px;border-radius:999px;border:1.5px solid rgba(0,0,0,.1);background:#fff;color:#3d2e28;font-size:.84rem;font-weight:700;cursor:pointer;transition:border-color .2s,background .2s,color .2s,transform .15s}
.rf-meal-filters button:hover{border-color:#ff6b1a;color:#c2410c;transform:translateY(-1px)}
.rf-meal-filters button.is-active{border-color:#ff6b1a;background:linear-gradient(135deg,#fff7ed,#ffedd5);color:#c2410c;box-shadow:0 4px 12px rgba(255,100,30,.12)}
.rf-meal-filters-hint{text-align:center;font-size:.78rem;color:#7a6358;margin:0 0 12px}
@media(max-width:767px){.rf-meal-filters{gap:6px}.rf-meal-filters button{min-height:36px;padding:7px 11px;font-size:.78rem}}
</style>`;

const FILTER_UI = `
<div class="rf-meal-filters" id="rfMealFilters" role="group" aria-label="Momento del día">
  <button type="button" data-meal="Todos" class="is-active">Todos</button>
  <button type="button" data-meal="Desayuno">Desayuno</button>
  <button type="button" data-meal="Comida">Comida</button>
  <button type="button" data-meal="Merienda">Merienda</button>
  <button type="button" data-meal="Cena">Cena</button>
</div>
<p class="rf-meal-filters-hint" id="rfMealFiltersHint">Elige el momento y gira la ruleta</p>`;

const FILTER_JS = `<script id="rf-meal-filters-js">
(function(){
  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn);
    else fn();
  }
  function normalizeMeal(m){
    m = String(m||'').toLowerCase();
    if(m.indexOf('desay')>=0) return 'Desayuno';
    if(m.indexOf('almuerz')>=0 || m==='comida') return 'Comida';
    if(m.indexOf('meriend')>=0) return 'Merienda';
    if(m.indexOf('cena')>=0) return 'Cena';
    return m;
  }
  function getAllDishes(){
    var base = (window.__RF_DISHES_ALL && window.__RF_DISHES_ALL.length) ? window.__RF_DISHES_ALL.slice() : [];
    var mer = window.__RF_MERENDA || [];
    var hasMer = base.some(function(d){ return normalizeMeal(d.meal)==='Merienda'; });
    return hasMer ? base : base.concat(mer);
  }
  function filterDishes(key){
    var all = getAllDishes();
    if(!all.length) return all;
    if(!key || key==='Todos') return all.slice();
    var out = all.filter(function(d){ return normalizeMeal(d.meal)===key; });
    if(out.length < 6){
      var extra = all.filter(function(d){ return normalizeMeal(d.meal)!==key; });
      out = out.concat(extra.slice(0, Math.max(0, 8-out.length)));
    }
    return out.length ? out : all.slice();
  }
  function applyFilter(key){
    var r = window.__rfRoulette;
    if(!r) return;
    var list = filterDishes(key);
    if(!list.length) return;
    r.dishes = list;
    if(typeof r.draw==='function') r.draw();
    var hint = document.getElementById('rfMealFiltersHint');
    if(hint){
      hint.textContent = key==='Todos'
        ? 'Todas las ideas · Gira cuando quieras'
        : 'Modo ' + key + ' · ' + list.length + ' opciones';
    }
    var result = document.getElementById('result');
    if(result) result.classList.add('hidden');
  }
  function wireUI(){
    var box = document.getElementById('rfMealFilters');
    if(!box) return;
    box.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-meal]');
      if(!btn) return;
      box.querySelectorAll('button').forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-meal'));
    });
  }
  function waitRoulette(tries){
    tries = tries || 0;
    if(window.__rfRoulette && window.__RF_DISHES_ALL && window.__RF_DISHES_ALL.length){
      wireUI();
      try{
        var q = new URLSearchParams(location.search).get('meal');
        if(q){
          var map = {desayuno:'Desayuno',comida:'Comida',almuerzo:'Comida',merienda:'Merienda',cena:'Cena'};
          var key = map[String(q).toLowerCase()] || q;
          var btn = document.querySelector('#rfMealFilters button[data-meal="'+key+'"]');
          if(btn) btn.click();
        }
      }catch(e){}
      return;
    }
    if(tries < 50) setTimeout(function(){ waitRoulette(tries+1); }, 120);
  }
  ready(function(){ waitRoulette(0); });
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) {
    console.warn('[home-meal-filters] index.html no encontrado');
    return false;
  }

  let html = fs.readFileSync(INDEX, 'utf8');

  // --- REPAIR: deshacer el bug de paréntesis sin cerrar ---
  // var DISHES = (window.__RF_DISHES_ALL = [  ...  ];  →  var DISHES = [ ... ];
  html = html.replace(
    /var DISHES = \(window\.__RF_DISHES_ALL = \[/g,
    'var DISHES = ['
  );
  // Si quedó un ]); mal puesto, normalizar cierre del array DISHES
  // No tocamos otros arrays.

  // Limpiar hooks duplicados previos
  html = html.replace(/\n\s*window\.__RF_DISHES_ALL = DISHES\.slice\(\);\n?/g, '\n');
  html = html.replace(/\n\s*window\.__RF_DISHES_ALL = window\.__RF_DISHES_ALL \|\| DISHES\.slice\(\);\n?/g, '\n');
  html = html.replace(/\n\s*window\.__rfRoulette = roulette;\n?/g, '\n');
  html = html.replace(/window\.__RF_MERENDA = \[[\s\S]*?\];\n?/g, '');

  // Hook limpio tras el array DISHES (sin romper sintaxis)
  if (!html.includes('window.__RF_DISHES_ALL = DISHES.slice()')) {
    html = html.replace(
      /(var DISHES = \[[\s\S]*?\];)/,
      '$1\n  window.__RF_DISHES_ALL = DISHES.slice();\n  ' + MERENDA_DISHES
    );
  }

  // Exponer instancia de la ruleta
  if (!html.includes('window.__rfRoulette = roulette')) {
    html = html.replace(
      /var roulette = new Roulette\(canvas, DISHES\);/,
      'var roulette = new Roulette(canvas, DISHES);\n    window.__rfRoulette = roulette;'
    );
  }

  // CSS
  html = html.replace(/<style id="rf-meal-filters-css">[\s\S]*?<\/style>/i, '');
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, FILTER_CSS + '</head>');
  }

  // UI: quitar duplicados y colocar ANTES del botón girar (no dentro del canvas)
  html = html.replace(/<div class="rf-meal-filters"[\s\S]*?<\/div>\s*<p class="rf-meal-filters-hint"[\s\S]*?<\/p>/gi, '');

  if (!html.includes('id="rfMealFilters"')) {
    // Preferir insertar justo antes de spinBtn
    if (/id=["']spinBtn["']/.test(html)) {
      html = html.replace(/(<[^>]*id=["']spinBtn["'][^>]*>)/i, FILTER_UI + '\n$1');
    } else if (/id=["']ruleta["']/.test(html)) {
      // al final del bloque ruleta es más seguro que al inicio (evita overlay en canvas)
      html = html.replace(/(id=["']ruleta["'][\s\S]{0,2500}?)(<button[^>]*id=["']spinBtn["'])/i, '$1' + FILTER_UI + '\n$2');
    }
  }

  // JS
  html = html.replace(/<script id="rf-meal-filters-js">[\s\S]*?<\/script>/i, '');
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, FILTER_JS + '</body>');
  }

  // Verificación mínima de sintaxis DISHES
  if (/var DISHES = \(window\.__RF_DISHES_ALL/.test(html)) {
    console.warn('[home-meal-filters] AÚN hay asignación rota de DISHES');
  }

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-meal-filters] Ruleta restaurada + filtros OK');
  return true;
}

if (require.main === module) run();
module.exports = { run };
