# Shelflife Reading Tracker

Shelflife Reading Tracker is a Vite-based single-page application for managing a personal reading life. It lets readers browse a catalog, track books in their library, write reviews, save quotes, and set yearly reading goals. An admin area supports catalog management.

## Project Description

The app is built with vanilla JavaScript, Bootstrap 5, and Supabase. The frontend handles routing, rendering, and session state in the browser, while Supabase provides authentication, Postgres data storage, and file storage for profile avatars.

The demo seed script loads sample catalog data and creates local test users so the app can be explored immediately after setup.

## Architecture

The codebase follows a simple feature-oriented SPA structure:

- `src/main.js` bootstraps the app shell, initializes routing, and checks the Supabase connection.
- `src/router.js` manages client-side navigation with the History API and route protection.
- `src/components/` contains shared UI building blocks such as the header, footer, protected wrapper, and toast container.
- `src/pages/` contains page-level features, one folder per route.
- `src/services/` wraps external services such as the Supabase client and book data access.
- `src/state/` stores client-side auth helpers and session state.
- `src/styles/` contains global styling, with page and component CSS kept next to the feature they style.

High-level flow:

1. `main.js` mounts the shell and verifies the Supabase endpoint.
2. `router.js` resolves the current path and loads the matching page module.
3. Protected routes are wrapped before rendering when auth or admin access is required.
4. Page modules render HTML fragments and initialize any local behavior.

## Schema

The Supabase schema lives in `supabase/migrations/` and is centered on these tables:

- `profiles`: public user profile data, including display name, bio, and avatar URL.
- `user_roles`: one role per user, currently `member` or `admin`.
- `genres`: book categories with unique names and slugs.
- `books`: the shared catalog of books, linked to `genres`.
- `user_books`: each user’s library items and reading status for a book.
- `reviews`: a user’s review and rating for a book.
- `quotes`: saved quotes associated with a user and a book.
- `reading_goals`: yearly reading targets per user.

Important relationships and rules:

- Every profile, role, library item, review, quote, and goal belongs to a Supabase auth user.
- `books.genre_id` references `genres.id` and is nullable.
- `user_books`, `reviews`, `quotes`, and `reading_goals` are protected by row-level security so users only access their own data.
- `genres` and `books` are publicly readable, but admin-only for inserts, updates, and deletes.
- Profile avatar files are stored in the public `avatars` bucket, with ownership enforced by storage policies.
- New auth users automatically get a profile and a default `member` role through the `handle_new_user` trigger.

## Setup Guide

### Prerequisites

- Node.js 18 or newer
- A Supabase project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials.

Required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL` for the seed script
- `SUPABASE_SERVICE_ROLE_KEY` for the seed script

Keep the service role key local only. Do not commit it.

### 3. Apply the database migrations

Run the SQL files in `supabase/migrations/` against your Supabase project. You can do this in the Supabase SQL editor or with your preferred Supabase workflow.

### 4. Seed demo data

Before seeding, disable email confirmations in Supabase Auth if you want the demo accounts to sign in immediately.

```bash
npm run seed
```

The seed script creates these demo users:

- `reader1@example.com` / `pass123`
- `reader2@example.com` / `pass123`
- `admin@example.com` / `pass123`

It also loads sample genres, books, library items, reviews, quotes, and reading goals.

### 5. Start the app

```bash
npm run dev
```

Use `npm run build` to create a production build and `npm run preview` to preview it locally.

## File Structure

```text
.
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── scripts/
│   └── seed.js
├── src/
│   ├── main.js
│   ├── router.js
│   ├── components/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── protected-wrapper/
│   │   └── toast-container/
│   ├── data/
│   │   └── books.js
│   ├── pages/
│   │   ├── admin/
│   │   ├── book-detail/
│   │   ├── books/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── library/
│   │   ├── login/
│   │   └── profile/
│   ├── services/
│   │   ├── book-data.js
│   │   └── supabaseClient.js
│   ├── state/
│   │   └── auth.js
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       └── template.js
└── supabase/
	└── migrations/
		├── 20260707000000_initial_mvp_schema.sql
		├── 20260707000001_restrict_helper_functions.sql
		├── 20260707000002_internalize_admin_helper.sql
		└── 20260708000003_profile_avatars.sql
```

## Notes

- The frontend checks connectivity with Supabase on startup and shows a toast if the API is reachable.
- Auth state is stored in local storage under `shelflife.auth`.
- Admin access is enforced through the database role helper and protected route logic.
