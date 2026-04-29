/**
 * HTTP route handler for /api/metadata endpoints.
 * Covers all CRUD operations + search.
 */

import {
  createMetadata,
  listMetadata,
  getMetadata,
  updateMetadata,
  deleteMetadata,
} from '../services/metadata-service.js';
import { validateCreatePayload, validateUpdatePayload } from '../validation/metadata-validation.js';
import {
  sendJson,
  sendValidationError,
  sendNotFound,
  sendConflict,
  sendServerError,
} from './error-response.js';

/**
 * Read the full request body as a parsed JSON object.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<unknown>}
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Route all /api/metadata requests.
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export async function handleMetadataRoutes(req, res) {
  try {
    const url = new URL(req.url, `http://localhost`);
    const pathname = url.pathname; // /api/metadata or /api/metadata/:id
    const idMatch = pathname.match(/^\/api\/metadata\/(\d+)$/);
    const id = idMatch ? Number(idMatch[1]) : null;

    // POST /api/metadata
    if (req.method === 'POST' && pathname === '/api/metadata') {
      const body = await readBody(req);
      const { valid, errors } = validateCreatePayload(body);
      if (!valid) return sendValidationError(res, errors);

      const result = createMetadata(body);
      if (result.conflict) return sendConflict(res, 'A record with this file path already exists');
      return sendJson(res, 201, result.created);
    }

    // GET /api/metadata
    if (req.method === 'GET' && pathname === '/api/metadata') {
      const q = url.searchParams.get('q') ?? undefined;
      return sendJson(res, 200, listMetadata(q));
    }

    // GET /api/metadata/:id
    if (req.method === 'GET' && id !== null) {
      const record = getMetadata(id);
      if (!record) return sendNotFound(res);
      return sendJson(res, 200, record);
    }

    // PUT /api/metadata/:id
    if (req.method === 'PUT' && id !== null) {
      const body = await readBody(req);
      const { valid, errors } = validateUpdatePayload(body);
      if (!valid) return sendValidationError(res, errors);

      const updated = updateMetadata(id, body);
      if (!updated) return sendNotFound(res);
      return sendJson(res, 200, updated);
    }

    // DELETE /api/metadata/:id
    if (req.method === 'DELETE' && id !== null) {
      const deleted = deleteMetadata(id);
      if (!deleted) return sendNotFound(res);
      res.writeHead(204);
      res.end();
      return;
    }

    sendNotFound(res);
  } catch (err) {
    sendServerError(res, err);
  }
}
