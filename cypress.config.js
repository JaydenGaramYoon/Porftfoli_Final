export default {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/integration/**/*.cy.{js,jsx,ts,tsx}",
    video: true,
  },
};
