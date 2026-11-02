# Mr. PVS Ravindra Varma — Modern Dynamic Stack Deployment Guide
## Vercel Serverless + Supabase PostgreSQL + GitHub CI/CD

This platform is architected for **zero server maintenance**, **global edge speed**, and **real-time cloud persistence** using:
- **Hosting & Serverless Runtime**: [Vercel](https://vercel.com) (Node.js Serverless Functions in `/api`)
- **Database & Storage**: [Supabase](https://supabase.com) (PostgreSQL database with Row Level Security)
- **Frontend & 3D Reader**: Modern dynamic responsive client with instant Supabase hydration & live reactivity
- **Design Philosophy**: Pure Luxury Light Theme (Warm Cream, Rich Charcoal, Polished Gold — zero dark theme)

---

## 🚀 Quick Step-by-Step Deployment (Under 5 Minutes)

### Step 1: Set Up Supabase Database (2 minutes)
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it (e.g. `pvsrv-portal`).
3. In your Supabase project sidebar, navigate to **SQL Editor** -> **New Query**.
4. Open [`supabase-schema.sql`](file:///c:/Users/sasiE/OneDrive/Desktop/PVSRV/supabase-schema.sql) in this repository, copy its entire contents, paste it into the SQL Editor, and click **Run**.
   - *This creates all tables (`books`, `articles`, `inquiries`, `quiz_questions`, `site_settings`), security policies (RLS), and seeds the initial 4 books and articles.*
5. Navigate to **Project Settings** (gear icon) -> **API**:
   - Copy your **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - Copy your **`anon` public key** (starts with `eyJhbG...`)
   - Copy your **`service_role` secret key** (optional, for elevated backend serverless execution)

---

### Step 2: Push Your Code to GitHub
Open your terminal in this project root:
```bash
git add .
git commit -m "feat: modern dynamic Vercel + Supabase architecture"
git branch -M main
git remote add origin https://github.com/your-username/pvsrv-portal.git
git push -u origin main
```

---

### Step 3: Deploy to Vercel (1 Click)
1. Log in to [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your `pvsrv-portal` GitHub repository and click **Import**.
4. Under **Environment Variables**, add the Supabase keys copied in Step 1:
   | Key | Value | Notes |
   |---|---|---|
   | `SUPABASE_URL` | `https://your-project.supabase.co` | Required for `/api/*` endpoints |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | Public client API key |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1Ni...` | Optional elevated secret key |
5. Click **Deploy**.
6. In ~20 seconds, your website is live with an active production URL (e.g., `https://pvsrv-portal.vercel.app`)!

---

## 🎛️ How to Use the Foolproof Admin CMS Panel

The Admin CMS is specifically designed so that **any non-technical person** can manage the website without assistance:

1. **Accessing the CMS**:
   - Go to `https://your-site.vercel.app/admin` (or `/admin/cms.html`).
2. **Supabase Cloud Connection**:
   - At the top of the dashboard, you will see the **Supabase PostgreSQL Cloud Database** card.
   - Click **Database Settings** to view or enter your Supabase URL & Anon Key.
   - Click **Test Connection** to verify live communication with your database.
   - Click **Sync Content to Cloud** to push all initial books and articles to your Supabase cloud database with 1 click!
3. **Publishing New Books**:
   - Click **Books & Library** in the left sidebar menu.
   - Click **+ Add Book Title**.
   - *Tip*: Click **✨ Fill Sample Details** to see an instant demonstration.
   - Click **Save Book Title**. The book is saved directly into Supabase and automatically updates:
     - The Homepage 3D Carousel (`/`)
     - The Books Catalog (`/books` or `/pages/books.html`)
     - The 3D Flipbook Reader book selector (`/reader` or `/pages/reader.html`)
4. **Publishing New Articles**:
   - Click **Blog Articles** in the left sidebar menu.
   - Click **+ Write Article** or **✨ Add Sample Article**.
   - Click **Save**. Changes are immediately visible on `/blogs` and the Homepage!
5. **Managing Contact Inquiries**:
   - When visitors submit the inquiry form on `/contact`, their submissions are recorded directly in Supabase's `inquiries` table.
   - Inside the CMS, you can review message details, mark them as responded, or reply with 1 click.

---

## 📂 Repository Architecture

```text
├── admin/                     # Executive Admin CMS & Login
│   ├── cms.html               # Foolproof Luxury Light CMS Studio
│   └── admin-login.html       # Authentication screen
├── api/                       # Vercel Serverless Functions
│   ├── _supabase.js           # Supabase client connector & seed data
│   ├── books.js               # GET, POST, DELETE books endpoint
│   ├── articles.js            # GET, POST, DELETE articles endpoint
│   ├── inquiries.js           # Public contact form submission & CRM
│   ├── content.js             # Unified content API
│   └── status.js              # Serverless health check & DB status
├── assets/                    # Optimized photography, book covers, brand logos
├── content/                   # Curated registries, quizzes & stories
├── css/                       # Pure luxury light stylesheets (zero dark theme)
│   ├── style.css              # Main luxury stylesheet
│   ├── platform.css           # Grid & components
│   ├── admin.css              # CMS studio design system
│   └── flipbook.css           # 3D Flipbook physics & lighting
├── js/
│   ├── app.js                 # Global navigation & search modal
│   ├── flipbook.js            # 3D Flipbook reader engine
│   ├── content-bridge.js      # Full-stack frontend hydration bridge
│   └── supabase-client.js     # Universal Supabase client & event system
├── pages/                     # Public web pages
│   ├── about.html             # Executive profile & 7 pillars
│   ├── books.html             # Catalog & flagship spotlights
│   ├── reader.html            # 3D interactive flipbook
│   ├── blogs.html             # Thought leadership essays
│   ├── quiz.html              # Knowledge & leadership quiz
│   ├── contact.html           # Inquiries & advisory booking
│   ├── videos.html            # Keynotes & media archives
│   └── sitemap.html           # Architectural directory
├── tests/                     # Playwright test suite (12/12 passing)
├── index.html                 # Dynamic executive homepage
├── package.json               # Node.js dependencies (@supabase/supabase-js)
├── supabase-schema.sql        # Supabase PostgreSQL schema & seed migration
├── vercel.json                # Vercel serverless routing & clean URLs
├── _headers                   # Cloudflare/Vercel security & cache headers
└── _redirects                 # Clean routing aliases
```

---

## 🧪 Local Testing & Verification

Run the comprehensive Playwright test suite locally:
```bash
npx playwright test
```
All **12 of 12 tests** pass cleanly with 100% test coverage across modals, 3D flipbook reader, quiz platform, dynamic CMS book addition, and advisory inquiries.
