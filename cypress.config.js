import { defineConfig } from 'cypress'
import pluginCypress from 'eslint-plugin-cypress'

export default defineConfig({
  files: ['cypress/**/*.js'],
  extends: [pluginCypress.configs.recommended],
  rules: {
    'cypress/no-unnecessary-waiting': 'off'
  },
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
})
