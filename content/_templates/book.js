/* TEMPLATE — BOOK
 * Used by: Books (Published, Upcoming, Series, Drafts).
 *
 * Fields
 *   id          required
 *   title       required
 *   status      required  'published' | 'upcoming' | 'draft' | 'placeholder'
 *                         'placeholder' renders a blank "Title to be announced" slot
 *   excerpt     required  card description
 *   statusLabel optional  e.g. 'Early 2027', 'Chapter 4 of 12' (shown instead of the raw status)
 *   subtitle    optional
 *   genre       optional  card badge
 *   cover       optional  image path; a "cover coming soon" frame is used if omitted
 *   pages, year, format, language   optional  shown as quick facts
 *   points      optional  ['Key idea', …]
 *   chapters    optional  ['Chapter 1: …', …]
 *   body        optional  HTML synopsis (falls back to excerpt)
 *   buyUrl      optional  external store link for published books
 *   volumes     optional  for series: [{ title, status, href }]
 */
PVS.register('_templates/book', [
  {
    id: 'sample-book',
    title: 'Sample Book Title',
    subtitle: 'A Descriptive Subtitle',
    status: 'draft',
    statusLabel: 'In Progress',
    genre: 'Leadership',
    pages: 220,
    language: 'English',
    excerpt: 'A sample book entry used to preview the book layout.',
    points: ['First key idea', 'Second key idea', 'Third key idea'],
    chapters: ['Chapter 1: Beginnings', 'Chapter 2: The Middle', 'Chapter 3: The Road Ahead'],
    body: '<p class="about-body-p">A longer synopsis of the book.</p>'
  },
  {
    id: 'sample-series',
    title: 'Sample Book Series',
    status: 'published',
    genre: 'Series',
    excerpt: 'A sample series entry listing its volumes.',
    volumes: [
      { title: 'Volume 1: People Before Process', status: 'Published', href: 'item.html?s=books&c=published&id=people-before-process' },
      { title: 'Volume 2: To be announced', status: 'Upcoming' }
    ]
  }
]);
