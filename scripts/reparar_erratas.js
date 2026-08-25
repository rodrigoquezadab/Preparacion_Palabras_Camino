const fs = require('fs');

const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

let fixesCount = 0;

// Tabla de reemplazos exactos en citas
const REEMPLAZOS_CITAS = {
  // Letras OCR por números
  "ROM 10,e-10": { orig: "ROM 10,6-10", comp: "Romanos 10,6-10", libro: "ROM", cap: 10, vIni: 6, vFin: 10, cont: null, cat: "Nuevo Testamento" },
  "2COR 1,l8ss": { orig: "2COR 1,18ss", comp: "2 Corintios 1,18ss", libro: "2COR", cap: 1, vIni: 18, vFin: null, cont: "ss", cat: "Nuevo Testamento" },
  "GEN 6,Sss": { orig: "GEN 6,5ss", comp: "Génesis 6,5ss", libro: "GEN", cap: 6, vIni: 5, vFin: null, cont: "ss", cat: "Historicos" },
  "2SAM 7,Sss": { orig: "2SAM 7,5ss", comp: "2 Samuel 7,5ss", libro: "2SAM", cap: 7, vIni: 5, vFin: null, cont: "ss", cat: "Historicos" },
  "IS 56,Sss": { orig: "IS 56,5ss", comp: "Isaías 56,5ss", libro: "IS", cap: 56, vIni: 5, vFin: null, cont: "ss", cat: "Profeticos" },
  "JER 7,Sss": { orig: "JER 7,5ss", comp: "Jeremías 7,5ss", libro: "JER", cap: 7, vIni: 5, vFin: null, cont: "ss", cat: "Profeticos" },
  "HEB 2,Sss": { orig: "HEB 2,5ss", comp: "Hebreos 2,5ss", libro: "HEB", cap: 2, vIni: 5, vFin: null, cont: "ss", cat: "Nuevo Testamento" },
  "ROM 8,c3": { orig: "ROM 8,23", comp: "Romanos 8,23", libro: "ROM", cap: 8, vIni: 23, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "HEB 12,l s": { orig: "HEB 12,1s", comp: "Hebreos 12,1s", libro: "HEB", cap: 12, vIni: 1, vFin: null, cont: "s", cat: "Nuevo Testamento" },
  "JER 2,l 1ss": { orig: "JER 2,11ss", comp: "Jeremías 2,11ss", libro: "JER", cap: 2, vIni: 11, vFin: null, cont: "ss", cat: "Profeticos" },
  "MT 2,i3": { orig: "MT 2,13", comp: "Mateo 2,13", libro: "MT", cap: 2, vIni: 13, vFin: null, cont: null, cat: "Evangelio" },
  "GAL 5,o.22": { orig: "GAL 5,6.22", comp: "Gálatas 5,6.22", libro: "GAL", cap: 5, vIni: 6, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "SAL 26,o": { orig: "SAL 26,6", comp: "Salmos 26,6", libro: "SAL", cap: 26, vIni: 6, vFin: null, cont: null, cat: "Salmos" },
  "JER 18,las": { orig: "JER 18,11s", comp: "Jeremías 18,11s", libro: "JER", cap: 18, vIni: 11, vFin: null, cont: "s", cat: "Profeticos" },

  // Espacios dentro de números
  "1CRO 29,1 1 s": { orig: "1CRO 29,11s", comp: "1 Crónicas 29,11s", libro: "1CRO", cap: 29, vIni: 11, vFin: null, cont: "s", cat: "Historicos" },
  "IS 55,1 1": { orig: "IS 55,11", comp: "Isaías 55,11", libro: "IS", cap: 55, vIni: 11, vFin: null, cont: null, cat: "Profeticos" },
  "1RE 19,1 1ss": { orig: "1RE 19,11ss", comp: "1 Reyes 19,11ss", libro: "1RE", cap: 19, vIni: 11, vFin: null, cont: "ss", cat: "Historicos" },
  "JN 20,1 1ss": { orig: "JN 20,11ss", comp: "Juan 20,11ss", libro: "JN", cap: 20, vIni: 11, vFin: null, cont: "ss", cat: "Evangelio" },
  "AP 16,1 3s": { orig: "AP 16,13s", comp: "Apocalipsis 16,13s", libro: "AP", cap: 16, vIni: 13, vFin: null, cont: "s", cat: "Nuevo Testamento" },
  "JER 2,13 17,8": { orig: "JER 2,13", comp: "Jeremías 2,13", libro: "JER", cap: 2, vIni: 13, vFin: null, cont: null, cat: "Profeticos" },
  "ZAC 3,1 s": { orig: "ZAC 3,1s", comp: "Zacarías 3,1s", libro: "ZAC", cap: 3, vIni: 1, vFin: null, cont: "s", cat: "Profeticos" },

  // Citas de Judas mal parseadas
  "1TES Jds 1,9": { orig: "JUDAS 1,9", comp: "Judas 1,9", libro: "JUDAS", cap: 1, vIni: 9, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "HEB Jds 1,19": { orig: "JUDAS 1,19", comp: "Judas 1,19", libro: "JUDAS", cap: 1, vIni: 19, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "MT Jds 1,4.7": { orig: "JUDAS 1,4.7", comp: "Judas 1,4.7", libro: "JUDAS", cap: 1, vIni: 4, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "ZAC Jds 1,9": { orig: "JUDAS 1,9", comp: "Judas 1,9", libro: "JUDAS", cap: 1, vIni: 9, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "1TES Jds 1,20": { orig: "JUDAS 1,20", comp: "Judas 1,20", libro: "JUDAS", cap: 1, vIni: 20, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "2TIM Jds 1,12": { orig: "JUDAS 1,12", comp: "Judas 1,12", libro: "JUDAS", cap: 1, vIni: 12, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "2TIM Jds 1,4.18": { orig: "JUDAS 1,4.18", comp: "Judas 1,4.18", libro: "JUDAS", cap: 1, vIni: 4, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "2TES Jds 1,15": { orig: "JUDAS 1,15", comp: "Judas 1,15", libro: "JUDAS", cap: 1, vIni: 15, vFin: null, cont: null, cat: "Nuevo Testamento" },
  "OS Jds 1,12": { orig: "JUDAS 1,12", comp: "Judas 1,12", libro: "JUDAS", cap: 1, vIni: 12, vFin: null, cont: null, cat: "Nuevo Testamento" },

  // Citas con puntos dobles o puntuación colgante
  "SAL 22,6..": { orig: "SAL 22,6", comp: "Salmos 22,6", libro: "SAL", cap: 22, vIni: 6, vFin: null, cont: null, cat: "Salmos" },
  "JN 19,2s..": { orig: "JN 19,2s", comp: "Juan 19,2s", libro: "JN", cap: 19, vIni: 2, vFin: null, cont: "s", cat: "Evangelio" },
  "DT 4,40...": { orig: "DT 4,40", comp: "Deuteronomio 4,40", libro: "DT", cap: 4, vIni: 40, vFin: null, cont: null, cat: "Historicos" },
  "MT 18,8s p..": { orig: "MT 18,8s p", comp: "Mateo 18,8s p", libro: "MT", cap: 18, vIni: 8, vFin: null, cont: "s", cat: "Evangelio" },
  "PROV 2,19..": { orig: "PROV 2,19", comp: "Proverbios 2,19", libro: "PROV", cap: 2, vIni: 19, vFin: null, cont: null, cat: "Sapienciales" },
  "PROV 2,19s..": { orig: "PROV 2,19s", comp: "Proverbios 2,19s", libro: "PROV", cap: 2, vIni: 19, vFin: null, cont: "s", cat: "Sapienciales" },
  "JER 46,21..": { orig: "JER 46,21", comp: "Jeremías 46,21", libro: "JER", cap: 46, vIni: 21, vFin: null, cont: null, cat: "Profeticos" },
  "GEN 28,10..": { orig: "GEN 28,10", comp: "Génesis 28,10", libro: "GEN", cap: 28, vIni: 10, vFin: null, cont: null, cat: "Historicos" },
  "AM 1,3.6.": { orig: "AM 1,3.6", comp: "Amós 1,3.6", libro: "AM", cap: 1, vIni: 3, vFin: null, cont: null, cat: "Profeticos" }
};

// Reemplazos de texto HTML en el contenido de los artículos
const REEMPLAZOS_HTML = [
  ["<cite>Rom 10,e-10</cite>", "<cite>Rom 10,6-10</cite>"],
  ["<cite>2Cor 1,l8ss</cite>", "<cite>2Cor 1,18ss</cite>"],
  ["<cite>Gen 6,Sss</cite>", "<cite>Gen 6,5ss</cite>"],
  ["<cite>2Sam 7,Sss</cite>", "<cite>2Sam 7,5ss</cite>"],
  ["<cite>Is 56,Sss</cite>", "<cite>Is 56,5ss</cite>"],
  ["<cite>Jer 7,Sss</cite>", "<cite>Jer 7,5ss</cite>"],
  ["<cite>Heb 2,Sss</cite>", "<cite>Heb 2,5ss</cite>"],
  ["<cite>Rom 8,c3</cite>", "<cite>Rom 8,23</cite>"],
  ["<cite>Heb 12,l s</cite>", "<cite>Heb 12,1s</cite>"],
  ["<cite>Jer 2,l 1ss</cite>", "<cite>Jer 2,11ss</cite>"],
  ["<cite>Mt 2,i3</cite>", "<cite>Mt 2,13</cite>"],
  ["<cite>Gal 5,o.22</cite>", "<cite>Gal 5,6.22</cite>"],
  ["<cite>Sal 26,o</cite>", "<cite>Sal 26,6</cite>"],
  ["<cite>Jer 18,las</cite>", "<cite>Jer 18,11s</cite>"],
  ["<cite>1Cro 29,1 1 s</cite>", "<cite>1Cro 29,11s</cite>"],
  ["<cite>Is 55,1 1</cite>", "<cite>Is 55,11</cite>"],
  ["<cite>1Re 19,1 1ss</cite>", "<cite>1Re 19,11ss</cite>"],
  ["<cite>Jn 20,1 1ss</cite>", "<cite>Jn 20,11ss</cite>"],
  ["<cite>Ap 16,1 3s</cite>", "<cite>Ap 16,13s</cite>"],
  ["<cite>Zac 3,1 s</cite>", "<cite>Zac 3,1s</cite>"]
];

Object.entries(data.palabras).forEach(([palKey, palObj]) => {
  // Corregir contenido HTML
  if (palObj.contenido) {
    REEMPLAZOS_HTML.forEach(([bad, good]) => {
      if (palObj.contenido.includes(bad)) {
        palObj.contenido = palObj.contenido.replaceAll(bad, good);
        fixesCount++;
      }
    });
  }

  // Corregir lecturas
  const lecturas = palObj.lecturas || {};
  Object.entries(lecturas).forEach(([cat, citas]) => {
    citas.forEach(c => {
      const orig = (c.citaOriginal || '').trim();
      
      // 1. Reemplazos directos de tabla
      if (REEMPLAZOS_CITAS[orig]) {
        const rep = REEMPLAZOS_CITAS[orig];
        c.citaOriginal = rep.orig;
        c.citaCompleta = rep.comp;
        if (rep.libro) c.libro = rep.libro;
        if (rep.cap !== undefined) c.capitulo = rep.cap;
        if (rep.vIni !== undefined) c.versiculoInicio = rep.vIni;
        if (rep.vFin !== undefined) c.versiculoFin = rep.vFin;
        if (rep.cont !== undefined) c.continuidad = rep.cont;
        fixesCount++;
        return;
      }

      // 2. Limpieza de punto final colgante en citas simples (ej: 1SAM 10,1.)
      if (/\.$/.test(c.citaOriginal) && !c.citaOriginal.endsWith(' p.')) {
        c.citaOriginal = c.citaOriginal.replace(/\.+$/, '');
        c.citaCompleta = (c.citaCompleta || '').replace(/\.+$/, '');
        fixesCount++;
      }

      // 3. Limpieza de puntos dobles en citas (ej: SAL 22,6..)
      if (/\.\./.test(c.citaOriginal)) {
        c.citaOriginal = c.citaOriginal.replace(/\.\.+/g, '');
        c.citaCompleta = (c.citaCompleta || '').replace(/\.\.+/g, '');
        fixesCount++;
      }

      // 4. Limpieza de punto en vez de coma (ej: EX 20.3ss -> EX 20,3ss)
      if (/^[0-9]?[A-Z]+\s+[0-9]+\.[0-9]+/.test(c.citaOriginal) && !c.citaOriginal.includes(',')) {
        c.citaOriginal = c.citaOriginal.replace(/^([0-9]?[A-Z]+\s+[0-9]+)\.([0-9]+.*)$/, '$1,$2');
        c.citaCompleta = (c.citaCompleta || '').replace(/^([^0-9]+[0-9]+)\.([0-9]+.*)$/, '$1,$2');
        fixesCount++;
      }
    });
  });
});

console.log(`Correcciones aplicadas: ${fixesCount}`);

fs.writeFileSync('palabras.json', JSON.stringify(data, null, 2), 'utf8');
console.log("Archivo palabras.json guardado exitosamente.");
