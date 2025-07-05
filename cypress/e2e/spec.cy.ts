describe("My First Test", () => {
  it("Gets, types and asserts", () => {
    cy.visit("http://localhost:5173");

    cy.contains("Pup Timers!");
  });
});
