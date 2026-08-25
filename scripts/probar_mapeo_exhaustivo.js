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

// Mapear cada palabra directa
vocabKeys.forEach(canonical => {
    sinonimosATema.set(normalizar(canonical), canonical);

    // Desglosar nombres con " - ", " y ", " / ", " ("
    if (canonical.includes(' - ')) {
        canonical.split(' - ').forEach(p => sinonimosATema.set(normalizar(p), canonical));
    }
    if (canonical.includes(' y ')) {
        canonical.split(' y ').forEach(p => sinonimosATema.set(normalizar(p), canonical));
    }
    if (canonical.includes(' (')) {
        const simple = canonical.replace(/\s*\(.*?\)/g, '');
        sinonimosATema.set(normalizar(simple), canonical);
    }
});

// Equivalencias manuales exhaustivas para Léon-Dufour
const equivalencias = [
    // Padre / Padres
    ['padre', 'Padres y Padre'],
    ['padres', 'Padres y Padre'],
    ['padres y padre', 'Padres y Padre'],
    ['paternidad', 'Padres y Padre'],
    ['papa', 'Padres y Padre'],

    // Madre
    ['madre', 'Madre'],
    ['madres', 'Madre'],
    ['maternidad', 'Madre'],

    // Hijo / Hijos
    ['hijo', 'Hijo'],
    ['hijos', 'Hijo'],
    ['filiacion', 'Hijo'],

    // Hermano / Hermanos
    ['hermano', 'Hermano'],
    ['hermanos', 'Hermano'],
    ['fraternidad', 'Hermano'],

    // Sacerdocio / Sacerdote
    ['sacerdote', 'Sacerdocio'],
    ['sacerdotes', 'Sacerdocio'],
    ['sacerdocio', 'Sacerdocio'],
    ['levita', 'Sacerdocio'],
    ['levitas', 'Sacerdocio'],

    // Pastor / Rebaño
    ['pastor', 'Pastor - Rebaño'],
    ['pastores', 'Pastor - Rebaño'],
    ['rebano', 'Pastor - Rebaño'],
    ['rebaño', 'Pastor - Rebaño'],
    ['oveja', 'Pastor - Rebaño'],
    ['ovejas', 'Pastor - Rebaño'],
    ['aprisco', 'Pastor - Rebaño'],

    // Prueba / Tentación
    ['prueba', 'Prueba - Tentación'],
    ['tentacion', 'Prueba - Tentación'],
    ['tentaciones', 'Prueba - Tentación'],

    // Liberación / Libertad
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

    // Enfermedad - Curación / Médico
    ['enfermedad', 'Enfermedad - Curación'],
    ['curacion', 'Enfermedad - Curación'],
    ['medico', 'Enfermedad - Curación'],
    ['lepra', 'Enfermedad - Curación'],

    // Penitencia - Conversión
    ['penitencia', 'Penitencia - Conversión'],
    ['conversion', 'Penitencia - Conversión'],
    ['arrepentimiento', 'Penitencia - Conversión'],

    // Dios y Nombres divinos
    ['dios', 'Dios'],
    ['yahveh', 'Dios'],
    ['senor', 'Dios'],
    ['señor', 'Dios'],

    // Expresiones con "de Dios" / "de D."
    ['palabra de d', 'Palabra de Dios'],
    ['palabra de dios', 'Palabra de Dios'],
    ['palabra', 'Palabra de Dios'],
    ['palabra humana', 'Palabra de Dios'],
    ['escritura', 'Escritura'],
    ['escrituras', 'Escritura'],
    ['espiritu de d', 'Espíritu de Dios'],
    ['espiritu de dios', 'Espíritu de Dios'],
    ['espiritu', 'Espíritu'],
    ['espiritu santo', 'Espíritu de Dios'],
    ['ira de d', 'Ira'],
    ['ira de dios', 'Ira'],
    ['ira del hombre', 'Ira'],
    ['ira', 'Ira'],
    ['colera', 'Ira'],
    ['designio de d', 'Designio de Dios'],
    ['designio de dios', 'Designio de Dios'],
    ['designio', 'Designio de Dios'],
    ['presencia de d', 'Presencia de Dios'],
    ['presencia de dios', 'Presencia de Dios'],
    ['presencia', 'Presencia de Dios'],
    ['voluntad de d', 'Voluntad de Dios'],
    ['voluntad de dios', 'Voluntad de Dios'],
    ['voluntad', 'Voluntad de Dios'],
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

    // Plurales y Variantes gramaticales
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
    ['corazon', 'Corazón'],
    ['mesias', 'Mesías'],
    ['jesus', 'Jesús'],
    ['cristo', 'Jesucristo'],
    ['jesucristo', 'Jesucristo'],
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
    ['servicio', 'Servir'],
    ['siervo', 'Servir'],
    ['templo', 'Templo'],
    ['altar', 'Altar'],
    ['sacrificio', 'Sacrificio'],
    ['expiacion', 'Expiación'],
    ['dispersion', 'Dispersión'],
    ['pueblo', 'Pueblo'],
    ['unidad', 'Unidad'],
    ['paz', 'Paz'],
    ['reconciliacion', 'Paz'],
    ['calamidad', 'Calamidad'],
    ['castigo', 'Castigos'],
    ['sombra', 'Sombra'],
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
    ['familia', 'Casa'],
    ['casa', 'Casa'],
    ['sembrar', 'Sembrar'],
    ['siembra', 'Sembrar'],
    ['fruto', 'Fruto'],
    ['tierra', 'Tierra'],
    ['parabola', 'Parábola'],
    ['figura', 'Figura'],
    ['simbolo', 'Figura'],
    ['montana', 'Montaña'],
    ['montaña', 'Montaña'],
    ['nube', 'Nube'],
    ['ascension', 'Ascensión'],
    ['cielo', 'Cielo'],
    ['paraíso', 'Paraíso'],
    ['paraiso', 'Paraíso'],
    ['infierno', 'Infierno'],
    ['mar', 'Mar'],
    ['abismo', 'Mar'],
    ['creacion', 'Creación'],
    ['rodilla', 'Rodilla'],
    ['adoracion', 'Adoración'],
    ['silencio', 'Silencio'],
    ['soledad', 'Soledad'],
    ['sueno', 'Sueño'],
    ['sueño', 'Sueño'],
    ['velar', 'Velar'],
    ['vigilancia', 'Velar'],
    ['tiempo', 'Tiempo'],
    ['hora', 'Hora'],
    ['semana', 'Semana'],
    ['sabado', 'Sábado'],
    ['fiestas', 'Fiestas'],
    ['vestido', 'Vestido'],
    ['blanco', 'Blanco'],
    ['nuevo', 'Nuevo'],
    ['antiguo', 'Nuevo'],
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
    ['orgullo', 'Orgullo'],
    ['gloria', 'Gloria'],
    ['poder', 'Poder'],
    ['autoridad', 'Autoridad'],
    ['fuerza', 'Fuerza'],
    ['debilidad', 'Fuerza'],
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
    ['sal', 'Sal'],
    ['levadura', 'Levadura'],
    ['arbol', 'Árbol'],
    ['viña', 'Viña'],
    ['vina', 'Viña'],
    ['ciudad', 'Ciudad'],
    ['jerusalen', 'Jerusalén'],
    ['sion', 'Sión'],
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
    ['alegria', 'Gozo'],
    ['paz', 'Paz'],
    ['reposo', 'Reposo'],
    ['victoria', 'Victoria'],
    ['guerra', 'Guerra'],
    ['combate', 'Combate'],
    ['armas', 'Guerra'],
    ['escandalo', 'Escándalo'],
    ['endurecimiento', 'Endurecimiento'],
    ['ceguera', 'Ceguera'],
    ['ver', 'Ver'],
    ['vision', 'Ver'],
    ['ojo', 'Ojo'],
    ['oido', 'Oído'],
    ['lengua', 'Lengua'],
    ['labios', 'Labios'],
    ['boca', 'Boca'],
    ['rostro', 'Rostro'],
    ['mano', 'Mano'],
    ['diestra', 'Diestra'],
    ['brazo', 'Brazo'],
    ['pies', 'Pie'],
    ['pie', 'Pie'],
    ['cabeza', 'Cabeza'],
    ['cabellos', 'Cabellos'],
    ['vestidura', 'Vestido'],
    ['manto', 'Vestido'],
    ['arca', 'Arca'],
    ['tabernaculo', 'Templo'],
    ['santuario', 'Templo'],
    ['tienda', 'Tienda'],
    ['roca', 'Roca'],
    ['piedra', 'Piedra'],
    ['fundamento', 'Edificar'],
    ['edificar', 'Edificar'],
    ['casa', 'Casa'],
    ['temor', 'Temor de Dios'],
    ['temor de dios', 'Temor de Dios'],
    ['temer', 'Temor de Dios'],
    ['visita', 'Visita'],
    ['juicio', 'Juicio'],
    ['retribucion', 'Retribución'],
    ['recompensa', 'Retribución'],
    ['merito', 'Retribución'],
    ['salvacion', 'Salvación'],
    ['liberacion', 'Liberación - Libertad'],
    ['redencion', 'Redención'],
    ['santidad', 'Santo'],
    ['santo', 'Santo'],
    ['puro', 'Puro'],
    ['impuro', 'Puro'],
    ['limpieza', 'Puro'],
    ['circuncision', 'Circuncisión'],
    ['bautismo', 'Bautismo'],
    ['uncion', 'Unción'],
    ['imposicion de manos', 'Imposición de manos'],
    ['vocacion', 'Vocación'],
    ['mision', 'Misión'],
    ['apostoles', 'Apóstoles'],
    ['profeta', 'Profeta'],
    ['pastor', 'Pastor - Rebaño'],
    ['doctrina', 'Enseñar'],
    ['evangelio', 'Evangelio'],
    ['predicar', 'Predicar'],
    ['anuncio', 'Evangelio'],
    ['fe', 'Fe'],
    ['creer', 'Fe'],
    ['incredulidad', 'Incredulidad'],
    ['duda', 'Incredulidad'],
    ['error', 'Error'],
    ['mentira', 'Mentira'],
    ['verdad', 'Verdad'],
    ['sabiduria', 'Sabiduría'],
    ['locura', 'Locura'],
    ['revelacion', 'Revelación'],
    ['misterio', 'Misterio'],
    ['apocalipsis', 'Revelación'],
    ['figura', 'Figura'],
    ['tipo', 'Figura'],
    ['cumplimiento', 'Cumplir'],
    ['plenitud', 'Plenitud'],
    ['perfeccion', 'Perfección'],
    ['justicia', 'Justicia'],
    ['santificacion', 'Santo']
];

equivalencias.forEach(([alias, oficial]) => {
    // Buscar la clave canónica en vocabKeys
    const foundKey = vocabKeys.find(k => normalizar(k) === normalizar(oficial));
    if (foundKey) {
        sinonimosATema.set(normalizar(alias), foundKey);
    } else {
        console.warn(`No se encontró clave canónica para '${oficial}'`);
    }
});

console.log(`Total de sinónimos mapeados: ${sinonimosATema.size}`);

// Probar extracción de Abba
function testExtraccion(texto) {
    let clean = texto
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

const resAbba = testExtraccion('Adoración n 3 — Hijo NT i 1 — Oración rv 2. v 2 d — Padres v 1. vi');
console.log('Resultado para Abba:', resAbba);
