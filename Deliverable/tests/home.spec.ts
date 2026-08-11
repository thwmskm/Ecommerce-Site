import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

//------------------------------------------------------------------------Start of tests

//If heading loads on homepage launch
test('homepage loads', async ({ page }) => {
  await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

  await expect(
    page.getByRole('heading', { name: 'Available Electric Vehicle'} )
  ).toBeVisible();
});


test('homepage content loads', async ({ page }) => {
  await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

  await expect(page.locator('.vehicle-card').first()).toBeVisible();
});