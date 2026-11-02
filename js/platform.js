/**
 * PVS RAVINDRA VARMA - CONTENT PLATFORM LAYER
 * Mega navigation, content loading and the reusable page templates
 * (hub.html, category.html, item.html, sitemap.html).
 *
 * Depends on content/registry.js. Loads after app.js.
 * Styling reuses style.css components; new pieces live in platform.css.
 *
 * Content files are plain scripts (content/<section>/<category>.js) that call
 * PVS.register(key, items). Scripts are used instead of fetch() so the site
 * also works when opened straight from disk.
 */
(function () {
  const REG = window.PVS_REGISTRY;
  if (!REG) return;

  const store = {};
  const pending = {};
  const params = new URLSearchParams(location.search);
  const PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const PAGE_SIZE = 12;

  const TYPE_META = {
    article: { verb: 'Read Article' },
    story: { verb: 'Read Story' },
    event: { verb: 'View Details' },
    quiz: { verb: 'Start Quiz' },
    profile: { verb: 'View Profile' },
    book: { verb: 'View Details' },
    gallery: { verb: 'View' }
  };

  const ARROW = '<svg class="arrow-icon" viewBox="0 0 20 20" width="15" height="15" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
  const CHECK = '<svg class="check-ico" viewBox="0 0 20 20" width="16" height="16" fill="#caa05b"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
  const CHEVRON = '<svg class="nav-chevron" viewBox="0 0 20 20" width="12" height="12" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';

  /* ==========================================================================
     1. REGISTRY LOOKUPS, URLS & LOADING
     ========================================================================== */
  const section = id => REG.sections.find(s => s.id === id);
  const category = (sec, id) => sec && sec.categories.find(c => c.id === id);
  const typeOf = (sec, cat) => (cat && cat.type) || sec.type;

  const IN_SUBDIR = (typeof location !== 'undefined') && (location.pathname.includes('/pages/') || location.pathname.includes('\\pages\\') || location.pathname.includes('/admin/') || location.pathname.includes('\\admin\\'));
  const PAGE_PREFIX = IN_SUBDIR ? '' : 'pages/';
  const ROOT_PREFIX = IN_SUBDIR ? '../' : '';

  function assetUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) return path;
    return ROOT_PREFIX + path;
  }

  const hubUrl = sec => {
    const raw = sec.hub || `hub.html?s=${sec.id}`;
    return PAGE_PREFIX + raw;
  };
  const catUrl = (sId, cId) => `${PAGE_PREFIX}category.html?s=${sId}&c=${cId}`;
  const PREVIEW = params.get('preview') === '1';
  const itemUrl = (sId, cId, id) => `${PAGE_PREFIX}item.html?s=${sId}&c=${cId}&id=${encodeURIComponent(id)}${PREVIEW ? '&preview=1' : ''}`;

  function register(key, data) {
    store[key] = data;
  }

  function loadKey(key) {
    if (key in store) return Promise.resolve(store[key]);
    if (pending[key]) return pending[key];
    pending[key] = new Promise(resolve => {
      const s = document.createElement('script');
      s.src = `${ROOT_PREFIX}content/${key}.js`;
      s.onload = () => resolve(store[key] || null);
      s.onerror = () => { store[key] = null; resolve(null); };
      document.head.appendChild(s);
    });
    return pending[key];
  }

  // Items of one category, tagged with their location. `?preview=1` fills empty
  // categories with the sample entries from content/_templates/ for layout review.
  async function loadCategory(sec, cat) {
    let items = await loadKey(`${sec.id}/${cat.id}`);
    if ((!items || !items.length) && PREVIEW) {
      items = await loadKey(`_templates/${typeOf(sec, cat)}`);
    }
    return (items || []).map(it => Object.assign({}, it, { _s: sec.id, _c: cat.id }));
  }

  const loadSection = sec => Promise.all(sec.categories.map(c => loadCategory(sec, c)));

  const isSlot = it => it.status === 'placeholder';

  /* ==========================================================================
     2. SMALL HELPERS
     ========================================================================== */
  function esc(str) {
    if (str === undefined || str === null) return '';
    return String(str).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  // Accepts 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'.
  function fmtDate(value, withDay) {
    if (!value) return '';
    const [y, m, d] = String(value).split('-').map(Number);
    if (!m) return String(y);
    const date = new Date(y, m - 1, d || 1);
    return date.toLocaleDateString('en-US', withDay && d ? { day: 'numeric', month: 'long', year: 'numeric' } : { month: 'long', year: 'numeric' });
  }

  function countLabel(sec, n) {
    return `${n.toLocaleString()} ${n === 1 ? sec.noun[0] : sec.noun[1]}`;
  }

  function setMeta(title, desc) {
    document.title = `${title} | Mr. PVS Ravindra Varma`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && desc) meta.setAttribute('content', desc);
  }

  function toast(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg);
    else if (typeof showToast === 'function') showToast(msg);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sortItems(items, mode) {
    const name = it => (it.title || '').toLowerCase();
    const date = it => String(it.date || it.month || '');
    const copy = items.slice();
    if (mode === 'az') return copy.sort((a, b) => name(a).localeCompare(name(b)));
    if (mode === 'old') return copy.sort((a, b) => date(a).localeCompare(date(b)));
    return copy.sort((a, b) => date(b).localeCompare(date(a)));
  }

  function matches(it, q) {
    if (!q) return true;
    const hay = [it.title, it.subtitle, it.excerpt, it.author, it.role, it.organisation, (it.tags || []).join(' ')]
      .filter(Boolean).join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every(word => hay.includes(word));
  }

  /* ==========================================================================
     3. HEADER MEGA-MENU & FOOTER
     ========================================================================== */
  function activeNavIndex() {
    const pageSection = { 'blogs.html': 'blogs', 'books.html': 'books', 'videos.html': 'gallery' }[PAGE] || params.get('s');
    return REG.nav.findIndex(n => (n.groups ? n.groups.includes(pageSection) : n.href === PAGE));
  }

  function pageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('#')) return path;
    if (path === 'index.html') return `${ROOT_PREFIX}index.html`;
    return `${PAGE_PREFIX}${path}`;
  }

  function megaColumn(sec) {
    const links = sec.categories.map(c => `<li><a href="${catUrl(sec.id, c.id)}">${esc(c.title)}</a></li>`)
      .concat((sec.extraLinks || []).map(l => `<li><a href="${pageUrl(l.href)}">${esc(l.label)}</a></li>`));
    return `
      <div class="mega-col">
        <span class="mega-heading">${esc(sec.title)}</span>
        <ul class="mega-links${links.length > 6 ? ' is-split' : ''}">${links.join('')}</ul>
        <a class="mega-all" href="${hubUrl(sec)}">All ${esc(sec.noun[1])} →</a>
      </div>`;
  }

  function renderNav() {
    const list = document.querySelector('#navMenu .nav-list');
    if (!list) return;
    const active = activeNavIndex();

    list.innerHTML = REG.nav.map((n, i) => {
      const cls = i === active ? ' active' : '';
      if (!n.groups) return `<li class="nav-item${n.mobileOnly ? ' nav-mobile-only' : ''}"><a href="${pageUrl(n.href)}" class="nav-link${cls}">${esc(n.label)}</a></li>`;
      const secs = n.groups.map(section).filter(Boolean);
      return `
        <li class="nav-item has-mega${secs.length > 1 ? ' is-wide' : ''}">
          <button type="button" class="nav-link nav-trigger${cls}" aria-expanded="false" aria-controls="mega-${i}">${esc(n.label)}${CHEVRON}</button>
          <div class="mega-panel" id="mega-${i}">
            <div class="mega-grid" style="--mega-cols:${secs.length}">${secs.map(megaColumn).join('')}</div>
          </div>
        </li>`;
    }).join('');

    bindMega(list);
  }

  function bindMega(list) {
    const items = list.querySelectorAll('.has-mega');
    const hoverable = window.matchMedia('(hover: hover) and (min-width: 1101px)');
    const navMenu = document.getElementById('navMenu');
    const toggleBtn = document.getElementById('mobileToggleBtn');

    const setOpen = (li, open) => {
      li.classList.toggle('open', open);
      li.querySelector('.nav-trigger').setAttribute('aria-expanded', open);
    };
    const closeAll = except => items.forEach(li => { if (li !== except) setOpen(li, false); });

    items.forEach(li => {
      const trigger = li.querySelector('.nav-trigger');
      let timer;

      trigger.addEventListener('click', () => {
        const open = !li.classList.contains('open');
        closeAll(li);
        setOpen(li, open);
      });

      li.addEventListener('mouseenter', () => {
        if (!hoverable.matches) return;
        clearTimeout(timer);
        closeAll(li);
        setOpen(li, true);
      });

      li.addEventListener('mouseleave', () => {
        if (!hoverable.matches) return;
        timer = setTimeout(() => setOpen(li, false), 180);
      });
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.has-mega')) closeAll();
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const open = list.querySelector('.has-mega.open');
      if (open) {
        setOpen(open, false);
        open.querySelector('.nav-trigger').focus();
      }
    });

    // Following any menu link closes the mobile drawer.
    list.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu && navMenu.classList.remove('open');
      toggleBtn && toggleBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  function renderFooter() {
    const nav = document.querySelector('.footer-links-nav');
    if (!nav) return;
    const links = [
      { label: 'Home', href: pageUrl('index.html') },
      { label: 'About', href: pageUrl('about.html') },
      { label: 'Books', href: pageUrl('books.html') },
      { label: 'Blogs', href: pageUrl('blogs.html') },
      { label: 'Stories', href: hubUrl(section('stories')) },
      { label: 'Quiz', href: hubUrl(section('quiz')) },
      { label: 'Videos', href: pageUrl('videos.html') },
      { label: "Who's Who", href: hubUrl(section('whoswho')) },
      { label: 'Contact', href: pageUrl('contact.html') },
      { label: 'Sitemap', href: pageUrl('sitemap.html') }
    ];
    nav.innerHTML = links.map(l => `<a href="${l.href}"${l.href.endsWith(PAGE) ? ' class="active"' : ''}>${esc(l.label)}</a>`).join('');
  }

  /* ==========================================================================
     4. SHARED MARKUP BUILDERS
     ========================================================================== */
  function heroHTML({ crumbs = [], label, title, lead, meta }) {
    const trail = crumbs.map((c, i) => (i === crumbs.length - 1
      ? `<span aria-current="page">${esc(c.label)}</span>`
      : `<a href="${c.href}">${esc(c.label)}</a><span class="ia-crumb-sep" aria-hidden="true">/</span>`)).join('');
    return `
      <section class="page-hero-banner">
        <div class="content-wrapper">
          ${crumbs.length ? `<nav class="ia-breadcrumbs" aria-label="Breadcrumb">${trail}</nav>` : ''}
          ${label ? `<span class="section-label-gold">${esc(label)}</span>` : ''}
          <h1 class="page-main-heading">${esc(title)}</h1>
          ${lead ? `<p class="page-sub-lead">${esc(lead)}</p>` : ''}
          ${meta ? `<div class="ia-hero-meta">${meta}</div>` : ''}
        </div>
      </section>`;
  }

  const crumbsFor = (sec, cat, item) => [
    { label: 'Home', href: `${ROOT_PREFIX}index.html` },
    sec && { label: sec.title, href: hubUrl(sec) },
    cat && { label: cat.title, href: catUrl(sec.id, cat.id) },
    item && { label: item.title.length > 48 ? item.title.slice(0, 46) + '…' : item.title }
  ].filter(Boolean);

  function titleStrip(label, title, lead, action) {
    return `
      <div class="section-title-strip">
        <div>
          <span class="section-label-gold">${esc(label)}</span>
          <h2 class="section-title-serif">${esc(title)}</h2>
          ${lead ? `<p class="section-lead-text">${esc(lead)}</p>` : ''}
        </div>
        ${action || ''}
      </div>`;
  }

  function emptyHTML(title, text, action) {
    return `
      <div class="ia-empty">
        <span class="section-label-gold">COMING SOON</span>
        <h3 class="ia-empty-title">${esc(title)}</h3>
        <p class="ia-empty-text">${esc(text)}</p>
        ${action || ''}
      </div>`;
  }

  function categoryCard(sec, cat, count) {
    return `
      <a class="blog-archive-card ia-cat-card" href="${catUrl(sec.id, cat.id)}">
        <div class="bac-content">
          <div class="bac-meta"><span class="tag-badge">${typeOf(sec, cat) === 'bank' ? 'Practice Mode' : count ? countLabel(sec, count) : 'Coming Soon'}</span></div>
          <h3 class="bac-title">${esc(cat.title)}</h3>
          <p class="bac-summary">${esc(cat.desc)}</p>
          <div class="bac-footer"><span class="btn-read-article">Explore ${esc(cat.title)} →</span></div>
        </div>
      </a>`;
  }

  function thumbHTML(it, tagText, portrait) {
    const rawImg = it.image || it.photo || it.cover;
    const img = assetUrl(rawImg);
    const tag = tagText ? `<span class="bac-tag">${esc(tagText.toUpperCase())}</span>` : '';
    if (img) {
      return `<div class="bac-thumb-wrap${portrait ? ' ia-thumb-portrait' : ''}"><img src="${esc(img)}" alt="${esc(it.alt || it.title)}" class="bac-img" loading="lazy">${tag}</div>`;
    }
    return `<div class="bac-thumb-wrap ia-thumb-fallback"><span class="ia-thumb-initial" aria-hidden="true">${esc((it.title || '?').trim().charAt(0))}</span>${tag}</div>`;
  }

  function cardMeta(it, type) {
    const bits = [];
    if (type === 'quiz') {
      const n = it.questions ? it.questions.length : (it.bank && it.bank.count);
      if (it.month) bits.push(fmtDate(it.month));
      if (n) bits.push(`${n} Questions`);
      if (it.difficulty) bits.push(it.difficulty);
    } else if (type === 'profile') {
      if (it.role) bits.push(it.role);
    } else if (type === 'event') {
      if (it.eventDate || it.date) bits.push(fmtDate(it.eventDate || it.date, true));
      if (it.venue) bits.push(it.venue);
    } else {
      if (it.date) bits.push(fmtDate(it.date));
      if (it.readTime) bits.push(it.readTime);
      if (it.ageGroup) bits.push(it.ageGroup);
    }
    return bits.map(esc).join('<span>•</span>');
  }

  function slotCard(it, type) {
    if (type === 'book') {
      return `
        <article class="book-full-card ia-slot">
          <div class="book-full-cover-stage"><div class="ia-slot-cover"><span>Title to be<br>announced</span></div></div>
          <div class="book-full-info">
            <div class="book-meta-tags"><span class="tag-badge">${esc(it.label || 'Upcoming')}</span></div>
            <h3 class="book-full-title">${esc(it.title || 'Upcoming Title')}</h3>
            <p class="book-full-desc">${esc(it.excerpt || 'Details of this forthcoming book will be announced soon.')}</p>
            <div class="book-card-actions"><a href="${PAGE_PREFIX}contact.html?subject=Notify+me+about+upcoming+books" class="btn-link-detail">Notify Me on Release →</a></div>
          </div>
        </article>`;
    }
    return `
      <article class="blog-archive-card ia-slot">
        <div class="bac-content">
          <div class="bac-meta"><span class="tag-badge">${esc(it.label || 'Coming Soon')}</span></div>
          <h3 class="bac-title">${esc(it.title || 'To be announced')}</h3>
          <p class="bac-summary">${esc(it.excerpt || 'This slot is reserved for upcoming content.')}</p>
        </div>
      </article>`;
  }

  function itemCard(it, type, showCategory) {
    if (isSlot(it)) return slotCard(it, type);
    const sec = section(it._s);
    const cat = category(sec, it._c);
    const href = itemUrl(it._s, it._c, it.id);

    if (type === 'book') {
      const legacy = it.legacy && typeof BOOKS_OUTLINES !== 'undefined' ? BOOKS_OUTLINES[it.legacy] : null;
      const actions = it.status === 'published'
        ? `<a href="${PAGE_PREFIX}contact.html?subject=Inquiry+${encodeURIComponent(it.title)}" class="btn btn-brown-pill btn-sm">Order Copy</a>`
        : `<a href="${PAGE_PREFIX}contact.html?subject=Notify+me+${encodeURIComponent(it.title)}" class="btn btn-brown-pill btn-sm">Notify Me</a>`;
      return `
        <article class="book-full-card">
          <div class="book-full-cover-stage">${it.cover
            ? `<img src="${esc(assetUrl(it.cover))}" alt="${esc(it.title)} Book Cover" class="book-full-cover-img" loading="lazy">`
            : '<div class="ia-slot-cover"><span>Cover<br>coming soon</span></div>'}</div>
          <div class="book-full-info">
            <div class="book-meta-tags">
              <span class="tag-badge">${esc(it.genre || (cat && cat.title) || '')}</span>
              ${it.pages ? `<span class="tag-pages">${esc(it.pages)} Pages</span>` : ''}
              ${it.year ? `<span class="tag-pages">${esc(it.year)}</span>` : ''}
            </div>
            <h3 class="book-full-title">${esc(it.title)}</h3>
            <p class="book-full-desc">${esc(it.excerpt || (legacy && legacy.synopsis) || '')}</p>
            ${it.points && it.points.length ? `<div class="book-full-points">${it.points.map(p => `<div class="bf-point">✓ ${esc(p)}</div>`).join('')}</div>` : ''}
            <div class="book-card-actions">${actions}<a class="btn-link-detail" href="${href}">View Details →</a></div>
          </div>
        </article>`;
    }

    if (type === 'gallery') {
      return `
        <a class="ia-gallery-tile" href="${href}">
          <img src="${esc(assetUrl(it.image))}" alt="${esc(it.alt || it.title)}" loading="lazy">
          <span class="ia-gallery-cap">${esc(it.title)}</span>
        </a>`;
    }

    const tagText = showCategory && cat ? cat.title : (it.tags && it.tags[0]) || (cat && cat.title);
    const summary = type === 'profile' ? it.organisation && `${it.organisation}${it.excerpt ? ' — ' + it.excerpt : ''}` : it.excerpt;
    return `
      <article class="blog-archive-card${type === 'profile' ? ' ia-card-profile' : ''}">
        ${thumbHTML(it, tagText, type === 'profile')}
        <div class="bac-content">
          <div class="bac-meta">${cardMeta(it, type)}</div>
          <h3 class="bac-title"><a href="${href}">${esc(it.title)}</a></h3>
          <p class="bac-summary">${esc(summary || it.excerpt || '')}</p>
          <div class="bac-footer"><a class="btn-read-article" href="${href}">${TYPE_META[type] ? TYPE_META[type].verb : 'View'} →</a></div>
        </div>
      </article>`;
  }

  const gridClass = type => (type === 'book' ? 'books-detailed-grid' : type === 'gallery' ? 'ia-gallery-grid' : 'blogs-archive-grid');

  /* ==========================================================================
     5. LISTING COMPONENT (search · filter · sort · paginate)
     Used by category pages, section hubs and the blogs archive.
     ========================================================================== */
  function mountListing(root, items, opts) {
    const o = Object.assign({ pageSize: PAGE_SIZE, sort: 'new', filters: null, syncUrl: false, showCategory: false, empty: '' }, opts);
    const state = {
      q: o.syncUrl ? params.get('q') || '' : '',
      sort: (o.syncUrl && params.get('sort')) || o.sort,
      f: (o.syncUrl && params.get('f')) || 'all',
      p: o.syncUrl ? Math.max(1, +params.get('p') || 1) : 1
    };
    const slots = items.filter(isSlot);
    const real = items.filter(it => !isSlot(it));

    root.innerHTML = `
      <div class="category-filter-wrapper ia-toolbar-wrap">
        ${o.filters ? `<div class="category-filter-bar" role="tablist">${[{ id: 'all', label: 'All' }].concat(o.filters).map(f =>
          `<button type="button" class="filter-tag" role="tab" data-f="${f.id}">${esc(f.label)}</button>`).join('')}</div>` : ''}
        ${real.length > 1 ? `
        <div class="ia-toolbar">
          <input type="search" class="ia-search-input" placeholder="${esc(o.placeholder || 'Search…')}" aria-label="${esc(o.placeholder || 'Search')}" value="${esc(state.q)}">
          <select class="ia-sort-select" aria-label="Sort by">
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="az">A – Z</option>
          </select>
          <span class="ia-result-count" aria-live="polite"></span>
        </div>` : ''}
      </div>
      <div class="${gridClass(o.type)} ia-listing-grid"></div>
      <nav class="ia-pagination" aria-label="Pagination"></nav>`;

    const grid = root.querySelector('.ia-listing-grid');
    const pager = root.querySelector('.ia-pagination');
    const count = root.querySelector('.ia-result-count');
    const input = root.querySelector('.ia-search-input');
    const select = root.querySelector('.ia-sort-select');
    if (select) select.value = state.sort;

    function sync() {
      if (!o.syncUrl) return;
      const next = new URLSearchParams(location.search);
      ['q', 'sort', 'f', 'p'].forEach(k => next.delete(k));
      if (state.q) next.set('q', state.q);
      if (state.sort !== o.sort) next.set('sort', state.sort);
      if (state.f !== 'all') next.set('f', state.f);
      if (state.p > 1) next.set('p', state.p);
      history.replaceState(null, '', `${location.pathname}?${next}`);
    }

    function draw(scroll) {
      root.querySelectorAll('[data-f]').forEach(b => {
        const on = b.dataset.f === state.f;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
      });

      const list = sortItems(real.filter(it => (state.f === 'all' || it._c === state.f) && matches(it, state.q)), state.sort);
      const pages = Math.max(1, Math.ceil(list.length / o.pageSize));
      state.p = Math.min(state.p, pages);
      const shown = list.slice((state.p - 1) * o.pageSize, state.p * o.pageSize);
      const lastPage = state.p === pages && !state.q && state.f === 'all';

      if (!shown.length && !(lastPage && slots.length)) {
        grid.innerHTML = state.q || state.f !== 'all'
          ? `<div class="ia-grid-span">${emptyHTML('No matches found', 'Try a different keyword or clear the filters.')}</div>`
          : `<div class="ia-grid-span">${o.empty}</div>`;
      } else {
        grid.innerHTML = shown.map(it => itemCard(it, o.type, o.showCategory)).join('') +
          (lastPage ? slots.map(it => slotCard(it, o.type)).join('') : '');
      }

      if (count) count.textContent = `${list.length.toLocaleString()} ${list.length === 1 ? 'result' : 'results'}`;
      pager.innerHTML = pages > 1 ? pagerHTML(state.p, pages) : '';
      sync();
      if (scroll) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    let debounce;
    input && input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.q = input.value.trim(); state.p = 1; draw(); }, 150);
    });
    select && select.addEventListener('change', () => { state.sort = select.value; state.p = 1; draw(); });
    root.addEventListener('click', e => {
      const f = e.target.closest('[data-f]');
      const p = e.target.closest('[data-page]');
      if (f) { state.f = f.dataset.f; state.p = 1; draw(); }
      if (p) { state.p = +p.dataset.page; draw(true); }
    });

    draw();
  }

  function pagerHTML(cur, total) {
    const nums = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - cur) <= 1) nums.push(i);
      else if (nums[nums.length - 1] !== '…') nums.push('…');
    }
    const btn = (label, page, extra) => `<button type="button" class="filter-tag${extra || ''}" data-page="${page}">${label}</button>`;
    return (cur > 1 ? btn('← Prev', cur - 1) : '') +
      nums.map(n => (n === '…' ? '<span class="ia-page-gap">…</span>' : btn(n, n, n === cur ? ' active' : ''))).join('') +
      (cur < total ? btn('Next →', cur + 1) : '');
  }

  /* ==========================================================================
     6. PAGE TEMPLATE: SECTION HUB  (hub.html?s=<section>)
     ========================================================================== */
  async function renderHub(main) {
    const sec = section(params.get('s'));
    if (!sec) return renderNotFound(main);
    if (sec.hub && sec.hub !== 'hub.html') { location.replace(sec.hub); return; }

    setMeta(sec.title, sec.lead);
    const lists = await loadSection(sec);
    const all = lists.flat();

    main.innerHTML = heroHTML({ crumbs: crumbsFor(sec), label: sec.label, title: sec.heading || sec.title, lead: sec.lead }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          ${titleStrip('BROWSE BY CATEGORY', `${sec.title} Categories`, `${sec.categories.length} categories · ${countLabel(sec, all.filter(i => !isSlot(i)).length)}`)}
          <div class="blogs-archive-grid">${sec.categories.map((c, i) => categoryCard(sec, c, lists[i].filter(it => !isSlot(it)).length)).join('')}</div>
        </div>
      </section>
      ${sec.id === 'quiz' ? '<section class="ia-section ia-section-alt"><div class="content-wrapper" id="iaBankStats"></div></section>' : ''}
      <section class="ia-section${sec.id === 'quiz' ? '' : ' ia-section-alt'}">
        <div class="content-wrapper">
          ${titleStrip('THE COLLECTION', `All ${sec.noun[1]}`, 'Search across every category.')}
          <div id="iaHubListing"></div>
        </div>
      </section>`;

    mountListing(main.querySelector('#iaHubListing'), all.filter(it => !isSlot(it)), {
      type: sec.type,
      sort: sec.sort || 'new',
      showCategory: true,
      placeholder: `Search ${sec.title.toLowerCase()}…`,
      empty: emptyHTML(`${sec.title} are on the way`, 'New content is being prepared for this section. Please check back soon.')
    });

    if (sec.id === 'quiz') renderBankStats(main.querySelector('#iaBankStats'), true);
  }

  /* ==========================================================================
     7. PAGE TEMPLATE: CATEGORY LISTING  (category.html?s=<section>&c=<category>)
     ========================================================================== */
  async function renderCategory(main) {
    const sec = section(params.get('s'));
    const cat = category(sec, params.get('c'));
    if (!cat) return renderNotFound(main);

    const type = typeOf(sec, cat);
    setMeta(`${cat.title} — ${sec.title}`, cat.desc);

    const siblings = `
      <div class="category-filter-wrapper ia-siblings">
        <nav class="category-filter-bar" aria-label="${esc(sec.title)} categories">
          ${sec.categories.map(c => `<a class="filter-tag${c.id === cat.id ? ' active' : ''}" href="${catUrl(sec.id, c.id)}"${c.id === cat.id ? ' aria-current="page"' : ''}>${esc(c.title)}</a>`).join('')}
        </nav>
      </div>`;

    main.innerHTML = heroHTML({ crumbs: crumbsFor(sec, cat), label: sec.title, title: cat.title, lead: cat.desc }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          ${siblings}
          <div id="iaCategoryBody"></div>
        </div>
      </section>`;

    const body = main.querySelector('#iaCategoryBody');
    if (type === 'bank') return renderBank(body);

    const items = await loadCategory(sec, cat);
    mountListing(body, items, {
      type,
      sort: sec.sort || 'new',
      syncUrl: true,
      placeholder: type === 'profile' ? 'Search by name, organisation or keyword…' : `Search ${cat.title.toLowerCase()}…`,
      empty: emptyHTML(`${cat.title} are on the way`, `New ${sec.noun[1].toLowerCase()} for this category are being prepared. Please check back soon.`,
        `<a href="contact.html?subject=${encodeURIComponent('Suggestion: ' + cat.title)}" class="btn btn-brown-pill btn-sm">Suggest a Topic</a>`)
    });
  }

  /* ==========================================================================
     8. PAGE TEMPLATE: ITEM DETAIL  (item.html?s=&c=&id=)
     ========================================================================== */
  async function renderItem(main) {
    const sec = section(params.get('s'));
    const cat = category(sec, params.get('c'));
    if (!cat) return renderNotFound(main);

    const items = (await loadCategory(sec, cat)).filter(it => !isSlot(it));
    const idx = items.findIndex(it => it.id === params.get('id'));
    const it = items[idx];
    if (!it) return renderNotFound(main, sec, cat);

    const type = typeOf(sec, cat);
    setMeta(it.title, it.excerpt || it.subtitle || cat.desc);
    const ctx = { sec, cat, items, idx, type };

    const renderer = { book: bookDetail, gallery: galleryDetail, quiz: quizDetail, profile: profileDetail }[type] || articleDetail;
    main.innerHTML = renderer(it, ctx) + prevNextHTML(ctx);

    if (type === 'quiz') mountQuiz(main.querySelector('#iaQuiz'), it);
    main.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
      navigator.clipboard && navigator.clipboard.writeText(location.href);
      toast('Link copied to clipboard!');
    }));
  }

  function prevNextHTML({ sec, cat, items, idx }) {
    const prev = items[idx - 1];
    const next = items[idx + 1];
    if (!prev && !next) return '';
    const link = (it, dir) => it ? `
      <a class="ia-prevnext-link${dir === 'next' ? ' is-next' : ''}" href="${itemUrl(sec.id, cat.id, it.id)}">
        <span class="section-label-gold">${dir === 'next' ? 'Next →' : '← Previous'}</span>
        <span class="ia-prevnext-title">${esc(it.title)}</span>
      </a>` : '<span></span>';
    return `<section class="ia-section ia-section-tight"><div class="content-wrapper"><div class="ia-prevnext">${link(prev, 'prev')}${link(next, 'next')}</div></div></section>`;
  }

  function moreInCategory({ sec, cat, items, idx }) {
    const others = items.filter((_, i) => i !== idx).slice(0, 4);
    return `
      <div class="ia-aside-card">
        <span class="section-label-gold">MORE IN ${esc(cat.title.toUpperCase())}</span>
        ${others.length
          ? `<ul class="ia-aside-links">${others.map(o => `<li><a href="${itemUrl(sec.id, cat.id, o.id)}">${esc(o.title)}</a></li>`).join('')}</ul>`
          : '<p class="ia-aside-note">More coming soon.</p>'}
        <a class="btn-link-detail" href="${catUrl(sec.id, cat.id)}">View all ${esc(cat.title)} →</a>
      </div>`;
  }

  function relatedHTML(it) {
    if (!it.related || !it.related.length) return '';
    return `
      <h3 class="about-sub-title">Related Content</h3>
      <ul class="ia-ref-list">${it.related.map(r => `
        <li><a href="${r.href || itemUrl(r.s, r.c, r.id)}">${esc(r.title)}</a>${r.note ? `<span>${esc(r.note)}</span>` : ''}</li>`).join('')}
      </ul>`;
  }

  function tagsHTML(it) {
    return it.tags && it.tags.length ? `<div class="ia-tags">${it.tags.map(t => `<span class="tag-badge">${esc(t)}</span>`).join('')}</div>` : '';
  }

  // article · story · event
  function articleDetail(it, ctx) {
    const legacy = it.legacy && typeof BLOG_ARTICLES !== 'undefined' ? BLOG_ARTICLES[it.legacy] : null;
    const body = it.body || (legacy && legacy.content) || `<p>${esc(it.excerpt || '')}</p>`;
    const meta = [
      ctx.type === 'event' ? fmtDate(it.eventDate || it.date, true) : fmtDate(it.date),
      it.readTime, it.ageGroup, it.author && `By ${it.author}`
    ].filter(Boolean).map(esc).join('<span class="bf-dot">•</span>');

    const facts = ctx.type === 'event' && (it.venue || it.eventDate || it.time) ? `
      <div class="ia-aside-card">
        <span class="section-label-gold">EVENT DETAILS</span>
        <dl class="ia-facts">
          ${it.eventDate ? `<dt>Date</dt><dd>${esc(fmtDate(it.eventDate, true))}</dd>` : ''}
          ${it.time ? `<dt>Time</dt><dd>${esc(it.time)}</dd>` : ''}
          ${it.venue ? `<dt>Venue</dt><dd>${esc(it.venue)}</dd>` : ''}
        </dl>
        ${it.registerUrl ? `<a class="btn btn-gold-solid btn-sm" href="${esc(it.registerUrl)}" target="_blank" rel="noopener noreferrer">Register</a>` : ''}
      </div>` : '';

    return heroHTML({ crumbs: crumbsFor(ctx.sec, ctx.cat, it), label: ctx.cat.title, title: it.title, lead: it.subtitle, meta }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="ia-article-grid">
            <article class="about-narrative-col article-full-body ia-prose">
              ${it.image ? `<figure class="ia-article-figure"><img src="${esc(assetUrl(it.image))}" alt="${esc(it.alt || it.title)}"></figure>` : ''}
              ${body}
              ${tagsHTML(it)}
              ${relatedHTML(it)}
              <div class="about-cta-row">
                <button type="button" class="btn btn-brown-pill btn-sm" data-share>Share</button>
                <a class="btn-link-detail" href="${catUrl(ctx.sec.id, ctx.cat.id)}">← Back to ${esc(ctx.cat.title)}</a>
              </div>
            </article>
            <aside class="ia-aside">
              ${facts}
              ${it.author ? `
              <div class="ia-aside-card">
                <span class="section-label-gold">WRITTEN BY</span>
                <div class="about-quote-box-aside">
                  <p class="about-quote-aside-text">${esc(it.author)}</p>
                  <span class="about-quote-aside-author">${esc(it.authorRole || 'AUTHOR')}</span>
                </div>
              </div>` : ''}
              ${moreInCategory(ctx)}
            </aside>
          </div>
        </div>
      </section>`;
  }

  function bookDetail(it, ctx) {
    const legacy = it.legacy && typeof BOOKS_OUTLINES !== 'undefined' ? BOOKS_OUTLINES[it.legacy] : {};
    const subtitle = it.subtitle || legacy.subtitle;
    const synopsis = it.body || (legacy.synopsis ? `<p class="about-body-p">${esc(legacy.synopsis)}</p>` : `<p class="about-body-p">${esc(it.excerpt || '')}</p>`);
    const chapters = it.chapters || legacy.chapters || [];
    const metrics = [
      it.pages && [it.pages, 'Pages'],
      it.year && [it.year, 'Published'],
      it.format && [it.format, 'Format'],
      it.language && [it.language, 'Language'],
      it.volumes && [it.volumes.length, 'Volumes'],
      it.status && it.status !== 'published' && [it.statusLabel || it.status, 'Status']
    ].filter(Boolean).slice(0, 4);
    const cta = it.status === 'published'
      ? `<a href="${esc(it.buyUrl || `${PAGE_PREFIX}contact.html?subject=Order+` + encodeURIComponent(it.title))}" class="btn btn-gold-solid"><span>Order Your Copy</span>${ARROW}</a>`
      : `<a href="${PAGE_PREFIX}contact.html?subject=${encodeURIComponent('Notify me: ' + it.title)}" class="btn btn-gold-solid"><span>Notify Me on Release</span>${ARROW}</a>`;

    return heroHTML({ crumbs: crumbsFor(ctx.sec, ctx.cat, it), label: ctx.cat.title, title: it.title, lead: subtitle }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="about-detailed-grid">
            <div class="about-portrait-card">
              <div class="ia-book-cover-stage">${it.cover
                ? `<img src="${esc(it.cover)}" alt="${esc(it.title)} Book Cover" class="book-full-cover-img">`
                : '<div class="ia-slot-cover"><span>Cover<br>coming soon</span></div>'}</div>
              ${metrics.length ? `<div class="about-quick-metrics">${metrics.map(([v, l]) => `<div class="q-metric"><span class="q-val">${esc(v)}</span><span class="q-lbl">${esc(l)}</span></div>`).join('')}</div>` : ''}
            </div>
            <div class="about-narrative-col">
              <h2 class="about-story-title">${esc(it.title)}</h2>
              ${subtitle ? `<h3 class="book-flagship-subtitle">${esc(subtitle)}</h3>` : ''}
              ${synopsis}
              ${it.points && it.points.length ? `
                <div class="book-core-takeaways">
                  <h4 class="takeaways-heading">Key Insights from the Book:</h4>
                  <ul class="takeaways-list">${it.points.map(p => `<li>${CHECK}<span>${esc(p)}</span></li>`).join('')}</ul>
                </div>` : ''}
              ${it.volumes && it.volumes.length ? `
                <h3 class="about-sub-title">Books in this Series</h3>
                <ul class="ia-ref-list">${it.volumes.map(v => `<li>${v.href ? `<a href="${esc(v.href)}">${esc(v.title)}</a>` : `<strong>${esc(v.title)}</strong>`}${v.status ? `<span>${esc(v.status)}</span>` : ''}</li>`).join('')}</ul>` : ''}
              ${chapters.length ? `
                <div class="video-transcript-box ia-chapters">
                  <h4>Table of Contents</h4>
                  <ul>${chapters.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
                </div>` : ''}
              <div class="about-cta-row">
                ${cta}
                <button type="button" class="btn btn-brown-pill" data-share><span>Share</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  function galleryDetail(it, ctx) {
    return heroHTML({ crumbs: crumbsFor(ctx.sec, ctx.cat, it), label: ctx.cat.title, title: it.title, lead: it.caption }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="ia-article-grid">
            <div class="about-narrative-col ia-gallery-view">
              <figure class="portrait-stage-about ia-gallery-stage"><img src="${esc(it.image)}" alt="${esc(it.alt || it.title)}"></figure>
              ${it.body ? `<div class="article-full-body ia-prose">${it.body}</div>` : ''}
              ${tagsHTML(it)}
              <div class="about-cta-row">
                <button type="button" class="btn btn-brown-pill btn-sm" data-share>Share</button>
                <a class="btn-link-detail" href="${catUrl(ctx.sec.id, ctx.cat.id)}">← Back to ${esc(ctx.cat.title)}</a>
              </div>
            </div>
            <aside class="ia-aside">
              <div class="ia-aside-card">
                <span class="section-label-gold">DETAILS</span>
                <dl class="ia-facts">
                  <dt>Collection</dt><dd>${esc(ctx.cat.title)}</dd>
                  ${it.date ? `<dt>Published</dt><dd>${esc(fmtDate(it.date))}</dd>` : ''}
                  ${it.format ? `<dt>Format</dt><dd>${esc(it.format)}</dd>` : ''}
                  ${it.client ? `<dt>Client</dt><dd>${esc(it.client)}</dd>` : ''}
                  ${it.credit ? `<dt>Credit</dt><dd>${esc(it.credit)}</dd>` : ''}
                </dl>
              </div>
              ${moreInCategory(ctx)}
            </aside>
          </div>
        </div>
      </section>`;
  }

  function profileDetail(it, ctx) {
    const facts = (it.facts || []).slice(0, 4);
    return heroHTML({ crumbs: crumbsFor(ctx.sec, ctx.cat, it), label: ctx.cat.title, title: it.title, lead: [it.role, it.organisation].filter(Boolean).join(' · ') }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="about-detailed-grid">
            <div class="about-portrait-card">
              <div class="portrait-stage-about">${it.photo
                ? `<img src="${esc(it.photo)}" alt="${esc(it.title)}" class="about-portrait-img">`
                : `<div class="ia-portrait-fallback" aria-hidden="true">${esc(it.title.charAt(0))}</div>`}</div>
              ${facts.length ? `<div class="about-quick-metrics">${facts.map(f => `<div class="q-metric"><span class="q-val">${esc(f.value)}</span><span class="q-lbl">${esc(f.label)}</span></div>`).join('')}</div>` : ''}
              ${it.quote ? `<div class="about-quote-box-aside"><p class="about-quote-aside-text">“${esc(it.quote)}”</p><span class="about-quote-aside-author">— ${esc(it.title.toUpperCase())}</span></div>` : ''}
            </div>
            <div class="about-narrative-col">
              <h2 class="about-story-title">Biography</h2>
              <div class="ia-prose">${it.body || `<p class="about-body-p">${esc(it.excerpt || '')}</p>`}</div>
              ${it.achievements && it.achievements.length ? `
                <h3 class="about-sub-title">Achievements</h3>
                <ul class="takeaways-list">${it.achievements.map(a => `<li>${CHECK}<span>${esc(a)}</span></li>`).join('')}</ul>` : ''}
              ${it.references && it.references.length ? `
                <h3 class="about-sub-title">Articles &amp; References</h3>
                <ul class="ia-ref-list">${it.references.map(r => `
                  <li>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a>` : `<strong>${esc(r.title)}</strong>`}
                  <span>${esc([r.source, r.year].filter(Boolean).join(', '))}</span></li>`).join('')}
                </ul>` : ''}
              ${relatedHTML(it)}
              ${tagsHTML(it)}
              <div class="about-cta-row">
                <button type="button" class="btn btn-brown-pill btn-sm" data-share>Share Profile</button>
                <a class="btn-link-detail" href="${catUrl(ctx.sec.id, ctx.cat.id)}">← Back to ${esc(ctx.cat.title)}</a>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  function quizDetail(it, ctx) {
    const n = it.questions ? it.questions.length : it.bank && it.bank.count;
    const meta = [it.month && fmtDate(it.month), n && `${n} Questions`, it.difficulty, it.timeLimit && `${it.timeLimit} min`]
      .filter(Boolean).map(esc).join('<span class="bf-dot">•</span>');
    return heroHTML({ crumbs: crumbsFor(ctx.sec, ctx.cat, it), label: ctx.cat.title, title: it.title, lead: it.excerpt, meta }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="ia-article-grid">
            <div id="iaQuiz" class="about-narrative-col ia-quiz"></div>
            <aside class="ia-aside">${moreInCategory(ctx)}</aside>
          </div>
        </div>
      </section>`;
  }

  /* ==========================================================================
     9. QUIZ ENGINE & QUESTION BANK
     Bank layout: content/quiz/bank/manifest.js lists shards per category;
     each shard (content/quiz/bank/<category>/<nnn>.js) holds up to `shardSize`
     questions, so 100,000+ questions never load at once.
     ========================================================================== */
  const bankManifest = () => loadKey('quiz/bank/manifest');

  async function drawFromBank(categoryId, count) {
    const manifest = await bankManifest();
    if (!manifest) return [];
    const ids = categoryId === 'all' ? Object.keys(manifest.categories) : [categoryId];
    const shardKeys = shuffle(ids.flatMap(c => {
      const m = manifest.categories[c];
      return m ? Array.from({ length: m.shards }, (_, i) => `quiz/bank/${c}/${String(i + 1).padStart(3, '0')}`) : [];
    })).slice(0, 4);
    const pools = await Promise.all(shardKeys.map(loadKey));
    return shuffle(pools.flat().filter(Boolean)).slice(0, count);
  }

  async function mountQuiz(root, quiz) {
    root.innerHTML = '<p class="ia-aside-note">Loading questions…</p>';
    let questions = quiz.questions ? quiz.questions.slice() : await drawFromBank(quiz.bank.category, quiz.bank.count);
    
    // Seamlessly integrate questions created or edited in Executive CMS Studio
    try {
      const cmsQs = JSON.parse(localStorage.getItem('pvsrv_cms_quiz_questions') || '[]');
      if (Array.isArray(cmsQs) && cmsQs.length > 0) {
        const cat = quiz.bank ? quiz.bank.category : (quiz.category || 'all');
        const customMatching = cmsQs.filter(q => cat === 'all' || q.category === cat);
        if (customMatching.length > 0) {
          const existingIds = new Set(questions.map(q => q.id));
          const toAdd = customMatching.filter(q => !existingIds.has(q.id));
          questions = [...toAdd, ...questions];
        }
      }
    } catch(e) {}

    if (!questions.length) {
      root.innerHTML = emptyHTML('Questions coming soon', 'This quiz is being prepared. Please check back shortly.');
      return;
    }

    let i = 0;
    let score = 0;
    let quizMode = 'options'; // 'options' (Option Quiz) or 'qa' (Question, Answer, Reason)
    let isRevealed = false;
    const answers = [];

    const getAnswerText = q => {
      if (typeof q.answer === 'number' && q.options && q.options[q.answer] !== undefined) {
        return q.options[q.answer];
      }
      return q.answer || (q.options ? q.options[0] : 'Answer details provided below');
    };

    function intro() {
      root.innerHTML = `
        <span class="section-label-gold">QUIZ PLATFORM</span>
        <h2 class="about-story-title">${esc(quiz.title)}</h2>
        <p class="about-body-p">${esc(quiz.intro || `Explore ${questions.length} curated questions. Choose your preferred format below: test yourself with multiple-choice options, or study with direct questions, answers, and reasons.`)}</p>
        
        <div class="ia-quiz-mode-bar" style="margin: 1.5rem 0;">
          <span class="ia-quiz-mode-label">Select Quiz Format:</span>
          <div class="ia-quiz-mode-switch" role="group" aria-label="Format selection">
            <button type="button" class="ia-mode-btn ${quizMode === 'options' ? 'active' : ''}" data-set-mode="options">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle; margin-right:4px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
              <span>Option Quiz</span>
            </button>
            <button type="button" class="ia-mode-btn ${quizMode === 'qa' ? 'active' : ''}" data-set-mode="qa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle; margin-right:4px;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z"/></svg>
              <span>Question, Answer &amp; Reason</span>
            </button>
          </div>
        </div>

        <div class="about-cta-row">
          <button type="button" class="btn btn-gold-solid" data-act="start">
            <span>${quizMode === 'options' ? 'Start Option Quiz' : 'Start Q&A Study Round'}</span>${ARROW}
          </button>
        </div>`;
    }

    function question() {
      const q = questions[i];
      const answerText = getAnswerText(q);
      const hasOptions = Array.isArray(q.options) && q.options.length > 0;
      const currentMode = (!hasOptions && quizMode === 'options') ? 'qa' : quizMode;

      const modeBarHTML = `
        <div class="ia-quiz-mode-bar">
          <span class="ia-quiz-mode-label">Mode:</span>
          <div class="ia-quiz-mode-switch">
            <button type="button" class="ia-mode-btn ${currentMode === 'options' ? 'active' : ''}" data-set-mode="options" title="Multiple choice options mode">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle; margin-right:4px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
              <span>Option Quiz</span>
            </button>
            <button type="button" class="ia-mode-btn ${currentMode === 'qa' ? 'active' : ''}" data-set-mode="qa" title="Question, answer and reason flashcard mode">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle; margin-right:4px;"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z"/></svg>
              <span>Question, Answer &amp; Reason</span>
            </button>
          </div>
        </div>`;

      if (currentMode === 'options') {
        // Option Quiz (Multiple Choice A, B, C, D)
        root.innerHTML = `
          ${modeBarHTML}
          <div class="ia-quiz-top">
            <span class="section-label-gold">QUESTION ${i + 1} OF ${questions.length}</span>
            <span class="ia-quiz-score">Score: ${score}</span>
          </div>
          <div class="ia-quiz-progress"><span style="width:${(i / questions.length) * 100}%"></span></div>
          <h2 class="ia-quiz-question">${esc(q.q)}</h2>
          <div class="ia-quiz-options">${q.options.map((opt, k) => `
            <button type="button" class="ia-quiz-option" data-opt="${k}"><span class="ia-opt-key">${'ABCDEFGH'[k]}</span><span>${esc(opt)}</span></button>`).join('')}
          </div>
          <div class="ia-quiz-feedback" aria-live="polite"></div>`;
      } else {
        // Question, Answer & Reason Mode
        root.innerHTML = `
          ${modeBarHTML}
          <div class="ia-quiz-top">
            <span class="section-label-gold">QUESTION ${i + 1} OF ${questions.length} &bull; DIRECT STUDY</span>
            <span class="ia-quiz-score">Card ${i + 1}/${questions.length}</span>
          </div>
          <div class="ia-quiz-progress"><span style="width:${(i / questions.length) * 100}%"></span></div>
          <div class="ia-qa-box">
            <span class="section-label-gold" style="font-size:0.75rem;">QUESTION</span>
            <h2 class="ia-quiz-question" style="margin-top:0.4rem; margin-bottom:1.5rem;">${esc(q.q)}</h2>
            ${!isRevealed ? `
              <div style="margin-top:1.5rem;">
                <button type="button" class="btn btn-gold-solid" data-act="reveal">
                  <span>Reveal Answer &amp; Reason</span>${ARROW}
                </button>
              </div>
            ` : `
              <div class="ia-qa-reveal-card">
                <div class="ia-qa-answer-badge">
                  <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>Answer: ${esc(answerText)}</span>
                </div>
                <div class="ia-qa-reason-box">
                  <h4>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    Reason &amp; Detailed Explanation
                  </h4>
                  <p>${esc(q.explain || 'Verified authoritative knowledge context.')}</p>
                </div>
                <div class="about-cta-row" style="margin-top:1.75rem;">
                  <button type="button" class="btn btn-gold-solid btn-sm" data-act="next">
                    <span>${i + 1 < questions.length ? 'Next Question' : 'See Results'}</span>${ARROW}
                  </button>
                </div>
              </div>
            `}
          </div>`;
      }
    }

    function choose(k) {
      const q = questions[i];
      const correct = k === q.answer;
      if (correct) score++;
      answers.push({ q, chosen: k });
      root.querySelectorAll('.ia-quiz-option').forEach(b => {
        const n = +b.dataset.opt;
        b.disabled = true;
        if (n === q.answer) b.classList.add('is-correct');
        else if (n === k) b.classList.add('is-wrong');
      });
      root.querySelector('.ia-quiz-score').textContent = `Score: ${score}`;
      root.querySelector('.ia-quiz-feedback').innerHTML = `
        <p class="ia-quiz-verdict">${correct ? 'Correct!' : `Not quite — the answer is <strong>${esc(getAnswerText(q))}</strong>.`}</p>
        ${q.explain ? `<p class="ia-quiz-explain">${esc(q.explain)}</p>` : ''}
        <button type="button" class="btn btn-gold-solid btn-sm" data-act="next"><span>${i + 1 < questions.length ? 'Next Question' : 'See Results'}</span>${ARROW}</button>`;
      root.querySelector('[data-act="next"]').focus();
    }

    function results() {
      const pct = Math.round((score / questions.length) * 100);
      root.innerHTML = `
        <span class="section-label-gold">QUIZ COMPLETE</span>
        <h2 class="about-story-title">${quizMode === 'options' ? `You scored ${score} / ${questions.length}` : `Completed ${questions.length} Knowledge Questions`}</h2>
        <div class="ia-quiz-progress is-result"><span style="width:${quizMode === 'options' ? pct : 100}%"></span></div>
        <p class="about-body-p">${quizMode === 'options'
          ? (pct >= 80 ? 'Outstanding — you really know your stuff!' : pct >= 50 ? 'Well played! A little more practice and you will ace it.' : 'Good effort. Review the answers below and try again.')
          : 'You have reviewed every question, answer, and reason in this set. Review the full explanations below:'}</p>
        <div class="video-transcript-box ia-chapters">
          <h4>Questions, Answers &amp; Reasons</h4>
          <ol class="ia-quiz-review">${questions.map((q, idx) => {
            const ans = answers.find(a => a.q === q);
            const isCorrect = ans ? ans.chosen === q.answer : true;
            return `
              <li class="${ans ? (isCorrect ? 'is-correct' : 'is-wrong') : 'is-correct'}" style="margin-bottom:1rem; padding-bottom:1rem;">
                <strong style="font-size:0.95rem;">${idx + 1}. ${esc(q.q)}</strong>
                <span style="color:#065f46; font-weight:700; margin-top:0.25rem;">✓ Answer: ${esc(getAnswerText(q))}</span>
                ${q.explain ? `<div class="ia-quiz-explain" style="margin-top:0.5rem; font-size:0.88rem; padding:0.75rem 1rem;">${esc(q.explain)}</div>` : ''}
              </li>`;
          }).join('')}
          </ol>
        </div>
        <div class="about-cta-row">
          <button type="button" class="btn btn-gold-solid" data-act="retry"><span>${quiz.bank ? 'New Round' : 'Try Again'}</span>${ARROW}</button>
          <button type="button" class="btn btn-brown-pill" data-share>Share Quiz</button>
        </div>`;
    }

    root.addEventListener('click', async e => {
      const opt = e.target.closest('[data-opt]');
      const act = e.target.closest('[data-act]');
      const modeBtn = e.target.closest('[data-set-mode]');

      if (modeBtn) {
        quizMode = modeBtn.dataset.setMode;
        isRevealed = false;
        question();
        return;
      }

      if (opt && !opt.disabled) choose(+opt.dataset.opt);
      if (!act) return;
      if (act.dataset.act === 'start') { i = 0; score = 0; isRevealed = false; question(); }
      if (act.dataset.act === 'reveal') { isRevealed = true; question(); }
      if (act.dataset.act === 'next') {
        i++;
        isRevealed = false;
        i < questions.length ? question() : results();
      }
      if (act.dataset.act === 'retry') {
        if (quiz.bank) questions.splice(0, questions.length, ...(await drawFromBank(quiz.bank.category, quiz.bank.count)));
        i = 0; score = 0; isRevealed = false; answers.length = 0;
        question();
      }
    });

    intro();
  }

  async function renderBankStats(root, compact) {
    const manifest = await bankManifest();
    const quiz = section('quiz');
    const total = manifest ? Object.values(manifest.categories).reduce((s, c) => s + c.count, 0) : 0;
    const target = manifest ? manifest.target : 100000;
    root.innerHTML = `
      ${titleStrip('QUESTION BANK', 'A Growing Bank of Questions', `Target: ${target.toLocaleString()}+ questions across every quiz category.`,
        compact ? `<a class="link-view-all" href="${catUrl('quiz', 'question-bank')}">Open Question Bank →</a>` : '')}
      <div class="about-quick-metrics ia-bank-metrics">
        <div class="q-metric"><span class="q-val">${total.toLocaleString()}</span><span class="q-lbl">Questions Live</span></div>
        <div class="q-metric"><span class="q-val">${target.toLocaleString()}</span><span class="q-lbl">Target</span></div>
        <div class="q-metric"><span class="q-val">${manifest ? Object.keys(manifest.categories).length : 0}</span><span class="q-lbl">Categories</span></div>
        <div class="q-metric"><span class="q-val">${Math.min(100, (total / target) * 100).toFixed(total && total < target / 100 ? 2 : 0)}%</span><span class="q-lbl">Of Target</span></div>
      </div>
      ${compact || !manifest ? '' : `
      <div class="ia-bank-table-wrap">
        <table class="ia-bank-table">
          <thead><tr><th>Category</th><th>Questions</th><th>Shards</th></tr></thead>
          <tbody>${Object.entries(manifest.categories).map(([id, c]) => {
            const qc = category(quiz, id);
            return `<tr><td>${qc ? `<a href="${catUrl('quiz', id)}">${esc(qc.title)}</a>` : esc(id)}</td><td>${c.count.toLocaleString()}</td><td>${c.shards}</td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>`}`;
  }

  async function renderBank(body) {
    const manifest = await bankManifest();
    const quiz = section('quiz');
    const options = manifest ? Object.keys(manifest.categories).map(id => {
      const c = category(quiz, id);
      return `<option value="${id}">${esc(c ? c.title : id)}</option>`;
    }).join('') : '';

    body.innerHTML = `
      <div id="iaBankStatsFull"></div>
      <div class="ia-article-grid ia-bank-practice">
        <div class="about-narrative-col">
          <span class="section-label-gold">PRACTICE MODE</span>
          <h2 class="about-story-title">Build a Practice Round</h2>
          <p class="about-body-p">Pick a category and the number of questions. Each round is drawn at random from the bank.</p>
          <div class="ia-toolbar ia-bank-form">
            <select class="ia-sort-select" id="iaBankCat" aria-label="Category"><option value="all">All Categories (Bumper)</option>${options}</select>
            <select class="ia-sort-select" id="iaBankCount" aria-label="Number of questions">
              <option value="10">10 Questions</option><option value="20">20 Questions</option><option value="50">50 Questions</option>
            </select>
            <button type="button" class="btn btn-gold-solid btn-sm" id="iaBankGo"><span>Start Practice</span>${ARROW}</button>
          </div>
          <div id="iaBankQuiz" class="ia-quiz"></div>
        </div>
        <aside class="ia-aside">
          <div class="ia-aside-card">
            <span class="section-label-gold">HOW THE BANK WORKS</span>
            <p class="ia-aside-note">Questions are stored in small files (shards) per category, so the bank can scale past 100,000 questions while each round loads only a few hundred.</p>
          </div>
        </aside>
      </div>`;

    renderBankStats(body.querySelector('#iaBankStatsFull'), false);
    body.querySelector('#iaBankGo').addEventListener('click', () => {
      const cat = body.querySelector('#iaBankCat').value;
      const count = +body.querySelector('#iaBankCount').value;
      const label = cat === 'all' ? 'Bumper Practice Round' : `${(category(quiz, cat) || {}).title || cat} — Practice Round`;
      const host = body.querySelector('#iaBankQuiz');
      const fresh = host.cloneNode(false);
      host.replaceWith(fresh);
      mountQuiz(fresh, { title: label, bank: { category: cat, count } });
    });
  }

  /* ==========================================================================
     10. SITEMAP & NOT-FOUND
     ========================================================================== */
  function renderSitemap(main) {
    setMeta('Sitemap', 'A complete map of every section and category on the site.');
    const block = (title, href, desc, links) => `
      <div class="ia-sitemap-card">
        <a class="ia-sitemap-head" href="${href}">${esc(title)}</a>
        ${desc ? `<p class="ia-aside-note">${esc(desc)}</p>` : ''}
        <ul class="ia-aside-links">${links.map(l => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`;

    main.innerHTML = heroHTML({ crumbs: [{ label: 'Home', href: pageUrl('index.html') }, { label: 'Sitemap' }], label: 'SITE DIRECTORY', title: 'Sitemap', lead: 'Every section and category on the site, in one place.' }) + `
      <section class="ia-section">
        <div class="content-wrapper">
          <div class="ia-sitemap-grid">
            ${block('Main Pages', pageUrl('index.html'), '', REG.corePages.map(p => ({ label: p.label, href: pageUrl(p.href) })))}
            ${REG.sections.map(sec => block(sec.title, hubUrl(sec), sec.lead,
              sec.categories.map(c => ({ label: c.title, href: catUrl(sec.id, c.id) })).concat((sec.extraLinks || []).map(l => ({ label: l.label, href: pageUrl(l.href) }))))).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderNotFound(main, sec, cat) {
    setMeta('Not Found');
    main.innerHTML = heroHTML({ crumbs: crumbsFor(sec, cat), label: 'NOT FOUND', title: 'We couldn’t find that page', lead: 'The content may have moved or is still being prepared.' }) + `
      <section class="ia-section"><div class="content-wrapper">
        ${emptyHTML('Let’s get you back on track', 'Browse the full sitemap or head back to the homepage.',
          `<div class="about-cta-row ia-center"><a class="btn btn-gold-solid" href="sitemap.html"><span>Open Sitemap</span>${ARROW}</a><a class="btn btn-brown-pill" href="index.html">Go Home</a></div>`)}
      </div></section>`;
  }

  /* ==========================================================================
     11. ENHANCEMENTS FOR EXISTING PAGES
     ========================================================================== */
  // blogs.html: data-driven archive filtered by the eight blog categories.
  async function enhanceBlogs() {
    const root = document.getElementById('blogsArchive');
    if (!root) return;
    const sec = section('blogs');
    const lists = await loadSection(sec);

    const cats = document.getElementById('blogCategories');
    if (cats) cats.innerHTML = sec.categories.map((c, i) => categoryCard(sec, c, lists[i].filter(it => !isSlot(it)).length)).join('');

    mountListing(root, lists.flat(), {
      type: 'article',
      showCategory: true,
      placeholder: 'Search articles…',
      empty: emptyHTML('Articles are on the way', 'New articles are being prepared. Please check back soon.')
    });
  }

  // books.html: library categories + upcoming-title slots.
  async function enhanceBooks() {
    const root = document.getElementById('booksLibrary');
    if (!root) return;
    const sec = section('books');
    const lists = await loadSection(sec);
    const upcoming = lists[sec.categories.findIndex(c => c.id === 'upcoming')] || [];

    root.innerHTML = `
      <div class="blogs-archive-grid">${sec.categories.map((c, i) => categoryCard(sec, c, lists[i].filter(it => !isSlot(it)).length)).join('')}</div>
      ${upcoming.length ? `
        <div class="ia-subsection">
          ${titleStrip('COMING SOON', 'Upcoming Titles', 'New books in the pipeline. Register interest to be notified on release.',
            `<a class="link-view-all" href="${catUrl('books', 'upcoming')}">View all upcoming →</a>`)}
          <div class="books-detailed-grid">${upcoming.slice(0, 4).map(it => itemCard(it, 'book')).join('')}</div>
        </div>` : ''}`;
  }

  /* ==========================================================================
     12. SEARCH INDEX CONTRIBUTION & BOOT
     ========================================================================== */
  function searchEntries() {
    const out = [];
    REG.sections.forEach(sec => {
      // blogs.html and books.html are already listed in app.js's page index.
      if (!sec.hub) out.push({ type: 'Section', title: sec.title, url: hubUrl(sec), desc: sec.lead });
      sec.categories.forEach(c => out.push({ type: sec.title, title: c.title, url: catUrl(sec.id, c.id), desc: c.desc }));
    });
    Object.keys(store).forEach(key => {
      const [sId, cId] = key.split('/');
      const sec = section(sId);
      if (!sec || !Array.isArray(store[key])) return;
      store[key].filter(it => !isSlot(it) && it.id).forEach(it => out.push({
        type: sec.noun[0], title: it.title, url: itemUrl(sId, cId, it.id), desc: it.excerpt || ''
      }));
    });
    return out;
  }

  window.PVS = { register, loadKey, section, category, searchEntries, urls: { hubUrl, catUrl, itemUrl } };

  document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderFooter();

    const main = document.getElementById('mainContent');
    const template = main && main.dataset.template;
    const pages = { hub: renderHub, category: renderCategory, item: renderItem, sitemap: renderSitemap };
    if (pages[template]) pages[template](main);

    enhanceBlogs();
    enhanceBooks();
  });
})();
