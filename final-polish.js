const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

const STYLE = `
:root{
  --rf-orange:#f97316;
  --rf-orange-dark:#ea580c;
  --rf-ink:#18181b;
  --rf-muted:#6b7280;
  --rf-bg:#fffaf5;
  --rf-card:#ffffff;
  --rf-border:#eee7df;
  --rf-shadow:0 18px 55px rgba(24,24,27,.08);
  --rf-shadow-hover:0 24px 70px rgba(24,24,27,.13);
}
html{scroll-behavior:smooth}
body{background:linear-gradient(180deg,#fff 0%,#fffaf5 48%,#fff 100%);color:var(--rf-ink)}
main{max-width:1180px;margin-inline:auto}
h1,h2,h3{letter-spacing:-.035em}
h2{margin-top:clamp(42px,6vw,76px);margin-bottom:18px}
p{line-height:1.72}
a{transition:color .18s ease,transform .18s ease,box-shadow .18s ease}
a:focus-visible,button:focus-visible{outline:3px solid rgba(249,115,22,.35);outline-offset:3px}
header{box-shadow:0 1px 0 rgba(24,24,27,.06),0 10px 32px rgba(24,24,27,.045);backdrop-filter:saturate(140%) blur(10px)}
header nav a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;font-weight:650;transition:transform .18s ease,box-shadow .18s ease}
header nav a:hover{transform:translateY(-1px)}
#ruleta{padding-block:clamp(28px,5vw,72px)!important}
#ruleta #wheel{filter:drop-shadow(0 24px 48px rgba(249,115,22,.12));}
#ruleta #spinBtn{min-height:54px;border-radius:16px!important;box-shadow:0 14px 30px rgba(24,24,27,.16)!important;font-weight:800}
#result{border-radius:20px!important;box-shadow:var(--rf-shadow)!important}
.seo-hub{max-width:1180px;margin:clamp(48px,7vw,92px) auto 0!important;padding:0 20px clamp(56px,8vw,100px)!important}
.seo-hub h2{font-size:clamp(1.75rem,3vw,2.55rem);margin:0 0 14px}
.seo-hub-intro{max-width:760px;color:var(--rf-muted);font-size:clamp(1rem,1.7vw,1.12rem);margin:0 0 34px;line-height:1.75}
.seo-hub-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px!important}
.seo-card{display:block;min-height:170px;box-sizing:border-box;padding:28px 26px!important;border:1px solid var(--rf-border)!important;border-radius:24px!important;background:var(--rf-card)!important;box-shadow:var(--rf-shadow)!important;text-decoration:none!important;color:inherit!important;line-height:1.55!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}
.seo-card:hover{transform:translateY(-4px);box-shadow:var(--rf-shadow-hover)!important;border-color:#fed7aa!important}
.seo-card strong{display:block!important;margin:0 0 20px!important;font-size:clamp(1.12rem,2vw,1.34rem)!important;line-height:1.3!important}
.seo-card span{display:block!important;margin:0!important;color:var(--rf-muted)!important;font-size:1rem!important;line-height:1.72!important}
article{margin-top:24px}
article .answer{margin:28px 0 34px!important;border-left-width:5px!important;border-radius:16px!important;padding:20px 22px!important}
article h2{margin-top:48px!important;margin-bottom:16px!important}
article .faq{padding:20px 0!important}
article .links{gap:14px!important;margin-top:20px}
article .links a{padding:17px 18px!important;border:1px solid #fed7aa!important;border-radius:16px!important;background:#fff7ed!important}
.cta{border-radius:15px!important;box-shadow:0 12px 26px rgba(234,88,12,.22);transition:transform .18s ease,box-shadow .18s ease!important}
.cta:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(234,88,12,.28)}
.rf-final-footer{margin-top:0;background:#171717;color:#fff;border-top:1px solid rgba(255,255,255,.08)}
.rf-footer-inner{max-width:1180px;margin:0 auto;padding:46px 20px 26px}
.rf-footer-brand{display:flex;align-items:center;gap:12px;min-height:46px;flex-wrap:wrap}
.rf-footer-brand img{width:42px!important;height:42px!important;object-fit:cover;border-radius:12px;display:block}
.rf-footer-brand strong{font-size:1.15rem;line-height:1.2;color:#fff}
.rf-footer-brand p{flex-basis:100%;margin:8px 0 0!important;max-width:620px;color:#b9b9b9;line-height:1.65}
.rf-footer-nav{display:flex;flex-wrap:wrap;gap:10px 18px;margin:26px 0 24px}
.rf-footer-nav a{color:#e5e5e5;text-decoration:none;font-size:.94rem}
.rf-footer-nav a:hover{color:#fb923c}
.rf-footer-copy{margin:0;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);color:#8f8f8f;font-size:.88rem}
.rf-404{min-height:70vh;display:grid;place-items:center;padding:70px 20px;background:linear-gradient(180deg,#fffaf5,#fff)}
.rf-404-card{width:min(720px,100%);box-sizing:border-box;padding:clamp(30px,6vw,64px);text-align:center;background:#fff;border:1px solid var(--rf-border);border-radius:30px;box-shadow:var(--rf-shadow)}
.rf-404-card .rf-404-icon{font-size:3rem;margin-bottom:14px}
.rf-404-card h1{font-size:clamp(2.1rem,6vw,4rem);margin:.1em 0 .25em}
.rf-404-card p{color:var(--rf-muted);font-size:1.08rem;max-width:540px;margin:0 auto 26px}
.rf-404-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.rf-404-links a{display:inline-flex;align-items:center;justify-content:center;padding:13px 18px;border-radius:14px;text-decoration:none;font-weight:750;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}
.rf-404-links a.primary{background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border-color:transparent;box-shadow:0 12px 26px rgba(234,88,12,.2)}
@media (max-width:1023px){.seo-hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media (max-width:767px){
  header nav a{font-size:.82rem!important;padding:.52rem .58rem!important}
  #ruleta{padding-block:24px 42px!important}
  .seo-hub{padding-inline:16px!important;margin-top:52px!important}
  .seo-hub-grid{grid-template-columns:1fr!important;gap:18px!important}
  .seo-card{min-height:0;padding:25px 22px!important;border-radius:21px!important}
  .seo-card strong{margin-bottom:15px!important}
  .seo-card span{font-size:.98rem!important}
  article{margin-top:16px}
  .rf-footer-inner{padding:38px 18px 22px}
  .rf-footer-nav{gap:10px 15px;margin-top:22px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.seo-card:hover,.cta:hover,header nav a:hover{transform:none}}
`;

function esc(s){
  return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function walk(dir, fn){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name);
    if(e.isDirectory()) walk(full,fn); else fn(full,e.name);
  }
}
function footerHtml(logoSrc){
  const logo = logoSrc ? `<img src="${logoSrc}" alt="" width="42" height="42" loading="lazy">` : '';
  return `<footer class="rf-final-footer"><div class="rf-footer-inner"><div class="rf-footer-brand">${logo}<strong>Ruleta de Comida</strong><p>Decide qué comer o cenar en segundos. 20 comidas · 79 ciudades.</p></div><nav class="rf-footer-nav" aria-label="Navegación del sitio"><a href="${SITE}/">Inicio</a><a href="${SITE}/que-comer-hoy/">Qué comer hoy</a><a href="${SITE}/ideas-de-comida/">Ideas de comida</a><a href="${SITE}/que-comer-esta-noche/">Qué comer esta noche</a><a href="${SITE}/comida-rapida/">Comida rápida</a><a href="${SITE}/comida-barata/">Comida barata</a><a href="${SITE}/madrid/">Madrid</a><a href="${SITE}/barcelona/">Barcelona</a><a href="${SITE}/valencia/">Valencia</a></nav><p class="rf-footer-copy">© 2026 Ruleta de Comida</p></div></footer>`;
}
function make404(){
  const file=path.join(OUT,'404.html');
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada | Ruleta de Comida</title><meta name="robots" content="noindex,follow"><style>${STYLE}</style></head><body><main class="rf-404"><section class="rf-404-card"><div class="rf-404-icon">🍽️</div><h1>Esta página no está en el menú</h1><p>No pasa nada. Puedes volver a la ruleta, descubrir qué comer hoy o explorar nuestras guías.</p><div class="rf-404-links"><a class="primary" href="${SITE}/">🎯 Girar la ruleta</a><a href="${SITE}/que-comer-hoy/">Qué comer hoy</a><a href="${SITE}/ideas-de-comida/">Ideas de comida</a></div></section></main></body></html>`;
  fs.writeFileSync(file,html,'utf8');
}

if(!fs.existsSync(OUT)) throw new Error('dist no existe');

walk(OUT,(file,name)=>{
  if(!name.toLowerCase().endsWith('.html')) return;
  let html=fs.readFileSync(file,'utf8');
  const footerMatch=html.match(/<footer\b[\s\S]*?<\/footer>/i);
  let logoSrc='';
  if(footerMatch){
    const m=footerMatch[0].match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
    if(m) logoSrc=m[1];
  }
  html=html.replace(/<footer\b[\s\S]*?<\/footer>/gi,'');
  html=html.replace(/<style\b[^>]*id=["'](?:ruleta-visual-refresh|mrmnd-ad-layout)["'][^>]*>[\s\S]*?<\/style>/gi,'');
  if(html.includes('</head>')) html=html.replace('</head>',`<style id="ruleta-final-polish">${STYLE}</style></head>`);
  if(html.includes('</body>')) html=html.replace('</body>',footerHtml(logoSrc)+'</body>');
  else html+=footerHtml(logoSrc);
  fs.writeFileSync(file,html,'utf8');
});

make404();
console.log('Final polish complete: responsive design, spacing, compact footer, 404 and UX refinements applied.');
