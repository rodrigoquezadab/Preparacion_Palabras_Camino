(async function () {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const select = document.querySelector("select");
  if (!select) {
    console.error("❌ No se encontró el selector");
    return;
  }

  const opciones = [...select.options]
    .filter(o => o.value && o.value.trim() !== "")
    .slice(0, 4); // 🔬 SOLO 4 PALABRAS

  const resultadoFinal = [];

  console.log("🚀 Iniciando prueba con", opciones.length, "palabras");

  for (const opcion of opciones) {
    const palabra = opcion.text.trim();
    const valor = opcion.value;

    console.log(`🔍 Procesando: ${palabra} (opcion=${valor})`);

    // POST real
    const formData = new URLSearchParams();
    formData.append("opcion", valor);

    const response = await fetch(location.href, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const palabraData = {
      palabra,
      lecturas: [],
      totales: {
        Historicos: 0,
        Profeticos: 0,
        NuevoTestamento: 0,
        Evangelio: 0,
        Salmos: 0,
        Sapienciales: 0,
        sinSalmosSapienciales: 0
      }
    };

    // Detectar categorías por encabezados
    const encabezados = [...doc.querySelectorAll("b, h3, h4")];

    const detectarCategoria = txt => {
      txt = txt.toLowerCase();
      if (txt.includes("hist")) return "Historicos";
      if (txt.includes("prof")) return "Profeticos";
      if (txt.includes("evang")) return "Evangelio";
      if (txt.includes("nuevo")) return "NuevoTestamento";
      if (txt.includes("salmo")) return "Salmos";
      if (txt.includes("sapien")) return "Sapienciales";
      return null;
    };

    for (const h of encabezados) {
      const categoria = detectarCategoria(h.textContent);
      if (!categoria) continue;

      let nodo = h.nextElementSibling;

      while (nodo && !/^(B|H3|H4)$/i.test(nodo.tagName)) {
        const enlaces = nodo.querySelectorAll("a");

        enlaces.forEach(a => {
          const textoCita = a.textContent.trim();
          const textoVerso = a.title || "";

          const cita = parsearCita(textoCita);

          palabraData.lecturas.push({
            categoria,
            ...cita,
            texto: textoVerso
          });

          palabraData.totales[categoria]++;
          if (!["Salmos", "Sapienciales"].includes(categoria)) {
            palabraData.totales.sinSalmosSapienciales++;
          }
        });

        nodo = nodo.nextElementSibling;
      }
    }

    resultadoFinal.push(palabraData);

    console.log(
      `✔ ${palabra}:`,
      palabraData.totales.sinSalmosSapienciales,
      "lecturas (sin salmos/sapienciales)"
    );

    await sleep(500);
  }

  // ⬇️ DESCARGAR JSON
  const blob = new Blob(
    [JSON.stringify(resultadoFinal, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "zguerras_prueba_4_palabras.json";
  a.click();
  URL.revokeObjectURL(url);

  console.log("📦 JSON descargado correctamente");

  // 👉 helper de parseo
  function parsearCita(cita) {
    // Ej: Gn 1,5 / Gn 1,5-7 / Gn 1,5 s / Gn 1,5 ss
    const res = {
      libro: null,
      capitulo: null,
      versiculoInicio: null,
      versiculoFin: null,
      continuidad: null
    };

    const match = cita.match(/^(\D+)\s+(\d+),(\d+)(?:-(\d+))?\s*(s{1,2})?$/i);
    if (!match) return res;

    res.libro = match[1].trim().toUpperCase();
    res.capitulo = Number(match[2]);
    res.versiculoInicio = Number(match[3]);

    if (match[4]) {
      res.versiculoFin = Number(match[4]);
    }

    if (match[5]) {
      res.continuidad = match[5]; // s o ss
    }

    return res;
  }
})();
