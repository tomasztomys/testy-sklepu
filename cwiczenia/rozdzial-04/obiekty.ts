const kubek = { nazwa: 'Kubek', cena: 49.99 };
const ceny = [49.99, 120, 15.5];

console.log(kubek.nazwa); // Kubek
console.log(ceny.length); // 3
console.log(ceny.filter((c) => c > 20)); // [ 49.99, 120 ]
console.log(ceny.map((c) => c * 2)); // [ 99.98, 240, 31 ]
console.log(ceny.some((c) => c > 100)); // true

for (const cena of ceny) {
  console.log(`Cena: ${cena} zł`);
}
