/**
 * Contract tests for GET /api/metadata?q= search (US2).
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

const RECORDS = [
  { filePath: '/photos/sunset.jpg', title: 'Golden Sunset', description: 'Warm colours', tags: ['landscape', 'nature'] },
  { filePath: '/photos/cat.jpg',    title: 'Fluffy Cat',     description: 'Indoor pet photo', tags: ['cat', 'animal'] },
  { filePath: '/work/diagram.png',  title: 'Architecture Diagram', description: 'System overview', tags: ['work', 'tech'] },
];

async function seedRecords() {
  for (const r of RECORDS) {
    await request('POST', '/api/metadata', r);
  }
}

describe('GET /api/metadata?q=', () => {
  beforeEach(seedRecords);

  it('returns all records when no query given', async () => {
    const { status, body } = await request('GET', '/api/metadata', null);
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
  });

  it('filters by title (case-insensitive)', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=sunset', null);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Golden Sunset');
  });

  it('filters by tag', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=nature', null);
    expect(status).toBe(200);
    expect(body.some((r) => r.title === 'Golden Sunset')).toBe(true);
  });

  it('filters by description content', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=indoor', null);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Fluffy Cat');
  });

  it('filters by file path segment', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=diagram', null);
    expect(status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].filePath).toBe('/work/diagram.png');
  });

  it('returns empty array when no records match', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=zzznomatch', null);
    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it('returns 200 with all records for blank query string', async () => {
    const { status, body } = await request('GET', '/api/metadata?q=', null);
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
  });
});
