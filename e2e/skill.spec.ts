import { test, expect } from '@playwright/test';

test.describe('Skill page', () => {
  test('loads React skill with correct title', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page).toHaveTitle(/React/);
    await expect(page.getByRole('heading', { name: 'React' })).toBeVisible();
  });

  test('shows estimated hours badge', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page.getByText(/h to learn/)).toBeVisible();
  });

  test('shows Topics Covered section', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page.getByText('Topics Covered')).toBeVisible();
  });

  test('shows Resources section with filter tabs', async ({ page }) => {
    await page.goto('/skill/react');
    await expect(page.getByText('Resources')).toBeVisible();
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Free' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Paid' })).toBeVisible();
  });

  test('Free filter hides paid resources', async ({ page }) => {
    await page.goto('/skill/react');
    await page.getByRole('button', { name: 'Free' }).click();
    await expect(page.getByText('Epic React – Kent C. Dodds')).not.toBeVisible();
  });

  test('All filter shows all resources', async ({ page }) => {
    await page.goto('/skill/react');
    await page.getByRole('button', { name: 'Free' }).click();
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByText('Epic React – Kent C. Dodds')).toBeVisible();
  });

  test('mark complete button toggles', async ({ page }) => {
    await page.goto('/skill/react?from=frontend-engineer');
    await expect(page.getByText('Mark complete')).toBeVisible();
    await page.getByText('Mark complete').click();
    await expect(page.getByText('✓ Completed')).toBeVisible();
    await page.getByText('✓ Completed').click();
    await expect(page.getByText('Mark complete')).toBeVisible();
  });

  test('breadcrumb links back to roadmap', async ({ page }) => {
    await page.goto('/skill/react?from=frontend-engineer');
    await page.getByText('← Frontend Engineer').click();
    await expect(page).toHaveURL('/roadmap/frontend-engineer');
  });

  test('returns 404 for unknown skill', async ({ page }) => {
    await page.goto('/skill/not-a-real-skill');
    await expect(page.getByText('Page not found')).toBeVisible();
  });

  test('resource links have target _blank', async ({ page }) => {
    await page.goto('/skill/react');
    const links = page.locator('a[target="_blank"]');
    await expect(links.first()).toBeVisible();
  });
});
