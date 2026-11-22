import { appendFileSync, readFileSync } from 'node:fs';
import { z } from 'zod';

const RaportJson = z.object({
  stats: z.object({
    startTime: z.string(),
    duration: z.number(),
    expected: z.number(),
    unexpected: z.number(),
    flaky: z.number(),
    skipped: z.number(),
  }),
});

const plik = process.argv[2] ?? 'wyniki/wyniki.json';
const { stats } = RaportJson.parse(JSON.parse(readFileSync(plik, 'utf8')));

const uruchomione = stats.expected + stats.unexpected + stats.flaky;
const zielone = uruchomione === 0 ? 0 : (100 * stats.expected) / uruchomione;
const liczba = (x: number) => x.toFixed(1).replace('.', ',');

const tabela = [
  '| Data | Testy | Nieudane | Niestabilne | Pominięte | Zielone za 1. razem | Czas |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  `| ${stats.startTime.slice(0, 10)} | ${uruchomione} | ${stats.unexpected} ` +
    `| ${stats.flaky} | ${stats.skipped} | ${liczba(zielone)}% ` +
    `| ${liczba(stats.duration / 60_000)} min |`,
].join('\n');

const podsumowanie = process.env.GITHUB_STEP_SUMMARY;
if (podsumowanie) {
  appendFileSync(podsumowanie, `## Statystyki przebiegu\n\n${tabela}\n`);
} else {
  console.log(tabela);
}
