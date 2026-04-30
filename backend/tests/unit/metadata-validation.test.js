/**
 * Unit tests for metadata input validation utilities (US1).
 */

import { describe, it, expect } from 'vitest';
import {
  validateCreatePayload,
  validateUpdatePayload,
  normaliseTags,
  normaliseFilePath,
} from '../../src/validation/metadata-validation.js';

describe('validateCreatePayload', () => {
  it('passes for a minimal valid payload', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '/a.jpg', title: 'Test' });
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it('fails when filePath is missing', () => {
    const { valid, errors } = validateCreatePayload({ title: 'Test' });
    expect(valid).toBe(false);
    expect(errors).toContain('filePath is required');
  });

  it('fails when filePath is empty string', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '  ', title: 'Test' });
    expect(valid).toBe(false);
    expect(errors).toContain('filePath is required');
  });

  it('fails when title is missing', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '/a.jpg' });
    expect(valid).toBe(false);
    expect(errors).toContain('title is required');
  });

  it('fails when title is empty string', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '/a.jpg', title: '  ' });
    expect(valid).toBe(false);
    expect(errors).toContain('title is required');
  });

  it('fails when title exceeds 200 chars', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '/a.jpg', title: 'x'.repeat(201) });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes('title'))).toBe(true);
  });

  it('fails when description exceeds 2000 chars', () => {
    const { valid, errors } = validateCreatePayload({
      filePath: '/a.jpg',
      title: 'T',
      description: 'x'.repeat(2001),
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes('description'))).toBe(true);
  });

  it('fails when a tag exceeds 50 chars', () => {
    const { valid, errors } = validateCreatePayload({
      filePath: '/a.jpg',
      title: 'T',
      tags: ['a'.repeat(51)],
    });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes('tags'))).toBe(true);
  });

  it('fails when tags is not an array', () => {
    const { valid, errors } = validateCreatePayload({ filePath: '/a.jpg', title: 'T', tags: 'bad' });
    expect(valid).toBe(false);
    expect(errors).toContain('tags must be an array');
  });
});

describe('validateUpdatePayload', () => {
  it('passes for empty update payload', () => {
    const { valid } = validateUpdatePayload({});
    expect(valid).toBe(true);
  });

  it('fails when title is updated to empty string', () => {
    const { valid, errors } = validateUpdatePayload({ title: '' });
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes('title'))).toBe(true);
  });
});

describe('normaliseTags', () => {
  it('lowercases and deduplicates tags', () => {
    const result = normaliseTags(['Nature', 'NATURE', 'travel', '  travel  ']);
    expect(result).toEqual(['nature', 'travel']);
  });

  it('filters blank tags', () => {
    expect(normaliseTags(['', '  ', 'valid'])).toEqual(['valid']);
  });

  it('returns empty array for non-array input', () => {
    expect(normaliseTags(null)).toEqual([]);
    expect(normaliseTags(undefined)).toEqual([]);
  });
});

describe('normaliseFilePath', () => {
  it('trims surrounding whitespace', () => {
    expect(normaliseFilePath('  /home/user/pic.jpg  ')).toBe('/home/user/pic.jpg');
  });
});
