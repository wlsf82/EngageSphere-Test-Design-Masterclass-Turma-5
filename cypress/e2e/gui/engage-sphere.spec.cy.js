const CUSTOMERS_API_URL = `${Cypress.env('API_URL')}/customers`
describe('Customers', () => {
    beforeEach(() => {
        cy.clearCookies();
        cy.setCookie('cookieConsent', 'accepted');
        cy.visit('/');
        cy.contains('h2', 'Hi there!', { timeout: 5000 })
    });

    it('keeps the filters when coming back from the customer details view', () => {
        const clientFilterData = {
            size: 'Small',
            industry: 'Technology'
        };
        cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=${clientFilterData.size}&industry=${clientFilterData.industry}`,
            { fixture: 'tecnology/smallTechnology' }
        ).as('getSmallTechnologyCustomers');
        cy.get('[data-testid="size-filter"]').select(clientFilterData.size);
        cy.get('[data-testid="industry-filter"]').select(clientFilterData.industry);
        cy.contains('button', 'View').click();
        cy.contains('button', 'Back').click();
        cy.get('[data-testid="size-filter"]').should('have.value', clientFilterData.size);
        cy.get('[data-testid="industry-filter"]').should('have.value', clientFilterData.industry);
    });

    it('persists the limit of items per page in the local storage when changing the limit', () => {
        cy.get('[name="pagination-limit"]').select('20');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('paginationLimit')).to.eq('20');
        });
    });

    context('Filters - size and industry - usability', () => {
        it('filters the customers by small size', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=Small&industry=All`,
                { fixture: 'size/small' }
            ).as('getSmallCustomers');
            cy.get('[data-testid="size-filter').select('Small');
            cy.wait('@getSmallCustomers');

            cy.get('tbody tr').should('have.length', 4);
        });

        it('filters the customers by medium size', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=Medium&industry=All`,
                { fixture: 'size/medium' }
            ).as('getMediumCustomers');
            cy.get('[data-testid="size-filter').select('Medium');
            cy.wait('@getMediumCustomers');

            cy.get('tbody tr').should('have.length', 5);
        });

        it('filters the customers by enterprise size', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=Enterprise&industry=All`,
                { fixture: 'size/enterprise' }
            ).as('getLargeCustomers');

            cy.get('[data-testid="size-filter').select('Enterprise');
            cy.wait('@getLargeCustomers');

            cy.get('tbody tr').should('have.length', 3);
        });

        it('filters the customers by large enterprise size', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=Large%20Enterprise&industry=All`,
                { fixture: 'size/largeEnterprise' }
            ).as('getLargeEnterpriseCustomers');
            cy.get('[data-testid="size-filter').select('Large Enterprise');
            cy.wait('@getLargeEnterpriseCustomers');

            cy.get('tbody tr').should('have.length', 2);
        });

        it('filters the customers by very large enterprise size', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=Very%20Large%20Enterprise&industry=All`,
                { fixture: 'size/veryLargeEnterprise' }
            ).as('getVeryLargeEnterpriseCustomers');
            cy.get('[data-testid="size-filter').select('Very Large Enterprise');
            cy.wait('@getVeryLargeEnterpriseCustomers');

            cy.get('tbody tr').should('have.length', 1);
        });

        it('filters the customers by all sizes', () => {
            cy.get('[data-testid="size-filter"]').select('Small');
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'all' }
            ).as('getAllCustomers');
            cy.get('[data-testid="size-filter"]').select('All');
            cy.wait('@getAllCustomers');

            cy.get('tbody tr').should('have.length', 9);
        });

        it('filters the customers by logistics industry', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=Logistics`,
                { fixture: 'industry/logistics' }
            ).as('getLogisticsCustomers');

            cy.get('[data-testid="industry-filter"]').select('Logistics');
            cy.wait('@getLogisticsCustomers');

            cy.get('tbody tr').should('have.length', 1);
        });

        it('filters the customers by retail industry', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=Retail`,
                { fixture: 'industry/retail' }
            ).as('getRetailCustomers');
            cy.get('[data-testid="industry-filter"]').select('Retail');
            cy.wait('@getRetailCustomers');

            cy.get('tbody tr').should('have.length', 1);
        });

        it('filters the customers by technology industry', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=Technology`,
                { fixture: 'industry/technology' }
            ).as('getTechnologyCustomers');
            cy.get('[data-testid="industry-filter"]').select('Technology');
            cy.wait('@getTechnologyCustomers');

            cy.get('tbody tr').should('have.length', 3);
        });

        it('filters the customers by HR industry', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=HR`,
                { fixture: 'industry/hr' }
            ).as('getHRCustomers');
            cy.get('[data-testid="industry-filter"]').select('HR');
            cy.wait('@getHRCustomers');
            cy.get('tbody tr').should('have.length', 4);
        });

        it('filters the customers by finance industry', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=Finance`,
                { fixture: 'industry/finance' }
            ).as('getFinanceCustomers');
            cy.get('[data-testid="industry-filter"]').select('Finance');
            cy.wait('@getFinanceCustomers');
            cy.get('tbody tr').should('have.length', 6);
        });

        it('filters the customers by all industries', () => {
            cy.get('[data-testid="industry-filter"]').select('Technology');
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'all' }
            ).as('getAllCustomers');
            cy.get('[data-testid="industry-filter"]').select('All');
            cy.wait('@getAllCustomers');
            cy.get('tbody tr').should('have.length', 9);
        });
    });

    context('View', () => {
        it('goes back to the customers list when clicking the "Back" button', () => {
            cy.contains('button', 'View').eq(0).click();
            cy.contains('button', 'Back').click();
            cy.contains('p', 'Below is our customer list.').should('be.visible');
        });

        it('shows a Loading... fallback element before the initial customers fetch', () => {
            cy.reload();
            cy.contains('p', 'Loading...')
                .should('be.visible');
        });
    });


    context('Acessibility', () => {
        beforeEach(() => {
            cy.injectAxe();
        });

        context('Light Mode', () => {
            it('Customer table should have no accessibility issues', () => {
                cy.checkA11y();
            });

            it('Customer details and address view should have no accessibility issues', () => {
                cy.get('button').contains('View').click();
                cy.checkA11y();
            });

            it('Messenger contact form should have no accessibility issues', () => {
                //fiquei em dúvida, se há necessidade de ajustar o component Messenger Contact Form ou easter egg
                cy.getByClassThatStartsWith('Messenger_openCloseButton').click();
                cy.checkA11y();
            });
        });

        context('Dark Mode', () => {
            beforeEach(() => {
                cy.getByClassThatStartsWith('ThemeToggle_button').click();
                cy.get('[data-theme="dark"]').should('exist');
            });

            it('Customer table should have no accessibility issues in dark mode', () => {
                cy.checkA11y();
            });

            it('Customer details and address view should have no accessibility issues in dark mode', () => {
                cy.get('button').contains('View').click();
                cy.checkA11y();
            });

            it('Messenger contact form should have no accessibility issues in dark mode', () => {
                //fiquei em dúvida, se há necessidade de ajustar o component Messenger Contact Form ou easter egg
                cy.getByClassThatStartsWith('Messenger_openCloseButton').click();
                cy.checkA11y();
            });
        });
    });

    context('Empty State', () => {
        beforeEach(() => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'empty' },
            ).as('getEmptyCustomers');

            cy.visit('/');
            cy.wait('@getEmptyCustomers');
        });

        it('Displays an empty state illustration and the message “No customers available” when the customer database is empty.', () => {
            cy.get('svg[title="image of an empty box"]').should('be.visible');
            cy.contains('span', 'No customers available.').should('be.visible');
        });

        it('Disables the customer name input field when the customer database is empty.', () => {
            cy.get('#name').should('be.disabled');
        });
    });

    context('Messenger Contact Form', () => {
        it('Displays a success message after the messenger form is successfully submitted, and hides it automatically after a short delay.', () => {
            const messengerData = {
                name: 'Matheus',
                email: 'matheus@gmail.com',
                message: 'Hello, I need help with something.',
            };

            cy.getByClassThatStartsWith('Messenger_openCloseButton').click();
            cy.get('#messenger-name').type(messengerData.name);
            cy.get('#email').type(messengerData.email);
            cy.get('#message').type(messengerData.message);
            cy.clock();
            cy.getByClassThatStartsWith('Messenger_sendButton').click();

            cy.getByClassThatStartsWith('Messenger_success')
                .should('be.visible')
                .and('have.text', 'Your message has been sent.');
            cy.tick(3000);
            cy.getByClassThatStartsWith('Messenger_success').should('not.exist');
        });
    });

    context('Details', () => {
        it('renders the contact details of a customer', () => {

            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'withAddress' },
            ).as('getCustomerWithAddress');

            cy.visit('/');
            cy.wait('@getCustomerWithAddress');
            cy.contains('button', 'View').click();

            cy.fixture('withAddress').then((customer) => {
                cy.contains('p', customer.customers[0].contactInfo.name).should('be.visible');
                cy.contains('p', customer.customers[0].contactInfo.email).should('be.visible');
                cy.contains('p', customer.customers[0].id).should('be.visible');
                cy.contains('p', customer.customers[0].employees).should('be.visible');
                cy.contains('p', customer.customers[0].size).should('be.visible');
                cy.contains('p', customer.customers[0].industry).should('be.visible');
            });
        });

        it('shows and hides the customer address', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'withAddress' },
            ).as('getCustomerWithAddress');

            cy.visit('/');
            cy.wait('@getCustomerWithAddress');
            cy.contains('button', 'View').click();

            cy.getByClassThatStartsWith('CustomerDetails_showAddressBtn').click();

            cy.contains('h3', 'Address').should('be.visible');
            cy.fixture('withAddress').then((customer) => {
                cy.contains('p', customer.customers[0].address.street).should('be.visible');
                cy.contains('p', customer.customers[0].address.city).should('be.visible');
                cy.contains('p', customer.customers[0].address.state).should('be.visible');
                cy.contains('p', customer.customers[0].address.zipCode).should('be.visible');
                cy.contains('p', customer.customers[0].address.country).should('be.visible');
            });

            cy.getByClassThatStartsWith('CustomerDetails_hideAddressBtn').click();

            cy.contains('h3', 'Address').should('not.exist');
        });
    });

    context('Cookies', () => {
        beforeEach(() => {
            cy.clearCookies();
            cy.visit('/');
        });

        it('accepts the cookie consent', () => {
            cy.contains('button', 'Accept').click();

            cy.getByClassThatStartsWith('CookieConsent_banner').should('not.exist');
            cy.getCookie('cookieConsent').should('have.property', 'value', 'accepted');
        });

        it('rejects the cookie consent', () => {
            // o Decline button funciona do mesmo modo que o Accept easter egg???
            cy.contains('button', 'Decline').click();

            cy.getByClassThatStartsWith('CookieConsent_banner').should('not.exist');
            cy.getCookie('cookieConsent').should('have.property', 'value', 'declined');
        });
    });

    context('CSV', () => {
        it('downloads a CSV file with the customers data', () => {
            cy.intercept('GET', `${CUSTOMERS_API_URL}?page=1&limit=10&size=All&industry=All`,
                { fixture: 'all' },
            ).as('getAllCustomers');

            cy.visit('/');
            cy.wait('@getAllCustomers');
            cy.contains('button', 'Download CSV').click();

            cy.readFile('cypress/downloads/customers.csv').then((csv) => {
                const expectedHeader = [
                    'ID',
                    'Company_Name',
                    'Number_of_Employees',
                    'Size',
                    'Industry',
                    'Contact_Name',
                    'Contact_Email',
                    'Street',
                    'City',
                    'State',
                    'Zip_Code',
                    'Country'
                ].join(',');
                expect(csv).to.include(expectedHeader);

                cy.fixture('all').then((customers) => {
                    customers.customers.forEach((customer) => {
                        const expectedLine = [
                            `"${customer.id}"`,
                            `"${customer.name}"`,
                            `"${customer.employees}"`,
                            `"${customer.size}"`,
                            `"${customer.industry}"`,
                            `"${customer.contactInfo?.name || ''}"`,
                            `"${customer.contactInfo?.email || ''}"`,
                            `"${customer.address?.street || ''}"`,
                            `"${customer.address?.city || ''}"`,
                            `"${customer.address?.state || ''}"`,
                            `"${customer.address?.zipCode || ''}"`,
                            `"${customer.address?.country || ''}"`
                        ].join(',');
                        expect(csv).to.include(expectedLine);
                    });
                });
            });
        });
    });
});
