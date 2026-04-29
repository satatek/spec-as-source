// @ts-check
import { test, expect } from '@playwright/test';

test.describe('US3: Edit and delete metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await seedRecord(page, '/photos/sunset.jpg', 'Golden Sunset', 'Warm colours', 'landscape');
  });

  test('edit button loads record into form', async ({ page }) => {
    await page.click('[data-action="edit"]');
    await expect(page.locator('#title')).toHaveValue('Golden Sunset');
    await expect(page.locator('#file-path')).toHaveValue('/photos/sunset.jpg');
    await expect(page.locator('#tags')).toHaveValue('landscape');
  });

  test('editing a record updates it in the list', async ({ page }) => {
    await page.click('[data-action="edit"]');
    await page.fill('#title', 'Updated Title');
    await page.click('button[type="submit"]');

    await expect(page.locator('.metadata-item')).toContainText('Updated Title');
    await expect(page.locator('.metadata-item')).not.toContainText('Golden Sunset');
  });

  test('updated record persists after page reload', async ({ page }) => {
    await page.click('[data-action="edit"]');
    await page.fill('#title', 'Persisted Update');
    await page.click('button[type="submit"]');

    await page.reload();
    await page.waitForSelector('.metadata-item');
    await expect(page.locator('.metadata-item')).toContainText('Persisted Update');
  });

  test('delete button removes the record from the list', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());
    await page.click('[data-action="delete"]');
    await expect(page.locator('.metadata-item')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('deleted record does not reappear after reload', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());
    await page.click('[data-action="delete"]');
    await page.reload();
    await expect(page.locator('.metadata-item')).toHaveCount(0);
  });

  test('cancel dialog keeps the record', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.dismiss());
    await page.click('[data-action="delete"]');
    await expect(page.locator('.metadata-item')).toHaveCount(1);
  });
});

async function seedRecord(page, filePath, title, description, tags) {
  await page.fill('#file-path', filePath);
  await page.fill('#title', title);
  if (description) await page.fill('#description', description);
  if (tags) await page.fill('#tags', tags);
  await page.click('button[type="submit"]');
  await page.waitForSelector(`.metadata-item >> text=${title}`);
}
