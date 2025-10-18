Cypress.Commands.add('grettings', option => {
  cy.get('body')
    .get('.App_tableContainer__lcmxs', { timeout: 4000 })
    .contains('h2', option)
})