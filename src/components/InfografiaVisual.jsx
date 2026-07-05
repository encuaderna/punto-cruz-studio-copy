import React from 'react';

// Paleta tierra / papel antiguo coherente con la app
const estiloPanel = {
  background: 'linear-gradient(135deg, #f5efe0 0%, #ede3cc 100%)',
  border: '2px solid #8b6f47',
  borderRadius: '0.75rem',
  fontFamily: 'var(--font-body)',
  position: 'relative',
  overflow: 'hidden',
};

const esquinaDecorativa = (pos) => ({
  position: 'absolute',
  width: 20,
  height: 20,
  borderColor: '#8b6f47',
  borderStyle: 'solid',
  borderWidth: 0,
  ...pos,
});

function Esquinas() {
  return (
    <>
      <span style={{ ...esquinaDecorativa({ top: 6, left: 6 }), borderTopWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...esquinaDecorativa({ top: 6, right: 6 }), borderTopWidth: 2, borderRightWidth: 2 }} />
      <span style={{ ...esquinaDecorativa({ bottom: 6, left: 6 }), borderBottomWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...esquinaDecorativa({ bottom: 6, right: 6 }), borderBottomWidth: 2, borderRightWidth: 2 }} />
    </>
  );
}

// ── Tipos de infografía ──────────────────────────────────────────────────────

/** Pasos numerados horizontales/verticales */
function PasosTipo({ titulo, pasos }) {
  return (
    <div style={estiloPanel} className="p-5 my-3">
      <Esquinas />
      {titulo && (
        <p style={{ color: '#5a3e1b', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          {titulo}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        {pasos.map((paso, i) => (
          <React.Fragment key={i}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.45)', border: '1.5px solid #b89a6a', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#5a3e1b', color: '#f5efe0', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{paso.icono}</div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#3d2a0e', marginBottom: 3 }}>{paso.titulo}</p>
              {paso.detalle && <p style={{ fontSize: 11, color: '#6b4e25', lineHeight: 1.4 }}>{paso.detalle}</p>}
            </div>
            {i < pasos.length - 1 && (
              <div className="hidden sm:flex items-center" style={{ color: '#8b6f47', fontSize: 18, fontWeight: 700 }}>›</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Checklist visual con iconos */
function ChecklistTipo({ titulo, items }) {
  return (
    <div style={estiloPanel} className="p-5 my-3">
      <Esquinas />
      {titulo && (
        <p style={{ color: '#5a3e1b', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          {titulo}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(255,255,255,0.4)', border: '1px solid #c4a97a', borderRadius: 6, padding: '8px 10px' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icono}</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#3d2a0e', marginBottom: 1 }}>{item.titulo}</p>
              {item.detalle && <p style={{ fontSize: 11, color: '#6b4e25', lineHeight: 1.3 }}>{item.detalle}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tabla 2 columnas (error / solución) */
function TablaTipo({ titulo, filas, col1, col2 }) {
  return (
    <div style={estiloPanel} className="p-5 my-3">
      <Esquinas />
      {titulo && (
        <p style={{ color: '#5a3e1b', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          {titulo}
        </p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              {[col1, col2].map((c, i) => (
                <th key={i} style={{ background: '#5a3e1b', color: '#f5efe0', padding: '6px 10px', textAlign: 'left', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(184,154,106,0.18)' }}>
                <td style={{ padding: '7px 10px', color: '#3d2a0e', fontWeight: 500, borderBottom: '1px solid #c4a97a', verticalAlign: 'top' }}>
                  {fila.icono && <span style={{ marginRight: 5 }}>{fila.icono}</span>}{fila[0]}
                </td>
                <td style={{ padding: '7px 10px', color: '#5a3e1b', borderBottom: '1px solid #c4a97a', verticalAlign: 'top' }}>{fila[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Flujo de decisión (izq→der con condiciones) */
function FlujoDeTipo({ titulo, nodos }) {
  return (
    <div style={estiloPanel} className="p-5 my-3">
      <Esquinas />
      {titulo && (
        <p style={{ color: '#5a3e1b', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          {titulo}
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap justify-center">
        {nodos.map((nodo, i) => (
          <React.Fragment key={i}>
            <div style={{
              background: nodo.tipo === 'inicio' ? '#5a3e1b' : nodo.tipo === 'fin' ? '#2d6a4f' : 'rgba(255,255,255,0.5)',
              border: `1.5px solid ${nodo.tipo === 'inicio' ? '#3d2a0e' : nodo.tipo === 'fin' ? '#1a4433' : '#b89a6a'}`,
              borderRadius: nodo.tipo === 'decision' ? 4 : 8,
              padding: '8px 12px',
              textAlign: 'center',
              minWidth: 90,
              transform: nodo.tipo === 'decision' ? 'rotate(0deg)' : 'none',
            }}>
              {nodo.icono && <div style={{ fontSize: 16, marginBottom: 3 }}>{nodo.icono}</div>}
              <p style={{ fontSize: 11, fontWeight: 600, color: (nodo.tipo === 'inicio' || nodo.tipo === 'fin') ? '#f5efe0' : '#3d2a0e', lineHeight: 1.3 }}>{nodo.texto}</p>
              {nodo.subtexto && <p style={{ fontSize: 10, color: (nodo.tipo === 'inicio' || nodo.tipo === 'fin') ? '#e0cfa8' : '#6b4e25', marginTop: 2 }}>{nodo.subtexto}</p>}
            </div>
            {i < nodos.length - 1 && (
              <span style={{ color: '#8b6f47', fontSize: 16, fontWeight: 700 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** Tarjeta de organización con columnas por estado */
function ColumnasTipo({ titulo, columnas }) {
  return (
    <div style={estiloPanel} className="p-5 my-3">
      <Esquinas />
      {titulo && (
        <p style={{ color: '#5a3e1b', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 }}>
          {titulo}
        </p>
      )}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columnas.length}, 1fr)` }}>
        {columnas.map((col, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.4)', border: '1.5px solid #b89a6a', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#5a3e1b', padding: '6px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: 14 }}>{col.icono}</span>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#f5efe0', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>{col.titulo}</p>
            </div>
            <div style={{ padding: '8px' }}>
              {col.items.map((it, j) => (
                <div key={j} style={{ fontSize: 11, color: '#3d2a0e', padding: '4px 6px', marginBottom: 3, background: 'rgba(255,255,255,0.5)', borderRadius: 4, border: '1px solid #d4b896' }}>
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dispatcher ───────────────────────────────────────────────────────────────

export default function InfografiaVisual({ tipo, datos }) {
  if (!datos) return null;
  if (tipo === 'pasos') return <PasosTipo {...datos} />;
  if (tipo === 'checklist') return <ChecklistTipo {...datos} />;
  if (tipo === 'tabla') return <TablaTipo {...datos} />;
  if (tipo === 'flujo') return <FlujoDeTipo {...datos} />;
  if (tipo === 'columnas') return <ColumnasTipo {...datos} />;
  return null;
}