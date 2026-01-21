/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("phoneNumberRequestLimit", () => {
  cy.get("[data-cy=phoneNumber]").clear().type("010-1234-5678");
  cy.intercept("POST", "**/accounts/send-auth-code", {
    statusCode: 400,
  });
  cy.get("[data-cy=phoneNumber-btn]:visible").click();
});

Cypress.Commands.add("visitDev", (path: string) => {
  const baseURL = "http://localhost:5173";

  if (path === "signup") {
    cy.visit(`${baseURL}/signup`);
  } else if (path === "login") {
    cy.visit(`${baseURL}/login`);
  }
  cy.get("#root").should("not.be.empty");
});

Cypress.Commands.add("signupForm", () => {
  cy.get("[data-cy=email]").type("test@test.com");
  cy.get("[data-cy=phoneNumber]").type("010-1234-1234");
  cy.get("[data-cy=phoneNumber-btn]:visible").click();
  cy.get("[data-cy=authCode]").type("123123");
  cy.get("[data-cy=authCode-btn]:visible").click();
  cy.get("[data-cy=password]").type("asdf123!");
  cy.get("[data-cy=passwordConfirm]").type("asdf123!");
  cy.get("[data-cy=agreeToTerms]").click();
  cy.get("[data-cy=signup-btn]:visible").click();
});

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      signupForm(): Chainable<void>;
      phoneNumberRequestLimit(): Chainable<void>;
      visitDev(type: string): Chainable<void>;
      waitUntilNetworkIdle(timeout: number): Chainable<void>;
    }
  }
}
