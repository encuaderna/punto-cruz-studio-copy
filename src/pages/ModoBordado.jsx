import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Save, Eye, EyeOff, Palette, Target, BarChart3, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import PatternGrid from '@/components/PatternGrid';
import ColorPalette from '@/components/ColorPalette';

export default function ModoBordado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patron, setPatron] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState([]);
  const [palette, setPalette] = useState([]);
  const [completed, setCompleted] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [dimCompleted, setDimCompleted] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [highlightRow, setHighlightRow] = useState(null);
  const [highlightCol, setHighlightCol] = useState(null);
  
  // Timer
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await base44.entities.Patron.get(id);
        setPatron(p);
        if (p.grid_data) setGrid(JSON.parse(p.grid_data));
        if (p.colores_data) setPalette(JSON.parse(p.colores_data));
        if (p.progreso_data) {
          try {
            const prog = JSON.parse(p.progreso_data);
            if (typeof prog === 'object' && !Array.isArray(prog)) {
              setCompleted(prog);
            }
          } catch {}
        }
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStitch = useCallback((x, y) => {
    const key = `${x},${y}`;
    setCompleted(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
    setHighlightRow(y);
    setHighlightCol(x);
  }, []);

  const completedCount = Object.keys(completed).length;
  const totalStitches = patron?.total_puntadas || (grid.length * (grid[0]?.length || 0));
  const percentage = totalStitches > 0 ? Math.round((completedCount / totalStitches) * 100) : 0;

  // Completed by color
  const completedByColor = {};
  if (palette.length > 0 && grid.length > 0) {
    const colorCounts = {};
    Object.keys(completed).forEach(key => {
      const [x, y] = key.split(',').map(Number);
      if (grid[y]?.[x] !== undefined) {
        const ci = grid[y][x];
        colorCounts[ci] = (colorCounts[ci] || 0) + 1;
      }
    });
    palette.forEach((c, i) => {
      completedByColor[i] = c.stitchCount > 0 ? ((colorCounts[i] || 0) / c.stitchCount) * 100 : 0;
    });
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Patron.update(id, {
        progreso_data: JSON.stringify(completed),
        puntadas_completadas: completedCount,
        porcentaje_avance: percentage,
        estado: percentage >= 100 ? 'completado' : 'en_progreso'
      });
      toast({ title: "Progreso guardado", description: `${percentage}% completado` });
    } catch {
      toast({ title: "Error", description: "No se pudo guardar el progreso.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 stitches
  const lastSaveCount = useRef(0);
  useEffect(() => {
    if (completedCount > 0 && completedCount - lastSaveCount.current >= 30) {
      lastSaveCount.current = completedCount;
      handleSave();
    }
  }, [completedCount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card shrink-0">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-semibold text-sm truncate">{patron?.nombre}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Progress value={percentage} className="h-1.5 flex-1 max-w-[120px]" />
            <span className="text-xs text-primary font-medium">{percentage}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <Button variant={timerActive ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setTimerActive(!timerActive)}>
            <Timer className="w-4 h-4" />
          </Button>
          
          {timerActive && (
            <span className="text-xs font-mono text-primary">{formatTime(seconds)}</span>
          )}
          
          {/* Stats Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
              <SheetHeader>
                <SheetTitle className="font-heading">Estadísticas</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-2xl font-bold font-heading text-primary">{completedCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Puntadas hechas</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-2xl font-bold font-heading">{(totalStitches - completedCount).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Pendientes</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">{percentage}% completado</p>
                
                {palette.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Avance por color</h4>
                    {palette.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: c.dmc.hex }} />
                        <span className="flex-1">{c.dmc.code}</span>
                        <Progress value={completedByColor[i] || 0} className="h-1 w-20" />
                        <span className="w-10 text-right">{Math.round(completedByColor[i] || 0)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Color Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Palette className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh]">
              <SheetHeader>
                <SheetTitle className="font-heading">Colores</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-3"
                  onClick={() => setActiveColor(null)}
                >
                  Mostrar todos los colores
                </Button>
                <ColorPalette
                  palette={palette}
                  marca={patron?.marca_hilos}
                  highlightColor={activeColor}
                  onColorClick={(idx) => setActiveColor(activeColor === idx ? null : idx)}
                  completedByColor={completedByColor}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="default" size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Visual Aids Bar */}
      <div className="flex items-center gap-4 px-3 py-2 border-b border-border bg-muted/50 text-xs overflow-x-auto shrink-0">
        <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
          <Switch checked={dimCompleted} onCheckedChange={setDimCompleted} className="scale-75" />
          <span>Atenuar bordado</span>
        </label>
        <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
          <Switch checked={hideCompleted} onCheckedChange={setHideCompleted} className="scale-75" />
          <span>Solo pendiente</span>
        </label>
        {activeColor !== null && (
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            Filtro: {palette[activeColor]?.dmc.code}
            <button className="ml-1" onClick={() => setActiveColor(null)}>✕</button>
          </Badge>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-3">
        <PatternGrid
          grid={grid}
          palette={palette}
          completedStitches={completed}
          viewMode={patron?.vista_modo || 'color'}
          showGrid={true}
          highlightColor={activeColor}
          hideCompleted={hideCompleted}
          dimCompleted={dimCompleted}
          onStitchClick={handleStitch}
          highlightRow={highlightRow}
          highlightCol={highlightCol}
        />
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground shrink-0">
        <span>{completedCount.toLocaleString()} / {totalStitches.toLocaleString()} puntadas</span>
        <span className="text-primary font-medium">{percentage}% completado</span>
      </div>
    </div>
  );
}