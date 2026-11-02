/* TEMPLATE — STORY
 * Used by: Stories (Children, Women, Corporate, Teen).
 * Same fields as the article template, plus:
 *   ageGroup    optional  e.g. 'Ages 6–9' (shown in card and banner meta)
 *   moral       optional  appended to the body as a highlighted quote if you include it in `body`
 */
PVS.register('_templates/story', [
  {
    id: 'sample-story',
    title: 'The Sample Story',
    excerpt: 'A sample story used to preview the story layout.',
    date: '2026-09-01',
    readTime: '4 min read',
    ageGroup: 'Ages 8–12',
    author: 'PVS Ravindra Varma',
    tags: ['Values'],
    body: `
      <p>Once upon a time… Story text goes here, paragraph by paragraph.</p>
      <p>The middle of the story.</p>
      <p>The ending.</p>
      <blockquote>Moral: the lesson of the story.</blockquote>`
  }
]);
