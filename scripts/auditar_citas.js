const fs = require('fs');

const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));

const errors = [];

const LIBROS_VALIDOS = new Set([
  "GEN", "EX", "LEV", "NUM", "DT", "JOS", "JUE", "RUT", "1SAM", "2SAM", "1RE", "2RE", "1CRO", "2CRO", "ESD", "NEH", "TOB", "JUD", "EST", "1MAC", "2MAC",
  "JOB", "SAL", "PROV", "ECL", "CANT", "SAB", "ECLO",
  "IS", "JER", "LAM", "BAR", "EZ", "DAN", "OS", "JL", "AM", "ABD", "JON", "MIQ", "NAH", "HAB", "SOF", "AG", "ZAC", "MAL",
  "MT", "MC", "LC", "JN", "HCH", "ROM", "1COR", "2COR", "GAL", "EF", "FLP", "COL", "1TES", "2TES", "1TIM", "2TIM", "TIT", "FLM", "HEB", "ST", "1PE", "2PE", "1JN", "2JN", "3JN", "JUDAS", "AP"
]);

Object.entries(data.palabras).forEach(([palKey, palObj]) => {
  const lecturas = palObj.lecturas || {};
  Object.entries(lecturas).forEach(([cat, citas]) => {
    citas.forEach((c, idx) => {
      const orig = c.citaOriginal || '';
      const comp = c.citaCompleta || '';
      const vIni = c.versiculoInicio;
      const vFin = c.versiculoFin;
      const cont = c.continuidad;
      const cap = c.capitulo;
      const lib = c.libro;

      // 1. Libro inválido
      if (!LIBROS_VALIDOS.has((lib || '').toUpperCase())) {
        errors.push({ tipo: 'libro_invalido', palabra: palKey, cat, orig, lib, idx });
      }

      // 2. Erratas de letras dentro de números (ej: 10,e-10)
      if (/[0-9]+,[a-z]/i.test(orig) || /,[a-z]/i.test(orig)) {
        errors.push({ tipo: 'letra_en_versiculo', palabra: palKey, cat, orig, comp, idx });
      }

      // 3. Puntos suspensivos raros en cita (ej: ..)
      if (/\.\./.test(orig) || /\.\s*\./.test(orig)) {
        errors.push({ tipo: 'puntos_dobles', palabra: palKey, cat, orig, comp, idx });
      }

      // 4. vFin menor que vIni (excepto cuando vFin es capítulo en rango multiversículo mal parseado como 2MAC 6,18-7,42)
      if (vIni !== null && vFin !== null && vFin < vIni && !orig.includes('-')) {
        errors.push({ tipo: 'vFin_menor_vIni', palabra: palKey, cat, orig, vIni, vFin, idx });
      }

      // 5. Citas con libro repetido o fusionado como "1TES Jds 1,9"
      if (/([0-9]?[A-Z]+)\s+([0-9]?[A-Z]+)/i.test(orig)) {
        errors.push({ tipo: 'dos_libros_en_cita', palabra: palKey, cat, orig, comp, idx });
      }

      // 6. Citas donde falta coma o punto raro (ej: "JER 16.2" o "1TIM 6.16")
      if (/[A-Z0-9]+\s+[0-9]+\.[0-9]+/.test(orig)) {
        errors.push({ tipo: 'punto_en_vez_de_coma', palabra: palKey, cat, orig, comp, idx });
      }

      // 7. Puntuación final colgante (ej: "AM 1,3.6.")
      if (/\.$/.test(orig.trim())) {
        errors.push({ tipo: 'punto_final_colgante', palabra: palKey, cat, orig, comp, idx });
      }

      // 8. Espacio raro en continuidad (ej: "ZAC 3,1 s")
      if (/[0-9]+\s+[s|ss|p]$/.test(orig.trim()) && !orig.endsWith(' p')) {
        errors.push({ tipo: 'espacio_en_continuidad', palabra: palKey, cat, orig, comp, idx });
      }

      // 9. Rango entre capítulos tipo 2MAC 6,18-7,42 donde vFin se parseó como 7
      if (/[0-9]+,[0-9]+-[0-9]+,[0-9]+/.test(orig)) {
        errors.push({ tipo: 'rango_entre_capitulos', palabra: palKey, cat, orig, comp, vIni, vFin, idx });
      }
    });
  });
});

console.log('Total de anomalías detectadas:', errors.length);
console.log(JSON.stringify(errors, null, 2));
