/* TEMPLATE — QUIZ
 * Used by: every Quiz category except Question Bank.
 *
 * Fields
 *   id          required
 *   title       required
 *   excerpt     required
 *   date        required  'YYYY-MM' (sort order)
 *   month       optional  'YYYY-MM' — use for monthly editions (Current Affairs)
 *   difficulty  optional  'Easy' | 'Medium' | 'Hard' | 'Mixed'
 *   intro       optional  text on the start screen
 *   timeLimit   optional  minutes (informational)
 *
 * Questions — use ONE of:
 *   questions   [{ q, options: [..], answer: <zero-based index>, explain? }]   a fixed, curated set
 *   bank        { category: '<quiz category id>' | 'all', count: 10 }          a random round from the bank
 */
PVS.register('_templates/quiz', [
  {
    id: 'sample-quiz',
    title: 'Sample Quiz',
    excerpt: 'A three-question sample used to preview the quiz player.',
    date: '2026-09',
    difficulty: 'Easy',
    questions: [
      { q: 'How many days are there in a week?', options: ['5', '6', '7', '8'], answer: 2 },
      { q: 'Which is the largest planet in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], answer: 2, explain: 'Jupiter is more than 11 times wider than Earth.' },
      { q: 'What is H₂O more commonly called?', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 1 }
    ]
  }
]);
