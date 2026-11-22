import type { Produkt } from './typy.ts';

const kubek: Produkt = { id: 7, nazwa: 'Kubek', cena: 49.99 };

console.log(kubek.opis?.length); // undefined, zamiast błędu
console.log(kubek.opis ?? 'brak opisu'); // brak opisu
