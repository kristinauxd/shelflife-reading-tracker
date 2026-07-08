import{b as a}from"./books-CL_zxINc.js";import{f as e}from"./index-DUjbirWh.js";const l=`<section class="books-page fade-in-up">
  <div class="surface-panel p-4 p-lg-5 mb-4">
    <div class="d-flex flex-wrap justify-content-between gap-3 align-items-end">
      <div>
        <span class="badge text-bg-warning status-chip mb-3">Catalog</span>
        <h1 class="page-title h2 mb-2">Books</h1>
        <p class="muted-copy mb-0">Browse the sample catalog and open a detail route for any title.</p>
      </div>
      <div class="small muted-copy">Route: /books/{id}</div>
    </div>
  </div>

  <div class="row g-3">
    {{cards}}
  </div>
</section>`;function t(s){return`
    <div class="col-md-6 col-xl-3">
      <article class="surface-panel p-4 book-card d-flex flex-column">
        <div class="small muted-copy text-uppercase mb-2">${s.category}</div>
        <h2 class="h5 mb-1">${s.title}</h2>
        <div class="small muted-copy mb-3">${s.author}</div>
        <p class="small flex-grow-1">${s.summary}</p>
        <div class="d-flex justify-content-between align-items-center mb-3 small">
          <span class="badge text-bg-secondary">${s.status}</span>
          <strong>${s.progress}%</strong>
        </div>
        <div class="progress mb-3" role="progressbar" aria-label="${s.title} progress" aria-valuenow="${s.progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${s.progress}%"></div>
        </div>
        <a class="btn btn-outline-light btn-sm" data-link href="/books/${s.id}">View details</a>
      </article>
    </div>
  `}function r(){return e(l,{cards:a.map(t).join("")})}function d(){}export{d as init,r as render};
