import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: [
      resolve(__dirname, '../tests/unit/**/*.test.js'),
      resolve(__dirname, '../tests/integration/**/*.test.js'),
    ],
    sequence: {
      // Integration tests modify a real DB; run sequentially to avoid conflicts.
      concurrent: false,
    },
    testTimeout: 10000,
  },
});
