const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const STYLE = `<style id="rf-guide-layout-fix">
/* FIX: separar claramente Momento -> Comida -> Ciudad */
#directorio #rf-final-moment,
#directorio #rf-final-meal,
#directorio #rf-final-city {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  clear: both !important;
  float: none !important;
  box-sizing: border-box !important;
  margin: 12px 0 28px !important;
  padding: 0 !important;
}
#directorio .rf-flow-title {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 24px 0 10px !important;
  font-size: .82rem !important;
  line-height: 1.3 !important;
  font-weight: 800 !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  color: #78716c !important;
}
#directorio .rf-flow-title:first-child { margin-top: 8px !important; }
#directorio .rf-flow-number {
  display: inline-grid !important;
  place-items: center !important;
  width: 22px !important;
  height: 22px !important;
  flex: 0 0 22px !important;
  border-radius: 999px !important;
  background: #f97316 !important;
  color: #fff !important;
  font-size: 11px !important;
  font-weight: 800 !important;
}
#directorio #rf-final-moment,
#directorio #rf-final-meal,
#directorio #rf-final-city {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
}
#directorio #rf-final-moment .rf-final-choice,
#directorio #rf-final-meal .rf-final-choice,
#directorio #rf-final-city .rf-final-choice {
  display: inline-flex !important;
  margin: 0 !important;
  flex: 0 0 auto !important;
}
@media (max-width: 767px) {
  #directorio #rf-final-moment,
  #directorio #rf-final-meal,
  #directorio #rf-final-city { gap: 7px !important; margin-bottom: 24px !important; }
  #directorio .rf-flow-title { margin-top: 20px !important; }
}
</style>`;

const SCRIPT = `<script id="rf-guide-layout-fix-js">
(function(){
  function ready(fn){
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function exactText(el, text){ return el && el.textContent && el.textContent.trim() === text; }
  function makeTitle(n, text){
    var h = document.createElement('div');
    h.className = 'rf-flow-title';
    h.innerHTML = '<span class="rf-flow-number">'+n+'</span><span>'+text+'</span>';
    return h;
  }
  function init(){
    var root = document.getElementById('directorio');
    var moment = document.getElementById('rf-final-moment');
    var meal = document.getElementById('rf-final-meal');
    var city = document.getElementById('rf-final-city');
    if(!root || !moment || !meal || !city) return;

    /* Oculta los encabezados antiguos que provocaban el duplicado "1 Comida". */
    Array.prototype.forEach.call(root.querySelectorAll('h1,h2,h3,h4,h5,h6,p'), function(el){
      if(el.closest('#rf-final-moment,#rf-final-meal,#rf-final-city')) return;
      if(exactText(el,'Comida') || exactText(el,'Ciudad') || exactText(el,'Momento del día')){
        el.setAttribute('data-rf-hidden-duplicate','1');
        el.style.display = 'none';
      }
    });

    function addTitle(box, n, text){
      var prev = box.previousElementSibling;
      if(prev && prev.classList && prev.classList.contains('rf-flow-title')) return;
      box.parentNode.insertBefore(makeTitle(n,text), box);
    }
    addTitle(moment, 1, 'Momento del día');
    addTitle(meal, 2, 'Comida');
    addTitle(city, 3, 'Ciudad');

    /* Fuerza el flujo vertical aunque el CSS antiguo use grid/flex para todo el directorio. */
    [moment, meal, city].forEach(function(box){
      box.style.display='flex';
      box.style.width='100%';
      box.style.clear='both';
      box.style.float='none';
      box.style.flexWrap='wrap';
      box.style.alignItems='center';
      box.style.justifyContent='flex-start';
      box.style.gap='8px';
    });
  }
  ready(function(){
    init();
    setTimeout(init, 50);
    setTimeout(init, 250);
  });
})();
</script>`;

function run(){
  if(!fs.existsSync(INDEX)) return false;
  let html = fs.readFileSync(INDEX,'utf8');
  html = html.replace(/<style id="rf-guide-layout-fix">[\s\S]*?<\/style>/i,'');
  html = html.replace(/<script id="rf-guide-layout-fix-js">[\s\S]*?<\/script>/i,'');
  html = html.replace(/<\/head>/i, STYLE + '</head>');
  html = html.replace(/<\/body>/i, SCRIPT + '</body>');
  fs.writeFileSync(INDEX, html, 'utf8');
  return true;
}

if(require.main === module) run();
module.exports = { run };
