import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Moon, Sun, LogOut, User, Palette, Grid3X3, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/lib/ThemeContext';
import { AIDA_INFO } from '@/lib/constants';

export default function Ajustes() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Preferences
  const [marcaFav, setMarcaFav] = useState('DMC');
  const [aidaFav, setAidaFav] = useState('14');
  const [nivel, setNivel] = useState('principiante');
  const [vistaDefault, setVistaDefault] = useState('color');

  useEffect(() => {
    async function load() {
      try {
        const u = await base44.auth.me();
        setUser(u);
        // Load saved prefs from localStorage
        try {
          const prefs = JSON.parse(localStorage.getItem('pcstudio-prefs') || '{}');
          if (prefs.marcaFav) setMarcaFav(prefs.marcaFav);
          if (prefs.aidaFav) setAidaFav(prefs.aidaFav);
          if (prefs.nivel) setNivel(prefs.nivel);
          if (prefs.vistaDefault) setVistaDefault(prefs.vistaDefault);
        } catch {}
      } catch {}
    }
    load();
  }, []);

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('pcstudio-prefs', JSON.stringify({ marcaFav, aidaFav, nivel, vistaDefault }));
      toast({ title: "Preferencias guardadas" });
    } catch {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/login');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="font-heading text-2xl font-bold">Ajustes</h1>

      {/* Profile */}
      <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{user?.full_name || 'Usuario'}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-heading font-semibold text-base">Apariencia</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium">Modo {theme === 'dark' ? 'oscuro' : 'claro'}</p>
              <p className="text-xs text-muted-foreground">Cambia entre tema claro y oscuro</p>
            </div>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </section>

      {/* Defaults */}
      <section className="bg-card border border-border rounded-2xl p-5 space-y-5">
        <h2 className="font-heading font-semibold text-base">Preferencias por defecto</h2>

        <div className="space-y-2">
          <Label className="text-sm">Marca de hilos favorita</Label>
          <Select value={marcaFav} onValueChange={setMarcaFav}>
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

        <div className="space-y-2">
          <Label className="text-sm">Tela Aida favorita</Label>
          <Select value={aidaFav} onValueChange={setAidaFav}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AIDA_INFO).map(([ct, info]) => (
                <SelectItem key={ct} value={ct}>{info.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Nivel de experiencia</Label>
          <RadioGroup value={nivel} onValueChange={setNivel} className="space-y-2">
            {[
              { value: 'principiante', label: 'Principiante', desc: 'Recién empezando' },
              { value: 'intermedio', label: 'Intermedio', desc: 'Ya tengo experiencia' },
              { value: 'avanzado', label: 'Avanzado', desc: 'Bordador experto' }
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted cursor-pointer transition-colors">
                <RadioGroupItem value={opt.value} />
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Vista predeterminada</Label>
          <Select value={vistaDefault} onValueChange={setVistaDefault}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="simbolos">Símbolos</SelectItem>
              <SelectItem value="mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full h-11" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar preferencias
        </Button>
      </section>

      <Separator />

      <Button variant="outline" className="w-full h-11 text-destructive hover:text-destructive" onClick={handleLogout}>
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </div>
  );
}