/**
 * PVS RAVINDRA VARMA - PORTFOLIO LOGIC & MULTI-PAGE INTERACTIVITY
 * High-fidelity Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMetricsCounter();
  initBookCarousel();
  initSearch();
  initKeyboardShortcuts();
  initCategoryFilters();
  initFaqAccordion();
  initInteractiveModals();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open-lock', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open-lock');
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open-lock');
      }
    });
  }

  // Ensure homepage contact form submission is explicitly wired
  const homeContactForm = document.getElementById('contactForm');
  if (homeContactForm && !homeContactForm.hasAttribute('onsubmit')) {
    homeContactForm.addEventListener('submit', window.handleFormSubmission);
  }
}

/* ==========================================================================
   2. METRICS COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;

  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          if (!target) return;
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / totalSteps;
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(target * easeProgress);

            counter.textContent = currentVal.toLocaleString();

            if (currentStep >= totalSteps) {
              counter.textContent = target.toLocaleString();
              clearInterval(timer);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.hero-metrics-bar, .about-quick-metrics');
  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }
}

/* ==========================================================================
   3. BOOK CAROUSEL (HOME PAGE)
   ========================================================================== */
function initBookCarousel() {
  const scroller = document.getElementById('booksScroller');
  const prevBtn = document.getElementById('bookPrevBtn');
  const nextBtn = document.getElementById('bookNextBtn');
  const dots = document.querySelectorAll('#bookDots .p-dot');
  const bookItems = document.querySelectorAll('.book-item');

  if (!scroller || !prevBtn || !nextBtn) return;

  function updateDots() {
    const scrollLeft = scroller.scrollLeft;
    const itemWidth = bookItems[0]?.offsetWidth || 240;
    const activeIndex = Math.min(Math.round(scrollLeft / itemWidth), dots.length - 1);
    
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  scroller.addEventListener('scroll', updateDots, { passive: true });

  prevBtn.addEventListener('click', () => {
    const itemWidth = bookItems[0]?.offsetWidth || 240;
    scroller.scrollBy({ left: -(itemWidth + 32), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const itemWidth = bookItems[0]?.offsetWidth || 240;
    scroller.scrollBy({ left: (itemWidth + 32), behavior: 'smooth' });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = +e.target.getAttribute('data-index');
      const itemWidth = bookItems[0]?.offsetWidth || 240;
      scroller.scrollTo({ left: idx * (itemWidth + 32), behavior: 'smooth' });
    });
  });

  // Clicking anywhere on a book card opens the 3D interactive reader
  bookItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const key = item.getAttribute('data-book-key') || 'people-before-process';
      window.location.href = `pages/reader.html?book=${key}`;
    });
  });
}

/* ==========================================================================
   4. CATEGORY FILTERS (BLOGS & VIDEOS)
   ========================================================================== */
function initCategoryFilters() {
  // Blog Filter Bar
  const blogFilterBar = document.getElementById('blogFilterBar');
  if (blogFilterBar) {
    const blogButtons = blogFilterBar.querySelectorAll('.filter-tag');
    const blogCards = document.querySelectorAll('.blog-archive-card');

    blogButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        blogButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        blogCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Video Filter Bar
  const videoFilterBar = document.getElementById('videoFilterBar');
  if (videoFilterBar) {
    const videoButtons = videoFilterBar.querySelectorAll('.filter-tag');
    const videoCards = document.querySelectorAll('.video-archive-card');

    videoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        videoButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');

        videoCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. GLOBAL SEARCH MODAL (MULTI-PAGE INDEX)
   ========================================================================== */
function initSearch() {
  const searchModal = document.getElementById('searchModal');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchModal') || document.getElementById('closeSearchModalBtn') || searchModal?.querySelector('.dialog-close-btn');
  const searchInput = document.getElementById('siteSearchInput');
  const resultsContainer = document.getElementById('searchResults') || document.getElementById('searchResultsList');

  if (!searchModal || !openSearchBtn) return;

  openSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchModal.showModal();
    setTimeout(() => searchInput?.focus(), 50);
  });

  closeSearchBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    searchModal.close();
  });

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.close();
  });

  const searchableIndex = [
    { type: 'Page', title: 'Executive Overview & Home', url: 'index.html', desc: 'Main executive landing page and highlights.' },
    { type: 'Page', title: 'Biography & 7 Pillars of Impact', url: 'about.html', desc: 'Executive background, Formula HR Consulting, CII panels, Rotary.' },
    { type: 'Page', title: 'Published Works & Strategic Handbooks', url: 'books.html', desc: '4 landmark titles by Mr. PVS Ravindra Varma.' },
    { type: 'Page', title: 'Thought Leadership Articles & Essays', url: 'blogs.html', desc: 'Field-tested perspectives on culture, talent, and AI.' },
    { type: 'Page', title: 'Keynote Speeches & Media Broadcasts', url: 'videos.html', desc: 'CII summits, HMTV Career Times, Rotary conventions.' },
    { type: 'Page', title: 'Connect & Advisory Consultation', url: 'contact.html', desc: 'Hyderabad headquarters, executive advisory, speaking bookings.' },
    { type: 'Book', title: 'People Before Process (Flagship Title)', url: 'books.html', desc: 'Building human-first organizational architecture.' },
    { type: 'Book', title: 'The Leadership Habit: Daily Executive Rituals', url: 'books.html', desc: 'Transformative daily habits of high-impact leaders.' },
    { type: 'Book', title: 'Culture That Lasts: Creating Purpose-Driven Teams', url: 'books.html', desc: 'Institutional memory and enduring workplace trust.' },
    { type: 'Book', title: 'The Human Advantage: AI & Workforce Resilience', url: 'books.html', desc: 'Irreplaceable human capabilities in the age of AI.' },
    { type: 'Article', title: 'Cultivating a Growth Mindset in Legacy Organizations', url: 'blogs.html', desc: 'Breaking complacency and unfreezing institutional inertia.' },
    { type: 'Article', title: 'Architecting High-Performing Teams in Hybrid Environments', url: 'blogs.html', desc: 'Accountability and cohesion across distributed workforces.' },
    { type: 'Article', title: 'Leadership in a Rapidly Changing World', url: 'blogs.html', desc: 'Navigating volatility and technological disruption.' },
    { type: 'Article', title: 'The SME Scaling Dilemma: Founder-Led to System HR', url: 'blogs.html', desc: 'Consulting field notes on scaling mid-market enterprises.' },
    { type: 'Video', title: 'The Future of Work (CII Leadership Conclave)', url: 'videos.html', desc: 'Balancing speed with radical empathy.' },
    { type: 'Video', title: 'People First Culture (HMTV Career Times)', url: 'videos.html', desc: 'Television interview on workplace culture and retention.' },
    { type: 'Video', title: 'Leadership Lessons from 25+ Years in Consulting', url: 'videos.html', desc: 'Executive masterclass on coaching and strategy.' },
    { type: 'Pillar', title: '1. People Development', url: 'about.html', desc: 'Individualized competency mapping and leadership ecosystems.' },
    { type: 'Pillar', title: '2. Organizational Effectiveness', url: 'about.html', desc: 'Structural optimization and cross-functional agility.' },
    { type: 'Pillar', title: '3. Leadership Advisory', url: 'about.html', desc: 'Confidential executive counsel for CEOs and Founders.' }
  ];

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">Type keywords like <em>"Books"</em>, <em>"CII"</em>, <em>"Culture"</em>, <em>"Future of Work"</em>...</div>';
      return;
    }

    // Sections, categories and loaded items contributed by platform.js come first, so when
    // the same article or book is in both lists the entry linking to its own page wins.
    const extra = window.PVS ? window.PVS.searchEntries() : [];
    const baseTitle = t => t.toLowerCase().split(/[:(]/)[0].trim();
    const seen = new Set();
    const matches = extra.concat(searchableIndex).filter(item => {
      const key = baseTitle(item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );

    matches.splice(40);

    const IN_SUBDIR = (typeof location !== 'undefined') && (location.pathname.includes('/pages/') || location.pathname.includes('\\pages\\') || location.pathname.includes('/admin/') || location.pathname.includes('\\admin\\'));
    const PAGE_PREFIX = IN_SUBDIR ? '' : 'pages/';
    const ROOT_PREFIX = IN_SUBDIR ? '../' : '';
    const resolveSearchUrl = url => {
      if (!url) return '';
      if (url.startsWith('http') || url.startsWith('/') || url.startsWith('#') || url.startsWith('../') || url.startsWith('pages/')) return url;
      if (url === 'index.html') return `${ROOT_PREFIX}index.html`;
      return `${PAGE_PREFIX}${url}`;
    };

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">No results found for "<strong>${escapeHTML(q)}</strong>".</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(m => `
      <a href="${resolveSearchUrl(m.url)}" class="search-result-row" style="display: flex; flex-direction: column; padding: 1rem 1.25rem; border-bottom: 1px solid #f1ece4; text-decoration: none; transition: background 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span style="font-size: 0.65rem; font-weight: 800; color: #caa05b; text-transform: uppercase; background: #fdfaf3; padding: 0.15rem 0.5rem; border-radius: 4px; border: 1px solid rgba(202,160,91,0.3);">${m.type}</span>
          <strong style="font-size: 0.95rem; color: #14171d;">${escapeHTML(m.title)}</strong>
        </div>
        <span style="font-size: 0.82rem; color: #667085;">${escapeHTML(m.desc)}</span>
      </a>
    `).join('');
  });
}

/* ==========================================================================
   7. MODALS DATA & POPUPS
   ========================================================================== */
const BOOKS_OUTLINES = {
  'People Before Process': {
    subtitle: 'Transforming Modern HR Architecture from Compliance to Human Empowerment',
    pages: '248 Pages',
    chapters: [
      'Chapter 1: The Broken Paradigm of Transactional Human Capital',
      'Chapter 2: Why Strategy Fails When Culture Suffers',
      'Chapter 3: The Talent Alchemy: Attracting & Retaining Top 1% Operators',
      'Chapter 4: Continuous Feedback Loops That Drive Exponential Retention',
      'Chapter 5: Sustainable High Performance in Fast-Growth Enterprises'
    ],
    synopsis: 'A groundbreaking work providing founders, CEOs, and HR executives with an actionable framework for building resilient, trust-first organizations that achieve hypergrowth without employee burnout.'
  },
  'The Leadership Habit': {
    subtitle: 'Daily Practices of High-Impact Executives',
    pages: '212 Pages',
    chapters: [
      'Chapter 1: The 15-Minute Executive Morning Alignment',
      'Chapter 2: Radical Candor & Constructive Vulnerability in High Stakes',
      'Chapter 3: Decision Velocity: Eliminating Bureaucratic Paralysis',
      'Chapter 4: Mentoring Successors: Building Tier-2 Leadership Benches',
      'Chapter 5: Leading with Composure Through Market Disruption'
    ],
    synopsis: 'An indispensable handbook dissecting the compounding micro-habits of elite corporate leaders, demonstrating how everyday routines transform organizational culture.'
  },
  'Culture That Lasts': {
    subtitle: 'Building Resilient, Purpose-Driven Teams for Generations',
    pages: '260 Pages',
    chapters: [
      'Chapter 1: The Core DNA: Embedding Core Values into Promotion Ladders',
      'Chapter 2: Psychological Safety as a Prerequisite for Innovation',
      'Chapter 3: Bridging Cross-Generational Gaps in the Workplace',
      'Chapter 4: Preserving Cultural Intimacy Across Global Expansion',
      'Chapter 5: Institutional Memory: Why Great Companies Outlive Their Founders'
    ],
    synopsis: 'Explores the structural frameworks necessary to preserve culture through hyper-scaling, leadership successions, and economic downturns.'
  },
  'The Human Advantage': {
    subtitle: 'Thriving in the Age of Automation, AI & Algorithmic Work',
    pages: '196 Pages',
    chapters: [
      'Chapter 1: What Machines Cannot Replicate: Empathy, Intuition & Ethics',
      'Chapter 2: Hybrid Workforce Orchestration & Asynchronous Mastery',
      'Chapter 3: The Reskilling Imperative: Lifelong Learning Ecosystems',
      'Chapter 4: Servant Leadership in the Era of Algorithmic Management',
      'Chapter 5: Future-Proofing Corporate Careers for the Next 25 Years'
    ],
    synopsis: 'A visionary guide on how organizations and professionals can harness artificial intelligence while elevating the uniquely human qualities of empathy, creativity, and strategic insight.'
  }
};

window.openExcerptModal = function(bookTitle) {
  const modal = document.getElementById('excerptModal') || document.getElementById('bookModal');
  const modalTitle = document.getElementById('excerptModalTitle') || document.getElementById('bookModalTitle');
  const modalBody = document.getElementById('excerptModalBody') || document.getElementById('bookModalBody');

  let dynamicBook = null;
  if (window.PVS_Bridge && typeof window.PVS_Bridge.getBooks === 'function') {
    dynamicBook = window.PVS_Bridge.getBooks().find(b => 
      (b.title && b.title.toLowerCase() === (bookTitle || '').toLowerCase()) || 
      b.id === bookTitle || 
      b.slug === bookTitle
    );
  }

  const book = dynamicBook ? {
    subtitle: dynamicBook.subtitle || dynamicBook.category || 'Executive Manuscript',
    pages: dynamicBook.pages || '240 Pages',
    chapters: Array.isArray(dynamicBook.chapters) ? dynamicBook.chapters : (typeof dynamicBook.chapters === 'string' ? dynamicBook.chapters.split('\n').filter(Boolean) : ['Chapter 1: Foundational Frameworks', 'Chapter 2: Organizational Scaling', 'Chapter 3: Cultural Resilience']),
    synopsis: dynamicBook.synopsis || 'An executive exploration into transformative leadership and high-performance workplaces.'
  } : (BOOKS_OUTLINES[bookTitle] || BOOKS_OUTLINES['People Before Process']);

  if (!modal || !modalBody) return;

  if (modalTitle) modalTitle.textContent = bookTitle;

  const isPagesSubdir = (typeof location !== 'undefined') && location.pathname.includes('/pages/');
  const readerPrefix = isPagesSubdir ? 'reader.html' : 'pages/reader.html';
  const booksPrefix = isPagesSubdir ? 'books.html' : 'pages/books.html';
  const contactPrefix = isPagesSubdir ? 'contact.html' : 'pages/contact.html';

  modalBody.innerHTML = `
    <div style="padding: 1.25rem;">
      <div style="margin-bottom: 1.25rem;">
        <span class="section-label-gold" style="margin: 0; font-size:0.75rem; color:#caa05b; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">EXECUTIVE SYNOPSIS</span>
        <h4 style="font-size: 1.15rem; color: #966e36; margin: 0.25rem 0 0.75rem; font-family:var(--font-serif);">${escapeHTML(book.subtitle)}</h4>
        <p style="font-size: 0.95rem; color: #475467; line-height: 1.65;">${escapeHTML(book.synopsis)}</p>
      </div>

      <div style="background: #faf8f2; border: 1px solid rgba(202,160,91,0.25); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
        <h5 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #14171d; margin-bottom: 0.75rem;">Table of Contents Preview:</h5>
        <ul style="list-style: none; padding: 0; margin:0;">
          ${book.chapters.map(ch => `<li style="font-size: 0.88rem; color: #334155; margin-bottom: 0.4rem; display: flex; gap: 0.5rem;"><span style="color: #caa05b;">▸</span> <span>${escapeHTML(ch)}</span></li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <a href="${readerPrefix}?book=${encodeURIComponent(bookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}" class="btn btn-gold-solid" style="display:inline-flex; align-items:center; gap:0.5rem; text-decoration:none;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <span>Read 3D Page-Flip Edition</span>
        </a>
        <a href="${contactPrefix}?subject=Order+Book+${encodeURIComponent(bookTitle)}" class="btn btn-outline-dark" style="text-decoration:none;">
          <span>Order Full Book Copy</span>
        </a>
        <button type="button" class="btn btn-outline-dark" onclick="showToast('Sample PDF download link sent to your browser.'); (document.getElementById('excerptModal') || document.getElementById('bookModal'))?.close();">
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  `;

  modal.showModal();
};
window.openBookSynopsisModal = window.openExcerptModal;

const BLOG_ARTICLES = {
  'growth-mindset': {
    title: 'Cultivating a Growth Mindset in Legacy Organizations: Breaking the Habit of Complacency',
    category: 'Leadership Strategy',
    readTime: '6 Min Read',
    date: 'August 2026',
    image: 'assets/blogs/growth-mindset.jpg',
    content: `
      <p>In established enterprises that have enjoyed decades of market dominance, the greatest hidden vulnerability is often not external competition, but internal calcification. When previous successes become unquestionable gospel, intellectual curiosity suffocates.</p>
      <h4>1. Unfreezing Institutional Inertia</h4>
      <p>True executive transformation requires deliberate unlearning. Leadership teams must normalize constructive vulnerability, creating spaces where managers can state 'we do not know, but we will test and discover' without career penalty.</p>
      <h4>2. Normalizing Productive Failure</h4>
      <p>Organizations with genuine growth mindsets distinguish sharply between negligent failure and exploratory failure. When calculated experiments yield unexpected outcomes, the insights gained must be codified and celebrated across the entire team.</p>
      <h4>3. Iterative Learning Loops</h4>
      <p>By instituting bi-weekly post-mortems and cross-functional feedback sessions, organizations create an organic immune system capable of pivoting with agility when industry tides shift.</p>
    `
  },
  'high-performing-teams': {
    title: 'Architecting High-Performing Teams in Hybrid Environments',
    category: 'Workplace Culture',
    readTime: '5 Min Read',
    date: 'July 2026',
    image: 'assets/blogs/high-performing-teams.jpg',
    content: `
      <p>The transition to hybrid and distributed work environments has forever dismantled the illusion that physical presence equals productivity. High performance is fundamentally an equation of trust, clear outcomes, and psychological safety.</p>
      <h4>1. From Activity Monitoring to Outcome Ownership</h4>
      <p>Micromanagement collapses in hybrid setups. High-performing organizations establish crisp, unambiguous key results while granting team members complete autonomy over their execution timeline.</p>
      <h4>2. Intentional Rituals of Connection</h4>
      <p>Spontaneous watercooler moments must be replaced with intentional synchronous rituals—such as weekly wins retrospectives and peer recognition circles—that reinforce mutual appreciation.</p>
    `
  },
  'leadership-changing-world': {
    title: 'Leadership in a Rapidly Changing World: Navigating Disruption',
    category: 'Future of Work & AI',
    readTime: '7 Min Read',
    date: 'June 2026',
    image: 'assets/blogs/leadership-changing-world.jpg',
    content: `
      <p>We are living in an era where five-year strategic roadmaps are rendered obsolete within quarters. Leaders can no longer operate as solitary navigators; they must function as cultural architects who build adaptive capacity across every tier.</p>
      <h4>1. Decentralized Decision Making</h4>
      <p>When market conditions shift overnight, frontline employees with closest proximity to customers must possess the authority to make rapid course corrections.</p>
      <h4>2. Leading with Radical Empathy</h4>
      <p>Technological disruption naturally breeds uncertainty. Leaders who communicate with transparent vulnerability and genuine empathy build durable trust that enables their workforce to weather severe economic storms.</p>
    `
  },
  'sme-scaling': {
    title: 'The SME Scaling Dilemma: Transitioning from Founder-Led to System-Driven HR',
    category: 'Talent & Retention',
    readTime: '8 Min Read',
    date: 'May 2026',
    image: 'assets/blogs/growth-mindset.jpg',
    content: `
      <p>Drawing from decades of advisory at Formula HR Consulting, the most perilous inflection point for small-to-medium enterprises occurs when the organization scales past 50 employees and founder intuition is no longer sufficient to govern human capital.</p>
      <h4>1. Codifying Informal Values into Institutional Systems</h4>
      <p>Founders often fear that formal HR will dilute their entrepreneurial culture. In reality, structured HR frameworks safeguard culture by ensuring consistent promotion criteria, fair compensation, and objective accountability.</p>
    `
  },
  'rotary-ethics': {
    title: 'Ethics, Rotary Principles & Corporate Governance in 2026',
    category: 'Governance & CSR',
    readTime: '6 Min Read',
    date: 'April 2026',
    image: 'assets/blogs/leadership-changing-world.jpg',
    content: `
      <p>In an age dominated by shareholder scrutiny and rapid news cycles, ethical governance is no longer a PR compliance checklist—it is an existential enterprise asset.</p>
      <p>Applying Rotary International’s legendary Four-Way Test—Is it the TRUTH? Is it FAIR to all concerned? Will it build GOODWILL and BETTER FRIENDSHIPS? Will it be BENEFICIAL to all concerned?—provides boards with an unshakeable compass for high-stakes decision making.</p>
    `
  },
  'talent-mobility': {
    title: 'Talent Mobility: The True Cost of Neglecting Tier-2 Leaders',
    category: 'Talent & Retention',
    readTime: '5 Min Read',
    date: 'March 2026',
    image: 'assets/blogs/high-performing-teams.jpg',
    content: `
      <p>When high-potential mid-level managers resign, companies lose far more than head count; they lose institutional memory, client relationships, and team velocity. Retaining tier-2 leaders requires proactive rotational assignments and transparent executive sponsorship.</p>
    `
  }
};

window.openBlogArticleModal = function(articleId) {
  const modal = document.getElementById('blogModal');
  if (!modal) return;

  let dynamicArt = null;
  if (window.PVS_Bridge && typeof window.PVS_Bridge.getArticles === 'function') {
    dynamicArt = window.PVS_Bridge.getArticles().find(a => a.id === articleId || a.slug === articleId);
  }

  const article = dynamicArt ? {
    title: dynamicArt.title,
    category: dynamicArt.category || 'Executive Insights',
    readTime: dynamicArt.read_time || '5 Min Read',
    date: dynamicArt.date || 'Recent Publication',
    image: dynamicArt.cover_img || dynamicArt.image || 'assets/blogs/growth-mindset.jpg',
    content: dynamicArt.body || dynamicArt.content || `<p>${dynamicArt.summary || 'Executive thought leadership essay by Mr. PVS Ravindra Varma.'}</p>`
  } : (BLOG_ARTICLES[articleId] || BLOG_ARTICLES['growth-mindset']);

  const modalTitle = document.getElementById('blogModalTitle');
  if (modalTitle) modalTitle.textContent = article.title;

  const modalBody = document.getElementById('blogModalBody');
  if (modalBody) {
    const isPagesSubdir = (typeof location !== 'undefined') && location.pathname.includes('/pages/');
    const imgPrefix = isPagesSubdir ? '../' : '';
    modalBody.innerHTML = `
      <div class="article-full-body" style="padding: 1.25rem;">
        <h2 style="font-family: var(--font-serif); font-size: 1.45rem; color: #14171d; margin-bottom: 0.75rem; line-height: 1.35;">${escapeHTML(article.title)}</h2>
        <div style="border-radius: 8px; overflow: hidden; margin-bottom: 1.25rem; max-height: 260px;">
          <img src="${imgPrefix}${article.image}" alt="${escapeHTML(article.title)}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 1rem; font-size: 0.82rem; color: #667085; font-weight: 600;">
          <span class="tag-badge" style="background:#fdfaf3; color:#caa05b; padding:0.15rem 0.5rem; border-radius:4px; border:1px solid rgba(202,160,91,0.3);">${article.category}</span>
          <span>•</span>
          <span>${article.date}</span>
          <span>•</span>
          <span>${article.readTime}</span>
        </div>
        <div style="color: #334155; font-size: 0.95rem; line-height: 1.7;">
          ${article.content}
        </div>
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eae5dc; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <span style="font-size: 0.88rem; font-weight: 700; color: #14171d;">Authored by Mr. PVS Ravindra Varma</span>
          <button type="button" class="btn btn-outline-dark btn-sm" onclick="navigator.clipboard.writeText(window.location.href); showToast('Article link copied to clipboard!');">Share Essay</button>
        </div>
      </div>
    `;
  }

  modal.showModal();
};

const VIDEOS_DATA = {
  'future-work': {
    title: 'The Future of Work: Balancing Technological Speed with Radical Human Empathy',
    event: 'CII Leadership Conclave Hyderabad',
    duration: '24:15',
    thumbnail: 'assets/videos/video-future-work.jpg',
    transcript: 'In this keynote address, Mr. Varma addresses 800+ senior leaders on architecting hybrid organizations that harness cognitive AI while placing human dignity and psychological safety at the core of all operations.'
  },
  'people-first': {
    title: 'People First: Transforming Workplace Culture from the Ground Up',
    event: 'HMTV Career Times Broadcast',
    duration: '22:15',
    thumbnail: 'assets/videos/video-people-first.jpg',
    transcript: 'Featured on national television, Mr. Varma explains why employee engagement metrics correlate directly with multi-year shareholder returns, and how founders can build authentic cultures.'
  },
  'leadership-lessons': {
    title: 'Leadership Lessons from 25+ Years in Executive Consulting',
    event: 'Executive Masterclass Series',
    duration: '31:05',
    thumbnail: 'assets/videos/video-leadership-lessons.jpg',
    transcript: 'A deep-dive masterclass covering executive coaching frameworks, resolving boardroom friction, and mentoring emerging executives to assume CXO-level responsibilities.'
  },
  'cii-panel': {
    title: 'CII Panel: Overcoming Talent Acquisition Bottlenecks in Scaling SMEs',
    event: 'CII Telangana Annual Conference',
    duration: '45:20',
    thumbnail: 'assets/videos/video-future-work.jpg',
    transcript: 'Mr. Varma moderates and presents on institutional talent pipelines, employer branding, and building high-retention onboarding programs for emerging enterprises.'
  },
  'rotary-youth': {
    title: 'Rotary District 3150 Youth Assembly: Igniting Tomorrow\'s Changemakers',
    event: 'Rotary District 3150 Annual Youth Conclave',
    duration: '15:50',
    thumbnail: 'assets/videos/video-leadership-lessons.jpg',
    transcript: 'Keynote address delivered to 1,200+ collegiate students and young professionals on ethical leadership, community service, and personal excellence.'
  },
  'burnout-prevention': {
    title: 'Preventing Executive Burnout & Cultivating High-Trust Teams',
    event: 'CXO Leadership Retreat',
    duration: '27:30',
    thumbnail: 'assets/videos/video-people-first.jpg',
    transcript: 'Actionable strategies for founders and business owners to safeguard personal energy while establishing psychological trust across cross-functional departments.'
  },
  'my-story': {
    title: 'My Journey: Transforming Workplaces & Empowering Leaders',
    event: 'Executive Profile & Documentary',
    duration: '18:40',
    thumbnail: 'assets/ravindravarma.jpeg',
    transcript: 'Reflecting on 25+ years in organizational transformation, talent advisory, and leadership development. Mr. Varma shares the formative experiences that shaped his philosophy: people are not resources to be consumed, but possibilities to be unlocked.'
  }
};

window.openVideoPlayerModal = function(videoArg) {
  const modal = document.getElementById('videoModal');
  if (!modal) return;
  
  let vidKey = 'future-work';
  let customTitle = null;
  let customSpeaker = null;

  if (typeof videoArg === 'string') {
    vidKey = videoArg;
  } else if (videoArg && typeof videoArg === 'object') {
    vidKey = videoArg.id || 'my-story';
    customTitle = videoArg.title;
    customSpeaker = videoArg.speaker;
  }

  const vid = VIDEOS_DATA[vidKey] || VIDEOS_DATA['my-story'] || VIDEOS_DATA['future-work'];
  const modalTitle = document.getElementById('videoModalTitle');
  if (modalTitle) modalTitle.textContent = customTitle || vid.title;

  const modalBody = document.getElementById('videoModalBody');
  const isPagesSubdir = (typeof location !== 'undefined') && location.pathname.includes('/pages/');
  const imgPrefix = isPagesSubdir ? '../' : '';
  const contactPrefix = isPagesSubdir ? 'contact.html' : 'pages/contact.html';

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="padding: 1.25rem;">
        <div class="video-embed-container" style="position:relative; border-radius:8px; overflow:hidden; margin-bottom:1.25rem;">
          <img src="${imgPrefix}${vid.thumbnail}" alt="${escapeHTML(vid.title)}" style="width:100%; height:auto; display:block;">
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.85)); padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <button type="button" class="btn-play-sim" style="width: 36px; height: 36px; background: #caa05b; border-radius: 50%; border:none; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; cursor:pointer;" onclick="showToast('Playing full HD video broadcast...');">▶</button>
              <span style="font-size: 0.82rem; color: #fff; font-weight: 600;">${vid.event}</span>
            </div>
            <span style="font-size: 0.8rem; color: #cbd5e1;">${vid.duration}</span>
          </div>
        </div>

        <div class="video-transcript-box">
          <h4 style="font-size:1rem; color:#14171d; margin-bottom:0.5rem;">Broadcast Overview &amp; Key Highlights</h4>
          <p style="font-size:0.92rem; color:#475467; line-height:1.6;">${escapeHTML(vid.transcript)}</p>
        </div>

        <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="${contactPrefix}?subject=Invite+Speaker+Keynote" class="btn btn-gold-solid" style="text-decoration:none;">
            <span>Book Mr. Varma for Your Event</span>
          </a>
          <button type="button" class="btn btn-outline-dark btn-sm" onclick="navigator.clipboard.writeText(window.location.href); showToast('Video broadcast link copied!');">Share Video</button>
        </div>
      </div>
    `;
  } else {
    // index.html custom player layout
    const speakerTag = modal.querySelector('.video-speaker-tag');
    if (speakerTag) speakerTag.textContent = `${vid.event} • ${vid.duration}`;
    const screen = document.getElementById('videoScreen');
    if (screen) {
      screen.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${vid.thumbnail}')`;
      screen.style.backgroundSize = 'cover';
      screen.style.backgroundPosition = 'center';
    }
    const timeDisplay = document.getElementById('videoTimeDisplay');
    if (timeDisplay) timeDisplay.textContent = `00:00 / ${vid.duration}`;
  }

  modal.showModal();
};

window.openAboutBioModal = function() {
  const modal = document.getElementById('aboutModal');
  if (modal) modal.showModal();
};

function initInteractiveModals() {
  // 1. Universal dialog backdrop click & close button handler
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });

    dlg.querySelectorAll('.dialog-close-btn, .video-close-btn, [data-close-dialog], #closeSearchModal, #closeSearchModalBtn, #closeVideoModalBtn, #closeBookModalBtn, #closeBlogModalBtn, #closeAboutModalBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        dlg.close();
      });
    });
  });

  // 2. Wire video play buttons & preview stages
  document.querySelectorAll('.circle-play-overlay, [data-video], .vac-watch-btn, .vac-thumb-box').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const vidAttr = btn.getAttribute('data-video') || btn.closest('[data-video-id]')?.getAttribute('data-video-id') || 'future-work';
      const keyMap = { '1': 'future-work', '2': 'people-first', '3': 'leadership-lessons' };
      openVideoPlayerModal(keyMap[vidAttr] || vidAttr);
    });
  });

  // 3. Wire blog read more buttons & cards
  document.querySelectorAll('.link-read-more, .blog-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      e.preventDefault();
      const blogAttr = btn.getAttribute('data-blog') || btn.closest('[data-blog-id]')?.getAttribute('data-blog-id') || '1';
      const keyMap = { '1': 'growth-mindset', '2': 'high-performing-teams', '3': 'leadership-changing-world' };
      openBlogArticleModal(keyMap[blogAttr] || blogAttr);
    });
  });

  // 4. Wire book details buttons in carousel on home page
  document.querySelectorAll('.btn-book-details, .book-item a, .book-item button').forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === 'details') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookKey = btn.closest('.book-item')?.getAttribute('data-book-key') || btn.getAttribute('data-book-key') || 'people-before-process';
        openBookSynopsisModal(bookKey);
      });
    }
  });

  // 5. Wire video controls in simulated player (index.html)
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      const state = document.getElementById('videoPlayingState');
      if (state) {
        state.style.display = state.style.display === 'none' ? 'flex' : 'none';
      }
      showToast('Video playback toggled.');
    });
  }

  const muteBtn = document.getElementById('videoMuteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      showToast('Audio volume toggled.');
    });
  }
}

/* ==========================================================================
   8. FORM SUBMISSIONS & TOAST NOTIFICATIONS
   ========================================================================== */
window.handleFormSubmission = function(e) {
  e.preventDefault();
  const form = e.target;

  // Clear previous inline errors
  const nameError = form.querySelector('#nameError, .name-error');
  const emailError = form.querySelector('#emailError, .email-error');
  const messageError = form.querySelector('#messageError, .message-error');
  if (nameError) nameError.textContent = '';
  if (emailError) emailError.textContent = '';
  if (messageError) messageError.textContent = '';

  const nameInput = form.querySelector('[name="name"], #userName, #contactName');
  const emailInput = form.querySelector('[name="email"], #userEmail, #contactEmail');
  const messageInput = form.querySelector('[name="message"], #userMessage, #contactMessage');

  let hasError = false;
  if (nameInput && !nameInput.value.trim()) {
    if (nameError) nameError.textContent = 'Please enter your name.';
    nameInput.focus();
    hasError = true;
  } else if (emailInput && (!emailInput.value.trim() || !emailInput.value.includes('@'))) {
    if (emailError) emailError.textContent = 'Please enter a valid email address.';
    emailInput.focus();
    hasError = true;
  } else if (messageInput && !messageInput.value.trim()) {
    if (messageError) messageError.textContent = 'Please enter your consultation message or inquiry.';
    messageInput.focus();
    hasError = true;
  }

  if (hasError) return;

  const payload = {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    message: messageInput ? messageInput.value.trim() : '',
    phone: (form.querySelector('[name="phone"], #userPhone, #contactPhone') || {}).value || '',
    organization: (form.querySelector('[name="organization"], #userOrg, #contactOrg') || {}).value || '',
    service: (form.querySelector('[name="service"], #userService, #contactService') || {}).value || 'Executive Consultation'
  };

  // Store in CRM inquiries store immediately
  try {
    let inqs = JSON.parse(localStorage.getItem('pvsrv_inquiries') || '[]');
    inqs.unshift({
      id: 'inq-' + Date.now(),
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      org: payload.organization,
      topic: payload.service,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      message: payload.message
    });
    localStorage.setItem('pvsrv_inquiries', JSON.stringify(inqs));
  } catch (err) {}

  // Dispatch to Cloudflare Edge API
  if (typeof fetch === 'function' && window.location.protocol.startsWith('http')) {
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  if (submitBtn) {
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Processing Consultation Request...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your strategic consultation inquiry has been submitted to Mr. Varma\'s executive office.');
    }, 800);
  }
};

window.handleNewsletterSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  form.reset();
  showToast('Thank you for subscribing to "The People-First Memo" executive dispatch!');
};

function showToast(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 20 20" width="18" height="18" fill="#caa05b">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    <span>${escapeHTML(msg)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   9. KEYBOARD SHORTCUTS & HELPERS
   ========================================================================== */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchModal = document.getElementById('searchModal');
      if (searchModal) {
        if (searchModal.open) {
          searchModal.close();
        } else {
          searchModal.showModal();
          setTimeout(() => document.getElementById('siteSearchInput')?.focus(), 50);
        }
      }
    }
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
