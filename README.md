# Testy sklepu

Repozytorium startowe do książki „Automatyzacja testów z agentem AI u boku. Start z Playwright i TypeScript”.
Utwórz z niego własne repozytorium przyciskiem **Use this template** i pracuj według rozdziału 3.

## Start

```bash
npm ci                  # narzędzia w wersjach z książki
docker compose up -d    # sklep ćwiczeniowy na http://localhost:3000
```

Sklep: obraz `ghcr.io/tomasztomys/sklep-cwiczeniowy:1.0`, opisany w
[wymaganiach](https://github.com/tomasztomys/sklep-cwiczeniowy/blob/main/docs/wymagania.md) i w [opisie API](https://github.com/tomasztomys/sklep-cwiczeniowy/blob/main/docs/api.md).

## Stan projektu po każdym rozdziale

Tagi `rozdzial-03` … `rozdzial-20` zawierają kod z książki po danym rozdziale, bez rozwiązań ćwiczeń.
Gdy coś nie działa, porównaj swój kod z tagiem, np.
[rozdzial-08](https://github.com/tomasztomys/testy-sklepu/tree/rozdzial-08). Każdy tag przechodzi
`npm run check` (od rozdziału 4) i testy na sklepie (od rozdziału 6).

Błąd w książce albo w kodzie? Sprawdź [ERRATA.md](ERRATA.md), potem zgłoś go w Issues.
