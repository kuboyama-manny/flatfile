const { OAUTH_LOGIN_URL } = APP_CONFIG

import Storage from 'logic/storage'

const accessTokenStorage = new Storage('authentication:accessToken')
const destinationUri = new Storage('authentication:destinationUri')

class Authentication {
  constructor() {
    this.refresh()
    this.onInvalidateAccessTokenCallbacks = []
  }

  refresh() {
    if (accessTokenStorage.exists()) {
      this.accessToken = accessTokenStorage.get()
      this.isAuthenticated = true
    }
    else {
      this.isAuthenticated = false
    }
  }

  onInvalidateAccessToken(callback) {
    this.onInvalidateAccessTokenCallbacks.push(callback)
  }

  invalidateAccessToken() {
    accessTokenStorage.clear()
    this.refresh()
    this.onInvalidateAccessTokenCallbacks.forEach(callback => callback())
  }

  get authenticatedRoute() {
    return (authenticatedContents, unauthenticatedContents=() => null) => props => {
      if (this.isAuthenticated) {
        return authenticatedContents(props)
      }
      else {
        return this.redirectToLogin(props, unauthenticatedContents())
      }
    }
  }

  get redirectToLogin() {
    return ({ history, location: { pathname } }, redirectContents=null) => {
      destinationUri.set(pathname)
      window.location.assign(OAUTH_LOGIN_URL)
      return redirectContents
    }
  }

  get loginCallback() {
    return ({ history, location: { hash } }) => {
      const hashParams = {}
      hash.replace(/^#/, '').split('&').forEach(param => {
        const [ key, value ] = param.split('=').map(decodeURIComponent)
        hashParams[key] = value
      })

      if (hashParams.access_token) {
        accessTokenStorage.set(hashParams.access_token)
        this.refresh()
        if (destinationUri.exists()) {
          history.push(destinationUri.get())
        }
        else {
          history.push('/')
        }
      }

      else {
        history.push(OAUTH_LOGIN_URL)
      }

      return null
    }
  }
}

export default new Authentication
