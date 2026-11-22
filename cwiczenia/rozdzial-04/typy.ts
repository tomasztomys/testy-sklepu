export type Rola = 'klient' | 'admin';

export interface Uzytkownik {
  email: string;
  haslo: string;
  rola: Rola;
}

export interface Produkt {
  id: number;
  nazwa: string;
  cena: number; // w złotych
  opis?: string; // pole opcjonalne
}

export interface PozycjaKoszyka {
  produkt: Produkt;
  ilosc: number;
}

export const klient: Uzytkownik = {
  email: 'klient@sklep.test',
  haslo: 'Klient123!',
  rola: 'klient',
};
