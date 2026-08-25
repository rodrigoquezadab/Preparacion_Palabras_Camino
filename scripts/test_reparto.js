const fs = require('fs');
const data = JSON.parse(fs.readFileSync('palabras.json', 'utf8'));
const dbTextos = data.textos || {};

function calcularCaracteresCita(cita) {
    if (!cita || !cita.textoRef) return 150;
    const rawHtml = dbTextos[cita.textoRef];
    if (!rawHtml) {
        const ini = cita.versiculoInicio || 1;
        const fin = (cita.continuidad === 's' ? ini + 1 : (cita.continuidad === 'ss' ? ini + 5 : (cita.versiculoFin || ini)));
        return Math.max(100, (fin - ini + 1) * 150);
    }
    const ini = cita.versiculoInicio;
    const fin = cita.versiculoFin;
    const cont = cita.continuidad;
    if (!ini && !fin && !cont) {
        const plain = rawHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return plain.length || 1500;
    }
    const verseRegex = /<strong>(\d+)<\/strong>\s*-\s*([^<]*)/g;
    let m, totalChars = 0, foundAny = false;
    const vStart = ini || 1;
    let vEnd = fin || vStart;
    if (cont === 's') vEnd = vStart + 1;
    else if (cont === 'ss') vEnd = 9999;
    while ((m = verseRegex.exec(rawHtml)) !== null) {
        const vNum = parseInt(m[1], 10);
        if (vNum >= vStart && vNum <= vEnd) {
            foundAny = true;
            totalChars += m[2].trim().length;
        }
    }
    if (!foundAny || totalChars === 0) {
        const count = vEnd >= 9990 ? 5 : (vEnd - vStart + 1);
        return Math.max(100, count * 150);
    }
    return totalChars;
}

function currentGreedy(citas, k) {
    const n = citas.length;
    const weights = citas.map(c => calcularCaracteresCita(c));
    const total = weights.reduce((a, b) => a + b, 0);
    const target = total / k;
    const partitions = [];
    let startIdx = 0;
    for (let p = 0; p < k; p++) {
        if (p === k - 1) {
            const slice = citas.slice(startIdx);
            const sum = slice.reduce((s, c) => s + calcularCaracteresCita(c), 0);
            partitions.push({ sum, count: slice.length });
            break;
        }
        const remaining = k - p - 1;
        const maxIdx = n - remaining;
        let accum = 0;
        let bestIdx = startIdx + 1;
        let bestDiff = Infinity;
        for (let i = startIdx; i < maxIdx; i++) {
            accum += weights[i];
            const diff = Math.abs(accum - target);
            if (diff < bestDiff) {
                bestDiff = diff;
                bestIdx = i + 1;
            }
        }
        const slice = citas.slice(startIdx, bestIdx);
        const sum = slice.reduce((s, c) => s + calcularCaracteresCita(c), 0);
        partitions.push({ sum, count: slice.length });
        startIdx = bestIdx;
    }
    return partitions;
}

function dpMinVariance(citas, k) {
    const n = citas.length;
    if (k >= n) return citas.map((c, i) => i + 1);
    const weights = citas.map(c => calcularCaracteresCita(c));
    const pref = [0];
    for (let i = 0; i < n; i++) pref.push(pref[i] + weights[i]);
    const total = pref[n];
    const target = total / k;
    
    const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(Infinity));
    const parent = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0));
    dp[0][0] = 0;
    
    for (let p = 1; p <= k; p++) {
        for (let i = p; i <= n - (k - p); i++) {
            for (let j = p - 1; j < i; j++) {
                const sum = pref[i] - pref[j];
                const cost = dp[p - 1][j] + Math.pow(sum - target, 2);
                if (cost < dp[p][i]) {
                    dp[p][i] = cost;
                    parent[p][i] = j;
                }
            }
        }
    }
    const splits = [];
    let curr = n;
    for (let p = k; p >= 1; p--) {
        splits.unshift(curr);
        curr = parent[p][curr];
    }
    splits.unshift(0);
    return splits;
}

['Alianza', 'Fe', 'Cruz', 'Misericordia', 'Amor', 'Jesús', 'Pascua'].forEach(w => {
    const item = data.palabras[w];
    if (!item) return;
    const allCitas = [];
    Object.keys(item.lecturas).forEach(cat => allCitas.push(...(item.lecturas[cat] || [])));
    const totalChars = allCitas.reduce((s, c) => s + calcularCaracteresCita(c), 0);
    const target = totalChars / 4;
    
    const sVar = dpMinVariance(allCitas, 4);
    const g = currentGreedy(allCitas, 4);
    
    console.log(`\n===============================================================`);
    console.log(`PALABRA: ${w} (${allCitas.length} citas | Total: ${totalChars.toLocaleString()} car. | Target: ${Math.round(target).toLocaleString()} car.)`);
    console.log(`===============================================================`);
    console.log('--- GREEDY ACTUAL ---');
    g.forEach((h, i) => console.log(`  Hermano ${i+1}: ${h.count} citas | ${h.sum.toLocaleString()} car. (${((h.sum/totalChars)*100).toFixed(1)}%)`));
    const gDiff = Math.max(...g.map(x=>x.sum)) - Math.min(...g.map(x=>x.sum));
    console.log(`  -> Desviación Max-Min: ${gDiff.toLocaleString()} car.`);
    
    console.log('--- DP GLOBAL ÓPTIMO (Mínima Varianza) ---');
    const dpList = [];
    for (let p = 0; p < 4; p++) {
        const slice = allCitas.slice(sVar[p], sVar[p+1]);
        const sum = slice.reduce((s, c) => s + calcularCaracteresCita(c), 0);
        dpList.push(sum);
        console.log(`  Hermano ${p+1}: ${slice.length} citas | ${sum.toLocaleString()} car. (${((sum/totalChars)*100).toFixed(1)}%)`);
    }
    const dpDiff = Math.max(...dpList) - Math.min(...dpList);
    console.log(`  -> Desviación Max-Min: ${dpDiff.toLocaleString()} car.`);
});
