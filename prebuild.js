const fs=require('fs');
const https=require('https');
const ZIP='ruletadecomida_MRMND_5_ANUNCIOS_RESPONSIVE.zip';
const URL='https://raw.githubusercontent.com/messi003322-png/ruletadecomida/main/'+ZIP;

function download(url,dest){return new Promise((resolve,reject)=>{https.get(url,res=>{if(res.statusCode>=300&&res.statusCode<400&&res.headers.location)return download(res.headers.location,dest).then(resolve,reject);if(res.statusCode!==200)return reject(new Error('ZIP download failed: HTTP '+res.statusCode));const out=fs.createWriteStream(dest);res.pipe(out);out.on('finish',()=>out.close(resolve));out.on('error',reject);}).on('error',reject);});}

(async()=>{if(fs.existsSync(ZIP)){console.log('Build asset already present.');return;}console.log('Downloading build asset...');await download(URL,ZIP);console.log('Build asset ready.');})().catch(err=>{console.error(err);process.exit(1);});
