/**
 * Metadata service: orchestrates repository operations and business rules.
 */

import {
  insertMetadata,
  findByFilePath,
  findById,
  listMetadata as repoListMetadata,
  updateMetadata as repoUpdateMetadata,
  deleteMetadata as repoDeleteMetadata,
} from '../models/metadata-repository.js';
import { replaceTagsForMetadata, getTagsForMetadata } from '../models/tag-repository.js';
import {
  normaliseFilePath,
  normaliseTags,
} from '../validation/metadata-validation.js';

function now() {
  return new Date().toISOString();
}

/**
 * Attach tags array to a metadata row object.
 * @param {object} row
 * @returns {object}
 */
function hydrate(row) {
  if (!row) return null;
  return {
    id: row.id,
    filePath: row.file_path,
    title: row.title,
    description: row.description ?? null,
    tags: getTagsForMetadata(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Create a new metadata record.
 * @param {{ filePath: string, title: string, description?: string, tags?: string[] }} payload
 * @returns {{ created: object }|{ conflict: true }}
 */
export function createMetadata(payload) {
  const filePath = normaliseFilePath(payload.filePath);
  const existing = findByFilePath(filePath);
  if (existing) return { conflict: true };

  const ts = now();
  const id = insertMetadata({
    filePath,
    title: payload.title.trim(),
    description: payload.description?.trim() ?? null,
    createdAt: ts,
    updatedAt: ts,
  });

  const tags = normaliseTags(payload.tags ?? []);
  replaceTagsForMetadata(id, tags);

  return { created: hydrate(findById(id)) };
}

/**
 * List metadata records, optionally filtered.
 * @param {string} [q]
 * @returns {object[]}
 */
export function listMetadata(q) {
  const rows = repoListMetadata(q);
  return rows.map(hydrate);
}

/**
 * Get a single metadata record.
 * @param {number} id
 * @returns {object|null}
 */
export function getMetadata(id) {
  return hydrate(findById(id));
}

/**
 * Update an existing metadata record.
 * @param {number} id
 * @param {{ title?: string, description?: string, tags?: string[] }} payload
 * @returns {object|null}
 */
export function updateMetadata(id, payload) {
  const row = findById(id);
  if (!row) return null;

  const fields = { updatedAt: now() };
  if (payload.title !== undefined) fields.title = payload.title.trim();
  if (payload.description !== undefined) fields.description = payload.description?.trim() ?? null;

  repoUpdateMetadata(id, fields);

  if (payload.tags !== undefined) {
    replaceTagsForMetadata(id, normaliseTags(payload.tags));
  }

  return hydrate(findById(id));
}

/**
 * Delete a metadata record.
 * @param {number} id
 * @returns {boolean}
 */
export function deleteMetadata(id) {
  return repoDeleteMetadata(id);
}
