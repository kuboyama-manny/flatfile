import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import Dropzone from 'react-dropzone'
import Modal from 'react-modal'
import StagingManager from '..'
import { GenericButton, CloseButton } from '../../lib/elements'

export default class DropAndPop extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.handshake = props.handshake
    this.close = props.close.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.uploadLogUpdate = this.uploadLogUpdate.bind(this)
    this.csvLoad = this.csvLoad.bind(this)
    this.csvUnload = this.csvUnload.bind(this)
    this.openModalRewindVerify = this.openModalRewindVerify.bind(this)
    this.openModal = this.openModal.bind(this)
    this.openVerifyClose = this.openVerifyClose.bind(this)
    this.closeModalRewindVerify = this.closeModalRewindVerify.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.state = {
      accept: props.settings.features.xls && props.settings.managed ? '.csv,.tsv,.xls,.xlsx' : '.csv,.tsv',
      files: [],
      uploadLog: [],
      settings: props.settings,
      modalRewindVerifyIsOpen: false,
      modalIsOpen: false,
      modalContent: '',
      csvLoaded: false,
      dropzoneActive: false,
      successMessage: props.successMessage,
      modalLoaderIsOpen: props.modalLoaderIsOpen,
      modalErrorIsOpen: props.modalErrorIsOpen,
      modalSuccessIsOpen: props.modalSuccessIsOpen,
      modalErrorContent: props.modalErrorContent,
      modalCloseIsOpen: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.modalLoaderIsOpen !== this.state.modalLoaderIsOpen) {
      this.setState({ modalLoaderIsOpen: nextProps.modalLoaderIsOpen })
    }
    if (nextProps.modalSuccessIsOpen !== this.state.modalSuccessIsOpen) {
      this.setState({ modalSuccessIsOpen: nextProps.modalSuccessIsOpen })
    }
    if (nextProps.modalErrorIsOpen !== this.state.modalErrorIsOpen) {
      this.setState({ modalErrorIsOpen: nextProps.modalErrorIsOpen })
    }
    if (nextProps.modalErrorContent !== this.state.modalErrorContent) {
      this.setState({ modalErrorContent: nextProps.modalErrorContent })
    }
    if (nextProps.successMessage !== this.state.successMessage) {
      this.setState({ successMessage: nextProps.successMessage })
    }
  }

  uploadLogUpdate (clientID, source, status, files = []) {
    const uploadLog = this.state.uploadLog.slice()
    uploadLog.push({clientID, source, status, files})
    this.setState({uploadLog})
  }

  csvLoad () {
    this.setState({files: [], csvLoaded: true})
  }

  csvUnload () {
    this.setState({csvLoaded: false})
  }

  onDragEnter () {
    if (!this.state.csvLoaded) {
      this.setState({
        dropzoneActive: true
      })
    }
  }

  onDragLeave () {
    this.setState({
      dropzoneActive: false
    })
  }

  onDrop (acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length) {
      if (!this.state.csvLoaded) {
        this.uploadLogUpdate(this.state.settings.clientID, 'Drag and Drop', 'Successfully uploaded', acceptedFiles)
        this.setState({
          files: acceptedFiles,
          dropzoneActive: false
        })
      }
    } else if (rejectedFiles.length) {
      this.uploadLogUpdate(this.state.settings.clientID, 'Drag and Drop', 'Rejected due to wrong filetype', rejectedFiles)
      this.setState({ dropzoneActive: false })
      this.openModal(`The filetype was not accepted! Please upload a file with one of the following extensions: ${this.state.accept.replace(/,/g, ', ')}`)
    } else {
      this.setState({ dropzoneActive: false })
      this.openModal('I am confused!')
    }
  }

  openModal (content) {
    this.setState({ modalIsOpen: true, modalContent: content })
  }

  openVerifyClose () {
    if (this.refs.stager.state.activeStage === 1 && this.refs.stager.refs.loader.isInitialTableEmpty()) {
      this.refs.stager.clearData()
      this.close()
    } else {
      this.setState({ modalCloseIsOpen: true })
    }
  }

  closeModal (modal) {
    switch (modal) {
      case 'loader':
        // do nothing
        break
      case 'success':
        this.refs.stager.clearData()
        this.setState({ modalSuccessIsOpen: false })
        this.close()
        break
      case 'error':
        this.setState({ modalErrorIsOpen: false })
        break
      case 'close-cancel':
        this.setState({ modalCloseIsOpen: false })
        break
      case 'close-confirm':
        this.refs.stager.clearData()
        this.setState({ modalCloseIsOpen: false })
        this.close()
        break
      default:
        this.setState({ modalIsOpen: false })
    }
  }

  openModalRewindVerify () {
    this.setState({ modalRewindVerifyIsOpen: true })
  }

  closeModalRewindVerify (verify) {
    if (verify) {
      this.setState({ modalRewindVerifyIsOpen: false })
      this.refs.stager.rewindStage(true)
    } else {
      this.setState({ modalRewindVerifyIsOpen: false })
    }
  }

  render () {
    const { accept, files, dropzoneActive } = this.state
    return (
      <div>
        <CloseButton onClick={this.openVerifyClose} />
        <Dropzone
          disableClick
          style={{}}
          accept={accept}
          multiple={false}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}>
          { dropzoneActive && <div className='flatfile-dropzone'><h1>Drop files...</h1></div> }
          <StagingManager
            ref={(node) => { this.refs.stager = node }}
            settings={this.props.settings}
            returnUUID={this.props.returnUUID}
            asyncSetState={this.props.asyncSetState}
            updateMeta={this.props.updateMeta}
            handshake={this.props.handshake}
            batchConfig={this.props.batchConfig}
            files={files}
            accept={accept}
            csvUnload={this.csvUnload}
            csvLoad={this.csvLoad}
            uploadLog={this.state.uploadLog}
            uploadLogUpdate={this.uploadLogUpdate}
            openModalRewindVerify={this.openModalRewindVerify}
            openModal={this.openModal} />
        </Dropzone>
        <Modal
          isOpen={this.state.modalRewindVerifyIsOpen}
          onRequestClose={this.closeModalRewindVerify}
          className='flatfile-modal confirm'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Confirm'>
          <h4>Are you sure you want to clear all changes to data in progress in this stage?</h4>
          <div class='controlbar'>
            <GenericButton id='deny-rewind' title='No' classes={['invert']} onClick={() => { this.closeModalRewindVerify(false) }} />
            <GenericButton id='confirm-rewind' title='Yes' classes={['blue']} onClick={() => { this.closeModalRewindVerify(true) }} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalCloseIsOpen}
          onRequestClose={() => this.closeModal('close-cancel')}
          className='flatfile-modal confirm'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Confirm Close'>
          <h4>Are you sure you want to close the importer and clear all data?</h4>
          <div class='controlbar'>
            <GenericButton id='cancel-close' title='No' classes={['invert']} onClick={() => this.closeModal('close-cancel')} />
            <GenericButton id='confirm-close' title='Yes' classes={['blue']} onClick={() => this.closeModal('close-confirm')} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className='flatfile-modal error'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Error'>
          <h4>{this.state.modalContent}</h4>
          <div class='controlbar single'>
            <GenericButton id='error-acknowledge' title='Ok' classes={['blue']} onClick={this.closeModal} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalLoaderIsOpen}
          onRequestClose={() => this.closeModal('loader')}
          className='flatfile-modal upload-progress'
          overlayClassName='flatfile-modal-overlay'
          shouldCloseOnOverlayClick={false}
          contentLabel='Uploading'>
          <h4>Uploading...</h4>
        </Modal>
        <Modal
          isOpen={this.state.modalErrorIsOpen}
          onRequestClose={() => this.closeModal('error')}
          className='flatfile-modal upload-error'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Upload Error'>
          <h4>Error: {this.state.modalErrorContent}</h4>
          <div class='controlbar single'>
            <GenericButton id='upload-error-modal-acknowledge' title='Ok' classes={['blue']} onClick={() => this.closeModal('error')} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalSuccessIsOpen}
          onRequestClose={() => this.closeModal('success')}
          className='flatfile-modal upload-success'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Upload Success'>
          <h4>{this.state.successMessage}</h4>
          <div class='controlbar single'>
            <GenericButton id='upload-success-modal-acknowledge' title='Ok' classes={['blue']} onClick={() => this.closeModal('success')} />
          </div>
        </Modal>
      </div>
    )
  }
}
