/**
 * End-to-end test: add a metadata entry and verify it persists after page reload (US1).
 * @see specs/002-application-uses-vite/contracts/metadata-api.md
 */

import { test, expect } from '@playwright/test';

test('user can add metadata and see it after reload', async ({ page }) => {
  await page.goto('/');

  // Fill the metadata form
  await page.getByLabel('File Path').fill('/home/user/Pictures/e2e-test.jpg');
  await page.getByLabel('Title').fill('E2E Test Image');
  await page.getByLabel('Description').fill('Created by Playwright');
  await page.getByLabel('Tags').fill('e2e, playwright');

  // Submit
  await page.getByRole('button', { name: /add|save/i }).click();

  // Entry should appear in the list
  await expect(page.getByText('E2E Test Image')).toBeVisible();

  // Reload and confirm data persists from SQLite
  await page.reload();
  await expect(page.getByText('E2E Test Image')).toBeVisible();
  await expect(page.getByText('/home/user/Pictures/e2e-test.jpg')).toBeVisible();
});

test('duplicate filePath shows a conflict error', async ({ page }) => {
  await page.goto('/');

  const fillAndSubmit = async () => {
    await page.getByLabel('File Path').fill('/home/user/Pictures/dup.jpg');
    await page.getByLabel('Title').fill('Dup Test');
    await page.getByRole('button', { name: /add|save/i }).click();
  };

  await fillAndSubmit();
  await expect(page.getByText('Dup Test')).toBeVisible();

  await fillAndSubmit();
  await expect(page.getByRole('alert')).toContainText(/already exists|conflict/i);
});
