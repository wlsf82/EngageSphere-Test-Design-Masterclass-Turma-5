
describe('Customers', () => {
    const GUI_URL = Cypress.env('GUI_URL');

    beforeEach(() => {
        cy.setCookie('cookieConsent', 'accepted');
        cy.visit(GUI_URL);
        cy.contains('h2', 'Hi there!', { timeout: 5000 })
    });

    context('Acessibility', () => {
        beforeEach(() => {
            cy.injectAxe();
        });

        it('finds no a11y issues in light mode in the customer table', () => {
            cy.checkA11y();
        });

        it('finds no a11y issues in dark mode in the customer table', () => {
            cy.get(`[class^="ThemeToggle_button"]`).click();
            cy.get('[data-theme="dark"]').should('exist');
            cy.get('body').should('have.attr', 'data-theme', 'dark');

            cy.checkA11y();
        });
    });


});