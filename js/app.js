// ==========================================================================
// PREPARACIÓN DE PALABRAS DEL CAMINO NEOCATECUMENAL
// Basado en el Vocabulario de Teología Bíblica de Xavier Léon-Dufour
// ==========================================================================

// --- UTILIDADES GLOBALES ---
function normalizar(s) {
    if (!s) return "";
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// --- ORDEN CANÓNICO BÍBLICO (73 Libros) ---
const ORDEN_BIBLICO = [
    "GEN", "EX", "LEV", "NUM", "DT", "JOS", "JUE", "RUT", "1SAM", "2SAM", "1RE", "2RE", "1CRO", "2CRO", "ESD", "NEH", "TOB", "JUD", "EST", "1MAC", "2MAC",
    "JOB", "SAL", "PROV", "ECL", "CANT", "SAB", "ECLO",
    "IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL",
    "MT", "MC", "LC", "JN", "HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"
];

const mapOrdenBiblico = {};
ORDEN_BIBLICO.forEach((libro, i) => { mapOrdenBiblico[libro] = i; });
const getIndiceLibro = (l) => {
    if (!l) return 999;
    const k = l.toUpperCase().trim();
    return mapOrdenBiblico[k] !== undefined ? mapOrdenBiblico[k] : 999;
};

// --- NOMBRES COMPLETOS DE LIBROS ---
const NOMBRES_LIBROS = {
    GEN: "Génesis", EX: "Éxodo", LEV: "Levítico", NUM: "Números", DT: "Deuteronomio",
    JOS: "Josué", JUE: "Jueces", RUT: "Rut", "1SAM": "1 Samuel", "2SAM": "2 Samuel",
    "1RE": "1 Reyes", "2RE": "2 Reyes", "1CRO": "1 Crónicas", "2CRO": "2 Crónicas",
    ESD: "Esdras", NEH: "Nehemías", TOB: "Tobías", JUD: "Judit", EST: "Ester",
    "1MAC": "1 Macabeos", "2MAC": "2 Macabeos", JOB: "Job", SAL: "Salmos",
    PROV: "Proverbios", ECL: "Eclesiastés", CANT: "Cantar de los Cantares",
    SAB: "Sabiduría", ECLO: "Eclesiástico", IS: "Isaías", JER: "Jeremías",
    LAM: "Lamentaciones", BAR: "Baruc", EZ: "Ezequiel", DAN: "Daniel",
    OS: "Oseas", JL: "Joel", AM: "Amós", ABD: "Abdías", JON: "Jonás",
    MIQ: "Miqueas", NAH: "Nahúm", HAB: "Habacuc", SOF: "Sofonías", AG: "Ageo",
    ZAC: "Zacarías", MAL: "Malaquías", MT: "Mateo", MC: "Marcos", LC: "Lucas",
    JN: "Juan", HCH: "Hechos de los Apóstoles", ROM: "Romanos", "1COR": "1 Corintios",
    "2COR": "2 Corintios", GAL: "Gálatas", EF: "Efesios", FLP: "Filipenses",
    COL: "Colosenses", "1TES": "1 Tesalonicenses", "2TES": "2 Tesalonicenses",
    "1TIM": "1 Timoteo", "2TIM": "2 Timoteo", TIT: "Tito", FLM: "Filemón",
    HEB: "Hebreos", ST: "Santiago", "1PE": "1 Pedro", "2PE": "2 Pedro",
    "1JN": "1 Juan", "2JN": "2 Juan", "3JN": "3 Juan", JUDAS: "Judas", AP: "Apocalipsis"
};

// --- LIBROS DEL PENTATEUCO (Torá / Ley: 5 libros) ---
const LIBROS_PENTATEUCO = new Set(["GEN", "EX", "LEV", "NUM", "DT"]);
const esPentateuco = (l) => {
    if (!l) return false;
    return LIBROS_PENTATEUCO.has(l.toUpperCase().trim());
};

const esPalabraCompleta = (item, soloPentateuco = false) => {
    if (!item) return false;
    const histCount = soloPentateuco ? (item.pent || 0) : (item.hist || 0);
    return (histCount > 0 && (item.prof || 0) > 0 && (item.nt || 0) > 0 && (item.ev || 0) > 0);
};

// --- LISTA PREDETERMINADA DE PALABRAS EXCLUIDAS (YA CELEBRADAS) ---
const EXCLUSIONES_PREDETERMINADAS = [
    "Escuchar",       // #45
    "Aceite",         // #2
    "Fiesta",         // #57
    "Memorial",       // #83
    "Roca",           // #121
    "Discípulo",      // #40
    "Niño",           // #90
    "Adán",           // #4
    "Copa",           // #26
    "Bautismo",       // #11
    "Agua",           // #1
    "Piedra",         // #105
    "Árbol",          // #8
    "Camino",         // #15
    "Casa",           // #19
    "Comida",         // #21
    "Amén",           // #3
    "Sello",          // #129
    "Victoria",       // #146
    "Mar",            // #81
    "Misericordia",   // #147
    "Fariseo",        // #55
    "Llave",          // #78
    "Puerta",         // #112
    "Aleluya",
    "Alabanza",       // #5
    "Amigo",          // #7
    "Esposo"          // #48
];

function obtenerExclusionesIniciales() {
    const versionInit = localStorage.getItem('palabrasExcluidas_init_v2');
    const guardadas = localStorage.getItem('palabrasExcluidas');

    if (versionInit && guardadas !== null) {
        try {
            return JSON.parse(guardadas);
        } catch (e) {
            console.error("Error parseando palabrasExcluidas:", e);
        }
    }

    // Carga inicial por defecto con la lista predeterminada
    const listaInicial = EXCLUSIONES_PREDETERMINADAS.map(p => normalizar(p));
    localStorage.setItem('palabrasExcluidas_init_v2', 'true');
    localStorage.setItem('palabrasExcluidas', JSON.stringify(listaInicial));
    return listaInicial;
}

// --- VARIABLES GLOBALES DE ESTADO ---
let dataGlobalRef = null;
let listaGlobal = [];
let dbTextos = {};
let setExcluidos = new Set(obtenerExclusionesIniciales());
let setPalabrasExistentes = new Set();
let palabraAbiertaId = null;

// Estado de la Calculadora de Participantes
let palabraCalculadoraActual = null;
let numParticipantesActual = 4;

// Estado de Artículo Teológico
let articuloActual = null;

// Filtro de Modo (Precatecumenado vs Vocabulario Completo)
let modoFiltro = "precat"; // "precat" (por defecto) o "todas"

// --- ELEMENTOS DEL DOM ---
const contenedorLista = document.getElementById("contenedorPalabras");
const infoStats = document.getElementById("infoStats");
const inputBusqueda = document.getElementById("inputBusqueda");
const selectOrden = document.getElementById("selectOrden");
const btnModoPrecat = document.getElementById("btnModoPrecat");
const btnModoTodas = document.getElementById("btnModoTodas");
const checkPentateuco = document.getElementById("checkPentateuco");
const checkExtras = document.getElementById("checkExtras");
const checkPericopas = document.getElementById("checkPericopas");
const checkSoloCompletas = document.getElementById("checkSoloCompletas");
const inputExcluir = document.getElementById("inputExcluir");
const btnAgregarExclusion = document.getElementById("btnAgregarExclusion");
const countExcluidasHeader = document.getElementById("countExcluidasHeader");
const btnBorrarTodasExclusiones = document.getElementById("btnBorrarTodasExclusiones");
const btnRestaurarExclusiones = document.getElementById("btnRestaurarExclusiones");
const contenedorTags = document.getElementById("contenedorTags");
const seccionBusqueda = document.getElementById("seccionBusqueda") || document.querySelector(".search-section");
const btnToggleSearch = document.getElementById("btnToggleSearch");
const btnToggleTema = document.getElementById("btnToggleTema");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const panelFiltros = document.getElementById("panelFiltros");
const btnToggleFiltros = document.getElementById("btnToggleFiltros");
const badgeExcluidas = document.getElementById("badgeExcluidas");

// Modal de Lectura Bíblica
const modalLectura = document.getElementById("modalLectura");
const modalTitulo = document.getElementById("modalTitulo");
const modalSubtitulo = document.getElementById("modalSubtitulo");
const modalTextoCuerpo = document.getElementById("modalTextoCuerpo");
const btnCerrarModal = document.getElementById("btnCerrarModal");
const btnCopiarModal = document.getElementById("btnCopiarModal");
let citaModalActual = null;

// Modal de Calculadora de Participantes
const modalCalculadora = document.getElementById("modalCalculadora");
const calcModalTitulo = document.getElementById("calcModalTitulo");
const calcModalSubtitulo = document.getElementById("calcModalSubtitulo");
const btnCerrarCalcModal = document.getElementById("btnCerrarCalcModal");
const btnCerrarCalcModalBottom = document.getElementById("btnCerrarCalcModalBottom");
const btnDecPart = document.getElementById("btnDecPart");
const btnIncPart = document.getElementById("btnIncPart");
const numPartDisplay = document.getElementById("numPartDisplay");
const chipNums = document.querySelectorAll(".chip-num");
const calcCheckUnido = document.getElementById("calcCheckUnido");
const calcCheckPentateuco = document.getElementById("calcCheckPentateuco");
const calcCheckExtras = document.getElementById("calcCheckExtras");
const calcSelectCriterio = document.getElementById("calcSelectCriterio");
const calcBalanceIndicator = document.getElementById("calcBalanceIndicator");
const calcSummaryText = document.getElementById("calcSummaryText");
const contenedorHermanos = document.getElementById("contenedorHermanos");
const btnCopiarRepartoCompleto = document.getElementById("btnCopiarRepartoCompleto");

// Modal de Artículo Teológico de Léon-Dufour
const modalArticulo = document.getElementById("modalArticulo");
const articuloModalTitulo = document.getElementById("articuloModalTitulo");
const articuloModalSubtitulo = document.getElementById("articuloModalSubtitulo");
const articuloModalCuerpo = document.getElementById("articuloModalCuerpo");
const btnCerrarArticuloModal = document.getElementById("btnCerrarArticuloModal");
const btnCerrarArticuloModalBottom = document.getElementById("btnCerrarArticuloModalBottom");
const btnCopiarArticulo = document.getElementById("btnCopiarArticulo");

// Toast de notificación
const toast = document.getElementById("toast");

function mostrarToast(mensaje, duracion = 2500) {
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, duracion);
}

// --- ORDENACIÓN CANÓNICA DE CITAS ---
function ordenarCitasAsc(citas) {
    if (!citas || citas.length === 0) return [];
    return [...citas].sort((a, b) => {
        const idxA = getIndiceLibro(a.libro);
        const idxB = getIndiceLibro(b.libro);
        if (idxA !== idxB) return idxA - idxB;
        const capA = parseInt(a.capitulo, 10) || 0;
        const capB = parseInt(b.capitulo, 10) || 0;
        if (capA !== capB) return capA - capB;
        const verA = parseInt(a.versiculoInicio, 10) || 0;
        const verB = parseInt(b.versiculoInicio, 10) || 0;
        return verA - verB;
    });
}

// --- ALGORITMO DE UNIÓN DE INTERVALOS Y SEGMENTOS CONTIGUOS (PERÍCOPAS) ---
function obtenerRango(cita) {
    let inicio = parseInt(cita.versiculoInicio, 10);
    let fin = parseInt(cita.versiculoFin, 10);
    if (isNaN(inicio) || inicio === null || inicio === undefined) {
        return { start: 1, end: 9999, esCompleto: true };
    }
    if (cita.continuidad === 's') fin = inicio + 1;
    else if (cita.continuidad === 'ss') fin = 9999;
    else if (isNaN(fin) || !fin) fin = inicio;
    return { start: inicio, end: fin, esCompleto: false };
}

function unirSegmentosContiguos(citas) {
    if (!citas || citas.length <= 1) return citas || [];

    const grupos = {};
    citas.forEach(c => {
        const key = `${c.libro}-${c.capitulo}`;
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(c);
    });

    const resultado = [];

    Object.values(grupos).forEach(lista => {
        if (lista.length === 1) {
            resultado.push(lista[0]);
            return;
        }

        // Si hay una cita de capítulo completo, prevalece
        const capCompleto = lista.find(c => isNaN(parseInt(c.versiculoInicio, 10)) || c.versiculoInicio === null);
        if (capCompleto) {
            resultado.push({
                ...capCompleto,
                citaOriginal: `${capCompleto.libro} ${capCompleto.capitulo}`,
                versiculoInicio: null,
                versiculoFin: null,
                continuidad: null
            });
            return;
        }

        // Mapear intervalos [start, end]
        const intervals = lista.map(c => {
            const r = obtenerRango(c);
            return {
                start: r.start,
                end: r.end,
                categoria: c.categoria,
                libro: c.libro,
                libroNombre: c.libroNombre || NOMBRES_LIBROS[c.libro] || c.libro,
                capitulo: c.capitulo,
                textoRef: c.textoRef
            };
        });

        // Ordenar intervalos por inicio ascendente y fin descendente
        intervals.sort((a, b) => a.start !== b.start ? a.start - b.start : b.end - a.end);

        // Fusión matemática de intervalos solapados o contiguos (start <= prev.end + 1)
        const merged = [];
        let current = intervals[0];

        for (let i = 1; i < intervals.length; i++) {
            const next = intervals[i];
            if (next.start <= current.end + 1) {
                current.end = Math.max(current.end, next.end);
            } else {
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);

        // Reconstruir citas formateadas
        merged.forEach(m => {
            let citaTexto = `${m.libro} ${m.capitulo}`;
            if (m.start === 1 && m.end >= 9990) {
                citaTexto = `${m.libro} ${m.capitulo}`;
            } else if (m.start === m.end) {
                citaTexto = `${m.libro} ${m.capitulo},${m.start}`;
            } else if (m.end >= 9990) {
                citaTexto = `${m.libro} ${m.capitulo},${m.start}ss`;
            } else {
                citaTexto = `${m.libro} ${m.capitulo},${m.start}-${m.end}`;
            }

            resultado.push({
                citaOriginal: citaTexto,
                categoria: m.categoria,
                libro: m.libro,
                libroNombre: m.libroNombre,
                capitulo: m.capitulo,
                versiculoInicio: m.start >= 9990 ? null : m.start,
                versiculoFin: (m.end >= 9990 || m.start === m.end) ? null : m.end,
                continuidad: m.end >= 9990 ? 'ss' : null,
                textoRef: m.textoRef
            });
        });
    });

    return ordenarCitasAsc(resultado);
}

// ==========================================================================
// LISTA OFICIAL DEL PRECATECUMENADO DEL CAMINO NEOCATECUMENAL (148 PALABRAS)
// ==========================================================================
const LISTA_PRECATECUMENADO_148 = [
  { num: 1, nombre: "Agua", vocabKey: "Agua" },
  { num: 2, nombre: "Aceite", vocabKey: "Aceite" },
  { num: 3, nombre: "Amén", vocabKey: "Amén" },
  { num: 4, nombre: "Adán", vocabKey: "Adán" },
  { num: 5, nombre: "Alabanza", vocabKey: "Alabanza" },
  { num: 6, nombre: "Alianza", vocabKey: "Alianza" },
  { num: 7, nombre: "Amigo", vocabKey: "Amigo" },
  { num: 8, nombre: "Árbol", vocabKey: "Árbol" },
  { num: 9, nombre: "Amor", vocabKey: "Amor" },
  { num: 10, nombre: "Banquete", vocabKey: "Comida", subInfo: "Léon-Dufour: Comida" },
  { num: 11, nombre: "Bautismo", vocabKey: "Bautismo" },
  { num: 12, nombre: "Bendición", vocabKey: "Bendición" },
  { num: 13, nombre: "Cabeza", vocabKey: "Cuerpo de Cristo", subInfo: "Léon-Dufour: Cuerpo de Cristo" },
  { num: 14, nombre: "Cáliz", vocabKey: "Copa", subInfo: "Léon-Dufour: Copa" },
  { num: 15, nombre: "Camino", vocabKey: "Camino" },
  { num: 16, nombre: "Caridad", vocabKey: "Amor", subInfo: "Léon-Dufour: Amor" },
  { num: 17, nombre: "Carisma", vocabKey: "Carisma" },
  { num: 18, nombre: "Carne", vocabKey: "Carne" },
  { num: 19, nombre: "Casa", vocabKey: "Casa" },
  { num: 20, nombre: "Combate", vocabKey: "Guerra", subInfo: "Léon-Dufour: Guerra" },
  { num: 21, nombre: "Comida", vocabKey: "Comida" },
  { num: 22, nombre: "Comunidad", vocabKey: "Comunión", subInfo: "Léon-Dufour: Comunión" },
  { num: 23, nombre: "Confesión", vocabKey: "Confesión" },
  { num: 24, nombre: "Confianza", vocabKey: "Confianza" },
  { num: 25, nombre: "Conversión", vocabKey: "Penitencia - Conversión", subInfo: "Léon-Dufour: Penitencia - Conversión" },
  { num: 26, nombre: "Copa", vocabKey: "Copa" },
  { num: 27, nombre: "Cordero", vocabKey: "Cordero de Dios", subInfo: "Léon-Dufour: Cordero de Dios" },
  { num: 28, nombre: "Creación", vocabKey: "Creación" },
  { num: 29, nombre: "Cruz", vocabKey: "Cruz" },
  { num: 30, nombre: "Cuerpo", vocabKey: "Cuerpo" },
  { num: 31, nombre: "Culto", vocabKey: "Culto" },
  { num: 32, nombre: "Demonios", vocabKey: "Demonios" },
  { num: 33, nombre: "Desierto", vocabKey: "Desierto" },
  { num: 34, nombre: "Designios", vocabKey: "Designio de Dios", subInfo: "Léon-Dufour: Designio de Dios" },
  { num: 35, nombre: "Día", vocabKey: "Día del Señor", subInfo: "Léon-Dufour: Día del Señor" },
  { num: 36, nombre: "Diácono", vocabKey: "Ministerio", subInfo: "Léon-Dufour: Ministerio" },
  { num: 37, nombre: "Dios", vocabKey: "Dios" },
  { num: 38, nombre: "Diálogo", vocabKey: "Palabra de Dios", subInfo: "Léon-Dufour: Palabra de Dios" },
  { num: 39, nombre: "Dinero", vocabKey: "Riquezas", subInfo: "Léon-Dufour: Riquezas" },
  { num: 40, nombre: "Discípulo", vocabKey: "Discípulo" },
  { num: 41, nombre: "Domingo", vocabKey: "Día del Señor", subInfo: "Léon-Dufour: Día del Señor" },
  { num: 42, nombre: "Elección", vocabKey: "Elección" },
  { num: 43, nombre: "Emmanuel", vocabKey: "Presencia de Dios", subInfo: "Léon-Dufour: Presencia de Dios" },
  { num: 44, nombre: "Enemigo", vocabKey: "Enemigo" },
  { num: 45, nombre: "Escuchar", vocabKey: "Escuchar" },
  { num: 46, nombre: "Esperanza", vocabKey: "Esperanza" },
  { num: 47, nombre: "Espíritu", vocabKey: "Espíritu" },
  { num: 48, nombre: "Esposo", vocabKey: "Esposo" },
  { num: 49, nombre: "Eucaristía", vocabKey: "Eucaristía" },
  { num: 50, nombre: "Evangelio", vocabKey: "Evangelio" },
  { num: 51, nombre: "Exilio", vocabKey: "Exilio" },
  { num: 52, nombre: "Éxodo", vocabKey: "Éxodo" },
  { num: 53, nombre: "Exorcismo", vocabKey: "Satán", subInfo: "Léon-Dufour: Satán" },
  { num: 54, nombre: "Familia", vocabKey: "Casa", subInfo: "Léon-Dufour: Casa" },
  { num: 55, nombre: "Fariseo", vocabKey: "Fariseos", subInfo: "Léon-Dufour: Fariseos" },
  { num: 56, nombre: "Fe", vocabKey: "Fe" },
  { num: 57, nombre: "Fiesta", vocabKey: "Fiestas", subInfo: "Léon-Dufour: Fiestas" },
  { num: 58, nombre: "Fracción", vocabKey: "Pan", subInfo: "Léon-Dufour: Pan" },
  { num: 59, nombre: "Gracia", vocabKey: "Gracia" },
  { num: 60, nombre: "Grano", vocabKey: "Sembrar", subInfo: "Léon-Dufour: Sembrar" },
  { num: 61, nombre: "Hermano", vocabKey: "Hermano" },
  { num: 62, nombre: "Hijo", vocabKey: "Hijo" },
  { num: 63, nombre: "Historia", vocabKey: "Tiempo", subInfo: "Léon-Dufour: Tiempo" },
  { num: 64, nombre: "Hijo del hombre", vocabKey: "Hijo del hombre" },
  { num: 65, nombre: "Hombre", vocabKey: "Hombre" },
  { num: 66, nombre: "Hora", vocabKey: "Hora" },
  { num: 67, nombre: "Ídolo", vocabKey: "Ídolos", subInfo: "Léon-Dufour: Ídolos" },
  { num: 68, nombre: "Iglesia", vocabKey: "Iglesia" },
  { num: 69, nombre: "Infierno", vocabKey: "Infierno" },
  { num: 70, nombre: "Israel", vocabKey: "Israel" },
  { num: 71, nombre: "Jesús", vocabKey: "Jesús" },
  { num: 72, nombre: "Juicio", vocabKey: "Juicio" },
  { num: 73, nombre: "Kerigma", vocabKey: "Predicar", subInfo: "Léon-Dufour: Predicar" },
  { num: 74, nombre: "Ley", vocabKey: "Ley" },
  { num: 75, nombre: "Limosna", vocabKey: "Limosna" },
  { num: 76, nombre: "Liberación", vocabKey: "Liberación - Libertad", subInfo: "Léon-Dufour: Liberación - Libertad" },
  { num: 77, nombre: "Luz", vocabKey: "Luz" },
  { num: 78, nombre: "Llave", vocabKey: "Puerta", subInfo: "Léon-Dufour: Puerta" },
  { num: 79, nombre: "Madre", vocabKey: "Madre" },
  { num: 80, nombre: "Mal", vocabKey: "Bien - Mal", subInfo: "Léon-Dufour: Bien - Mal" },
  { num: 81, nombre: "Mar", vocabKey: "Mar" },
  { num: 82, nombre: "María", vocabKey: "María" },
  { num: 83, nombre: "Memorial", vocabKey: "Memoria", subInfo: "Léon-Dufour: Memoria" },
  { num: 84, nombre: "Mesías", vocabKey: "Mesías" },
  { num: 85, nombre: "Misterio", vocabKey: "Misterio" },
  { num: 86, nombre: "Misión", vocabKey: "Misión" },
  { num: 87, nombre: "Muerte", vocabKey: "Muerte" },
  { num: 88, nombre: "Mujer", vocabKey: "Mujer" },
  { num: 89, nombre: "Mundo", vocabKey: "Mundo" },
  { num: 90, nombre: "Niño", vocabKey: "Niño" },
  { num: 91, nombre: "Noche", vocabKey: "Noche" },
  { num: 92, nombre: "Nube", vocabKey: "Nube" },
  { num: 93, nombre: "Nombre", vocabKey: "Nombre" },
  { num: 94, nombre: "Nuevo", vocabKey: "Nuevo" },
  { num: 95, nombre: "Oración", vocabKey: "Oración" },
  { num: 96, nombre: "Padre", vocabKey: "Padres y Padre", subInfo: "Léon-Dufour: Padres y Padre" },
  { num: 97, nombre: "Palabra", vocabKey: "Palabra de Dios", subInfo: "Léon-Dufour: Palabra de Dios" },
  { num: 98, nombre: "Pan", vocabKey: "Pan" },
  { num: 99, nombre: "Parusía", vocabKey: "Día del Señor", subInfo: "Léon-Dufour: Día del Señor" },
  { num: 100, nombre: "Pascua", vocabKey: "Pascua" },
  { num: 101, nombre: "Pastor", vocabKey: "Pastor - Rebaño", subInfo: "Léon-Dufour: Pastor - Rebaño" },
  { num: 102, nombre: "Paz", vocabKey: "Paz" },
  { num: 103, nombre: "Pecado", vocabKey: "Pecado" },
  { num: 104, nombre: "Perdón", vocabKey: "Perdón" },
  { num: 105, nombre: "Piedra", vocabKey: "Piedra" },
  { num: 106, nombre: "Pobres", vocabKey: "Pobres" },
  { num: 107, nombre: "Presencia", vocabKey: "Presencia de Dios", subInfo: "Léon-Dufour: Presencia de Dios" },
  { num: 108, nombre: "Profeta", vocabKey: "Profeta" },
  { num: 109, nombre: "Promesa", vocabKey: "Promesas", subInfo: "Léon-Dufour: Promesas" },
  { num: 110, nombre: "Prueba", vocabKey: "Prueba - Tentación", subInfo: "Léon-Dufour: Prueba - Tentación" },
  { num: 111, nombre: "Pueblo", vocabKey: "Pueblo" },
  { num: 112, nombre: "Puerta", vocabKey: "Puerta" },
  { num: 113, nombre: "Reconciliación", vocabKey: "Reconciliación" },
  { num: 114, nombre: "Redención", vocabKey: "Redención" },
  { num: 115, nombre: "Reino", vocabKey: "Reino" },
  { num: 116, nombre: "Reposo", vocabKey: "Reposo" },
  { num: 117, nombre: "Resto", vocabKey: "Resto" },
  { num: 118, nombre: "Rey", vocabKey: "Rey" },
  { num: 119, nombre: "Resurrección", vocabKey: "Resurrección" },
  { num: 120, nombre: "Riquezas", vocabKey: "Riquezas" },
  { num: 121, nombre: "Roca", vocabKey: "Roca" },
  { num: 122, nombre: "Sacerdocio", vocabKey: "Sacerdocio" },
  { num: 123, nombre: "Sacrificios", vocabKey: "Sacrificio", subInfo: "Léon-Dufour: Sacrificio" },
  { num: 124, nombre: "Salmo", vocabKey: "Alabanza", subInfo: "Léon-Dufour: Alabanza" },
  { num: 125, nombre: "Salvación", vocabKey: "Salvación" },
  { num: 126, nombre: "Sangre", vocabKey: "Sangre" },
  { num: 127, nombre: "Santo", vocabKey: "Santo" },
  { num: 128, nombre: "Satán", vocabKey: "Satán" },
  { num: 129, nombre: "Sello", vocabKey: "Sello" },
  { num: 130, nombre: "Señor", vocabKey: "Señor" },
  { num: 131, nombre: "Siervo", vocabKey: "Siervo de Yahveh", subInfo: "Léon-Dufour: Siervo de Yahveh" },
  { num: 132, nombre: "Templo", vocabKey: "Templo" },
  { num: 133, nombre: "Trabajo", vocabKey: "Trabajo" },
  { num: 134, nombre: "Trinidad", vocabKey: "Dios", subInfo: "Léon-Dufour: Dios" },
  { num: 135, nombre: "Sufrimiento", vocabKey: "Sufrimiento" },
  { num: 136, nombre: "Unión", vocabKey: "Comunión", subInfo: "Léon-Dufour: Comunión" },
  { num: 137, nombre: "Unidad", vocabKey: "Unidad" },
  { num: 138, nombre: "Verdad", vocabKey: "Verdad" },
  { num: 139, nombre: "Vestido", vocabKey: "Vestido" },
  { num: 140, nombre: "Vida", vocabKey: "Vida" },
  { num: 141, nombre: "Viña", vocabKey: "Viña" },
  { num: 142, nombre: "Vino", vocabKey: "Vino" },
  { num: 143, nombre: "Virgen", vocabKey: "Virginidad", subInfo: "Léon-Dufour: Virginidad" },
  { num: 144, nombre: "Vocación", vocabKey: "Vocación" },
  { num: 145, nombre: "Vista", vocabKey: "Ver", subInfo: "Léon-Dufour: Ver" },
  { num: 146, nombre: "Victoria", vocabKey: "Victoria" },
  { num: 147, nombre: "Misericordia", vocabKey: "Misericordia" },
  { num: 148, nombre: "Voluntad de Dios", vocabKey: "Voluntad de Dios" }
];

let listaPrecat = [];
let listaTodas = [];

// --- CARGA DE DATOS ---
fetch("palabras.json")
    .then(r => {
        if (!r.ok) throw new Error("No se pudo cargar palabras.json");
        return r.json();
    })
    .then(data => {
        dataGlobalRef = data;
        dbTextos = data.textos || {};
        const rawVocab = data.palabras;

        // Construir mapa de números de Precatecumenado
        const precatMap = new Map();
        LISTA_PRECATECUMENADO_148.forEach(item => {
            precatMap.set(item.vocabKey.toLowerCase(), item.num);
        });

        // 1. Construir lista oficial del Precatecumenado (148 palabras con su orden y numeración)
        listaPrecat = LISTA_PRECATECUMENADO_148.map(item => {
            const entry = rawVocab[item.vocabKey] || { palabra: item.nombre, lecturas: {} };
            const l = entry.lecturas || {};
            const hist = l.Historicos || [];
            const pent = hist.filter(c => esPentateuco(c.libro));
            const prof = l.Profeticos || [];
            const nt = l["Nuevo Testamento"] || [];
            const ev = l.Evangelio || [];
            const sal = l.Salmos || [];
            const sap = l.Sapienciales || [];

            const totalBase = hist.length + prof.length + nt.length + ev.length;
            const cumple4Partes = (hist.length > 0 && prof.length > 0 && nt.length > 0 && ev.length > 0);

            const pNorm = normalizar(item.nombre) + " " + normalizar(item.vocabKey);
            setPalabrasExistentes.add(normalizar(item.nombre));
            setPalabrasExistentes.add(normalizar(item.vocabKey));

            return {
                id: item.num,
                numPrecat: item.num,
                palabra: item.nombre,
                subInfo: item.subInfo || "",
                vocabKey: item.vocabKey,
                palabraNorm: pNorm,
                lecturas: l,
                contenido: entry.contenido || "",
                relacionados: entry.relacionados || [],
                estaOrdenado: true,
                estaUnido: false,
                cumple4Partes: cumple4Partes,
                total: totalBase,
                totalConExtras: totalBase + sal.length + sap.length,
                hist: hist.length,
                pent: pent.length,
                prof: prof.length,
                nt: nt.length,
                ev: ev.length,
                sal: sal.length,
                sap: sap.length
            };
        });

        // 2. Construir lista completa de todas las palabras (289 de Léon-Dufour)
        let rawList = Object.values(rawVocab);
        rawList.sort((a, b) => a.palabra.localeCompare(b.palabra, 'es', { sensitivity: 'base' }));

        listaTodas = rawList.map((p, index) => {
            const pNorm = normalizar(p.palabra);
            setPalabrasExistentes.add(pNorm);
            const l = p.lecturas || {};
            
            const hist = l.Historicos || [];
            const pent = hist.filter(c => esPentateuco(c.libro));
            const prof = l.Profeticos || [];
            const nt = l["Nuevo Testamento"] || [];
            const ev = l.Evangelio || [];
            const sal = l.Salmos || [];
            const sap = l.Sapienciales || [];

            const totalBase = hist.length + prof.length + nt.length + ev.length;
            const cumple4Partes = (hist.length > 0 && prof.length > 0 && nt.length > 0 && ev.length > 0);
            const numPrecat = precatMap.get(p.palabra.toLowerCase()) || null;

            return {
                id: index + 1,
                numPrecat: numPrecat,
                palabra: p.palabra,
                subInfo: numPrecat ? `Precat. #${numPrecat}` : "",
                vocabKey: p.palabra,
                palabraNorm: pNorm,
                lecturas: l,
                contenido: p.contenido || "",
                relacionados: p.relacionados || [],
                estaOrdenado: true,
                estaUnido: false,
                cumple4Partes: cumple4Partes,
                total: totalBase,
                totalConExtras: totalBase + sal.length + sap.length,
                hist: hist.length,
                pent: pent.length,
                prof: prof.length,
                nt: nt.length,
                ev: ev.length,
                sal: sal.length,
                sap: sap.length
            };
        });

        listaGlobal = listaPrecat;

        // Limpiar exclusiones obsoletas
        setExcluidos.forEach(excl => {
            if (!setPalabrasExistentes.has(excl)) setExcluidos.delete(excl);
        });
        guardarLocalStorage();
        renderizarTags();
        actualizarVista();
    })
    .catch(err => {
        console.error(err);
        contenedorLista.innerHTML = `<div class="error-msg">⚠️ Error cargando los datos bíblicos: ${err.message}</div>`;
    });

// --- RENDERIZADO DE LA INTERFAZ (MOBILE FIRST & RESPONSIVE) ---

function actualizarVista() {
    const soloPentateuco = checkPentateuco ? checkPentateuco.checked : false;
    const mostrarExtras = checkExtras.checked;
    const unirPericopas = checkPericopas ? checkPericopas.checked : false;
    const soloCompletas = checkSoloCompletas ? checkSoloCompletas.checked : false;
    const orden = selectOrden.value;
    const busqueda = normalizar(inputBusqueda.value);

    const baseList = (modoFiltro === "precat") ? listaPrecat : listaTodas;

    let lista = baseList.filter(item => {
        const pNormPalabra = normalizar(item.palabra);
        const pNormVocab = item.vocabKey ? normalizar(item.vocabKey) : "";
        if (setExcluidos.has(item.palabraNorm) || setExcluidos.has(pNormPalabra) || (pNormVocab && setExcluidos.has(pNormVocab))) {
            return false;
        }
        if (busqueda.length > 0 && !item.palabraNorm.includes(busqueda)) return false;

        if (soloCompletas && !esPalabraCompleta(item, soloPentateuco)) {
            return false;
        }

        return true;
    });

    // Actualizar dinámicamente texto de opción de ordenamiento en Históricos / Pentateuco
    const optHist = selectOrden ? selectOrden.querySelector('option[value="hist"]') : null;
    if (optHist) {
        optHist.textContent = soloPentateuco ? "Más en Pentateuco" : "Más en Históricos";
    }

    lista.sort((a, b) => {
        if (orden === 'precat') {
            if (a.numPrecat && b.numPrecat) return a.numPrecat - b.numPrecat;
            if (a.numPrecat) return -1;
            if (b.numPrecat) return 1;
            return a.id - b.id;
        }
        if (orden === 'alpha') return a.palabra.localeCompare(b.palabra, 'es');
        if (orden === 'asc') {
            const totA = soloPentateuco ? (a.pent + a.prof + a.nt + a.ev) : a.total;
            const totB = soloPentateuco ? (b.pent + b.prof + b.nt + b.ev) : b.total;
            return totA - totB;
        }
        if (orden === 'desc') {
            const totA = soloPentateuco ? (a.pent + a.prof + a.nt + a.ev) : a.total;
            const totB = soloPentateuco ? (b.pent + b.prof + b.nt + b.ev) : b.total;
            return totB - totA;
        }
        if (orden === 'hist') {
            const countA = soloPentateuco ? a.pent : a.hist;
            const countB = soloPentateuco ? b.pent : b.hist;
            return countB - countA;
        }
        if (orden === 'prof') return b.prof - a.prof;
        if (orden === 'nt') return b.nt - a.nt;
        if (orden === 'ev') return b.ev - a.ev;
        return 0;
    });

    const badgePentInfo = soloPentateuco ? ` · <span style="color:#059669; font-weight:700;">📜 Solo Pentateuco</span>` : ``;
    const badgePericopasInfo = unirPericopas ? ` · <span style="color:#2563eb; font-weight:700;">🔗 Perícopas Unidas</span>` : ``;
    const badgeCompletasInfo = soloCompletas ? ` · <span style="color:#10b981; font-weight:700;">🌱 4 Criterios</span>` : ``;

    if (modoFiltro === "precat") {
        infoStats.innerHTML = `🌱 <strong>Precatecumenado:</strong> Viendo <strong>${lista.length}</strong> de 148 palabras oficiales del documento${badgePentInfo}${badgePericopasInfo}${badgeCompletasInfo}`;
    } else {
        infoStats.innerHTML = `📚 <strong>Vocabulario Completo:</strong> Viendo <strong>${lista.length}</strong> de ${listaTodas.length} palabras de Xavier Léon-Dufour${badgePentInfo}${badgePericopasInfo}${badgeCompletasInfo}`;
    }

    dibujarLista(lista, mostrarExtras, soloPentateuco);
}

function dibujarLista(lista, mostrarExtras, soloPentateuco = false) {
    contenedorLista.innerHTML = "";

    if (lista.length === 0) {
        contenedorLista.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <h3>No se encontraron palabras</h3>
                <p>Prueba ajustando los filtros o el término de búsqueda.</p>
            </div>
        `;
        return;
    }

    lista.forEach(item => {
        const procesar = (citas) => {
            let res = citas ? [...citas] : [];
            if (item.estaUnido) res = unirSegmentosContiguos(res);
            else if (item.estaOrdenado) res = ordenarCitasAsc(res);
            return res;
        };

        const citasHistBase = item.lecturas.Historicos || [];
        const citasHistFiltradas = soloPentateuco ? citasHistBase.filter(c => esPentateuco(c.libro)) : citasHistBase;

        const lecturasActuales = {
            Hist: procesar(citasHistFiltradas),
            Prof: procesar(item.lecturas.Profeticos),
            NT: procesar(item.lecturas["Nuevo Testamento"]),
            Ev: procesar(item.lecturas.Evangelio),
            Sal: procesar(item.lecturas.Salmos),
            Sap: procesar(item.lecturas.Sapienciales)
        };

        const totalOriginalBase = (soloPentateuco ? item.pent : item.hist) + item.prof + item.nt + item.ev;
        const totalUnido = lecturasActuales.Hist.length + lecturasActuales.Prof.length + lecturasActuales.NT.length + lecturasActuales.Ev.length;
        const diffTotal = totalUnido - totalOriginalBase;
        const cumple4PartesActual = esPalabraCompleta(item, soloPentateuco);

        const card = document.createElement("article");
        card.className = `word-card ${cumple4PartesActual ? 'card-cumple' : 'card-incompleta'}`;
        card.id = `card-${item.id}`;

        // --- ENCABEZADO DE LA TARJETA ---
        const header = document.createElement("div");
        header.className = "word-card-header";
        header.setAttribute("title", "Toca para desplegar las citas bíblicas de esta palabra");

        // Fila superior: Título e indicador de 4 partes
        const titleRow = document.createElement("div");
        titleRow.className = "word-title-row";

        const titleDiv = document.createElement("div");
        titleDiv.className = "word-title-wrapper";
        titleDiv.innerHTML = `
            <span class="word-number">#${item.numPrecat || item.id}</span>
            <h2 class="word-name">
                ${item.palabra}
                ${item.subInfo ? `<span class="word-subname" title="Referencia en Léon-Dufour">(${item.subInfo})</span>` : ''}
            </h2>
        `;

        const badgeCriterio = document.createElement("div");
        if (cumple4PartesActual) {
            badgeCriterio.className = "badge-criterio badge-precat";
            badgeCriterio.setAttribute("title", `Palabra de Precatecumenado: Apta para preparación litúrgica completa (posee citas en ${soloPentateuco ? 'Pentateuco (Torá)' : 'Históricos'}, Proféticos, Cartas/NT y Evangelios).`);
            badgeCriterio.innerHTML = `🌱 Precatecumenado`;
        } else {
            const faltantes = [];
            if (lecturasActuales.Hist.length === 0) faltantes.push(soloPentateuco ? "Pentateuco" : "Hist");
            if (item.prof === 0) faltantes.push("Prof");
            if (item.nt === 0) faltantes.push("NT");
            if (item.ev === 0) faltantes.push("Ev");
            badgeCriterio.className = "badge-criterio badge-incompleta";
            badgeCriterio.setAttribute("title", `Incompleta para preparación litúrgica de 4 partes. Faltan: ${faltantes.join(", ")}`);
            badgeCriterio.innerHTML = `⚠️ Falta: ${faltantes.join(", ")}`;
        }

        const rightHeaderBox = document.createElement("div");
        rightHeaderBox.style.display = "flex";
        rightHeaderBox.style.alignItems = "center";
        rightHeaderBox.style.gap = "6px";
        rightHeaderBox.style.flexWrap = "wrap";

        const btnQuickArticulo = document.createElement("button");
        btnQuickArticulo.className = "btn-quick-art";
        btnQuickArticulo.setAttribute("title", `Leer el artículo teológico íntegro de Xavier Léon-Dufour sobre "${item.palabra}"`);
        btnQuickArticulo.innerHTML = `📚 Artículo`;
        btnQuickArticulo.onclick = (e) => {
            e.stopPropagation();
            abrirModalArticulo(item);
        };

        const btnQuickCalc = document.createElement("button");
        btnQuickCalc.className = "btn-quick-calc";
        btnQuickCalc.setAttribute("title", `Toca para abrir la calculadora y repartir las lecturas de "${item.palabra}" entre los participantes`);
        btnQuickCalc.innerHTML = `👥 Repartir`;
        btnQuickCalc.onclick = (e) => {
            e.stopPropagation();
            abrirCalculadora(item);
        };

        rightHeaderBox.appendChild(btnQuickArticulo);
        rightHeaderBox.appendChild(btnQuickCalc);
        rightHeaderBox.appendChild(badgeCriterio);

        titleRow.appendChild(titleDiv);
        titleRow.appendChild(rightHeaderBox);
        header.appendChild(titleRow);

        // Fila de resumen de conteos por categoría (Pastillas interactivas)
        const countsRow = document.createElement("div");
        countsRow.className = "word-counts-row";
        
        const histLabel = soloPentateuco ? "Pent" : "Hist";
        const histCount = lecturasActuales.Hist.length;
        const histTitle = soloPentateuco 
            ? `Pentateuco / Torá: ${histCount} citas (Históricos posteriores ocultos)` 
            : `Históricos / Torá: ${item.hist} citas`;

        const tooltipTotal = item.estaUnido 
            ? `Total actual: ${totalUnido} perícopas. ${diffTotal !== 0 ? `El (${diffTotal}) indica que se han consolidado ${Math.abs(diffTotal)} citas contiguas de las ${totalOriginalBase} originales de Léon-Dufour.` : `Total de citas originales: ${totalOriginalBase}`}`
            : `Total actual: ${totalOriginalBase} citas individuales sueltas.`;

        const totalPillText = item.estaUnido 
            ? `${totalUnido} ${diffTotal !== 0 ? `<small class="diff-tag">(${diffTotal})</small>` : ''} perícopas`
            : `${totalOriginalBase} citas`;

        countsRow.innerHTML = `
            <span class="count-pill total-pill" title="${tooltipTotal}">
              ${totalPillText}
            </span>
            <span class="count-pill cat-hist ${histCount === 0 ? 'zero' : ''}" title="${histTitle}">${histCount} ${histLabel}</span>
            <span class="count-pill cat-prof ${item.prof === 0 ? 'zero' : ''}" title="Proféticos: ${item.prof} citas">${item.prof} Prof</span>
            <span class="count-pill cat-nt ${item.nt === 0 ? 'zero' : ''}" title="Cartas / Nuevo Testamento: ${item.nt} citas">${item.nt} NT</span>
            <span class="count-pill cat-ev ${item.ev === 0 ? 'zero' : ''}" title="Evangelios: ${item.ev} citas">${item.ev} Ev</span>
            ${mostrarExtras ? `<span class="count-pill cat-sal ${item.sal === 0 ? 'zero' : ''}" title="Salmos: ${item.sal} citas">${item.sal} Sal</span>` : ''}
            ${mostrarExtras ? `<span class="count-pill cat-sap ${item.sap === 0 ? 'zero' : ''}" title="Sapienciales: ${item.sap} citas">${item.sap} Sap</span>` : ''}
            <span class="chevron-icon" title="Desplegar citas">▼</span>
        `;
        header.appendChild(countsRow);

        // --- CUERPO DETALLADO DE CITAS ---
        const body = document.createElement("div");
        body.className = "word-card-body";
        body.style.display = (palabraAbiertaId === item.id) ? "block" : "none";

        // Barra de acciones del cuerpo
        const actionsBar = document.createElement("div");
        actionsBar.className = "card-actions-bar";

        // Botón Leer Léon-Dufour
        const btnArticulo = document.createElement("button");
        btnArticulo.className = "btn-action btn-articulo";
        btnArticulo.setAttribute("title", `Lee el artículo y comentario teológico íntegro de Xavier Léon-Dufour sobre "${item.palabra}"`);
        btnArticulo.innerHTML = `📚 Leer Léon-Dufour`;
        btnArticulo.onclick = (e) => {
            e.stopPropagation();
            abrirModalArticulo(item);
        };

        // Botón Calculadora / Repartir entre Hermanos
        const btnCalc = document.createElement("button");
        btnCalc.className = "btn-action";
        btnCalc.style.borderColor = "#3b82f6";
        btnCalc.style.color = "#1e3a8a";
        btnCalc.style.background = "#eff6ff";
        btnCalc.setAttribute("title", "Abre la calculadora de preparación para distribuir todas las lecturas de forma equilibrada entre los participantes, en orden bíblico continuo y sin saltos.");
        btnCalc.innerHTML = `👥 Repartir Lecturas`;
        btnCalc.onclick = (e) => {
            e.stopPropagation();
            abrirCalculadora(item);
        };

        // Botón Unir Perícopas
        const btnUnir = document.createElement("button");
        btnUnir.className = `btn-action ${item.estaUnido ? 'active' : ''}`;
        btnUnir.setAttribute("title", item.estaUnido 
            ? "Mostrando lecturas consolidadas (perícopas unidas). Haz clic para ver las citas individuales sueltas." 
            : "Haz clic para unificar lecturas contiguas y solapadas dentro del mismo capítulo para la proclamación.");
        btnUnir.innerHTML = item.estaUnido ? `🔗 Perícopas Unidas` : `📄 Citas Sueltas`;
        btnUnir.onclick = (e) => {
            e.stopPropagation();
            item.estaUnido = !item.estaUnido;
            dibujarLista(lista, mostrarExtras, soloPentateuco);
        };

        // Botón Copiar Perícopas
        const btnCopiar = document.createElement("button");
        btnCopiar.className = "btn-action btn-copiar";
        btnCopiar.setAttribute("title", "Copia al portapapeles todas las citas organizadas de esta palabra para compartir en la preparación.");
        btnCopiar.innerHTML = `📋 Copiar Esquema`;
        btnCopiar.onclick = (e) => {
            e.stopPropagation();
            copiarEsquemaPalabra(item, lecturasActuales, mostrarExtras, soloPentateuco);
        };

        // Botón Excluir Palabra
        const btnExcluir = document.createElement("button");
        btnExcluir.className = "btn-action btn-excluir";
        btnExcluir.setAttribute("title", `Oculta "${item.palabra}" de la lista si ya la habéis preparado recientemente.`);
        btnExcluir.innerHTML = `🚫 Excluir`;
        btnExcluir.onclick = (e) => {
            e.stopPropagation();
            excluirPalabraDirecta(item.palabra);
        };

        actionsBar.appendChild(btnArticulo);
        actionsBar.appendChild(btnCalc);
        actionsBar.appendChild(btnUnir);
        actionsBar.appendChild(btnCopiar);
        actionsBar.appendChild(btnExcluir);
        body.appendChild(actionsBar);

        // Contenedor de columnas / bloques por categoría
        const categoriesContainer = document.createElement("div");
        categoriesContainer.className = "categories-grid";

        // Bloques de las 4 partes fundamentales
        const histBlockTitle = soloPentateuco ? "1. Pentateuco (Torá)" : "1. Históricos (Torá)";
        const histBlockDesc = soloPentateuco ? "Lectura de la Torá / Ley de Moisés (Génesis a Deuteronomio)" : "Lectura de la Torá / Libros Históricos del AT";

        categoriesContainer.appendChild(crearBloqueCategoria(histBlockTitle, lecturasActuales.Hist, "cat-hist", histBlockDesc));
        categoriesContainer.appendChild(crearBloqueCategoria("2. Proféticos", lecturasActuales.Prof, "cat-prof", "Lectura de los Profetas Mayores y Menores"));
        categoriesContainer.appendChild(crearBloqueCategoria("3. Cartas / NT", lecturasActuales.NT, "cat-nt", "Lectura de Hechos, Cartas Apostólicas y Apocalipsis"));
        categoriesContainer.appendChild(crearBloqueCategoria("4. Evangelio", lecturasActuales.Ev, "cat-ev", "Lectura del Santo Evangelio (Culminación)"));

        if (mostrarExtras) {
            categoriesContainer.appendChild(crearBloqueCategoria("Salmos", lecturasActuales.Sal, "cat-sal", "Salterio para cantos y salmo responsorial"));
            categoriesContainer.appendChild(crearBloqueCategoria("Sapienciales", lecturasActuales.Sap, "cat-sap", "Libros sapienciales (Sabiduría, Eclesiástico, Proverbios, Job)"));
        }

        body.appendChild(categoriesContainer);

        // Evento abrir/cerrar acordeón
        header.onclick = () => {
            const estaAbierto = body.style.display === "block";
            if (estaAbierto) {
                body.style.display = "none";
                card.classList.remove("expanded");
                palabraAbiertaId = null;
            } else {
                document.querySelectorAll(".word-card-body").forEach(b => b.style.display = "none");
                document.querySelectorAll(".word-card").forEach(c => c.classList.remove("expanded"));
                
                body.style.display = "block";
                card.classList.add("expanded");
                palabraAbiertaId = item.id;
            }
        };

        if (palabraAbiertaId === item.id) {
            card.classList.add("expanded");
        }

        card.appendChild(header);
        card.appendChild(body);
        contenedorLista.appendChild(card);
    });
}

function crearBloqueCategoria(titulo, citas, claseTema, descripcion) {
    const box = document.createElement("div");
    box.className = `category-box ${claseTema}`;

    const catHeader = document.createElement("div");
    catHeader.className = "category-header";
    catHeader.setAttribute("title", descripcion);
    catHeader.innerHTML = `
        <span class="cat-title">${titulo}</span>
        <span class="cat-badge" title="Cantidad de perícopas disponibles en esta categoría">${citas.length}</span>
    `;
    box.appendChild(catHeader);

    const citationsList = document.createElement("div");
    citationsList.className = "citations-list";

    if (citas && citas.length > 0) {
        citas.forEach(c => {
            const btnCita = document.createElement("button");
            btnCita.className = "btn-citation";
            const nombreLibro = c.libroNombre || NOMBRES_LIBROS[c.libro] || c.libro;
            const refLegible = `${nombreLibro} ${c.capitulo}${c.versiculoInicio ? `,${c.versiculoInicio}` : ''}${c.versiculoFin ? `-${c.versiculoFin}` : ''}${c.continuidad ? c.continuidad : ''}`;
            
            btnCita.setAttribute("title", `Toca para leer el texto bíblico completo de: ${refLegible}`);
            btnCita.innerHTML = `<span class="cita-txt">${c.citaOriginal}</span> <span class="read-icon">📖</span>`;
            btnCita.onclick = (e) => {
                e.stopPropagation();
                abrirModalLectura(c);
            };
            citationsList.appendChild(btnCita);
        });
    } else {
        citationsList.innerHTML = `<span class="no-citations" title="No hay citas en este grupo para esta palabra">- Sin lecturas -</span>`;
    }

    box.appendChild(citationsList);
    return box;
}

// --- COPIAR ESQUEMA AL PORTAPAPELES ---
function copiarEsquemaPalabra(item, lecturas, mostrarExtras, soloPentateuco = false) {
    const formatearCitas = (lista) => {
        if (!lista || lista.length === 0) return "  (Ninguna)";
        return lista.map(c => `  • ${c.citaOriginal}`).join("\n");
    };

    let texto = `📖 PREPARACIÓN DE LA PALABRA: "${item.palabra.toUpperCase()}"\n`;
    texto += `Vocabulario de Teología Bíblica de Xavier Léon-Dufour\n`;
    texto += `--------------------------------------------------\n\n`;
    
    texto += `${soloPentateuco ? '1. PENTATEUCO (Torá)' : '1. HISTÓRICOS (Torá)'}:\n${formatearCitas(lecturas.Hist)}\n\n`;
    texto += `2. PROFÉTICOS:\n${formatearCitas(lecturas.Prof)}\n\n`;
    texto += `3. CARTAS / NUEVO TESTAMENTO:\n${formatearCitas(lecturas.NT)}\n\n`;
    texto += `4. EVANGELIO:\n${formatearCitas(lecturas.Ev)}\n\n`;

    if (mostrarExtras) {
        if (lecturas.Sal && lecturas.Sal.length > 0) {
            texto += `SALMOS:\n${formatearCitas(lecturas.Sal)}\n\n`;
        }
        if (lecturas.Sap && lecturas.Sap.length > 0) {
            texto += `SAPIENCIALES:\n${formatearCitas(lecturas.Sap)}\n\n`;
        }
    }
    
    texto += `--------------------------------------------------\n`;
    texto += `Generado para la Liturgia de la Palabra`;

    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast(`✅ Esquema de "${item.palabra}" copiado al portapapeles`);
    }).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        mostrarToast(`✅ Esquema de "${item.palabra}" copiado`);
    });
}

// ==========================================================================
// CALCULADORA DE PARTICIPANTES (DISTRIBUCIÓN LINEAL BÍBLICA SIN SALTOS)
// ==========================================================================

function calcularCaracteresCita(cita) {
    if (!cita || !cita.textoRef) return 150;
    const rawHtml = dbTextos[cita.textoRef];
    if (!rawHtml) {
        const ini = cita.versiculoInicio || 1;
        const fin = (cita.continuidad === 's' ? ini + 1 : (cita.continuidad === 'ss' ? ini + 5 : (cita.versiculoFin || ini)));
        return Math.max(100, (fin - ini + 1) * 150);
    }

    const ini = cita.versiculoInicio;
    const fin = cita.versiculoFin;
    const cont = cita.continuidad;

    if (!ini && !fin && !cont) {
        const plain = rawHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return plain.length || 1500;
    }

    const verseRegex = /<strong>(\d+)<\/strong>\s*-\s*([^<]*)/g;
    let m;
    let totalChars = 0;
    let foundAny = false;

    const vStart = ini || 1;
    let vEnd = fin || vStart;
    if (cont === 's') vEnd = vStart + 1;
    else if (cont === 'ss') vEnd = 9999;

    while ((m = verseRegex.exec(rawHtml)) !== null) {
        const vNum = parseInt(m[1], 10);
        if (vNum >= vStart && vNum <= vEnd) {
            foundAny = true;
            totalChars += m[2].trim().length;
        }
    }

    if (!foundAny || totalChars === 0) {
        const count = vEnd >= 9990 ? 5 : (vEnd - vStart + 1);
        return Math.max(100, count * 150);
    }

    return totalChars;
}

function obtenerRangoLibros(lista) {
    if (!lista || lista.length === 0) return "Sin lecturas";
    const primerLibro = lista[0].libroNombre || NOMBRES_LIBROS[lista[0].libro] || lista[0].libro;
    const ultimoLibro = lista[lista.length - 1].libroNombre || NOMBRES_LIBROS[lista[lista.length - 1].libro] || lista[lista.length - 1].libro;
    if (primerLibro === ultimoLibro) {
        return `${primerLibro} (Cap. ${lista[0].capitulo} a ${lista[lista.length - 1].capitulo})`;
    }
    return `${primerLibro} → ${ultimoLibro}`;
}

function calcularDistribucionLineal(citas, k, criterio = "caracteres") {
    if (!citas || citas.length === 0) return [];
    const ordenadas = ordenarCitasAsc(citas);
    const n = ordenadas.length;
    const numPart = Math.max(1, Math.min(k, n));

    const rawChars = ordenadas.map(c => calcularCaracteresCita(c));
    const totalCharsGeneral = rawChars.reduce((a, b) => a + b, 0);

    if (numPart === 1) {
        return [{
            hermano: 1,
            citas: ordenadas,
            rango: obtenerRangoLibros(ordenadas),
            totalCitas: n,
            totalCaracteres: totalCharsGeneral,
            porcentaje: 100
        }];
    }

    // 1. Asignar pesos según el criterio seleccionado
    let weights;
    if (criterio === "citas") {
        // Cargas iguales de cantidad de citas
        weights = Array(n).fill(1);
    } else if (criterio === "hibrido") {
        // Texto real + costo cognitivo de búsqueda en Biblia (~200 car. por cita)
        weights = rawChars.map(c => c + 200);
    } else {
        // 'caracteres' por defecto: tiempo de lectura real
        weights = rawChars.map(c => Math.max(50, c));
    }

    const prefWeights = [0];
    for (let i = 0; i < n; i++) {
        prefWeights.push(prefWeights[i] + weights[i]);
    }
    const totalWeight = prefWeights[n];
    const targetWeight = totalWeight / numPart;

    // 2. Programación Dinámica Global (Mínima Varianza / Error Cuadrático Global)
    // dp[p][i]: costo mínimo de repartir las primeras i citas entre p hermanos
    const dp = Array.from({ length: numPart + 1 }, () => Array(n + 1).fill(Infinity));
    const parent = Array.from({ length: numPart + 1 }, () => Array(n + 1).fill(0));
    dp[0][0] = 0;

    for (let p = 1; p <= numPart; p++) {
        const minI = p;
        const maxI = n - (numPart - p);
        for (let i = minI; i <= maxI; i++) {
            for (let j = p - 1; j < i; j++) {
                const segWeight = prefWeights[i] - prefWeights[j];
                const cost = dp[p - 1][j] + Math.pow(segWeight - targetWeight, 2);
                if (cost < dp[p][i]) {
                    dp[p][i] = cost;
                    parent[p][i] = j;
                }
            }
        }
    }

    // 3. Reconstruir los puntos de corte óptimos
    const splits = [];
    let curr = n;
    for (let p = numPart; p >= 1; p--) {
        splits.unshift(curr);
        curr = parent[p][curr];
    }
    splits.unshift(0);

    // 4. Generar particiones resultantes con estadísticas de balance
    const partitions = [];
    for (let p = 0; p < numPart; p++) {
        const from = splits[p];
        const to = splits[p + 1];
        const slice = ordenadas.slice(from, to);
        const sliceChars = slice.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);
        partitions.push({
            hermano: p + 1,
            citas: slice,
            rango: obtenerRangoLibros(slice),
            totalCitas: slice.length,
            totalCaracteres: sliceChars,
            porcentaje: totalCharsGeneral > 0 ? Math.round((sliceChars / totalCharsGeneral) * 100) : 0
        });
    }

    return partitions;
}

function abrirCalculadora(item) {
    palabraCalculadoraActual = item;
    calcModalTitulo.textContent = `👥 Preparación: "${item.palabra.toUpperCase()}"`;
    if (calcCheckPentateuco && checkPentateuco) {
        calcCheckPentateuco.checked = checkPentateuco.checked;
    }
    if (calcCheckExtras && checkExtras) {
        calcCheckExtras.checked = checkExtras.checked;
    }
    if (calcCheckUnido) {
        calcCheckUnido.checked = (typeof item.estaUnido === 'boolean') ? item.estaUnido : (checkPericopas ? checkPericopas.checked : false);
    }
    renderizarCalculadora();
    modalCalculadora.style.display = "flex";
    document.body.classList.add("modal-open");
}

function cerrarCalculadora() {
    modalCalculadora.style.display = "none";
    document.body.classList.remove("modal-open");
}

function renderizarCalculadora() {
    if (!palabraCalculadoraActual) return;
    const item = palabraCalculadoraActual;
    const usarUnidas = calcCheckUnido.checked;
    const incluirExtras = calcCheckExtras.checked;
    const soloPentCalc = calcCheckPentateuco ? calcCheckPentateuco.checked : false;

    // Recolectar citas de la palabra según filtros de la calculadora
    let citasAConsolidar = [];
    const procesar = (arr) => {
        if (!arr) return [];
        return usarUnidas ? unirSegmentosContiguos(arr) : arr;
    };

    const citasHistBase = item.lecturas.Historicos || [];
    const citasHistFiltradas = soloPentCalc ? citasHistBase.filter(c => esPentateuco(c.libro)) : citasHistBase;

    citasAConsolidar.push(...procesar(citasHistFiltradas));
    citasAConsolidar.push(...procesar(item.lecturas.Profeticos));
    citasAConsolidar.push(...procesar(item.lecturas["Nuevo Testamento"]));
    citasAConsolidar.push(...procesar(item.lecturas.Evangelio));

    if (incluirExtras) {
        citasAConsolidar.push(...procesar(item.lecturas.Salmos));
        citasAConsolidar.push(...procesar(item.lecturas.Sapienciales));
    }

    // Ordenar de forma canónica bíblica para garantizar búsqueda lineal continua
    const citasFinales = ordenarCitasAsc(citasAConsolidar);
    const totalLecturas = citasFinales.length;
    const totalCharsGeneral = citasFinales.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);

    numPartDisplay.textContent = numParticipantesActual;
    calcModalSubtitulo.textContent = `${totalLecturas} ${usarUnidas ? 'perícopas unidas' : 'citas'} (${totalCharsGeneral.toLocaleString()} caracteres) en orden bíblico entre ${numParticipantesActual} participantes`;

    // Actualizar botones chips activos
    chipNums.forEach(chip => {
        chip.classList.toggle("active", parseInt(chip.dataset.num, 10) === numParticipantesActual);
    });

    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "caracteres";
    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual, criterioActual);
    const promedioChars = Math.round(totalCharsGeneral / Math.max(1, particiones.length));

    // Actualizar indicador de balance y transparencia
    const pcts = particiones.map(p => p.porcentaje);
    const minPct = Math.min(...pcts);
    const maxPct = Math.max(...pcts);
    const devMax = (maxPct - minPct) / 2;

    if (calcBalanceIndicator) {
        if (devMax <= 3.5) {
            calcBalanceIndicator.innerHTML = `⚖️ Balance Óptimo (±${devMax.toFixed(1)}%)`;
            calcBalanceIndicator.style.background = "#ecfdf5";
            calcBalanceIndicator.style.color = "#065f46";
            calcBalanceIndicator.style.borderColor = "#a7f3d0";
        } else {
            calcBalanceIndicator.innerHTML = `📊 Reparto Adaptado (±${devMax.toFixed(1)}%)`;
            calcBalanceIndicator.style.background = "#eff6ff";
            calcBalanceIndicator.style.color = "#1e3a8a";
            calcBalanceIndicator.style.borderColor = "#bfdbfe";
        }
    }

    if (criterioActual === "citas") {
        calcSummaryText.textContent = `Reparto por cantidad de citas: cada hermano recibe un número similar de lecturas en orden bíblico continuo.`;
    } else if (criterioActual === "hibrido") {
        calcSummaryText.textContent = `Reparto híbrido: equilibra el volumen de texto (~${promedioChars.toLocaleString()} car.) y el esfuerzo de búsqueda en la Biblia.`;
    } else {
        calcSummaryText.textContent = `Reparto por tiempo de lectura (DP Óptimo): equilibra el volumen de texto (~${promedioChars.toLocaleString()} car. por hermano) para igualar el tiempo de preparación.`;
    }

    // Renderizar tarjetas por hermano
    contenedorHermanos.innerHTML = "";
    particiones.forEach(p => {
        const hCard = document.createElement("div");
        hCard.className = "hermano-card";

        const hHeader = document.createElement("div");
        hHeader.className = "hermano-header";

        const hTitleBox = document.createElement("div");
        hTitleBox.className = "hermano-title-box";
        hTitleBox.innerHTML = `
            <div class="hermano-badge-avatar" title="Participante ${p.hermano}">${p.hermano}</div>
            <div>
                <span class="hermano-name">Hermano ${p.hermano}</span>
                <div class="hermano-stats-badge">
                    <span>(${p.totalCitas} lecturas)</span>
                    <span class="hermano-char-badge" title="Volumen total de texto asignado en caracteres">🔤 ~${p.totalCaracteres.toLocaleString()} car.</span>
                    <span class="hermano-pct-badge" title="Porcentaje del texto total asignado">${p.porcentaje}%</span>
                </div>
            </div>
            <span class="hermano-rango" title="Sección de la Biblia asignada a este hermano">📖 ${p.rango}</span>
        `;

        const btnCopiarHermano = document.createElement("button");
        btnCopiarHermano.className = "btn-copiar-hermano";
        btnCopiarHermano.setAttribute("title", `Copiar asignación del Hermano ${p.hermano} con caracteres para WhatsApp`);
        btnCopiarHermano.innerHTML = `📲 Copiar para Hermano ${p.hermano}`;
        btnCopiarHermano.onclick = () => {
            copiarAsignacionIndividual(item.palabra, p);
        };

        hHeader.appendChild(hTitleBox);
        hHeader.appendChild(btnCopiarHermano);
        hCard.appendChild(hHeader);

        const hBody = document.createElement("div");
        hBody.className = "hermano-body";

        p.citas.forEach(c => {
            const chars = calcularCaracteresCita(c);
            const btnCita = document.createElement("button");
            btnCita.className = "btn-citation";
            btnCita.setAttribute("title", `Toca para leer el texto bíblico completo de: ${c.citaOriginal} (~${chars.toLocaleString()} caracteres)`);
            btnCita.innerHTML = `<span class="cita-txt">${c.citaOriginal}</span> <span class="read-icon" title="Extensión estimada: ~${chars.toLocaleString()} caracteres">📖</span>`;
            btnCita.onclick = (e) => {
                e.stopPropagation();
                abrirModalLectura(c);
            };
            hBody.appendChild(btnCita);
        });

        hCard.appendChild(hBody);
        contenedorHermanos.appendChild(hCard);
    });
}

function copiarAsignacionIndividual(palabra, p) {
    let msg = `🕊️ *PREPARACIÓN DE LA PALABRA:* "${palabra.toUpperCase()}"\n`;
    msg += `👤 *Asignación para Hermano ${p.hermano}*\n`;
    msg += `📖 *Rango Bíblico:* ${p.rango}\n`;
    msg += `📊 *Carga:* ${p.totalCitas} lecturas · ~${p.totalCaracteres.toLocaleString()} caracteres (${p.porcentaje}% del total)\n`;
    msg += `------------------------------------\n`;
    p.citas.forEach((c, idx) => {
        const chars = calcularCaracteresCita(c);
        msg += `${idx + 1}. ${c.citaOriginal} (~${chars.toLocaleString()} car.)\n`;
    });
    msg += `------------------------------------\n`;
    msg += `Búsqueda lineal en orden bíblico continuo.`;

    navigator.clipboard.writeText(msg).then(() => {
        mostrarToast(`✅ Asignación de Hermano ${p.hermano} copiada al portapapeles`);
    });
}

function copiarRepartoCompleto() {
    if (!palabraCalculadoraActual) return;
    const item = palabraCalculadoraActual;
    const usarUnidas = calcCheckUnido.checked;
    const incluirExtras = calcCheckExtras.checked;
    const soloPentCalc = calcCheckPentateuco ? calcCheckPentateuco.checked : false;

    let citasAConsolidar = [];
    const procesar = (arr) => (usarUnidas ? unirSegmentosContiguos(arr) : arr || []);

    const citasHistBase = item.lecturas.Historicos || [];
    const citasHistFiltradas = soloPentCalc ? citasHistBase.filter(c => esPentateuco(c.libro)) : citasHistBase;

    citasAConsolidar.push(...procesar(citasHistFiltradas));
    citasAConsolidar.push(...procesar(item.lecturas.Profeticos));
    citasAConsolidar.push(...procesar(item.lecturas["Nuevo Testamento"]));
    citasAConsolidar.push(...procesar(item.lecturas.Evangelio));

    if (incluirExtras) {
        citasAConsolidar.push(...procesar(item.lecturas.Salmos));
        citasAConsolidar.push(...procesar(item.lecturas.Sapienciales));
    }

    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "caracteres";
    const criterioNombres = {
        caracteres: "Tiempo de Lectura (Caracteres Reales)",
        hibrido: "Híbrido (Texto + Búsquedas)",
        citas: "Cantidad de Citas"
    };
    const criterioTxt = criterioNombres[criterioActual] || "Tiempo de Lectura";
    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual, criterioActual);

    let msg = `📖 *REPARTO DE LECTURAS PARA LA PREPARACIÓN*\n`;
    msg += `Palabra: *"${item.palabra.toUpperCase()}"* (Léon-Dufour)\n`;
    msg += `👥 ${numParticipantesActual} Participantes | ${citasFinales.length} lecturas (~${totalCharsGeneral.toLocaleString()} caracteres en total)${soloPentCalc ? ' · [Solo Pentateuco]' : ''}\n`;
    msg += `⚖️ Criterio: ${criterioTxt}\n`;
    msg += `====================================\n\n`;

    particiones.forEach(p => {
        msg += `👤 *HERMANO ${p.hermano}* (${p.totalCitas} lecturas · ~${p.totalCaracteres.toLocaleString()} car. · ${p.porcentaje}%)\n`;
        msg += `📖 *Rango:* ${p.rango}\n`;
        p.citas.forEach(c => {
            const chars = calcularCaracteresCita(c);
            msg += `  • ${c.citaOriginal} (~${chars.toLocaleString()} car.)\n`;
        });
        msg += `\n`;
    });

    msg += `====================================\n`;
    msg += `Distribución lineal óptima por Programación Dinámica. Cada hermano avanza en su Biblia sin retroceder.`;

    navigator.clipboard.writeText(msg).then(() => {
        mostrarToast("✅ Reparto completo copiado para WhatsApp");
    });
}

// Eventos de la Calculadora
btnIncPart.onclick = () => {
    if (numParticipantesActual < 12) {
        numParticipantesActual++;
        renderizarCalculadora();
    }
};

btnDecPart.onclick = () => {
    if (numParticipantesActual > 1) {
        numParticipantesActual--;
        renderizarCalculadora();
    }
};

chipNums.forEach(chip => {
    chip.onclick = () => {
        numParticipantesActual = parseInt(chip.dataset.num, 10);
        renderizarCalculadora();
    };
});

calcCheckUnido.onchange = renderizarCalculadora;
if (calcCheckPentateuco) calcCheckPentateuco.onchange = renderizarCalculadora;
calcCheckExtras.onchange = renderizarCalculadora;
if (calcSelectCriterio) calcSelectCriterio.onchange = renderizarCalculadora;
btnCerrarCalcModal.onclick = cerrarCalculadora;
btnCerrarCalcModalBottom.onclick = cerrarCalculadora;
btnCopiarRepartoCompleto.onclick = copiarRepartoCompleto;

// ==========================================================================
// MODAL DE ARTÍCULO TEOLÓGICO DE XAVIER LÉON-DUFOUR
// ==========================================================================

function abrirModalArticulo(item) {
    if (!item) return;
    articuloActual = item;
    
    // Clave en Léon-Dufour
    const vocabKey = item.vocabKey || item.palabra;
    const datosEntrada = (dataGlobalRef && dataGlobalRef.palabras) ? dataGlobalRef.palabras[vocabKey] : null;
    const rawContenido = (datosEntrada && datosEntrada.contenido) ? datosEntrada.contenido : (item.contenido || "");
    const relacionados = (datosEntrada && datosEntrada.relacionados) ? datosEntrada.relacionados : (item.relacionados || []);

    articuloModalTitulo.textContent = item.palabra;
    if (item.subInfo) {
        articuloModalSubtitulo.textContent = `Vocabulario de Teología Bíblica (${item.subInfo})`;
    } else {
        articuloModalSubtitulo.textContent = `Vocabulario de Teología Bíblica — Xavier Léon-Dufour`;
    }

    if (rawContenido) {
        articuloModalCuerpo.innerHTML = formatearArticuloHTML(rawContenido, relacionados);
        activarInteractividadArticulo(item);
    } else {
        articuloModalCuerpo.innerHTML = `
            <div class="empty-state">
                <p>No se encontró el texto completo del artículo para <strong>${item.palabra}</strong>.</p>
                <small>Puedes consultar las citas bíblicas directamente en la lista.</small>
            </div>
        `;
    }

    modalArticulo.style.display = "flex";
    document.body.classList.add("modal-open");
}

function cerrarModalArticulo() {
    modalArticulo.style.display = "none";
    if (modalCalculadora.style.display !== "flex" && modalLectura.style.display !== "flex" && modalGuia.style.display !== "flex") {
        document.body.classList.remove("modal-open");
    }
    articuloActual = null;
}

function formatearArticuloHTML(rawHtml, relacionados) {
    // 1. Transformar <cite>...</cite> en botones interactivos con clase cite-pill
    let html = rawHtml.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, (match, citeText) => {
        const cleanText = citeText.replace(/<[^>]*>/g, '').trim();
        return `<cite class="cite-pill" data-cite="${cleanText}" title="Toca para leer el texto bíblico completo de: ${cleanText}">${cleanText}</cite>`;
    });

    // 2. Transformar enlaces cruzados de Léon-Dufour
    html = html.replace(/<a class="otro" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (match, href, linkText) => {
        const cleanWord = linkText.replace(/<[^>]*>/g, '').trim();
        return `<a class="otro" data-palabra="${cleanWord}" title="Explorar tema: ${cleanWord}">${linkText}</a>`;
    });

    // 3. Agregar caja de temas y vocablos relacionados al final
    if (relacionados && relacionados.length > 0) {
        html += `
            <div class="articulo-relacionados-box">
                <div class="articulo-relacionados-title">
                    <span>🔗</span> Temas y Vocablos Teológicos Relacionados:
                </div>
                <div class="articulo-relacionados-chips">
        `;
        relacionados.forEach(rel => {
            const nombreRel = (typeof rel === 'object' && rel.text) ? rel.text : rel;
            html += `<button class="chip-relacionado" data-palabra="${nombreRel}" title="Ver tema teológico '${nombreRel}'">${nombreRel}</button>`;
        });
        html += `
                </div>
            </div>
        `;
    }

    return html;
}

function resolverCitaDesdeTexto(citeText, item) {
    if (!citeText) return null;
    const clean = citeText.trim();

    // 1. Buscar coincidencia exacta en las lecturas de la palabra
    if (item && item.lecturas) {
        for (const cat of Object.keys(item.lecturas)) {
            const arr = item.lecturas[cat];
            if (arr) {
                const found = arr.find(c => c.citaOriginal.toLowerCase() === clean.toLowerCase());
                if (found) return found;
            }
        }
    }

    // 2. Parseo inteligente de libro y capítulo
    const m = clean.match(/^([0-9]?[a-záéíóúñA-ZÁÉÍÓÚÑ]+)\s*([0-9]+)(?:[,:]([0-9]+)(?:-([0-9]+))?)?/i);
    if (m) {
        const rawBook = normalizar(m[1]);
        const cap = parseInt(m[2], 10);
        const vIni = m[3] ? parseInt(m[3], 10) : null;
        const vFin = m[4] ? parseInt(m[4], 10) : null;

        let bookCode = null;
        for (const [code, name] of Object.entries(NOMBRES_LIBROS)) {
            const nameNorm = normalizar(name);
            const codeNorm = normalizar(code);
            if (codeNorm === rawBook || nameNorm.startsWith(rawBook) || rawBook.startsWith(codeNorm) || rawBook.startsWith(nameNorm.slice(0, 3))) {
                bookCode = code;
                break;
            }
        }

        if (bookCode) {
            const ref = `${bookCode}-${cap}`;
            if (dbTextos[ref]) {
                return {
                    citaOriginal: clean,
                    libro: bookCode,
                    libroNombre: NOMBRES_LIBROS[bookCode] || bookCode,
                    capitulo: cap,
                    versiculoInicio: vIni,
                    versiculoFin: vFin,
                    textoRef: ref
                };
            }
        }
    }
    return null;
}

function activarInteractividadArticulo(item) {
    // Clic en citas bíblicas dentro del artículo
    articuloModalCuerpo.querySelectorAll(".cite-pill").forEach(pill => {
        pill.onclick = (e) => {
            e.stopPropagation();
            const citeText = pill.dataset.cite;
            const citaObj = resolverCitaDesdeTexto(citeText, item);
            if (citaObj) {
                abrirModalLectura(citaObj);
            } else {
                mostrarToast(`📖 Referencia: ${citeText}`);
            }
        };
    });

    // Clic en términos relacionados o enlaces internos
    articuloModalCuerpo.querySelectorAll(".otro, .chip-relacionado").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const termino = btn.dataset.palabra;
            cerrarModalArticulo();
            inputBusqueda.value = termino;
            actualizarVista();
            mostrarToast(`🔍 Explorando "${termino}"`);
        };
    });
}

if (btnCerrarArticuloModal) btnCerrarArticuloModal.onclick = cerrarModalArticulo;
if (btnCerrarArticuloModalBottom) btnCerrarArticuloModalBottom.onclick = cerrarModalArticulo;

if (btnCopiarArticulo) {
    btnCopiarArticulo.onclick = () => {
        if (!articuloActual) return;
        const textoPlano = articuloModalCuerpo.innerText;
        const header = `📖 VOCABULARIO DE TEOLOGÍA BÍBLICA — XAVIER LÉON-DUFOUR\nTema: "${articuloActual.palabra.toUpperCase()}"\n==================================================\n\n`;
        const copia = header + textoPlano;
        navigator.clipboard.writeText(copia).then(() => {
            mostrarToast(`✅ Artículo íntegro de "${articuloActual.palabra}" copiado`);
        });
    };
}

// --- MODAL DE LECTURA BÍBLICA ---
function abrirModalLectura(cita) {
    citaModalActual = cita;
    const ref = cita.textoRef;
    const nombreLibro = cita.libroNombre || NOMBRES_LIBROS[cita.libro] || cita.libro;
    
    modalTitulo.textContent = cita.citaOriginal;
    modalSubtitulo.textContent = `${nombreLibro} (Capítulo ${cita.capitulo})`;

    const textoCapitulo = dbTextos[ref];
    if (textoCapitulo) {
        modalTextoCuerpo.innerHTML = formatearTextoConResaltado(textoCapitulo, cita);
    } else {
        modalTextoCuerpo.innerHTML = `
            <div class="empty-state">
                <p>No se encontró el texto precargado para <strong>${ref}</strong>.</p>
                <small>Puedes consultar directamente en la Biblia de Jerusalén.</small>
            </div>
        `;
    }

    modalLectura.style.display = "flex";
    document.body.classList.add("modal-open");

    // Auto-scroll y posicionamiento exacto en el versículo donde comienza la cita
    setTimeout(() => {
        const target = modalTextoCuerpo.querySelector("#cita-start-target") || modalTextoCuerpo.querySelector(".highlighted-verse");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            modalTextoCuerpo.scrollTop = 0;
        }
    }, 60);
}

function formatearTextoConResaltado(html, cita) {
    if (!cita) return html;

    let start = cita.versiculoInicio ? parseInt(cita.versiculoInicio, 10) : null;
    let end = cita.versiculoFin ? parseInt(cita.versiculoFin, 10) : (cita.continuidad === 's' ? start + 1 : (cita.continuidad === 'ss' ? 9999 : start));

    // Si el objeto cita no tiene versiculoInicio directo, extraerlo de citaOriginal (ej. "Mt 5,38-42" -> 38)
    if (!start && cita.citaOriginal) {
        const m = cita.citaOriginal.match(/,\s*(\d+)(?:\s*-\s*(\d+))?/);
        if (m) {
            start = parseInt(m[1], 10);
            end = m[2] ? parseInt(m[2], 10) : (cita.continuidad === 's' ? start + 1 : (cita.continuidad === 'ss' ? 9999 : start));
        }
    }

    if (!start) return html;

    let isFirstHighlighted = true;
    return html.replace(/<strong>(\d+)<\/strong>([^<]*)/g, (match, vNum, vContent) => {
        const num = parseInt(vNum, 10);
        if (num >= start && num <= (end || start)) {
            const idAttr = isFirstHighlighted ? ' id="cita-start-target"' : '';
            if (isFirstHighlighted) isFirstHighlighted = false;
            return `<mark${idAttr} class="highlighted-verse"><strong>${vNum}</strong>${vContent}</mark>`;
        }
        return `<strong>${vNum}</strong>${vContent}`;
    });
}

function cerrarModal() {
    modalLectura.style.display = "none";
    // Si el modal de la calculadora, artículo o guía estaba abierto, mantener modal-open en el body
    if (modalCalculadora.style.display !== "flex" && modalArticulo.style.display !== "flex" && modalGuia.style.display !== "flex") {
        document.body.classList.remove("modal-open");
    }
    citaModalActual = null;
}

btnCerrarModal.onclick = cerrarModal;

if (btnCopiarModal) {
    btnCopiarModal.onclick = () => {
        if (!citaModalActual) return;
        const textoPlano = modalTextoCuerpo.innerText;
        const copia = `${citaModalActual.citaOriginal}\n\n${textoPlano}`;
        navigator.clipboard.writeText(copia).then(() => {
            mostrarToast("✅ Lectura bíblica copiada al portapapeles");
        });
    };
}

// --- GESTIÓN DE EXCLUSIONES (LocalStorage) ---
function guardarLocalStorage() {
    localStorage.setItem('palabrasExcluidas', JSON.stringify([...setExcluidos]));
    if (badgeExcluidas) {
        badgeExcluidas.textContent = setExcluidos.size;
        badgeExcluidas.style.display = setExcluidos.size > 0 ? "inline-flex" : "none";
    }
    if (countExcluidasHeader) {
        countExcluidasHeader.textContent = setExcluidos.size;
    }
}

function renderizarTags() {
    contenedorTags.innerHTML = "";
    if (setExcluidos.size === 0) {
        contenedorTags.innerHTML = `<span class="sin-exclusiones">Sin palabras excluidas. Toca "🔄 Cargar Predeterminadas" para cargar la lista de temas ya celebrados.</span>`;
        if (countExcluidasHeader) countExcluidasHeader.textContent = "0";
        return;
    }

    if (countExcluidasHeader) countExcluidasHeader.textContent = setExcluidos.size;

    setExcluidos.forEach(pNorm => {
        // Encontrar objeto de palabra para mostrar el nombre con formato y número
        const item = listaGlobal.find(i => normalizar(i.palabra) === pNorm || (i.vocabKey && normalizar(i.vocabKey) === pNorm) || (i.palabraNorm && i.palabraNorm.includes(pNorm)));
        let nombreMostrar = item ? item.palabra : (pNorm.charAt(0).toUpperCase() + pNorm.slice(1));
        if (item && item.numPrecat) {
            nombreMostrar = `#${item.numPrecat} ${item.palabra}`;
        }

        const tag = document.createElement("div");
        tag.className = "tag-excluido";
        tag.setAttribute("title", `Toca la '×' para quitar la exclusión de "${item ? item.palabra : pNorm}"`);
        tag.innerHTML = `<span>${nombreMostrar}</span> <button class="btn-remove-tag" aria-label="Quitar exclusión">&times;</button>`;
        tag.querySelector("button").onclick = () => eliminarExclusion(pNorm, item ? item.palabra : nombreMostrar);
        contenedorTags.appendChild(tag);
    });
}

function agregarExclusiones() {
    const texto = inputExcluir.value;
    if (!texto) return;
    const nuevas = texto.split(',').map(t => normalizar(t)).filter(t => t.length > 0);
    let invalidas = [];
    let cambios = false;

    nuevas.forEach(pNorm => {
        if (setPalabrasExistentes.has(pNorm)) {
            if (!setExcluidos.has(pNorm)) {
                setExcluidos.add(pNorm);
                cambios = true;
            }
        } else {
            invalidas.push(pNorm);
        }
    });

    if (invalidas.length > 0) {
        alert(`No existen en el Vocabulario:\n- ${invalidas.join("\n- ")}`);
    }

    inputExcluir.value = "";
    if (cambios) {
        guardarLocalStorage();
        renderizarTags();
        actualizarVista();
        mostrarToast("✅ Palabras añadidas a exclusiones");
    }
}

function excluirPalabraDirecta(nombrePalabra) {
    const pNorm = normalizar(nombrePalabra);
    if (!setExcluidos.has(pNorm)) {
        setExcluidos.add(pNorm);
        guardarLocalStorage();
        renderizarTags();
        actualizarVista();
        mostrarToast(`🚫 "${nombrePalabra}" añadida a excluidas`);
    }
}

function eliminarExclusion(pNorm, nombreOriginal) {
    setExcluidos.delete(pNorm);
    guardarLocalStorage();
    renderizarTags();
    actualizarVista();
    mostrarToast(`✨ Exclusión de "${nombreOriginal}" eliminada`);
}

function borrarTodasExclusiones() {
    if (setExcluidos.size === 0) {
        mostrarToast("ℹ️ No hay palabras excluidas actualmente");
        return;
    }
    setExcluidos.clear();
    guardarLocalStorage();
    renderizarTags();
    actualizarVista();
    mostrarToast("🗑️ Todas las exclusiones han sido borradas");
}

function restaurarExclusionesPredeterminadas() {
    EXCLUSIONES_PREDETERMINADAS.forEach(p => {
        setExcluidos.add(normalizar(p));
    });
    guardarLocalStorage();
    renderizarTags();
    actualizarVista();
    mostrarToast("🔄 Lista predeterminada de 25 temas cargada");
}

btnAgregarExclusion.addEventListener("click", agregarExclusiones);
inputExcluir.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarExclusiones();
});

if (btnBorrarTodasExclusiones) btnBorrarTodasExclusiones.onclick = borrarTodasExclusiones;
if (btnRestaurarExclusiones) btnRestaurarExclusiones.onclick = restaurarExclusionesPredeterminadas;

// --- MODAL DE GUÍA Y CRITERIOS EXPLICATIVOS ---
const modalGuia = document.getElementById("modalGuia");
const btnAbrirGuia = document.getElementById("btnAbrirGuia");
const btnCerrarGuiaModal = document.getElementById("btnCerrarGuiaModal");
const btnCerrarGuiaModalBottom = document.getElementById("btnCerrarGuiaModalBottom");
const guiaTabBtns = document.querySelectorAll(".guia-tab-btn");
const guiaTabPanes = document.querySelectorAll(".guia-tab-pane");

function abrirGuia() {
    if (modalGuia) {
        modalGuia.style.display = "flex";
        document.body.classList.add("modal-open");
    }
}

function cerrarGuia() {
    if (modalGuia) {
        modalGuia.style.display = "none";
        // Si no hay otros modales abiertos, remover modal-open
        if (modalLectura.style.display !== "flex" && modalCalculadora.style.display !== "flex") {
            document.body.classList.remove("modal-open");
        }
    }
}

if (btnAbrirGuia) btnAbrirGuia.onclick = abrirGuia;
if (btnCerrarGuiaModal) btnCerrarGuiaModal.onclick = cerrarGuia;
if (btnCerrarGuiaModalBottom) btnCerrarGuiaModalBottom.onclick = cerrarGuia;

guiaTabBtns.forEach(btn => {
    btn.onclick = () => {
        const targetTab = btn.dataset.tab;
        guiaTabBtns.forEach(b => b.classList.remove("active"));
        guiaTabPanes.forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const activePane = document.getElementById(targetTab);
        if (activePane) activePane.classList.add("active");
    };
});

window.addEventListener("click", (e) => {
    if (e.target === modalLectura) {
        cerrarModal();
    } else if (e.target === modalCalculadora) {
        cerrarCalculadora();
    } else if (e.target === modalArticulo) {
        cerrarModalArticulo();
    } else if (e.target === modalGuia) {
        cerrarGuia();
    }
});

// --- GESTOR DE TEMA (MODO OSCURO POR DEFECTO / MODO CLARO) ---
function aplicarTema(tema) {
    if (tema === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeIcon) themeIcon.textContent = "🌙";
        if (themeText) themeText.textContent = " Oscuro";
        if (btnToggleTema) btnToggleTema.setAttribute("title", "Cambiar a modo oscuro");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeIcon) themeIcon.textContent = "☀️";
        if (themeText) themeText.textContent = " Claro";
        if (btnToggleTema) btnToggleTema.setAttribute("title", "Cambiar a modo claro");
    }
    localStorage.setItem("tema_preferido", tema);
}

// Inicializar tema (por defecto 'dark')
const temaGuardado = localStorage.getItem("tema_preferido") || "dark";
aplicarTema(temaGuardado);

if (btnToggleTema) {
    btnToggleTema.onclick = () => {
        const actual = document.documentElement.getAttribute("data-theme") || "dark";
        const nuevo = actual === "dark" ? "light" : "dark";
        aplicarTema(nuevo);
        mostrarToast(nuevo === "dark" ? "🌙 Modo Oscuro activado" : "☀️ Modo Claro activado", 1800);
    };
}

// --- TOGGLE SECCIÓN DE BÚSQUEDA Y FILTROS RÁPIDOS ---
if (btnToggleSearch && seccionBusqueda) {
    btnToggleSearch.onclick = () => {
        seccionBusqueda.classList.toggle("collapsed");
        const abierto = !seccionBusqueda.classList.contains("collapsed");
        btnToggleSearch.classList.toggle("active", abierto);
        btnToggleSearch.setAttribute("title", abierto ? "Toca para ocultar el buscador y los filtros rápidos" : "Toca para mostrar el buscador y los filtros rápidos");
        if (abierto && inputBusqueda) {
            inputBusqueda.focus();
        }
    };
}

// --- TOGGLE PANEL DE FILTROS ---
if (btnToggleFiltros) {
    btnToggleFiltros.onclick = () => {
        panelFiltros.classList.toggle("collapsed");
        const abierto = !panelFiltros.classList.contains("collapsed");
        btnToggleFiltros.classList.toggle("active", abierto);
        btnToggleFiltros.setAttribute("title", abierto ? "Toca para ocultar filtros avanzados" : "Toca para mostrar filtros avanzados");
    };
}

// --- LISTENERS DE MODO (PRECATECUMENADO VS TODAS) ---
if (btnModoPrecat) {
    btnModoPrecat.onclick = () => {
        modoFiltro = "precat";
        btnModoPrecat.classList.add("active");
        if (btnModoTodas) btnModoTodas.classList.remove("active");
        selectOrden.value = "precat";
        if (checkPentateuco) checkPentateuco.checked = true;
        if (checkSoloCompletas) checkSoloCompletas.checked = true;
        actualizarVista();
    };
}

if (btnModoTodas) {
    btnModoTodas.onclick = () => {
        modoFiltro = "todas";
        btnModoTodas.classList.add("active");
        if (btnModoPrecat) btnModoPrecat.classList.remove("active");
        if (selectOrden.value === "precat") {
            selectOrden.value = "alpha";
        }
        actualizarVista();
    };
}

// --- LISTENERS DE FILTROS Y BÚSQUEDA ---
inputBusqueda.addEventListener("input", actualizarVista);
selectOrden.addEventListener("change", actualizarVista);
checkExtras.addEventListener("change", actualizarVista);
if (checkPentateuco) {
    checkPentateuco.addEventListener("change", actualizarVista);
    checkPentateuco.addEventListener("input", actualizarVista);
}
if (checkSoloCompletas) {
    checkSoloCompletas.addEventListener("change", actualizarVista);
    checkSoloCompletas.addEventListener("input", actualizarVista);
}
if (checkPericopas) {
    const handlePericopas = () => {
        const val = checkPericopas.checked;
        listaPrecat.forEach(p => p.estaUnido = val);
        listaTodas.forEach(p => p.estaUnido = val);
        actualizarVista();
    };
    checkPericopas.addEventListener("change", handlePericopas);
    checkPericopas.addEventListener("input", handlePericopas);
}