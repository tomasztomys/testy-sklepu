---
name: przeglad-testu
description: Przegląd testu Playwright według checklisty projektu. Użyj, gdy użytkownik prosi o ocenę nowego lub zmienionego testu, także wygenerowanego przez agenta.
---

# Przegląd testu

1. Przeczytaj test i scenariusz ze `specs/`, jeśli test się do niego odwołuje.
   W 1–3 zdaniach zapisz, co test powinien sprawdzać.
2. Przejdź przez `docs/checklista-przegladu.md`. Dla każdego punktu podaj:
   spełniony, niespełniony albo nie dotyczy, z numerem linii.
3. Uruchom `npm run check` i sam test.
4. Uruchom test z każdą mutacją z `tests/mutacje.ts` (zmienna MUTACJA)
   i podaj, które wykrył.
5. Nie poprawiaj testu. Zakończ listą problemów od najpoważniejszego
   i rekomendacją: włączyć, poprawić albo odrzucić.
