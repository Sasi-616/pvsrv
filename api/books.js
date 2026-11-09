const { supabase, isConfigured, seedBooks } = require('./_supabase');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch all books
  if (req.method === 'GET') {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return res.status(200).json(data);
        }
      } catch (err) {
        console.warn('[Vercel API /books] Supabase fetch error, using fallback:', err.message);
      }
    }
    return res.status(200).json(seedBooks);
  }

  // 2. POST / PUT: Save or update a book
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    if (!body || !body.title) {
      return res.status(400).json({ error: 'Book title is required.' });
    }

    if (!body.id) body.id = 'book-' + Date.now();
    if (!body.slug) body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!body.cover) body.cover = '/assets/books/culture-that-lasts.png';
    if (!body.status) body.status = 'published';

    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('books').upsert(body, { onConflict: 'slug' }).select();
        if (error) {
          console.error('[Vercel API /books] Supabase upsert error:', error.message);
          return res.status(500).json({ error: error.message, savedLocally: true, book: body });
        }
        return res.status(200).json({ success: true, book: data[0] || body, source: 'supabase' });
      } catch (err) {
        return res.status(500).json({ error: err.message, book: body });
      }
    }

    // Fallback response when Supabase credentials not yet supplied in Vercel env
    return res.status(200).json({ success: true, book: body, source: 'local_fallback' });
  }

  // 3. DELETE: Remove book by id or slug
  if (req.method === 'DELETE') {
    const { id, slug } = req.query || {};
    if (!id && !slug) {
      return res.status(400).json({ error: 'id or slug query parameter is required.' });
    }

    if (isConfigured) {
      try {
        if (id) await supabase.from('books').delete().eq('id', id);
        else if (slug) await supabase.from('books').delete().eq('slug', slug);
        return res.status(200).json({ success: true, message: 'Book deleted from Supabase.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(200).json({ success: true, message: 'Deleted locally.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

