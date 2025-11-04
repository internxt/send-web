# Internxt Send

A secure, privacy-focused file sharing web app built with React, TypeScript, and Vite.\
This document describes how to set up and run the development environment.

# Getting Started

## Installation

- Create a `.npmrc` file by copying the `.npmrc.template` provided in the repo.
- Fill the `.env` file using `.env.template`.
- Use `yarn` to install project dependencies.

## Scripts

### `yarn run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn run start`

Serves the built application locally to preview the production output.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- Useful for testing the result of a production build.
- No hot reloading or development tools included.

> The preview command serves the latest build output, so if you haven't run build beforehand, it will either fail or serve outdated files.

### `yarn run lint`

- Runs eslint linter

### `yarn test`

- Runs unit tests with [Vitest](https://vitest.dev/)

### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, obfuscated, and the filenames include the hashes.\
Your app is ready to be deployed!


## Configuring TailwindCSS Purge

It is important to add in the tailwind.config.js file, within the purge property, the list of classes that we are overriding within a Tailwind layer (components, utilities or base) for third-party packages (such as react-bootstrap)

For example, with this snippet we are telling to purge that we are overriding the react-bootstrap Dropdown and Tabs classes:

```javascript
  purge: {
    content: ["./src/**/*.tsx"],
    options: {
      safelist: [
        'dropdown-menu', 'dropdown-item',
        'nav-item', 'nav-link', 'tab-content', 'tab-pane'
      ]
    }
  }
```

## Recommended VSCode Extensions

To speed up the development and maintenance of the project, it is recommended to use the following extensions for the IDE:

- Better Comments
- ESLint
- Stylelint
- PostCSS Language Support
- SCSS Formatter
- Tailwind CSS IntelliSense
- GitLens
