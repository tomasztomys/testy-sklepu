import { obliczRabat } from './rabat.ts';
import type { PozycjaKoszyka } from './typy.ts';

const koszyk: PozycjaKoszyka[] = [
  { produkt: { id: 7, nazwa: 'Kubek', cena: 49.99 }, ilosc: 2 },
  { produkt: { id: 12, nazwa: 'Notes', cena: 15.5 }, ilosc: 1 },
];

let suma = 0;
for (const pozycja of koszyk) {
  suma += pozycja.produkt.cena * pozycja.ilosc;
}

console.log(`Suma: ${suma.toFixed(2)} zł, rabat: ${obliczRabat(suma, 'JESIEN10')} zł`);
// Suma: 115.48 zł, rabat: 11.55 zł
