/**
 * Verifica matriz ciudad × momento × comidas del momento.
 * (Cada momento tiene su propio set de ~20 comidas, no 78 globales.)
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const MOMENTS = ['desayuno', 'almuerzo', 'merienda', 'cena'];
const SKIP = new Set(['assets', 'css', 'js', 'images']);

function run() {
  if (!fs.existsSync(DIST)) throw new Error('dist no existe');

  const cityDirs = fs
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

  // foods canónicos por momento = unión de todas las ciudades
  const foodsByMoment = {};
  for (const m of MOMENTS) {
    const set = new Set();
    for (const city of cityDirs) {
      const d = path.join(DIST, city, m);
      if (!fs.existsSync(d)) continue;
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory() && fs.existsSync(path.join(d, e.name, 'index.html'))) {
          set.add(e.name);
        }
      }
    }
    foodsByMoment[m] = [...set].sort();
  }

  const bad = [];
  let guides = 0;

  for (const city of cityDirs) {
    for (const m of MOMENTS) {
      const expected = foodsByMoment[m];
      for (const food of expected) {
        const p = path.join(DIST, city, m, food, 'index.html');
        if (!fs.existsSync(p)) {
          bad.push(`falta ${city}/${m}/${food}/`);
        } else {
          guides++;
        }
      }
    }
  }

  if (bad.length) {
    throw new Error(
      `VERIFICACIÓN FALLIDA: ${bad.length} rutas faltantes. ${bad.slice(0, 12).join(' | ')}`
    );
  }

  console.log(
    `[verify-guide-routes] OK: ${guides} guías (` +
      `${cityDirs.length} ciudades × ` +
      MOMENTS.map((m) => `${m}:${foodsByMoment[m].length}`).join(' + ') +
      `)`
  );
}

if (require.main === module) run();
module.exports = { run };
