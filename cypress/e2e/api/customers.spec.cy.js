describe('API Testing Engagesphere', () => {
  it('should retrieve correct status and body structure', () => {
    cy.request('GET', 'http://localhost:3001/customers').then(response => {
      expect(response.status).to.eq(200)

      expect(response.body).to.have.all.keys('customers', 'pageInfo')

      // Estrutura customers
      const customer = response.body.customers[0]
      expect(customer).to.have.all.keys(
        'id',
        'name',
        'employees',
        'size',
        'industry',
        'contactInfo',
        'address'
      )

      // Estrutura contactInfo
      expect(customer.contactInfo).to.have.all.keys('name', 'email')

      // Estrutura address
      expect(customer.address).to.have.all.keys(
        'street',
        'city',
        'state',
        'zipCode',
        'country'
      )

      // Estrutura pageInfo
      expect(response.body.pageInfo).to.have.all.keys(
        'currentPage',
        'totalPages',
        'totalCustomers'
      )
    })
  })
})
