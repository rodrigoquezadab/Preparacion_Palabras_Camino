const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
    console.log("Cargando leondufour.pdf...");
    const buf = fs.readFileSync('leondufour.pdf');
    const parser = new PDFParse({ data: buf });
    await parser.load();
    console.log(`Total páginas: ${parser.doc.numPages}`);

    console.log("Extrayendo texto de todas las páginas...");
    const res = await parser.getText();
    console.log(`Páginas extraídas: ${res.pages.length}`);

    // Buscar "índice de artículos", "remisiones", "aclamación", etc.
    const matches = [];
    for (let i = 0; i < res.pages.length; i++) {
        const p = res.pages[i];
        const text = p.text || '';
        const lower = text.toLowerCase();
        
        const hasIndice = lower.includes('indice') || lower.includes('índice');
        const hasRemisiones = lower.includes('remisiones') || lower.includes('remisión') || lower.includes('remision');
        const hasArticulos = lower.includes('articulos') || lower.includes('artículos');
        const hasAclamacion = lower.includes('aclamacion') || lower.includes('aclamación');

        if ((hasIndice && (hasRemisiones || hasArticulos)) || (hasRemisiones && hasArticulos) || (hasAclamacion && lower.includes('amén') || lower.includes('amen'))) {
            matches.push({
                pageIndex: i,
                pageNum: i + 1,
                hasIndice,
                hasRemisiones,
                hasArticulos,
                hasAclamacion,
                preview: text.substring(0, 400).replace(/\n+/g, ' ')
            });
        }
    }

    console.log(`Coincidencias encontradas: ${matches.length}`);
    console.log(JSON.stringify(matches, null, 2));

    // Guardar todo el texto de las páginas relevantes
    fs.writeFileSync('scripts/matches_indice.json', JSON.stringify(matches, null, 2));

    // También guardar páginas finales donde suele estar el índice (ej: últimas 30 páginas)
    const ultimasPaginas = [];
    const inicio = Math.max(0, res.pages.length - 40);
    for (let i = inicio; i < res.pages.length; i++) {
        ultimasPaginas.push({
            pageNum: i + 1,
            text: res.pages[i].text
        });
    }
    fs.writeFileSync('scripts/ultimas_paginas_pdf.json', JSON.stringify(ultimasPaginas, null, 2));
}

main().catch(err => {
    console.error("Error:", err);
});
