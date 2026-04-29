/**
 * Helpers for building consistent JSON error responses.
 */

/**
 * Send a validation error response.
 * @param {import('http').ServerResponse} res
 * @param {string[]} errors
 * @param {number} [status=400]
 */
export function sendValidationError(res, errors, status = 400) {
  sendJson(res, status, {
    error: 'validation_error',
    message: errors[0] ?? 'Validation failed',
    errors,
  });
}

/**
 * Send a not-found error response.
 * @param {import('http').ServerResponse} res
 */
export function sendNotFound(res) {
  sendJson(res, 404, { error: 'not_found', message: 'Resource not found' });
}

/**
 * Send a conflict error response.
 * @param {import('http').ServerResponse} res
 * @param {string} message
 */
export function sendConflict(res, message) {
  sendJson(res, 409, { error: 'conflict', message });
}

/**
 * Send a generic internal server error response.
 * @param {import('http').ServerResponse} res
 * @param {Error} [err]
 */
export function sendServerError(res, err) {
  console.error('[server error]', err);
  sendJson(res, 500, { error: 'internal_server_error', message: 'An unexpected error occurred' });
}

/**
 * Write a JSON body to res.
 * @param {import('http').ServerResponse} res
 * @param {number} status
 * @param {unknown} body
 */
export function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}
