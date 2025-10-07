describe("EngageSphere", () => {
  beforeEach(() => cy.visit("http://localhost:3000/"));
  beforeEach(() => cy.contains("button", "Accept").click());

  it("It keeps the filters when coming back from the customer details view", () => {
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
