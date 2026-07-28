import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    alias: {
      '@mediadock/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      '@mediadock/validation': path.resolve(__dirname, '../validation/src/index.ts'),
    },
  },
});
