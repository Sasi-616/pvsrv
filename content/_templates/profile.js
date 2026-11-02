/* TEMPLATE — WHO'S WHO PROFILE
 * Used by: Who's Who (Business, Sports, HR and Pharma Leaders).
 *
 * Fields
 *   id            required  slug of the person's name
 *   title         required  the person's full name
 *   role          required  e.g. 'Chief Executive Officer'
 *   organisation  required
 *   excerpt       required  one-line summary for cards and search
 *   photo         required  portrait path (a gold initial is shown if missing)
 *   body          required  HTML biography
 *   achievements  required  ['Achievement', …]
 *   references    optional  articles & references: [{ title, source, year, url }]
 *   related       optional  related site content: [{ s, c, id, title }] or [{ href, title }]
 *   facts         optional  up to 4 quick facts: [{ value: '25+', label: 'Years in Industry' }]
 *   quote         optional
 *   tags          optional  searchable keywords (industry, city, expertise)
 *   date          optional  'YYYY-MM' profile added/updated
 */
PVS.register('_templates/profile', [
  {
    id: 'sample-leader',
    title: 'Sample Leader Name',
    role: 'Chief Executive Officer',
    organisation: 'Sample Organisation Ltd.',
    excerpt: 'A sample profile used to preview the Who\'s Who layout.',
    photo: 'assets/placeholders/profile.svg',
    date: '2026-09',
    quote: 'A short signature quote from the leader.',
    facts: [
      { value: '25+', label: 'Years in Industry' },
      { value: '3', label: 'Companies Led' }
    ],
    body: `
      <p class="about-body-p">Opening biography paragraph: background, education and early career.</p>
      <p class="about-body-p">Career highlights and leadership philosophy.</p>`,
    achievements: ['First notable achievement', 'Second notable achievement', 'Award or recognition'],
    references: [
      { title: 'Interview title', source: 'Publication name', year: '2025', url: 'https://example.com' },
      { title: 'Article title', source: 'Journal or website', year: '2024' }
    ],
    related: [{ s: 'blogs', c: 'corporate-counselling', id: 'growth-mindset', title: 'Cultivating a Growth Mindset in Legacy Organizations' }],
    tags: ['Hyderabad', 'Manufacturing']
  }
]);
