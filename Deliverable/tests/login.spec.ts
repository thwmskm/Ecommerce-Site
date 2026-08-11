import { test, expect } from '@playwright/test';

//move to Sign In page beforehand
test.beforeEach(async ({ page }) => {
  await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

  await page.getByRole('link', { name: 'Sign In' }).click();

});

test('logging into existing account', async ({ page }) => {
   
    await page.locator('input[placeholder="Email"]').fill('DrewBuck@email.com');

    await page.locator('input[placeholder="Password"]').fill("drewbuck123");

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Login successful!');
    }));
});