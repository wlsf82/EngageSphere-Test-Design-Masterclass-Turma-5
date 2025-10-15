const API_URL = Cypress.env('API_URL');

Cypress.Commands.add('apiGetCustomers', (parameters = {}) => {
    return cy.request({
        method: 'GET',
        url: `${API_URL}/customers`,
        qs: parameters,
        headers: { accept: 'application/json' },
        failOnStatusCode: false,
    });
});
