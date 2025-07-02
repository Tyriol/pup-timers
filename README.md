# Pup Timers 🐕

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

### Current

- Create a branch for new work
- Use Docker with `docker compose up -d` for containerized development
- Hot reloading is enabled for both local and Docker workflows
- Manually lint and check formatting
- Create a PR which get's reviewed by copilot
- Merge work into main

### Planned

- Automated linting and formatting (ESLint, Prettier)
- CI/CD pipeline with GitHub Actions
- Automated unit and integration tests (Vitest, Testing Library)
- End-to-end tests (Cypress)

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

## Licence

I'm not currently offering a licence as I want to work on this on my own, but this may change in the future
