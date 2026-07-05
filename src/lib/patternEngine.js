import { DMC_COLORS, findClosestDMC, SYMBOLS, calcPhysicalSize, calcEstimatedTime, calcDifficulty, AIDA_INFO } from './constants';

// ─── Cuantización de colores (k-means simplificado) ─────────────────────────

/**
 * Cuantiza los píxeles de un ImageData en `maxColors` colores representativos.
 * Usa un enfoque de frecuencia + fusión de similares con distancia euclidiana en RGB.
 */
function quantizeColors(pixels, maxColors) {
  // Paso 1: contar frecuencias de colores únicos (cuantizados a bloque de 8)
  const colorMap = new Map();
  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a < 128) continue; // ignorar píxeles transparentes
    // Reducir a bloque de 8 para agrupar colores parecidos
    const r = Math.round(pixels[i] / 8) * 8;
    const g = Math.round(pixels[i + 1] / 8) * 8;
    const b = Math.round(pixels[i + 2] / 8) * 8;
    const key = (r << 16) | (g << 8) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Paso 2: ordenar por frecuencia y tomar los más frecuentes
  let colors = Array.from(colorMap.entries())
    .map(([key, count]) => ({
      r: (key >> 16) & 0xFF,
      g: (key >> 8) & 0xFF,
      b: key & 0xFF,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // Reducir candidatos a un subconjunto manejable antes de fusionar
  const maxCandidates = Math.min(colors.length, maxColors * 8);
  colors = colors.slice(0, maxCandidates);

  // Paso 3: fusionar los dos colores más similares hasta llegar al límite
  while (colors.length > maxColors) {
    let minDist = Infinity;
    let mergeA = 0, mergeB = 1;
    for (let i = 0; i < colors.length - 1; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const dr = colors[i].r - colors[j].r;
        const dg = colors[i].g - colors[j].g;
        const db = colors[i].b - colors[j].b;
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          mergeA = i;
          mergeB = j;
        }
      }
    }
    const a = colors[mergeA];
    const bC = colors[mergeB];
    const total = a.count + bC.count;
    a.r = Math.round((a.r * a.count + bC.r * bC.count) / total);
    a.g = Math.round((a.g * a.count + bC.g * bC.count) / total);
    a.b = Math.round((a.b * a.count + bC.b * bC.count) / total);
    a.count = total;
    colors.splice(mergeB, 1);
  }

  return colors;
}

// ─── Motor principal de conversión ──────────────────────────────────────────

/**
 * Convierte un ImageData en un patrón de punto cruz.
 *
 * @param {ImageData} imageData - Datos de píxel de la imagen fuente (con ajustes aplicados)
 * @param {number} width - Ancho en px del ImageData
 * @param {number} height - Alto en px del ImageData
 * @param {number} targetWidth - Ancho del patrón en celdas (puntadas)
 * @param {number} targetHeight - Alto del patrón en celdas (puntadas)
 * @param {number} maxColors - Número máximo de colores
 * @param {string} detailLevel - 'bajo' | 'medio' | 'alto'
 * @param {number} aidaCt - Recuento Aida (11, 14, 16, 18)
 * @returns {{
 *   grid: number[][],
 *   palette: object[],
 *   width: number,
 *   height: number,
 *   totalStitches: number,
 *   metadata: { totalStitches: number, numColors: number, sizeCm: string, dificultad: string, tiempoEstimado: string }
 * }}
 */
export function convertImageToPattern(imageData, width, height, targetWidth, targetHeight, maxColors, detailLevel, aidaCt = 14) {
  // ── 1. Redimensionar al tamaño objetivo ──
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = detailLevel === 'bajo' ? 'low' : detailLevel === 'medio' ? 'medium' : 'high';

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  const resizedData = ctx.getImageData(0, 0, targetWidth, targetHeight);

  // ── 2. Cuantizar colores ──
  const quantized = quantizeColors(resizedData.data, maxColors);

  // ── 3. Mapear cada color cuantizado al DMC más cercano ──
  // Usar cache para no recalcular findClosestDMC para el mismo color cuantizado
  const dmcCache = new Map();
  const getDMC = (r, g, b) => {
    const key = `${r},${g},${b}`;
    if (!dmcCache.has(key)) dmcCache.set(key, findClosestDMC(r, g, b));
    return dmcCache.get(key);
  };

  // Construir paleta sin duplicados DMC
  const dmcPaletteMap = new Map(); // dmcCode → entry
  for (const qc of quantized) {
    const dmc = getDMC(qc.r, qc.g, qc.b);
    if (!dmcPaletteMap.has(dmc.code)) {
      dmcPaletteMap.set(dmc.code, {
        r: parseInt(dmc.hex.slice(1, 3), 16),
        g: parseInt(dmc.hex.slice(3, 5), 16),
        b: parseInt(dmc.hex.slice(5, 7), 16),
        dmc,
        stitchCount: 0
      });
    }
  }
  const dmcPalette = Array.from(dmcPaletteMap.values()).map((entry, i) => ({
    ...entry,
    index: i,
    symbol: SYMBOLS[i % SYMBOLS.length]
  }));

  // ── 4. Construir grilla: cada celda = índice en dmcPalette ──
  // Preparar caché de distancias: para cada color cuantizado, guardar su índice en dmcPalette
  const qColorToPaletteIdx = new Map();
  for (const qc of quantized) {
    const dmc = getDMC(qc.r, qc.g, qc.b);
    const idx = dmcPalette.findIndex(p => p.dmc.code === dmc.code);
    qColorToPaletteIdx.set(`${qc.r},${qc.g},${qc.b}`, idx >= 0 ? idx : 0);
  }

  const grid = [];
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      const r = resizedData.data[idx];
      const g = resizedData.data[idx + 1];
      const b = resizedData.data[idx + 2];

      // Encontrar el color cuantizado más cercano para este píxel
      let minDist = Infinity;
      let closestPaletteIdx = 0;
      for (let p = 0; p < dmcPalette.length; p++) {
        const pc = dmcPalette[p];
        const dist = (r - pc.r) ** 2 + (g - pc.g) ** 2 + (b - pc.b) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closestPaletteIdx = p;
        }
      }

      dmcPalette[closestPaletteIdx].stitchCount++;
      row.push(closestPaletteIdx);
    }
    grid.push(row);
  }

  // ── 5. Calcular metadatos ──
  const totalStitches = targetWidth * targetHeight;
  const physSize = calcPhysicalSize(targetWidth, targetHeight, aidaCt);
  const dificultad = calcDifficulty(totalStitches, dmcPalette.length);
  const tiempoEstimado = calcEstimatedTime(totalStitches);
  const numColors = dmcPalette.length;

  dmcPalette.forEach(c => {
    c.percentage = totalStitches > 0 ? ((c.stitchCount / totalStitches) * 100).toFixed(1) : '0.0';
  });

  return {
    grid,
    palette: dmcPalette,
    width: targetWidth,
    height: targetHeight,
    totalStitches,
    metadata: {
      totalStitches,
      numColors,
      sizeCm: `${physSize.width} × ${physSize.height} cm`,
      dificultad,
      tiempoEstimado
    }
  };
}

// ─── Operaciones de edición de patrón ───────────────────────────────────────

export function mergeColors(grid, palette, indexA, indexB) {
  // Reemplazar indexB → indexA en la grilla
  const merged = grid.map(row => row.map(cell => cell === indexB ? indexA : cell));
  // Quitar indexB de la paleta
  const newPalette = palette.filter((_, i) => i !== indexB);
  // Re-indexar celdas que apuntaban por encima de indexB
  const reindexed = merged.map(row => row.map(cell => cell > indexB ? cell - 1 : cell));
  // Recalcular stitchCounts
  newPalette.forEach(c => { c.stitchCount = 0; });
  reindexed.forEach(row => row.forEach(cell => {
    if (newPalette[cell]) newPalette[cell].stitchCount++;
  }));
  const total = reindexed.length * (reindexed[0]?.length || 0);
  newPalette.forEach(c => {
    c.percentage = total > 0 ? ((c.stitchCount / total) * 100).toFixed(1) : '0.0';
  });
  return { grid: reindexed, palette: newPalette };
}

export function replaceColor(grid, palette, oldIndex, newDmcCode) {
  const newDmc = DMC_COLORS.find(c => c.code === newDmcCode);
  if (!newDmc || !palette[oldIndex]) return { grid, palette };
  const newPalette = [...palette];
  newPalette[oldIndex] = {
    ...newPalette[oldIndex],
    dmc: newDmc,
    r: parseInt(newDmc.hex.slice(1, 3), 16),
    g: parseInt(newDmc.hex.slice(3, 5), 16),
    b: parseInt(newDmc.hex.slice(5, 7), 16)
  };
  return { grid, palette: newPalette };
}