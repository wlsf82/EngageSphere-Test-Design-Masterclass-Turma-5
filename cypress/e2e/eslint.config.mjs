// eslint.config.mjs

import { defineConfig } from "eslint/config";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginJs from "@eslint/js";

export default defineConfig([
  // Recommended ESLint rules for all JavaScript files
  pluginJs.configs.recommended,

  // Configuration for your Cypress test files
  {
    files: ["cypress/**/*.js", "cypress/**/*.mjs", "cypress/**/*.ts"],
    extends: [
      pluginCypress.configs.recommended,
      // You may also want to add 'plugin:mocha/recommended' if you use Mocha's features (.only, .skip)
    ],
    // The 'configs.recommended' already includes 'configs.globals' to define 'cy', 'Cypress', 'describe', 'it', etc.

    // Optional: Override or turn off specific Cypress rules
    rules: {
      // Example: Turn off the rule that prohibits `cy.wait()` with a static time
      "cypress/no-unnecessary-waiting": "off",
    },
  },
]);
