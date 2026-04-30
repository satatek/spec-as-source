/**
 * Tag repository: upsert tags and manage the junction table.
 */

import { getDb } from '../db/database.js';

/**
 * Upsert a tag by name (case-insensitively unique), returning its id.
 * @param {string} name already normalised (lowercase, trimmed)
 * @returns {number} tag id
 */
export function upsertTag(name) {
  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run(name);
  return db.prepare('SELECT id FROM tags WHERE name = ?').get(name).id;
}

/**
 * Replace the full tag set for a metadata record.
 * Deletes existing junction rows then inserts new ones.
 * @param {number} metadataId
 * @param {string[]} normalisedTags already normalised tag names
 */
export function replaceTagsForMetadata(metadataId, normalisedTags) {
  const db = getDb();
  const deleteJunction = db.prepare(
    'DELETE FROM image_metadata_tags WHERE image_metadata_id = ?'
  );
  const insertJunction = db.prepare(
    'INSERT OR IGNORE INTO image_metadata_tags (image_metadata_id, tag_id) VALUES (?, ?)'
  );

  db.transaction(() => {
    deleteJunction.run(metadataId);
    for (const name of normalisedTags) {
      const tagId = upsertTag(name);
      insertJunction.run(metadataId, tagId);
    }
  })();
}

/**
 * Retrieve tag names for a metadata record.
 * @param {number} metadataId
 * @returns {string[]}
 */
export function getTagsForMetadata(metadataId) {
  return getDb()
    .prepare(
      `SELECT t.name FROM tags t
       JOIN image_metadata_tags imt ON imt.tag_id = t.id
       WHERE imt.image_metadata_id = ?
       ORDER BY t.name`
    )
    .all(metadataId)
    .map((r) => r.name);
}
