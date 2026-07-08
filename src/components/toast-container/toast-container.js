import './toast-container.css';
import template from './toast-container.html?raw';

import { fillTemplate } from '../../utils/template.js';

export function renderToastContainer() {
  return fillTemplate(template);
}

export function showToast({ title, message, variant = 'primary' }) {
  const toastContainer = document.getElementById('toast-container');

  if (!toastContainer || !window.bootstrap?.Toast) {
    return;
  }

  const toastId = `toast-${Date.now()}`;

  toastContainer.insertAdjacentHTML(
    'beforeend',
    `
      <div class="toast align-items-center text-bg-${variant} border-0 mb-2" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <div class="fw-semibold">${title}</div>
            <div class="small">${message}</div>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `,
  );

  const toastElement = document.getElementById(toastId);
  const toast = new window.bootstrap.Toast(toastElement, { delay: 2800 });

  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });

  toast.show();
}