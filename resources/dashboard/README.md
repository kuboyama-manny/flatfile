# Flatfile Dashboard

Uses ReactSymbols components, see documentation at http://docs.reactsymbols.com

# Actions/Reducers

This project uses `react-redux` and offers combined actions & reducers to cut down on verbosity. See `src/scenes/billing/actions.js` for a complex example.

# Adding a Page

1. Create the following:
```
   src/scenes/<pagename>/
     - actions.js
     - index.jsx
     - styles.scss
```
2. Add your page to `src/scenes/app/router.jsx`
