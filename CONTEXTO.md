# Documentación y Contexto de la Aplicación: Preparación de Palabras del Camino

## 1. Visión General y Propósito

Esta aplicación web está diseñada para **facilitar y enriquecer la preparación de la Liturgia de la Palabra en las comunidades del Camino Neocatecumenal**. 

En la praxis litúrgica del Camino, cada semana un grupo de hermanos de la comunidad prepara la celebración de la Palabra en torno a un tema o palabra bíblica extraída del **Vocabulario de Teología Bíblica de Xavier Léon-Dufour**. 

La aplicación permite a los preparadores:
1. **Buscar y seleccionar palabras/temas** del Vocabulario de Xavier Léon-Dufour.
2. **Conocer con exactitud todas las citas bíblicas** asociadas a cada palabra teológica (más de 25.800 citas analizadas).
3. **Verificar si una palabra cumple el criterio litúrgico de las 4 partes de la Biblia** para constituir una celebración completa.
4. **Visualizar el recuento exacto de citas** por categoría bíblica y ordenar las palabras según su abundancia de citas (de mayor a menor o viceversa) o alfabéticamente.
5. **Unir y consolidar segmentos contiguos o solapados de lecturas** dentro de un mismo libro y capítulo (motor de intervalos), permitiendo a los hermanos identificar perícopas continuas para su proclamación en la liturgia.
6. **Consultar y leer el texto bíblico completo** en pantalla en un modal optimizado con versículos resaltados y copiado rápido.
7. **Diseño Mobile-First con Tooltips Explicativos:** Interfaz ergonómica para teléfonos móviles (usados comúnmente en las reuniones de preparación) con textos explicativos al pasar el cursor o mantener pulsado cualquier botón o control.

---

## 2. Criterios Litúrgicos del Camino Neocatecumenal

### Las 4 Partes de la Escritura en una Preparación
Una celebración típica de la Liturgia de la Palabra en el Camino Neocatecumenal se compone armónicamente de lecturas que abarcan la totalidad de la Historia de la Salvación:

1. **Primera Lectura — Históricos / Ley (Torá):**
   - *Libros:* Génesis, Éxodo, Levítico, Números, Deuteronomio, Josué, Jueces, Rut, 1 y 2 Samuel, 1 y 2 Reyes, 1 y 2 Crónicas, Esdras, Nehemías, Tobías, Judit, Ester, 1 y 2 Macabeos.
   - *Color Litúrgico:* Verde (`#059669`).
   - *Sentido:* Revelación del Dios vivo en la historia de los patriarcas y del pueblo de Israel.
2. **Segunda Lectura — Profetas:**
   - *Libros:* Isaías, Jeremías, Lamentaciones, Baruc, Ezequiel, Daniel, Oseas, Joel, Amós, Abdías, Jonás, Miqueas, Nahúm, Habacuc, Sofonías, Ageo, Zacarías, Malaquías.
   - *Color Litúrgico:* Rojo Carmesí (`#dc2626`).
   - *Sentido:* El anuncio profético, la llamada a la conversión y la promesa mesiánica.
3. **Tercera Lectura — Cartas / Nuevo Testamento:**
   - *Libros:* Hechos de los Apóstoles, Romanos, 1 y 2 Corintios, Gálatas, Efesios, Filipenses, Colosenses, 1 y 2 Tesalonicenses, 1 y 2 Timoteo, Tito, Filemón, Hebreos, Santiago, 1 y 2 Pedro, 1, 2 y 3 Juan, Judas, Apocalipsis.
   - *Color Litúrgico:* Violeta / Púrpura Apostólico (`#7c3aed`).
   - *Sentido:* La vida de la Iglesia apostólica, la teología de la Gracia y la escatología.
4. **Cuarta Lectura — Evangelio:**
   - *Libros:* Mateo, Marcos, Lucas, Juan.
   - *Color Litúrgico:* Dorado / Ámbar (`#d97706`).
   - *Sentido:* Cumplimiento de todas las Escrituras en la Persona, Muerte y Resurrección de Jesucristo.

### Categorías Complementarias
- **Salmos:** Libro de los Salmos (usados para el canto/salmo responsorial entre lecturas).
- **Sapienciales:** Job, Proverbios, Eclesiastés (Qohélet), Cantar de los Cantares, Sabiduría, Eclesiástico (Sirácida).

### Lista Oficial de las 148 Palabras del Precatecumenado
En la praxis de las comunidades del Camino Neocatecumenal, la preparación de la Liturgia de la Palabra durante la fase del **Precatecumenado** sigue el **documento y temario oficial de 148 palabras numeradas** (desde la `1. Agua`, `2. Aceite`, `3. Amén`, `4. Adán`... hasta la `148. Voluntad de Dios`). 

La aplicación integra este catálogo exacto y ofrece un **selector de modo destacado en la barra principal**:
1. **`🌱 Precatecumenado (148 Palabras)` (Activado por defecto):** Muestra directamente las **148 palabras del documento oficial del Camino** respetando su numeración `#1` a `#148` y su orden original, enlazadas directamente a los textos y citas teológicas del *Vocabulario de Xavier Léon-Dufour*.
2. **`📚 Todas las Palabras (289)`:** Permite alternar con un solo toque al vocabulario completo de los **289 términos** de Xavier Léon-Dufour, identificando con una insignia verde cuáles pertenecen al temario del Precatecumenado.
3. **Criterio de Ordenación Flexible:** Permite ordenar por `#️⃣ Orden Oficial del Precatecumenado (1-148)`, `🔤 Alfabético (A-Z)`, `📊 Mayor/Menor cantidad de citas` o por abundancia en cada una de las 4 partes litúrgicas.

---

## 3. Fuente de Datos Oficial: `leondufour.com` & Biblia de Jerusalén

- **Sincronización y Auditoría Completa:** Migración y verificación del 100% de los datos contra el repositorio oficial de **Xavier Léon-Dufour** ([leondufour.com](https://leondufour.com/)).
- **289 términos teológicos canónicos**.
- **25.845 citas bíblicas exactas auditadas:**
  * Resolución de herencia contextual de libros para citas correlativas.
  * Mapeo de todas las variantes de abreviaturas bíblicas en español.
  * Preservación estricta de la puntuación original: rangos discontinuos (`Sal 33,1-3.21`, `Dan 3,26-45.51-90`), paralelos (`Mt 19,4s p`, `Mt 6,25 p`), continuidades (`Gen 13,15ss`, `Gen 22,1s`), citas intercapitulares (`Ef 4,25-5,2`, `1Jn 4,7-5,4`) y versículos no contiguos (`Gen 4,1.25`, `Sal 89,4ss.20-38`).
  * Tratamiento de libros monovirtuales (Abdías, Filemón, 2 Juan, 3 Juan, Judas).
- **1.335 capítulos bíblicos integrados (35.549 versículos):** Cobertura del **100.00%** de los 73 libros canónicos de la **Biblia de Jerusalén** sin textos faltantes ni citas huérfanas. Cero errores de referencia.

---

## 4. Arquitectura y Funcionalidades Clave

### A. Diseño Mobile-First & Experiencia de Usuario
- **Mobile First:** Maquetación orientada a teléfonos inteligentes con targets táctiles amplios, encabezado compacto y tarjetas colapsables.
- **Tooltips Explicativos:** Cada botón (Unir perícopas, Copiar esquema, Excluir, Filtro 4 grupos, Citas bíblicas) cuenta con atributo `title` descriptivo para que cualquier usuario comprenda su función de inmediato.
- **Modo Responsive:** En tabletas y pantallas de escritorio se expande automáticamente a una cuadrícula de 2 a 4 columnas por categoría bíblica.

### B. Motor de Fusión de Intervalos (`unirSegmentosContiguos`)
- Fusión matemática de citas en el mismo libro y capítulo:
  * $[1, 4] \cup [5, 9] \rightarrow [1, 9]$
  * $[1, 6] \cup [4, 10] \rightarrow [1, 10]$
  * Preservación de citas disjuntas y capítulos completos.
- Botón interactivo para alternar entre "Perícopas Unidas" (para proclamación) y "Citas Sueltas" (fuente original).

### C. Gestor de Exclusiones
- Permite a la comunidad registrar palabras que ya se han preparado para que queden ocultas automáticamente.
- Persistencia en el navegador mediante `localStorage`.

### D. Calculadora de Participantes y Reparto Lineal Continuo
- Permite a los hermanos preparadores indicar el **número de participantes** (ej. 2, 3, 4, 5, 6 o más hermanos).
- **Optimización de Búsqueda Lineal:** Las lecturas se distribuyen en **estricto orden canónico bíblico continuo** ($Génesis \rightarrow Apocalipsis$).
- **Sin Saltos en la Biblia:** Cada hermano recibe un bloque contiguo de libros y capítulos (ej. *Hermano 1: Génesis a Jueces*, *Hermano 2: 1 Samuel a Salmos*, etc.), de modo que avanza siempre hacia adelante buscando sus citas sin necesidad de retroceder ni dar saltos en su Biblia física.
- **Transparencia y Balance por Caracteres:** El algoritmo evalúa el **volumen real de texto en caracteres** de cada perícopa en la *Biblia de Jerusalén*. Esto explica y transparenta por qué un hermano con lecturas de 1 solo versículo puede recibir más citas (ej. 16) y otro con capítulos extensos menos citas (ej. 6), manteniendo ambos una carga y tiempo de lectura equivalentes (~3.200 caracteres).
- **Badges de Caracteres y Porcentaje:** Cada tarjeta de participante muestra el número de lecturas, el total de caracteres (`🔤 ~8.180 car.`) y el porcentaje del texto total (`26%`).
- **Botones de Copia para WhatsApp:**
  * *Copia individual:* Genera el mensaje formateado con las citas asignadas a un hermano específico incluyendo conteo de caracteres por cita.
  * *Copia grupal:* Genera el reparto completo de toda la preparación con el desglose de caracteres para enviarlo directamente al grupo de la comunidad.

### E. Área de Guía y Nomenclatura Bíblica
- **Acceso Directo en Header (`📖 Guía`):** Despliega un centro de ayuda litúrgica y teológica interactivo organizado en 3 secciones:
  1. *Criterios del Camino:* Explicación de las 4 partes fundamentales de la Escritura en la Liturgia de la Palabra (Históricos, Proféticos, Cartas/NT, Evangelio) y cómo mantener el hilo conductor temático.
  2. *Nomenclatura y Puntuación Bíblica:*
     - Letra `s` (versículo siguiente, ej. `Gen 12,1s` = vv. 1 y 2).
     - Letras `ss` (versículos siguientes hasta el final de la sección, ej. `Gen 13,15ss`).
     - Letra `p` (pasajes paralelos en los otros Evangelios, ej. `Mt 6,25 p`).
     - Coma `,` (separa capítulo de versículo, ej. `Jn 3,16`).
     - Guion `-` (rango continuo, ej. `Gen 12,1-9` o `Gen 11,27-12,4`).
     - Punto `.` (versículos no contiguos, ej. `Gen 4,1.25`).
     - Punto y coma `;` (separa citas independientes).
     - Letras `a`, `b`, `c` (frases o cláusulas sucesivas de un mismo versículo: `a` = 1ª frase, `b` = 2ª frase, `c` = 3ª frase, muy común en versículos poéticos o largos con 3 partes).
  3. *Uso de la Aplicación:* Detalle de perícopas unidas, calculadora lineal y gestión de exclusiones.

---

## 5. Estructura de Archivos del Proyecto

```
Preparacion_Palabras_Camino/
├── CONTEXTO.md              # Documentación y contexto del proyecto
├── index.html               # Interfaz Mobile-First, diseño litúrgico y tooltips
├── js/
│   └── app.js               # Motor de datos, unión de perícopas, modal y filtros
├── palabras.json            # Base de datos completa (289 palabras, 25.845 citas y textos bíblicos)
└── scripts/
    └── build_database.js    # Generador de palabras.json desde leondufour.com
```
