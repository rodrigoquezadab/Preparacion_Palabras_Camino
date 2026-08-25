const fs = require('fs');

// Cargar palabras conocidas
const palabrasJson = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const vocabMap = new Map();
palabrasJson.forEach(p => {
    vocabMap.set(normalizar(p.palabra), p.palabra);
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

function parseIndiceCompleto() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    // Limpiar cabeceras de página y números de página
    content = content.replace(/=== PÁGINA \d+ ===/g, '');
    content = content.replace(/índice de artículos/gi, '');
    content = content.replace(/índice de articulo\)/gi, '');
    content = content.replace(/índice de articule\*/gi, '');
    content = content.replace(/índice de artículo»/gi, '');
    content = content.replace(/85\d/g, '');
    content = content.replace(/86\d/g, '');

    // Deshacer guiones de fin de línea
    content = content.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');

    // Normalizar flechas
    content = content.replace(/\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g, ' ===> ');
    content = content.replace(/—/g, ' — ');
    content = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ');

    const chunks = content.split(' ===> ');
    console.log(`Total de tokens detectados con flecha: ${chunks.length}`);

    const entries = [];
    let prevReferencesText = "";

    for (let i = 0; i < chunks.length - 1; i++) {
        let left = chunks[i].trim();
        let right = chunks[i+1].trim();

        let terminoActual = "";

        if (i === 0) {
            const prol = "no complementan lo tratado.";
            const pIdx = left.indexOf(prol);
            if (pIdx !== -1) {
                terminoActual = left.substring(pIdx + prol.length).trim();
            } else {
                terminoActual = left;
            }
        } else {
            // El término actual está al final de `left`
            // Veamos qué hay al final de `left`.
            // Busquemos patrones de corte:
            // 1. Si termina con palabra en MAYÚSCULAS (ej. "ACCIÓN DE GRACIAS", "ABRAHAM", "HIJO DEL HOMBRE")
            // 2. Si termina con palabra Capitalizada (ej. "Aclamación", "Alegría", "Abismo")
            
            // Separar por guiones ' — '
            const partes = left.split(' — ');
            const ultimoSegmento = partes[partes.length - 1].trim();

            // En el último segmento, separar la referencia previa del nuevo término
            // Ejemplos de ultimoSegmento:
            // "Unción m 3 Abandono" -> "Unción m 3", "Abandono"
            // "Confianza Abba" -> "Confianza", "Abba"
            // "Padres v 1. vi Abismo" -> "Padres v 1. vi", "Abismo"
            // "Muerte NT m ABRAHAM" -> "Muerte NT m", "ABRAHAM"
            // "Trabajo ACCIÓN DE GRACIAS" -> "Trabajo", "ACCIÓN DE GRACIAS"
            // "Oración ACEITE" -> "Oración", "ACEITE"
            
            // Regex para detectar término en mayúsculas al final:
            const matchMayus = ultimoSegmento.match(/(?:^|.*?[\.\d\s—a-z])([A-ZÁÉÍÓÚÑ\s\(\)\/\-]{2,})$/);
            // Regex para término capitalizado al final:
            const matchCap = ultimoSegmento.match(/(?:^|.*?(?:\d+|[a-z]{2,}|\.|\))\s+)([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:de|del|la|las|los|en|y)\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+|\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)$/);

            if (matchMayus && matchMayus[1].trim().length >= 3 && matchMayus[1].trim() === matchMayus[1].trim().toUpperCase() && !['AT', 'NT', 'INT'].includes(matchMayus[1].trim())) {
                terminoActual = matchMayus[1].trim();
            } else if (matchCap && matchCap[1]) {
                terminoActual = matchCap[1].trim();
            } else {
                // Fallback: tomar las últimas palabras
                const words = ultimoSegmento.split(' ');
                terminoActual = words.slice(-1).join(' ');
            }
        }

        // Limpiar símbolos extra del término
        terminoActual = terminoActual.replace(/^[•\-\*\—\s]+|[•\-\*\—\s]+$/g, '').trim();

        // Extraer referencias del chunk right (hasta el inicio del siguiente término)
        // Guardar para procesar referencias limpias
        entries.push({
            id: i + 1,
            termino: terminoActual,
            esArticuloPrincipal: terminoActual === terminoActual.toUpperCase() && terminoActual.length > 2,
            rawLeft: left.substring(Math.max(0, left.length - 60)),
            rawRight: right.substring(0, 150)
        });
    }

    fs.writeFileSync('scripts/parsed_entries_full.json', JSON.stringify(entries, null, 2));
    console.log(`Entradas parseadas: ${entries.length}`);

    // Mostrar estadísticas
    const principales = entries.filter(e => e.esArticuloPrincipal);
    const remisiones = entries.filter(e => !e.esArticuloPrincipal);
    console.log(`Artículos principales (MAYÚSCULAS): ${principales.length}`);
    console.log(`Remisiones secundarias (Minúsculas): ${remisiones.length}`);
}

parseIndiceCompleto();
