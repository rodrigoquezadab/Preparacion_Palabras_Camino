// --- VARIABLES GLOBALES ---
let listaGlobal = [];
let dbTextos = {}; // Aquí almacenaremos los textos bíblicos del JSON

// --- REFERENCIAS AL DOM ---
const tbody = document.querySelector("#tabla tbody");
const info = document.getElementById("info");
const inputExcluir = document.getElementById("inputExcluir");
const selectOrden = document.getElementById("selectOrden");
const checkEstricto = document.getElementById("checkEstricto");

// Referencias del Modal
const modal = document.getElementById("modalLectura");
const modalTitulo = document.getElementById("modalTitulo");
const modalCuerpo = document.getElementById("modalTextoCuerpo");
const btnCerrar = document.querySelector(".close");

// --- UTILIDADES ---
// Normaliza texto para comparaciones (quita tildes y pasa a minúsculas)
const normalizar = (str) => {
    if (!str) return "";
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

// --- INICIO: CARGA DE DATOS ---
fetch("zguerras_completo.json")
    .then(r => {
        if (!r.ok) throw new Error("No se pudo cargar el archivo JSON");
        return r.json();
    })
    .then(data => {
        // 1. Guardar textos bíblicos para el modal
        dbTextos = data.textos || {};

        // 2. Procesar lista de palabras
        listaGlobal = Object.values(data.palabras).map(p => {
            const l = p.lecturas;
            
            // Conteo seguro (evita errores si falta alguna clave en el JSON)
            const cHist = l.Historicos ? l.Historicos.length : 0;
            const cProf = l.Profeticos ? l.Profeticos.length : 0;
            const cNT = l["Nuevo Testamento"] ? l["Nuevo Testamento"].length : 0;
            const cEv = l.Evangelio ? l.Evangelio.length : 0;
            
            return {
                palabra: p.palabra,
                palabraNorm: normalizar(p.palabra),
                lecturas: l, // Guardamos el objeto completo para el acordeón
                total: cHist + cProf + cNT + cEv,
                hist: cHist,
                prof: cProf,
                nt: cNT,
                ev: cEv
            };
        });

        // 3. Renderizar inicial
        actualizarTabla();
    })
    .catch(err => {
        info.textContent = "Error: " + err.message;
        info.style.color = "red";
        console.error(err);
    });

// --- LÓGICA DE FILTRADO Y ORDEN ---
function actualizarTabla() {
    // 1. Obtener lista de exclusión del input
    const textoExcluir = inputExcluir.value;
    const arrayExcluidos = textoExcluir.split(',')
        .map(t => normalizar(t))
        .filter(t => t.length > 0);

    // 2. Estado del checkbox estricto
    const modoEstricto = checkEstricto.checked;

    // 3. Filtrar
    let listaFiltrada = listaGlobal.filter(item => {
        // A. Excluir palabras prohibidas
        if (arrayExcluidos.includes(item.palabraNorm)) return false;

        // B. Filtro Estricto: Debe tener > 0 en los 4 grupos
        if (modoEstricto) {
            if (item.hist === 0 || item.prof === 0 || item.nt === 0 || item.ev === 0) {
                return false; 
            }
        }
        return true;
    });

    // 4. Ordenar
    const orden = selectOrden.value;
    listaFiltrada.sort((a, b) => {
        return orden === 'asc' ? a.total - b.total : b.total - a.total;
    });

    // 5. Actualizar UI
    info.textContent = `Mostrando ${listaFiltrada.length} de ${listaGlobal.length} palabras.`;
    dibujarTabla(listaFiltrada);
}

// --- RENDERIZADO DE TABLA (PRINCIPAL + ACORDEÓN) ---
function dibujarTabla(lista) {
    tbody.innerHTML = ""; // Limpiar tabla

    lista.forEach(item => {
        // CREAR FILA PRINCIPAL
        const trMain = document.createElement("tr");
        trMain.className = "fila-principal";
        trMain.innerHTML = `
            <td>${item.palabra} <small style="color:#aaa">▼</small></td>
            <td><strong>${item.total}</strong></td>
            <td>${item.hist > 0 ? item.hist : '<span style="color:#ddd">-</span>'}</td>
            <td>${item.prof > 0 ? item.prof : '<span style="color:#ddd">-</span>'}</td>
            <td>${item.nt > 0 ? item.nt : '<span style="color:#ddd">-</span>'}</td>
            <td>${item.ev > 0 ? item.ev : '<span style="color:#ddd">-</span>'}</td>
        `;

        // CREAR FILA DETALLE (ACORDEÓN)
        const trDetail = document.createElement("tr");
        trDetail.className = "fila-detalle";
        
        const tdDetail = document.createElement("td");
        tdDetail.colSpan = 6;
        tdDetail.className = "celda-detalle";

        // Contenedor Grid para alinear columnas
        const divGrid = document.createElement("div");
        divGrid.className = "grid-detalle";

        // Generar columnas de citas
        // Históricos
        divGrid.appendChild(crearColumnaCitas(item.lecturas.Historicos, "pos-hist"));
        // Proféticos
        divGrid.appendChild(crearColumnaCitas(item.lecturas.Profeticos, "pos-prof"));
        // Nuevo Testamento
        divGrid.appendChild(crearColumnaCitas(item.lecturas["Nuevo Testamento"], "pos-nt"));
        // Evangelio
        divGrid.appendChild(crearColumnaCitas(item.lecturas.Evangelio, "pos-ev"));

        tdDetail.appendChild(divGrid);
        trDetail.appendChild(tdDetail);

        // EVENTO CLICK EN LA FILA (ABRIR/CERRAR)
        trMain.addEventListener("click", () => {
            const estaAbierto = trDetail.style.display === "table-row";
            
            // Cerrar todos los detalles abiertos previamente (opcional, para efecto acordeón único)
            /* document.querySelectorAll('.fila-detalle').forEach(row => row.style.display = 'none');
               document.querySelectorAll('.fila-principal').forEach(row => row.classList.remove('activa')); */

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

// Función auxiliar para crear el bloque de botones de citas
function crearColumnaCitas(arrayCitas, clasePosicion) {
    const divCol = document.createElement("div");
    divCol.className = `grupo-citas ${clasePosicion}`;

    if (arrayCitas && arrayCitas.length > 0) {
        arrayCitas.forEach(cita => {
            const btn = document.createElement("button");
            btn.className = "btn-cita";
            // Texto del botón: usa citaOriginal o construye "Libro Cap,Ver"
            btn.textContent = cita.citaOriginal || `${cita.libro} ${cita.capitulo},${cita.versiculoInicio}`;
            
            // Click en la cita -> Abrir Modal
            btn.addEventListener("click", (e) => {
                e.stopPropagation(); // Evitar que se cierre el acordeón al hacer clic en el botón
                abrirModal(cita);
            });

            divCol.appendChild(btn);
        });
    }
    return divCol;
}

// --- LÓGICA DEL MODAL ---
function abrirModal(citaObj) {
    const ref = citaObj.textoRef; // Clave para buscar en JSON (ej: "SAL-23")
    const textoHTML = dbTextos[ref]; // Texto bíblico

    modalTitulo.textContent = `Lectura: ${citaObj.citaOriginal || ref}`;
    
    if (textoHTML) {
        modalCuerpo.innerHTML = textoHTML;
    } else {
        modalCuerpo.innerHTML = `<p style="color:red">No se encontró el texto para la referencia: <strong>${ref}</strong></p>`;
    }

    modal.style.display = "block";
}

// Cerrar Modal
btnCerrar.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
};

// --- LISTENERS (Eventos de Inputs) ---
inputExcluir.addEventListener("input", actualizarTabla);
selectOrden.addEventListener("change", actualizarTabla);
checkEstricto.addEventListener("change", actualizarTabla);