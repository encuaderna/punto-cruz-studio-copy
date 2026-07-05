import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Bloque de ayuda contextual discreto.
 * Props:
 *   tips: string[]  — lista de 1-3 frases cortas
 *   enlace?: { texto: string, to: string }  — link opcional al final
 *   storageKey: string  — clave para recordar si el usuario lo ocultó
 */
export default function TipContextual({ tips = [], enlace, storageKey }) {
  const [oculto, setOculto] = useState(() => {
    try { return localStorage.getItem(`tip-oculto-${storageKey}`) === '1'; } catch { return false; }
  });

  if (oculto || tips.length === 0) return null;

  const handleOcultar = () => {
    try { localStorage.setItem(`tip-oculto-${storageKey}`, '1'); } catch {}
    setOculto(true);
  };

  return (
    <div className="flex gap-3 bg-accent/40 border border-accent rounded-xl p-3.5 text-sm">
      <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <ul className="space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-muted-foreground leading-snug">{tip}</li>
          ))}
        </ul>
        {enlace && (
          <Link
            to={enlace.to}
            className="inline-block mt-2 text-xs text-primary font-medium hover:underline"
          >
            {enlace.texto} →
          </Link>
        )}
      </div>
      <button
        onClick={handleOcultar}
        className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        aria-label="Ocultar consejo"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}