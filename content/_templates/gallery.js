/* TEMPLATE — GALLERY VISUAL
 * Used by: Photos & Visuals (Leadership Quotes, Marketing Visuals, Social Media
 * Creatives, Inspirational Content, Copywriting Samples).
 *
 * Fields
 *   id        required
 *   title     required
 *   image     required  image path (any aspect ratio — the grid is masonry)
 *   alt       required  describe the image for screen readers
 *   caption   optional  shown in the page banner
 *   date      optional  'YYYY-MM'
 *   format    optional  e.g. 'Instagram post 1080×1080'
 *   client    optional
 *   credit    optional
 *   body      optional  HTML — use for copywriting samples or the story behind a visual
 *   tags      optional
 */
PVS.register('_templates/gallery', [
  {
    id: 'sample-visual-1',
    title: 'Sample Quote Card',
    image: 'assets/banner-mountain.jpg',
    alt: 'Mountain landscape used as a sample visual',
    caption: 'A sample visual used to preview the gallery layout.',
    date: '2026-09',
    format: 'Social post',
    body: '<p>Optional notes, copy or context for the visual.</p>'
  },
  {
    id: 'sample-visual-2',
    title: 'Sample Campaign Visual',
    image: 'assets/blogs/high-performing-teams.jpg',
    alt: 'Sample campaign artwork',
    date: '2026-08'
  },
  {
    id: 'sample-visual-3',
    title: 'Sample Creative',
    image: 'assets/videos/video-people-first.jpg',
    alt: 'Sample creative artwork',
    date: '2026-07'
  }
]);
