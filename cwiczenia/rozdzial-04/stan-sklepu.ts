import { KlientApiSklepu } from './klient-api.ts';

const api = new KlientApiSklepu('http://localhost:3000');
try {
  console.log(`Sklep: ${await api.stan()}`);
} catch (blad) {
  console.error('Sklep nie odpowiada. Czy uruchomiłeś docker compose up -d?');
  throw blad;
}
