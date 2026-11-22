// UZUPEŁNIENIE (etap 6): import po ćwiczeniu 2 z rozdziału 8
import { test, expect } from './fixtures.ts';

test('katalog pokazuje listę produktów', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Sklep ćwiczeniowy/);
  await expect(page.getByRole('heading', { name: 'Produkty', level: 1 })).toBeVisible();
});

test('strona kubka pokazuje nazwę i cenę', async ({ page }) => {
  await page.goto('/produkty/kubek');
  await expect(page.getByRole('heading', { name: 'Kubek', level: 1 })).toBeVisible();
  await expect(page.getByText('49,99 zł')).toBeVisible();
});
