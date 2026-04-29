/**
 * Contract tests for POST /api/metadata and GET /api/metadata (US1).
 * Validates status codes, response shapes, and error semantics.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import http from 'http';
import { createServer } from '../../src/server-test-helper.js';
import { closeDb } from '../../src/db/database.js';

let server;
let port;

beforeEach(async () => {
  ({ server, port } = await createServer());
});

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
  closeDb();
});

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      { hostname: 'localhost', port, path, method,
        headers: { 'Content-Type': 'application/json', 'Content-Length': payload ? Buffer.byteLength(payload) : 0 } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }));
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const VALID_PAYLOAD = {
  filePath: '/home/user/Pictures/test.jpg',
  title: 'Test Image',
  description: 'A test description.',
  tags: ['test', 'nature'],
};

describe('POST /api/metadata', () => {
  it('creates a record and returns 201 with ImageMetadata shape', async () => {
    const { status, body } = await request('POST', '/api/metadata', VALID_PAYLOAD);
    expect(status).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(Number),
      filePath: VALID_PAYLOAD.filePath,
      title: VALID_PAYLOAD.title,
      description: VALID_PAYLOAD.description,
      tags: expect.arrayContaining(['test', 'nature']),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('returns 400 when filePath is missing', async () => {
    const { status, body } = await request('POST', '/api/metadata', { title: 'No path' });
    expect(status).toBe(400);
    expect(body.error).toBe('validation_error');
  });

  it('returns 400 when title is missing', async () => {
    const { status, body } = await request('POST', '/api/metadata', { filePath: '/a.jpg' });
    expect(status).toBe(400);
    expect(body.error).toBe('validation_error');
  });

  it('returns 409 on duplicate filePath', async () => {
    await request('POST', '/api/metadata', VALID_PAYLOAD);
    const { status, body } = await request('POST', '/api/metadata', VALID_PAYLOAD);
    expect(status).toBe(409);
    expect(body.error).toBe('conflict');
  });
});

describe('GET /api/metadata', () => {
  it('returns 200 with an array', async () => {
    const { status, body } = await request('GET', '/api/metadata');
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it('returns created record in list', async () => {
    await request('POST', '/api/metadata', VALID_PAYLOAD);
    const { body } = await request('GET', '/api/metadata');
    expect(body.some((r) => r.filePath === VALID_PAYLOAD.filePath)).toBe(true);
  });
});
