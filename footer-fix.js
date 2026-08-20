const fs=require('fs');const path=require('path');
const OUT=path.join(process.cwd(),'dist');
const CSS=`<style id="rf-footer-final-fix">
.rf-final-footer{display:block!important;width:100%!important;margin:0!important;background:#090909!important;color:#fff!important;border-top:1px solid #222!important;box-sizing:border-box!important;clear:both!important}
.rf-final-footer .rf-footer-inner{max-width:1200px!important;margin:0 auto!important;padding:42px 22px 24px!important;box-sizing:border-box!important}
.rf-final-footer .rf-footer-brand strong{display:block!important;font-size:1.25rem!important;color:#fff!important;margin-bottom:4px!important}.rf-final-footer .rf-footer-brand span{display:block!important;color:#b8b8b8!important;font-size:.9rem!important}.rf-final-footer .rf-footer-brand p{color:#aaa!important;margin:8px 0 22px!important;line-height:1.5!important}
.rf-final-footer .rf-footer-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:9px 22px!important}.rf-final-footer .rf-footer-grid a{color:#ddd!important;text-decoration:none!important;font-size:.9rem!important;line-height:1.4!important}.rf-final-footer .rf-footer-grid a:hover{text-decoration:underline!important;color:#fff!important}.rf-final-footer .rf-footer-copy{margin:28px 0 0!important;padding-top:18px!important;border-top:1px solid #292929!important;text-align:center!important;color:#888!important;font-size:.85rem!important}
@media(max-width:767px){.rf-final-footer .rf-footer-inner{padding:30px 16px 18px!important}.rf-final-footer .rf-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px 14px!important}.rf-final-footer .rf-footer-grid a{font-size:.82rem!important}}
</style>`;
function walk(dir){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(/\.html$/i.test(e.name))fix(f)}}
function fix(file){let t=fs.readFileSync(file,'utf8');const m=t.match(/<footer\b[\s\S]*?<\/footer>/i);if(m){const footer=m[0];t=t.replace(m[0],'');t=t.replace(/<\/body>/i,footer+'\n</body>')}if(!t.includes('rf-footer-final-fix'))t=t.replace(/<\/head>/i,CSS+'\n</head>');fs.writeFileSync(file,t)}
walk(OUT);console.log('Footer fixed: final footer forced to bottom on every HTML page.');
