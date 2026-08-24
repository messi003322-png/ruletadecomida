/**
 * Escanea TODOS los HTML de dist y comprueba que cada enlace interno
 * apunte a un archivo existente (sin 404).
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SITE = 'https://www.ruletadecomida.es';

function resolvePath(href) {
  let h = href.trim();
  if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) return null;
  if (/^https?:\/\//i.test(h)) {
    if (!h.startsWith(SITE)) return null; // externo
    h = h.slice(SITE.length) || '/';
  }
  if (!h.startsWith('/')) return null;
  // quitar query/hash
  h = h.split('?')[0].split('#')[0];
  if (h === '/' || h === '') return path.join(DIST, 'index.html');

  // /foo/ -> dist/foo/index.html o dist/foo.html
  const clean = h.replace(/^\/|\/$/g, '');
  const asDir = path.join(DIST, clean, 'index.html');
  const asFile = path.join(DIST, clean + '.html');
  const asExact = path.join(DIST, clean);
  if (fs.existsSync(asDir)) return asDir;
  if (fs.existsSync(asFile)) return asFile;
  if (fs.existsSync(asExact) && fs.statSync(asExact).isFile()) return asExact;
  return false; // missing
}

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');

  const broken = [];
  let checked = 0;
  let files = 0;

  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue;
        walk(full);
      } else if (/\.html$/i.test(e.name)) {
        files++;
        const html = fs.readFileSync(full, 'utf8');
        const re = /href=["']([^"']+)["']/gi;
        let m;
        while ((m = re.exec(html))) {
          const href = m[1];
          const resolved = resolvePath(href);
          if (resolved === null) continue; // externo o ancla
          checked++;
          if (resolved === false) {
            broken.push(`${path.relative(DIST, full)} → ${href}`);
          }
        }
      }
    }
  }

  walk(DIST);

  // También comprobar data-guide-food del selector (home)
  const index = path.join(DIST, 'index.html');
  if (fs.existsSync(index)) {
    const html = fs.readFileSync(index, 'utf8');
    const foods = [...html.matchAll(/data-guide-food="([^"]+)"/g)].map((x) => x[1]);
    const moments = [...html.matchAll(/data-guide-food-moment="([^"]+)"/g)].map((x) => x[1]);
    const cities = [...html.matchAll(/data-guide-city="([^"]+)"/g)].map((x) => x[1]);

    // Para cada par food+moment del selector, debe existir en al menos 1 ciudad
    for (let i = 0; i < foods.length; i++) {
      const food = foods[i];
      const moment = moments[i];
      if (!moment) continue;
      let ok = false;
      for (const city of cities) {
        const p = path.join(DIST, city, moment, food, 'index.html');
        if (fs.existsSync(p)) {
          ok = true;
          break;
        }
      }
      if (!ok) broken.push(`selector: /{ciudad}/${moment}/${food}/ no existe en ninguna ciudad`);
    }

    // Muestreo: cada ciudad del selector × cada moment × primer food de ese moment
    const foodsByMoment = {};
    for (let i = 0; i < foods.length; i++) {
      const m = moments[i];
      if (!foodsByMoment[m]) foodsByMoment[m] = [];
      foodsByMoment[m].push(foods[i]);
    }
    for (const city of cities) {
      for (const [moment, list] of Object.entries(foodsByMoment)) {
        for (const food of list) {
          const p = path.join(DIST, city, moment, food, 'index.html');
          if (!fs.existsSync(p)) {
            broken.push(`falta: /${city}/${moment}/${food}/`);
          }
        }
      }
    }
  }

  if (broken.length) {
    const unique = [...new Set(broken)];
    throw new Error(
      `ENLACES ROTOS: ${unique.length}. Ejemplos: ${unique.slice(0, 15).join(' | ')}`
    );
  }

  console.log(
    `[verify-internal-links] OK: ${files} HTML, ${checked} enlaces internos, 0 rotos.`
  );
}

if (require.main === module) run();
module.exports = { run };
