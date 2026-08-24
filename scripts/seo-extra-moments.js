/**
 * Momentos EXTRA solo para indexación (Google / sitemap).
 * NO aparecen en el selector de la home (solo desayuno/almuerzo/merienda/cena).
 *
 * Total momentos del proyecto = 4 públicos + 3 SEO = 7
 * - brunch
 * - media-manana
 * - noche
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const SEO_MOMENTS = [
  {
    slug: 'brunch',
    label: 'Brunch',
    verb: 'hacer brunch',
    when: 'a media mañana o mediodía de fin de semana',
    foods: [
      'Huevos benedictinos','Tostada de aguacate','Pancakes','Bowl de yogur',
      'Salmon ahumado','Tortilla francesa','Granola con fruta','Croissant relleno',
      'Zumo natural','Café con bollería','Wrap de huevo','Ensalada ligera',
      'Tostadas con tomate','Smoothie bowl','Queso fresco con miel'
    ]
  },
  {
    slug: 'media-manana',
    label: 'Media mañana',
    verb: 'tomar algo a media mañana',
    when: 'entre el desayuno y el almuerzo',
    foods: [
      'Pieza de fruta','Yogur','Café solo','Tostada simple',
      'Frutos secos','Batido de plátano','Barrita de cereales','Bocadillo pequeño',
      'Zumo','Galletas de avena','Queso fresco','Smoothie',
      'Manzana','Café con leche','Hummus con pan'
    ]
  },
  {
    slug: 'noche',
    label: 'Noche',
    verb: 'comer de noche',
    when: 'a última hora o después de cenar',
    foods: [
      'Tortilla francesa','Sopa ligera','Yogur','Tostada',
      'Infusión y galleta','Ensalada sencilla','Revuelto de verduras','Queso y fruta',
      'Caldo','Sandwich ligero','Huevos revueltos','Crema de verduras',
      'Pita simple','Bowl de fruta','Infusión'
    ]
  }
];

const SKIP = new Set(['assets', 'css', 'js', 'images']);

function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
function pretty(s) {
  return String(s)
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

function cities() {
  return fs
    .readdirSync(DIST, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !SKIP.has(e.name))
    .map((e) => e.name)
    .filter((name) => {
      // solo ciudades que ya tienen guías públicas
      const d = path.join(DIST, name, 'cena');
      return (
        fs.existsSync(d) &&
        fs.readdirSync(d, { withFileTypes: true }).some(
          (x) => x.isDirectory() && fs.existsSync(path.join(d, x.name, 'index.html'))
        )
      );
    });
}

function pageHtml(city, moment, food) {
  const cityName = pretty(city);
  const foodSlug = slugify(food);
  const foodName = food;
  const url = `${SITE}/${city}/${moment.slug}/${foodSlug}/`;
  const title = `${foodName} para ${moment.label.toLowerCase()} en ${cityName} | Ruleta de Comida`;
  const desc = `Ideas de ${foodName.toLowerCase()} para ${moment.verb} en ${cityName} ${moment.when}. Guía práctica y realista.`;

  const others = moment.foods
    .filter((f) => f !== food)
    .slice(0, 12)
    .map(
      (f) =>
        `<a href="${SITE}/${city}/${moment.slug}/${slugify(f)}/">${esc(f)}</a>`
    )
    .join(' · ');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: desc,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Ruleta de Comida', url: SITE + '/' }
  })}</script>
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fffbf7;color:#1a1210;line-height:1.65}
.wrap{max-width:720px;margin:0 auto;padding:24px 18px 48px}
a{color:#c2410c;font-weight:700;text-decoration:none}
h1{font-size:clamp(1.5rem,5vw,2.1rem);line-height:1.15;margin:0 0 12px}
.lead{color:#5c4a40;margin:0 0 20px}
.card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:18px 20px;margin:16px 0}
.cta{display:inline-flex;padding:12px 20px;border-radius:999px;background:linear-gradient(135deg,#ff9a3c,#ff6b1a);color:#fff!important;font-weight:800}
.muted{color:#7a6358;font-size:.92rem}
</style>
</head>
<body>
<div class="wrap">
  <p><a href="${SITE}/">Ruleta de Comida</a> · <a href="${SITE}/${city}/">${esc(cityName)}</a></p>
  <h1>${esc(foodName)} para ${esc(moment.label.toLowerCase())} en ${esc(cityName)}</h1>
  <p class="lead">Guía para ${esc(moment.verb)} en ${esc(cityName)} ${esc(moment.when)}. Ideas realistas sin rodeos.</p>
  <p><a class="cta" href="${SITE}/#ruleta">Girar la ruleta</a></p>
  <section class="card">
    <h2>Sobre ${esc(foodName)}</h2>
    <p>${esc(foodName)} es una opción práctica para ${esc(moment.label.toLowerCase())} en ${esc(cityName)}. Adapta la ración a tu hambre y al tiempo que tengas.</p>
    <p class="muted">Momento: ${esc(moment.label)} · Ciudad: ${esc(cityName)}</p>
  </section>
  <section class="card">
    <h2>Cómo decidir rápido</h2>
    <ul>
      <li>Si tienes prisa, elige la versión más simple de ${esc(foodName)}.</li>
      <li>Si puedes parar un poco, mejora el plato con un acompañamiento fresco.</li>
      <li>Compara dos alternativas como máximo y decide.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Otras ideas de ${esc(moment.label.toLowerCase())} en ${esc(cityName)}</h2>
    <p>${others}</p>
  </section>
  <p class="muted"><a href="${SITE}/${city}/${moment.slug}/">Ver todas las ideas de ${esc(moment.label.toLowerCase())} en ${esc(cityName)}</a></p>
</div>
</body>
</html>`;
}

function momentIndexHtml(city, moment, foodSlugs) {
  const cityName = pretty(city);
  const url = `${SITE}/${city}/${moment.slug}/`;
  const links = foodSlugs
    .map(
      (fs, i) =>
        `<li><a href="${SITE}/${city}/${moment.slug}/${fs}/">${i + 1}. ${esc(pretty(fs))}</a></li>`
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(moment.label)} en ${esc(cityName)} | Ruleta de Comida</title>
<meta name="description" content="Ideas para ${esc(moment.verb)} en ${esc(cityName)} ${esc(moment.when)}.">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
</head>
<body>
<main style="max-width:720px;margin:auto;padding:24px 18px;font-family:system-ui,sans-serif">
  <p><a href="${SITE}/">Ruleta de Comida</a></p>
  <h1>${esc(moment.label)} en ${esc(cityName)}</h1>
  <p>Ideas para ${esc(moment.verb)} ${esc(moment.when)}.</p>
  <ul>${links}</ul>
  <p><a href="${SITE}/#ruleta">Girar la ruleta</a></p>
</main>
</body>
</html>`;
}

function appendSitemap(urls) {
  const smPath = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(smPath) || !urls.length) return;
  let sm = fs.readFileSync(smPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const extra = urls
    .filter((u) => !sm.includes(`<loc>${u}</loc>`))
    .map(
      (u) =>
        `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.55</priority>\n  </url>`
    )
    .join('\n');
  if (extra) {
    sm = sm.replace('</urlset>', extra + '\n</urlset>');
    fs.writeFileSync(smPath, sm, 'utf8');
  }
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[seo-extra-moments] sin dist');
    return { pages: 0 };
  }
  const cityList = cities();
  let pages = 0;
  const urls = [];

  for (const city of cityList) {
    for (const moment of SEO_MOMENTS) {
      const foodSlugs = moment.foods.map(slugify);
      // índice del momento
      const mDir = path.join(DIST, city, moment.slug);
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(
        path.join(mDir, 'index.html'),
        momentIndexHtml(city, moment, foodSlugs),
        'utf8'
      );
      urls.push(`${SITE}/${city}/${moment.slug}/`);
      pages++;

      for (let i = 0; i < moment.foods.length; i++) {
        const food = moment.foods[i];
        const fsSlug = foodSlugs[i];
        const dir = path.join(mDir, fsSlug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(city, moment, food), 'utf8');
        urls.push(`${SITE}/${city}/${moment.slug}/${fsSlug}/`);
        pages++;
      }
    }
  }

  appendSitemap(urls);
  console.log(
    `[seo-extra-moments] ${pages} páginas SEO (3 momentos × ${cityList.length} ciudades). No van al selector UI.`
  );
  return { pages, cities: cityList.length };
}

if (require.main === module) run();
module.exports = { run, SEO_MOMENTS };
