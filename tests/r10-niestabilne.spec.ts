import { test, expect } from './fixtures.ts';

/* eslint-disable playwright/no-wait-for-timeout, playwright/prefer-web-first-assertions */

test('niestabilny: sztywne czekanie', async ({ klient, page }) => {
  await page.goto('/produkty/kubek');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await page.waitForTimeout(1000);
  expect(await page.getByRole('status').textContent()).toBe('Dodano do koszyka');
});

test('stabilny: asercja web-first', async ({ klient, page }) => {
  await page.goto('/produkty/kubek');
  await page.getByRole('button', { name: 'Dodaj do koszyka' }).click();
  await expect(page.getByRole('status')).toHaveText('Dodano do koszyka');
});
