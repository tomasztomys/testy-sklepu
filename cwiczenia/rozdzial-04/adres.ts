import { KlientApiSklepu } from './klient-api.ts';

const api = new KlientApiSklepu('http://localhost:3000');
console.log(api.adres('/api/health')); // http://localhost:3000/api/health
