const API_URL = Cypress.env('API_URL');

Cypress.Commands.add('apiGetCustomers', (parameters = {}) => {
    const defaultParams = {
        page: 1,
        limit: 10,
        size: 'All',
        industry: 'All',
    };
    const finalParams = { ...defaultParams, ...parameters };
    return cy.request({
        method: 'GET',
        url: `${API_URL}/customers`,
        qs: finalParams,
        headers: { accept: 'application/json' },
        failOnStatusCode: false,
    });
});
