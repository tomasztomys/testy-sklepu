# Sklep ćwiczeniowy 1.0 – wymagania

Ten dokument opisuje, jak sklep **powinien** działać. To od niego zaczynasz, gdy piszesz test: oczekiwany wynik
bierzesz stąd, a nie z tego, co akurat widać na ekranie. Opis API jest w [api.md](api.md).

Sklep jest celowo niedoskonały. Ma kilka usterek dostępności do znalezienia (rozdziały 5 i 11) i tryby błędów,
które włączasz sam (rozdział 7 tego dokumentu). Usterek dostępności tu nie opisujemy, bo znalezienie ich to część ćwiczeń.

## 1. Uruchomienie

```bash
docker compose up -d     # z compose.yaml w repozytorium testy-sklepu
```

Sklep działa pod http://localhost:3000. Kontrola stanu: http://localhost:3000/api/health zwraca `{"status":"ok"}`.

- Dane są w pamięci. `docker compose down` i ponowny start przywracają stan początkowy.
- Sklep nie korzysta z internetu: obrazy, czcionki i style są w obrazie Dockera.
- Działa w Chromium, Firefoksie i WebKicie oraz na ekranie telefonu.

| Zmienna | Domyślnie | Znaczenie |
| --- | --- | --- |
| `PORT` | `3000` | port w kontenerze |
| `SKLEP_DANE_STARTOWE` | `tak` | dane startowe z rozdziału 2; inna wartość daje pusty sklep |
| `SKLEP_BLEDY` | pusta | tryby błędów oddzielone przecinkami (rozdział 7) |

## 2. Dane startowe

### Produkty

Katalog ma dokładnie trzy produkty, zawsze w tej kolejności:

| id | Nazwa | Strona | Cena |
| --- | --- | --- | --- |
| 7 | Kubek | `/produkty/kubek` | 49,99 zł |
| 12 | Notes | `/produkty/notes` | 15,50 zł |
| 15 | Bluza | `/produkty/bluza` | 120,00 zł |

Tekst alternatywny zdjęcia kubka: „Biały kubek z logo sklepu”.

### Konta testowe

| Rola | E-mail | Hasło |
| --- | --- | --- |
| klient | `klient@sklep.test` | `Klient123!` |
| admin | `admin@sklep.test` | `Admin123!` |

To jedyne hasła, które mogą pojawić się w testach i w repozytorium. Testy, które zmieniają dane, zakładają własne konto
(rozdział 8), a nie korzystają ze wspólnego konta klienta.

### Kody rabatowe

| Kod | Stan | Rabat |
| --- | --- | --- |
| `JESIEN10` | aktywny | 10% sumy koszyka |
| `LATO5` | nieaktywny | – |

Wielkość liter ma znaczenie: `jesien10` to nieznany kod.

### Zamówienia

Zamówienie nr 1 należy do administratora: jeden kubek, 49,99 zł. Klient go nie widzi.

## 3. Konta i logowanie

- Logowanie na stronie `/logowanie` przenosi na stronę główną. W nagłówku pojawia się przycisk „Wyloguj się”.
- Błędny e-mail i błędne hasło dają ten sam komunikat: „Nieprawidłowy e-mail lub hasło”. Sklep nie zdradza, które pole jest złe.
- Sesja to ciasteczko `sesja` z atrybutami `HttpOnly`, `SameSite=Lax` i `Path=/`. Sklep działa przez HTTP, więc ciasteczko nie ma atrybutu `Secure`.
- Sesja nie wygasa sama. Kończy ją „Wyloguj się” albo restart sklepu.
- Rejestracja: strona `/rejestracja` albo `POST /api/users`. Nowe konto ma rolę klienta i nie jest automatycznie logowane.
- Usunięcie konta (`DELETE /api/users/me`) usuwa też jego koszyk i sesje.

## 4. Strony

Na każdej stronie jest nagłówek z linkiem „Sklep ćwiczeniowy”, przyciskiem „Koszyk” i linkiem „Zaloguj się” albo przyciskiem
„Wyloguj się”. Tytuł strony zawiera „Sklep ćwiczeniowy”. Komunikaty o powodzeniu pojawiają się w obszarze o roli `status`,
błędy w obszarze o roli `alert`.

### Katalog `/`

- Nagłówek „Produkty”, pod nim lista produktów: nazwa (link do strony produktu), cena i przycisk „Dodaj do koszyka”.
- Lista jest wczytywana w przeglądarce z `GET /api/products`. Gdy API nie odpowiada albo zwraca błąd, pojawia się komunikat
  „Nie udało się wczytać produktów”.
- „Dodaj do koszyka” dodaje 1 sztukę i pokazuje „Dodano do koszyka”. Niezalogowanego przenosi na stronę logowania.

### Strona produktu `/produkty/<adres>`

- Nazwa produktu, zdjęcie, cena, pole „Ilość” (domyślnie 1) i przycisk „Dodaj do koszyka”.
- Po dodaniu, po krótkiej chwili, pojawia się „Dodano do koszyka”. Błąd, np. zła ilość, pokazuje komunikat z API.
- Z pola „Ilość” klawisz Tab przenosi na przycisk, a Enter dodaje produkt.
- Nieznany adres produktu daje stronę „Nie ma takiej strony” z kodem 404.

### Logowanie `/logowanie` i rejestracja `/rejestracja`

- Pola „E-mail” i „Hasło”, przyciski „Zaloguj się” i „Załóż konto”.
- Po założeniu konta sklep przenosi na logowanie z komunikatem „Konto zostało założone. Zaloguj się.”.
- Błędy rejestracji pochodzą z API, np. „Użytkownik już istnieje”.

### Koszyk `/koszyk`

- Wymaga zalogowania. Niezalogowany trafia na `/logowanie`.
- Tabela z kolumnami „Produkt”, „Ilość” i „Cena”. Cena w wierszu to wartość pozycji: cena × ilość. Pod tabelą jest tekst
  „Suma: 99,98 zł”.
- Pusty koszyk pokazuje „Koszyk jest pusty”.
- Przycisk „Usuń” w wierszu usuwa pozycję, a „Usuń wszystko” opróżnia koszyk.
- Pole „Kod rabatowy” i przycisk „Zastosuj”. Udany kod daje komunikat „Zastosowano kod JESIEN10” i nową sumę. Odrzucony kod daje
  komunikat z API, a suma się nie zmienia.
- Wpisany tekst nigdy nie jest wykonywany jako kod strony.

## 5. Reguły biznesowe

| Reguła | Wartość |
| --- | --- |
| Kolejność produktów w katalogu i w API | stała: Kubek, Notes, Bluza |
| Ilość w jednym dodaniu i w pozycji koszyka | liczba całkowita 1–99 |
| Ponowne dodanie tego samego produktu | ilości się sumują (najwyżej 99) |
| Rabat | rabat = 10% sumy zaokrąglone do grosza (połówki w górę); suma po rabacie = suma − rabat, np. 49,99 zł → 44,99 zł |
| Zapamiętanie kodu | do opróżnienia koszyka; po każdej zmianie koszyka suma jest liczona z rabatem od nowa |
| Format ceny na stronach | `49,99 zł`: przecinek, dwa miejsca, spacja przed „zł”, bez separatora tysięcy |
| Dostęp do zamówień | tylko właściciel; inny zalogowany użytkownik dostaje 403 |

## 6. Bezpieczeństwo

- Każda odpowiedź ma nagłówki `X-Content-Type-Options: nosniff`, `Content-Security-Policy` z `frame-ancestors 'none'`
  i `Referrer-Policy: strict-origin-when-cross-origin`. Sklep nie ustawia `Strict-Transport-Security`, bo działa przez HTTP.
- Odpowiedzi nigdy nie zawierają hasła.
- Błędne dane od klienta nigdy nie powodują błędu 5xx.

## 7. Tryby błędów `SKLEP_BLEDY`

Tryby włączasz w `compose.yaml` i restartujesz sklep. Można łączyć kilka, np. `"wolne-api,losowa-kolejnosc"`.

| Tryb | Co się psuje | Czego nie zmienia |
| --- | --- | --- |
| `cena-kubka` | strona `/produkty/kubek` pokazuje 59,99 zł | API, katalog i koszyk |
| `wolne-api` | każda odpowiedź API przychodzi z losowym opóźnieniem 0–3 s | strony HTML |
| `losowa-kolejnosc` | `GET /api/products` zwraca produkty w losowej kolejności | zawartość listy |
| `zmiana-stylu` | przyciski wyglądają inaczej | treść i nazwy elementów |

Nieznana nazwa trybu daje ostrzeżenie w logach (`docker compose logs`), a sklep startuje normalnie.

## 8. Czego sklep nie ma

Wyszukiwania (pole w stopce nic nie robi), składania zamówień, historii zamówień, zmiany hasła i funkcji AI.
Przycisk czatu w stopce też nic nie robi.
