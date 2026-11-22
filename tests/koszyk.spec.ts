import { test, expect } from './fixtures.ts';

test('klient dodaje dwa kubki do koszyka', async ({ klient, stronaProduktu, stronaKoszyka }) => {
  await stronaProduktu.otworz('kubek');
  await stronaProduktu.dodajDoKoszyka(2);
  await stronaKoszyka.otworz();
  await expect(stronaKoszyka.wiersz('Kubek')).toContainText('99,98 zł');
});
