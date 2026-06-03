import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows role cards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Roadify/);
    await expect(page.getByText('Frontend Engineer')).toBeVisible();
    await expect(page.getByText('Software Engineering')).toBeVisible();
  });

  test('shows all three category sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section#software')).toBeVisible();
    await expect(page.locator('section#data')).toBeVisible();
    await expect(page.locator('section#ai')).toBeVisible();
  });

  test('search filters roles by name', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search roles...').fill('frontend');
    await expect(page.getByText('Frontend Engineer')).toBeVisible();
    await expect(page.getByText('Backend Engineer')).not.toBeVisible();
  });

  test('search shows no results message for unknown query', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Search roles...').fill('zzzznotarole');
    await expect(page.getByText(/No roles match/)).toBeVisible();
  });

  test('clicking a role card navigates to roadmap page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Frontend Engineer/ }).first().click();
    await expect(page).toHaveURL('/roadmap/frontend-engineer');
  });

  test('role cards show stats (skills count)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/\d+ skills/).first()).toBeVisible();
  });
});
