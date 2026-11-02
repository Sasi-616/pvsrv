/* Books › Upcoming Books — item format: content/_templates/book.js
 *
 * The four entries below are blank placeholder slots. They render as dashed
 * "Title to be announced" cards on books.html and on the Upcoming Books page.
 *
 * To announce a book, replace a slot with a real entry, e.g.:
 *   {
 *     id: 'my-next-book',
 *     title: 'My Next Book',
 *     status: 'upcoming',
 *     statusLabel: 'Early 2027',
 *     genre: 'Leadership',
 *     cover: 'assets/books/my-next-book.png',   // optional — omit for a "cover coming soon" frame
 *     excerpt: 'One-paragraph description.',
 *     points: ['Key idea one', 'Key idea two']
 *   }
 */
PVS.register('books/upcoming', [
  { id: 'slot-1', status: 'placeholder', label: 'Upcoming' },
  { id: 'slot-2', status: 'placeholder', label: 'Upcoming' },
  { id: 'slot-3', status: 'placeholder', label: 'Upcoming' },
  { id: 'slot-4', status: 'placeholder', label: 'Upcoming' }
]);
