// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Aceita o banner de cookies só uma vez por execução

// cypress/support/commands.js

Cypress.Commands.add('bannerCookies', (label) => {
  cy.session('cookie-consent', () => {
    cy.visit('/');

    cy.get('body')
      .get('.CookieConsent_banner__oofyG', { timeout: 4000 })
      .should('be.visible')
      .contains('.Button_buttonContainer__wqjbX button', label)
      .click();
  });
});

Cypress.Commands.add('waitForTableReady', () => {
  cy.get('table[class*="Table_container"]').should('be.visible');
  cy.contains('body', 'Loading', { matchCase: false }).should('not.exist');
  cy.get('table tbody tr').should('have.length.greaterThan', 0);
})

Cypress.Commands.add('waitForFilter', (testId, label) => {
  cy.intercept('GET', '**/customers*').as('getCustomers');
  cy.get(`[data-testid="${testId}"]`).select(label);
  cy.wait('@getCustomers')
})

Cypress.Commands.add('selectCompanySize', (size) => {
  cy.get('[data-testid="size-filter"]')
    .should('be.visible')
    .and('not.be.disabled')
    .select((size));
});

Cypress.Commands.add('selectIndustry', (label) => {
  cy.get('[data-testid="industry-filter"]')
    .should('be.visible')
    .and('not.be.disabled')
    .select((label));
});

Cypress.Commands.add('validateFilter', (text) => {
  cy.get('[data-testid="table"] tbody tr').each($tr => {
    cy.wrap($tr).should('contains.text', text);
  });
});

Cypress.Commands.add('seeDetails', (companyName) => {
  cy.contains('table tbody tr', companyName)   // acha a linha pelo texto
    .should('exist')
  cy.contains('button', /view/i).click();
});





