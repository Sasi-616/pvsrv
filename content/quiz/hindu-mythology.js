/* Quiz › Hindu Mythology Quiz — item format: content/_templates/quiz.js
 * A quiz either lists its own questions, or draws a random round from the
 * question bank with ank: { category, count }. */
PVS.register('quiz/hindu-mythology', [
  {
    id: 'starter-round',
    title: 'Hindu Mythology Quiz — Starter Round',
    excerpt: 'A quick five-question warm-up drawn at random from the question bank. Every attempt is a new round.',
    date: '2026-09',
    difficulty: 'Easy',
    bank: { category: 'hindu-mythology', count: 5 }
  }
]);