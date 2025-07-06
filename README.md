# Pup Timers 🐕

[![codecov](https://codecov.io/github/Tyriol/pup-timer/graph/badge.svg?token=L7YH74KHNV)](https://codecov.io/github/Tyriol/pup-timer)

Do you own a dog? Do you ever find yourself wondering "When did I last let him out?" or "Is he due his tick and flea tablet?"?

Maybe you don't...but I do...all the time. And I even consider myself a pretty good dog dad.

And so I'm creating this app, to be able to hit a button and reset a timer when I let him out for a wee. Or reset a countdown when I give him a tablet, or take him for a check-up.

## Getting started:

Getting started with this app is simple!

Clone the repo down from

```
https://github.com/Tyriol/pup-timer.git
```

Now you have a few options. You can either:

```
npm install
npm run dev
```

This will start up a regular Vite app on port `5173`

Or if you've got Docker installed you can build and run containers as I've set up the code to allow this.

The easiest way is to use the following command:

```
docker compose up -d
```

🐋 You can then access the app on port `3000` 🐋

The -d flag will run this in detached mode, so you can continue using the terminal window.

The container is setup to allow for hot reloading so you don't have to build a new image to see your changes.

## Dev Workflow

### Local

- Create an issue in Github issues for new work.
- Create a new branch linked to that issue and check it out locally.
- Use Docker with `docker compose up -d` for containerized development.
- Hot reloading is enabled for both local and Docker workflows.
- On commit Husky will trigger and run automated linting, formatting and unit testing, preventing the commit if any of those checks fail.
- Create a PR which gets reviewed by copilot.
- A CI workflow will be triggered. This checks:
  - Linting.
  - Formatting.
  - Unit testing via Vitest.
    - This also uploads test coverage to CodeCov.
  - E2E testing via Cypress.
- Merge work into the main branch once all checks have completed and any review feedback has been addressed.
- CI will be triggered to build and upload a new Docker image to Docker Hub.

### Testing

If you would like to run tests while working on a piece rather than needing to commit or have the CI do it on PR, you can run the following scripts:

```
npm run test:unit
```

This will run all unit tests using Vitest and React testing library

```
npm run test:e2e

or

npm run test:e2e:open
```

These commands will run the Cypress end-to-end tests. The second command will open the Cypress UI so you can run them that way rather than in the CLI

```
npm run test:coverage
```

This will generate coverage reports, however I'd recommend leaving this to the CI workflow as it's best integrated with CodeCov

## Features

### Current

- None as I'm busy setting up the dev environment, testing and CI/CD

### Planned

- Ability to download and install app, and use offline.
- Ability to add a countup timer for dog activities like toilet breaks.
- Ability to add countdown timers for activities like nail cuts

### Future

- Add additional dogs
- Push notifications for specific timers

## License

I'm not currently offering a license as I want to work on this on my own, but this may change in the future
