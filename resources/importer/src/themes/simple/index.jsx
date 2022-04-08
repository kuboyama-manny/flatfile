import './dev.html'
import './index.html'

import Penpal from 'penpal'
import { h, render } from 'preact' // eslint-disable-line no-unused-vars

import App from 'scenes/app'

if (window.location.search.indexOf('?key=') === 0 && !window.FF_LICENSE_KEY) {
  window.FF_LICENSE_KEY = window.location.search.split('=')[1]
}

let refs = {}
window.addEventListener('load', () => {
  window.$app = render(
    <div class='flatfile-root'>
      <App handshake={handshake.promise} features={window.FF_FEATURES} ref={(node) => { refs.App = node }} />
    </div>,
    document.body
  )
})

Penpal.debug = false

const handshake = Penpal.connectToParent({
  methods: {
    open (batchConfig) {
      refs.App.open(batchConfig)
    },
    close () {
      refs.App.close()
    },
    displayLoader () {
      refs.App.displayLoader()
    },
    displaySuccess (msg) {
      refs.App.displaySuccess(msg)
    },
    displayError (error) {
      refs.App.displayError(error)
    },
    getMeta () {
      return refs.App.state.importMeta
    },
    setUser (endUser) {
      refs.App.setUser(endUser)
    }
  }
})
