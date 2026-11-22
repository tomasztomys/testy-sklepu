import * as z from 'zod';

export const Produkt = z.object({
  id: z.number().int(),
  nazwa: z.string().min(1),
  cena: z.number().positive(),
});
export const ListaProduktow = z.array(Produkt);

export const Koszyk = z.object({
  pozycje: z.array(
    z.object({
      produktId: z.number().int(),
      nazwa: z.string(),
      ilosc: z.number().int().positive(),
      cena: z.number().nonnegative(),
    }),
  ),
  suma: z.number().nonnegative(),
});
export type Koszyk = z.infer<typeof Koszyk>;

export const Blad = z.object({ blad: z.string() });
