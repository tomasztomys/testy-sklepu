export const obliczRabat = (kwota: number, kod: string): number => {
  const procent = kod === 'JESIEN10' ? 10 : 0;
  return Math.round(kwota * procent) / 100;
};

console.log(obliczRabat(200, 'JESIEN10')); // 20
console.log(obliczRabat(19.99, 'JESIEN10')); // 2
console.log(obliczRabat(200, 'LATO5')); // 0
