describe("My First Test", () => {
  it("Gets, types and asserts", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Pup Timers!");
  });
});
