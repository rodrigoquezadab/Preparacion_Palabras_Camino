// Variable global para guardar los datos procesados
let listaGlobal = [];

// Función para normalizar texto (Quitar tildes y pasar a minúsculas)
// Ejemplo: "Adán" -> "adan", "Árbol" -> "arbol"
const normalizar = (str) => {
  if (!str) return "";
  return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
};

// Referencias al DOM
const tbody = document.querySelector("#tabla tbody");
const info = document.getElementById("info");
const inputExcluir = document.getElementById("inputExcluir");
const selectOrden = document.getElementById("selectOrden");
const checkHist = document.getElementById("checkHist");
const checkProf = document.getElementById("checkProf");
const checkNT = document.getElementById("checkNT");
const checkEv = document.getElementById("checkEv");

// Cargar datos
fetch("zguerras_completo.json")
  .then(r => r.json())
  .then(data => {
    // Procesamos la lista una sola vez al cargar
    listaGlobal = Object.values(data.palabras).map(p => {
      const l = p.lecturas;
      
      // Obtenemos los conteos de forma segura (0 si no existe)
      const cHist = l.Historicos ? l.Historicos.length : 0;
      const cProf = l.Profeticos ? l.Profeticos.length : 0;
      const cNT = l["Nuevo Testamento"] ? l["Nuevo Testamento"].length : 0;
      const cEv = l.Evangelio ? l.Evangelio.length : 0;

      // Calculamos el total según la lógica original (suma de estos 4 grupos)
      const total = cHist + cProf + cNT + cEv;

      return {
        palabra: p.palabra,
        palabraNorm: normalizar(p.palabra), // Guardamos versión normalizada para filtrar rápido
        total: total,
        hist: cHist,
        prof: cProf,
        nt: cNT,
        ev: cEv
      };
    });

    info.textContent = `Datos cargados. Total palabras: ${listaGlobal.length}`;
    
    // Renderizar tabla inicial
    actualizarTabla();
  })
  .catch(err => {
    info.textContent = "Error cargando JSON";
    console.error(err);
  });

// Función principal de filtrado y renderizado
function actualizarTabla() {
  // 1. Obtener palabras a excluir
  const textoExcluir = inputExcluir.value;
  const palabrasExcluidas = textoExcluir.split(',')
    .map(w => normalizar(w)) // Normalizamos lo que escribe el usuario
    .filter(w => w.length > 0); // Eliminamos espacios vacíos

  // 2. Filtrar la lista
  let listaFiltrada = listaGlobal.filter(item => {
    
    // A) Filtro de Exclusión
    // Si la palabra actual está en la lista de excluidas, la quitamos
    if (palabrasExcluidas.includes(item.palabraNorm)) {
      return false;
    }

    // B) Filtro de Categorías (Regla: "filtrar aquellas que no contengan...")
    // Si el checkbox está marcado y el conteo es 0, ocultamos la palabra.
    if (checkHist.checked && item.hist === 0) return false;
    if (checkProf.checked && item.prof === 0) return false;
    if (checkNT.checked && item.nt === 0) return false;
    if (checkEv.checked && item.ev === 0) return false;

    return true;
  });

  // 3. Ordenar
  const orden = selectOrden.value;
  listaFiltrada.sort((a, b) => {
    if (orden === 'asc') {
      return a.total - b.total;
    } else {
      return b.total - a.total;
    }
  });

  // 4. Actualizar info
  info.textContent = `Mostrando ${listaFiltrada.length} de ${listaGlobal.length} palabras.`;

  // 5. Dibujar en el HTML
  dibujarFilas(listaFiltrada);
}

function dibujarFilas(lista) {
  tbody.innerHTML = ""; // Limpiar tabla
  
  lista.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.palabra}</td>
      <td><strong>${item.total}</strong></td>
      <td>${item.hist}</td>
      <td>${item.prof}</td>
      <td>${item.nt}</td>
      <td>${item.ev}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Escuchar eventos (Cualquier cambio actualiza la tabla en tiempo real)
inputExcluir.addEventListener("input", actualizarTabla);
selectOrden.addEventListener("change", actualizarTabla);
checkHist.addEventListener("change", actualizarTabla);
checkProf.addEventListener("change", actualizarTabla);
checkNT.addEventListener("change", actualizarTabla);
checkEv.addEventListener("change", actualizarTabla);