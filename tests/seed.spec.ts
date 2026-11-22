import { test, expect } from './fixtures.ts';

test.describe('Sklep', () => {
  test('seed', async ({ klient, page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Produkty' })).toBeVisible();
  });
});
