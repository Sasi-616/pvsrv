-- ============================================================================
-- MR. PVS RAVINDRA VARMA PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Official Cloudflare Pages + Supabase Integration
-- ============================================================================

-- 1. CLEANUP & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BOOKS & PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY DEFAULT ('book-' || floor(extract(epoch from now()))::text),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT DEFAULT 'PVS Ravindra Varma',
  category TEXT DEFAULT 'HR Strategy',
  pages TEXT DEFAULT '240 Pages',
  cover TEXT DEFAULT 'assets/books/people-before-process.png',
  pdf_url TEXT,
  synopsis TEXT,
  chapters TEXT,
  points JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'upcoming')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ARTICLES & BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY DEFAULT ('art-' || floor(extract(epoch from now()))::text),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Corporate Counselling',
  author TEXT DEFAULT 'PVS Ravindra Varma',
  tags TEXT,
  date TEXT,
  summary TEXT,
  body TEXT,
  cover_img TEXT DEFAULT 'assets/blogs/growth-mindset.jpg',
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  views INT DEFAULT 0,
  read_time TEXT DEFAULT '5 min read',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ADVISORY INQUIRIES & LEAD CRM TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq-' || floor(extract(epoch from now()))::text),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  topic TEXT DEFAULT 'Executive Consultation',
  message TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'in_review', 'responded', 'archived')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. KNOWLEDGE QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id TEXT PRIMARY KEY DEFAULT ('qz-' || floor(extract(epoch from now()))::text),
  title TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_idx SMALLINT DEFAULT 0,
  category TEXT DEFAULT 'corporate',
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content & settings
CREATE POLICY "Public Read Books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public Read Quiz" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Allow public insert on inquiries (from Contact Page)
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Allow full management for CMS Admin operations (Anon & Authenticated)
CREATE POLICY "Admin All Books" ON public.books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Quiz" ON public.quiz_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED INITIAL DATA
-- ============================================================================

INSERT INTO public.books (id, slug, title, subtitle, author, category, pages, cover, synopsis, chapters, points, status) VALUES
(
  'book-pbp',
  'people-before-process',
  'People Before Process',
  'Transforming Modern HR Architecture from Compliance to Human Empowerment',
  'PVS Ravindra Varma',
  'HR Strategy',
  '248 Pages',
  'assets/books/people-before-process.png',
  'The foundational manual on dismantling toxic corporate bureaucracy, instituting radical trust, and putting human empathy at the center of organizational scaling.',
  E'1. The Evolution of Workplace Psychology\n2. Transitioning from Attendance to Outcomes\n3. Continuous Feedback vs. Annual Appraisals\n4. Retention in Hyper-Growth Environments',
  '["Transitioning from attendance to outcomes", "Continuous feedback vs. annual reviews", "Sustainable retention in fast-growth environments"]'::jsonb,
  'published'
),
(
  'book-lh',
  'leadership-habit',
  'The Leadership Habit',
  'Small Shifts. Big Change.',
  'PVS Ravindra Varma',
  'Executive Leadership',
  '212 Pages',
  'assets/books/leadership-habit.png',
  'A pragmatic behavioral playbook exploring micro-actions, cognitive poise under pressure, and systemic alignment.',
  E'1. Micro-Habits of Exceptional Executives\n2. Emotionally Intelligent Communication\n3. Navigating Executive Dilemmas',
  '["Cognitive poise under intense boardroom pressure", "Micro-habits that transform team culture", "Decisive action during organizational crisis"]'::jsonb,
  'published'
),
(
  'book-ctl',
  'culture-that-lasts',
  'Culture That Lasts',
  'Building Resilient, Purposeful Workplace Cultures',
  'PVS Ravindra Varma',
  'Organizational Culture',
  '236 Pages',
  'assets/books/culture-that-lasts.png',
  'How high-performing organizations safeguard their core values and purpose across rapid generational and technological shifts.',
  E'1. Foundational Values vs. Tactical Goals\n2. Building High-Trust Team Systems\n3. Culture Across Distributed Remote Teams',
  '["Preserving organizational DNA during expansion", "Fostering psychological safety and honest dialogue", "Aligning multi-generational workforces"]'::jsonb,
  'published'
),
(
  'book-ha',
  'human-advantage',
  'The Human Advantage',
  'Leadership in the Age of Intelligent Automation',
  'PVS Ravindra Varma',
  'Future of Work',
  '198 Pages',
  'assets/books/human-advantage.png',
  'Why emotional intelligence, empathy, and moral judgement are irreplaceable leadership assets in an AI-driven economy.',
  E'1. AI as an Amplifier of Human Purpose\n2. Critical Thinking & Ethical Governance\n3. Retaining the Human Core in Tech Organizations',
  '["Human empathy as the ultimate differentiator", "Guiding teams through technological disruption", "Ethical governance in data-driven workplaces"]'::jsonb,
  'published'
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, synopsis = EXCLUDED.synopsis;

INSERT INTO public.articles (id, slug, title, category, author, read_time, cover_img, summary, body, tags, status, views) VALUES
(
  'art-gm-001',
  'growth-mindset-legacy-orgs',
  'Cultivating a Growth Mindset in Legacy Organizations: Breaking the Habit of Complacency',
  'Corporate Counselling',
  'PVS Ravindra Varma',
  '6 min read',
  'assets/blogs/growth-mindset.jpg',
  'Established enterprises frequently fall into the trap of process calcification. When previous successes become gospel, intellectual curiosity suffocates. Learn how leaders can unfreeze institutional inertia.',
  '<p>Established enterprises frequently fall into the trap of process calcification. When previous successes become gospel, intellectual curiosity suffocates. In this strategic essay, we explore how executive leadership can unfreeze institutional inertia, normalize constructive vulnerability, and institute iterative learning rituals.</p><h3>The Psychological Safe Harbor</h3><p>Innovation cannot germinate where failure is penalised with quiet demotion. Leaders must consciously create psychological safe harbors where unconventional hypotheses can be tested rapidly without fear of existential reprisal.</p>',
  'growth mindset, legacy organizations, corporate culture, leadership',
  'published',
  450
),
(
  'art-el-002',
  'empathy-as-strategic-asset',
  'Empathy is Not Weakness: The Hard ROI of Compassionate Executive Leadership',
  'Executive Guidance',
  'PVS Ravindra Varma',
  '5 min read',
  'assets/blogs/high-performing-teams.jpg',
  'Far from being a soft luxury, deep active empathy is the single most predictive metric for executive talent retention and cross-functional project velocity.',
  '<p>Far from being a soft luxury, deep active empathy is the single most predictive metric for executive talent retention and cross-functional project velocity in high-uncertainty environments.</p>',
  'empathy, ROI, executive leadership, retention',
  'published',
  380
),
(
  'art-fw-003',
  'human-skills-ai-era',
  'The Irreplaceable Human Core: 5 Competencies Machines Cannot Automate',
  'Future of Work',
  'PVS Ravindra Varma',
  '7 min read',
  'assets/blogs/leadership-changing-world.jpg',
  'As cognitive automation permeates every workflow, the currency of human talent shifts decisively toward synthesis, contextual ethics, and nuanced relational chemistry.',
  '<p>As cognitive automation permeates every workflow, the currency of human talent shifts decisively toward synthesis, contextual ethics, and nuanced relational chemistry.</p>',
  'AI, future of work, automation, human skills',
  'published',
  610
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;

INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('announcement_active', '1'),
('announcement_text', 'Upcoming Release: ''The Leadership Habit'' by PVS Ravindra Varma — Pre-orders open now.'),
('announcement_link', 'pages/books.html'),
('site_title', 'PVS Ravindra Varma | Official Platform'),
('contact_email', 'contact@ravindravarma.com')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

