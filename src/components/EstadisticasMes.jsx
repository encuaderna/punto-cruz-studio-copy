import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Hash, CheckCircle2 } from 'lucide-react';

function getSemanas(projects, inicioMes) {
  const semanas = [
    { semana: 'S1', puntadas: 0, proyectos: 0 },
    { semana: 'S2', puntadas: 0, proyectos: 0 },
    { semana: 'S3', puntadas: 0, proyectos: 0 },
    { semana: 'S4', puntadas: 0, proyectos: 0 },
  ];

  projects.forEach(p => {
    const fecha = new Date(p.updated_date || p.created_date);
    if (fecha < inicioMes) return;
    const dia = fecha.getDate();
    const idx = Math.min(Math.floor((dia - 1) / 7), 3);
    semanas[idx].puntadas += p.puntadas_completadas || 0;
    // Solo contar como "completado este mes" si la fecha de creación está en el mes actual
    const fechaCreacion = new Date(p.created_date);
    if (p.estado === 'completado' && fechaCreacion >= inicioMes) {
      semanas[idx].proyectos += 1;
    }
  });

  return semanas;
}

export default function EstadisticasMes({ projects }) {
  const { now, inicioMes } = useMemo(() => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    return { now, inicioMes };
  }, []);

  const mesNombre = useMemo(
    () => now.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
    [now]
  );

  const proyectosEsteMes = useMemo(
    () => projects.filter(p => new Date(p.updated_date || p.created_date) >= inicioMes),
    [projects, inicioMes]
  );

  const puntadasMes = useMemo(
    () => proyectosEsteMes.reduce((sum, p) => sum + (p.puntadas_completadas || 0), 0),
    [proyectosEsteMes]
  );

  const completadosMes = useMemo(
    () => projects.filter(p => p.estado === 'completado' && new Date(p.created_date) >= inicioMes).length,
    [projects, inicioMes]
  );

  const semanas = useMemo(() => getSemanas(projects, inicioMes), [projects, inicioMes]);

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg font-semibold capitalize">Este mes · {mesNombre}</h2>

      {/* KPI pills */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading leading-none">{puntadasMes.toLocaleString('es-CL')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Puntadas este mes</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold font-heading leading-none">{completadosMes}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Proyectos terminados</p>
          </div>
        </div>
      </div>

      {/* Gráfico de puntadas por semana */}
      {puntadasMes > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Puntadas por semana</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={semanas} barCategoryGap="30%">
              <XAxis dataKey="semana" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [v.toLocaleString('es-CL'), 'Puntadas']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="puntadas" radius={[4, 4, 0, 0]}>
                {semanas.map((_, i) => (
                  <Cell key={i} fill={`hsl(var(--primary) / ${i === semanas.length - 1 ? 1 : 0.45})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Gráfico de proyectos completados por semana */}
      {completadosMes > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Proyectos completados por semana</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={semanas} barCategoryGap="30%">
              <XAxis dataKey="semana" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                formatter={(v) => [v, 'Completados']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="proyectos" radius={[4, 4, 0, 0]}>
                {semanas.map((_, i) => (
                  <Cell key={i} fill={`hsl(142 60% 45% / ${i === semanas.length - 1 ? 1 : 0.45})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {puntadasMes === 0 && completadosMes === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Aún no hay actividad este mes. ¡A bordar! 🪡
        </p>
      )}
    </section>
  );
}