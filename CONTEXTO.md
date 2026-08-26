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

### C. Filtro de Solo Pentateuco (Torá / Ley)
- Permite restringir la **1ª Lectura** exclusivamente a los 5 libros de la Torá (Génesis, Éxodo, Levítico, Números, Deuteronomio).
- Oculta automáticamente las citas de los demás libros históricos (Josué a 2 Macabeos) para celebraciones donde se busca estrictamente una lectura de la Ley.
- Ajusta dinámicamente los conteos de perícopas, la verificación de 4 partes (`🌱 Precatecumenado`), el reparto en la Calculadora de Participantes y el esquema copiado.

### D. Gestor de Exclusiones
- Permite a la comunidad registrar palabras que ya se han preparado para que queden ocultas automáticamente de la lista.
- **Lista Predeterminada:** Precarga automáticamente los temas celebrados (#45 Escuchar, #2 Aceite, #57 Fiesta, #83 Memorial, #121 Roca, #40 Discípulo, #90 Niño, #4 Adán, #26 Copa, #11 Bautismo, #1 Agua, #105 Piedra, #8 Árbol, #15 Camino, #19 Casa, #21 Comida, #3 Amén, #129 Sello, #146 Victoria, #81 Mar, #147 Misericordia, #55 Fariseo, #78/#112 Llave-Puerta, Aleluya/Alabanza, #7 Amigo, #48 Esposo).
- **Acciones Rápidas:**
  * `🗑️ Borrar Todas`: Limpia todas las exclusiones para visualizar y explorar el catálogo completo de 148 palabras.
  * `🔄 Cargar Predeterminadas`: Restaura instantáneamente la lista de temas celebrados en la comunidad.
- Persistencia en el navegador mediante `localStorage`.

### E. Calculadora de Participantes y Reparto de Lecturas
- Permite a los hermanos preparadores indicar el **número de participantes** (ej. 2, 3, 4, 5, 6 o más hermanos).
- **Modo Rotativo / Alternado (Por Defecto):**
  * Asigna estrictamente por orden de lectura secuencial del texto de Léon-Dufour: la 1ª cita que aparece en el texto va al Hermano 1 (`#1`), la 2ª al Hermano 2 (`#2`), la 3ª al Hermano 3 (`#3`), la 4ª al Hermano 4 (`#4`), la 5ª de vuelta al Hermano 1 (`#5`), etc.
  * Independientemente de que una cita consecutiva omita el libro o haga referencia a la cita anterior (ej. `Gen 14,13` -> `21,22ss` -> `26,28` -> `31,43ss`), cada cita individual constituye un turno propio asignado al siguiente hermano en rotación, a menos que el usuario active la opción de *«Unir perícopas contiguas»*.
  * **Tratamiento Inteligente de Perícopas Unidas en la Lectura del Texto:** Cuando se activa la fusión de perícopas contiguas, la primera aparición de la perícopa en el artículo recibe el turno interactivo proclamable (`#1 [Gen 12,1-9 H1]`). Cualquier cita o fragmento posterior que pertenezca a esa misma perícopa ya asignada se muestra con borde punteado y distintivo especial `[12,5-9 🔗 Perícopa H1]`, bloqueando la apertura duplicada e indicando claramente mediante un toast explicativo a qué hermano y perícopa pertenece.
  * Garantiza una **alternancia perfecta** (nunca dos citas consecutivas al mismo hermano) y total sincronía entre el texto de Léon-Dufour, las tarjetas de participantes y el archivo compartido.
- **Criterios Alternativos por Bloques Continuos (Programación Dinámica Global $O(K \cdot N^2)$):**
  * Para comunidades que prefieran repartir la Biblia en tramos contiguos sin saltos ($Génesis \rightarrow Apocalipsis$).
  * 1. ⚖️ **Tiempo de Lectura (Caracteres Reales - DP Óptimo):** Distribuye equitativamente el volumen real de texto bíblico en caracteres (~25% cada hermano para 4 participantes).
  * 2. 📖 **Híbrido (Texto + Esfuerzo de Búsqueda):** Pondera tanto los caracteres reales como el costo de ubicar cada cita física en la Biblia.
  * 3. 🔢 **Cantidad de Citas:** Divide en bloques continuos de igual número de perícopas ($N / K$).
- **Texto Íntegro de Léon-Dufour con Asignaciones en Tiempo Real:**
  * En la propia ventana de reparto, los preparadores pueden alternar entre la pestaña **`📚 1. Lectura de Léon-Dufour Asignada`** y **`👥 2. Tarjetas por Participante`**.
  * Cada cita bíblica del artículo aparece con una pastilla interactiva coloreada con el distintivo del participante asignado (`[Gen 14,13 H1]`, `[21,22ss H2]`, `[26,28 H3]`, etc.).
  * Si se modifica el número de participantes (2 a 6+), el criterio o los filtros litúrgicos, todas las pastillas del artículo actualizan de inmediato el participante asignado.
  * Tocar cualquier pastilla abre directamente el texto íntegro en la *Biblia de Jerusalén*.
- **Badge de Equidad e Indicador de Turno:** Muestra en tiempo real el modo activo (`🔄 Turno Alternado (Rotativo)` o `⚖️ Balance Óptimo (±0.8%)`).
- **Badges de Caracteres y Porcentaje:** Cada tarjeta de participante muestra el número de lecturas, el total de caracteres (`🔤 ~8.180 car.`) y el porcentaje del texto total (`25%`).
- **Botones de Copia y Exportación para la Preparación:**
  * *Copia individual:* Genera el mensaje formateado con las citas asignadas a un hermano específico incluyendo conteo de caracteres por cita.
  * *Copia grupal (`📋 Copiar Reparto Completo`):* Genera el reparto completo de toda la preparación con el desglose de todos los participantes (H1, H2, H3, H4...), rangos y caracteres para enviarlo directamente al grupo de WhatsApp.
  * *Ficha Interactiva Autónoma (`📄 Compartir Ficha Interactiva (HTML con Votación)`):*
    - Genera y descarga un archivo `.html` 100% autónomo con fecha y hora en el nombre (ej. `preparacion_alianza_2026-08-26_00-09-58.html`) que puede ser enviado por WhatsApp y abierto en cualquier móvil o PC sin necesidad de internet ni servidores.
    - **Consistencia Total de Paleta de Colores ($H1 \dots H12$):** Cada participante posee su color predeterminado idéntico tanto en la aplicación principal como en el archivo HTML compartido (H1 Azul, H2 Verde, H3 Violeta, H4 Ámbar, H5 Rosa, H6 Cian, etc.).
    - **Selector de Identidad («Mi Rol en la Preparación»):** Permite a cada hermano seleccionar su rol (`👤 Soy Hermano 1`, `Hermano 2`...), resaltando con un halo dorado activo (`is-my-turn`) todas las lecturas bíblicas que le corresponden proclamar a él durante el artículo.
    - **Flujo Directo y Simple de Scroll Orgánico (Página Única Continua):**
      * **1. Lectura de Léon-Dufour (Superior):** Texto teológico íntegro con citas numeradas secuencialmente (`#1`, `#2`... `#N`) y badges de proclamador para que toda la comunidad lea al unísono. Al tocar cualquier cita se abre el lector bíblico con **versículos resaltados en amarillo cálido y auto-scroll** para emitir el **Voto Personal Privado** ($1 \dots 5$ estrellas).
      * **2. Escrutinio Colectivo con Filtros por Categoría (Directamente Debajo):** Sin necesidad de pestañas ni cambios de vista, haciendo scroll hacia abajo aparecen todas las lecturas organizadas con filtros rápidos de las 4 partes litúrgicas (*Todas*, *Históricos*, *Proféticos*, *Cartas/NT*, *Evangelio*, *Salmos*). Cada tarjeta muestra en paralelo la **referencia a tu voto personal** y los controles para registrar la **puntuación colectiva a viva voz** ($0 \dots N$ votos).
      * **3. Cuadro de Candidatas y Podio Litúrgico (Final de la Página):** Muestra en tiempo real las perícopas ganadoras (`🥇`) y empates (`⚡ Candidata en Empate`) de cada parte litúrgica, con botón directo `📋 Copiar Liturgia Ganadora` para WhatsApp.

### F. Área de Guía y Nomenclatura Bíblica
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

### G. Lectura Íntegra del Artículo Teológico de Xavier Léon-Dufour
- **Acceso Completo al Vocabulario Original:** Cada término teológico incluye un botón destacado (`📚 Leer Léon-Dufour` y `📚 Artículo`) para leer el artículo teológico íntegro y sin abreviar de la obra de Xavier Léon-Dufour (*Vocabulario de Teología Bíblica*).
- **Tipografía y Legibilidad Editorial:** Modal diseñado para lectura reposada y estudio bíblico, respetando la estructura original (introducción, desarrollo de la revelación en el AT y NT, divisiones numeradas y notas dogmáticas).
- **Citas Bíblicas Interactivas dentro del Texto:** Cada cita que aparece mencionada en el texto del artículo se transforma automáticamente en un botón interactivo (`<cite class="cite-pill">`). Al tocarlo, abre de inmediato el pasaje bíblico en la *Biblia de Jerusalén* por encima del artículo sin cerrar la lectura.
- **Navegación por Términos Relacionados:** Al final del artículo se listan los vocablos teológicos afines para saltar directamente a su estudio y preparación.
- **Copia Integral:** Permite copiar el texto del artículo completo al portapapeles para notas o resúmenes de preparación.

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
