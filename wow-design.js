const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');
const CSS = `
:root{
  --wow-orange:#f25c05;--wow-orange-2:#ff8a3d;--wow-cream:#fff8f1;--wow-ink:#17120f;--wow-muted:#6f655e;
  --wow-border:rgba(38,28,20,.09);--wow-card:rgba(255,255,255,.9);--wow-shadow:0 18px 60px rgba(35,24,17,.09);
  --wow-shadow-lg:0 30px 90px rgba(35,24,17,.14);--wow-radius:26px
}
html{scroll-behavior:smooth}
body{background:radial-gradient(circle at 10% 0%,rgba(255,174,100,.18),transparent 30rem),radial-gradient(circle at 90% 15%,rgba(115,190,255,.12),transparent 28rem),linear-gradient(180deg,#fff 0%,var(--wow-cream) 48%,#fff 100%);color:var(--wow-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
main{overflow:clip}
header{background:rgba(255,255,255,.86)!important;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid var(--wow-border)!important;box-shadow:0 8px 30px rgba(20,14,10,.055)!important}
header .mx-auto{max-width:1240px!important}
header nav a{border-radius:999px!important;font-weight:750!important;transition:transform .18s ease,background .18s ease,box-shadow .18s ease!important}
header nav a:hover{transform:translateY(-2px);background:#fff1e6!important;color:var(--wow-orange)!important}
header nav a:last-child{background:linear-gradient(135deg,var(--wow-orange),var(--wow-orange-2))!important;color:#fff!important;box-shadow:0 12px 28px rgba(242,92,5,.25)!important}
h1,h2,h3{color:var(--wow-ink);letter-spacing:-.045em!important}
h1{font-weight:900!important;line-height:1.02!important}
h2{font-weight:850!important}
#view-home>section:first-child{position:relative;padding-top:clamp(4rem,9vw,8rem)!important;padding-bottom:clamp(4rem,8vw,7rem)!important}
#view-home>section:first-child:after{content:"";position:absolute;inset:auto 8% -150px auto;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(242,92,5,.13),transparent 68%);pointer-events:none}
#view-home>section:first-child .grid{align-items:center!important;gap:clamp(2rem,5vw,5rem)!important}
#ruleta{filter:drop-shadow(0 28px 65px rgba(242,92,5,.16))!important}
#wheel{box-shadow:0 28px 70px rgba(23,18,15,.2),0 0 0 10px rgba(255,255,255,.98)!important}
#spinBtn{min-height:60px!important;border-radius:999px!important;background:linear-gradient(135deg,var(--wow-orange),var(--wow-orange-2))!important;box-shadow:0 18px 38px rgba(242,92,5,.28)!important;font-weight:850!important;transition:transform .18s ease,box-shadow .18s ease!important}
#spinBtn:hover{transform:translateY(-3px)!important;box-shadow:0 23px 48px rgba(242,92,5,.34)!important}
#result{border:1px solid var(--wow-border)!important;border-radius:30px!important;background:rgba(255,255,255,.92)!important;box-shadow:var(--wow-shadow)!important}
main section{position:relative}
main p{color:#554b44;line-height:1.8}
main a{transition:color .16s ease}
button,a{touch-action:manipulation}
.seo-hub{max-width:1240px!important;padding:70px 20px!important}
.seo-hub-grid{gap:20px!important}
.seo-card{position:relative;overflow:hidden;border:1px solid var(--wow-border)!important;border-radius:var(--wow-radius)!important;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,250,246,.92))!important;box-shadow:var(--wow-shadow)!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}
.seo-card:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,var(--wow-orange),#ffb45f,#64b9ff);opacity:.9}
.seo-card:hover{transform:translateY(-6px)!important;box-shadow:var(--wow-shadow-lg)!important;border-color:rgba(242,92,5,.22)!important}
.seo-card strong{font-weight:850!important}
.rf-final-footer{margin-top:80px!important;background:#12100f!important;color:#fff!important;border-top:1px solid #2c2926!important}
.rf-footer-inner{max-width:1240px!important;margin:0 auto!important;padding:54px 20px 28px!important}
.rf-footer-brand{display:flex!important;align-items:center!important;gap:12px!important;flex-wrap:wrap!important}
.rf-footer-brand strong{font-size:1.2rem!important;font-weight:850!important}
.rf-footer-brand p{width:100%;margin:0!important;color:#bdb3aa!important;line-height:1.65!important}
.rf-footer-brand .rf-logo{width:46px!important;height:46px!important;border-radius:15px!important;object-fit:cover!important;box-shadow:0 10px 25px rgba(0,0,0,.3)!important}
.rf-footer-brand>span{display:none!important}
.rf-footer-links{margin-top:28px!important;border-top:1px solid #2c2926!important;padding-top:25px!important}
.rf-footer-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px 20px!important}
.rf-footer-grid a{color:#d7d0c9!important;text-decoration:none!important;font-size:.9rem!important;line-height:1.5!important}
.rf-footer-grid a:hover{color:#ff9a58!important}
.rf-footer-copy{margin:36px 0 0!important;padding-top:22px!important;border-top:1px solid #2c2926!important;color:#8f8780!important;text-align:center!important;font-size:.84rem!important}
@media(max-width:767px){
 header .mx-auto{min-height:64px!important;padding:6px 12px!important}
 header nav a{font-size:.78rem!important;padding:.52rem .6rem!important}
 #view-home>section:first-child{padding-top:3rem!important;padding-bottom:3.5rem!important}
 #view-home>section:first-child:after{width:280px;height:280px;right:-150px;bottom:-80px}
 #ruleta .relative.w-full{max-width:min(88vw,350px)!important}
 #spinBtn{width:min(100%,310px)}
 .seo-hub{padding:46px 16px!important}
 .seo-card{border-radius:21px!important}
 .rf-footer-inner{padding:42px 18px 24px!important}
 .rf-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:13px 14px!important}
 .rf-footer-brand .rf-logo{width:42px!important;height:42px!important}
}
@media(min-width:768px) and (max-width:1023px){.rf-footer-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;

function walk(dir){
  const out=[];
  if(!fs.existsSync(dir)) return out;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...walk(full));
    else if(/\.html$/i.test(entry.name)) out.push(full);
  }
  return out;
}

let count=0;
for(const file of walk(OUT)){
  let html=fs.readFileSync(file,'utf8');
  if(!/<\/head>/i.test(html)) continue;
  html=html.replace(/<style[^>]+id=["']ruleta-wow-design["'][^>]*>[\s\S]*?<\/style>/gi,'');
  html=html.replace(/<\/head>/i,`<style id="ruleta-wow-design">${CSS}</style>\n</head>`);
  fs.writeFileSync(file,html);
  count++;
}
console.log(`WOW design complete: ${count} HTML pages polished.`);
