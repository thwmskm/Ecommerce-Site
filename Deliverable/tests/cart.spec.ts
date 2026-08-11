import { test, expect } from '@playwright/test';

//add Ford Mustang to cart before running cart tests
test.beforeEach(async ({ page }) => {
  await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

  await page.getByRole('link', { name: 'View Details' }).first().click();

  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('/api/cart/add') &&
      response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Add to Cart' }).click();

  const response = await responsePromise;

  console.log('Cart API status:', response.status());
  console.log('Cart API response:', await response.text());
});

//checking if Ford Mustang is added to cart
test('cart items correct', async ({ page }) => {

    await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

    await page.getByRole('link', { name: 'Cart' }).click();

    await expect(page.getByText('Ford Mustang')).toBeVisible();

});

//checking if Clear Cart button clears entire cart.
test('clearing cart', async ({ page }) => {

    await page.goto('https://ecommerce-site-frontend-drab.vercel.app/');

    await page.getByRole('link', { name: 'Cart' }).click();

    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Are you sure you want to clear your cart?');
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Clear Cart' }).click();

    await expect(page.getByText('Continue Shopping')).toBeVisible();
});