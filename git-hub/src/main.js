import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/global.css';

import { initRouter } from './router.js';

const app = document.getElementById('app');

app.innerHTML = `
  <div class="app-shell d-flex min-vh-100 flex-column">
    <div id="toast-root"></div>
    <header id="site-header"></header>
    <main id="site-main" class="flex-grow-1">
      <div id="page-content" class="container py-4 py-lg-5"></div>
    </main>
    <footer id="site-footer"></footer>
  </div>
`;

initRouter();