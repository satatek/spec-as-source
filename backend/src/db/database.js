import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../../data/image-metadata.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

let _db = null;

/**
 * Returns the singleton database connection, initialising schema on first call.
 * @returns {import('better-sqlite3').Database}
 */
export function getDb() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  const schema = readFileSync(SCHEMA_PATH, 'utf8');
  _db.exec(schema);
  return _db;
}

/**
 * Close the database connection (used in tests for cleanup).
 */
export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}

/**
 * Replace the singleton with an externally created DB (used in tests).
 * @param {import('better-sqlite3').Database} db
 */
export function _resetDb(db) {
  if (_db) _db.close();
  _db = db;
}
