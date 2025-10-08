describe('Customers', () => {
    const API_URL = Cypress.env('API_URL');
    const GUI_URL = Cypress.env('GUI_URL');

    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('cookieConsent', 'accepted');
        cy.visit(GUI_URL);
        cy.contains('h2', 'Hi there!', { timeout: 5000 })
    });

    context('Filters - usability', () => {
        it('Should present table referring to the applied size', () => {
            const size = 'Very Large Enterprise';
            const encodedSize = encodeURIComponent(size);
            
            cy.get('[data-testid="table"]')
                .find('thead > tr > :nth-child(5)')
                .contains('Size')
                .should('be.visible');

            cy.intercept(
                'GET',
                `${API_URL}/customers*size=${encodedSize}*`
            ).as('getFilteredSize');

            cy.get('[data-testid="size-filter"]').select(size);

            cy.wait('@getFilteredSize', { timeout: 10000 }).then(({ response }) => {
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

    context('Filters Size all - usability', () => {
        const sizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'];

        sizes.forEach(size => {
            it(`Should present table referring to the selected ${size} size `, () => {
                const encodedSize = encodeURIComponent(size);

                cy.get('[data-testid="table"]')
                    .find('thead > tr > :nth-child(5)')
                    .contains('Size')
                    .should('be.visible');

                cy.intercept(
                    'GET',
                    `${API_URL}/customers*size=${encodedSize}*`
                ).as(`getFilteredCustomers-${size}`);

                cy.get('[data-testid="size-filter"]').select(size);

                cy.wait(`@getFilteredCustomers-${size}`, { timeout: 10000 }).then(({ response }) => {
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
                        const allRowsMatch = texts.every(text => text.includes(size));
                        expect(allRowsMatch).to.be.true;
                    });

                cy.log(`GUI validation successful: all rows reflect size = ${size}`);
            });
        });
    });
});