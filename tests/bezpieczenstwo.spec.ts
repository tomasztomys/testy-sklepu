import { test, expect } from './fixtures.ts';
import { nowyKlient } from './dane.ts';

test('strona ustawia podstawowe nagłówki bezpieczeństwa', { tag: '@bezpieczenstwo' }, async ({ request }) => {
  const naglowki = (await request.get('/')).headers();
  expect(naglowki['x-content-type-options']).toBe('nosniff');
  expect(naglowki['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(naglowki['referrer-policy']).toBe('strict-origin-when-cross-origin');
});

test('ciasteczko sesji ma atrybuty HttpOnly i SameSite', { tag: '@bezpieczenstwo' }, async ({ request }) => {
  const dane = nowyKlient();
  await request.post('/api/users', { data: dane });
  const odpowiedz = await request.post('/api/login', { data: dane });
  const ciasteczko = odpowiedz.headers()['set-cookie'] ?? '';
  expect(ciasteczko).toContain('HttpOnly');
  expect(ciasteczko).toContain('SameSite=Lax');
});

test('kod rabatowy z HTML nie wykonuje skryptu', { tag: '@bezpieczenstwo' }, async ({ klient, page, stronaKoszyka }) => {
  let okienko = false;
  page.on('dialog', async (d) => {
    okienko = true;
    await d.dismiss();
  });
  await stronaKoszyka.otworz();
  await stronaKoszyka.zastosujKod('<img src=x onerror=alert(1)>');
  await expect(stronaKoszyka.blad).toHaveText('Nieznany kod rabatowy');
  expect(okienko).toBe(false);
});
