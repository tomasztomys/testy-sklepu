import type { Page } from '@playwright/test';

type Mutacja = (page: Page) => Promise<void>;

const podmienTekst =
  (sciezka: string, z: string, na: string): Mutacja =>
  async (page) => {
    await page.route(`**${sciezka}`, async (route) => {
      const odpowiedz = await route.fetch();
      const tresc = (await odpowiedz.text()).replaceAll(z, na);
      await route.fulfill({ response: odpowiedz, body: tresc });
    });
  };

export const mutacje: Record<string, Mutacja> = {
  'cena-kubka': podmienTekst('/produkty/kubek', '49,99 zł', '59,99 zł'),
  'bez-komunikatu': podmienTekst(
    '/produkty/kubek',
    'Dodano do koszyka',
    'Gotowe',
  ),
  'blad-koszyka': async (page) => {
    await page.route('**/api/cart/items', async (route) => {
      if (route.request().method() !== 'POST') return route.fallback();
      await route.fulfill({ status: 500, json: { blad: 'Błąd serwera' } });
    });
  },
  'pusty-katalog': async (page) => {
    await page.route('**/api/products', (route) => route.fulfill({ json: [] }));
  },
};
