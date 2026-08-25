const fs = require('fs');

function normalizar(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function limpiarTexto(texto) {
    return texto
        .replace(/-\s*\n\s*/g, '') // Unir palabras divididas por guión al final de línea
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function procesarIndice() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    // Remover encabezados de página
    content = content.replace(/=== PÁGINA \d+ ===/g, '');
    content = content.replace(/índice de artículos/gi, '');
    content = content.replace(/índice de articulo\)/gi, '');
    content = content.replace(/índice de articule\*/gi, '');
    content = content.replace(/índice de artículo»/gi, '');
    content = content.replace(/85\d/g, '');
    content = content.replace(/86\d/g, '');

    // Unir guiones de división de palabras
    content = content.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');

    // Convertir todas las variantes de flechas en un token estándar " ---> "
    // Las variantes observadas: ->, -»•, -» , -*•, -* , ->•, ->-, -+, —>, —>•, —\*>
    content = content.replace(/\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|—>|—>•|—\*>|—»|—\*)\s*/g, ' ---> ');

    // Separador de elementos: guión largo "—"
    content = content.replace(/—/g, ' — ');

    const lineas = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const unificado = lineas.join(' ').replace(/\s+/g, ' ');

    fs.writeFileSync('scripts/indice_normalizado.txt', unificado);

    // Ahora separamos por entradas
    // Cada entrada tiene: NOMBRE_TERMINO ---> REF1 — REF2 — REF3 ...
    // Entre el final de REF_N y el inicio del siguiente NOMBRE_TERMINO2 está la frontera.
    const chunks = unificado.split(' ---> ');
    console.log(`Chunks encontrados con flecha: ${chunks.length}`);

    const entries = [];

    for (let i = 0; i < chunks.length - 1; i++) {
        let left = chunks[i].trim();
        let right = chunks[i+1].trim();

        // En el primer chunk, el término es la última parte después del prólogo
        let termino = "";
        if (i === 0) {
            const prol = "no complementan lo tratado.";
            const pIdx = left.indexOf(prol);
            if (pIdx !== -1) {
                termino = left.substring(pIdx + prol.length).trim();
            } else {
                termino = left;
            }
        } else {
            // El término está al final de 'left'
            // Las referencias anteriores están antes.
            // Las referencias suelen estar separadas por ' — '
            const subPartes = left.split(' — ');
            const ultimoTrozo = subPartes[subPartes.length - 1].trim();

            // En el último trozo, puede haber "ReferenciaAnterior [sub-indices] NuevoTermino"
            // Por ejemplo "Vocación Abrigo" o "Pecado i Admiración" o "Padres v 1. vi Abismo"
            // O a veces viene precedido por un punto o números romanos o directamente el nombre
            // Tratemos de extraer el nombre del nuevo término (últimas 1 a 3 palabras capitalizadas)
            termino = ultimoTrozo;
        }

        entries.push({
            index: i,
            rawLeft: termino,
            rawRightPreview: right.substring(0, 100)
        });
    }

    fs.writeFileSync('scripts/entries_debug.json', JSON.stringify(entries.slice(0, 50), null, 2));
    console.log("Muestra de 50 entries extraídas");
}

procesarIndice().catch(console.error);
