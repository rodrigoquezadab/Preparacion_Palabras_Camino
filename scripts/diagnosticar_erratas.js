const fs = require('fs');

const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

const erratas = [];

Object.entries(data.palabras).forEach(([palKey, palObj]) => {
  const lecturas = palObj.lecturas || {};
  Object.entries(lecturas).forEach(([cat, citas]) => {
    citas.forEach((c, idx) => {
      const orig = c.citaOriginal || '';
      const comp = c.citaCompleta || '';
      
      // 1. Letras en vez de números en versículo (ej: ROM 10,e-10, 2COR 1,l8ss)
      if (/[0-9]+,[a-z]/i.test(orig) || /,[a-z][0-9]+/i.test(orig) || /[0-9]+[a-z][0-9]+/i.test(orig) || /[0-9]+,[a-z]-[0-9]+/i.test(orig)) {
        erratas.push({ tipo: 'letra_ocr_en_numero', palKey, cat, orig, comp, idx, item: c });
      }

      // 2. Citas pegadas o corruptas (ej: "DT Salmo 89", "JN 12,40,Is 6,9s", "1TES Jds 1,9")
      if (orig.includes('Salmo') || orig.includes('Is 6') || orig.includes('Jds')) {
        erratas.push({ tipo: 'cita_fusionada_o_mal_parseada', palKey, cat, orig, comp, idx, item: c });
      }

      // 3. Espacios en números (ej: 1CRO 29,1 1 s)
      if (/[0-9]+,\s*[0-9]+\s+[0-9]+/.test(orig)) {
        erratas.push({ tipo: 'espacio_en_numero', palKey, cat, orig, comp, idx, item: c });
      }

      // 4. Puntos dobles colgantes (ej: SAL 22,6..)
      if (/\.\./.test(orig)) {
        erratas.push({ tipo: 'puntos_dobles', palKey, cat, orig, comp, idx, item: c });
      }

      // 5. Punto en vez de coma en capítulos (ej: EX 20.3ss, JER 16.2, 1TIM 6.16)
      if (/^[0-9]?[A-Z]+\s+[0-9]+\.[0-9]+/.test(orig) && !orig.includes(',')) {
        erratas.push({ tipo: 'punto_en_vez_de_coma', palKey, cat, orig, comp, idx, item: c });
      }

      // 6. Punto final colgante (ej: AM 1,3.6., SAL 42,3.)
      if (/\.$/.test(orig.trim()) && !orig.endsWith(' p.')) {
        erratas.push({ tipo: 'punto_final_colgante', palKey, cat, orig, comp, idx, item: c });
      }
    });
  });
});

console.log('Total erratas categorizadas:', erratas.length);
console.log(JSON.stringify(erratas, null, 2));
