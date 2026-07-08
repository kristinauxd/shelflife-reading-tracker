import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY environment variables.'
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: 'reader1@example.com',
    password: 'pass123',
    displayName: 'Reader One',
  },
  {
    email: 'reader2@example.com',
    password: 'pass123',
    displayName: 'Reader Two',
  },
  {
    email: 'admin@example.com',
    password: 'pass123',
    displayName: 'Library Admin',
    role: 'admin',
  },
];

const genres = [
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Classics', slug: 'classics' },
  { name: 'Mystery', slug: 'mystery' },
  { name: 'Non-fiction', slug: 'non-fiction' },
];

const books = [
  {
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    genreSlug: 'fantasy',
    publishedYear: 1954,
    description: 'A fellowship forms to carry a dangerous burden across Middle-earth.',
  },
  {
    title: 'A Wizard of Earthsea',
    author: 'Ursula K. Le Guin',
    genreSlug: 'fantasy',
    publishedYear: 1968,
    description: 'A young wizard learns the cost of power, pride, and balance.',
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genreSlug: 'fantasy',
    publishedYear: 2007,
    description: 'A gifted musician tells the story of how he became a legend.',
  },
  {
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    genreSlug: 'fantasy',
    publishedYear: 2010,
    description: 'Storms, oaths, and war reshape a shattered world.',
  },
  {
    title: 'Mistborn',
    author: 'Brandon Sanderson',
    genreSlug: 'fantasy',
    publishedYear: 2006,
    description: 'A thief joins a rebellion built on ash, metal, and hope.',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genreSlug: 'sci-fi',
    publishedYear: 1965,
    description: 'A desert planet becomes the center of power, prophecy, and survival.',
  },
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    genreSlug: 'sci-fi',
    publishedYear: 1951,
    description: 'A mathematician tries to shorten the dark ages of a falling empire.',
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    genreSlug: 'sci-fi',
    publishedYear: 1984,
    description: 'A washed-up hacker is pulled into a high-stakes cyberspace job.',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genreSlug: 'sci-fi',
    publishedYear: 2021,
    description: 'An unlikely astronaut wakes up with a mission to save humanity.',
  },
  {
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    genreSlug: 'sci-fi',
    publishedYear: 1969,
    description: 'An envoy learns how culture shapes truth on an icy world.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genreSlug: 'classics',
    publishedYear: 1813,
    description: 'Misunderstandings and sharp wit test a family of five daughters.',
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genreSlug: 'classics',
    publishedYear: 1847,
    description: 'An independent governess builds a life on self-respect and resolve.',
  },
  {
    title: 'Great Expectations',
    author: 'Charles Dickens',
    genreSlug: 'classics',
    publishedYear: 1861,
    description: 'Ambition, shame, and belonging follow one young man into adulthood.',
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    genreSlug: 'classics',
    publishedYear: 1866,
    description: 'A desperate decision drives a student into moral freefall.',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genreSlug: 'classics',
    publishedYear: 1851,
    description: 'Obsession turns a whaling voyage into a meditation on fate.',
  },
  {
    title: 'The Hound of the Baskervilles',
    author: 'Arthur Conan Doyle',
    genreSlug: 'mystery',
    publishedYear: 1902,
    description: 'Sherlock Holmes investigates a family legend on the moors.',
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genreSlug: 'mystery',
    publishedYear: 2005,
    description: 'A journalist and a hacker uncover a dark family secret.',
  },
  {
    title: 'In the Woods',
    author: 'Tana French',
    genreSlug: 'mystery',
    publishedYear: 2007,
    description: 'A detective returns to a case that echoes his own childhood.',
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genreSlug: 'mystery',
    publishedYear: 1939,
    description: 'Guests on an island discover that every secret has a price.',
  },
  {
    title: 'Big Little Lies',
    author: 'Liane Moriarty',
    genreSlug: 'mystery',
    publishedYear: 2014,
    description: 'A school fundraiser unravels a web of hidden tensions.',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genreSlug: 'non-fiction',
    publishedYear: 2011,
    description: 'A sweeping history of how Homo sapiens came to dominate the planet.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genreSlug: 'non-fiction',
    publishedYear: 2018,
    description: 'Small behavior changes compound into meaningful long-term results.',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genreSlug: 'non-fiction',
    publishedYear: 2018,
    description: 'A memoir about self-invention through education and survival.',
  },
  {
    title: 'The Body',
    author: 'Bill Bryson',
    genreSlug: 'non-fiction',
    publishedYear: 2019,
    description: 'A readable tour through the astonishing machinery of the human body.',
  },
  {
    title: 'Quiet',
    author: 'Susan Cain',
    genreSlug: 'non-fiction',
    publishedYear: 2012,
    description: 'An argument for the hidden strengths of introversion.',
  },
];

const readerOneLibrary = [
  { title: 'Dune', status: 'reading', started_at: '2026-06-20', finished_at: null, progress_pages: 238 },
  { title: 'The Fellowship of the Ring', status: 'finished', started_at: '2026-05-01', finished_at: '2026-05-29', progress_pages: 423 },
  { title: 'Atomic Habits', status: 'finished', started_at: '2026-04-10', finished_at: '2026-04-17', progress_pages: 320 },
  { title: 'Project Hail Mary', status: 'want_to_read', started_at: null, finished_at: null, progress_pages: 0 },
  { title: 'Sapiens', status: 'reading', started_at: '2026-06-28', finished_at: null, progress_pages: 91 },
  { title: 'The Hound of the Baskervilles', status: 'finished', started_at: '2026-03-12', finished_at: '2026-03-18', progress_pages: 256 },
  { title: 'Pride and Prejudice', status: 'want_to_read', started_at: null, finished_at: null, progress_pages: 0 },
  { title: 'Quiet', status: 'finished', started_at: '2026-02-02', finished_at: '2026-02-08', progress_pages: 352 },
];

const readerOneReviews = [
  {
    title: 'The Fellowship of the Ring',
    rating: 5,
    review_text: 'A strong opener with a clear sense of scale and a memorable journey.',
    is_spoiler: false,
  },
  {
    title: 'Atomic Habits',
    rating: 4,
    review_text: 'Practical, approachable, and easy to revisit in small sections.',
    is_spoiler: false,
  },
  {
    title: 'The Hound of the Baskervilles',
    rating: 4,
    review_text: 'Classic mystery pacing with a great atmosphere from start to finish.',
    is_spoiler: false,
  },
  {
    title: 'Quiet',
    rating: 5,
    review_text: 'Thoughtful and validating, with ideas that stay useful after reading.',
    is_spoiler: false,
  },
  {
    title: 'Dune',
    rating: 4,
    review_text: 'Dense worldbuilding, but the payoff is worth the attention.',
    is_spoiler: false,
  },
];

const readerOneQuotes = [
  {
    title: 'The Fellowship of the Ring',
    quote_text: 'Not all who wander are lost, but the path still asks for courage.',
    page_number: 87,
  },
  {
    title: 'Atomic Habits',
    quote_text: 'Small habits are a vote for the person you want to become.',
    page_number: 42,
  },
  {
    title: 'Quiet',
    quote_text: 'There is strength in choosing a pace that fits your own mind.',
    page_number: 156,
  },
];

const readerOneGoals = [
  { year: 2026, target_books: 24 },
  { year: 2027, target_books: 30 },
];

async function getExistingUser(email) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email === email) ?? null;
}

async function resetDemoUsers() {
  for (const user of demoUsers) {
    const existing = await getExistingUser(user.email);

    if (existing) {
      const { error } = await supabase.auth.admin.deleteUser(existing.id);
      if (error) {
        throw error;
      }
    }
  }

  const createdUsers = [];

  for (const user of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        display_name: user.displayName,
      },
    });

    if (error) {
      throw error;
    }

    createdUsers.push({
      id: data.user.id,
      email: user.email,
      role: user.role ?? null,
    });
  }

  return createdUsers;
}

async function resetCatalog() {
  const tables = ['books', 'genres'];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().gte('id', 1);

    if (error) {
      throw error;
    }
  }
}

async function seedGenres() {
  const { data, error } = await supabase.from('genres').insert(genres).select('id, slug, name');

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function seedBooks(genreRows) {
  const genreIdBySlug = new Map(genreRows.map((genre) => [genre.slug, genre.id]));

  const payload = books.map((book) => ({
    title: book.title,
    author: book.author,
    description: book.description,
    cover_url: `https://picsum.photos/seed/${encodeURIComponent(book.title)}/480/720`,
    genre_id: genreIdBySlug.get(book.genreSlug),
    published_year: book.publishedYear,
  }));

  const { data, error } = await supabase.from('books').insert(payload).select('id, title');

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function seedUserRoles(users) {
  const adminUser = users.find((user) => user.role === 'admin');

  if (!adminUser) {
    throw new Error('Admin user was not created.');
  }

  const { error } = await supabase.from('user_roles').insert({
    user_id: adminUser.id,
    role: 'admin',
  });

  if (error) {
    throw error;
  }
}

async function seedReaderData(users, booksRows) {
  const reader = users.find((user) => user.email === 'reader1@example.com');

  if (!reader) {
    throw new Error('Reader user was not created.');
  }

  const bookIdByTitle = new Map(booksRows.map((book) => [book.title, book.id]));
  const getBookId = (title) => {
    const bookId = bookIdByTitle.get(title);

    if (!bookId) {
      throw new Error(`Missing seeded book: ${title}`);
    }

    return bookId;
  };

  const libraryPayload = readerOneLibrary.map((item) => ({
    user_id: reader.id,
    book_id: getBookId(item.title),
    status: item.status,
    started_at: item.started_at,
    finished_at: item.finished_at,
    progress_pages: item.progress_pages,
  }));

  const reviewPayload = readerOneReviews.map((item) => ({
    user_id: reader.id,
    book_id: getBookId(item.title),
    rating: item.rating,
    review_text: item.review_text,
    is_spoiler: item.is_spoiler,
  }));

  const quotePayload = readerOneQuotes.map((item) => ({
    user_id: reader.id,
    book_id: getBookId(item.title),
    quote_text: item.quote_text,
    page_number: item.page_number,
  }));

  const goalPayload = readerOneGoals.map((item) => ({
    user_id: reader.id,
    year: item.year,
    target_books: item.target_books,
  }));

  const inserts = [
    supabase.from('user_books').insert(libraryPayload),
    supabase.from('reviews').insert(reviewPayload),
    supabase.from('quotes').insert(quotePayload),
    supabase.from('reading_goals').insert(goalPayload),
  ];

  for (const request of inserts) {
    const { error } = await request;

    if (error) {
      throw error;
    }
  }
}

async function main() {
  console.log('Reminder: disable email confirmations in the Supabase Auth dashboard for manual signups.');
  console.log('Creating confirmed demo users and fresh sample catalog data...');

  await resetCatalog();

  const users = await resetDemoUsers();
  await seedUserRoles(users);

  const genreRows = await seedGenres();
  const bookRows = await seedBooks(genreRows);

  await seedReaderData(users, bookRows);

  console.log(`Seeded ${users.length} users, ${genreRows.length} genres, and ${bookRows.length} books.`);
  console.log('Demo reader data, quotes, and goals are ready.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});