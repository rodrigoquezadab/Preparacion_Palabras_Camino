// --- VARIABLES GLOBALES ---
let listaGlobal = [];
let dbTextos = {}; 
let setExcluidos = new Set(JSON.parse(localStorage.getItem('palabrasExcluidas')) || []);
let setPalabrasExistentes = new Set();

// --- REFERENCIAS AL DOM ---
const tbody = document.querySelector("#tabla tbody");
const info = document.getElementById("info");
const inputExcluir = document.getElementById("inputExcluir");
const btnAgregar = document.getElementById("btnAgregar");
const contenedorTags = document.getElementById("contenedorTags");
const selectOrden = document.getElementById("selectOrden");
const checkEstricto = document.getElementById("checkEstricto");

// Referencias Buscador
const inputBusqueda = document.getElementById("inputBusqueda");

// Referencias Modal
const modal = document.getElementById("modalLectura");
const modalTitulo = document.getElementById("modalTitulo");
const modalCuerpo = document.getElementById("modalTextoCuerpo");
const btnCerrar = document.querySelector(".close");

// --- UTILIDADES ---
const normalizar = (str) => {
    if (!str) return "";
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

// --- CARGA DE DATOS ---
fetch("zguerras_completo.json")
    .then(r => {
        if (!r.ok) throw new Error("No se pudo cargar el archivo JSON");
        return r.json();
    })
    .then(data => {
        dbTextos = data.textos || {};
        let rawList = Object.values(data.palabras);

        // 1. Ordenamos alfabéticamente para asignar ID correlativo
        rawList.sort((a, b) => a.palabra.localeCompare(b.palabra, 'es', { sensitivity: 'base' }));

        // 2. Procesar datos
        listaGlobal = rawList.map((p, index) => {
            const pNorm = normalizar(p.palabra);
            const l = p.lecturas;
            
            // Guardamos para validar existencia al excluir
            setPalabrasExistentes.add(pNorm);

            const cHist = l.Historicos ? l.Historicos.length : 0;
            const cProf = l.Profeticos ? l.Profeticos.length : 0;
            const cNT = l["Nuevo Testamento"] ? l["Nuevo Testamento"].length : 0;
            const cEv = l.Evangelio ? l.Evangelio.length : 0;
            
            return {
                idOriginal: index + 1,
                palabra: p.palabra,
                palabraNorm: pNorm,
                lecturas: l,
                total: cHist + cProf + cNT + cEv,
                hist: cHist, prof: cProf, nt: cNT, ev: cEv
            };
        });

        // Limpieza de localStorage antiguo
        setExcluidos.forEach(excl => {
            if (!setPalabrasExistentes.has(excl)) setExcluidos.delete(excl);
        });
        guardarLocalStorage();

        renderizarTags(); 
        actualizarTabla(); // Se ejecutará con orden alfabético por defecto ('alpha')
    })
    .catch(err => {
        info.textContent = "Error: " + err.message;
        console.error(err);
    });

// --- GESTIÓN EXCLUSIONES ---
function agregarExclusiones() {
    const texto = inputExcluir.value;
    if (!texto) return;

    const nuevasPalabras = texto.split(',').map(t => normalizar(t)).filter(t => t.length > 0);
    let palabrasInvalidas = [];
    let cambios = false;

    nuevasPalabras.forEach(palabra => {
        if (setPalabrasExistentes.has(palabra)) {
            if (!setExcluidos.has(palabra)) {
                setExcluidos.add(palabra);
                cambios = true;
            }
        } else {
            palabrasInvalidas.push(palabra);
        }
    });
    
    if (palabrasInvalidas.length > 0) {
        alert(`Palabra(s) no encontrada(s):\n- ${palabrasInvalidas.join("\n- ")}`);
    }

    inputExcluir.value = "";
    if (cambios) guardarYActualizar();
}

function eliminarExclusion(palabraNorm) {
    setExcluidos.delete(palabraNorm);
    guardarYActualizar();
}

function guardarLocalStorage() {
    localStorage.setItem('palabrasExcluidas', JSON.stringify([...setExcluidos]));
}

function guardarYActualizar() {
    guardarLocalStorage();
    renderizarTags();
    actualizarTabla();
}

function renderizarTags() {
    contenedorTags.innerHTML = "";
    if (setExcluidos.size === 0) {
        contenedorTags.innerHTML = '<span class="sin-exclusiones">Sin exclusiones.</span>';
        return;
    }
    setExcluidos.forEach(palabra => {
        const tag = document.createElement("div");
        tag.className = "tag-excluido";
        tag.innerHTML = `${palabra} <span>&times;</span>`;
        tag.querySelector("span").onclick = () => eliminarExclusion(palabra);
        contenedorTags.appendChild(tag);
    });
}

btnAgregar.addEventListener("click", agregarExclusiones);
inputExcluir.addEventListener("keydown", (e) => { if (e.key === "Enter") agregarExclusiones(); });

// --- LÓGICA DE TABLA Y FILTROS ---
function actualizarTabla() {
    const modoEstricto = checkEstricto.checked;
    const orden = selectOrden.value;
    const textoBusqueda = normalizar(inputBusqueda.value); // Obtener texto buscador

    let listaFiltrada = listaGlobal.filter(item => {
        // 1. Exclusiones (Tags)
        if (setExcluidos.has(item.palabraNorm)) return false;
        
        // 2. Filtro Estricto (4 Grupos)
        if (modoEstricto) {
            if (item.hist === 0 || item.prof === 0 || item.nt === 0 || item.ev === 0) return false; 
        }

        // 3. Filtro Búsqueda (Texto)
        if (textoBusqueda.length > 0) {
            if (!item.palabraNorm.includes(textoBusqueda)) return false;
        }

        return true;
    });

    // Ordenar
    listaFiltrada.sort((a, b) => {
        if (orden === 'alpha') return a.idOriginal - b.idOriginal; // Orden Alfabético (por ID)
        if (orden === 'asc') return a.total - b.total;
        if (orden === 'desc') return b.total - a.total;
        return 0;
    });

    info.textContent = `Viendo ${listaFiltrada.length} de ${listaGlobal.length}`;
    dibujarTabla(listaFiltrada);
}

function dibujarTabla(lista) {
    tbody.innerHTML = "";

    lista.forEach(item => {
        // FILA PRINCIPAL
        const trMain = document.createElement("tr");
        trMain.className = "fila-principal";
        trMain.innerHTML = `
            <td class="col-id">${item.idOriginal}</td>
            <td class="col-palabra">${item.palabra} <small style="color:#aaa">▼</small></td>
            <td class="col-total"><strong>${item.total}</strong></td>
            <td class="col-grupo">${item.hist > 0 ? item.hist : '<span style="color:#ddd">-</span>'}</td>
            <td class="col-grupo">${item.prof > 0 ? item.prof : '<span style="color:#ddd">-</span>'}</td>
            <td class="col-grupo">${item.nt > 0 ? item.nt : '<span style="color:#ddd">-</span>'}</td>
            <td class="col-grupo">${item.ev > 0 ? item.ev : '<span style="color:#ddd">-</span>'}</td>
        `;

        // FILA DETALLE
        const trDetail = document.createElement("tr");
        trDetail.className = "fila-detalle";
        const tdDetail = document.createElement("td");
        tdDetail.colSpan = 7; 
        tdDetail.className = "celda-detalle";

        const divGrid = document.createElement("div");
        divGrid.className = "grid-detalle";

        divGrid.appendChild(crearColumnaCitas(item.lecturas.Historicos, "pos-hist"));
        divGrid.appendChild(crearColumnaCitas(item.lecturas.Profeticos, "pos-prof"));
        divGrid.appendChild(crearColumnaCitas(item.lecturas["Nuevo Testamento"], "pos-nt"));
        divGrid.appendChild(crearColumnaCitas(item.lecturas.Evangelio, "pos-ev"));

        tdDetail.appendChild(divGrid);
        trDetail.appendChild(tdDetail);

        trMain.addEventListener("click", () => {
            const estaAbierto = trDetail.style.display === "table-row";
            if (estaAbierto) {
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

function crearColumnaCitas(arrayCitas, clasePosicion) {
    const divCol = document.createElement("div");
    divCol.className = `grupo-citas ${clasePosicion}`;

    if (arrayCitas && arrayCitas.length > 0) {
        arrayCitas.forEach(cita => {
            const btn = document.createElement("button");
            btn.className = "btn-cita";
            btn.textContent = cita.citaOriginal || `${cita.libro} ${cita.capitulo},${cita.versiculoInicio}`;
            btn.title = btn.textContent;
            
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                abrirModal(cita);
            });
            divCol.appendChild(btn);
        });
    }
    return divCol;
}

// --- MODAL ---
function abrirModal(citaObj) {
    const ref = citaObj.textoRef;
    const textoHTML = dbTextos[ref];
    modalTitulo.textContent = `Lectura: ${citaObj.citaOriginal || ref}`;
    modalCuerpo.innerHTML = textoHTML ? textoHTML : `<p style="color:red">Texto no encontrado: <strong>${ref}</strong></p>`;
    modal.style.display = "block";
}

btnCerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

// Eventos
selectOrden.addEventListener("change", actualizarTabla);
checkEstricto.addEventListener("change", actualizarTabla);
inputBusqueda.addEventListener("input", actualizarTabla); // Mantenemos el filtro al escribir