fetch("zguerras_completo.json")
  .then(r => r.json())
  .then(data => {

    const palabras = data.palabras;
    const tbody = document.querySelector("#tabla tbody");
    const info = document.getElementById("info");

    const lista = Object.values(palabras);

    info.textContent =
      `Palabras cargadas: ${lista.length} | ` +
      `Capítulos únicos: ${Object.keys(data.textos).length}`;

    lista.forEach(p => {

      const l = p.lecturas;

      const total =
        l.Historicos.length +
        l.Profeticos.length +
        l["Nuevo Testamento"].length +
        l.Evangelio.length;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.palabra}</td>
        <td>${total}</td>
        <td>${l.Historicos.length}</td>
        <td>${l.Profeticos.length}</td>
        <td>${l["Nuevo Testamento"].length}</td>
        <td>${l.Evangelio.length}</td>
      `;
      tbody.appendChild(tr);
    });

  })
  .catch(err => {
    document.getElementById("info").textContent = "Error cargando JSON";
    console.error(err);
  });
