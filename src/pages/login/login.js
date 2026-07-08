import './login.css';
import template from './login.html?raw';

import { navigate } from '../../router.js';
import { signInWithCredentials } from '../../state/auth.js';
import { showToast } from '../../components/toast-container/toast-container.js';

export function render() {
  return template;
}

export function init() {
  const form = document.getElementById('login-form');
  const demoButtons = document.querySelectorAll('[data-demo-account]');

  demoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const email = button.getAttribute('data-demo-account') ?? '';
      const passwordField = document.getElementById('login-password');
      const emailField = document.getElementById('login-email');

      if (emailField) {
        emailField.value = email;
      }

      if (passwordField) {
        passwordField.value = 'pass123';
        passwordField.focus();
      }
    });
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      showToast({ title: 'Missing credentials', message: 'Enter a demo email and password to continue.', variant: 'warning' });
      return;
    }

    void signInWithCredentials({ email, password })
      .then((user) => {
        showToast({ title: 'Signed in', message: `Welcome back, ${user.name}.`, variant: 'success' });

        const redirect = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        navigate(redirect, { replace: true });
      })
      .catch((error) => {
        showToast({ title: 'Sign in failed', message: error.message, variant: 'danger' });
      });
  });
}