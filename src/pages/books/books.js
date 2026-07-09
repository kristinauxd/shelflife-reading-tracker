import './books.css';
import template from './books.html?raw';

import { showToast } from '../../components/toast-container/toast-container.js';
import { loadCatalogBooks } from '../../services/book-data.js';
import { fillTemplate } from '../../utils/template.js';

function renderBookCard(book) {
  return `
    <div class="col-md-6 col-xl-3">
      <article class="surface-panel p-4 book-card d-flex flex-column">
        <div class="book-cover-frame mb-3">
          ${book.cover_url ? `<img class="book-cover-image" src="${book.cover_url}" alt="${book.title} cover" loading="lazy" />` : `<div class="book-cover-placeholder">No cover</div>`}
        </div>
        <div class="small muted-copy text-uppercase mb-2">${book.genreName} · ${book.publishedYearLabel}</div>
        <h2 class="h5 mb-1">${book.title}</h2>
        <div class="small muted-copy mb-3">${book.author}</div>
        <p class="small flex-grow-1">${book.description ?? 'No description available yet.'}</p>
        <a class="btn btn-outline-light btn-sm" data-link href="/books/${book.id}">View details</a>
      </article>
    </div>
  `;
}

function renderLoadingState(message) {
  return `
    <div class="col-12">
      <div class="surface-panel p-4 muted-copy text-center">${message}</div>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="col-12">
      <div class="surface-panel p-4 text-center">
        <h2 class="h5 mb-2">No books yet</h2>
        <p class="muted-copy mb-0">Add some records in the admin area and they will appear here automatically.</p>
      </div>
    </div>
  `;
}

export function render() {
  return fillTemplate(template, {
    cards: renderLoadingState('Loading the catalog from Supabase...'),
  });
}

export function init() {
  const grid = document.querySelector('[data-books-grid]');

  if (!grid) {
    return;
  }

  void (async () => {
    try {
      const books = await loadCatalogBooks();

      grid.innerHTML = books.length ? books.map(renderBookCard).join('') : renderEmptyState();
    } catch (error) {
      grid.innerHTML = renderLoadingState('Unable to load the catalog right now.');
      showToast({ title: 'Catalog load failed', message: error.message, variant: 'danger' });
    }
  })();
}