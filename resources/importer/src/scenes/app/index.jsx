import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import 'whatwg-fetch'
import config from 'config' // eslint-disable-line no-unused-vars
import { updateBatchLog } from './lib/functions'
import Settings from './lib/settings'
import { CloseButton } from './lib/elements'
import UploadWrapper from './stages/upload/uploadWrapper'
import './lib/polyfills'

import 'theme/styles/index.scss'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.handshake = props.handshake
    this.loadSettings = this.loadSettings.bind(this)
    this.asyncSetState = this.asyncSetState.bind(this)
    this.returnUUID = this.returnUUID.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.displayLoader = this.displayLoader.bind(this)
    this.displaySuccess = this.displaySuccess.bind(this)
    this.displayError = this.displayError.bind(this)
    this.updateMeta = this.updateMeta.bind(this)
    this.features = props.features
    this.state = {
      importMeta: {},
      settings: false,
      uuid: false,
      isOpen: false,
      modalLoaderIsOpen: false,
      modalErrorIsOpen: false,
      modalSuccessIsOpen: false,
      modalErrorContent: '',
      settingErrors: []
    }
  }

  componentDidMount () {
    this.handshake.then(parent => {
      parent.ready().then((settings) => {
        this.loadSettings({detail: settings})
      })
    })
  }

  loadSettings (event) {
    const s = new Settings(event.detail)
    if (s.validate()) {
      this.updateMeta({ config: s.settings })
      this.setState({ settings: {...s.settings, features: this.features} })
    } else {
      console.log('Settings are invalid:', s.errors)
      this.setState({ settingErrors: s.errors })
    }
  }

  updateMeta (newMeta) {
    const importMeta = {...this.state.importMeta, ...newMeta}
    this.setState({ importMeta })
    return importMeta
  }

  asyncSetState (newState) {
    this.setState(newState)
  }

  returnUUID () {
    return new Promise((resolve) => {
      let checkUUID = () => {
        if (this.state.uuid) {
          this.updateMeta({ batchID: this.state.uuid })
          return resolve(this.state.uuid)
        }
        setTimeout(checkUUID, 50)
      }
      checkUUID()
    })
  }

  async setUser (endUser) {
    const newEndUser = {}
    newEndUser.email = endUser.email
    newEndUser.name = endUser.name
    newEndUser.user_id = endUser.userId
    newEndUser.company_name = endUser.companyName
    newEndUser.company_id = endUser.companyId
    const { end_user_id: endUserId } = await updateBatchLog(
      this.returnUUID,
      { end_user: newEndUser })
    endUser.id = endUserId
    this.updateMeta({endUser})
  }

  open (batchConfig = {}) {
    this.setState({ isOpen: true, batchConfig })
  }

  close () {
    this.setState({
      importMeta: {},
      isOpen: false,
      modalLoaderIsOpen: false,
      modalErrorIsOpen: false,
      modalSuccessIsOpen: false,
      modalErrorContent: ''
    })
    if (this.refs.uploadWrapper && this.refs.uploadWrapper.refs.stager) {
      this.refs.uploadWrapper.refs.stager.clearData()
    }
    this.handshake.then(parent => {
      parent.close()
    })
  }

  displayLoader () {
    this.setState({ modalLoaderIsOpen: true })
  }

  displaySuccess (msg = 'Success!') {
    const handledAt = new Date().toISOString()
    updateBatchLog(
      this.returnUUID,
      { handled_at: handledAt })
    this.updateMeta({handledAt})
    this.setState({ modalSuccessIsOpen: true, successMessage: msg, modalLoaderIsOpen: false })
  }

  displayError (error) {
    const failedAt = new Date().toISOString()
    updateBatchLog(
      this.returnUUID,
      { failed_at: failedAt, failure_reason: error })
    this.updateMeta({status: 'failure', failedAt})
    this.setState({ modalErrorIsOpen: true, modalErrorContent: error, modalLoaderIsOpen: false })
  }

  render () {
    if (this.state.settings && this.state.isOpen) {
      return (<UploadWrapper
        ref={(node) => { this.refs.uploadWrapper = node }}
        handshake={this.handshake}
        returnUUID={this.returnUUID}
        asyncSetState={this.asyncSetState}
        settings={this.state.settings}
        close={this.close}
        batchConfig={this.state.batchConfig}
        updateMeta={this.updateMeta}
        modalLoaderIsOpen={this.state.modalLoaderIsOpen}
        modalSuccessIsOpen={this.state.modalSuccessIsOpen}
        successMessage={this.state.successMessage}
        modalErrorIsOpen={this.state.modalErrorIsOpen}
        modalErrorContent={this.state.modalErrorContent}
        />)
    } else if (this.state.settings) {
      return (
        <div class='presettings-default'>
          <span class='loading-indicator'>
            <i class='fa fa-spinner fa-pulse fa-3x fa-fw' />
            <h1 class='sr-only'>{'Loading...'}</h1>
          </span>
        </div>
      )
    } else if (this.state.settingErrors.length) {
      const errors = this.state.settingErrors.map((e) => {
        return <li>{e}</li>
      })
      return (
        <div class='presettings-default'>
          <CloseButton onClick={this.close} />
          <div class='config-errors'>
            <h1 class='primary-header'>Your settings are invalid</h1>
            <ul>{errors}</ul>
          </div>
        </div>
      )
    } else {
      return (
        <div class='presettings-default'>
          <span class='loading-indicator'>
            <i class='fa fa-spinner fa-pulse fa-3x fa-fw' />
            <h1 class='sr-only'>{'Loading...'}</h1>
          </span>
        </div>
      )
    }
  }
}
