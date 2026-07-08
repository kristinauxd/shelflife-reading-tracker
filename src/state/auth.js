import { supabase } from '../services/supabaseClient.js';

const AUTH_KEY = 'shelflife.auth';

function deriveInitials(name) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'SL'
  );
}

function normalizeUser({ authUser, profile, role }) {
  const displayName =
    profile?.display_name ??
    authUser.user_metadata?.display_name ??
    authUser.email?.split('@')[0] ??
    'Reader';

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name: displayName,
    role: role ?? 'member',
    initials: deriveInitials(displayName),
    bio: profile?.bio ?? '',
    avatarUrl: profile?.avatar_url ?? '',
  };
}

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
    id: null,
    email: '',
    name,
    role,
    initials:
      deriveInitials(name),
    bio: '',
    avatarUrl: '',
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
}

export async function getCurrentUser() {
  const storedUser = readUser();

  if (storedUser?.id) {
    return storedUser;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return storedUser;
  }

  const authUser = data.user;

  const [{ data: profile }, { data: roleRow }] = await Promise.all([
    supabase.from('profiles').select('display_name,bio,avatar_url').eq('id', authUser.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', authUser.id).maybeSingle(),
  ]);

  const syncedUser = normalizeUser({
    authUser,
    profile,
    role: roleRow?.role,
  });

  localStorage.setItem(AUTH_KEY, JSON.stringify(syncedUser));

  return syncedUser;
}

export async function signInWithCredentials({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const authUser = data.user;

  const [{ data: profile }, { data: roleRow }] = await Promise.all([
    supabase.from('profiles').select('display_name,bio,avatar_url').eq('id', authUser.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', authUser.id).maybeSingle(),
  ]);

  const user = normalizeUser({
    authUser,
    profile,
    role: roleRow?.role,
  });

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
}

export async function signOut() {
  localStorage.removeItem(AUTH_KEY);
  await supabase.auth.signOut();
}