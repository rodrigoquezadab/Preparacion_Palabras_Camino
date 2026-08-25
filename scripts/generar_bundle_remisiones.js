const fs = require('fs');

const indiceCompleto = JSON.parse(fs.readFileSync('scripts/indice_completo_final.json', 'utf8'));
const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const vocabKeys = Object.keys(palabrasData.palabras);

function normalizar(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

// 1. Mapa de alias / remisiones que apuntan a palabras oficiales
// clave: normalizar(terminoRemision) -> { terminoOriginal, palabrasDestino: [ "Amén", ... ] }
const mapaRemisiones = {};

// 2. Mapa inverso: para cada palabra oficial, qué remisiones/alias apuntan a ella
// clave: normalizar(palabraOficial) -> [ "Aclamación", "Juramento", ... ]
const mapaAliasPorPalabra = {};

// 3. Mapa de temas conexos para cada artículo principal
// clave: normalizar(palabraOficial) -> [ "Fe", "Incredulidad", "Verdad", ... ]
const mapaTemasConexos = {};

indiceCompleto.forEach(item => {
    const norm = item.terminoNorm;

    if (item.tipo === 'REMISION_SINONIMO') {
        // Es un término derivado/sinónimo que apunta a uno o más temas del vocabulario
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

console.log(`Total de términos de remisión indexados: ${Object.keys(mapaRemisiones).length}`);
console.log(`Total de palabras oficiales con alias/remisiones asignadas: ${Object.keys(mapaAliasPorPalabra).length}`);
console.log(`Total de artículos con temas conexos indexados: ${Object.keys(mapaTemasConexos).length}`);

// Guardar en un archivo JS para embeber directamente o cargar
const exportData = {
    mapaRemisiones,
    mapaAliasPorPalabra,
    mapaTemasConexos
};

fs.writeFileSync('js/remisiones_data.js', `// Base de datos oficial de Remisiones e Índice Analítico de Xavier Léon-Dufour
const INDICE_REMISIONES_DATA = ${JSON.stringify(exportData, null, 2)};
`);

console.log("Archivo js/remisiones_data.js generado con éxito.");

// Pruebas
const testQueries = ['aclamacion', 'alegria', 'yugo', 'arrepentimiento', 'diezmo', 'eucaristia', 'abba', 'asamblea'];
console.log("\nPrueba de consultas:");
testQueries.forEach(q => {
    const found = mapaRemisiones[q];
    if (found) {
        console.log(`✓ Buscando "${q}" ➔ Encuentra: ${found.destinos.join(', ')} (Término: ${found.termino})`);
    } else {
        console.log(`✗ No encontrado: "${q}"`);
    }
});
