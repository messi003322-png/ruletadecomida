const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const ZIP = 'ruletadecomida_MRMND_5_ANUNCIOS_RESPONSIVE.zip';
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const zip = new AdmZip(ZIP);
zip.extractAllTo(OUT, true);

const DESIGN = `
:root{--rf-brand:#e85d04;--rf-ink:#1c1917;--rf-border:#e7e5e4;--rf-shadow:0 14px 40px rgba(28,25,23,.08)}
html{scroll-behavior:smooth}body{background:linear-gradient(180deg,#fff 0%,#fafaf9 45%,#fff 100%);color:var(--rf-ink)}
header{box-shadow:0 1px 0 rgba(28,25,23,.05),0 8px 24px rgba(28,25,23,.04)}
header nav a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;font-weight:600;transition:transform .2s ease,box-shadow .2s ease}
header nav a:last-child{box-shadow:0 8px 18px rgba(28,25,23,.14)}header nav a:hover{transform:translateY(-1px)}
main section{position:relative}h1,h2,h3{letter-spacing:-.025em}
#ruleta{filter:drop-shadow(0 18px 38px rgba(232,93,4,.08))}#wheel{box-shadow:0 20px 48px rgba(28,25,23,.12),0 0 0 8px rgba(255,255,255,.96)!important}
#spinBtn{min-height:54px;box-shadow:0 12px 26px rgba(28,25,23,.16)!important}#spinBtn:hover{box-shadow:0 16px 32px rgba(28,25,23,.2)!important}
#result{filter:drop-shadow(0 12px 28px rgba(28,25,23,.08))}#result .overflow-hidden{border-radius:24px!important}
button,a{touch-action:manipulation}.mrmnd-ad-slot{max-width:100%;overflow:hidden}
.seo-hub{max-width:1200px;margin:0 auto;padding:48px 20px}.seo-hub-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.seo-card{display:block;padding:22px;border:1px solid var(--rf-border);border-radius:20px;background:#fff;box-shadow:var(--rf-shadow);text-decoration:none;color:inherit;transition:transform .2s ease,box-shadow .2s ease}.seo-card:hover{transform:translateY(-3px);box-shadow:0 18px 44px rgba(28,25,23,.12)}.seo-card strong{display:block;font-size:1.05rem;margin-bottom:7px}.seo-card span{display:block;color:#57534e;font-size:.94rem;line-height:1.5}.seo-hub h2{font-size:clamp(1.8rem,4vw,2.5rem);margin-bottom:10px}.seo-hub-intro{color:#57534e;margin-bottom:24px;max-width:760px;line-height:1.65}
.rf-footer-brand{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.rf-footer-brand strong{display:inline-flex;align-items:center;font-size:1.1rem}.rf-footer-brand p{width:100%;margin:.35rem 0 0}.rf-footer-brand span{display:none!important}
@media (max-width:767px){header .mx-auto{min-height:60px;height:auto;padding-top:6px;padding-bottom:6px}header nav{gap:2px!important}header nav a{padding:.55rem .62rem!important;font-size:.82rem!important}header nav a:last-child{padding-left:.9rem!important;padding-right:.9rem!important}#view-home>section:first-child{padding-top:2rem!important;padding-bottom:2.75rem!important}h1{font-size:clamp(2.05rem,9.5vw,3rem)!important;line-height:1.06!important}#ruleta .relative.w-full{max-width:min(84vw,340px)!important}#spinBtn{width:min(100%,300px)}#result{max-width:100%}.seo-hub{padding:34px 16px}.seo-hub-grid{grid-template-columns:1fr;gap:12px}}
@media (min-width:768px) and (max-width:1023px){#view-home>section:first-child .grid{gap:3rem!important}.seo-hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1024px){#view-home>section:first-child .grid{gap:5rem!important}}
@media (prefers-reduced-motion:reduce){header nav a:hover,.seo-card:hover{transform:none}}
`;

function cleanAds(text) {
  text = text.replace(/<style[^>]*id=["']mrmnd-ad-layout["'][^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script\b[^>]*(?:mrmnd\.com|monetag)[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<div[^>]*class=["'][^"']*mrmnd-ad-slot[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '');
  text = text.replace(/\s+data-mnd[a-z0-9-]+=["'][^"']*["']/gi, '');
  return text;
}

const footerLinks = [
  ['Qué cenar hoy','/que-cenar-hoy/'],['Cena rápida','/cena-rapida/'],['Comida barata','/comida-barata/'],['No sé qué cenar','/no-se-que-cenar/'],['Cena para una persona','/cena-para-una-persona/'],
  ['Pizza','/pizza/'],['Sushi','/sushi/'],['Paella','/paella/'],['Tapas','/tapas/'],['Madrid','/madrid/'],['Barcelona','/barcelona/'],['Valencia','/valencia/'],
  ['Pizza en Madrid','/pizza-madrid/'],['Paella en Valencia','/paella-valencia/'],['Tapas en Sevilla','/tapas-sevilla/'],['Sushi en Barcelona','/sushi-barcelona/'],['Comida china en Málaga','/comida-china-malaga/'],['Hamburguesa en Madrid','/hamburguesa-madrid/'],['Kebab en Barcelona','/kebab-barcelona/'],['Ramen en Valencia','/ramen-valencia/'],['Tortilla en Bilbao','/tortilla-bilbao/'],['Croquetas en Madrid','/croquetas-madrid/'],['Pasta en Barcelona','/pasta-barcelona/'],['Ensaladas en Madrid','/ensaladas-madrid/'],['Waffles en Algeciras','/waffles-algeciras/'],['Crepes en Alicante','/crepes-alicante/'],['Comida india en Mataró','/comida-india-mataro/'],['Pizza en Cornellà','/pizza-cornella/'],['Tortilla de patata en San Sebastián de los Reyes','/tortilla-de-patata-san-sebastian-de-los-reyes/'],['Croquetas en Badajoz','/croquetas-badajoz/'],['Comida india en Cádiz','/comida-india-cadiz/'],['Tapas en Parla','/tapas-parla/'],['Waffles en Coslada','/waffles-coslada/'],['Croquetas en Vigo','/croquetas-vigo/'],['Bocadillos en Elche','/bocadillos-elche/'],['Ramen en Melilla','/ramen-melilla/'],['Comida china en San Sebastián de los Reyes','/comida-china-san-sebastian-de-los-reyes/'],['Croquetas en Las Palmas','/croquetas-las-palmas/'],['Bocadillos en Ourense','/bocadillos-ourense/'],['Tapas en Badajoz','/tapas-badajoz/'],['Kebab en Vigo','/kebab-vigo/'],['Crepes en San Sebastián de los Reyes','/crepes-san-sebastian-de-los-reyes/'],['Pasta en Lasarte','/pasta-lasarte/'],['Helados en Barakaldo','/helados-barakaldo/'],['Kebab en Mataró','/kebab-mataro/'],['Croquetas en Torrent','/croquetas-torrent/'],['Burritos en Palma','/burritos-palma/'],['Helados en El Puerto de Santa María','/helados-el-puerto-de-santa-maria/']
];
function footerHtml(){return `<footer class="rf-final-footer"><div class="rf-footer-inner"><div class="rf-footer-brand"><strong>Ruleta de Comida</strong><p>Decide qué comer o cenar en segundos. 20 comidas · 79 ciudades.</p></div><nav class="rf-footer-links" aria-label="Guías de comida"><div class="rf-footer-grid">${footerLinks.map(([label,url])=>`<a href="${SITE}${url}">${label}</a>`).join('')}</div></nav><p class="rf-footer-copy">© 2026 Ruleta de Comida</p></div></footer>`}
function cleanFooter(text) {
  return text.replace(/<footer\b[\s\S]*?<\/footer>/gi, footerHtml());
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function pageUrl(file){const rel=path.relative(OUT,file).replace(/\\/g,'/');let u='/'+rel;if(u.endsWith('/index.html'))u=u.slice(0,-10);else if(u.endsWith('.html'))u=u.slice(0,-5);if(u==='/index')u='/';return SITE+(u==='/'?'':u)}
function seoFor(file,text){const rel=path.relative(OUT,file).replace(/\\/g,'/');const cleanPath=rel.replace(/\/index\.html$/i,'').replace(/\.html$/i,'').replace(/[-_]+/g,' ').replace(/\//g,' ').trim();let title=(text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||'';title=title.replace(/\s+/g,' ').trim();const isHome=rel.toLowerCase()==='index.html';if(isHome)title='Ruleta de Comida | ¿Qué comer hoy? Ideas para cenar';else if(!title||title.length<12)title=cleanPath?`${cleanPath.replace(/\b\w/g,c=>c.toUpperCase())} | Ruleta de Comida`:'Ruleta de Comida | ¿Qué comer hoy?';if(title.length>60)title=title.slice(0,57).replace(/\s+$/,'')+'...';const description=isHome?'¿Qué comer hoy? Gira la ruleta de comida y descubre una idea rápida. Gratis, sin registro y con guías para elegir comida según tus gustos y situación.':`Descubre ideas de comida para ${cleanPath}. Consejos prácticos para elegir qué comer o cenar según tu tiempo, situación y preferencias.`;return {title,description,url:pageUrl(file)}}
function injectSeo(file,text){if(!/<\/head>/i.test(text))return text;const seo=seoFor(file,text);text=text.replace(/<title[^>]*>[\s\S]*?<\/title>/i,'');text=text.replace(/<meta\s+name=["']description["'][^>]*>\s*/gi,'');text=text.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi,'');const schema={'@context':'https://schema.org','@graph':[{'@type':'WebSite',name:'Ruleta de Comida',url:SITE},{'@type':'Organization',name:'Ruleta de Comida',url:SITE},{'@type':'WebPage',name:seo.title,description:seo.description,url:seo.url}]};const head=`<title>${esc(seo.title)}</title>\n<meta name="description" content="${esc(seo.description)}">\n<link rel="canonical" href="${esc(seo.url)}">\n<meta name="robots" content="index,follow,max-image-preview:large">\n<meta property="og:title" content="${esc(seo.title)}">\n<meta property="og:description" content="${esc(seo.description)}">\n<meta property="og:url" content="${esc(seo.url)}">\n<meta property="og:type" content="website">\n<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`;return text.replace(/<\/head>/i,head+'</head>')}
function enhance(file){let text=cleanAds(fs.readFileSync(file,'utf8'));text=cleanFooter(text);if(/<\/head>/i.test(text)&&!text.includes('ruleta-visual-refresh'))text=text.replace(/<\/head>/i,`<style id="ruleta-visual-refresh">${DESIGN}</style>\n</head>`);text=injectSeo(file,text);fs.writeFileSync(file,text)}
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.(html?|css|js|json|xml)$/i.test(entry.name))enhance(full)}}
walk(OUT);
const pages=[];function collect(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())collect(full);else if(/\.html$/i.test(entry.name))pages.push(pageUrl(full))}}collect(OUT);pages.sort();const sitemap=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',...pages.map(u=>`<url><loc>${esc(u)}</loc></url>`),'</urlset>'].join('');fs.writeFileSync(path.join(OUT,'sitemap.xml'),sitemap);fs.writeFileSync(path.join(OUT,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);console.log(`SEO build complete: ${pages.length} HTML pages enhanced; sitemap and robots generated.`);