/// <reference types="cypress" />

describe('EngageSphere Testing App', () => {
  const COOKIE_CONSENT = 'div[class^="CookieConsent_banner__"]'

  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the banner on the first visit', () => {
    cy.get(COOKIE_CONSENT).should('be.visible')

    cy.contains('button', 'Accept').should('be.visible')
    cy.contains('button', 'Decline').should('be.visible')

    cy.getCookies().should('be.empty')
  })

  it('Should accept the cookies consent banner', () => {
    cy.get(COOKIE_CONSENT)

    cy.contains('button', 'Accept')
      .should('be.visible')
      .click()

    cy.setCookie('cookieConsent', 'accepted')
    cy.getCookie('cookieConsent').should('exist')
    cy.getCookie('cookieConsent').should('have.property', 'value', 'accepted')
  })

  it('Displays the greeting “Hi, there” when no name is provided', () => {
    cy.contains('h2', 'Hi there!').should('be.visible')
  })

  it('Displays the greeting “Hi, {name}” when the name is provided', () => {
    cy.get('[data-testid=name]')
      .type('Pulis')

    cy.contains('h2', 'Hi Pulis!').should('be.visible')
  })

  it('Open chat messenger', () => {
    cy.get('button[class^="Messenger_openCloseButton__"]')
      .should('be.visible')
      .click()
  })
})
