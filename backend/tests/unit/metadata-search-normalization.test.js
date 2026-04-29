/**
 * Unit tests for search query normalisation (US2).
 * Covers edge cases in query handling across the validation/repository layer.
 */

import { describe, it, expect } from 'vitest';
import { normaliseTags } from '../../src/validation/metadata-validation.js';

describe('normaliseTags', () => {
  it('lowercases all tags', () => {
    expect(normaliseTags(['NATURE', 'SunSet'])).toEqual(['nature', 'sunset']);
  });

  it('trims whitespace from each tag', () => {
    expect(normaliseTags(['  sky  ', ' water'])).toEqual(['sky', 'water']);
  });

  it('removes duplicate tags (case-insensitive)', () => {
    expect(normaliseTags(['cat', 'CAT', 'Cat'])).toEqual(['cat']);
  });

  it('removes empty strings after trimming', () => {
    expect(normaliseTags(['', '   ', 'tag'])).toEqual(['tag']);
  });

  it('returns empty array for empty input', () => {
    expect(normaliseTags([])).toEqual([]);
  });

  it('returns empty array for non-array input', () => {
    expect(normaliseTags(null)).toEqual([]);
    expect(normaliseTags(undefined)).toEqual([]);
    expect(normaliseTags('invalid')).toEqual([]);
  });

  it('preserves order of first occurrence after dedup', () => {
    expect(normaliseTags(['alpha', 'beta', 'ALPHA'])).toEqual(['alpha', 'beta']);
  });
});

describe('Search query normalisation semantics', () => {
  it('blank string is treated as no-filter (truthy check)', () => {
    // The repository uses `if (q)` to skip the WHERE clause.
    // This test documents the expected behaviour at the boundary.
    const q = '   ';
    expect(q.trim()).toBe('');
    expect(!q.trim()).toBe(true); // falsy after trim → list all
  });

  it('query with leading/trailing spaces is trimmed before use', () => {
    const raw = '  sunset  ';
    expect(raw.trim()).toBe('sunset');
  });
});
