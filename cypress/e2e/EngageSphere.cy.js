describe("EngageSphere Without Cookies", () => {
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
    // Assert
    cy.contains("footer", "Copyright 2025 - Talking About Testing").should("be.visible");

    cy.contains("footer a", "Blog")
      .should("be.visible")
      .and("have.attr", "href", "https://talkingabouttesting.com");

    cy.contains("footer a", "Courses")
      .should("be.visible")
      .and("have.attr", "href", "https://talking-about-testing.vercel.app/");

    cy.contains("footer a", "Podcast")
      .should("be.visible")
      .and("have.attr", "href", "https://open.spotify.com/show/5HFlqWkk6qtgJquUixyuKo");

    cy.contains("footer a", "YouTube")
      .should("be.visible")
      .and("have.attr", "href", "https://youtube.com/@talkingabouttesting");
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

  it("It renders the header with a heading, theme's toggle, and a text input field", () => {
    // Assert
    cy.get("[class^='Header_container']").should("be.visible").and("contain.text", "EngageSphere");
    cy.get("[class^='Header_container'] button")
      .should("be.visible")
      .and("have.attr", "aria-label", "theme light activated");
    cy.get("[class^='Header_container'] input")
      .should("be.visible")
      .and("have.attr", "placeholder", "E.g., John Doe");
  });

  it("It opens and closes the messenger", () => {
    // Assert
    cy.get("button[aria-label='Open messenger']").should("be.visible");
    cy.get("[class^='Messenger_box']").should("not.exist");

    // Act
    cy.get("button[aria-label='Open messenger']").click();

    // Assert
    cy.get("button[aria-label='Close messenger']").should("be.visible");
    cy.get("[class^='Messenger_box']").should("be.visible");

    cy.get("[class^='Messenger_header']")
      .should("be.visible")
      .and("contain.text", "How can we help you?");

    cy.get("#messenger-name")
      .should("be.visible")
      .and("have.attr", "placeholder", "Type your name here");

    cy.get("#email").should("be.visible").and("have.attr", "placeholder", "Type your email here");

    cy.get("#message")
      .should("be.visible")
      .and("have.attr", "placeholder", "Type your message here");

    cy.get("[class^='Messenger_box'] button").should("be.visible").and("contain.text", "Send");

    // Act
    cy.get("button[aria-label='Close messenger']").click();

    // Assert
    cy.get("button[aria-label='Open messenger']").should("be.visible");
    cy.get("[class^='Messenger_box']").should("not.exist");
  });

  it("It makes sure all messenger's fields are mandatory and the first one is focused", () => {
    // Arrange
    cy.get("button[aria-label='Open messenger']").click();

    // Assert
    cy.get("#messenger-name").should("be.focused");

    // Act
    cy.get("[class^='Messenger_box'] button").click();

    // Assert
    cy.get("[class^='Messenger_box']").should("be.visible");

    // Act
    cy.get("#messenger-name").type("John Doe");
    cy.get("[class^='Messenger_box'] button").click();

    // Assert
    cy.get("[class^='Messenger_box']").should("be.visible");

    // Act
    cy.get("#email").type("johnnydoe1990@hotmail.com");
    cy.get("[class^='Messenger_box'] button").click();

    // Assert
    cy.get("[class^='Messenger_box']").should("be.visible");

    // Act
    cy.get("#message").type("This is a serious and important message!");
    cy.get("[class^='Messenger_box'] button").click();
  });

  it("It shows and hides a success message when successfully submitting the messenger form", () => {
    // Arrange
    cy.get("button[aria-label='Open messenger']").click();
    cy.get("#messenger-name").type("John Doe");
    cy.get("#email").type("johnnydoe1990@hotmail.com");
    cy.get("#message").type("This is a serious and important message!");

    // Act
    cy.get("[class^='Messenger_box'] button").click();

    // Assert
    cy.get("[class^='Messenger_success']")
      .should("be.visible")
      .and("contain.text", "Your message has been sent.");

    cy.get("[class^='Messenger_success']").should("not.exist");
  });

  it("It clears all the messenger's form fields when filling them, closing the messenger, and opening it again", () => {
    // Arrange
    cy.get("button[aria-label='Open messenger']").click();

    // Act
    cy.get("#messenger-name").type("John Doe");
    cy.get("#email").type("johnnydoe1990@hotmail.com");
    cy.get("#message").type("This is a serious and important message!");
    cy.get("button[aria-label='Close messenger']").click();
    cy.get("button[aria-label='Open messenger']").click();

    // Assert
    cy.get("#messenger-name").should("have.value", "");
    cy.get("#email").should("have.value", "");
    cy.get("#message").should("have.value", "");
  });
});

describe("EngageSphere With Cookies", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("It shows the cookie banner on first visit", () => {
    // Assert
    cy.get('[class^="CookieConsent_banner"]').should("be.visible");
    cy.contains("button", "Accept").should("be.visible");
    cy.contains("button", "Decline").should("be.visible");
  });

  it("It accepts the cookies banner on first visit", () => {
    // Arrange
    cy.get('[class^="CookieConsent_banner"]').should("be.visible");

    // Act
    cy.contains("button", "Accept").click();

    // Assert
    cy.get('[class^="CookieConsent_banner"]').should("not.exist");
    cy.getCookie("cookieConsent").should("have.property", "value", "accepted");
  });

  it("It declines the cookies banner on first visit", () => {
    // Arrange
    cy.get('[class^="CookieConsent_banner"]').should("be.visible");

    // Act
    cy.contains("button", "Decline").click();

    // Assert
    cy.get('[class^="CookieConsent_banner"]').should("not.exist");
    cy.getCookie("cookieConsent").should("have.property", "value", "declined");
  });
});

describe("Messenger in Mobile Viewport", () => {
  beforeEach(() => {
    cy.setCookie("cookieConsent", "accepted");
    cy.visit("/");
    cy.viewport("iphone-x");
  });

  it("It shows the Company name and Action columns and hides the ID, Industry, Number of Employees, and Size columns in a mobile viewport", () => {
    // Arrange
    // Act

    // Assert
    cy.contains("th", "Company name").should("be.visible");
    cy.contains("th", "Action").should("be.visible");

    cy.contains("th", "ID").should("not.be.visible");
    cy.contains("th", "Industry").should("not.be.visible");
    cy.contains("th", "Number of employees ").should("not.be.visible");
    cy.contains("th", "Size ").should("not.be.visible");
  });
});

describe("EngageSphere API test", () => {
  beforeEach(() => {});

  it("It returns the correct status and body structure", () => {
    // Act
    cy.request({
      method: "GET",
      url: "http://localhost:3001/customers",
      qs: {
        page: 1,
        limit: 10,
        size: "Very Large Enterprise",
        industry: "Technology",
      },
    }).then((response) => {
      // Assert
      expect(response.status).to.eq(200);

      const customers = response.body.customers;

      expect(customers).to.be.an("array");

      customers.forEach((customer) => {
        expect(customer).to.be.an("object");
        expect(customer).to.include.keys("id", "name", "employees", "size", "industry", "address");

        expect(customer.id).to.be.a("number");
        expect(customer.name).to.be.a("string");
        expect(customer.employees).to.be.a("number");
        expect(customer.size).to.be.a("string");
        expect(customer.industry).to.be.a("string");

        if (customer.contactInfo !== null) {
          expect(customer.address).to.be.an("object");
          expect(customer.contactInfo).to.include.keys("name", "email");

          expect(customer.contactInfo.name).to.be.a("string");
          expect(customer.contactInfo.email).to.be.a("string");
        } else {
          expect(customer.contactInfo).to.be.null;
        }

        if (customer.address !== null) {
          expect(customer.address).to.be.an("object");
          expect(customer.address).to.include.keys("street", "city", "state", "zipCode", "country");

          expect(customer.address.street).to.be.a("string");
          expect(customer.address.city).to.be.a("string");
          expect(customer.address.state).to.be.a("string");
          expect(customer.address.zipCode).to.be.a("string");
          expect(customer.address.country).to.be.a("string");
        } else {
          expect(customer.address).to.be.null;
        }
      });
    });
  });
});
