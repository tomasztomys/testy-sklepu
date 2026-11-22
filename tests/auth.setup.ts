import { test as setup, expect } from '@playwright/test';

const plikAdmina = 'playwright/.auth/admin.json';

setup('logowanie administratora', async ({ page }) => {
  await page.goto('/logowanie');
  await page.getByLabel('E-mail').fill(process.env.ADMIN_EMAIL ?? '');
  await page.getByLabel('Hasło').fill(process.env.ADMIN_HASLO ?? '');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();
  await expect(page.getByRole('button', { name: 'Wyloguj się' })).toBeVisible();
  await page.context().storageState({ path: plikAdmina });
});
