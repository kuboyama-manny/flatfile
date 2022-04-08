# FlatFilers Packages

A Preact and webpack-based multiple build target system.

### Prerequisites:

- Node v8.x.x: see https://nodejs.org/dist/v8.5.0/ etc.
- Yarn (On Mac OS X: `brew install yarn` or look up online how to install for your system)
- NVM (On Mac OS X: `brew install nvm` or look up online how to install for your system)

### Setup:

- `nvm use 8; yarn`

### Development:

Environment variables are read from `.env` in the root directory. If that file does not exist, it will be automatically created the first time you run the following command:

- `nvm use 8; yarn start`
- visit http://localhost:2000/theme:simple/ to see the results

Uses webpack-dev-server (will not create build artifacts)

### Production build:

- `ENV=dev LANGUAGE=en yarn build` (see output in `dist` folder)

### Environments list:

- `dev` currently the only environment - as the app grows we can add more

### Packages:

- `config/*` - contains environment configuration files
- `dist/*` - destination for the builds for each theme
- `documentation` - contains developer documentation
- `elements` - contains pure UI-only elements (themeable per theme)
- `language/*` - contains all language strings for each supported language
- `logic` - contains all generic application logic (not theme or page-specific)
- `node_modules` - contains yarn dependencies
- `scenes` - contains all scenes (a scene is a standalone page or app)
- `styles` - global scss definitions
- `themes/*` - a listing of all themes with theme-specific code

### Documentation:

- TODO: link to documentation here
