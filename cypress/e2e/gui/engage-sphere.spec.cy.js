const API_URL = Cypress.env('API_URL');
const GUI_URL = Cypress.env('GUI_URL');

describe('Customers', () => {
    beforeEach(() => {
        cy.setCookie('cookieConsent', 'accepted');
        cy.visit(GUI_URL);
    });

    context('Filters - usability', () => {
        it('keeps the filters when coming back from the customer details view', () => {
            const size = 'Very Large Enterprise';

            cy.intercept('GET', `${API_URL}/customers*`, (req) => {
                req.headers['cache-control'] = 'no-cache';
                if (req.url.includes(`size=${encodeURIComponent(size)}`)) {
                    req.alias = 'getCustomers';
                }
            }).as('getCustomers');
            cy.get('[data-testid="size-filter"]').select(size);

            cy.wait('@getCustomers', { timeout: 10000 }).then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                response.body.customers.forEach(customer => {
                    expect(customer.size).to.equal(size);
                });

                cy.log(`API intercept validation successful for size = ${size}`);
            });


            cy.get('tbody > tr')
                .then(rows => {
                    const texts = [...rows].map(row =>
                        row.querySelector('td:nth-child(5)').innerText.trim()
                    );
                    const found = texts.some(text => text.includes('Enterprise'));
                    expect(found).to.be.true;
                });


            cy.log(`GUI validation successful: all rows reflect size = ${size}`);
        });

    });
});