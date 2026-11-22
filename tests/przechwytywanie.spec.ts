import { test, expect } from './fixtures.ts';
// UZUPEŁNIENIE (etap 6): import schematu z rozdziału 9.3
import { ListaProduktow } from './schematy.ts';

test('katalog pokazuje komunikat, gdy API produktów nie działa', async ({ page }) => {
  await page.route('**/api/products', (route) => route.fulfill({ status: 500, json: { blad: 'awaria' } }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toHaveText('Nie udało się wczytać produktów');
});

test('katalog formatuje cenę z dwoma miejscami po przecinku', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    const odpowiedz = await route.fetch();
    const produkty = ListaProduktow.parse(await odpowiedz.json());
    await route.fulfill({ response: odpowiedz, json: produkty.map((p) => ({ ...p, cena: 9.9 })) });
  });
  await page.goto('/');
  await expect(page.getByRole('listitem').filter({ hasText: 'Kubek' })).toContainText('9,90 zł');
});

test('katalog z nagrania', async ({ page }) => {
  await page.routeFromHAR('hary/produkty.har', {
    url: '**/api/products',
    update: !!process.env.NAGRAJ_HAR,
  });
  await page.goto('/');
  await expect(page.getByRole('listitem')).toHaveCount(3);
});
