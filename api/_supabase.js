const { createClient } = require('@supabase/supabase-js');

// Support standard Vercel environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    console.log('[Vercel Serverless] Initialized Supabase client for URL:', SUPABASE_URL);
  } catch (err) {
    console.error('[Vercel Serverless] Supabase initialization error:', err.message);
  }
}

// Built-in seed fallback data
const SEED_BOOKS = [
  {
    id: 'book-pbp',
    slug: 'people-before-process',
    title: 'People Before Process',
    subtitle: 'Transforming Modern HR Architecture from Compliance to Human Empowerment',
    author: 'PVS Ravindra Varma',
    category: 'HR Strategy',
    pages: '248 Pages',
    cover: '/assets/books/people-before-process.png',
    synopsis: 'The foundational manual on dismantling toxic corporate bureaucracy, instituting radical trust, and putting human empathy at the center of organizational scaling.',
    points: [
      'Transitioning from attendance to outcomes',
      'Continuous feedback vs. annual reviews',
      'Sustainable retention in fast-growth environments'
    ],
    status: 'published'
  },
  {
    id: 'book-lh',
    slug: 'leadership-habit',
    title: 'The Leadership Habit',
    subtitle: 'Small Shifts. Big Change.',
    author: 'PVS Ravindra Varma',
    category: 'Executive Leadership',
    pages: '212 Pages',
    cover: '/assets/books/leadership-habit.png',
    synopsis: 'A pragmatic behavioral playbook exploring micro-actions, cognitive poise under pressure, and systemic alignment.',
    points: [
      'Cognitive poise under intense boardroom pressure',
      'Micro-habits that transform team culture',
      'Decisive action during organizational crisis'
    ],
    status: 'published'
  },
  {
    id: 'book-ctl',
    slug: 'culture-that-lasts',
    title: 'Culture That Lasts',
    subtitle: 'Building Resilient, Purposeful Workplace Cultures',
    author: 'PVS Ravindra Varma',
    category: 'Organizational Culture',
    pages: '236 Pages',
    cover: '/assets/books/culture-that-lasts.png',
    synopsis: 'How high-performing organizations safeguard their core values and purpose across rapid generational and technological shifts.',
    points: [
      'Preserving organizational DNA during expansion',
      'Fostering psychological safety and honest dialogue',
      'Aligning multi-generational workforces'
    ],
    status: 'published'
  },
  {
    id: 'book-ha',
    slug: 'human-advantage',
    title: 'The Human Advantage',
    subtitle: 'Leadership in the Age of Intelligent Automation',
    author: 'PVS Ravindra Varma',
    category: 'Future of Work',
    pages: '198 Pages',
    cover: '/assets/books/human-advantage.png',
    synopsis: 'Why emotional intelligence, empathy, and moral judgement are irreplaceable leadership assets in an AI-driven economy.',
    points: [
      'Human empathy as the ultimate differentiator',
      'Guiding teams through technological disruption',
      'Ethical governance in data-driven workplaces'
    ],
    status: 'published'
  }
];

const SEED_ARTICLES = [
  {
    id: 'art-gm-001',
    slug: 'growth-mindset-legacy-orgs',
    title: 'Cultivating a Growth Mindset in Legacy Organizations: Breaking Complacency',
    category: 'Corporate Counselling',
    author: 'PVS Ravindra Varma',
    read_time: '6 Min Read',
    image: '/assets/blogs/growth-mindset.jpg',
    summary: 'Established enterprises frequently fall into the trap of process calcification. When previous successes become gospel, intellectual curiosity suffocates.',
    body: '<p>Established enterprises frequently fall into the trap of process calcification. When previous successes become gospel, intellectual curiosity suffocates.</p>',
    views: 450,
    status: 'published',
    published_at: '2026-08-15'
  }
];

module.exports = {
  supabase,
  isConfigured: !!supabase,
  seedBooks: SEED_BOOKS,
  seedArticles: SEED_ARTICLES
};

