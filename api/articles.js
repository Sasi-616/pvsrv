const { supabase, isConfigured, seedArticles } = require('./_supabase');

module.exports = async (req, res) => {
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

  // 1. GET: Fetch all articles
  if (req.method === 'GET') {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          return res.status(200).json(data);
        }
      } catch (err) {
        console.warn('[Vercel API /articles] Supabase fetch warning:', err.message);
      }
    }
    return res.status(200).json(seedArticles);
  }

  // 2. POST / PUT: Save or update an article
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    if (!body || !body.title) {
      return res.status(400).json({ error: 'Article title is required.' });
    }

    if (!body.id) body.id = 'art-' + Date.now();
    if (!body.slug) body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!body.cover_img) body.cover_img = 'assets/blogs/growth-mindset.jpg';
    if (!body.status) body.status = 'published';

    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('articles').upsert(body, { onConflict: 'slug' }).select();
        if (error) {
          return res.status(500).json({ error: error.message, savedLocally: true, article: body });
        }
        return res.status(200).json({ success: true, article: data[0] || body, source: 'supabase' });
      } catch (err) {
        return res.status(500).json({ error: err.message, article: body });
      }
    }

    return res.status(200).json({ success: true, article: body, source: 'local_fallback' });
  }

  // 3. DELETE: Remove article by id
  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'Article id is required.' });
    }

    if (isConfigured) {
      try {
        await supabase.from('articles').delete().eq('id', id);
        return res.status(200).json({ success: true, message: 'Article deleted from Supabase.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(200).json({ success: true, message: 'Deleted locally.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

