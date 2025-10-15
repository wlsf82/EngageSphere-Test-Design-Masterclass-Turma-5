const API_URL = Cypress.env('API_URL');
const CUSTOMERS_API_URL = `${API_URL}/customers`;
describe('Customers - filters and others ', () => {
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
              { fixture: 'industry/technology'}
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
              { fixture: 'industry/finance'}
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

        it('finds no a11y issues in light mode in the customer table', () => {
            cy.checkA11y();
        });

        it('finds no a11y issues in dark mode in the customer table', () => {
            cy.getByClassThatStartsWith('ThemeToggle_button').click();
            cy.get('[data-theme="dark"]').should('exist');
            cy.get('body').should('have.attr', 'data-theme', 'dark');

            cy.checkA11y();
        });
    });
});