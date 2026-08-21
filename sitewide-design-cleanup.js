const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';
if(!fs.existsSync(OUT)) throw new Error('dist not found');

function walk(dir,cb){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const f=path.join(dir,e.name);
    if(e.isDirectory()) walk(f,cb);
    else if(/\.html$/i.test(e.name)) cb(f);
  }
}
function text(s){return s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();}
function targetFromAttrs(attrs){
  const m=attrs.match(/(?:href|data-href|data-url|data-link)=["']([^"']+)["']/i);
  if(m) return m[1];
  const js=attrs.match(/(?:location(?:\.href)?|window\.location(?:\.href)?)[ ]*=[ ]*["']([^"']+)["']/i);
  return js?js[1]:'';
}
function titleFromTarget(target,fallback){
  try{
    const u=new URL(target||'/',SITE);
    const parts=u.pathname.replace(/\/$/,'').split('/').filter(Boolean);
    if(!parts.length) return fallback||'Inicio';
    const slug=decodeURIComponent(parts[parts.length-1]).toLowerCase();
    const foods={
      pizza:'🍕 Pizza',sushi:'🍣 Sushi',paella:'🥘 Paella',tapas:'🍢 Tapas',
      hamburguesa:'🍔 Hamburguesas',ramen:'🍜 Ramen',pasta:'🍝 Pasta',tacos:'🌮 Tacos',
      curry:'🍛 Curry',tortilla:'🥔 Tortilla de patata',croquetas:'🥟 Croquetas',
      ensaladas:'🥗 Ensaladas',waffles:'🧇 Waffles',crepes:'🥞 Crepes',helados:'🍦 Helados',
      kebab:'🥙 Kebab',burritos:'🌯 Burritos',bocadillos:'🥪 Bocadillos',
      'comida-india':'🍛 Comida india','comida-china':'🥢 Comida china',
      'comida-rapida':'⚡ Comida rápida','comida-barata':'💶 Comida barata',
      'comida-saludable':'🥗 Comida saludable','cena-rapida':'⏱️ Cena rápida',
      'que-cenar-hoy':'🍽️ Qué cenar hoy','que-comer-hoy':'🍽️ Qué comer hoy',
      'ideas-de-comida':'💡 Ideas de comida','que-comer-esta-noche':'🌙 Qué comer esta noche'
    };
    if(foods[slug]) return foods[slug];
    const words=slug.replace(/[-_]+/g,' ').split(/\s+/).filter(Boolean);
    const food=foods[words[0]];
    if(food && words.length>1){
      const emoji=food.split(' ')[0];
      const base=food.replace(/^[^ ]+\s*/,'');
      return `${emoji} ${base} en ${words.slice(1).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')}`;
    }
    return words.slice(0,5).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
  }catch(e){return fallback||'Explorar';}
}
const fallbackLabels=['Ideas para comer','Qué comer hoy','Opciones rápidas','Comidas populares','Ideas para cenar','Comida por ciudad','Descubre comidas','Favoritos','Más ideas','Ver opciones'];
let fallbackIndex=0;
function generic(v){return /^(guia|guía|ver guia|ver guía|explorar)$/i.test(v.trim());}
function replaceGenericControls(html){
  return html.replace(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi,(m,tag,attrs,inner)=>{
    const visible=text(inner);
    if(!generic(visible)) return m;
    const target=targetFromAttrs(attrs);
    let label=titleFromTarget(target,'');
    if(!label || generic(label)) label=fallbackLabels[fallbackIndex++%fallbackLabels.length];
    return `<${tag}${attrs}>${label}</${tag}>`;
  });
}
function polishShortcutSection(html){
  if(!/Atajos populares/i.test(html)) return html;
  return replaceGenericControls(html);
}
let pages=0,replaced=0;
walk(OUT,file=>{
  let html=fs.readFileSync(file,'utf8');
  const before=html;
  html=polishShortcutSection(html);
  html=replaceGenericControls(html);
  if(html!==before) replaced++;
  fs.writeFileSync(file,html,'utf8');
  pages++;
});
console.log(`Sitewide UX cleanup complete: ${pages} HTML pages checked; ${replaced} pages cleaned of generic labels.`);
