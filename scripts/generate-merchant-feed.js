/**
 * Google Merchant Center Feed Generator
 * Ruleta de Comida — servicios gratuitos (precio 0.00 EUR)
 * Ejecutar: node scripts/generate-merchant-feed.js
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.ruletadecomida.es';
const BRAND = 'Ruleta de Comida';
const IMAGE = `${BASE}/android-chrome-512x512.png`;

const CITIES = [
  { slug: 'madrid', name: 'Madrid' },
  { slug: 'barcelona', name: 'Barcelona' },
  { slug: 'valencia', name: 'Valencia' },
  { slug: 'sevilla', name: 'Sevilla' },
  { slug: 'zaragoza', name: 'Zaragoza' },
  { slug: 'malaga', name: 'Málaga' },
  { slug: 'murcia', name: 'Murcia' },
  { slug: 'palma', name: 'Palma' },
  { slug: 'las-palmas', name: 'Las Palmas' },
  { slug: 'bilbao', name: 'Bilbao' },
  { slug: 'alicante', name: 'Alicante' },
  { slug: 'cordoba', name: 'Córdoba' },
  { slug: 'valladolid', name: 'Valladolid' },
  { slug: 'vigo', name: 'Vigo' },
  { slug: 'gijon', name: 'Gijón' },
  { slug: 'granada', name: 'Granada' },
  { slug: 'oviedo', name: 'Oviedo' },
  { slug: 'badalona', name: 'Badalona' },
  { slug: 'cartagena', name: 'Cartagena' },
  { slug: 'jerez', name: 'Jerez' },
  { slug: 'mostoles', name: 'Móstoles' },
  { slug: 'pamplona', name: 'Pamplona' },
  { slug: 'almeria', name: 'Almería' },
  { slug: 'fuenlabrada', name: 'Fuenlabrada' },
  { slug: 'leganes', name: 'Leganés' },
  { slug: 'santander', name: 'Santander' },
  { slug: 'burgos', name: 'Burgos' },
  { slug: 'alcorcon', name: 'Alcorcón' },
  { slug: 'getafe', name: 'Getafe' },
  { slug: 'salamanca', name: 'Salamanca' },
  { slug: 'huelva', name: 'Huelva' },
  { slug: 'logrono', name: 'Logroño' },
  { slug: 'badajoz', name: 'Badajoz' },
  { slug: 'leon', name: 'León' },
  { slug: 'tarragona', name: 'Tarragona' },
  { slug: 'cadiz', name: 'Cádiz' },
  { slug: 'lleida', name: 'Lleida' },
  { slug: 'marbella', name: 'Marbella' },
  { slug: 'mataro', name: 'Mataró' },
  { slug: 'ourense', name: 'Ourense' },
  { slug: 'girona', name: 'Girona' },
  { slug: 'aviles', name: 'Avilés' },
  { slug: 'barakaldo', name: 'Barakaldo' },
  { slug: 'alcala-de-henares', name: 'Alcalá de Henares' },
  { slug: 'ceuta', name: 'Ceuta' },
  { slug: 'melilla', name: 'Melilla' }
];

const FOODS = [
  { slug: 'pizza', name: 'Pizza' },
  { slug: 'hamburguesa', name: 'Hamburguesa' },
  { slug: 'sushi', name: 'Sushi' },
  { slug: 'kebab', name: 'Kebab' },
  { slug: 'tacos', name: 'Tacos' },
  { slug: 'burritos', name: 'Burritos' },
  { slug: 'pasta', name: 'Pasta' },
  { slug: 'ramen', name: 'Ramen' },
  { slug: 'comida-china', name: 'Comida china' },
  { slug: 'paella', name: 'Paella' },
  { slug: 'tapas', name: 'Tapas' }
];

function product({ id, title, description, link }) {
  return {
    id,
    title,
    description,
    link,
    image_link: IMAGE,
    availability: 'in_stock',
    price: '0.00 EUR',
    brand: BRAND,
    condition: 'new',
    product_type: 'Servicio gratuito > Ruleta de comida',
    shipping: { country: 'ES', price: '0.00 EUR' }
  };
}

const products = [];

for (const city of CITIES) {
  products.push(product({
    id: `ruleta_${city.slug}`,
    title: `¿Qué cenar hoy en ${city.name}? | Ruleta de Comida`,
    description: `Gira la ruleta y decide qué cenar en ${city.name} en 3 segundos. Opciones rápidas, baratas y realistas. Sin registro.`,
    link: `${BASE}/${city.slug}/`
  }));
}

const TOP = CITIES.slice(0, 20);
for (const city of TOP) {
  for (const food of FOODS) {
    products.push(product({
      id: `ruleta_${city.slug}_${food.slug}`,
      title: `Ruleta de ${food.name} en ${city.name} - Decide tu cena hoy`,
      description: `Filtra las mejores opciones de ${food.name.toLowerCase()} en ${city.name}. Gira la ruleta y pide en segundos.`,
      link: `${BASE}/${city.slug}/${food.slug}/`
    }));
  }
}

const INTENT = [
  { slug: 'cena-rapida', title: 'Cena rápida en menos de 15 minutos', desc: 'Ideas de cena realistas listas en menos de 15 minutos.' },
  { slug: 'comida-barata', title: 'Comida barata por menos de 3€', desc: 'Platos sencillos y baratos. Decide qué cenar sin gastar de más.' },
  { slug: 'que-cenar-hoy', title: '¿Qué cenar hoy? Respuesta en 3 segundos', desc: 'Deja de perder tiempo. Gira la ruleta y elige tu menú de esta noche.' },
  { slug: 'no-se-que-cenar', title: 'No sé qué cenar - Ruleta de ideas', desc: 'Sal del bloqueo mental. Una idea concreta de cena en segundos.' }
];

for (const item of INTENT) {
  products.push(product({
    id: `ruleta_${item.slug}`,
    title: item.title,
    description: item.desc,
    link: `${BASE}/${item.slug}/`
  }));
}

const out = path.join(__dirname, '..', 'merchant-center-products.json');
fs.writeFileSync(out, JSON.stringify(products, null, 2));
console.log(`✅ ${products.length} productos generados → ${out}`);
