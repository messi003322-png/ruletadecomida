/**
 * Home FAQ SEO (legítimo):
 * - Bloque FAQ visible en la home
 * - JSON-LD FAQPage en schema-faq
 * NO incluye: ofuscación de enlaces, manipulación del portapapeles, sitemap reducido
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const INDEX = path.join(DIST, 'index.html');

const FAQ_ITEMS = [
  {
    q: '¿Qué se puede cenar que sea ligero y rápido?',
    a: 'Un wrap de pollo con vegetales, una tortilla francesa con queso o un bol de yogur griego con frutos secos son opciones perfectas. Se preparan en menos de 10 minutos y facilitan una digestión suave antes de dormir.'
  },
  {
    q: '¿Qué comprar para tener cenas rápidas toda la semana?',
    a: 'Huevos, legumbres cocidas, verduras congeladas, latas de atún, tortillas de trigo y queso rallado. Con estos básicos puedes improvisar decenas de combinaciones en pocos minutos.'
  },
  {
    q: '¿Es malo cenar tarde o saltarse la cena?',
    a: 'Saltarse la cena puede alterar la glucosa y empeorar el descanso. Lo ideal es una ingesta moderada al menos dos horas antes de acostarse para dormir mejor.'
  },
  {
    q: '¿Cómo decidir qué cenar hoy sin perder tiempo?',
    a: 'Limita opciones o usa un sistema automático. La ruleta de comida te da una respuesta única en 3 segundos y evita la parálisis por análisis.'
  }
];

function faqHtml() {
  const items = FAQ_ITEMS.map(
    (item) =>
      `<details class="rf-home-faq-item">\n<summary>${item.q}</summary>\n<p>${item.a}</p>\n</details>`
  ).join('\n');

  return `
<section id="rf-home-faq" class="rf-home-faq" aria-labelledby="rf-home-faq-title">
  <div class="rf-home-faq-inner">
    <h2 id="rf-home-faq-title">Preguntas frecuentes sobre qué cenar hoy</h2>
    <p class="rf-home-faq-lead">Respuestas claras para la duda de todas las noches. Gira la ruleta o usa estas ideas rápidas.</p>
    ${items}
  </div>
</section>`;
}

function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

const FAQ_CSS = `<style id="rf-home-faq-css">
.rf-home-faq{max-width:720px;margin:48px auto 24px;padding:0 20px}
.rf-home-faq-inner{padding:28px 24px;border:1px solid rgba(255,140,50,.18);border-radius:24px;background:linear-gradient(160deg,#fff,#fffaf5);box-shadow:0 12px 32px rgba(80,40,10,.06)}
.rf-home-faq h2{margin:0 0 8px;font-size:clamp(1.35rem,3vw,1.75rem);font-weight:850;letter-spacing:-.03em;color:#1a1210}
.rf-home-faq-lead{margin:0 0 20px;color:#7a6358;line-height:1.6}
.rf-home-faq-item{margin:10px 0;border:1px solid rgba(0,0,0,.08);border-radius:16px;background:#fff;overflow:hidden}
.rf-home-faq-item summary{padding:16px 18px;font-weight:750;color:#1a1210;cursor:pointer;list-style:none}
.rf-home-faq-item summary::-webkit-details-marker{display:none}
.rf-home-faq-item summary::after{content:"+";float:right;color:#ff6b1a;font-size:1.25rem;line-height:.9}
.rf-home-faq-item[open] summary::after{content:"–"}
.rf-home-faq-item p{margin:0;padding:0 18px 16px;color:#5c4a40;line-height:1.65}
@media(max-width:767px){.rf-home-faq{margin:32px auto 16px;padding:0 14px}.rf-home-faq-inner{padding:22px 16px;border-radius:20px}}
</style>`;

function run() {
  if (!fs.existsSync(INDEX)) {
    console.warn('[home-faq-seo] index.html no encontrado');
    return false;
  }

  let html = fs.readFileSync(INDEX, 'utf8');

  // CSS
  html = html.replace(/<style id="rf-home-faq-css">[\s\S]*?<\/style>/i, '');
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, FAQ_CSS + '</head>');
  }

  // JSON-LD FAQPage en schema-faq si existe, o nuevo script
  const ld = JSON.stringify(faqJsonLd());
  if (/id=["']schema-faq["']/i.test(html)) {
    html = html.replace(
      /<script type=["']application\/ld\+json["'] id=["']schema-faq["']>[\s\S]*?<\/script>/i,
      `<script type="application/ld+json" id="schema-faq">${ld}</script>`
    );
  } else if (!/"@type"\s*:\s*"FAQPage"/i.test(html)) {
    html = html.replace(/<\/head>/i, `<script type="application/ld+json" id="schema-faq">${ld}</script></head>`);
  }

  // Bloque FAQ visible (una sola vez)
  html = html.replace(/<section id="rf-home-faq"[\s\S]*?<\/section>\s*/i, '');
  const block = faqHtml();
  if (/<footer\b/i.test(html)) {
    html = html.replace(/<footer\b/i, block + '\n<footer');
  } else if (/<div class="rf-final-footer"/i.test(html)) {
    html = html.replace(/<div class="rf-final-footer"/i, block + '\n<div class="rf-final-footer"');
  } else {
    html = html.replace(/<\/body>/i, block + '\n</body>');
  }

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[home-faq-seo] FAQ visible + FAQPage schema aplicados en index.html');
  return true;
}

if (require.main === module) run();
module.exports = { run };
