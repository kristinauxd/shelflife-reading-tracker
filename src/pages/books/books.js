import './books.css';
import template from './books.html?raw';

import { books } from '../../data/books.js';
import { fillTemplate } from '../../utils/template.js';

function renderBookCard(book) {
  return `
    <div class="col-md-6 col-xl-3">
      <article class="surface-panel p-4 book-card d-flex flex-column">
        <div class="small muted-copy text-uppercase mb-2">${book.category}</div>
        <h2 class="h5 mb-1">${book.title}</h2>
        <div class="small muted-copy mb-3">${book.author}</div>
        <p class="small flex-grow-1">${book.summary}</p>
        <div class="d-flex justify-content-between align-items-center mb-3 small">
          <span class="badge text-bg-secondary">${book.status}</span>
          <strong>${book.progress}%</strong>
        </div>
        <div class="progress mb-3" role="progressbar" aria-label="${book.title} progress" aria-valuenow="${book.progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${book.progress}%"></div>
        </div>
        <a class="btn btn-outline-light btn-sm" data-link href="/books/${book.id}">View details</a>
      </article>
    </div>
  `;
}

export function render() {
  return fillTemplate(template, {
    cards: books.map(renderBookCard).join(''),
  });
}

export function init() {}