const fs=require('fs');
const path=require('path');
const OUT=path.join(process.cwd(),'dist');

const pillarPath = path.join(OUT, 'que-cenar-hoy', 'index.html');

if(fs.existsSync(pillarPath)){
  let html = fs.readFileSync(pillarPath, 'utf8');
  
  // Enhance the main content block for better semantic depth and keyword targeting
  const enhancedContent = `
    <h2>El método rápido para decidir qué cenar hoy</h2>
    <p>El cansancio después de todo el día suele ser el principal obstáculo para elegir la cena. En lugar de buscar recetas complicadas, aplica este filtro en 3 pasos:</p>
    <ol class="steps">
      <li><strong>Define tu tiempo:</strong> ¿Tienes 15 minutos (bocadillo, wrap, ensalada), 30 minutos (pasta, arroz salteado) o más de 30 minutos (horno, guisos)?</li>
      <li><strong>Revisa tu nevera:</strong> Construye el plato empezando por lo que ya tienes abierto o a punto de caducar.</li>
      <li><strong>Aplica la regla de tres:</strong> Elige una base (pan, pasta, arroz, patata), una proteína (huevo, atún, pollo, tofu) y algo verde.</li>
    </ol>
    
    <h2>Ideas de cenas rápidas y saludables</h2>
    <p>Una cena equilibrada no tiene por qué ser aburrida ni requerir horas en la cocina. Aquí tienes tres opciones infalibles que resuelven el problema de qué cenar hoy:</p>
    <ul>
      <li><strong>Tortilla francesa o revuelto:</strong> Versátil, económico y listo en 10 minutos. Puedes añadirle espinacas, champiñones, queso o restos de verduras.</li>
      <li><strong>Ensalada completa:</strong> Olvida la lechuga triste. Usa una base de garbanzos de bote, atún, tomate cherry, aguacate y un buen aliño.</li>
      <li><strong>Fajitas o wraps:</strong> Rellena una tortilla de trigo con tiras de pollo a la plancha, pimientos, cebolla y un toque de yogur natural o guacamole.</li>
    </ul>
  `;
  
  // Replace the generic "Ideas para probar" section with the enhanced content
  html = html.replace(/<h2>Ideas para probar<\/h2>[\s\S]*?(?=<h2>Preguntas frecuentes<\/h2>)/i, enhancedContent);
  
  fs.writeFileSync(pillarPath, html, 'utf8');
  console.log('Pillar content enhanced: que-cenar-hoy');
} else {
  console.log('Pillar page not found: que-cenar-hoy');
}
