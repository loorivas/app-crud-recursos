/**
 * Muestra una notificación toast temporal en la interfaz.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} [type='success'] - Tipo de notificación.
 */
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
