import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { StronaProduktu } from './strony/strona-produktu.ts';
import { StronaKoszyka } from './strony/strona-koszyka.ts';
import { nowyKlient, type DaneKlienta } from './dane.ts';
import { mutacje } from './mutacje.ts';

interface Fixtures {
  stronaProduktu: StronaProduktu;
  stronaKoszyka: StronaKoszyka;
  klient: DaneKlienta;
  apiKlienta: APIRequestContext;
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    const nazwa = process.env.MUTACJA;
    if (nazwa) {
      const mutacja = mutacje[nazwa];
      if (!mutacja) throw new Error(`Nieznana mutacja: ${nazwa}`);
      await mutacja(page);
    }
    await use(page);
  },
  stronaProduktu: async ({ page }, use) => {
    await use(new StronaProduktu(page));
  },
  stronaKoszyka: async ({ page }, use) => {
    await use(new StronaKoszyka(page));
  },
  apiKlienta: async ({ playwright, baseURL }, use) => {
    const api = await playwright.request.newContext({ baseURL });
    const dane = nowyKlient();
    await expect(await api.post('/api/users', { data: dane })).toBeOK();
    await expect(await api.post('/api/login', { data: dane })).toBeOK();
    await use(api);
    await api.delete('/api/users/me');
    await api.dispose();
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
