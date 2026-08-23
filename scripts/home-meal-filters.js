/**
 * Filtros de momento del día en la ruleta de la HOME.
 * - UI: Desayuno | Comida | Merienda | Cena | Todos
 * - Cambia el array de platos de la ruleta según el filtro
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
];`;

const FILTER_CSS = `<style id="rf-meal-filters-css">
.rf-meal-filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px auto 6px;max-width:520px;padding:0 12px}
.rf-meal-filters button{min-height:38px;padding:8px 14px;border-radius:999px;border:1.5px solid rgba(0,0,0,.1);background:#fff;color:#3d2e28;font-size:.84rem;font-weight:700;cursor:pointer;transition:border-color .2s,background .2s,color .2s,transform .15s}
.rf-meal-filters button:hover{border-color:#ff6b1a;color:#c2410c;transform:translateY(-1px)}
.rf-meal-filters button.is-active{border-color:#ff6b1a;background:linear-gradient(135deg,#fff7ed,#ffedd5);color:#c2410c;box-shadow:0 4px 12px rgba(255,100,30,.12)}
.rf-meal-filters-hint{text-align:center;font-size:.78rem;color:#7a6358;margin:0 0 10px}
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
    var base = window.__RF_DISHES_ALL || [];
    var mer = window.__RF_MERENDA || [];
    // Evitar duplicar si ya hay merienda en base
    var hasMer = base.some(function(d){ return normalizeMeal(d.meal)==='Merienda'; });
    return hasMer ? base.slice() : base.concat(mer);
  }

  function filterDishes(key){
    var all = getAllDishes();
    if(!key || key==='Todos') return all.slice();
    var out = all.filter(function(d){ return normalizeMeal(d.meal)===key; });
    // Si el filtro deja muy pocos, completar con ideas afines del resto
    if(out.length < 6){
      var extra = all.filter(function(d){ return normalizeMeal(d.meal)!==key; });
      out = out.concat(extra.slice(0, Math.max(0, 8-out.length)));
    }
    return out.length ? out : all.slice();
  }

  function applyFilter(key){
    var r = window.__rfRoulette;
    if(!r || !r.dishes) return;
    var list = filterDishes(key);
    r.dishes = list;
    if(typeof r.draw==='function') r.draw();
    var hint = document.getElementById('rfMealFiltersHint');
    if(hint){
      hint.textContent = key==='Todos'
        ? 'Todas las ideas · Gira cuando quieras'
        : 'Modo ' + key + ' · ' + list.length + ' opciones en la ruleta';
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
    if(window.__rfRoulette){
      wireUI();
      // Aplicar ?meal= de la URL si existe
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
    if(tries < 40) setTimeout(function(){ waitRoulette(tries+1); }, 100);
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

  // Exponer DISHES y roulette (hooks en el código existente)
  if (!html.includes('window.__RF_DISHES_ALL')) {
    html = html.replace(
      /var DISHES = \[/, 
      'var DISHES = (window.__RF_DISHES_ALL = ['
    );
    // Cerrar el assignment: tras el ]; de DISHES no es trivial; mejor otra vía
  }

  // Más robusto: tras el array DISHES completo
  if (!html.includes('window.__RF_DISHES_ALL')) {
    html = html.replace(
      /(var DISHES = \[[\s\S]*?\];)/,
      '$1\n  window.__RF_DISHES_ALL = DISHES.slice();\n  ' + MERENDA_DISHES + '\n'
    );
  }

  if (!html.includes('window.__rfRoulette')) {
    html = html.replace(
      /var roulette = new Roulette\(canvas, DISHES\);/,
      'var roulette = new Roulette(canvas, DISHES);\n    window.__rfRoulette = roulette;\n    window.__RF_DISHES_ALL = window.__RF_DISHES_ALL || DISHES.slice();'
    );
  }

  // CSS
  html = html.replace(/<style id="rf-meal-filters-css">[\s\S]*?<\/style>/i, '');
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, FILTER_CSS + '</head>');
  }

  // UI cerca de la ruleta / botón girar
  html = html.replace(/<div class="rf-meal-filters"[\s\S]*?<\/div>\s*<p class="rf-meal-filters-hint"[\s\S]*?<\/p>/i, '');
  if (!html.includes('id="rfMealFilters"')) {
    if (/id=["']spinBtn["']/.test(html)) {
      // insertar antes del botón girar o después del canvas
      html = html.replace(
        /(<button[^>]*id=["']spinBtn["'][^>]*>)/i,
        FILTER_UI + '\n$1'
      );
    } else if (/id=["']ruleta["']/.test(html)) {
      html = html.replace(
        /(id=["']ruleta["'][^>]*>)/i,
        '$1\n' + FILTER_UI
      );
    }
  }

  // JS controller
  html = html.replace(/<script id="rf-meal-filters-js">[\s\S]*?<\/script>/i, '');
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, FILTER_JS + '</body>');
  }

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-meal-filters] Filtros Desayuno/Comida/Merienda/Cena aplicados en home');
  return true;
}

if (require.main === module) run();
module.exports = { run };
