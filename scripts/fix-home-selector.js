/**
 * Selector UI: SOLO 4 momentos públicos (desayuno/almuerzo/merienda/cena).
 * Los momentos SEO (brunch, media-manana, noche) existen en dist+sitemap
 * pero NO se muestran aquí.
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const INDEX = path.join(DIST, 'index.html');

/** Solo estos aparecen en la interfaz */
const PUBLIC_MOMENTS = [
  ['desayuno', 'Desayuno'],
  ['almuerzo', 'Almuerzo'],
  ['merienda', 'Merienda'],
  ['cena', 'Cena']
];

function pretty(slug) {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((x) => (x[0] ? x[0].toUpperCase() + x.slice(1) : x))
    .join(' ');
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function discoverFromDist() {
  const skip = new Set(['assets', 'css', 'js', 'images']);
  const cities = [];
  const foodsByMoment = {
    desayuno: new Set(),
    almuerzo: new Set(),
    merienda: new Set(),
    cena: new Set()
  };

  if (!fs.existsSync(DIST)) return { cities: [], foodsByMoment: {} };

  for (const e of fs.readdirSync(DIST, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith('.') || skip.has(e.name)) continue;
    const cityDir = path.join(DIST, e.name);
    let hasAny = false;

    for (const [m] of PUBLIC_MOMENTS) {
      const mDir = path.join(cityDir, m);
      if (!fs.existsSync(mDir)) continue;
      for (const f of fs.readdirSync(mDir, { withFileTypes: true })) {
        if (!f.isDirectory()) continue;
        if (fs.existsSync(path.join(mDir, f.name, 'index.html'))) {
          foodsByMoment[m].add(f.name);
          hasAny = true;
        }
      }
    }
    if (hasAny) cities.push([e.name, pretty(e.name)]);
  }

  cities.sort((a, b) => a[1].localeCompare(b[1], 'es'));
  const out = {};
  for (const [m] of PUBLIC_MOMENTS) out[m] = [...foodsByMoment[m]].sort();
  return { cities, foodsByMoment: out };
}

const CSS = `<style id="rf-separated-guide-selector">
.rf-guide-picker{max-width:1180px;margin:28px auto 0;padding:0 16px 24px}
.rf-guide-step{background:#fff;border:1px solid #eadfd7;border-radius:22px;padding:20px;margin:14px 0;box-shadow:0 8px 24px rgba(0,0,0,.05)}
.rf-guide-step[hidden]{display:none!important}
.rf-guide-step-title{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:1.05rem}
.rf-guide-step-number{display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:#fff0e5;color:#c2410c;font-weight:900}
.rf-guide-options{display:flex;flex-wrap:wrap;gap:8px;max-height:280px;overflow:auto}
.rf-guide-option{appearance:none;border:1px solid #e7ddd5;background:#fff;border-radius:999px;padding:9px 13px;font:700 14px/1.2 system-ui,sans-serif;color:#3d2e28;cursor:pointer}
.rf-guide-option:hover{border-color:#f97316}
.rf-guide-option.is-active{background:#fff0e5;border-color:#f97316;color:#c2410c}
.rf-guide-city-search{width:100%;box-sizing:border-box;border:1px solid #e7ddd5;border-radius:14px;padding:12px 14px;margin:0 0 12px;font:inherit}
.rf-guide-result{display:none;margin-top:16px;text-align:center}
.rf-guide-result.is-visible{display:block}
.rf-guide-result a{display:inline-block;background:#ef6c18;color:#fff;border-radius:999px;padding:12px 20px;font-weight:800;text-decoration:none}
@media(max-width:600px){.rf-guide-step{padding:16px;border-radius:18px}.rf-guide-option{font-size:13px;padding:9px 11px}.rf-guide-options{max-height:220px}}
</style>`;

function buildUI(cities, foodsByMoment) {
  const momentButtons = PUBLIC_MOMENTS.map(
    ([slugValue, name]) =>
      `<button class="rf-guide-option" type="button" data-guide-moment="${slugValue}">${name}</button>`
  ).join('');

  const foodButtons = PUBLIC_MOMENTS.map(([moment]) => {
    const foods = foodsByMoment[moment] || [];
    return foods
      .map((slug) => {
        const label = pretty(slug);
        return `<button class="rf-guide-option" type="button" hidden data-guide-food="${esc(slug)}" data-guide-food-moment="${moment}" data-guide-food-label="${esc(label)}">${esc(label)}</button>`;
      })
      .join('');
  }).join('');

  const cityButtons = cities
    .map(
      ([slugValue, name]) =>
        `<button class="rf-guide-option" type="button" data-guide-city="${esc(slugValue)}">${esc(name)}</button>`
    )
    .join('');

  return `<section class="rf-guide-picker" id="rfSeparatedGuidePicker" aria-label="Selector de guía">
  <div class="rf-guide-step" data-guide-step="moment">
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">1</span> Momento del día</h3>
    <div class="rf-guide-options">${momentButtons}</div>
  </div>
  <div class="rf-guide-step" data-guide-step="food" hidden>
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">2</span> Comida</h3>
    <div class="rf-guide-options" id="rfGuideFoods">${foodButtons}</div>
  </div>
  <div class="rf-guide-step" data-guide-step="city" hidden>
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">3</span> Ciudad</h3>
    <input class="rf-guide-city-search" id="rfGuideCitySearch" type="search" placeholder="Buscar ciudad…" autocomplete="off">
    <div class="rf-guide-options" id="rfGuideCities">${cityButtons}</div>
    <div class="rf-guide-result" id="rfGuideResult">
      <a id="rfGuideResultLink" href="#">Ver guía →</a>
      <p id="rfGuideResultHint" style="margin:.75rem 0 0;color:#78716c;font-size:.9rem"></p>
    </div>
  </div>
</section>`;
}

function buildScript() {
  return `<script id="rf-separated-guide-selector-js">
(function(){
  function init(){
    var picker = document.getElementById('rfSeparatedGuidePicker');
    if (!picker) return;
    var old = document.getElementById('directorio');
    if (!old) {
      var dc = document.getElementById('dir-comidas') || document.getElementById('dir-platos');
      if (dc) old = dc.closest('section');
    }
    if (old && picker.parentNode !== old.parentNode) old.replaceWith(picker);

    var moment=null, food=null, city=null;
    var foodStep=picker.querySelector('[data-guide-step="food"]');
    var cityStep=picker.querySelector('[data-guide-step="city"]');
    var foodsBox=picker.querySelector('#rfGuideFoods');
    var result=picker.querySelector('#rfGuideResult');
    var link=picker.querySelector('#rfGuideResultLink');
    var hint=picker.querySelector('#rfGuideResultHint');

    function showFoodsFor(m){
      foodsBox.querySelectorAll('[data-guide-food]').forEach(function(btn){
        btn.hidden = btn.getAttribute('data-guide-food-moment') !== m;
        btn.classList.remove('is-active');
      });
    }
    function update(){
      if(moment&&food&&city){
        link.href='/'+city+'/'+moment+'/'+food+'/';
        result.classList.add('is-visible');
        if(hint){
          var fl=(picker.querySelector('[data-guide-food].is-active')||{}).textContent||food;
          var cl=(picker.querySelector('[data-guide-city].is-active')||{}).textContent||city;
          var ml=(picker.querySelector('[data-guide-moment].is-active')||{}).textContent||moment;
          hint.textContent=ml+' · '+fl+' · '+cl;
        }
      } else result.classList.remove('is-visible');
    }
    picker.addEventListener('click',function(e){
      var b=e.target.closest('.rf-guide-option'); if(!b)return;
      e.preventDefault();
      if(b.hasAttribute('data-guide-moment')){
        moment=b.getAttribute('data-guide-moment'); food=null; city=null;
        picker.querySelectorAll('[data-guide-moment]').forEach(function(x){x.classList.toggle('is-active',x===b)});
        picker.querySelectorAll('[data-guide-food],[data-guide-city]').forEach(function(x){x.classList.remove('is-active')});
        showFoodsFor(moment); foodStep.hidden=false; cityStep.hidden=true; update(); return;
      }
      if(b.hasAttribute('data-guide-food')){
        if(b.hidden)return;
        food=b.getAttribute('data-guide-food'); city=null;
        picker.querySelectorAll('[data-guide-food]').forEach(function(x){x.classList.toggle('is-active',x===b)});
        picker.querySelectorAll('[data-guide-city]').forEach(function(x){x.classList.remove('is-active')});
        cityStep.hidden=false; update(); return;
      }
      if(b.hasAttribute('data-guide-city')){
        city=b.getAttribute('data-guide-city');
        picker.querySelectorAll('[data-guide-city]').forEach(function(x){x.classList.toggle('is-active',x===b)});
        update();
      }
    });
    var search=picker.querySelector('#rfGuideCitySearch');
    if(search)search.addEventListener('input',function(){
      var q=this.value.toLowerCase().trim();
      picker.querySelectorAll('[data-guide-city]').forEach(function(btn){
        var t=btn.textContent.toLowerCase(), s=(btn.getAttribute('data-guide-city')||'').toLowerCase();
        btn.style.display=(!q||t.indexOf(q)>=0||s.indexOf(q)>=0)?'':'none';
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
</script>`;
}

function run() {
  if (!fs.existsSync(INDEX)) return false;
  const { cities, foodsByMoment } = discoverFromDist();
  const totalFoods = Object.values(foodsByMoment).reduce((n, a) => n + a.length, 0);
  if (!cities.length || totalFoods === 0) {
    console.warn('[fix-home-selector] dist sin guías públicas');
    return false;
  }

  let html = fs.readFileSync(INDEX, 'utf8');
  html = html.replace(/<style id="rf-separated-guide-selector">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<script id="rf-separated-guide-selector-js">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<section class="rf-guide-picker"[\s\S]*?<\/section>/i, '');

  const injection = CSS + buildUI(cities, foodsByMoment) + buildScript();
  html = /<\/body>/i.test(html)
    ? html.replace(/<\/body>/i, injection + '</body>')
    : html + injection;

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log(
    `[fix-home-selector] UI: 4 momentos públicos · ${cities.length} ciudades (SEO moments ocultos en UI)`
  );
  return true;
}

module.exports = { run };
if (require.main === module) run();
