const API_URL = Cypress.env('API_URL');
const GUI_URL = Cypress.env('GUI_URL');

describe('Customers', () => {
    beforeEach(() => {
        cy.setCookie('cookieConsent', 'accepted');
        cy.visit(GUI_URL);
        cy.contains('h2', 'Hi there!', { timeout: 5000 })
    });

    context('View - usability', () => {
        it('goes back to the customers list when clicking the "Back" button', () => {
            const message = 'Below is our customer list.';
            cy.contains('button', 'View')
                .eq(0)
                .click();
            cy.contains('button', 'Back')
                .click();
            cy.contains('p', message)
                .should('be.visible');
        });

        it('shows a Loading... fallback element before the initial customers fetch', () => {
            cy.reload();
            cy.contains('p', 'Loading...')
                .should('be.visible');
        });
    });


});