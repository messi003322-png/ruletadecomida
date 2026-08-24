const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
let changed=0;
function walk(dir){
  if(!fs.existsSync(dir))return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(file);
    else if(entry.name==='index.html'){
      const before=fs.readFileSync(file,'utf8');
      const after=before.replace(/\bpara almuerzo\b/gi,'para almorzar');
      if(after!==before){fs.writeFileSync(file,after,'utf8');changed++;}
    }
  }
}
walk(DIST);
console.log(`[fix-almuerzo-wording] OK: ${changed} páginas corregidas ("para almuerzo" → "para almorzar").`);
