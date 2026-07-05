import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Eye, Grid3X3, Palette, Undo2, Redo2, Save, Play, Settings2, EyeOff, Merge, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import PatternGrid from '@/components/PatternGrid';
import ColorPalette from '@/components/ColorPalette';
import { mergeColors } from '@/lib/patternEngine';
import { sincronizarDesdeBackend, actualizarPatron } from '@/lib/storage';
import TipContextual from '@/components/TipContextual';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patron, setPatron] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grid, setGrid] = useState([]);
  const [palette, setPalette] = useState([]);
  const [viewMode, setViewMode] = useState('color');
  const [showGrid, setShowGrid] = useState(true);
  const [highlightColor, setHighlightColor] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('grid');
  const [tipVisible, setTipVisible] = useState(() => {
    try { return localStorage.getItem(`tip-oculto-editor-${id}`) !== '1'; } catch { return true; }
  });

  useEffect(() => {
    async function load() {
      try {
        const p = await base44.entities.Patron.get(id);
        setPatron(p);
        if (p.grid_data) setGrid(JSON.parse(p.grid_data));
        if (p.colores_data) setPalette(JSON.parse(p.colores_data));
        setViewMode(p.vista_modo || 'color');
        // Sincronizar con caché local
        sincronizarDesdeBackend(p);
      } catch {
        toast({ title: "Error", description: "No se encontró el patrón", variant: "destructive" });
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const changes = {
      grid_data: JSON.stringify(grid),
      colores_data: JSON.stringify(palette),
      vista_modo: viewMode
    };
    // Guardar en local primero (siempre disponible)
    actualizarPatron(id, changes);
    try {
      await base44.entities.Patron.update(id, changes);
      toast({ title: "Guardado", description: "Los cambios se guardaron correctamente." });
    } catch {
      toast({ title: "Guardado localmente", description: "No se pudo sincronizar con el servidor, pero tus cambios están guardados.", variant: "default" });
    } finally {
      setSaving(false);
    }
  };

  const handleMerge = (indexA, indexB) => {
    setUndoStack(prev => [...prev, { grid: [...grid.map(r => [...r])], palette: [...palette] }]);
    const result = mergeColors(grid, palette, indexA, indexB);
    setGrid(result.grid);
    setPalette(result.palette);
    setHighlightColor(null);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setGrid(prev.grid);
    setPalette(prev.palette);
    setUndoStack(s => s.slice(0, -1));
  };

  const handleCellEdit = (x, y) => {
    if (highlightColor === null) return;
    setUndoStack(prev => [...prev, { grid: [...grid.map(r => [...r])], palette: [...palette] }]);
    const newGrid = grid.map(r => [...r]);
    newGrid[y][x] = highlightColor;
    setGrid(newGrid);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card shrink-0 overflow-x-auto">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-heading font-semibold text-sm truncate flex-1">{patron?.nombre}</h2>
        
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={!undoStack.length}>
            <Undo2 className="w-4 h-4" />
          </Button>
          
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="simbolos">Símbolos</SelectItem>
              <SelectItem value="mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowGrid(!showGrid)}>
            <Grid3X3 className={`w-4 h-4 ${showGrid ? 'text-primary' : ''}`} />
          </Button>
          
          <Button variant="default" size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving}>
            <Save className="w-3.5 h-3.5 mr-1" />
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
          
          <Button variant="secondary" size="sm" className="h-8 text-xs" asChild>
            <Link to={`/bordado/${id}`}>
              <Play className="w-3.5 h-3.5 mr-1" />
              Bordar
            </Link>
          </Button>
        </div>
      </div>

      {/* Tip contextual del editor */}
      {tipVisible && (
        <div className="px-3 py-2 shrink-0">
          <TipContextual
            tips={[
              "Usa el zoom (+/–) para ver mejor cada celda del patrón.",
              "Activa 'Símbolos' en la barra si tienes colores muy similares.",
              "Los bloques 10×10 te ayudan a orientarte; trabaja de a uno."
            ]}
            enlace={{ texto: 'Aprende a simplificar tu patrón', to: '/ayuda' }}
            storageKey={`editor-${id}`}
          />
        </div>
      )}

      {/* Content - responsive layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile tabs */}
        <div className="lg:hidden">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full rounded-none border-b h-10">
              <TabsTrigger value="grid" className="flex-1 text-xs">Patrón</TabsTrigger>
              <TabsTrigger value="colors" className="flex-1 text-xs">Colores</TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="p-3 overflow-auto flex-1">
              <PatternGrid
                grid={grid}
                palette={palette}
                viewMode={viewMode}
                showGrid={showGrid}
                highlightColor={highlightColor}
                onStitchClick={handleCellEdit}
              />
            </TabsContent>
            <TabsContent value="colors" className="p-3">
              <ColorPalette
                palette={palette}
                marca={patron?.marca_hilos}
                highlightColor={highlightColor}
                onColorClick={(idx) => setHighlightColor(highlightColor === idx ? null : idx)}
              />
              {highlightColor !== null && palette.length > 1 && (
                <div className="mt-4 p-3 bg-accent/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Fusionar con otro color:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {palette.map((c, i) => i !== highlightColor && (
                      <button
                        key={i}
                        onClick={() => handleMerge(highlightColor, i)}
                        className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: c.dmc.hex }}
                        title={`Fusionar con ${c.dmc.code}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <div className="flex-1 p-4 overflow-auto">
            <PatternGrid
              grid={grid}
              palette={palette}
              viewMode={viewMode}
              showGrid={showGrid}
              highlightColor={highlightColor}
              onStitchClick={handleCellEdit}
            />
          </div>
          <div className="w-72 border-l border-border p-4 overflow-y-auto bg-card">
            <ColorPalette
              palette={palette}
              marca={patron?.marca_hilos}
              highlightColor={highlightColor}
              onColorClick={(idx) => setHighlightColor(highlightColor === idx ? null : idx)}
            />
            {highlightColor !== null && palette.length > 1 && (
              <div className="mt-4 p-3 bg-accent/50 rounded-xl">
                <p className="text-xs text-muted-foreground mb-2">Fusionar con:</p>
                <div className="flex flex-wrap gap-1.5">
                  {palette.map((c, i) => i !== highlightColor && (
                    <button
                      key={i}
                      onClick={() => handleMerge(highlightColor, i)}
                      className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.dmc.hex }}
                      title={`Fusionar con ${c.dmc.code}`}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 p-3 bg-muted rounded-xl space-y-2 text-xs">
              <p><strong>Tela:</strong> Aida {patron?.tipo_aida} ct</p>
              <p><strong>Tamaño:</strong> {patron?.ancho_puntos}×{patron?.alto_puntos} pts</p>
              <p><strong>Físico:</strong> {patron?.tamano_estimado_cm}</p>
              <p><strong>Puntadas:</strong> {patron?.total_puntadas?.toLocaleString()}</p>
              <p><strong>Tiempo:</strong> {patron?.tiempo_estimado}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}