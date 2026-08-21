const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');
if(!fs.existsSync(OUT)) throw new Error('dist not found');

function walk(dir,callback){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file,callback);else if(/\.html$/i.test(entry.name))callback(file);}}
function reduceStrong(html){let count=0;return html.replace(/<(strong|b)(\b[^>]*)>([\s\S]*?)<\/\1>/gi,(match,tag,attributes,inner)=>{count++;if(count<=22)return match;return `<span class="seo-demoted-bold"${attributes}>${inner}</span>`;});}
function removeInlineShareBlocks(html){html=html.replace(/<section\b[^>]*\bid=["']seo-social-share["'][^>]*>[\s\S]*?<\/section>\s*/gi,'');html=html.replace(/<script\b[^>]*>[\s\S]*?seo-native-share[\s\S]*?<\/script>\s*/gi,'');html=html.replace(/<style\b[^>]*id=["']seo-final-polish-css["'][^>]*>[\s\S]*?<\/style>\s*/gi,'');return html;}
function addMinimalStyle(html){if(/id=["']seo-final-polish-css["']/i.test(html)||!/<\/head>/i.test(html))return html;const style='<style id="seo-final-polish-css">.seo-demoted-bold{font-weight:700}</style>';return html.replace(/<\/head>/i,style+'</head>');}

let count=0;
walk(OUT,file=>{let html=fs.readFileSync(file,'utf8');html=removeInlineShareBlocks(html);html=reduceStrong(html);html=addMinimalStyle(html);fs.writeFileSync(file,html,'utf8');count++;});
console.log(`Final SEO polish complete: ${count} HTML pages processed; inline share blocks removed.`);
