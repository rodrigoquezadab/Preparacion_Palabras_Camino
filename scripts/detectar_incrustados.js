const fs = require('fs');

const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');

// Busquemos dónde hay palabras en MAYÚSCULAS incrustadas en el texto de referencias
// Por ejemplo: "Primicias i 3 DILUVIO -* Agua..." o "Promesas i JUSTICIA -> ..."
const regexIncrustado = /(?:^|[\.\s—\d])([A-ZÁÉÍÓÚÑ]{3,}(?:\s+[A-ZÁÉÍÓÚÑ\(\)\/\-]+)*)\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g;

let match;
const incrustados = [];
while ((match = regexIncrustado.exec(rawText)) !== null) {
    if (!['AT', 'NT', 'INT', 'SIGLAS', 'ÍNDICE'].includes(match[1].trim())) {
        incrustados.push({
            terminoMayus: match[1].trim(),
            pos: match.index,
            contexto: rawText.substring(Math.max(0, match.index - 30), Math.min(rawText.length, match.index + 80)).replace(/\n/g, ' ')
        });
    }
}

console.log(`Total entradas en mayúsculas detectadas con flecha: ${incrustados.length}`);
console.log("Muestra:", incrustados.slice(0, 15));
