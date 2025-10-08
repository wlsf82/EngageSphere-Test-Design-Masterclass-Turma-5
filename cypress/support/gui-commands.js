Cypress.Commands.add('injectAxe', () => {
  cy.window({ log: false }).then(win => {
    if (win.axe) {
      return;
    }
    return cy.request({ url: 'https://unpkg.com/axe-core@latest/axe.min.js', log: false })
      .then(resp => {
        win.eval(resp.body);
      });
  });
});

Cypress.Commands.add('configureAxe', (options) => {
  cy.window({ log: false }).then(win => {
    if (win.axe) {
      win.axe.configure(options);
    } else {
      Cypress.log({
        name: 'configureAxe',
        message: 'axe-core not injected, cannot configure.',
        consoleProps: () => ({
          'axe-core status': 'not available'
        })
      });
    }
  });
});