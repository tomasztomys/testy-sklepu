import { fakerPL as faker } from '@faker-js/faker';

export interface DaneKlienta {
  email: string;
  haslo: string;
}

export const nowyKlient = (): DaneKlienta => ({
  email: `test-${faker.string.alphanumeric(10).toLowerCase()}@sklep.test`,
  haslo: faker.internet.password({ length: 12 }),
});
