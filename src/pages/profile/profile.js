import './profile.css';
import template from './profile.html?raw';

import { showToast } from '../../components/toast-container/toast-container.js';
import { supabase } from '../../services/supabaseClient.js';
import { getCurrentUser, getUser } from '../../state/auth.js';
import { fillTemplate } from '../../utils/template.js';

const AVATAR_BUCKET = 'avatars';

async function loadProfile(userId) {
  const [{ data: profile, error: profileError }, { data: finishedBooks, error: finishedError }, { data: reviews, error: reviewsError }, { data: quotes, error: quotesError }] = await Promise.all([
    supabase.from('profiles').select('display_name,bio,avatar_url').eq('id', userId).maybeSingle(),
    supabase.from('user_books').select('id').eq('user_id', userId).eq('status', 'finished'),
    supabase.from('reviews').select('rating').eq('user_id', userId),
    supabase.from('quotes').select('id').eq('user_id', userId),
  ]);

  if (profileError) throw profileError;
  if (finishedError) throw finishedError;
  if (reviewsError) throw reviewsError;
  if (quotesError) throw quotesError;

  const averageRating = reviews?.length
    ? reviews.reduce((total, review) => total + Number(review.rating ?? 0), 0) / reviews.length
    : 0;

  return {
    profile: profile ?? {},
    stats: {
      finishedBooks: finishedBooks?.length ?? 0,
      averageRating,
      quotes: quotes?.length ?? 0,
    },
  };
}

function getFileExtension(fileName) {
  const parts = fileName.split('.');

  return parts.length > 1 ? parts.at(-1) : 'png';
}

async function uploadAvatar(userId, file) {
  const extension = getFileExtension(file.name).toLowerCase();
  const objectPath = `${userId}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(objectPath, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(objectPath);

  return data.publicUrl;
}

export function render() {
  const user = getUser() ?? { name: 'Reader', role: 'member', initials: 'R' };

  return fillTemplate(template, {
    name: user.name,
    role: user.role,
    initials: user.initials,
    email: user.email ?? 'signed-in reader',
    bio: user.bio ?? '',
  });
}

export function init() {
  const form = document.getElementById('profile-form');

  if (!form) {
    return;
  }

  const nameField = document.getElementById('profile-name');
  const bioField = document.getElementById('profile-bio');
  const avatarField = document.getElementById('profile-avatar');
  const avatarFallback = document.querySelector('[data-avatar-fallback]');
  const avatarImage = document.querySelector('[data-avatar-image]');
  const previewFallback = document.querySelector('[data-avatar-preview-fallback]');
  const previewImage = document.querySelector('[data-avatar-preview]');
  const finishedCount = document.querySelector('[data-stat-finished]');
  const averageRating = document.querySelector('[data-stat-rating]');
  const quotesCount = document.querySelector('[data-stat-quotes]');
  const profileName = document.querySelector('[data-profile-name]');
  const profileEmail = document.querySelector('[data-profile-email]');
  const profileRole = document.querySelector('[data-profile-role]');

  let selectedFile = null;

  let activeUser = null;

  const setAvatarPreview = (url) => {
    if (!previewImage || !previewFallback || !avatarImage || !avatarFallback) {
      return;
    }

    if (url) {
      previewImage.src = url;
      previewImage.classList.remove('d-none');
      previewFallback.classList.add('d-none');
      avatarImage.src = url;
      avatarImage.classList.remove('d-none');
      avatarFallback.classList.add('d-none');
    } else {
      previewImage.classList.add('d-none');
      previewFallback.classList.remove('d-none');
      avatarImage.classList.add('d-none');
      avatarFallback.classList.remove('d-none');
    }
  };

  const hydrate = async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.id) {
        showToast({ title: 'Sign in required', message: 'Please sign in again to edit your profile.', variant: 'warning' });
        return;
      }

      activeUser = user;

      if (profileName) profileName.textContent = user.name;
      if (profileEmail) profileEmail.textContent = user.email || 'signed-in reader';
      if (profileRole) profileRole.textContent = user.role;

      const { profile, stats } = await loadProfile(user.id);

      if (nameField) nameField.value = profile.display_name ?? user.name;
      if (bioField) bioField.value = profile.bio ?? '';

      const avatarUrl = profile.avatar_url ?? user.avatarUrl ?? '';
      setAvatarPreview(avatarUrl);

      if (finishedCount) finishedCount.textContent = String(stats.finishedBooks);
      if (averageRating) averageRating.textContent = stats.averageRating ? stats.averageRating.toFixed(1) : '0.0';
      if (quotesCount) quotesCount.textContent = String(stats.quotes);

      if (!avatarUrl) {
        setAvatarPreview('');
      }
    } catch (error) {
      showToast({ title: 'Profile load failed', message: error.message, variant: 'danger' });
    }
  };

  avatarField?.addEventListener('change', () => {
    const file = avatarField.files?.[0] ?? null;

    if (!file) {
      selectedFile = null;
      setAvatarPreview('');
      return;
    }

    selectedFile = file;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!activeUser?.id) {
      showToast({ title: 'Sign in required', message: 'Please sign in again to save profile changes.', variant: 'warning' });
      return;
    }

    const displayName = String(nameField?.value ?? '').trim();
    const bio = String(bioField?.value ?? '').trim();

    if (!displayName) {
      showToast({ title: 'Missing name', message: 'Display name cannot be empty.', variant: 'warning' });
      return;
    }

    void (async () => {
      try {
        const updates = {
          display_name: displayName,
          bio,
        };

        if (selectedFile) {
          updates.avatar_url = await uploadAvatar(activeUser.id, selectedFile);
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', activeUser.id);

        if (error) {
          throw error;
        }

        const updatedUser = {
          ...activeUser,
          name: displayName,
          bio,
          initials: displayName
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('') || activeUser.initials,
          avatarUrl: updates.avatar_url ?? activeUser.avatarUrl ?? '',
        };

        localStorage.setItem('shelflife.auth', JSON.stringify(updatedUser));
        activeUser = updatedUser;
        setAvatarPreview(updatedUser.avatarUrl ?? '');
        selectedFile = null;
        if (avatarField) {
          avatarField.value = '';
        }
        showToast({ title: 'Profile saved', message: 'Your display name, bio, and avatar were updated.', variant: 'success' });
      } catch (error) {
        showToast({ title: 'Save failed', message: error.message, variant: 'danger' });
      }
    })();
  });

  void hydrate();
}