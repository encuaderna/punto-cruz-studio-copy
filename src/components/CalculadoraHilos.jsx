import React, { useMemo } from 'react';
import { Scissors } from 'lucide-react';
import { suggestThreadCount } from '@/lib/constants';

// Cada puntada de punto de cruz usa aprox. 3 cm de hilo (ida y vuelta + margen)
// + factor de mano (~20%) + margen de seguridad (~15 cm extra por color)
const CM_POR_PUNTADA = 3.5;
const MARGEN_EXTRA_CM = 15;

function calcularMetrosPorColor(colores, totalPuntadas, gridData, ancho, alto) {
  // Si tenemos grid_data real, contamos puntadas por color
  let puntadasPorColor = {};

  if (gridData && colores.length > 0) {
    try {
      const grid = JSON.parse(gridData);
      // grid es array de filas, cada celda tiene índice de color o null
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const idx = grid[r][c];
          if (idx !== null && idx !== undefined && idx >= 0) {
            puntadasPorColor[idx] = (puntadasPorColor[idx] || 0) + 1;
          }
        }
      }
    } catch {
      puntadasPorColor = {};
    }
  }

  const tieneConteoReal = Object.keys(puntadasPorColor).length > 0;

  return colores.map((color, idx) => {
    let puntadas;
    if (tieneConteoReal) {
      puntadas = puntadasPorColor[idx] || 0;
    } else {
      // Estimación uniforme si no hay grid
      puntadas = Math.round(totalPuntadas / colores.length);
    }
    const cm = puntadas * CM_POR_PUNTADA + MARGEN_EXTRA_CM;
    const metros = Math.ceil(cm / 100 * 10) / 10; // redondear a 0.1m arriba
    return { ...color, idx, puntadas, metros };
  });
}

export default function CalculadoraHilos({ patron }) {
  const colores = useMemo(() => {
    try { return JSON.parse(patron.colores_data || '[]'); } catch { return []; }
  }, [patron.colores_data]);

  const resultados = useMemo(() => {
    if (colores.length === 0) return [];
    return calcularMetrosPorColor(
      colores,
      patron.total_puntadas || patron.ancho_puntos * patron.alto_puntos,
      patron.grid_data,
      patron.ancho_puntos,
      patron.alto_puntos
    );
  }, [colores, patron]);

  const tieneGrid = useMemo(() => {
    try {
      const g = JSON.parse(patron.grid_data || '[]');
      return Array.isArray(g) && g.length > 0;
    } catch { return false; }
  }, [patron.grid_data]);

  if (colores.length === 0) return null;

  const totalMetros = resultados.reduce((s, c) => s + c.metros, 0).toFixed(1);
  const hebras = suggestThreadCount(patron.tipo_aida);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold">Metros de hilo necesarios</h3>
        </div>
        <span className="text-xs text-muted-foreground">{hebras} hebra{hebras > 1 ? 's' : ''} · Aida {patron.tipo_aida} ct</span>
      </div>

      {!tieneGrid && (
        <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
          Estimación proporcional — abre el editor para generar datos precisos por color.
        </p>
      )}

      <div className="space-y-2">
        {resultados.map((color) => (
          <div key={color.idx} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full shrink-0 border border-border"
              style={{ backgroundColor: color.hex || color.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium truncate">
                  {color.code || color.dmc || `Color ${color.idx + 1}`}
                  {color.name ? <span className="text-muted-foreground font-normal"> · {color.name}</span> : null}
                </span>
                <span className="text-sm font-semibold text-primary shrink-0">{color.metros} m</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full opacity-70"
                    style={{
                      backgroundColor: color.hex || color.color,
                      width: `${Math.min(100, (color.metros / Math.max(...resultados.map(r => r.metros))) * 100)}%`
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{color.puntadas} pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total estimado</span>
        <span className="font-bold text-foreground">{totalMetros} metros</span>
      </div>
    </div>
  );
}