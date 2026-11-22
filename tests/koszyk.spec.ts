import { test, expect } from '@playwright/test';

test('klient dodaje dwa kubki do koszyka', async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('E-mail').fill('klient@sklep.test');
  await page.getByLabel('Hasło').fill('Klient123!');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page.getByRole('button', { name: 'Wyloguj się' })).toBeVisible();
  await page.request.delete('/api/cart');

  await page.goto('/produkty/kubek');
  await page.getByLabel('Ilość').fill('2');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByRole('status')).toHaveText('Dodano do koszyka');

  await page.goto('/koszyk');
  await expect(page.getByRole('row').filter({ hasText: 'Kubek' })).toContainText('99,98 zł');
});
