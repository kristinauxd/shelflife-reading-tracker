import{g as t}from"./books-CL_zxINc.js";import{f as e}from"./index-DUjbirWh.js";const n=`<section class="book-detail-page fade-in-up">
  <div class="surface-panel p-4 p-lg-5">
    {{book}}
  </div>
</section>`;function i(s){return`
    <div class="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
      <div>
        <span class="badge text-bg-warning status-chip mb-3">Book detail</span>
        <h1 class="page-title h2 mb-2">${s.title}</h1>
        <p class="muted-copy mb-0">${s.author} · ${s.category}</p>
      </div>
      <span class="badge text-bg-secondary">${s.status}</span>
    </div>
    <div class="row g-4">
      <div class="col-lg-8">
        <p class="lead">${s.summary}</p>
        <div class="progress mb-3" role="progressbar" aria-label="Reading progress" aria-valuenow="${s.progress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: ${s.progress}%"></div>
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
            <li class="d-flex justify-content-between"><span>Progress</span><strong>${s.progress}%</strong></li>
            <li class="d-flex justify-content-between"><span>Category</span><strong>${s.category}</strong></li>
            <li class="d-flex justify-content-between"><span>Status</span><strong>${s.status}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  `}function l(s){return`
    <div class="text-center py-4">
      <h1 class="page-title h2 mb-3">Book not found</h1>
      <p class="muted-copy mb-4">There is no catalog entry with id ${s}.</p>
      <a class="btn btn-primary" data-link href="/books">Return to catalog</a>
    </div>
  `}function o({params:s}){const a=t(s.id);return e(n,{book:a?i(a):l(s.id)})}function c(){}export{c as init,o as render};
