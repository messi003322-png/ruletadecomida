const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const TOPICS={
 'No Se Que Cenar':{intro:'¿No sabes qué cenar? En lugar de revisar una carta entera, empieza por una decisión sencilla: ¿quieres algo ligero, reconfortante, rápido o diferente? Después reduce la elección a dos opciones y decide según el hambre que tengas.',blocks:[['🧩 Rompe la indecisión','Elige primero el tipo de cena y después el plato. Reducir la elección a dos alternativas evita dar vueltas sin decidir.'],['🍲 Según cómo te sientas','Para una noche tranquila puede apetecer algo ligero; si llegas con mucha hambre, busca una opción completa con guarnición o varios componentes.'],['⏰ Según el tiempo','Si tienes prisa, prioriza lugares cercanos y cartas con platos conocidos. Si no tienes tanta prisa, aprovecha para probar una especialidad.'],['🎲 Si sigues sin decidir','Quédate con dos opciones y deja que la ruleta decida. Así conviertes la indecisión en una elección rápida y divertida.']]},
 'Que Cenar Hoy':{intro:'Elegir qué cenar hoy puede ser tan sencillo como adaptar la cena al día que has tenido. Piensa en tu apetito, en cuánto tiempo tienes y en si buscas cocinar, pedir algo o salir a comer.',blocks:[['🌙 Mira cómo ha sido tu día','Después de una comida abundante quizá prefieras algo más ligero. Tras un día activo, una cena más completa puede encajar mejor.'],['🥘 Elige el formato','Puedes optar por un plato único, compartir varios platos, pedir para llevar o sentarte tranquilamente en un restaurante.'],['💰 Ajusta el presupuesto','Antes de elegir, decide cuánto quieres gastar. Así puedes comparar opciones sin que los extras terminen cambiando el precio final.'],['✨ Dale variedad a la semana','Si llevas varios días comiendo lo mismo, cambia de cocina, ingrediente principal o estilo de preparación para que la cena no sea siempre igual.']]},
 'Comida Barata':{intro:'Encontrar comida barata consiste en sacar el máximo partido al presupuesto. El precio de un plato no cuenta toda la historia: también importan la cantidad, lo que incluye y si realmente compensa frente a otras opciones cercanas.',blocks:[['💶 Fija un límite','Decide cuánto quieres gastar antes de mirar la carta. Tener un presupuesto claro facilita descartar opciones que se salen de lo previsto.'],['📋 Busca menús completos','Los menús del día, platos combinados y promociones pueden incluir varios elementos por un precio cerrado. Comprueba exactamente qué entra antes de pedir.'],['🍽️ Compara lo que recibes','Una opción algo más cara puede resultar más económica si incluye guarnición, bebida o una ración mucho más completa.'],['⭐ Revisa la relación calidad-precio','Las opiniones recientes pueden revelar si las cantidades son suficientes y si otros clientes consideran que el precio merece la pena.']]},
 'Cena Rapida':{intro:'Cuando necesitas cenar rápido, la prioridad es reducir el tiempo total desde que decides hasta que tienes la comida delante. La cercanía, el servicio y el tipo de plato pueden marcar más diferencia que una carta enorme.',blocks:[['⚡ Calcula el tiempo real','No mires únicamente la distancia. Ten en cuenta desplazamiento, espera para pedir y tiempo de preparación.'],['🥡 ¿Para llevar o allí?','Si vas a llevarte la comida, elige preparaciones que aguanten bien el trayecto. Si comes en el local, revisa si el servicio suele ser ágil.'],['🍔 Apuesta por opciones prácticas','Bocadillos, hamburguesas, pizzas, bowls y otros platos de preparación sencilla pueden encajar cuando necesitas resolver la cena sin complicaciones.'],['📍 Elige por proximidad','Cuando cada minuto cuenta, un establecimiento cercano y bien valorado puede ser mejor elección que desplazarte lejos por una diferencia pequeña.']]}
};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function run(){
 if(!fs.existsSync(DIST))return;
 let changed=0;
 for(const file of fs.readdirSync(DIST,{recursive:true})){
  if(!file.endsWith('.html'))continue;
  const p=path.join(DIST,file); let html=fs.readFileSync(p,'utf8');
  const key=Object.keys(TOPICS).find(k=>html.includes('Dónde comer '+k)); if(!key)continue;
  const t=TOPICS[key];
  const marker=html.indexOf('Guía específica de '+key); if(marker<0)continue;
  const start=html.lastIndexOf('<section',marker); const end=html.indexOf('</section>',marker);
  if(start<0||end<0)continue;
  const body=html.slice(start,end+10);
  const titleMatch=body.match(/<h[1-3][^>]*>Guía específica de [^<]+<\/h[1-3]>/i);
  if(!titleMatch)continue;
  const headings=t.blocks.map(b=>'<h3>'+b[0]+'</h3><p>'+esc(b[1])+'</p>').join('');
  const replacement='<section class="food-guide topic-guide">'+titleMatch[0]+'<p>'+esc(t.intro)+'</p>'+headings+'</section>';
  html=html.slice(0,start)+replacement+html.slice(end+10);
  fs.writeFileSync(p,html); changed++;
 }
 console.log('[unique-topic-guides] '+changed+' páginas temáticas reescritas con estructuras propias.');
}
if(require.main===module)run();
module.exports={run};