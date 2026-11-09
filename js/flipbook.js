/**
 * PVS RAVINDRA VARMA - REALISTIC 3D PAGE-FLIP ENGINE
 * Dual-Page 3D Spread, Paper Curling, PDF.js Parsing & Synthesized Audio
 */

(function (window) {
  'use strict';

  const IN_SUBDIR = (typeof location !== 'undefined') && (location.pathname.includes('/pages/') || location.pathname.includes('\\pages\\') || location.pathname.includes('/admin/') || location.pathname.includes('\\admin\\'));
  const ROOT_PREFIX = IN_SUBDIR ? '../' : '';
  const assetUrl = p => (p && !p.startsWith('http') && !p.startsWith('data:') && !p.startsWith('/') && !p.startsWith('../')) ? ROOT_PREFIX + p : (p || '');

  // 1. SYNTHESIZED PAPER FLIP AUDIO (Web Audio API - zero external files required)
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPaperTurnSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const duration = 0.35;
      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown/pink filtered noise burst resembling paper sliding
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // boost
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass / Lowpass filter sweep
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + duration);
      filter.Q.value = 1.8;

      // Gain Envelope
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      noise.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Paper audio synthesis notice:', e);
    }
  }

  // 2. DEFAULT CURATED BOOK DATA
  const DEFAULT_BOOKS = {
    'people-before-process': {
      title: 'People Before Process',
      subtitle: 'Transforming Modern HR Architecture from Compliance to Human Empowerment',
      author: 'PVS Ravindra Varma',
      totalPages: 10,
      pages: [
        {
          type: 'cover',
          title: 'People Before Process',
          subtitle: 'Transforming Modern HR Architecture from Compliance to Human Empowerment',
          author: 'PVS Ravindra Varma',
          emblem: 'assets/logo.png',
          bg: 'linear-gradient(135deg, #1d222b 0%, #111215 100%)'
        },
        {
          type: 'toc',
          chapter: 'Contents & Framework',
          title: 'Table of Contents',
          content: `
            <p><strong>Prologue:</strong> The Bureaucracy Trap in Scaling Enterprises</p>
            <ul>
              <li><strong>Chapter 1:</strong> The Human Dignity Index &amp; Trust Architecture</li>
              <li><strong>Chapter 2:</strong> Culture as an Operating System</li>
              <li><strong>Chapter 3:</strong> The Talent Alchemy Framework</li>
              <li><strong>Chapter 4:</strong> From Transactional Metrics to Purposeful Velocity</li>
              <li><strong>Chapter 5:</strong> Servant Leadership in High-Growth Ecosystems</li>
            </ul>
            <blockquote>"When policies multiply faster than trust, innovation is the first casualty."</blockquote>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 1: The Human Dignity Index',
          title: 'Dismantling Corporate Bureaucracy',
          content: `
            <p>In modern corporate landscapes, organizations often measure everything that is easily quantified and ignore everything that actually matters. Hours logged, badge swipes, and compliance checkboxes create an illusion of control while eroding the foundational spirit of personal agency.</p>
            <p>When high-potential talent feels treated as an interchangeable unit in an unfeeling machine, loyalty evaporates. The solution is not looser management, but deeper alignment.</p>
            <blockquote>"Dignity is not an HR perk; it is the prerequisite for creative excellence."</blockquote>
            <p>Every executive team must audit their organizational rules through a singular lens: does this rule enable high performers to create, or does it exist solely to police low performers?</p>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 1: The Human Dignity Index',
          title: 'The Psychological Safety Equation',
          content: `
            <p>True psychological safety is not the absence of rigor; it is the presence of unconditional candor without fear of vindictive retribution.</p>
            <h3>Three Pillar Practices:</h3>
            <ul>
              <li><strong>Fail-Forward Retrospectives:</strong> De-stigmatize calculated experiments that miss their mark.</li>
              <li><strong>Direct Socratic Querying:</strong> Encourage junior team members to challenge strategic assumptions respectfully.</li>
              <li><strong>Transparent Governance:</strong> Share contextual rationale behind boardroom pivots.</li>
            </ul>
            <p>When psychological safety takes root, teams no longer hoard information or construct political defensive barriers.</p>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 2: Culture as an Operating System',
          title: 'Unwritten Norms vs. Handbooks',
          content: `
            <p>If you wish to understand an enterprise's true culture, do not read their slick mission statement in the reception lobby. Observe what behaviors are tolerated when quotas are tight, and what happens when an executive makes an error.</p>
            <p>Culture is the invisible operating system that silently executes in the background of every meeting, email, and corridor conversation.</p>
            <blockquote>"Your culture is not what you announce; it is the worst behavior your top leadership permits."</blockquote>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 2: Culture as an Operating System',
          title: 'Sustaining Moral Momentum',
          content: `
            <p>High-morale teams do not require constant supervision. When values are deeply internalized, autonomy replaces oversight, accelerating decision-making velocity by orders of magnitude.</p>
            <p>By shifting from paternalistic surveillance to mutual accountability, leaders unlock the latent entrepreneurial spirit within their workforce.</p>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 3: The Talent Alchemy Framework',
          title: 'Nurturing Exceptional Ability',
          content: `
            <p>Exceptional talent is rarely attracted by salary alone. Tier-1 minds gravitate toward challenging problems, ethical mentors, and peers who stretch their horizons.</p>
            <p>Investing in your people’s continuous mastery is the highest-return capital expenditure any board can authorize.</p>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 3: The Talent Alchemy Framework',
          title: 'The Retention Blueprint',
          content: `
            <p>Retention is earned daily through meaningful work, transparent feedback, and authentic recognition of human contribution.</p>
            <blockquote>"Mentorship is the art of believing in someone before their results give them permission to believe in themselves."</blockquote>
          `
        },
        {
          type: 'text',
          chapter: 'Epilogue',
          title: 'A Call to Human-Centric Leadership',
          content: `
            <p>As artificial intelligence and automated systems shoulder repetitive computational tasks, the premium on human discernment, moral courage, and genuine empathy will only multiply.</p>
            <p>Lead with conviction. Put people before process. Build organizations worthy of the human spirit.</p>
          `
        },
        {
          type: 'back-cover',
          title: 'About Mr. PVS Ravindra Varma',
          content: `
            <p style="font-size: 0.9rem; color: #475467; line-height: 1.6;">Mr. PVS Ravindra Varma is an acclaimed executive advisor, author, and senior HR strategist with over 25 years of experience counseling enterprise leaders, youth, and institutions across India.</p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 1.5rem;">To connect for corporate keynotes or counsel: contact@pvsrv.com</p>
          `
        }
      ]
    },
    'culture-that-lasts': {
      title: 'Culture That Lasts',
      subtitle: 'Building Resilient, Purposeful Workplace Cultures Across Generations',
      author: 'PVS Ravindra Varma',
      totalPages: 6,
      pages: [
        {
          type: 'cover',
          title: 'Culture That Lasts',
          subtitle: 'Building Resilient Workplace Cultures Across Generations',
          author: 'PVS Ravindra Varma',
          emblem: 'assets/logo.png',
          bg: 'linear-gradient(135deg, #23201a 0%, #111215 100%)'
        },
        {
          type: 'text',
          chapter: 'Chapter 1',
          title: 'The Enduring Organization',
          content: `<p>Fads and restructuring waves come and go, but institutions that stand for 50 or 100 years anchor themselves to timeless values.</p><blockquote>"Purpose is the north star that guides ships when the compass of market certainty spins out of control."</blockquote>`
        },
        {
          type: 'text',
          chapter: 'Chapter 2',
          title: 'Intergenerational Wisdom',
          content: `<p>Bridging the gap between veteran experience and youthful technological fluency is the quintessential leadership task of the 2020s.</p>`
        },
        {
          type: 'text',
          chapter: 'Chapter 3',
          title: 'The Resilience Quotient',
          content: `<p>Resilience is not merely enduring distress; it is transforming crisis into an accelerator of institutional maturity.</p>`
        },
        {
          type: 'back-cover',
          title: 'Enduring Principles',
          content: `<p>Codified leadership frameworks from decades of hands-on advisory.</p>`
        }
      ]
    },
    'leadership-habit': {
      title: 'The Leadership Habit',
      subtitle: 'Small Daily Micro-Disciplines that Compound into Transformative Organizational Results',
      author: 'PVS Ravindra Varma',
      totalPages: 8,
      coverImg: '/assets/books/leadership-habit.png',
      pages: [
        {
          type: 'cover',
          title: 'The Leadership Habit',
          subtitle: 'Small Shifts. Big Change.',
          author: 'PVS Ravindra Varma',
          coverImg: '/assets/books/leadership-habit.png',
          emblem: 'assets/logo.png',
          bg: 'linear-gradient(135deg, #2b1f1d 0%, #111215 100%)'
        },
        {
          type: 'toc',
          chapter: 'Executive Architecture',
          title: 'Table of Contents',
          content: `
            <p><strong>Prologue:</strong> The Compounding Mathematics of Executive Behavior</p>
            <ul>
              <li><strong>Habit 1:</strong> The 15-Minute Morning Executive Alignment</li>
              <li><strong>Habit 2:</strong> Radical Presence: Listening Beyond the Metrics</li>
              <li><strong>Habit 3:</strong> Socratic Querying in Strategic Pivots</li>
              <li><strong>Habit 4:</strong> Daily Micro-Feedback vs. Annual Rituals</li>
              <li><strong>Habit 5:</strong> Emotional Resilience in Turbulent Markets</li>
            </ul>
            <blockquote>"Great leadership is forged not during comfortable quarters, but in the quiet discipline of unobserved daily habits."</blockquote>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 1: The Alignment Ritual',
          title: 'Grounding in Organizational Purpose',
          content: `
            <p>Every morning, leaders confront an immediate deluge of urgent demands, notifications, and fires to extinguish. Leaders who react immediately surrender their strategic agency before their day even begins.</p>
            <p>The 15-minute executive alignment ritual creates a cognitive buffer. It compels the leader to ask: <em>Which single decision today will move our organizational purpose forward, and which 10 distractions must I actively ignore?</em></p>
            <blockquote>"You do not rise to the level of your quarterly targets; you fall to the level of your daily executive habits."</blockquote>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 1: The Alignment Ritual',
          title: 'Clarity Cascades Downward',
          content: `
            <p>When top executives exhibit calm, deliberate focus, the anxiety index of the entire enterprise drops by orders of magnitude.</p>
            <p>Clarity is not the absence of complexity; it is the courage to distill complexity into crisp, humane, actionable priorities for every team member.</p>
          `
        },
        {
          type: 'text',
          chapter: 'Chapter 2: Radical Presence',
          title: 'The Art of Socratic Querying',
          content: `
            <p>The highest form of respect a leader can offer their people is undivided, phone-free attention during high-stakes strategic discussions.</p>
            <p>When you ask: <em>'What assumption are we making that might be completely wrong?'</em>, you liberate your brightest minds from deference and invite genuine institutional insight.</p>
          `
        },
        {
          type: 'text',
          chapter: 'Epilogue',
          title: 'The Lasting Legacy of Daily Habits',
          content: `
            <p>At the end of a 25-year executive career, you will not remember the endless spreadsheet reconciliations. You will remember the young professionals you mentored into courageous leaders, the cultures of psychological safety you protected, and the organizations you left stronger than you found them.</p>
          `
        },
        {
          type: 'back-cover',
          title: 'About Mr. PVS Ravindra Varma',
          content: `
            <p style="font-size: 0.9rem; color: #475467; line-height: 1.6;">Mr. PVS Ravindra Varma is a senior HR and organizational development leader with over 25 years of hands-on experience guiding Fortune 500 enterprises, SMEs, and public institutions across India.</p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 1.5rem;">To book corporate advisory or keynote sessions: connect@pvsravindravarma.in</p>
          `
        }
      ]
    },
    'human-advantage': {
      title: 'The Human Advantage',
      subtitle: 'Why Empathy, Moral Imagination & Mentorship Outperform Raw Algorithmic Speed',
      author: 'PVS Ravindra Varma',
      totalPages: 6,
      pages: [
        {
          type: 'cover',
          title: 'The Human Advantage',
          subtitle: 'Why Empathy & Moral Imagination Outperform Raw Algorithms',
          author: 'PVS Ravindra Varma',
          coverImg: '/assets/books/human-advantage.png',
          emblem: 'assets/logo.png',
          bg: 'linear-gradient(135deg, #192420 0%, #111215 100%)'
        },
        {
          type: 'text',
          chapter: 'Chapter 1',
          title: 'The Algorithmic Horizon',
          content: `<p>Machines will optimize every computational variable. What remains irreplaceable is the warmth of human encouragement and ethical conviction.</p>`
        },
        {
          type: 'text',
          chapter: 'Chapter 2',
          title: 'The Soul of Leadership',
          content: `<p>True leaders don't just calculate spreadsheets; they ignite the human spirit.</p>`
        },
        {
          type: 'back-cover',
          title: 'Published by PVS Ravindra Varma',
          content: `<p>Available worldwide in print and digital interactive flipbook.</p>`
        }
      ]
    }
  };

  function resolveBook(key) {
    if (DEFAULT_BOOKS[key]) return DEFAULT_BOOKS[key];
    try {
      const dynamicList = (window.PVS_Bridge ? window.PVS_Bridge.getBooks() : JSON.parse(localStorage.getItem('pvsrv_books_catalog') || localStorage.getItem('pvsrv_books') || '[]'));
      const found = dynamicList.find(b => (b.slug === key) || (b.id === key));
      if (found) {
        const chapList = (typeof found.chapters === 'string' ? found.chapters.split('\n') : (found.chapters || []));
        const chaptersHtml = chapList.filter(Boolean).map(ch => `<li><strong>${ch.trim()}</strong></li>`).join('');
        return {
          title: found.title,
          subtitle: found.subtitle || found.synopsis || '',
          author: found.author || 'PVS Ravindra Varma',
          totalPages: 8,
          cover: found.cover || '/assets/books/culture-that-lasts.png',
          pages: [
            {
              type: 'cover',
              title: found.title,
              subtitle: found.subtitle || '',
              author: found.author || 'PVS Ravindra Varma',
              coverImg: found.cover || '/assets/books/culture-that-lasts.png',
              bg: 'linear-gradient(135deg, #1e222d 0%, #111215 100%)'
            },
            {
              type: 'toc',
              chapter: 'Executive Architecture',
              title: 'Table of Contents',
              content: `
                <p><strong>Executive Overview:</strong> ${found.synopsis || 'Strategic publication by PVS Ravindra Varma.'}</p>
                <ul>${chaptersHtml || '<li><strong>Chapter 1: Strategic Foundations</strong></li><li><strong>Chapter 2: People and Culture</strong></li>'}</ul>
                <blockquote>"You do not rise to the level of your goals; you fall to the level of your systems and values."</blockquote>
              `
            },
            {
              type: 'text',
              chapter: 'Chapter 1: Foundational Framework',
              title: 'Core Leadership Thesis',
              content: `<p>${found.synopsis || 'Comprehensive executive handbook exploring organizational resilience, psychological safety, and sustainable leadership pipelines.'}</p><p>True organizational resilience is rooted in deep institutional trust, clear values alignment, and deliberate daily leadership habits.</p>`
            },
            {
              type: 'text',
              chapter: 'Chapter 2: Human Potential',
              title: 'Empowering Modern Teams',
              content: `<p>When organizations prioritize human potential, continuous feedback, and psychological safety, innovation and high performance emerge organically.</p>`
            },
            {
              type: 'back-cover',
              title: 'About Mr. PVS Ravindra Varma',
              content: `<p style="font-size: 0.9rem; color: #475467; line-height: 1.6;">Mr. PVS Ravindra Varma is a senior HR and organizational development leader with over 25 years of hands-on experience guiding Fortune 500 enterprises, SMEs, and public institutions across India.</p><p style="font-size: 0.85rem; color: #94a3b8; margin-top: 1.5rem;">To book corporate advisory or keynote sessions: connect@pvsravindravarma.in</p>`
            }
          ]
        };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_BOOKS['people-before-process'];
  }

  // 3. FLIPBOOK INSTANCE CLASS
  class FlipBook {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`FlipBook container '#${containerId}' not found.`);
        return;
      }

      this.options = Object.assign({
        bookKey: 'people-before-process',
        startPage: 0,
        sound: true,
        zoom: 1.0,
        onPageChange: null
      }, options);

      this.currentBook = resolveBook(this.options.bookKey);
      this.pages = this.currentBook.pages;
      this.currentPage = 0; // Current left page index in 2-page view (0 = Cover / Title spread)
      this.isFlipping = false;
      this.scale = 1.0;

      this.initDOM();
      this.renderCurrentSpread();
      this.bindEvents();
    }

    initDOM() {
      this.container.innerHTML = `
        <div class="fb-book-spread" id="fbSpreadBox">
          <!-- Central Spine 3D Shadow -->
          <div class="fb-spine-shadow"></div>

          <!-- Left Static Page -->
          <div class="fb-page-static left-base" id="fbPageLeft"></div>

          <!-- Right Static Page -->
          <div class="fb-page-static right-base" id="fbPageRight">
            <div class="fb-corner-curl" id="fbCornerNext" title="Click or drag to turn page"></div>
          </div>

          <!-- 3D Turning Sheet Layer -->
          <div class="fb-sheet-layer" id="fbSheetLayer">
            <div class="fb-sheet-face front-face" id="fbSheetFront">
              <div class="fb-corner-curl"></div>
            </div>
            <div class="fb-sheet-face back-face" id="fbSheetBack"></div>
            <div class="fb-turn-shadow" id="fbTurnShadow"></div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button type="button" class="fb-nav-arrow prev" id="fbBtnPrev" aria-label="Previous Page">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" class="fb-nav-arrow next" id="fbBtnNext" aria-label="Next Page">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `;

      this.leftPageEl = document.getElementById('fbPageLeft');
      this.rightPageEl = document.getElementById('fbPageRight');
      this.sheetLayer = document.getElementById('fbSheetLayer');
      this.sheetFront = document.getElementById('fbSheetFront');
      this.sheetBack = document.getElementById('fbSheetBack');
      this.turnShadow = document.getElementById('fbTurnShadow');
      this.btnPrev = document.getElementById('fbBtnPrev');
      this.btnNext = document.getElementById('fbBtnNext');
      this.spreadBox = document.getElementById('fbSpreadBox');
    }

    renderCurrentSpread() {
      // Left Page (even index or blank if on cover spread)
      if (this.currentPage === 0) {
        // Closed cover spread: Left is inside jacket, Right is front cover
        this.leftPageEl.innerHTML = `
          <div class="fb-page-content" style="background:#13151b; justify-content:center; align-items:center; text-align:center;">
            <img src="${assetUrl('assets/logo.png')}" style="width:120px; opacity:0.3; margin-bottom:1rem;" alt="">
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; color:#caa05b;">Inside Front Cover</span>
          </div>
        `;
        this.rightPageEl.innerHTML = this.renderPageHTML(this.pages[0], 0);
      } else {
        const leftIdx = this.currentPage;
        const rightIdx = this.currentPage + 1;

        this.leftPageEl.innerHTML = leftIdx < this.pages.length ? this.renderPageHTML(this.pages[leftIdx], leftIdx) : '<div class="fb-page-content"></div>';
        this.rightPageEl.innerHTML = rightIdx < this.pages.length ? this.renderPageHTML(this.pages[rightIdx], rightIdx) : `
          <div class="fb-page-content" style="justify-content:center; align-items:center; text-align:center; color:#94a3b8;">
            <p>End of Publication Preview</p>
          </div>
        `;
      }

      this.updateControls();
      if (this.filmstripContainer) {
        this.renderFilmstrip();
      }
    }

    renderPageHTML(pageData, idx) {
      if (!pageData) return '<div class="fb-page-content"></div>';

      // If it's a PDF Canvas or pre-rendered image page
      if (pageData.canvasDataUrl || pageData.image) {
        const src = (idx === 0 && this.customCoverImg) ? this.customCoverImg : (pageData.canvasDataUrl || pageData.image);
        const isCover = idx === 0;
        const isBackCover = idx === this.pages.length - 1;

        if (isCover) {
          return `
            <div class="fb-pdf-page fb-cover-page" style="width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center; background:#fff; overflow:hidden; box-shadow:inset 0 0 24px rgba(0,0,0,0.12);">
              <div style="position:absolute; top:12px; right:12px; background:rgba(14,16,21,0.92); color:#caa05b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; padding:0.25rem 0.65rem; border-radius:4px; border:1px solid rgba(202,160,91,0.5); z-index:10; backdrop-filter:blur(6px); box-shadow:0 4px 10px rgba(0,0,0,0.3); display:inline-flex; align-items:center; gap:0.35rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>Front Cover</span>
              </div>
              <img src="${src}" alt="Front Cover" style="width:100%; height:100%; object-fit:contain;">
            </div>
          `;
        }

        if (isBackCover) {
          return `
            <div class="fb-pdf-page fb-backcover-page" style="width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center; background:#fff; overflow:hidden; box-shadow:inset 0 0 24px rgba(0,0,0,0.12);">
              <div style="position:absolute; top:12px; left:12px; background:rgba(14,16,21,0.92); color:#cbd5e1; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; padding:0.25rem 0.65rem; border-radius:4px; border:1px solid rgba(255,255,255,0.2); z-index:10; backdrop-filter:blur(6px); box-shadow:0 4px 10px rgba(0,0,0,0.3); display:inline-flex; align-items:center; gap:0.35rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 19.5A2.5 2.5 0 0 0 17.5 17H4"/><path d="M17.5 2H4v20h13.5A2.5 2.5 0 0 0 20 19.5v-15A2.5 2.5 0 0 0 17.5 2z"/></svg>
                <span>Back Cover</span>
              </div>
              <img src="${src}" alt="Back Cover" style="width:100%; height:100%; object-fit:contain;">
            </div>
          `;
        }

        return `
          <div class="fb-pdf-page fb-interior-page" style="width:100%; height:100%; position:relative; display:flex; align-items:center; justify-content:center; background:#fff; overflow:hidden;">
            <div style="position:absolute; bottom:8px; ${idx % 2 === 0 ? 'right:14px' : 'left:14px'}; font-size:0.7rem; color:#64748b; font-family:monospace; background:rgba(255,255,255,0.92); padding:0.15rem 0.5rem; border-radius:3px; border:1px solid #e2e8f0; z-index:10;">
              Page ${idx + 1}
            </div>
            <img src="${src}" alt="Page ${idx + 1}" style="width:100%; height:100%; object-fit:contain;">
          </div>
        `;
      }

      // If it's Cover
      if (pageData.type === 'cover') {
        const coverSrc = this.customCoverImg || (pageData.coverImg ? assetUrl(pageData.coverImg) : (this.currentBook.coverImg ? assetUrl(this.currentBook.coverImg) : null));
        if (coverSrc) {
          return `
            <div class="fb-page-cover fb-custom-cover" style="position:relative; width:100%; height:100%; overflow:hidden; background:#0d0f12; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 30px rgba(0,0,0,0.4);">
              <div style="position:absolute; top:12px; right:12px; background:rgba(14,16,21,0.92); color:#caa05b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; padding:0.25rem 0.65rem; border-radius:4px; border:1px solid rgba(202,160,91,0.5); z-index:10; backdrop-filter:blur(6px); box-shadow:0 4px 10px rgba(0,0,0,0.3); display:inline-flex; align-items:center; gap:0.35rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>Front Cover</span>
              </div>
              <img src="${coverSrc}" alt="${pageData.title || 'Front Cover'}" style="width:100%; height:100%; object-fit:contain;">
              <div style="position:absolute; bottom:10px; width:100%; text-align:center; font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.7); background:rgba(0,0,0,0.65); padding:0.25rem 0;">
                Click Right Corner to Flip &bull; 3D Interactive
              </div>
            </div>
          `;
        }
        return `
          <div class="fb-page-cover" style="background: ${pageData.bg || 'linear-gradient(135deg, #1b1e26 0%, #0d0f12 100%)'}; position:relative;">
            <div style="position:absolute; top:12px; right:12px; background:rgba(14,16,21,0.92); color:#caa05b; font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; padding:0.25rem 0.65rem; border-radius:4px; border:1px solid rgba(202,160,91,0.5); z-index:10; backdrop-filter:blur(6px); display:inline-flex; align-items:center; gap:0.35rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Front Cover</span>
            </div>
            <img src="${assetUrl(pageData.emblem || 'assets/logo.png')}" alt="Emblem" class="fb-cover-emblem">
            <h1 class="fb-cover-title">${pageData.title}</h1>
            <p class="fb-cover-subtitle">${pageData.subtitle}</p>
            <div style="height:2px; width:60px; background:#caa05b; margin:1.5rem auto;"></div>
            <div class="fb-cover-author">${pageData.author}</div>
            <div style="margin-top:auto; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:#94a3b8;">
              Executive Digital Edition &bull; Click Corner to Open
            </div>
          </div>
        `;
      }

      // If it's Back Cover
      if (pageData.type === 'back-cover') {
        return `
          <div class="fb-page-content" style="background:#f4efe4; border-left:1px solid #ddd;">
            <div class="fb-page-running-head">
              <span>About the Author</span>
              <span>PVS Ravindra Varma</span>
            </div>
            <div class="fb-page-body" style="display:flex; flex-direction:column; justify-content:center; text-align:center; padding:2rem 1rem;">
              <img src="${assetUrl('assets/ravindravarma.jpeg')}" alt="Author" style="width:90px; height:90px; border-radius:50%; margin:0 auto 1.25rem; object-fit:cover; border:2px solid #caa05b; box-shadow:0 8px 16px rgba(0,0,0,0.15);">
              <h2 style="font-size:1.35rem; margin-bottom:0.75rem;">${pageData.title}</h2>
              ${pageData.content}
            </div>
            <div class="fb-page-footer">
              <span>PVS Varma Books</span>
              <span>Back Cover</span>
            </div>
          </div>
        `;
      }

      // Standard Chapter Page
      return `
        <div class="fb-page-content">
          <div class="fb-page-running-head">
            <span>${pageData.chapter || this.currentBook.title}</span>
            <span>${this.currentBook.author}</span>
          </div>
          <div class="fb-page-body">
            <h2>${pageData.title || ''}</h2>
            ${pageData.content || ''}
          </div>
          <div class="fb-page-footer">
            <span>${this.currentBook.title}</span>
            <span>Page ${idx + 1}</span>
          </div>
        </div>
      `;
    }

    flipNext() {
      if (this.isFlipping) return;
      if (this.currentPage >= this.pages.length - 2) return;

      this.isFlipping = true;
      playPaperTurnSound();

      // Setup 3D turning sheet
      const currentRightIdx = this.currentPage === 0 ? 0 : this.currentPage + 1;
      const nextLeftIdx = this.currentPage === 0 ? 1 : this.currentPage + 2;

      this.sheetFront.innerHTML = this.renderPageHTML(this.pages[currentRightIdx], currentRightIdx);
      this.sheetBack.innerHTML = nextLeftIdx < this.pages.length ? this.renderPageHTML(this.pages[nextLeftIdx], nextLeftIdx) : '<div class="fb-page-content"></div>';

      // Pre-render the new background underneath
      const targetPage = this.currentPage === 0 ? 1 : this.currentPage + 2;
      const nextRightIdx = targetPage + 1;
      this.rightPageEl.innerHTML = nextRightIdx < this.pages.length ? this.renderPageHTML(this.pages[nextRightIdx], nextRightIdx) : '<div class="fb-page-content"></div>';

      this.sheetLayer.style.display = 'block';
      this.sheetLayer.style.transform = 'rotateY(0deg)';
      this.turnShadow.style.opacity = '1';

      // Trigger 3D turn
      requestAnimationFrame(() => {
        this.sheetLayer.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
        this.sheetLayer.style.transform = 'rotateY(-180deg)';
      });

      setTimeout(() => {
        this.currentPage = targetPage;
        this.renderCurrentSpread();
        this.sheetLayer.style.display = 'none';
        this.sheetLayer.style.transform = 'rotateY(0deg)';
        this.turnShadow.style.opacity = '0';
        this.isFlipping = false;

        if (this.options.onPageChange) this.options.onPageChange(this.currentPage, this.pages.length);
      }, 650);
    }

    flipPrev() {
      if (this.isFlipping) return;
      if (this.currentPage <= 0) return;

      this.isFlipping = true;
      playPaperTurnSound();

      const targetPage = this.currentPage === 1 ? 0 : this.currentPage - 2;

      // Current left flips backwards onto the right
      const currentLeftIdx = this.currentPage;
      const targetRightIdx = targetPage === 0 ? 0 : targetPage + 1;

      this.sheetFront.innerHTML = targetRightIdx < this.pages.length ? this.renderPageHTML(this.pages[targetRightIdx], targetRightIdx) : '<div class="fb-page-content"></div>';
      this.sheetBack.innerHTML = this.renderPageHTML(this.pages[currentLeftIdx], currentLeftIdx);

      // Pre-render destination under left
      if (targetPage === 0) {
        this.leftPageEl.innerHTML = `
          <div class="fb-page-content" style="background:#13151b; justify-content:center; align-items:center; text-align:center;">
            <img src="${assetUrl('assets/logo.png')}" style="width:120px; opacity:0.3; margin-bottom:1rem;" alt="">
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; color:#caa05b;">Inside Front Cover</span>
          </div>
        `;
      } else {
        this.leftPageEl.innerHTML = this.renderPageHTML(this.pages[targetPage], targetPage);
      }

      this.sheetLayer.style.display = 'block';
      this.sheetLayer.style.transition = 'none';
      this.sheetLayer.style.transform = 'rotateY(-180deg)';
      this.turnShadow.style.opacity = '1';

      requestAnimationFrame(() => {
        this.sheetLayer.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
        this.sheetLayer.style.transform = 'rotateY(0deg)';
      });

      setTimeout(() => {
        this.currentPage = targetPage;
        this.renderCurrentSpread();
        this.sheetLayer.style.display = 'none';
        this.turnShadow.style.opacity = '0';
        this.isFlipping = false;

        if (this.options.onPageChange) this.options.onPageChange(this.currentPage, this.pages.length);
      }, 650);
    }

    jumpToPage(pageIndex) {
      if (pageIndex < 0 || pageIndex >= this.pages.length) return;
      playPaperTurnSound();
      this.currentPage = pageIndex % 2 === 0 && pageIndex !== 0 ? pageIndex - 1 : pageIndex;
      this.renderCurrentSpread();
      if (this.options.onPageChange) this.options.onPageChange(this.currentPage, this.pages.length);
    }

    loadCustomPDF(pdfFile, callback) {
      if (!window.pdfjsLib) {
        alert('PDF.js library is loading. Please try again in a moment.');
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const typedArray = new Uint8Array(e.target.result);
        window.pdfjsLib.getDocument({ data: typedArray }).promise.then((pdf) => {
          const numPages = pdf.numPages;
          const renderedPages = [];
          let pagesLoaded = 0;

          // Render each PDF page to an offscreen high-res canvas
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            ((pNum) => {
              pdf.getPage(pNum).then((page) => {
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                page.render({ canvasContext: ctx, viewport: viewport }).promise.then(() => {
                  renderedPages[pNum - 1] = {
                    type: 'pdf',
                    canvasDataUrl: canvas.toDataURL('image/jpeg', 0.92)
                  };
                  pagesLoaded++;

                  if (pagesLoaded === numPages) {
                    this.pages = renderedPages;
                    this.currentPage = 0;
                    this.renderCurrentSpread();
                    if (callback) callback(numPages);
                  }
                });
              });
            })(pageNum);
          }
        }).catch(err => {
          console.error('Error parsing PDF:', err);
          alert('Could not render PDF. Please ensure it is a valid PDF document.');
        });
      };
      fileReader.readAsArrayBuffer(pdfFile);
    }

    loadBook(bookKey) {
      const book = resolveBook(bookKey);
      if (book) {
        this.currentBook = book;
        this.pages = this.currentBook.pages;
        this.currentPage = 0;
        this.renderCurrentSpread();
        if (this.options.onPageChange) this.options.onPageChange(0, this.pages.length);
      }
    }

    updateControls() {
      if (this.btnPrev) this.btnPrev.disabled = this.currentPage <= 0;
      if (this.btnNext) this.btnNext.disabled = this.currentPage >= this.pages.length - 2;

      // Update external indicators if element exists
      const indicator = document.getElementById('fbPageIndicator');
      if (indicator) {
        if (this.currentPage === 0) {
          indicator.textContent = `Cover (Page 1 of ${this.pages.length})`;
        } else if (this.currentPage >= this.pages.length - 2) {
          indicator.textContent = `Back Cover (Page ${this.pages.length} of ${this.pages.length})`;
        } else {
          const pLeft = this.currentPage + 1;
          const pRight = Math.min(this.currentPage + 2, this.pages.length);
          indicator.textContent = `Spread: Pages ${pLeft}–${pRight} of ${this.pages.length}`;
        }
      }

      const cmsBadge = document.getElementById('cmsPageIndicatorBadge');
      if (cmsBadge) {
        if (this.currentPage === 0) {
          cmsBadge.textContent = `Front Cover (Page 1 of ${this.pages.length})`;
        } else if (this.currentPage >= this.pages.length - 2) {
          cmsBadge.textContent = `Back Cover (Page ${this.pages.length} of ${this.pages.length})`;
        } else {
          const pLeft = this.currentPage + 1;
          const pRight = Math.min(this.currentPage + 2, this.pages.length);
          cmsBadge.textContent = `Pages ${pLeft}–${pRight} of ${this.pages.length}`;
        }
      }

      const slider = document.getElementById('fbPageSlider');
      if (slider) {
        slider.max = this.pages.length - 1;
        slider.value = this.currentPage;
      }
    }

    bindEvents() {
      this.btnNext.addEventListener('click', () => this.flipNext());
      this.btnPrev.addEventListener('click', () => this.flipPrev());

      // Click corner curls
      const cornerNext = document.getElementById('fbCornerNext');
      if (cornerNext) {
        cornerNext.addEventListener('click', (e) => {
          e.stopPropagation();
          this.flipNext();
        });
      }

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          this.flipNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          this.flipPrev();
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.jumpToPage(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          this.jumpToPage(this.pages.length - 1);
        }
      });

      // Click right page surface to advance
      this.rightPageEl.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        this.flipNext();
      });

      // Click left page surface to go back
      this.leftPageEl.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        if (this.currentPage > 0) this.flipPrev();
      });
    }

    setZoom(val) {
      this.scale = Math.max(0.8, Math.min(1.5, val));
      if (this.spreadBox) {
        this.spreadBox.style.transform = `scale(${this.scale})`;
      }
    }

    toggleSound() {
      soundEnabled = !soundEnabled;
      return soundEnabled;
    }

    setCustomCover(coverImgUrl) {
      this.customCoverImg = coverImgUrl;
      this.renderCurrentSpread();
      if (this.filmstripContainer) {
        this.renderFilmstrip();
      }
    }

    mountFilmstrip(containerId) {
      this.filmstripContainer = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      this.renderFilmstrip();
    }

    renderFilmstrip() {
      if (!this.filmstripContainer) return;
      const pages = this.pages || [];
      if (!pages.length) {
        this.filmstripContainer.innerHTML = '<div style="color:#64748b; font-size:0.75rem; padding:0.5rem;">No pages to display.</div>';
        return;
      }

      this.filmstripContainer.innerHTML = `
        <div class="fb-filmstrip-scroll" style="display:flex; gap:0.65rem; overflow-x:auto; padding:0.5rem 0.25rem; scrollbar-width:thin;">
          ${pages.map((p, idx) => {
            const isCover = idx === 0;
            const isBackCover = idx === pages.length - 1;
            const isCurrentSpread = (this.currentPage === 0 && idx === 0) || (idx === this.currentPage || idx === this.currentPage + 1);
            const label = isCover ? 'Cover' : (isBackCover ? 'Back Cover' : `P. ${idx + 1}`);
            const thumbImg = (idx === 0 && this.customCoverImg) ? this.customCoverImg : (p.canvasDataUrl || p.image || (isCover && this.currentBook.coverImg ? assetUrl(this.currentBook.coverImg) : null));

            return `
              <button type="button" class="fb-filmstrip-item ${isCurrentSpread ? 'active' : ''}" data-page="${idx}" style="flex:0 0 74px; height:102px; display:flex; flex-direction:column; align-items:center; justify-content:space-between; background:${isCover ? '#1c1e24' : (isBackCover ? '#1e2029' : '#ffffff')}; border:${isCurrentSpread ? '2px solid #caa05b' : '1px solid rgba(255,255,255,0.18)'}; border-radius:6px; cursor:pointer; padding:3px; position:relative; overflow:hidden; transition:all 0.18s ease; box-shadow:${isCurrentSpread ? '0 0 14px rgba(202,160,91,0.5)' : 'none'};">
                <div style="flex:1; width:100%; display:flex; align-items:center; justify-content:center; overflow:hidden; background:${isCover || isBackCover ? '#111317' : '#f8fafc'}; border-radius:3px;">
                  ${thumbImg ? `<img src="${thumbImg}" alt="P.${idx+1}" style="width:100%; height:100%; object-fit:contain; border-radius:2px;">` : `<span style="font-size:0.62rem; color:${isCover || isBackCover ? '#caa05b' : '#334155'}; font-weight:700; text-align:center; padding:2px; line-height:1.2;">${p.title ? p.title.slice(0, 15) : 'Spread'}</span>`}
                </div>
                <div style="width:100%; font-size:0.64rem; font-weight:700; text-align:center; padding:3px 0; background:rgba(14,16,21,0.92); color:${isCurrentSpread ? '#caa05b' : '#cbd5e1'}; border-radius:3px; margin-top:2px;">
                  ${label}
                </div>
              </button>
            `;
          }).join('')}
        </div>
      `;

      this.filmstripContainer.querySelectorAll('.fb-filmstrip-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pIdx = parseInt(btn.dataset.page, 10);
          this.jumpToPage(pIdx);
        });
      });
    }
  }

  window.PVS_FlipBook = FlipBook;
  window.PVS_BOOKS = DEFAULT_BOOKS;

})(window);
