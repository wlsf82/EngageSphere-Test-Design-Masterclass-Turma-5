const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      API_URL: 'http://localhost:3001',
      hideXhr: true
    },
    viewportWidth: 1200,
    viewportHeight: 900,
    experimentalRunAllSpecs: true
  },
});
