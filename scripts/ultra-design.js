/**
 * Ultra Premium Design System — Ruleta de Comida
 * Inyecta CSS global de alto nivel en todas las páginas HTML de dist/
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

const CSS = `<style id="rf-ultra-design">
/* ========== ULTRA PREMIUM DESIGN SYSTEM 2026 ========== */
:root{
  --u-orange:#ff6b1a;
  --u-orange-hot:#ff4500;
  --u-orange-soft:#ffb347;
  --u-ink:#1a1210;
  --u-ink-soft:#3d2e28;
  --u-muted:#7a6358;
  --u-cream:#fffbf7;
  --u-surface:#ffffff;
  --u-line:rgba(255,140,50,.14);
  --u-glow:0 0 60px rgba(255,107,26,.18);
  --u-shadow:0 20px 50px -12px rgba(60,30,10,.14);
  --u-shadow-lg:0 32px 64px -16px rgba(60,30,10,.18);
  --u-radius:24px;
  --u-radius-sm:16px;
  --u-font:"DM Sans",system-ui,-apple-system,sans-serif;
}

html{scroll-behavior:smooth;background:var(--u-cream)}
body{
  font-family:var(--u-font)!important;
  color:var(--u-ink)!important;
  background:
    radial-gradient(ellipse 80% 50% at 90% -10%,rgba(255,140,50,.22),transparent 50%),
    radial-gradient(ellipse 60% 40% at 5% 20%,rgba(255,200,120,.15),transparent 45%),
    radial-gradient(ellipse 50% 30% at 50% 100%,rgba(255,160,80,.08),transparent 40%),
    linear-gradient(180deg,#fffdf9 0%,#fff8f0 40%,#fffbf7 100%)!important;
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

body::before{
  content:"";
  position:fixed;inset:0;z-index:-1;pointer-events:none;
  opacity:.03;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ========== HEADER GLASS ========== */
header{
  position:sticky!important;top:0;z-index:100!important;
  background:rgba(255,253,249,.82)!important;
  border-bottom:1px solid rgba(255,180,100,.18)!important;
  box-shadow:0 4px 30px rgba(80,40,10,.06)!important;
  backdrop-filter:blur(20px) saturate(160%)!important;
  -webkit-backdrop-filter:blur(20px) saturate(160%)!important;
}
header .mx-auto{
  max-width:1280px!important;
  padding-top:12px!important;padding-bottom:12px!important;
}
header nav{
  gap:4px!important;padding:5px!important;
  border:1px solid rgba(255,190,120,.25)!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.7)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8),0 2px 8px rgba(80,40,10,.04)!important;
}
header nav a{
  min-height:40px!important;padding:8px 16px!important;
  border-radius:999px!important;
  color:var(--u-ink-soft)!important;
  font-weight:700!important;font-size:.9rem!important;
  letter-spacing:-.015em!important;
  transition:all .25s cubic-bezier(.22,1,.36,1)!important;
}
header nav a:hover{
  color:var(--u-orange-hot)!important;
  background:rgba(255,107,26,.1)!important;
  transform:translateY(-1px)!important;
}
header nav a:last-child,
header nav a[href*="#"],
header a.bg-brand,
header .bg-orange-500,
header a.rounded-full:last-child{
  color:#fff!important;
  background:linear-gradient(135deg,#ff9a3c 0%,#ff6b1a 50%,#ff4500 100%)!important;
  box-shadow:0 8px 20px rgba(255,80,0,.28),inset 0 1px 0 rgba(255,255,255,.25)!important;
  border:none!important;
}
header nav a:last-child:hover{
  transform:translateY(-2px) scale(1.02)!important;
  box-shadow:0 12px 28px rgba(255,80,0,.35)!important;
}

/* ========== TYPOGRAPHY ========== */
h1,h2,h3,h4{
  color:var(--u-ink)!important;
  letter-spacing:-.04em!important;
  font-weight:800!important;
}
h1{
  font-size:clamp(2.4rem,6vw,4.2rem)!important;
  line-height:1.02!important;
  font-weight:900!important;
}
h1 .text-brand,h1 span[class*="orange"],h1 .text-orange-600{
  background:linear-gradient(135deg,#ff6b1a,#ff4500 60%,#e03000)!important;
  -webkit-background-clip:text!important;
  background-clip:text!important;
  -webkit-text-fill-color:transparent!important;
  color:transparent!important;
}
h2{font-size:clamp(1.5rem,3.5vw,2.1rem)!important;line-height:1.15!important}
h3{font-size:clamp(1.15rem,2.5vw,1.4rem)!important;line-height:1.25!important}
p{color:var(--u-muted)!important;line-height:1.75!important;font-size:1.05rem!important}

/* ========== HERO ========== */
#view-home>section:first-child,
section.hero,
main>section:first-of-type{
  position:relative;
  overflow:hidden;
}
#view-home>section:first-child::after{
  content:"";
  position:absolute;right:-12rem;top:-8rem;
  width:36rem;height:36rem;border-radius:50%;
  background:conic-gradient(from 200deg,#ff8c42,#ffd06a,#6ec8f0,#c49aff,#ff6b6b,#ff8c42);
  opacity:.12;filter:blur(4px);pointer-events:none;
  animation:rfOrb 18s linear infinite;
}
@keyframes rfOrb{to{transform:rotate(360deg)}}

.eyebrow,span.rounded-full,div.rounded-full.border{
  border-color:rgba(255,140,50,.3)!important;
  background:linear-gradient(135deg,#fff7ed,#ffedd5)!important;
  color:#c2410c!important;
  font-weight:750!important;
  box-shadow:0 2px 8px rgba(255,120,30,.08)!important;
}

/* ========== RULETA ========== */
#ruleta{filter:drop-shadow(0 28px 50px rgba(255,100,20,.2))!important}
#wheel{
  box-shadow:
    0 0 0 12px rgba(255,255,255,.98),
    0 0 0 14px rgba(255,160,80,.15),
    0 30px 70px rgba(40,20,5,.22)!important;
  border-radius:50%!important;
}
#spinBtn,button#spinBtn,a#spinBtn{
  position:relative;overflow:hidden;
  min-height:60px!important;padding:16px 36px!important;
  border-radius:999px!important;border:none!important;
  background:linear-gradient(135deg,#ffb347 0%,#ff6b1a 45%,#ff4500 100%)!important;
  color:#fff!important;font-weight:850!important;font-size:1.15rem!important;
  letter-spacing:-.02em!important;
  box-shadow:0 16px 36px rgba(255,80,0,.32),inset 0 1px 0 rgba(255,255,255,.3)!important;
  transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease!important;
}
#spinBtn::before{
  content:"";position:absolute;inset:0;
  background:linear-gradient(105deg,rgba(255,255,255,.4) 0%,transparent 40%,transparent 60%,rgba(255,255,255,.15) 100%);
  pointer-events:none;
}
#spinBtn:hover{transform:translateY(-4px) scale(1.03)!important;box-shadow:0 22px 48px rgba(255,80,0,.4)!important}
#spinBtn:active{transform:translateY(-1px) scale(.98)!important}
#result{
  border:1px solid rgba(255,180,100,.35)!important;
  border-radius:var(--u-radius)!important;
  background:linear-gradient(145deg,#fffefb,#fff5eb)!important;
  box-shadow:var(--u-shadow)!important;
}

/* ========== CARDS ========== */
#home-explore>div,.seo-hub,.seo-card,main article,.article-content{
  border:1px solid var(--u-line)!important;
  border-radius:var(--u-radius)!important;
  background:rgba(255,255,255,.82)!important;
  box-shadow:var(--u-shadow)!important;
}
#home-explore a,.seo-card{
  border-radius:var(--u-radius-sm)!important;
  border:1px solid rgba(255,190,120,.2)!important;
  background:linear-gradient(160deg,#fff,#fffaf5)!important;
  box-shadow:0 8px 24px rgba(80,40,10,.06)!important;
  transition:all .3s cubic-bezier(.22,1,.36,1)!important;
}
#home-explore a:hover,.seo-card:hover{
  transform:translateY(-6px)!important;
  border-color:rgba(255,140,50,.4)!important;
  box-shadow:0 20px 40px rgba(80,40,10,.12)!important;
}

/* ========== CIUDADES / ANTOJOS CHIPS (FIX) ========== */
#seo-map-ciudades{
  max-width:1120px!important;
  margin:0 auto!important;
  padding:28px 20px 48px!important;
  border-top:1px solid rgba(255,255,255,.1)!important;
}
#seo-map-ciudades > p.font-semibold,
#seo-map-ciudades > p:nth-child(1),
#seo-map-ciudades > p:nth-child(3){
  display:block!important;
  width:100%!important;
  margin:0 0 12px!important;
  padding:0!important;
  color:#fff0e2!important;
  font-size:.78rem!important;
  font-weight:850!important;
  letter-spacing:.1em!important;
  text-transform:uppercase!important;
  line-height:1.3!important;
}
#seo-map-ciudades > p:nth-child(3){margin-top:28px!important}
/* Oculta los separadores · y convierte en grilla de chips */
#seo-map-ciudades > p.mb-4,
#seo-map-ciudades > p:nth-child(2),
#seo-map-ciudades > p:nth-child(4){
  display:flex!important;
  flex-wrap:wrap!important;
  gap:8px!important;
  margin:0 0 8px!important;
  padding:0!important;
  font-size:0!important; /* esconde el texto · */
  line-height:0!important;
  color:transparent!important;
}
#seo-map-ciudades a{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  min-height:40px!important;
  margin:0!important;
  padding:8px 14px!important;
  border:1px solid rgba(255,255,255,.14)!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.08)!important;
  color:#f0e0d4!important;
  font-size:.82rem!important;
  font-weight:650!important;
  line-height:1.25!important;
  text-decoration:none!important;
  white-space:nowrap!important;
  transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease!important;
}
#seo-map-ciudades a:hover,
#seo-map-ciudades a:focus{
  background:rgba(255,120,40,.22)!important;
  border-color:rgba(255,160,80,.45)!important;
  color:#fff!important;
  transform:translateY(-1px)!important;
}

/* También en páginas claras (si el bloque aparece fuera del footer oscuro) */
body:not(.dark) #seo-map-ciudades:not(.rf-final-footer *){
  /* fallback por si se reutiliza el bloque */
}

/* ========== TABLES / FAQ ========== */
.rf-data-table{
  border:1px solid var(--u-line)!important;
  border-radius:var(--u-radius)!important;
  overflow:hidden!important;
  box-shadow:var(--u-shadow)!important;
  background:#fff!important;
}
.rf-data-table h2{
  background:linear-gradient(135deg,#fff7ed,#ffedd5)!important;
  color:var(--u-ink)!important;
}
main details{
  border:1px solid var(--u-line)!important;
  border-radius:var(--u-radius-sm)!important;
  background:linear-gradient(145deg,#fff,#fffaf5)!important;
  box-shadow:0 6px 18px rgba(80,40,10,.05)!important;
  margin:12px 0!important;
}
main details summary{
  padding:18px 22px!important;font-weight:750!important;
  list-style:none!important;cursor:pointer!important;
}
main details summary::-webkit-details-marker{display:none!important}
main details summary::after{content:"+";float:right;color:var(--u-orange);font-size:1.4rem}
main details[open] summary::after{content:"–"}

/* ========== CTA / FOOTER ========== */
.rf-decision-cta-inner{
  border-radius:28px!important;
  background:radial-gradient(circle at 90% 20%,rgba(255,160,60,.35),transparent 40%),linear-gradient(135deg,#2a1810 0%,#5c2a12 45%,#c43a00 100%)!important;
  box-shadow:0 28px 56px rgba(80,30,5,.28)!important;
}
.rf-final-footer{
  margin-top:80px!important;
  border-top:1px solid rgba(255,180,100,.2)!important;
  background:radial-gradient(ellipse at 85% 0%,rgba(255,120,40,.2),transparent 50%),linear-gradient(160deg,#1a100c 0%,#0f0a08 100%)!important;
}
.rf-share-float{
  box-shadow:0 12px 32px rgba(255,80,0,.3)!important;
  background:linear-gradient(135deg,#ff9a3c,#ff6b1a)!important;
}

/* ========== MOBILE ========== */
@media(max-width:767px){
  header .mx-auto{padding:8px 12px!important}
  header nav{border:0!important;background:transparent!important;padding:0!important;gap:2px!important}
  header nav a{min-height:36px!important;padding:7px 10px!important;font-size:.8rem!important}
  h1{font-size:clamp(2rem,9vw,2.8rem)!important;line-height:1.05!important}
  #ruleta .relative.w-full{max-width:min(88vw,360px)!important}
  #spinBtn{width:min(100%,320px)!important;min-height:56px!important}
  #seo-map-ciudades{padding:22px 16px 100px!important}
  #seo-map-ciudades > p.mb-4,
  #seo-map-ciudades > p:nth-child(2),
  #seo-map-ciudades > p:nth-child(4){
    gap:7px!important;
  }
  #seo-map-ciudades a{
    min-height:38px!important;
    padding:7px 12px!important;
    font-size:.78rem!important;
  }
}

@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  #view-home>section:first-child::after{animation:none}
}
::selection{background:var(--u-orange)!important;color:#fff!important}
</style>`;

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, cb);
    else if (/\.html$/i.test(e.name)) cb(p);
  }
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[ultra-design] dist/ no existe');
    return 0;
  }
  let n = 0;
  walk(DIST, (file) => {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<style id="rf-ultra-design">[\s\S]*?<\/style>/i, '');
    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, CSS + '</head>');
      fs.writeFileSync(file, html, 'utf8');
      n++;
    }
  });
  console.log(`[ultra-design] Aplicado a ${n} páginas`);
  return n;
}

if (require.main === module) run();
module.exports = { run };
