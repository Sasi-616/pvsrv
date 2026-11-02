/* Quiz › Current Affairs Quiz (monthly) — item format: content/_templates/quiz.js
 *
 * One entry per month. Set month: 'YYYY-MM' so editions sort newest first.
 * The slots below are placeholders for upcoming editions; replace one with a
 * real quiz when it is ready, e.g.:
 *   { id: '2026-09', title: 'Current Affairs — September 2026', month: '2026-09',
 *     excerpt: '…', difficulty: 'Medium', questions: [ { q, options, answer, explain } ] }
 */
PVS.register('quiz/current-affairs', [
  { id: 'slot-2026-09', status: 'placeholder', label: 'September 2026', title: 'September 2026 Edition', excerpt: 'This month\'s current affairs quiz is being prepared.' },
  { id: 'slot-2026-10', status: 'placeholder', label: 'October 2026', title: 'October 2026 Edition', excerpt: 'Releasing next month.' },
  { id: 'slot-2026-11', status: 'placeholder', label: 'November 2026', title: 'November 2026 Edition', excerpt: 'Releasing in November.' }
]);