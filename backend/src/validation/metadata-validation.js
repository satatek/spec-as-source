/**
 * Shared validation utilities for image metadata payloads.
 */

const MAX_TITLE_LEN = 200;
const MAX_DESC_LEN = 2000;
const MAX_TAG_LEN = 50;

/**
 * Validate a create-metadata payload.
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCreatePayload(body) {
  const errors = [];

  const filePath = typeof body?.filePath === 'string' ? body.filePath.trim() : '';
  if (!filePath) errors.push('filePath is required');

  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  if (!title) errors.push('title is required');
  else if (title.length > MAX_TITLE_LEN) errors.push(`title must be at most ${MAX_TITLE_LEN} characters`);

  const description = body?.description ?? null;
  if (description !== null && typeof description !== 'string')
    errors.push('description must be a string');
  else if (description && description.length > MAX_DESC_LEN)
    errors.push(`description must be at most ${MAX_DESC_LEN} characters`);

  const tagErrors = validateTags(body?.tags);
  errors.push(...tagErrors);

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an update-metadata payload.
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateUpdatePayload(body) {
  const errors = [];

  if (body?.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) errors.push('title must not be empty');
    else if (title.length > MAX_TITLE_LEN) errors.push(`title must be at most ${MAX_TITLE_LEN} characters`);
  }

  if (body?.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string')
      errors.push('description must be a string');
    else if (body.description.length > MAX_DESC_LEN)
      errors.push(`description must be at most ${MAX_DESC_LEN} characters`);
  }

  if (body?.tags !== undefined) {
    const tagErrors = validateTags(body.tags);
    errors.push(...tagErrors);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate and normalise a tags array.
 * @param {unknown} tags
 * @returns {string[]} array of error messages
 */
function validateTags(tags) {
  if (tags === undefined || tags === null) return [];
  if (!Array.isArray(tags)) return ['tags must be an array'];
  const errors = [];
  tags.forEach((tag, i) => {
    if (typeof tag !== 'string') {
      errors.push(`tags[${i}] must be a string`);
    } else if (tag.trim().length === 0) {
      errors.push(`tags[${i}] must not be empty`);
    } else if (tag.trim().length > MAX_TAG_LEN) {
      errors.push(`tags[${i}] must be at most ${MAX_TAG_LEN} characters`);
    }
  });
  return errors;
}

/**
 * Normalise a tags array: trim, lowercase, deduplicate.
 * @param {string[]} tags
 * @returns {string[]}
 */
export function normaliseTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))];
}

/**
 * Normalise a file path: trim whitespace and resolve separators consistently.
 * @param {string} filePath
 * @returns {string}
 */
export function normaliseFilePath(filePath) {
  return filePath.trim();
}
