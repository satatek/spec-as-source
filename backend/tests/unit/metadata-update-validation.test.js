/**
 * Unit tests for update payload validation (US3).
 */

import { describe, it, expect } from 'vitest';
import { validateUpdatePayload } from '../../src/validation/metadata-validation.js';

describe('validateUpdatePayload', () => {
  it('returns valid for a partial update with only title', () => {
    const result = validateUpdatePayload({ title: 'New Title' });
    expect(result.valid).toBe(true);
  });

  it('returns valid for a partial update with only description', () => {
    const result = validateUpdatePayload({ description: 'Updated desc' });
    expect(result.valid).toBe(true);
  });

  it('returns valid for a partial update with only tags', () => {
    const result = validateUpdatePayload({ tags: ['a', 'b'] });
    expect(result.valid).toBe(true);
  });

  it('returns valid for a full update payload', () => {
    const result = validateUpdatePayload({
      title: 'Full Update',
      description: 'Some description',
      tags: ['tag1'],
    });
    expect(result.valid).toBe(true);
  });

  it('returns invalid when title is an empty string', () => {
    const result = validateUpdatePayload({ title: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('title')]));
  });

  it('returns invalid when title exceeds 200 characters', () => {
    const result = validateUpdatePayload({ title: 'x'.repeat(201) });
    expect(result.valid).toBe(false);
  });

  it('returns invalid when description exceeds 2000 characters', () => {
    const result = validateUpdatePayload({ description: 'x'.repeat(2001) });
    expect(result.valid).toBe(false);
  });

  it('returns invalid when a tag exceeds 50 characters', () => {
    const result = validateUpdatePayload({ tags: ['x'.repeat(51)] });
    expect(result.valid).toBe(false);
  });

  it('returns valid for empty payload (no-op update)', () => {
    // An empty object is technically valid — the service simply won't update anything.
    const result = validateUpdatePayload({});
    expect(result.valid).toBe(true);
  });
});
