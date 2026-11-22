// spec: specs/koszyk.md
// seed: tests/seed.spec.ts

import { test, expect } from './fixtures.ts';

test.describe('Kody rabatowe', () => {
  test('Zastosowanie aktywnego kodu JESIEN10', async ({ klient, page }) => {
    // 1. Otwórz stronę /produkty/kubek i dodaj jeden kubek do koszyka
    await page.goto('http://localhost:3000/produkty/kubek');
    await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();

    // 2. Przejdź do /koszyk
    await page.goto('http://localhost:3000/koszyk');

    // 3. Wpisz „JESIEN10” w pole „Kod rabatowy” i kliknij „Zastosuj”
    await page.getByLabel('Kod rabatowy').fill('JESIEN10');
    await page.getByRole('button', { name: 'Zastosuj' }).click();
    await expect(page.getByText('Zastosowano kod JESIEN10')).toBeVisible();
  });
});
