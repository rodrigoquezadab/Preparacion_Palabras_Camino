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

function parsearIndicePreciso() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    // Limpiezas generales
    content = content.replace(/=== PÁGINA \d+ ===/g, '');
    content = content.replace(/índice de artículos/gi, '');
    content = content.replace(/índice de articulo\)/gi, '');
    content = content.replace(/índice de articule\*/gi, '');
    content = content.replace(/índice de artículo»/gi, '');
    content = content.replace(/\b85\d\b/g, '');
    content = content.replace(/\b86\d\b/g, '');
    content = content.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');

    // Normalizar flechas
    content = content.replace(/\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g, ' ===> ');
    content = content.replace(/—/g, ' — ');
    content = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ');

    const chunks = content.split(' ===> ');

    const items = [];

    // Chunk 0 contiene prólogo + primer término
    // Para cada i desde 0 hasta chunks.length - 2:
    // El término de la regla i está al final de chunks[i]
    // Las referencias de la regla i están en chunks[i+1] (hasta el término de la regla i+1)

    // Extraigamos todos los términos primero
    const terminos = [];

    // Término 0:
    const prol = "no complementan lo tratado.";
    const p0 = chunks[0].substring(chunks[0].indexOf(prol) + prol.length).trim();
    terminos.push(p0);

    for (let i = 1; i < chunks.length - 1; i++) {
        const chunk = chunks[i].trim();
        // El término está al final de chunk.
        // Las referencias están antes.
        // Dividamos por guiones o palabras
        const partes = chunk.split(' — ');
        const ultimo = partes[partes.length - 1].trim();

        // En `ultimo`, busquemos dónde empieza el nuevo término.
        // Casos posibles:
        // A) Todo en MAYÚSCULAS: ej "ABRAHAM", "ACCIÓN DE GRACIAS", "HIJO DEL HOMBRE"
        // B) Capitalizado: ej "Aclamación", "Acogida", "Adulterio"
        // C) Con prefijo como "San Pedro", "San Pablo", "Día del Señor"
        
        let match = ultimo.match(/(?:^|.*?[\.\d\s—a-z\)])([A-ZÁÉÍÓÚÑ]{2,}(?:\s+[A-ZÁÉÍÓÚÑ\(\)\/\-]+)*)$/);
        if (!match || ['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(match[1].trim())) {
            match = ultimo.match(/(?:^|.*?(?:\d+|[a-z]{2,}|\.|\))\s+)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|las|los|en|y|San|S\.)\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+|\s+[A-ZÁÉÍÓÚÑa-záéíóúñ\(\)]+)*)$/);
        }

        let term = "";
        if (match && match[1]) {
            term = match[1].trim();
        } else {
            const w = ultimo.split(' ');
            term = w[w.length - 1];
        }

        term = term.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim();
        terminos.push(term);
    }

    console.log(`Términos detectados: ${terminos.length}`);
    console.log(`Primeros 20 términos:`, terminos.slice(0, 20));

    // Ahora asociar cada término con sus referencias
    const resultado = [];
    for (let i = 0; i < terminos.length; i++) {
        const termino = terminos[i];
        const nextTermino = terminos[i + 1] || "";
        const refChunk = chunks[i + 1] || "";

        // En refChunk, las referencias terminan donde empieza nextTermino
        let refText = refChunk;
        if (nextTermino && refChunk.endsWith(nextTermino)) {
            refText = refChunk.substring(0, refChunk.length - nextTermino.length).trim();
        } else if (nextTermino) {
            const lastIdx = refChunk.lastIndexOf(nextTermino);
            if (lastIdx !== -1) {
                refText = refChunk.substring(0, lastIdx).trim();
            }
        }

        // Parsear referencias individuales separadas por ' — '
        const rawRefs = refText.split(' — ')
            .map(r => r.replace(/^[•\-\*\—\s\.\d]+|[•\-\*\—\s\.\d]+$/g, '').trim())
            .filter(r => r.length > 0);

        // Identificar palabras clave del vocabulario a las que apunta
        const refsVocab = [];
        rawRefs.forEach(r => {
            // Buscar la palabra más larga que coincida
            const words = r.split(' ');
            for (let len = words.length; len >= 1; len--) {
                const candidate = words.slice(0, len).join(' ').replace(/[\d\.\(\)]/g, '').trim();
                const norm = normalizar(candidate);
                if (vocabMap.has(norm)) {
                    refsVocab.push(vocabMap.get(norm));
                    break;
                }
            }
        });

        const normTerm = normalizar(termino);
        const esArticulo = vocabMap.has(normTerm) || (termino === termino.toUpperCase() && termino.length > 2);

        resultado.push({
            termino: termino,
            terminoNorm: normTerm,
            tipo: esArticulo ? 'ARTICULO_PRINCIPAL' : 'REMISION_SINONIMO',
            palabraOficial: vocabMap.get(normTerm) || null,
            referenciasRaw: rawRefs,
            referenciasVocabulario: Array.from(new Set(refsVocab))
        });
    }

    fs.writeFileSync('scripts/indice_remisiones_limpio.json', JSON.stringify(resultado, null, 2));
    console.log("Guardado en scripts/indice_remisiones_limpio.json");

    // Probar búsqueda de términos específicos
    const testTerms = ['Aarón', 'Aclamación', 'Alegría', 'Aleluya', 'Adulterio', 'Abandono', 'Abba', 'Amén', 'Abraham', 'Pecado'];
    console.log("\nVerificación de casos de prueba:");
    testTerms.forEach(t => {
        const found = resultado.find(r => normalizar(r.termino) === normalizar(t));
        if (found) {
            console.log(`✓ "${found.termino}" (${found.tipo}) => ${found.referenciasVocabulario.join(', ') || found.referenciasRaw.join(', ')}`);
        } else {
            console.log(`✗ No encontrado: "${t}"`);
        }
    });
}

parsearIndicePreciso();
