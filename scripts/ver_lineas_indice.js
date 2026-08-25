const fs = require('fs');

const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
const content = rawText.substring(startIdx);
const lines = content.split('\n');

console.log(`Total líneas: ${lines.length}`);
console.log("Muestra de líneas 10 a 60:");
for (let i = 10; i < 60; i++) {
    console.log(`${i}: ${lines[i]}`);
}
