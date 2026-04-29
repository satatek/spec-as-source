/**
 * Metadata repository: low-level SQLite CRUD + search operations.
 */

import { getDb } from '../db/database.js';

/**
 * Insert a new image_metadata row.
 * @param {{ filePath: string, title: string, description: string|null, createdAt: string, updatedAt: string }} row
 * @returns {number} new row id
 */
export function insertMetadata(row) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO image_metadata (file_path, title, description, created_at, updated_at)
     VALUES (@filePath, @title, @description, @createdAt, @updatedAt)`
  );
  const result = stmt.run(row);
  return result.lastInsertRowid;
}

/**
 * Find a metadata row by normalised file path.
 * @param {string} filePath
 * @returns {object|undefined}
 */
export function findByFilePath(filePath) {
  return getDb()
    .prepare('SELECT * FROM image_metadata WHERE file_path = ?')
    .get(filePath);
}

/**
 * Find a metadata row by id.
 * @param {number} id
 * @returns {object|undefined}
 */
export function findById(id) {
  return getDb()
    .prepare('SELECT * FROM image_metadata WHERE id = ?')
    .get(id);
}

/**
 * List metadata rows, optionally filtered by a search query.
 * Searches title, description, file_path, and tag names.
 * @param {string} [q]
 * @returns {object[]}
 */
export function listMetadata(q) {
  const db = getDb();
  if (!q || !q.trim()) {
    return db.prepare('SELECT * FROM image_metadata ORDER BY updated_at DESC').all();
  }
  const like = `%${q.trim()}%`;
  return db
    .prepare(
      `SELECT DISTINCT im.*
       FROM image_metadata im
       LEFT JOIN image_metadata_tags imt ON imt.image_metadata_id = im.id
       LEFT JOIN tags t ON t.id = imt.tag_id
       WHERE im.title LIKE ?
          OR im.description LIKE ?
          OR im.file_path LIKE ?
          OR t.name LIKE ?
       ORDER BY im.updated_at DESC`
    )
    .all(like, like, like, like);
}

/**
 * Update an existing metadata row.
 * @param {number} id
 * @param {{ title?: string, description?: string|null, updatedAt: string }} fields
 */
export function updateMetadata(id, fields) {
  const db = getDb();
  const parts = [];
  const params = {};
  if (fields.title !== undefined) { parts.push('title = @title'); params.title = fields.title; }
  if (fields.description !== undefined) { parts.push('description = @description'); params.description = fields.description; }
  parts.push('updated_at = @updatedAt');
  params.updatedAt = fields.updatedAt;
  params.id = id;
  db.prepare(`UPDATE image_metadata SET ${parts.join(', ')} WHERE id = @id`).run(params);
}

/**
 * Delete a metadata row and its tag associations (CASCADE handles junction rows).
 * @param {number} id
 * @returns {boolean} true if a row was deleted
 */
export function deleteMetadata(id) {
  const result = getDb()
    .prepare('DELETE FROM image_metadata WHERE id = ?')
    .run(id);
  return result.changes > 0;
}
