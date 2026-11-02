/**
 * PVS RAVINDRA VARMA - CONTENT REGISTRY
 * Single source of truth for the site's information architecture.
 *
 * Drives: header mega-menu, footer links, section hubs, category pages,
 * breadcrumbs, the HTML sitemap and site search.
 *
 * To add a category: add an entry to a section's `categories` array, then put
 * its items in content/<section-id>/<category-id>.js (see content/_templates/).
 * Nothing else needs to change - the menu, hub, sitemap and URLs update themselves.
 *
 * Content types (section `type`, overridable per category):
 *   article | story | book | gallery | quiz | bank | profile | event
 */
window.PVS_REGISTRY = {
  sections: [
    {
      id: 'blogs',
      title: 'Blogs',
      label: 'COUNSELLING & PERSPECTIVES',
      heading: 'Guidance for Every Stage of Life & Work',
      lead: 'Counselling insights for parents, students, teens, professionals and organizations — plus perspectives, practical tip series and a little light reading.',
      hub: 'blogs.html',
      type: 'article',
      noun: ['Article', 'Articles'],
      categories: [
        { id: 'parenting', title: 'Parenting', desc: 'Raising confident, resilient children — communication, discipline, and growing together as a family.' },
        { id: 'career-counselling', title: 'Career Counselling', desc: 'Choosing streams, courses and careers with clarity; guidance for students and early professionals.' },
        { id: 'teen-counselling', title: 'Teen Counselling', desc: 'Adolescence, peer pressure, exams, identity and emotional well-being for teens and their parents.' },
        { id: 'corporate-counselling', title: 'Corporate Counselling', desc: 'Leadership, culture and change — counsel for executives, founders and management teams.' },
        { id: 'hr-counselling', title: 'HR Counselling', desc: 'Talent, retention, performance and people practice for HR professionals and people managers.' },
        { id: 'third-cheer-perspective', title: 'Third Cheer Perspective', desc: 'Reflective essays offering a distinctive third perspective on life, work and society.' },
        { id: 'eight-tips-series', title: 'Eight Tips Series', desc: 'Practical advice distilled into eight actionable tips on a single topic.' },
        { id: 'jokes-light-reading', title: 'Jokes & Light Reading', desc: 'Humour, anecdotes and easy reads to lighten the day.' }
      ]
    },
    {
      id: 'stories',
      title: 'Stories',
      label: 'STORYTELLING',
      heading: 'Stories That Teach, Heal & Inspire',
      lead: 'Narratives for children, women, teens and professionals — values, courage and wisdom told through story.',
      type: 'story',
      noun: ['Story', 'Stories'],
      categories: [
        { id: 'children', title: 'Children Stories', desc: 'Moral tales and gentle adventures for young readers and bedtime.' },
        { id: 'women', title: 'Women Stories', desc: 'Stories of strength, resilience and achievement by and about women.' },
        { id: 'corporate', title: 'Corporate Stories', desc: 'Workplace parables and leadership lessons from the boardroom to the shop floor.' },
        { id: 'teen', title: 'Teen Stories', desc: 'Coming-of-age stories about friendship, choices and finding your way.' }
      ]
    },
    {
      id: 'publications',
      title: 'Reviews & Publications',
      label: 'REVIEWS & PUBLICATIONS',
      heading: 'Reviews, Research & Thought Leadership',
      lead: 'Book reviews, research articles, opinion pieces and long-form thought leadership.',
      type: 'article',
      noun: ['Publication', 'Publications'],
      categories: [
        { id: 'book-reviews', title: 'Book Reviews', desc: 'Considered reviews of books on leadership, management, psychology and literature.' },
        { id: 'research-articles', title: 'Research Articles', desc: 'Research-backed papers and studies on HR, organizations and human behaviour.' },
        { id: 'opinion-pieces', title: 'Opinion Pieces', desc: 'Commentary on current issues in business, education and society.' },
        { id: 'thought-leadership', title: 'Thought Leadership', desc: 'Long-form essays and frameworks on the future of work and leadership.' }
      ]
    },
    {
      id: 'books',
      title: 'Books',
      label: 'THE LIBRARY',
      heading: 'Books by Mr. PVS Ravindra Varma',
      lead: 'Published titles, upcoming releases, book series and works in progress.',
      hub: 'books.html',
      type: 'book',
      noun: ['Book', 'Books'],
      categories: [
        { id: 'published', title: 'Published Books', desc: 'Titles available now in print and digital editions.' },
        { id: 'upcoming', title: 'Upcoming Books', desc: 'Forthcoming titles and release announcements.' },
        { id: 'series', title: 'Book Series', desc: 'Multi-volume collections and themed series.' },
        { id: 'drafts', title: 'Draft Books', desc: 'Manuscripts in progress — early previews and working chapters.' }
      ]
    },
    {
      id: 'quiz',
      title: 'Quiz',
      label: 'QUIZ PLATFORM',
      heading: 'Test Your Knowledge',
      lead: 'Themed quizzes across film, sports, science, mythology, literature and current affairs — backed by a growing question bank.',
      type: 'quiz',
      noun: ['Quiz', 'Quizzes'],
      categories: [
        { id: 'question-bank', title: 'Question Bank', desc: 'Practise from the master bank of questions across every category.', type: 'bank' },
        { id: 'bumper', title: 'Bumper Quiz', desc: 'Mixed-category mega rounds drawn from the full question bank.' },
        { id: 'film', title: 'Film Quiz', desc: 'Cinema from Tollywood to Hollywood — stars, songs, directors and classics.' },
        { id: 'children', title: 'Children Quiz', desc: 'Fun, age-appropriate general knowledge for young learners.' },
        { id: 'corporate', title: 'Corporate Quiz', desc: 'Business, management and HR concepts for professionals and teams.' },
        { id: 'sports', title: 'Sports Quiz', desc: 'Cricket, Olympics, football and sporting legends.' },
        { id: 'science', title: 'Science Quiz', desc: 'Physics, chemistry, biology, space and technology.' },
        { id: 'current-affairs', title: 'Current Affairs Quiz', desc: 'A new edition every month on national and world events.', monthly: true },
        { id: 'global', title: 'Global Quiz', desc: 'World geography, capitals, cultures and international affairs.' },
        { id: 'telugu-literature', title: 'Telugu Literature Quiz', desc: 'Poets, classics and milestones of Telugu literature.' },
        { id: 'hindu-mythology', title: 'Hindu Mythology Quiz', desc: 'The Ramayana, Mahabharata, Puranas and their characters.' }
      ]
    },
    {
      id: 'knowledge',
      title: 'Knowledge & Development',
      label: 'KNOWLEDGE & PROFESSIONAL DEVELOPMENT',
      heading: 'Learn, Grow & Lead',
      lead: 'Guides, frameworks and resources for HR practitioners, job seekers and professionals building their careers.',
      type: 'article',
      noun: ['Resource', 'Resources'],
      categories: [
        { id: 'hr-analytics', title: 'HR Analytics', desc: 'People data, metrics and dashboards for evidence-based HR decisions.' },
        { id: 'interview-skills', title: 'Interview Skills', desc: 'Preparing for, performing in and conducting great interviews.' },
        { id: 'corporate-training', title: 'Corporate Training', desc: 'Training programmes, workshop outlines and facilitation guides.' },
        { id: 'learning-resources', title: 'Learning Resources', desc: 'Reading lists, templates, checklists and toolkits.' },
        { id: 'professional-development', title: 'Professional Development', desc: 'Skills, habits and career growth for working professionals.' }
      ]
    },
    {
      id: 'gallery',
      title: 'Photos & Visuals',
      label: 'MEDIA GALLERY',
      heading: 'Quotes, Creatives & Visual Stories',
      lead: 'Leadership quotes, marketing visuals, social media creatives, inspirational content and copywriting samples.',
      type: 'gallery',
      noun: ['Visual', 'Visuals'],
      categories: [
        { id: 'leadership-quotes', title: 'Leadership Quotes', desc: 'Quote cards on leadership, people and purpose.' },
        { id: 'marketing-visuals', title: 'Marketing Visuals', desc: 'Campaign visuals, posters and brand artwork.' },
        { id: 'social-media-creatives', title: 'Social Media Creatives', desc: 'Post and story creatives for social platforms.' },
        { id: 'inspirational-content', title: 'Inspirational Content', desc: 'Motivational visuals and thoughts for the day.' },
        { id: 'copywriting-samples', title: 'Copywriting Samples', desc: 'Taglines, ad copy and brand writing samples.' }
      ],
      extraLinks: [{ label: 'Videos & Keynotes', href: 'videos.html' }]
    },
    {
      id: 'community',
      title: 'Community',
      label: 'SOCIAL & COMMUNITY',
      heading: 'Service, Community & Events',
      lead: 'Rotary updates, community initiatives and upcoming events and announcements.',
      type: 'event',
      noun: ['Update', 'Updates'],
      categories: [
        { id: 'rotary-updates', title: 'Rotary Updates', desc: 'News and service projects from Rotary International District 3150.' },
        { id: 'community-activities', title: 'Community Activities', desc: 'Social initiatives, youth programmes and volunteer drives.' },
        { id: 'events-announcements', title: 'Events & Announcements', desc: 'Upcoming talks, workshops, launches and announcements.' }
      ]
    },
    {
      id: 'whoswho',
      title: "Who's Who",
      label: "WHO'S WHO DIRECTORY",
      heading: 'Leaders Who Shape Industries',
      lead: 'Profiles of business, sports, HR and pharma leaders — biographies, achievements, articles and references.',
      type: 'profile',
      noun: ['Profile', 'Profiles'],
      sort: 'az',
      categories: [
        { id: 'business-leaders', title: 'Business Leaders', desc: 'Founders, CEOs and entrepreneurs.' },
        { id: 'sports-leaders', title: 'Sports Leaders', desc: 'Athletes, coaches and sports administrators.' },
        { id: 'hr-leaders', title: 'HR Leaders', desc: 'CHROs, people leaders and HR thinkers.' },
        { id: 'pharma-leaders', title: 'Pharma Leaders', desc: 'Leaders in pharmaceuticals, life sciences and healthcare.' }
      ]
    }
  ],

  /* Header navigation. Items with `groups` open a mega-menu built from those sections.
     `href` on a group item is the no-JavaScript fallback link.
     `mobileOnly` items appear only in the phone menu — Contact is covered on larger
     screens by the "Let's Connect" button, which is hidden on phones. */
  nav: [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Read', href: 'blogs.html', groups: ['blogs', 'stories', 'publications'] },
    { label: 'Books', href: 'books.html', groups: ['books'] },
    { label: 'Quiz', href: 'hub.html?s=quiz', groups: ['quiz'] },
    { label: 'Explore', href: 'sitemap.html', groups: ['knowledge', 'gallery', 'community', 'whoswho'] },
    { label: 'Contact', href: 'contact.html', mobileOnly: true }
  ],

  /* Pages that live outside the section model. Used by the footer and sitemap. */
  corePages: [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Books', href: 'books.html' },
    { label: 'Blogs', href: 'blogs.html' },
    { label: 'Videos', href: 'videos.html' },
    { label: 'Contact', href: 'contact.html' },
    { label: 'Sitemap', href: 'sitemap.html' }
  ]
};
