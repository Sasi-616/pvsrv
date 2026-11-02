/* TEMPLATE — EVENT / COMMUNITY UPDATE
 * Used by: Community (Rotary Updates, Community Activities, Events & Announcements).
 * Same fields as the article template, plus:
 *   eventDate    optional  'YYYY-MM-DD' — shown in the Event Details box
 *   time         optional  e.g. '6:00 PM IST'
 *   venue        optional
 *   registerUrl  optional  external registration link
 */
PVS.register('_templates/event', [
  {
    id: 'sample-event',
    title: 'Sample Community Event',
    excerpt: 'A sample event used to preview the event layout.',
    date: '2026-09-01',
    eventDate: '2026-10-15',
    time: '6:00 PM IST',
    venue: 'Hyderabad',
    image: 'assets/videos/video-leadership-lessons.jpg',
    tags: ['Rotary'],
    body: '<p>Event description, agenda and who should attend.</p>'
  }
]);
