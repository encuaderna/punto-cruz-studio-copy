import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { PlusCircle, Search, FolderOpen, Tag, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProjectCard from '@/components/ProjectCard';
import { STATUS_LABELS } from '@/lib/constants';
import { guardarPatron, cargarPatrones } from '@/lib/storage';

export default function Biblioteca() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [tagFilter, setTagFilter] = useState(null);

  useEffect(() => {
    async function load() {
      const local = cargarPatrones();
      if (local.length > 0) { setProjects(local); setLoading(false); }
      try {
        const p = await base44.entities.Patron.list('-updated_date', 50);
        setProjects(p);
        p.forEach(patron => guardarPatron(patron));
      } catch (e) {
        if (local.length === 0) console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Recolectar todas las etiquetas únicas de todos los proyectos
  const todasEtiquetas = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      try { JSON.parse(p.etiquetas || '[]').forEach(e => set.add(e)); } catch {}
    });
    return Array.from(set).sort();
  }, [projects]);

  const filtered = projects.filter(p => {
    if (search && !p.nombre?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'todos' && p.estado !== statusFilter) return false;
    if (tagFilter) {
      try {
        const tags = JSON.parse(p.etiquetas || '[]');
        if (!tags.includes(tagFilter)) return false;
      } catch { return false; }
    }
    return true;
  });

  const hasFilters = search || statusFilter !== 'todos' || tagFilter;

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Estado', 'Dimensiones (pts)', 'Tamaño físico', 'Tela Aida', 'Colores', 'Marca hilos', 'Dificultad', 'Tiempo estimado', 'Puntadas totales', 'Avance (%)', 'Etiquetas', 'Notas'];
    const rows = projects.map(p => {
      let etiquetas = '';
      try { etiquetas = JSON.parse(p.etiquetas || '[]').join(', '); } catch {}
      return [
        p.nombre || '',
        STATUS_LABELS[p.estado] || p.estado || '',
        `${p.ancho_puntos || 0} × ${p.alto_puntos || 0}`,
        p.tamano_estimado_cm || '',
        p.tipo_aida ? `${p.tipo_aida} ct` : '',
        p.max_colores || '',
        p.marca_hilos || '',
        p.dificultad || '',
        p.tiempo_estimado || '',
        p.total_puntadas || 0,
        p.porcentaje_avance || 0,
        etiquetas,
        (p.notas || '').replace(/\n/g, ' ')
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-punto-cruz-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Biblioteca</h1>
        <div className="flex items-center gap-2">
          {projects.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/nuevo">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nuevo
            </Link>
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar patrón..."
          className="pl-9 h-11"
        />
      </div>

      {/* Filtro por estado */}
      <div className="flex flex-wrap gap-2">
        {[{ value: 'todos', label: 'Todos' }, ...Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filtro por etiquetas */}
      {todasEtiquetas.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {todasEtiquetas.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tagFilter === tag
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
          {tagFilter && (
            <button
              onClick={() => setTagFilter(null)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Limpiar
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold mb-2">
            {hasFilters ? 'No se encontraron patrones' : 'Aún no tienes patrones guardados'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {hasFilters ? 'Intenta con otros filtros' : 'Sube una imagen para comenzar tu nuevo proyecto'}
          </p>
          {!hasFilters && (
            <Button asChild>
              <Link to="/nuevo">
                <PlusCircle className="w-4 h-4 mr-2" />
                Crear mi primer patrón
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}