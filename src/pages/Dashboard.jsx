import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { guardarPatron, cargarPatrones } from '@/lib/storage';
import { PlusCircle, FolderOpen, HelpCircle, Scissors, TrendingUp, Grid3X3, Play, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import EstadisticasMes from '@/components/EstadisticasMes';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      // Mostrar datos locales inmediatamente
      const local = cargarPatrones();
      if (local.length > 0) {
        setProjects(local);
        setLoading(false);
      }
      try {
        const [u, p] = await Promise.all([
          base44.auth.me(),
          base44.entities.Patron.list('-updated_date', 20)
        ]);
        setUser(u);
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

  const activeProjects = projects.filter(p => p.estado === 'en_progreso');
  const recentProjects = projects.slice(0, 4);
  const totalSaved = projects.length;
  const totalCompleted = projects.filter(p => p.estado === 'completado').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Welcome */}
      <div className="space-y-2">
        <h1 className="font-heading text-2xl md:text-3xl font-bold">
          ¡Hola{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Bienvenido a tu estudio de punto cruz. ¿Qué vas a bordar hoy?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/nuevo" className="col-span-2 md:col-span-1">
          <div className="bg-primary text-primary-foreground rounded-2xl p-5 hover:opacity-90 transition-opacity h-full flex flex-col justify-between">
            <PlusCircle className="w-7 h-7 mb-3" />
            <div>
              <p className="font-heading font-semibold text-base">Crear patrón</p>
              <p className="text-xs opacity-80 mt-0.5">Sube una imagen</p>
            </div>
          </div>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
          <Grid3X3 className="w-6 h-6 text-primary mb-2" />
          <div>
            <p className="text-2xl font-bold font-heading">{totalSaved}</p>
            <p className="text-xs text-muted-foreground">Patrones guardados</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
          <TrendingUp className="w-6 h-6 text-primary mb-2" />
          <div>
            <p className="text-2xl font-bold font-heading">{activeProjects.length}</p>
            <p className="text-xs text-muted-foreground">En progreso</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
          <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
          <div>
            <p className="text-2xl font-bold font-heading">{totalCompleted}</p>
            <p className="text-xs text-muted-foreground">Completados</p>
          </div>
        </div>
      </div>

      {/* Bordando ahora — acceso rápido */}
      {activeProjects.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary/20" />
              <h2 className="font-heading text-lg font-semibold">Bordando ahora</h2>
            </div>
            <Link to="/biblioteca?estado=en_progreso" className="text-sm text-primary font-medium hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {activeProjects.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-colors">
                {p.imagen_original ? (
                  <img src={p.imagen_original} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${p.porcentaje_avance || 0}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{p.porcentaje_avance || 0}%</span>
                  </div>
                </div>
                <Link
                  to={`/bordado/${p.id}`}
                  className="shrink-0 w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Estadísticas del mes */}
      {projects.length > 0 && <EstadisticasMes projects={projects} />}

      {/* Recent Projects */}
      {recentProjects.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Proyectos recientes</h2>
            <Link to="/biblioteca" className="text-sm text-primary font-medium hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentProjects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Scissors className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold mb-2">Aún no tienes patrones guardados</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Sube una imagen para comenzar tu primer proyecto de punto cruz.
          </p>
          <Button asChild>
            <Link to="/nuevo">
              <PlusCircle className="w-4 h-4 mr-2" />
              Crear mi primer patrón
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Help */}
      <section className="bg-accent/50 rounded-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold mb-1">¿Primera vez aquí?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Aprende lo básico del punto cruz y cómo usar la app paso a paso.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/ayuda">Ver guía para principiantes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}