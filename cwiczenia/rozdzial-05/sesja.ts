const baza = 'http://localhost:3000';

const logowanie = await fetch(`${baza}/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'klient@sklep.test', haslo: 'Klient123!' }),
});
if (!logowanie.ok) {
  throw new Error(`Logowanie nieudane: status ${logowanie.status}`);
}

const sesja = logowanie.headers.getSetCookie()[0]?.split(';')[0] ?? '';
console.log(sesja); // sesja=8f3a...

const zSesja = await fetch(`${baza}/api/cart`, { headers: { Cookie: sesja } });
console.log(zSesja.status); // 200

const bezSesji = await fetch(`${baza}/api/cart`);
console.log(bezSesji.status); // 401
