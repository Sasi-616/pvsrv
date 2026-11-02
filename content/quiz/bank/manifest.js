/* QUIZ QUESTION BANK — MANIFEST
 *
 * The bank is split into shards: content/quiz/bank/<category>/<nnn>.js
 * (001.js, 002.js, …), each holding up to `shardSize` questions. A quiz round
 * loads at most four shards, so the bank can grow past 100,000 questions
 * without slowing any page.
 *
 * When you add a shard, bump that category's `shards` and `count` here.
 * Category keys must match quiz category ids in content/registry.js.
 *
 * Question format (see content/quiz/bank/film/001.js):
 *   { id: 'film-000001', q: 'Question?', options: ['A', 'B', 'C', 'D'], answer: 0,
 *     explain: 'Optional explanation.', difficulty: 'easy|medium|hard', lang: 'en|te' }
 *   `answer` is the zero-based index of the correct option.
 */
PVS.register('quiz/bank/manifest', {
  target: 100000,
  shardSize: 500,
  categories: {
    'film': { shards: 1, count: 5 },
    'children': { shards: 1, count: 5 },
    'corporate': { shards: 1, count: 5 },
    'sports': { shards: 1, count: 5 },
    'science': { shards: 1, count: 5 },
    'current-affairs': { shards: 0, count: 0 },
    'global': { shards: 1, count: 5 },
    'telugu-literature': { shards: 1, count: 5 },
    'hindu-mythology': { shards: 1, count: 5 }
  }
});
