# Testy sklepu ćwiczeniowego

Testy automatyczne sklepu ćwiczeniowego: Playwright 1.65, TypeScript 6, Node.js 26.
Wymagania sklepu: docs/strategia.md, docs/api.md, docs/elementy.md.

## Polecenia
- `npm run check`: tsc i ESLint, musi przejść bez błędów i ostrzeżeń
- `npx playwright test --project=chromium`: testy lokalnie
- `npm run test:pr`: zestaw uruchamiany w pull requestach
- Sklep musi działać: `docker compose up -d`, kontrola: GET /api/health

## Konwencje
- `test` i `expect` importuj z `./fixtures.ts`, nigdy z `@playwright/test`
- Strony obsługuj przez Page Objecty z `tests/strony/`; nowe lokatory dodawaj tam
- Lokatory: getByRole, getByLabel, getByText; bez klas CSS i XPath
- Dane twórz fixtures `klient` i `apiKlienta`; nie używaj wspólnego konta w testach, które zmieniają dane
- Odpowiedzi API sprawdzaj schematami Zod z `tests/schematy.ts`, bez rzutowania `as`
- Importy z rozszerzeniem `.ts`, typy przez `import type`, bez `enum`
- Każdy test ma tag z listy w README; nazwy testów po polsku opisują sprawdzane zachowanie

## Zakazy
- Bez `waitForTimeout`, `force: true`, `networkidle`, `page.$` i `waitForSelector`
- Nie zmieniaj oczekiwanych wartości w asercjach bez wskazania źródła w wymaganiach.
  Jeśli aplikacja działa niezgodnie z wymaganiami, opisz to i zatrzymaj się
- Bez `test.fixme()` i `test.skip()`; znany defekt oznacz `test.fail()` z adnotacją `issue`
- Nie zmieniaj `playwright.config.ts`, `tests/fixtures.ts`, `.github/workflows/`
  ani `package.json` bez wyraźnej prośby
- Nie wyłączaj reguł ESLint ani axe i nie aktualizuj wzorców wizualnych
- Nie czytaj `.env` i nie wpisuj haseł ani tokenów do kodu

## Zanim skończysz
1. Uruchom `npm run check`
2. Uruchom zmienione testy i podaj wynik
3. Dla każdej nowej asercji wskaż wymaganie, które sprawdza
4. Wypisz wszystkie zmienione pliki
