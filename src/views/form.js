import { TIPOS, TEMAS, NIVELES } from '../data/options.js';
import { create, update } from '../services/storage.js';
import { showToast } from '../components/toast.js';

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Renderiza el formulario para registrar o editar un recurso.
 * @param {HTMLElement} app - Contenedor principal.
 * @param {Object|null} [recurso=null] - Recurso opcional para edición.
 */
export function renderForm(app, recurso = null) {
  const isEditing = Boolean(recurso);
  const title = isEditing ? 'Editar recurso' : 'Nuevo recurso';
  const submitButtonText = isEditing ? 'Actualizar' : 'Guardar';
  const currentNivel = recurso ? recurso.nivel : 'basico';

  app.innerHTML = `
    <div class="form-view">
      <h1 class="form-title">${title}</h1>
      <div class="card">
        <form id="resource-form" novalidate>
          <div class="form-group">
            <label for="titulo" class="form-label">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              class="input"
              placeholder="Ej. Guía completa de Flexbox"
              value="${recurso ? escapeAttr(recurso.titulo) : ''}"
            />
            <span class="form-error" id="error-titulo"></span>
          </div>

          <div class="form-group">
            <label for="url" class="form-label">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              class="input"
              placeholder="https://ejemplo.com"
              value="${recurso ? escapeAttr(recurso.url) : ''}"
            />
            <span class="form-error" id="error-url"></span>
          </div>

          <div class="form-group">
            <label for="tipo" class="form-label">Tipo</label>
            <select id="tipo" name="tipo" class="select">
              <option value="">Selecciona...</option>
              ${TIPOS.map(
                (tipo) => `<option value="${tipo.value}" ${recurso?.tipo === tipo.value ? 'selected' : ''}>${tipo.label}</option>`
              ).join('')}
            </select>
            <span class="form-error" id="error-tipo"></span>
          </div>

          <div class="form-group">
            <label for="tema" class="form-label">Tema</label>
            <select id="tema" name="tema" class="select">
              <option value="">Selecciona...</option>
              ${TEMAS.map(
                (tema) => `<option value="${tema.value}" ${recurso?.tema === tema.value ? 'selected' : ''}>${tema.label}</option>`
              ).join('')}
            </select>
            <span class="form-error" id="error-tema"></span>
          </div>

          <div class="form-group">
            <span class="form-label">Nivel</span>
            <div class="radio-group">
              ${NIVELES.map(
                (nivel) => `
                <label class="radio-label">
                  <input
                    type="radio"
                    name="nivel"
                    value="${nivel.value}"
                    ${nivel.value === currentNivel ? 'checked' : ''}
                  />
                  ${nivel.label}
                </label>
              `
              ).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                name="favorito"
                id="favorito"
                ${recurso?.favorito ? 'checked' : ''}
              />
              Marcar como favorito
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${submitButtonText}</button>
            <a href="#/recursos" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = app.querySelector('#resource-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearErrors(form);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data.favorito = Boolean(formData.get('favorito'));
    data.titulo = data.titulo ? data.titulo.trim() : '';
    data.url = data.url ? data.url.trim() : '';

    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      showErrors(form, errors);
      return;
    }

    if (isEditing) {
      update(recurso.id, data);
      showToast('Recurso actualizado');
    } else {
      create(data);
      showToast('Recurso guardado');
      form.reset();
    }

    window.location.hash = '#/recursos';
  });
}

/**
 * Valida los campos requeridos del formulario.
 */
function validateForm(data) {
  const errors = {};

  if (!data.titulo || data.titulo.length < 3) {
    errors.titulo = 'El título es obligatorio (mínimo 3 caracteres)';
  }

  if (!data.url) {
    errors.url = 'La URL es obligatoria';
  } else {
    try {
      new URL(data.url);
    } catch {
      errors.url = 'Ingresa una URL válida (ej. https://ejemplo.com)';
    }
  }

  if (!data.tipo) {
    errors.tipo = 'Selecciona un tipo de recurso';
  }

  if (!data.tema) {
    errors.tema = 'Selecciona un tema';
  }

  return errors;
}

/**
 * Limpia los estilos y textos de error en el formulario.
 */
function clearErrors(form) {
  const inputs = form.querySelectorAll('.input, .select');
  inputs.forEach((input) => {
    input.classList.remove('error', 'has-error');
  });

  const errorSpans = form.querySelectorAll('.form-error');
  errorSpans.forEach((span) => {
    span.textContent = '';
  });
}

/**
 * Aplica clases de error y muestra mensajes de validación.
 */
function showErrors(form, errors) {
  for (const [field, message] of Object.entries(errors)) {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add('error', 'has-error');
    }
    const errorSpan = form.querySelector(`#error-${field}`);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }
}
