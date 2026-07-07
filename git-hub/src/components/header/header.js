import './header.css';
import template from './header.html?raw';

import { fillTemplate } from '../../utils/template.js';
import { getUser, isAdmin } from '../../state/auth.js';

function isRouteActive(pathname, target) {
  if (target === '/') {
    return pathname === '/';
  }

  if (target === '/books') {
    return pathname === '/books' || pathname.startsWith('/books/');
  }

  return pathname === target;
}

function navLink({ href, label, pathname }) {
  const activeClass = isRouteActive(pathname, href) ? 'active' : '';

  return `<a class="nav-link px-3 ${activeClass}" data-link href="${href}">${label}</a>`;
}

export function renderHeader(pathname) {
  const user = getUser();
  const links = [
    navLink({ href: '/', label: 'Home', pathname }),
    navLink({ href: '/books', label: 'Books', pathname }),
  ];

  if (user) {
    links.push(navLink({ href: '/dashboard', label: 'Dashboard', pathname }));
    links.push(navLink({ href: '/library', label: 'Library', pathname }));
    links.push(navLink({ href: '/profile', label: 'Profile', pathname }));

    if (isAdmin()) {
      links.push(navLink({ href: '/admin', label: 'Admin', pathname }));
    }
  }

  const authAction = user
    ? `
      <button class="btn btn-outline-light btn-sm ms-lg-3 mt-3 mt-lg-0" type="button" data-action="logout">
        Sign out
      </button>
    `
    : `
      <a class="btn btn-primary btn-sm ms-lg-3 mt-3 mt-lg-0" data-link href="/login">
        Sign in
      </a>
    `;

  return fillTemplate(template, {
    links: links.join(''),
    authAction,
  });
}