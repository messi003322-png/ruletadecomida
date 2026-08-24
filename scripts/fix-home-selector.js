/**
 * Selector de guía en 3 pasos:
 * 1) Momento → 2) 20 comidas de ese momento → 3) Ciudad (con buscador)
 * Ver guía → /{ciudad}/{momento}/{comida}/
 */
const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'dist', 'index.html');

const MOMENTS = [
  ['desayuno', 'Desayuno'],
  ['almuerzo', 'Almuerzo'],
  ['merienda', 'Merienda'],
  ['cena', 'Cena']
];

const FOODS_BY_MOMENT = {
  desayuno: [
    'Tostadas con tomate','Huevos revueltos','Yogur con fruta','Avena con frutos secos','Café con bollería',
    'Churros o porras','Tostada de aguacate','Zumo y tostada integral','Tortilla francesa','Bowl de fruta',
    'Porridge de avena','Croissant','Bocadillo de jamón','Pan con aceite','Smoothie verde',
    'Crepes dulces','Queso fresco con miel','Cereal con leche','Tostada integral','Café solo'
  ],
  almuerzo: [
    'Menú del día casero','Ensalada completa','Pasta al pesto','Bocadillo contundente','Arroz con verduras',
    'Tortilla de patatas','Pollo a la plancha','Lentejas express','Wrap de pollo','Gazpacho',
    'Paella de verduras','Macarrones con tomate','Arroz con pollo','Garbanzos con espinacas','Filete con ensalada',
    'Pasta boloñesa','Crema de verduras','Burrito de pollo','Ensalada de pasta','Croquetas con ensalada'
  ],
  merienda: [
    'Yogur con fruta','Tostada con mermelada','Café y galleta','Batido de plátano','Frutos secos',
    'Chocolate a la taza','Sándwich vegetal','Zumo y magdalena','Pieza de fruta','Bizcocho casero',
    'Tostada con aceite','Helado','Churros','Galletas con leche','Batido de cacao',
    'Hummus con pan','Queso y pan','Smoothie de frutos rojos','Barrita de cereales','Café con leche'
  ],
  cena: [
    'Pasta cremosa','Tacos de pollo','Ramen de miso','Tortilla de patatas','Salmón a la plancha',
    'Pizza de sartén','Arroz frito','Quesadillas','Ensalada de garbanzos','Crema de calabaza',
    'Hamburguesa casera','Noodles salteados','Wrap de pollo','Sopa de tomate','Pollo al ajillo',
    'Tortilla francesa','Ensalada César','Pasta al pesto','Pescado a la plancha','Revuelto de verduras'
  ]
};

const CITIES = [
  ['madrid','Madrid'],['barcelona','Barcelona'],['valencia','Valencia'],['sevilla','Sevilla'],['zaragoza','Zaragoza'],
  ['malaga','Málaga'],['murcia','Murcia'],['palma','Palma'],['las-palmas','Las Palmas'],['bilbao','Bilbao'],
  ['alicante','Alicante'],['cordoba','Córdoba'],['valladolid','Valladolid'],['vigo','Vigo'],['gijon','Gijón'],
  ['hospitalet','Hospitalet'],['vitoria','Vitoria'],['coruna','A Coruña'],['elche','Elche'],['granada','Granada'],
  ['terrassa','Terrassa'],['badalona','Badalona'],['oviedo','Oviedo'],['sabadell','Sabadell'],['cartagena','Cartagena'],
  ['jerez','Jerez'],['mostoles','Móstoles'],['alcala-de-henares','Alcalá de Henares'],['fuenlabrada','Fuenlabrada'],
  ['leganes','Leganés'],['getafe','Getafe'],['alcorcon','Alcorcón'],['burgos','Burgos'],['santander','Santander'],
  ['logrono','Logroño'],['badajoz','Badajoz'],['huelva','Huelva'],['salamanca','Salamanca'],['marbella','Marbella'],
  ['lleida','Lleida'],['dos-hermanas','Dos Hermanas'],['tarragona','Tarragona'],['torrejon-de-ardoz','Torrejón de Ardoz'],
  ['parla','Parla'],['mataro','Mataró'],['algeciras','Algeciras'],['santa-coloma','Santa Coloma'],['cadiz','Cádiz'],
  ['alcobendas','Alcobendas'],['ourense','Ourense'],['reus','Reus'],['telde','Telde'],['barakaldo','Barakaldo'],
  ['girona','Girona'],['roquetas-de-mar','Roquetas de Mar'],['santiago-de-compostela','Santiago de Compostela'],
  ['caceres','Cáceres'],['lorca','Lorca'],['coslada','Coslada'],['las-rozas','Las Rozas'],['san-fernando','San Fernando'],
  ['el-puerto-de-santa-maria','El Puerto de Santa María'],['san-sebastian-de-los-reyes','San Sebastián de los Reyes'],
  ['cornellat','Cornellà'],['melilla','Melilla'],['ceuta','Ceuta'],['pozo-alcon','Pozo Alcón'],['elgoibar','Elgoibar'],
  ['alza','Alza'],['las-arte','Las Arte'],['vinaros','Vinaròs'],['torrelavega','Torrelavega'],
  ['rivas-vaciamadrid','Rivas-Vaciamadrid'],['chiclana','Chiclana'],['torrent','Torrent'],['getxo','Getxo'],
  ['velez-malaga','Vélez-Málaga'],['gandia','Gandía'],['aviles','Avilés']
];

const slug = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const CSS = `<style id="rf-separated-guide-selector">
.rf-guide-picker{max-width:1180px;margin:28px auto 0;padding:0 16px 24px}
.rf-guide-step{background:#fff;border:1px solid #eadfd7;border-radius:22px;padding:20px;margin:14px 0;box-shadow:0 8px 24px rgba(0,0,0,.05)}
.rf-guide-step[hidden]{display:none!important}
.rf-guide-step-title{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:1.05rem}
.rf-guide-step-number{display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:50%;background:#fff0e5;color:#c2410c;font-weight:900}
.rf-guide-options{display:flex;flex-wrap:wrap;gap:8px;max-height:280px;overflow:auto}
.rf-guide-option{appearance:none;border:1px solid #e7ddd5;background:#fff;border-radius:999px;padding:9px 13px;font:700 14px/1.2 system-ui,sans-serif;color:#3d2e28;cursor:pointer}
.rf-guide-option:hover{border-color:#f97316}
.rf-guide-option.is-active{background:#fff0e5;border-color:#f97316;color:#c2410c}
.rf-guide-city-search{width:100%;box-sizing:border-box;border:1px solid #e7ddd5;border-radius:14px;padding:12px 14px;margin:0 0 12px;font:inherit}
.rf-guide-result{display:none;margin-top:16px;text-align:center}
.rf-guide-result.is-visible{display:block}
.rf-guide-result a{display:inline-block;background:#ef6c18;color:#fff;border-radius:999px;padding:12px 20px;font-weight:800;text-decoration:none}
@media(max-width:600px){.rf-guide-step{padding:16px;border-radius:18px}.rf-guide-option{font-size:13px;padding:9px 11px}.rf-guide-options{max-height:220px}}
</style>`;

function buildUI() {
  const momentButtons = MOMENTS.map(
    ([slugValue, name]) =>
      `<button class="rf-guide-option" type="button" data-guide-moment="${slugValue}">${name}</button>`
  ).join('');

  // todos los platos de todos los momentos; el JS filtra por data-moment
  const foodButtons = Object.entries(FOODS_BY_MOMENT)
    .map(([moment, foods]) =>
      foods
        .map((name) => {
          const s = slug(name);
          return `<button class="rf-guide-option" type="button" hidden data-guide-food="${s}" data-guide-food-moment="${moment}" data-guide-food-label="${esc(name)}">${esc(name)}</button>`;
        })
        .join('')
    )
    .join('');

  const cityButtons = CITIES.map(
    ([slugValue, name]) =>
      `<button class="rf-guide-option" type="button" data-guide-city="${slugValue}">${esc(name)}</button>`
  ).join('');

  return `<section class="rf-guide-picker" id="rfSeparatedGuidePicker" aria-label="Selector de guía">
  <div class="rf-guide-step" data-guide-step="moment">
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">1</span> Momento del día</h3>
    <div class="rf-guide-options">${momentButtons}</div>
  </div>
  <div class="rf-guide-step" data-guide-step="food" hidden>
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">2</span> Comida <span style="font-weight:500;color:#a8a29e;text-transform:none;font-size:.85rem">(20 platos del momento)</span></h3>
    <div class="rf-guide-options" id="rfGuideFoods">${foodButtons}</div>
  </div>
  <div class="rf-guide-step" data-guide-step="city" hidden>
    <h3 class="rf-guide-step-title"><span class="rf-guide-step-number">3</span> Ciudad</h3>
    <input class="rf-guide-city-search" id="rfGuideCitySearch" type="search" placeholder="Buscar ciudad…" autocomplete="off">
    <div class="rf-guide-options" id="rfGuideCities">${cityButtons}</div>
    <div class="rf-guide-result" id="rfGuideResult">
      <a id="rfGuideResultLink" href="#">Ver guía →</a>
      <p id="rfGuideResultHint" style="margin:.75rem 0 0;color:#78716c;font-size:.9rem"></p>
    </div>
  </div>
</section>`;
}

const SCRIPT = `<script id="rf-separated-guide-selector-js">
(function(){
  function init(){
    if (document.getElementById('rfSeparatedGuidePicker')) return;

    // Reemplazar el directorio antiguo si existe
    var old =
      document.getElementById('directorio') ||
      document.getElementById('dir-comidas') && document.getElementById('dir-comidas').closest('section');

    var host = old;
    if (!host) {
      // Insertar antes del footer o al final del main
      host = document.querySelector('footer, .rf-final-footer, #seo-map-ciudades');
      if (host) host = host.parentElement || host;
    }

    var wrap = document.createElement('div');
    wrap.innerHTML = ${JSON.stringify(buildUI())};
    var picker = wrap.firstElementChild;

    if (old) {
      old.replaceWith(picker);
    } else if (host) {
      host.appendChild(picker);
    } else {
      document.body.appendChild(picker);
    }

    var moment = null, food = null, city = null;
    var foodStep = picker.querySelector('[data-guide-step="food"]');
    var cityStep = picker.querySelector('[data-guide-step="city"]');
    var foodsBox = picker.querySelector('#rfGuideFoods');
    var result = picker.querySelector('#rfGuideResult');
    var link = picker.querySelector('#rfGuideResultLink');
    var hint = picker.querySelector('#rfGuideResultHint');

    function showFoodsFor(m) {
      foodsBox.querySelectorAll('[data-guide-food]').forEach(function(btn) {
        var match = btn.getAttribute('data-guide-food-moment') === m;
        btn.hidden = !match;
        btn.classList.remove('is-active');
      });
    }

    function update() {
      if (moment && food && city) {
        var href = '/' + city + '/' + moment + '/' + food + '/';
        link.href = href;
        link.textContent = 'Ver guía →';
        result.classList.add('is-visible');
        if (hint) {
          var foodLabel = (picker.querySelector('[data-guide-food].is-active') || {}).textContent || food;
          var cityLabel = (picker.querySelector('[data-guide-city].is-active') || {}).textContent || city;
          var momentLabel = (picker.querySelector('[data-guide-moment].is-active') || {}).textContent || moment;
          hint.textContent = momentLabel + ' · ' + foodLabel + ' · ' + cityLabel;
        }
      } else {
        result.classList.remove('is-visible');
        if (hint) hint.textContent = '';
      }
    }

    picker.addEventListener('click', function(e) {
      var b = e.target.closest('.rf-guide-option');
      if (!b) return;
      e.preventDefault();

      if (b.hasAttribute('data-guide-moment')) {
        moment = b.getAttribute('data-guide-moment');
        food = null;
        city = null;
        picker.querySelectorAll('[data-guide-moment]').forEach(function(x) {
          x.classList.toggle('is-active', x === b);
        });
        picker.querySelectorAll('[data-guide-food],[data-guide-city]').forEach(function(x) {
          x.classList.remove('is-active');
        });
        showFoodsFor(moment);
        foodStep.hidden = false;
        cityStep.hidden = true;
        update();
        foodStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      if (b.hasAttribute('data-guide-food')) {
        if (b.hidden) return;
        food = b.getAttribute('data-guide-food');
        city = null;
        picker.querySelectorAll('[data-guide-food]').forEach(function(x) {
          x.classList.toggle('is-active', x === b);
        });
        picker.querySelectorAll('[data-guide-city]').forEach(function(x) {
          x.classList.remove('is-active');
        });
        cityStep.hidden = false;
        update();
        cityStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      if (b.hasAttribute('data-guide-city')) {
        city = b.getAttribute('data-guide-city');
        picker.querySelectorAll('[data-guide-city]').forEach(function(x) {
          x.classList.toggle('is-active', x === b);
        });
        update();
      }
    });

    var search = picker.querySelector('#rfGuideCitySearch');
    if (search) {
      search.addEventListener('input', function() {
        var q = this.value.toLowerCase().trim();
        picker.querySelectorAll('[data-guide-city]').forEach(function(btn) {
          var text = btn.textContent.toLowerCase();
          var slug = (btn.getAttribute('data-guide-city') || '').toLowerCase();
          btn.style.display = (!q || text.indexOf(q) >= 0 || slug.indexOf(q) >= 0) ? '' : 'none';
        });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>`;

function run() {
  if (!fs.existsSync(INDEX)) return false;
  let html = fs.readFileSync(INDEX, 'utf8');

  // Quitar versiones previas rotas
  html = html.replace(/<style id="rf-separated-guide-selector">[\s\S]*?<\/style>/i, '');
  html = html.replace(/<script id="rf-separated-guide-selector-js">[\s\S]*?<\/script>/i, '');
  html = html.replace(/<section class="rf-guide-picker"[\s\S]*?<\/section>/i, '');

  const injection = CSS + SCRIPT;
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, injection + '</body>');
  } else {
    html += injection;
  }

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log('[fix-home-selector] Selector 1 Momento → 2 Comida (20) → 3 Ciudad OK');
  return true;
}

module.exports = { run };
if (require.main === module) run();
