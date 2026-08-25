const fs = require('fs');

const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

console.log("=== INSPECCIÓN DETALLADA DE CITAS CON OCR / FUSIÓN ===");

function checkCita(palabra, textoBuscado) {
  const p = data.palabras[palabra];
  if (!p) return;
  const content = p.contenido || '';
  const idx = content.indexOf(textoBuscado);
  if (idx !== -1) {
    console.log(`\n--- Palabra: ${palabra} ---`);
    console.log(content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + 120)));
  }
}

checkCita("Infierno", "Rom 10,e-10");
checkCita("Verdad", "2Cor 1,l8ss");
checkCita("Bien - Mal", "Gen 6,Sss");
checkCita("Casa", "2Sam 7,Sss");
checkCita("Casa", "Is 56,Sss");
checkCita("Jerusalén", "Jer 7,Sss");
checkCita("Trabajo", "Heb 2,Sss");
checkCita("Liberación - Libertad", "Rom 8,c3");
checkCita("Paciencia", "Heb 12,l s");
checkCita("Pecado", "Jer 2,l 1ss");
checkCita("Soberbia", "Mt 2,i3");
checkCita("Amor", "Gal 5,o.22");
checkCita("Altar", "Sal 26,o");
checkCita("Alma", "Sal 31,o");
