(async function () {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const select = document.querySelector("select");
  const opciones = [...select.options].filter(o => o.value).slice(0, 4);

  const resultado = {};

  const extraerTexto = (a) => {
    const onclick = a.getAttribute("onclick");
    if (!onclick) return null;

    const m = onclick.match(/'([^']+)'/);
    if (!m) return null;

    return m[1]
      .replace(/\\n/g, " ")
      .replace(/\\'/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  };

  for (const opt of opciones) {

    const palabra = opt.textContent.trim();
    const opcion = opt.value;

    console.log(`🔍 Procesando: ${palabra}`);

    const data = {
      palabra,
      totales: {
        Salmos: 0,
        Sapienciales: 0,
        Historicos: 0,
        Profeticos: 0,
        "Nuevo Testamento": 0,
        Evangelio: 0
      },
      lecturas: {
        Salmos: [],
        Sapienciales: [],
        Historicos: [],
        Profeticos: [],
        "Nuevo Testamento": [],
        Evangelio: []
      },
      totalLecturas: 0
    };

    const form = new URLSearchParams();
    form.append("opcion", opcion);

    const res = await fetch("https://www.zguerras.com/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // ===============================
    // SALMOS
    // ===============================
    doc.querySelectorAll("#tabla1 ul li a").forEach(a => {
      data.lecturas.Salmos.push({
        cita: a.textContent.trim(),
        texto: extraerTexto(a)
      });
    });

    // ===============================
    // SAPIENCIALES
    // ===============================
    doc.querySelectorAll("#tabla2 ul li a").forEach(a => {
      data.lecturas.Sapienciales.push({
        cita: a.textContent.trim(),
        texto: extraerTexto(a)
      });
    });

    // ===============================
    // TABLA PRINCIPAL
    // ===============================
    const tabla = [...doc.querySelectorAll("table")]
      .find(t => t.querySelector("th")?.textContent.includes("Histor"));

    if (tabla) {
      const headers = [...tabla.querySelectorAll("th")].map(h => h.textContent.trim());
      const celdas = tabla.querySelectorAll("td");

      headers.forEach((titulo, i) => {
        const enlaces = celdas[i]?.querySelectorAll("li a");
        if (!enlaces) return;

        enlaces.forEach(a => {
          const lectura = {
            cita: a.textContent.trim(),
            texto: extraerTexto(a)
          };

          if (titulo.includes("Histor")) data.lecturas.Historicos.push(lectura);
          if (titulo.includes("Profet")) data.lecturas.Profeticos.push(lectura);
          if (titulo.includes("Nuevo")) data.lecturas["Nuevo Testamento"].push(lectura);
          if (titulo.includes("Evangel")) data.lecturas.Evangelio.push(lectura);
        });
      });
    }

    // ===============================
    // CONTADORES
    // ===============================
    for (const cat in data.lecturas) {
      data.totales[cat] = data.lecturas[cat].length;
    }

    data.totalLecturas =
      data.totales.Historicos +
      data.totales.Profeticos +
      data.totales["Nuevo Testamento"] +
      data.totales.Evangelio;

    resultado[palabra] = data;

    console.table(data.totales);
    console.log(`➡ TOTAL (sin Salmos ni Sapienciales): ${data.totalLecturas}\n`);

    await sleep(400);
  }

  // ===============================
  // DESCARGA JSON
  // ===============================
  const blob = new Blob(
    [JSON.stringify(resultado, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "zguerras_test_4_palabras.json";
  a.click();

  window.zGuerrasData = resultado;

  console.log("✅ JSON descargado y datos en window.zGuerrasData");

})();
