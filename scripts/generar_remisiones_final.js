const fs = require('fs');

const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const vocabMap = new Map();
Object.keys(palabrasData.palabras).forEach(p => {
    vocabMap.set(normalizar(p), p);
});

function normalizar(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function parsearLineaPorLineaFinal() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    const endIdx = content.indexOf("SIGLAS DE LOS COLABORADORES");
    if (endIdx !== -1) content = content.substring(0, endIdx);

    const lines = content.split('\n');

    // Patrón de flecha universal para capturar todas las variantes del OCR:
    // ->, -»•, -» , -*•, -* , ->•, ->-, -+, ~>, ~*, ~», —>, —>•, —*>, —», —*, ->-, etc.
    const arrowRegex = /\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|~>|~\*|~»|—>|—>•|—\*>|—»|—\*)\s*/;

    const entries = [];
    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line || line.startsWith('=== PÁGINA') || line.match(/^85\d$/) || line.match(/^86\d$/) || line.match(/^ÍNDICE/i) || line.includes('no complementan lo tratado') || line.includes('índice de artículo')) {
            continue;
        }

        // Si la línea tiene flecha
        if (arrowRegex.test(line)) {
            const parts = line.split(arrowRegex);
            const term = parts[0].replace(/^[•\-\*\—\s\.\d~]+|[•\-\*\—\s\.\d~]+$/g, '').trim();
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

        // Si la línea es un término en MAYÚSCULAS sin flecha en esta línea (la flecha o referencias vienen en la siguiente)
        const isUpper = line === line.toUpperCase() && line.length >= 3 && !line.match(/^[0-9\.\s—]+$/) && !['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(line);
        if (isUpper && vocabMap.has(normalizar(line))) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            currentEntry = {
                termino: line,
                rawReferences: ""
            };
            continue;
        }

        // Línea de continuación
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

    // Procesar y generar resultado
    const mapaRemisiones = {};
    const mapaAliasPorPalabra = {};
    const mapaTemasConexos = {};

    entries.forEach((e, idx) => {
        let term = e.termino.trim();
        if (term.toLowerCase() === 'acubar') term = 'Acabar';

        const normTerm = normalizar(term);
        const existeEnVocab = vocabMap.has(normTerm);
        const palabraOficial = existeEnVocab ? vocabMap.get(normTerm) : null;

        // Limpiar referencias
        const rawRefText = e.rawReferences
            .replace(/—/g, ' — ')
            .replace(/\s+/g, ' ');

        const rawList = rawRefText.split(' — ')
            .map(r => r.replace(/^[•\-\*\—\s\.\d~]+|[•\-\*\—\s\.\d~]+$/g, '').trim())
            .filter(r => r.length > 0);

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

        const distinctRefs = Array.from(new Set(vocabRefs));

        if (!existeEnVocab && distinctRefs.length > 0) {
            // Remisión secundaria (sinónimo / concepto afín)
            mapaRemisiones[normTerm] = {
                termino: term,
                destinos: distinctRefs,
                referenciasOriginales: rawList
            };

            distinctRefs.forEach(dest => {
                const normDest = normalizar(dest);
                if (!mapaAliasPorPalabra[normDest]) {
                    mapaAliasPorPalabra[normDest] = [];
                }
                if (!mapaAliasPorPalabra[normDest].includes(term)) {
                    mapaAliasPorPalabra[normDest].push(term);
                }
            });
        } else if (existeEnVocab && distinctRefs.length > 0) {
            // Artículo principal
            mapaTemasConexos[normTerm] = distinctRefs;
        }
    });

    const exportData = {
        mapaRemisiones,
        mapaAliasPorPalabra,
        mapaTemasConexos
    };

    const jsContent = `// Base de datos oficial de Remisiones e Índice Analítico de Xavier Léon-Dufour (Pág 850 a 869)
const INDICE_REMISIONES_DATA = ${JSON.stringify(exportData, null, 2)};
if (typeof window !== 'undefined') { window.INDICE_REMISIONES_DATA = INDICE_REMISIONES_DATA; }
if (typeof globalThis !== 'undefined') { globalThis.INDICE_REMISIONES_DATA = INDICE_REMISIONES_DATA; }
if (typeof module !== 'undefined' && module.exports) { module.exports = INDICE_REMISIONES_DATA; }
`;

    fs.writeFileSync('js/remisiones_data.js', jsContent);

    console.log(`\n=== ESTADÍSTICAS DEL MAPA DE REMISIONES ===`);
    console.log(`• Remisiones totales indexadas: ${Object.keys(mapaRemisiones).length}`);
    console.log(`• Palabras del vocabulario enriquecidas con remisiones: ${Object.keys(mapaAliasPorPalabra).length}`);
    console.log(`• Artículos principales con temas conexos: ${Object.keys(mapaTemasConexos).length}`);

    // Comprobaciones clave solicitadas por el usuario
    const checks = [
        'aclamacion', 'alegria', 'aleluya', 'diezmo', 'yugo', 
        'arrepentimiento', 'abba', 'asamblea', 'adulterio', 
        'castigo', 'celos', 'colera', 'comunidad', 'desierto', 
        'enfermedad', 'fidelidad', 'idolatria', 'inmortalidad', 
        'limosna', 'pecador', 'reconciliacion', 'suplica', 'testamento'
    ];

    console.log(`\n=== VERIFICACIÓN DE TÉRMINOS CLAVE ===`);
    checks.forEach(c => {
        const found = mapaRemisiones[c];
        if (found) {
            console.log(`✓ "${found.termino}" ➔ Apunta a: ${found.destinos.join(', ')}`);
        } else {
            console.log(`✗ No encontrado: "${c}"`);
        }
    });
}

parsearLineaPorLineaFinal();
