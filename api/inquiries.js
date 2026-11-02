const { supabase, isConfigured } = require('./_supabase');

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

  // 1. GET: Admin fetches inquiries
  if (req.method === 'GET') {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          return res.status(200).json(data);
        }
      } catch (err) {
        console.warn('[Vercel API /inquiries] Supabase fetch error:', err.message);
      }
    }
    return res.status(200).json([]);
  }

  // 2. POST: Submit a new inquiry from Contact Page
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    if (!body || !body.name || !body.email) {
      return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    const inquiry = {
      id: body.id || 'inq-' + Date.now(),
      name: body.name.trim(),
      email: body.email.trim(),
      phone: (body.phone || '').trim(),
      organization: (body.organization || '').trim(),
      topic: body.topic || 'Executive Consultation',
      message: (body.message || '').trim(),
      status: 'unread',
      created_at: new Date().toISOString()
    };

    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('inquiries').insert([inquiry]).select();
        if (error) {
          console.warn('[Vercel API /inquiries] Supabase insert warning:', error.message);
          return res.status(200).json({ success: true, inquiry, warning: error.message });
        }
        return res.status(201).json({ success: true, inquiry: data[0] || inquiry, source: 'supabase' });
      } catch (err) {
        return res.status(200).json({ success: true, inquiry, error: err.message });
      }
    }

    return res.status(201).json({ success: true, inquiry, source: 'local_fallback' });
  }

  // 3. PATCH: Update inquiry status (e.g. 'unread' -> 'responded')
  if (req.method === 'PATCH') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { id, status } = body || {};
    if (!id || !status) {
      return res.status(400).json({ error: 'id and status are required.' });
    }

    if (isConfigured) {
      try {
        await supabase.from('inquiries').update({ status }).eq('id', id);
        return res.status(200).json({ success: true, id, status });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(200).json({ success: true, id, status, source: 'local_fallback' });
  }

  // 4. DELETE: Remove inquiry
  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Inquiry id is required.' });

    if (isConfigured) {
      try {
        await supabase.from('inquiries').delete().eq('id', id);
        return res.status(200).json({ success: true, message: 'Inquiry deleted from Supabase.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(200).json({ success: true, message: 'Deleted locally.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

