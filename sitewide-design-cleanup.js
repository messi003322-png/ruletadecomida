const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const SITE='https://www.ruletadecomida.es';
if(!fs.existsSync(OUT)) throw new Error('dist not found');
function walk(dir,cb){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f,cb);else if(/\.html$/i.test(e.name))cb(f);}}
function text(s){return s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();}
function titleFromHref(href,fallback){
  try{const u=new URL(href,SITE);const parts=u.pathname.replace(/\/$/,'').split('/').filter(Boolean);if(!parts.length)return 'Inicio';
    const slug=parts[parts.length-1];
    const foods={'pizza':'🍕 Pizza','sushi':'🍣 Sushi','paella':'🥘 Paella','tapas':'🍢 Tapas','hamburguesa':'🍔 Hamburguesas','ramen':'🍜 Ramen','pasta':'🍝 Pasta','tacos':'🌮 Tacos','curry':'🍛 Curry','tortilla':'🥔 Tortilla de patata','croquetas':'🥟 Croquetas','ensaladas':'🥗 Ensaladas','waffles':'🧇 Waffles','crepes':'🥞 Crepes','helados':'🍦 Helados','kebab':'🥙 Kebab','burritos':'🌯 Burritos','bocadillos':'🥪 Bocadillos','comida-india':'🍛 Comida india','comida-china':'🥢 Comida china','comida-rapida':'⚡ Comida rápida','comida-barata':'💶 Comida barata','comida-saludable':'🥗 Comida saludable','cena-rapida':'⏱️ Cena rápida','que-cenar-hoy':'🍽️ Qué cenar hoy','que-comer-hoy':'🍽️ Qué comer hoy','ideas-de-comida':'💡 Ideas de comida','que-comer-esta-noche':'🌙 Qué comer esta noche'};
    if(foods[slug])return foods[slug];
    const words=slug.replace(/[-_]+/g,' ').split(/\s+/).filter(Boolean);
    if(words.length>=2){const food=foods[words[0]];if(food){const base=food.replace(/^[^ ]+ /,'');return food.split(' ')[0]+' '+base+' en '+words.slice(1).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');}}
    return words.slice(0,6).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
  }catch(e){return fallback||'Ver guía';}
}
function replaceGenericLinks(html){
  return html.replace(/<a\b([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi,(m,attrs,href,inner)=>{
    const visible=text(inner).toLowerCase();
    if(!/^(guia|guía)$/.test(visible))return m;
    const label=titleFromHref(href,'Ver guía');
    return `<a${attrs}>${label}</a>`;
  });
}
function replaceGenericButtons(html){
  return html.replace(/<(button|a)\b([^>]*)>(\s*gu[ií]a\s*)<\/\1>/gi,(m,tag,attrs)=>{
    const href=(attrs.match(/href=["']([^"']+)["']/i)||[])[1]||'';
    return `<${tag}${attrs}>${titleFromHref(href,'Explorar')}</${tag}>`;
  });
}
function polishShortcutSection(html){
  if(!/Atajos populares/i.test(html))return html;
  return html.replace(/(<(?:section|div)\b[^>]*>[\s\S]{0,6000}Atajos populares[\s\S]{0,6000}<\/(?:section|div)>)/i,block=>replaceGenericLinks(block));
}
let pages=0,replaced=0;
walk(OUT,file=>{let html=fs.readFileSync(file,'utf8');const before=html;html=polishShortcutSection(html);html=replaceGenericLinks(html);html=replaceGenericButtons(html);if(html!==before)replaced++;fs.writeFileSync(file,html,'utf8');pages++;});
console.log(`Sitewide design cleanup complete: ${pages} HTML pages checked; ${replaced} pages cleaned of generic guide labels.`);