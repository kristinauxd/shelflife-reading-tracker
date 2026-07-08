import './book-detail.css';
import template from './book-detail.html?raw';

import { getBookById } from '../../data/books.js';
import { fillTemplate } from '../../utils/template.js';

function renderDetail(book) {
  return `
    <div class="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
      <div>
        <span class="badge text-bg-warning status-chip mb-3">Book detail</span>
        <h1 class="page-title h2 mb-2">${book.title}</h1>
        <p class="muted-copy mb-0">${book.author} · ${book.category}</p>
      </div>
      <span class="badge text-bg-secondary">${book.status}</span>
    </div>
    <div class="row g-4">
      <div class="col-lg-8">
        <p class="lead">${book.summary}</p>
        <div class="progress mb-3" role="progressbar" aria-label="Reading progress" aria-valuenow="${book.progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${book.progress}%"></div>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary" data-link href="/books">Back to books</a>
          <a class="btn btn-outline-light" data-link href="/dashboard">Open dashboard</a>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="surface-panel p-4 h-100">
          <div class="small muted-copy text-uppercase mb-2">Tracking stats</div>
          <ul class="list-unstyled mb-0 d-grid gap-2">
            <li class="d-flex justify-content-between"><span>Progress</span><strong>${book.progress}%</strong></li>
            <li class="d-flex justify-content-between"><span>Category</span><strong>${book.category}</strong></li>
            <li class="d-flex justify-content-between"><span>Status</span><strong>${book.status}</strong></li>
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
  const book = getBookById(params.id);

  return fillTemplate(template, {
    book: book ? renderDetail(book) : renderNotFound(params.id),
  });
}

export function init() {}