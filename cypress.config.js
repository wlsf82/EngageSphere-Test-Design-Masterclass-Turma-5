import { defineConfig } from 'cypress'
import pluginCypress from 'eslint-plugin-cypress'

export default defineConfig({
  files: ['cypress/**/*.js'],
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
})
