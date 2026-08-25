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

function parsearIndiceRobusto() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    const endIdx = content.indexOf("SIGLAS DE LOS COLABORADORES");
    if (endIdx !== -1) content = content.substring(0, endIdx);

    // Limpieza
    content = content.replace(/=== PÁGINA \d+ ===/g, '');
    content = content.replace(/índice de artículos/gi, '');
    content = content.replace(/índice de articulo\)/gi, '');
    content = content.replace(/índice de articule\*/gi, '');
    content = content.replace(/índice de artículo»/gi, '');
    content = content.replace(/\b85\d\b/g, '');
    content = content.replace(/\b86\d\b/g, '');
    content = content.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2'); // Unir palabras partidas
    content = content.replace(/\n+/g, ' ');
    content = content.replace(/\s+/g, ' ');

    const prol = "no complementan lo tratado.";
    if (content.indexOf(prol) !== -1) {
        content = content.substring(content.indexOf(prol) + prol.length).trim();
    }

    // Todas las flechas reconocidas
    // Reemplazar flechas con un token único @ARROW@
    content = content.replace(/\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g, ' @ARROW@ ');

    const chunks = content.split(' @ARROW@ ');
    console.log(`Total segmentos divididos por flecha: ${chunks.length}`);

    // chunks[0] es el primer término
    // chunks[i] contiene: [referencias del término i-1] [término i]
    // chunks[last] contiene: [referencias del último término]

    const entries = [];
    let termActual = chunks[0].trim();

    for (let i = 1; i < chunks.length; i++) {
        const chunk = chunks[i].trim();

        if (i === chunks.length - 1) {
            // Último chunk: solo contiene referencias del término anterior (Yugo)
            entries.push({
                termino: termActual,
                referenciasStr: chunk
            });
            break;
        }

        // Dividir el chunk entre las referencias del término anterior y el nombre del nuevo término
        // El término nuevo está al final de chunk.
        // Separamos por ' — '
        const partes = chunk.split(' — ');
        const ultimo = partes[partes.length - 1].trim();

        // En `ultimo`, separar la última referencia del término nuevo
        // Casos para término nuevo:
        // 1. Término en MAYÚSCULAS (ej. "DILUVIO", "ALIANZA", "ACCIÓN DE GRACIAS")
        // 2. Término Capitalizado (ej. "Diezmo", "Aclamación", "Alegría", "Yugo", "Adulterio")
        let match = ultimo.match(/(?:^|.*?[\.\d\s—a-z\)])([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ\(\)\/\-]+)*)$/);
        if (!match || ['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(match[1].trim())) {
            match = ultimo.match(/(?:^|.*?(?:\d+|[a-z]{2,}|\.|\))\s+)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|las|los|en|y|San|S\.)\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+|\s+[A-ZÁÉÍÓÚÑa-záéíóúñ\(\)]+)*)$/);
        }

        let nextTerm = "";
        let refPart = "";

        if (match && match[1]) {
            nextTerm = match[1].trim();
            const cutPos = chunk.lastIndexOf(nextTerm);
            refPart = chunk.substring(0, cutPos).trim();
        } else {
            const w = chunk.split(' ');
            nextTerm = w[w.length - 1];
            refPart = w.slice(0, -1).join(' ');
        }

        // Limpiar término
        nextTerm = nextTerm.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim();

        entries.push({
            termino: termActual,
            referenciasStr: refPart
        });

        termActual = nextTerm;
    }

    console.log(`Entradas parseadas: ${entries.length}`);

    // Procesar referencias y mapeo
    const resultado = entries.map((e, idx) => {
        let term = e.termino.trim();
        if (term.toLowerCase() === 'acubar') term = 'Acabar';

        const normTerm = normalizar(term);
        const existeEnVocab = vocabMap.has(normTerm);

        const rawList = e.referenciasStr.split(' — ')
            .map(r => r.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim())
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

        return {
            id: idx + 1,
            termino: term,
            terminoNorm: normTerm,
            tipo: existeEnVocab ? 'ARTICULO_PRINCIPAL' : 'REMISION_SINONIMO',
            palabraOficial: existeEnVocab ? vocabMap.get(normTerm) : null,
            referenciasRaw: rawList,
            referenciasVocabulario: Array.from(new Set(vocabRefs))
        };
    });

    fs.writeFileSync('scripts/indice_robusto.json', JSON.stringify(resultado, null, 2));

    // Generar js/remisiones_data.js
    const mapaRemisiones = {};
    const mapaAliasPorPalabra = {};
    const mapaTemasConexos = {};

    resultado.forEach(item => {
        const norm = item.terminoNorm;

        if (item.tipo === 'REMISION_SINONIMO') {
            if (item.referenciasVocabulario.length > 0) {
                mapaRemisiones[norm] = {
                    termino: item.termino,
                    destinos: item.referenciasVocabulario
                };

                item.referenciasVocabulario.forEach(dest => {
                    const normDest = normalizar(dest);
                    if (!mapaAliasPorPalabra[normDest]) {
                        mapaAliasPorPalabra[normDest] = [];
                    }
                    if (!mapaAliasPorPalabra[normDest].includes(item.termino)) {
                        mapaAliasPorPalabra[normDest].push(item.termino);
                    }
                });
            }
        } else if (item.tipo === 'ARTICULO_PRINCIPAL') {
            if (item.referenciasVocabulario.length > 0) {
                mapaTemasConexos[norm] = item.referenciasVocabulario;
            }
        }
    });

    const exportData = {
        mapaRemisiones,
        mapaAliasPorPalabra,
        mapaTemasConexos
    };

    fs.writeFileSync('js/remisiones_data.js', `// Base de datos oficial de Remisiones e Índice Analítico de Xavier Léon-Dufour
const INDICE_REMISIONES_DATA = ${JSON.stringify(exportData, null, 2)};
`);

    console.log(`\n=== VERIFICACIÓN DE MAPEOS GENERADOS ===`);
    console.log(`• Remisiones totales hacia palabras del vocabulario: ${Object.keys(mapaRemisiones).length}`);
    console.log(`• Palabras del vocabulario con remisiones entrantes: ${Object.keys(mapaAliasPorPalabra).length}`);

    const checks = ['aclamacion', 'alegria', 'diezmo', 'yugo', 'arrepentimiento', 'abba', 'asamblea', 'adulterio', 'desierto', 'eucaristia'];
    checks.forEach(c => {
        const found = mapaRemisiones[c];
        if (found) {
            console.log(`✓ "${found.termino}" -> ${found.destinos.join(', ')}`);
        } else {
            console.log(`✗ No encontrado: "${c}"`);
        }
    });
}

parsearIndiceRobusto();
