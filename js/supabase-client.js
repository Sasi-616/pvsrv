/**
 * ============================================================================
 * MR. PVS RAVINDRA VARMA PLATFORM - SUPABASE CLIENT & DATA ENGINE
 * Direct PostgreSQL Cloud Database Integration for Cloudflare Pages & Admin CMS
 * ============================================================================
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    URL: 'pvsrv_supabase_url',
    KEY: 'pvsrv_supabase_anon_key',
    BOOKS: 'pvsrv_books_catalog',
    ARTICLES: 'pvsrv_cms_articles',
    INQUIRIES: 'pvsrv_inquiries',
    QUIZ: 'pvsrv_quiz_questions',
    SETTINGS: 'pvsrv_site_settings'
  };

  let supabaseClient = null;

  function getCredentials() {
    let url = '';
    let key = '';
    try {
      url = localStorage.getItem(STORAGE_KEYS.URL) || '';
      key = localStorage.getItem(STORAGE_KEYS.KEY) || '';
    } catch (e) {
      console.warn('[PVS Supabase] LocalStorage read warning:', e);
    }
    return { url, key };
  }

  function initClient() {
    const { url, key } = getCredentials();
    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(url.trim(), key.trim(), {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        console.log('[PVS Supabase] Connected to live Supabase cluster:', url);
        return supabaseClient;
      } catch (e) {
        console.warn('[PVS Supabase] Initialization warning:', e);
      }
    }
    supabaseClient = null;
    return null;
  }

  const PVS_Supabase = {
    init: initClient,
    
    getClient: function () {
      if (!supabaseClient) initClient();
      return supabaseClient;
    },

    isConnected: function () {
      const { url, key } = getCredentials();
      return !!(url && key && supabaseClient);
    },

    getCredentials: getCredentials,

    setCredentials: function (url, key) {
      try {
        if (url) localStorage.setItem(STORAGE_KEYS.URL, url.trim());
        if (key) localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
      } catch (e) {}
      return initClient();
    },

    clearCredentials: function () {
      try {
        localStorage.removeItem(STORAGE_KEYS.URL);
        localStorage.removeItem(STORAGE_KEYS.KEY);
      } catch (e) {}
      supabaseClient = null;
    },

    // Test connection with specific URL and Key
    testConnection: async function (testUrl, testKey) {
      try {
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
          return { success: false, message: 'Supabase JS library not loaded. Check internet connection.' };
        }
        if (!testUrl || !testKey) {
          return { success: false, message: 'Please provide both Project URL and Anon Public Key.' };
        }
        const tempClient = window.supabase.createClient(testUrl.trim(), testKey.trim());
        const { data, error } = await tempClient.from('books').select('id, title').limit(1);
        if (error) {
          if (error.code === '42P01') {
            return {
              success: false,
              message: 'Connected to Supabase successfully, but the "books" table is not found! Please run supabase-schema.sql in the Supabase SQL Editor.'
            };
          }
          return { success: false, message: error.message || 'Supabase query error' };
        }
        return { success: true, message: 'Connected to Supabase PostgreSQL database successfully!' };
      } catch (err) {
        return { success: false, message: err.message || 'Connection test failed' };
      }
    },

    // 1. BOOKS CRUD
    fetchBooks: async function () {
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('books').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            try {
              localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(data));
              localStorage.setItem('pvsrv_books', JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        } catch (e) {
          console.warn('[PVS Supabase] Error fetching books from cloud:', e);
        }
      }
      try {
        const local = localStorage.getItem(STORAGE_KEYS.BOOKS) || localStorage.getItem('pvsrv_books');
        if (local) return JSON.parse(local);
      } catch (e) {}
      return null;
    },

    saveBook: async function (bookData) {
      if (!bookData.id) bookData.id = 'book-' + Date.now();
      if (!bookData.slug) bookData.slug = (bookData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!bookData.author) bookData.author = 'PVS Ravindra Varma';

      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('books').upsert(bookData, { onConflict: 'slug' }).select();
          if (error) {
            console.error('[PVS Supabase] Cloud book sync error:', error);
          } else {
            console.log('[PVS Supabase] Book synced to Supabase PostgreSQL:', data);
          }
        } catch (e) {
          console.error('[PVS Supabase] Cloud book sync exception:', e);
        }
      }

      // Local storage fallback
      try {
        let books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || localStorage.getItem('pvsrv_books') || '[]');
        const idx = books.findIndex(b => b.id === bookData.id || b.slug === bookData.slug);
        if (idx >= 0) books[idx] = Object.assign({}, books[idx], bookData);
        else books.unshift(bookData);
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
        localStorage.setItem('pvsrv_books', JSON.stringify(books));
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'books', book: bookData } }));
      return bookData;
    },

    deleteBook: async function (bookId, slug) {
      const client = this.getClient();
      if (client) {
        try {
          if (bookId) await client.from('books').delete().eq('id', bookId);
          else if (slug) await client.from('books').delete().eq('slug', slug);
        } catch (e) {
          console.error('[PVS Supabase] Delete book cloud error:', e);
        }
      }
      try {
        let books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || localStorage.getItem('pvsrv_books') || '[]');
        books = books.filter(b => b.id !== bookId && b.slug !== slug);
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
        localStorage.setItem('pvsrv_books', JSON.stringify(books));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'books' } }));
      return true;
    },

    // 2. ARTICLES CRUD
    fetchArticles: async function () {
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('articles').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            try {
              localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(data));
              localStorage.setItem('pvsrv_articles', JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        } catch (e) {
          console.warn('[PVS Supabase] Error fetching articles from cloud:', e);
        }
      }
      try {
        const local = localStorage.getItem(STORAGE_KEYS.ARTICLES) || localStorage.getItem('pvsrv_articles');
        if (local) return JSON.parse(local);
      } catch (e) {}
      return null;
    },

    saveArticle: async function (articleData) {
      if (!articleData.id) articleData.id = 'art-' + Date.now();
      if (!articleData.slug) articleData.slug = (articleData.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!articleData.author) articleData.author = 'PVS Ravindra Varma';

      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('articles').upsert(articleData, { onConflict: 'slug' }).select();
          if (error) console.error('[PVS Supabase] Cloud article sync error:', error);
          else console.log('[PVS Supabase] Article synced to Supabase PostgreSQL:', data);
        } catch (e) {
          console.error('[PVS Supabase] Cloud article sync exception:', e);
        }
      }

      try {
        let articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || localStorage.getItem('pvsrv_articles') || '[]');
        const idx = articles.findIndex(a => a.id === articleData.id || a.slug === articleData.slug);
        if (idx >= 0) articles[idx] = Object.assign({}, articles[idx], articleData);
        else articles.unshift(articleData);
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
        localStorage.setItem('pvsrv_articles', JSON.stringify(articles));
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'articles', article: articleData } }));
      return articleData;
    },

    deleteArticle: async function (articleId) {
      const client = this.getClient();
      if (client) {
        try {
          await client.from('articles').delete().eq('id', articleId);
        } catch (e) {
          console.error('[PVS Supabase] Delete article cloud error:', e);
        }
      }
      try {
        let articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || localStorage.getItem('pvsrv_articles') || '[]');
        articles = articles.filter(a => a.id !== articleId);
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
        localStorage.setItem('pvsrv_articles', JSON.stringify(articles));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('pvs_content_updated', { detail: { type: 'articles' } }));
      return true;
    },

    // 3. INQUIRIES (Public Contact Form -> Supabase Lead CRM)
    submitInquiry: async function (inquiryData) {
      if (!inquiryData.id) inquiryData.id = 'inq-' + Date.now();
      if (!inquiryData.created_at) inquiryData.created_at = new Date().toISOString();
      if (!inquiryData.status) inquiryData.status = 'unread';

      // Always save locally first
      try {
        let inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
        inquiries.unshift(inquiryData);
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      } catch (e) {}

      // Push to Supabase PostgreSQL table
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('inquiries').insert([inquiryData]).select();
          if (error) {
            console.warn('[PVS Supabase] Cloud inquiry submission warning:', error);
          } else {
            console.log('[PVS Supabase] Inquiry recorded in Supabase CRM:', data);
          }
        } catch (e) {
          console.warn('[PVS Supabase] Inquiry submission exception:', e);
        }
      }

      window.dispatchEvent(new CustomEvent('pvs_inquiry_received', { detail: inquiryData }));
      return { success: true, inquiry: inquiryData };
    },

    fetchInquiries: async function () {
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('inquiries').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            try {
              localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        } catch (e) {
          console.warn('[PVS Supabase] Error fetching inquiries from cloud:', e);
        }
      }
      try {
        const local = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
        if (local) return JSON.parse(local);
      } catch (e) {}
      return [];
    },

    updateInquiryStatus: async function (id, status) {
      const client = this.getClient();
      if (client) {
        try {
          await client.from('inquiries').update({ status }).eq('id', id);
        } catch (e) {}
      }
      try {
        let inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
        const target = inquiries.find(i => i.id === id);
        if (target) target.status = status;
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      } catch (e) {}
      return true;
    },

    deleteInquiry: async function (id) {
      const client = this.getClient();
      if (client) {
        try {
          await client.from('inquiries').delete().eq('id', id);
        } catch (e) {}
      }
      try {
        let inquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      } catch (e) {}
      return true;
    },

    // 4. KNOWLEDGE QUIZ
    fetchQuizQuestions: async function () {
      const client = this.getClient();
      if (client) {
        try {
          const { data, error } = await client.from('quiz_questions').select('*').order('created_at', { ascending: true });
          if (!error && Array.isArray(data) && data.length > 0) {
            try {
              localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(data));
            } catch (e) {}
            return data;
          }
        } catch (e) {}
      }
      try {
        const local = localStorage.getItem(STORAGE_KEYS.QUIZ);
        if (local) return JSON.parse(local);
      } catch (e) {}
      return null;
    },

    saveQuizQuestion: async function (qData) {
      if (!qData.id) qData.id = 'qz-' + Date.now();
      const client = this.getClient();
      if (client) {
        try {
          await client.from('quiz_questions').upsert(qData, { onConflict: 'id' });
        } catch (e) {}
      }
      try {
        let quiz = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUIZ) || '[]');
        const idx = quiz.findIndex(q => q.id === qData.id);
        if (idx >= 0) quiz[idx] = qData;
        else quiz.push(qData);
        localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quiz));
      } catch (e) {}
      return qData;
    },

    // 5. BULK SYNC ALL TO CLOUD
    syncAllToCloud: async function () {
      const client = this.getClient();
      if (!client) {
        return { success: false, message: 'Please connect to Supabase first by providing your Project URL & Anon Key.' };
      }
      try {
        let bookCount = 0;
        let articleCount = 0;

        // Books
        let books = [];
        if (window.PVS_Bridge && typeof window.PVS_Bridge.getBooks === 'function') {
          books = window.PVS_Bridge.getBooks();
        } else {
          try {
            books = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || '[]');
          } catch (e) {}
        }
        if (books.length > 0) {
          const { error } = await client.from('books').upsert(books, { onConflict: 'slug' });
          if (!error) bookCount = books.length;
        }

        // Articles
        let articles = [];
        if (window.PVS_Bridge && typeof window.PVS_Bridge.getArticles === 'function') {
          articles = window.PVS_Bridge.getArticles();
        } else {
          try {
            articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
          } catch (e) {}
        }
        if (articles.length > 0) {
          const { error } = await client.from('articles').upsert(articles, { onConflict: 'slug' });
          if (!error) articleCount = articles.length;
        }

        return {
          success: true,
          message: `Successfully synchronized ${bookCount} books and ${articleCount} articles to Supabase PostgreSQL database!`
        };
      } catch (err) {
        return { success: false, message: err.message || 'Synchronization failed.' };
      }
    }
  };

  // Auto-init on script load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => PVS_Supabase.init());
    } else {
      PVS_Supabase.init();
    }
  }

  window.PVS_Supabase = PVS_Supabase;
})(window);

