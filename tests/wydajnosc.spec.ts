import { test, expect } from './fixtures.ts';

test('API produktów odpowiada w mniej niż 500 ms', { tag: '@wydajnosc' }, async ({ request }) => {
  const start = Date.now();
  await expect(await request.get('/api/products')).toBeOK();
  expect(Date.now() - start).toBeLessThan(500);
});

test('strona główna ładuje się w budżecie', { tag: '@wydajnosc' }, async ({ page }) => {
  await page.goto('/');
  const czas = await page.evaluate(() => {
    const [nawigacja] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return nawigacja ? nawigacja.loadEventEnd - nawigacja.startTime : Number.NaN;
  });
  expect(czas).toBeLessThan(2000);
});
