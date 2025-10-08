describe('Teste banner cookie', () => {

  it('rejeita o cookies', () => {
    const label = 'Decline'

    cy.bannerCookies(label)
  });

  it('Aceita o cookies', () => {
    const label = 'Accept'

    cy.bannerCookies(label)
  });

})

describe('teste EngageSphere', () => {

  beforeEach(() => {
    cy.bannerCookies('Accept')
    cy.visit('/');
  });

  it('cicla por todos os tamanhos', () => {
    const sizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'];
    const testId = 'size-filter'

    cy.wrap(sizes).each((size) => {
      cy.waitForTableReady();
      cy.selectCompanySize(size);
      cy.waitForFilter(testId, size);
      cy.validateFilter(size);
    });
  });

  it('cicla por todos as indutrias', () => {
    const industrys = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance']
    const testId = 'industry-filter'

    cy.wrap(industrys).each((industry) => {
      cy.waitForTableReady();
      cy.selectIndustry(industry);
      cy.waitForFilter(testId, industry);
      cy.validateFilter(industry);
    });
  });

  it('testa a persistencia do Filtro', () => {
    const label = 'Small'
    const testId = 'size-filter'
    const companyName = 'Jacobs Co'

    cy.waitForTableReady();
    cy.selectCompanySize(label);
    cy.waitForFilter(testId, label);
    cy.validateFilter(label);

    cy.seeDetails(companyName);
    cy.contains('button', /back/i).click();

    cy.validateFilter(label)
  });

  it('Mensagem de nenhum cliente disponivel e valida campo nome desabilitado', () => {
    const sizelabel = 'Small'
    const industry = 'HR'

    cy.waitForTableReady();
    cy.selectCompanySize(sizelabel);
    cy.selectIndustry(industry);

    cy.get('[data-testid="name"]').should('be.disabled');

    cy.get('[data-testid="table"]')
      .within(() => {
        cy.contains(/no customers available/i).should('be.visible');
      })
  });

  it('Bug campo desabilitado após filtrar por um resultado vazio', () => {
    const sizelabel = 'Small'
    const industry = 'HR'
    const noFilter = 'All'

    cy.waitForTableReady();
    cy.selectCompanySize(sizelabel);
    cy.selectIndustry(industry);

    cy.get('[data-testid="name"]').should('be.disabled');

    cy.selectCompanySize(noFilter);
    cy.selectIndustry(noFilter);

    cy.get('[data-testid="name"]').should('be.disabled');
  });

  it('valida o loading', () => {
    cy.get('[data-testid="table"]').should('be.visible');
    cy.get('#loading').should('be.visible');
    cy.get('#loading').should('not.exist');
  });

  it('Exibe detalhes de um cliente', () => {
    const companyName = 'Lowe Co'

    cy.waitForTableReady();
    cy.seeDetails(companyName);
    cy.contains('h2', /customer details/i).should('be.visible');
  });

  it('valida informação quando não tem contato', () => {
    const companyName = 'Lowe Co'

    cy.waitForTableReady();
    cy.seeDetails(companyName);
    cy.contains('p', /no contact info available/i).should('be.visible');
  });

  it('exibe e esconde o endereço do cliente', () => {
    const companyName = 'Littel Co'

    cy.waitForTableReady();
    cy.seeDetails(companyName);

    cy.contains('button', /show address/i).click();
    cy.contains('h3', /address/i).should('be.visible');

    cy.contains('button', /hide address/i).click();
    cy.contains('button', /show address/i).should('be.visible');
  });

  it('valida informação quando não tem contato', () => {
    const label = 'Medium'
    const testId = 'size-filter'
    const companyName = 'Doyle, Kertzmann and Schultz'

    cy.waitForTableReady();
    cy.selectCompanySize(label);
    cy.waitForFilter(testId, label);

    cy.contains('button', /next/i).click();

    cy.seeDetails(companyName);
    cy.contains('button', /show address/i).click();
    cy.contains('p', /no address available/i).should('be.visible');
  });

  it('faz download do arquivo CSV', () => {
    const file = `${Cypress.config('downloadsFolder')}/customers.csv`;

    cy.waitForTableReady();
    cy.contains('button', /download CSV/i).click();

    cy.readFile(file, 'utf8', { timeout: 15000 })
    .should('be.a', 'string');
  });
});
