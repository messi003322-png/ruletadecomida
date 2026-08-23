/**
 * 79 ciudades × 4 momentos del día + FAQ schema + sitemap
 * White-hat: sin barrios masivos, sin refresh de ads
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

const CITIES = [
  ['madrid','Madrid'],['barcelona','Barcelona'],['valencia','Valencia'],['sevilla','Sevilla'],
  ['zaragoza','Zaragoza'],['malaga','Málaga'],['murcia','Murcia'],['palma','Palma'],
  ['las-palmas','Las Palmas'],['bilbao','Bilbao'],['alicante','Alicante'],['cordoba','Córdoba'],
  ['valladolid','Valladolid'],['vigo','Vigo'],['gijon','Gijón'],['hospitalet','Hospitalet'],
  ['vitoria','Vitoria'],['coruna','A Coruña'],['elche','Elche'],['granada','Granada'],
  ['terrassa','Terrassa'],['badalona','Badalona'],['oviedo','Oviedo'],['sabadell','Sabadell'],
  ['cartagena','Cartagena'],['jerez','Jerez'],['mostoles','Móstoles'],['alcala-de-henares','Alcalá de Henares'],
  ['fuenlabrada','Fuenlabrada'],['leganes','Leganés'],['getafe','Getafe'],['alcorcon','Alcorcón'],
  ['burgos','Burgos'],['santander','Santander'],['logrono','Logroño'],['badajoz','Badajoz'],
  ['huelva','Huelva'],['salamanca','Salamanca'],['marbella','Marbella'],['lleida','Lleida'],
  ['dos-hermanas','Dos Hermanas'],['tarragona','Tarragona'],['torrejon-de-ardoz','Torrejón de Ardoz'],
  ['parla','Parla'],['mataro','Mataró'],['algeciras','Algeciras'],['santa-coloma','Santa Coloma'],
  ['cadiz','Cádiz'],['alcobendas','Alcobendas'],['ourense','Ourense'],['reus','Reus'],
  ['telde','Telde'],['barakaldo','Barakaldo'],['girona','Girona'],['roquetas-de-mar','Roquetas de Mar'],
  ['santiago-de-compostela','Santiago de Compostela'],['caceres','Cáceres'],['lorca','Lorca'],
  ['coslada','Coslada'],['las-rozas','Las Rozas'],['san-fernando','San Fernando'],
  ['el-puerto-de-santa-maria','El Puerto de Santa María'],['san-sebastian-de-los-reyes','San Sebastián de los Reyes'],
  ['cornellat','Cornellà'],['melilla','Melilla'],['ceuta','Ceuta'],['pozo-alcon','Pozo Alcón'],
  ['elgoibar','Elgoibar'],['alza','Alza'],['las-arte','Las Arte'],['vinaros','Vinaròs'],
  ['torrelavega','Torrelavega'],['rivas-vaciamadrid','Rivas-Vaciamadrid'],['chiclana','Chiclana'],
  ['torrent','Torrent'],['getxo','Getxo'],['velez-malaga','Vélez-Málaga'],['gandia','Gandía'],
  ['aviles','Avilés']
].map(([slug, name]) => ({ slug, name }));

const MEALS = [
  {
    slug: 'desayuno', name: 'desayuno', label: 'Desayuno', verb: 'desayunar',
    ideas: ['Tostadas con tomate','Café con bollería','Huevos revueltos','Yogur con fruta','Churros o porras','Avena con frutos secos','Bocadillo de jamón','Zumo y tostada integral'],
    time: 'por la mañana', budget: '1–4 €'
  },
  {
    slug: 'almuerzo', name: 'almuerzo', label: 'Almuerzo', verb: 'almorzar',
    ideas: ['Menú del día','Ensalada completa','Pasta rápida','Bocadillo contundente','Arroz con verduras','Tortilla de patata','Pollo a la plancha','Legumbres de bote'],
    time: 'al mediodía', budget: '3–8 €'
  },
  {
    slug: 'merienda', name: 'merienda', label: 'Merienda', verb: 'merendar',
    ideas: ['Pieza de fruta','Yogur','Tostada dulce','Café y galleta','Batido casero','Frutos secos','Sándwich ligero','Chocolate a la taza'],
    time: 'por la tarde', budget: '1–3 €'
  },
  {
    slug: 'cena', name: 'cena', label: 'Cena', verb: 'cenar',
    ideas: ['Tortilla francesa','Wrap de pollo','Ensalada','Sopa o crema','Pasta al pesto','Pescado a la plancha','Revuelto de verduras','Pizza casera rápida'],
    time: 'por la noche', budget: '2–7 €'
  }
];

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function faqFor(city, meal) {
  return [
    {
      q: `¿Qué ${meal.verb} rápido en ${city.name}?`,
      a: `En ${city.name} puedes ${meal.verb} en pocos minutos con opciones como ${meal.ideas.slice(0, 3).join(', ')}. La ruleta te da una idea concreta en 3 segundos.`
    },
    {
      q: `¿Cuánto cuesta un ${meal.name} barato en ${city.name}?`,
      a: `Un ${meal.name} sencillo en ${city.name} suele estar en torno a ${meal.budget} si cocinas en casa. Prioriza despensa y evita el delivery si quieres ahorrar.`
    },
    {
      q: `¿Cómo decidir qué ${meal.verb} hoy en ${city.name}?`,
      a: `Usa la ruleta filtrada por ${meal.label.toLowerCase()} o elige una idea de la lista. En ${city.name}, una decisión clara evita perder media hora.`
    }
  ];
}

function pageHtml(city, meal) {
  const faqs = faqFor(city, meal);
  const title = `¿Qué ${meal.verb} hoy en ${city.name}? Ruleta de ${meal.label.toLowerCase()} 🎯`;
  const description = `¿No sabes qué ${meal.verb} en ${city.name}? Ideas de ${meal.label.toLowerCase()} ${meal.time}. Presupuesto ${meal.budget}. Gira la ruleta en 3 segundos.`;
  const url = `${SITE}/${city.slug}/${meal.slug}/`;
  const ideasList = meal.ideas.map((i) => `<li>${esc(i)}</li>`).join('');
  const faqHtml = faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n');
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  const webLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Ruleta de Comida', url: SITE + '/' }
  };
  const otherMeals = MEALS.filter((m) => m.slug !== meal.slug)
    .map((m) => `<a class="rf-meal-chip" href="${SITE}/${city.slug}/${m.slug}/">${esc(m.label)} en ${esc(city.name)}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<script type="application/ld+json">${JSON.stringify(webLd)}</script>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fffbf7;color:#1a1210;line-height:1.65}
.wrap{max-width:720px;margin:0 auto;padding:24px 18px 48px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
header a{color:#c2410c;font-weight:700;text-decoration:none}
h1{font-size:clamp(1.55rem,5vw,2.1rem);line-height:1.15;letter-spacing:-.03em;margin:0 0 12px}
.lead{color:#5c4a40;margin:0 0 24px}
.ideas{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:18px 20px;margin:0 0 24px}
.ideas h2{margin:0 0 10px;font-size:1.1rem}
.cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;border-radius:999px;background:linear-gradient(135deg,#ff9a3c,#ff6b1a);color:#fff;font-weight:800;text-decoration:none}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:28px 0}
.rf-meal-chip{display:inline-flex;padding:8px 14px;border-radius:999px;border:1px solid rgba(0,0,0,.1);background:#fff;color:#3d2e28;text-decoration:none;font-size:.85rem;font-weight:650}
details{margin:10px 0;border:1px solid rgba(0,0,0,.08);border-radius:14px;background:#fff}
summary{padding:14px 16px;font-weight:750;cursor:pointer}
details p{margin:0;padding:0 16px 14px;color:#5c4a40}
footer{margin-top:36px;padding-top:18px;border-top:1px solid rgba(0,0,0,.08);font-size:.9rem;color:#7a6358}
footer a{color:#c2410c;font-weight:700}
</style>
</head>
<body>
<div class="wrap">
<header>
  <a href="${SITE}/">Ruleta de Comida</a>
  <a href="${SITE}/?meal=${meal.slug}#ruleta">Girar ruleta</a>
</header>
<main>
  <h1>¿Qué ${esc(meal.verb)} hoy en ${esc(city.name)}?</h1>
  <p class="lead">Decide tu <strong>${esc(meal.label.toLowerCase())}</strong> en ${esc(city.name)} en 3 segundos. Ideas realistas ${esc(meal.time)}.</p>
  <p><a class="cta" href="${SITE}/?meal=${meal.slug}#ruleta">Girar ruleta de ${esc(meal.label.toLowerCase())}</a></p>
  <section class="ideas">
    <h2>Ideas de ${esc(meal.label.toLowerCase())} en ${esc(city.name)}</h2>
    <ul>${ideasList}</ul>
    <p style="margin:12px 0 0;color:#5c4a40">Presupuesto orientativo: <strong>${esc(meal.budget)}</strong>.</p>
  </section>
  <section>
    <h2>Otros momentos en ${esc(city.name)}</h2>
    <div class="chips">${otherMeals}<a class="rf-meal-chip" href="${SITE}/${city.slug}/">Ver ${esc(city.name)}</a></div>
  </section>
  <section>
    <h2>Preguntas frecuentes</h2>
    ${faqHtml}
  </section>
</main>
<footer>
  <a href="${SITE}/">Inicio</a> · <a href="${SITE}/#ruleta">Ruleta</a> · <a href="${SITE}/${city.slug}/">${esc(city.name)}</a>
</footer>
</div>
</body>
</html>`;
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[meal-layers] dist/ no existe');
    return { pages: 0 };
  }
  let pages = 0;
  const urls = [];
  for (const city of CITIES) {
    for (const meal of MEALS) {
      const dir = path.join(DIST, city.slug, meal.slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), pageHtml(city, meal), 'utf8');
      pages++;
      urls.push(`${SITE}/${city.slug}/${meal.slug}/`);
    }
  }
  const smPath = path.join(DIST, 'sitemap.xml');
  if (fs.existsSync(smPath) && urls.length) {
    let sm = fs.readFileSync(smPath, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    const extra = urls
      .filter((u) => !sm.includes(`<loc>${u}</loc>`))
      .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
      .join('\n');
    if (extra) {
      sm = sm.replace('</urlset>', extra + '\n</urlset>');
      fs.writeFileSync(smPath, sm, 'utf8');
    }
  }
  console.log(`[meal-layers] ${pages} páginas (${CITIES.length} ciudades × 4 comidas)`);
  return { pages };
}

if (require.main === module) run();
module.exports = { run };
