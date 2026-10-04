describe("Mobile timer workflow", () => {
  it("creates and edits a timer without horizontal overflow", () => {
    cy.viewport(320, 640);
    cy.visit("/");
    cy.contains("button", "Add timer").click();
    cy.get('input[name="timerName"]').type("Evening walk");
    cy.contains("button", "Create timer").click();
    cy.contains("h3", "Evening walk")
      .closest("article")
      .within(() => {
        cy.contains("Ready");
        cy.contains("button", "Edit").click();
      });
    cy.contains("button", "Add timer").should("not.exist");
    cy.contains("button", "Cancel").click();
    cy.get("html").invoke("prop", "scrollWidth").should("be.lte", 320);
  });
});
