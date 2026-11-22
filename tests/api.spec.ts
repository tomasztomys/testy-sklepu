import { test, expect } from './fixtures.ts';
import * as z from 'zod';
import { nowyKlient } from './dane.ts';
import { Koszyk } from './schematy.ts';

test('lista produktów zawiera trzy produkty', { tag: '@api' }, async ({ request }) => {
  const odpowiedz = await request.get('/api/products');
  await expect(odpowiedz).toBeOK();
  const produkty = (await odpowiedz.json()) as { nazwa: string }[];
  expect(produkty.map((p) => p.nazwa)).toEqual(['Kubek', 'Notes', 'Bluza']);
});

test('dodanie produktu zwraca 201 i aktualny koszyk', { tag: '@api' }, async ({ apiKlienta }) => {
  const odpowiedz = await apiKlienta.post('/api/cart/items', { data: { produktId: 7, ilosc: 2 } });
  expect(odpowiedz.status()).toBe(201);
  const koszyk = (await odpowiedz.json()) as { pozycje: unknown[]; suma: number };
  expect(koszyk.pozycje).toHaveLength(1);
  expect(koszyk.suma).toBe(99.98);
});

test('koszyk bez sesji zwraca 401', { tag: '@api' }, async ({ request }) => {
  const odpowiedz = await request.get('/api/cart');
  expect(odpowiedz.status()).toBe(401);
});

test('nieistniejący produkt daje 404', { tag: '@api' }, async ({ apiKlienta }) => {
  const odpowiedz = await apiKlienta.post('/api/cart/items', { data: { produktId: 9999, ilosc: 1 } });
  expect(odpowiedz.status()).toBe(404);
});

test('klient nie ma dostępu do cudzego zamówienia', { tag: '@api' }, async ({ apiKlienta }) => {
  const odpowiedz = await apiKlienta.get('/api/orders/1');
  expect(odpowiedz.status()).toBe(403);
});

const odrzucaneKody = [
  { kod: 'LATO5', blad: 'Kod rabatowy jest nieaktywny' },
  { kod: 'XYZ', blad: 'Nieznany kod rabatowy' },
  { kod: 'jesien10', blad: 'Nieznany kod rabatowy' },
  { kod: '', blad: 'Nieznany kod rabatowy' },
];

for (const { kod, blad } of odrzucaneKody) {
  test(`kod "${kod}" jest odrzucany`, { tag: '@api' }, async ({ apiKlienta }) => {
    await apiKlienta.post('/api/cart/items', { data: { produktId: 7, ilosc: 1 } });
    const odpowiedz = await apiKlienta.post('/api/cart/discount', { data: { kod } });
    expect(odpowiedz.status()).toBe(400);
    expect(((await odpowiedz.json()) as { blad: string }).blad).toBe(blad);
  });
}

const NowyUzytkownik = z.strictObject({
  email: z.string(),
  rola: z.enum(['klient', 'admin']),
});

test('rejestracja zwraca dane bez hasła', { tag: '@api' }, async ({ request }) => {
  const dane = nowyKlient();
  const odpowiedz = await request.post('/api/users', { data: dane });
  expect(odpowiedz.status()).toBe(201);
  expect(NowyUzytkownik.parse(await odpowiedz.json()).email).toBe(dane.email);
});

test('kod JESIEN10 obniża sumę koszyka o 10%', { tag: '@api' }, async ({ apiKlienta }, testInfo) => {
  await apiKlienta.post('/api/cart/items', { data: { produktId: 7, ilosc: 1 } });
  const odpowiedz = await apiKlienta.post('/api/cart/discount', { data: { kod: 'JESIEN10' } });
  const tresc = await odpowiedz.text();
  await testInfo.attach('odpowiedz-rabat', { body: tresc, contentType: 'application/json' });
  await expect(odpowiedz).toBeOK();
  expect(Koszyk.parse(JSON.parse(tresc)).suma).toBe(44.99);
});
