#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const CSS = `<style id="rf-roulette-mobile-recovery-css">
/* Evita un canvas blanco mientras la ruleta se inicializa o recupera. */
#wheel{
  display:block!important;
  background:conic-gradient(
    #ff7a45 0deg 30deg,#f9b84b 30deg 60deg,#22a699 60deg 90deg,
    #6886c5 90deg 120deg,#b76ac4 120deg 150deg,#ef7c9a 150deg 180deg,
    #ff945c 180deg 210deg,#e7b34c 210deg 240deg,#55a88f 240deg 270deg,
    #587cc0 270deg 300deg,#a879c8 300deg 330deg,#f27272 330deg 360deg
  )!important;
  contain:paint;
}

@media (max-width:767px){
  /* En móvil, el mensaje de valor se lee antes de los controles de la herramienta. */
  #view-home > section:first-child > .mx-auto.grid{
    display:flex!important;
    flex-direction:column!important;
    gap:1.5rem!important;
  }
  #view-home > section:first-child > .mx-auto.grid > div:first-child{order:1!important}
  #view-home > section:first-child #ruleta{order:2!important;width:100%}
  #ruleta .relative.w-full{width:min(84vw,340px)!important;max-width:340px!important}
  #ruleta #spinBtn{margin-top:1.35rem!important}
}
</style>`;

const SCRIPT = `<script id="rf-roulette-mobile-recovery">
(function(){
  'use strict';
  var COLORS=['#f97360','#fbbf45','#2bb3a6','#5b7fc4','#9f63c2','#ef718f','#ff9865','#e3b548','#55a88f','#5379bd','#ad75c8','#f16e6e'];
  var FALLBACK_DISHES=[
    {name:'Tostadas con tomate',meal:'Desayuno',time:8,budget:'€',desc:'Clásico español.'},
    {name:'Huevos revueltos',meal:'Desayuno',time:10,budget:'€',desc:'Rápidos y saciantes.'},
    {name:'Avena con fruta',meal:'Desayuno',time:7,budget:'€',desc:'Energía para la mañana.'},
    {name:'Yogur con granola',meal:'Desayuno',time:5,budget:'€',desc:'Ligero y fresco.'},
    {name:'Ensalada completa',meal:'Comida',time:12,budget:'€',desc:'Fresca y rápida.'},
    {name:'Pasta al pesto',meal:'Comida',time:15,budget:'€',desc:'Rápida y aromática.'},
    {name:'Arroz con verduras',meal:'Comida',time:25,budget:'€',desc:'Saciante y sencillo.'},
    {name:'Wrap de pollo',meal:'Comida',time:15,budget:'€€',desc:'Ideal para uno.'},
    {name:'Yogur con fruta',meal:'Merienda',time:5,budget:'€',desc:'Ligero y fresco.'},
    {name:'Batido de plátano',meal:'Merienda',time:8,budget:'€',desc:'Energía fácil.'},
    {name:'Frutos secos y fruta',meal:'Merienda',time:2,budget:'€',desc:'Sin preparación.'},
    {name:'Tostada con mermelada',meal:'Merienda',time:5,budget:'€',desc:'Clásica y rápida.'},
    {name:'Pasta cremosa de limón',meal:'Cena',time:18,budget:'€',desc:'Ácida y rápida.'},
    {name:'Tacos de pollo',meal:'Cena',time:25,budget:'€€',desc:'Pollo dorado y lima.'},
    {name:'Tortilla de patatas',meal:'Cena',time:20,budget:'€',desc:'No falla.'},
    {name:'Pizza de sartén',meal:'Cena',time:25,budget:'€',desc:'Sin horno.'},
    {name:'Ensalada de garbanzos',meal:'Cena',time:10,budget:'€',desc:'Sin cocinar.'},
    {name:'Hamburguesa casera',meal:'Cena',time:25,budget:'€€',desc:'Con tus extras.'}
  ];
  var queued=false, attempts=0, observer;

  function canvas(){ return document.getElementById('wheel'); }
  function button(){ return document.getElementById('spinBtn'); }
  function list(){
    var source=window.__RF_DISHES_ALL;
    return Array.isArray(source)&&source.length>=4 ? source.slice() : FALLBACK_DISHES.slice();
  }
  function sizeFor(node){
    var parent=node && node.parentElement;
    var width=parent ? parent.getBoundingClientRect().width : 0;
    return Math.max(220, Math.min(340, Math.floor(width || 300)));
  }
  function makeFallback(){
    var node=canvas();
    if(!node) return null;
    var ctx=node.getContext && node.getContext('2d');
    if(!ctx) return null;
    var state={canvas:node,ctx:ctx,dishes:list(),rotation:0,spinning:false,onComplete:null};
    state.resize=function(){
      var cssSize=sizeFor(node), dpr=Math.min(window.devicePixelRatio||1,2);
      node.width=Math.floor(cssSize*dpr); node.height=Math.floor(cssSize*dpr);
      node.style.width=cssSize+'px'; node.style.height=cssSize+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      state.size=cssSize; state.center=cssSize/2; state.radius=cssSize/2-5;
      state.draw();
    };
    state.draw=function(){
      var n=state.dishes.length;
      if(!n||!state.size) return;
      var arc=Math.PI*2/n, c=state.center, r=state.radius;
      ctx.clearRect(0,0,state.size,state.size);
      for(var i=0;i<n;i++){
        var start=state.rotation+i*arc, end=start+arc;
        ctx.beginPath(); ctx.moveTo(c,c); ctx.arc(c,c,r,start,end); ctx.closePath();
        ctx.fillStyle=COLORS[i%COLORS.length]; ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.52)'; ctx.lineWidth=2; ctx.stroke();
        ctx.save(); ctx.translate(c,c); ctx.rotate(start+arc/2); ctx.textAlign='right';
        ctx.fillStyle='#fff'; ctx.font='700 '+Math.max(9,r/15.5)+'px system-ui,sans-serif';
        var name=String(state.dishes[i].name||'Opción');
        ctx.fillText(name.length>14?name.slice(0,12)+'…':name,r-14,4); ctx.restore();
      }
      ctx.beginPath(); ctx.arc(c,c,r*.15,0,Math.PI*2); ctx.fillStyle='#1c1917'; ctx.fill();
      ctx.beginPath(); ctx.arc(c,c,r*.09,0,Math.PI*2); ctx.fillStyle='#e85d04'; ctx.fill();
    };
    state.spin=function(){
      if(state.spinning||!state.dishes.length) return;
      state.spinning=true;
      var n=state.dishes.length, arc=Math.PI*2/n, index=Math.floor(Math.random()*n);
      var start=state.rotation, target=3*Math.PI/2-(index*arc+arc/2), delta=(5+Math.random()*3)*Math.PI*2+target-(start%(Math.PI*2));
      var began=performance.now(), duration=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?500:2200;
      function tick(now){
        var progress=Math.min((now-began)/duration,1), ease=1-Math.pow(1-progress,3.15);
        state.rotation=start+delta*ease; state.draw();
        if(progress<1) requestAnimationFrame(tick);
        else { state.spinning=false; state.rotation=state.rotation%(Math.PI*2); if(typeof state.onComplete==='function') state.onComplete(state.dishes[index]); }
      }
      requestAnimationFrame(tick);
    };
    state.resize();
    return state;
  }
  function renderResult(dish){
    if(!dish) return;
    var result=document.getElementById('result');
    var badge=document.getElementById('resultBadge'), name=document.getElementById('resultName'), desc=document.getElementById('resultDesc'), tags=document.getElementById('resultTags');
    if(badge) badge.textContent=dish.meal||'Idea';
    if(name) name.textContent=dish.name||'Una buena opción';
    if(desc) desc.textContent=dish.desc||'Una opción rápida para decidir.';
    if(tags) tags.innerHTML='<span class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">⏱️ '+(dish.time||15)+' min</span><span class="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">💶 '+(dish.budget||'€')+'</span>';
    if(result) result.classList.remove('hidden');
  }
  function wireSpin(roulette){
    var spin=button();
    if(!spin||spin.dataset.rfWheelBound==='true') return;
    spin.dataset.rfWheelBound='true';
    spin.addEventListener('click',function(){
      if(roulette.spinning) return;
      spin.disabled=true;
      var label=document.getElementById('spinLabel'); if(label) label.textContent='Girando…';
      var result=document.getElementById('result'); if(result) result.classList.add('hidden');
      roulette.onComplete=function(dish){ renderResult(dish); spin.disabled=false; if(label) label.textContent='Girar ruleta'; };
      roulette.spin();
    });
  }
  function readyRoulette(){
    var current=window.__rfRoulette;
    if(current&&typeof current.resize==='function'&&typeof current.draw==='function') return current;
    if(attempts<6) return null;
    var fallback=makeFallback();
    if(fallback){
      window.__rfRoulette=fallback;
      if(!Array.isArray(window.__RF_DISHES_ALL)||!window.__RF_DISHES_ALL.length) window.__RF_DISHES_ALL=fallback.dishes.slice();
      return fallback;
    }
    return null;
  }
  function redraw(){
    queued=false;
    var roulette=readyRoulette();
    var node=canvas();
    if(!roulette||!node) return false;
    try { roulette.resize(); roulette.draw(); node.dataset.rfWheelReady='true'; wireSpin(roulette); return true; } catch(err){ return false; }
  }
  function schedule(){ if(queued) return; queued=true; requestAnimationFrame(function(){ requestAnimationFrame(redraw); }); }
  function retry(){
    if(redraw()||attempts>=24) return;
    attempts+=1; setTimeout(retry,120);
  }
  function boot(){
    retry(); schedule();
    window.addEventListener('load',schedule,{once:true});
    window.addEventListener('pageshow',schedule);
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('orientationchange',function(){setTimeout(schedule,180)},{passive:true});
    document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
    var node=canvas();
    if(node&&window.ResizeObserver){ observer=new ResizeObserver(schedule); observer.observe(node.parentElement||node); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) {
    console.warn('[roulette-mobile-recovery] No existe dist/index.html');
    return false;
  }
  let html = fs.readFileSync(INDEX, 'utf8');
  html = html.replace(/<style id="rf-roulette-mobile-recovery-css">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<script id="rf-roulette-mobile-recovery">[\s\S]*?<\/script>/i, '');
  if (!/<\/head>/i.test(html) || !/<\/body>/i.test(html)) throw new Error('La homepage no contiene head/body.');
  html = html.replace(/<\/head>/i, `${CSS}\n</head>`);
  html = html.replace(/<\/body>/i, `${SCRIPT}\n</body>`);
  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[roulette-mobile-recovery] Redibujo e inicializador alternativo aplicados a la homepage.');
  return true;
}

if (require.main === module) run();
module.exports = { run };
