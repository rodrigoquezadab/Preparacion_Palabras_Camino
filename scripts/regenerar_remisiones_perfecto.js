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

// Mapa de sinónimos canónicos
const sinonimosATema = new Map();

// Mapear cada palabra directa de palabras.json
vocabKeys.forEach(canonical => {
    sinonimosATema.set(normalizar(canonical), canonical);

    // Desglosar nombres con " - ", " y ", " / ", " ("
    if (canonical.includes(' - ')) {
        canonical.split(' - ').forEach(p => {
            if (p.trim().length > 1) sinonimosATema.set(normalizar(p.trim()), canonical);
        });
    }
    if (canonical.includes(' y ')) {
        canonical.split(' y ').forEach(p => {
            if (p.trim().length > 1) sinonimosATema.set(normalizar(p.trim()), canonical);
        });
    }
    if (canonical.includes(' (')) {
        const simple = canonical.replace(/\s*\(.*?\)/g, '').trim();
        if (simple.length > 1) sinonimosATema.set(normalizar(simple), canonical);
    }
});

// Equivalencias manuales específicas y abreviaturas
const equivalencias = [
    // Padre / Padres -> Padres y Padre
    ['padre', 'Padres y Padre'],
    ['padres', 'Padres y Padre'],
    ['paternidad', 'Padres y Padre'],
    ['padres y padre', 'Padres y Padre'],

    // Madre
    ['madre', 'Madre'],
    ['madres', 'Madre'],

    // Hijo
    ['hijo', 'Hijo'],
    ['hijos', 'Hijo'],

    // Hermano
    ['hermano', 'Hermano'],
    ['hermanos', 'Hermano'],

    // Sacerdocio
    ['sacerdote', 'Sacerdocio'],
    ['sacerdotes', 'Sacerdocio'],
    ['sacerdocio', 'Sacerdocio'],
    ['levita', 'Sacerdocio'],
    ['levitas', 'Sacerdocio'],

    // Pastor - Rebaño
    ['pastor', 'Pastor - Rebaño'],
    ['pastores', 'Pastor - Rebaño'],
    ['rebano', 'Pastor - Rebaño'],
    ['rebaño', 'Pastor - Rebaño'],
    ['oveja', 'Pastor - Rebaño'],
    ['ovejas', 'Pastor - Rebaño'],
    ['aprisco', 'Pastor - Rebaño'],

    // Prueba - Tentación
    ['prueba', 'Prueba - Tentación'],
    ['tentacion', 'Prueba - Tentación'],

    // Liberación - Libertad
    ['liberacion', 'Liberación - Libertad'],
    ['libertad', 'Liberación - Libertad'],

    // Hambre y sed
    ['hambre', 'Hambre y sed'],
    ['sed', 'Hambre y sed'],
    ['hambre y sed', 'Hambre y sed'],

    // Lomos y riñones
    ['lomos', 'Lomos y riñones'],
    ['rinones', 'Lomos y riñones'],
    ['riñones', 'Lomos y riñones'],

    // Bien - Mal
    ['bien', 'Bien - Mal'],
    ['mal', 'Bien - Mal'],
    ['bien y mal', 'Bien - Mal'],

    // Enfermedad - Curación
    ['enfermedad', 'Enfermedad - Curación'],
    ['curacion', 'Enfermedad - Curación'],
    ['medico', 'Enfermedad - Curación'],
    ['lepra', 'Lepra'],

    // Penitencia - Conversión
    ['penitencia', 'Penitencia - Conversión'],
    ['conversion', 'Penitencia - Conversión'],
    ['arrepentimiento', 'Penitencia - Conversión'],

    // Dios / Señor / Yahveh
    ['dios', 'Dios'],
    ['yahveh', 'Dios'],
    ['senor', 'Señor'],
    ['señor', 'Señor'],

    // Abreviaturas con "de D."
    ['palabra de d', 'Palabra de Dios'],
    ['palabra de dios', 'Palabra de Dios'],
    ['palabra humana', 'Palabra humana'],
    ['espiritu de d', 'Espíritu de Dios'],
    ['espiritu de dios', 'Espíritu de Dios'],
    ['espiritu santo', 'Espíritu de Dios'],
    ['espiritu', 'Espíritu'],
    ['ira de d', 'Ira'],
    ['ira de dios', 'Ira'],
    ['ira del hombre', 'Ira'],
    ['ira', 'Ira'],
    ['colera', 'Ira'],
    ['designio de d', 'Designio de Dios'],
    ['designio de dios', 'Designio de Dios'],
    ['presencia de d', 'Presencia de Dios'],
    ['presencia de dios', 'Presencia de Dios'],
    ['voluntad de d', 'Voluntad de Dios'],
    ['voluntad de dios', 'Voluntad de Dios'],
    ['dia del s', 'Día del Señor'],
    ['dia del senor', 'Día del Señor'],
    ['dia de yahveh', 'Día del Señor'],
    ['cordero de dios', 'Cordero de Dios'],
    ['cordero', 'Cordero de Dios'],
    ['cuerpo de cristo', 'Cuerpo de Cristo'],
    ['siervo de yahveh', 'Siervo de Yahveh'],
    ['siervo de dios', 'Siervo de Yahveh'],
    ['siervo', 'Siervo de Yahveh'],
    ['hijo del hombre', 'Hijo del hombre'],

    // Plurales y nombres singulares
    ['pobre', 'Pobres'],
    ['pobres', 'Pobres'],
    ['profeta', 'Profeta'],
    ['profetas', 'Profeta'],
    ['apostol', 'Apóstoles'],
    ['apostoles', 'Apóstoles'],
    ['angel', 'Ángeles'],
    ['angeles', 'Ángeles'],
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
    ['rey', 'Rey'],
    ['reyes', 'Rey'],
    ['reino', 'Reino'],
    ['hombre', 'Hombre'],
    ['hombres', 'Hombre'],
    ['mujer', 'Mujer'],
    ['mujeres', 'Mujer'],
    ['nino', 'Niño'],
    ['ninos', 'Niño'],
    ['pedro', 'Pedro'],
    ['san pedro', 'Pedro'],
    ['s pedro', 'Pedro'],
    ['s. pedro', 'Pedro'],
    ['maria', 'María'],
    ['sencillo', 'Sencillo'],
    ['sencillez', 'Sencillo'],
    ['hipocrita', 'Hipócrita'],
    ['hipocresia', 'Hipócrita'],
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
    ['justificacion', 'Justificación'],
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
    ['fidelidad', 'Fidelidad'],
    ['verdad', 'Verdad'],
    ['iluminacion', 'Luz'],
    ['luz', 'Luz'],
    ['oscuridad', 'Sombra'],
    ['tinieblas', 'Sombra'],
    ['sombra', 'Sombra'],
    ['oleo', 'Aceite'],
    ['aceite', 'Aceite'],
    ['ungido', 'Unción'],
    ['uncion', 'Unción'],
    ['cosecha', 'Siega'],
    ['siega', 'Siega'],
    ['vina', 'Viña'],
    ['viña', 'Viña'],
    ['vino', 'Vino'],
    ['pan', 'Pan'],
    ['fuego', 'Fuego'],
    ['agua', 'Agua'],
    ['sangre', 'Sangre'],
    ['carne', 'Carne'],
    ['cuerpo', 'Cuerpo'],
    ['alma', 'Alma'],
    ['corazon', 'Corazón'],
    ['mesias', 'Mesías'],
    ['jesus', 'Jesús'],
    ['cristo', 'Jesús'],
    ['jesucristo', 'Jesús'],
    ['eucaristia', 'Eucaristía'],
    ['pascua', 'Pascua'],
    ['confesion', 'Confesión'],
    ['comunion', 'Comunión'],
    ['confianza', 'Confianza'],
    ['fe', 'Fe'],
    ['esperanza', 'Esperanza'],
    ['amor', 'Amor'],
    ['caridad', 'Amor'],
    ['bautismo', 'Bautismo'],
    ['resurreccion', 'Resurrección'],
    ['cruz', 'Cruz'],
    ['exilio', 'Exilio'],
    ['cautividad', 'Cautividad'],
    ['esclavo', 'Esclavo'],
    ['servir', 'Servir'],
    ['templo', 'Templo'],
    ['altar', 'Altar'],
    ['sacrificio', 'Sacrificio'],
    ['expiacion', 'Expiación'],
    ['dispersion', 'Dispersión'],
    ['pueblo', 'Pueblo'],
    ['unidad', 'Unidad'],
    ['paz', 'Paz'],
    ['reconciliacion', 'Reconciliación'],
    ['calamidad', 'Calamidad'],
    ['plenitud', 'Plenitud'],
    ['cumplir', 'Cumplir'],
    ['trabajo', 'Trabajo'],
    ['proceso', 'Proceso'],
    ['satan', 'Satán'],
    ['demonio', 'Demonios'],
    ['demonios', 'Demonios'],
    ['anticristo', 'Anticristo'],
    ['esposo', 'Esposo'],
    ['esposa', 'Esposo'],
    ['matrimonio', 'Matrimonio'],
    ['casa', 'Casa'],
    ['sembrar', 'Sembrar'],
    ['fruto', 'Fruto'],
    ['tierra', 'Tierra'],
    ['parabola', 'Parábola'],
    ['figura', 'Figura'],
    ['montana', 'Montaña'],
    ['montaña', 'Montaña'],
    ['nube', 'Nube'],
    ['ascension', 'Ascensión'],
    ['cielo', 'Cielo'],
    ['paraiso', 'Paraíso'],
    ['infierno', 'Infierno'],
    ['mar', 'Mar'],
    ['creacion', 'Creación'],
    ['rodilla', 'Rodilla'],
    ['adoracion', 'Adoración'],
    ['silencio', 'Silencio'],
    ['soledad', 'Soledad'],
    ['sueno', 'Sueño'],
    ['sueño', 'Sueño'],
    ['velar', 'Velar'],
    ['tiempo', 'Tiempo'],
    ['hora', 'Hora'],
    ['semana', 'Semana'],
    ['sabado', 'Sábado'],
    ['fiestas', 'Fiestas'],
    ['vestido', 'Vestido'],
    ['blanco', 'Blanco'],
    ['nuevo', 'Nuevo'],
    ['herencia', 'Herencia'],
    ['promesas', 'Promesas'],
    ['bendicion', 'Bendición'],
    ['maldicion', 'Maldición'],
    ['amen', 'Amén'],
    ['amigo', 'Amigo'],
    ['enemigo', 'Enemigo'],
    ['odio', 'Odio'],
    ['venganza', 'Venganza'],
    ['mansedumbre', 'Mansedumbre'],
    ['humildad', 'Humildad'],
    ['gloria', 'Gloria'],
    ['poder', 'Poder'],
    ['autoridad', 'Autoridad'],
    ['fuerza', 'Fuerza'],
    ['misericordia', 'Misericordia'],
    ['perdon', 'Perdón'],
    ['gracia', 'Gracia'],
    ['don', 'Don'],
    ['eleccion', 'Elección'],
    ['primicias', 'Primicias'],
    ['diezmo', 'Primicias'],
    ['ayuno', 'Ayuno'],
    ['comida', 'Comida'],
    ['alimento', 'Alimento'],
    ['leche', 'Leche'],
    ['mana', 'Maná'],
    ['copa', 'Copa'],
    ['caliz', 'Copa'],
    ['embriaguez', 'Embriaguez'],
    ['arbol', 'Árbol'],
    ['jerusalen', 'Jerusalén'],
    ['puerta', 'Puerta'],
    ['camino', 'Camino'],
    ['seguir', 'Seguir'],
    ['discipulo', 'Discípulo'],
    ['escuchar', 'Escuchar'],
    ['ensenar', 'Enseñar'],
    ['educacion', 'Educación'],
    ['ejemplo', 'Ejemplo'],
    ['exhortar', 'Exhortar'],
    ['consolacion', 'Consolación'],
    ['paciencia', 'Paciencia'],
    ['persecucion', 'Persecución'],
    ['sufrimiento', 'Sufrimiento'],
    ['tristeza', 'Tristeza'],
    ['reposo', 'Reposo'],
    ['victoria', 'Victoria'],
    ['guerra', 'Guerra'],
    ['escandalo', 'Escándalo'],
    ['endurecimiento', 'Endurecimiento'],
    ['ver', 'Ver'],
    ['lengua', 'Lengua'],
    ['labios', 'Labios'],
    ['rostro', 'Rostro'],
    ['diestra', 'Diestra'],
    ['brazo', 'Brazo'],
    ['roca', 'Roca'],
    ['piedra', 'Piedra'],
    ['edificar', 'Edificar'],
    ['temor', 'Temor'],
    ['visita', 'Visita'],
    ['juicio', 'Juicio'],
    ['retribucion', 'Retribución'],
    ['santo', 'Santo'],
    ['puro', 'Puro'],
    ['circuncision', 'Circuncisión'],
    ['imposicion de manos', 'Imposición de manos'],
    ['incredulidad', 'Incredulidad'],
    ['error', 'Error'],
    ['mentira', 'Mentira'],
    ['locura', 'Locura'],
    ['revelacion', 'Revelación'],
    ['misterio', 'Misterio'],
    ['perfeccion', 'Perfección'],
    ['limosna', 'Limosna'],
    ['hebreo', 'Hebreo'],
    ['israel', 'Israel'],
    ['judio', 'Judío'],
    ['juan bautista', 'Juan Bautista'],
    ['david', 'David'],
    ['abraham', 'Abraham'],
    ['adan', 'Adán'],
    ['elias', 'Elías'],
    ['moises', 'Moisés'],
    ['egipto', 'Egipto'],
    ['babel', 'Babel - Babilonia'],
    ['babilonia', 'Babel - Babilonia'],
    ['esterilidad', 'Esterilidad'],
    ['fecundidad', 'Fecundidad'],
    ['virginidad', 'Virginidad'],
    ['generacion', 'Generación'],
    ['gustar', 'Gustar'],
    ['hospitalidad', 'Hospitalidad'],
    ['libro', 'Libro'],
    ['lampara', 'Lámpara'],
    ['mediador', 'Mediador'],
    ['memoria', 'Memoria'],
    ['ministerio', 'Ministerio'],
    ['mundo', 'Mundo'],
    ['nacimiento', 'Nacimiento (nuevo)'],
    ['noche', 'Noche'],
    ['nombre', 'Nombre'],
    ['numeros', 'Números'],
    ['obediencia', 'Obediencia'],
    ['paraclito', 'Paráclito'],
    ['pentecostes', 'Pentecostés'],
    ['permanecer', 'Permanecer'],
    ['piedad', 'Piedad'],
    ['projimo', 'Prójimo'],
    ['reir', 'Risa'],
    ['risa', 'Risa'],
    ['tempestad', 'Tormenta'],
    ['tormenta', 'Tormenta'],
    ['rayo', 'Tormenta'],
    ['relampago', 'Tormenta'],
    ['profano', 'Santo'],
    ['soberbia', 'Soberbia'],
    ['tormenta', 'Tormenta'],
    ['tradicion', 'Tradición'],
    ['transfiguracion', 'Transfiguración'],
    ['verguenza', 'Vergüenza'],
    ['exodo', 'Éxodo']
];

equivalencias.forEach(([alias, oficial]) => {
    const foundKey = vocabKeys.find(k => normalizar(k) === normalizar(oficial));
    if (foundKey) {
        sinonimosATema.set(normalizar(alias), foundKey);
    }
});

// Función extractora mejorada para procesar fragmentos
function extraerTodosLosTemas(textoReferencias) {
    if (!textoReferencias) return [];

    let clean = textoReferencias
        .replace(/—/g, ' — ')
        .replace(/–/g, ' — ')
        .replace(/\s+-\s+/g, ' — ')
        .replace(/\s+/g, ' ');

    const fragmentos = clean.split(/\s*(?:—|–|\s+-\s+|,|\/)\s*/);
    const temasDetectados = new Set();

    fragmentos.forEach(frag => {
        let f = frag.trim();
        if (!f) return;

        f = f.replace(/^[•\-\*\—\s\.\d~]+|[•\-\*\—\s\.\d~]+$/g, '').trim();
        
        const words = f.split(' ');
        
        // Buscar candidatos de 4 palabras, 3 palabras, 2 palabras, 1 palabra
        for (let start = 0; start < words.length; start++) {
            for (let len = Math.min(4, words.length - start); len >= 1; len--) {
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

// Parsear todo el índice de nuevo
function parsearIndiceCompleto() {
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

    // Mapas
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
    console.log("Archivo js/remisiones_data.js regenerado con éxito!");

    // Comprobación específica de Abba y otras
    console.log("\n=== COMPROBACIÓN DE ABBA Y OTRAS ENTRADAS CLAVE ===");
    const testList = ['abba', 'aaron', 'adopcion', 'adulterio', 'afliccion', 'agricultura', 'acogida', 'alimento', 'yugo'];
    testList.forEach(t => {
        const item = listaCompleta.find(l => l.terminoNorm === t);
        if (item) {
            console.log(`• "${item.termino}" (${item.tipo})`);
            console.log(`  Raw: "${item.referenciasRaw}"`);
            console.log(`  Destinos [${item.destinos.length}]:`, item.destinos);
        }
    });
}

parsearIndiceCompleto();
