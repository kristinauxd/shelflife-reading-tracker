import './library.css';
import template from './library.html?raw';

import { showToast } from '../../components/toast-container/toast-container.js';
import { getCurrentUser } from '../../state/auth.js';
import { fillTemplate } from '../../utils/template.js';
import { loadUserLibrary } from '../../services/book-data.js';

function renderStatCard(label, value, helper) {
  return `
    <div class="col-md-4">
      <div class="surface-panel p-4 h-100">
        <div class="small muted-copy text-uppercase mb-2">${label}</div>
        <div class="display-6 fw-semibold">${value}</div>
        <div class="small muted-copy">${helper}</div>
      </div>
    </div>
  `;
}

function renderLibraryCard(item) {
  const book = item.book;

  return `
    <div class="col-md-6 col-xl-4">
      <article class="surface-panel p-4 h-100 d-flex flex-column">
        <div class="book-cover-frame book-cover-frame--library mb-3">
          ${book?.cover_url ? `<img class="book-cover-image" src="${book.cover_url}" alt="${book.title} cover" loading="lazy" />` : `<div class="book-cover-placeholder">No cover</div>`}
        </div>
        <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
          <span class="badge ${item.statusBadgeClass}">${item.statusLabel}</span>
          <span class="small muted-copy text-end">${book?.genreName ?? 'Uncategorized'}</span>
        </div>
        <h2 class="h5 mb-1">${book?.title ?? 'Untitled book'}</h2>
        <div class="small muted-copy mb-3">${book?.author ?? 'Unknown author'} · ${book?.publishedYearLabel ?? 'Unknown year'}</div>
        <p class="small flex-grow-1">${book?.description ?? 'No description available.'}</p>
        <div class="d-flex justify-content-between align-items-center mb-3 small">
          <span>Progress pages</span>
          <strong>${item.progressPages}</strong>
        </div>
        <a class="btn btn-outline-light btn-sm" data-link href="/books/${item.bookId}">Open details</a>
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

export function render() {
  return fillTemplate(template, {
    stats: renderLoadingState('Loading your library...'),
    cards: renderLoadingState('Loading your tracked books...'),
  });
}

export function init() {
  const statsRow = document.querySelector('[data-library-stats]');
  const grid = document.querySelector('[data-library-grid]');
  const emptyState = document.querySelector('[data-library-empty-state]');

  if (!statsRow || !grid || !emptyState) {
    return;
  }

  void (async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.id) {
        statsRow.innerHTML = '';
        grid.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
      }

      const items = await loadUserLibrary(user.id);
      const readingCount = items.filter((item) => item.status === 'reading').length;
      const finishedCount = items.filter((item) => item.status === 'finished').length;

      statsRow.innerHTML = [
        renderStatCard('Tracked books', items.length, 'Books you have added to your shelf.'),
        renderStatCard('Reading now', readingCount, 'Books you are actively reading.'),
        renderStatCard('Finished', finishedCount, 'Books you have completed.'),
      ].join('');

      grid.innerHTML = items.length ? items.map(renderLibraryCard).join('') : '';
      emptyState.classList.toggle('d-none', items.length > 0);

      if (items.length === 0) {
        statsRow.innerHTML = [
          renderStatCard('Tracked books', 0, 'No titles have been added yet.'),
          renderStatCard('Reading now', 0, 'Nothing is marked as reading.'),
          renderStatCard('Finished', 0, 'No completed books to show yet.'),
        ].join('');
      }
    } catch (error) {
      statsRow.innerHTML = '';
      grid.innerHTML = renderLoadingState('Unable to load your library right now.');
      emptyState.classList.add('d-none');
      showToast({ title: 'Library load failed', message: error.message, variant: 'danger' });
    }
  })();
}