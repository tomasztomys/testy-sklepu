# Sklep ćwiczeniowy 1.0 – API

Adres bazowy: `http://localhost:3000`. Wymagania i reguły biznesowe: [wymagania.md](wymagania.md).

## Zasady wspólne

- Treść żądań i odpowiedzi to JSON. Ceny i sumy są liczbami w złotych, np. `49.99`.
- Błąd ma zawsze postać `{"blad": "<komunikat>"}`.
- Sesja to ciasteczko `sesja` ustawiane przez `POST /api/login`. Klient HTTP musi je przechowywać i odsyłać.
- Bez sesji działają tylko `GET /api/health`, `GET /api/products`, `POST /api/users` i `POST /api/login`.
  Każdy inny endpoint bez sesji zwraca `401` `{"blad": "Brak sesji"}`.
- Nieznany adres pod `/api/` zwraca `404` `{"blad": "Nie znaleziono"}`.
- Niepoprawny JSON albo złe typy pól dają `400`, nigdy `5xx`.

## Endpointy

| Metoda i adres | Sesja | Sukces | Błędy |
| --- | --- | --- | --- |
| `GET /api/health` | nie | `200` `{"status":"ok"}` | – |
| `GET /api/products` | nie | `200` lista produktów | – |
| `POST /api/users` | nie | `201` `{email, rola}` | `400`, `409` |
| `POST /api/login` | nie | `200` `{email, rola}` + ciasteczko | `401` |
| `POST /api/logout` | tak | `204` | `401` |
| `GET /api/cart` | tak | `200` koszyk | `401` |
| `DELETE /api/cart` | tak | `204` | `401` |
| `POST /api/cart/items` | tak | `201` koszyk | `400`, `404`, `401` |
| `PATCH /api/cart/items/{produktId}` | tak | `200` koszyk | `400`, `404`, `401` |
| `DELETE /api/cart/items/{produktId}` | tak | `200` koszyk | `404`, `401` |
| `POST /api/cart/discount` | tak | `200` koszyk po rabacie | `400`, `401` |
| `GET /api/orders/{id}` | tak | `200` zamówienie | `403`, `404`, `401` |
| `DELETE /api/users/me` | tak | `204` | `401` |

## Produkty

`GET /api/products` → `200`

```json
[
  { "id": 7, "nazwa": "Kubek", "cena": 49.99 },
  { "id": 12, "nazwa": "Notes", "cena": 15.5 },
  { "id": 15, "nazwa": "Bluza", "cena": 120 }
]
```

Tylko te trzy pola, w stałej kolejności.

## Konta

`POST /api/users` z `{"email": "...", "haslo": "..."}` → `201` `{"email": "...", "rola": "klient"}`. Odpowiedź nie zawiera hasła i nie loguje.

| Sytuacja | Kod | Komunikat |
| --- | --- | --- |
| brak e-maila albo hasła, puste wartości, nie tekst | `400` | Brak e-maila lub hasła |
| e-mail bez `@` albo ze spacją | `400` | Nieprawidłowy e-mail |
| zajęty e-mail | `409` | Użytkownik już istnieje |

`POST /api/login` z `{"email": "...", "haslo": "..."}` → `200` `{"email": "...", "rola": "klient"}` i nagłówek
`Set-Cookie: sesja=…; HttpOnly; SameSite=Lax; Path=/`. Błędne dane: `401` „Nieprawidłowy e-mail lub hasło”.

`POST /api/logout` → `204`, sesja przestaje działać, ciasteczko jest usuwane.

`DELETE /api/users/me` → `204`, konto, koszyk i sesje są usuwane.

## Koszyk

Każda operacja na koszyku zwraca cały koszyk:

```json
{
  "pozycje": [{ "produktId": 7, "nazwa": "Kubek", "ilosc": 2, "cena": 99.98 }],
  "suma": 99.98
}
```

`cena` pozycji to cena × ilość. `suma` uwzględnia zastosowany kod rabatowy. Pusty koszyk: `{"pozycje": [], "suma": 0}`.

`POST /api/cart/items` z `{"produktId": 7, "ilosc": 2}` → `201`. Ponowne dodanie sumuje ilości.

| Sytuacja | Kod | Komunikat |
| --- | --- | --- |
| `produktId` brak albo nie liczba całkowita | `400` | Nieprawidłowe dane |
| `ilosc` brak, nie liczba całkowita albo spoza 1–99; suma w koszyku ponad 99 | `400` | Nieprawidłowa ilość |
| produkt nie istnieje | `404` | Nie ma takiego produktu |

`PATCH /api/cart/items/{produktId}` z `{"ilosc": 5}` → `200`, ustawia ilość (nie dodaje). Ilość spoza 1–99: `400`
„Nieprawidłowa ilość”. Produkt spoza koszyka: `404` „Nie ma takiej pozycji w koszyku”.

`DELETE /api/cart/items/{produktId}` → `200`. Produkt spoza koszyka: `404` „Nie ma takiej pozycji w koszyku”.

`DELETE /api/cart` → `204` bez treści. Usuwa też zastosowany kod rabatowy.

`POST /api/cart/discount` z `{"kod": "JESIEN10"}` → `200`, koszyk z sumą po rabacie. Kod zostaje zapamiętany do opróżnienia koszyka.

| Sytuacja | Kod | Komunikat |
| --- | --- | --- |
| nieznany kod, pusty kod, inna wielkość liter | `400` | Nieznany kod rabatowy |
| kod nieaktywny (`LATO5`) | `400` | Kod rabatowy jest nieaktywny |

## Zamówienia

`GET /api/orders/{id}` → `200` dla właściciela:

```json
{ "id": 1, "pozycje": [{ "produktId": 7, "nazwa": "Kubek", "ilosc": 1, "cena": 49.99 }], "suma": 49.99 }
```

| Sytuacja | Kod | Komunikat |
| --- | --- | --- |
| zamówienie innego użytkownika | `403` | Brak dostępu |
| nieistniejące zamówienie albo numer, który nie jest liczbą | `404` | Nie ma takiego zamówienia |

W danych startowych jest tylko zamówienie nr 1, należące do administratora.
