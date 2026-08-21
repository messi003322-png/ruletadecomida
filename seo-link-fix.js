const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';
const EXTERNAL='https://www.aesan.gob.es/nutricion';
if(!fs.existsSync(OUT))throw new Error('dist not found');

const footerLinks=[
 ['Guía de cenas','/que-cenar-hoy/'],['Ideas rápidas','/cena-rapida/'],['Comida económica','/comida-barata/'],
 ['Cena para uno','/cena-para-una-persona/'],['Guía pizza','/pizza/'],['Guía sushi','/sushi/'],['Guía paella','/paella/'],
 ['Guía tapas','/tapas/'],['Comer en Madrid','/madrid/'],['Comer en Barcelona','/barcelona/'],['Comer en Valencia','/valencia/']
];
function esc(v){return String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function walk(dir,cb){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f,cb);else if(/\.html$/i.test(e.name))cb(f);}}
function textOf(s){return s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();}
function shortLabel(href,text){
 const slug=href.replace(/^https?:\/\/[^/]+/,'').replace(/\/$/,'').split('/').pop()||'';
 const map={
  'que-comer-hoy':'Qué comer hoy','ideas-de-comida':'Ideas de comida','que-comer-esta-noche':'Qué comer esta noche',
  'comida-rapida':'Comida rápida','comida-saludable':'Comida saludable','comida-italiana':'Comida italiana',
  'comida-mexicana':'Comida mexicana','comida-espanola':'Comida española','comida-asiatica':'Comida asiática',
  'comida-vegetariana':'Comida vegetariana','comida-para-dos':'Comida en pareja','comida-para-familias':'Comida en familia',
  'que-cenar-hoy':'Qué cenar hoy','cena-rapida':'Cena rápida','comida-barata':'Comida barata','no-se-que-cenar':'No sé qué cenar',
  'cena-para-una-persona':'Cena para una persona'
 };
 if(map[slug])return map[slug];
 const words=slug.replace(/[-_]+/g,' ').split(/\s+/).filter(Boolean);
 const en=words.indexOf('en');
 if(en>0&&words.length>en+1){const city=words.slice(en+1).slice(0,2).join(' ');return `${words[0]} en ${city}`;}
 return words.slice(0,4).join(' ')||text.slice(0,45);
}
function replaceSeoCards(html){
 return html.replace(/<a\s+class=["']seo-card["']\s+href=["']([^"']+)["']\s*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>\s*<\/a>/gi,(m,href,title,desc)=>{
   const label=shortLabel(href,textOf(title));
   return `<div class="seo-card"><strong>${title}</strong><span>${desc}</span><a class="seo-card-link" href="${href}">Ver guía: ${esc(label)}</a></div>`;
 });
}
function shortenLongAnchors(html){
 return html.replace(/<a\b([^>]*href=["'][^"']+["'][^>]*)>([\s\S]*?)<\/a>/gi,(m,attrs,inner)=>{
   if(/\bseo-card-link\b/i.test(attrs))return m;
   const hrefMatch=attrs.match(/href=["']([^"']+)["']/i);if(!hrefMatch)return m;
   const href=hrefMatch[1];if(!/^\//.test(href)&&!href.startsWith(SITE))return m;
   const visible=textOf(inner);if(visible.length<=48)return m;
   return `<a${attrs}>${esc(shortLabel(href,visible))}</a>`;
 });
}
function dedupeAnchors(html){
 const seen=new Map();
 return html.replace(/<a\b([^>]*href=["'][^"']+["'][^>]*)>([\s\S]*?)<\/a>/gi,(m,attrs,inner)=>{
   const visible=textOf(inner);if(!visible)return m;
   const key=visible.toLocaleLowerCase('es');const n=(seen.get(key)||0)+1;seen.set(key,n);
   if(n===1)return m;
   const suffix=n===2?' · guía':' · más ideas';
   return `<a${attrs}>${inner.replace(/\s*$/,'')}${suffix}</a>`;
 });
}
function footerHtml(){
 const internal=footerLinks.map(([label,href])=>`<a href="${SITE}${href}">${esc(label)}</a>`).join('');
 const external=`<a href="${EXTERNAL}" target="_blank" rel="noopener noreferrer">Nutrición — AESAN</a>`;
 return `<footer class="rf-final-footer"><div class="rf-footer-inner"><div class="rf-footer-brand"><strong>Ruleta de Comida</strong><p>Decide qué comer o cenar en segundos. 20 comidas · 79 ciudades.</p></div><nav class="rf-footer-links" aria-label="Guías y recursos de comida"><div class="rf-footer-grid">${internal}${external}</div></nav><p class="rf-footer-copy">© 2026 Ruleta de Comida</p></div></footer>`;
}
const CSS=`.seo-card-link{display:inline-flex!important;margin-top:16px!important;font-weight:700!important;color:var(--rf-brand,#e85d04)!important;text-decoration:none!important}.rf-footer-external{margin:18px 0 0;text-align:center}.rf-footer-external a{font-weight:600}`;
let count=0;
walk(OUT,file=>{
 let html=fs.readFileSync(file,'utf8');
 html=replaceSeoCards(html);
 html=shortenLongAnchors(html);
 html=html.replace(/<footer\b[\s\S]*?<\/footer>/gi,footerHtml());
 html=dedupeAnchors(html);
 if(/<\/head>/i.test(html)){html=html.replace(/<style[^>]+id=["']seo-link-fix["'][^>]*>[\s\S]*?<\/style>/gi,'');html=html.replace(/<\/head>/i,`<style id="seo-link-fix">${CSS}</style>\n</head>`);}
 fs.writeFileSync(file,html,'utf8');count++;
});
console.log(`SEO link improvements complete on ${count} HTML pages: short unique internal anchors, concise SEO cards, and an authoritative external link.`);
