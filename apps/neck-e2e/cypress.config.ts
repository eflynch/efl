import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run neck:serve',
        production: 'nx run neck:preview',
      },
      ciWebServerCommand: 'nx run neck:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
