const fs=require('fs');
const path=require('path');
const INDEX=path.join(__dirname,'..','dist','index.html');

const SCRIPT=`<script id="rf-moment-flow-js">
(function(){
  var MAP={desayuno:'Desayuno',almuerzo:'Comida',comida:'Comida',merienda:'Merienda',cena:'Cena'};
  var LABEL={Desayuno:'Desayuno',Comida:'Comida',Merienda:'Merienda',Cena:'Cena'};
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
  function init(){
    var moment=document.getElementById('dir-momentos');
    var platos=document.getElementById('dir-platos')||document.getElementById('dir-comidas');
    if(platos&&platos.id==='dir-comidas')platos.id='dir-platos';
    if(!moment||!platos){setTimeout(init,120);return;}
    var h=moment.previousElementSibling;
    if(h&&/momento/i.test(h.textContent||'')){
      var parent=moment.parentElement;
      var children=[].slice.call(parent.children);
      var first=Math.min(children.indexOf(h),children.indexOf(moment));
      if(first>0){parent.insertBefore(h,parent.firstElementChild);parent.insertBefore(moment,h.nextSibling)}
    }
    var state={moment:''};
    var buttons=moment.querySelectorAll('[data-m]');
    buttons.forEach(function(b){b.addEventListener('click',function(){
      state.moment=b.getAttribute('data-m')||'';
      buttons.forEach(function(x){x.classList.toggle('is-on',x===b)});
      var meal=MAP[state.moment]||'';
      var filter=document.querySelector('#rfMealFilters button[data-meal="'+meal+'"]');
      if(filter){filter.click();}
      var banks=window.__RF_DISH_BANKS||{};
      var list=banks[meal]||[];
      if(list.length){
        platos.innerHTML=list.map(function(d){var name=d.name||d;return '<button type="button" data-plato="'+esc(name)+'" class="js-plato chip-btn rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm">'+esc(name)+'</button>'}).join('');
      }
      var hint=document.getElementById('rfMealFiltersHint');
      if(hint&&list.length)hint.textContent=list.length+' opciones de '+LABEL[meal]+' · Gira cuando quieras';
    });
    });
    if(!moment.dataset.flowWired){moment.dataset.flowWired='1';}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
</script>`;
const CSS=`<style id="rf-moment-flow-css">
#dir-momentos{order:-10!important}
#dir-momentos + *{order:-9!important}
#dir-momentos .js-moment{cursor:pointer}
#dir-momentos .js-moment.is-on{background:#f97316!important;border-color:#f97316!important;color:#fff!important}
</style>`;
function run(){if(!fs.existsSync(INDEX))return false;let html=fs.readFileSync(INDEX,'utf8');html=html.replace(/<style id="rf-moment-flow-css">[\s\S]*?<\/style>/i,'');html=html.replace(/<script id="rf-moment-flow-js">[\s\S]*?<\/script>/i,'');html=html.replace(/<\/head>/i,CSS+'</head>');html=html.replace(/<\/body>/i,SCRIPT+'</body>');fs.writeFileSync(INDEX,html,'utf8');return true}
if(require.main===module)run();module.exports={run};
