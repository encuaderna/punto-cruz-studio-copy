import { DMC_COLORS, findClosestDMC, SYMBOLS, calcPhysicalSize, calcEstimatedTime, calcDifficulty } from './constants';

// Quantize colors using median cut algorithm simplified
function quantizeColors(pixels, maxColors) {
  const colorMap = new Map();
  for (let i = 0; i < pixels.length; i += 4) {
    const key = `${pixels[i]},${pixels[i+1]},${pixels[i+2]}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  let colors = Array.from(colorMap.entries())
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, count };
    })
    .sort((a, b) => b.count - a.count);
  
  // Simple approach: take top colors by frequency then merge similar ones
  if (colors.length > maxColors * 3) {
    colors = colors.slice(0, maxColors * 3);
  }
  
  // Merge similar colors
  while (colors.length > maxColors) {
    let minDist = Infinity;
    let mergeA = 0, mergeB = 1;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const dist = Math.sqrt(
          (colors[i].r - colors[j].r) ** 2 +
          (colors[i].g - colors[j].g) ** 2 +
          (colors[i].b - colors[j].b) ** 2
        );
        if (dist < minDist) {
          minDist = dist;
          mergeA = i;
          mergeB = j;
        }
      }
    }
    const a = colors[mergeA];
    const b = colors[mergeB];
    const total = a.count + b.count;
    a.r = Math.round((a.r * a.count + b.r * b.count) / total);
    a.g = Math.round((a.g * a.count + b.g * b.count) / total);
    a.b = Math.round((a.b * a.count + b.b * b.count) / total);
    a.count = total;
    colors.splice(mergeB, 1);
  }
  
  return colors;
}

export function convertImageToPattern(imageData, width, height, targetWidth, targetHeight, maxColors, detailLevel) {
  // Create offscreen canvas to resize
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  
  // Apply detail level via image smoothing
  ctx.imageSmoothingEnabled = detailLevel !== 'alto';
  ctx.imageSmoothingQuality = detailLevel === 'bajo' ? 'low' : detailLevel === 'medio' ? 'medium' : 'high';
  
  // Draw the image data onto a temp canvas first
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(imageData, 0, 0);
  
  // Now resize
  ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
  const resizedData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // Quantize
  const palette = quantizeColors(resizedData.data, maxColors);
  
  // Map each DMC color
  const dmcPalette = palette.map((c, i) => {
    const dmc = findClosestDMC(c.r, c.g, c.b);
    return {
      index: i,
      r: c.r, g: c.g, b: c.b,
      dmc: dmc,
      symbol: SYMBOLS[i % SYMBOLS.length],
      stitchCount: 0
    };
  });
  
  // Build grid mapping each pixel to closest palette color
  const grid = [];
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      const r = resizedData.data[idx];
      const g = resizedData.data[idx + 1];
      const b = resizedData.data[idx + 2];
      
      let closest = 0;
      let minDist = Infinity;
      for (let p = 0; p < dmcPalette.length; p++) {
        const pc = dmcPalette[p];
        const dist = (r - pc.r) ** 2 + (g - pc.g) ** 2 + (b - pc.b) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closest = p;
        }
      }
      
      dmcPalette[closest].stitchCount++;
      row.push(closest);
    }
    grid.push(row);
  }
  
  const totalStitches = targetWidth * targetHeight;
  
  // Calc percentages
  dmcPalette.forEach(c => {
    c.percentage = ((c.stitchCount / totalStitches) * 100).toFixed(1);
  });
  
  return {
    grid,
    palette: dmcPalette,
    width: targetWidth,
    height: targetHeight,
    totalStitches
  };
}

export function mergeColors(grid, palette, indexA, indexB) {
  const newGrid = grid.map(row => row.map(cell => cell === indexB ? indexA : cell));
  const newPalette = palette.filter((_, i) => i !== indexB);
  // Reindex
  const reindexed = newGrid.map(row => row.map(cell => {
    if (cell > indexB) return cell - 1;
    return cell;
  }));
  // Recalculate stitch counts
  newPalette.forEach(c => { c.stitchCount = 0; });
  reindexed.forEach(row => row.forEach(cell => {
    if (newPalette[cell]) newPalette[cell].stitchCount++;
  }));
  const total = reindexed.length * (reindexed[0]?.length || 0);
  newPalette.forEach(c => {
    c.percentage = ((c.stitchCount / total) * 100).toFixed(1);
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