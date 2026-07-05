import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Upload, Camera, RotateCw, Sun, Contrast, Droplets, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AIDA_INFO, TAMANOS_SUGERIDOS, calcPhysicalSize, calcEstimatedTime, calcDifficulty, DIFFICULTY_LABELS } from '@/lib/constants';
import { convertImageToPattern } from '@/lib/patternEngine';
import { guardarPatron, guardarParametrosUso, cargarParametrosUso } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import TipContextual from '@/components/TipContextual';

const TIPS_NUEVO = {
  principiante: [
    "Para tu primer patrón, elige tamaño Pequeño (40×50 pts) sobre tela Aida 14 ct. Terminarás antes y aprenderás más.",
    "Limita los colores a 8–10 para que el patrón sea manejable. Más colores no siempre es mejor.",
    "Elige imágenes con contornos claros y fondo simple: flores, animales de perfil, íconos."
  ],
  intermedio: [
    "Sube el contraste de la imagen antes de convertir: colores más definidos = patrón más limpio.",
    "Si el resultado tiene demasiados colores similares, baja el máximo y fusiónalos en el editor.",
    "Un patrón de 60×80 ya captura bastante detalle para la mayoría de fotos."
  ],
  avanzado: [
    "Para colecciones, estandariza las dimensiones y la paleta base para que todos los patrones se vean coherentes.",
    "Usa nivel de detalle 'Alto' solo si la imagen lo justifica; de lo contrario 'Medio' es más limpio."
  ]
};

export default function NuevoPatron() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Leer nivel de preferencias
  let nivelUsuario = 'principiante';
  try {
    const prefs = JSON.parse(localStorage.getItem('pcstudio-prefs') || '{}');
    if (prefs.nivel) nivelUsuario = prefs.nivel;
  } catch {}
  const tips = TIPS_NUEVO[nivelUsuario] || TIPS_NUEVO.principiante;
  const fileRef = useRef();
  const canvasRef = useRef();

  const [step, setStep] = useState(1); // 1=upload, 2=adjust, 3=params, 4=converting
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Params
  // Cargar últimos parámetros usados como defaults (dentro del componente, no en módulo-scope)
  const [sizePreset, setSizePreset] = useState(null);
  const [anchoP, setAnchoP] = useState(() => cargarParametrosUso()?.anchoP || 60);
  const [altoP, setAltoP] = useState(() => cargarParametrosUso()?.altoP || 80);
  const [maxColores, setMaxColores] = useState(() => cargarParametrosUso()?.maxColores || 15);
  const [detalle, setDetalle] = useState(() => cargarParametrosUso()?.detalle || 'medio');
  const [aidaCt, setAidaCt] = useState(() => cargarParametrosUso()?.aidaCt || 14);
  const [marca, setMarca] = useState(() => cargarParametrosUso()?.marca || 'DMC');
  const [converting, setConverting] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setStep(2);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const applyPreset = (preset) => {
    setSizePreset(preset.nombre);
    setAnchoP(preset.ancho);
    setAltoP(preset.alto);
  };

  const physSize = calcPhysicalSize(anchoP, altoP, aidaCt);
  const totalStitches = anchoP * altoP;
  const difficulty = calcDifficulty(totalStitches, maxColores);
  const estimatedTime = calcEstimatedTime(totalStitches);
  const threads = AIDA_INFO[aidaCt]?.hebras || 2;

  const handleConvert = async () => {
    setConverting(true);
    try {
      // Load image into canvas with adjustments
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Handle rotation
        const isRotated = rotation % 180 !== 0;
        canvas.width = isRotated ? img.height : img.width;
        canvas.height = isRotated ? img.width : img.height;
        
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Convert — pasamos aidaCt para metadatos de tamaño físico precisos
        const result = convertImageToPattern(imageData, canvas.width, canvas.height, anchoP, altoP, maxColores, detalle, aidaCt);
        
        // Upload original image
        let imageUrl = '';
        if (imageFile) {
          try {
            const uploaded = await base44.integrations.Core.UploadFile({ file: imageFile });
            imageUrl = uploaded.file_url;
          } catch { }
        }
        
        // Usar metadatos devueltos por el motor
        const { metadata } = result;

        // Guardar parámetros para próxima vez
        guardarParametrosUso({ anchoP, altoP, maxColores, detalle, aidaCt, marca });

        // Save pattern
        const patronData = {
          nombre: nombre || 'Nuevo patrón',
          imagen_original: imageUrl,
          estado: 'borrador',
          ancho_puntos: anchoP,
          alto_puntos: altoP,
          tipo_aida: aidaCt,
          max_colores: maxColores,
          nivel_detalle: detalle,
          marca_hilos: marca,
          grid_data: JSON.stringify(result.grid),
          colores_data: JSON.stringify(result.palette),
          progreso_data: JSON.stringify({}),
          total_puntadas: metadata.totalStitches,
          puntadas_completadas: 0,
          porcentaje_avance: 0,
          tamano_estimado_cm: metadata.sizeCm,
          dificultad: metadata.dificultad,
          tiempo_estimado: metadata.tiempoEstimado
        };
        const patron = await base44.entities.Patron.create(patronData);

        // Guardar en caché local
        guardarPatron({ ...patronData, id: patron.id });

        toast({ title: "¡Patrón creado!", description: `${metadata.numColors} colores · ${metadata.sizeCm}` });
        navigate(`/editor/${patron.id}`);
      };
      img.src = imageSrc;
    } catch (e) {
      toast({ title: "Error", description: "No se pudo crear el patrón. Intenta de nuevo.", variant: "destructive" });
      setConverting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Nuevo patrón</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 1 ? 'Sube una imagen para comenzar' : step === 2 ? 'Ajusta tu imagen' : step === 3 ? 'Configura los parámetros' : 'Convirtiendo...'}
        </p>
      </div>

      {/* Tip contextual */}
      {step <= 3 && (
        <TipContextual
          tips={tips}
          enlace={{ texto: 'Ver más consejos', to: '/ayuda' }}
          storageKey={`nuevo-patron-${nivelUsuario}`}
        />
      )}

      {/* Steps indicator */}
      {(() => {
        const pasos = ['Subir imagen', 'Ajustar colores', 'Generar patrón'];
        return (
          <div className="flex items-start gap-1">
            {pasos.map((label, i) => {
              const s = i + 1;
              const active = step === s;
              const done = step > s;
              return (
                <div key={s} className="flex items-start gap-1 flex-1">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      done ? 'bg-primary text-primary-foreground' : active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>{s}</div>
                    <span className={`text-[10px] text-center leading-tight w-16 ${active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{label}</span>
                  </div>
                  {s < 3 && <div className={`h-0.5 flex-1 mt-4 rounded-full transition-colors ${done ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-12 text-center cursor-pointer transition-colors group"
          >
            <Upload className="w-12 h-12 text-muted-foreground/40 group-hover:text-primary/60 mx-auto mb-4 transition-colors" />
            <p className="font-medium mb-1">Arrastra una imagen aquí</p>
            <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo</p>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG o WebP</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          
          <Button variant="outline" className="w-full h-12" onClick={() => fileRef.current?.click()}>
            <Camera className="w-4 h-4 mr-2" />
            Tomar foto
          </Button>

          {/* Preview de los próximos pasos */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-muted/50 rounded-xl p-3 border border-border/60">
              <p className="text-xs font-semibold text-foreground mb-1">Paso 2 · Ajustar colores</p>
              <p className="text-xs text-muted-foreground">Rota la imagen, corrige el brillo, contraste y saturación para que el patrón salga más limpio.</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 border border-border/60">
              <p className="text-xs font-semibold text-foreground mb-1">Paso 3 · Generar patrón</p>
              <p className="text-xs text-muted-foreground">Elige el tamaño, número de colores y tipo de tela Aida. La app convierte tu imagen automáticamente.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Adjust Image */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-muted rounded-2xl p-3 flex items-center justify-center overflow-hidden">
            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-72 w-auto rounded-lg object-contain"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium mb-2 block">Nombre del patrón</Label>
              <Input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: Flor de primavera"
                className="h-11"
              />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5" /> Rotación
              </Label>
              <div className="flex gap-2">
                {[0, 90, 180, 270].map(r => (
                  <Button key={r} size="sm" variant={rotation === r ? 'default' : 'outline'} onClick={() => setRotation(r)}>
                    {r}°
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5" /> Brillo: {brightness}%
              </Label>
              <Slider value={[brightness]} onValueChange={v => setBrightness(v[0])} min={50} max={150} step={5} />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 flex items-center gap-2">
                <Contrast className="w-3.5 h-3.5" /> Contraste: {contrast}%
              </Label>
              <Slider value={[contrast]} onValueChange={v => setContrast(v[0])} min={50} max={150} step={5} />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5" /> Saturación: {saturation}%
              </Label>
              <Slider value={[saturation]} onValueChange={v => setSaturation(v[0])} min={0} max={200} step={5} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setStep(1); setImageSrc(null); }} className="flex-1 h-12">
              Cambiar imagen
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1 h-12">
              Continuar <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Conversion Parameters */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Size Presets */}
          <div>
            <Label className="text-xs font-medium mb-3 block">Tamaño sugerido</Label>
            <div className="grid grid-cols-3 gap-3">
              {TAMANOS_SUGERIDOS.map(t => {
                const ps = calcPhysicalSize(t.ancho, t.alto, aidaCt);
                return (
                  <button
                    key={t.nombre}
                    onClick={() => applyPreset(t)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sizePreset === t.nombre ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <p className="font-medium text-sm">{t.nombre}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.ancho}×{t.alto} pts</p>
                    <p className="text-xs text-muted-foreground">{ps.width}×{ps.height} cm</p>
                    <p className="text-xs text-muted-foreground">{t.tiempo}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium mb-1.5">Ancho (puntos)</Label>
              <Input type="number" value={anchoP} onChange={e => { setAnchoP(Number(e.target.value)); setSizePreset(null); }} min={10} max={300} className="h-11" />
            </div>
            <div>
              <Label className="text-xs font-medium mb-1.5">Alto (puntos)</Label>
              <Input type="number" value={altoP} onChange={e => { setAltoP(Number(e.target.value)); setSizePreset(null); }} min={10} max={300} className="h-11" />
            </div>
          </div>

          {/* Max Colors */}
          <div>
            <Label className="text-xs font-medium mb-1.5">Máximo de colores: {maxColores}</Label>
            <Slider value={[maxColores]} onValueChange={v => setMaxColores(v[0])} min={3} max={40} step={1} />
          </div>

          {/* Detail Level */}
          <div>
            <Label className="text-xs font-medium mb-2">Nivel de detalle</Label>
            <RadioGroup value={detalle} onValueChange={setDetalle} className="flex gap-3">
              {['bajo', 'medio', 'alto'].map(d => (
                <div key={d} className="flex items-center gap-2">
                  <RadioGroupItem value={d} id={`d-${d}`} />
                  <Label htmlFor={`d-${d}`} className="text-sm capitalize cursor-pointer">{d === 'bajo' ? 'Bajo' : d === 'medio' ? 'Medio' : 'Alto'}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Aida */}
          <div>
            <Label className="text-xs font-medium mb-1.5">Tela Aida</Label>
            <Select value={String(aidaCt)} onValueChange={v => setAidaCt(Number(v))}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AIDA_INFO).map(([ct, info]) => (
                  <SelectItem key={ct} value={ct}>{info.name} — {info.desc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div>
            <Label className="text-xs font-medium mb-1.5">Marca de hilos</Label>
            <Select value={marca} onValueChange={setMarca}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DMC">DMC</SelectItem>
                <SelectItem value="Anchor">Anchor</SelectItem>
                <SelectItem value="Presencia">Presencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="bg-accent/50 rounded-xl p-4 space-y-2">
            <h4 className="font-heading font-semibold text-sm">Resumen</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Tamaño físico:</span>
              <span className="font-medium">{physSize.width} × {physSize.height} cm</span>
              <span className="text-muted-foreground">Total de puntadas:</span>
              <span className="font-medium">{totalStitches.toLocaleString()}</span>
              <span className="text-muted-foreground">Dificultad:</span>
              <span className="font-medium">{DIFFICULTY_LABELS[difficulty]}</span>
              <span className="text-muted-foreground">Tiempo estimado:</span>
              <span className="font-medium">{estimatedTime}</span>
              <span className="text-muted-foreground">Hebras sugeridas:</span>
              <span className="font-medium">{threads} hebras</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
              Volver
            </Button>
            <Button onClick={handleConvert} disabled={converting} className="flex-1 h-12">
              {converting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {converting ? 'Convirtiendo...' : 'Crear patrón'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}