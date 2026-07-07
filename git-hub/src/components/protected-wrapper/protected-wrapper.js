import './protected-wrapper.css';
import template from './protected-wrapper.html?raw';

import { fillTemplate } from '../../utils/template.js';
import { getUser, isAdmin } from '../../state/auth.js';

export function renderProtectedWrapper({ title, description, content, requiredRole = 'user' }) {
  const user = getUser();

  if (!user) {
    return `
      <section class="protected-shell fade-in-up">
        <div class="surface-panel p-4 p-lg-5 protected-empty-state">
          <span class="badge text-bg-warning status-chip mb-3">Sign in required</span>
          <h1 class="page-title h2 mb-2">${title}</h1>
          <p class="muted-copy mb-4">${description}</p>
          <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-primary" data-link href="/login">Go to login</a>
            <a class="btn btn-outline-light" data-link href="/books">Browse books</a>
          </div>
        </div>
      </section>
    `;
  }

  if (requiredRole === 'admin' && !isAdmin()) {
    return `
      <section class="protected-shell fade-in-up">
        <div class="surface-panel p-4 p-lg-5 protected-empty-state">
          <span class="badge text-bg-danger status-chip mb-3">Forbidden</span>
          <h1 class="page-title h2 mb-2">Admin access only</h1>
          <p class="muted-copy mb-4">This area is reserved for administrators.</p>
          <a class="btn btn-primary" data-link href="/dashboard">Return to dashboard</a>
        </div>
      </section>
    `;
  }

  return fillTemplate(template, {
    title,
    description,
    content,
  });
}