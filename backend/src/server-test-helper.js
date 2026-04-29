/**
 * Test helper: create an isolated HTTP server bound to a random port,
 * backed by an in-memory SQLite database so tests don't share state.
 */

import { createServer as httpCreateServer } from 'http';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, 'db/schema.sql');

// Monkey-patch the database module to use the test DB within this test run.
// Each beforeEach call resets the singleton.
import * as dbModule from './db/database.js';

export async function createServer() {
  // Replace singleton with a fresh in-memory DB
  dbModule._resetDb(new Database(':memory:'));
  const db = dbModule.getDb();
  db.pragma('foreign_keys = ON');
  db.exec(readFileSync(SCHEMA_PATH, 'utf8'));

  const { handleMetadataRoutes } = await import('./api/metadata-routes.js');

  const server = httpCreateServer((req, res) => {
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.url?.startsWith('/api/metadata')) { handleMetadataRoutes(req, res); return; }
    res.writeHead(404); res.end();
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  return { server, port };
}
