describe('API Testing Engagesphere', () => {
  const CUSTOMER_API_URL = `${Cypress.env('API_URL')}/customers`

  it('should return status code 200', () => {
    cy.request({
      method: 'GET',
      url: CUSTOMER_API_URL,
      failOnStatusCode: false
    }).then(({ status }) => {
      expect(status).to.eq(200)
    })
  })

  it('should check customer schema', () => {
    cy.request({
      method: 'GET',
      url: CUSTOMER_API_URL,
      failOnStatusCode: false
    }).then(({ body }) => {
      const customers = body.customers
      expect(customers).to.be.an('array').not.to.be.empty

      const { id, name, employees, size, industry, contactInfo, address } = customers[1]
      customers.forEach(() => {
        expect(id).to.be.a('number')
        expect(name).to.be.a('string')
        expect(employees).to.be.a('number')
        expect(size).to.be.a('string')
        expect(industry).to.be.a('string')
        expect(contactInfo).to.be.a('object')
        expect(contactInfo).to.have.all.keys('name', 'email')
        expect(contactInfo.name).to.be.a('string')
        expect(contactInfo.email).to.be.a('string')
        expect(address).to.be.a('object')
        expect(address).to.have.all.keys(
          'street',
          'city',
          'state',
          'zipCode',
          'country'
        )
        expect(address.street).to.be.a('string')
        expect(address.city).to.be.a('string')
        expect(address.state).to.be.a('string')
        expect(address.zipCode).to.be.a('string')
        expect(address.country).to.be.a('string')
      })
    })
  })
})
