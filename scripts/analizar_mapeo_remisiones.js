const fs = require('fs');

const indiceData = JSON.parse(fs.readFileSync('scripts/indice_completo_final.json', 'utf8'));
const palabrasData = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

// Mapa de palabras del vocabulario
const vocab = Object.keys(palabrasData.palabras);

console.log("Analizando mapeo de remisiones a palabras del vocabulario...");

const remisionesMap = [];
indiceData.filter(i => i.tipo === 'REMISION_SINONIMO').forEach(item => {
    if (item.referenciasVocabulario.length > 0) {
        remisionesMap.push({
            termino: item.termino,
            apuntaA: item.referenciasVocabulario,
            detalleOriginal: item.referenciasRaw
        });
    }
});

console.log(`Total remisiones secundarias que apuntan a temas del vocabulario: ${remisionesMap.length} de ${indiceData.filter(i => i.tipo === 'REMISION_SINONIMO').length}`);

// Guardar mapeo de sinónimos/remisiones
fs.writeFileSync('scripts/mapa_remisiones.json', JSON.stringify(remisionesMap, null, 2));

// Mostrar 30 ejemplos claros de remisiones bíblicas
console.log("\n=== 30 EJEMPLOS DE REMISIONES DIRECTAS DE LÉON-DUFOUR ===");
remisionesMap.slice(0, 30).forEach(r => {
    console.log(`• "${r.termino}" ➔ Se prepara como: ${r.apuntaA.join(', ')}`);
});
