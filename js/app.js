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
const checkExtras = document.getElementById("checkExtras"); // NUEVO
const inputBusqueda = document.getElementById("inputBusqueda");
const panelControles = document.getElementById("panelControles");
const btnTogglePanel = document.getElementById("btnTogglePanel");
const tableContainer = document.getElementById("tableContainer"); // Para clase CSS dinámica

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
fetch("palabras.json") 
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
                // Totales
                total: (l.Historicos?.length||0) + (l.Profeticos?.length||0) + (l["Nuevo Testamento"]?.length||0) + (l.Evangelio?.length||0),
                hist: l.Historicos?.length||0, 
                prof: l.Profeticos?.length||0, 
                nt: l["Nuevo Testamento"]?.length||0, 
                ev: l.Evangelio?.length||0,
                // Extras
                sal: l.Salmos?.length||0,
                sap: l.Sapienciales?.length||0
            };
        });
        setExcluidos.forEach(excl => { if (!setPalabrasExistentes.has(excl)) setExcluidos.delete(excl); });
        guardarLocalStorage();
        renderizarTags(); 
        actualizarTabla(); 
    }).catch(err => console.error(err));

// --- RENDERIZADO GRID DETALLE ---
function renderizarGridDetalle(item, containerCell) {
    containerCell.innerHTML = ""; 

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
        Ev: procesar(item.lecturas.Evangelio),
        // Extras
        Sal: procesar(item.lecturas.Salmos),
        Sap: procesar(item.lecturas.Sapienciales)
    };

    // Calculamos totales actuales para estadísticas
    const tAct = datos.Hist.length + datos.Prof.length + datos.NT.length + datos.Ev.length; 
    // Nota: El total 'item.total' es solo de los 4 grupos base, mantenemos consistencia en comparación
    
    const diff = tAct - item.total;

    // --- A. VISTA ESCRITORIO ---
    const divDesktop = document.createElement("div");
    divDesktop.className = "desktop-detail-view";

    // 1. Stats Row
    const statsRow = document.createElement("div");
    statsRow.className = "stats-row-desktop grid-aligned"; // Aplicamos grid
    
    statsRow.appendChild(document.createElement("div")); // Col 1
    
    // Controles
    const ctrlDesktop = document.createElement("div");
    ctrlDesktop.className = "stats-controls-desktop";
    ctrlDesktop.appendChild(crearBtnAccion("Ordenar", item.estaOrdenado, "btn-ordenar", () => {
        item.estaOrdenado = !item.estaOrdenado; renderizarGridDetalle(item, containerCell);
    }));
    ctrlDesktop.appendChild(crearBtnAccion("Limpiar", item.estaLimpio, "btn-limpiar", () => {
        item.estaLimpio = !item.estaLimpio; renderizarGridDetalle(item, containerCell);
    }));
    statsRow.appendChild(ctrlDesktop); // Col 2

    // Stats Base
    statsRow.appendChild(createStatCell(tAct, item.total));
    statsRow.appendChild(createStatCell(datos.Hist.length, item.hist));
    statsRow.appendChild(createStatCell(datos.Prof.length, item.prof));
    statsRow.appendChild(createStatCell(datos.NT.length, item.nt));
    statsRow.appendChild(createStatCell(datos.Ev.length, item.ev));
    
    // Stats Extras (Solo visibles si .show-extras está activo en CSS)
    const statSal = createStatCell(datos.Sal.length, item.sal);
    statSal.className += " cell-extra"; // Clase para togglear
    statsRow.appendChild(statSal);

    const statSap = createStatCell(datos.Sap.length, item.sap);
    statSap.className += " cell-extra";
    statsRow.appendChild(statSap);


    // 2. Grid Citas
    const gridCitas = document.createElement("div");
    gridCitas.className = "grid-detalle-desktop grid-aligned";
    
    // Espaciadores Col 1,2,3
    gridCitas.appendChild(document.createElement("div")); 
    gridCitas.appendChild(document.createElement("div")); 
    gridCitas.appendChild(document.createElement("div")); 
    
    // Columnas Base
    gridCitas.appendChild(crearColumnaCitas(datos.Hist, "pos-sep"));
    gridCitas.appendChild(crearColumnaCitas(datos.Prof, "pos-sep"));
    gridCitas.appendChild(crearColumnaCitas(datos.NT, "pos-sep"));
    gridCitas.appendChild(crearColumnaCitas(datos.Ev, "pos-sep"));
    
    // Columnas Extras
    const colSal = crearColumnaCitas(datos.Sal, "pos-sep cell-extra");
    gridCitas.appendChild(colSal);
    const colSap = crearColumnaCitas(datos.Sap, "pos-sep cell-extra");
    gridCitas.appendChild(colSap);

    divDesktop.appendChild(statsRow);
    divDesktop.appendChild(gridCitas);


    // --- B. VISTA MÓVIL ---
    const divMobile = document.createElement("div");
    divMobile.className = "mobile-detail-view";

    // 1. Controles
    const mobControls = document.createElement("div");
    mobControls.className = "mob-controls-row";
    
    const divMobBtns = document.createElement("div");
    divMobBtns.style.display = "flex"; divMobBtns.style.gap = "10px";
    divMobBtns.appendChild(crearBtnAccion("Ordenar", item.estaOrdenado, "btn-ordenar", () => {
        item.estaOrdenado = !item.estaOrdenado; renderizarGridDetalle(item, containerCell);
    }));
    divMobBtns.appendChild(crearBtnAccion("Limpiar", item.estaLimpio, "btn-limpiar", () => {
        item.estaLimpio = !item.estaLimpio; renderizarGridDetalle(item, containerCell);
    }));

    // Contador Móvil
    const mobTotalDiv = document.createElement("div");
    mobTotalDiv.className = "mob-total-display";
    let txtDiff = diff !== 0 ? ` <span class="mob-diff-tag">${diff}</span>` : "";
    // Nota: Aquí se muestra el total de los 4 grupos base para mantener consistencia con la fila principal
    mobTotalDiv.innerHTML = `Total Var: <span class="mob-total-big">${tAct}</span>${txtDiff}`;

    mobControls.appendChild(divMobBtns);
    mobControls.appendChild(mobTotalDiv);
    divMobile.appendChild(mobControls);

    // 2. Tarjetas
    const mobCards = document.createElement("div");
    mobCards.className = "mob-cards-container";

    const addMobCard = (titulo, original, lista) => {
        const card = document.createElement("div");
        card.className = "mob-card";
        const header = document.createElement("div");
        header.className = "mob-card-header";
        
        const spanTitle = document.createElement("span");
        spanTitle.textContent = titulo;
        
        // Formato: Orig [Diff]
        const diffLocal = lista.length - original;
        let diffLocalHtml = diffLocal !== 0 ? ` <span class="mob-diff-tag">${diffLocal}</span>` : "";
        
        const spanCounts = document.createElement("span");
        spanCounts.className = "mob-counters";
        spanCounts.innerHTML = `Total: <span class="mob-num-orig">${original}</span>${diffLocalHtml}`;
        
        header.appendChild(spanTitle);
        header.appendChild(spanCounts);
        
        const body = document.createElement("div");
        body.className = "mob-card-body";
        
        if (lista.length > 0) {
            lista.forEach(c => {
                const b = document.createElement("button");
                b.className = "btn-cita-mob";
                b.textContent = c.citaOriginal || `${c.libro} ${c.capitulo},${c.versiculoInicio}`;
                b.onclick = (e) => { e.stopPropagation(); abrirModal(c); };
                body.appendChild(b);
            });
        } else {
            body.innerHTML = "<small style='color:#999; padding:5px;'>-</small>";
        }
        card.appendChild(header);
        card.appendChild(body);
        mobCards.appendChild(card);
    };

    addMobCard("Históricos", item.hist, datos.Hist);
    addMobCard("Proféticos", item.prof, datos.Prof);
    addMobCard("Nuevo Testamento", item.nt, datos.NT);
    addMobCard("Evangelio", item.ev, datos.Ev);
    
    // Agregar tarjetas extras solo si están activadas globalmente (o siempre, según preferencia)
    // El usuario pidió "incluir un check... que permita mostrar".
    // Lo lógico es mostrar las tarjetas si el check está activo.
    if (checkExtras.checked) {
        addMobCard("Salmos", item.sal, datos.Sal);
        addMobCard("Sapienciales", item.sap, datos.Sap);
    }

    divMobile.appendChild(mobCards);

    containerCell.appendChild(divDesktop);
    containerCell.appendChild(divMobile);
}

// Helpers
function crearBtnAccion(texto, activo, claseBase, onClick) {
    const btn = document.createElement("button");
    btn.className = `btn-mini ${claseBase} ${activo ? "active" : ""}`;
    let label = texto;
    if (activo) {
        if(texto === "Ordenar") label = "Original";
        if(texto === "Limpiar") label = "Ver Todo";
    }
    btn.textContent = label;
    btn.onclick = (e) => { e.stopPropagation(); onClick(); };
    return btn;
}

function createStatCell(val, original) {
    const div = document.createElement("div");
    div.className = "stat-cell";
    const diff = val - original;
    if (diff !== 0) div.classList.add("stat-diff");
    div.innerHTML = `
        <span class="stat-val-main">${val}</span>
        <span class="stat-val-sec">/ ${original}</span>
    `;
    return div;
}

function crearColumnaCitas(arrayCitas, claseExtra) {
    const divCol = document.createElement("div");
    divCol.className = `grupo-citas ${claseExtra}`;
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

// --- COLLAPSE ---
btnTogglePanel.onclick = () => {
    panelControles.classList.toggle("collapsed");
    const cerrado = panelControles.classList.contains("collapsed");
    btnTogglePanel.textContent = cerrado ? "🔽 Mostrar Filtros" : "🔼 Ocultar Filtros";
};

// --- EXCLUSIONES ---
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
function eliminarExclusion(p) { 
    if(confirm(`¿Quitar exclusión de "${p}"?`)) {
        setExcluidos.delete(p); 
        guardarYActualizar(); 
    }
}
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
    const mostrarExtras = checkExtras.checked; // Leemos estado
    const orden = selectOrden.value;
    const textoBusqueda = normalizar(inputBusqueda.value);

    // Activamos/Desactivamos clase CSS global para columnas
    if (mostrarExtras) {
        tableContainer.classList.add("show-extras");
    } else {
        tableContainer.classList.remove("show-extras");
    }

    let lista = listaGlobal.filter(item => {
        if (setExcluidos.has(item.palabraNorm)) return false;
        // Filtro estricto: Se mantiene en los 4 grupos principales
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
            <td class="w-id td-center">${item.idOriginal}</td>
            <td class="w-palabra td-left">${item.palabra} <small style="color:#aaa">▼</small></td>
            <td class="w-total td-center td-number">${item.total}</td>
            <td class="w-cat td-center">${item.hist || '<span style="color:#ddd">-</span>'}</td>
            <td class="w-cat td-center">${item.prof || '<span style="color:#ddd">-</span>'}</td>
            <td class="w-cat td-center">${item.nt || '<span style="color:#ddd">-</span>'}</td>
            <td class="w-cat td-center">${item.ev || '<span style="color:#ddd">-</span>'}</td>
            <td class="w-extra td-center">${item.sal || '<span style="color:#ddd">-</span>'}</td>
            <td class="w-extra td-center">${item.sap || '<span style="color:#ddd">-</span>'}</td>
        `;

        const trDetail = document.createElement("tr");
        trDetail.className = "fila-detalle";
        trDetail.style.display = "none";
        
        const tdDetail = document.createElement("td");
        tdDetail.colSpan = 9; // Aumentamos colspan para cubrir extras
        tdDetail.className = "celda-detalle";

        renderizarGridDetalle(item, tdDetail);

        trDetail.appendChild(tdDetail);
        
        trMain.addEventListener("click", () => {
            const abierto = trDetail.style.display === "table-row";
            if (abierto) { 
                trDetail.style.display = "none"; 
                trMain.classList.remove("activa"); 
            } else { 
                trDetail.style.display = "table-row"; 
                trMain.classList.add("activa"); 
            }
        });

        tbody.appendChild(trMain);
        tbody.appendChild(trDetail);
    });
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
checkExtras.addEventListener("change", actualizarTabla); // Listener para extras
inputBusqueda.addEventListener("input", actualizarTabla);