import React, { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const SUGERIDAS = ['Flores', 'Retratos', 'Animales', 'Paisajes', 'Navidad', 'Abstracto', 'Mandalas', 'Letras', 'Comida', 'Festivo'];

export default function EtiquetasEditor({ etiquetas = [], onChange }) {
  const [input, setInput] = useState('');

  const agregar = (tag) => {
    const limpia = tag.trim();
    if (!limpia || etiquetas.includes(limpia) || etiquetas.length >= 8) return;
    onChange([...etiquetas, limpia]);
    setInput('');
  };

  const quitar = (tag) => onChange(etiquetas.filter(e => e !== tag));

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      agregar(input);
    }
  };

  const sugeridosRestantes = SUGERIDAS.filter(s => !etiquetas.includes(s));

  return (
    <div className="space-y-3">
      {/* Etiquetas actuales */}
      {etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {etiquetas.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {tag}
              <button onClick={() => quitar(tag)} className="ml-0.5 hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input nueva etiqueta */}
      {etiquetas.length < 8 && (
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Nueva etiqueta..."
            className="h-8 text-sm"
          />
          <button
            onClick={() => agregar(input)}
            disabled={!input.trim()}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-transparent hover:bg-accent transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sugerencias */}
      {sugeridosRestantes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sugeridosRestantes.slice(0, 6).map(s => (
            <button
              key={s}
              onClick={() => agregar(s)}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}