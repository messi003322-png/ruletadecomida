const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP = 'ruletadecomida_MRMND_5_ANUNCIOS_RESPONSIVE.zip';
const OUT = path.join(process.cwd(), 'dist');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const zip = new AdmZip(ZIP);
zip.extractAllTo(OUT, true);

const DESIGN = `
/* Ruleta de Comida — visual refresh (additive; preserves existing content/features) */
:root{--rf-brand:#e85d04;--rf-ink:#1c1917;--rf-border:#e7e5e4;--rf-shadow:0 14px 40px rgba(28,25,23,.08)}
html{scroll-behavior:smooth}body{background:linear-gradient(180deg,#fff 0%,#fafaf9 45%,#fff 100%);color:var(--rf-ink)}
header{box-shadow:0 1px 0 rgba(28,25,23,.05),0 8px 24px rgba(28,25,23,.04)}
header nav a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;font-weight:600}
header nav a:last-child{box-shadow:0 8px 18px rgba(28,25,23,.14)}header nav a:hover{transform:translateY(-1px)}
main section{position:relative}h1,h2,h3{letter-spacing:-.025em}
#ruleta{filter:drop-shadow(0 18px 38px rgba(232,93,4,.08))}#wheel{box-shadow:0 20px 48px rgba(28,25,23,.12),0 0 0 8px rgba(255,255,255,.96)!important}
#spinBtn{min-height:54px;box-shadow:0 12px 26px rgba(28,25,23,.16)!important}#spinBtn:hover{box-shadow:0 16px 32px rgba(232,93,4,.2)!important}
#result{filter:drop-shadow(0 12px 28px rgba(28,25,23,.08))}#result .overflow-hidden{border-radius:24px!important}
#directorio>div>div.rounded-3xl,#faq-list>div{box-shadow:var(--rf-shadow)}
#dir-comidas>a,#dir-ciudades>a,#home-chips>a{transition:transform .15s ease,box-shadow .15s ease}
#dir-comidas>a:hover,#dir-ciudades>a:hover,#home-chips>a:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(28,25,23,.08)}
button,a{touch-action:manipulation}.mrmnd-ad-slot{max-width:100%;overflow:hidden}
@media (max-width:767px){header .mx-auto{min-height:60px;height:auto;padding-top:6px;padding-bottom:6px}header nav{gap:2px!important}header nav a{padding:.55rem .62rem!important;font-size:.82rem!important}header nav a:last-child{padding-left:.9rem!important;padding-right:.9rem!important}#view-home>section:first-child{padding-top:2rem!important;padding-bottom:2.75rem!important}h1{font-size:clamp(2.05rem,9.5vw,3rem)!important;line-height:1.06!important}#ruleta .relative.w-full{max-width:min(84vw,340px)!important}#spinBtn{width:min(100%,300px)}#result{max-width:100%}}
@media (min-width:768px) and (max-width:1023px){#view-home>section:first-child .grid{gap:3rem!important}}
@media (min-width:1024px){#view-home>section:first-child .grid{gap:5rem!important}}
@media (prefers-reduced-motion:reduce){header nav a:hover,#dir-comidas>a:hover,#dir-ciudades>a:hover,#home-chips>a:hover{transform:none}}
`;

function cleanAds(text) {
  text = text.replace(/<style[^>]*id=["']mrmnd-ad-layout["'][^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script\b[^>]*(?:mrmnd\.com|monetag)[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<div[^>]*class=["'][^"']*mrmnd-ad-slot[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '');
  text = text.replace(/\s+data-mnd[a-z0-9-]+=["'][^"']*["']/gi, '');
  return text;
}

function enhance(file) {
  let text = cleanAds(fs.readFileSync(file, 'utf8'));
  if (/<\/head>/i.test(text) && !text.includes('ruleta-visual-refresh')) {
    text = text.replace(/<\/head>/i, `<style id="ruleta-visual-refresh">${DESIGN}</style>\n</head>`);
  }
  fs.writeFileSync(file, text);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html?|css|js|json|xml)$/i.test(entry.name)) enhance(full);
  }
}

walk(OUT);
console.log('Static site extracted, ads cleaned, and responsive visual refresh applied.');
