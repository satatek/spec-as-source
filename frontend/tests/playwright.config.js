import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'bash -lc "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; npm run dev:backend"',
      url: 'http://localhost:3001',
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'bash -lc "export NVM_DIR=\"$HOME/.nvm\"; . \"$NVM_DIR/nvm.sh\"; npm run dev:frontend"',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
