Cypress.Commands.add('getByClassThatStartsWith', (classPart) => {
  cy.get(`[class^="${classPart}"]`);
});