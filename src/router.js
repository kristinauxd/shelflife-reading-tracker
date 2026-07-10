import { renderHeader } from './components/header/header.js';
import { renderFooter } from './components/footer/footer.js';
import { renderProtectedWrapper } from './components/protected-wrapper/protected-wrapper.js';
import { renderToastContainer, showToast } from './components/toast-container/toast-container.js';
import { getUser, isAdmin, signOut } from './state/auth.js';

const pageContainer = () => document.getElementById('page-content');
const headerContainer = () => document.getElementById('site-header');
const footerContainer = () => document.getElementById('site-footer');
const toastRoot = () => document.getElementById('toast-root');

const routeDefinitions = [
  { path: '/', load: () => import('./pages/home/home.js'), title: 'Home', protected: false },
  { path: '/login', load: () => import('./pages/login/login.js'), title: 'Login', protected: false },
  { path: '/dashboard', load: () => import('./pages/dashboard/dashboard.js'), title: 'Dashboard', protected: true },
  { path: '/books', load: () => import('./pages/books/books.js'), title: 'Books', protected: false },
  {
    path: /^\/books\/([^/]+)$/,
    load: () => import('./pages/book-detail/book-detail.js'),
    title: 'Book details',
    protected: false,
  },
  { path: '/library', load: () => import('./pages/library/library.js'), title: 'Library', protected: true },
  { path: '/profile', load: () => import('./pages/profile/profile.js'), title: 'Profile', protected: true },
  { path: '/admin', load: () => import('./pages/admin/admin.js'), title: 'Admin', protected: true, adminOnly: true },
];

function resolveRoute(pathname) {
  for (const route of routeDefinitions) {
    if (typeof route.path === 'string' && route.path === pathname) {
      return { route, params: {} };
    }

    if (route.path instanceof RegExp) {
      const matches = pathname.match(route.path);

      if (matches) {
        return {
          route,
          params: {
            id: matches[1],
          },
        };
      }
    }
  }

  return null;
}

function renderNotFound() {
  return `
    <section class="surface-panel p-4 p-lg-5 fade-in-up">
      <span class="badge text-bg-warning status-chip mb-3">404</span>
      <h1 class="page-title h2 mb-2">Page not found</h1>
      <p class="muted-copy mb-4">The route you requested is not part of this scaffold.</p>
      <a class="btn btn-primary" data-link href="/">Go home</a>
    </section>
  `;
}

function renderAppChrome(pathname) {
  headerContainer().innerHTML = renderHeader(pathname);
  footerContainer().innerHTML = renderFooter();
  toastRoot().innerHTML = renderToastContainer();
}

function handleDocumentClick(event) {
  const anchor = event.target.closest('a[data-link]');

  if (anchor) {
    const href = anchor.getAttribute('href');

    if (!href || href.startsWith('http')) {
      return;
    }

    event.preventDefault();
    navigate(href);
    return;
  }

  const actionButton = event.target.closest('[data-action="logout"]');

  if (actionButton) {
    event.preventDefault();
    void signOut()
      .then(() => {
        showToast({ title: 'Signed out', message: 'Your session has been cleared.', variant: 'secondary' });
        navigate('/', { replace: true });
      })
      .catch((error) => {
        showToast({ title: 'Sign out failed', message: error.message, variant: 'danger' });
      });
  }
}

export function navigate(pathname, { replace = false } = {}) {
  if (replace) {
    history.replaceState({}, '', pathname);
  } else {
    history.pushState({}, '', pathname);
  }

  void renderRoute();
}

async function renderRoute() {
  const pathname = window.location.pathname;
  const resolved = resolveRoute(pathname);

  renderAppChrome(pathname);

  if (!resolved) {
    pageContainer().innerHTML = renderNotFound();
    return;
  }

  if (resolved.route.path === '/login' && getUser()) {
    navigate('/dashboard', { replace: true });
    return;
  }

  const user = getUser();

  if (resolved.route.protected && !user) {
    pageContainer().innerHTML = renderProtectedWrapper({
      title: 'Authentication required',
      description: 'Sign in to continue to your private reading space.',
      content: '',
    });
    return;
  }

  if (resolved.route.adminOnly && !isAdmin()) {
    pageContainer().innerHTML = renderProtectedWrapper({
      title: 'Administration',
      description: 'Only admin users can open this section.',
      content: '',
      requiredRole: 'admin',
    });
    return;
  }

  const pageModule = await resolved.route.load();
  const pageMarkup = pageModule.render({ params: resolved.params, user });

  if (resolved.route.protected || resolved.route.adminOnly) {
    pageContainer().innerHTML = renderProtectedWrapper({
      title: resolved.route.title,
      description: 'This is where you can update your profile information.',
      content: pageMarkup,
      requiredRole: resolved.route.adminOnly ? 'admin' : 'user',
    });
  } else {
    pageContainer().innerHTML = pageMarkup;
  }

  pageModule.init?.({ params: resolved.params, user });
  document.title = `${resolved.route.title} | ShelfLife Reading Tracker`;
}

export function initRouter() {
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('popstate', () => {
    void renderRoute();
  });
  void renderRoute();
}