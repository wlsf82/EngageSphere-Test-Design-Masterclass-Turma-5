const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1200,
    viewportHeight: 900,

    setupNodeEvents(on, config) {
      config.env.GUI_URL = process.env.GUI_URL || config.env.GUI_URL;
      config.env.API_URL = process.env.API_URL || config.env.API_URL;

      return config;
    },
    experimentalRunAllSpecs: true,
    env: { hideXhr: true }
  },
});
