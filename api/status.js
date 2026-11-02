const { supabase, isConfigured } = require('./_supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  let dbStatus = 'not_configured';
  let dbMessage = 'Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) not yet set in Vercel.';
  let bookCount = 0;

  if (isConfigured) {
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('books').select('id', { count: 'exact' });
      const latency = Date.now() - start;
      if (error) {
        dbStatus = 'error';
        dbMessage = error.message;
      } else {
        dbStatus = 'connected';
        dbMessage = `Connected to Supabase PostgreSQL in ${latency}ms`;
        bookCount = data ? data.length : 0;
      }
    } catch (err) {
      dbStatus = 'connection_failed';
      dbMessage = err.message;
    }
  }

  return res.status(200).json({
    platform: 'Vercel Serverless Functions',
    status: 'online',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    database: {
      provider: 'Supabase PostgreSQL',
      status: dbStatus,
      message: dbMessage,
      configured: isConfigured,
      booksCount: bookCount
    }
  });
};

