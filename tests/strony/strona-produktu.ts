import { expect, type Locator, type Page } from '@playwright/test';

export class StronaProduktu {
  readonly page: Page;
  readonly ilosc: Locator;
  readonly przyciskDodaj: Locator;
  readonly komunikat: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ilosc = page.getByLabel('Ilość');
    this.przyciskDodaj = page.getByRole('button', { name: 'Dodaj do koszyka' });
    this.komunikat = page.getByRole('status');
  }

  async otworz(slug: string): Promise<void> {
    await this.page.goto(`/produkty/${slug}`);
  }

  async dodajDoKoszyka(ilosc = 1): Promise<void> {
    await this.ilosc.fill(String(ilosc));
    await this.przyciskDodaj.click();
    await expect(this.komunikat).toHaveText('Dodano do koszyka');
  }
}
