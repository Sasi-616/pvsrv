/* TEMPLATE — ARTICLE
 * Used by: Blogs, Reviews & Publications, Knowledge & Development.
 *
 * Fields
 *   id          required  URL slug, unique within the category (lowercase-with-dashes)
 *   title       required
 *   excerpt     required  1–2 sentence summary for cards and search
 *   date        required  'YYYY-MM-DD' or 'YYYY-MM' (controls sort order)
 *   body        required  HTML: <p>, <h3>, <h4>, <ul>, <ol>, <blockquote>
 *   subtitle    optional  shown under the title in the page banner
 *   readTime    optional  e.g. '6 min read'
 *   image       optional  path under assets/ (a gold-initial tile is used if omitted)
 *   author      optional  shows the "Written by" box
 *   authorRole  optional
 *   tags        optional  ['Tag', …]; the first tag labels the card
 *   related     optional  [{ s: 'section-id', c: 'category-id', id: 'item-id', title: 'Shown text' }]
 *                         or  [{ href: 'books.html', title: 'Shown text' }]
 *   featured    optional  true to mark as a lead story
 */
PVS.register('_templates/article', [
  {
    id: 'sample-article',
    title: 'Sample Article Title',
    subtitle: 'An optional subtitle that appears in the page banner',
    excerpt: 'This is a sample article used to preview the article layout. Replace it with real content in the category file.',
    date: '2026-09-01',
    readTime: '5 min read',
    image: 'assets/blogs/growth-mindset.jpg',
    author: 'PVS Ravindra Varma',
    authorRole: 'HR Strategist & Executive Coach',
    tags: ['Sample', 'Template'],
    body: `
      <p>Opening paragraph. Body copy is plain HTML so headings, lists and quotes can be used freely.</p>
      <h3>A Section Heading</h3>
      <p>Supporting paragraph with the main argument.</p>
      <ul><li>First key point</li><li>Second key point</li><li>Third key point</li></ul>
      <blockquote>A pull quote to highlight a key idea.</blockquote>
      <h4>A Smaller Sub-heading</h4>
      <p>Closing paragraph.</p>`,
    related: [{ href: 'books.html', title: 'Explore the books' }]
  },
  {
    id: 'sample-article-2',
    title: 'Second Sample Article',
    excerpt: 'A second sample so listing, sorting and previous/next navigation can be previewed.',
    date: '2026-08-15',
    readTime: '3 min read',
    tags: ['Sample'],
    body: '<p>Short sample body.</p>'
  }
]);
