import './login.css';
import template from './login.html?raw';

import { navigate } from '../../router.js';
import { signIn } from '../../state/auth.js';
import { showToast } from '../../components/toast-container/toast-container.js';

export function render() {
  return template;
}

export function init() {
  const form = document.getElementById('login-form');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const role = String(formData.get('role') ?? 'member');

    if (!name) {
      showToast({ title: 'Missing name', message: 'Enter a display name to continue.', variant: 'warning' });
      return;
    }

    signIn({ name, role });
    showToast({ title: 'Signed in', message: `Welcome back, ${name}.`, variant: 'success' });

    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
    navigate(redirect, { replace: true });
  });
}