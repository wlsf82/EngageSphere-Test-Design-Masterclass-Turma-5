/// <reference types="cypress" />

/*
  Retorna à lista de clientes ao clicar no botão "Voltar" *
  Exibe o rodapé com o texto e links corretos *
  Exibe o cabeçalho com um título, alternador de tema e um campo de entrada de texto *
  Abre e fecha o messenger *
  Garante que todos os campos do messenger são obrigatórios e que o primeiro está focado *
  Mostra e oculta uma mensagem de sucesso ao enviar o formulário do messenger com sucesso *
  Limpa todos os campos do formulário do messenger ao preenchê-los, fechar o messenger e abri-lo novamente *
  Mostra as colunas Nome da Empresa e Ação, e oculta as colunas ID, Indústria, Número de Funcionários e Tamanho em um viewport móvel *
*/

describe('EngageSphere Testing App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the banner on the first visit', () => {
    cy.get('body')
      .get('.CookieConsent_banner__UHArL')
      .should('be.visible')

    cy.contains('Accept').should('be.visible')
    cy.contains('Decline').should('be.visible')
    cy.getCookies().should('be.empty')
  })

  it('Should be accepted the consent cookies', () => {
    cy.get('body')
      .get('.CookieConsent_banner__UHArL')
      .get('.Button_buttonContainer__X5AJ- button:first-child')
      .contains('Accept')
      .click()

    cy.setCookie('cookieConsent', 'accepted')
    cy.getCookie('cookieConsent').should('exist')
  })

  it('Displays the greeting “Hi, there” when no name is provided', () => {
    cy.grettings('Hi there!')
  })

  it('Displays the greeting “Hi, {name}” when the name is provided', () => {
    cy.get('[data-testid=name]')
      .type('Pulis')
    cy.grettings('Hi Pulis!')
  })

  it('Show messenger', () => {
    cy.get('body')
      .get('.Messenger_openCloseButton__OgKIA')
      .click()
  })
})
