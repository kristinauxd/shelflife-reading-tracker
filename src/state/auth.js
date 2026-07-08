const AUTH_KEY = 'shelflife.auth';

function readUser() {
  const stored = localStorage.getItem(AUTH_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getUser() {
  return readUser();
}

export function isAuthenticated() {
  return Boolean(readUser());
}

export function isAdmin() {
  return readUser()?.role === 'admin';
}

export function signIn({ name, role }) {
  const user = {
    name,
    role,
    initials:
      name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'SL',
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY);
}