// --- CONFIGURACIÓN ORDEN BÍBLICO ---
const ORDEN_BIBLICO = [
    "GEN", "EX", "LEV", "NUM", "DT", "JOS", "JUE", "RUT", "1SAM", "2SAM", "1RE", "2RE", "1CRO", "2CRO", "ESD", "NEH", "TOB", "JUD", "EST", "1MAC", "2MAC",
    "JOB", "SAL", "PROV", "ECL", "CANT", "SAB", "ECLO", "SIR", "IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL",
    "MT", "MC", "LC", "JN", "HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"
];
const mapOrdenBiblico = {};
ORDEN_BIBLICO.forEach((libro, i) => mapOrdenBiblico[libro] = i);
const getIndiceLibro = (l) => { if(!l) return 999; const k = l.toUpperCase().trim(); return mapOrdenBiblico[k]!==undefined?mapOrdenBiblico[k]:999; };

// --- VARIABLES ---
let listaGlobal = [];
let dbTextos = {}; 
let setExcluidos = new Set(JSON.parse(localStorage.getItem('palabrasExcluidas')) || []);
let setPalabrasExistentes = new Set();

// --- DOM ---
const tbody = document.querySelector("#tabla tbody");
const info = document.getElementById("info");
const inputExcluir = document.getElementById("inputExcluir");
const btnAgregar = document.getElementById("btnAgregar");
const contenedorTags = document.getElementById("contenedorTags");
const selectOrden = document.getElementById("selectOrden");
const checkEstricto = document.getElementById("checkEstricto");
const inputBusqueda = document.getElementById("inputBusqueda");
const panelControles = document.getElementById("panelControles");
const btnTogglePanel = document.getElementById("btnTogglePanel");

const modal = document.getElementById("modalLectura");
const modalTitulo = document.getElementById("modalTitulo");
const modalCuerpo = document.getElementById("modalTextoCuerpo");
const btnCerrar = document.querySelector(".close");

// --- UTILS ---
const normalizar = (s) => (!s?"":s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());

function ordenarCitasAsc(citas) {
    if (!citas || citas.length === 0) return [];
    return [...citas].sort((a, b) => {
        const idxA = getIndiceLibro(a.libro);
        const idxB = getIndiceLibro(b.libro);
        if (idxA !== idxB) return idxA - idxB;
        const capA = parseInt(a.capitulo) || 0;
        const capB = parseInt(b.capitulo) || 0;
        if (capA !== capB) return capA - capB;
        const verA = parseInt(a.versiculoInicio) || 0;
        const verB = parseInt(b.versiculoInicio) || 0;
        return verA - verB;
    });
}

function obtenerRango(cita) {
    let inicio = parseInt(cita.versiculoInicio);
    let fin = parseInt(cita.versiculoFin);
    if (!inicio) return { start: 0, end: 9999, esCompleto: true };
    if (cita.continuidad === 's') fin = inicio + 1;
    else if (cita.continuidad === 'ss') fin = 9999;
    else if (!fin) fin = inicio;
    return { start: inicio, end: fin };
}

function filtrarRedundancias(citas) {
    if (!citas || citas.length < 2) return citas;
    let grupos = {};
    citas.forEach(c => { const key = `${c.libro}-${c.capitulo}`; if (!grupos[key]) grupos[key] = []; grupos[key].push(c); });
    let resultado = [];
    Object.values(grupos).forEach(grupo => {
        const capCompleto = grupo.find(c => !c.versiculoInicio);
        if (capCompleto) resultado.push(capCompleto);
        else {
            let aBorrar = new Set();
            for (let i = 0; i < grupo.length; i++) {
                const rA = obtenerRango(grupo[i]);
                for (let j = 0; j < grupo.length; j++) {
                    if (i === j) continue; if (aBorrar.has(j)) continue;
                    const rB = obtenerRango(grupo[j]);
                    if (rA.start <= rB.start && rA.end >= rB.end) {
                        if (rA.start === rB.start && rA.end === rB.end && i > j) continue;
                        aBorrar.add(j);
                    }
                }
            }
            grupo.forEach((c, idx) => { if (!aBorrar.has(idx)) resultado.push(c); });
        }
    });
    return resultado;
}

// --- FETCH ---
fetch("zguerras_completo.json")
    .then(r => r.json())
    .then(data => {
        dbTextos = data.textos || {};
        let rawList = Object.values(data.palabras);
        rawList.sort((a, b) => a.palabra.localeCompare(b.palabra, 'es', { sensitivity: 'base' }));

        listaGlobal = rawList.map((p, index) => {
            const pNorm = normalizar(p.palabra);
            setPalabrasExistentes.add(pNorm);
            const l = p.lecturas;
            return {
                idOriginal: index + 1,
                palabra: p.palabra,
                palabraNorm: pNorm,
                lecturas: l, 
                estaOrdenado: false, 
                estaLimpio: false,
                total: (l.Historicos?.length||0) + (l.Profeticos?.length||0) + (l["Nuevo Testamento"]?.length||0) + (l.Evangelio?.length||0),
                hist: l.Historicos?.length||0, 
                prof: l.Profeticos?.length||0, 
                nt: l["Nuevo Testamento"]?.length||0, 
                ev: l.Evangelio?.length||0
            };
        });
        setExcluidos.forEach(excl => { if (!setPalabrasExistentes.has(excl)) setExcluidos.delete(excl); });
        guardarLocalStorage();
        renderizarTags(); 
        actualizarTabla(); 
    }).catch(err => console.error(err));

// --- RENDERIZADO GRID ---
function renderizarGridDetalle(item, divGrid, statsRow) {
    divGrid.innerHTML = "";
    statsRow.innerHTML = ""; 

    const procesar = (lista) => {
        let res = lista ? [...lista] : [];
        if (item.estaLimpio) res = filtrarRedundancias(res);
        if (item.estaOrdenado) res = ordenarCitasAsc(res);
        return res;
    };

    const datos = {
        Hist: procesar(item.lecturas.Historicos),
        Prof: procesar(item.lecturas.Profeticos),
        NT: procesar(item.lecturas["Nuevo Testamento"]),
        Ev: procesar(item.lecturas.Evangelio)
    };

    // --- 1. FILA DE ESTADÍSTICAS Y BOTONES ---
    
    // Columna 1 (ID): vacía
    statsRow.appendChild(document.createElement("div"));

    // Columna 2 (Palabra): BOTONES DE CONTROL
    const divControles = document.createElement("div");
    divControles.className = "stats-controls";
    
    const btnOrd = document.createElement("button");
    btnOrd.className = item.estaOrdenado ? "btn-mini btn-ordenar active" : "btn-mini btn-ordenar";
    btnOrd.textContent = item.estaOrdenado ? "Original" : "Ordenar";
    btnOrd.onclick = (e) => { e.stopPropagation(); toggleOrden(item, divGrid, statsRow); };

    const btnLim = document.createElement("button");
    btnLim.className = item.estaLimpio ? "btn-mini btn-limpiar active" : "btn-mini btn-limpiar";
    btnLim.textContent = item.estaLimpio ? "Ver Todo" : "Limpiar";
    btnLim.onclick = (e) => { e.stopPropagation(); toggleLimpieza(item, divGrid, statsRow); };
    
    divControles.appendChild(btnOrd);
    divControles.appendChild(btnLim);
    statsRow.appendChild(divControles);

    // Columnas 3-7: Contadores Centrados
    const crearStat = (actual, original, col) => {
        const div = document.createElement("div");
        div.className = "stat-cell";
        div.style.gridColumn = col;
        
        const diff = actual - original;
        let html = `<span class="stat-val">${actual}</span>`;
        if (diff !== 0) {
            html += `<span class="stat-diff">${diff}</span>`; // Muestra diferencia en rojo
        }
        div.innerHTML = html;
        statsRow.appendChild(div);
    };

    const tAct = datos.Hist.length + datos.Prof.length + datos.NT.length + datos.Ev.length;
    crearStat(tAct, item.total, 3);
    crearStat(datos.Hist.length, item.hist, 4);
    crearStat(datos.Prof.length, item.prof, 5);
    crearStat(datos.NT.length, item.nt, 6);
    crearStat(datos.Ev.length, item.ev, 7);

    // --- 2. GRID DE CITAS ---
    // Columna 1-3 vacías en el grid de citas
    divGrid.appendChild(document.createElement("div")); // Col 1
    divGrid.appendChild(document.createElement("div")); // Col 2
    divGrid.appendChild(document.createElement("div")); // Col 3

    divGrid.appendChild(crearColumnaCitas(datos.Hist, "pos-hist"));
    divGrid.appendChild(crearColumnaCitas(datos.Prof, "pos-prof"));
    divGrid.appendChild(crearColumnaCitas(datos.NT, "pos-nt"));
    divGrid.appendChild(crearColumnaCitas(datos.Ev, "pos-ev"));
}

function toggleOrden(item, divGrid, statsRow) {
    item.estaOrdenado = !item.estaOrdenado;
    renderizarGridDetalle(item, divGrid, statsRow);
}

function toggleLimpieza(item, divGrid, statsRow) {
    item.estaLimpio = !item.estaLimpio;
    renderizarGridDetalle(item, divGrid, statsRow);
}

// --- COLLAPSE ---
btnTogglePanel.onclick = () => {
    panelControles.classList.toggle("collapsed");
    const cerrado = panelControles.classList.contains("collapsed");
    btnTogglePanel.textContent = cerrado ? "🔽 Mostrar Filtros" : "🔼 Ocultar Filtros";
};

// --- RESTO IGUAL ---
function agregarExclusiones() {
    const texto = inputExcluir.value;
    if (!texto) return;
    const nuevas = texto.split(',').map(t => normalizar(t)).filter(t => t.length > 0);
    let invalidas = []; let cambios = false;
    nuevas.forEach(palabra => {
        if (setPalabrasExistentes.has(palabra)) {
            if (!setExcluidos.has(palabra)) { setExcluidos.add(palabra); cambios = true; }
        } else { invalidas.push(palabra); }
    });
    if (invalidas.length > 0) alert(`No existen:\n- ${invalidas.join("\n- ")}`);
    inputExcluir.value = "";
    if (cambios) guardarYActualizar();
}
function eliminarExclusion(p) { setExcluidos.delete(p); guardarYActualizar(); }
function guardarLocalStorage() { localStorage.setItem('palabrasExcluidas', JSON.stringify([...setExcluidos])); }
function guardarYActualizar() { guardarLocalStorage(); renderizarTags(); actualizarTabla(); }
function renderizarTags() {
    contenedorTags.innerHTML = "";
    if (setExcluidos.size === 0) { contenedorTags.innerHTML = '<span class="sin-exclusiones">Sin exclusiones.</span>'; return; }
    setExcluidos.forEach(p => {
        const tag = document.createElement("div");
        tag.className = "tag-excluido";
        tag.innerHTML = `${p} <span>&times;</span>`;
        tag.querySelector("span").onclick = () => eliminarExclusion(p);
        contenedorTags.appendChild(tag);
    });
}
btnAgregar.addEventListener("click", agregarExclusiones);
inputExcluir.addEventListener("keydown", (e) => { if (e.key === "Enter") agregarExclusiones(); });

function actualizarTabla() {
    const modoEstricto = checkEstricto.checked;
    const orden = selectOrden.value;
    const textoBusqueda = normalizar(inputBusqueda.value);

    let lista = listaGlobal.filter(item => {
        if (setExcluidos.has(item.palabraNorm)) return false;
        if (modoEstricto && (item.hist === 0 || item.prof === 0 || item.nt === 0 || item.ev === 0)) return false; 
        if (textoBusqueda.length > 0 && !item.palabraNorm.includes(textoBusqueda)) return false;
        return true;
    });

    lista.sort((a, b) => {
        if (orden === 'alpha') return a.idOriginal - b.idOriginal;
        if (orden === 'asc') return a.total - b.total;
        if (orden === 'desc') return b.total - a.total;
        return 0;
    });

    info.textContent = `Viendo ${lista.length} de ${listaGlobal.length}`;
    dibujarTabla(lista);
}

function dibujarTabla(lista) {
    tbody.innerHTML = "";
    lista.forEach(item => {
        const trMain = document.createElement("tr");
        trMain.className = "fila-principal";
        trMain.innerHTML = `
            <td class="td-center w-id">${item.idOriginal}</td>
            <td class="td-left w-palabra">${item.palabra} <small style="color:#aaa">▼</small></td>
            <td class="td-center w-total td-number">${item.total}</td>
            <td class="td-center w-cat">${item.hist || '<span style="color:#ddd">-</span>'}</td>
            <td class="td-center w-cat">${item.prof || '<span style="color:#ddd">-</span>'}</td>
            <td class="td-center w-cat">${item.nt || '<span style="color:#ddd">-</span>'}</td>
            <td class="td-center w-cat">${item.ev || '<span style="color:#ddd">-</span>'}</td>
        `;

        const trDetail = document.createElement("tr");
        trDetail.className = "fila-detalle";
        const tdDetail = document.createElement("td");
        tdDetail.colSpan = 7; 
        tdDetail.className = "celda-detalle";

        const statsRow = document.createElement("div");
        statsRow.className = "stats-row grid-aligned"; // Aplicamos grid alineado

        const divGrid = document.createElement("div");
        divGrid.className = "grid-citas-container grid-aligned"; // Aplicamos grid alineado
        
        renderizarGridDetalle(item, divGrid, statsRow);

        tdDetail.appendChild(statsRow);
        tdDetail.appendChild(divGrid);
        trDetail.appendChild(tdDetail);
        
        trMain.addEventListener("click", () => {
            const abierto = trDetail.style.display === "table-row";
            if (abierto) { trDetail.style.display = "none"; trMain.classList.remove("activa"); }
            else { trDetail.style.display = "table-row"; trMain.classList.add("activa"); }
        });

        tbody.appendChild(trMain);
        tbody.appendChild(trDetail);
    });
}

function crearColumnaCitas(arrayCitas, clasePosicion) {
    const divCol = document.createElement("div");
    divCol.className = `grupo-citas ${clasePosicion}`; // border-left incluído aquí
    if (arrayCitas && arrayCitas.length > 0) {
        arrayCitas.forEach(cita => {
            const btn = document.createElement("button");
            btn.className = "btn-cita";
            btn.textContent = cita.citaOriginal || `${cita.libro} ${cita.capitulo},${cita.versiculoInicio}`;
            btn.title = btn.textContent;
            btn.onclick = (e) => { e.stopPropagation(); abrirModal(cita); };
            divCol.appendChild(btn);
        });
    }
    return divCol;
}

function abrirModal(citaObj) {
    const ref = citaObj.textoRef;
    const textoHTML = dbTextos[ref];
    modalTitulo.textContent = `Lectura: ${citaObj.citaOriginal || ref}`;
    modalCuerpo.innerHTML = textoHTML ? textoHTML : `<p style="color:red">Texto no encontrado: <strong>${ref}</strong></p>`;
    modal.style.display = "block";
}
btnCerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

selectOrden.addEventListener("change", actualizarTabla);
checkEstricto.addEventListener("change", actualizarTabla);
inputBusqueda.addEventListener("input", actualizarTabla);