describe("EngageSphere", () => {
  beforeEach(() => {
    cy.setCookie("cookieConsent", "accepted");
    cy.visit("/");
  });

  it("It goes back to the customers list when clicking the 'Back' button", () => {
    // Arrange
    cy.contains("button", "View").click();

    // Act
    cy.contains("button", "Back").click();

    // Assert
    cy.get('select[data-testid="size-filter"]').should("be.visible");
    cy.get('select[data-testid="industry-filter"]').should("be.visible");
    cy.get('[data-testid="table"]').should("be.visible");
  });

  it("It keeps the filters when coming back from the customer details view", () => {
    // Arrange
    cy.get('select[data-testid="size-filter"]').select("Large Enterprise");
    cy.get('select[data-testid="industry-filter"]').select("HR");
    cy.contains("button", "View").click();

    // Act
    cy.contains("button", "Back").click();

    // Assert
    cy.get('option[value="Large Enterprise"]').should("be.visible").and("be.selected");
    cy.get('option[value="HR"]').should("be.visible").and("be.selected");
  });

  it("It renders the footer with the right text and links", () => {
    // Arrange
    const footerContainer = 'footer[class^="Footer_container"]';

    // Assert
    cy.contains(footerContainer, "Copyright 2025 - Talking About Testing").should("be.visible");

    cy.contains(`${footerContainer} a`, "Blog")
      .should("be.visible")
      .and("have.attr", "href", "https://talkingabouttesting.com");

    cy.contains(`${footerContainer} a`, "Courses")
      .should("be.visible")
      .and("have.attr", "href", "https://talking-about-testing.vercel.app/");

    cy.contains(`${footerContainer} a`, "Podcast")
      .should("be.visible")
      .and("have.attr", "href", "https://open.spotify.com/show/5HFlqWkk6qtgJquUixyuKo");

    cy.contains(`${footerContainer} a`, "YouTube")
      .should("be.visible")
      .and("have.attr", "href", "https://youtube.com/@talkingabouttesting");
  });

  it("It shows the cookie banner on first visit", () => {
    // Arrange
    cy.clearCookie("cookieConsent");
    cy.reload();

    // Assert
    cy.get('[class^="CookieConsent_banner"]').should("be.visible");
    cy.contains("button", "Accept").should("be.visible");
    cy.contains("button", "Decline").should("be.visible");
  });

  it("It accepts the cookie banner on first visit", () => {
    // Arrange
    cy.clearCookie("cookieConsent");
    cy.reload();
    cy.get('[class^="CookieConsent_banner"]').should("be.visible");

    // Act
    cy.contains("button", "Accept").click();

    // Assert
    cy.get('[class^="CookieConsent_banner"]').should("not.exist");
  });

  it("It renders the 'Hi there' greeting when no name is provided", () => {
    // Assert
    cy.get('[data-testid="name"]').should("be.empty");
    cy.contains("h2", "Hi there").should("be.visible");
  });

  it("It renders the 'Hi Joe' greeting when name is provided", () => {
    // Act
    cy.get('[data-testid="name"]').type("Joe");

    // Assert
    cy.contains("h2", "Hi Joe").should("be.visible");
  });
});
