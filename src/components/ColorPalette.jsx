import React from 'react';
import { getEquivalence } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export default function ColorPalette({ palette, marca = 'DMC', highlightColor, onColorClick, completedByColor }) {
  if (!palette?.length) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold font-heading">Paleta de colores ({palette.length})</h3>
      <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
        {palette.map((color, idx) => {
          const eq = marca !== 'DMC' ? getEquivalence(color.dmc.code, marca) : null;
          const progress = completedByColor?.[idx];
          const isHighlighted = highlightColor === idx;
          
          return (
            <button
              key={idx}
              onClick={() => onColorClick?.(idx)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                isHighlighted ? 'bg-primary/10 border border-primary/30 shadow-sm' : 'hover:bg-muted border border-transparent'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg border border-border shrink-0 shadow-inner"
                style={{ backgroundColor: color.dmc.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{color.dmc.code}</span>
                  <span className="text-xs text-muted-foreground truncate">{color.dmc.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{color.stitchCount?.toLocaleString()} pts ({color.percentage}%)</span>
                  {eq && (
                    <span className="text-xs">
                      {marca}: {eq.code} {!eq.exact && eq.code !== '—' ? '≈' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono">{color.symbol}</span>
                {progress !== undefined && (
                  <Badge variant="secondary" className="text-[10px]">
                    {Math.round(progress)}%
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}