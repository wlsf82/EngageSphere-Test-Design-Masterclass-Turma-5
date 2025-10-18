import { defineConfig } from 'cypress'

export default defineConfig({
  files: ['cypress/**/*.js'],
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
})
