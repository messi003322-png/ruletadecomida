/**
 * Directorio guía: selector de MOMENTO (Desayuno/Almuerzo/Merienda/Cena)
 * Además de comida + ciudad.
 */
const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const MOMENT_HTML = `
        <h3 class="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-stone-500">
          <span class="grid h-5 w-5 place-items-center rounded-full bg-brand text-[10px] text-white">0</span> Momento del día
        </h3>
        <div id="dir-momentos" class="mt-3 flex flex-wrap gap-2">
          <button type="button" data-m="desayuno" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand">Desayuno</button>
          <button type="button" data-m="almuerzo" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand">Almuerzo</button>
          <button type="button" data-m="merienda" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand">Merienda</button>
          <button type="button" data-m="cena" class="js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand">Cena</button>
        </div>
`;

const MOMENT_JS = `<script id="rf-guide-moment-js">
(function(){
  var selMoment = '';
  function styleMoment(btn, on){
    btn.className = on
      ? 'js-moment chip-btn rounded-full border border-brand bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-md'
      : 'js-moment chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:border-brand hover:text-brand';
  }
  function labelM(m){
    return ({desayuno:'Desayuno',almuerzo:'Almuerzo',merienda:'Merienda',cena:'Cena'})[m] || m;
  }
  function patchUpdate(){
    if (typeof window.updateSelection === 'function') return;
    // redefinir encima del scope no es posible; usamos observer sobre dir-go
  }
  function refreshGo(){
    var sel = document.getElementById('dir-selection');
    var go = document.getElementById('dir-go');
    if(!sel || !go) return;
    // leer selección de comida/ciudad desde botones activos
    var cBtn = document.querySelector('#dir-comidas .js-comida[class*="bg-brand"]');
    var ciBtn = document.querySelector('#dir-ciudades .js-ciudad[class*="bg-stone-900"]');
    var comida = cBtn ? cBtn.getAttribute('data-c') : '';
    var ciudad = ciBtn ? ciBtn.getAttribute('data-ci') : '';

    if (selMoment && ciudad && !comida) {
      sel.textContent = labelM(selMoment) + ' en ' + (ciBtn.textContent || ciudad);
      go.href = '/' + encodeURIComponent(ciudad) + '/' + encodeURIComponent(selMoment) + '/';
      go.className = 'mt-4 inline-flex rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand';
      go.style.pointerEvents = 'auto';
      go.removeAttribute('aria-disabled');
      go.tabIndex = 0;
      return;
    }
    if (comida && ciudad) {
      sel.textContent = (cBtn.textContent||comida) + ' en ' + (ciBtn.textContent||ciudad) +
        (selMoment ? ' · ' + labelM(selMoment) : '');
      go.href = '/guia/' + encodeURIComponent(comida) + '/' + encodeURIComponent(ciudad) + '/';
      go.className = 'mt-4 inline-flex rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand';
      go.style.pointerEvents = 'auto';
      go.removeAttribute('aria-disabled');
      go.tabIndex = 0;
      return;
    }
    if (selMoment) {
      sel.textContent = 'Momento: ' + labelM(selMoment) + ' · elige ciudad (o comida + ciudad)';
    }
  }
  function wire(){
    var box = document.getElementById('dir-momentos');
    if(!box) return;
    box.addEventListener('click', function(e){
      var btn = e.target.closest('[data-m]');
      if(!btn) return;
      var m = btn.getAttribute('data-m');
      selMoment = (selMoment === m) ? '' : m;
      box.querySelectorAll('.js-moment').forEach(function(b){
        styleMoment(b, b.getAttribute('data-m') === selMoment);
      });
      refreshGo();
    });
    // al elegir comida/ciudad del directorio original
    document.addEventListener('click', function(e){
      if (e.target.closest('#dir-comidas, #dir-ciudades')) {
        setTimeout(refreshGo, 0);
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) return false;
  let html = fs.readFileSync(INDEX, 'utf8');

  if (!html.includes('id="dir-momentos"')) {
    // Insertar antes del paso 1 Comida
    if (html.includes('id="dir-comidas"')) {
      html = html.replace(
        /(<h3[^>]*>[\s\S]*?Comida[\s\S]*?<\/h3>\s*<div id="dir-comidas")/i,
        MOMENT_HTML + '\n$1'
      );
    }
  }

  // Texto intro
  html = html.replace(
    /20 comidas · 79 ciudades · Toca una de cada para abrir la guía/,
    'Momento · comida · ciudad · Toca para abrir la guía'
  );

  html = html.replace(/<script id="rf-guide-moment-js">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<\/body>/i, MOMENT_JS + '</body>');

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-guide-moment] Selector momento en directorio OK');
  return true;
}

if (require.main === module) run();
module.exports = { run };
