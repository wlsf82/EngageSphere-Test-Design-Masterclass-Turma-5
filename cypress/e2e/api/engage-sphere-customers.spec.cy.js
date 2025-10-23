const CUSTOMERS_API_URL = `${Cypress.env('API_URL')}/customers`
describe('API - Get Customers', () => {
    context('Valid requests', () => {
        it('GET /customers - returns 200 and valid response structure (default parameters)', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
            }).then(({ status, body }) => {
                expect(status).to.eq(200);
                expect(body).to.have.property('customers').and.be.an('array').and.not.be.empty;
                body.customers.forEach((customer) => {
                    expect(customer).to.have.all.keys(
                        'id',
                        'name',
                        'employees',
                        'size',
                        'industry',
                        'contactInfo',
                        'address'
                    );
                    expect(customer.id).to.be.a('number');
                    expect(customer.name).to.be.a('string');
                    expect(customer.employees).to.be.a('number');
                    expect(customer.size).to.be.a('string');
                    expect(customer.industry).to.be.a('string');
                    if (customer.contactInfo !== null) {
                        expect(customer.contactInfo).to.be.an('object');
                    }

                    if (customer.address !== null) {
                        expect(customer.address).to.be.an('object');
                    }
                });
            });
        });

        it('GET /customers - correctly handles pagination across multiple pages', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').with.lengthOf(10);
                expect(body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');
                expect(body.pageInfo.currentPage).to.equal(1);
            });
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { page: 2, limit: 10 },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').with.lengthOf.at.most(10);
                expect(body.pageInfo.currentPage).to.equal(2);

            });
        });

        it('GET /customers - correctly filters by customer limit', () => {
            const limit = 15; //Maximum number of customers to be returned

            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { limit },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array');
                expect(body.customers.length).to.be.at.most(limit);
                expect(body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');
            });
        });

        it('GET /customers - filter by company size', () => {
            const size = 'Very Large Enterprise'; // Small, Medium, Enterprise, Large Enterprise, Very Large Enterprise

            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { size },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').not.to.be.empty;
                body.customers.forEach(customer => {
                    expect(customer.size).to.equal(size);
                });
            });
        });

        it('GET /customers - filter by industry', () => {
            const industry = 'Technology'; // Logistics, Retail, Technology, HR, Finance

            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { industry },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').not.to.be.empty;
                body.customers.forEach(customer => {
                    expect(customer.industry).to.equal(industry);
                });
            });
        });

        it('GET /customers - filter by customer name', () => {
            const customerName = 'Littel Co';

            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { customerName },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').not.to.be.empty;

                // Ensure at least one customer contains the searched name
                // The `some` method checks if at least one element in the array satisfies the condition
                const found = body.customers.some(customer => customer.name.includes(customerName));
                expect(found).to.be.true;
            });
        });

        it('GET /customers - filter by customer email', () => {
            // TODO: Open issue - The email search is currently case-sensitive and should be updated to be case-insensitive
            const customerEmail = 'Selena.Gleichner7@gmail.com';

            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { customerEmail },
            }).then(({ status, body }) => {
                expect(status).to.equal(200);
                expect(body.customers).to.be.an('array').not.to.be.empty;

                // Ensure at least one customer contains the searched email
                // The `some` method checks if at least one element in the array satisfies the condition
                const found = body.customers.some(customer => customer.contactInfo?.email === customerEmail);
                expect(found).to.be.true;
            });
        });
    });

    context('Invalid requests', () => {
        it('rejects request with invalid (negative) page value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { page: -1 },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (negative) limit value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { limit: -1 },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (string) page value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { page: 'namepage' },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (boolean) limit value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { limit: true },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid size value', () => {
            const mensage = 'Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.'
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { size: 'small' },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq(mensage);
            });
        });

        it('rejects request with invalid (boolean) limit value', () => {
            const mensage = 'Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.'
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { industry: 'QA' },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq(mensage);
            });
        });

        it('rejects request with invalid (zero) page value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { page: 0 },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (zero) limit value', () => {
            cy.request({
                method: 'GET',
                url: CUSTOMERS_API_URL,
                qs: { limit: 0 },
                failOnStatusCode: false,
            }).then(({ status, body }) => {
                expect(status).to.eq(400);
                expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });
    });
});
