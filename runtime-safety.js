const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'dist');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.toLowerCase().endsWith('.html')) fix(full);
  }
}

function fix(file) {
  let text = fs.readFileSync(file, 'utf8');

  // Repair the known malformed path.replace variants that can make an inline
  // script fail to parse and leave the home view blank.
  const replacements = [
    ["path.replace(/\\/g,'/')", "path.replace(/\\//g,'/')"],
    ["path.replace(/\\/g, '/')", "path.replace(/\\//g, '/')"],
    ['path.replace(/\\/g,"/")', 'path.replace(/\\//g,"/")'],
    ['path.replace(/\\/g, "/")', 'path.replace(/\\//g, "/")']
  ];
  for (const [bad, good] of replacements) text = text.split(bad).join(good);

  const safety = `<script id="ruleta-runtime-safety">
(function(){
  function showHome(){
    var home=document.getElementById('view-home');
    if(!home) return;
    home.removeAttribute('hidden');
    home.classList.remove('hidden');
    home.style.setProperty('display','block','important');
    home.style.setProperty('visibility','visible','important');
    home.style.setProperty('opacity','1','important');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',showHome,{once:true});
  else showHome();
  window.addEventListener('error',function(){showHome();});
  setTimeout(showHome,0);
  setTimeout(showHome,250);
})();
</script>`;

  if (!text.includes('id="ruleta-runtime-safety"')) {
    if (text.includes('</body>')) text = text.replace('</body>', safety + '\n</body>');
    else text += '\n' + safety;
  }

  fs.writeFileSync(file, text);
}

if (fs.existsSync(OUT)) {
  walk(OUT);
  console.log('Runtime safety applied to generated HTML.');
} else {
  console.log('No dist directory found; runtime safety skipped.');
}
