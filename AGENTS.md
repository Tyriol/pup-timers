# AGENTS.md

## Purpose

This repository is maintained by a software engineer who is actively
developing deeper skills in TypeScript, React, testing, accessibility,
security, and software design.

The goal is not simply to produce working code. Changes should remain
understandable, maintainable, and educational.

## Working style

Before making a non-trivial change:

1. Inspect the existing implementation.
2. Identify the relevant files and existing patterns.
3. Explain the proposed approach briefly.
4. Prefer the smallest reasonable change.
5. Avoid unrelated refactoring.

When the task is ambiguous, investigate the repository before assuming
how it works.

## Architecture

Follow existing architectural patterns unless there is a strong reason
not to.

Do not introduce:

- new architectural layers
- abstractions
- state-management libraries
- dependencies

unless they solve a concrete problem.

Prefer boring, explicit code over clever abstractions.

## TypeScript

- Use strict TypeScript.
- Avoid `any`.
- Avoid unnecessary type assertions.
- Prefer domain-specific types where they improve clarity.
- Prefer inference when the inferred type is clear.
- Do not create complex generic abstractions without justification.

## React

- Prefer small focused components.
- Separate domain logic from presentation where useful.
- Avoid unnecessary effects.
- Avoid duplicated state.
- Prefer derived state over synchronized state.
- Follow the existing project's state-management approach.

## Accessibility

For UI changes:

- Use semantic HTML.
- Ensure keyboard accessibility.
- Ensure interactive elements have accessible names.
- Consider focus behaviour.
- Check form labels and validation.
- Do not use ARIA where native HTML already provides the correct semantics.

## Testing

Tests should protect behaviour rather than implementation details.

For new behaviour:

- add appropriate tests
- test meaningful edge cases
- prefer user-visible behaviour
- avoid brittle tests

Do not chase coverage numbers for their own sake.

## Security

When relevant, consider:

- input validation
- authentication
- authorisation
- XSS
- CSRF
- secrets
- insecure client-side assumptions
- API boundaries
- dependency risks

Do not expose secrets or credentials.

## Dependencies

Do not add dependencies if the problem can reasonably be solved using
the existing stack or platform APIs.

If a dependency is justified, explain why.

## Validation

Before declaring a task complete:

1. Run relevant tests.
2. Run type checking.
3. Run linting.
4. Run the build when appropriate.
5. Inspect the final git diff.
6. Check for accidental unrelated changes.

Report any checks that could not be run.

## Code review

When asked to review code:

- do not modify files unless explicitly requested
- prioritise correctness over style
- distinguish actual problems from optional improvements
- rank findings by severity
- explain why each issue matters

Do not invent problems merely to produce review feedback.

## Learning

For non-obvious design decisions, explain the reasoning.

If there are multiple reasonable approaches, briefly describe the
trade-off instead of pretending there is one objectively correct answer.
