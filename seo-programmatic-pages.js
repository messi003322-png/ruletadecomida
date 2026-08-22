const fs = require('fs');
const path = require('path');
const OUT = path.join(process.cwd(), 'dist');
const SITE = 'https://www.ruletadecomida.es';

const CIUDADES = [
  ['madrid', 'Madrid'],
  ['barcelona', 'Barcelona'],
  ['valencia', 'Valencia'],
  ['sevilla', 'Sevilla'],
  ['zaragoza', 'Zaragoza'],
  ['malaga', 'Málaga'],
  ['murcia', 'Murcia'],
  ['palma', 'Palma'],
  ['bilbao', 'Bilbao'],
  ['alicante', 'Alicante']
];

const COMIDAS = [
  ['pizza', 'Pizza'],
  ['hamburguesa', 'Hamburguesas'],
  ['sushi', 'Sushi'],
  ['kebab', 'Kebab'],
  ['comida-china', 'Comida China']
];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

let generatedCount = 0;

for (const [slugCiudad, nombreCiudad] of CIUDADES) {
  for (const [slugComida, nombreComida] of COMIDAS) {
    const route = `${slugCiudad}/${slugComida}`;
    const url = `${SITE}/${route}/`;
    
    const title = `¿Qué cenar hoy en ${nombreCiudad}? 🎯 Ruleta de ${nombreComida}`;
    const desc = `¿Te apetece ${nombreComida} en ${nombreCiudad}? 🛵 Deja que la ruleta decida por ti o explora ideas rápidas. Opciones para pedir a domicilio o salir a cenar hoy mismo.`;
    
    const linksMismaCiudad = COMIDAS.filter(([slug]) => slug !== slugComida).map(([slug, nombre]) => `<a href="${SITE}/${slugCiudad}/${slug}/" class="rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm font-bold text-orange-700 hover:border-orange-300 hover:bg-orange-50">${esc(nombre)} en ${esc(nombreCiudad)}</a>`).join('');
    const linksMismaComida = CIUDADES.filter(([slug]) => slug !== slugCiudad).slice(0, 5).map(([slug, nombre]) => `<a href="${SITE}/${slug}/${slugComida}/" class="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-bold text-stone-700 hover:border-orange-300 hover:text-orange-700">${esc(nombre)}</a>`).join('');

    const content = `
      <p class="text-lg text-stone-600">¿No sabes qué cenar hoy en <strong>${esc(nombreCiudad)}</strong>? Olvídate de pasar horas revisando aplicaciones de reparto o discutiendo qué pedir. Si te apetece <strong>${esc(nombreComida)}</strong>, nuestra ruleta está diseñada para resolver tu indecisión en segundos.</p>
      
      <h2 class="mt-8 text-2xl font-bold text-stone-800">Cenar ${esc(nombreComida)} en ${esc(nombreCiudad)}</h2>
      <p class="mt-4 text-stone-600">Ya sea que busques opciones para una cena rápida de viernes por la noche o ideas para pedir a domicilio un domingo por la tarde, te ayudamos a decidir sin complicaciones. Puedes girar la ruleta para obtener una propuesta aleatoria o explorar directamente opciones locales.</p>
      
      <div class="mt-8 rounded-2xl bg-orange-50 p-6 border-l-4 border-orange-600">
        <h3 class="text-lg font-bold text-orange-900 mb-4">Encuentra opciones abiertas ahora</h3>
        <div class="flex flex-col gap-3">
          <a href="https://www.google.com/maps/search/${encodeURIComponent(nombreComida)}+en+${encodeURIComponent(nombreCiudad)}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-stone-700 shadow-sm transition-transform hover:-translate-y-0.5 border border-orange-200">
            🔍 Ver restaurantes de ${esc(nombreComida)} en Google Maps
          </a>
          <a href="https://glovoapp.com/es/es/${slugCiudad}/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 rounded-xl bg-[#00A082] px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5">
            🛵 Buscar opciones de entrega en Glovo
          </a>
          <a href="https://wa.me/?text=${encodeURIComponent(`¡Me ha salido ${nombreComida} en la Ruleta de Comida de ${nombreCiudad}! ¿Pedimos esto hoy? Mira aquí: ${url}`)}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5">
            📲 Compartir idea por WhatsApp
          </a>
        </div>
      </div>
      
      <section class="mt-10 border-t border-stone-100 pt-8">
        <h2 class="text-xl font-black text-stone-800">Más ideas para cenar en ${esc(nombreCiudad)}</h2>
        <div class="mt-4 grid gap-2 sm:grid-cols-2">${linksMismaCiudad}</div>
      </section>
      <section class="mt-8 border-t border-stone-100 pt-8">
        <h2 class="text-xl font-black text-stone-800">${esc(nombreComida)} en otras ciudades</h2>
        <div class="mt-4 flex flex-wrap gap-2">${linksMismaComida}</div>
      </section>
      <div class="mt-10 text-center">
        <p class="mb-4 text-stone-600 font-medium">¿Has cambiado de idea?</p>
        <a href="${SITE}/" class="inline-block rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5">🎯 Girar la ruleta de nuevo</a>
      </div>
    `;

    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
    ${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': `Ruleta de ${nombreComida} en ${nombreCiudad}`,
      'url': url,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires HTML5 and JavaScript'
    })}
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#fafaf9] text-stone-800">
  <header class="sticky top-0 z-50 border-b border-orange-200 bg-white/90 backdrop-blur-md">
    <div class="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
      <a href="${SITE}/" class="font-black text-xl tracking-tight text-stone-900 flex items-center gap-2">
        <span class="text-2xl">🎯</span> Ruleta de Comida
      </a>
      <nav class="flex gap-4 text-sm font-bold text-stone-600">
        <a href="${SITE}/que-cenar-hoy/" class="hover:text-orange-600">Qué cenar</a>
        <a href="${SITE}/" class="hover:text-orange-600">Inicio</a>
      </nav>
    </div>
  </header>
  
  <main class="mx-auto max-w-2xl px-4 py-12">
    <nav class="mb-8 flex flex-wrap gap-2 text-sm font-medium text-stone-500">
      <a href="${SITE}/" class="hover:text-orange-600">Inicio</a> &rsaquo;
      <a href="${SITE}/${slugCiudad}/" class="hover:text-orange-600 capitalize">${esc(nombreCiudad)}</a> &rsaquo;
      <span class="text-stone-800 capitalize">${esc(nombreComida)}</span>
    </nav>
    
    <article class="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
      <h1 class="mb-6 text-3xl sm:text-4xl font-black tracking-tight text-stone-900 leading-tight">
        ¿Qué cenar hoy en <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">${esc(nombreCiudad)}</span>?
      </h1>
      ${content}
    </article>
  </main>
</body>
</html>`;

    const dir = path.join(OUT, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    generatedCount++;
  }
}

const hubSections = CIUDADES.map(([slugCiudad, nombreCiudad]) => `
  <section class="city">
    <h2>Qué cenar en ${esc(nombreCiudad)}</h2>
    <div class="links">${COMIDAS.map(([slugComida, nombreComida]) => `<a href="${SITE}/${slugCiudad}/${slugComida}/">${esc(nombreComida)} en ${esc(nombreCiudad)}</a>`).join('')}</div>
  </section>`).join('');

const hubHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Qué cenar por ciudad: pizza, sushi, hamburguesa y más | Ruleta de Comida</title>
  <meta name="description" content="Explora ideas para cenar por ciudad en España: pizza, hamburguesas, sushi, kebab y comida china en Madrid, Barcelona, Valencia, Sevilla y más.">
  <link rel="canonical" href="${SITE}/comidas-por-ciudad/">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage','name':'Comidas por ciudad','url':`${SITE}/comidas-por-ciudad/`})}</script>
  <style>
    :root{--orange:#e85d04;--ink:#1c1917;--muted:#57534e;--line:#e7e5e4}*{box-sizing:border-box}body{margin:0;background:#fafaf9;color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}main{max-width:1080px;margin:auto;padding:28px 18px 70px}nav{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px}nav a{padding:10px 14px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);text-decoration:none;font-weight:700}header{max-width:760px;margin:0 auto 38px;text-align:center}header p:first-child{color:var(--orange);font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{font-size:clamp(2rem,5vw,3.3rem);line-height:1.06;letter-spacing:-.035em;margin:8px 0 14px}header p:last-child{color:var(--muted);font-size:1.05rem;line-height:1.65}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.city{padding:22px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 8px 22px rgba(28,25,23,.05)}h2{margin:0 0 14px;font-size:1.2rem}.links{display:grid;gap:8px}.links a{padding:10px 12px;border-radius:11px;background:#fff7ed;color:#a93f00;font-size:.92rem;font-weight:700;text-decoration:none}.links a:hover{background:#ffead4}@media(max-width:700px){.grid{grid-template-columns:1fr}main{padding:22px 14px 54px}}
  </style>
</head>
<body>
  <main>
    <nav><a href="${SITE}/">🎲 Ruleta de Comida</a><a href="${SITE}/que-cenar-hoy/">Qué cenar hoy</a><a href="${SITE}/guia-completa-de-comidas/">Guía completa</a></nav>
    <header><p>Ideas locales</p><h1>¿Qué cenar hoy? Explora por ciudad y antojo</h1><p>Accede a ideas de pizza, hamburguesas, sushi, kebab y comida china en las principales ciudades. Elige una combinación o vuelve a la ruleta si prefieres que decida por ti.</p></header>
    <section class="grid">${hubSections}</section>
  </main>
</body>
</html>`;

const hubDir = path.join(OUT, 'comidas-por-ciudad');
fs.mkdirSync(hubDir, { recursive: true });
fs.writeFileSync(path.join(hubDir, 'index.html'), hubHtml, 'utf8');

console.log(`Páginas programáticas generadas: ${generatedCount} (Capa 2: Ciudad + Comida) y un índice de exploración.`);
