import type { Locator, Page } from '@playwright/test';

export class StronaKoszyka {
  readonly page: Page;
  readonly kodRabatowy: Locator;
  readonly przyciskZastosuj: Locator;
  readonly suma: Locator;
  readonly komunikat: Locator;
  readonly blad: Locator;

  constructor(page: Page) {
    this.page = page;
    this.kodRabatowy = page.getByLabel('Kod rabatowy');
    this.przyciskZastosuj = page.getByRole('button', { name: 'Zastosuj' });
    this.suma = page.getByText(/^Suma:/);
    this.komunikat = page.getByRole('status');
    this.blad = page.getByRole('alert');
  }

  async otworz(): Promise<void> {
    await this.page.goto('/koszyk');
  }

  wiersz(nazwaProduktu: string): Locator {
    return this.page.getByRole('row').filter({ hasText: nazwaProduktu });
  }

  async zastosujKod(kod: string): Promise<void> {
    await this.kodRabatowy.fill(kod);
    await this.przyciskZastosuj.click();
  }
}
