import { z } from 'zod';
import { zapytajModel } from './model.ts';

const Werdykt = z.object({ spelnia: z.boolean(), uzasadnienie: z.string() });

export async function ocenSedzia(
  pytanie: string,
  odpowiedz: string,
  kryterium: string,
) {
  const tresc = await zapytajModel([
    {
      role: 'system',
      content:
        'Oceniasz odpowiedź asystenta sklepu według jednego kryterium. ' +
        'Zwróć wyłącznie JSON: {"spelnia": true|false, "uzasadnienie": "jedno zdanie"}.',
    },
    {
      role: 'user',
      content: `Kryterium: ${kryterium}\n\nPytanie: ${pytanie}\n\nOdpowiedź: ${odpowiedz}`,
    },
  ]);
  return Werdykt.parse(JSON.parse(tresc));
}
