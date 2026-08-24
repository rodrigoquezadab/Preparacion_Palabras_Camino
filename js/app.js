// ==========================================================================
// PREPARACIÓN DE PALABRAS DEL CAMINO NEOCATECUMENAL
// Basado en el Vocabulario de Teología Bíblica de Xavier Léon-Dufour
// ==========================================================================

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

// --- VARIABLES GLOBALES DE ESTADO ---
let listaGlobal = [];
let dbTextos = {};
let setExcluidos = new Set(JSON.parse(localStorage.getItem('palabrasExcluidas')) || []);
let setPalabrasExistentes = new Set();
let palabraAbiertaId = null;

// Estado de la Calculadora de Participantes
let palabraCalculadoraActual = null;
let numParticipantesActual = 4;

// --- ELEMENTOS DEL DOM ---
const contenedorLista = document.getElementById("contenedorPalabras");
const infoStats = document.getElementById("infoStats");
const inputBusqueda = document.getElementById("inputBusqueda");
const selectOrden = document.getElementById("selectOrden");
const checkEstricto = document.getElementById("checkEstricto");
const checkExtras = document.getElementById("checkExtras");
const inputExcluir = document.getElementById("inputExcluir");
const btnAgregarExclusion = document.getElementById("btnAgregarExclusion");
const contenedorTags = document.getElementById("contenedorTags");
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
const calcCheckExtras = document.getElementById("calcCheckExtras");
const calcSummaryText = document.getElementById("calcSummaryText");
const contenedorHermanos = document.getElementById("contenedorHermanos");
const btnCopiarRepartoCompleto = document.getElementById("btnCopiarRepartoCompleto");

// Toast de notificación
const toast = document.getElementById("toast");

// --- UTILIDADES ---
const normalizar = (s) => (!s ? "" : s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());

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

// --- CARGA DE DATOS ---
fetch("palabras.json")
    .then(r => {
        if (!r.ok) throw new Error("No se pudo cargar palabras.json");
        return r.json();
    })
    .then(data => {
        dbTextos = data.textos || {};
        let rawList = Object.values(data.palabras);
        rawList.sort((a, b) => a.palabra.localeCompare(b.palabra, 'es', { sensitivity: 'base' }));

        listaGlobal = rawList.map((p, index) => {
            const pNorm = normalizar(p.palabra);
            setPalabrasExistentes.add(pNorm);
            const l = p.lecturas || {};
            
            const hist = l.Historicos || [];
            const prof = l.Profeticos || [];
            const nt = l["Nuevo Testamento"] || [];
            const ev = l.Evangelio || [];
            const sal = l.Salmos || [];
            const sap = l.Sapienciales || [];

            const totalBase = hist.length + prof.length + nt.length + ev.length;
            const cumple4Partes = (hist.length > 0 && prof.length > 0 && nt.length > 0 && ev.length > 0);

            return {
                id: index + 1,
                palabra: p.palabra,
                palabraNorm: pNorm,
                lecturas: l,
                estaOrdenado: true,
                estaUnido: true, // Por defecto unificamos pericopas contiguas para facilitar la preparación
                cumple4Partes: cumple4Partes,
                total: totalBase,
                totalConExtras: totalBase + sal.length + sap.length,
                hist: hist.length,
                prof: prof.length,
                nt: nt.length,
                ev: ev.length,
                sal: sal.length,
                sap: sap.length
            };
        });

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
    const modoEstricto = checkEstricto.checked;
    const mostrarExtras = checkExtras.checked;
    const orden = selectOrden.value;
    const busqueda = normalizar(inputBusqueda.value);

    let lista = listaGlobal.filter(item => {
        if (setExcluidos.has(item.palabraNorm)) return false;
        if (modoEstricto && !item.cumple4Partes) return false;
        if (busqueda.length > 0 && !item.palabraNorm.includes(busqueda)) return false;
        return true;
    });

    lista.sort((a, b) => {
        if (orden === 'alpha') return a.palabra.localeCompare(b.palabra, 'es');
        if (orden === 'asc') return a.total - b.total;
        if (orden === 'desc') return b.total - a.total;
        if (orden === 'hist') return b.hist - a.hist;
        if (orden === 'prof') return b.prof - a.prof;
        if (orden === 'nt') return b.nt - a.nt;
        if (orden === 'ev') return b.ev - a.ev;
        return 0;
    });

    const aptasCount = listaGlobal.filter(i => i.cumple4Partes && !setExcluidos.has(i.palabraNorm)).length;
    infoStats.innerHTML = `Mostrando <strong>${lista.length}</strong> de ${listaGlobal.length} palabras <span class="badge-apta-count" title="Palabras que cumplen el criterio litúrgico de las 4 partes">(${aptasCount} aptas para liturgia)</span>`;

    dibujarLista(lista, mostrarExtras);
}

function dibujarLista(lista, mostrarExtras) {
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
        const card = document.createElement("article");
        card.className = `word-card ${item.cumple4Partes ? 'card-cumple' : 'card-incompleta'}`;
        card.id = `card-${item.id}`;

        const procesar = (citas) => {
            let res = citas ? [...citas] : [];
            if (item.estaUnido) res = unirSegmentosContiguos(res);
            else if (item.estaOrdenado) res = ordenarCitasAsc(res);
            return res;
        };

        const lecturasActuales = {
            Hist: procesar(item.lecturas.Historicos),
            Prof: procesar(item.lecturas.Profeticos),
            NT: procesar(item.lecturas["Nuevo Testamento"]),
            Ev: procesar(item.lecturas.Evangelio),
            Sal: procesar(item.lecturas.Salmos),
            Sap: procesar(item.lecturas.Sapienciales)
        };

        const totalUnido = lecturasActuales.Hist.length + lecturasActuales.Prof.length + lecturasActuales.NT.length + lecturasActuales.Ev.length;
        const diffTotal = totalUnido - item.total;

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
            <span class="word-number">#${item.id}</span>
            <h2 class="word-name">${item.palabra}</h2>
        `;

        const badgeCriterio = document.createElement("div");
        if (item.cumple4Partes) {
            badgeCriterio.className = "badge-criterio badge-apta";
            badgeCriterio.setAttribute("title", "Apta para Preparación Litúrgica: Posee citas en Históricos, Proféticos, Cartas/NT y Evangelios.");
            badgeCriterio.innerHTML = `✨ Apta 4 Partes`;
        } else {
            const faltantes = [];
            if (item.hist === 0) faltantes.push("Hist");
            if (item.prof === 0) faltantes.push("Prof");
            if (item.nt === 0) faltantes.push("NT");
            if (item.ev === 0) faltantes.push("Ev");
            badgeCriterio.className = "badge-criterio badge-incompleta";
            badgeCriterio.setAttribute("title", `Incompleta para 4 partes. Faltan: ${faltantes.join(", ")}`);
            badgeCriterio.innerHTML = `⚠️ Falta: ${faltantes.join(", ")}`;
        }

        titleRow.appendChild(titleDiv);
        titleRow.appendChild(badgeCriterio);
        header.appendChild(titleRow);

        // Fila de resumen de conteos por categoría (Pastillas interactivas)
        const countsRow = document.createElement("div");
        countsRow.className = "word-counts-row";
        
        const tooltipTotal = `Total actual: ${totalUnido} perícopas. ${diffTotal !== 0 ? `El (${diffTotal}) indica que se han consolidado ${Math.abs(diffTotal)} citas contiguas de las ${item.total} originales de Léon-Dufour.` : `Total de citas originales: ${item.total}`}`;

        countsRow.innerHTML = `
            <span class="count-pill total-pill" title="${tooltipTotal}">
              ${totalUnido} ${diffTotal !== 0 ? `<small class="diff-tag">(${diffTotal})</small>` : ''} perícopas
            </span>
            <span class="count-pill cat-hist ${item.hist === 0 ? 'zero' : ''}" title="Históricos / Torá: ${item.hist} citas">${item.hist} Hist</span>
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
            dibujarLista(lista, mostrarExtras);
        };

        // Botón Copiar Perícopas
        const btnCopiar = document.createElement("button");
        btnCopiar.className = "btn-action btn-copiar";
        btnCopiar.setAttribute("title", "Copia al portapapeles todas las citas organizadas de esta palabra para compartir en la preparación.");
        btnCopiar.innerHTML = `📋 Copiar Esquema`;
        btnCopiar.onclick = (e) => {
            e.stopPropagation();
            copiarEsquemaPalabra(item, lecturasActuales, mostrarExtras);
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

        actionsBar.appendChild(btnCalc);
        actionsBar.appendChild(btnUnir);
        actionsBar.appendChild(btnCopiar);
        actionsBar.appendChild(btnExcluir);
        body.appendChild(actionsBar);

        // Contenedor de columnas / bloques por categoría
        const categoriesContainer = document.createElement("div");
        categoriesContainer.className = "categories-grid";

        // Bloques de las 4 partes fundamentales
        categoriesContainer.appendChild(crearBloqueCategoria("1. Históricos (Torá)", lecturasActuales.Hist, "cat-hist", "Lectura de la Torá / Libros Históricos del AT"));
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
function copiarEsquemaPalabra(item, lecturas, mostrarExtras) {
    const formatearCitas = (lista) => {
        if (!lista || lista.length === 0) return "  (Ninguna)";
        return lista.map(c => `  • ${c.citaOriginal}`).join("\n");
    };

    let texto = `📖 PREPARACIÓN DE LA PALABRA: "${item.palabra.toUpperCase()}"\n`;
    texto += `Vocabulario de Teología Bíblica de Xavier Léon-Dufour\n`;
    texto += `--------------------------------------------------\n\n`;
    
    texto += `1. HISTÓRICOS (Torá):\n${formatearCitas(lecturas.Hist)}\n\n`;
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

function calcularDistribucionLineal(citas, k) {
    if (!citas || citas.length === 0) return [];
    const ordenadas = ordenarCitasAsc(citas);
    const n = ordenadas.length;
    const numPart = Math.max(1, Math.min(k, n));

    // Ponderación precisa basada en caracteres reales de los textos bíblicos
    const weights = ordenadas.map(c => calcularCaracteresCita(c));
    const totalCharsGeneral = weights.reduce((a, b) => a + b, 0);
    const targetPerPerson = totalCharsGeneral / numPart;

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

    const partitions = [];
    let startIdx = 0;

    for (let p = 0; p < numPart; p++) {
        if (p === numPart - 1) {
            const slice = ordenadas.slice(startIdx);
            const sliceChars = slice.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);
            partitions.push({
                hermano: p + 1,
                citas: slice,
                rango: obtenerRangoLibros(slice),
                totalCitas: slice.length,
                totalCaracteres: sliceChars,
                porcentaje: totalCharsGeneral > 0 ? Math.round((sliceChars / totalCharsGeneral) * 100) : 0
            });
            break;
        }

        const remainingPersons = numPart - p - 1;
        const maxIdx = n - remainingPersons;

        let accum = 0;
        let bestIdx = startIdx + 1;
        let bestDiff = Infinity;

        for (let i = startIdx; i < maxIdx; i++) {
            accum += weights[i];
            const diff = Math.abs(accum - targetPerPerson);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestIdx = i + 1;
            }
        }

        const slice = ordenadas.slice(startIdx, bestIdx);
        const sliceChars = slice.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);
        partitions.push({
            hermano: p + 1,
            citas: slice,
            rango: obtenerRangoLibros(slice),
            totalCitas: slice.length,
            totalCaracteres: sliceChars,
            porcentaje: totalCharsGeneral > 0 ? Math.round((sliceChars / totalCharsGeneral) * 100) : 0
        });
        startIdx = bestIdx;
    }

    return partitions;
}

function abrirCalculadora(item) {
    palabraCalculadoraActual = item;
    calcModalTitulo.textContent = `👥 Preparación: "${item.palabra.toUpperCase()}"`;
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

    // Recolectar citas de la palabra según filtros de la calculadora
    let citasAConsolidar = [];
    const procesar = (arr) => {
        if (!arr) return [];
        return usarUnidas ? unirSegmentosContiguos(arr) : arr;
    };

    citasAConsolidar.push(...procesar(item.lecturas.Historicos));
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

    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual);
    const promedioChars = Math.round(totalCharsGeneral / Math.max(1, particiones.length));

    // Banner de optimización y transparencia
    calcSummaryText.textContent = `Búsqueda lineal equilibrada (~${promedioChars.toLocaleString()} caracteres por hermano): la cantidad de lecturas varía según la extensión de cada pasaje para repartir equitativamente el tiempo de preparación.`;

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

    let citasAConsolidar = [];
    const procesar = (arr) => (usarUnidas ? unirSegmentosContiguos(arr) : arr || []);

    citasAConsolidar.push(...procesar(item.lecturas.Historicos));
    citasAConsolidar.push(...procesar(item.lecturas.Profeticos));
    citasAConsolidar.push(...procesar(item.lecturas["Nuevo Testamento"]));
    citasAConsolidar.push(...procesar(item.lecturas.Evangelio));

    if (incluirExtras) {
        citasAConsolidar.push(...procesar(item.lecturas.Salmos));
        citasAConsolidar.push(...procesar(item.lecturas.Sapienciales));
    }

    const citasFinales = ordenarCitasAsc(citasAConsolidar);
    const totalCharsGeneral = citasFinales.reduce((sum, c) => sum + calcularCaracteresCita(c), 0);
    const particiones = calcularDistribucionLineal(citasFinales, numParticipantesActual);

    let msg = `📖 *REPARTO DE LECTURAS PARA LA PREPARACIÓN*\n`;
    msg += `Palabra: *"${item.palabra.toUpperCase()}"* (Léon-Dufour)\n`;
    msg += `👥 ${numParticipantesActual} Participantes | ${citasFinales.length} lecturas (~${totalCharsGeneral.toLocaleString()} caracteres en total)\n`;
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
    msg += `Distribución lineal equilibrada en caracteres. Cada hermano avanza en su Biblia sin retroceder.`;

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
calcCheckExtras.onchange = renderizarCalculadora;
btnCerrarCalcModal.onclick = cerrarCalculadora;
btnCerrarCalcModalBottom.onclick = cerrarCalculadora;
btnCopiarRepartoCompleto.onclick = copiarRepartoCompleto;

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
}

function formatearTextoConResaltado(html, cita) {
    if (!cita.versiculoInicio) return html;

    const start = parseInt(cita.versiculoInicio, 10);
    const end = cita.versiculoFin ? parseInt(cita.versiculoFin, 10) : (cita.continuidad === 's' ? start + 1 : (cita.continuidad === 'ss' ? 9999 : start));

    return html.replace(/<strong>(\d+)<\/strong>([^<]*)/g, (match, vNum, vContent) => {
        const num = parseInt(vNum, 10);
        if (num >= start && num <= end) {
            return `<mark class="highlighted-verse"><strong>${vNum}</strong>${vContent}</mark>`;
        }
        return `<strong>${vNum}</strong>${vContent}`;
    });
}

function cerrarModal() {
    modalLectura.style.display = "none";
    // Si el modal de la calculadora estaba abierto, mantener modal-open
    if (modalCalculadora.style.display !== "flex") {
        document.body.classList.remove("modal-open");
    }
    citaModalActual = null;
}

btnCerrarModal.onclick = cerrarModal;
window.onclick = (e) => {
    if (e.target === modalLectura) cerrarModal();
    if (e.target === modalCalculadora) cerrarCalculadora();
};

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
}

function renderizarTags() {
    contenedorTags.innerHTML = "";
    if (setExcluidos.size === 0) {
        contenedorTags.innerHTML = `<span class="sin-exclusiones">Sin palabras excluidas.</span>`;
        return;
    }

    setExcluidos.forEach(pNorm => {
        const item = listaGlobal.find(i => i.palabraNorm === pNorm);
        const nombreOriginal = item ? item.palabra : pNorm;

        const tag = document.createElement("div");
        tag.className = "tag-excluido";
        tag.setAttribute("title", `Toca la '×' para quitar la exclusión de "${nombreOriginal}"`);
        tag.innerHTML = `<span>${nombreOriginal}</span> <button class="btn-remove-tag" aria-label="Quitar exclusión">&times;</button>`;
        tag.querySelector("button").onclick = () => eliminarExclusion(pNorm, nombreOriginal);
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

btnAgregarExclusion.addEventListener("click", agregarExclusiones);
inputExcluir.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarExclusiones();
});

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
    if (e.target === modalLectura) cerrarModal();
    if (e.target === modalCalculadora) cerrarCalculadora();
    if (e.target === modalGuia) cerrarGuia();
});

// --- TOGGLE PANEL DE FILTROS ---
if (btnToggleFiltros) {
    btnToggleFiltros.onclick = () => {
        panelFiltros.classList.toggle("collapsed");
        const abierto = !panelFiltros.classList.contains("collapsed");
        btnToggleFiltros.classList.toggle("active", abierto);
        btnToggleFiltros.setAttribute("title", abierto ? "Toca para ocultar filtros avanzados" : "Toca para mostrar filtros avanzados");
    };
}

// --- LISTENERS DE FILTROS Y BÚSQUEDA ---
inputBusqueda.addEventListener("input", actualizarVista);
selectOrden.addEventListener("change", actualizarVista);
checkEstricto.addEventListener("change", actualizarVista);
checkExtras.addEventListener("change", actualizarVista);