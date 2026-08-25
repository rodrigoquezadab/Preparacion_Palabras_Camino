const fs = require('fs');

const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const vocabMap = new Map();
Object.keys(palabrasData.palabras).forEach(p => {
    vocabMap.set(normalizar(p), p);
});

// Palabras del precatecumenado con número
const precatMap = new Map();
for (const [key, val] of Object.entries(palabrasData.palabras)) {
    if (val.numPrecat || val.num) {
        precatMap.set(normalizar(key), val.numPrecat || val.num);
    }
}

function normalizar(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function parsearLineaPorLinea() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    const content = rawText.substring(startIdx);

    // Cortar antes de las siglas de colaboradores
    const endIdx = content.indexOf("SIGLAS DE LOS COLABORADORES");
    const cleanContent = (endIdx !== -1) ? content.substring(0, endIdx) : content;

    const lines = cleanContent.split('\n');

    // Flechas posibles
    const arrowRegex = /\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/;

    const entries = [];
    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Ignorar cabeceras y números de página
        if (!line || line.startsWith('=== PÁGINA') || line.match(/^85\d$/) || line.match(/^86\d$/) || line.match(/^ÍNDICE/i) || line.includes('no complementan lo tratado') || line.includes('índice de artículo')) {
            continue;
        }

        // Caso especial si una línea contiene una entrada nueva incrustada (ej: "VOLUNTAD DE DIOS -* ...")
        if (line.includes('VOLUNTAD DE DIOS') && arrowRegex.test(line)) {
            const splitIdx = line.indexOf('VOLUNTAD DE DIOS');
            const prevPart = line.substring(0, splitIdx).trim();
            const newPart = line.substring(splitIdx).trim();

            if (currentEntry && prevPart) {
                currentEntry.rawReferences += ' ' + prevPart;
                entries.push(currentEntry);
            }
            const parts = newPart.split(arrowRegex);
            currentEntry = {
                termino: parts[0].trim(),
                rawReferences: parts.slice(1).join(' ').trim()
            };
            continue;
        }

        // Caso 1: La línea tiene una flecha "Termino -> Referencias..."
        if (arrowRegex.test(line)) {
            const parts = line.split(arrowRegex);
            const term = parts[0].replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim();
            const rest = parts.slice(1).join(' ').trim();

            if (term.length > 0) {
                if (currentEntry) {
                    entries.push(currentEntry);
                }
                currentEntry = {
                    termino: term,
                    rawReferences: rest
                };
                continue;
            }
        }

        // Caso 2: La línea es un artículo en MAYÚSCULAS sin flecha (ej: "ADÁN")
        const isAllUpper = line === line.toUpperCase() && line.length >= 3 && !line.match(/^[0-9\.\s—]+$/) && !['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(line);
        if (isAllUpper && vocabMap.has(normalizar(line))) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            currentEntry = {
                termino: line,
                rawReferences: ""
            };
            continue;
        }

        // Caso 3: Es una línea de continuación de las referencias de currentEntry
        if (currentEntry) {
            if (currentEntry.rawReferences.endsWith('-')) {
                currentEntry.rawReferences = currentEntry.rawReferences.slice(0, -1) + line;
            } else {
                currentEntry.rawReferences += ' ' + line;
            }
        }
    }

    if (currentEntry) {
        entries.push(currentEntry);
    }

    console.log(`Total de entradas procesadas: ${entries.length}`);

    // Procesar y limpiar cada entrada
    const resultado = entries.map((e, idx) => {
        let term = e.termino.trim();

        // Correcciones OCR conocidas en términos del índice
        if (term.toLowerCase() === 'acubar') term = 'Acabar';
        if (term.toLowerCase() === 'aflicción') term = 'Aflicción';

        const normTerm = normalizar(term);
        const existeEnVocab = vocabMap.has(normTerm);
        const palabraOficial = existeEnVocab ? vocabMap.get(normTerm) : null;
        const numPrecat = precatMap.get(normTerm) || null;

        // Limpiar referencias separadas por ' — ' o ' - '
        const rawRefText = e.rawReferences
            .replace(/—/g, ' — ')
            .replace(/\s+/g, ' ');

        const rawList = rawRefText.split(' — ')
            .map(r => r.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim())
            .filter(r => r.length > 0);

        // Identificar palabras clave del vocabulario a las que apunta
        const vocabRefs = [];
        rawList.forEach(r => {
            const words = r.split(' ');
            for (let len = words.length; len >= 1; len--) {
                const candidate = words.slice(0, len).join(' ').replace(/[\d\.\(\)]/g, '').trim();
                const norm = normalizar(candidate);
                if (vocabMap.has(norm)) {
                    vocabRefs.push(vocabMap.get(norm));
                    break;
                }
            }
        });

        return {
            id: idx + 1,
            termino: term,
            terminoNorm: normTerm,
            tipo: existeEnVocab ? 'ARTICULO_PRINCIPAL' : 'REMISION_SINONIMO',
            palabraOficialVocabulario: palabraOficial,
            numPrecat: numPrecat,
            referenciasRaw: rawList,
            referenciasVocabulario: Array.from(new Set(vocabRefs))
        };
    });

    fs.writeFileSync('scripts/indice_completo_final.json', JSON.stringify(resultado, null, 2));

    console.log(`\n=== ESTADÍSTICAS FINALES DEL ÍNDICE (PÁGINAS 850 A 869) ===`);
    const articulos = resultado.filter(r => r.tipo === 'ARTICULO_PRINCIPAL');
    const remisiones = resultado.filter(r => r.tipo === 'REMISION_SINONIMO');
    console.log(`- Artículos Principales (con tema propio en el Vocabulario): ${articulos.length}`);
    console.log(`- Remisiones / Sinónimos / Términos de búsqueda relacionados: ${remisiones.length}`);
    console.log(`- Total de términos cubiertos en el índice: ${resultado.length}`);
    console.log(`- Primera entrada: ${resultado[0].termino}`);
    console.log(`- Última entrada: ${resultado[resultado.length - 1].termino} -> ${resultado[resultado.length - 1].referenciasVocabulario.join(', ')}`);

    return resultado;
}

parsearLineaPorLinea();
