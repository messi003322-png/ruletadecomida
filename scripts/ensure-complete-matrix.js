/**
 * Garantiza matriz completa: cada ciudad tiene TODAS las comidas
 * de cada momento que existan en el proyecto.
 * Si falta una ruta, la clona desde otra ciudad o genera plantilla mínima.
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';
const MOMENTS = ['desayuno', 'almuerzo', 'merienda', 'cena'];
const SKIP = new Set(['assets', 'css', 'js', 'images']);

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
    .filter((name) =>
      MOMENTS.some((m) => {
        const d = path.join(DIST, name, m);
        return (
          fs.existsSync(d) &&
          fs.readdirSync(d, { withFileTypes: true }).some(
            (x) => x.isDirectory() && fs.existsSync(path.join(d, x.name, 'index.html'))
          )
        );
      })
    );
}

function foodsForMoment(moment) {
  const set = new Set();
  for (const city of cities()) {
    const d = path.join(DIST, city, moment);
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory() && fs.existsSync(path.join(d, e.name, 'index.html'))) {
        set.add(e.name);
      }
    }
  }
  return [...set].sort();
}

function findSource(moment, food) {
  for (const city of cities()) {
    const p = path.join(DIST, city, moment, food, 'index.html');
    if (fs.existsSync(p)) return { city, html: fs.readFileSync(p, 'utf8') };
  }
  return null;
}

function minimalPage(city, moment, food) {
  const cn = pretty(city);
  const fn = pretty(food);
  const url = `${SITE}/${city}/${moment}/${food}/`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fn)} para ${esc(moment)} en ${esc(cn)} | Ruleta de Comida</title>
<meta name="description" content="Guía de ${esc(fn)} para ${esc(moment)} en ${esc(cn)}.">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow">
</head>
<body>
<main>
  <p><a href="${SITE}/">Ruleta de Comida</a></p>
  <h1>${esc(fn)} para ${esc(moment)} en ${esc(cn)}</h1>
  <p>Guía de comida · ${esc(cn)}</p>
  <p>Decide si ${esc(fn)} encaja contigo para este ${esc(moment)} en ${esc(cn)}.</p>
  <p><a href="${SITE}/#ruleta">Girar la ruleta</a></p>
  <p><a href="${SITE}/${city}/${moment}/">Más opciones de ${esc(moment)} en ${esc(cn)}</a></p>
</main>
</body>
</html>`;
}

function adapt(html, fromCity, toCity, moment, food) {
  const fromPretty = pretty(fromCity);
  const toPretty = pretty(toCity);
  let out = html;
  // URLs
  out = out.split(`/${fromCity}/`).join(`/${toCity}/`);
  out = out.split(fromCity).join(toCity);
  // Nombres visibles (cuidado con mayúsculas)
  out = out.split(fromPretty).join(toPretty);
  // Canonical / title leftovers
  out = out.replace(
    /<link rel="canonical" href="[^"]+"/i,
    `<link rel="canonical" href="${SITE}/${toCity}/${moment}/${food}/"`
  );
  return out;
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');
  const cityList = cities();
  let created = 0;
  const byMoment = {};

  for (const moment of MOMENTS) {
    const foods = foodsForMoment(moment);
    byMoment[moment] = foods;
    for (const city of cityList) {
      for (const food of foods) {
        const outDir = path.join(DIST, city, moment, food);
        const outFile = path.join(outDir, 'index.html');
        if (fs.existsSync(outFile)) continue;

        const src = findSource(moment, food);
        fs.mkdirSync(outDir, { recursive: true });
        if (src) {
          fs.writeFileSync(outFile, adapt(src.html, src.city, city, moment, food), 'utf8');
        } else {
          fs.writeFileSync(outFile, minimalPage(city, moment, food), 'utf8');
        }
        created++;
      }
    }
  }

  const total =
    cityList.length *
    MOMENTS.reduce((n, m) => n + (byMoment[m] || []).length, 0);

  console.log(
    `[ensure-complete-matrix] ciudades=${cityList.length} ` +
      MOMENTS.map((m) => `${m}:${(byMoment[m] || []).length}`).join(' ') +
      ` | creadas=${created} | total_rutas≈${total}`
  );
  return { cities: cityList.length, created, byMoment };
}

if (require.main === module) run();
module.exports = { run };
