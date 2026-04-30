// @ts-check
import { test, expect } from '@playwright/test';

test.describe('US2: Search metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Seed two records via the form
    await seedRecord(page, '/photos/sunset.jpg', 'Golden Sunset', '', 'landscape,nature');
    await seedRecord(page, '/photos/cat.jpg',    'Fluffy Cat',    '', 'animal,pet');
  });

  test('shows all records when search is empty', async ({ page }) => {
    await expect(page.locator('.metadata-item')).toHaveCount(2);
  });

  test('filters records by title as user types', async ({ page }) => {
    await page.fill('#metadata-search', 'sunset');
    await page.waitForTimeout(400); // debounce
    await expect(page.locator('.metadata-item')).toHaveCount(1);
    await expect(page.locator('.metadata-item')).toContainText('Golden Sunset');
  });

  test('filters records by tag', async ({ page }) => {
    await page.fill('#metadata-search', 'animal');
    await page.waitForTimeout(400);
    await expect(page.locator('.metadata-item')).toHaveCount(1);
    await expect(page.locator('.metadata-item')).toContainText('Fluffy Cat');
  });

  test('shows empty-state message when no results match', async ({ page }) => {
    await page.fill('#metadata-search', 'zzznomatch');
    await page.waitForTimeout(400);
    await expect(page.locator('.metadata-item')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('restores full list when search is cleared', async ({ page }) => {
    await page.fill('#metadata-search', 'sunset');
    await page.waitForTimeout(400);
    await expect(page.locator('.metadata-item')).toHaveCount(1);

    await page.fill('#metadata-search', '');
    await page.waitForTimeout(400);
    await expect(page.locator('.metadata-item')).toHaveCount(2);
  });
});

/**
 * Helper: fill and submit the metadata form.
 */
async function seedRecord(page, filePath, title, description, tags) {
  await page.fill('#file-path', filePath);
  await page.fill('#title', title);
  if (description) await page.fill('#description', description);
  if (tags) await page.fill('#tags', tags);
  await page.click('button[type="submit"]');
  // wait for the list to update
  await page.waitForSelector(`.metadata-item >> text=${title}`);
}
