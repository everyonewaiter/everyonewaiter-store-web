import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    pageLoadTimeout: 200000,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
