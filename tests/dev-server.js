const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5500;
const ROOT_DIR = __dirname ? path.resolve(__dirname, '..') : process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

// Route mapping matching Vercel rewrites
const routeMap = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/about': 'pages/about.html',
  '/pages/about.html': 'pages/about.html',
  '/books': 'pages/books.html',
  '/pages/books.html': 'pages/books.html',
  '/reader': 'pages/reader.html',
  '/pages/reader.html': 'pages/reader.html',
  '/blogs': 'pages/blogs.html',
  '/pages/blogs.html': 'pages/blogs.html',
  '/quiz': 'pages/quiz.html',
  '/pages/quiz.html': 'pages/quiz.html',
  '/contact': 'pages/contact.html',
  '/pages/contact.html': 'pages/contact.html',
  '/videos': 'pages/videos.html',
  '/pages/videos.html': 'pages/videos.html',
  '/sitemap': 'pages/sitemap.html',
  '/pages/sitemap.html': 'pages/sitemap.html',
  '/admin': 'admin/cms.html',
  '/admin/cms.html': 'admin/cms.html',
  '/admin/login': 'admin/admin-login.html',
  '/admin/admin-login.html': 'admin/admin-login.html',
  '/admin/login.html': 'admin/admin-login.html'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Helper methods for Express/Vercel compatibility
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };
  req.query = parsedUrl.query || {};

  // 1. Dynamic Serverless API endpoints (/api/*)
  if (pathname.startsWith('/api/')) {
    const apiName = pathname.replace('/api/', '').split('?')[0].replace(/\.js$/, '');
    const apiFile = path.join(ROOT_DIR, 'api', `${apiName}.js`);
    if (fs.existsSync(apiFile)) {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          req.body = bodyData ? JSON.parse(bodyData) : {};
        } catch (e) {
          req.body = bodyData;
        }
        try {
          delete require.cache[require.resolve(apiFile)];
          const handler = require(apiFile);
          return handler(req, res);
        } catch (err) {
          console.error('[API Error]', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // 2. Check clean route map
  if (routeMap[pathname]) {
    const targetFile = path.join(ROOT_DIR, routeMap[pathname]);
    if (fs.existsSync(targetFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(targetFile).pipe(res);
    }
  }

  // 3. Direct static file in ROOT_DIR
  let filePath = path.join(ROOT_DIR, pathname.replace(/^\//, ''));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(filePath).pipe(res);
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found: ' + pathname);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`PVS Ravindra Varma Vercel + Supabase dev server running at http://127.0.0.1:${PORT}`);
});
