const { supabase, isConfigured, seedBooks, seedArticles } = require('./_supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  const type = req.query.type || 'books';

  // 1. GET requests
  if (req.method === 'GET') {
    if (type === 'books') {
      if (isConfigured) {
        try {
          const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) return res.status(200).json(data);
        } catch (e) {}
      }
      return res.status(200).json(seedBooks);
    }

    if (type === 'articles') {
      if (isConfigured) {
        try {
          const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) return res.status(200).json(data);
        } catch (e) {}
      }
      return res.status(200).json(seedArticles);
    }

    if (type === 'inquiries') {
      if (isConfigured) {
        try {
          const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) return res.status(200).json(data);
        } catch (e) {}
      }
      return res.status(200).json([]);
    }

    return res.status(400).json({ error: 'Unknown content type' });
  }

  // 2. POST requests
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    if (type === 'books') {
      if (isConfigured) {
        try {
          const { data } = await supabase.from('books').upsert(body, { onConflict: 'slug' }).select();
          return res.status(200).json({ success: true, data: data?.[0] || body });
        } catch (e) {}
      }
      return res.status(200).json({ success: true, data: body });
    }

    if (type === 'articles') {
      if (isConfigured) {
        try {
          const { data } = await supabase.from('articles').upsert(body, { onConflict: 'slug' }).select();
          return res.status(200).json({ success: true, data: data?.[0] || body });
        } catch (e) {}
      }
      return res.status(200).json({ success: true, data: body });
    }

    return res.status(400).json({ error: 'Invalid content type' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

