import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Grid3X3, Palette, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, DIFFICULTY_LABELS } from '@/lib/constants';

const statusColors = {
  borrador: 'bg-muted text-muted-foreground',
  en_progreso: 'bg-primary/10 text-primary',
  completado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  archivado: 'bg-muted text-muted-foreground'
};

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/proyecto/${project.id}`}
      className="group block bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {project.imagen_original ? (
          <img
            src={project.imagen_original}
            alt={project.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Grid3X3 className="w-10 h-10 text-muted-foreground/40" />
          </div>
        )}
        <Badge className={`absolute top-3 left-3 ${statusColors[project.estado] || ''} border-0 text-xs`}>
          {STATUS_LABELS[project.estado] || project.estado}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-heading font-semibold text-base line-clamp-1">{project.nombre}</h3>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Grid3X3 className="w-3.5 h-3.5" />
            {project.ancho_puntos}×{project.alto_puntos}
          </span>
          {project.max_colores > 0 && (
            <span className="flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              {project.max_colores} colores
            </span>
          )}
          {project.dificultad && (
            <span>{DIFFICULTY_LABELS[project.dificultad]}</span>
          )}
        </div>

        {project.estado === 'en_progreso' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avance</span>
              <span className="font-medium text-primary">{project.porcentaje_avance || 0}%</span>
            </div>
            <Progress value={project.porcentaje_avance || 0} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {project.marca_hilos || 'DMC'}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}