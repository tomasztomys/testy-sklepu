import { existsSync } from 'node:fs';
import { asystentSklepu } from './asystent.ts';
import { przypadki } from './przypadki.ts';
import { ocenSedzia } from './sedzia.ts';

if (existsSync('.env')) process.loadEnvFile('.env');

const POWTORZENIA = Number(process.env.POWTORZENIA ?? 3);
const PROG = 0.9;
let zaliczone = 0;
let wszystkie = 0;

for (const p of przypadki) {
  let udane = 0;
  for (let i = 0; i < POWTORZENIA; i++) {
    const odpowiedz = await asystentSklepu(p.pytanie);
    const bledy: string[] = [];
    for (const wzorzec of p.musiZawierac ?? []) {
      if (!wzorzec.test(odpowiedz)) bledy.push(`brak ${wzorzec}`);
    }
    for (const wzorzec of p.nieMozeZawierac ?? []) {
      if (wzorzec.test(odpowiedz)) bledy.push(`zawiera ${wzorzec}`);
    }
    if (p.kryteriumSedziego && bledy.length === 0) {
      const werdykt = await ocenSedzia(
        p.pytanie,
        odpowiedz,
        p.kryteriumSedziego,
      );
      if (!werdykt.spelnia) bledy.push(`sędzia: ${werdykt.uzasadnienie}`);
    }
    if (bledy.length === 0) udane++;
    else
      console.log(
        `  ✗ ${p.nazwa} (próba ${i + 1}): ${bledy.join('; ')}\n    „${odpowiedz}”`,
      );
  }
  console.log(
    `${udane === POWTORZENIA ? '✓' : '✗'} ${p.nazwa}: ${udane}/${POWTORZENIA}`,
  );
  zaliczone += udane;
  wszystkie += POWTORZENIA;
}

const wynik = zaliczone / wszystkie;
console.log(`\nWynik: ${(wynik * 100).toFixed(0)}% (próg ${PROG * 100}%)`);
process.exit(wynik >= PROG ? 0 : 1);
