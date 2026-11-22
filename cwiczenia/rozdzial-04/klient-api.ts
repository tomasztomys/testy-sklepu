export class KlientApiSklepu {
  readonly bazowyUrl: string;

  constructor(bazowyUrl: string) {
    this.bazowyUrl = bazowyUrl;
  }

  adres(sciezka: string): string {
    return `${this.bazowyUrl}${sciezka}`;
  }

  async stan(): Promise<string> {
    const odpowiedz = await fetch(this.adres('/api/health'));
    const dane = (await odpowiedz.json()) as { status: string };
    return dane.status;
  }

  async wyczyscKoszyk(): Promise<void> {
    await fetch(this.adres('/api/cart'), { method: 'DELETE' });
  }
}
