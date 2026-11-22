const adres = `${process.env.BASE_URL ?? 'http://localhost:3000'}/api/health`;

for (let proba = 1; proba <= 30; proba++) {
  try {
    const odpowiedz = await fetch(adres);
    if (odpowiedz.ok) {
      console.log(`Sklep gotowy po ${proba}. próbie`);
      process.exit(0);
    }
  } catch {
    // sklep jeszcze nie przyjmuje połączeń
  }
  await new Promise((r) => setTimeout(r, 2000));
}

console.error(`Sklep nie odpowiada pod adresem ${adres}`);
process.exit(1);
