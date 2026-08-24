const fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist');
const TOPICS={
 'No Se Que Cenar':{intro:'Cuando no sabes qué cenar, la mejor estrategia es reducir opciones en lugar de abrir una carta interminable. Piensa primero en el tiempo que tienes, el hambre y el tipo de comida que realmente te apetece.',blocks:[['⏱️ Empieza por el tiempo','Si tienes poco tiempo, prioriza locales con servicio ágil o platos que conozcas bien. Si puedes esperar, aprovecha para probar una especialidad de la casa.'],['🤔 Decide por antojo','¿Te apetece algo caliente, ligero, crujiente o contundente? Elegir por textura y tipo de sabor suele ser más fácil que escoger entre veinte platos.'],['📍 Mira lo que tienes cerca','Compara distancia, horario y opciones para llevar antes de decidir. Una buena opción cercana puede encajar mejor que desplazarte mucho por un plato parecido.'],['🎯 Hazlo sencillo','Si sigues dudando, elige entre dos opciones y quédate con la que mejor encaje con tu hambre y presupuesto.']]},
 'Que Cenar Hoy':{intro:'Para decidir qué cenar hoy conviene combinar tres cosas: el tiempo disponible, el hambre y las ganas que tengas de cocinar o salir. Así puedes pasar de una lista enorme a unas pocas opciones razonables.',blocks:[['🌙 Piensa en esta noche','Una cena ligera puede encajar mejor después de una comida abundante, mientras que un día de mucha actividad puede pedir algo más completo.'],['🥗 Según el hambre','No es lo mismo buscar un picoteo que una cena que te deje satisfecho. Ajusta la cantidad y los acompañamientos antes de elegir.'],['💳 Ten en cuenta el presupuesto','Compara menú, ración y extras. A veces un plato sencillo ofrece mejor relación calidad-precio que una opción más llamativa.'],['✨ Cambia la rutina','Si siempre eliges lo mismo, busca una cocina distinta o una preparación que no hayas probado recientemente.']]},
 'Comida Barata':{intro:'Comer barato no significa elegir al azar. Una buena opción económica combina un precio razonable con una ración adecuada, ingredientes correctos y una preparación que justifique lo que pagas.',blocks:[['💶 Mira el precio real','Comprueba qué incluye la ración y si bebidas, acompañamientos o extras cambian mucho el total.'],['🍽️ Ración frente a calidad','Una ración enorme no siempre es una ganga. Valora también el producto, la preparación y si realmente vas a disfrutar de lo que pides.'],['📋 Menús y ofertas','Los menús del día, promociones y platos combinados pueden ser interesantes, especialmente entre semana. Revisa qué opciones incluye cada oferta.'],['⭐ Busca experiencias recientes','Las reseñas que hablan de cantidades y relación calidad-precio son especialmente útiles cuando tu prioridad es gastar poco.']]},
 'Cena Rapida':{intro:'Si buscas una cena rápida, el tiempo de servicio importa tanto como la comida. Conviene elegir un sitio que pueda resolver la cena sin convertirla en una espera larga.',blocks:[['⚡ Prioriza rapidez','Mira horarios, servicio para llevar y comentarios recientes sobre tiempos de espera.'],['🥡 Para llevar o comer allí','Decide primero cómo quieres cenar. Algunas preparaciones mantienen mejor su textura al transportarlas que otras.'],['🍔 Elige platos prácticos','Bocadillos, hamburguesas, pizzas, bowls y otras opciones pueden funcionar bien cuando buscas algo sencillo y rápido.'],['📍 La distancia cuenta','Un local cercano con buenas opiniones puede ser una mejor elección que uno más lejano si tienes prisa.']]}
};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
function replaceSection(html,heading,newHtml){const re=new RegExp('(<h[2-4][^>]*>'+heading.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')+'<\\/h[2-4]>)([\\s\\S]*?)(?=<h[2-4][^>]*>|<\\/section>|$)','i');return html.replace(re,(_,h)=>h+newHtml)}
function run(){
 if(!fs.existsSync(DIST))return;
 let changed=0;
 for(const file of fs.readdirSync(DIST,{recursive:true})){
  if(!file.endsWith('.html'))continue;
  const p=path.join(DIST,file);
  let html=fs.readFileSync(p,'utf8');
  let topic=null;
  for(const key of Object.keys(TOPICS)){if(html.includes('Dónde comer '+key)){topic=TOPICS[key];break}}
  if(!topic)continue;
  const oldIntro='Esta guía reúne criterios pensados para esta comida concreta.';
  html=html.replace(oldIntro,'Una guía práctica pensada específicamente para ayudarte a resolver este tema.');
  html=html.replace(/<p[^>]*>Para decidir dónde comer [^<]+ conviene mirar cómo se prepara, qué producto utiliza el local y qué estilo de cocina ofrece\.[^<]*<\\\/p>/gi,'');
  const replacements=[['Materia prima',topic.blocks[0]],['Cómo se prepara',topic.blocks[1]],['Qué mirar en las opiniones',topic.blocks[2]],['Precio con contexto',topic.blocks[3]],['Elige según tu plan',topic.blocks[0]]];
  for(const [old,block] of replacements){html=replaceSection(html,old,'<p>'+esc(block[1])+'</p>')}
  html=html.replace(/<p[^>]*>Antes de elegir dónde comer [^<]+ compara la preparación, el producto, las opiniones y el precio según lo que realmente buscas\.<\\\/p>/gi,'<p>'+esc(topic.intro)+'</p>');
  html=html.replace(/Aprende a elegir un buen lugar donde comer [^<]+ y descubre opciones según tus preferencias\./gi,esc(topic.intro));
  html=html.replace(/<p[^>]*>Guía para elegir un buen lugar donde comer [^<]*<\\\/p>/gi,'<p>'+esc(topic.intro)+'</p>');
  fs.writeFileSync(p,html);
  changed++;
 }
 console.log('[unique-topic-guides] '+changed+' páginas temáticas con contenido propio.');
}
if(require.main===module)run();
