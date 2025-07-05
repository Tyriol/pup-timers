describe("My First Test", () => {
  it("Gets, types and asserts", () => {
    cy.visit("/");

    cy.contains("Pup Timers!");
  });
});
