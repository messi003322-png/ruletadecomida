const fs=require('fs');
const path=require('path');
const INDEX=path.join(__dirname,'..','dist','index.html');
const STYLE=`<style id="rf-guide-layout-fix">
#directorio #rf-final-moment,#directorio #rf-final-meal,#directorio #rf-final-city{display:flex!important;width:100%!important;max-width:100%!important;clear:both!important;float:none!important;box-sizing:border-box!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;margin:12px 0 28px!important;padding:0!important}
#directorio .rf-flow-title{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;clear:both!important;margin:24px 0 10px!important;font-size:.82rem!important;line-height:1.3!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#78716c!important}
#directorio .rf-flow-number{display:inline-grid!important;place-items:center!important;width:22px!important;height:22px!important;flex:0 0 22px!important;border-radius:999px!important;background:#f97316!important;color:#fff!important;font-size:11px!important;font-weight:800!important}
#directorio #rf-final-moment .rf-final-choice,#directorio #rf-final-meal .rf-final-choice,#directorio #rf-final-city .rf-final-choice{display:inline-flex!important;margin:0!important;flex:0 0 auto!important}
[data-rf-hidden-duplicate="1"]{display:none!important}
@media(max-width:767px){#directorio #rf-final-moment,#directorio #rf-final-meal,#directorio #rf-final-city{gap:7px!important;margin-bottom:24px!important}.rf-flow-title{margin-top:20px!important}}
</style>`;
const SCRIPT=`<script id="rf-guide-layout-fix-js">(function(){
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn()}
function title(n,t){var h=document.createElement('div');h.className='rf-flow-title';h.innerHTML='<span class="rf-flow-number">'+n+'</span><span>'+t+'</span>';return h}
function isStepText(el){var t=(el.textContent||'').replace(/\s+/g,' ').trim();return /^(?:\d+\s*)?(?:Momento del día|Comida|Ciudad)$/i.test(t)}
function init(){
 var root=document.getElementById('directorio'),moment=document.getElementById('rf-final-moment'),meal=document.getElementById('rf-final-meal'),city=document.getElementById('rf-final-city');
 if(!root||!moment||!meal||!city)return;
 Array.prototype.forEach.call(root.querySelectorAll('.rf-flow-title'),function(el){el.remove()});
 Array.prototype.forEach.call(root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,div'),function(el){
   if(el.closest('#rf-final-moment,#rf-final-meal,#rf-final-city'))return;
   if(isStepText(el)){el.setAttribute('data-rf-hidden-duplicate','1');el.style.display='none'}
 });
 function add(box,n,text){box.parentNode.insertBefore(title(n,text),box)}
 add(moment,1,'Momento del día');add(meal,2,'Comida');add(city,3,'Ciudad');
}
ready(function(){init();setTimeout(init,50);setTimeout(init,250);setTimeout(init,800)})
})();</script>`;
function run(){if(!fs.existsSync(INDEX))return false;let html=fs.readFileSync(INDEX,'utf8');html=html.replace(/<style id="rf-guide-layout-fix">[\s\S]*?<\/style>/i,'');html=html.replace(/<script id="rf-guide-layout-fix-js">[\s\S]*?<\/script>/i,'');html=html.replace(/<\/head>/i,STYLE+'</head>');html=html.replace(/<\/body>/i,SCRIPT+'</body>');fs.writeFileSync(INDEX,html,'utf8');return true}
if(require.main===module)run();module.exports={run};
