import { getAll } from '../services/storage.js';
import { TIPOS, TEMAS, NIVELES } from '../data/options.js';

/**
 * Busca y retorna la etiqueta (label) correspondiente a un valor en una lista de opciones.
 * @param {Array<{value: string, label: string}>} list - Lista de opciones.
 * @param {string} value - Valor buscado.
 * @returns {string} Etiqueta encontrada o el valor original.
 */
function getLabel(list, value) {
  const item = list.find((opt) => opt.value === value);
  return item ? item.label : value;
}

/**
 * Extrae el nombre de dominio de una URL.
 * @param {string} url - URL del recurso.
 * @returns {string} Nombre del host o la URL original.
 */
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Renderiza la vista de listado de recursos guardados.
 * @param {HTMLElement} app - Contenedor principal.
 */
export function renderList(app) {
  const resources = getAll();
  const sortedResources = [...resources].sort(
    (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
  );

  if (sortedResources.length === 0) {
    app.innerHTML = `
      <div class="list-view">
        <div class="list-header">
          <h1 class="list-title">Mis recursos</h1>
          <a href="#/nuevo" class="btn btn-primary">+ Nuevo recurso</a>
        </div>
        <div class="card empty-state">
          <p class="empty-state-message">Aún no tienes recursos</p>
          <a href="#/nuevo" class="btn btn-primary">Agregar el primero</a>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="list-view">
      <div class="list-header">
        <h1 class="list-title">Mis recursos</h1>
        <a href="#/nuevo" class="btn btn-primary">+ Nuevo recurso</a>
      </div>
      <div class="resource-grid">
        ${sortedResources
          .map((resource) => {
            const tipoLabel = getLabel(TIPOS, resource.tipo);
            const temaLabel = getLabel(TEMAS, resource.tema);
            const nivelLabel = getLabel(NIVELES, resource.nivel);
            const formattedDate = new Date(resource.fechaCreacion).toLocaleDateString('es-SV');
            const hostname = getHostname(resource.url);

            return `
              <div class="card resource-card">
                <div class="resource-card-header">
                  <span class="badge badge--${resource.tipo}">${tipoLabel}</span>
                  ${resource.favorito ? '<span class="favorite-star" title="Favorito">★</span>' : ''}
                </div>
                <div class="resource-card-body">
                  <h3 class="resource-title">
                    <a href="${resource.url}" target="_blank" rel="noopener">${resource.titulo}</a>
                  </h3>
                  <span class="resource-domain">${hostname}</span>
                </div>
                <div class="resource-card-meta">
                  <span class="meta-tag">${temaLabel}</span>
                  <span class="meta-dot">•</span>
                  <span class="meta-tag">${nivelLabel}</span>
                  <span class="meta-dot">•</span>
                  <span class="meta-date">${formattedDate}</span>
                </div>
                <div class="resource-card-actions">
                  <a href="#/editar/${resource.id}" class="btn btn-secondary">Editar</a>
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    </div>
  `;
}
