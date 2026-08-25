const fs = require('fs');

const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const palabrasKeys = Object.keys(palabrasData.palabras);

function normalizar(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

// Mapa de palabras del vocabulario (289 palabras)
const vocabNormMap = new Map();
palabrasKeys.forEach(p => {
    vocabNormMap.set(normalizar(p), p);
});

// Precatecumenado 148
const precatMap = new Map();
// Busquemos numPrecat en palabrasData
for (const [key, val] of Object.entries(palabrasData.palabras)) {
    if (val.numPrecat || val.num) {
        precatMap.set(normalizar(key), val.numPrecat || val.num);
    }
}

function parseIndice() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    // Limpiar páginas
    content = content.replace(/=== PÁGINA \d+ ===/g, '');
    content = content.replace(/índice de artículos/gi, '');
    content = content.replace(/índice de articulo\)/gi, '');
    content = content.replace(/índice de articule\*/gi, '');
    content = content.replace(/índice de artículo»/gi, '');
    content = content.replace(/\b85\d\b/g, '');
    content = content.replace(/\b86\d\b/g, '');

    // Deshacer guiones de fin de línea
    content = content.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');

    // Normalizar flechas de remisión
    content = content.replace(/\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g, ' ===> ');
    content = content.replace(/—/g, ' — ');
    content = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ');

    const chunks = content.split(' ===> ');
    console.log(`Total de flechas encontradas: ${chunks.length - 1}`);

    const entries = [];

    for (let i = 0; i < chunks.length - 1; i++) {
        let left = chunks[i].trim();
        let right = chunks[i+1].trim();

        let terminoActual = "";

        if (i === 0) {
            const prol = "no complementan lo tratado.";
            const pIdx = left.indexOf(prol);
            terminoActual = (pIdx !== -1 ? left.substring(pIdx + prol.length) : left).trim();
        } else {
            // El término actual es la última parte de `left`
            const subPartes = left.split(' — ');
            const ultimoSegmento = subPartes[subPartes.length - 1].trim();

            // Analicemos el último segmento para extraer el nombre del término que va a la izquierda de la flecha
            // Puede ser MAYÚSCULAS o Capitalizado
            // Remover posibles restos de números romanos/subíndices de la referencia anterior
            // Ej: "Unción m 3 Abandono" -> "Abandono"
            // "Muerte NT m ABRAHAM" -> "ABRAHAM"
            // "Eucaristía rv 4 ACCIÓN DE GRACIAS" -> "ACCIÓN DE GRACIAS"
            
            // 1. Probar si termina con término en mayúsculas
            const matchMayus = ultimoSegmento.match(/(?:^|.*?[\.\d\s—a-z])([A-ZÁÉÍÓÚÑ\s\(\)\/\-]{2,})$/);
            // 2. Probar si termina con término capitalizado
            const matchCap = ultimoSegmento.match(/(?:^|.*?(?:\d+|[a-z]{2,}|\.|\))\s+)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|las|los|en|y|San|S\.)\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+|\s+[A-ZÁÉÍÓÚÑa-záéíóúñ\(\)]+)*)$/);

            if (matchMayus && matchMayus[1].trim().length >= 2 && matchMayus[1].trim() === matchMayus[1].trim().toUpperCase() && !['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(matchMayus[1].trim())) {
                terminoActual = matchMayus[1].trim();
            } else if (matchCap && matchCap[1]) {
                terminoActual = matchCap[1].trim();
            } else {
                // Fallback
                const words = ultimoSegmento.split(' ');
                terminoActual = words[words.length - 1];
            }
        }

        // Limpiar término
        terminoActual = terminoActual.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim();

        // Extraer las referencias de `right` (hasta que empiece el siguiente término antes de la siguiente flecha)
        // En `right`, las referencias están separadas por ' — '
        const subPartesRight = right.split(' — ');
        // Todas las partes excepto la última son referencias seguras
        // La última parte contiene la última referencia más el próximo término
        const referenciasRaw = [];
        for (let j = 0; j < subPartesRight.length - 1; j++) {
            referenciasRaw.push(subPartesRight[j].trim());
        }
        // De la última parte de `right`, sólo nos interesa la referencia antes del próximo término
        if (subPartesRight.length > 0 && i === chunks.length - 2) {
            referenciasRaw.push(subPartesRight[subPartesRight.length - 1].trim());
        } else if (subPartesRight.length > 0) {
            referenciasRaw.push(subPartesRight[subPartesRight.length - 1].trim());
        }

        // Limpiar cada referencia para obtener el tema principal al que apunta
        const referenciasLimpias = [];
        referenciasRaw.forEach(refStr => {
            // Ejemplos de refStr: "Adoración n 3", "Hijo NT i 1", "Oración rv 2. v 2 d", "Padres v 1. vi Abismo"
            // Extraer el nombre del tema (las primeras palabras antes de subsecciones romanas/números/letras como 'AT', 'NT', 'Int', 'i', '1')
            // O comparar con vocabNormMap
            const cleanRef = refStr.replace(/^[•\-\*\—\s]+|[•\-\*\—\s]+$/g, '').trim();
            if (cleanRef.length > 0) {
                // Buscar si coincide con alguna palabra del vocabulario
                let matchedVocab = null;
                const words = cleanRef.split(' ');
                for (let len = words.length; len >= 1; len--) {
                    const candidate = words.slice(0, len).join(' ');
                    const normCand = normalizar(candidate);
                    if (vocabNormMap.has(normCand)) {
                        matchedVocab = vocabNormMap.get(normCand);
                        break;
                    }
                }

                referenciasLimpias.push({
                    raw: cleanRef,
                    palabraVocabulario: matchedVocab,
                    textoReferencia: cleanRef
                });
            }
        });

        const normTermino = normalizar(terminoActual);
        const existeEnVocabulario = vocabNormMap.has(normTermino);
        const palabraOficial = existeEnVocabulario ? vocabNormMap.get(normTermino) : null;
        const numPrecat = precatMap.get(normTermino) || null;

        entries.push({
            id: i + 1,
            termino: terminoActual,
            terminoNorm: normTermino,
            esArticuloPrincipal: existeEnVocabulario || (terminoActual === terminoActual.toUpperCase() && terminoActual.length > 2),
            palabraOficialVocabulario: palabraOficial,
            numPrecat: numPrecat,
            referenciasRaw: referenciasLimpias.map(r => r.raw),
            referenciasVocabulario: Array.from(new Set(referenciasLimpias.map(r => r.palabraVocabulario).filter(Boolean)))
        });
    }

    fs.writeFileSync('scripts/indice_remisiones_analizado.json', JSON.stringify(entries, null, 2));

    console.log(`\n=== RESUMEN DEL ANÁLISIS DEL ÍNDICE ===`);
    console.log(`Total entradas extraídas: ${entries.length}`);
    const conVocabulario = entries.filter(e => e.esArticuloPrincipal);
    const remisionesSecundarias = entries.filter(e => !e.esArticuloPrincipal);
    console.log(`Entradas que son Artículos Principales del Vocabulario: ${conVocabulario.length}`);
    console.log(`Entradas de Remisión Secundaria (sinónimos / conceptos derivados): ${remisionesSecundarias.length}`);

    // Mostrar ejemplos clave como Aclamación, Alegría, Abandono, etc.
    const ejemplos = ['aclamacion', 'alegria', 'aleluya', 'adoracion', 'amen', 'abraham', 'pecado', 'bautismo', 'amor'];
    console.log(`\nEjemplos específicos analizados:`);
    ejemplos.forEach(ej => {
        const found = entries.find(e => e.terminoNorm === ej || normalizar(e.termino) === ej);
        if (found) {
            console.log(`- "${found.termino}" (${found.esArticuloPrincipal ? 'Artículo Principal' : 'Remisión'}) -> Apunta a: ${found.referenciasVocabulario.join(', ') || found.referenciasRaw.join(', ')}`);
        }
    });
}

parseIndice();
