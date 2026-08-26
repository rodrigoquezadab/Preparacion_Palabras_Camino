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

// --- MAPA DE ABREVIATURAS Y SIGLAS BÍBLICAS CANÓNICAS EN ESPAÑOL ---
const BOOK_MAP = {
    // Pentateuco e Históricos
    "gen": { code: "GEN", name: "Génesis" }, "gn": { code: "GEN", name: "Génesis" },
    "ex": { code: "EX", name: "Éxodo" }, "éx": { code: "EX", name: "Éxodo" }, "exo": { code: "EX", name: "Éxodo" },
    "lev": { code: "LEV", name: "Levítico" }, "lv": { code: "LEV", name: "Levítico" },
    "num": { code: "NUM", name: "Números" }, "nm": { code: "NUM", name: "Números" },
    "dt": { code: "DT", name: "Deuteronomio" }, "deut": { code: "DT", name: "Deuteronomio" },
    "jos": { code: "JOS", name: "Josué" }, "jue": { code: "JUE", name: "Jueces" }, "juec": { code: "JUE", name: "Jueces" },
    "rt": { code: "RUT", name: "Rut" }, "rut": { code: "RUT", name: "Rut" },
    "1sam": { code: "1SAM", name: "1 Samuel" }, "1sa": { code: "1SAM", name: "1 Samuel" }, "1s": { code: "1SAM", name: "1 Samuel" },
    "2sam": { code: "2SAM", name: "2 Samuel" }, "2sa": { code: "2SAM", name: "2 Samuel" }, "2s": { code: "2SAM", name: "2 Samuel" },
    "1re": { code: "1RE", name: "1 Reyes" }, "1r": { code: "1RE", name: "1 Reyes" }, "1rey": { code: "1RE", name: "1 Reyes" },
    "2re": { code: "2RE", name: "2 Reyes" }, "2r": { code: "2RE", name: "2 Reyes" }, "2rey": { code: "2RE", name: "2 Reyes" },
    "1cr": { code: "1CRO", name: "1 Crónicas" }, "1cro": { code: "1CRO", name: "1 Crónicas" },
    "2cr": { code: "2CRO", name: "2 Crónicas" }, "2cro": { code: "2CRO", name: "2 Crónicas" },
    "esd": { code: "ESD", name: "Esdras" }, "neh": { code: "NEH", name: "Nehemías" }, "ne": { code: "NEH", name: "Nehemías" },
    "tob": { code: "TOB", name: "Tobías" }, "tb": { code: "TOB", name: "Tobías" },
    "jdt": { code: "JUD", name: "Judit" }, "judit": { code: "JUD", name: "Judit" },
    "est": { code: "EST", name: "Ester" },
    "1mac": { code: "1MAC", name: "1 Macabeos" }, "1ma": { code: "1MAC", name: "1 Macabeos" }, "1m": { code: "1MAC", name: "1 Macabeos" },
    "2mac": { code: "2MAC", name: "2 Macabeos" }, "2ma": { code: "2MAC", name: "2 Macabeos" }, "2m": { code: "2MAC", name: "2 Macabeos" },

    // Sapienciales
    "job": { code: "JOB", name: "Job" }, "jb": { code: "JOB", name: "Job" },
    "prov": { code: "PROV", name: "Proverbios" }, "pr": { code: "PROV", name: "Proverbios" },
    "ecl": { code: "ECL", name: "Eclesiastés" }, "qo": { code: "ECL", name: "Eclesiastés" }, "qoh": { code: "ECL", name: "Eclesiastés" },
    "cant": { code: "CANT", name: "Cantar de los Cantares" }, "ct": { code: "CANT", name: "Cantar de los Cantares" },
    "sab": { code: "SAB", name: "Sabiduría" }, "sb": { code: "SAB", name: "Sabiduría" },
    "eclo": { code: "ECLO", name: "Eclesiástico" }, "sir": { code: "ECLO", name: "Eclesiástico" },

    // Salmos
    "sal": { code: "SAL", name: "Salmos" }, "sl": { code: "SAL", name: "Salmos" }, "ps": { code: "SAL", name: "Salmos" },

    // Proféticos
    "is": { code: "IS", name: "Isaías" }, "isa": { code: "IS", name: "Isaías" },
    "jer": { code: "JER", name: "Jeremías" }, "jr": { code: "JER", name: "Jeremías" },
    "lam": { code: "LAM", name: "Lamentaciones" }, "bar": { code: "BAR", name: "Baruc" }, "ba": { code: "BAR", name: "Baruc" },
    "ez": { code: "EZ", name: "Ezequiel" }, "dan": { code: "DAN", name: "Daniel" }, "dn": { code: "DAN", name: "Daniel" },
    "os": { code: "OS", name: "Oseas" }, "jl": { code: "JL", name: "Joel" },
    "am": { code: "AM", name: "Amós" }, "abd": { code: "ABD", name: "Abdías" },
    "jon": { code: "JON", name: "Jonás" }, "miq": { code: "MIQ", name: "Miqueas" }, "mi": { code: "MIQ", name: "Miqueas" },
    "nah": { code: "NAH", name: "Nahúm" }, "na": { code: "NAH", name: "Nahúm" },
    "hab": { code: "HAB", name: "Habacuc" }, "ha": { code: "HAB", name: "Habacuc" },
    "sof": { code: "SOF", name: "Sofonías" }, "ag": { code: "AG", name: "Ageo" }, "hag": { code: "AG", name: "Ageo" },
    "zac": { code: "ZAC", name: "Zacarías" }, "za": { code: "ZAC", name: "Zacarías" },
    "mal": { code: "MAL", name: "Malaquías" }, "ml": { code: "MAL", name: "Malaquías" },

    // Evangelios
    "mt": { code: "MT", name: "Mateo" }, "mc": { code: "MC", name: "Marcos" },
    "lc": { code: "LC", name: "Lucas" }, "jn": { code: "JN", name: "Juan" },

    // Cartas / Nuevo Testamento
    "hch": { code: "HCH", name: "Hechos de los Apóstoles" }, "act": { code: "HCH", name: "Hechos de los Apóstoles" }, "he": { code: "HCH", name: "Hechos de los Apóstoles" },
    "rom": { code: "ROM", name: "Romanos" }, "rm": { code: "ROM", name: "Romanos" },
    "1cor": { code: "1COR", name: "1 Corintios" }, "1co": { code: "1COR", name: "1 Corintios" },
    "2cor": { code: "2COR", name: "2 Corintios" }, "2co": { code: "2COR", name: "2 Corintios" },
    "gal": { code: "GAL", name: "Gálatas" }, "ga": { code: "GAL", name: "Gálatas" },
    "ef": { code: "EF", name: "Efesios" }, "flp": { code: "FLP", name: "Filipenses" }, "fil": { code: "FLP", name: "Filipenses" },
    "col": { code: "COL", name: "Colosenses" },
    "1tes": { code: "1TES", name: "1 Tesalonicenses" }, "1te": { code: "1TES", name: "1 Tesalonicenses" },
    "2tes": { code: "2TES", name: "2 Tesalonicenses" }, "2te": { code: "2TES", name: "2 Tesalonicenses" },
    "1tim": { code: "1TIM", name: "1 Timoteo" }, "1ti": { code: "1TIM", name: "1 Timoteo" },
    "2tim": { code: "2TIM", name: "2 Timoteo" }, "2ti": { code: "2TIM", name: "2 Timoteo" },
    "tit": { code: "TIT", name: "Tito" }, "ti": { code: "TIT", name: "Tito" },
    "flm": { code: "FLM", name: "Filemón" }, "heb": { code: "HEB", name: "Hebreos" },
    "st": { code: "ST", name: "Santiago" }, "stg": { code: "ST", name: "Santiago" }, "sant": { code: "ST", name: "Santiago" },
    "1pe": { code: "1PE", name: "1 Pedro" }, "1p": { code: "1PE", name: "1 Pedro" },
    "2pe": { code: "2PE", name: "2 Pedro" }, "2p": { code: "2PE", name: "2 Pedro" },
    "1jn": { code: "1JN", name: "1 Juan" }, "1j": { code: "1JN", name: "1 Juan" },
    "2jn": { code: "2JN", name: "2 Juan" }, "2j": { code: "2JN", name: "2 Juan" },
    "3jn": { code: "3JN", name: "3 Juan" }, "3j": { code: "3JN", name: "3 Juan" },
    "jud": { code: "JUDAS", name: "Judas" }, "judas": { code: "JUDAS", name: "Judas" },
    "ap": { code: "AP", name: "Apocalipsis" }, "apoc": { code: "AP", name: "Apocalipsis" }
};

const SINGLE_CHAPTER_BOOKS = new Set(["ABD", "FLM", "2JN", "3JN", "JUDAS"]);

// --- PARSEADOR INTELIGENTE DE CITAS CON HERENCIA CONTEXTUAL DE LIBROS ---
function parseSmartQuoteClient(rawText, lastBookInfo) {
    if (!rawText) return null;
    let clean = rawText.replace(/[\n\r\t]+/g, ' ').trim();
    clean = clean.replace(/^[\[(]+|[\]),;]+$/g, '').trim();

    // Normalizaciones tipográficas habituales de digitalización
    if (/^1s\s+\d/i.test(clean)) clean = clean.replace(/^1s\s+/i, 'Is ');
    if (/^1Jn\s+1[5-7]/i.test(clean)) clean = clean.replace(/^1Jn\s+/i, 'Jn ');
    if (/^2Cor\s+15/i.test(clean)) clean = clean.replace(/^2Cor\s+/i, '1Cor ');
    if (/^Ap\s+33,3/i.test(clean)) clean = 'Ap 3,3';
    if (/^Ez\s+98/i.test(clean)) clean = 'Ez 28,2-5';

    let parts = clean.split(' ').filter(Boolean);
    let bookKey = null;
    let rest = '';

    if (parts.length >= 2) {
        let candidate = parts[0].toLowerCase().replace(/[\.:]/g, '');
        if (BOOK_MAP[candidate]) {
            bookKey = candidate;
            rest = parts.slice(1).join(' ');
        }
    }

    // Si no contiene sigla inicial explícita, hereda el libro de la cita anterior (contexto activo)
    if (!bookKey && lastBookInfo) {
        bookKey = lastBookInfo.key;
        rest = clean;
    }

    if (!bookKey || !BOOK_MAP[bookKey]) {
        return null;
    }

    let bookInfo = BOOK_MAP[bookKey];
    let isSingleChapter = SINGLE_CHAPTER_BOOKS.has(bookInfo.code);

    let cap = null;
    let vIni = null;
    let vFin = null;
    let continuidad = null;

    if (isSingleChapter) {
        cap = 1;
        let vMatch = rest.match(/^(?:1,)?(\d+)(?:[–\-](\d+))?(?:([a-z]+))?/i);
        if (vMatch) {
            vIni = parseInt(vMatch[1], 10);
            if (vMatch[2]) vFin = parseInt(vMatch[2], 10);
            if (vMatch[3] && vMatch[3].includes('ss')) continuidad = 'ss';
            else if (vMatch[3] && vMatch[3].includes('s')) continuidad = 's';
        }
    } else {
        let capMatch = rest.match(/^(\d+)(?:[,.]([0-9a-zA-Z\-–.,sp ]+))?/);
        if (capMatch) {
            let num1 = parseInt(capMatch[1], 10);
            let versePart = capMatch[2] || '';

            if (versePart) {
                cap = num1;
                if (versePart.includes('ss')) continuidad = 'ss';
                else if (versePart.includes('s') && !versePart.includes('–') && !versePart.includes('-')) continuidad = 's';
                
                let rangeMatch = versePart.match(/^(\d+)(?:[–\-](\d+))?/);
                if (rangeMatch) {
                    vIni = parseInt(rangeMatch[1], 10);
                    if (rangeMatch[2]) vFin = parseInt(rangeMatch[2], 10);
                }
            } else {
                cap = num1;
            }
        }
    }

    if (cap === null || isNaN(cap)) cap = 1;

    let citaCorta = `${bookInfo.code} ${rest}`;
    let citaCompleta = `${bookInfo.name} ${rest}`;

    return {
        key: bookKey,
        citaOriginal: citaCorta,
        citaCompleta: citaCompleta,
        libro: bookInfo.code,
        libroNombre: bookInfo.name,
        capitulo: cap,
        versiculoInicio: vIni,
        versiculoFin: vFin,
        continuidad: continuidad,
        textoRef: `${bookInfo.code}-${cap}`
    };
}

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
const btnModoEditarExclusiones = document.getElementById("btnModoEditarExclusiones");
const grupoAccionesEdicion = document.getElementById("grupoAccionesEdicion");
const btnBorrarTodasExclusiones = document.getElementById("btnBorrarTodasExclusiones");
const btnRestaurarExclusiones = document.getElementById("btnRestaurarExclusiones");
const contenedorTags = document.getElementById("contenedorTags");
let modoEdicionExclusiones = false;
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
const btnExportarFichaHTML = document.getElementById("btnExportarFichaHTML");
const calcViewsWrapper = document.getElementById("calcViewsWrapper");
const calcTabBtnCards = document.getElementById("calcTabBtnCards");
const calcTabBtnArticulo = document.getElementById("calcTabBtnArticulo");
const calcArticuloCuerpo = document.getElementById("calcArticuloCuerpo");
const calcArticuloLegend = document.getElementById("calcArticuloLegend");
let calcActiveView = "articulo";

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

            const normKey = normalizar(item.vocabKey);
            const normName = normalizar(item.nombre);
            const remisionesAlias = (typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaAliasPorPalabra)
                ? (INDICE_REMISIONES_DATA.mapaAliasPorPalabra[normKey] || INDICE_REMISIONES_DATA.mapaAliasPorPalabra[normName] || [])
                : [];
            const temasConexos = (typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaTemasConexos)
                ? (INDICE_REMISIONES_DATA.mapaTemasConexos[normKey] || INDICE_REMISIONES_DATA.mapaTemasConexos[normName] || [])
                : [];

            return {
                id: item.num,
                numPrecat: item.num,
                palabra: item.nombre,
                subInfo: item.subInfo || "",
                vocabKey: item.vocabKey,
                palabraNorm: pNorm,
                aliasRemisiones: remisionesAlias,
                temasConexos: temasConexos,
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

            const remisionesAlias = (typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaAliasPorPalabra)
                ? (INDICE_REMISIONES_DATA.mapaAliasPorPalabra[pNorm] || [])
                : [];
            const temasConexos = (typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaTemasConexos)
                ? (INDICE_REMISIONES_DATA.mapaTemasConexos[pNorm] || [])
                : [];

            return {
                id: index + 1,
                numPrecat: numPrecat,
                palabra: p.palabra,
                subInfo: numPrecat ? `Precat. #${numPrecat}` : "",
                vocabKey: p.palabra,
                palabraNorm: pNorm,
                aliasRemisiones: remisionesAlias,
                temasConexos: temasConexos,
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

        if (busqueda.length > 0) {
            const coincideDirecto = item.palabraNorm.includes(busqueda);
            
            // Buscar en alias y remisiones oficiales del Léon-Dufour
            let coincideAlias = false;
            let aliasEncontrado = null;

            if (item.aliasRemisiones && item.aliasRemisiones.length > 0) {
                for (const alias of item.aliasRemisiones) {
                    if (normalizar(alias).includes(busqueda)) {
                        coincideAlias = true;
                        aliasEncontrado = alias;
                        break;
                    }
                }
            }

            // O si la búsqueda exacta/parcial coincide con un término del índice de remisiones
            if (!coincideAlias && typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaRemisiones) {
                const rem = INDICE_REMISIONES_DATA.mapaRemisiones[busqueda];
                if (rem && rem.destinos) {
                    if (rem.destinos.some(d => normalizar(d) === pNormPalabra || normalizar(d) === pNormVocab)) {
                        coincideAlias = true;
                        aliasEncontrado = rem.termino;
                    }
                }
            }

            if (!coincideDirecto && !coincideAlias) return false;

            item.coincidenciaRemision = coincideAlias ? aliasEncontrado : null;
        } else {
            item.coincidenciaRemision = null;
        }

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

        const tooltipTotal = item.estaUnido 
            ? `Total actual: ${totalUnido} perícopas. ${diffTotal !== 0 ? `El (${diffTotal}) indica que se han consolidado ${Math.abs(diffTotal)} citas contiguas de las ${totalOriginalBase} originales de Léon-Dufour.` : `Total de citas originales: ${totalOriginalBase}`}`
            : `Total actual: ${totalOriginalBase} citas individuales sueltas.`;

        const totalPillText = item.estaUnido 
            ? `${totalUnido} ${diffTotal !== 0 ? `<small class="diff-tag">(${diffTotal})</small>` : ''} perícopas`
            : `${totalOriginalBase} citas`;

        const card = document.createElement("article");
        card.className = `word-card ${cumple4PartesActual ? 'card-cumple' : 'card-incompleta'}`;
        card.id = `card-${item.id}`;

        // --- ENCABEZADO DE LA TARJETA ---
        const header = document.createElement("div");
        header.className = "word-card-header";
        header.setAttribute("title", "Toca para desplegar las citas bíblicas de esta palabra");

        // 1. Fila Superior: Número y Nombre de la Palabra (Izq.) + Total Citas (Der.)
        const titleRow = document.createElement("div");
        titleRow.className = "word-title-row";
        titleRow.innerHTML = `
            <div class="word-title-left">
                <span class="word-number">#${item.numPrecat || item.id}</span>
                <h2 class="word-name">
                    ${item.palabra}
                    ${item.subInfo ? `<span class="word-subname" title="Referencia en Léon-Dufour">(${item.subInfo})</span>` : ''}
                </h2>
                ${item.coincidenciaRemision ? `<div class="badge-remision-match" title="Esta palabra aparece por coincidencia en el índice de remisiones oficial de Xavier Léon-Dufour">💡 Remisión: "<strong>${item.coincidenciaRemision}</strong>" ➔ ${item.palabra}</div>` : ''}
            </div>
            <span class="count-pill total-pill" title="${tooltipTotal}">
                ${totalPillText}
            </span>
        `;
        header.appendChild(titleRow);

        // 2. Fila Secundaria: Criterio y Acciones Rápidas (Agrupadas hacia la derecha)
        const metaActionsRow = document.createElement("div");
        metaActionsRow.className = "word-meta-actions-row";

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

        metaActionsRow.appendChild(badgeCriterio);
        metaActionsRow.appendChild(btnQuickArticulo);
        metaActionsRow.appendChild(btnQuickCalc);
        header.appendChild(metaActionsRow);

        // 3. Fila de resumen de conteos por categoría (Pastillas interactivas compactas)
        const countsRow = document.createElement("div");
        countsRow.className = "word-counts-row";
        
        const histLabel = soloPentateuco ? "Pent" : "Hist";
        const histCount = lecturasActuales.Hist.length;
        const histTitle = soloPentateuco 
            ? `Pentateuco / Torá: ${histCount} citas (Históricos posteriores ocultos)` 
            : `Históricos / Torá: ${item.hist} citas`;

        countsRow.innerHTML = `
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
        btnCalc.className = "btn-action btn-calc";
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

        // Bloque de Temas Conexos y Remisiones Oficiales de Xavier Léon-Dufour
        const tieneTemas = item.temasConexos && item.temasConexos.length > 0;
        const tieneAlias = item.aliasRemisiones && item.aliasRemisiones.length > 0;

        if (tieneTemas || tieneAlias) {
            const conexosBox = document.createElement("div");
            conexosBox.className = "temas-conexos-container";

            let htmlConexos = ``;
            if (tieneAlias) {
                htmlConexos += `
                    <div class="temas-conexos-title">🔄 También se prepara aquí (Remisiones / Sinónimos):</div>
                    <div class="temas-conexos-chips">
                        ${item.aliasRemisiones.map(a => `<span class="chip-conexo" title="Toca para buscar '${a}'" onclick="event.stopPropagation(); buscarTermino('${a}');">🔍 ${a}</span>`).join('')}
                    </div>
                `;
            }

            if (tieneTemas) {
                htmlConexos += `
                    <div class="temas-conexos-title" style="${tieneAlias ? 'margin-top: 4px;' : ''}">🔗 Temas conexos según Léon-Dufour:</div>
                    <div class="temas-conexos-chips">
                        ${item.temasConexos.map(t => `<span class="chip-conexo" title="Toca para buscar '${t}'" onclick="event.stopPropagation(); buscarTermino('${t}');">📖 ${t}</span>`).join('')}
                    </div>
                `;
            }

            conexosBox.innerHTML = htmlConexos;
            body.appendChild(conexosBox);
        }

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

function extraerCitasEnOrdenDeTexto(rawContenido, item, usarUnidas, soloPentCalc, incluirExtras) {
    if (!rawContenido) return [];
    const citasList = [];
    let lastBookInfo = null;
    let seqCounter = 0;

    rawContenido.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, (match, citeText) => {
        const cleanText = citeText.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return match;
        const parsed = parseSmartQuoteClient(cleanText, lastBookInfo);
        if (parsed) {
            lastBookInfo = { key: parsed.key, lastCap: parsed.capitulo };

            const code = (parsed.libro || '').toUpperCase().trim();
            const setEv = new Set(["MT", "MC", "LC", "JN"]);
            const setNt = new Set(["HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"]);
            const setProf = new Set(["IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL"]);
            const setSap = new Set(["JOB", "PROV", "ECL", "CANT", "SAB", "ECLO"]);

            let cat = 'Historicos';
            if (code === 'SAL') cat = 'Salmos';
            else if (setEv.has(code)) cat = 'Evangelio';
            else if (setNt.has(code)) cat = 'Nuevo Testamento';
            else if (setProf.has(code)) cat = 'Profeticos';
            else if (setSap.has(code)) cat = 'Sapienciales';
            else cat = 'Historicos';

            if (cat === 'Historicos' && soloPentCalc && !esPentateuco(parsed.libro)) {
                return match;
            }
            if ((cat === 'Salmos' || cat === 'Sapienciales') && !incluirExtras) {
                return match;
            }

            seqCounter++;
            citasList.push({
                seqId: seqCounter,
                id: seqCounter,
                citaOriginal: parsed.citaOriginal,
                citaCompleta: parsed.citaCompleta || parsed.citaOriginal,
                cleanText: cleanText,
                libro: parsed.libro,
                libroNombre: parsed.libroNombre || NOMBRES_LIBROS[parsed.libro] || parsed.libro,
                capitulo: parsed.capitulo,
                versiculoInicio: parsed.versiculoInicio,
                versiculoFin: parsed.versiculoFin,
                continuidad: parsed.continuidad,
                categoria: cat,
                textoRef: parsed.textoRef,
                chars: calcularCaracteresCita(parsed)
            });
        }
        return match;
    });

    if (usarUnidas) {
        const mergedList = unirSegmentosContiguos(citasList);
        mergedList.forEach((c, idx) => {
            c.seqId = idx + 1;
            c.id = idx + 1;
        });
        return mergedList;
    }
    return citasList;
}

function calcularDistribucionLineal(citas, k, criterio = "rotativo") {
    if (!citas || citas.length === 0) return [];
    const ordenadas = (criterio === "rotativo") ? [...citas] : ordenarCitasAsc(citas);
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

    // 1. MODO ROTATIVO / ALTERNADO (POR DEFECTO):
    // Asigna la 1ª cita al 1º, la 2ª al 2º... y así rotativamente entre los K participantes siguiendo el orden secuencial de lectura
    if (criterio === "rotativo") {
        const buckets = Array.from({ length: numPart }, () => []);
        ordenadas.forEach((cita, idx) => {
            const pIdx = idx % numPart;
            cita.hermano = pIdx + 1;
            buckets[pIdx].push(cita);
        });

        return buckets.map((slice, p) => {
            const sliceChars = slice.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);
            return {
                hermano: p + 1,
                citas: slice,
                rango: obtenerRangoLibros(slice),
                totalCitas: slice.length,
                totalCaracteres: sliceChars,
                porcentaje: totalCharsGeneral > 0 ? Math.round((sliceChars / totalCharsGeneral) * 100) : 0
            };
        });
    }

    // 2. CRITERIOS POR BLOQUES LINEALES CONTINUOS (Programación Dinámica Global)
    let weights;
    if (criterio === "citas") {
        // Cargas iguales de cantidad de citas
        weights = Array(n).fill(1);
    } else if (criterio === "hibrido") {
        // Texto real + costo cognitivo de búsqueda en Biblia (~200 car. por cita)
        weights = rawChars.map(c => c + 200);
    } else {
        // 'caracteres': tiempo de lectura real
        weights = rawChars.map(c => Math.max(50, c));
    }

    const prefWeights = [0];
    for (let i = 0; i < n; i++) {
        prefWeights.push(prefWeights[i] + weights[i]);
    }
    const totalWeight = prefWeights[n];
    const targetWeight = totalWeight / numPart;

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

    // Reconstruir los puntos de corte óptimos
    const splits = [];
    let curr = n;
    for (let p = numPart; p >= 1; p--) {
        splits.unshift(curr);
        curr = parent[p][curr];
    }
    splits.unshift(0);

    // Generar particiones resultantes con estadísticas de balance
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
    setCalcViewTab(calcActiveView || "articulo");
    modalCalculadora.style.display = "flex";
    document.body.classList.add("modal-open");
}

function cerrarCalculadora() {
    modalCalculadora.style.display = "none";
    document.body.classList.remove("modal-open");
}

function setCalcViewTab(tabKey) {
    calcActiveView = tabKey;
    if (calcViewsWrapper) {
        calcViewsWrapper.className = `calc-views-wrapper view-${tabKey}`;
    }
    if (calcTabBtnCards) calcTabBtnCards.classList.toggle("active", tabKey === "cards");
    if (calcTabBtnArticulo) calcTabBtnArticulo.classList.toggle("active", tabKey === "articulo");
}

function formatearArticuloConAsignaciones(rawHtml, relacionados, particiones, item, criterio = "rotativo", soloPentCalc = false, incluirExtras = false, usarUnidas = false) {
    if (!rawHtml) return "";
    let lastBookInfo = null;
    let seqIndex = 0;
    const numPart = particiones.length;

    // Construir lista plana de perícopas asignadas a cada hermano
    const pericopasList = [];
    particiones.forEach(p => {
        p.citas.forEach(c => {
            const ini = c.versiculoInicio || 1;
            const fin = (c.continuidad === 's' ? ini + 1 : (c.continuidad === 'ss' ? 9999 : (c.versiculoFin || (c.versiculoInicio ? ini : 9999))));
            pericopasList.push({
                cita: c,
                hermano: p.hermano,
                seqId: c.seqId,
                libro: c.libro,
                libroNombre: c.libroNombre || NOMBRES_LIBROS[c.libro] || c.libro,
                capitulo: c.capitulo,
                start: ini,
                end: fin,
                citaOriginal: c.citaOriginal,
                citaCompleta: c.citaCompleta || c.citaOriginal,
                textoRef: c.textoRef,
                encounteredCount: 0
            });
        });
    });

    const buscarPericopaParaCita = (parsed) => {
        if (!parsed) return null;
        const cIni = parsed.versiculoInicio || 1;
        const cFin = (parsed.continuidad === 's' ? cIni + 1 : (parsed.continuidad === 'ss' ? 9999 : (parsed.versiculoFin || cIni)));

        // Buscar coincidencia exacta o por contención en perícopa unificada
        for (const peri of pericopasList) {
            if (peri.libro === parsed.libro && peri.capitulo === parsed.capitulo) {
                if (cIni >= peri.start && cFin <= peri.end) {
                    return peri;
                }
                if (peri.start === 1 && peri.end >= 9990) {
                    return peri;
                }
            }
        }
        return null;
    };

    let html = rawHtml.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, (match, citeText) => {
        const cleanText = citeText.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return match;

        const parsed = parseSmartQuoteClient(cleanText, lastBookInfo);
        if (parsed) {
            lastBookInfo = { key: parsed.key, lastCap: parsed.capitulo };
            const bookCode = parsed.libro;
            const bookName = parsed.libroNombre || NOMBRES_LIBROS[bookCode] || bookCode;
            const cap = parsed.capitulo;
            const vIni = (parsed.versiculoInicio !== null && parsed.versiculoInicio !== undefined) ? parsed.versiculoInicio : '';
            const vFin = (parsed.versiculoFin !== null && parsed.versiculoFin !== undefined) ? parsed.versiculoFin : '';
            const cont = parsed.continuidad || '';
            const textRef = parsed.textoRef;

            const code = (bookCode || '').toUpperCase().trim();
            const setEv = new Set(["MT", "MC", "LC", "JN"]);
            const setNt = new Set(["HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"]);
            const setProf = new Set(["IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL"]);
            const setSap = new Set(["JOB", "PROV", "ECL", "CANT", "SAB", "ECLO"]);

            let cat = 'Historicos';
            if (code === 'SAL') cat = 'Salmos';
            else if (setEv.has(code)) cat = 'Evangelio';
            else if (setNt.has(code)) cat = 'Nuevo Testamento';
            else if (setProf.has(code)) cat = 'Profeticos';
            else if (setSap.has(code)) cat = 'Sapienciales';
            else cat = 'Historicos';

            if (cat === 'Historicos' && soloPentCalc && !esPentateuco(bookCode)) {
                return `<cite class="cite-pill cite-unassigned" data-cite="${parsed.citaOriginal}" data-full-name="${parsed.citaCompleta}" data-book="${bookCode}" data-book-name="${bookName}" data-cap="${cap}" data-vini="${vIni}" data-vfin="${vFin}" data-cont="${cont}" data-ref="${textRef}" data-raw="${cleanText}"><span class="cite-pill-txt">${cleanText}</span></cite>`;
            }
            if ((cat === 'Salmos' || cat === 'Sapienciales') && !incluirExtras) {
                return `<cite class="cite-pill cite-unassigned" data-cite="${parsed.citaOriginal}" data-full-name="${parsed.citaCompleta}" data-book="${bookCode}" data-book-name="${bookName}" data-cap="${cap}" data-vini="${vIni}" data-vfin="${vFin}" data-cont="${cont}" data-ref="${textRef}" data-raw="${cleanText}"><span class="cite-pill-txt">${cleanText}</span></cite>`;
            }

            const peri = buscarPericopaParaCita(parsed);

            if (peri) {
                peri.encounteredCount++;
                const hermano = peri.hermano;

                if (peri.encounteredCount === 1) {
                    // Primera aparición: Turno de lectura asignado
                    seqIndex++;
                    const seqShow = peri.seqId || seqIndex;
                    return `<cite class="cite-pill cite-assigned assigned-h${hermano}" data-seq="${seqShow}" data-cite="${peri.citaOriginal}" data-full-name="${peri.citaCompleta || peri.citaOriginal}" data-book="${bookCode}" data-book-name="${bookName}" data-cap="${cap}" data-vini="${vIni}" data-vfin="${vFin}" data-cont="${cont}" data-ref="${textRef}" data-raw="${cleanText}" data-hermano="${hermano}" title="📖 #${seqShow} ${peri.citaCompleta || peri.citaOriginal} — Proclama: Hermano ${hermano} (Toca para leer el texto bíblico)"><span class="cite-seq-badge">#${seqShow}</span><span class="cite-pill-txt">${cleanText}</span><span class="cite-h-badge h-badge-${hermano}">H${hermano}</span></cite>`;
                } else {
                    // Aparición posterior que ya está incluida en una perícopa asignada
                    return `<cite class="cite-pill cite-pericopa-merged assigned-h${hermano}" data-is-pericopa="true" data-pericopa="${peri.citaCompleta || peri.citaOriginal}" data-hermano="${hermano}" title="🔗 Perícopa ya asignada al Hermano ${hermano} (incluida en #${peri.seqId || 1} ${peri.citaCompleta || peri.citaOriginal})"><span class="cite-pill-txt">${cleanText}</span><span class="cite-pericopa-tag">🔗 Perícopa</span><span class="cite-h-badge h-badge-${hermano}">H${hermano}</span></cite>`;
                }
            }
        }

        return `<cite class="cite-pill" data-cite="${cleanText}" data-raw="${cleanText}">${cleanText}</cite>`;
    });

    // 2. Transformar enlaces cruzados de Léon-Dufour
    html = html.replace(/<a class="otro" href="([^"]*)"[^>]*>([sS]*?)<\/a>/gi, (match, href, linkText) => {
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

function renderizarCalculadora() {
    if (!palabraCalculadoraActual) return;
    const item = palabraCalculadoraActual;
    const usarUnidas = calcCheckUnido.checked;
    const incluirExtras = calcCheckExtras.checked;
    const soloPentCalc = calcCheckPentateuco ? calcCheckPentateuco.checked : false;
    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "rotativo";

    const vocabKey = item.vocabKey || item.palabra;
    const datosEntrada = (dataGlobalRef && dataGlobalRef.palabras) ? dataGlobalRef.palabras[vocabKey] : null;
    const rawContenido = (datosEntrada && datosEntrada.contenido) ? datosEntrada.contenido : (item.contenido || "");
    const relacionados = (datosEntrada && datosEntrada.relacionados) ? datosEntrada.relacionados : (item.relacionados || []);

    let citasFinales;
    if (criterioActual === "rotativo" && rawContenido) {
        citasFinales = extraerCitasEnOrdenDeTexto(rawContenido, item, usarUnidas, soloPentCalc, incluirExtras);
    } else {
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

        citasFinales = ordenarCitasAsc(citasAConsolidar);
    }

    const totalLecturas = citasFinales.length;
    const totalCharsGeneral = citasFinales.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);

    numPartDisplay.textContent = numParticipantesActual;
    calcModalSubtitulo.textContent = `${totalLecturas} ${usarUnidas ? 'perícopas unidas' : 'citas'} (${totalCharsGeneral.toLocaleString()} caracteres) entre ${numParticipantesActual} participantes`;

    // Actualizar botones chips activos
    chipNums.forEach(chip => {
        chip.classList.toggle("active", parseInt(chip.dataset.num, 10) === numParticipantesActual);
    });

    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual, criterioActual);
    const promedioChars = Math.round(totalCharsGeneral / Math.max(1, particiones.length));

    // Actualizar indicador de balance y transparencia
    const pcts = particiones.map(p => p.porcentaje);
    const minPct = Math.min(...pcts);
    const maxPct = Math.max(...pcts);
    const devMax = (maxPct - minPct) / 2;

    if (calcBalanceIndicator) {
        if (criterioActual === "rotativo") {
            calcBalanceIndicator.innerHTML = `🔄 Turno Alternado (Rotativo)`;
            calcBalanceIndicator.style.background = "#eff6ff";
            calcBalanceIndicator.style.color = "#1e3a8a";
            calcBalanceIndicator.style.borderColor = "#bfdbfe";
        } else if (devMax <= 3.5) {
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

    if (criterioActual === "rotativo") {
        calcSummaryText.textContent = `Reparto alternado rotativo: la 1ª cita va al 1º, la 2ª al 2º y así sucesivamente por turnos entre los ${numParticipantesActual} participantes.`;
    } else if (criterioActual === "citas") {
        calcSummaryText.textContent = `Reparto en bloques continuos por cantidad de citas: cada hermano recibe un número similar de lecturas en un solo tramo de la Biblia.`;
    } else if (criterioActual === "hibrido") {
        calcSummaryText.textContent = `Reparto híbrido en bloques continuos: equilibra el volumen de texto (~${promedioChars.toLocaleString()} car.) y el esfuerzo de búsqueda en la Biblia.`;
    } else {
        calcSummaryText.textContent = `Reparto por tiempo de lectura (Bloques DP Óptimo): equilibra el volumen de texto (~${promedioChars.toLocaleString()} car. por hermano) para igualar el tiempo de preparación.`;
    }

    // 1. Renderizar tarjetas por hermano
    contenedorHermanos.innerHTML = "";
    particiones.forEach(p => {
        const hCard = document.createElement("div");
        hCard.className = "hermano-card";

        const hHeader = document.createElement("div");
        hHeader.className = "hermano-header";

        const hTitleBox = document.createElement("div");
        hTitleBox.className = "hermano-title-box";
        hTitleBox.innerHTML = `
            <div class="hermano-badge-avatar h-badge-${p.hermano}" title="Participante ${p.hermano}">${p.hermano}</div>
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

    // 2. Renderizar texto anotado de Léon-Dufour en la calculadora
    if (calcArticuloCuerpo) {
        if (rawContenido) {
            calcArticuloCuerpo.innerHTML = formatearArticuloConAsignaciones(rawContenido, relacionados, particiones, item, criterioActual, soloPentCalc, incluirExtras, usarUnidas);

            // Activar clics en citas bíblicas dentro del artículo anotado de la calculadora
            calcArticuloCuerpo.querySelectorAll(".cite-pill").forEach(pill => {
                pill.onclick = (e) => {
                    e.stopPropagation();
                    if (pill.dataset.isPericopa === "true") {
                        const per = pill.dataset.pericopa || "esta perícopa";
                        const h = pill.dataset.hermano || "";
                        mostrarToast(`🔗 Cita ya asignada como parte de la perícopa "${per}" al Hermano ${h}`);
                        return;
                    }
                    const textRef = pill.dataset.ref;
                    if (textRef && dbTextos[textRef]) {
                        const citaObj = {
                            citaOriginal: pill.dataset.cite || pill.dataset.raw,
                            citaCompleta: pill.dataset.fullName || pill.dataset.cite || pill.dataset.raw,
                            libro: pill.dataset.book,
                            libroNombre: pill.dataset.bookName || NOMBRES_LIBROS[pill.dataset.book] || pill.dataset.book,
                            capitulo: parseInt(pill.dataset.cap, 10),
                            versiculoInicio: pill.dataset.vini ? parseInt(pill.dataset.vini, 10) : null,
                            versiculoFin: pill.dataset.vfin ? parseInt(pill.dataset.vfin, 10) : null,
                            continuidad: pill.dataset.cont || null,
                            textoRef: textRef
                        };
                        abrirModalLectura(citaObj);
                        return;
                    }
                    const citeText = pill.dataset.cite || pill.dataset.raw;
                    const citaObj = resolverCitaDesdeTexto(citeText, item);
                    if (citaObj) {
                        abrirModalLectura(citaObj);
                    } else {
                        mostrarToast(`📖 Referencia: ${citeText}`);
                    }
                };
            });

            // Activar clics en temas relacionados
            calcArticuloCuerpo.querySelectorAll(".otro, .chip-relacionado").forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const termino = btn.dataset.palabra;
                    cerrarCalculadora();
                    inputBusqueda.value = termino;
                    actualizarVista();
                    mostrarToast(`🔍 Explorando "${termino}"`);
                };
            });
        } else {
            calcArticuloCuerpo.innerHTML = `
                <div class="empty-state">
                    <p>No se encontró el texto completo del artículo de Léon-Dufour para <strong>${item.palabra}</strong>.</p>
                </div>
            `;
        }
    }

    // 3. Renderizar leyenda de participantes
    if (calcArticuloLegend) {
        calcArticuloLegend.innerHTML = "";
        particiones.forEach(p => {
            const chipLeg = document.createElement("span");
            chipLeg.className = `calc-legend-chip assigned-h${p.hermano}`;
            chipLeg.innerHTML = `<span class="cite-h-badge h-badge-${p.hermano}">H${p.hermano}</span> Hermano ${p.hermano} (${p.totalCitas} citas)`;
            calcArticuloLegend.appendChild(chipLeg);
        });
    }
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
    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "rotativo";
    if (criterioActual === "rotativo") {
        msg += `Reparto alternado rotativo por turnos.`;
    } else {
        msg += `Búsqueda lineal en orden bíblico continuo.`;
    }

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
    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "rotativo";

    const vocabKey = item.vocabKey || item.palabra;
    const datosEntrada = (dataGlobalRef && dataGlobalRef.palabras) ? dataGlobalRef.palabras[vocabKey] : null;
    const rawContenido = (datosEntrada && datosEntrada.contenido) ? datosEntrada.contenido : (item.contenido || "");

    let citasFinales;
    if (criterioActual === "rotativo" && rawContenido) {
        citasFinales = extraerCitasEnOrdenDeTexto(rawContenido, item, usarUnidas, soloPentCalc, incluirExtras);
    } else {
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

        citasFinales = ordenarCitasAsc(citasAConsolidar);
    }

    const totalCharsGeneral = citasFinales.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);

    const criterioNombres = {
        rotativo: "Alternado / Rotativo (1ª al 1º, 2ª al 2º... por turnos)",
        caracteres: "Tiempo de Lectura (Caracteres Reales - DP Óptimo)",
        hibrido: "Híbrido (Texto + Esfuerzo de Búsqueda)",
        citas: "Cantidad de Citas (Bloques Continuos)"
    };
    const criterioTxt = criterioNombres[criterioActual] || "Alternado / Rotativo";
    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual, criterioActual);

    let msg = `📖 *REPARTO COMPLETO DE LECTURAS PARA LA PREPARACIÓN*\n`;
    msg += `🕊️ Palabra: *"${item.palabra.toUpperCase()}"* (Xavier Léon-Dufour)\n`;
    msg += `👥 *${numParticipantesActual} Participantes* | ${citasFinales.length} lecturas (~${totalCharsGeneral.toLocaleString()} caracteres en total)${soloPentCalc ? ' · [Solo Pentateuco]' : ''}\n`;
    msg += `⚖️ Criterio: ${criterioTxt}\n`;
    msg += `====================================\n\n`;

    particiones.forEach(p => {
        msg += `👤 *HERMANO ${p.hermano}* (${p.totalCitas} lecturas · ~${p.totalCaracteres.toLocaleString()} car. · ${p.porcentaje}% del total)\n`;
        msg += `📖 *Rango:* ${p.rango}\n`;
        p.citas.forEach((c, idx) => {
            const chars = calcularCaracteresCita(c);
            msg += `  ${idx + 1}. ${c.citaOriginal} (~${chars.toLocaleString()} car.)\n`;
        });
        msg += `\n`;
    });

    msg += `====================================\n`;
    if (criterioActual === "rotativo") {
        msg += `Reparto alternado rotativo entre los ${numParticipantesActual} participantes (1ª al 1º, 2ª al 2º... por turnos sucesivos según orden de lectura).`;
    } else {
        msg += `Distribución lineal óptima por Programación Dinámica. Cada hermano avanza en su Biblia sin retroceder.`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
            mostrarToast(`✅ Reparto completo de los ${numParticipantesActual} hermanos copiado`);
        }).catch(() => {
            copiarTextoFallback(msg, `✅ Reparto completo de los ${numParticipantesActual} hermanos copiado`);
        });
    } else {
        copiarTextoFallback(msg, `✅ Reparto completo de los ${numParticipantesActual} hermanos copiado`);
    }
}

function copiarTextoFallback(texto, mensajeToast) {
    const ta = document.createElement("textarea");
    ta.value = texto;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand("copy");
        mostrarToast(mensajeToast || "✅ Texto copiado al portapapeles");
    } catch (e) {
        mostrarToast("⚠️ No se pudo copiar automáticamente");
    }
    document.body.removeChild(ta);
}

// ==========================================================================
// GENERADOR DE FICHA INTERACTIVA HTML AUTÓNOMA (CON VOTACIÓN Y BIBLIA OFFLINE)
// ==========================================================================

function exportarFichaPreparacionHTML() {
    if (!palabraCalculadoraActual) return;
    const item = palabraCalculadoraActual;
    const usarUnidas = calcCheckUnido.checked;
    const incluirExtras = calcCheckExtras.checked;
    const soloPentCalc = calcCheckPentateuco ? calcCheckPentateuco.checked : false;
    const criterioActual = calcSelectCriterio ? calcSelectCriterio.value : "rotativo";

    const htmlCompleto = generarCodigoHTMLFicha(item, numParticipantesActual, criterioActual, usarUnidas, soloPentCalc, incluirExtras, dbTextos);

    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timestamp = `${ahora.getFullYear()}-${pad(ahora.getMonth() + 1)}-${pad(ahora.getDate())}_${pad(ahora.getHours())}-${pad(ahora.getMinutes())}-${pad(ahora.getSeconds())}`;

    const blob = new Blob([htmlCompleto], { type: "text/html;charset=utf-8" });
    const nombreArchivo = `preparacion_${normalizar(item.palabra)}_${timestamp}.html`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarToast(`📄 Ficha descargada: ${nombreArchivo}`);
}

const TEMPLATE_FICHA_BASE = "<!DOCTYPE html>\n<html lang=\"es\" data-theme=\"dark\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>🕊️ Preparación Litúrgica: __PALABRA_MAYUS__ (Léon-Dufour)</title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap\" rel=\"stylesheet\">\n  <style>\n    :root {\n      --bg-app: #0b0f19;\n      --bg-card: #131b2e;\n      --bg-header: #070a12;\n      --text-main: #f8fafc;\n      --text-muted: #94a3b8;\n      --border-color: #1e293b;\n      --border-dark: #334155;\n      --primary: #4338ca;\n      --primary-hover: #4f46e5;\n      --accent: #d97706;\n      --success: #059669;\n      --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);\n      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4);\n      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.5);\n      --radius-sm: 6px;\n      --radius-md: 10px;\n      --radius-lg: 14px;\n      --radius-full: 9999px;\n      --font-sans: 'Inter', system-ui, -apple-system, sans-serif;\n      --font-serif: 'Merriweather', Georgia, serif;\n\n      /* Paleta de Colores Consistente H1 - H12 */\n      --h1-color: #2563eb;\n      --h2-color: #059669;\n      --h3-color: #7c3aed;\n      --h4-color: #d97706;\n      --h5-color: #e11d48;\n      --h6-color: #0891b2;\n      --h7-color: #4338ca;\n      --h8-color: #65a30d;\n      --h9-color: #c026d3;\n      --h10-color: #475569;\n      --h11-color: #b45309;\n      --h12-color: #312e81;\n    }\n\n    [data-theme=\"light\"] {\n      --bg-app: #f8fafc;\n      --bg-card: #ffffff;\n      --bg-header: #ffffff;\n      --text-main: #0f172a;\n      --text-muted: #475569;\n      --border-color: #cbd5e1;\n      --border-dark: #94a3b8;\n      --primary: #2563eb;\n      --primary-hover: #1d4ed8;\n      --accent: #b45309;\n      --success: #047857;\n    }\n\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    html { scroll-behavior: smooth; }\n    body {\n      font-family: var(--font-sans);\n      background: var(--bg-app);\n      color: var(--text-main);\n      line-height: 1.5;\n      padding-bottom: 60px;\n    }\n\n    /* HEADER NO FIJO (SCROLL NATURAL) */\n    .app-header {\n      background: var(--bg-header);\n      border-bottom: 1px solid var(--border-color);\n      padding: 14px 20px;\n      position: relative;\n    }\n    .header-container {\n      max-width: 1200px;\n      margin: 0 auto;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 12px;\n    }\n    .header-title-box { display: flex; flex-direction: column; gap: 3px; }\n    .header-badge-row { display: flex; gap: 6px; align-items: center; }\n    .badge-dufour {\n      font-size: 0.72rem;\n      font-weight: 700;\n      padding: 2px 8px;\n      border-radius: var(--radius-full);\n      background: rgba(99, 102, 241, 0.15);\n      color: #818cf8;\n      border: 1px solid rgba(99, 102, 241, 0.3);\n    }\n    .badge-preparacion {\n      font-size: 0.72rem;\n      font-weight: 700;\n      padding: 2px 8px;\n      border-radius: var(--radius-full);\n      background: rgba(16, 185, 129, 0.15);\n      color: #34d399;\n      border: 1px solid rgba(16, 185, 129, 0.3);\n    }\n    .word-title {\n      font-size: 1.45rem;\n      font-weight: 800;\n      letter-spacing: -0.5px;\n      color: var(--text-main);\n    }\n    .meta-row {\n      display: flex;\n      gap: 12px;\n      font-size: 0.76rem;\n      color: var(--text-muted);\n      flex-wrap: wrap;\n    }\n\n    .header-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }\n    .btn-hdr {\n      padding: 6px 12px;\n      font-size: 0.78rem;\n      font-weight: 700;\n      border-radius: var(--radius-sm);\n      border: 1px solid var(--border-dark);\n      background: var(--bg-card);\n      color: var(--text-main);\n      cursor: pointer;\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      transition: all 0.2s;\n    }\n    .btn-hdr:hover { border-color: var(--primary); transform: translateY(-1px); }\n    .btn-primary-hdr { background: var(--primary); color: #fff; border-color: var(--primary); }\n    .btn-primary-hdr:hover { background: var(--primary-hover); }\n    .btn-danger-hdr { background: transparent; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }\n    .btn-danger-hdr:hover { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; }\n\n    /* BARRA DE IDENTIDAD (MI ROL) */\n    .identity-bar {\n      max-width: 1200px;\n      margin: 12px auto 0 auto;\n      padding: 10px 16px;\n      background: var(--bg-card);\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-md);\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      flex-wrap: wrap;\n      gap: 10px;\n    }\n    .identity-chips-group {\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n    .identity-label {\n      font-size: 0.8rem;\n      font-weight: 800;\n      color: var(--text-main);\n      display: flex;\n      align-items: center;\n      gap: 5px;\n    }\n    .identity-chip {\n      font-size: 0.74rem;\n      font-weight: 700;\n      padding: 4px 12px;\n      border-radius: var(--radius-full);\n      border: 1.5px solid transparent;\n      cursor: pointer;\n      transition: all 0.15s;\n      background: var(--bg-app);\n      color: var(--text-muted);\n    }\n    .identity-chip:hover {\n      transform: translateY(-1px);\n      filter: brightness(1.2);\n    }\n    .identity-chip.active {\n      font-weight: 800;\n      box-shadow: 0 0 10px rgba(255,255,255,0.25);\n      border-color: #ffffff;\n      color: #ffffff;\n    }\n\n    /* BADGE COLORS CONSISTENCY */\n    .h-badge-1, .assigned-h1 { background: #2563eb; color: #ffffff; }\n    .h-badge-2, .assigned-h2 { background: #059669; color: #ffffff; }\n    .h-badge-3, .assigned-h3 { background: #7c3aed; color: #ffffff; }\n    .h-badge-4, .assigned-h4 { background: #d97706; color: #ffffff; }\n    .h-badge-5, .assigned-h5 { background: #e11d48; color: #ffffff; }\n    .h-badge-6, .assigned-h6 { background: #0891b2; color: #ffffff; }\n    .h-badge-7, .assigned-h7 { background: #4338ca; color: #ffffff; }\n    .h-badge-8, .assigned-h8 { background: #65a30d; color: #ffffff; }\n    .h-badge-9, .assigned-h9 { background: #c026d3; color: #ffffff; }\n    .h-badge-10, .assigned-h10 { background: #475569; color: #ffffff; }\n    .h-badge-11, .assigned-h11 { background: #b45309; color: #ffffff; }\n    .h-badge-12, .assigned-h12 { background: #312e81; color: #ffffff; }\n\n    /* Pill borders & tints in dark mode */\n    .cite-assigned.assigned-h1 { border-color: #3b82f6; background: rgba(59, 130, 246, 0.18); color: #93c5fd; }\n    .cite-assigned.assigned-h2 { border-color: #10b981; background: rgba(16, 185, 129, 0.18); color: #6ee7b7; }\n    .cite-assigned.assigned-h3 { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.18); color: #c4b5fd; }\n    .cite-assigned.assigned-h4 { border-color: #f59e0b; background: rgba(245, 158, 11, 0.18); color: #fde68a; }\n    .cite-assigned.assigned-h5 { border-color: #f43f5e; background: rgba(244, 63, 94, 0.18); color: #fda4af; }\n    .cite-assigned.assigned-h6 { border-color: #06b6d4; background: rgba(6, 182, 212, 0.18); color: #67e8f9; }\n    .cite-assigned.assigned-h7 { border-color: #6366f1; background: rgba(99, 102, 241, 0.18); color: #a5b4fc; }\n    .cite-assigned.assigned-h8 { border-color: #84cc16; background: rgba(132, 204, 22, 0.18); color: #bef264; }\n    .cite-assigned.assigned-h9 { border-color: #d946ef; background: rgba(217, 70, 239, 0.18); color: #f0abfc; }\n    .cite-assigned.assigned-h10 { border-color: #64748b; background: rgba(100, 116, 139, 0.18); color: #cbd5e1; }\n    .cite-assigned.assigned-h11 { border-color: #d97706; background: rgba(217, 119, 6, 0.18); color: #fed7aa; }\n    .cite-assigned.assigned-h12 { border-color: #4338ca; background: rgba(67, 56, 202, 0.18); color: #c7d2fe; }\n\n    /* Pill borders & tints in light mode */\n    [data-theme=\"light\"] .cite-assigned.assigned-h1 { border-color: #93c5fd; background: #eff6ff; color: #1e40af; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h2 { border-color: #a7f3d0; background: #ecfdf5; color: #065f46; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h3 { border-color: #ddd6fe; background: #f5f3ff; color: #5b21b6; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h4 { border-color: #fde68a; background: #fffbeb; color: #92400e; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h5 { border-color: #fecdd3; background: #fff1f2; color: #9f1239; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h6 { border-color: #a5f3fc; background: #ecfeff; color: #155e75; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h7 { border-color: #c7d2fe; background: #eef2ff; color: #3730a3; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h8 { border-color: #d9f99d; background: #f7fee7; color: #3f6212; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h9 { border-color: #f5d0fe; background: #fdf4ff; color: #86198f; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h10 { border-color: #cbd5e1; background: #f8fafc; color: #1e293b; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h11 { border-color: #fed7aa; background: #fff7ed; color: #9a3412; }\n    [data-theme=\"light\"] .cite-assigned.assigned-h12 { border-color: #c7d2fe; background: #eef2ff; color: #312e81; }\n\n    /* Pastillas para citas de perícopas ya asignadas previamente */\n    .cite-pill.cite-pericopa-merged {\n      position: relative;\n      padding: 2px 4px 2px 6px;\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      font-weight: 700;\n      font-size: 0.82rem;\n      line-height: 1.2;\n      border-radius: var(--radius-sm);\n      border-style: dashed !important;\n      opacity: 0.85;\n      cursor: help;\n      margin: 0 2px;\n      transition: all 0.15s ease;\n    }\n    .cite-pill.cite-pericopa-merged:hover {\n      opacity: 1;\n      filter: brightness(1.15);\n      transform: translateY(-1px);\n    }\n    .cite-pericopa-tag {\n      font-size: 0.65rem;\n      font-weight: 800;\n      opacity: 0.9;\n      margin-left: 1px;\n      margin-right: 1px;\n      background: rgba(255, 255, 255, 0.12);\n      padding: 1px 4px;\n      border-radius: 3px;\n    }\n    [data-theme=\"light\"] .cite-pericopa-tag {\n      background: rgba(0, 0, 0, 0.08);\n    }\n\n    /* Resaltado de citas cuando coincide con Mi Rol */\n    .cite-pill.is-my-turn {\n      outline: 2.5px solid #fbbf24;\n      box-shadow: 0 0 10px rgba(251, 191, 36, 0.45);\n      animation: pulseMyTurn 2s infinite ease-in-out;\n    }\n    @keyframes pulseMyTurn {\n      0%, 100% { transform: scale(1); }\n      50% { transform: scale(1.04); }\n    }\n\n    /* MAIN CONTINUOUS CONTAINER */\n    .main-content {\n      max-width: 1200px;\n      margin: 16px auto;\n      padding: 0 16px;\n      display: flex;\n      flex-direction: column;\n      gap: 24px;\n    }\n\n    /* SECCIÓN 1: ARTÍCULO DE LÉON-DUFOUR */\n    .section-card {\n      background: var(--bg-card);\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-lg);\n      overflow: hidden;\n      box-shadow: var(--shadow-sm);\n    }\n    .section-header-bar {\n      padding: 14px 20px;\n      background: var(--bg-app);\n      border-bottom: 1px solid var(--border-color);\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n    .section-header-title {\n      font-size: 1.05rem;\n      font-weight: 800;\n      color: var(--text-main);\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n    .section-header-sub {\n      font-size: 0.76rem;\n      color: var(--text-muted);\n    }\n\n    .articulo-body {\n      font-family: var(--font-serif);\n      font-size: 1.05rem;\n      line-height: 1.85;\n      padding: 24px;\n      color: var(--text-main);\n    }\n    .articulo-body p { margin-bottom: 18px; text-align: justify; }\n    .articulo-body .hf1, .articulo-body .hf2, .articulo-body .hf3 {\n      font-weight: 800; font-family: var(--font-sans); margin-bottom: 8px; display: inline;\n    }\n    .articulo-body .fid { font-weight: 800; font-family: var(--font-sans); color: #818cf8; margin-right: 4px; }\n\n    .cite-pill {\n      font-style: normal;\n      font-family: var(--font-sans);\n      font-size: 0.82rem;\n      font-weight: 700;\n      padding: 2px 6px;\n      border-radius: var(--radius-sm);\n      cursor: pointer;\n      display: inline-flex;\n      align-items: center;\n      gap: 4px;\n      margin: 0 2px;\n      transition: all 0.15s ease;\n    }\n    .cite-pill:hover {\n      transform: translateY(-1px);\n      box-shadow: var(--shadow-sm);\n      filter: brightness(1.15);\n    }\n    .cite-seq-badge {\n      font-size: 0.65rem;\n      font-weight: 800;\n      opacity: 0.8;\n      margin-right: 1px;\n    }\n    .cite-h-badge {\n      font-size: 0.65rem;\n      font-weight: 800;\n      padding: 1px 5px;\n      border-radius: 3px;\n      color: #fff;\n    }\n    .cite-my-vote-tag {\n      font-size: 0.68rem;\n      font-weight: 800;\n      color: #38bdf8;\n      background: rgba(56, 189, 248, 0.18);\n      border: 1px solid rgba(56, 189, 248, 0.3);\n      padding: 1px 4px;\n      border-radius: 3px;\n      display: inline-block;\n    }\n    .cite-unassigned {\n      background: rgba(255,255,255,0.03);\n      color: var(--text-muted);\n      border: 1px dashed var(--border-color);\n    }\n\n    /* SECCIÓN 2: LECTURAS ORGANIZADAS Y VOTACIÓN (JUSTO DEBAJO DEL TEXTO) */\n    .filter-pills-bar {\n      display: flex;\n      gap: 6px;\n      padding: 12px 20px;\n      background: var(--bg-app);\n      border-bottom: 1px solid var(--border-color);\n      overflow-x: auto;\n    }\n    .filter-pill-btn {\n      padding: 6px 14px;\n      font-size: 0.78rem;\n      font-weight: 700;\n      border-radius: var(--radius-full);\n      border: 1px solid var(--border-dark);\n      background: var(--bg-card);\n      color: var(--text-muted);\n      cursor: pointer;\n      white-space: nowrap;\n      transition: all 0.15s;\n    }\n    .filter-pill-btn:hover { color: var(--text-main); border-color: var(--primary); }\n    .filter-pill-btn.active {\n      background: var(--primary);\n      color: #ffffff;\n      border-color: var(--primary);\n    }\n\n    .citas-list-grid {\n      padding: 16px 20px;\n      display: flex;\n      flex-direction: column;\n      gap: 12px;\n    }\n\n    .escrutinio-card {\n      background: var(--bg-app);\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-md);\n      padding: 12px 16px;\n      display: flex;\n      flex-direction: column;\n      gap: 10px;\n      transition: all 0.15s;\n    }\n    .escrutinio-card:hover {\n      border-color: rgba(99, 102, 241, 0.4);\n    }\n    .escrutinio-card-top {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n    .escrutinio-cite-btn {\n      background: none;\n      border: none;\n      color: var(--text-main);\n      font-size: 0.95rem;\n      font-weight: 800;\n      cursor: pointer;\n      text-align: left;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n    .escrutinio-cite-btn:hover { color: #818cf8; text-decoration: underline; }\n\n    /* FILA COMPARATIVA DE VOTOS (PERSONAL VS COLECTIVO) */\n    .votes-comparison-box {\n      background: var(--bg-card);\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-sm);\n      padding: 10px 14px;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 12px;\n    }\n    .my-vote-ref-box {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      font-size: 0.78rem;\n    }\n    .my-vote-ref-badge {\n      color: #38bdf8;\n      font-weight: 800;\n      background: rgba(56, 189, 248, 0.15);\n      border: 1px solid rgba(56, 189, 248, 0.3);\n      padding: 2px 8px;\n      border-radius: 4px;\n      font-size: 0.78rem;\n    }\n    .collective-vote-box {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      flex-wrap: wrap;\n    }\n    .stars-group {\n      display: inline-flex;\n      align-items: center;\n      gap: 3px;\n    }\n    .star-btn {\n      background: none;\n      border: none;\n      font-size: 1.25rem;\n      color: #475569;\n      cursor: pointer;\n      transition: transform 0.1s, color 0.1s;\n      padding: 0 2px;\n      line-height: 1;\n    }\n    .star-btn.active {\n      color: #f59e0b;\n      text-shadow: 0 0 6px rgba(245, 158, 11, 0.5);\n    }\n    .star-btn:hover {\n      transform: scale(1.2);\n      color: #fbbf24;\n    }\n    .star-btn-personal.active {\n      color: #38bdf8;\n      text-shadow: 0 0 6px rgba(56, 189, 248, 0.5);\n    }\n    .stepper-group {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n    }\n    .btn-step {\n      width: 26px;\n      height: 26px;\n      border-radius: 4px;\n      border: 1px solid var(--border-dark);\n      background: var(--bg-app);\n      color: var(--text-main);\n      font-weight: bold;\n      font-size: 0.9rem;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .btn-step:hover {\n      background: var(--primary);\n      color: #fff;\n      border-color: var(--primary);\n    }\n    .score-display {\n      font-size: 0.82rem;\n      font-weight: 800;\n      min-width: 55px;\n      text-align: center;\n      color: var(--text-main);\n    }\n    .note-input {\n      width: 100%;\n      background: var(--bg-card);\n      border: 1px solid var(--border-color);\n      border-radius: 4px;\n      padding: 6px 10px;\n      font-size: 0.78rem;\n      color: var(--text-main);\n      font-family: inherit;\n    }\n    .note-input:focus {\n      outline: none;\n      border-color: var(--primary);\n    }\n\n    /* SECCIÓN 3: CUADRO DE CANDIDATAS Y PODIO FINAL */\n    .podium-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n      gap: 12px;\n      padding: 16px 20px;\n    }\n    .podium-card {\n      background: var(--bg-app);\n      border: 1.5px solid var(--border-color);\n      border-radius: var(--radius-md);\n      padding: 12px;\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n    }\n    .podium-card.has-winner {\n      border-color: #f59e0b;\n      box-shadow: 0 0 12px rgba(245, 158, 11, 0.15);\n    }\n    .podium-card.has-tie {\n      border-color: #06b6d4;\n      box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);\n    }\n    .podium-cat-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    .podium-cat-name {\n      font-size: 0.8rem;\n      font-weight: 800;\n      text-transform: uppercase;\n      letter-spacing: 0.3px;\n      display: flex;\n      align-items: center;\n      gap: 4px;\n    }\n    .cat-hist { color: #f97316; }\n    .cat-prof { color: #8b5cf6; }\n    .cat-nt { color: #3b82f6; }\n    .cat-ev { color: #10b981; }\n    .cat-sal { color: #ec4899; }\n\n    .podium-winner-banner {\n      background: rgba(245, 158, 11, 0.12);\n      border: 1px solid rgba(245, 158, 11, 0.3);\n      padding: 8px;\n      border-radius: var(--radius-sm);\n      display: flex;\n      flex-direction: column;\n      gap: 2px;\n    }\n    .winner-label {\n      font-size: 0.68rem;\n      font-weight: 800;\n      color: #f59e0b;\n      text-transform: uppercase;\n    }\n    .winner-cite {\n      font-size: 0.95rem;\n      font-weight: 800;\n      color: var(--text-main);\n      cursor: pointer;\n    }\n    .winner-cite:hover { text-decoration: underline; color: #fbbf24; }\n    .winner-score {\n      font-size: 0.72rem;\n      color: #fcd34d;\n      font-weight: 700;\n    }\n\n    .podium-tie-banner {\n      background: rgba(6, 182, 212, 0.12);\n      border: 1px solid rgba(6, 182, 212, 0.3);\n      padding: 8px;\n      border-radius: var(--radius-sm);\n      display: flex;\n      flex-direction: column;\n      gap: 2px;\n    }\n    .tie-label {\n      font-size: 0.68rem;\n      font-weight: 800;\n      color: #06b6d4;\n      text-transform: uppercase;\n    }\n    .podium-empty-banner {\n      font-size: 0.78rem;\n      color: var(--text-muted);\n      font-style: italic;\n      padding: 6px 0;\n    }\n\n    /* MODAL */\n    .modal-backdrop {\n      position: fixed;\n      top: 0; left: 0; right: 0; bottom: 0;\n      background: rgba(0,0,0,0.75);\n      backdrop-filter: blur(4px);\n      z-index: 1000;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 16px;\n    }\n    .modal-card {\n      background: var(--bg-card);\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-lg);\n      width: 100%;\n      max-width: 820px;\n      max-height: 90vh;\n      display: flex;\n      flex-direction: column;\n      box-shadow: var(--shadow-lg);\n    }\n    .modal-header {\n      padding: 14px 18px;\n      background: var(--bg-app);\n      border-bottom: 1px solid var(--border-color);\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    .modal-title { font-size: 1.15rem; font-weight: 800; }\n    .modal-subtitle { font-size: 0.78rem; color: var(--text-muted); }\n    .btn-close {\n      background: none;\n      border: none;\n      font-size: 1.4rem;\n      color: var(--text-muted);\n      cursor: pointer;\n      padding: 0 6px;\n    }\n    .btn-close:hover { color: var(--text-main); }\n\n    .modal-proclama-box {\n      padding: 10px 18px;\n      background: rgba(0,0,0,0.25);\n      border-bottom: 1px solid var(--border-color);\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n    .proclama-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      font-weight: 800;\n      font-size: 0.85rem;\n    }\n    .cat-badge {\n      font-size: 0.65rem;\n      font-weight: 700;\n      padding: 2px 6px;\n      border-radius: 4px;\n      background: rgba(255,255,255,0.05);\n      border: 1px solid var(--border-color);\n    }\n\n    /* BARRA DE VOTACION PERSONAL EN EL MODAL */\n    .modal-voting-personal-box {\n      padding: 12px 18px;\n      background: var(--bg-app);\n      border-bottom: 1px solid var(--border-color);\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n    }\n    .modal-personal-vote-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n\n    .modal-body {\n      padding: 20px;\n      font-family: var(--font-serif);\n      font-size: 1rem;\n      line-height: 1.8;\n      overflow-y: auto;\n      color: var(--text-main);\n    }\n    .modal-body strong {\n      color: var(--primary);\n      font-size: 0.85rem;\n      margin-right: 2px;\n      font-family: var(--font-sans);\n    }\n\n    /* RESALTADO AMARILLO EXACTO DE LA CITA BÍBLICA */\n    .highlighted-verse, mark.highlighted-verse {\n      background: rgba(234, 179, 8, 0.25);\n      color: #fef08a;\n      padding: 3px 6px;\n      border-radius: 4px;\n      font-weight: 600;\n      border-left: 3.5px solid #eab308;\n      scroll-margin-top: 50px;\n      scroll-margin-bottom: 50px;\n      display: inline;\n    }\n\n    [data-theme=\"light\"] .highlighted-verse, [data-theme=\"light\"] mark.highlighted-verse {\n      background: #fef08a;\n      color: #713f12;\n      border-left: 3.5px solid #ca8a04;\n    }\n\n    #cita-start-target {\n      position: relative;\n      animation: highlightPulse 1.5s ease-out;\n    }\n\n    @keyframes highlightPulse {\n      0% {\n        background: #fde047;\n        box-shadow: 0 0 0 6px rgba(234, 179, 8, 0.45);\n      }\n      100% {\n        background: rgba(234, 179, 8, 0.25);\n        box-shadow: 0 0 0 0 rgba(234, 179, 8, 0);\n      }\n    }\n\n    .modal-footer {\n      padding: 12px 18px;\n      background: var(--bg-app);\n      border-top: 1px solid var(--border-color);\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n    .btn-action {\n      padding: 6px 14px;\n      font-size: 0.8rem;\n      font-weight: 700;\n      border-radius: var(--radius-sm);\n      border: 1.5px solid var(--border-dark);\n      background: var(--bg-card);\n      color: var(--text-main);\n      cursor: pointer;\n      transition: all 0.15s;\n    }\n    .btn-action:hover { border-color: var(--primary); }\n    .btn-action-primary { background: var(--primary); color: #fff; border-color: var(--primary); }\n    .btn-action-primary:hover { background: var(--primary-hover); }\n\n    /* TOAST */\n    .toast-msg {\n      position: fixed;\n      bottom: 24px;\n      right: 24px;\n      background: #1e293b;\n      color: #fff;\n      padding: 10px 18px;\n      border-radius: var(--radius-md);\n      font-size: 0.85rem;\n      font-weight: 700;\n      box-shadow: var(--shadow-lg);\n      border: 1px solid #334155;\n      z-index: 2000;\n      display: none;\n    }\n    .toast-msg.show { display: block; animation: fadeIn 0.2s ease; }\n    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n  </style>\n</head>\n<body>\n  <!-- HEADER NO FIJO (SCROLL NATURAL) -->\n  <header class=\"app-header\">\n    <div class=\"header-container\">\n      <div class=\"header-title-box\">\n        <div class=\"header-badge-row\">\n          <span class=\"badge-dufour\">Xavier Léon-Dufour</span>\n          <span class=\"badge-preparacion\">🕊️ Preparación Litúrgica</span>\n        </div>\n        <h1 class=\"word-title\">__PALABRA_MAYUS__</h1>\n        <div class=\"meta-row\">\n          <span>👥 <strong>__NUM_PART__ Participantes</strong></span>\n          <span>⚖️ Criterio: <strong>__CRITERIO_TXT__</strong></span>\n          <span>📖 <strong>__CITAS_COUNT__ Lecturas Asignadas</strong></span>\n          <span>🔤 ~ __TOTAL_CHARS__ caracteres</span>\n        </div>\n      </div>\n      <div class=\"header-actions\">\n        <button id=\"btnThemeToggle\" class=\"btn-hdr\" title=\"Alternar modo claro / oscuro\">🌙 / ☀️</button>\n        <button id=\"btnCopiarLiturgia\" class=\"btn-hdr btn-primary-hdr\" title=\"Copiar las lecturas ganadoras para WhatsApp\">📋 Copiar Liturgia Ganadora</button>\n        <button id=\"btnResetVotos\" class=\"btn-hdr btn-danger-hdr\" title=\"Reiniciar todas las puntuaciones\">🔄 Reiniciar Votos</button>\n      </div>\n    </div>\n  </header>\n\n  <!-- BARRA DE SELECCION DE IDENTIDAD (\"MI ROL\") -->\n  <div class=\"identity-bar\">\n    <div class=\"identity-label\">\n      <span>👤 Mi Rol en la Preparación:</span>\n    </div>\n    <div class=\"identity-chips-group\" id=\"identityChipsGroup\"></div>\n  </div>\n\n  <main class=\"main-content\">\n    <!-- 1. TEXTO ÍNTEGRO DE LÉON-DUFOUR -->\n    <section class=\"section-card\" id=\"secArticulo\">\n      <div class=\"section-header-bar\">\n        <div>\n          <h2 class=\"section-header-title\">📖 1. Lectura del Vocablo: Xavier Léon-Dufour</h2>\n          <span class=\"section-header-sub\">Lee el texto en comunidad. Toca cualquier cita para abrirla, proclamarla y emitir tu voto personal privado.</span>\n        </div>\n        <span style=\"font-size:0.75rem; color:var(--text-muted); font-weight:700;\">__CITAS_COUNT__ lecturas asignadas</span>\n      </div>\n      <div id=\"articuloCuerpo\" class=\"articulo-body\">\n        __ARTICULO_HTML__\n      </div>\n    </section>\n\n    <!-- 2. LECTURAS ORGANIZADAS PARA ESCRUTINIO COLECTIVO (JUSTO DEBAJO CON SCROLL ORGÁNICO) -->\n    <section class=\"section-card\" id=\"secEscrutinio\">\n      <div class=\"section-header-bar\">\n        <div>\n          <h2 class=\"section-header-title\">🗳️ 2. Votación y Escrutinio Colectivo de las Lecturas</h2>\n          <span class=\"section-header-sub\">Anota el voto grupal a viva voz teniendo como referencia directa tu voto personal emitido arriba.</span>\n        </div>\n        <a href=\"#secPodio\" class=\"btn-action\" style=\"text-decoration:none; font-size:0.75rem;\">🏆 Ver Podio Final ⬇️</a>\n      </div>\n\n      <!-- FILTROS DE CATEGORÍAS LITÚRGICAS -->\n      <div class=\"filter-pills-bar\">\n        <button class=\"filter-pill-btn active\" data-cat=\"all\" onclick=\"filtrarCategoria('all')\">🌟 Todas (__CITAS_COUNT__)</button>\n        <button class=\"filter-pill-btn\" data-cat=\"Historicos\" onclick=\"filtrarCategoria('Historicos')\">📜 1ª Históricos / Torá</button>\n        <button class=\"filter-pill-btn\" data-cat=\"Profeticos\" onclick=\"filtrarCategoria('Profeticos')\">🕊️ 2ª Proféticos</button>\n        <button class=\"filter-pill-btn\" data-cat=\"Nuevo Testamento\" onclick=\"filtrarCategoria('Nuevo Testamento')\">✉️ 3ª Cartas / NT</button>\n        <button class=\"filter-pill-btn\" data-cat=\"Evangelio\" onclick=\"filtrarCategoria('Evangelio')\">✝️ 4ª Evangelio</button>\n        <button class=\"filter-pill-btn\" data-cat=\"Salmos\" id=\"btnFilterSalmos\" onclick=\"filtrarCategoria('Salmos')\">🎵 Salmos</button>\n      </div>\n\n      <!-- LISTA DE CITAS SECUENCIAL CON VOTO PERSONAL Y COLECTIVO -->\n      <div class=\"citas-list-grid\" id=\"citasListGrid\"></div>\n    </section>\n\n    <!-- 3. CUADRO DE CANDIDATAS Y PODIO FINAL -->\n    <section class=\"section-card\" id=\"secPodio\">\n      <div class=\"section-header-bar\">\n        <div>\n          <h2 class=\"section-header-title\">🏆 3. Cuadro de Lecturas Candidatas y Ganadoras</h2>\n          <span class=\"section-header-sub\">Resultado del escrutinio en las 4 partes de la celebración litúrgica</span>\n        </div>\n        <button class=\"btn-action btn-action-primary\" onclick=\"document.getElementById('btnCopiarLiturgia').click()\">📋 Copiar para WhatsApp</button>\n      </div>\n      <div class=\"podium-grid\" id=\"podiumGrid\"></div>\n    </section>\n  </main>\n\n  <!-- MODAL LECTOR BÍBLICO (BIBLIA DE JERUSALÉN + VOTO PERSONAL PRIVADO) -->\n  <div id=\"modalLectura\" class=\"modal-backdrop\" style=\"display:none;\">\n    <div class=\"modal-card\">\n      <div class=\"modal-header\">\n        <div>\n          <h2 id=\"lecturaModalTitulo\" class=\"modal-title\">Lectura Bíblica</h2>\n          <span id=\"lecturaModalSubtitulo\" class=\"modal-subtitle\">Biblia de Jerusalén</span>\n        </div>\n        <button id=\"btnCerrarModalX\" class=\"btn-close\" title=\"Cerrar lectura\">&times;</button>\n      </div>\n\n      <!-- BARRA DE PROCLAMACIÓN -->\n      <div class=\"modal-proclama-box\" id=\"modalProclamaBox\">\n        <div id=\"modalProclamaBadge\" class=\"proclama-badge\"></div>\n        <div id=\"modalCatBadge\" class=\"cat-badge\"></div>\n      </div>\n\n      <!-- BARRA DE VOTO PERSONAL PRIVADO -->\n      <div class=\"modal-voting-personal-box\">\n        <div class=\"modal-personal-vote-row\">\n          <div style=\"display:flex; align-items:center; gap:8px; flex-wrap:wrap;\">\n            <span style=\"font-size:0.78rem; font-weight:800; color:#38bdf8;\">🙋‍♂️ Mi Voto Personal (Privado):</span>\n            <div class=\"stars-group\" id=\"modalPersonalStarsGroup\"></div>\n            <button class=\"btn-action\" style=\"padding:1px 6px; font-size:0.68rem;\" onclick=\"if(citaModalAct) setVotoPersonal(citaModalAct.id, 0)\">Borrar</button>\n          </div>\n          <span style=\"font-size:0.72rem; color:var(--text-muted); font-style:italic;\">Se almacena exclusivamente en tu dispositivo</span>\n        </div>\n        <input type=\"text\" id=\"modalPersonalNotaInput\" class=\"note-input\" placeholder=\"Mi resonancia personal sobre esta lectura...\" />\n      </div>\n\n      <!-- TEXTO DE LA ESCRITURA CON RESALTADO AMARILLO -->\n      <div id=\"lecturaModalCuerpo\" class=\"modal-body\"></div>\n\n      <!-- FOOTER DE NAVEGACIÓN -->\n      <div class=\"modal-footer\">\n        <div style=\"display:flex; gap:8px;\">\n          <button id=\"btnModalPrevCita\" class=\"btn-action\">⬅️ Anterior</button>\n          <button id=\"btnModalNextCita\" class=\"btn-action btn-action-primary\">➡️ Siguiente Cita</button>\n        </div>\n        <div style=\"display:flex; gap:8px;\">\n          <button id=\"btnCopiarTextoBiblico\" class=\"btn-action\">📋 Copiar Texto</button>\n          <button id=\"btnCerrarModalBottom\" class=\"btn-action\">Cerrar</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div id=\"toastMsg\" class=\"toast-msg\"></div>\n\n  <!-- SCRIPT DE INTERACTIVIDAD INTEGRADA -->\n  <script>\n    const DATA = __PAYLOAD_JSON__;\n    const DB_TEXTOS = __DB_TEXTOS_JSON__;\n    const N_PART = DATA.numParticipantes;\n    const PALABRA_KEY = DATA.palabra.toLowerCase().replace(/\\s+/g, '_');\n    const STORAGE_KEY_PERSONAL = 'prep_votos_personales_' + PALABRA_KEY;\n    const STORAGE_KEY_COLECTIVO = 'prep_votos_colectivos_' + PALABRA_KEY;\n    const STORAGE_KEY_ROL = 'prep_mi_rol_' + PALABRA_KEY;\n\n    let stateVotosPersonales = {};\n    let stateNotasPersonales = {};\n    let stateVotosColectivos = {};\n    let stateNotasColectivas = {};\n    let miRolActual = null;\n    let filtroCatActual = 'all';\n\n    try {\n      const savedPers = localStorage.getItem(STORAGE_KEY_PERSONAL);\n      if (savedPers) {\n        const p = JSON.parse(savedPers);\n        stateVotosPersonales = p.votos || {};\n        stateNotasPersonales = p.notas || {};\n      }\n      const savedCol = localStorage.getItem(STORAGE_KEY_COLECTIVO);\n      if (savedCol) {\n        const c = JSON.parse(savedCol);\n        stateVotosColectivos = c.votos || {};\n        stateNotasColectivas = c.notas || {};\n      }\n      miRolActual = localStorage.getItem(STORAGE_KEY_ROL) || null;\n    } catch(e) {}\n\n    function guardarEstadoPersonal() {\n      try {\n        localStorage.setItem(STORAGE_KEY_PERSONAL, JSON.stringify({\n          votos: stateVotosPersonales,\n          notas: stateNotasPersonales\n        }));\n      } catch(e) {}\n    }\n\n    function guardarEstadoColectivo() {\n      try {\n        localStorage.setItem(STORAGE_KEY_COLECTIVO, JSON.stringify({\n          votos: stateVotosColectivos,\n          notas: stateNotasColectivas\n        }));\n      } catch(e) {}\n    }\n\n    function mostrarToast(msg) {\n      const t = document.getElementById('toastMsg');\n      if (!t) return;\n      t.textContent = msg;\n      t.classList.add('show');\n      setTimeout(() => t.classList.remove('show'), 2400);\n    }\n\n    // CATEGORÍAS LITÚRGICAS\n    const CAT_INFO = {\n      Historicos: { nombre: '1ª Lectura: Históricos / Torá', icon: '📜', colorClass: 'cat-hist' },\n      Profeticos: { nombre: '2ª Lectura: Proféticos', icon: '🕊️', colorClass: 'cat-prof' },\n      'Nuevo Testamento': { nombre: '3ª Lectura: Cartas / NT', icon: '✉️', colorClass: 'cat-nt' },\n      Evangelio: { nombre: '4ª Lectura: Evangelio', icon: '✝️', colorClass: 'cat-ev' },\n      Salmos: { nombre: 'Salmo Responsorial', icon: '🎵', colorClass: 'cat-sal' },\n      Sapienciales: { nombre: 'Sapienciales', icon: '📖', colorClass: 'cat-hist' }\n    };\n\n    // SELECTOR DE IDENTIDAD (\"MI ROL\")\n    function renderizarBarraIdentidad() {\n      const container = document.getElementById('identityChipsGroup');\n      if (!container) return;\n      container.innerHTML = '';\n\n      for (let h = 1; h <= N_PART; h++) {\n        const chip = document.createElement('button');\n        chip.className = 'identity-chip h-badge-' + h + (miRolActual === 'H' + h ? ' active' : '');\n        chip.textContent = 'Hermano ' + h;\n        chip.onclick = () => setMiRol('H' + h);\n        container.appendChild(chip);\n      }\n\n      const allChip = document.createElement('button');\n      allChip.className = 'identity-chip' + (!miRolActual ? ' active' : '');\n      allChip.textContent = '👀 Todos';\n      allChip.onclick = () => setMiRol(null);\n      container.appendChild(allChip);\n    }\n\n    function setMiRol(rol) {\n      miRolActual = rol;\n      try {\n        if (rol) localStorage.setItem(STORAGE_KEY_ROL, rol);\n        else localStorage.removeItem(STORAGE_KEY_ROL);\n      } catch(e) {}\n      renderizarBarraIdentidad();\n      actualizarResaltadoCitasMiRol();\n      mostrarToast(rol ? '👤 Rol seleccionado: ' + rol + ' (Tus lecturas han sido resaltadas)' : '👀 Mostrando asignaciones de todos');\n    }\n\n    function actualizarResaltadoCitasMiRol() {\n      document.querySelectorAll('.cite-pill').forEach(pill => {\n        const h = pill.dataset.hermano;\n        const isMyTurn = (miRolActual && h && ('H' + h === miRolActual));\n        pill.classList.toggle('is-my-turn', isMyTurn);\n      });\n    }\n\n    // PODIO LITURGICO\n    function renderizarPodio() {\n      const podiumGrid = document.getElementById('podiumGrid');\n      if (!podiumGrid) return;\n      podiumGrid.innerHTML = '';\n\n      const catsPresentes = ['Historicos', 'Profeticos', 'Nuevo Testamento', 'Evangelio'];\n      if (DATA.citasList.some(c => c.categoria === 'Salmos')) catsPresentes.push('Salmos');\n\n      catsPresentes.forEach(catKey => {\n        const info = CAT_INFO[catKey] || { nombre: catKey, icon: '📖', colorClass: 'cat-hist' };\n        const citasCat = DATA.citasList.filter(c => c.categoria === catKey);\n        if (citasCat.length === 0) return;\n\n        const citasRanking = [...citasCat].sort((a, b) => {\n          const vA = stateVotosColectivos[a.id] || 0;\n          const vB = stateVotosColectivos[b.id] || 0;\n          return vB - vA;\n        });\n\n        const maxVotos = stateVotosColectivos[citasRanking[0].id] || 0;\n        const ganadoras = maxVotos > 0 ? citasRanking.filter(c => (stateVotosColectivos[c.id] || 0) === maxVotos) : [];\n\n        const pCard = document.createElement('div');\n        pCard.className = 'podium-card' + (ganadoras.length === 1 ? ' has-winner' : (ganadoras.length > 1 ? ' has-tie' : ''));\n\n        let bannerHTML = '';\n        if (ganadoras.length === 1) {\n          const w = ganadoras[0];\n          bannerHTML = `\n            <div class=\"podium-winner-banner\">\n              <span class=\"winner-label\">🥇 Lectura Ganadora (Hermano ${w.hermano})</span>\n              <span class=\"winner-cite\" onclick=\"abrirCitaPorId(${w.id})\">${w.citaCompleta || w.citaOriginal}</span>\n              <span class=\"winner-score\">⭐ ${maxVotos} / ${N_PART} votos colectivos</span>\n            </div>\n          `;\n        } else if (ganadoras.length > 1) {\n          const citsTxt = ganadoras.map(g => `#${g.seqId || g.id} ${g.citaCompleta || g.citaOriginal} (H${g.hermano})`).join(', ');\n          bannerHTML = `\n            <div class=\"podium-tie-banner\">\n              <span class=\"tie-label\">⚡ Empate en ${maxVotos} votos</span>\n              <span class=\"winner-cite\">${citsTxt}</span>\n            </div>\n          `;\n        } else {\n          bannerHTML = `\n            <div class=\"podium-empty-banner\">\n              ⏳ Pendiente de votación colectiva\n            </div>\n          `;\n        }\n\n        let rankingListHTML = '<div style=\"display:flex; flex-direction:column; gap:4px; margin-top:6px; border-top:1px dashed var(--border-color); padding-top:6px; max-height:140px; overflow-y:auto;\">';\n        citasRanking.forEach(c => {\n          const vCol = stateVotosColectivos[c.id] || 0;\n          const vPers = stateVotosPersonales[c.id] || 0;\n          rankingListHTML += `\n            <div style=\"display:flex; justify-content:space-between; align-items:center; font-size:0.75rem;\">\n              <button style=\"background:none; border:none; color:var(--text-muted); cursor:pointer; font-weight:600; text-align:left;\" onclick=\"abrirCitaPorId(${c.id})\">\n                <span class=\"cite-seq-badge\">#${c.seqId || c.id}</span>\n                <span class=\"cite-h-badge h-badge-${c.hermano}\">H${c.hermano}</span> ${c.citaCompleta || c.citaOriginal}\n              </button>\n              <div style=\"display:flex; gap:6px; font-size:0.72rem;\">\n                ${vPers > 0 ? `<span style=\"color:#38bdf8;\" title=\"Tu voto personal\">🙋‍♂️${vPers}★</span>` : ''}\n                <span style=\"color:#f59e0b; font-weight:700;\">⭐ ${vCol}/${N_PART}</span>\n              </div>\n            </div>\n          `;\n        });\n        rankingListHTML += '</div>';\n\n        pCard.innerHTML = `\n          <div class=\"podium-cat-header\">\n            <span class=\"podium-cat-name ${info.colorClass}\">${info.icon} ${info.nombre}</span>\n            <small style=\"color:var(--text-muted); font-size:0.7rem;\">${citasCat.length} opciones</small>\n          </div>\n          ${bannerHTML}\n          ${rankingListHTML}\n        `;\n\n        podiumGrid.appendChild(pCard);\n      });\n    }\n\n    // FASE 1: VOTACIÓN PERSONAL (PRIVADA)\n    function setVotoPersonal(citaId, puntos) {\n      const pts = Math.max(0, Math.min(5, puntos));\n      stateVotosPersonales[citaId] = pts;\n      guardarEstadoPersonal();\n      actualizarUIVotoPersonal(citaId);\n      renderizarPodio();\n    }\n\n    function guardarNotaPersonal(citaId, text) {\n      stateNotasPersonales[citaId] = text;\n      guardarEstadoPersonal();\n      const modalInput = document.getElementById('modalPersonalNotaInput');\n      if (modalInput && citaModalAct && citaModalAct.id === citaId && modalInput.value !== text) {\n        modalInput.value = text;\n      }\n    }\n\n    function actualizarUIVotoPersonal(citaId) {\n      const v = stateVotosPersonales[citaId] || 0;\n\n      const pills = document.querySelectorAll(`.cite-pill[data-id=\"${citaId}\"]`);\n      pills.forEach(pill => {\n        let tag = pill.querySelector('.cite-my-vote-tag');\n        if (v > 0) {\n          if (!tag) {\n            tag = document.createElement('span');\n            tag.className = 'cite-my-vote-tag';\n            pill.appendChild(tag);\n          }\n          tag.textContent = '🙋‍♂️ ' + v + '★';\n        } else if (tag) {\n          tag.remove();\n        }\n      });\n\n      if (citaModalAct && citaModalAct.id === citaId) {\n        const starGroup = document.getElementById('modalPersonalStarsGroup');\n        if (starGroup) {\n          starGroup.querySelectorAll('.star-btn-personal').forEach(btn => {\n            const val = parseInt(btn.dataset.val, 10);\n            btn.classList.toggle('active', val <= v);\n          });\n        }\n      }\n\n      const refBadge = document.getElementById('refPersonalBadge_' + citaId);\n      if (refBadge) {\n        refBadge.textContent = v > 0 ? '🙋‍♂️ ' + v + '★' : 'Sin voto personal';\n      }\n    }\n\n    // FASE 2: VOTACIÓN COLECTIVA A VIVA VOZ\n    function setVotoColectivo(citaId, puntos) {\n      const pts = Math.max(0, Math.min(N_PART, puntos));\n      stateVotosColectivos[citaId] = pts;\n      guardarEstadoColectivo();\n      actualizarUIVotoColectivo(citaId);\n      renderizarPodio();\n    }\n\n    function guardarNotaColectiva(citaId, text) {\n      stateNotasColectivas[citaId] = text;\n      guardarEstadoColectivo();\n    }\n\n    function actualizarUIVotoColectivo(citaId) {\n      const v = stateVotosColectivos[citaId] || 0;\n\n      const dispEscrutinio = document.getElementById('dispCollectiveScore_' + citaId);\n      if (dispEscrutinio) dispEscrutinio.textContent = v + ' / ' + N_PART;\n\n      const starGroupEscrutinio = document.getElementById('collectiveStarGroup_' + citaId);\n      if (starGroupEscrutinio) {\n        starGroupEscrutinio.querySelectorAll('.star-btn').forEach(btn => {\n          const val = parseInt(btn.dataset.val, 10);\n          btn.classList.toggle('active', val <= v);\n        });\n      }\n    }\n\n    // RENDERIZAR LISTA DE CITAS ORGANIZADAS CON FILTROS\n    function renderizarListaCitas() {\n      const listContainer = document.getElementById('citasListGrid');\n      if (!listContainer) return;\n      listContainer.innerHTML = '';\n\n      let list = DATA.citasList;\n      if (filtroCatActual !== 'all') {\n        list = list.filter(c => c.categoria === filtroCatActual);\n      }\n\n      list.forEach(c => {\n        const vCol = stateVotosColectivos[c.id] || 0;\n        const vPers = stateVotosPersonales[c.id] || 0;\n        const notaPers = stateNotasPersonales[c.id] || '';\n        const notaCol = stateNotasColectivas[c.id] || '';\n        const catInfo = CAT_INFO[c.categoria] || { nombre: c.categoria, icon: '📖' };\n\n        let collectiveStarsHTML = '';\n        for (let s = 1; s <= N_PART; s++) {\n          collectiveStarsHTML += `<button class=\"star-btn ${s <= vCol ? 'active' : ''}\" data-val=\"${s}\" onclick=\"setVotoColectivo(${c.id}, ${s})\" title=\"${s} votos colectivos\">★</button>`;\n        }\n\n        const card = document.createElement('div');\n        card.className = 'escrutinio-card';\n\n        card.innerHTML = `\n          <div class=\"escrutinio-card-top\">\n            <button class=\"escrutinio-cite-btn\" onclick=\"abrirCitaPorId(${c.id})\">\n              <span class=\"cite-seq-badge\" style=\"font-size:0.85rem; font-weight:800; color:var(--text-main);\">#${c.seqId || c.id}</span>\n              <span class=\"cite-h-badge h-badge-${c.hermano}\">H${c.hermano}</span>\n              <span>${c.citaCompleta || c.citaOriginal}</span>\n              <small style=\"color:var(--text-muted); font-weight:normal; font-size:0.75rem;\">(~ ${c.chars.toLocaleString()} car.)</small>\n            </button>\n            <div style=\"display:flex; align-items:center; gap:6px;\">\n              <span class=\"cat-badge\">${catInfo.icon} ${c.categoria}</span>\n              <button class=\"btn-action\" style=\"padding:2px 8px; font-size:0.72rem;\" onclick=\"abrirCitaPorId(${c.id})\">📖 Leer</button>\n            </div>\n          </div>\n\n          <div class=\"votes-comparison-box\">\n            <div class=\"my-vote-ref-box\">\n              <span style=\"font-weight:700; color:var(--text-muted);\">🙋‍♂️ Tu Voto Personal:</span>\n              <span class=\"my-vote-ref-badge\" id=\"refPersonalBadge_${c.id}\">${vPers > 0 ? '🙋‍♂️ ' + vPers + '★' : 'Sin voto personal'}</span>\n              ${notaPers ? `<span style=\"font-size:0.74rem; color:var(--text-muted); font-style:italic; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;\" title=\"${notaPers.replace(/\"/g, '&quot;')}\">\"${notaPers}\"</span>` : ''}\n            </div>\n\n            <div class=\"collective-vote-box\">\n              <span style=\"font-size:0.78rem; font-weight:800; color:#f59e0b;\">👥 Voto Colectivo:</span>\n              <div class=\"stars-group\" id=\"collectiveStarGroup_${c.id}\">${collectiveStarsHTML}</div>\n              <div class=\"stepper-group\">\n                <button class=\"btn-step\" onclick=\"setVotoColectivo(${c.id}, (stateVotosColectivos[${c.id}] || 0) - 1)\">-</button>\n                <span class=\"score-display\" id=\"dispCollectiveScore_${c.id}\">${vCol} / ${N_PART}</span>\n                <button class=\"btn-step\" onclick=\"setVotoColectivo(${c.id}, (stateVotosColectivos[${c.id}] || 0) + 1)\">+</button>\n              </div>\n            </div>\n          </div>\n\n          <input type=\"text\" class=\"note-input\" placeholder=\"Resonancia o síntesis de la comunidad sobre esta perícopa...\" value=\"${notaCol.replace(/\"/g, '&quot;')}\" onchange=\"guardarNotaColectiva(${c.id}, this.value)\" />\n        `;\n\n        listContainer.appendChild(card);\n      });\n    }\n\n    function filtrarCategoria(cat) {\n      filtroCatActual = cat;\n      document.querySelectorAll('.filter-pill-btn').forEach(btn => {\n        btn.classList.toggle('active', btn.dataset.cat === cat);\n      });\n      renderizarListaCitas();\n    }\n    window.filtrarCategoria = filtrarCategoria;\n\n    // LECTOR BÍBLICO (BIBLIA DE JERUSALÉN CON RESALTADO AMARILLO)\n    let citaModalAct = null;\n    let indiceModalAct = -1;\n\n    function abrirCitaPorId(id) {\n      const idx = DATA.citasList.findIndex(x => x.id === id);\n      if (idx !== -1) abrirModalLecturaIndex(idx);\n    }\n    window.abrirCitaPorId = abrirCitaPorId;\n\n    function resaltarVersiculos(html, ini, fin, cont, citaOriginal) {\n      if (!html) return '';\n      let start = ini ? parseInt(ini, 10) : null;\n      let end = fin ? parseInt(fin, 10) : (cont === 's' ? start + 1 : (cont === 'ss' ? 9999 : start));\n\n      if (!start && citaOriginal) {\n        const m = citaOriginal.match(/,[ \\t]*([0-9]+)(?:[ \\t]*-[ \\t]*([0-9]+))?/);\n        if (m) {\n          start = parseInt(m[1], 10);\n          end = m[2] ? parseInt(m[2], 10) : (cont === 's' ? start + 1 : (cont === 'ss' ? 9999 : start));\n        }\n      }\n\n      if (!start) return html;\n\n      let isFirstHighlighted = true;\n      return html.replace(/<strong>([0-9]+)<\\/strong>([^<]*)/g, (match, vNum, vContent) => {\n        const num = parseInt(vNum, 10);\n        if (num >= start && num <= (end || start)) {\n          const idAttr = isFirstHighlighted ? ' id=\"cita-start-target\"' : '';\n          if (isFirstHighlighted) isFirstHighlighted = false;\n          return `<mark${idAttr} class=\"highlighted-verse\"><strong>${vNum}</strong>${vContent}</mark>`;\n        }\n        return `<strong>${vNum}</strong>${vContent}`;\n      });\n    }\n\n    function abrirModalLecturaIndex(idx) {\n      if (idx < 0 || idx >= DATA.citasList.length) return;\n      indiceModalAct = idx;\n      const c = DATA.citasList[idx];\n      citaModalAct = c;\n\n      const modal = document.getElementById('modalLectura');\n      const tit = document.getElementById('lecturaModalTitulo');\n      const sub = document.getElementById('lecturaModalSubtitulo');\n      const cuerpo = document.getElementById('lecturaModalCuerpo');\n      const proclamaBadge = document.getElementById('modalProclamaBadge');\n      const catBadge = document.getElementById('modalCatBadge');\n\n      tit.textContent = c.citaCompleta || c.citaOriginal;\n      sub.textContent = 'Biblia de Jerusalén · ' + (c.libroNombre || c.libro) + ' ' + c.capitulo;\n\n      // Banner de Proclamación\n      proclamaBadge.innerHTML = `\n        <span class=\"cite-h-badge h-badge-${c.hermano}\">H${c.hermano}</span>\n        <span>👤 Proclama: <strong>Hermano ${c.hermano}</strong></span>\n        <small style=\"color:var(--text-muted); font-weight:normal; margin-left:6px;\">(Lectura #${c.seqId || (idx + 1)} de ${DATA.citasList.length} en Léon-Dufour)</small>\n      `;\n\n      const catInfo = CAT_INFO[c.categoria] || { nombre: c.categoria, icon: '📖' };\n      catBadge.textContent = catInfo.icon + ' ' + catInfo.nombre;\n\n      // Estrellas de Voto Personal (1 a 5)\n      const vPers = stateVotosPersonales[c.id] || 0;\n      const persStarsGroup = document.getElementById('modalPersonalStarsGroup');\n      let persStarsHTML = '';\n      for (let s = 1; s <= 5; s++) {\n        persStarsHTML += `<button class=\"star-btn star-btn-personal ${s <= vPers ? 'active' : ''}\" data-val=\"${s}\" onclick=\"setVotoPersonal(${c.id}, ${s})\" title=\"${s} estrellas personales\">★</button>`;\n      }\n      persStarsGroup.innerHTML = persStarsHTML;\n\n      const persNotaInput = document.getElementById('modalPersonalNotaInput');\n      persNotaInput.value = stateNotasPersonales[c.id] || '';\n      persNotaInput.onchange = (e) => guardarNotaPersonal(c.id, e.target.value);\n\n      // Botones de Navegación\n      const btnPrev = document.getElementById('btnModalPrevCita');\n      const btnNext = document.getElementById('btnModalNextCita');\n      btnPrev.disabled = (idx === 0);\n      btnPrev.style.opacity = (idx === 0) ? '0.5' : '1';\n      btnNext.disabled = (idx === DATA.citasList.length - 1);\n      btnNext.style.opacity = (idx === DATA.citasList.length - 1) ? '0.5' : '1';\n\n      // Texto de las Escrituras con versículos resaltados en amarillo\n      const rawHtml = DB_TEXTOS[c.textoRef];\n      if (rawHtml) {\n        cuerpo.innerHTML = resaltarVersiculos(rawHtml, c.versiculoInicio, c.versiculoFin, c.continuidad, c.citaOriginal);\n      } else {\n        cuerpo.innerHTML = '<p>Texto bíblico completo no disponible en el paquete sin conexión.</p>';\n      }\n\n      modal.style.display = 'flex';\n\n      // Auto-scroll centrado en el primer versículo resaltado\n      setTimeout(() => {\n        const target = cuerpo.querySelector('#cita-start-target') || cuerpo.querySelector('.highlighted-verse');\n        if (target) {\n          target.scrollIntoView({ behavior: 'smooth', block: 'center' });\n        } else {\n          cuerpo.scrollTop = 0;\n        }\n      }, 60);\n    }\n\n    function cerrarModalLectura() {\n      document.getElementById('modalLectura').style.display = 'none';\n      citaModalAct = null;\n      indiceModalAct = -1;\n    }\n\n    document.getElementById('btnModalPrevCita').onclick = () => {\n      if (indiceModalAct > 0) abrirModalLecturaIndex(indiceModalAct - 1);\n    };\n\n    document.getElementById('btnModalNextCita').onclick = () => {\n      if (indiceModalAct < DATA.citasList.length - 1) abrirModalLecturaIndex(indiceModalAct + 1);\n    };\n\n    document.getElementById('btnCerrarModalX').onclick = cerrarModalLectura;\n    document.getElementById('btnCerrarModalBottom').onclick = cerrarModalLectura;\n\n    document.getElementById('btnCopiarTextoBiblico').onclick = () => {\n      const cuerpo = document.getElementById('lecturaModalCuerpo');\n      if (!cuerpo || !citaModalAct) return;\n      const txt = `📖 ${citaModalAct.citaCompleta || citaModalAct.citaOriginal} (Biblia de Jerusalén)\\n\\n${cuerpo.innerText}`;\n      navigator.clipboard.writeText(txt).then(() => mostrarToast('✅ Texto bíblico copiado al portapapeles'));\n    };\n\n    // VINCULAR CITAS DENTRO DEL TEXTO DE LÉON-DUFOUR\n    document.querySelectorAll('.articulo-body .cite-pill').forEach(pill => {\n      if (pill.dataset.isPericopa === 'true') {\n        pill.onclick = (e) => {\n          e.stopPropagation();\n          const per = pill.dataset.pericopa || 'esta perícopa';\n          const h = pill.dataset.hermano || '';\n          mostrarToast(`🔗 Cita ya asignada como parte de la perícopa \"${per}\" al Hermano ${h}`);\n        };\n        return;\n      }\n\n      const citeStr = (pill.dataset.cite || pill.dataset.raw || '').trim().toLowerCase();\n      const matched = DATA.citasList.find(c => (c.citaOriginal || '').toLowerCase() === citeStr || (c.citaCompleta || '').toLowerCase() === citeStr);\n      \n      if (matched) {\n        pill.dataset.id = matched.id;\n        pill.dataset.hermano = matched.hermano;\n        const vPers = stateVotosPersonales[matched.id] || 0;\n        if (vPers > 0) {\n          const tag = document.createElement('span');\n          tag.className = 'cite-my-vote-tag';\n          tag.textContent = '🙋‍♂️ ' + vPers + '★';\n          pill.appendChild(tag);\n        }\n      }\n\n      pill.onclick = () => {\n        const cId = pill.dataset.id ? parseInt(pill.dataset.id, 10) : (matched ? matched.id : null);\n        if (cId) {\n          abrirCitaPorId(cId);\n        } else {\n          const ref = pill.dataset.ref;\n          if (ref && DB_TEXTOS[ref]) {\n            const rawHtml = DB_TEXTOS[ref];\n            const tit = pill.dataset.fullName || pill.dataset.cite || pill.dataset.raw;\n            document.getElementById('lecturaModalTitulo').textContent = tit;\n            document.getElementById('lecturaModalSubtitulo').textContent = 'Biblia de Jerusalén';\n            document.getElementById('modalProclamaBadge').innerHTML = '<span>📖 Referencia Bíblica</span>';\n            document.getElementById('modalCatBadge').textContent = 'Biblia';\n            document.getElementById('modalPersonalStarsGroup').innerHTML = '';\n            document.getElementById('modalPersonalNotaInput').value = '';\n            document.getElementById('btnModalPrevCita').disabled = true;\n            document.getElementById('btnModalNextCita').disabled = true;\n            const cuerpo = document.getElementById('lecturaModalCuerpo');\n            cuerpo.innerHTML = resaltarVersiculos(rawHtml, pill.dataset.vini ? parseInt(pill.dataset.vini, 10) : null, pill.dataset.vfin ? parseInt(pill.dataset.vfin, 10) : null, pill.dataset.cont, tit);\n            document.getElementById('modalLectura').style.display = 'flex';\n            setTimeout(() => {\n              const target = cuerpo.querySelector('#cita-start-target') || cuerpo.querySelector('.highlighted-verse');\n              if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });\n              else cuerpo.scrollTop = 0;\n            }, 60);\n          }\n        }\n      };\n    });\n\n    // TEMA CLARO / OSCURO\n    document.getElementById('btnThemeToggle').onclick = () => {\n      const curr = document.documentElement.getAttribute('data-theme');\n      const next = curr === 'light' ? 'dark' : 'light';\n      document.documentElement.setAttribute('data-theme', next);\n      try { localStorage.setItem('preparacion_theme', next); } catch(e) {}\n    };\n\n    try {\n      const savedTheme = localStorage.getItem('preparacion_theme');\n      if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);\n    } catch(e) {}\n\n    // REINICIAR VOTOS\n    document.getElementById('btnResetVotos').onclick = () => {\n      if (confirm('¿Deseas reiniciar todas las puntuaciones personales y colectivas de esta preparación?')) {\n        stateVotosPersonales = {};\n        stateNotasPersonales = {};\n        stateVotosColectivos = {};\n        stateNotasColectivas = {};\n        guardarEstadoPersonal();\n        guardarEstadoColectivo();\n        renderizarListaCitas();\n        renderizarPodio();\n        document.querySelectorAll('.cite-my-vote-tag').forEach(t => t.remove());\n        mostrarToast('🔄 Puntuaciones reiniciadas');\n      }\n    };\n\n    // COPIAR LITURGIA GANADORA Y CANDIDATAS PARA WHATSAPP\n    document.getElementById('btnCopiarLiturgia').onclick = () => {\n      const cats = ['Historicos', 'Profeticos', 'Nuevo Testamento', 'Evangelio'];\n      let msg = `🕊️ *LITURGIA Y CANDIDATAS SELECCIONADAS*\\n`;\n      msg += `Palabra: *\"${DATA.palabraMayus}\"* (Xavier Léon-Dufour)\\n`;\n      msg += `👥 Preparada en comunidad (${N_PART} participantes)\\n`;\n      msg += `====================================\\n\\n`;\n\n      cats.forEach((catKey) => {\n        const info = CAT_INFO[catKey];\n        const citasCat = DATA.citasList.filter(c => c.categoria === catKey);\n        const citasRanking = [...citasCat].sort((a, b) => (stateVotosColectivos[b.id] || 0) - (stateVotosColectivos[a.id] || 0));\n        const maxV = stateVotosColectivos[citasRanking[0]?.id] || 0;\n        const ganadoras = maxV > 0 ? citasRanking.filter(c => (stateVotosColectivos[c.id] || 0) === maxV) : [citasRanking[0]];\n\n        msg += `${info.icon} *${info.nombre.toUpperCase()}:*\\n`;\n        if (ganadoras && ganadoras.length > 0) {\n          ganadoras.forEach(g => {\n            const v = stateVotosColectivos[g.id] || 0;\n            const nota = stateNotasColectivas[g.id];\n            const prefix = ganadoras.length === 1 ? '🥇 *Ganadora:*' : '⚡ *Candidata en Empate:*';\n            msg += `  ${prefix} *#${g.seqId || g.id} ${g.citaCompleta || g.citaOriginal}* (Hermano ${g.hermano}${v > 0 ? ' — ⭐ ' + v + '/' + N_PART + ' votos' : ''})\\n`;\n            if (nota) msg += `    📝 _\"${nota}\"_\\n`;\n          });\n        } else {\n          msg += `  • [Sin lectura asignada]\\n`;\n        }\n        msg += `\\n`;\n      });\n\n      const salmos = DATA.citasList.filter(c => c.categoria === 'Salmos');\n      if (salmos.length > 0) {\n        const salmosRanking = [...salmos].sort((a, b) => (stateVotosColectivos[b.id] || 0) - (stateVotosColectivos[a.id] || 0));\n        const maxVSal = stateVotosColectivos[salmosRanking[0]?.id] || 0;\n        const ganSal = maxVSal > 0 ? salmosRanking.filter(c => (stateVotosColectivos[c.id] || 0) === maxVSal) : [salmosRanking[0]];\n        msg += `🎵 *SALMO RESPONSORIAL:*\\n`;\n        ganSal.forEach(s => {\n          msg += `  • *#${s.seqId || s.id} ${s.citaCompleta || s.citaOriginal}* (Hermano ${s.hermano})\\n`;\n        });\n        msg += `\\n`;\n      }\n\n      msg += `====================================\\n`;\n      msg += `Liturgia preparada en comunidad con la aplicación de Preparación de Palabras.`;\n\n      if (navigator.clipboard && navigator.clipboard.writeText) {\n        navigator.clipboard.writeText(msg).then(() => {\n          mostrarToast('✅ Liturgia copiada para WhatsApp');\n        });\n      } else {\n        mostrarToast('✅ Liturgia generada');\n      }\n    };\n\n    // INICIALIZACIÓN\n    renderizarBarraIdentidad();\n    actualizarResaltadoCitasMiRol();\n    renderizarListaCitas();\n    renderizarPodio();\n  </script>\n</body>\n</html>";

function generarCodigoHTMLFicha(item, numPart, criterioActual, usarUnidas, soloPentCalc, incluirExtras, dbTextos) {
    const palabra = item.palabra;
    const palabraMayus = palabra.toUpperCase();
    const vocabKey = item.vocabKey || palabra;
    const subInfo = item.subInfo || '';
    const rawContenido = (dataGlobalRef && dataGlobalRef.palabras && dataGlobalRef.palabras[vocabKey] && dataGlobalRef.palabras[vocabKey].contenido) 
        ? dataGlobalRef.palabras[vocabKey].contenido 
        : (item.contenido || '');
    const relacionados = (dataGlobalRef && dataGlobalRef.palabras && dataGlobalRef.palabras[vocabKey] && dataGlobalRef.palabras[vocabKey].relacionados)
        ? dataGlobalRef.palabras[vocabKey].relacionados
        : (item.relacionados || []);

    let citasFinales;
    if (criterioActual === "rotativo" && rawContenido) {
        citasFinales = extraerCitasEnOrdenDeTexto(rawContenido, item, usarUnidas, soloPentCalc, incluirExtras);
    } else {
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

        citasFinales = ordenarCitasAsc(citasAConsolidar);
    }

    const totalCharsGeneral = citasFinales.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);

    const criterioNombres = {
        rotativo: "Alternado / Rotativo (1ª al 1º, 2ª al 2º... por turnos)",
        caracteres: "Tiempo de Lectura (Caracteres Reales - DP Óptimo)",
        hibrido: "Híbrido (Texto + Esfuerzo de Búsqueda)",
        citas: "Cantidad de Citas (Bloques Continuos)"
    };
    const criterioTxt = criterioNombres[criterioActual] || "Alternado / Rotativo";
    const particiones = calcularDistribucionLineal(citasFinales, numPart, criterioActual);

    // Mapear cada cita única asignada para la lista del escrutinio y podio
    const citasList = [];
    particiones.forEach(p => {
        p.citas.forEach(c => {
            const code = (c.libro || '').toUpperCase().trim();
            const setEv = new Set(["MT", "MC", "LC", "JN"]);
            const setNt = new Set(["HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"]);
            const setProf = new Set(["IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL"]);
            const setSap = new Set(["JOB", "PROV", "ECL", "CANT", "SAB", "ECLO"]);

            let cat = c.categoria || 'Historicos';
            if (code === 'SAL') cat = 'Salmos';
            else if (setEv.has(code)) cat = 'Evangelio';
            else if (setNt.has(code)) cat = 'Nuevo Testamento';
            else if (setProf.has(code)) cat = 'Profeticos';
            else if (setSap.has(code)) cat = 'Sapienciales';

            citasList.push({
                id: c.seqId || c.id || (citasList.length + 1),
                seqId: c.seqId || c.id || (citasList.length + 1),
                citaOriginal: c.citaOriginal,
                citaCompleta: c.citaCompleta || c.citaOriginal,
                libro: c.libro,
                libroNombre: c.libroNombre || NOMBRES_LIBROS[c.libro] || c.libro,
                capitulo: c.capitulo,
                versiculoInicio: c.versiculoInicio,
                versiculoFin: c.versiculoFin,
                continuidad: c.continuidad,
                categoria: cat,
                hermano: p.hermano,
                textoRef: c.textoRef,
                chars: calcularCaracteresCita(c)
            });
        });
    });

    // Ordenar citasList según su secuencia #1..#N
    citasList.sort((a, b) => (a.seqId || a.id) - (b.seqId || b.id));

    const textosRequeridos = {};
    citasList.forEach(c => {
        if (c.textoRef && dbTextos[c.textoRef]) {
            textosRequeridos[c.textoRef] = dbTextos[c.textoRef];
        }
    });

    const articuloHtmlAnotado = formatearArticuloConAsignaciones(rawContenido, relacionados, particiones, item, criterioActual, soloPentCalc, incluirExtras, usarUnidas);

    const payloadJSON = JSON.stringify({
        palabra,
        palabraMayus,
        subInfo,
        numParticipantes: numPart,
        criterio: criterioActual,
        criterioTxt,
        totalCitas: citasList.length,
        totalCaracteres: totalCharsGeneral,
        citasList,
        particiones: particiones.map(p => ({
            hermano: p.hermano,
            rango: p.rango,
            totalCitas: p.totalCitas,
            totalCaracteres: p.totalCaracteres,
            porcentaje: p.porcentaje
        }))
    });

    const dbTextosJSON = JSON.stringify(textosRequeridos);

    let html = TEMPLATE_FICHA_BASE
        .replace(/__PALABRA_MAYUS__/g, palabraMayus)
        .replace(/__NUM_PART__/g, String(numPart))
        .replace(/__CRITERIO_TXT__/g, criterioTxt)
        .replace(/__CITAS_COUNT__/g, String(citasList.length))
        .replace(/__TOTAL_CHARS__/g, totalCharsGeneral.toLocaleString())
        .replace('__ARTICULO_HTML__', articuloHtmlAnotado)
        .replace('__PAYLOAD_JSON__', payloadJSON)
        .replace('__DB_TEXTOS_JSON__', dbTextosJSON);

    return html;
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
if (btnExportarFichaHTML) btnExportarFichaHTML.onclick = exportarFichaPreparacionHTML;

if (calcTabBtnCards) calcTabBtnCards.onclick = () => setCalcViewTab("cards");
if (calcTabBtnArticulo) calcTabBtnArticulo.onclick = () => setCalcViewTab("articulo");

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
    let lastBookInfo = null;

    // 1. Transformar <cite>...</cite> en botones interactivos con clase cite-pill manteniendo contexto activo de libro
    let html = rawHtml.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, (match, citeText) => {
        const cleanText = citeText.replace(/<[^>]*>/g, '').trim();
        if (!cleanText) return match;

        const parsed = parseSmartQuoteClient(cleanText, lastBookInfo);
        if (parsed) {
            lastBookInfo = { key: parsed.key, lastCap: parsed.capitulo };
            const fullCite = parsed.citaOriginal;
            const fullName = parsed.citaCompleta;
            const bookCode = parsed.libro;
            const bookName = parsed.libroNombre;
            const cap = parsed.capitulo;
            const vIni = (parsed.versiculoInicio !== null && parsed.versiculoInicio !== undefined) ? parsed.versiculoInicio : '';
            const vFin = (parsed.versiculoFin !== null && parsed.versiculoFin !== undefined) ? parsed.versiculoFin : '';
            const cont = parsed.continuidad || '';
            const textRef = parsed.textoRef;

            return `<cite class="cite-pill" data-cite="${fullCite}" data-full-name="${fullName}" data-book="${bookCode}" data-book-name="${bookName}" data-cap="${cap}" data-vini="${vIni}" data-vfin="${vFin}" data-cont="${cont}" data-ref="${textRef}" data-raw="${cleanText}" title="📖 ${fullName} — Toca para leer el texto bíblico completo">${cleanText}</cite>`;
        }

        return `<cite class="cite-pill" data-cite="${cleanText}" data-raw="${cleanText}" title="Toca para leer el texto bíblico de: ${cleanText}">${cleanText}</cite>`;
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
                const found = arr.find(c => 
                    c.citaOriginal.toLowerCase() === clean.toLowerCase() || 
                    (c.citaCompleta && c.citaCompleta.toLowerCase() === clean.toLowerCase())
                );
                if (found) return found;
            }
        }
    }

    // 2. Parseo inteligente con el motor universal BOOK_MAP
    const parsed = parseSmartQuoteClient(clean, null);
    if (parsed && dbTextos[parsed.textoRef]) {
        return parsed;
    }

    return null;
}

function activarInteractividadArticulo(item) {
    // Clic en citas bíblicas dentro del artículo
    articuloModalCuerpo.querySelectorAll(".cite-pill").forEach(pill => {
        pill.onclick = (e) => {
            e.stopPropagation();
            const textRef = pill.dataset.ref;
            if (textRef && dbTextos[textRef]) {
                const citaObj = {
                    citaOriginal: pill.dataset.cite || pill.dataset.raw,
                    citaCompleta: pill.dataset.fullName || pill.dataset.cite || pill.dataset.raw,
                    libro: pill.dataset.book,
                    libroNombre: pill.dataset.bookName || NOMBRES_LIBROS[pill.dataset.book] || pill.dataset.book,
                    capitulo: parseInt(pill.dataset.cap, 10),
                    versiculoInicio: pill.dataset.vini ? parseInt(pill.dataset.vini, 10) : null,
                    versiculoFin: pill.dataset.vfin ? parseInt(pill.dataset.vfin, 10) : null,
                    continuidad: pill.dataset.cont || null,
                    textoRef: textRef
                };
                abrirModalLectura(citaObj);
                return;
            }

            const citeText = pill.dataset.cite || pill.dataset.raw;
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

function toggleModoEdicionExclusiones() {
    modoEdicionExclusiones = !modoEdicionExclusiones;
    actualizarEstadoModoEdicion();
    if (modoEdicionExclusiones) {
        mostrarToast("✏️ Modo edición activado: ya puedes quitar palabras, cargar predeterminadas o borrar todas");
    } else {
        mostrarToast("🔒 Modo edición desactivado: lista protegida contra toques accidentales");
    }
}

function actualizarEstadoModoEdicion() {
    if (contenedorTags) {
        contenedorTags.classList.toggle("modo-edicion", modoEdicionExclusiones);
    }
    if (grupoAccionesEdicion) {
        grupoAccionesEdicion.style.display = modoEdicionExclusiones ? "inline-flex" : "none";
    }
    if (btnModoEditarExclusiones) {
        btnModoEditarExclusiones.classList.toggle("active", modoEdicionExclusiones);
        btnModoEditarExclusiones.innerHTML = modoEdicionExclusiones 
            ? `✅ Terminar Edición` 
            : `✏️ Editar Palabras`;
        btnModoEditarExclusiones.setAttribute("title", modoEdicionExclusiones 
            ? "Toca para finalizar la edición y proteger la lista contra toques accidentales" 
            : "Toca para activar el modo de edición y poder quitar palabras, cargar predeterminadas o borrarlas");
    }
}

function renderizarTags() {
    contenedorTags.innerHTML = "";
    if (setExcluidos.size === 0) {
        contenedorTags.innerHTML = `<span class="sin-exclusiones">Sin palabras excluidas. Toca "✏️ Editar Palabras" para cargar las 25 predeterminadas o añade palabras arriba.</span>`;
        if (countExcluidasHeader) countExcluidasHeader.textContent = "0";
        actualizarEstadoModoEdicion();
        return;
    }

    if (countExcluidasHeader) countExcluidasHeader.textContent = setExcluidos.size;
    actualizarEstadoModoEdicion();

    // Mapear y ordenar numéricamente por número de Precatecumenado (#1, #2, #3...)
    const listaTags = Array.from(setExcluidos).map(pNorm => {
        const item = listaGlobal.find(i => normalizar(i.palabra) === pNorm || (i.vocabKey && normalizar(i.vocabKey) === pNorm) || (i.palabraNorm && i.palabraNorm.includes(pNorm)));
        const num = (item && item.numPrecat) ? Number(item.numPrecat) : 99999;
        let nombreMostrar = item ? item.palabra : (pNorm.charAt(0).toUpperCase() + pNorm.slice(1));
        if (item && item.numPrecat) {
            nombreMostrar = `#${item.numPrecat} ${item.palabra}`;
        }
        return {
            pNorm,
            item,
            num,
            palabra: item ? item.palabra : pNorm,
            nombreMostrar
        };
    });

    listaTags.sort((a, b) => {
        if (a.num !== b.num) {
            return a.num - b.num;
        }
        return a.palabra.localeCompare(b.palabra, 'es');
    });

    listaTags.forEach(({ pNorm, item, nombreMostrar }) => {
        const tag = document.createElement("div");
        tag.className = "tag-excluido";
        tag.setAttribute("title", `Exclusión activa: "${item ? item.palabra : pNorm}"`);
        tag.innerHTML = `<span>${nombreMostrar}</span> <button class="btn-remove-tag" aria-label="Quitar exclusión" title="Quitar exclusión">&times;</button>`;
        tag.querySelector("button").onclick = (e) => {
            e.stopPropagation();
            eliminarExclusion(pNorm, item ? item.palabra : nombreMostrar);
        };
        contenedorTags.appendChild(tag);
    });
}

function buscarTermino(termino) {
    if (!inputBusqueda) return;
    inputBusqueda.value = termino;

    // Si estamos en modo precat y la palabra solo existe en el vocabulario completo (289), cambiar a modo 'todas'
    if (modoFiltro === "precat" && termino) {
        const pNorm = normalizar(termino);
        const enPrecat = listaPrecat.some(p => normalizar(p.palabra).includes(pNorm) || normalizar(p.vocabKey).includes(pNorm));
        const enTodas = listaTodas.some(p => normalizar(p.palabra).includes(pNorm) || normalizar(p.vocabKey).includes(pNorm));
        if (!enPrecat && enTodas) {
            modoFiltro = "todas";
            if (btnModoTodas) btnModoTodas.classList.add("active");
            if (btnModoPrecat) btnModoPrecat.classList.remove("active");
            if (selectOrden.value === "precat") selectOrden.value = "alpha";
        }
    }

    actualizarVista();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function agregarExclusiones() {
    const texto = inputExcluir.value;
    if (!texto) return;
    const nuevas = texto.split(',').map(t => normalizar(t)).filter(t => t.length > 0);
    let invalidas = [];
    let avisosRemision = [];
    let cambios = false;

    nuevas.forEach(pNorm => {
        if (setPalabrasExistentes.has(pNorm)) {
            if (!setExcluidos.has(pNorm)) {
                setExcluidos.add(pNorm);
                cambios = true;
            }
        } else if (typeof INDICE_REMISIONES_DATA !== 'undefined' && INDICE_REMISIONES_DATA.mapaRemisiones && INDICE_REMISIONES_DATA.mapaRemisiones[pNorm]) {
            // Es una remisión oficial que apunta a una palabra del vocabulario
            const rem = INDICE_REMISIONES_DATA.mapaRemisiones[pNorm];
            rem.destinos.forEach(dest => {
                const normDest = normalizar(dest);
                if (setPalabrasExistentes.has(normDest) && !setExcluidos.has(normDest)) {
                    setExcluidos.add(normDest);
                    cambios = true;
                }
            });
            avisosRemision.push(`"${rem.termino}" (remitido a: ${rem.destinos.join(', ')})`);
        } else {
            invalidas.push(pNorm);
        }
    });

    if (avisosRemision.length > 0) {
        alert(`💡 Se aplicaron exclusiones por remisión oficial:\n- ${avisosRemision.join("\n- ")}`);
    }

    if (invalidas.length > 0) {
        alert(`No existen en el Vocabulario ni en el índice de remisiones:\n- ${invalidas.join("\n- ")}`);
    }

    inputExcluir.value = "";
    if (cambios) {
        guardarLocalStorage();
        renderizarTags();
        actualizarVista();
        if (contenedorTags) contenedorTags.scrollTop = contenedorTags.scrollHeight;
        mostrarToast("✅ Palabras añadidas a exclusiones");
    }
}

function excluirPalabraDirecta(nombrePalabra) {
    const pNorm = normalizar(nombrePalabra);
    if (!setExcluidos.has(pNorm)) {
        if (!confirm(`🚫 ¿Estás seguro de que deseas excluir "${nombrePalabra}" del temario?\n\nDejará de aparecer en la lista principal (puedes restaurarla en cualquier momento desde ⚙️ Filtros > Editar Palabras).`)) {
            return;
        }
        setExcluidos.add(pNorm);
        guardarLocalStorage();
        renderizarTags();
        actualizarVista();
        if (contenedorTags) contenedorTags.scrollTop = contenedorTags.scrollHeight;
        mostrarToast(`🚫 "${nombrePalabra}" añadida a excluidas`);
    } else {
        mostrarToast(`ℹ️ "${nombrePalabra}" ya está excluida`);
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
    if (!confirm("⚠️ ¿Estás seguro de que deseas borrar TODAS las palabras excluidas para ver el temario completo?")) {
        return;
    }
    setExcluidos.clear();
    modoEdicionExclusiones = false;
    guardarLocalStorage();
    renderizarTags();
    actualizarVista();
    mostrarToast("🗑️ Todas las exclusiones han sido borradas");
}

function restaurarExclusionesPredeterminadas() {
    if (setExcluidos.size > 0) {
        if (!confirm("🔄 ¿Deseas recargar la lista de las 25 palabras excluidas predeterminadas?")) {
            return;
        }
    }
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

if (btnModoEditarExclusiones) btnModoEditarExclusiones.onclick = toggleModoEdicionExclusiones;
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
        modalGuia.scrollTop = 0;
        document.body.classList.add("modal-open");
        if (!indiceGuiaInicializado) inicializarIndiceGuia();
    }
}

function cerrarGuia() {
    if (modalGuia) {
        modalGuia.style.display = "none";
        // Si no hay otros modales abiertos, remover modal-open
        if (modalLectura.style.display !== "flex" && modalCalculadora.style.display !== "flex" && modalArticulo.style.display !== "flex") {
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

// --- ÍNDICE COMPLETO DE ARTÍCULOS Y REMISIONES EN LA GUÍA (760 ENTRADAS) ---
const inputBuscarIndiceGuia = document.getElementById("inputBuscarIndiceGuia");
const alfabetoIndiceGuia = document.getElementById("alfabetoIndiceGuia");
const statsIndiceGuia = document.getElementById("statsIndiceGuia");
const contenedorIndiceGuia = document.getElementById("contenedorIndiceGuia");

let letraSeleccionadaGuia = "";
let indiceGuiaInicializado = false;

function inicializarIndiceGuia() {
    if (!contenedorIndiceGuia || typeof INDICE_REMISIONES_DATA === 'undefined' || !INDICE_REMISIONES_DATA.listaCompleta) return;
    
    // 1. Construir barra de alfabeto dinámicamente
    if (alfabetoIndiceGuia && alfabetoIndiceGuia.children.length === 0) {
        const letrasDisponibles = new Set();
        INDICE_REMISIONES_DATA.listaCompleta.forEach(item => {
            if (item.letra) letrasDisponibles.add(item.letra);
        });

        const letrasOrdenadas = Array.from(letrasDisponibles).sort((a, b) => a.localeCompare(b, 'es'));
        
        let htmlAlfabeto = `<button class="btn-letra-guia active" data-letra="">Todas</button>`;
        letrasOrdenadas.forEach(letra => {
            htmlAlfabeto += `<button class="btn-letra-guia" data-letra="${letra}">${letra}</button>`;
        });
        alfabetoIndiceGuia.innerHTML = htmlAlfabeto;

        alfabetoIndiceGuia.querySelectorAll(".btn-letra-guia").forEach(btn => {
            btn.onclick = () => {
                alfabetoIndiceGuia.querySelectorAll(".btn-letra-guia").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                letraSeleccionadaGuia = btn.dataset.letra || "";
                renderizarIndiceGuia();
            };
        });
    }

    // 2. Listener de búsqueda en tiempo real
    if (inputBuscarIndiceGuia) {
        inputBuscarIndiceGuia.oninput = () => {
            renderizarIndiceGuia();
        };
    }

    renderizarIndiceGuia();
    indiceGuiaInicializado = true;
}

function verificarEstadoPalabra(palabra) {
    if (!palabra) return { existe: false, tipo: 'ninguno' };
    const pNorm = normalizar(palabra);
    
    // 1. ¿Existe en listaPrecat (las 148 palabras)?
    const itemPrecat = listaPrecat.find(p => normalizar(p.palabra) === pNorm || normalizar(p.vocabKey) === pNorm);
    if (itemPrecat) {
        return { existe: true, tipo: 'precat', item: itemPrecat, numPrecat: itemPrecat.numPrecat };
    }
    
    // 2. ¿Existe en listaTodas (las 289 palabras)?
    const itemTodas = listaTodas.find(p => normalizar(p.palabra) === pNorm || normalizar(p.vocabKey) === pNorm);
    if (itemTodas) {
        return { existe: true, tipo: 'todas', item: itemTodas, numPrecat: itemTodas.numPrecat };
    }
    
    return { existe: false, tipo: 'ninguno' };
}

function renderizarIndiceGuia() {
    if (!contenedorIndiceGuia || typeof INDICE_REMISIONES_DATA === 'undefined' || !INDICE_REMISIONES_DATA.listaCompleta) return;

    const query = inputBuscarIndiceGuia ? normalizar(inputBuscarIndiceGuia.value) : "";
    const items = INDICE_REMISIONES_DATA.listaCompleta;

    const filtrados = items.filter(item => {
        // Filtro por letra
        if (letraSeleccionadaGuia && item.letra !== letraSeleccionadaGuia) return false;

        // Filtro por búsqueda
        if (query.length > 0) {
            const matchTermino = item.terminoNorm.includes(query);
            const matchDestinos = item.destinos && item.destinos.some(d => normalizar(d).includes(query));
            const matchRaw = item.referenciasRaw && normalizar(item.referenciasRaw).includes(query);
            if (!matchTermino && !matchDestinos && !matchRaw) return false;
        }

        return true;
    });

    if (statsIndiceGuia) {
        statsIndiceGuia.textContent = `Mostrando ${filtrados.length} de ${items.length} términos`;
    }

    if (filtrados.length === 0) {
        contenedorIndiceGuia.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                No se encontraron términos en el índice para "${inputBuscarIndiceGuia.value}".
            </div>
        `;
        return;
    }

    let html = "";
    filtrados.forEach(item => {
        const esArticulo = item.tipo === 'ARTICULO_PRINCIPAL';
        const tieneDestinos = item.destinos && item.destinos.length > 0;

        html += `
            <div class="indice-item-row">
                <div class="indice-item-header">
                    <div class="indice-item-title ${esArticulo ? 'es-articulo' : ''}">
                        ${esArticulo ? '📖' : '🔄'} <strong>${item.termino}</strong>
                    </div>
                    <span class="badge-tipo-indice ${esArticulo ? 'badge-tipo-articulo' : 'badge-tipo-remision'}">
                        ${esArticulo ? 'Artículo Principal' : 'Remisión'}
                    </span>
                </div>
                ${tieneDestinos ? `
                    <div class="indice-item-destinos">
                        <span style="font-weight:600;">➔ ${esArticulo ? 'Temas conexos:' : 'Se prepara como:'}</span>
                        ${item.destinos.map(d => {
                            const est = verificarEstadoPalabra(d);
                            if (est.existe) {
                                if (est.tipo === 'precat') {
                                    return `<span class="chip-destino-guia chip-disponible-precat" title="Palabra oficial del Precatecumenado (#${est.numPrecat}). Toca para abrir y preparar." onclick="event.stopPropagation(); irAPalabraDesdeGuia('${d}', 'precat');">🟢 ${d} <span class="chip-num-badge">#${est.numPrecat}</span></span>`;
                                } else {
                                    return `<span class="chip-destino-guia chip-disponible-todas" title="Disponible en Vocabulario Completo de Léon-Dufour (289 temas). Toca para abrir." onclick="event.stopPropagation(); irAPalabraDesdeGuia('${d}', 'todas');">📘 ${d}</span>`;
                                }
                            } else {
                                return `<span class="chip-destino-guia chip-sin-referencia" title="Concepto bíblico sin ficha de preparación directa en la aplicación. Toca para ver información." onclick="event.stopPropagation(); alertarSinReferencia('${d}');">⚪ ${d} <span class="chip-sin-badge">Sin ficha</span></span>`;
                            }
                        }).join('')}
                    </div>
                ` : ''}
                ${item.referenciasRaw ? `
                    <div class="indice-item-raw">
                        Ref. Léon-Dufour: ${item.referenciasRaw}
                    </div>
                ` : ''}
            </div>
        `;
    });

    contenedorIndiceGuia.innerHTML = html;
}

function irAPalabraDesdeGuia(palabra, modoPreferido) {
    const estado = verificarEstadoPalabra(palabra);
    if (!estado.existe) {
        alertarSinReferencia(palabra);
        return;
    }

    cerrarGuia();

    // Si la palabra está en el vocabulario general (no precat), activar modo "todas"
    if (modoPreferido === 'todas' || (!estado.numPrecat && modoFiltro === 'precat')) {
        modoFiltro = "todas";
        if (btnModoTodas) btnModoTodas.classList.add("active");
        if (btnModoPrecat) btnModoPrecat.classList.remove("active");
        if (selectOrden.value === "precat") selectOrden.value = "alpha";
    }

    buscarTermino(palabra);
    mostrarToast(`Mostrando "${palabra}" en la lista`);
}

function alertarSinReferencia(palabra) {
    mostrarToast(`⚠️ "${palabra}" no tiene ficha directa de lecturas`);
    alert(`La palabra o concepto "${palabra}" es una referencia del índice analítico de Xavier Léon-Dufour, pero no cuenta con una ficha de preparación litúrgica directa en la lista de la aplicación.`);
}