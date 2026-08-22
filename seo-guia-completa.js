const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

const slug = 'guia-completa-de-comidas';
const title = 'Guía Práctica de Comidas: Desayuno, Almuerzo, Merienda y Cena';
const desc = 'Soluciones rápidas para decidir qué comer en cada momento del día. Ideas prácticas para desayuno, media mañana, merienda y cena con ingredientes habituales.';

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const content = `
  <aside class="rf-guide-note"><strong>Nota:</strong> Estas ideas son orientativas y no sustituyen el consejo individual de un profesional sanitario o nutricionista.</aside>
  <p>La optimización del tiempo y la gestión de los ingredientes disponibles en el hogar son fundamentales para mantener una alimentación organizada. Esta guía ofrece alternativas analizadas y combinaciones eficientes para resolver de manera inmediata la indecisión ante las principales ingestas del día, maximizando el uso de los recursos habituales en la despensa y la nevera.</p>
  
  <h2 id="desayuno">¿Qué desayunar hoy? Combinaciones rápidas para el inicio del día</h2>
  <p>El diseño de la primera comida de la jornada suele priorizar la obtención de energía mediante procedimientos de preparación simplificados.</p>
  
  <h3>Alternativas según la disponibilidad de ingredientes:</h3>
  <ul>
    <li><strong>Plátano maduro y huevo:</strong> Elaboración de tortitas simplificadas homogenizando ambos ingredientes en una sartén antiadherente vuelta y vuelta.</li>
    <li><strong>Queso fresco y miel:</strong> Empleo de pan de grano entero como base para láminas de queso fresco con un hilo de miel por encima.</li>
    <li><strong>Aguacate y huevo:</strong> Cocción de un huevo entero en la cavidad central del aguacate mediante técnicas de horneado o freidora de aire.</li>
    <li><strong>Copos de avena y leche:</strong> Preparación de gachas tradicionales (porridge) enriquecidas con canela mediante un proceso acelerado en microondas.</li>
    <li><strong>Yogur griego y nueces:</strong> Configuración de un bol saciante con yogur natural, nueces seleccionadas y frutos rojos.</li>
  </ul>
  
  <h3>Soluciones para mañanas específicas:</h3>
  <ul>
    <li><strong>Cuando tienes prisa (5 minutos):</strong> Consumo de fruta portátil acompañada de un producto lácteo o bebida vegetal lista para llevar.</li>
    <li><strong>Antes de actividad física ligera:</strong> Consumo de carbohidratos de fácil asimilación, como una rebanada de pan con mermelada, para evitar el malestar estomacal.</li>
    <li><strong>Opciones ligeras:</strong> Una taza de té verde junto a una tortilla francesa ligera de dos claras de huevo y unas rodajas de pepino.</li>
    <li><strong>Un capricho de fin de semana:</strong> Tostadas francesas ligeras pasando el pan por huevo batido con leche y un toque de vainilla, hechas a la plancha con fruta.</li>
    <li><strong>Para recuperar líquidos:</strong> Un vaso grande de agua, seguido de unos huevos revueltos con tostadas para reponer energías.</li>
  </ul>

  <h2 id="almuerzo">¿Qué almorzar a media mañana? Snacks rápidos</h2>
  <p>El objetivo del almuerzo a mitad de la jornada suele ser mantener la energía y modular la saciedad antes de la comida principal.</p>
  
  <h3>Opciones de fácil transporte:</h3>
  <ul>
    <li><strong>Berberechos y limón:</strong> Aperitivo alto en hierro mediante bivalvos en conserva aderezados con jugo de limón y pimienta negra.</li>
    <li><strong>Tortitas de arroz y pavo:</strong> Dos tortitas de arroz integral con una loncha de pechuga de pavo encima de cada una de ellas.</li>
    <li><strong>Zanahorias crudas y hummus:</strong> Bastoncitos de zanahoria pelada para untar directamente en hummus.</li>
    <li><strong>Queso manchego y picos:</strong> Ración medida de queso manchego curado acompañada de panificación seca artesanal.</li>
  </ul>

  <h2 id="merienda">¿Qué merendar hoy? Ideas dulces y saladas para la tarde</h2>
  <p>La franja de la tarde requiere opciones versátiles que satisfagan el apetito y se adapten a los requerimientos energéticos previos al descanso.</p>
  
  <h3>Alternativas según el inventario disponible:</h3>
  <ul>
    <li><strong>Chocolate negro y pan:</strong> Inclusión de una porción de chocolate con un porcentaje de cacao superior al 70% en el interior de un trozo de pan crujiente.</li>
    <li><strong>Yogur natural y semillas de chía:</strong> Pudding de chía exprés mezclando el medio lácteo con las semillas durante diez minutos para su gelificación.</li>
    <li><strong>Tortita de avena y crema de cacao:</strong> Untar una base de cereal con una capa muy fina de crema de cacao pura sin azúcares añadidos.</li>
    <li><strong>Jamón serrano y colines:</strong> Dos lonchas de jamón serrano enrolladas alrededor de unos colines o picos de pan artesanales.</li>
  </ul>
  
  <h3>Meriendas según el momento de la tarde:</h3>
  <ul>
    <li><strong>Antes de entrenar por la tarde:</strong> Un café solo o con hielo acompañado de dos dátiles para obtener un aporte de energía.</li>
    <li><strong>Para días de lluvia con ganas de dulce:</strong> Una taza de chocolate caliente elaborado con cacao puro desgrasado, leche y edulcorante.</li>
    <li><strong>Antojo de salado (alternativa a las patatas fritas):</strong> Un puñado de aceitunas verdes o negras aliñadas junto a unos pepinillos en vinagre.</li>
  </ul>

  <h2 id="cena">Ideas rápidas para cenar hoy: combinaciones de ingredientes</h2>
  <p>La última ingesta del día suele requerir un enfoque centrado en la digestibilidad y la sencillez para favorecer el descanso nocturno.</p>
  
  <h3>¿Qué cenar según lo que tienes en la nevera?</h3>
  <ul>
    <li><strong>Garbanzos y huevo:</strong> Salteado rápido de legumbres en la sartén con especias (comino, pimentón) y un huevo cuajado encima.</li>
    <li><strong>Pechuga de pollo y queso crema:</strong> Tiras de ave salteadas envueltas en una tortilla de trigo untada con queso crema y espinacas.</li>
    <li><strong>Lentejas cocidas:</strong> Ensalada fría de lentejas con tomate, cebolla, una lata de caballa y un chorrito de vinagre.</li>
    <li><strong>Pasta y ajo:</strong> Spaghetti cocidos y salteados con ajo laminado, guindilla y aceite de oliva.</li>
    <li><strong>Arroz blanco frío del almuerzo:</strong> Arroz frito tres delicias rápido con un huevo revuelto, guisantes de bote y jamón en dados.</li>
    <li><strong>Huevos y tomate:</strong> Huevos revueltos con tomate natural picado y un toque de orégano, acompañado de pan tostado.</li>
    <li><strong>Calabacín y queso de cabra:</strong> Rodajas de calabacín a la plancha con una rodaja de queso de cabra fundido encima y un hilo de miel.</li>
  </ul>
  
  <h3>Ideas de cenas rápidas para situaciones específicas:</h3>
  <ul>
    <li><strong>Llegas a casa a las 11 de la noche cansado:</strong> Un tazón de leche caliente con cereales integrales o unas tostadas de hummus con pimentón.</li>
    <li><strong>No tienes ganas de cocinar nada de nada:</strong> Un sándwich de jamón y queso clásico o una pieza de fruta con un puñado de frutos secos.</li>
    <li><strong>Después de un entrenamiento intenso:</strong> Tortilla de tres claras y un huevo entero con una lata de atún al natural y un tomate picado.</li>
    <li><strong>Domingo por la noche viendo una película:</strong> Nachos con queso rallado fundido al microondas, guacamole y jalapeños en rodajas.</li>
    <li><strong>Para una digestión ligera:</strong> Un caldo de pollo limpio calentito con unos fideos finos o simplemente un arroz blanco cocido con un poco de limón.</li>
    <li><strong>En verano cuando hace calor:</strong> Gazpacho andaluz bien frío acompañado de un huevo duro y unos taquitos de jamón serrano.</li>
    <li><strong>Solo en casa y no quieres ensuciar sartenes:</strong> Una patata lavada envuelta en film transparente al microondas 7 minutos, abierta por la mitad con aceite, sal y pimienta.</li>
  </ul>

  <h2 id="dilemas">Respuestas a dudas frecuentes en la cocina</h2>
  <div class="faq"><strong>¿Es adecuado cenar solo fruta por la noche?</strong><span>No es perjudicial, pero suele resultar incompleto. Acompañar la fruta con una fuente de proteína como yogur griego ayuda a aportar mayor saciedad.</span></div>
  <div class="faq"><strong>¿Qué ocurre con los carbohidratos en la cena?</strong><span>El balance calórico global del día suele prevalecer sobre la distribución horaria de los macronutrientes, según las pautas generales de nutrición.</span></div>
  <div class="faq"><strong>¿Cuál es la hora recomendada para cenar?</strong><span>Se sugiere finalizar la cena al menos 120 minutos antes de iniciar el periodo de sueño para favorecer una digestión cómoda.</span></div>
  <div class="faq"><strong>¿Cómo hacer una cena ligera que sacie?</strong><span>La clave suele consistir en combinar volumen (vegetales de hoja verde o sopas) con una dosis adecuada de proteína (pollo, huevo, legumbres o pescado).</span></div>
  <div class="faq"><strong>¿Qué cenar económico a final de mes?</strong><span>El huevo y las legumbres son aliados excelentes. Una tortilla con cebolla o unos garbanzos salteados son opciones nutritivas a bajo coste.</span></div>
`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)} | Ruleta de Comida</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${SITE}/${slug}/">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:title" content="${esc(title)} | Ruleta de Comida">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${SITE}/${slug}/">
  <meta property="og:type" content="article">
  <script type="application/ld+json">
    ${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': desc,
      'url': `${SITE}/${slug}/`,
      'author': {'@type':'Organization','name':'Ruleta de Comida'},
      'publisher': {'@type':'Organization','name':'Ruleta de Comida'}
    })}
  </script>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:0;color:#1c1917;background:#fafaf9}
    main{max-width:980px;margin:auto;padding:28px 18px 64px}
    nav{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:22px}
    nav a{padding:9px 12px;background:#fff;border:1px solid #e7e5e4;border-radius:10px;color:#d94f00;text-decoration:none}
    article{background:#fff;border:1px solid #e7e5e4;border-radius:24px;padding:clamp(22px,5vw,42px);box-shadow:0 12px 35px rgba(28,25,23,.07)}
    h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.05;margin:.2em 0 .35em}
    h2{margin-top:34px}
    h3{margin-top:24px;color:#d94f00}
    p,li{font-size:1.05rem;line-height:1.7}
    ul{padding-left:20px}
    li{margin-bottom:8px}
    .faq{border-top:1px solid #e7e5e4;padding:14px 0}
    .faq strong{display:block;margin-bottom:5px;font-size:1.1rem}
    .faq span{display:block;line-height:1.6}
  </style>
</head>
<body>
  <main>
    <nav>
      <a href="${SITE}/">🎲 Ruleta de Comida</a>
      <a href="${SITE}/que-comer-hoy/">Qué comer hoy</a>
      <a href="${SITE}/que-cenar-hoy/">Qué cenar hoy</a>
    </nav>
    <article>
      <h1>${esc(title)}</h1>
      ${content}
    </article>
  </main>
</body>
</html>`;

const dir = path.join(OUT, slug);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

console.log('Guía completa de comidas generada en su URL canónica.');
