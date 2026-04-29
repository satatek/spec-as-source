/**
 * Lightweight fetch-based API client for the local metadata backend.
 * Base URL is proxied through Vite to http://localhost:3001/api in dev.
 */

const BASE = '/api/metadata';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(path, opts);
  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.message ?? 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * List metadata records, optionally filtered by a search query.
 * @param {string} [q]
 * @returns {Promise<object[]>}
 */
export function listMetadata(q) {
  const url = q ? `${BASE}?q=${encodeURIComponent(q)}` : BASE;
  return request('GET', url);
}

/**
 * Get a single metadata record by ID.
 * @param {number} id
 * @returns {Promise<object>}
 */
export function getMetadata(id) {
  return request('GET', `${BASE}/${id}`);
}

/**
 * Create a new metadata record.
 * @param {{ filePath: string, title: string, description?: string, tags?: string[] }} payload
 * @returns {Promise<object>}
 */
export function createMetadata(payload) {
  return request('POST', BASE, payload);
}

/**
 * Update an existing metadata record.
 * @param {number} id
 * @param {{ title?: string, description?: string, tags?: string[] }} payload
 * @returns {Promise<object>}
 */
export function updateMetadata(id, payload) {
  return request('PUT', `${BASE}/${id}`, payload);
}

/**
 * Delete a metadata record.
 * @param {number} id
 * @returns {Promise<null>}
 */
export function deleteMetadata(id) {
  return request('DELETE', `${BASE}/${id}`);
}
