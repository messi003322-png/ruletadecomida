/**
 * Páginas TEMÁTICAS (no son comidas):
 * no-se-que-cenar, que-cenar-hoy, cena-rapida, comida-barata…
 * Contenido propio — NUNCA plantilla "Dónde comer X".
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');

const TOPICS = {
  'no-se-que-cenar': {
    title: 'No sé qué cenar: sal del bloqueo en 3 pasos',
    h1: '¿No sabes qué cenar?',
    lead: 'La indecisión de la cena es normal después de un día largo. No hace falta una lista infinita: basta con acotar el tipo de plato y decidir en segundos.',
    sections: [
      ['1. Elige el tipo de cena', 'Decide primero si quieres algo ligero, reconfortante, rápido o diferente. Ese filtro elimina la mitad de las opciones.'],
      ['2. Reduce a dos alternativas', 'Quédate solo con dos ideas. Comparar veinte platos alarga el bloqueo; comparar dos te lleva a una decisión.'],
      ['3. Usa la ruleta si sigues dudando', 'Si las dos opciones te valen igual, gira la ruleta. Convierte la duda en una elección concreta en 3 segundos.'],
      ['Ideas que casi siempre funcionan', 'Tortilla, wrap, pasta rápida, ensalada completa, arroz frito o un bocadillo contundente resuelven la mayoría de noches sin complicaciones.']
    ],
    cta: 'Gira la ruleta de cena',
    ctaHref: '/?meal=cena#ruleta'
  },
  'que-cenar-hoy': {
    title: 'Qué cenar hoy: una decisión clara para esta noche',
    h1: '¿Qué cenar hoy?',
    lead: 'La pregunta de todas las noches se resuelve mejor con tres datos: hambre, tiempo y presupuesto. Con eso la cena se elige sin dar vueltas.',
    sections: [
      ['Mira cómo ha sido tu día', 'Si has comido mucho, apuesta por algo ligero. Si llegas con hambre de verdad, elige un plato completo.'],
      ['Elige el formato', 'Plato único, picoteo, para llevar o cocinar en casa. El formato marca más que la cocina concreta.'],
      ['Ajusta el presupuesto', 'Decide cuánto quieres gastar antes de abrir apps o la nevera. Evitas sorpresas y extras innecesarios.'],
      ['Cambia de ritmo en la semana', 'Si llevas días repitiendo lo mismo, cambia de estilo (italiano, asiático, huevos, legumbres) para no aburrirte.']
    ],
    cta: 'Decidir con la ruleta',
    ctaHref: '/?meal=cena#ruleta'
  },
  'cena-rapida': {
    title: 'Cena rápida: ideas listas en poco tiempo',
    h1: 'Cena rápida sin complicaciones',
    lead: 'Cuando el tiempo aprieta, importa el reloj real: decidir + preparar (o pedir) + comer. Aquí van criterios para no perder media hora.',
    sections: [
      ['Calcula el tiempo total', 'No mires solo la receta de 10 minutos. Suma sacar ingredientes, cocinar y recoger.'],
      ['Prioriza preparaciones simples', 'Huevos, wraps, pasta corta, tostadas saladas, arroz de ayer o una ensalada de legumbres de bote.'],
      ['Para llevar o en casa', 'Si pides, elige sitios cercanos y platos que aguanten el trayecto. Si cocinas, un solo fuego y un solo plato.'],
      ['Evita la parálisis', 'Fija un máximo de 15 minutos de decisión. Si pasas de eso, gira la ruleta y acepta el resultado.']
    ],
    cta: 'Ruleta de cena rápida',
    ctaHref: '/?meal=cena#ruleta'
  },
  'comida-barata': {
    title: 'Comida barata: comer bien sin gastar de más',
    h1: 'Comida barata con criterio',
    lead: 'Barato no es solo el precio del plato: cuenta lo que incluye, la ración y si realmente te deja satisfecho.',
    sections: [
      ['Fija un límite antes', 'Decide un tope (por persona o por cena) y descarta lo que se salga antes de mirar opciones.'],
      ['Compara ración y extras', 'Un menú cerrado puede salir mejor que un plato “barato” con bebida y guarnición aparte.'],
      ['Despensa inteligente', 'Huevos, legumbres de bote, pasta, arroz, tortillas y verdura congelada dan decenas de cenas económicas.'],
      ['Delivery vs casa', 'El envío y los mínimos pueden duplicar el coste. Si el objetivo es ahorrar, cocinar simple suele ganar.']
    ],
    cta: 'Ideas baratas con la ruleta',
    ctaHref: '/#ruleta'
  },
  'comida-saludable': {
    title: 'Comida saludable: ideas realistas para el día a día',
    h1: 'Comida saludable sin obsesiones',
    lead: 'Saludable no significa aburrido: equilibra proteína, verdura y un hidrato que te siente bien, adaptado a tu hambre.',
    sections: [
      ['Plato base', 'Mitad verdura o ensalada, un cuarto de proteína y un cuarto de hidrato es un esquema fácil de seguir.'],
      ['Cocciones simples', 'Plancha, horno, vapor o crudo bien aliñado. Menos frituras diarias, más control.'],
      ['Snacks con sentido', 'Fruta, yogur, frutos secos o hummus evitan picoteo vacío entre horas.'],
      ['Flexible', 'Una comida menos ideal no rompe nada. Lo que cuenta es el patrón de la semana.']
    ],
    cta: 'Explorar ideas',
    ctaHref: '/#ruleta'
  },
  'cenas-baratas': {
    title: 'Cenas baratas: opciones que rinden',
    h1: 'Cenas baratas para esta noche',
    lead: 'Con pocos ingredientes de despensa puedes cenar caliente sin abrir cinco apps de delivery.',
    sections: [
      ['Base económica', 'Pasta, arroz, huevos y legumbres son el núcleo de cenas baratas y saciantes.'],
      ['Un solo plato', 'Evita entrante + principal + postre si el objetivo es el presupuesto.'],
      ['Batch simple', 'Cocina el doble de legumbres o arroz y reutiliza al día siguiente.'],
      ['Ruleta con filtro barato', 'Usa la ruleta en modo cena y prioriza opciones de presupuesto bajo.']
    ],
    cta: 'Ruleta de cena',
    ctaHref: '/?meal=cena#ruleta'
  },
  'cenas-rapidas': {
    title: 'Cenas rápidas: menos de 20 minutos',
    h1: 'Cenas rápidas de verdad',
    lead: 'El truco no es cocinar más rápido: es decidir antes y usar lo que ya tienes.',
    sections: [
      ['Nevera primero', 'Abre la nevera antes que Instagram. Muchas cenas rápidas empiezan por lo que sobró.'],
      ['Técnicas exprés', 'Sartén, microondas y ensamblaje (wraps, bowls) ganan al horno largo.'],
      ['Lista corta', 'Tortilla, pasta al pesto, salteado, sopa de sobre mejorada con huevo o atún.'],
      ['Sin culpa', 'Rápido no es sinónimo de mal. Es realista.']
    ],
    cta: 'Girar ruleta',
    ctaHref: '/?meal=cena#ruleta'
  }
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pageBlock(topic) {
  const articles = topic.sections
    .map(
      ([h, p]) =>
        `<article class="rf-topic-card"><h2>${esc(h)}</h2><p>${esc(p)}</p></article>`
    )
    .join('\n');

  return `
<section class="rf-topic-guide" id="rf-topic-guide">
  <p class="rf-topic-lead">${esc(topic.lead)}</p>
  <div class="rf-topic-grid">
    ${articles}
  </div>
  <p class="rf-topic-cta-wrap"><a class="rf-topic-cta" href="${esc(topic.ctaHref)}">${esc(topic.cta)}</a></p>
</section>`;
}

const TOPIC_CSS = `<style id="rf-topic-guide-css">
.rf-topic-guide{max-width:720px;margin:24px auto;padding:0 16px 32px}
.rf-topic-lead{font-size:1.05rem;line-height:1.65;color:#44403c;margin:0 0 20px}
.rf-topic-grid{display:grid;gap:12px}
.rf-topic-card{background:#fff;border:1px solid #e7e5e4;border-radius:16px;padding:16px 18px}
.rf-topic-card h2{margin:0 0 8px;font-size:1.05rem;color:#1c1917}
.rf-topic-card p{margin:0;color:#57534e;line-height:1.6}
.rf-topic-cta-wrap{text-align:center;margin:24px 0 0}
.rf-topic-cta{display:inline-flex;padding:12px 22px;border-radius:999px;background:linear-gradient(135deg,#ff9a3c,#ff6b1a);color:#fff!important;font-weight:800;text-decoration:none}
</style>`;

function rewriteFile(filePath, slugKey) {
  const topic = TOPICS[slugKey];
  if (!topic) return false;
  let html = fs.readFileSync(filePath, 'utf8');

  // Title + description
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(topic.title)}</title>`);
  if (/name="description"/.test(html)) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"/i,
      `<meta name="description" content="${esc(topic.lead).slice(0, 155)}"`
    );
  }

  // H1: quitar "Dónde comer …"
  html = html.replace(
    /<h1([^>]*)>\s*Dónde comer\s+[^<]+<\/h1>/i,
    `<h1$1>${esc(topic.h1)}</h1>`
  );
  html = html.replace(/<h1([^>]*)>\s*[^<]{3,80}<\/h1>/i, (m, attrs) => {
    if (/rf-topic/.test(html) && html.includes(topic.h1)) return m;
    return `<h1${attrs}>${esc(topic.h1)}</h1>`;
  });

  // Quitar bloque genérico de comida
  html = html.replace(/<section class="rf-food-guide">[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="food-guide[^"]*">[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<section class="rf-topic-guide"[\s\S]*?<\/section>/gi, '');

  const block = pageBlock(topic);
  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    html = html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1\n${block}`);
  } else if (/<main[^>]*>/i.test(html)) {
    html = html.replace(/<main([^>]*)>/i, `<main$1>\n${block}`);
  } else {
    html = html.replace(/<\/body>/i, block + '</body>');
  }

  html = html.replace(/<style id="rf-topic-guide-css">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<\/head>/i, TOPIC_CSS + '</head>');

  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

function run() {
  if (!fs.existsSync(DIST)) return;
  let changed = 0;

  for (const slugKey of Object.keys(TOPICS)) {
    const candidates = [
      path.join(DIST, slugKey, 'index.html'),
      path.join(DIST, slugKey + '.html')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p) && rewriteFile(p, slugKey)) {
        changed++;
        break;
      }
    }
  }

  // También por H1 "Dónde comer No Se Que Cenar" etc. en cualquier ruta
  const alias = {
    'no se que cenar': 'no-se-que-cenar',
    'que cenar hoy': 'que-cenar-hoy',
    'cena rapida': 'cena-rapida',
    'comida barata': 'comida-barata',
    'comida saludable': 'comida-saludable',
    'cenas baratas': 'cenas-baratas',
    'cenas rapidas': 'cenas-rapidas'
  };

  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.') || e.name === 'assets') continue;
        walk(f);
      } else if (e.name === 'index.html' || e.name.endsWith('.html')) {
        const html = fs.readFileSync(f, 'utf8');
        const m = html.match(/<h1[^>]*>\s*Dónde comer\s+([^<]+)<\/h1>/i);
        if (!m) continue;
        const key = String(m[1])
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, ' ')
          .trim();
        const slugKey = alias[key];
        if (slugKey && TOPICS[slugKey]) {
          if (rewriteFile(f, slugKey)) changed++;
        }
      }
    }
  }
  walk(DIST);

  console.log(`[unique-topic-guides] ${changed} páginas temáticas con contenido propio (sin "Dónde comer").`);
}

if (require.main === module) run();
module.exports = { run };
