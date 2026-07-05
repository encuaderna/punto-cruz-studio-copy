import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, AlertTriangle, Lightbulb, Package, Scissors, Target, Zap } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const HELP_CONTENT = {
  principiante: {
    label: "Principiante",
    icon: BookOpen,
    color: "text-green-600",
    sections: [
      {
        title: "¿Qué es el punto cruz?",
        content: "El punto cruz es una técnica de bordado donde se forman pequeñas X sobre una tela de trama regular (tela Aida). Es una de las formas de bordado más fáciles de aprender y permite crear diseños hermosos a partir de patrones cuadriculados."
      },
      {
        title: "Materiales básicos que necesitas",
        content: "• **Tela Aida**: la más común es la de 14 ct (cuentas por pulgada). Para principiantes se recomienda Aida 11 ct, que tiene cuadros más grandes.\n• **Hilos de bordar**: las marcas más comunes en Chile son DMC, Anchor y Presencia. Los hilos vienen en madejas y se separan en hebras.\n• **Aguja de punto cruz**: punta redondeada, tamaño 24 o 26.\n• **Bastidor**: para mantener la tela tensa.\n• **Tijeras pequeñas**: para cortar los hilos."
      },
      {
        title: "¿Cuántas hebras usar?",
        content: "Depende de la tela:\n• **Aida 11 ct**: usar 3 hebras\n• **Aida 14 ct**: usar 2 hebras (la más común)\n• **Aida 16 ct**: usar 2 hebras\n• **Aida 18 ct**: usar 1 hebra\n\nLos hilos DMC vienen con 6 hebras que puedes separar fácilmente."
      },
      {
        title: "Cómo empezar tu primer bordado",
        content: "1. Encuentra el centro de la tela doblándola a la mitad dos veces.\n2. Marca el centro con un alfiler.\n3. Empieza a bordar desde el centro del patrón hacia afuera.\n4. Haz todas las puntadas de un mismo color antes de cambiar.\n5. No hagas nudos: asegura el hilo pasándolo por debajo de las primeras puntadas."
      },
      {
        title: "Cómo usar esta app",
        content: "1. Ve a **Crear patrón** y sube una imagen o foto.\n2. Ajusta el brillo y contraste si es necesario.\n3. Elige el tamaño, la tela Aida y la cantidad de colores.\n4. La app convertirá tu imagen en un patrón cuadriculado.\n5. En el **Editor**, revisa los colores y ajusta lo que necesites.\n6. Cuando estés lista para bordar, entra al **Modo bordado** y marca cada puntada que vayas completando.\n7. ¡Tu progreso se guarda automáticamente!"
      }
    ]
  },
  intermedio: {
    label: "Intermedio",
    icon: Target,
    color: "text-blue-600",
    sections: [
      {
        title: "Técnicas para mejorar tu bordado",
        content: "• **Consistencia**: todas las X deben cruzar en la misma dirección (la hebra superior siempre va del mismo lado).\n• **Tensión uniforme**: no tires demasiado del hilo ni lo dejes muy suelto.\n• **Bordar por filas**: completa filas de medio punto (////) y luego vuelve con el otro medio (\\\\\\\\).\n• **Parking**: para patrones con muchos cambios de color, \"estaciona\" las agujas con cada color para no cortar."
      },
      {
        title: "Cómo elegir los colores correctos",
        content: "• Compara los colores en la pantalla con los hilos reales bajo luz natural.\n• Si un color DMC no está disponible, busca el equivalente en Anchor o Presencia usando la paleta de la app.\n• Cuando veas \"equivalente aproximado\" significa que el color es cercano pero no idéntico.\n• Considera comprar un muestrario de colores de tu marca favorita."
      },
      {
        title: "Cómo leer patrones complejos",
        content: "• Usa el modo **Símbolos** para patrones con muchos colores similares.\n• Activa la función **Resaltar color** para enfocarte en un solo color a la vez.\n• Las líneas gruesas cada 10 cuadros te ayudan a contar sin perderte.\n• Marca las puntadas completadas para no perder tu lugar."
      },
      {
        title: "Organización del bordado",
        content: "• Etiqueta tus madejas con el código del color.\n• Usa un organizador de hilos para mantener todo ordenado.\n• Borda en sesiones de 30-60 minutos para evitar cansancio visual.\n• Guarda el bastidor en una funda limpia cuando no lo uses."
      }
    ]
  },
  avanzado: {
    label: "Avanzado",
    icon: Zap,
    color: "text-purple-600",
    sections: [
      {
        title: "Patrones grandes y complejos",
        content: "• Para patrones de más de 100×100 puntos, divide el trabajo en secciones.\n• Usa la función de **zoom** y **enfoque por zonas** en el modo bordado.\n• El modo **solo pendiente** te ayuda a ver exactamente qué falta.\n• Considera imprimir secciones del patrón como respaldo."
      },
      {
        title: "Técnicas avanzadas de color",
        content: "• **Blending**: combina hebras de dos colores diferentes para crear tonos intermedios.\n• **Confetti stitching**: para áreas con puntadas individuales de muchos colores, trabaja por columnas en vez de por color.\n• **Fusión de colores**: en la app, usa la herramienta de fusionar colores para simplificar patrones complejos sin perder la esencia del diseño."
      },
      {
        title: "Acabado profesional",
        content: "• Lava el bordado terminado con agua tibia y jabón suave.\n• Sécalo entre toallas, nunca lo retuerzas.\n• Plancha por el revés con una toalla debajo para que las puntadas no se aplasten.\n• Para enmarcar, usa cartón libre de ácido."
      },
      {
        title: "Emprendimiento en bordado",
        content: "• Documenta tu proceso: sube la foto del trabajo terminado en la app.\n• Calcula el costo real: hilos + tela + tiempo.\n• Ofrece patrones personalizados: convierte las fotos de tus clientes en patrones.\n• Usa la biblioteca de la app para organizar pedidos y proyectos."
      }
    ]
  }
};

const ERRORES_COMUNES = [
  {
    error: "Las X cruzan en distintas direcciones",
    prevencion: "Siempre pasa la hebra superior de izquierda a derecha (o viceversa), pero mantén la misma dirección en todo el proyecto.",
    correccion: "Deshaz las puntadas incorrectas con cuidado y repítelas en la dirección correcta."
  },
  {
    error: "Los hilos se enredan o hacen nudos",
    prevencion: "Usa tramos de hilo de máximo 40 cm. Deja que la aguja cuelgue cada pocas puntadas para que se desenrede sola.",
    correccion: "Pasa la aguja por el nudo con cuidado, sin tirar. Si no se deshace, corta y comienza un nuevo tramo."
  },
  {
    error: "Contar mal los cuadros",
    prevencion: "Usa las marcas de 10×10 del patrón, borda desde el centro y ve marcando lo que ya hiciste.",
    correccion: "Cuenta desde una referencia segura (como el centro o una orilla bordada). Si hay puntadas mal ubicadas, deshaz y reubica."
  },
  {
    error: "La tela se arruga o deforma",
    prevencion: "No tires demasiado del hilo. Usa un bastidor y ajústalo sin estirar la tela en exceso.",
    correccion: "Lava suavemente la tela con agua tibia y extiéndela sobre una superficie plana para secar."
  },
  {
    error: "Se ven los hilos por detrás",
    prevencion: "No hagas saltos largos por el revés. Si el siguiente punto del mismo color está a más de 4 cuadros, corta y comienza de nuevo.",
    correccion: "Asegura los hilos sueltos pasándolos por debajo de las puntadas existentes por el revés."
  }
];

export default function Ayuda() {
  const [level, setLevel] = useState('principiante');

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Ayuda y guías</h1>
        <p className="text-sm text-muted-foreground mt-1">Aprende según tu nivel de experiencia</p>
      </div>

      {/* Level Selector */}
      <Tabs value={level} onValueChange={setLevel}>
        <TabsList className="w-full h-auto grid grid-cols-3 p-1">
          {Object.entries(HELP_CONTENT).map(([key, data]) => (
            <TabsTrigger key={key} value={key} className="py-2.5 text-xs sm:text-sm data-[state=active]:shadow-sm">
              {data.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(HELP_CONTENT).map(([key, data]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <data.icon className={`w-5 h-5 ${data.color}`} />
              <h2 className="font-heading text-lg font-semibold">Nivel {data.label}</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {data.sections.map((section, i) => (
                <AccordionItem key={i} value={`${key}-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-card">
                  <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pb-4">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      {/* Common Mistakes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="font-heading text-lg font-semibold">Errores comunes</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {ERRORES_COMUNES.map((item, i) => (
            <AccordionItem key={i} value={`err-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-card">
              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                {item.error}
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-3">
                <div>
                  <Badge variant="secondary" className="text-[10px] mb-1.5">Prevención</Badge>
                  <p className="text-sm text-muted-foreground">{item.prevencion}</p>
                </div>
                <div>
                  <Badge variant="secondary" className="text-[10px] mb-1.5">Corrección</Badge>
                  <p className="text-sm text-muted-foreground">{item.correccion}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}