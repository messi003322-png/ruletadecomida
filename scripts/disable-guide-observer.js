const fs=require('fs');
const path=require('path');
const INDEX=path.join(__dirname,'..','dist','index.html');
function run(){
 if(!fs.existsSync(INDEX)) return false;
 let html=fs.readFileSync(INDEX,'utf8');
 html=html.replace(/var observer=new MutationObserver\([\s\S]*?\);observer\.observe\(document\.documentElement,\{childList:true,subtree:true\}\);/g,'');
 fs.writeFileSync(INDEX,html,'utf8');
 return true;
}
if(require.main===module)run();
module.exports={run};
