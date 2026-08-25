const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function main() {
    const buf = fs.readFileSync('leondufour.pdf');
    const parser = new PDFParse({ data: buf });
    await parser.load();
    const res = await parser.getText();

    console.log("Extrayendo páginas 426 a 436...");
    let fullIndiceText = "";
    for (let p = 425; p < res.pages.length; p++) {
        fullIndiceText += `\n\n=== PÁGINA ${p + 1} ===\n\n` + res.pages[p].text;
    }

    fs.writeFileSync('scripts/indice_articulos_completo.txt', fullIndiceText);
    console.log("Guardado en scripts/indice_articulos_completo.txt");
    console.log("Muestra del inicio del índice:\n", fullIndiceText.substring(0, 1500));
}

main().catch(console.error);
