import { test, expect } from '@playwright/test';

test.describe('logowanie', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/logowanie');
  });

  test('klient loguje się poprawnymi danymi', async ({ page }) => {
    await test.step('wypełnij formularz', async () => {
      await page.getByLabel('E-mail').fill('klient@sklep.test');
      await page.getByLabel('Hasło').fill('Klient123!');
      await page.getByRole('button', { name: 'Zaloguj się' }).click();
    });

    await expect(page.getByRole('button', { name: 'Wyloguj się' })).toBeVisible();
  });

  test('błędne hasło pokazuje komunikat', async ({ page }) => {
    await page.getByLabel('E-mail').fill('klient@sklep.test');
    await page.getByLabel('Hasło').fill('zle-haslo');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await expect(page.getByRole('alert')).toHaveText('Nieprawidłowy e-mail lub hasło');
  });
});
