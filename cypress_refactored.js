// Constantes
const COMPANY_SIZES = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']
const INDUSTRIES = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance']
const CUSTOMERS_API_URL = Cypress.env('apiUrl') || 'http://localhost:3001'

// ===== TESTES DO COOKIE BANNER =====
describe('EngageSphere - Cookie Banner', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  context('Exibição do banner', () => {
    it('exibe o banner de cookies ao acessar a aplicação pela primeira vez', () => {
      cy.visit('/')
      
      cy.contains('We use cookies').should('be.visible')
      cy.contains('button', 'Accept').should('be.visible')
      cy.contains('button', 'Decline').should('be.visible')
    })
  })

  context('Ação de aceitar cookies', () => {
    it('fecha o banner ao clicar em Accept', () => {
      cy.visit('/')
      
      cy.contains('We use cookies').should('be.visible')
      cy.contains('button', 'Accept').click()
      cy.contains('We use cookies').should('not.exist')
    })

    it('armazena a preferência de aceitar no localStorage', () => {
      cy.visit('/')
      cy.contains('button', 'Accept').click()
      
      cy.window().then((window) => {
        const cookieConsent = window.localStorage.getItem('cookieConsent')
        expect(cookieConsent).to.equal('accepted')
      })
    })

    it('não exibe o banner novamente após aceitar e recarregar a página', () => {
      cy.visit('/')
      cy.contains('button', 'Accept').click()
      cy.contains('We use cookies').should('not.exist')
      
      cy.reload()
      
      cy.contains('We use cookies').should('not.exist')
    })
  })

  context('Ação de recusar cookies', () => {
    it('fecha o banner ao clicar em Decline', () => {
      cy.visit('/')
      
      cy.contains('We use cookies').should('be.visible')
      cy.contains('button', 'Decline').click()
      cy.contains('We use cookies').should('not.exist')
    })

    it('armazena a preferência de recusar no localStorage', () => {
      cy.visit('/')
      cy.contains('button', 'Decline').click()
      
      cy.window().then((window) => {
        const cookieConsent = window.localStorage.getItem('cookieConsent')
        expect(cookieConsent).to.equal('declined')
      })
    })

    it('não exibe o banner novamente após recusar e recarregar a página', () => {
      cy.visit('/')
      cy.contains('button', 'Decline').click()
      cy.contains('We use cookies').should('not.exist')
      
      cy.reload()
      
      cy.contains('We use cookies').should('not.exist')
    })
  })
})

// ===== TESTES DE FILTROS =====
describe('EngageSphere - Filtros', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    cy.visit('/')
    cy.get('table').should('be.visible')
  })

  context('Filtro por tamanho de empresa', () => {
    it('filtra por todos os tamanhos disponíveis', () => {
      cy.wrap(COMPANY_SIZES).each((size) => {
        cy.get('[data-testid="size-filter"]').select(size)
        
        cy.get('[data-testid="table"] tbody tr').each($tr => {
          cy.wrap($tr).should('contain.text', size)
        })
      })
    })

    it('persiste o filtro após navegar para detalhes e voltar', () => {
      const size = 'Small'
      const companyName = 'Jacobs Co'

      cy.get('[data-testid="size-filter"]').select(size)
      
      cy.get('[data-testid="table"] tbody tr').each($tr => {
        cy.wrap($tr).should('contain.text', size)
      })

      cy.seeDetails(companyName)
      cy.contains('button', 'Back').click()

      cy.get('[data-testid="table"] tbody tr').each($tr => {
        cy.wrap($tr).should('contain.text', size)
      })
    })
  })

  context('Filtro por indústria', () => {
    it('filtra por todas as indústrias disponíveis', () => {
      cy.wrap(INDUSTRIES).each((industry) => {
        cy.get('[data-testid="industry-filter"]').select(industry)
        
        cy.get('[data-testid="table"] tbody tr').each($tr => {
          cy.wrap($tr).should('contain.text', industry)
        })
      })
    })
  })

  context('Filtros combinados', () => {
    it('exibe empty state quando não há clientes disponíveis', () => {
      cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
        statusCode: 200,
        body: []
      }).as('getEmptyCustomers')

      cy.visit('/')
      cy.wait('@getEmptyCustomers')

      cy.get('[data-testid="name"]').should('be.disabled')
      cy.contains('p', 'No customers available.').should('be.visible')
    })

    it('reabilita o campo nome ao retornar de um filtro vazio para um não vazio', () => {
      // Primeiro, simular filtro que retorna vazio
      cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*size=Small*industry=HR*`, {
        statusCode: 200,
        body: []
      }).as('getEmptyResult')

      cy.get('[data-testid="size-filter"]').select('Small')
      cy.get('[data-testid="industry-filter"]').select('HR')
      cy.wait('@getEmptyResult')

      cy.get('[data-testid="name"]').should('be.disabled')

      // Limpar filtros
      cy.get('[data-testid="size-filter"]').select('All')
      cy.get('[data-testid="industry-filter"]').select('All')

      // BUG: Campo deveria estar habilitado, mas permanece desabilitado
      cy.get('[data-testid="name"]').should('be.enabled')
    })
  })
})

// ===== TESTES DE DETALHES DO CLIENTE =====
describe('EngageSphere - Detalhes do Cliente', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
      fixture: 'customers'
    }).as('getCustomers')
    
    cy.visit('/')
    cy.wait('@getCustomers')
  })

  it('exibe detalhes do cliente ao clicar em View', () => {
    const companyName = 'Lowe Co'

    cy.seeDetails(companyName)
    cy.contains('h2', 'Customer Details').should('be.visible')
  })

  it('exibe mensagem quando não há informações de contato', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers/*`, {
      body: {
        id: 1,
        companyName: 'Test Company',
        numberOfEmployees: 100,
        size: 'Small',
        industry: 'Technology',
        contactName: null,
        contactEmail: null
      }
    }).as('getCustomerWithoutContact')

    cy.seeDetails('Test Company')
    cy.wait('@getCustomerWithoutContact')
    
    cy.contains('p', 'No contact info available.').should('be.visible')
  })

  it('exibe e esconde o endereço do cliente', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers/*`, {
      body: {
        id: 2,
        companyName: 'Littel Co',
        numberOfEmployees: 500,
        size: 'Medium',
        industry: 'Retail',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    }).as('getCustomerWithAddress')

    cy.seeDetails('Littel Co')
    cy.wait('@getCustomerWithAddress')

    cy.contains('button', 'Show Address').click()
    cy.contains('h3', 'Address').should('be.visible')
    cy.contains('123 Main St').should('be.visible')

    cy.contains('button', 'Hide Address').click()
    cy.contains('button', 'Show Address').should('be.visible')
    cy.contains('h3', 'Address').should('not.exist')
  })

  it('exibe mensagem quando não há endereço disponível', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers/*`, {
      body: {
        id: 3,
        companyName: 'Test Company',
        numberOfEmployees: 200,
        size: 'Medium',
        industry: 'Finance',
        street: null,
        city: null,
        state: null,
        zipCode: null,
        country: null
      }
    }).as('getCustomerWithoutAddress')

    cy.seeDetails('Test Company')
    cy.wait('@getCustomerWithoutAddress')
    
    cy.contains('button', 'Show Address').click()
    cy.contains('p', 'No address available.').should('be.visible')
  })
})

// ===== TESTES DE INTERFACE E LOADING =====
describe('EngageSphere - Loading State', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
  })

  it('exibe o indicador de loading antes de carregar os clientes', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
      delay: 1000,
      fixture: 'customers'
    }).as('getDelayedCustomers')

    cy.visit('/')

    cy.contains('p', 'Loading...').should('be.visible')

    cy.wait('@getDelayedCustomers')

    cy.contains('p', 'Loading...').should('not.exist')
    cy.get('table').should('be.visible')
  })
})

// ===== TESTES DE DOWNLOAD =====
describe('EngageSphere - Download CSV', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
      fixture: 'customers'
    }).as('getCustomers')
    
    cy.visit('/')
    cy.wait('@getCustomers')
  })

  it('faz download do arquivo CSV com os dados corretos da tabela', () => {
    const filePath = `${Cypress.config('downloadsFolder')}/customers.csv`

    cy.contains('button', 'Download CSV').click()

    cy.readFile(filePath, 'utf8', { timeout: 15000 })
      .should('include', 'Company Name')
      .and('include', 'Industry')
      .and('include', 'Size')
      .then((csvContent) => {
        // Valida que contém dados da primeira linha da tabela
        cy.get('table tbody tr').first().invoke('text').then((firstRowText) => {
          const companyName = firstRowText.match(/^[\w\s,]+/)[0].trim()
          expect(csvContent).to.include(companyName)
        })
      })
  })
})
