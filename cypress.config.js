const { defineConfig } = require("cypress");
const pluginCypress = require("eslint-plugin-cypress");

module.exports = defineConfig({
  files: ['cypress/**/*.js'],
  extends: [
    pluginCypress.configs.recommended,
  ],
  rules: {
    'cypress/no-unnecessary-waiting': 'off'
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
