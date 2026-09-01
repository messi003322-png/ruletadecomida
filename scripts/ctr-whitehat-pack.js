/**
 * CTR white-hat pack (Semana 1–2 segura)
 * - FAQPage schema + FAQ visible (5 preguntas útiles)
 * - HowTo schema en páginas de decisión
 * - BreadcrumbList schema
 * - Speakable
 * - Título y meta description más específicos (honestos)
 * - Fecha de actualización visible
 *
 * NO incluye: AggregateRating inventado, autores falsos, cloaking, scrapeo ilegal.
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';
const YEAR = new Date().getFullYear();

const MOMENT_LABEL = {
  desayuno: 'desayuno',
  almuerzo: 'almuerzo',
  merienda: 'merienda',
  cena: 'cena',
  brunch: 'brunch',
  'media-manana': 'media mañana',
  noche: 'noche'
};

const MOMENT_VERB = {
  desayuno: 'desayunar',
  almuerzo: 'almorzar',
  merienda: 'merendar',
  cena: 'cenar',
  brunch: 'hacer brunch',
  'media-manana': 'tomar algo a media mañana',
  noche: 'comer de noche'
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pretty(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((x) => (x[0] ? x[0].toUpperCase() + x.slice(1) : x))
    .join(' ');
}

function parseParts(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const parts = rel.split('/');
  // city/moment/food/index.html
  if (parts.length === 4 && parts[3] === 'index.html' && MOMENT_LABEL[parts[1]]) {
    return { type: 'guide', city: parts[0], moment: parts[1], food: parts[2] };
  }
  // city/moment/index.html
  if (parts.length === 3 && parts[2] === 'index.html' && MOMENT_LABEL[parts[1]]) {
    return { type: 'moment', city: parts[0], moment: parts[1] };
  }
  // city/index.html
  if (parts.length === 2 && parts[1] === 'index.html') {
    return { type: 'city', city: parts[0] };
  }
  if (rel === 'index.html') return { type: 'home' };
  return { type: 'other' };
}

function foodEmoji(food) {
  const n = String(food || '').toLowerCase();
  if (/pizza/.test(n)) return '🍕';
  if (/sushi|ramen|noodles/.test(n)) return '🍜';
  if (/hamburg|burger/.test(n)) return '🍔';
  if (/taco|burrito|quesadilla/.test(n)) return '🌮';
  if (/ensalada|bowl|fruta/.test(n)) return '🥗';
  if (/pasta|macarr|espagu/.test(n)) return '🍝';
  if (/tortilla|huevo|revuelto/.test(n)) return '🍳';
  if (/pollo/.test(n)) return '🍗';
  if (/sopa|crema|caldo/.test(n)) return '🥣';
  if (/tostada|bocadillo|sandwich|pan/.test(n)) return '🥪';
  if (/yogur|granola|avena|porridge/.test(n)) return '🥣';
  if (/cafe|café|chocolate/.test(n)) return '☕';
  if (/helado|postre|tarta|crepe/.test(n)) return '🍰';
  return '🍽️';
}

function faqsFor(ctx) {
  const city = pretty(ctx.city);
  const food = pretty(ctx.food);
  const moment = MOMENT_LABEL[ctx.moment] || ctx.moment;
  const verb = MOMENT_VERB[ctx.moment] || 'comer';

  if (ctx.type === 'guide') {
    return [
      {
        q: `¿Cómo decidir si ${food} encaja para ${verb} en ${city}?`,
        a: `Piensa en tres cosas: cuánta hambre tienes, cuánto tiempo tienes y si prefieres algo ligero o contundente. ${food} funciona bien para ${moment} en ${city} cuando quieres una opción clara sin revisar listas interminables.`
      },
      {
        q: `¿${food} es una opción rápida en ${city}?`,
        a: `Depende de la preparación. Si cocinas en casa, elige una versión sencilla. Si pides o sales, prioriza cercanía y tiempos de espera. En ${city}, para ${moment}, la distancia suele importar tanto como el plato.`
      },
      {
        q: `¿Qué mirar antes de elegir ${food} en ${city}?`,
        a: `Compara preparación, cantidad, precio con extras y opiniones recientes. Una descripción clara del plato suele ayudar más que una puntuación general.`
      },
      {
        q: `¿Puedo adaptar ${food} a un presupuesto bajo?`,
        a: `Sí: reduce extras, elige ración sencilla o cocina en casa con ingredientes de despensa. En ${city}, las versiones caseras de ${food} suelen salir más económicas que el delivery completo.`
      },
      {
        q: `¿Qué alternativas hay a ${food} para ${moment} en ${city}?`,
        a: `En la misma guía de ${moment} en ${city} encontrarás otras ideas del mismo momento del día. Si sigues dudando, gira la ruleta y quédate con la primera opción razonable.`
      }
    ];
  }

  if (ctx.type === 'moment') {
    return [
      {
        q: `¿Qué ${verb} en ${city} si tienes poco tiempo?`,
        a: `Prioriza preparaciones simples o sitios cercanos. Decide en dos opciones máximo y no revises veinte cartas. La ruleta también ayuda a cortar la indecisión.`
      },
      {
        q: `¿Cómo elegir entre las ideas de ${moment} en ${city}?`,
        a: `Filtra por hambre, tiempo y presupuesto. Después compara solo dos alternativas. Eso suele bastar para ${verb} sin perder media hora.`
      },
      {
        q: `¿Merece la pena pedir a domicilio en ${city} para ${moment}?`,
        a: `Depende del tiempo y del coste del envío. Si el mínimo y el delivery suman mucho, una opción casera sencilla puede salir mejor.`
      }
    ];
  }

  if (ctx.type === 'city') {
    return [
      {
        q: `¿Qué comer hoy en ${city}?`,
        a: `Empieza por el momento del día (desayuno, almuerzo, merienda o cena) y después elige un tipo de plato. En ${city} hay opciones rápidas, caseras y de delivery según tu plan.`
      },
      {
        q: `¿Cómo decidir qué cenar en ${city} en 3 minutos?`,
        a: `Responde solo: tiempo, presupuesto y si quieres algo ligero o contundente. Con eso, abre la guía del momento o gira la ruleta.`
      }
    ];
  }

  return [];
}

function titleFor(ctx) {
  if (ctx.type === 'guide') {
    const city = pretty(ctx.city);
    const food = pretty(ctx.food);
    const verb = MOMENT_VERB[ctx.moment] || 'comer';
    const emoji = foodEmoji(ctx.food);
    return `${emoji} ${food} para ${verb} en ${city} (${YEAR}) | Ruleta de Comida`;
  }
  if (ctx.type === 'moment') {
    const city = pretty(ctx.city);
    const label = MOMENT_LABEL[ctx.moment] || ctx.moment;
    const verb = MOMENT_VERB[ctx.moment] || 'comer';
    return `Ideas para ${verb} en ${city} (${YEAR}) · ${pretty(label)} | Ruleta de Comida`;
  }
  if (ctx.type === 'city') {
    return `¿Qué comer en ${pretty(ctx.city)}? Ideas ${YEAR} | Ruleta de Comida`;
  }
  return null;
}

function descriptionFor(ctx) {
  if (ctx.type === 'guide') {
    const city = pretty(ctx.city);
    const food = pretty(ctx.food);
    const moment = MOMENT_LABEL[ctx.moment] || ctx.moment;
    return `¿${food} para ${moment} en ${city}? Criterios claros de tiempo, hambre y presupuesto. Decide en segundos con la guía y la ruleta.`;
  }
  if (ctx.type === 'moment') {
    const city = pretty(ctx.city);
    const verb = MOMENT_VERB[ctx.moment] || 'comer';
    return `Ideas reales para ${verb} en ${city}. Elige un plato, compara alternativas o gira la ruleta sin perder media hora.`;
  }
  if (ctx.type === 'city') {
    return `Guías por momento del día en ${pretty(ctx.city)}: desayuno, almuerzo, merienda y cena. Decide qué comer hoy sin listas interminables.`;
  }
  return null;
}

function breadcrumbLd(ctx) {
  const items = [
    { name: 'Inicio', item: SITE + '/' }
  ];
  if (ctx.city) {
    items.push({ name: pretty(ctx.city), item: `${SITE}/${ctx.city}/` });
  }
  if (ctx.moment) {
    items.push({
      name: pretty(MOMENT_LABEL[ctx.moment] || ctx.moment),
      item: `${SITE}/${ctx.city}/${ctx.moment}/`
    });
  }
  if (ctx.food) {
    items.push({
      name: pretty(ctx.food),
      item: `${SITE}/${ctx.city}/${ctx.moment}/${ctx.food}/`
    });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item
    }))
  };
}

function faqLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function howToLd(ctx) {
  if (ctx.type !== 'guide' && ctx.type !== 'moment' && ctx.type !== 'city') return null;
  const city = pretty(ctx.city || 'España');
  const food = ctx.food ? pretty(ctx.food) : 'un plato';
  const verb = MOMENT_VERB[ctx.moment] || 'comer';
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cómo elegir qué ${verb} en ${city}`,
    description: `Pasos sencillos para decidir ${food} u otra opción en ${city} sin perder tiempo.`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Define tiempo y presupuesto',
        text: 'Decide cuántos minutos tienes y cuánto quieres gastar antes de mirar opciones.'
      },
      {
        '@type': 'HowToStep',
        name: 'Elige el tipo de plato',
        text: ctx.food
          ? `Valora si ${food} encaja con tu hambre y el momento del día.`
          : 'Elige entre algo ligero, completo o rápido según tu hambre.'
      },
      {
        '@type': 'HowToStep',
        name: 'Decide o gira la ruleta',
        text: 'Compara como máximo dos alternativas o usa la ruleta de Ruleta de Comida para cortar la indecisión.'
      }
    ]
  };
}

function speakableLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.rf-ctr-faq details p', '.lead', 'h1']
    }
  };
}

function faqHtml(faqs) {
  if (!faqs.length) return '';
  const items = faqs
    .map(
      (f) =>
        `<details class="rf-ctr-faq-item"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`
    )
    .join('\n');
  return `<section class="rf-ctr-faq" id="rf-ctr-faq" aria-label="Preguntas frecuentes">
  <h2>Preguntas frecuentes</h2>
  ${items}
</section>`;
}

function updatedHtml() {
  const iso = new Date().toISOString().slice(0, 10);
  const human = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `<p class="rf-ctr-updated">Actualizado: <time datetime="${iso}">${esc(human)}</time></p>`;
}

const CTR_CSS = `<style id="rf-ctr-whitehat-css">
.rf-ctr-faq{max-width:720px;margin:24px auto;padding:0 16px 8px}
.rf-ctr-faq h2{font-size:1.2rem;margin:0 0 12px}
.rf-ctr-faq-item{border:1px solid #e7e5e4;border-radius:12px;background:#fff;margin:8px 0;padding:0}
.rf-ctr-faq-item summary{padding:12px 14px;font-weight:700;cursor:pointer}
.rf-ctr-faq-item p{margin:0;padding:0 14px 12px;color:#44403c;line-height:1.6}
.rf-ctr-updated{max-width:720px;margin:8px auto 0;padding:0 16px;color:#78716c;font-size:.88rem}
</style>`;

function stripOld(html) {
  html = html.replace(/<script type="application\/ld\+json" id="rf-ctr-[^"]+">[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<section class="rf-ctr-faq"[\s\S]*?<\/section>/gi, '');
  html = html.replace(/<p class="rf-ctr-updated">[\s\S]*?<\/p>/gi, '');
  html = html.replace(/<style id="rf-ctr-whitehat-css">[\s\S]*?<\/style>/gi, '');
  return html;
}

function setTitle(html, title) {
  if (!title) return html;
  if (/<title>[^<]*<\/title>/i.test(html)) {
    return html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`);
}

function setDescription(html, desc) {
  if (!desc) return html;
  if (/name=["']description["']/i.test(html)) {
    return html.replace(
      /<meta\s+[^>]*name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(desc)}">`
    );
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><meta name="description" content="${esc(desc)}">`);
}

function injectSchemas(html, schemas) {
  const tags = schemas
    .filter(Boolean)
    .map(
      (s, i) =>
        `<script type="application/ld+json" id="rf-ctr-ld-${i}">${JSON.stringify(s)}</script>`
    )
    .join('\n');
  return html.replace(/<\/head>/i, tags + '\n</head>');
}

function injectBody(html, block) {
  if (/<footer[\s>]/i.test(html)) {
    return html.replace(/<footer/i, block + '\n<footer');
  }
  return html.replace(/<\/body>/i, block + '\n</body>');
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[ctr-whitehat-pack] sin dist');
    return { changed: 0 };
  }

  let changed = 0;

  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue;
        walk(full);
      } else if (/\.html$/i.test(e.name)) {
        const ctx = parseParts(full);
        if (ctx.type === 'other' || ctx.type === 'home') continue;

        let html = fs.readFileSync(full, 'utf8');
        html = stripOld(html);

        const faqs = faqsFor(ctx);
        const title = titleFor(ctx);
        const desc = descriptionFor(ctx);

        html = setTitle(html, title);
        html = setDescription(html, desc);

        const schemas = [breadcrumbLd(ctx), faqs.length ? faqLd(faqs) : null, howToLd(ctx), speakableLd()];
        html = injectSchemas(html, schemas);

        if (!html.includes('rf-ctr-whitehat-css')) {
          html = html.replace(/<\/head>/i, CTR_CSS + '</head>');
        }

        const bodyBits = updatedHtml() + (faqs.length ? faqHtml(faqs) : '');
        html = injectBody(html, bodyBits);

        fs.writeFileSync(full, html, 'utf8');
        changed++;
      }
    }
  }

  walk(DIST);
  console.log(`[ctr-whitehat-pack] ${changed} páginas con FAQ/HowTo/Breadcrumb/Speakable + títulos/metas CTR.`);
  return { changed };
}

if (require.main === module) run();
module.exports = { run };
