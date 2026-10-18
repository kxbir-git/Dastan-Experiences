import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should load and display main headline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:3000/');
    const headline = page.locator('h1:has-text("Every Event Has a Story")');
    await expect(headline).toBeVisible();
  });

  test('should navigate to events page via link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View All Experiences/i }).click();
    await expect(page).toHaveURL(/\/events/);
    // Verify events list is rendered
    await expect(page.getByRole('heading', { name: /Signature Dastans/i })).toBeVisible();
  });
});
