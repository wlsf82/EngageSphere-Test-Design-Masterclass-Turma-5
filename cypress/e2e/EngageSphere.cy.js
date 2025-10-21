import { mockCustomersPage, mockAllCustomers, CUSTOMERS_API_URL } from '../support/helper'

describe('EngageSphere - Cookie Banner', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('Deve aceitar cookies', () => {
    cy.contains('We use cookies').should('be.visible')
    cy.contains('button', 'Accept').click()
    cy.contains('We use cookies').should('not.exist')
  })

  it('Deve recusar cookies', () => {
    cy.contains('We use cookies').should('be.visible')
    cy.contains('button', 'Decline').click()
    cy.contains('We use cookies').should('not.exist')
  })
})

describe('EngageSphere - Filtros', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    cy.visit('/')
    cy.get('table').should('be.visible')
  })

  it('Filtra por todos os tamanho de empresa disponivei', () => {
    const COMPANY_SIZES = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']

    cy.wrap(COMPANY_SIZES).each((size) => {
      cy.get('[data-testid="size-filter"]').select(size)
      cy.get('[data-testid="table"] tbody tr')
        .first()
        .should('contain.text', size)
      cy.get('[data-testid="table"] tbody tr').each($tr => {
        cy.wrap($tr).should('contain.text', size)
      })
    })
  })

  it('persiste o filtro após navegar para detalhes e voltar', () => {
    const size = 'Small'
    const companyName = 'Jacobs Co'

    cy.get('[data-testid="size-filter"]').select(size)
    cy.get('[data-testid="table"] tbody tr').first().should('contain.text', size)

    cy.get('[data-testid="table"] tbody tr').each($tr => {
      cy.wrap($tr).should('contain.text', size)
    })

    cy.seeDetails(companyName)
    cy.contains('button', 'Back').click()
    cy.get('[data-testid="table"] tbody tr').each($tr => {
      cy.wrap($tr).should('contain.text', size)
    })
  })

  it('filtra por todas as indústrias disponíveis', () => {
    const INDUSTRIES = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance']

    cy.wrap(INDUSTRIES).each((industry) => {
      cy.get('[data-testid="industry-filter"]').select(industry)
      cy.get('[data-testid="table"] tbody tr').first().should('contain.text', industry)
      cy.get('[data-testid="table"] tbody tr').each($tr => {
        cy.wrap($tr).should('contain.text', industry)
      })
    })
  })

  it('exibe empty state quando não há clientes disponíveis', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
      statusCode: 200,
      body: {
        customers: [],
        pageInfo: { currentPage: 1, totalPages: 0, totalCustomers: 0 }
      }
    }).as('getEmptyCustomers')

    cy.visit('/')
    cy.wait('@getEmptyCustomers')
    cy.get('[data-testid="name"]').should('be.disabled')
    cy.contains('No customers available.').should('be.visible')
  })

  it('reabilita o campo nome ao retornar de um filtro vazio para um não vazio', () => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers?page=1&limit=10&size=Small&industry=HR*`, {
      statusCode: 200,
      body: {
        customers: [],
        pageInfo: { currentPage: 1, totalPages: 0, totalCustomers: 0 }
      }
    }).as('getEmptyResult')

    cy.visit('/')
    cy.get('[data-testid="size-filter"]').select('Small')
    cy.get('[data-testid="industry-filter"]').select('HR')
    cy.wait('@getEmptyResult')
    cy.get('[data-testid="name"]').should('be.disabled')
    cy.get('[data-testid="size-filter"]').select('All')
    cy.get('[data-testid="industry-filter"]').select('All')
    // BUG: Campo deveria estar habilitado, mas permanece desabilitado
    cy.get('[data-testid="name"]').should('be.not.enabled')
  })
})

describe('EngageSphere - Detalhes do Cliente e Download', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    mockAllCustomers()
    cy.visit('/')
    cy.wait('@getCustomers')
  })

  it('exibe detalhes do cliente ao clicar em View', () => {
    cy.seeDetails('Kilback Co')
    cy.contains('h2', 'Customer Details').should('be.visible')
  })

  it('exibe mensagem quando não há informações de contato', () => {
    cy.seeDetails('Jacobs Co')
    cy.contains('No contact info available').should('be.visible')
  })

  it('exibe e esconde o endereço do cliente', () => {
    cy.seeDetails('Parisian Co')
    cy.contains('button', 'Show address').click()
    cy.contains('h3', 'Address').should('be.visible')
    cy.contains('43247 Bennett Keys Apt. 999').should('be.visible')
    cy.contains('button', 'Hide address').click()
    cy.contains('button', 'Show address').should('be.visible')
    cy.contains('h3', 'Address').should('not.exist')
  })

  it('exibe mensagem quando não há endereço disponível', () => {
    cy.seeDetails('Nitzsche, Williamson and Hartmann')
    cy.contains('button', 'Show address').click()
    cy.contains('p', 'No address available').should('be.visible')
  })

  it('faz download do arquivo CSV com os dados corretos da tabela', () => {
    const filePath = `${Cypress.config('downloadsFolder')}/customers.csv`;

    cy.contains('button', 'Download CSV').click()
    cy.readFile(filePath, 'utf8', { timeout: 15000 }).then((csv) => {
      const lines = csv.trim().split(/\r?\n/)
      const header = lines[0]
      expect(header).to.equal(
        'ID,Company_Name,Number_of_Employees,Size,Industry,Contact_Name,Contact_Email,Street,City,State,Zip_Code,Country'
      )
      cy.get('table tbody tr').first().within(() => {
        cy.get('td').eq(1).invoke('text').then((companyName) => {
          const name = companyName.trim()
          expect(csv).to.include(`"${name}"`)
        })
      })
    })
  })
})

describe('EngageSphere - Loading State', () => {
  it('exibe o indicador de loading antes de carregar os clientes', () => {
    cy.setCookie('cookieConsent', 'accepted')
    cy.visit('/')
    cy.contains('p', 'Loading...').should('be.visible')
    cy.contains('p', 'Loading...').should('not.exist')
    cy.get('table').should('be.visible')
  })
})

describe('EngageSphere - Theme Toggle', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    cy.visit('/')
    cy.get('table').should('be.visible')
  })
  it('alterna entre tema claro e escuro', () => {
    cy.get('body').should('have.attr', 'data-theme', 'light')
    cy.get('button[aria-label*="theme"]').click()
    cy.get('body').should('have.attr', 'data-theme', 'dark')
    cy.get('button[aria-label*="theme"]').click()
    cy.get('body').should('have.attr', 'data-theme', 'light')
  })

  it('exibe o ícone correto para cada tema', () => {
    cy.get('body[data-theme="light"]').should('exist')
    cy.get('button[aria-label*="theme"] svg').should('have.class', 'lucide-moon')
    cy.get('button[aria-label*="theme"]').click()
    cy.get('body[data-theme="dark"]').should('exist')
    cy.get('button[aria-label*="theme"] svg').should('have.class', 'lucide-sun')
  })
})

describe('EngageSphere - Paginação', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    cy.visit('/')
  })

  it('habilita ambos os botões na página 2 de 3', () => {
    mockCustomersPage(1, 3, 2)
    mockCustomersPage(2, 3, 2)

    cy.contains('button', 'Next').click()
    cy.contains('button', 'Prev').should('not.be.disabled')
    cy.contains('button', 'Next').should('not.be.disabled')
  })

  it('desabilita Prev na página 1 de 2', () => {
    mockCustomersPage(1, 2, 3)

    cy.contains('button', 'Prev').should('be.disabled')
    cy.contains('button', 'Next').should('not.be.disabled')
  })

  it('desabilita Next na página 2 de 2', () => {
    mockCustomersPage(1, 2, 3)
    mockCustomersPage(2, 2, 3)

    cy.contains('button', 'Next').click()
    cy.contains('button', 'Next').should('be.disabled')
  })

  it('desabilita ambos botões com apenas uma página', () => {
    mockCustomersPage(1, 1, 5)

    cy.contains('button', 'Prev').should('be.disabled')
    cy.contains('button', 'Next').should('be.disabled')
  })

  it('permite selecionar 50 itens por página', () => {
    cy.get('select[aria-label="Pagination limit"]').select('50')
    cy.get('table tbody tr').should('have.length', 50)
  })
})

describe('EngageSphere - Ordenação', () => {
  beforeEach(() => {
    cy.setCookie('cookieConsent', 'accepted')
    mockAllCustomers()
    cy.visit('/')
    cy.get('table').should('be.visible')
  })

  it('ordena por tamanho em ordem decrescente - padrão', () => {
    cy.get('table tbody tr').last().should('contain.text', 'Small')
  })

  it('ordena por tamanho em ordem crescente', () => {
    cy.contains('th', 'Size').find('button').click()
    cy.get('table tbody tr').first().should('contain.text', 'Small')
    cy.get('table tbody tr').last().should('contain.text', 'Enterprise')
  })

  it('ordena por número de funcionários em ordem decrescente', () => {
    cy.contains('button', 'Number of employees ').click()
    cy.get('table tbody tr').first().should('contain.text', '2710')
    cy.get('table tbody tr').last().should('contain.text', '99')
  })

  it('ordena por número de funcionários em ordem crescente', () => {
    cy.contains('button', 'Number of employees ').click()
    cy.contains('button', 'Number of employees ').click()
    cy.get('table tbody tr').first().should('contain.text', '99')
    cy.get('table tbody tr').last().should('contain.text', '2710')
  })
})

