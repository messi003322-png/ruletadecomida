const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const TOPICS=new Set(['No Se Que Cenar','Que Cenar Hoy','Comida Barata','Cena Rapida']);
function clean(s){return s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,' ').replace(/\s+/g,' ').trim();}
function paragraphs(html){return [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>clean(m[1])).filter(x=>x.length>=70)}
function run(){if(!fs.existsSync(DIST))throw new Error('dist no existe');const files=[];for(const file of fs.readdirSync(DIST,{recursive:true})){if(!file.endsWith('.html'))continue;const p=path.join(DIST,file),html=fs.readFileSync(p,'utf8');if(/<section\b[^>]*class=["'][^"']*food-guide/i.test(html))files.push({p,ps:paragraphs(html)})}
 const seen=new Map(),issues=[];for(const f of files)for(const para of f.ps){const key=para.toLowerCase();if(seen.has(key)&&seen.get(key)!==f.p)issues.push(`${seen.get(key)} <-> ${f.p}: "${para.slice(0,120)}"`);else seen.set(key,f.p)}
 if(issues.length)throw new Error(`CONTENIDO DUPLICADO: ${issues.length} coincidencias entre páginas. ${issues.slice(0,10).join(' | ')}`);console.log(`[verify-content-uniqueness] OK: ${files.length} páginas de guía sin párrafos idénticos.`)}
if(require.main===module)run();module.exports={run};