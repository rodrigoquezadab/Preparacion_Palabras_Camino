const fs = require('fs');

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

// Construir diccionario exhaustivo de formas y variantes a nombres canónicos de palabras.json
const sinonimosATema = new Map();

// Agregar cada palabra de palabras.json
vocabKeys.forEach(p => {
    sinonimosATema.set(normalizar(p), p);
    
    // Si tiene guión (ej: "Babel - Babilonia", "Bien - Mal", "Enfermedad - Curación", "Hambre - Sed", "Penitencia - Conversión")
    if (p.includes(' - ')) {
        const partes = p.split(' - ');
        partes.forEach(pt => {
            sinonimosATema.set(normalizar(pt), p);
        });
    }
});

// Equivalencias de términos bíblicos, plurales, abreviaturas y sinónimos
const equivalencias = [
    ['sacerdote', 'Sacerdocio'],
    ['sacerdotes', 'Sacerdocio'],
    ['sacerdocio', 'Sacerdocio'],
    ['palabra de d', 'Palabra de Dios'],
    ['palabra de dios', 'Palabra de Dios'],
    ['palabra', 'Palabra de Dios'],
    ['palabra humana', 'Palabra de Dios'],
    ['espiritu de d', 'Espíritu de Dios'],
    ['espiritu de dios', 'Espíritu de Dios'],
    ['espiritu', 'Espíritu'],
    ['espiritu santo', 'Espíritu'],
    ['ira de d', 'Ira'],
    ['ira de dios', 'Ira'],
    ['ira del hombre', 'Ira'],
    ['ira', 'Ira'],
    ['designio de d', 'Designio de Dios'],
    ['designio de dios', 'Designio de Dios'],
    ['presencia de d', 'Presencia de Dios'],
    ['presencia de dios', 'Presencia de Dios'],
    ['dia del s', 'Día del Señor'],
    ['dia del senor', 'Día del Señor'],
    ['hijo del hombre', 'Hijo del hombre'],
    ['cordero de dios', 'Cordero de Dios'],
    ['cordero', 'Cordero de Dios'],
    ['cuerpo de cristo', 'Cuerpo de Cristo'],
    ['bien y mal', 'Bien - Mal'],
    ['hambre y sed', 'Hambre - Sed'],
    ['curacion', 'Enfermedad - Curación'],
    ['enfermedad', 'Enfermedad - Curación'],
    ['penitencia', 'Penitencia - Conversión'],
    ['conversion', 'Penitencia - Conversión'],
    ['padre', 'Padre'],
    ['padres', 'Padre'],
    ['madre', 'Madre'],
    ['madres', 'Madre'],
    ['hijo', 'Hijo'],
    ['hijos', 'Hijo'],
    ['hermano', 'Hermano'],
    ['hermanos', 'Hermano'],
    ['pobre', 'Pobres'],
    ['pobres', 'Pobres'],
    ['profeta', 'Profeta'],
    ['profetas', 'Profeta'],
    ['apostol', 'Apóstoles'],
    ['apostoles', 'Apóstoles'],
    ['angel', 'Ángel'],
    ['angeles', 'Ángel'],
    ['animal', 'Animales'],
    ['animales', 'Animales'],
    ['bestia', 'Bestias'],
    ['bestias', 'Bestias'],
    ['astro', 'Astros'],
    ['astros', 'Astros'],
    ['carisma', 'Carisma'],
    ['carismas', 'Carisma'],
    ['castigo', 'Castigos'],
    ['castigos', 'Castigos'],
    ['idolo', 'Ídolos'],
    ['idolos', 'Ídolos'],
    ['milagro', 'Milagro'],
    ['milagros', 'Milagro'],
    ['obra', 'Obras'],
    ['obras', 'Obras'],
    ['promesa', 'Promesas'],
    ['promesas', 'Promesas'],
    ['riqueza', 'Riquezas'],
    ['riquezas', 'Riquezas'],
    ['nacion', 'Naciones'],
    ['naciones', 'Naciones'],
    ['martir', 'Mártir'],
    ['martires', 'Mártir'],
    ['pastor', 'Pastor'],
    ['pastores', 'Pastor'],
    ['rey', 'Rey'],
    ['reyes', 'Rey'],
    ['hombre', 'Hombre'],
    ['hombres', 'Hombre'],
    ['mujer', 'Mujer'],
    ['mujeres', 'Mujer'],
    ['nino', 'Niño'],
    ['ninos', 'Niño'],
    ['pedro', 'Pedro'],
    ['san pedro', 'Pedro'],
    ['s pedro', 'Pedro'],
    ['pablo', 'Pablo'],
    ['san pablo', 'Pablo'],
    ['s pablo', 'Pablo'],
    ['maria', 'María'],
    ['sencillo', 'Sencillez'],
    ['sencillez', 'Sencillez'],
    ['hipocrita', 'Hipocresía'],
    ['hipocresia', 'Hipocresía'],
    ['orgulloso', 'Orgullo'],
    ['orgullo', 'Orgullo'],
    ['pecador', 'Pecado'],
    ['pecado', 'Pecado'],
    ['vida', 'Vida'],
    ['inmortalidad', 'Vida'],
    ['muerte', 'Muerte'],
    ['suplica', 'Oración'],
    ['plegaria', 'Oración'],
    ['oracion', 'Oración'],
    ['aleluya', 'Alabanza'],
    ['alegria', 'Gozo'],
    ['gozo', 'Gozo'],
    ['comunidad', 'Iglesia'],
    ['asamblea', 'Iglesia'],
    ['iglesia', 'Iglesia'],
    ['testamento', 'Alianza'],
    ['alianza', 'Alianza'],
    ['justificacion', 'Justicia'],
    ['justicia', 'Justicia'],
    ['redentor', 'Redención'],
    ['redencion', 'Redención'],
    ['salvador', 'Salvación'],
    ['salvacion', 'Salvación'],
    ['llamamiento', 'Vocación'],
    ['vocacion', 'Vocación'],
    ['testigo', 'Testimonio'],
    ['testimonio', 'Testimonio'],
    ['liturgia', 'Culto'],
    ['culto', 'Culto'],
    ['arca de la alianza', 'Arca'],
    ['arca', 'Arca'],
    ['mandamientos', 'Ley'],
    ['tora', 'Ley'],
    ['ley', 'Ley'],
    ['sabio', 'Sabiduría'],
    ['sabiduria', 'Sabiduría'],
    ['fidelidad', 'Verdad'],
    ['verdad', 'Verdad'],
    ['iluminacion', 'Luz'],
    ['luz', 'Luz'],
    ['oscuridad', 'Tinieblas'],
    ['tinieblas', 'Tinieblas'],
    ['oleo', 'Aceite'],
    ['aceite', 'Aceite'],
    ['ungido', 'Unción'],
    ['uncion', 'Unción'],
    ['cosecha', 'Siega'],
    ['siega', 'Siega'],
    ['vina', 'Vino'],
    ['viña', 'Vino'],
    ['vino', 'Vino'],
    ['pan', 'Pan'],
    ['fuego', 'Fuego'],
    ['agua', 'Agua'],
    ['sangre', 'Sangre'],
    ['carne', 'Carne'],
    ['cuerpo', 'Cuerpo'],
    ['alma', 'Alma'],
    ['corazon', 'Corazón']
];

equivalencias.forEach(([alias, oficial]) => {
    const foundKey = vocabKeys.find(k => normalizar(k) === normalizar(oficial));
    if (foundKey) {
        sinonimosATema.set(normalizar(alias), foundKey);
    }
});

// Función para extraer todos los temas mencionados en un bloque de texto de referencias
function extraerTodosLosTemas(textoReferencias) {
    if (!textoReferencias) return [];

    // Limpiar saltos de línea y formatear
    let clean = textoReferencias
        .replace(/—/g, ' — ')
        .replace(/–/g, ' — ')
        .replace(/\s+-\s+/g, ' — ')
        .replace(/\s+/g, ' ');

    // Separar fragmentos por guiones, comas, puntos o divisiones
    const fragmentos = clean.split(/\s*(?:—|–|\s+-\s+|,|\/)\s*/);
    const temasDetectados = new Set();

    fragmentos.forEach(frag => {
        let f = frag.trim();
        if (!f) return;

        f = f.replace(/^[•\-\*\—\s\.\d~]+|[•\-\*\—\s\.\d~]+$/g, '').trim();
        
        const words = f.split(' ');
        
        // Buscar de mayor longitud a menor
        for (let start = 0; start < words.length; start++) {
            for (let len = words.length - start; len >= 1; len--) {
                const candidate = words.slice(start, start + len).join(' ')
                    .replace(/[\d\.\(\),:;]/g, '')
                    .trim();
                const norm = normalizar(candidate);
                
                if (norm.length >= 2 && sinonimosATema.has(norm)) {
                    temasDetectados.add(sinonimosATema.get(norm));
                }
            }
        }
    });

    return Array.from(temasDetectados);
}

// Parsear el texto completo del índice
function procesarTodoElIndice() {
    const rawText = fs.readFileSync('scripts/indice_articulos_completo.txt', 'utf8');
    const startIdx = rawText.indexOf("ÍNDICE DE ARTÍCULOS Y REMISIONES");
    let content = rawText.substring(startIdx);

    const endIdx = content.indexOf("SIGLAS DE LOS COLABORADORES");
    if (endIdx !== -1) content = content.substring(0, endIdx);

    const lines = content.split('\n');
    const arrowRegex = /\s*(?:->|-»•|-»|-\*•|-\*|->•|->-|-\+|~>|~\*|~»|—>|—>•|—\*>|—»|—\*)\s*/;

    const entries = [];
    let currentEntry = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line || line.startsWith('=== PÁGINA') || line.match(/^85\d$/) || line.match(/^86\d$/) || line.match(/^ÍNDICE/i) || line.includes('no complementan lo tratado') || line.includes('índice de artículo')) {
            continue;
        }

        // Si la línea contiene VOLUNTAD DE DIOS
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

        // Caso especial Alimento — ...
        if (line.startsWith('Alimento —') || line.startsWith('ALIMENTO —')) {
            if (currentEntry) {
                entries.push(currentEntry);
            }
            const parts = line.split('—');
            currentEntry = {
                termino: parts[0].trim(),
                rawReferences: parts.slice(1).join(' — ').trim()
            };
            continue;
        }

        // Línea con flecha
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

        // Término en mayúsculas sin flecha en esta línea
        const isUpper = line === line.toUpperCase() && line.length >= 3 && !line.match(/^[0-9\.\s—]+$/) && !['AT', 'NT', 'INT', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'IV', 'III', 'II', 'I'].includes(line);
        if (isUpper && (sinonimosATema.has(normalizar(line)) || vocabKeys.some(k => normalizar(k) === normalizar(line)))) {
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

    console.log(`Total de entradas extraídas: ${entries.length}`);

    // Mapas finales
    const mapaRemisiones = {};
    const mapaAliasPorPalabra = {};
    const mapaTemasConexos = {};

    entries.forEach(e => {
        let term = e.termino.trim();
        if (term.toLowerCase() === 'acubar') term = 'Acabar';

        const normTerm = normalizar(term);
        const esArticuloPrincipal = vocabKeys.some(k => normalizar(k) === normTerm);
        const destinos = extraerTodosLosTemas(e.rawReferences);

        if (!esArticuloPrincipal && destinos.length > 0) {
            mapaRemisiones[normTerm] = {
                termino: term,
                destinos: destinos,
                referenciasOriginales: e.rawReferences
            };

            destinos.forEach(dest => {
                const normDest = normalizar(dest);
                if (!mapaAliasPorPalabra[normDest]) {
                    mapaAliasPorPalabra[normDest] = [];
                }
                if (!mapaAliasPorPalabra[normDest].includes(term)) {
                    mapaAliasPorPalabra[normDest].push(term);
                }
            });
        } else if (esArticuloPrincipal && destinos.length > 0) {
            mapaTemasConexos[normTerm] = destinos;
        }
    });

    const listaCompleta = entries.map((e, idx) => {
        let term = e.termino.trim();
        if (term.toLowerCase() === 'acubar') term = 'Acabar';
        const normTerm = normalizar(term);
        const esArticuloPrincipal = vocabKeys.some(k => normalizar(k) === normTerm);
        const destinos = extraerTodosLosTemas(e.rawReferences);
        const letra = term.charAt(0).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        return {
            id: idx + 1,
            termino: term,
            terminoNorm: normTerm,
            tipo: esArticuloPrincipal ? 'ARTICULO_PRINCIPAL' : 'REMISION',
            letra: letra,
            destinos: destinos,
            referenciasRaw: e.rawReferences
        };
    });

    const exportData = {
        mapaRemisiones,
        mapaAliasPorPalabra,
        mapaTemasConexos,
        listaCompleta
    };

    const jsContent = `// Base de datos oficial de Remisiones e Índice Analítico de Xavier Léon-Dufour (Pág 850 a 869)
const INDICE_REMISIONES_DATA = ${JSON.stringify(exportData, null, 2)};
if (typeof window !== 'undefined') { window.INDICE_REMISIONES_DATA = INDICE_REMISIONES_DATA; }
if (typeof globalThis !== 'undefined') { globalThis.INDICE_REMISIONES_DATA = INDICE_REMISIONES_DATA; }
if (typeof module !== 'undefined' && module.exports) { module.exports = INDICE_REMISIONES_DATA; }
`;

    fs.writeFileSync('js/remisiones_data.js', jsContent);
    console.log("Archivo js/remisiones_data.js actualizado con éxito!");

    console.log(`\n• Total de términos de remisión secundaria: ${Object.keys(mapaRemisiones).length}`);
    console.log(`• Total de artículos principales con temas conexos: ${Object.keys(mapaTemasConexos).length}`);
    console.log(`• Total de palabras del vocabulario con remisiones entrantes: ${Object.keys(mapaAliasPorPalabra).length}`);
}

procesarTodoElIndice();
