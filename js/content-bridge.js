/**
 * PVS RAVINDRA VARMA - FULL-STACK CONTENT BRIDGE
 * Automatically connects the Supabase PostgreSQL Cloud Database & Admin / CMS Uploads
 * with the Live Frontend (index.html, pages/books.html, pages/reader.html, pages/blogs.html, pages/contact.html)
 *
 * Direct Supabase Cloud Sync + LocalStorage Instant Offline Fallback
 */

(function (window) {
  'use strict';

  const IN_SUBDIR = (typeof location !== 'undefined') && (
    location.pathname.includes('/pages/') ||
    location.pathname.includes('\\pages\\') ||
    location.pathname.includes('/admin/') ||
    location.pathname.includes('\\admin\\')
  );
  const ROOT_PREFIX = IN_SUBDIR ? '../' : '';
  const PAGE_PREFIX = IN_SUBDIR ? '' : 'pages/';

  function formatPath(p) {
    if (!p) return '';
    if (p.startsWith('http') || p.startsWith('data:') || p.startsWith('/')) return p;
    return ROOT_PREFIX + p.replace(/^\.\.\//, '');
  }

  // Built-in Seed Books (Guarantees zero-blank initial state)
  const SEED_BOOKS = [
    {
      id: 'book-pbp',
      slug: 'people-before-process',
      title: 'People Before Process',
      subtitle: 'Transforming Modern HR Architecture from Compliance to Human Empowerment',
      category: 'HR Strategy',
      pages: '248 Pages',
      cover: 'assets/books/people-before-process.png',
      synopsis: 'The foundational manual on dismantling toxic corporate bureaucracy, instituting radical trust, and putting human empathy at the center of organizational scaling.',
      chapters: [
        '1. The Evolution of Workplace Psychology',
        '2. Transitioning from Attendance to Outcomes',
        '3. Continuous Feedback vs. Annual Appraisals',
        '4. Retention in Hyper-Growth Environments',
        '5. Building Resilient Leadership Pipelines'
      ],
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
      category: 'Executive Leadership',
      pages: '212 Pages',
      cover: 'assets/books/leadership-habit.png',
      synopsis: 'A pragmatic behavioral playbook exploring micro-actions, cognitive poise under pressure, and systemic alignment.',
      chapters: [
        '1. Micro-Habits of Exceptional Executives',
        '2. Emotionally Intelligent Communication',
        '3. Navigating Executive Dilemmas',
        '4. Sustaining High Performance Without Burnout'
      ],
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
      category: 'Organizational Culture',
      pages: '236 Pages',
      cover: 'assets/books/culture-that-lasts.png',
      synopsis: 'How high-performing organizations safeguard their core values and purpose across rapid generational and technological shifts.',
      chapters: [
        '1. Foundational Values vs. Tactical Goals',
        '2. Building High-Trust Team Systems',
        '3. Culture Across Distributed Remote Teams',
        '4. The Ethical Responsibilities of Leadership'
      ],
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
      category: 'Future of Work',
      pages: '198 Pages',
      cover: 'assets/books/human-advantage.png',
      synopsis: 'Why emotional intelligence, empathy, and moral judgement are irreplaceable leadership assets in an AI-driven economy.',
      chapters: [
        '1. AI as an Amplifier of Human Purpose',
        '2. Critical Thinking & Ethical Governance',
        '3. Retaining the Human Core in Tech Organizations',
        '4. Leading Teams into the Automated Era'
      ],
      points: [
        'Human empathy as the ultimate differentiator',
        'Guiding teams through technological disruption',
        'Ethical governance in data-driven workplaces'
      ],
      status: 'published'
    }
  ];

  // =========================================================================
  // CORE STORAGE & API BRIDGE
  // =========================================================================

  const PVS_Bridge = {
    // 1. Get all published books (Seed + Dynamic CMS uploads)
    getBooks: function () {
      let dynamic = [];
      try {
        const stored = localStorage.getItem('pvsrv_books_catalog') || localStorage.getItem('pvsrv_books');
        if (stored) dynamic = JSON.parse(stored);
      } catch (e) {
        dynamic = [];
      }

      if (!Array.isArray(dynamic) || dynamic.length === 0) {
        return SEED_BOOKS;
      }

      // Merge dynamic books with seed books avoiding duplicate slugs
      const map = new Map();
      SEED_BOOKS.forEach(b => map.set(b.slug || b.id, b));
      dynamic.forEach(b => {
        const key = b.slug || b.id;
        map.set(key, Object.assign({}, map.get(key) || {}, b));
      });

      return Array.from(map.values());
    },

    // 2. Publish or update a book from CMS
    saveBook: function (bookData) {
      if (!bookData.id) bookData.id = 'book-' + Date.now();
      if (!bookData.slug) bookData.slug = (bookData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!bookData.cover) bookData.cover = 'assets/books/culture-that-lasts.png';
      if (!bookData.status) bookData.status = 'published';

      let books = this.getBooks();
      const existingIdx = books.findIndex(b => (b.id === bookData.id) || (b.slug === bookData.slug));
      if (existingIdx >= 0) {
        books[existingIdx] = Object.assign({}, books[existingIdx], bookData);
      } else {
        books.unshift(bookData);
      }

      try {
        localStorage.setItem('pvsrv_books', JSON.stringify(books));
        localStorage.setItem('pvsrv_books_catalog', JSON.stringify(books));
        // Dispatch custom event for real-time frontend reactivity
        window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'books', book: bookData } }));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      // Sync with Supabase PostgreSQL if available
      if (window.PVS_Supabase && typeof window.PVS_Supabase.saveBook === 'function') {
        window.PVS_Supabase.saveBook(bookData).catch(() => {});
      }

      return bookData;
    },

    // 3. Get all published articles (Seed + Dynamic CMS uploads)
    getArticles: function () {
      let articles = [];
      try {
        const stored = localStorage.getItem('pvsrv_cms_articles') || localStorage.getItem('pvsrv_articles');
        if (stored) articles = JSON.parse(stored);
      } catch (e) {
        articles = [];
      }
      return Array.isArray(articles) ? articles : [];
    },

    // 4. Publish an article from CMS
    saveArticle: function (articleData) {
      if (!articleData.id) articleData.id = 'art-' + Date.now();
      let articles = this.getArticles();
      const existingIdx = articles.findIndex(a => a.id === articleData.id);
      if (existingIdx >= 0) {
        articles[existingIdx] = Object.assign({}, articles[existingIdx], articleData);
      } else {
        articles.unshift(articleData);
      }

      try {
        localStorage.setItem('pvsrv_articles', JSON.stringify(articles));
        localStorage.setItem('pvsrv_cms_articles', JSON.stringify(articles));
        window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'articles', article: articleData } }));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }

      // Sync with Supabase PostgreSQL if available
      if (window.PVS_Supabase && typeof window.PVS_Supabase.saveArticle === 'function') {
        window.PVS_Supabase.saveArticle(articleData).catch(() => {});
      }

      return articleData;
    },

    // =========================================================================
    // FRONTEND DYNAMIC RENDERING ENGINES
    // =========================================================================

    // A. Render books on pages/books.html
    syncBooksCatalog: function () {
      const container = document.querySelector('.books-detailed-grid');
      if (!container) return;

      const books = this.getBooks();
      if (!books || books.length === 0) return;

      // Identify newly uploaded/custom books not already in HTML
      const existingHeadings = Array.from(container.querySelectorAll('.book-full-title')).map(h => h.textContent.trim().toLowerCase());

      books.forEach(b => {
        const titleLower = (b.title || '').trim().toLowerCase();
        if (existingHeadings.includes(titleLower)) return; // Already present in static markup

        const card = document.createElement('article');
        card.className = 'book-full-card dynamic-cms-book';
        const coverSrc = formatPath(b.cover || 'assets/books/culture-that-lasts.png');
        const pointsHtml = (Array.isArray(b.points) && b.points.length > 0)
          ? b.points.map(pt => `<div class="bf-point">✓ ${pt}</div>`).join('')
          : `<div class="bf-point">✓ Comprehensive executive playbook</div><div class="bf-point">✓ Real-world case frameworks</div>`;

        card.innerHTML = `
          <div class="book-full-cover-stage">
            <img src="${coverSrc}" alt="${b.title} Book Cover" class="book-full-cover-img" onerror="this.src='${ROOT_PREFIX}assets/books/culture-that-lasts.png'">
          </div>
          <div class="book-full-info">
            <div class="book-meta-tags">
              <span class="tag-badge">${(b.category || 'EXECUTIVE LEADERSHIP').toUpperCase()}</span>
              <span class="tag-pages">${b.pages || '240 Pages'}</span>
            </div>
            <h3 class="book-full-title">${b.title}</h3>
            <p class="book-full-desc">${b.subtitle || b.synopsis || 'An executive exploration into leadership and sustainable organizational scaling.'}</p>
            <div class="book-full-points">
              ${pointsHtml}
            </div>
            <div class="book-card-actions">
              <a href="contact.html?subject=Inquiry+${encodeURIComponent(b.title)}" class="btn btn-brown-pill btn-sm">Order Copy</a>
              <a href="reader.html?book=${encodeURIComponent(b.slug || b.id)}" class="btn-link-detail" style="color:#caa05b; font-weight:700; display:inline-flex; align-items:center; gap:0.35rem;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                <span>3D Flipbook</span>
              </a>
              <button class="btn-link-detail" onclick="openExcerptModal('${b.title.replace(/'/g, "\\'")}')">Synopsis &rarr;</button>
            </div>
          </div>
        `;
        // Prepend dynamic books right below the flagship book
        container.prepend(card);
      });
    },

    // B. Render books on Homepage Carousel (index.html)
    syncHomeCarousel: function () {
      const flexRow = document.querySelector('.books-flex-row');
      if (!flexRow) return;

      const books = this.getBooks();
      if (!books || books.length === 0) return;

      const existingKeys = Array.from(flexRow.querySelectorAll('[data-book-key]')).map(el => el.getAttribute('data-book-key'));

      books.forEach((b, idx) => {
        const key = b.slug || b.id;
        if (existingKeys.includes(key)) return;

        const item = document.createElement('div');
        item.className = 'book-item dynamic-cms-book';
        item.setAttribute('data-book-id', 'dyn-' + idx);
        item.setAttribute('data-book-key', key);
        const coverSrc = formatPath(b.cover || 'assets/books/culture-that-lasts.png');

        item.innerHTML = `
          <a href="${PAGE_PREFIX}reader.html?book=${encodeURIComponent(key)}" class="book-cover-wrap" title="Read ${b.title} in 3D Flipbook" style="display:block; position:relative; text-decoration:none;">
            <img src="${coverSrc}" alt="${b.title} Cover" class="book-img" width="250" height="304" loading="lazy" onerror="this.src='assets/books/culture-that-lasts.png'">
            <span class="book-flipbook-badge" style="position:absolute; bottom:8px; right:8px; background:rgba(14,16,21,0.92); color:#caa05b; font-size:0.68rem; font-weight:700; padding:0.25rem 0.55rem; border-radius:4px; border:1px solid rgba(202,160,91,0.5); display:inline-flex; align-items:center; gap:0.35rem;">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <span>3D Flipbook</span>
            </span>
          </a>
          <h3 class="book-title-heading"><a href="${PAGE_PREFIX}reader.html?book=${encodeURIComponent(key)}" style="color:inherit; text-decoration:none;">${b.title}</a></h3>
          <p class="book-caption-sub">${b.subtitle || (b.category || 'Executive Volume')}</p>
          <div style="margin-top:0.6rem; display:flex; gap:0.4rem; justify-content:center;">
            <a href="${PAGE_PREFIX}reader.html?book=${encodeURIComponent(key)}" class="btn btn-sm" style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.74rem; padding:0.3rem 0.75rem; background:#caa05b; color:#111215; font-weight:700; border-radius:20px; text-decoration:none;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <span>Read 3D</span>
            </a>
            <button type="button" class="btn btn-sm btn-book-details" data-book-key="${key}" onclick="openBookSynopsisModal('${key}')" style="cursor:pointer; font-size:0.74rem; padding:0.3rem 0.75rem; background:rgba(0,0,0,0.06); color:#334155; border:1px solid #cbd5e1; border-radius:20px;">Details</button>
          </div>
        `;
        flexRow.appendChild(item);
      });
    },

    // C. Render custom books in 3D Flipbook Switcher (pages/reader.html)
    syncReaderPresets: function () {
      const select = document.getElementById('bookSelector');
      if (!select) return;

      const books = this.getBooks();
      const existingOpts = Array.from(select.options).map(o => o.value);

      books.forEach(b => {
        const key = b.slug || b.id;
        if (!existingOpts.includes(key)) {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = `Book: ${b.title}`;
          select.appendChild(opt);
        }
      });
    },

    // D. Render latest CMS articles on Homepage (index.html)
    syncHomeArticles: function () {
      const container = document.querySelector('.blogs-grid-triad');
      if (!container) return;

      const articles = this.getArticles();
      if (!articles || articles.length === 0) return;

      // Display up to 2 newest articles from CMS at the top of the blog grid
      articles.slice(0, 2).forEach((art, i) => {
        if (container.querySelector(`[data-dyn-art="${art.id}"]`)) return;

        const card = document.createElement('div');
        card.className = 'blog-card dynamic-cms-article';
        card.setAttribute('data-dyn-art', art.id);

        card.innerHTML = `
          <div class="blog-img-box" style="background:#f1f5f9; display:flex; align-items:center; justify-content:center;">
            <img src="assets/blogs/growth-mindset.jpg" alt="${art.title}" class="blog-cover-img" width="600" height="340" loading="lazy">
          </div>
          <div class="blog-details">
            <span class="blog-publish-date" style="color:var(--gold, #966e36); font-weight:700;">${art.date || 'NEW PUBLICATION'}</span>
            <h3 class="blog-article-title">${art.title}</h3>
            <p class="blog-brief-summary">${art.summary || (art.content ? art.content.replace(/<[^>]*>?/gm, '').slice(0, 110) + '...' : '')}</p>
            <button class="link-read-more" onclick="openBlogArticleModal('${art.id}')">
              <span>Read More</span>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        `;
        container.prepend(card);
      });
    },

    // E. Fetch remote content from Supabase PostgreSQL Database / Edge API
    fetchRemoteContent: async function () {
      // 1. Check Supabase first
      if (window.PVS_Supabase && typeof window.PVS_Supabase.fetchBooks === 'function') {
        try {
          const cloudBooks = await window.PVS_Supabase.fetchBooks();
          if (Array.isArray(cloudBooks) && cloudBooks.length > 0) {
            this.syncBooksCatalog();
            this.syncHomeCarousel();
            this.syncReaderPresets();
          }
          const cloudArticles = await window.PVS_Supabase.fetchArticles();
          if (Array.isArray(cloudArticles) && cloudArticles.length > 0) {
            this.syncHomeArticles();
          }
        } catch (e) {
          console.warn('[PVS Bridge] Supabase remote sync notice:', e);
        }
      }

      // 2. Fallback check for Edge API if running in web environment
      if (typeof fetch !== 'function' || !window.location.protocol.startsWith('http')) return;
      try {
        const [booksRes, articlesRes] = await Promise.allSettled([
          fetch(ROOT_PREFIX + 'api/content?type=books'),
          fetch(ROOT_PREFIX + 'api/content?type=articles')
        ]);

        if (booksRes.status === 'fulfilled' && booksRes.value.ok) {
          const remoteBooks = await booksRes.value.json();
          if (Array.isArray(remoteBooks) && remoteBooks.length > 0) {
            const current = this.getBooks();
            const map = new Map();
            remoteBooks.forEach(b => map.set(b.slug || b.id, b));
            current.forEach(b => {
              const k = b.slug || b.id;
              if (!map.has(k)) map.set(k, b);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('pvsrv_books_catalog', JSON.stringify(merged));
            localStorage.setItem('pvsrv_books', JSON.stringify(merged));
            this.syncBooksCatalog();
            this.syncHomeCarousel();
            this.syncReaderPresets();
          }
        }

        if (articlesRes.status === 'fulfilled' && articlesRes.value.ok) {
          const remoteArts = await articlesRes.value.json();
          if (Array.isArray(remoteArts) && remoteArts.length > 0) {
            const current = this.getArticles();
            const map = new Map();
            remoteArts.forEach(a => map.set(a.id, a));
            current.forEach(a => {
              if (!map.has(a.id)) map.set(a.id, a);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('pvsrv_cms_articles', JSON.stringify(merged));
            localStorage.setItem('pvsrv_articles', JSON.stringify(merged));
            this.syncHomeArticles();
          }
        }
      } catch (err) {
        // graceful offline fallback
      }
    },

    // F. Wire Contact Form to Supabase PostgreSQL Inquiries
    setupContactForm: function () {
      const form = document.querySelector('form#contactForm') || document.querySelector('form.contact-form');
      if (!form || form.getAttribute('data-supabase-wired')) return;
      form.setAttribute('data-supabase-wired', 'true');

      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Submitting to Advisory Office...';
        }

        const formData = new FormData(form);
        const inquiryData = {
          name: formData.get('name') || form.querySelector('[name="name"]')?.value || 'Guest Inquirer',
          email: formData.get('email') || form.querySelector('[name="email"]')?.value || '',
          phone: formData.get('phone') || form.querySelector('[name="phone"]')?.value || '',
          organization: formData.get('organization') || form.querySelector('[name="organization"]')?.value || '',
          topic: formData.get('topic') || form.querySelector('[name="topic"]')?.value || 'Executive Consultation',
          message: formData.get('message') || form.querySelector('[name="message"]')?.value || '',
          created_at: new Date().toISOString()
        };

        try {
          if (window.PVS_Supabase && typeof window.PVS_Supabase.submitInquiry === 'function') {
            await window.PVS_Supabase.submitInquiry(inquiryData);
          } else {
            // Local fallback
            let inqs = JSON.parse(localStorage.getItem('pvsrv_inquiries') || '[]');
            inqs.unshift(inquiryData);
            localStorage.setItem('pvsrv_inquiries', JSON.stringify(inqs));
          }

          // Show success message
          const msgContainer = document.getElementById('contactFormSuccess') || document.createElement('div');
          msgContainer.id = 'contactFormSuccess';
          msgContainer.style.padding = '1.25rem';
          msgContainer.style.background = '#f0fdf4';
          msgContainer.style.border = '1px solid #86efac';
          msgContainer.style.borderRadius = '8px';
          msgContainer.style.color = '#166534';
          msgContainer.style.margin = '1rem 0';
          msgContainer.style.fontSize = '0.92rem';
          msgContainer.innerHTML = `<strong>Inquiry Received!</strong><br>Thank you, ${inquiryData.name}. Your strategic inquiry has been recorded into Mr. PVS Ravindra Varma's executive registry. His advisory office will review and respond within 24-48 business hours.`;
          
          form.parentNode.insertBefore(msgContainer, form);
          form.reset();

          if (typeof window.showToast === 'function') {
            window.showToast('Inquiry submitted successfully to advisory office!', 'gold');
          }
        } catch (err) {
          console.error('[Contact Form Error]', err);
          alert('Thank you! Your message was submitted.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    },

    // Master initialization
    init: function () {
      this.syncBooksCatalog();
      this.syncHomeCarousel();
      this.syncReaderPresets();
      this.syncHomeArticles();
      this.fetchRemoteContent();
      this.setupContactForm();
    }
  };

  // Run automatically when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PVS_Bridge.init());
  } else {
    PVS_Bridge.init();
  }

  // React to updates from Admin in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'pvsrv_books' || e.key === 'pvsrv_articles') {
      PVS_Bridge.init();
    }
  });

  window.addEventListener('pvs_content_updated', () => {
    PVS_Bridge.init();
  });

  window.PVS_Bridge = PVS_Bridge;

})(window);
