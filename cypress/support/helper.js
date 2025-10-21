const CUSTOMERS_API_URL = Cypress.env('apiUrl')

export function mockAllCustomers() {
  cy.fixture('customers').then((data) => {
    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers*`, {
      body: {
        customers: data.customers,
        pageInfo: {
          currentPage: 1,
          totalPages: 1,
          totalCustomers: data.customers.length
        }
      }
    }).as('getCustomers')
  })
}

export function mockCustomersPage(page, totalPages, itemsPerPage = 5) {
  cy.fixture('customers').then((data) => {
    const customers = data.customers || data
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage

    cy.intercept('GET', `${CUSTOMERS_API_URL}/customers?page=${page}*`, {
      statusCode: 200,
      body: {
        customers: customers.slice(start, end),
        pageInfo: {
          currentPage: page,
          totalPages,
          totalCustomers: customers.length
        }
      }
    }).as(`getPage${page}`)
  })
}

