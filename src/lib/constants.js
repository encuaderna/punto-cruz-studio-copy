// Thread brand color databases with approximate equivalences
export const DMC_COLORS = [
  { code: "blanc", name: "Blanco", hex: "#FFFFFF" },
  { code: "310", name: "Negro", hex: "#000000" },
  { code: "321", name: "Rojo Navidad", hex: "#C52F3C" },
  { code: "349", name: "Rojo Oscuro", hex: "#C23028" },
  { code: "350", name: "Rojo Coral", hex: "#E04848" },
  { code: "498", name: "Rojo Oscuro", hex: "#8B1A1A" },
  { code: "666", name: "Rojo Brillante", hex: "#E31D1D" },
  { code: "725", name: "Amarillo Topacio", hex: "#E5C100" },
  { code: "726", name: "Amarillo Claro", hex: "#F5DC00" },
  { code: "727", name: "Amarillo Pálido", hex: "#FFF4A6" },
  { code: "740", name: "Naranja Tangerina", hex: "#FF8C00" },
  { code: "741", name: "Naranja Medio", hex: "#FFA500" },
  { code: "742", name: "Naranja Claro", hex: "#FFBF47" },
  { code: "699", name: "Verde Navidad", hex: "#006B3C" },
  { code: "700", name: "Verde Brillante", hex: "#008B45" },
  { code: "701", name: "Verde Claro", hex: "#3CB371" },
  { code: "702", name: "Verde Kelly", hex: "#5CC774" },
  { code: "703", name: "Verde Chartreuse", hex: "#7CFC00" },
  { code: "796", name: "Azul Real Oscuro", hex: "#1C3D6E" },
  { code: "797", name: "Azul Real", hex: "#1F4FA0" },
  { code: "798", name: "Azul Delft Oscuro", hex: "#4672B8" },
  { code: "799", name: "Azul Delft Medio", hex: "#6E99CC" },
  { code: "800", name: "Azul Delft Claro", hex: "#9FC0E0" },
  { code: "550", name: "Violeta Muy Oscuro", hex: "#4B0082" },
  { code: "552", name: "Violeta Medio", hex: "#7B3F9E" },
  { code: "553", name: "Violeta", hex: "#9F5BBD" },
  { code: "554", name: "Violeta Claro", hex: "#C8A0D6" },
  { code: "3371", name: "Café Muy Oscuro", hex: "#1B0F00" },
  { code: "300", name: "Café Caoba Oscuro", hex: "#6B2E14" },
  { code: "301", name: "Café Caoba Medio", hex: "#944A28" },
  { code: "433", name: "Café Medio", hex: "#7A5229" },
  { code: "434", name: "Café Claro", hex: "#996633" },
  { code: "435", name: "Café Muy Claro", hex: "#B5843A" },
  { code: "436", name: "Bronceado", hex: "#C4995A" },
  { code: "437", name: "Bronceado Claro", hex: "#D4B580" },
  { code: "738", name: "Bronceado Muy Claro", hex: "#E8D5B0" },
  { code: "951", name: "Durazno Claro", hex: "#FFE4C0" },
  { code: "948", name: "Durazno Muy Claro", hex: "#FEF0E3" },
  { code: "754", name: "Piel Clara", hex: "#F0C8A8" },
  { code: "758", name: "Terra Cota Claro", hex: "#DB9876" },
  { code: "3607", name: "Fucsia Ciruela", hex: "#C8357E" },
  { code: "3608", name: "Fucsia Medio", hex: "#E87FAA" },
  { code: "3609", name: "Fucsia Claro", hex: "#F0A0C0" },
  { code: "309", name: "Rosa Oscuro", hex: "#A43762" },
  { code: "602", name: "Arándano Medio", hex: "#D63D7B" },
  { code: "603", name: "Arándano", hex: "#E96CA0" },
  { code: "604", name: "Arándano Claro", hex: "#F5A0C0" },
  { code: "414", name: "Gris Acero Oscuro", hex: "#646464" },
  { code: "415", name: "Gris Perla", hex: "#9C9C9C" },
  { code: "318", name: "Gris Acero Claro", hex: "#8C8C8C" },
  { code: "762", name: "Gris Perla Muy Claro", hex: "#D8D8D8" },
  { code: "817", name: "Rojo Coral Oscuro", hex: "#B00020" },
  { code: "3820", name: "Dorado Oscuro", hex: "#D4A017" },
  { code: "3821", name: "Dorado", hex: "#E8B830" },
  { code: "3822", name: "Dorado Claro", hex: "#F0D060" },
  { code: "930", name: "Azul Antiguo Oscuro", hex: "#2F5575" },
  { code: "931", name: "Azul Antiguo Medio", hex: "#4B7A9E" },
  { code: "932", name: "Azul Antiguo Claro", hex: "#7CA8C4" }
];

export const ANCHOR_EQUIVALENCES = {
  "blanc": { code: "01", name: "Blanco" },
  "310": { code: "403", name: "Negro" },
  "321": { code: "47", name: "Rojo Navidad" },
  "666": { code: "46", name: "Rojo Brillante" },
  "725": { code: "305", name: "Amarillo Topacio" },
  "700": { code: "228", name: "Verde Brillante" },
  "797": { code: "132", name: "Azul Real" },
  "550": { code: "101", name: "Violeta Oscuro" },
  "414": { code: "235", name: "Gris Acero" }
};

export const PRESENCIA_EQUIVALENCES = {
  "blanc": { code: "0001", name: "Blanco", exact: true },
  "310": { code: "0200", name: "Negro", exact: true },
  "321": { code: "1902", name: "Rojo", exact: false },
  "666": { code: "1900", name: "Rojo Brillante", exact: false },
  "700": { code: "4368", name: "Verde", exact: false },
  "797": { code: "3544", name: "Azul", exact: false }
};

export const AIDA_INFO = {
  11: { name: "Aida 11 ct", desc: "Ideal para principiantes", pxPerCm: 4.33, hebras: 3 },
  14: { name: "Aida 14 ct", desc: "La más popular", pxPerCm: 5.51, hebras: 2 },
  16: { name: "Aida 16 ct", desc: "Detalle medio-alto", pxPerCm: 6.30, hebras: 2 },
  18: { name: "Aida 18 ct", desc: "Máximo detalle", pxPerCm: 7.09, hebras: 1 }
};

export const TAMANOS_SUGERIDOS = [
  { nombre: "Pequeño", ancho: 30, alto: 30, dificultad: "facil", tiempo: "2-5 horas" },
  { nombre: "Mediano", ancho: 60, alto: 80, dificultad: "intermedio", tiempo: "15-30 horas" },
  { nombre: "Grande", ancho: 120, alto: 160, dificultad: "dificil", tiempo: "60-120 horas" }
];

export const SYMBOLS = ["■","●","▲","◆","★","♥","♦","♣","♠","◉","▶","◀","▼","✦","✧","⬟","⬡","⬢","◯","⊕","⊗","⊙","☆","△","□","○","◇","▷","◁","▽","✚","✖","⬤","⊞","⊠","⊡","⬥","⬦","◈","◐","◑","◒","◓","◔","◕","◖","◗"];

export const DIFFICULTY_LABELS = {
  facil: "Fácil",
  intermedio: "Intermedio",
  dificil: "Difícil",
  experto: "Experto"
};

export const STATUS_LABELS = {
  borrador: "Borrador",
  en_progreso: "En progreso",
  completado: "Completado",
  archivado: "Archivado"
};

export function calcPhysicalSize(widthStitches, heightStitches, aidaCt) {
  const info = AIDA_INFO[aidaCt];
  if (!info) return { width: 0, height: 0 };
  return {
    width: (widthStitches / info.pxPerCm).toFixed(1),
    height: (heightStitches / info.pxPerCm).toFixed(1)
  };
}

export function calcEstimatedTime(totalStitches) {
  const minutesPerStitch = 0.08;
  const totalMinutes = totalStitches * minutesPerStitch;
  const hours = Math.floor(totalMinutes / 60);
  if (hours < 1) return "Menos de 1 hora";
  if (hours < 10) return `${hours}-${hours + 2} horas`;
  return `${hours}-${Math.round(hours * 1.3)} horas`;
}

export function calcDifficulty(totalStitches, numColors) {
  if (totalStitches < 1500 && numColors <= 8) return "facil";
  if (totalStitches < 5000 && numColors <= 15) return "intermedio";
  if (totalStitches < 15000 && numColors <= 30) return "dificil";
  return "experto";
}

export function suggestThreadCount(aidaCt) {
  return AIDA_INFO[aidaCt]?.hebras || 2;
}

export function findClosestDMC(r, g, b) {
  let closest = DMC_COLORS[0];
  let minDist = Infinity;
  for (const c of DMC_COLORS) {
    const cr = parseInt(c.hex.slice(1, 3), 16);
    const cg = parseInt(c.hex.slice(3, 5), 16);
    const cb = parseInt(c.hex.slice(5, 7), 16);
    const dist = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = c;
    }
  }
  return closest;
}

export function getEquivalence(dmcCode, brand) {
  if (brand === "DMC") return null;
  const map = brand === "Anchor" ? ANCHOR_EQUIVALENCES : PRESENCIA_EQUIVALENCES;
  const eq = map[dmcCode];
  if (!eq) return { code: "—", name: "Sin equivalencia exacta", exact: false };
  return eq;
}