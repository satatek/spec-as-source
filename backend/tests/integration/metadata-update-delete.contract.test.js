/**
 * Contract tests for GET /api/metadata/:id, PUT /api/metadata/:id,
 * and DELETE /api/metadata/:id (US3).
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
      {
        hostname: 'localhost',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': payload ? Buffer.byteLength(payload) : 0,
        },
      },
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

const SEED = { filePath: '/home/user/Photos/beach.jpg', title: 'Beach Scene', description: 'Sunny day', tags: ['travel'] };

async function seedOne() {
  const { body } = await request('POST', '/api/metadata', SEED);
  return body;
}

describe('GET /api/metadata/:id', () => {
  it('returns the record by id', async () => {
    const created = await seedOne();
    const { status, body } = await request('GET', `/api/metadata/${created.id}`, null);
    expect(status).toBe(200);
    expect(body.id).toBe(created.id);
    expect(body.title).toBe(SEED.title);
  });

  it('returns 404 for unknown id', async () => {
    const { status, body } = await request('GET', '/api/metadata/99999', null);
    expect(status).toBe(404);
    expect(body.error).toBe('not_found');
  });
});

describe('PUT /api/metadata/:id', () => {
  it('updates title and returns updated record', async () => {
    const created = await seedOne();
    const { status, body } = await request('PUT', `/api/metadata/${created.id}`, { title: 'Updated Title' });
    expect(status).toBe(200);
    expect(body.title).toBe('Updated Title');
    expect(body.filePath).toBe(SEED.filePath); // unchanged
  });

  it('updates tags and replaces previous set', async () => {
    const created = await seedOne();
    const { body } = await request('PUT', `/api/metadata/${created.id}`, { tags: ['newtag', 'anothertag'] });
    expect(body.tags).toEqual(expect.arrayContaining(['newtag', 'anothertag']));
    expect(body.tags).not.toContain('travel');
  });

  it('returns 404 for unknown id', async () => {
    const { status, body } = await request('PUT', '/api/metadata/99999', { title: 'X' });
    expect(status).toBe(404);
    expect(body.error).toBe('not_found');
  });

  it('returns 400 for invalid update payload (empty title)', async () => {
    const created = await seedOne();
    const { status, body } = await request('PUT', `/api/metadata/${created.id}`, { title: '' });
    expect(status).toBe(400);
    expect(body.error).toBe('validation_error');
  });
});

describe('DELETE /api/metadata/:id', () => {
  it('deletes the record and returns 204', async () => {
    const created = await seedOne();
    const { status } = await request('DELETE', `/api/metadata/${created.id}`, null);
    expect(status).toBe(204);
  });

  it('record is gone after deletion', async () => {
    const created = await seedOne();
    await request('DELETE', `/api/metadata/${created.id}`, null);
    const { status } = await request('GET', `/api/metadata/${created.id}`, null);
    expect(status).toBe(404);
  });

  it('returns 404 for already-deleted id', async () => {
    const created = await seedOne();
    await request('DELETE', `/api/metadata/${created.id}`, null);
    const { status } = await request('DELETE', `/api/metadata/${created.id}`, null);
    expect(status).toBe(404);
  });
});
