describe("SignUp", () => {
  it("tests SignUp", () => {
    cy.viewport(1208, 869);
    cy.visit("http://localhost:3000/");
    cy.get("a:nth-of-type(6) > button").click();
    cy.get("#email").type("example1@example.com");
    cy.get("#password").type("example1");
    cy.get("#name").click();
    cy.get("#name").type("example2");
    cy.get("#email").click();
    cy.get("#email").type("example2@example.com");
    cy.get("#root > div > div").click();
    cy.get("#password").type("example2");
    cy.get("#root > div > div button").click();
  });
});
//# recorderSourceMap=BCBDBEBFBGBHBIBJBKBLBMBNB
