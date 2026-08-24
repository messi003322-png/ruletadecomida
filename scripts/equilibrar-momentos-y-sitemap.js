const fs=require('fs');
const path=require('path');
const DIST=path.join(process.cwd(),'dist');
const moments=[
  ['desayuno','🍳 Desayunar'],
  ['almuerzo','🍲 Almorzar'],
  ['merienda','☕ Merendar'],
  ['cena','🌙 Cenar']
];
function walk(dir,fn){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p,fn);else if(/\.html$/i.test(e.name))fn(p)}}
function cleanSitemapLinks(html){return html.replace(/<a\b[^>]*href=["'][^"']*sitemap(?:\.xml)?[^"']*["'][^>]*>[\s\S]*?<\/a>/gi,'');}
function addMomentNav(html){
  if(!/<body\b/i.test(html)||/id=["']rf-momentos-equilibrados["']/i.test(html)) return html;
  const nav=`<nav id="rf-momentos-equilibrados" aria-label="Momentos del día" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:18px auto;max-width:900px">${moments.map(([slug,label])=>`<a href="/${slug}/" style="padding:9px 14px;border-radius:999px;text-decoration:none">${label}</a>`).join('')}</nav>`;
  return html.replace(/<body([^>]*)>/i,`<body$1>${nav}`);
}
walk(DIST,p=>{let h=fs.readFileSync(p,'utf8');h=cleanSitemapLinks(h);if(path.relative(DIST,p)==='index.html')h=addMomentNav(h);fs.writeFileSync(p,h,'utf8')});
console.log('OK: sitemap fuera de la navegación visible + momentos equilibrados.');
