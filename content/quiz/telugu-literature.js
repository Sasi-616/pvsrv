/* Quiz › Telugu Literature Quiz — item format: content/_templates/quiz.js
 * A quiz either lists its own questions, or draws a random round from the
 * question bank with ank: { category, count }. */
PVS.register('quiz/telugu-literature', [
  {
    id: 'starter-round',
    title: 'Telugu Literature Quiz — Starter Round',
    excerpt: 'A quick five-question warm-up drawn at random from the question bank. Every attempt is a new round.',
    date: '2026-09',
    difficulty: 'Easy',
    bank: { category: 'telugu-literature', count: 5 }
  }
]);