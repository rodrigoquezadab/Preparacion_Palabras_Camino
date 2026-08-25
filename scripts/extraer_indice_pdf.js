const fs = require('fs');
const pdf = require('pdf-parse');

async function main() {
    console.log("Leyendo archivo PDF...");
    const dataBuffer = fs.readFileSync('leondufour.pdf');
    
    // Configurar para obtener páginas
    let pageCount = 0;
    const pagesWithKeywords = [];

    const options = {
        pagerender: function(pageData) {
            pageCount++;
            return pageData.getTextContent().then(function(textContent) {
                let lastY, text = '';
                for (let item of textContent.items) {
                    text += item.str + ' ';
                }
                const lower = text.toLowerCase();
                if (lower.includes('remisiones') || lower.includes('indice de articulos') || lower.includes('índice de artículos') || lower.includes('aclamacion') || lower.includes('aclamación')) {
                    pagesWithKeywords.push({
                        page: pageCount,
                        snippet: text.substring(0, 300)
                    });
                }
                return text;
            });
        }
    };

    console.log("Parseando PDF...");
    const data = await pdf(dataBuffer, options);
    console.log(`Total de páginas: ${data.numpages}`);
    console.log(`Páginas encontradas con palabras clave:`, pagesWithKeywords.slice(0, 20));

    // Guardar lista de páginas encontradas
    fs.writeFileSync('scripts/paginas_indice_detectadas.json', JSON.stringify({
        totalPages: data.numpages,
        matches: pagesWithKeywords
    }, null, 2));
}

main().catch(err => {
    console.error("Error procesando PDF:", err);
});
