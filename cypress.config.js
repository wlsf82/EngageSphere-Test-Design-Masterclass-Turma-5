import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  env: {
    API_URL: 'http://localhost:3001'
  },
  e2e: {
    baseUrl: 'http://localhost:3000'
  }
})
