const fs = require('fs');

const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const vocabKeys = Object.keys(palabrasData.palabras);

function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
}

const lines = rawText.split('\n');
const arrowRegex = /\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|~>|~\*|~»|—>|—>•|—\*>|—»|—\*)\s*/;

const dashEntries = [];
lines.forEach((l, idx) => {
    const line = l.trim();
    if (!arrowRegex.test(line) && line.includes('—')) {
        const parts = line.split('—');
        const first = parts[0].trim();
        if (first.length > 2 && (vocabKeys.some(k => normalizar(k) === normalizar(first)) || first === first.toUpperCase())) {
            dashEntries.push({
                line: idx,
                first: first,
                full: line
            });
        }
    }
});

console.log("Entradas con guión largo inicial:", dashEntries);
