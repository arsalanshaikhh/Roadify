import { test, expect } from '@playwright/test';

test.describe('Roadmap page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/roadmap/frontend-engineer');
    await expect(page).toHaveTitle(/Frontend Engineer/);
    await expect(page.getByRole('heading', { name: 'Frontend Engineer' })).toBeVisible();
  });

  test('shows topics sidebar on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByText('All Topics')).toBeVisible();
    await expect(page.getByText('Foundation')).toBeVisible();
  });

  test('shows progress bar in sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByText('Progress')).toBeVisible();
  });

  test('shows mobile topics toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByRole('button', { name: /Topics/ })).toBeVisible();
  });

  test('shows skill count in subtitle', async ({ page }) => {
    await page.goto('/roadmap/frontend-engineer');
    await expect(page.getByText(/skills · Click any node/)).toBeVisible();
  });

  test('returns 404 for unknown role', async ({ page }) => {
    await page.goto('/roadmap/not-a-real-role');
    await expect(page.getByText('Page not found')).toBeVisible();
  });
});
