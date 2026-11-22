import { test, expect } from './fixtures.ts';

test('koszyk przygotowany przez API jest widoczny w interfejsie', async ({ klient, page, stronaKoszyka }) => {
  const odpowiedz = await page.request.post('/api/cart/items', { data: { produktId: 12, ilosc: 3 } });
  await expect(odpowiedz).toBeOK();
  await stronaKoszyka.otworz();
  await expect(stronaKoszyka.wiersz('Notes')).toContainText('46,50 zł');
});
