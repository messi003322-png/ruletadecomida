const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const MARKER = 'ruleta-pilot-instrumentation';
let changed = 0;

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, callback);
    else if (/\.html$/i.test(entry.name)) callback(full);
  }
}

const script = `<script id="${MARKER}">
(function(){
  if(window.__ruletaPilot)return;
  window.__ruletaPilot=true;
  window.dataLayer=window.dataLayer||[];
  function track(name,detail){
    var event={event:name,detail:detail||{},path:location.pathname,timestamp:new Date().toISOString()};
    window.dataLayer.push(event);
    window.dispatchEvent(new CustomEvent('ruleta:'+name,{detail:event}));
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('#spinBtn,#rfShareToggle,.cta');
    if(!el)return;
    if(el.id==='spinBtn')track('roulette_spin',{label:(el.textContent||'').trim().slice(0,80)});
    else if(el.id==='rfShareToggle')track('share_open');
    else track('cta_click',{label:(el.textContent||'').trim().slice(0,80)});
  },{passive:true});
  track('page_view');
})();
</script>`;

walk(OUT, (file) => {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(`id="${MARKER}"`)) return;
  const next = html.replace(/<\/body>/i, `${script}\n</body>`);
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
});
console.log(`[pilot-event-instrumentation] ${changed} HTML files instrumented with privacy-neutral product events.`);
