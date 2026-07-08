import './admin.css';
import template from './admin.html?raw';

import { showToast } from '../../components/toast-container/toast-container.js';
import { supabase } from '../../services/supabaseClient.js';
import { getUser, isAdmin } from '../../state/auth.js';
import { fillTemplate } from '../../utils/template.js';

const state = {
  books: [],
  genres: [],
  reviews: [],
};

let adminClickHandlerBound = false;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getGenreLabel(genreId) {
  return state.genres.find((genre) => String(genre.id) === String(genreId))?.name ?? 'Unassigned';
}

function getGenreOptions(selectedId = '') {
  return [`<option value="">Select genre</option>`]
    .concat(
      state.genres.map(
        (genre) => `<option value="${genre.id}" ${String(selectedId) === String(genre.id) ? 'selected' : ''}>${escapeHtml(genre.name)}</option>`
      )
    )
    .join('');
}

function renderBooksTable() {
  const tbody = document.querySelector('[data-books-table]');

  if (!tbody) return;

  if (!state.books.length) {
    tbody.innerHTML = `<tr><td class="admin-empty" colspan="4">No books yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.books
    .map((book) => {
      const cover = book.cover_url
        ? `<img class="admin-cover" src="${escapeHtml(book.cover_url)}" alt="${escapeHtml(book.title)} cover" />`
        : `<div class="admin-cover d-grid place-items-center small muted-copy">${escapeHtml(book.title.slice(0, 2).toUpperCase())}</div>`;

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-3">
              ${cover}
              <div>
                <div class="fw-semibold">${escapeHtml(book.title)}</div>
                <div class="small muted-copy">${escapeHtml(book.author)}</div>
              </div>
            </div>
          </td>
          <td>${escapeHtml(getGenreLabel(book.genre_id))}</td>
          <td>${book.published_year ?? '—'}</td>
          <td class="text-end">
            <div class="d-inline-flex flex-wrap gap-2 justify-content-end">
              <button class="btn btn-outline-light btn-sm admin-action-btn" type="button" data-action="edit-book" data-id="${book.id}">Edit</button>
              <button class="btn btn-outline-light btn-sm admin-action-btn" type="button" data-action="delete-book" data-id="${book.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderGenresTable() {
  const tbody = document.querySelector('[data-genres-table]');

  if (!tbody) return;

  if (!state.genres.length) {
    tbody.innerHTML = `<tr><td class="admin-empty" colspan="3">No genres yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.genres
    .map(
      (genre) => `
        <tr>
          <td class="fw-semibold">${escapeHtml(genre.name)}</td>
          <td><span class="admin-mini-chip">${escapeHtml(genre.slug)}</span></td>
          <td class="text-end">
            <div class="d-inline-flex flex-wrap gap-2 justify-content-end">
              <button class="btn btn-outline-light btn-sm admin-action-btn" type="button" data-action="edit-genre" data-id="${genre.id}">Edit</button>
              <button class="btn btn-outline-light btn-sm admin-action-btn" type="button" data-action="delete-genre" data-id="${genre.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function renderReviewsTable() {
  const tbody = document.querySelector('[data-reviews-table]');

  if (!tbody) return;

  if (!state.reviews.length) {
    tbody.innerHTML = `<tr><td class="admin-empty" colspan="4">No reviews to moderate.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.reviews
    .map((review) => {
      const bookTitle = review.book_title ?? 'Unknown book';
      const reviewText = review.review_text || 'No written review.';

      return `
        <tr>
          <td>
            <div class="fw-semibold">${escapeHtml(bookTitle)}</div>
            <div class="small muted-copy">${review.is_spoiler ? 'Spoiler flag on' : 'No spoiler flag'}</div>
          </td>
          <td>${review.rating ?? '—'} / 5</td>
          <td class="admin-review-text">
            <div class="small muted-copy">${escapeHtml(reviewText)}</div>
          </td>
          <td class="text-end">
            <button class="btn btn-outline-light btn-sm admin-action-btn" type="button" data-action="delete-review" data-id="${review.id}">Delete</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function fillBookForm(book = null) {
  const bookId = document.getElementById('book-id');
  const title = document.getElementById('book-title');
  const author = document.getElementById('book-author');
  const year = document.getElementById('book-published-year');
  const genreId = document.getElementById('book-genre-id');
  const coverUrl = document.getElementById('book-cover-url');
  const description = document.getElementById('book-description');

  if (bookId) bookId.value = book?.id ?? '';
  if (title) title.value = book?.title ?? '';
  if (author) author.value = book?.author ?? '';
  if (year) year.value = book?.published_year ?? '';
  if (genreId) genreId.value = book?.genre_id ?? '';
  if (coverUrl) coverUrl.value = book?.cover_url ?? '';
  if (description) description.value = book?.description ?? '';
}

function fillGenreForm(genre = null) {
  const genreId = document.getElementById('genre-id');
  const name = document.getElementById('genre-name');
  const slug = document.getElementById('genre-slug');

  if (genreId) genreId.value = genre?.id ?? '';
  if (name) name.value = genre?.name ?? '';
  if (slug) slug.value = genre?.slug ?? '';
}

async function loadData() {
  const [{ data: books, error: booksError }, { data: genres, error: genresError }, { data: reviews, error: reviewsError }] = await Promise.all([
    supabase.from('books').select('id,title,author,description,cover_url,genre_id,published_year').order('title'),
    supabase.from('genres').select('id,name,slug').order('name'),
    supabase.from('reviews').select('id,rating,review_text,is_spoiler,book_id,created_at').order('created_at', { ascending: false }),
  ]);

  if (booksError) throw booksError;
  if (genresError) throw genresError;
  if (reviewsError) throw reviewsError;

  state.books = books ?? [];
  state.genres = genres ?? [];
  const bookTitleById = new Map((books ?? []).map((book) => [String(book.id), book.title]));

  state.reviews = (reviews ?? []).map((review) => ({
    ...review,
    book_title: bookTitleById.get(String(review.book_id)) ?? 'Unknown book',
  }));
}

async function refreshView() {
  await loadData();

  const bookGenreSelect = document.getElementById('book-genre-id');
  const statBooks = document.querySelector('[data-stat-books]');
  const statGenres = document.querySelector('[data-stat-genres]');
  const statReviews = document.querySelector('[data-stat-reviews]');

  if (bookGenreSelect) {
    const currentValue = bookGenreSelect.value;
    bookGenreSelect.innerHTML = getGenreOptions(currentValue);
  }

  if (statBooks) statBooks.textContent = String(state.books.length);
  if (statGenres) statGenres.textContent = String(state.genres.length);
  if (statReviews) statReviews.textContent = String(state.reviews.length);

  renderBooksTable();
  renderGenresTable();
  renderReviewsTable();
}

export function render() {
  const user = getUser() ?? { email: 'admin@example.com' };

  return fillTemplate(template, {
    email: user.email ?? 'admin@example.com',
  });
}

export function init() {
  const user = getUser();

  if (!user?.role || !isAdmin()) {
    return;
  }

  const bookForm = document.getElementById('book-form');
  const genreForm = document.getElementById('genre-form');
  const bookGenreSelect = document.getElementById('book-genre-id');

  document.querySelectorAll('[data-action="reset-book-form"]').forEach((button) => {
    button.addEventListener('click', () => fillBookForm());
  });

  document.querySelectorAll('[data-action="reset-genre-form"]').forEach((button) => {
    button.addEventListener('click', () => fillGenreForm());
  });

  bookForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(bookForm);
    const id = String(formData.get('id') ?? '').trim();
    const title = String(formData.get('title') ?? '').trim();
    const author = String(formData.get('author') ?? '').trim();
    const publishedYearValue = String(formData.get('published_year') ?? '').trim();
    const genreId = String(formData.get('genre_id') ?? '').trim();
    const coverUrl = String(formData.get('cover_url') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title || !author) {
      showToast({ title: 'Missing book data', message: 'Title and author are required.', variant: 'warning' });
      return;
    }

    const payload = {
      title,
      author,
      genre_id: genreId ? Number(genreId) : null,
      cover_url: coverUrl || null,
      description: description || null,
      published_year: publishedYearValue ? Number(publishedYearValue) : null,
    };

    const request = id ? supabase.from('books').update(payload).eq('id', id) : supabase.from('books').insert(payload);
    const { error } = await request;

    if (error) {
      showToast({ title: 'Book save failed', message: error.message, variant: 'danger' });
      return;
    }

    showToast({ title: 'Book saved', message: id ? 'The book record was updated.' : 'A new book was added.', variant: 'success' });
    fillBookForm();
    await refreshView();
  });

  genreForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(genreForm);
    const id = String(formData.get('id') ?? '').trim();
    const name = String(formData.get('name') ?? '').trim();
    const slugValue = String(formData.get('slug') ?? '').trim();

    if (!name) {
      showToast({ title: 'Missing genre name', message: 'Please enter a genre name.', variant: 'warning' });
      return;
    }

    const payload = {
      name,
      slug: slugValue || slugify(name),
    };

    const request = id ? supabase.from('genres').update(payload).eq('id', id) : supabase.from('genres').insert(payload);
    const { error } = await request;

    if (error) {
      showToast({ title: 'Genre save failed', message: error.message, variant: 'danger' });
      return;
    }

    showToast({ title: 'Genre saved', message: id ? 'The genre was updated.' : 'A new genre was added.', variant: 'success' });
    fillGenreForm();
    await refreshView();
  });

  if (!adminClickHandlerBound) {
    document.addEventListener('click', async (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-action]') : null;

    if (!target) return;

    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');

    if (!action || !id) return;

    if (action === 'edit-book') {
      const book = state.books.find((entry) => String(entry.id) === String(id));

      if (book) {
        fillBookForm(book);
        bookGenreSelect?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (action === 'delete-book') {
      if (!window.confirm('Delete this book? This will also remove related records via cascade.')) return;

      const { error } = await supabase.from('books').delete().eq('id', id);

      if (error) {
        showToast({ title: 'Delete failed', message: error.message, variant: 'danger' });
        return;
      }

      showToast({ title: 'Book deleted', message: 'The record was removed from the catalog.', variant: 'secondary' });
      await refreshView();
      return;
    }

    if (action === 'edit-genre') {
      const genre = state.genres.find((entry) => String(entry.id) === String(id));

      if (genre) {
        fillGenreForm(genre);
      }
      return;
    }

    if (action === 'delete-genre') {
      if (!window.confirm('Delete this genre? Books using it will keep a null genre.')) return;

      const { error } = await supabase.from('genres').delete().eq('id', id);

      if (error) {
        showToast({ title: 'Delete failed', message: error.message, variant: 'danger' });
        return;
      }

      showToast({ title: 'Genre deleted', message: 'The genre was removed from the catalog.', variant: 'secondary' });
      await refreshView();
      return;
    }

      if (action === 'delete-review') {
        if (!window.confirm('Delete this review from the public catalog?')) return;

        const { error } = await supabase.from('reviews').delete().eq('id', id);

        if (error) {
          showToast({ title: 'Delete failed', message: error.message, variant: 'danger' });
          return;
        }

        showToast({ title: 'Review deleted', message: 'The review was removed.', variant: 'secondary' });
        await refreshView();
      }
    });

    adminClickHandlerBound = true;
  }

  void refreshView().catch((error) => {
    showToast({ title: 'Admin load failed', message: error.message, variant: 'danger' });
  });
}