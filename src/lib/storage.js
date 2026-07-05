/**
 * Módulo de persistencia local (localStorage) para Punto Cruz Studio.
 * Sincroniza con el backend (base44) y mantiene una caché local para
 * recuperar progreso y patrones sin conexión o entre sesiones.
 */

const PREFIX = 'pcs_';
const PATRONES_KEY = `${PREFIX}patrones`;
const PROGRESO_PREFIX = `${PREFIX}progreso_`;
const GRID_PREFIX = `${PREFIX}grid_`;
const PALETTE_PREFIX = `${PREFIX}palette_`;
const FOTO_NOTAS_PREFIX = `${PREFIX}foto_notas_`;
const PARAMS_KEY = `${PREFIX}ultimo_uso`;

// ─── Helpers ────────────────────────────────────────────────────────────────

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('[PCS Storage] No se pudo guardar en localStorage:', e.message);
    return false;
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

// ─── Catálogo de patrones ────────────────────────────────────────────────────

/**
 * Guarda o actualiza los metadatos de un patrón en el índice local.
 * No guarda grid ni palette aquí (se guardan separado por tamaño).
 */
export function guardarPatron(patron) {
  if (!patron?.id) return false;
  const lista = cargarIndicePatrones();
  const meta = {
    id: patron.id,
    nombre: patron.nombre,
    estado: patron.estado,
    ancho_puntos: patron.ancho_puntos,
    alto_puntos: patron.alto_puntos,
    tipo_aida: patron.tipo_aida,
    max_colores: patron.max_colores,
    nivel_detalle: patron.nivel_detalle,
    marca_hilos: patron.marca_hilos,
    total_puntadas: patron.total_puntadas,
    puntadas_completadas: patron.puntadas_completadas,
    porcentaje_avance: patron.porcentaje_avance,
    tamano_estimado_cm: patron.tamano_estimado_cm,
    dificultad: patron.dificultad,
    tiempo_estimado: patron.tiempo_estimado,
    imagen_original: patron.imagen_original,
    updated_at: Date.now(),
  };
  const idx = lista.findIndex(p => p.id === patron.id);
  if (idx >= 0) {
    lista[idx] = meta;
  } else {
    lista.unshift(meta);
  }
  safeSet(PATRONES_KEY, lista);

  // Guardar grid y palette por separado (pueden ser grandes)
  if (patron.grid_data !== undefined) {
    const grid = typeof patron.grid_data === 'string'
      ? patron.grid_data
      : JSON.stringify(patron.grid_data);
    safeSet(`${GRID_PREFIX}${patron.id}`, grid);
  }
  if (patron.colores_data !== undefined) {
    const palette = typeof patron.colores_data === 'string'
      ? patron.colores_data
      : JSON.stringify(patron.colores_data);
    safeSet(`${PALETTE_PREFIX}${patron.id}`, palette);
  }
  return true;
}

export function cargarIndicePatrones() {
  return safeGet(PATRONES_KEY) || [];
}

export function cargarPatrones() {
  return cargarIndicePatrones();
}

/**
 * Carga los datos completos de un patrón (meta + grid + palette) desde caché.
 */
export function cargarPatronLocal(id) {
  const lista = cargarIndicePatrones();
  const meta = lista.find(p => p.id === id);
  if (!meta) return null;
  const gridRaw = safeGet(`${GRID_PREFIX}${id}`);
  const paletteRaw = safeGet(`${PALETTE_PREFIX}${id}`);
  return {
    ...meta,
    grid_data: gridRaw || '[]',
    colores_data: paletteRaw || '[]',
  };
}

export function actualizarPatron(id, campos) {
  if (!id) return false;
  const lista = cargarIndicePatrones();
  const idx = lista.findIndex(p => p.id === id);
  if (idx >= 0) {
    lista[idx] = { ...lista[idx], ...campos, updated_at: Date.now() };
    safeSet(PATRONES_KEY, lista);
  }
  if (campos.grid_data !== undefined) {
    safeSet(`${GRID_PREFIX}${id}`, typeof campos.grid_data === 'string' ? campos.grid_data : JSON.stringify(campos.grid_data));
  }
  if (campos.colores_data !== undefined) {
    safeSet(`${PALETTE_PREFIX}${id}`, typeof campos.colores_data === 'string' ? campos.colores_data : JSON.stringify(campos.colores_data));
  }
  return true;
}

export function eliminarPatron(id) {
  if (!id) return;
  const lista = cargarIndicePatrones().filter(p => p.id !== id);
  safeSet(PATRONES_KEY, lista);
  safeRemove(`${GRID_PREFIX}${id}`);
  safeRemove(`${PALETTE_PREFIX}${id}`);
  safeRemove(`${PROGRESO_PREFIX}${id}`);
  safeRemove(`${FOTO_NOTAS_PREFIX}${id}`);
}

// ─── Progreso de bordado ─────────────────────────────────────────────────────

/**
 * Guarda el mapa de puntadas completadas { "x,y": true } para un patrón.
 */
export function guardarProgreso(id, completedMap) {
  if (!id) return false;
  return safeSet(`${PROGRESO_PREFIX}${id}`, completedMap);
}

/**
 * Carga el mapa de puntadas completadas desde localStorage.
 */
export function cargarProgreso(id) {
  if (!id) return {};
  return safeGet(`${PROGRESO_PREFIX}${id}`) || {};
}

/**
 * Sincroniza los datos del backend al caché local.
 * Llama esto después de hacer .get() o .list() en base44.
 */
export function sincronizarDesdeBackend(patron) {
  if (!patron?.id) return;
  guardarPatron(patron);
  // Si viene progreso_data del backend, sincronizarlo
  if (patron.progreso_data) {
    try {
      const prog = JSON.parse(patron.progreso_data);
      if (typeof prog === 'object' && !Array.isArray(prog)) {
        guardarProgreso(patron.id, prog);
      }
    } catch {}
  }
}

// ─── Notas de fotos de progreso ──────────────────────────────────────────────

/**
 * Guarda las notas asociadas a las fotos de progreso de un patrón.
 * @param {string} id - ID del patrón
 * @param {Record<number, string>} notas - objeto { índice: texto }
 */
export function guardarNotasFoto(id, notas) {
  if (!id) return false;
  return safeSet(`${FOTO_NOTAS_PREFIX}${id}`, notas);
}

/**
 * Carga las notas de fotos de progreso desde localStorage.
 */
export function cargarNotasFoto(id) {
  if (!id) return {};
  return safeGet(`${FOTO_NOTAS_PREFIX}${id}`) || {};
}

// ─── Parámetros del último uso ────────────────────────────────────────────────

/**
 * Persiste los parámetros de conversión usados más recientemente
 * para rellenarlos como defaults en el flujo Nuevo Patrón.
 * @param {object} params - { anchoP, altoP, maxColores, detalle, aidaCt, marca }
 */
export function guardarParametrosUso(params) {
  return safeSet(PARAMS_KEY, { ...params, ts: Date.now() });
}

/**
 * Recupera los últimos parámetros usados, o null si no hay.
 */
export function cargarParametrosUso() {
  return safeGet(PARAMS_KEY);
}