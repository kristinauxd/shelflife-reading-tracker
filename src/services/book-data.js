import { supabase } from './supabaseClient.js';

export const LIBRARY_STATUS_OPTIONS = [
  { value: 'want_to_read', label: 'Want to read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'abandoned', label: 'Abandoned' },
];

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function buildGenreLookup(genres = []) {
  return new Map(genres.map((genre) => [String(genre.id), genre]));
}

function getGenreLabel(genreId, genreLookup) {
  return genreLookup.get(String(genreId))?.name ?? 'Uncategorized';
}

export function formatLibraryStatus(status) {
  const normalized = String(status ?? '').trim();

  if (!normalized) {
    return 'Not set';
  }

  return normalized
    .split('_')
    .filter(Boolean)
    .map((part) => (part === 'to' ? 'to' : `${part.charAt(0).toUpperCase()}${part.slice(1)}`))
    .join(' ');
}

export function getLibraryStatusBadgeClass(status) {
  switch (status) {
    case 'reading':
      return 'text-bg-primary';
    case 'finished':
      return 'text-bg-success';
    case 'abandoned':
      return 'text-bg-danger';
    default:
      return 'text-bg-secondary';
  }
}

export function normalizeLibraryStatus(status) {
  const nextStatus = String(status ?? '').trim();

  return LIBRARY_STATUS_OPTIONS.some((option) => option.value === nextStatus)
    ? nextStatus
    : LIBRARY_STATUS_OPTIONS[0].value;
}

function annotateBook(book, genreLookup) {
  return {
    ...book,
    genreName: getGenreLabel(book.genre_id, genreLookup),
    publishedYearLabel: book.published_year ? String(book.published_year) : 'Unknown year',
  };
}

export async function loadCatalogBooks() {
  const [{ data: books, error: booksError }, { data: genres, error: genresError }] = await Promise.all([
    supabase.from('books').select('id,title,author,description,cover_url,genre_id,published_year').order('title'),
    supabase.from('genres').select('id,name,slug').order('name'),
  ]);

  if (booksError) throw booksError;
  if (genresError) throw genresError;

  const genreLookup = buildGenreLookup(genres ?? []);

  return (books ?? []).map((book) => annotateBook(book, genreLookup));
}

export async function loadBookById(bookId) {
  const [{ data: book, error: bookError }, { data: genres, error: genresError }] = await Promise.all([
    supabase.from('books').select('id,title,author,description,cover_url,genre_id,published_year').eq('id', bookId).maybeSingle(),
    supabase.from('genres').select('id,name,slug').order('name'),
  ]);

  if (bookError) throw bookError;
  if (genresError) throw genresError;

  if (!book) {
    return null;
  }

  return annotateBook(book, buildGenreLookup(genres ?? []));
}

export async function loadUserLibrary(userId) {
  const [{ data: items, error: itemsError }, { data: genres, error: genresError }] = await Promise.all([
    supabase
      .from('user_books')
      .select('id,status,started_at,finished_at,progress_pages,book_id,book:books(id,title,author,description,cover_url,genre_id,published_year)')
      .eq('user_id', userId)
      .order('id', { ascending: false }),
    supabase.from('genres').select('id,name,slug').order('name'),
  ]);

  if (itemsError) throw itemsError;
  if (genresError) throw genresError;

  const genreLookup = buildGenreLookup(genres ?? []);

  return (items ?? []).map((item) => {
    const book = item.book ? annotateBook(item.book, genreLookup) : null;

    return {
      id: item.id,
      bookId: item.book_id,
      status: item.status,
      statusLabel: formatLibraryStatus(item.status),
      statusBadgeClass: getLibraryStatusBadgeClass(item.status),
      startedAt: item.started_at,
      finishedAt: item.finished_at,
      progressPages: item.progress_pages,
      book,
    };
  });
}

export async function loadLibraryItem(userId, bookId) {
  const { data, error } = await supabase
    .from('user_books')
    .select('id,status,started_at,finished_at,progress_pages')
    .eq('user_id', userId)
    .eq('book_id', bookId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveLibraryItem({ userId, bookId, status, existingItem = null }) {
  const nextStatus = normalizeLibraryStatus(status);
  const today = getTodayDateString();
  const isNewItem = !existingItem;

  const payload = {
    user_id: userId,
    book_id: bookId,
    status: nextStatus,
    started_at: existingItem?.started_at ?? (nextStatus === 'want_to_read' ? null : today),
    finished_at: nextStatus === 'finished' ? existingItem?.finished_at ?? today : null,
    progress_pages: existingItem?.progress_pages ?? 0,
  };

  const request = isNewItem
    ? supabase.from('user_books').insert(payload)
    : supabase.from('user_books').update(payload).eq('id', existingItem.id);

  const { error } = await request;

  if (error) {
    throw error;
  }

  return payload;
}