/**
 * Guías de COMIDA real (pizza, sushi…).
 * NO aplica plantilla "Dónde comer" a temas (no sé qué cenar, cena rápida…).
 */
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SKIP = new Set(['assets', 'css', 'js', 'images']);

const NON_FOOD = new Set([
  'comida barata',
  'cena rapida',
  'que cenar hoy',
  'no se que cenar',
  'comida saludable',
  'comida sana',
  'comida rapida',
  'comida para llevar',
  'comida casera',
  'cena facil',
  'cenas baratas',
  'cenas rapidas',
  'comida facil',
  'ideas para cenar',
  'ideas de comida',
  'no se que comer',
  'que comer hoy'
]);

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function norm(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

const TYPES = [
  { keys: ['pizza'], tag: 'pizzería', intro: 'En una pizza el resultado depende de la masa, el horno y el equilibrio de la cobertura.', heads: [['Masa y fermentación', 'Comprueba si la masa tiene elaboración definida y si el borde y la base corresponden al estilo anunciado.'], ['Horno y acabado', 'El horneado debe cocinar la base y fundir la cobertura sin resecarla.'], ['Cobertura', 'Importa la calidad del tomate, el queso y los toppings, no la cantidad de ingredientes.'], ['Reseñas útiles', 'Busca comentarios recientes sobre masa, temperatura y tiempos.']] },
  { keys: ['sushi'], tag: 'restaurante japonés', intro: 'El sushi se elige por producto y técnica: arroz, temperatura y proporción de cada pieza.', heads: [['Arroz', 'Debe mantener la forma sin quedar apelmazado.'], ['Pescado', 'Prioriza información de frescura y conservación.'], ['Piezas', 'Nigiri, maki y sashimi se valoran de forma distinta.'], ['Carta', 'Una carta clara ayuda a elegir según experiencia y apetito.']] },
  { keys: ['hamburguesa', 'burger'], tag: 'hamburguesería', intro: 'Una hamburguesa funciona cuando carne, pan y complementos están proporcionados.', heads: [['Carne', 'Mira el tipo de carne y el punto de cocción.'], ['Pan', 'Debe soportar jugos y salsas sin deshacerse.'], ['Salsas', 'Deben aportar contraste, no tapar el sabor.'], ['Acompañamiento', 'Valora si patatas o ensalada justifican el precio total.']] },
  { keys: ['pasta', 'espagueti', 'macarron', 'lasaña', 'ravioli'], tag: 'restaurante italiano', intro: 'En la pasta importan la cocción, la salsa y el equilibrio con los ingredientes.', heads: [['Cocción', 'La textura debe corresponder al tipo de pasta.'], ['Salsa', 'Debe integrarse con el formato sin empaparlo de más.'], ['Producto', 'Queso, tomate, carne o verduras deben aportar sabor reconocible.'], ['Estilo', 'Carbonara, pesto o boloñesa ofrecen perfiles muy distintos.']] },
  { keys: ['pizza'], tag: 'pizzería', intro: 'Masa, horno y cobertura definen una buena pizza.', heads: [['Masa', 'Busca textura y aroma propios.'], ['Horno', 'Base cocida y cobertura integrada.'], ['Cobertura', 'Menos es más si el producto es bueno.'], ['Opiniones', 'Prioriza reseñas recientes y concretas.']] }
];

function profile(food) {
  const n = norm(food);
  for (const t of TYPES) {
    if (t.keys.some((k) => n.includes(norm(k)))) return t;
  }
  return null;
}

const generic = [
  ['Materia prima', 'Busca información concreta sobre los ingredientes principales de __FOOD__ y cómo se preparan.'],
  ['Cómo se prepara', 'Fíjate en la técnica del establecimiento y en si coincide con el estilo que te apetece.'],
  ['Qué mirar en las opiniones', 'Prioriza reseñas recientes sobre sabor, cantidades y tiempos.'],
  ['Precio con contexto', 'Compara elaboración, cantidad y calidad antes de decidir.'],
  ['Elige según tu plan', 'Ten en cuenta ubicación, horarios y si buscas algo rápido o más pausado.']
];

function run() {
  if (!fs.existsSync(DIST)) return;
  let changed = 0;
  let skipped = 0;

  function walk(dir, parts = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
        walk(f, parts.concat(e.name));
      } else if (parts.length === 1 && e.name === 'index.html') {
        let html = fs.readFileSync(f, 'utf8');
        const h = html.match(/<h1[^>]*>\s*Dónde comer\s+([^<]+)<\/h1>/i);
        if (!h) continue;
        const food = h[1].trim();
        if (NON_FOOD.has(norm(food))) {
          skipped++;
          continue; // las reescribe unique-topic-guides
        }

        let p = profile(food);
        let sections;
        if (p) {
          const offset = hash(food) % p.heads.length;
          sections = Array.from({ length: p.heads.length }, (_, i) => p.heads[(i + offset) % p.heads.length]);
        } else {
          const base = generic.map(([title, t]) => [title, t.replace(/__FOOD__/g, food)]);
          const offset = hash(food) % base.length;
          sections = Array.from({ length: 4 }, (_, i) => base[(i + offset) % base.length]);
        }

        const intro = p
          ? p.intro
          : `Para decidir dónde comer ${food} conviene mirar preparación, producto y estilo de cocina.`;
        const tag = p ? p.tag : `establecimiento especializado en ${food}`;

        const block = `<section class="rf-food-guide"><div class="rf-food-guide-kicker">${esc(tag)}</div><h2>Cómo elegir un buen lugar donde comer ${esc(food)}</h2><p class="rf-food-guide-intro">${esc(intro)}</p><div class="rf-food-guide-grid">${sections.map(([a, b]) => `<article><h3>${esc(a)}</h3><p>${esc(b)}</p></article>`).join('')}</div><div class="rf-food-guide-check"><strong>🔎 En resumen</strong><p>Antes de elegir dónde comer ${esc(food)}, compara preparación, producto, opiniones y precio.</p></div></section>`;

        html = html.replace(/<section class="rf-food-guide">[\s\S]*?<\/section>/i, block);
        if (!/rf-food-guide/.test(html)) {
          html = html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1${block}`);
        }
        fs.writeFileSync(f, html, 'utf8');
        changed++;
      }
    }
  }

  walk(DIST);
  console.log(`[unique-food-guides] ${changed} comidas reales; ${skipped} temas saltados (van a unique-topic-guides).`);
}

if (require.main === module) run();
module.exports = { run };
