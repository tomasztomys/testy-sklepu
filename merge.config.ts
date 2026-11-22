import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['html', { open: 'never', title: 'Testy sklepu' }],
    ['junit', { outputFile: 'wyniki/junit.xml' }],
    ['json', { outputFile: 'wyniki/wyniki.json' }],
  ],
});
