import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import 'whatwg-fetch'
import 'reactsymbols-kit/ReactSymbolsKit.css'

import store from './store'
import App from 'scenes/app'

import './styles/uikit.scss'
import './styles/main.scss'

window.addEventListener('load', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app-container')
  )
})
