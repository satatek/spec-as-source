/**
 * Minimal Node.js HTTP server (no framework) for the local metadata API.
 * Port: 3001
 */

import { createServer } from 'http';
import { getDb } from './db/database.js';
import { handleMetadataRoutes } from './api/metadata-routes.js';

const PORT = process.env.PORT ?? 3001;

// Ensure the database is initialised on start
getDb();

const server = createServer((req, res) => {
  // CORS for Vite dev server
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url.startsWith('/api/metadata')) {
    handleMetadataRoutes(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found', message: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`[backend] Listening on http://localhost:${PORT}`);
});
