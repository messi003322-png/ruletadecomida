/**
 * Corrige "Duplicada: Google ha elegido una versión canónica diferente".
 *
 * Problemas detectados en GSC:
 * - /pasta/, /tacos/, /pollo-asado/ se renderizaban como CIUDAD
 *   ("Qué comer en Pasta?") → Google prefiere /madrid/pasta/ etc.
 * - Canónicos inconsistentes / trailing slash
 * - Home sin slash unificado
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

// Ciudades reales del proyecto (no son comidas)
const CITIES = new Set(
  [
    'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'murcia', 'palma',
    'las-palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon', 'hospitalet',
    'vitoria', 'coruna', 'a-coruna', 'elche', 'granada', 'terrassa', 'badalona', 'oviedo',
    'sabadell', 'cartagena', 'jerez', 'mostoles', 'alcala-de-henares', 'fuenlabrada', 'leganes',
    'getafe', 'alcorcon', 'burgos', 'santander', 'logrono', 'badajoz', 'huelva', 'salamanca',
    'marbella', 'lleida', 'dos-hermanas', 'tarragona', 'torrejon-de-ardoz', 'parla', 'mataro',
    'algeciras', 'santa-coloma', 'cadiz', 'alcobendas', 'ourense', 'reus', 'telde', 'barakaldo',
    'girona', 'roquetas-de-mar', 'santiago-de-compostela', 'caceres', 'lorca', 'coslada',
    'las-rozas', 'san-fernando', 'el-puerto-de-santa-maria', 'san-sebastian-de-los-reyes',
    'cornella', 'melilla', 'ceuta', 'pozo-alcon', 'elgoibar', 'alza', 'las-arte', 'vinaros',
    'torrelavega', 'rivas-vaciamadrid', 'chiclana', 'torrent', 'getxo', 'velez-malaga',
    'gandia', 'aviles'
  ]
);

const MOMENTS = new Set([
  'desayuno', 'almuerzo', 'merienda', 'cena', 'brunch', 'media-manana', 'noche'
]);

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

function setCanonical(html, url) {
  // Quitar todos los canónicos previos
  html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
  const tag = `<link rel="canonical" href="${url}">`;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, tag + '\n</head>');
  return tag + html;
}

function setTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`);
}

function setDescription(html, desc) {
  if (/name=["']description["']/i.test(html)) {
    return html.replace(
      /<meta\s+[^>]*name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(desc)}">`
    );
  }
  return html.replace(
    /<head([^>]*)>/i,
    `<head$1><meta name="description" content="${esc(desc)}">`
  );
}

function setRobots(html, content) {
  if (/name=["']robots["']/i.test(html)) {
    return html.replace(
      /<meta\s+[^>]*name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${content}">`
    );
  }
  return html.replace(/<head([^>]*)>/i, `<head$1><meta name="robots" content="${content}">`);
}

function foodHubHtml(slug) {
  const name = pretty(slug);
  const url = `${SITE}/${slug}/`;
  const cities = ['madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'malaga', 'zaragoza', 'alicante'];
  const links = cities
    .map(
      (c) =>
        `<li><a href="${SITE}/${c}/${slug}/">${pretty(name)} en ${pretty(c)}</a></li>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)}: ideas para decidir qué pedir o cocinar | Ruleta de Comida</title>
<meta name="description" content="Guía de ${esc(name.toLowerCase())} en España: cuándo elegirla, qué mirar y enlaces a guías por ciudad. Decide en segundos con la ruleta.">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${esc(name)} | Ruleta de Comida">
<meta property="og:url" content="${url}">
<style>
body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fffbf7;color:#1c1917;line-height:1.65}
.wrap{max-width:760px;margin:0 auto;padding:24px 18px 48px}
a{color:#c2410c;font-weight:700;text-decoration:none}
h1{font-size:clamp(1.6rem,4vw,2.2rem);line-height:1.15}
.card{background:#fff;border:1px solid #e7e5e4;border-radius:16px;padding:18px 20px;margin:16px 0}
.cta{display:inline-block;margin-top:8px;padding:12px 18px;border-radius:999px;background:linear-gradient(135deg,#ff9a3c,#ff6b1a);color:#fff!important}
</style>
</head>
<body>
<main class="wrap">
  <p><a href="${SITE}/">Ruleta de Comida</a></p>
  <h1>${esc(name)}: cuándo elegirla y cómo decidir</h1>
  <p>Esta es la <strong>guía nacional de ${esc(name.toLowerCase())}</strong> — no una página de ciudad.
  Sirve para decidir si te apetece ${esc(name.toLowerCase())} hoy y luego saltar a la guía de tu ciudad.</p>
  <p><a class="cta" href="${SITE}/#ruleta">Girar la ruleta</a></p>

  <section class="card">
    <h2>Qué mirar al elegir ${esc(name)}</h2>
    <ul>
      <li>Tiempo real (casa, local o delivery)</li>
      <li>Ración y precio final (con extras)</li>
      <li>Si buscas algo ligero, completo o para compartir</li>
    </ul>
  </section>

  <section class="card">
    <h2>${esc(name)} por ciudad</h2>
    <p>Abre la ficha de tu ciudad para criterios locales y alternativas del mismo momento del día:</p>
    <ul>${links}</ul>
  </section>

  <section class="card">
    <h2>¿No te decides?</h2>
    <p>Gira la ruleta o elige momento + comida + ciudad en la home.</p>
    <p><a href="${SITE}/">Volver al inicio</a></p>
  </section>
</main>
</body>
</html>`;
}

function topicHubHtml(slug) {
  const name = pretty(slug);
  const url = `${SITE}/${slug}/`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} | Ruleta de Comida</title>
<meta name="description" content="${esc(name)}: ideas prácticas para decidir qué comer sin perder tiempo.">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
</head>
<body>
<main style="max-width:720px;margin:auto;padding:24px 18px;font-family:system-ui,sans-serif">
  <p><a href="${SITE}/">Ruleta de Comida</a></p>
  <h1>${esc(name)}</h1>
  <p>Guía temática para orientarte y pasar a una decisión concreta con la ruleta o una guía por ciudad.</p>
  <p><a href="${SITE}/#ruleta">Girar la ruleta</a></p>
</main>
</body>
</html>`;
}

function strengthenCityPage(html, slug) {
  const name = pretty(slug);
  const url = `${SITE}/${slug}/`;
  const title = `Qué comer en ${name}: ideas por momento del día | Ruleta de Comida`;
  const desc = `Guía de comida en ${name}: desayuno, almuerzo, merienda y cena. Elige momento o gira la ruleta.`;
  html = setTitle(html, title);
  html = setDescription(html, desc);
  html = setCanonical(html, url);
  html = setRobots(html, 'index,follow');
  // Quitar H1 erróneos tipo "Qué comer en Guia Completa..."
  return html;
}

function fixHome(html) {
  // Canónico único con trailing slash (evita variantes ?comida=)
  html = setCanonical(html, SITE + '/');
  html = setRobots(html, 'index,follow');
  // Si hay varios canónicos residuales, setCanonical ya limpia
  return html;
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.warn('[fix-gsc-canonical] sin dist');
    return;
  }

  let foodFixed = 0;
  let cityFixed = 0;
  let topicFixed = 0;

  // Home
  const home = path.join(DIST, 'index.html');
  if (fs.existsSync(home)) {
    let html = fs.readFileSync(home, 'utf8');
    html = fixHome(html);
    fs.writeFileSync(home, html, 'utf8');
  }

  const entries = fs.readdirSync(DIST, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith('.')) continue;
    if (['assets', 'css', 'js', 'images', 'comer', 'guia'].includes(e.name)) continue;

    const indexPath = path.join(DIST, e.name, 'index.html');
    if (!fs.existsSync(indexPath)) continue;

    const slug = e.name;

    // Momentos raíz (desayuno/, cena/) — canónico self
    if (MOMENTS.has(slug)) {
      let html = fs.readFileSync(indexPath, 'utf8');
      html = setCanonical(html, `${SITE}/${slug}/`);
      fs.writeFileSync(indexPath, html, 'utf8');
      continue;
    }

    // Ciudad real
    if (CITIES.has(slug)) {
      let html = fs.readFileSync(indexPath, 'utf8');
      html = strengthenCityPage(html, slug);
      fs.writeFileSync(indexPath, html, 'utf8');
      cityFixed++;
      continue;
    }

    // Temas editoriales
    if (
      /^(guia-|cena-|comida-|que-|no-se|cenas-|almuerzo|merienda)/.test(slug) ||
      slug === 'guia-completa-de-comidas'
    ) {
      fs.writeFileSync(indexPath, topicHubHtml(slug), 'utf8');
      topicFixed++;
      continue;
    }

    // Resto depth-1 = comida/nacional (pasta, tacos, pollo-asado, sushi...)
    fs.writeFileSync(indexPath, foodHubHtml(slug), 'utf8');
    foodFixed++;
  }

  // Asegurar canónico self en las 6 URLs reportadas (por si acaso)
  const reported = [
    'guia-completa-de-comidas',
    'pollo-asado',
    'las-palmas',
    'chiclana',
    'tacos',
    'pasta'
  ];
  for (const slug of reported) {
    const p = path.join(DIST, slug, 'index.html');
    if (!fs.existsSync(p)) continue;
    let html = fs.readFileSync(p, 'utf8');
    html = setCanonical(html, `${SITE}/${slug}/`);
    fs.writeFileSync(p, html, 'utf8');
  }

  console.log(
    `[fix-gsc-canonical] foodHubs=${foodFixed} cities=${cityFixed} topics=${topicFixed} | 6 URLs GSC reforzadas`
  );
}

if (require.main === module) run();
module.exports = { run };
