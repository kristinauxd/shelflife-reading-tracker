import './book-detail.css';
import template from './book-detail.html?raw';

import { showToast } from '../../components/toast-container/toast-container.js';
import { getCurrentUser } from '../../state/auth.js';
import {
  LIBRARY_STATUS_OPTIONS,
  formatLibraryStatus,
  getLibraryStatusBadgeClass,
  loadBookById,
  loadLibraryItem,
  saveLibraryItem,
} from '../../services/book-data.js';
import { fillTemplate } from '../../utils/template.js';

function renderStatusOptions(selectedStatus) {
  return LIBRARY_STATUS_OPTIONS.map((option) => {
    const selected = option.value === selectedStatus ? ' selected' : '';

    return `<option value="${option.value}"${selected}>${option.label}</option>`;
  }).join('');
}

function renderLoginPrompt() {
  return `
    <div class="alert alert-warning mb-0">
      Sign in to add this title to your library or update its reading status.
      <div class="mt-3">
        <a class="btn btn-outline-dark" data-link href="/login">Go to sign in</a>
      </div>
    </div>
  `;
}

function renderLibraryAction(libraryItem, user) {
  if (!user?.id) {
    return renderLoginPrompt();
  }

  const selectedStatus = libraryItem?.status ?? 'want_to_read';
  const buttonLabel = libraryItem ? 'Update library status' : 'Add to library';

  return `
    <form class="d-grid gap-3" data-library-form>
      <div>
        <label class="form-label" for="library-status">Status</label>
        <select class="form-select" id="library-status" name="status">
          ${renderStatusOptions(selectedStatus)}
        </select>
      </div>
      <div class="small muted-copy">
        ${libraryItem ? `Current status: ${formatLibraryStatus(libraryItem.status)}` : 'This book is not in your library yet.'}
      </div>
      <button type="submit" class="btn btn-primary">${buttonLabel}</button>
    </form>
  `;
}

function renderDetail(book, libraryItem, user) {
  return `
    <div class="row g-4 align-items-start mb-4">
      <div class="col-md-4 col-lg-3">
        <div class="book-cover-frame book-detail-cover">
          ${book.cover_url ? `<img class="book-cover-image" src="${book.cover_url}" alt="${book.title} cover" loading="lazy" />` : `<div class="book-cover-placeholder book-cover-placeholder--large">No cover</div>`}
        </div>
      </div>
      <div class="col-md-8 col-lg-9">
        <div class="d-flex flex-wrap justify-content-between gap-3 align-items-start">
          <div>
            <span class="badge text-bg-warning status-chip mb-3">Book detail</span>
            <h1 class="page-title h2 mb-2">${book.title}</h1>
            <p class="muted-copy mb-0">${book.author} · ${book.genreName} · ${book.publishedYearLabel}</p>
          </div>
          <span class="badge ${getLibraryStatusBadgeClass(libraryItem?.status)}">${libraryItem ? formatLibraryStatus(libraryItem.status) : 'Catalog book'}</span>
        </div>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-lg-8">
        <p class="lead">${book.description ?? 'No description is available for this title yet.'}</p>
        <div class="surface-panel p-4 mb-4">
          <h2 class="h5 mb-3">Library action</h2>
          ${renderLibraryAction(libraryItem, user)}
        </div>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary" data-link href="/books">Back to catalog</a>
          <a class="btn btn-outline-light" data-link href="/dashboard">Open dashboard</a>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="surface-panel p-4 h-100">
          <div class="small muted-copy text-uppercase mb-2">Catalog details</div>
          <ul class="list-unstyled mb-0 d-grid gap-2">
            <li class="d-flex justify-content-between"><span>Genre</span><strong>${book.genreName}</strong></li>
            <li class="d-flex justify-content-between"><span>Published</span><strong>${book.publishedYearLabel}</strong></li>
            <li class="d-flex justify-content-between"><span>In your library</span><strong>${libraryItem ? 'Yes' : 'No'}</strong></li>
            <li class="d-flex justify-content-between"><span>Current status</span><strong>${libraryItem ? formatLibraryStatus(libraryItem.status) : 'Not tracked yet'}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderNotFound(id) {
  return `
    <div class="text-center py-4">
      <h1 class="page-title h2 mb-3">Book not found</h1>
      <p class="muted-copy mb-4">There is no catalog entry with id ${id}.</p>
      <a class="btn btn-primary" data-link href="/books">Return to catalog</a>
    </div>
  `;
}

export function render({ params }) {
  return fillTemplate(template, {
    book: '<div class="muted-copy">Loading book details...</div>',
  });
}

export function init({ params }) {
  const root = document.getElementById('book-detail-root');

  if (!root) {
    return;
  }

  const hydrate = async () => {
    try {
      const [book, user] = await Promise.all([loadBookById(params.id), getCurrentUser()]);

      if (!book) {
        root.innerHTML = renderNotFound(params.id);
        return;
      }

      const libraryItem = user?.id ? await loadLibraryItem(user.id, book.id) : null;

      root.innerHTML = renderDetail(book, libraryItem, user);

      const form = document.querySelector('[data-library-form]');

      form?.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!user?.id) {
          showToast({ title: 'Sign in required', message: 'Please sign in to save this book to your library.', variant: 'warning' });
          return;
        }

        const formData = new FormData(form);
        const nextStatus = String(formData.get('status') ?? '').trim();

        void (async () => {
          try {
            await saveLibraryItem({
              userId: user.id,
              bookId: book.id,
              status: nextStatus,
              existingItem: libraryItem,
            });

            showToast({
              title: libraryItem ? 'Library updated' : 'Book added',
              message: `${book.title} is now marked as ${formatLibraryStatus(nextStatus)}.`,
              variant: 'success',
            });

            await hydrate();
          } catch (error) {
            showToast({ title: 'Library save failed', message: error.message, variant: 'danger' });
          }
        })();
      });
    } catch (error) {
      root.innerHTML = renderNotFound(params.id);
      showToast({ title: 'Book load failed', message: error.message, variant: 'danger' });
    }
  };

  void hydrate();
}