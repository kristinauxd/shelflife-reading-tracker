const s=`<section class="home-hero fade-in-up">
  <div class="surface-panel p-4 p-lg-5 mb-4">
    <div class="row align-items-center g-4">
      <div class="col-lg-7">
        <span class="badge text-bg-warning hero-chip mb-3">Reading tracker scaffold</span>
        <h1 class="page-title display-5 mb-3">Track every shelf, book, and reading session.</h1>
        <p class="lead muted-copy mb-4">
          This Vite starter keeps the app split into route modules, layout components, and page-specific styles so the codebase stays easy to extend.
        </p>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary" data-link href="/books">Browse books</a>
          <a class="btn btn-outline-light" data-link href="/login">Sign in</a>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="surface-panel p-4 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div class="small text-uppercase muted-copy">Current stack</div>
              <div class="h4 mb-0">Vite + Bootstrap</div>
            </div>
            <span class="badge text-bg-success">SPA</span>
          </div>
          <ul class="list-unstyled mb-0 d-grid gap-2">
            <li class="d-flex justify-content-between"><span>Routing</span><strong>History API</strong></li>
            <li class="d-flex justify-content-between"><span>Structure</span><strong>Modular</strong></li>
            <li class="d-flex justify-content-between"><span>UI</span><strong>Bootstrap 5</strong></li>
            <li class="d-flex justify-content-between"><span>Auth</span><strong>Aware navigation</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-md-4">
      <div class="surface-panel p-4 h-100">
        <div class="fw-semibold mb-2">Separate page modules</div>
        <div class="muted-copy small">Each route owns its HTML fragment, styles, and JavaScript initializer.</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="surface-panel p-4 h-100">
        <div class="fw-semibold mb-2">Protected layouts</div>
        <div class="muted-copy small">Protected pages are wrapped with a reusable access-aware shell component.</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="surface-panel p-4 h-100">
        <div class="fw-semibold mb-2">Toast-ready feedback</div>
        <div class="muted-copy small">The toast container is prewired for login, logout, and navigation notices.</div>
      </div>
    </div>
  </div>
</section>`;function n(){return s}function e(){}export{e as init,n as render};
