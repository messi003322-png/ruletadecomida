#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const DIST = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const f=path.join(dir,e.name);return e.isDirectory()?walk(f):[f]})}
function targetFile(href){
  let u;
  try{u=new URL(href,SITE)}catch{return null}
  if(u.origin!==SITE)return null;
  let p=decodeURIComponent(u.pathname);
  if(!p.endsWith('/'))p+='/';
  return path.join(DIST,p.replace(/^\//,''),'index.html');
}
let pages=0,removed=0;
for(const file of walk(DIST).filter(f=>f.endsWith('.html'))){
  let html=fs.readFileSync(file,'utf8');
  const next=html.replace(/<a\b([^>]*?)\bhref=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi,(all,before,href,after,text)=>{
    const target=targetFile(href);
    if(target && !fs.existsSync(target)) { removed++; return text; }
    return all;
  });
  if(next!==html){fs.writeFileSync(file,next);pages++;}
}
console.log(`[fix-broken-internal-links] ${removed} enlaces internos inválidos eliminados en ${pages} HTML; texto conservado.`);
