import { z } from 'zod';

const OdpowiedzModelu = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string() }) }))
    .min(1),
});

export interface Wiadomosc {
  role: 'system' | 'user';
  content: string;
}

export async function zapytajModel(wiadomosci: Wiadomosc[]): Promise<string> {
  const adres = process.env.LLM_URL ?? 'http://localhost:11434/v1';
  const model = process.env.LLM_MODEL;
  if (!model) throw new Error('Ustaw zmienną LLM_MODEL');

  const odpowiedz = await fetch(`${adres}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LLM_KLUCZ ?? 'brak'}`,
    },
    body: JSON.stringify({ model, messages: wiadomosci }),
  });
  if (!odpowiedz.ok) throw new Error(`Model zwrócił ${odpowiedz.status}`);

  const dane = OdpowiedzModelu.parse(await odpowiedz.json());
  return dane.choices[0].message.content;
}
