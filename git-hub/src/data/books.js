export const books = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Productivity',
    progress: 72,
    status: 'Reading',
    summary: 'A system for building better reading and learning routines one small habit at a time.',
  },
  {
    id: '2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software',
    progress: 38,
    status: 'Paused',
    summary: 'A practical guide for writing code that is easier to read, test, and maintain.',
  },
  {
    id: '3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Fiction',
    progress: 100,
    status: 'Finished',
    summary: 'A reflective story about the paths we could have taken and the lives we choose.',
  },
  {
    id: '4',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Focus',
    progress: 54,
    status: 'Reading',
    summary: 'A framework for reclaiming focus in a distracted digital environment.',
  },
];

export function getBookById(id) {
  return books.find((book) => book.id === id) ?? null;
}