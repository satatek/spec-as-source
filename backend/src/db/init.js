/**
 * One-shot script to initialise the database schema.
 * Run via: npm run db:init
 */
import { getDb, closeDb } from './database.js';

try {
  getDb();
  console.log('Database initialised successfully.');
} finally {
  closeDb();
}
