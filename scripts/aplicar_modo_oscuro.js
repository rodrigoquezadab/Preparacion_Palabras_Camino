const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inyectar script de inicialización inmediata de tema en <head>
if (!html.includes('tema_preferido')) {
  const themeInitScript = `  <!-- Inicialización inmediata de Tema (Modo Oscuro por Defecto) -->
  <script>
    (function () {
      var saved = localStorage.getItem('tema_preferido') || 'dark';
      document.documentElement.setAttribute('data-theme', saved);
    })();
  </script>\n`;
  html = html.replace('<link rel="stylesheet"', themeInitScript + '  <link rel="stylesheet"');
}

// 2. Reemplazar definición de variables :root y [data-theme="light"]
const oldVariables = `    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Cinzel', Georgia, serif;

      /* Paleta Principal */
      --bg-app: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-hover: #f1f5f9;
      --border-color: #e2e8f0;
      --border-dark: #cbd5e1;

      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-light: #94a3b8;

      --primary: #1e3a8a;
      --primary-hover: #1e40af;
      --primary-light: #dbeafe;

      --gold-accent: #b45309;
      --gold-light: #fef3c7;

      /* Colores Litúrgicos de las 4 Partes Bíblicas */
      --color-hist: #059669;
      /* Verde Torá / Alianza */
      --bg-hist-light: #ecfdf5;
      --border-hist: #a7f3d0;

      --color-prof: #dc2626;
      /* Rojo Fuego Profético */
      --bg-prof-light: #fef2f2;
      --border-prof: #fecaca;

      --color-nt: #7c3aed;
      /* Púrpura Apostólico / Cartas */
      --bg-nt-light: #f5f3ff;
      --border-nt: #ddd6fe;

      --color-ev: #d97706;
      /* Dorado / Luz de Cristo */
      --bg-ev-light: #fffbeb;
      --border-ev: #fde68a;

      --color-sal: #0284c7;
      /* Azul Salmos */
      --bg-sal-light: #f0f9ff;
      --border-sal: #bae6fd;

      --color-sap: #475569;
      /* Pizarra Sapiencial */
      --bg-sap-light: #f8fafc;
      --border-sap: #e2e8f0;

      /* Sombras */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
    }`;

const newVariables = `    /* ==========================================================================
       VARIABLES Y SISTEMA DE DISEÑO (MODO OSCURO POR DEFECTO / MODO CLARO)
       ========================================================================== */
    :root,
    [data-theme="dark"] {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-serif: 'Cinzel', Georgia, serif;

      /* Paleta Principal Modo Oscuro (Predeterminado) */
      --bg-app: #090d16;
      --bg-card: #131b2e;
      --bg-card-hover: #1c2740;
      --bg-input: #090d16;
      --bg-modal: #111827;
      --bg-modal-header: linear-gradient(135deg, #090d16 0%, #1e3a8a 100%);
      --border-color: #233047;
      --border-dark: #334360;

      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-light: #64748b;

      --primary: #3b82f6;
      --primary-hover: #60a5fa;
      --primary-light: rgba(59, 130, 246, 0.18);

      --gold-accent: #fbbf24;
      --gold-light: rgba(245, 158, 11, 0.18);

      /* Colores Litúrgicos de las 4 Partes Bíblicas */
      --color-hist: #34d399;
      /* Verde Torá */
      --bg-hist-light: rgba(16, 185, 129, 0.16);
      --border-hist: rgba(16, 185, 129, 0.35);

      --color-prof: #f87171;
      /* Rojo Profético */
      --bg-prof-light: rgba(239, 68, 68, 0.16);
      --border-prof: rgba(239, 68, 68, 0.35);

      --color-nt: #c084fc;
      /* Púrpura Apostólico / Cartas */
      --bg-nt-light: rgba(168, 85, 247, 0.16);
      --border-nt: rgba(168, 85, 247, 0.35);

      --color-ev: #fbbf24;
      /* Dorado / Evangelio */
      --bg-ev-light: rgba(245, 158, 11, 0.16);
      --border-ev: rgba(245, 158, 11, 0.35);

      --color-sal: #38bdf8;
      /* Azul Salmos */
      --bg-sal-light: rgba(56, 189, 248, 0.16);
      --border-sal: rgba(56, 189, 248, 0.35);

      --color-sap: #94a3b8;
      /* Pizarra Sapiencial */
      --bg-sap-light: rgba(148, 163, 184, 0.16);
      --border-sap: rgba(148, 163, 184, 0.3);

      /* Sombras */
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5);

      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-full: 9999px;
    }

    [data-theme="light"] {
      /* Paleta Modo Claro */
      --bg-app: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-hover: #f1f5f9;
      --bg-input: #ffffff;
      --bg-modal: #ffffff;
      --bg-modal-header: linear-gradient(135deg, #1e293b 0%, #1e3a8a 100%);
      --border-color: #e2e8f0;
      --border-dark: #cbd5e1;

      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-light: #94a3b8;

      --primary: #1e3a8a;
      --primary-hover: #1e40af;
      --primary-light: #dbeafe;

      --gold-accent: #b45309;
      --gold-light: #fef3c7;

      --color-hist: #059669;
      --bg-hist-light: #ecfdf5;
      --border-hist: #a7f3d0;

      --color-prof: #dc2626;
      --bg-prof-light: #fef2f2;
      --border-prof: #fecaca;

      --color-nt: #7c3aed;
      --bg-nt-light: #f5f3ff;
      --border-nt: #ddd6fe;

      --color-ev: #d97706;
      --bg-ev-light: #fffbeb;
      --border-ev: #fde68a;

      --color-sal: #0284c7;
      --bg-sal-light: #f0f9ff;
      --border-sal: #bae6fd;

      --color-sap: #475569;
      --bg-sap-light: #f8fafc;
      --border-sap: #e2e8f0;

      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    }`;

html = html.replace(oldVariables, newVariables);

// 3. Reemplazos de CSS específicos para asegurar coherencia en modo oscuro
const CSS_REPLACEMENTS = [
  ['.search-section {\n      background: #ffffff;', '.search-section {\n      background: var(--bg-card);'],
  ['.input-search:focus {\n      outline: none;\n      border-color: var(--primary);\n      background-color: #ffffff;', '.input-search:focus {\n      outline: none;\n      border-color: var(--primary);\n      background-color: var(--bg-card);'],
  ['.select-custom {\n      padding: 6px 10px;\n      font-size: 0.8rem;\n      font-family: inherit;\n      font-weight: 600;\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-sm);\n      background-color: #ffffff;', '.select-custom {\n      padding: 6px 10px;\n      font-size: 0.8rem;\n      font-family: inherit;\n      font-weight: 600;\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-sm);\n      background-color: var(--bg-card);'],
  ['.advanced-panel {\n      background: #ffffff;', '.advanced-panel {\n      background: var(--bg-card);'],
  ['.btn-exclusion-action {\n      background: #ffffff;', '.btn-exclusion-action {\n      background: var(--bg-card);'],
  ['.word-card-body {\n      border-top: 1px solid var(--border-color);\n      background: #ffffff;', '.word-card-body {\n      border-top: 1px solid var(--border-color);\n      background: var(--bg-card);'],
  ['.btn-action {\n      background: #ffffff;', '.btn-action {\n      background: var(--bg-card);'],
  ['.modal-card {\n      background: #ffffff;', '.modal-card {\n      background: var(--bg-modal);'],
  ['.modal-header {\n      background: linear-gradient(135deg, #1e293b 0%, #1e3a8a 100%);', '.modal-header {\n      background: var(--bg-modal-header);'],
  ['.btn-counter {\n      width: 32px;\n      height: 32px;\n      border-radius: var(--radius-sm);\n      border: 1px solid var(--border-dark);\n      background: #ffffff;', '.btn-counter {\n      width: 32px;\n      height: 32px;\n      border-radius: var(--radius-sm);\n      border: 1px solid var(--border-dark);\n      background: var(--bg-card);'],
  ['.chip-num {\n      padding: 4px 8px;\n      font-size: 0.75rem;\n      font-weight: 700;\n      border: 1px solid var(--border-color);\n      background: #ffffff;', '.chip-num {\n      padding: 4px 8px;\n      font-size: 0.75rem;\n      font-weight: 700;\n      border: 1px solid var(--border-color);\n      background: var(--bg-card);'],
  ['.calc-select-criterio {\n      padding: 6px 10px;\n      font-size: 0.8rem;\n      font-family: inherit;\n      font-weight: 600;\n      border: 1.5px solid var(--border-color);\n      border-radius: var(--radius-sm);\n      background: #ffffff;', '.calc-select-criterio {\n      padding: 6px 10px;\n      font-size: 0.8rem;\n      font-family: inherit;\n      font-weight: 600;\n      border: 1.5px solid var(--border-color);\n      border-radius: var(--radius-sm);\n      background: var(--bg-card);'],
  ['.hermano-card {\n      background: #ffffff;', '.hermano-card {\n      background: var(--bg-card);'],
  ['.btn-copiar-hermano {\n      background: #ffffff;', '.btn-copiar-hermano {\n      background: var(--bg-card);'],
  ['.guia-tab-btn {\n      background: #ffffff;', '.guia-tab-btn {\n      background: var(--bg-card);'],
  ['.guia-part-box {\n      background: #ffffff;', '.guia-part-box {\n      background: var(--bg-card);'],
  ['.nomenclatura-table-wrapper {\n      overflow-x: auto;\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-md);\n      background: #ffffff;', '.nomenclatura-table-wrapper {\n      overflow-x: auto;\n      border: 1px solid var(--border-color);\n      border-radius: var(--radius-md);\n      background: var(--bg-card);'],
  ['.btn-citation {\n      background: #ffffff;', '.btn-citation {\n      background: var(--bg-card);'],
  ['.modal-body-articulo {\n      font-family: \'Merriweather\', Georgia, \'Times New Roman\', serif;\n      font-size: 1.02rem;\n      line-height: 1.8;\n      color: #1e293b;\n      background: #fafaf9;', '.modal-body-articulo {\n      font-family: \'Merriweather\', Georgia, \'Times New Roman\', serif;\n      font-size: 1.02rem;\n      line-height: 1.8;\n      color: var(--text-main);\n      background: var(--bg-card);'],
  ['.chip-relacionado {\n      background: #ffffff;\n      border: 1px solid #cbd5e1;\n      color: #334155;', '.chip-relacionado {\n      background: var(--bg-card);\n      border: 1px solid var(--border-dark);\n      color: var(--text-main);'],
  ['.modal-body {\n      padding: 16px 20px;\n      overflow-y: auto;\n      flex: 1;\n      font-size: 0.95rem;\n      line-height: 1.7;\n      color: #334155;', '.modal-body {\n      padding: 16px 20px;\n      overflow-y: auto;\n      flex: 1;\n      font-size: 0.95rem;\n      line-height: 1.7;\n      color: var(--text-main);'],
  ['.guia-text {\n      font-size: 0.88rem;\n      color: #334155;\n      line-height: 1.6;', '.guia-text {\n      font-size: 0.88rem;\n      color: var(--text-main);\n      line-height: 1.6;'],
  ['.nomenclatura-table td {\n      padding: 10px 12px;\n      border-bottom: 1px solid var(--border-color);\n      color: #334155;', '.nomenclatura-table td {\n      padding: 10px 12px;\n      border-bottom: 1px solid var(--border-color);\n      color: var(--text-main);'],
  ['.nomenclatura-table th {\n      background: #f1f5f9;', '.nomenclatura-table th {\n      background: var(--bg-app);'],
  ['.symbol-chip {\n      display: inline-block;\n      background: #e2e8f0;\n      color: #0f172a;\n      font-family: monospace;\n      font-size: 0.95rem;\n      font-weight: bold;\n      padding: 2px 8px;\n      border-radius: var(--radius-sm);\n      border: 1px solid #cbd5e1;', '.symbol-chip {\n      display: inline-block;\n      background: var(--bg-app);\n      color: var(--text-main);\n      font-family: monospace;\n      font-size: 0.95rem;\n      font-weight: bold;\n      padding: 2px 8px;\n      border-radius: var(--radius-sm);\n      border: 1px solid var(--border-dark);'],
  ['.highlighted-verse {\n      background: #fef08a;\n      color: #854d0e;\n      padding: 3px 6px;\n      border-radius: 4px;\n      font-weight: 500;\n      border-left: 3px solid #eab308;', '.highlighted-verse {\n      background: var(--gold-light);\n      color: var(--gold-accent);\n      padding: 3px 6px;\n      border-radius: 4px;\n      font-weight: 600;\n      border-left: 3px solid var(--gold-accent);']
];

CSS_REPLACEMENTS.forEach(([bad, good]) => {
  html = html.replace(bad, good);
});

// 4. Agregar botón de cambio de tema en el header de index.html
const oldHeaderActions = `      <div class="header-actions">
        <button id="btnToggleSearch" class="btn-toggle-filters active"
          title="Toca para ocultar o mostrar el buscador y los filtros rápidos">
          <span>🔍</span><span class="btn-text-full"> Buscar</span>
        </button>`;

const newHeaderActions = `      <div class="header-actions">
        <button id="btnToggleTema" class="btn-toggle-filters"
          title="Cambiar entre modo oscuro y modo claro">
          <span id="themeIcon">☀️</span><span class="btn-text-full" id="themeText"> Claro</span>
        </button>
        <button id="btnToggleSearch" class="btn-toggle-filters active"
          title="Toca para ocultar o mostrar el buscador y los filtros rápidos">
          <span>🔍</span><span class="btn-text-full"> Buscar</span>
        </button>`;

html = html.replace(oldHeaderActions, newHeaderActions);

// 5. Bump script version
html = html.replace(/app\.js\?v=[0-9\.]+/, 'app.js?v=3.0');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html actualizado para Modo Oscuro por Defecto.');
