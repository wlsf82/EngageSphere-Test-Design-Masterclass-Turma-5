describe("EngageSphere", () => {
  beforeEach(() => cy.visit("http://localhost:3000/"));
  beforeEach(() => cy.contains("button", "Accept").click());

  it("It goes back to the customers list when clicking the 'Back' button *", () => {
    // Act
    cy.get('button[aria-label*="View company:"]').first().click();
    cy.contains("button", "Back").click();

    // Assert
    cy.get('select[data-testid="size-filter"]').should("be.visible");
    cy.get('select[data-testid="industry-filter"]').should("be.visible");
    cy.get('[data-testid="table"]').should("be.visible");
  });

  it("It keeps the filters when coming back from the customer details view *", () => {
    // Arrange
    cy.get('select[data-testid="size-filter"]').select("Large Enterprise");
    cy.get('select[data-testid="industry-filter"]').select("HR");

    // Act
    cy.get('button[aria-label*="View company:"]').first().click();
    cy.contains("button", "Back").click();

    // Assert
    cy.get('option[value="Large Enterprise"]')
      .should("be.visible")
      .and("be.selected");
    cy.get('option[value="HR"]').should("be.visible").and("be.selected");
  });
});
