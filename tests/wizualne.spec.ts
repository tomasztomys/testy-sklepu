import { test, expect } from './fixtures.ts';

test('strona kubka wygląda jak wzorzec', { tag: '@wizualne' }, async ({ page }) => {
  await page.goto('/produkty/kubek');
  await expect(page).toHaveScreenshot('strona-kubka.png', {
    mask: [page.getByRole('img')],
    maxDiffPixelRatio: 0.01,
  });
});

test('koszyk z kubkiem wygląda jak wzorzec', { tag: '@wizualne' }, async ({ klient, page, stronaProduktu, stronaKoszyka }) => {
  await stronaProduktu.otworz('kubek');
  await stronaProduktu.dodajDoKoszyka();
  await stronaKoszyka.otworz();
  await expect(page.getByRole('main')).toHaveScreenshot('koszyk.png');
});
