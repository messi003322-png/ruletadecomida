/**
 * MAX QUALITY SEO content rewrite for every programmatic page.
 * Unique blocks by city + food + moment + modifier (deterministic).
 * Hyphenated object keys are always quoted (valid JS).
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const MOMENTS = {
  desayuno: {
    label: 'desayuno',
    verb: 'desayunar',
    when: 'por la mañana',
    goal: 'empezar el día con energía sin complicarte',
    avoid: 'platos demasiado pesados si luego tienes una mañana larga',
    questions: ['¿Tienes 10 minutos o 30?', '¿Necesitas algo saciante o solo un empujón?', '¿Sales o desayunas en casa?']
  },
  almuerzo: {
    label: 'almuerzo',
    verb: 'almorzar',
    when: 'al mediodía',
    goal: 'comer completo sin comerse el resto de la tarde',
    avoid: 'opciones que tardan más que tu descanso real',
    questions: ['¿Cuántos minutos tienes de verdad?', '¿Trabajas después?', '¿Presupuesto cerrado o flexible?']
  },
  merienda: {
    label: 'merienda',
    verb: 'merendar',
    when: 'por la tarde',
    goal: 'un pico entre horas que no arruine la cena',
    avoid: 'azúcar alto si luego te cuesta cenar ligero',
    questions: ['¿Hambre real o aburrimiento?', '¿Cenas pronto?', '¿Lo necesitas para llevar?']
  },
  cena: {
    label: 'cena',
    verb: 'cenar',
    when: 'por la noche',
    goal: 'cerrar el día con algo satisfactorio y manejable',
    avoid: 'platos muy pesados si te acuestas pronto',
    questions: ['¿Cocinas, pides o sales?', '¿Cenas solo o acompañado?', '¿Quieres ligero o contundente?']
  },
  brunch: {
    label: 'brunch',
    verb: 'hacer brunch',
    when: 'a media mañana o mediodía de finde',
    goal: 'un plan más tranquilo que una comida exprés',
    avoid: 'sitios sin reserva en hora punta de sábado',
    questions: ['¿Es plan social o rápido?', '¿Prefieres salado o dulce?', '¿Cuánto tiempo puedes estar?']
  },
  'media-manana': {
    label: 'media mañana',
    verb: 'tomar algo a media mañana',
    when: 'entre desayuno y almuerzo',
    goal: 'mantener el ritmo sin una comida completa',
    avoid: 'raciones de almuerzo disfrazadas de snack',
    questions: ['¿Cuánto aguanta tu hambre?', '¿Puedes lavarte las manos/cubiertos?', '¿Lo comes en movimiento?']
  },
  noche: {
    label: 'noche',
    verb: 'comer de noche',
    when: 'a última hora',
    goal: 'algo ligero o reconfortante sin montar un festín',
    avoid: 'fritos muy pesados si vas a dormir enseguida',
    questions: ['¿Hambre real o costumbre?', '¿Nevera o pedido?', '¿Cuánto puedes digerir ahora?']
  }
};

const MODS = {
  barato: {
    label: 'barato',
    focus: 'gastar poco sin quedarte a medias',
    checks: ['precio final vs ración', 'extras ocultos', 'mínimo de pedido + envío'],
    tips: [
      'Compara el precio por saciedad, no solo el número de la carta.',
      'Una opción barata deja de serlo si necesitas dos platos.',
      'En delivery, suma envío y suplementos antes de decidir.'
    ],
    win: 'Encuentras una ración suficiente a buen precio y sin extras innecesarios.'
  },
  cerca: {
    label: 'cerca',
    focus: 'minimizar distancia y tiempo de llegada',
    checks: ['minutos reales de trayecto', 'colas habituales', 'horario de ahora'],
    tips: [
      'Si vas justo de tiempo, cercanía gana a la nota media del mapa.',
      'Cuenta desplazamiento + espera, no solo el tiempo de cocina.',
      'Revisa si está abierto exactamente en este momento.'
    ],
    win: 'Comes antes y con menos fricción, aunque no sea la opción de moda.'
  },
  'calidad-precio': {
    label: 'calidad-precio',
    focus: 'equilibrar sabor, cantidad y coste',
    checks: ['qué incluye el plato', 'reseñas de cantidad', 'si repetirías'],
    tips: [
      'Una nota alta no basta: mira comentarios recientes de ración y sabor.',
      'A veces pagar 2 euros más evita pedir un segundo plato.',
      'Valora guarnición, pan o bebida si van incluidos.'
    ],
    win: 'Sales satisfecho sin sentir que pagaste de más por marketing.'
  },
  rapido: {
    label: 'rápido',
    focus: 'reducir minutos hasta el primer bocado',
    checks: ['tiempo de prep', 'hora punta', 'plan B de 10 minutos'],
    tips: [
      'Elige preparaciones simples o sitios con mucha rotación.',
      'En punta, el mismo plato puede tardar el doble.',
      'Ten un plan B listo por si el primero se alarga.'
    ],
    win: 'Resuelves el hambre dentro de tu ventana real de tiempo.'
  },
  'a-domicilio': {
    label: 'a domicilio',
    focus: 'pedir sin salir controlando tiempos y costes',
    checks: ['mínimo de pedido', 'precio de envío', 'ETA realista'],
    tips: [
      'En lluvia o finde, suma margen al tiempo de la app.',
      'Si el envío es caro, valora recogida o cocina exprés.',
      'Mira si el plato viaja bien (no todo llega en buen estado).'
    ],
    win: 'Te llega en condiciones y el coste total sigue teniendo sentido.'
  },
  saludable: {
    label: 'saludable',
    focus: 'equilibrar el plato sin obsesionarte',
    checks: ['proteína', 'vegetales', 'salsas y frituras'],
    tips: [
      'Prioriza proteína + vegetal + hidrato en proporción razonable.',
      'Pide salsas aparte si sueles pasarte.',
      'Cambia el método (plancha/horno) antes de vaciar el plato de sabor.'
    ],
    win: 'Comes mejor sin convertir la comida en una restricción.'
  },
  'para-llevar': {
    label: 'para llevar',
    focus: 'que viaje bien y se pueda comer fuera',
    checks: ['envase', 'temperatura', 'si necesita cubiertos'],
    tips: [
      'Evita platos que se desmontan o se empapan.',
      'Si comes en el trabajo, prioriza facilidad real.',
      'Confirma tiempos de recogida para no esperar de pie.'
    ],
    win: 'Llegas y comes sin que el plato se haya destruido por el camino.'
  }
};

const CITY = {
  madrid: { name: 'Madrid', vibe: 'oferta enorme y horarios largos', tip: 'En hora punta el delivery se retrasa: prioriza cercanía o cocina rápida.', zones: 'Malasaña, Lavapiés, Chamberí y zonas bien comunicadas concentran mucha oferta.', rhythm: 'ciudad que come tarde y pide mucho a domicilio' },
  barcelona: { name: 'Barcelona', vibe: 'mediterránea e internacional', tip: 'Fuera del eje más turístico suele haber mejor relación calidad-precio.', zones: 'Gràcia, Poblenou y Eixample equilibran ambiente y opciones.', rhythm: 'ritmo de terraza y delivery según barrio' },
  valencia: { name: 'Valencia', vibe: 'producto fresco y cocina mediterránea', tip: 'El clima cambia el antojo: más ligero en calor, más reconfortante en frío.', zones: 'Centro, Ruzafa y zonas universitarias tienen alta rotación.', rhythm: 'ciudad cómoda para comer fuera entre semana' },
  sevilla: { name: 'Sevilla', vibe: 'andaluza, tapas y calor que marca el día', tip: 'Con calor, valora sombra/AC o platos menos pesados al mediodía.', zones: 'Centro y Triana concentran oferta; en residencial gana lo cercano.', rhythm: 'horarios y calor condicionan más que en el norte' },
  bilbao: { name: 'Bilbao', vibe: 'vasca y tradición de pintxos', tip: 'Revisa horarios: algunos locales cierran entre servicios.', zones: 'Casco Viejo e Indautxu suelen tener buena densidad.', rhythm: 'come con criterio y valora producto' },
  malaga: { name: 'Málaga', vibe: 'costa, pescado y cocina de sol', tip: 'En temporada alta evita solo el centro saturado si vas justo de tiempo.', zones: 'Centro y zonas de playa cambian por completo la carta típica.', rhythm: 'turismo y diario conviven en la misma ciudad' },
  zaragoza: { name: 'Zaragoza', vibe: 'práctica y de día a día', tip: 'En laborable, cercanía al trabajo suele ganar.', zones: 'Centro y Delicias concentran mucha oferta cotidiana.', rhythm: 'decisiones rápidas entre semana' },
  murcia: { name: 'Murcia', vibe: 'huerta y cocina local', tip: 'Aprovecha temporada de verdura si buscas platos frescos.', zones: 'Centro y ensanches con buena densidad de diario.', rhythm: 'producto local bien aprovechado' },
  granada: { name: 'Granada', vibe: 'tapas y ambiente universitario', tip: 'En zonas muy turísticas compara ración y precio antes.', zones: 'Centro y Realejo se mueven mucho; en barrios gana lo habitual.', rhythm: 'mezcla de tapeo y comida de diario' },
  alicante: { name: 'Alicante', vibe: 'mediterránea de costa', tip: 'En verano las terrazas se llenan: mira tiempos reales.', zones: 'Centro y playa ofrecen perfiles distintos.', rhythm: 'más terraza en temporada alta' },
  cordoba: { name: 'Córdoba', vibe: 'tradicional y de interior', tip: 'El calor central cambia qué apetece al mediodía.', zones: 'Centro histórico vs barrios: distinta densidad y precios.', rhythm: 'cocina local con ritmo de ciudad media' },
  vigo: { name: 'Vigo', vibe: 'atlántica y de producto', tip: 'Prioriza frescura y cercanía si el tiempo aprieta.', zones: 'Centro y zonas portuarias/residenciales varían la oferta.', rhythm: 'decisiones prácticas con buena materia prima' },
  gijon: { name: 'Gijón', vibe: 'asturiana y contundente cuando toca', tip: 'Si quieres ligero, dilo explícitamente: la tradición tira a generosa.', zones: 'Centro y zonas de playa/residencial cambian el plan.', rhythm: 'cocina de sustancia y también opciones rápidas' },
  oviedo: { name: 'Oviedo', vibe: 'asturiana de interior', tip: 'Para comer rápido, no te dejes solo por el local más céntrico si hay cola.', zones: 'Casco y ensanches concentran el día a día.', rhythm: 'comida seria y también exprés' },
  'a-coruna': { name: 'A Coruña', vibe: 'atlántica y de marisco cuando apetece', tip: 'Si buscas precio, separa el plan especial del de diario.', zones: 'Centro y zonas residenciales reparten la oferta.', rhythm: 'producto de mar y cocina cotidiana' },
  coruna: { name: 'A Coruña', vibe: 'atlántica y de marisco cuando apetece', tip: 'Separa el plan especial del de diario si miras presupuesto.', zones: 'Centro y barrios con oferta distinta.', rhythm: 'mar y día a día' },
  palma: { name: 'Palma', vibe: 'mediterránea insular', tip: 'En temporada alta el centro se satura: mira tiempos.', zones: 'Centro y ensanches con distinta presión turística.', rhythm: 'turismo + residente' },
  'las-palmas': { name: 'Las Palmas', vibe: 'canaria y de clima suave', tip: 'El clima invita a planes flexibles; igual mira distancia real.', zones: 'Zonas costeras y de interior cambian la oferta.', rhythm: 'día a día con ritmo isleño' },
  valladolid: { name: 'Valladolid', vibe: 'castellana y de interior', tip: 'Entre semana prioriza cercanía si el descanso es corto.', zones: 'Centro y barrios con densidad variable.', rhythm: 'comidas de diario predecibles' },
  'rivas-vaciamadrid': { name: 'Rivas-Vaciamadrid', vibe: 'residencial del área de Madrid', tip: 'La distancia al centro importa menos que tener opciones cercanas y delivery fiable.', zones: 'Zonas residenciales y centros comerciales concentran servicios.', rhythm: 'mucho delivery y planes prácticos' }
};

function pretty(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((x) => (x[0] ? x[0].toUpperCase() + x.slice(1) : x))
    .join(' ');
}
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}
function cityInfo(slug) {
  if (CITY[slug]) return CITY[slug];
  return {
    name: pretty(slug),
    vibe: 'oferta local de diario y opciones a domicilio',
    tip: 'Prioriza tiempo total y reseñas recientes, no solo la nota media.',
    zones: 'Las mejores opciones suelen ser las cercanas que cumplen tu criterio de hoy.',
    rhythm: 'ritmo de ciudad media española'
  };
}
function foodInfo(slug) {
  const name = pretty(slug);
  const n = String(slug || '').toLowerCase();
  let kind = 'preparación de ' + name.toLowerCase() + ' adaptable al momento';
  let look = 'ingredientes claros, ración suficiente y buen acabado';
  let time = '15–30 min orientativos';
  let budget = '€–€€';
  let tip = 'Ajusta ' + name.toLowerCase() + ' a tu hambre real: simple si vas justo, más completa si es plato principal.';
  let pair = 'una ensalada, pan o fruta según el momento';
  let fail = 'ración escasa, exceso de salsa o producto poco fresco';

  if (/pizza/.test(n)) {
    kind = 'masa con tomate/queso y toppings';
    look = 'base con punto, queso fundido y toppings sin empapar';
    time = '15–35 min';
    tip = 'Compara el tamaño real de la base: el precio engaña.';
    pair = 'ensalada simple si quieres equilibrar';
    fail = 'base pastosa o ración mini a precio de pizza grande';
  } else if (/tortilla/.test(n)) {
    kind = 'huevo con patata u otras bases';
    look = 'punto jugoso o cuajado según gusto';
    time = '20–45 min';
    budget = '€';
    tip = 'El punto (jugosa/cuajada) cambia el plato por completo.';
    fail = 'aceite en exceso o tortilla reseca';
  } else if (/sushi|ramen|noodles/.test(n)) {
    kind = 'cocina asiática de arroz/fideos';
    look = 'frescura, punto del arroz/fideos y toppings con sentido';
    time = '20–40 min';
    budget = '€€–€€€';
    tip = 'Mira reseñas recientes de frescura y tiempos de entrega.';
    fail = 'pescado o caldo apagado, delivery lento';
  } else if (/hamburg|burger/.test(n)) {
    kind = 'carne o alternativa en pan';
    look = 'punto de la proteína y pan que aguante';
    tip = 'Confirma si incluye guarnición y el tamaño real.';
    fail = 'pan empapado o burger diminuta';
  } else if (/yogur|fruta|batido|smoothie|avena|granola|porridge/.test(n)) {
    kind = 'opción ligera y rápida';
    look = 'ingredientes reales (fruta/yogur de verdad)';
    time = '5–15 min';
    budget = '€';
    tip = 'Suma proteína o frutos secos si necesitas más saciedad.';
    fail = 'solo azúcar o ración testimonial';
  } else if (/pollo/.test(n)) {
    kind = 'proteína de pollo versátil';
    look = 'jugoso, sazonado, con guarnición real';
    tip = 'La guarnición decide si es comida completa o incompleta.';
    fail = 'pollo reseco sin acompañamiento';
  } else if (/pasta|macarr|espagu/.test(n)) {
    kind = 'pasta con salsa';
    look = 'pasta al dente y salsa ligada';
    time = '15–25 min';
    tip = 'Un poco de agua de cocción ayuda a ligar la salsa.';
    fail = 'pasta pasada o salsa aguada';
  } else if (/crema|sopa|caldo|gazpacho/.test(n)) {
    kind = 'plato de cuchara';
    look = 'sabor claro del ingrediente principal y buena textura';
    tip = 'Si es plato único, completa con proteína o pan.';
    fail = 'textura floja o sabor plano';
  } else if (/bocadillo|sandwich|tostada|wrap|pita/.test(n)) {
    kind = 'formato pan/wrap fácil de comer';
    look = 'pan con punto y relleno generoso sin desbordarse';
    time = '5–20 min';
    budget = '€–€€';
    tip = 'Ideal cuando el tiempo manda; revisa que el relleno aguante el viaje.';
    fail = 'pan gomoso o relleno escaso';
  }

  return { name: name, kind: kind, look: look, time: time, budget: budget, tip: tip, pair: pair, fail: fail };
}

function momentInfo(slug) {
  return MOMENTS[slug] || MOMENTS.cena;
}

function parseFile(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const p = rel.split('/');
  if (p[0] === 'comer' && p.length >= 6 && p[p.length - 1] === 'index.html') {
    return { type: 'modifier', city: p[1], moment: p[2], food: p[3], mod: p[4] };
  }
  if (p.length === 4 && p[3] === 'index.html' && MOMENTS[p[1]]) {
    return { type: 'guide', city: p[0], moment: p[1], food: p[2] };
  }
  if (p.length === 3 && p[2] === 'index.html' && MOMENTS[p[1]]) {
    return { type: 'moment', city: p[0], moment: p[1] };
  }
  if (p.length === 2 && p[1] === 'index.html') {
    return { type: 'city', city: p[0] };
  }
  if (p.length === 3 && p[2] === 'index.html' && !MOMENTS[p[1]]) {
    return { type: 'topic', city: p[0], topic: p[1] };
  }
  return null;
}

function relatedMods(ctx) {
  return Object.keys(MODS)
    .filter(function (k) {
      return k !== ctx.mod;
    })
    .slice(0, 4)
    .map(function (k) {
      return '<a href="' + SITE + '/comer/' + ctx.city + '/' + ctx.moment + '/' + ctx.food + '/' + k + '/">' + esc(MODS[k].label) + '</a>';
    })
    .join(' · ');
}

function blockGuide(ctx) {
  const c = cityInfo(ctx.city);
  const f = foodInfo(ctx.food);
  const m = momentInfo(ctx.moment);
  const seed = hash(ctx.city + '|' + ctx.moment + '|' + ctx.food + '|guide');
  const openers = [
    'Elegir ' + f.name.toLowerCase() + ' para ' + m.verb + ' en ' + c.name + ' es más fácil si empiezas por el resultado que quieres, no por una lista infinita de locales.',
    'En ' + c.name + ', ' + f.name.toLowerCase() + ' para ' + m.label + ' funciona cuando cuadra con tu tiempo real y tu hambre de hoy.',
    'Si vas a ' + m.verb + ' con ' + f.name.toLowerCase() + ' en ' + c.name + ', los tres filtros útiles son tiempo, ración y precio final.'
  ];
  const q = m.questions;
  return (
    '\n<article class="rf-q" id="rf-quality-content" data-rf-quality="guide">' +
    '<h2>Guía: ' +
    esc(f.name) +
    ' para ' +
    esc(m.verb) +
    ' en ' +
    esc(c.name) +
    '</h2>' +
    '<p class="rf-q-lead">' +
    esc(pick(openers, seed)) +
    '</p>' +
    '<h3>Qué es y qué mirar</h3>' +
    '<p><strong>' +
    esc(f.name) +
    '</strong> es ' +
    esc(f.kind) +
    '. Conviene fijarse en: ' +
    esc(f.look) +
    '.</p>' +
    '<p><strong>Tiempo orientativo:</strong> ' +
    esc(f.time) +
    '. <strong>Presupuesto habitual:</strong> ' +
    esc(f.budget) +
    '.</p>' +
    '<p>' +
    esc(f.tip) +
    ' Un buen acompañamiento suele ser ' +
    esc(f.pair) +
    '.</p>' +
    '<p><strong>Señales de que no compensa:</strong> ' +
    esc(f.fail) +
    '.</p>' +
    '<h3>Contexto en ' +
    esc(c.name) +
    ' (' +
    esc(m.label) +
    ')</h3>' +
    '<p>' +
    esc(c.name) +
    ' tiene ' +
    esc(c.vibe) +
    '. Es una ciudad con ' +
    esc(c.rhythm) +
    '.</p>' +
    '<p>' +
    esc(c.tip) +
    '</p>' +
    '<p>' +
    esc(c.zones) +
    '</p>' +
    '<p>Objetivo de este momento: ' +
    esc(m.goal) +
    '. Evita: ' +
    esc(m.avoid) +
    '.</p>' +
    '<h3>Preguntas para decidir en 1 minuto</h3>' +
    '<ol><li>' +
    esc(q[0]) +
    '</li><li>' +
    esc(q[1]) +
    '</li><li>' +
    esc(q[2]) +
    '</li></ol>' +
    '<h3>Casa, local o delivery</h3>' +
    '<ul>' +
    '<li><strong>Casa:</strong> controlas ingredientes y tiempo; ideal si ya tienes base en la nevera.</li>' +
    '<li><strong>Local:</strong> tiene sentido si está cerca y el servicio es ágil ' +
    esc(m.when) +
    '.</li>' +
    '<li><strong>Delivery:</strong> suma envío + espera real; no todo el plato viaja igual de bien.</li>' +
    '</ul>' +
    '<h3>Cómo cerrar sin dar vueltas</h3>' +
    '<ol>' +
    '<li>Confirma que ' +
    esc(f.name.toLowerCase()) +
    ' te encaja para ' +
    esc(m.label) +
    '.</li>' +
    '<li>Compara solo una alternativa (plan B).</li>' +
    '<li>Decide o <a href="' +
    SITE +
    '/#ruleta">gira la ruleta</a> y acepta la primera opción razonable.</li>' +
    '</ol>' +
    '<h3>Enlaces útiles</h3>' +
    '<p>' +
    '<a href="' +
    SITE +
    '/' +
    ctx.city +
    '/' +
    ctx.moment +
    '/">Más ideas de ' +
    esc(m.label) +
    ' en ' +
    esc(c.name) +
    '</a> · ' +
    '<a href="' +
    SITE +
    '/' +
    ctx.city +
    '/">Guía de ' +
    esc(c.name) +
    '</a> · ' +
    '<a href="' +
    SITE +
    '/comer/' +
    ctx.city +
    '/' +
    ctx.moment +
    '/' +
    ctx.food +
    '/barato/">' +
    esc(f.name) +
    ' barato en ' +
    esc(c.name) +
    '</a> · ' +
    '<a href="' +
    SITE +
    '/comer/' +
    ctx.city +
    '/' +
    ctx.moment +
    '/' +
    ctx.food +
    '/rapido/">' +
    esc(f.name) +
    ' rápido</a>' +
    '</p></article>'
  );
}

function blockModifier(ctx) {
  const c = cityInfo(ctx.city);
  const f = foodInfo(ctx.food);
  const m = momentInfo(ctx.moment);
  const mod =
    MODS[ctx.mod] || {
      label: pretty(ctx.mod),
      focus: 'acotar la búsqueda',
      checks: ['criterio principal', 'tiempo total', 'precio final'],
      tips: ['Aplica un solo filtro.', 'Compara dos opciones.', 'Revisa horario.'],
      win: 'Decides antes y con menos ruido.'
    };
  const seed = hash(ctx.city + '|' + ctx.moment + '|' + ctx.food + '|' + ctx.mod);
  const angles = [
    'Esta ficha prioriza un solo criterio: ' + mod.label + ' (' + mod.focus + ').',
    'No es una guía genérica de ' + f.name.toLowerCase() + ': prioriza ' + mod.focus + ' en ' + c.name + '.',
    'Si tu prioridad hoy es "' + mod.label + '", usa estos filtros y descarta el resto.'
  ];

  return (
    '\n<article class="rf-q" id="rf-quality-content" data-rf-quality="modifier">' +
    '<h2>' +
    esc(f.name) +
    ' ' +
    esc(mod.label) +
    ' para ' +
    esc(m.verb) +
    ' en ' +
    esc(c.name) +
    '</h2>' +
    '<p class="rf-q-lead">' +
    esc(pick(angles, seed)) +
    '</p>' +
    '<h3>Para quién es esta página</h3>' +
    '<p>Para quien quiere ' +
    esc(m.verb) +
    ' en ' +
    esc(c.name) +
    ' ' +
    esc(m.when) +
    ' y ya sabe que el filtro importante es <strong>' +
    esc(mod.label) +
    '</strong>. Objetivo del momento: ' +
    esc(m.goal) +
    '.</p>' +
    '<h3>Checklist ' +
    esc(mod.label) +
    '</h3><ul>' +
    mod.checks
      .map(function (x) {
        return '<li>' + esc(x) + '</li>';
      })
      .join('') +
    '</ul><ul>' +
    mod.tips
      .map(function (t) {
        return '<li>' + esc(t) + '</li>';
      })
      .join('') +
    '</ul>' +
    '<p><strong>Cómo se nota el acierto:</strong> ' +
    esc(mod.win) +
    '</p>' +
    '<h3>Aplicado a ' +
    esc(f.name) +
    '</h3>' +
    '<p>' +
    esc(f.name) +
    ' es ' +
    esc(f.kind) +
    '. Mira especialmente: ' +
    esc(f.look) +
    '.</p>' +
    '<p>Tiempo orientativo: ' +
    esc(f.time) +
    '. Presupuesto habitual: ' +
    esc(f.budget) +
    '.</p>' +
    '<p>' +
    esc(f.tip) +
    '</p>' +
    '<p>Evita conformarte si ves: ' +
    esc(f.fail) +
    '.</p>' +
    '<p>Para redondear el plato: ' +
    esc(f.pair) +
    '.</p>' +
    '<h3>' +
    esc(c.name) +
    ': contexto real</h3>' +
    '<p>' +
    esc(c.name) +
    ' ofrece ' +
    esc(c.vibe) +
    '. ' +
    esc(c.tip) +
    '</p>' +
    '<p>' +
    esc(c.zones) +
    '</p>' +
    '<p>Ritmo local: ' +
    esc(c.rhythm) +
    '. En ' +
    esc(m.label) +
    ', evita: ' +
    esc(m.avoid) +
    '.</p>' +
    '<h3>Pasos para decidir en 2 minutos</h3>' +
    '<ol>' +
    '<li>Confirma ' +
    esc(f.name.toLowerCase()) +
    ' para ' +
    esc(m.label) +
    '.</li>' +
    '<li>Aplica solo el filtro "' +
    esc(mod.label) +
    '" y descarta lo demás.</li>' +
    '<li>Quédate con 1 opción + 1 plan B, o <a href="' +
    SITE +
    '/#ruleta">gira la ruleta</a>.</li>' +
    '</ol>' +
    '<h3>Otras formas de filtrar ' +
    esc(f.name) +
    ' en ' +
    esc(c.name) +
    '</h3>' +
    '<p>' +
    relatedMods(ctx) +
    '</p>' +
    '<p>' +
    '<a href="' +
    SITE +
    '/' +
    ctx.city +
    '/' +
    ctx.moment +
    '/' +
    ctx.food +
    '/">Guía completa de ' +
    esc(f.name) +
    '</a> · ' +
    '<a href="' +
    SITE +
    '/' +
    ctx.city +
    '/' +
    ctx.moment +
    '/">' +
    esc(m.label) +
    ' en ' +
    esc(c.name) +
    '</a> · ' +
    '<a href="' +
    SITE +
    '/' +
    ctx.city +
    '/">Todo ' +
    esc(c.name) +
    '</a>' +
    '</p></article>'
  );
}

function blockMoment(ctx) {
  const c = cityInfo(ctx.city);
  const m = momentInfo(ctx.moment);
  return (
    '\n<article class="rf-q" id="rf-quality-content" data-rf-quality="moment">' +
    '<h2>' +
    esc(pretty(m.label)) +
    ' en ' +
    esc(c.name) +
    ': cómo elegir sin perder tiempo</h2>' +
    '<p class="rf-q-lead">' +
    esc(c.name) +
    ' tiene ' +
    esc(c.vibe) +
    '. Para ' +
    esc(m.verb) +
    ' ' +
    esc(m.when) +
    ', el objetivo es ' +
    esc(m.goal) +
    '.</p>' +
    '<p>' +
    esc(c.tip) +
    '</p><p>' +
    esc(c.zones) +
    '</p>' +
    '<h3>Tres preguntas antes de abrir la lista</h3>' +
    '<ol><li>' +
    esc(m.questions[0]) +
    '</li><li>' +
    esc(m.questions[1]) +
    '</li><li>' +
    esc(m.questions[2]) +
    '</li></ol>' +
    '<h3>Cómo usar esta página</h3>' +
    '<ol>' +
    '<li>Elige un plato según hambre real.</li>' +
    '<li>Abre la ficha individual para criterios de tiempo y presupuesto.</li>' +
    '<li>Si sigues bloqueado, <a href="' +
    SITE +
    '/#ruleta">gira la ruleta</a>.</li>' +
    '</ol>' +
    '<p>Evita en este momento: ' +
    esc(m.avoid) +
    '. Ritmo de ' +
    esc(c.name) +
    ': ' +
    esc(c.rhythm) +
    '.</p>' +
    '<p><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/">Ver todos los momentos en ' +
    esc(c.name) +
    '</a></p></article>'
  );
}

function blockCity(ctx) {
  const c = cityInfo(ctx.city);
  return (
    '\n<article class="rf-q" id="rf-quality-content" data-rf-quality="city">' +
    '<h2>Qué comer en ' +
    esc(c.name) +
    ': guía por momento del día</h2>' +
    '<p class="rf-q-lead">' +
    esc(c.name) +
    ' tiene ' +
    esc(c.vibe) +
    '. Elige primero el momento y después el plato.</p>' +
    '<p>' +
    esc(c.tip) +
    '</p><p>' +
    esc(c.zones) +
    '</p><p>Ritmo local: ' +
    esc(c.rhythm) +
    '.</p>' +
    '<h3>Atajos por momento</h3><ul>' +
    '<li><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/desayuno/">Desayuno en ' +
    esc(c.name) +
    '</a></li>' +
    '<li><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/almuerzo/">Almuerzo en ' +
    esc(c.name) +
    '</a></li>' +
    '<li><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/merienda/">Merienda en ' +
    esc(c.name) +
    '</a></li>' +
    '<li><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/cena/">Cena en ' +
    esc(c.name) +
    '</a></li></ul>' +
    '<p>También puedes <a href="' +
    SITE +
    '/#ruleta">girar la ruleta</a>.</p></article>'
  );
}

function blockTopic(ctx) {
  const c = cityInfo(ctx.city);
  const t = pretty(ctx.topic);
  return (
    '\n<article class="rf-q" id="rf-quality-content" data-rf-quality="topic">' +
    '<h2>' +
    esc(t) +
    ' en ' +
    esc(c.name) +
    '</h2>' +
    '<p>Guía práctica para decidir alrededor de <strong>' +
    esc(t) +
    '</strong> en ' +
    esc(c.name) +
    '.</p>' +
    '<p>' +
    esc(c.tip) +
    '</p><p>' +
    esc(c.zones) +
    '</p>' +
    '<h3>Cómo decidir</h3><ol>' +
    '<li>Define tiempo y presupuesto.</li>' +
    '<li>Elige formato (casa, local, delivery).</li>' +
    '<li>Compara dos opciones o usa la <a href="' +
    SITE +
    '/#ruleta">ruleta</a>.</li></ol>' +
    '<p><a href="' +
    SITE +
    '/' +
    ctx.city +
    '/">Más ideas en ' +
    esc(c.name) +
    '</a></p></article>'
  );
}

const CSS =
  '<style id="rf-quality-css">' +
  '.rf-q{max-width:820px;margin:28px auto;padding:12px 18px 36px;color:#1c1917;line-height:1.7}' +
  '.rf-q-lead{font-size:1.08rem;color:#44403c}' +
  '.rf-q h2{font-size:clamp(1.35rem,3vw,1.75rem);line-height:1.2;margin:0 0 12px}' +
  '.rf-q h3{font-size:1.08rem;margin:22px 0 8px}' +
  '.rf-q p,.rf-q li{font-size:1.02rem;color:#292524}' +
  '.rf-q a{color:#c2410c;font-weight:700;text-decoration:none}' +
  '.rf-q ol,.rf-q ul{padding-left:1.25rem}' +
  '</style>';

function strip(html) {
  return html
    .replace(/<article class="rf-q"[\s\S]*?<\/article>/gi, '')
    .replace(/<section class="rf-q"[\s\S]*?<\/section>/gi, '')
    .replace(/<style id="rf-quality-css">[\s\S]*?<\/style>/gi, '');
}

function inject(html, block) {
  if (html.indexOf('rf-quality-css') === -1) {
    html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, CSS + '</head>') : CSS + html;
  }
  if (/<section class="rf-ctr-faq"/i.test(html)) {
    return html.replace(/<section class="rf-ctr-faq"/i, block + '\n<section class="rf-ctr-faq"');
  }
  if (/<footer/i.test(html)) return html.replace(/<footer/i, block + '\n<footer');
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, block + '\n</main>');
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, block + '\n</body>');
  return html + block;
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[quality-content-rewrite] sin dist');
    return { changed: 0 };
  }
  let changed = 0;
  const counts = { guide: 0, modifier: 0, moment: 0, city: 0, topic: 0 };

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.charAt(0) === '.') continue;
        walk(full);
      } else if (e.name === 'index.html') {
        const ctx = parseFile(full);
        if (!ctx) continue;
        let block = '';
        if (ctx.type === 'guide') block = blockGuide(ctx);
        else if (ctx.type === 'modifier') block = blockModifier(ctx);
        else if (ctx.type === 'moment') block = blockMoment(ctx);
        else if (ctx.type === 'city') block = blockCity(ctx);
        else if (ctx.type === 'topic') block = blockTopic(ctx);
        else continue;

        let html = fs.readFileSync(full, 'utf8');
        html = strip(html);
        html = inject(html, block);
        fs.writeFileSync(full, html, 'utf8');
        changed++;
        counts[ctx.type] = (counts[ctx.type] || 0) + 1;
      }
    }
  }

  walk(DIST);
  console.log(
    '[quality-content-rewrite] MAX ' +
      changed +
      ' pages | guide=' +
      counts.guide +
      ' modifier=' +
      counts.modifier +
      ' moment=' +
      counts.moment +
      ' city=' +
      counts.city +
      ' topic=' +
      counts.topic
  );
  return { changed: changed, counts: counts };
}

if (require.main === module) run();
module.exports = { run: run };
