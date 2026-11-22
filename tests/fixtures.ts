import { test as base, expect } from '@playwright/test';
import { StronaProduktu } from './strony/strona-produktu.ts';
import { StronaKoszyka } from './strony/strona-koszyka.ts';
import { nowyKlient, type DaneKlienta } from './dane.ts';

interface Fixtures {
  stronaProduktu: StronaProduktu;
  stronaKoszyka: StronaKoszyka;
  klient: DaneKlienta;
}

export const test = base.extend<Fixtures>({
  stronaProduktu: async ({ page }, use) => {
    await use(new StronaProduktu(page));
  },
  stronaKoszyka: async ({ page }, use) => {
    await use(new StronaKoszyka(page));
  },
  klient: async ({ page }, use) => {
    const dane = nowyKlient();
    await expect(await page.request.post('/api/users', { data: dane })).toBeOK();
    await expect(await page.request.post('/api/login', { data: dane })).toBeOK();
    await use(dane);
    await page.request.delete('/api/users/me');
  },
});

export { expect };
