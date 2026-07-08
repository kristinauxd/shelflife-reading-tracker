import './login.css';
import template from './login.html?raw';

import { navigate } from '../../router.js';
import { signInWithCredentials, signUpWithCredentials } from '../../state/auth.js';
import { showToast } from '../../components/toast-container/toast-container.js';

export function render() {
  return template;
}

export function init() {
  const form = document.getElementById('login-form');
  const modeButtons = document.querySelectorAll('[data-auth-mode]');
  const nameGroup = document.querySelector('[data-auth-name-group]');
  const title = document.querySelector('[data-auth-title]');
  const copy = document.querySelector('[data-auth-copy]');
  const submitButton = document.querySelector('[data-auth-submit]');
  const nameField = document.getElementById('login-name');
  const emailField = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');
  const demoButtons = document.querySelectorAll('[data-demo-account]');
  let mode = 'login';

  function syncMode(nextMode) {
    mode = nextMode;

    modeButtons.forEach((button) => {
      const isActive = button.getAttribute('data-auth-mode') === mode;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (nameGroup) {
      nameGroup.hidden = mode !== 'register';
    }

    if (nameField) {
      nameField.required = mode === 'register';
    }

    if (title) {
      title.textContent = mode === 'register' ? 'Create your reading profile' : 'Enter your reading room';
    }

    if (copy) {
      copy.textContent =
        mode === 'register'
          ? 'Create a Supabase Auth account to track your shelf, save notes, and personalize your profile.'
          : 'Use one of the seeded demo accounts, or switch to register to create a new reading profile.';
    }

    if (submitButton) {
      submitButton.textContent = mode === 'register' ? 'Create account' : 'Continue';
    }

    if (passwordField) {
      passwordField.setAttribute('autocomplete', mode === 'register' ? 'new-password' : 'current-password');
    }
  }

  syncMode('login');

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      syncMode(button.getAttribute('data-auth-mode') === 'register' ? 'register' : 'login');
      if (mode === 'register') {
        nameField?.focus();
      } else {
        emailField?.focus();
      }
    });
  });

  demoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const email = button.getAttribute('data-demo-account') ?? '';

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
    const name = String(formData.get('name') ?? '').trim();

    if (mode === 'register' && !name) {
      showToast({ title: 'Missing name', message: 'Enter a display name to create your account.', variant: 'warning' });
      return;
    }

    if (!email || !password) {
      showToast({ title: 'Missing credentials', message: 'Enter a demo email and password to continue.', variant: 'warning' });
      return;
    }

    const request = mode === 'register'
      ? signUpWithCredentials({ name, email, password }).then(({ user, session }) => ({ user, session }))
      : signInWithCredentials({ email, password }).then((user) => ({ user, session: true }));

    void request
      .then(({ user, session }) => {
        showToast({
          title: mode === 'register' ? 'Account created' : 'Signed in',
          message:
            mode === 'register'
              ? session
                ? `Welcome, ${user.name}. Your account is ready.`
                : 'Your account was created. Check your email to finish confirming it.'
              : `Welcome back, ${user.name}.`,
          variant: session ? 'success' : 'warning',
        });

        if (session) {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch((error) => {
        showToast({
          title: mode === 'register' ? 'Registration failed' : 'Sign in failed',
          message: error.message,
          variant: 'danger',
        });
      });
  });
}