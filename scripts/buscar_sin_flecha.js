const fs = require('fs');

const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
let content = rawText.substring(startIdx);
const endIdx = content.indexOf("SIGLAS DE LOS COLABORADORES");
if (endIdx !== -1) content = content.substring(0, endIdx);

const lines = content.split('\n');
const arrowRegex = /\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|~>|~\*|~»|—>|—>•|—\*>|—»|—\*)\s*/;

const linesWithoutArrow = [];
for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l || l.startsWith('=== PÁGINA') || l.match(/^85\d$/) || l.match(/^86\d$/) || l.match(/^ÍNDICE/i) || l.includes('no complementan lo tratado') || l.includes('índice de artículo')) {
        continue;
    }
    if (!arrowRegex.test(l) && !l.startsWith('—') && !l.startsWith('-')) {
        linesWithoutArrow.push({
            lineNum: i,
            text: l
        });
    }
}

console.log(`Líneas que inician sin flecha: ${linesWithoutArrow.length}`);
console.log(linesWithoutArrow.slice(0, 30));
