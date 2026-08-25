const fs = require('fs');

function normalizar(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function parseIndice() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');

    // Encontrar dónde empieza el índice
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    if (startIdx === -1) {
        console.error("No se encontró el título");
        return;
    }

    const indiceText = rawText.substring(startIdx);
    
    // Limpiar saltos de página y cabeceras
    const lineas = indiceText.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('=== PÁGINA') && !l.match(/^\d+$/) && !l.includes('índice de artículos') && !l.includes('índice de artículo'));

    console.log(`Líneas a procesar: ${lineas.length}`);

    // Unir líneas partidas por guión o que continúan una entrada
    // Las entradas empiezan típicamente con una palabra seguida de flecha "->", "-*", "-»", "->•", etc.
    const rawEntries = [];
    let currentEntry = "";

    // Regex para detectar inicio de entrada: palabra(s) seguida de guión y flecha/símbolo
    // O palabra en mayúsculas / minúsculas con flecha
    const entryStartRegex = /^([A-ZÁÉÍÓÚÑa-záéíóúñ\s\(\)\/,\.\-]+?)\s*(?:->|-»|-\*|-»•|->•|—>|—>•|—\*>)\s*(.*)/;

    // A veces la flecha está en la siguiente línea o el texto fluye
    let fullText = lineas.join(' ');
    
    // Reemplazar diferentes representaciones de flechas por un separador estándar " ===> "
    fullText = fullText
        .replace(/\s*(?:->|-»|-\*|-»•|->•|—>|—>•|—\*>|—»|—\*)\s*/g, ' ===> ')
        .replace(/—\s*/g, ' — ')
        .replace(/\s+/g, ' ');

    fs.writeFileSync('scripts/indice_unificado_temp.txt', fullText);

    // Parsear entradas
    // Cada entrada tiene la forma: Término ===> Referencias — Referencias — ... Término2 ===> ...
    const tokens = fullText.split(' ===> ');
    console.log(`Tokens con flecha: ${tokens.length}`);

    const articulosPrincipales = []; // En MAYÚSCULAS
    const remisiones = []; // En minúsculas / tipo título

    for (let i = 0; i < tokens.length - 1; i++) {
        // La parte izquierda (al final del token i) es el término de la entrada actual
        // La parte derecha (al principio del token i+1) contiene las referencias de la entrada actual
        let left = tokens[i];
        let right = tokens[i+1];

        // En el primer token, el término es lo que está antes de la primera flecha (saltando el prólogo)
        let termino = "";
        if (i === 0) {
            const matchPrologo = left.indexOf("no complementan lo tratado.");
            if (matchPrologo !== -1) {
                termino = left.substring(matchPrologo + "no complementan lo tratado.".length).trim();
            } else {
                termino = left.trim();
            }
        } else {
            // El término está al final de 'left'. Las referencias anteriores están antes.
            // Busquemos dónde termina la lista de referencias anterior y empieza el nuevo término
            // Típicamente las referencias están separadas por "—", y el último elemento después del último "—" es: "Referencia anterior Término Nuevo"
            // O a veces no hay guión y solo hay lista de referencias
            const partes = left.split(' — ');
            const ultimoFragmento = partes[partes.length - 1].trim();

            // Analizar el último fragmento para separar la última referencia del nuevo término
            // Los términos suelen ser 1 a 3 palabras.
            // Intentemos separar por mayúscula de inicio de término o palabras
            termino = ultimoFragmento; // Refinaremos a continuación
        }

        // El contenido de referencias es lo que viene antes del siguiente término
    }
}

parseIndice();
