import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function PatternGrid({
  grid,
  palette,
  completedStitches = {},
  viewMode = 'color',
  showGrid = true,
  highlightColor = null,
  hideCompleted = false,
  dimCompleted = false,
  onStitchClick,
  highlightRow = null,
  highlightCol = null
}) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);

  const width = grid[0]?.length || 0;
  const height = grid.length;
  const baseCell = Math.max(8, Math.min(24, Math.floor(300 / Math.max(width, height))));
  const cellSize = baseCell * zoom;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !width || !height) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const canvasW = width * cellSize;
    const canvasH = height * cellSize;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasW, canvasH);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const colorIdx = grid[y][x];
        const color = palette[colorIdx];
        if (!color) continue;

        const key = `${x},${y}`;
        const isCompleted = completedStitches[key];
        if (hideCompleted && isCompleted) continue;

        const px = x * cellSize;
        const py = y * cellSize;

        if (highlightColor !== null && colorIdx !== highlightColor) {
          ctx.fillStyle = 'rgba(200,200,200,0.3)';
          ctx.fillRect(px, py, cellSize, cellSize);
          if (showGrid) {
            ctx.strokeStyle = 'rgba(0,0,0,0.05)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(px, py, cellSize, cellSize);
          }
          continue;
        }

        // Fill color
        if (viewMode !== 'simbolos') {
          ctx.fillStyle = isCompleted && dimCompleted
            ? `rgba(${color.r},${color.g},${color.b},0.2)`
            : color.dmc.hex;
          ctx.fillRect(px, py, cellSize, cellSize);
        } else {
          ctx.fillStyle = isCompleted && dimCompleted ? 'rgba(245,245,245,0.5)' : '#f5f5f0';
          ctx.fillRect(px, py, cellSize, cellSize);
        }

        // Symbol
        if ((viewMode === 'simbolos' || viewMode === 'mixto') && cellSize >= 10) {
          ctx.fillStyle = viewMode === 'mixto' ? '#fff' : (isCompleted && dimCompleted ? '#ccc' : '#333');
          ctx.font = `${Math.max(8, cellSize * 0.55)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(color.symbol, px + cellSize / 2, py + cellSize / 2);
        }

        // Completed marker
        if (isCompleted && !dimCompleted) {
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px + 2, py + 2);
          ctx.lineTo(px + cellSize - 2, py + cellSize - 2);
          ctx.moveTo(px + cellSize - 2, py + 2);
          ctx.lineTo(px + 2, py + cellSize - 2);
          ctx.stroke();
        }

        // Grid lines
        if (showGrid) {
          const is10 = x % 10 === 0 || y % 10 === 0;
          ctx.strokeStyle = is10 ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.08)';
          ctx.lineWidth = is10 ? 1.5 : 0.5;
          ctx.strokeRect(px, py, cellSize, cellSize);
        }
      }
    }

    // Highlight row/col
    if (highlightRow !== null) {
      ctx.fillStyle = 'rgba(0,150,150,0.08)';
      ctx.fillRect(0, highlightRow * cellSize, width * cellSize, cellSize);
    }
    if (highlightCol !== null) {
      ctx.fillStyle = 'rgba(0,150,150,0.08)';
      ctx.fillRect(highlightCol * cellSize, 0, cellSize, height * cellSize);
    }
  }, [grid, palette, completedStitches, viewMode, showGrid, highlightColor, hideCompleted, dimCompleted, cellSize, width, height, highlightRow, highlightCol]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasClick = (e) => {
    if (!onStitchClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.floor((clientX - rect.left) / cellSize);
    const y = Math.floor((clientY - rect.top) / cellSize);
    if (x >= 0 && x < width && y >= 0 && y < height) {
      onStitchClick(x, y);
    }
  };

  if (!width || !height) {
    return <div className="text-center py-8 text-muted-foreground text-sm">No hay datos del patrón</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(4, z + 0.2))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => setZoom(1)}>
          Resetear
        </Button>
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-white dark:bg-neutral-900 max-h-[60vh]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchEnd={(e) => { e.preventDefault(); handleCanvasClick(e.changedTouches ? { touches: e.changedTouches } : e); }}
          className="cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
}