import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Play, Edit3, Copy, Archive, Trash2, Camera, Download, Grid3X3, Palette as PaletteIcon, Clock, Ruler, Loader2, Plus, X, ImageIcon, BookHeart, Tag } from 'lucide-react';
import EtiquetasEditor from '@/components/EtiquetasEditor';
import CalculadoraHilos from '@/components/CalculadoraHilos';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { STATUS_LABELS, DIFFICULTY_LABELS, AIDA_INFO, suggestThreadCount } from '@/lib/constants';
import { sincronizarDesdeBackend, actualizarPatron, eliminarPatron, guardarNotasFoto, cargarNotasFoto } from '@/lib/storage';

export default function ProyectoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patron, setPatron] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState('');
  const [savingNotas, setSavingNotas] = useState(false);
  const [fotosProgreso, setFotosProgreso] = useState([]);
  const [notasFoto, setNotasFoto] = useState({});
  const [uploadingFoto, setUploadingFoto] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await base44.entities.Patron.get(id);
        setPatron(p);
        setNotas(p.notas || '');
        let fotos = [];
        try { fotos = JSON.parse(p.fotos_progreso || '[]'); } catch {}
        setFotosProgreso(fotos);
        // Cargar notas de foto desde módulo de storage
        setNotasFoto(cargarNotasFoto(id));
        sincronizarDesdeBackend(p);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSaveNotas = async () => {
    setSavingNotas(true);
    try {
      await base44.entities.Patron.update(id, { notas });
      toast({ title: "Notas guardadas" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSavingNotas(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const { id: _id, created_date, updated_date, created_by_id, ...data } = patron;
      data.nombre = `${data.nombre} (copia)`;
      data.estado = 'borrador';
      data.puntadas_completadas = 0;
      data.porcentaje_avance = 0;
      data.progreso_data = JSON.stringify({});
      const newP = await base44.entities.Patron.create(data);
      toast({ title: "Patrón duplicado" });
      navigate(`/proyecto/${newP.id}`);
    } catch {
      toast({ title: "Error al duplicar", variant: "destructive" });
    }
  };

  const handleArchive = async () => {
    await base44.entities.Patron.update(id, { estado: 'archivado' });
    toast({ title: "Patrón archivado" });
    navigate('/biblioteca');
  };

  const handleDelete = async () => {
    eliminarPatron(id); // borrar del caché local
    await base44.entities.Patron.delete(id);
    toast({ title: "Patrón eliminado" });
    navigate('/biblioteca');
  };

  const handleProgresoUpload = async (file) => {
    setUploadingFoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const nuevaFoto = { url: file_url, fecha: new Date().toISOString(), porcentaje: patron.porcentaje_avance || 0 };
      const nuevasFotos = [...fotosProgreso, nuevaFoto];
      await base44.entities.Patron.update(id, { fotos_progreso: JSON.stringify(nuevasFotos) });
      setFotosProgreso(nuevasFotos);
      toast({ title: "Foto de progreso agregada" });
    } catch {
      toast({ title: "Error al subir foto", variant: "destructive" });
    } finally {
      setUploadingFoto(false);
    }
  };

  const handleDeleteFotoProgreso = async (index) => {
    const nuevasFotos = fotosProgreso.filter((_, i) => i !== index);
    await base44.entities.Patron.update(id, { fotos_progreso: JSON.stringify(nuevasFotos) });
    setFotosProgreso(nuevasFotos);
    // Reindexar notas
    const nuevasNotas = {};
    Object.entries(notasFoto).forEach(([k, v]) => {
      const ki = parseInt(k);
      if (ki < index) nuevasNotas[ki] = v;
      else if (ki > index) nuevasNotas[ki - 1] = v;
    });
    setNotasFoto(nuevasNotas);
    guardarNotasFoto(id, nuevasNotas);
    toast({ title: "Foto eliminada" });
  };

  const handleNotaFoto = (index, texto) => {
    const nuevasNotas = { ...notasFoto, [index]: texto };
    setNotasFoto(nuevasNotas);
    guardarNotasFoto(id, nuevasNotas);
  };

  const handlePhotoUpload = async (file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.Patron.update(id, { foto_final: file_url });
      setPatron(prev => ({ ...prev, foto_final: file_url }));
      toast({ title: "Foto agregada" });
    } catch {
      toast({ title: "Error al subir foto", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!patron) return null;
  const threads = suggestThreadCount(patron.tipo_aida);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-7 pb-safe">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold">{patron.nombre}</h1>
          <Badge className="mt-1 text-xs">{STATUS_LABELS[patron.estado]}</Badge>
        </div>
      </div>

      {/* Image */}
      {patron.imagen_original && (
        <div className="rounded-2xl overflow-hidden bg-muted">
          <img src={patron.imagen_original} alt={patron.nombre} className="w-full max-h-64 object-contain" />
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button asChild className="h-14 text-base">
          <Link to={`/bordado/${id}`}>
            <Play className="w-4 h-4 mr-2" />
            Bordar
          </Link>
        </Button>
        <Button variant="secondary" asChild className="h-14">
          <Link to={`/editor/${id}`}>
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
        <Button variant="outline" onClick={handleDuplicate} className="h-14">
          <Copy className="w-4 h-4 mr-2" />
          Duplicar
        </Button>
        <Button variant="outline" onClick={handleArchive} className="h-14">
          <Archive className="w-4 h-4 mr-2" />
          Archivar
        </Button>
      </div>

      {/* Progress */}
      {patron.estado === 'en_progreso' && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-heading font-semibold">Progreso</h3>
          <div className="flex justify-between text-sm">
            <span>{patron.puntadas_completadas?.toLocaleString()} / {patron.total_puntadas?.toLocaleString()} puntadas</span>
            <span className="text-primary font-medium">{patron.porcentaje_avance}%</span>
          </div>
          <Progress value={patron.porcentaje_avance || 0} className="h-2" />
        </div>
      )}

      {/* Details */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <h3 className="font-heading font-semibold">Detalles del patrón</h3>
        <div className="grid grid-cols-2 gap-5 text-sm">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Dimensiones</p>
              <p className="font-medium">{patron.ancho_puntos} × {patron.alto_puntos} pts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Tamaño físico</p>
              <p className="font-medium">{patron.tamano_estimado_cm}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PaletteIcon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Colores / Marca</p>
              <p className="font-medium">{patron.max_colores} — {patron.marca_hilos}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Tiempo estimado</p>
              <p className="font-medium">{patron.tiempo_estimado}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-muted rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Tela Aida</p>
            <p className="font-semibold text-sm">{patron.tipo_aida} ct</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Dificultad</p>
            <p className="font-semibold text-sm">{DIFFICULTY_LABELS[patron.dificultad]}</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Hebras</p>
            <p className="font-semibold text-sm">{threads}</p>
          </div>
        </div>
      </div>

      {/* Calculadora de hilos */}
      <CalculadoraHilos patron={patron} />

      {/* Etiquetas */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold">Etiquetas</h3>
        </div>
        <EtiquetasEditor
          etiquetas={(() => { try { return JSON.parse(patron.etiquetas || '[]'); } catch { return []; } })()}
          onChange={async (tags) => {
            const val = JSON.stringify(tags);
            await base44.entities.Patron.update(id, { etiquetas: val });
            setPatron(prev => ({ ...prev, etiquetas: val }));
          }}
        />
      </div>

      {/* Notes */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-heading font-semibold">Notas</h3>
        <Textarea
          value={notas}
          onChange={e => setNotas(e.target.value)}
          placeholder="Agrega notas sobre tu proyecto..."
          rows={4}
          className="text-sm leading-relaxed"
        />
        <Button variant="outline" onClick={handleSaveNotas} disabled={savingNotas} className="h-11">
          {savingNotas ? 'Guardando...' : 'Guardar notas'}
        </Button>
      </div>

      {/* Progress Photos */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold">Registro de progreso</h3>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingFoto}
              onChange={e => e.target.files[0] && handleProgresoUpload(e.target.files[0])}
            />
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              {uploadingFoto ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {uploadingFoto ? 'Subiendo...' : 'Añadir foto'}
            </span>
          </label>
        </div>

        {fotosProgreso.length === 0 ? (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingFoto}
              onChange={e => e.target.files[0] && handleProgresoUpload(e.target.files[0])}
            />
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 hover:bg-accent/30 transition-colors">
              <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sube fotos para documentar tu avance etapa por etapa</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Toca para seleccionar una imagen</p>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            {/* Fotos en orden cronológico con notas */}
            {[...fotosProgreso]
              .map((foto, i) => ({ ...foto, _idx: i }))
              .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
              .map((foto) => (
                <div key={foto._idx} className="border border-border rounded-xl overflow-hidden">
                  <div className="relative group">
                    <img src={foto.url} alt={`Etapa ${foto._idx + 1}`} className="w-full max-h-64 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white text-sm font-medium">{foto.porcentaje}% completado</p>
                      <p className="text-white/70 text-xs">{new Date(foto.fecha).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFotoProgreso(foto._idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 bg-muted/30">
                    <Input
                      value={notasFoto[foto._idx] || ''}
                      onChange={e => handleNotaFoto(foto._idx, e.target.value.slice(0, 140))}
                      placeholder="¿Qué aprendiste o corregiste en esta etapa? (hasta 140 caracteres)"
                      className="text-xs h-9 bg-card"
                    />
                    {notasFoto[foto._idx] && (
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">{notasFoto[foto._idx].length}/140</p>
                    )}
                  </div>
                </div>
              ))
            }
            {/* Botón añadir */}
            <label className="cursor-pointer border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-accent/30 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingFoto}
                onChange={e => e.target.files[0] && handleProgresoUpload(e.target.files[0])}
              />
              {uploadingFoto ? (
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-muted-foreground/50 mb-1" />
                  <span className="text-xs text-muted-foreground/60">Añadir otra foto</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Lo que aprendí */}
      {Object.values(notasFoto).filter(Boolean).length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookHeart className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold">Lo que aprendí con este proyecto</h3>
          </div>
          <ul className="space-y-2">
            {Object.entries(notasFoto)
              .filter(([, v]) => v && v.trim())
              .sort(([a], [b]) => Number(a) - Number(b))
              .slice(0, 3)
              .map(([idx, nota]) => {
                const foto = fotosProgreso[Number(idx)];
                return (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground shrink-0">
                      {foto ? `${foto.porcentaje}%` : `Etapa ${Number(idx) + 1}`}:
                    </span>
                    <span className="text-foreground">{nota}</span>
                  </li>
                );
              })
            }
          </ul>
        </div>
      )}

      {/* Final Photo */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h3 className="font-heading font-semibold">Foto del trabajo terminado</h3>
        {patron.foto_final ? (
          <img src={patron.foto_final} alt="Trabajo terminado" className="rounded-xl max-h-64 object-contain w-full" />
        ) : (
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Camera className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Agrega una foto cuando termines tu bordado</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="foto-final"
              onChange={e => e.target.files[0] && handlePhotoUpload(e.target.files[0])}
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('foto-final').click()}>
              <Camera className="w-4 h-4 mr-2" />
              Subir foto
            </Button>
          </div>
        )}
      </div>

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar patrón
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este patrón?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará el patrón y todo su progreso.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}