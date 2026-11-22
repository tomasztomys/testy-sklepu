import { test, expect } from '@playwright/test';

// UZUPEŁNIENIE (etap 6): testy na wspólnym koncie po kolei (rozdział 7.3)
test.describe.configure({ mode: 'serial' });

test('klient dodaje dwa kubki do koszyka', async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('E-mail').fill('klient@sklep.test');
  await page.getByLabel('Hasło').fill('Klient123!');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page.getByRole('button', { name: 'Wyloguj się' })).toBeVisible();
  // UZUPEŁNIENIE (etap 6): obejście ze wspólnym kontem z rozdziału 7.3
  await page.request.delete('/api/cart');

  await page.goto('/produkty/kubek');
  await page.getByLabel('Ilość').fill('2');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByRole('status')).toHaveText('Dodano do koszyka');

  await page.goto('/koszyk');
  await expect(page.getByRole('row').filter({ hasText: 'Kubek' })).toContainText('99,98 zł');
});
