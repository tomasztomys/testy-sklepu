const nazwaSklepu = 'Sklep ćwiczeniowy'; // string, typ wywnioskowany
let iloscWKoszyku = 0; // number
const zalogowany = false; // boolean

iloscWKoszyku = iloscWKoszyku + 2;
// nazwaSklepu = 'Inny sklep'; // błąd: stałej nie można zmienić

console.log(`${nazwaSklepu}: ${iloscWKoszyku} produkty, zalogowany: ${zalogowany}`);
