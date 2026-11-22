import { test, expect } from './fixtures.ts';

test.use({ storageState: 'playwright/.auth/admin.json' });

test('administrator ma dostęp do zamówienia nr 1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Wyloguj się' })).toBeVisible();
  const odpowiedz = await page.request.get('/api/orders/1');
  await expect(odpowiedz).toBeOK();
});
