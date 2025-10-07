

describe('Get Customers', () => {

    context('Valid requests', () => {
        it('GET /customers - returns 200 and valid response structure (default parameters)', () => {
            cy.apiGetCustomers({
            }).then((response) => {
                expect(response.status).to.eq(200);
                const customers = response.body.customers;
                expect(customers).to.be.an('array').and.not.be.empty;
                customers.forEach((customer) => {
                    expect(customer).to.have.all.keys(
                        'id',
                        'name',
                        'employees',
                        'industry',
                        'contactInfo',
                        'address',
                        'size'
                    );
                });
            });
        });

        it('GET /customers - returns 200 and valid response structure (custom parameters)', () => {
            cy.apiGetCustomers({
                page: 1,
                limit: 10,
                size: 'All',
                industry: 'All',
            }).then((response) => {
                expect(response.status).to.eq(200);
                const customers = response.body.customers;

                expect(customers).to.be.an('array').and.not.be.empty;
                customers.forEach((customer) => {
                    expect(customer).to.have.all.keys(
                        'id',
                        'name',
                        'employees',
                        'industry',
                        'contactInfo',
                        'address',
                        'size'
                    );
                });
            });
        });

        it('GET /customers - correctly handles pagination across multiple pages', () => {
            cy.log('Validate page 1 (default)');
            cy.apiGetCustomers({})
                .then((responsePage1) => {
                    expect(responsePage1.status).to.equal(200);
                    expect(responsePage1.body.customers).to.be.an('array').with.lengthOf(10);

                    expect(responsePage1.body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');
                    expect(responsePage1.body.pageInfo.currentPage).to.equal(1);
                });
            cy.log('Validate page 2');
            cy.apiGetCustomers({ page: 2, limit: 10 }).then((responsePage2) => {
                expect(responsePage2.status).to.equal(200);
                expect(responsePage2.body.customers).to.be.an('array').with.lengthOf.at.most(10);
                expect(responsePage2.body.pageInfo.currentPage).to.equal(2);

            });
        });

        it('GET /customers - correctly filters by customer limit', () => {
            const limit = 15; //Maximum number of customers to be returned

            cy.apiGetCustomers({ limit }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.customers).to.be.an('array');

                expect(response.body.customers.length).to.be.at.most(limit);
                expect(response.body.pageInfo).to.have.all.keys('currentPage', 'totalPages', 'totalCustomers');

                cy.log(`Customer limit validation successful: returned ${response.body.customers.length} customers`);
            });
        });

        it('GET /customers - filter by company size', () => {
            const size = 'Very Large Enterprise'; // Small, Medium, Enterprise, Large Enterprise, Very Large Enterprise

            cy.apiGetCustomers({ size }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.customers).to.be.an('array').not.to.be.empty;

                response.body.customers.forEach(customer => {
                    expect(customer.size).to.equal(size);
                });

                cy.log(`Company size filter validation successful for "${size}"`);
            });
        });

        it('GET /customers - filter by industry', () => {
            const industry = 'Technology'; // Logistics, Retail, Technology, HR, Finance

            cy.apiGetCustomers({ industry }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.customers).to.be.an('array').not.to.be.empty;

                response.body.customers.forEach(customer => {
                    expect(customer.industry).to.equal(industry);
                });

                cy.log(`Industry filter validation successful for "${industry}"`);
            });
        });

        it('GET /customers - filter by customer name', () => {
            const customerName = 'Littel Co';

            cy.apiGetCustomers({ name: customerName }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.customers).to.be.an('array').not.to.be.empty;

                // Ensure at least one customer contains the searched name
                // The `some` method checks if at least one element in the array satisfies the condition
                const found = response.body.customers.some(customer => customer.name.includes(customerName));
                expect(found).to.be.true;

                cy.log(`Filter by customer name "${customerName}" validated successfully`);
            });

        });

        it('GET /customers - filter by customer email', () => {
            // TODO: Open issue - The email search is currently case-sensitive and should be updated to be case-insensitive
            const customerEmail = 'Selena.Gleichner7@gmail.com';

            cy.apiGetCustomers({ name: customerEmail }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.customers).to.be.an('array').not.to.be.empty;

                // Ensure at least one customer contains the searched email
                // The `some` method checks if at least one element in the array satisfies the condition
                const found = response.body.customers.some(customer => customer.contactInfo?.email === customerEmail);
                expect(found).to.be.true;

                cy.log(`Filter by customer email "${customerEmail}" validated successfully`);
            });

        });

    });

    context('Invalid requests', () => {

        it('rejects request with invalid (negative) page value', () => {
            cy.apiGetCustomers({
                page: -1,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (negative) limit value', () => {
            cy.apiGetCustomers({
                limit: -1,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (string) page value', () => {
            cy.apiGetCustomers({
                page: 'namepage',
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (boolean) limit value', () => {
            cy.apiGetCustomers({
                limit: true,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid size value', () => {
            const mensage = 'Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.'
            cy.apiGetCustomers({
                size: 'small',
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(mensage);
            });
        });

        it('rejects request with invalid (boolean) limit value', () => {
            const mensage = 'Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.'
            cy.apiGetCustomers({
                industry: 'QA',
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq(mensage);
            });
        });


        it('rejects request with invalid (zero) page value', () => {
            cy.apiGetCustomers({
                page: -1,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });

        it('rejects request with invalid (zero) limit value', () => {
            cy.apiGetCustomers({
                limit: -1,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.error).to.eq('Invalid page or limit. Both must be positive numbers.');
            });
        });
    });
});