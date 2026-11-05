import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'devshelf:recursos';

/**
 * Obtiene todos los recursos almacenados en localStorage.
 */
export function getAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda un nuevo recurso con ID único y fecha de creación.
 */
export function create(data) {
  const resources = getAll();
  const newResource = {
    ...data,
    id: uuidv4(),
    fechaCreacion: new Date().toISOString(),
  };
  resources.push(newResource);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  return newResource;
}

/**
 * Calcula estadísticas de total, favoritos y temas únicos registrados.
 */
export function getStats() {
  const resources = getAll();
  const total = resources.length;
  const favoritos = resources.filter((resource) => resource.favorito).length;
  const temas = new Set(resources.map((resource) => resource.tema).filter(Boolean)).size;

  return { total, favoritos, temas };
}
