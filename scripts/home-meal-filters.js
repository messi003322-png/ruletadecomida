/**
 * Ruleta HOME: momento + dieta + barato
 * Arrays completos por comida. Sin refresh de anuncios.
 */
const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const DISH_BANKS = `
window.__RF_DISH_BANKS = {
  Desayuno: [
    { name:'Tostadas con tomate', meal:'Desayuno', time:8, budget:'€', tags:['barato','vegano','sin-gluten-opcional'], desc:'Clásico español.' },
    { name:'Huevos revueltos', meal:'Desayuno', time:10, budget:'€', tags:['barato','sin-gluten'], desc:'Rápidos y saciantes.' },
    { name:'Yogur con fruta', meal:'Desayuno', time:5, budget:'€', tags:['barato','vegetariano'], desc:'Ligero y fresco.' },
    { name:'Avena con frutos secos', meal:'Desayuno', time:8, budget:'€', tags:['barato','vegano'], desc:'Energía de mañana.' },
    { name:'Café y bollería', meal:'Desayuno', time:5, budget:'€', tags:['barato','vegetariano'], desc:'Pausa rápida.' },
    { name:'Churros o porras', meal:'Desayuno', time:15, budget:'€', tags:['barato','vegetariano'], desc:'Capricho de fin de semana.' },
    { name:'Tostada de aguacate', meal:'Desayuno', time:10, budget:'€€', tags:['vegano'], desc:'Siempre funciona.' },
    { name:'Zumo y tostada integral', meal:'Desayuno', time:7, budget:'€', tags:['barato','vegano'], desc:'Simple y efectivo.' },
    { name:'Tortilla francesa', meal:'Desayuno', time:8, budget:'€', tags:['barato','sin-gluten'], desc:'En minutos.' },
    { name:'Bowl de fruta', meal:'Desayuno', time:5, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Ligero y natural.' }
  ],
  Comida: [
    { name:'Menú del día casero', meal:'Comida', time:30, budget:'€€', tags:['domicilio'], desc:'Completo y práctico.' },
    { name:'Ensalada completa', meal:'Comida', time:12, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Fresca y rápida.' },
    { name:'Pasta al pesto', meal:'Comida', time:15, budget:'€', tags:['barato','vegetariano'], desc:'Rápida y aromática.' },
    { name:'Bocadillo contundente', meal:'Comida', time:10, budget:'€', tags:['barato','para-llevar'], desc:'Ideal para fuera.' },
    { name:'Arroz con verduras', meal:'Comida', time:25, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Saciante.' },
    { name:'Tortilla de patatas', meal:'Comida', time:25, budget:'€', tags:['barato','vegetariano','sin-gluten'], desc:'El clásico.' },
    { name:'Pollo a la plancha', meal:'Comida', time:20, budget:'€€', tags:['sin-gluten'], desc:'Proteína sencilla.' },
    { name:'Lentejas express', meal:'Comida', time:30, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Cuchara fácil.' },
    { name:'Wrap de pollo', meal:'Comida', time:15, budget:'€€', tags:['para-llevar'], desc:'Ideal para uno.' },
    { name:'Gazpacho', meal:'Comida', time:12, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Fresco y sin cocinar.' }
  ],
  Merienda: [
    { name:'Yogur con fruta', meal:'Merienda', time:5, budget:'€', tags:['barato','vegetariano'], desc:'Ligero.' },
    { name:'Tostada con mermelada', meal:'Merienda', time:5, budget:'€', tags:['barato','vegano'], desc:'Clásico de tarde.' },
    { name:'Café y galleta', meal:'Merienda', time:5, budget:'€', tags:['barato','vegetariano'], desc:'Pausa corta.' },
    { name:'Batido de plátano', meal:'Merienda', time:8, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Energía fácil.' },
    { name:'Frutos secos', meal:'Merienda', time:2, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Sin platos.' },
    { name:'Chocolate a la taza', meal:'Merienda', time:10, budget:'€', tags:['barato','vegetariano'], desc:'Días fríos.' },
    { name:'Sándwich vegetal', meal:'Merienda', time:10, budget:'€', tags:['barato','vegano','para-llevar'], desc:'Algo más contundente.' },
    { name:'Zumo y magdalena', meal:'Merienda', time:5, budget:'€', tags:['barato','vegetariano'], desc:'Simple.' }
  ],
  Cena: [
    { name:'Pasta cremosa de limón', meal:'Cena', time:18, budget:'€', tags:['barato','vegetariano'], desc:'Ácida y rápida.' },
    { name:'Tacos de pollo', meal:'Cena', time:25, budget:'€€', tags:['domicilio'], desc:'Pollo dorado y lima.' },
    { name:'Ramen de miso', meal:'Cena', time:22, budget:'€€', tags:['vegetariano'], desc:'Caldo umami.' },
    { name:'Tortilla de patatas', meal:'Cena', time:20, budget:'€', tags:['barato','vegetariano','sin-gluten'], desc:'No falla.' },
    { name:'Salmón a la plancha', meal:'Cena', time:18, budget:'€€', tags:['sin-gluten'], desc:'Simple y elegante.' },
    { name:'Pizza de sartén', meal:'Cena', time:25, budget:'€', tags:['barato','vegetariano'], desc:'Sin horno.' },
    { name:'Arroz frito', meal:'Cena', time:20, budget:'€', tags:['barato','vegano'], desc:'Con el de ayer.' },
    { name:'Quesadillas', meal:'Cena', time:12, budget:'€', tags:['barato','vegetariano'], desc:'Listas en un momento.' },
    { name:'Ensalada de garbanzos', meal:'Cena', time:10, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Sin cocinar.' },
    { name:'Crema de calabaza', meal:'Cena', time:30, budget:'€', tags:['barato','vegano','sin-gluten'], desc:'Reconfortante.' },
    { name:'Hamburguesa casera', meal:'Cena', time:25, budget:'€€', tags:[], desc:'Con tus extras.' },
    { name:'Noodles salteados', meal:'Cena', time:18, budget:'€', tags:['barato','vegano'], desc:'Rápidos y sabrosos.' }
  ]
};
`;

const FILTER_CSS = `<style id="rf-meal-filters-css">
.rf-meal-filters,.rf-extra-filters{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px auto 4px;max-width:620px;padding:0 12px;position:relative;z-index:5}
.rf-meal-filters button,.rf-extra-filters button{min-height:36px;padding:7px 12px;border-radius:999px;border:1.5px solid rgba(0,0,0,.1);background:#fff;color:#3d2e28;font-size:.8rem;font-weight:700;cursor:pointer}
.rf-meal-filters button.is-active,.rf-extra-filters button.is-active{border-color:#ff6b1a;background:linear-gradient(135deg,#fff7ed,#ffedd5);color:#c2410c}
.rf-meal-filters-hint{text-align:center;font-size:.78rem;color:#7a6358;margin:0 0 10px}
.rf-extra-filters{margin-top:4px}
</style>`;

const FILTER_UI = `
<div class="rf-meal-filters" id="rfMealFilters" role="group" aria-label="Momento del día">
  <button type="button" data-meal="Todos" class="is-active">Todos</button>
  <button type="button" data-meal="Desayuno">Desayuno</button>
  <button type="button" data-meal="Comida">Comida</button>
  <button type="button" data-meal="Merienda">Merienda</button>
  <button type="button" data-meal="Cena">Cena</button>
</div>
<div class="rf-extra-filters" id="rfExtraFilters" role="group" aria-label="Preferencias">
  <button type="button" data-tag="barato">Barato</button>
  <button type="button" data-tag="vegano">Vegano</button>
  <button type="button" data-tag="sin-gluten">Sin gluten</button>
  <button type="button" data-tag="para-llevar">Para llevar</button>
</div>
<p class="rf-meal-filters-hint" id="rfMealFiltersHint">Elige momento y preferencias, luego gira</p>`;

const FILTER_JS = `<script id="rf-meal-filters-js">
(function(){
  var state = { meal: 'Todos', tags: {} };
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  function allDishes(){
    var banks = window.__RF_DISH_BANKS || {};
    var base = (window.__RF_DISHES_ALL && window.__RF_DISHES_ALL.length) ? window.__RF_DISHES_ALL.slice() : [];
    var out = base.slice();
    Object.keys(banks).forEach(function(k){
      (banks[k]||[]).forEach(function(d){
        if(!out.some(function(x){ return x.name===d.name && x.meal===d.meal; })) out.push(d);
      });
    });
    return out;
  }
  function normMeal(m){
    m=String(m||'').toLowerCase();
    if(m.indexOf('desay')>=0) return 'Desayuno';
    if(m.indexOf('almuerz')>=0||m==='comida') return 'Comida';
    if(m.indexOf('meriend')>=0) return 'Merienda';
    if(m.indexOf('cena')>=0) return 'Cena';
    return m;
  }
  function filterList(){
    var list = allDishes();
    if(state.meal && state.meal!=='Todos'){
      var bank = (window.__RF_DISH_BANKS && window.__RF_DISH_BANKS[state.meal]) || [];
      list = bank.length ? bank.slice() : list.filter(function(d){ return normMeal(d.meal)===state.meal; });
    }
    Object.keys(state.tags).forEach(function(tag){
      if(!state.tags[tag]) return;
      list = list.filter(function(d){
        var t = d.tags || [];
        if(tag==='barato') return (d.budget==='€') || t.indexOf('barato')>=0;
        if(tag==='vegano') return t.indexOf('vegano')>=0;
        if(tag==='sin-gluten') return t.indexOf('sin-gluten')>=0 || t.indexOf('sin-gluten-opcional')>=0;
        if(tag==='para-llevar') return t.indexOf('para-llevar')>=0 || t.indexOf('domicilio')>=0;
        return true;
      });
    });
    if(list.length < 4){
      var fallback = allDishes();
      if(state.meal && state.meal!=='Todos') fallback = fallback.filter(function(d){ return normMeal(d.meal)===state.meal; });
      list = fallback.length ? fallback : allDishes();
    }
    return list;
  }
  function apply(){
    var r = window.__rfRoulette;
    if(!r) return;
    var list = filterList();
    r.dishes = list;
    if(typeof r.draw==='function') r.draw();
    var hint = document.getElementById('rfMealFiltersHint');
    if(hint) hint.textContent = list.length + ' opciones · Gira cuando quieras';
    var result = document.getElementById('result');
    if(result) result.classList.add('hidden');
  }
  function wire(){
    var box = document.getElementById('rfMealFilters');
    var extra = document.getElementById('rfExtraFilters');
    if(box) box.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-meal]');
      if(!btn) return;
      box.querySelectorAll('button').forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      state.meal = btn.getAttribute('data-meal');
      apply();
    });
    if(extra) extra.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-tag]');
      if(!btn) return;
      var tag = btn.getAttribute('data-tag');
      state.tags[tag] = !state.tags[tag];
      btn.classList.toggle('is-active', !!state.tags[tag]);
      apply();
    });
  }
  function wait(n){
    n=n||0;
    if(window.__rfRoulette){
      if(!window.__RF_DISHES_ALL || !window.__RF_DISHES_ALL.length){
        try { window.__RF_DISHES_ALL = window.__rfRoulette.dishes.slice(); } catch(e){}
      }
      wire();
      try{
        var q = new URLSearchParams(location.search).get('meal');
        if(q){
          var map={desayuno:'Desayuno',comida:'Comida',almuerzo:'Comida',merienda:'Merienda',cena:'Cena'};
          var key=map[String(q).toLowerCase()]||q;
          var btn=document.querySelector('#rfMealFilters button[data-meal="'+key+'"]');
          if(btn) btn.click();
        }
      }catch(e){}
      return;
    }
    if(n<50) setTimeout(function(){ wait(n+1); }, 120);
  }
  ready(function(){ wait(0); });
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) {
    console.warn('[home-meal-filters] sin index');
    return false;
  }
  let html = fs.readFileSync(INDEX, 'utf8');

  html = html.replace(/var DISHES = \(window\.__RF_DISHES_ALL = \[/g, 'var DISHES = [');
  html = html.replace(/\n\s*window\.__RF_DISHES_ALL = DISHES\.slice\(\);\n?/g, '\n');
  html = html.replace(/\n\s*window\.__RF_DISHES_ALL = window\.__RF_DISHES_ALL \|\| DISHES\.slice\(\);\n?/g, '\n');
  html = html.replace(/\n\s*window\.__rfRoulette = roulette;\n?/g, '\n');
  html = html.replace(/window\.__RF_MERENDA = \[[\s\S]*?\];\n?/g, '');
  html = html.replace(/window\.__RF_DISH_BANKS = \{[\s\S]*?\};\n?/g, '');

  if (!html.includes('window.__RF_DISHES_ALL = DISHES.slice()')) {
    html = html.replace(
      /(var DISHES = \[[\s\S]*?\];)/,
      '$1\n  window.__RF_DISHES_ALL = DISHES.slice();\n  ' + DISH_BANKS
    );
  } else if (!html.includes('window.__RF_DISH_BANKS')) {
    html = html.replace(
      /window\.__RF_DISHES_ALL = DISHES\.slice\(\);/,
      'window.__RF_DISHES_ALL = DISHES.slice();\n  ' + DISH_BANKS
    );
  }

  if (!html.includes('window.__rfRoulette = roulette')) {
    html = html.replace(
      /var roulette = new Roulette\(canvas, DISHES\);/,
      'var roulette = new Roulette(canvas, DISHES);\n    window.__rfRoulette = roulette;'
    );
  }

  html = html.replace(/<style id="rf-meal-filters-css">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<\/head>/i, FILTER_CSS + '</head>');

  html = html.replace(/<div class="rf-meal-filters"[\s\S]*?<p class="rf-meal-filters-hint"[\s\S]*?<\/p>/gi, '');
  if (!html.includes('id="rfMealFilters"')) {
    if (/id=["']spinBtn["']/.test(html)) {
      html = html.replace(/(<[^>]*id=["']spinBtn["'][^>]*>)/i, FILTER_UI + '\n$1');
    }
  }

  html = html.replace(/<script id="rf-meal-filters-js">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<\/body>/i, FILTER_JS + '</body>');

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-meal-filters] bancos + filtros momento/dieta/precio OK');
  return true;
}

if (require.main === module) run();
module.exports = { run };
