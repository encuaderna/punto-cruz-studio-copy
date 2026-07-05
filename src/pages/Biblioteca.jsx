import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { PlusCircle, Search, Filter, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectCard from '@/components/ProjectCard';
import { STATUS_LABELS } from '@/lib/constants';

export default function Biblioteca() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    async function load() {
      try {
        const p = await base44.entities.Patron.list('-updated_date', 50);
        setProjects(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = projects.filter(p => {
    if (search && !p.nombre?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'todos' && p.estado !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Biblioteca</h1>
        <Button asChild size="sm">
          <Link to="/nuevo">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuevo
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar patrón..."
            className="pl-9 h-11"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-11">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            {search || statusFilter !== 'todos' ? 'No se encontraron patrones' : 'Aún no tienes patrones guardados'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {search || statusFilter !== 'todos' ? 'Intenta con otros filtros' : 'Sube una imagen para comenzar tu nuevo proyecto'}
          </p>
          {!search && statusFilter === 'todos' && (
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