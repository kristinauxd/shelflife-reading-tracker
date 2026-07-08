# Shelflife Reading Tracker

## Local Environment

Copy [.env.example](.env.example) to [.env](.env) and fill in the Supabase values for your project.

The frontend uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
The seed script also needs `SUPABASE_SERVICE_ROLE_KEY`, but that value should stay local and never be committed.

## Seeding Demo Data

1. Disable email confirmations in Supabase Auth for easier demo sign-in.
2. Set `SUPABASE_SERVICE_ROLE_KEY` in your shell or local environment.
3. Run `npm run seed` from the repo root.

The seed script creates the demo users, marks `admin@example.com` as an admin, and loads sample genres, books, library items, reviews, quotes, and reading goals.
