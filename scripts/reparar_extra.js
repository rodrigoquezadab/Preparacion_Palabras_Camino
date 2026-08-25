const fs = require('fs');

const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

// Correcciones específicas adicionales
const EXTRA_REPLACEMENTS = {
  // Testimonio: HCH t,8 -> HCH 1,8
  "HCH t,8": { orig: "HCH 1,8", comp: "Hechos 1,8", libro: "HCH", cap: 1, vIni: 8, vFin: null, cont: null, cat: "Nuevo Testamento" },
  // Santo: LC Act.1,5 -> HCH 1,5
  "LC Act.1,5": { orig: "HCH 1,5", comp: "Hechos de los Apóstoles 1,5", libro: "HCH", cap: 1, vIni: 5, vFin: null, cont: null, cat: "Nuevo Testamento" },
  // Unción: 1JN v.20s -> 1JN 2,20s
  "1JN v.20s": { orig: "1JN 2,20s", comp: "1 Juan 2,20s", libro: "1JN", cap: 2, vIni: 20, vFin: null, cont: "s", cat: "Nuevo Testamento" },
  "1JN v. 27": { orig: "1JN 2,27", comp: "1 Juan 2,27", libro: "1JN", cap: 2, vIni: 27, vFin: null, cont: null, cat: "Nuevo Testamento" },
  // Verdad: DT Salmo 89 -> SAL 89
  "DT Salmo 89": { orig: "SAL 89", comp: "Salmos 89", libro: "SAL", cap: 89, vIni: null, vFin: null, cont: null, cat: "Salmos" },
  // Sombra: IS Par 5,7ss -> IS 5,7ss
  "IS Par 5,7ss": { orig: "IS 5,7ss", comp: "Isaías 5,7ss", libro: "IS", cap: 5, vIni: 7, vFin: null, cont: "ss", cat: "Profeticos" },
  // Sacerdocio: EX 1-15,Jos 2-6 -> EX 1-15
  "EX 1-15,Jos 2-6": { orig: "EX 1-15", comp: "Éxodo 1-15", libro: "EX", cap: 1, vIni: null, vFin: null, cont: null, cat: "Historicos" },
  // Ver: JN 12,40,Is 6,9s -> JN 12,40
  "JN 12,40,Is 6,9s": { orig: "JN 12,40", comp: "Juan 12,40", libro: "JN", cap: 12, vIni: 40, vFin: null, cont: null, cat: "Evangelio" },
  // Alma: MC 3,4,Act 2,43 -> MC 3,4
  "MC 3,4,Act 2,43": { orig: "MC 3,4", comp: "Marcos 3,4", libro: "MC", cap: 3, vIni: 4, vFin: null, cont: null, cat: "Evangelio" },
  // Alma: SAL 31,o,Ecl 12,7 -> SAL 31,6
  "SAL 31,o,Ecl 12,7": { orig: "SAL 31,6", comp: "Salmos 31,6", libro: "SAL", cap: 31, vIni: 6, vFin: null, cont: null, cat: "Salmos" },
  // Israel: GEN 49,Dt 33,Jue 5,Ap 7,5 -> GEN 49
  "GEN 49,Dt 33,Jue 5,Ap 7,5": { orig: "GEN 49", comp: "Génesis 49", libro: "GEN", cap: 49, vIni: null, vFin: null, cont: null, cat: "Historicos" }
};

const EXTRA_HTML_REPLACEMENTS = [
  ["<cite>Hch t,8</cite>", "<cite>Hch 1,8</cite>"],
  ["<cite>Act.1,5</cite>", "<cite>Act 1,5</cite>"],
  ["<cite>1Jn v.20s</cite>", "<cite>1Jn 2,20s</cite>"],
  ["<cite>1Jn v. 27</cite>", "<cite>1Jn 2,27</cite>"]
];

let extraCount = 0;

Object.entries(data.palabras).forEach(([palKey, palObj]) => {
  if (palObj.contenido) {
    EXTRA_HTML_REPLACEMENTS.forEach(([bad, good]) => {
      if (palObj.contenido.includes(bad)) {
        palObj.contenido = palObj.contenido.replaceAll(bad, good);
        extraCount++;
      }
    });
  }

  const lecturas = palObj.lecturas || {};
  Object.entries(lecturas).forEach(([cat, citas]) => {
    citas.forEach(c => {
      const orig = (c.citaOriginal || '').trim();
      if (EXTRA_REPLACEMENTS[orig]) {
        const rep = EXTRA_REPLACEMENTS[orig];
        c.citaOriginal = rep.orig;
        c.citaCompleta = rep.comp;
        c.libro = rep.libro;
        c.capitulo = rep.cap;
        c.versiculoInicio = rep.vIni;
        c.versiculoFin = rep.vFin;
        c.continuidad = rep.cont;
        extraCount++;
      }
    });
  });
});

console.log(`Correcciones extra aplicadas: ${extraCount}`);
fs.writeFileSync('palabras.json', JSON.stringify(data, null, 2), 'utf8');
console.log("Archivo palabras.json actualizado con éxito.");
