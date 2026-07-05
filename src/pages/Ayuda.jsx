import React from 'react';
import { BookOpen, Target, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import InfografiaVisual from '@/components/InfografiaVisual';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const HELP_CONTENT = {
  principiante: {
    label: "Principiante",
    icon: BookOpen,
    color: "text-green-600",
    badge: "bg-green-100 text-green-700",
    sections: [
      {
        title: "Tu primer proyecto: tela Aida 14, pequeño y manejable",
        summary: "Por dónde empezar sin abrumarse.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/f33f3b85a_Gua_de_telas_y_bordadoAidaCuadrill.png",
        infografiaAlt: "Guía Esencial de Punto de Cruz: Telas y Técnicas",
        miniInfografia: { tipo: 'pasos', datos: { titulo: '3 pasos para tu primer proyecto', pasos: [
          { icono: '🎨', titulo: 'Diseño pequeño', detalle: 'Máx. 40×40 puntos' },
          { icono: '🧵', titulo: 'Tela Aida 14 ct', detalle: '2 hebras de hilo' },
          { icono: '🎯', titulo: 'Pocos colores', detalle: '8–10 colores máx.' },
        ]}},
        content: `Para tu primer bordado, elige un diseño de máximo 40×40 puntos sobre tela Aida 14 ct. Ese tamaño cabe en la palma de tu mano y lo puedes terminar en pocas sesiones, lo que da una enorme satisfacción.

¿Por qué Aida 14? Tiene agujeros visibles sin necesidad de lupa y el cuadro es suficientemente grande para manejar la aguja con facilidad. Usa 2 hebras de hilo DMC (sepáralas del madejo de 6 con cuidado, tirando de a una).

Pasos concretos para empezar:
1. Dobla la tela a la mitad dos veces para encontrar el centro; márcalo con un alfiler o un hilo de color.
2. Empieza a bordar desde el centro del patrón hacia los bordes.
3. Haz todos los medios puntos en una dirección (////), luego vuelve con los cruces (\\\\).
4. No hagas nudos al inicio: asegura el hilo pasándolo bajo las primeras puntadas del revés.
5. Corta los tramos de hilo a máximo 40 cm para que no se enreden.

Consejo clave: no intentes terminar todo de una vez. Media hora al día es ideal para no cansarte la vista ni los dedos.`
      },
      {
        title: "Cómo leer un patrón: símbolos, cuadrícula y bloques 10×10",
        summary: "Entiende el mapa antes de empezar a bordar.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/2d9e6a63b_Gua_maestra_de_punto_cruz.png",
        infografiaAlt: "Guía Maestra de Iniciación al Punto de Cruz: Del Lienzo a la Puntada",
        miniInfografia: { tipo: 'checklist', datos: { titulo: 'Cómo orientarte en el patrón', items: [
          { icono: '🔲', titulo: 'Bloques 10×10', detalle: 'Líneas gruesas = bloques guía. Nunca cuentes de a uno.' },
          { icono: '⊕', titulo: 'Centro primero', detalle: 'Las flechas del patrón marcan el punto de partida.' },
          { icono: '🔣', titulo: 'Símbolo vs color', detalle: 'Cambia la vista en la app: color o símbolo.' },
          { icono: '📍', titulo: 'Marca tu avance', detalle: 'Toca cada puntada en Modo bordado para no perderte.' },
        ]}},
        content: `Un patrón de punto cruz es como un mapa cuadriculado: cada cuadro representa una puntada y cada color (o símbolo) indica qué hilo usar.

La cuadrícula y los bloques 10×10:
Las líneas más gruesas dividen el patrón en bloques de 10×10 puntos. Esto es esencial para contar sin perderte. En vez de contar puntada a puntada, muévete de bloque en bloque.

Los símbolos:
Cuando hay muchos colores parecidos (varios tonos de azul, por ejemplo), los patrones usan símbolos distintos para cada uno (un triángulo, una X, un punto, etc.). En la app puedes alternar entre vista por color y vista por símbolo desde el editor.

Cómo orientarte dentro del patrón:
- Ubica el centro (marcado con flechas o cruces en el patrón) y empieza ahí.
- Trabaja de a un bloque 10×10 a la vez.
- Marca en la app cada puntada que completes para no perder tu lugar.
- Si necesitas alejarte, deja la aguja "estacionada" en el último color que usaste.

Tip: en el Modo bordado de la app puedes activar "Solo pendiente" para ver únicamente las puntadas que te faltan.`
      },
      {
        title: "Errores comunes al comenzar y cómo prevenirlos",
        summary: "Contar mal, tensión del hilo y perder el centro.",
        miniInfografia: { tipo: 'tabla', datos: { titulo: 'Errores frecuentes y cómo solucionarlos', col1: '❌ Error', col2: '✅ Qué hacer', filas: [
          ['Contar mal cuadros', 'Muévete de bloque 10×10 en bloque, desde el centro.'],
          ['Tensión incorrecta', 'El hilo debe quedar suave. Ni apretado ni suelto.'],
          ['Perder el centro', 'Marca el centro con hilo de color antes de empezar.'],
          ['Nudos al inicio', 'Asegura pasando el hilo bajo las primeras puntadas.'],
        ]}},
        content: `Estos son los tres errores que cometen casi todas las personas al empezar:

❌ Contar mal los cuadros
Prevención: usa siempre los bloques de 10×10 como referencia, no cuentes desde el borde sino desde el centro o desde una zona ya bordada.
Corrección: si notas que algo "no cuadra", cuenta desde una referencia segura antes de deshacer todo.

❌ Tensión incorrecta del hilo
Prevención: el hilo debe quedar suave sobre la tela, ni demasiado apretado (arruga la tela) ni muy suelto (la puntada se ve floja). Practica en un pedacito de tela antes.
Corrección: si la tela se frunce, lávala con agua tibia y estírala suavemente sobre una superficie plana para secar.

❌ Perder el centro
Prevención: marca el centro de tu tela con un hilo de color que puedas retirar luego (hilo de bastear). En la app, activa la guía de hileras y columnas en el Modo bordado.
Corrección: cuenta desde la última puntada correcta que tengas y reubica tu posición antes de continuar.

Recuerda: deshacer puntadas mal hechas es parte del proceso. No te frustres, ¡hasta las bordadoras expertas lo hacen!`
      },
      {
        title: "Materiales básicos que necesitas",
        summary: "Lista esencial para empezar sin gastar de más.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/ae7ecd610_Gua_Materiales_Punto_de_Cruz.png",
        infografiaAlt: "Guía de Materiales Esenciales para Punto de Cruz",
        miniInfografia: { tipo: 'checklist', datos: { titulo: 'Kit esencial de materiales', items: [
          { icono: '🧶', titulo: 'Tela Aida 14 ct', detalle: 'La más versátil para comenzar.' },
          { icono: '🪡', titulo: 'Hilos DMC / Anchor', detalle: 'Madejas de 6 hebras separables.' },
          { icono: '🪢', titulo: 'Aguja tapicería N°24', detalle: 'Punta redondeada, no corta la tela.' },
          { icono: '⭕', titulo: 'Bastidor o aro', detalle: 'Mantiene la tela tensa y uniforme.' },
          { icono: '✂️', titulo: 'Tijeras pequeñas', detalle: 'Punta fina para cortar con precisión.' },
          { icono: '📐', titulo: 'Hebras por tela', detalle: 'Aida 11→3 h · Aida 14→2 h · Aida 18→1 h' },
        ]}},
        content: `No necesitas mucho para empezar. Esta es la lista mínima:

• Tela Aida 14 ct: es la más versátil y fácil de conseguir.
• Hilos DMC, Anchor o Presencia: las tres marcas son de buena calidad. Los hilos vienen en madejas con 6 hebras.
• Aguja de punta redondeada, tamaño 24 o 26.
• Bastidor o aro: mantiene la tela tensa y mejora la tensión de las puntadas.
• Tijeras pequeñas con punta fina.

Cuántas hebras usar según la tela:
• Aida 11 ct → 3 hebras
• Aida 14 ct → 2 hebras (la más común)
• Aida 18 ct → 1 hebra

Tip de ahorro: compra solo los hilos del patrón que vayas a hacer. Es tentador comprar mucho, pero los proyectos pequeños usan poquísimo hilo.`
      }
    ]
  },
  intermedio: {
    label: "Intermedio",
    icon: Target,
    color: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    sections: [
      {
        title: "Cómo adaptar una foto a patrón sin exceso de detalle",
        summary: "Convertir imágenes sin que el resultado sea un caos de colores.",
        miniInfografia: { tipo: 'flujo', datos: { titulo: 'Flujo: de foto a patrón limpio', nodos: [
          { tipo: 'inicio', icono: '📷', texto: 'Foto', subtexto: 'Fondo simple, buen contraste' },
          { tipo: 'paso', icono: '⚡', texto: 'Ajustar', subtexto: '+Contraste, +Brillo' },
          { tipo: 'paso', icono: '🎨', texto: '8–12 colores', subtexto: 'Empieza con pocos' },
          { tipo: 'paso', icono: '📏', texto: '60×80 pts', subtexto: 'Tamaño moderado' },
          { tipo: 'fin', icono: '✅', texto: 'Revisar', subtexto: 'Simplifica si hace falta' },
        ]}},
        content: `El mayor desafío al convertir fotos a patrones es que las fotografías tienen millones de colores y gradientes que no se pueden bordar tal cual.

Claves para una buena conversión:
1. Elige fotos con contornos claros y fondos simples. Un primer plano de una flor funciona mucho mejor que una escena compleja con muchos elementos.
2. Aumenta el contraste de la imagen antes de convertirla (usa el ajustador de la app). Más contraste = colores más definidos = patrón más limpio.
3. Empieza con pocos colores (8–12) y ve subiendo solo si el resultado no te convence. Más colores no siempre significa mejor patrón.
4. Tamaño moderado: un patrón de 60×80 puntos ya captura bastante detalle para la mayoría de fotos.

Qué evitar:
- Fotos con fondo complicado (muchos colores de fondo se "cuelan" al patrón).
- Imágenes con poca luz o muy desaturadas: el resultado tiende a ser monocromático.
- Patrones demasiado grandes para empezar: es mejor hacer uno mediano y aprender de él.

Flujo recomendado en la app: sube → ajusta brillo/contraste → elige tamaño mediano → prueba con 10 colores → revisa en el editor → simplifica si hace falta.`
      },
      {
        title: "Cómo reducir colores manteniendo el motivo principal",
        summary: "Simplificar sin perder la esencia del diseño.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/1fe958899_Gua_hilos_para_punto_cruz.png",
        infografiaAlt: "Guía de Hilos y Hebras para Punto de Cruz",
        miniInfografia: { tipo: 'tabla', datos: { titulo: 'Cuántos colores según el diseño', col1: '🎨 Nº colores', col2: '📌 Ideal para…', filas: [
          ['6–8 colores', 'Siluetas, iconos, diseños muy gráficos.'],
          ['10–15 colores', 'Flores, mascotas, paisajes simples.'],
          ['15–25 colores', 'Retratos de personas, escenas detalladas.'],
        ]}},
        content: `Reducir colores es un arte. El objetivo es que el motivo siga siendo reconocible aunque uses menos tonos.

Estrategia de reducción:
1. Identifica los colores "protagonistas" (los que forman el motivo principal) y los "secundarios" (sombras, medios tonos, fondos).
2. Fusiona primero los colores secundarios similares. En el Editor, selecciona un color y usa la función "Fusionar" para unirlo con el más parecido.
3. Simplifica el fondo: si el fondo tiene 4 tonos de beige, cámbialo todo a 1 o 2.
4. Revisa el resultado en vista de "Símbolos" para ver si el motivo sigue siendo claro.

Regla práctica:
- 6–8 colores: diseños muy gráficos, siluetas, iconos.
- 10–15 colores: retratos de mascotas, flores, paisajes simples.
- 15–25 colores: retratos de personas, escenas detalladas.

Tip: a veces un patrón de 8 colores se ve más bonito que uno de 20 porque es más limpio y fácil de bordar. No le tengas miedo a simplificar.`
      },
      {
        title: "Cómo retomar proyectos grandes usando la app como mapa",
        summary: "Volver a un proyecto después de semanas sin perderte.",
        content: `Dejar un proyecto grande por semanas (o meses) es muy común. El truco está en dejar buenas "marcas" antes de parar.

Antes de dejar el proyecto:
1. Guarda el progreso en la app (botón Guardar del Modo bordado). La app registra exactamente qué puntadas completaste.
2. Sube una foto del estado actual en "Registro de progreso" del proyecto. Así puedes comparar visualmente antes y después.
3. Deja una nota en el proyecto: en qué color ibas, qué zona estabas bordando, si encontraste algún error que debas corregir.

Al retomar:
1. Abre el proyecto desde la Biblioteca y revisa el porcentaje de avance.
2. Entra al Modo bordado: las puntadas que ya marcaste aparecerán atenuadas o en color diferente.
3. Usa el filtro por color para trabajar un hilo a la vez y no confundirte.
4. Activa "Solo pendiente" para ver únicamente lo que falta.

Si tienes un patrón impreso o físico:
Marca con lápiz las zonas ya bordadas en el papel. La app y el papel se complementan perfectamente.`
      },
      {
        title: "Técnicas para mejorar tu bordado",
        summary: "Consistencia, tensión y organización del trabajo.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/d5854143a_Gua_Maestra_de_Punto_Cruz1.png",
        infografiaAlt: "Guía Maestra de Punto de Cruz: Técnica, Puntos y Acabados",
        content: `Con experiencia básica ya adquirida, estos detalles marcan la diferencia en el resultado final:

Consistencia en la dirección de la X:
Todas las puntadas superiores deben ir en la misma dirección (siempre de izquierda a derecha, o siempre de derecha a izquierda). Si mezclas, el bordado se ve disparejo.

Bordar por filas:
En vez de completar cada X de manera individual, haz todos los medios puntos de una fila completa (//////) y luego vuelve completando las X (\\\\\\). Esto es más rápido y da mejor tensión.

Parking (estacionar colores):
En zonas con muchos cambios de color pequeños, deja las agujas "estacionadas" a lo largo de la tela. Cuando necesitas un color, la aguja ya está en el lugar correcto.

Organización de hilos:
Usa un organizador con los códigos de color anotados. Antes de empezar una sesión, prepara los tramos de hilo que vas a necesitar (40 cm cada uno).`
      }
    ]
  },
  avanzado: {
    label: "Avanzado / Emprendimiento",
    icon: Zap,
    color: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    sections: [
      {
        title: "Crear colecciones de patrones consistentes",
        summary: "Para quien quiere ofrecer patrones con identidad propia.",
        miniInfografia: { tipo: 'columnas', datos: { titulo: 'Organiza tu colección por estado', columnas: [
          { icono: '✏️', titulo: 'Borrador', items: ['Idea inicial', 'Sin foto final', 'Paleta sin definir'] },
          { icono: '🪡', titulo: 'En proceso', items: ['Bordado en curso', 'Fotos de avance', 'Código DMC anotado'] },
          { icono: '✅', titulo: 'Completo', items: ['Foto final subida', 'Lista de materiales', 'Listo para vender'] },
        ]}},
        content: `Una colección coherente tiene un "hilo conductor" visual: misma paleta de colores base, mismo estilo de trazo, dimensiones similares. Esto hace que tus patrones se vean profesionales y reconocibles.

Cómo armar una colección en la app:
1. Define una paleta de 8–12 colores base que uses en todos los patrones de la colección. Anota los códigos DMC y guárdalos en tus ajustes.
2. Usa dimensiones estandarizadas (por ejemplo: todos los patrones de la colección son 60×60 o 80×100 puntos). Esto permite calcular tiempos y materiales de manera consistente.
3. Nombra los patrones con un sistema claro: "Flores de verano 01", "Flores de verano 02", etc. Usa la Biblioteca para mantenerlos agrupados.
4. Antes de publicar un patrón, termina al menos una versión en tela y sube la foto final. Los compradores necesitan ver el resultado real, no solo el digital.

Coherencia de estilo:
- Decide si usarás medios puntos (1/4 o 3/4) o solo puntos enteros. Los medios puntos dan más detalle pero complican la lectura.
- Define un nivel de detalle estándar para toda la colección (bajo, medio o alto) y mantenlo.`
      },
      {
        title: "Organizar proyectos terminados y fotos de proceso para mostrar a clientas o en redes",
        summary: "Tu biblioteca como portafolio profesional.",
        miniInfografia: { tipo: 'pasos', datos: { titulo: 'Construye tu portafolio paso a paso', pasos: [
          { icono: '📌', titulo: 'Elige proyecto', detalle: 'Con historia visual' },
          { icono: '📸', titulo: 'Registra progreso', detalle: 'Foto cada 25% de avance' },
          { icono: '🖼️', titulo: 'Antes y después', detalle: 'Tela vacía → bordado final' },
          { icono: '🌐', titulo: 'Publica o muestra', detalle: 'Redes o a clientas directamente' },
        ]}},
        content: `Las fotos de proceso son tan valiosas como la foto final. Muestran tu dedicación y ayudan a otras bordadoras a aprender de tu trabajo.

Qué documentar en cada proyecto:
1. Foto al inicio (tela en blanco con el centro marcado).
2. Una foto cada 25–30% de avance: sube cada una en "Registro de progreso" del proyecto en la app.
3. Foto al 100% antes del lavado y después del lavado/planchado.
4. Foto del enmarcado o montaje final.

Para redes sociales:
- Las fotos de proceso generan más interacción que las fotos finales. Muestra los errores también, no solo los logros.
- Anota en cada foto el código de los colores DMC que estás usando: es la información que más piden las seguidoras.
- Usa las notas del proyecto para recordar qué materiales usaste, el tiempo total y cualquier adaptación que hiciste.

Para clientas:
- La Biblioteca de la app te permite ver todos tus proyectos de un vistazo. Puedes mostrarla directamente desde el teléfono.
- Duplica un patrón existente para una nueva clienta, así mantienes el original intacto.
- Las fotos de progreso son prueba de trabajo para clientes que pagan por encargo.`
      },
      {
        title: "Técnicas avanzadas de color y acabado profesional",
        summary: "Blending, confetti y cómo dejar el bordado listo para presentar.",
        infografia: "https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/6bef5972c_Gua_de_bordado_punto_cruz.png",
        infografiaAlt: "Guía de Punto de Cruz: El Arte de Bordar sin Nudos",
        content: `Blending (mezcla de hebras):
Combina una hebra de dos colores distintos en la misma aguja para crear tonos intermedios que no existen en la paleta DMC. Ejemplo: una hebra de azul cielo + una de blanco = celeste suave. En la app, fusiona dos colores similares y luego borda con blending en esa zona.

Confetti stitching:
Son las puntadas individuales de muchos colores distintos en una zona pequeña (como el pelaje de un animal o el fondo de un paisaje). El truco es trabajar por columnas verticales en vez de por color: así no tienes que cortar y atar el hilo decenas de veces.

Acabado profesional:
1. Lava el bordado terminado con agua tibia y jabón suave para quita el marcado del bastidor y la grasa de las manos.
2. Sécalo entre toallas limpias sin retorcer.
3. Plancha por el revés con una toalla gruesa debajo para que las puntadas no se aplasten.
4. Para enmarcar: usa cartón libre de ácido (sin lignina) para que el bordado no se amarille con los años.
5. Documenta todo en la app antes de entregar o empacar.`
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
  // Leer nivel guardado en preferencias
  let nivelGuardado = 'principiante';
  try {
    const prefs = JSON.parse(localStorage.getItem('pcstudio-prefs') || '{}');
    if (prefs.nivel) nivelGuardado = prefs.nivel === 'avanzado' ? 'avanzado' : prefs.nivel;
  } catch {}

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-8 pb-safe">
      <div>
        <h1 className="font-heading text-2xl font-bold">Ayuda y guías</h1>
        <p className="text-sm text-muted-foreground mt-2">Aprende según tu nivel de experiencia</p>
      </div>

      {/* Infografía de referencia */}
      <div className="rounded-2xl overflow-hidden border border-border">
        <img
          src="https://media.base44.com/images/public/6a49c28fc2406a5f1b94fe34/fc9419211_Gua_esencial_punto_de_cruz.png"
          alt="Guía Esencial de Punto de Cruz: Técnicas y Pasos Fundamentales"
          className="w-full object-contain"
        />
      </div>

      {/* Level Tabs */}
      <Tabs defaultValue={nivelGuardado}>
        <TabsList className="w-full h-auto grid grid-cols-3 p-1">
          {Object.entries(HELP_CONTENT).map(([key, data]) => (
            <TabsTrigger key={key} value={key} className="min-h-[44px] py-2.5 text-xs sm:text-sm data-[state=active]:shadow-sm">
              {data.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(HELP_CONTENT).map(([key, data]) => (
          <TabsContent key={key} value={key} className="mt-6 space-y-3">
            <div className="flex items-center gap-2 mb-5">
              <data.icon className={`w-5 h-5 ${data.color}`} />
              <h2 className="font-heading text-lg font-semibold">Nivel {data.label}</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {data.sections.map((section, i) => (
                <AccordionItem
                  key={i}
                  value={`${key}-${i}`}
                  className="border border-border rounded-xl px-4 data-[state=open]:bg-card"
                >
                  <AccordionTrigger className="hover:no-underline min-h-[56px] py-4 text-left">
                    <div className="flex-1 text-left pr-3">
                      <p className="text-sm font-medium leading-snug">{section.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{section.summary}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 space-y-5">
                    {section.miniInfografia && (
                      <InfografiaVisual tipo={section.miniInfografia.tipo} datos={section.miniInfografia.datos} />
                    )}
                    {section.infografia && (
                      <div className="rounded-xl overflow-hidden border border-border">
                        <img
                          src={section.infografia}
                          alt={section.infografiaAlt || section.title}
                          className="w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    {section.content && (
                      <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line max-w-prose">
                        {section.content}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      {/* Common Mistakes */}
      <section className="space-y-4" id="errores-comunes">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="font-heading text-lg font-semibold">Errores comunes</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {ERRORES_COMUNES.map((item, i) => (
            <AccordionItem key={i} value={`err-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-card">
              <AccordionTrigger className="text-sm font-medium min-h-[52px] py-4 hover:no-underline text-left leading-snug">
                {item.error}
              </AccordionTrigger>
              <AccordionContent className="pb-5 space-y-4">
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[11px] px-2.5 py-1">Prevención</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.prevencion}</p>
                </div>
                <div className="space-y-1.5">
                  <Badge variant="secondary" className="text-[11px] px-2.5 py-1">Corrección</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.correccion}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}