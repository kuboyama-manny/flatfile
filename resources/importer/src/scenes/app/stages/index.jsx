import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import Uploader from './upload'
import HeaderMatch from './parse'
import ColumnMatch from './match'
import Review from './review'
import 'font-awesome/css/font-awesome.css'

export default class StagingManager extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.rewindStage = this.rewindStage.bind(this)
    this.clearData = this.clearData.bind(this)
    this.nextStage = this.nextStage.bind(this)
    this.csvUnload = props.csvUnload.bind(this)
    this.updateMeta = props.updateMeta.bind(this)
    this.csvLoad = props.csvLoad.bind(this)
    this.uploadLogUpdate = props.uploadLogUpdate.bind(this)
    this.openModalRewindVerify = props.openModalRewindVerify.bind(this)
    this.openModal = props.openModal.bind(this)
    this.csvDataUpdate = this.csvDataUpdate.bind(this)
    this.asyncSetState = props.asyncSetState.bind(this)
    this.toggleProgressOverlay = this.toggleProgressOverlay.bind(this)
    let defaultColumns = []
    let defaultRows = []
    let defaultValidators = {}
    let defaultDescriptions = {}
    let keyNames = {}
    for (let j = 0; j < props.settings.fields.length; j++) {
      defaultColumns.push({
        key: props.settings.fields[j].key,
        name: props.settings.fields[j].label,
        validators: props.settings.fields[j].validators
      })
      defaultValidators[props.settings.fields[j].key] = props.settings.fields[j].validators
      defaultDescriptions[props.settings.fields[j].key] = props.settings.fields[j].description
      keyNames[props.settings.fields[j].key] = props.settings.fields[j].label
    }

    for (let i = 0, row = {}; i < 9; i++) {
      for (let j = 0; j < props.settings.fields.length; j++) {
        row[props.settings.fields[j].key] = ''
      }
      row = {}
      defaultRows.push(row)
    }
    this.state = {
      files: props.files,
      uploadLog: props.uploadLog,
      accept: props.accept,
      csvData: {},
      newData: {},
      columnMeta: [],
      header: false,
      results: {},
      rawCSV: '',
      previewData: {},
      activeStage: 1,
      settings: props.settings,
      usedCustomColumns: [],
      defaultRows,
      defaultColumns,
      defaultValidators,
      defaultDescriptions,
      keyNames,
      dataType: props.settings.type,
      shouldRememberHeader: true,
      progressOverlay: '',
      uuid: props.uuid
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.uploadLog !== this.state.uploadLog) {
      this.setState({ uploadLog: nextProps.uploadLog })
    }
  }

  clearData () {
    this.asyncSetState({uuid: false})
    this.setState({
      files: [],
      csvData: {},
      newData: {},
      columnMeta: [],
      header: false,
      results: {},
      rawCSV: '',
      previewData: {},
      activeStage: 1,
      usedCustomColumns: [],
      shouldRememberHeader: true
    })
  }

  rewindStage (verify = false) {
    if (verify) {
      this.toggleProgressOverlay(true)
      switch (this.state.activeStage) {
        case 1:
          this.refs.loader.refs.initialTable.hotInstance.clear()
          this.refs.loader.refs.initialTable.hotInstance.deselectCell()
          this.toggleProgressOverlay(false)
          break
        case 2:
          this.asyncSetState({uuid: false})
          this.setState({
            csvData: {},
            newData: {},
            columnMeta: [],
            previewData: {},
            rawCSV: '',
            results: {},
            files: [],
            header: false,
            shouldRememberHeader: true,
            activeStage: 1
          })
          this.csvUnload()
          this.refs = {}
          break
        case 3:
          this.setState({
            shouldRememberHeader: false,
            activeStage: 2
          })
          this.refs = {}
          break
        case 4:
          const isPastedData = !this.state.csvData.meta
          if (isPastedData) {
            this.asyncSetState({uuid: false})
          }
          this.setState({
            newData: null,
            usedCustomColumns: [],
            activeStage: isPastedData ? 1 : 3
          })
          this.refs = {}
          break
        default:
          // do nothing
      }
    } else {
      this.openModalRewindVerify()
    }
  }

  nextStage (newState) {
    this.toggleProgressOverlay(true)
    this.refs = {}
    window.setTimeout(() => { this.setState(newState) }, 10)
  }

  csvDataUpdate (csvData) {
    this.toggleProgressOverlay(true)
    window.setTimeout(() => { this.setState({ csvData }) }, 10)
  }

  toggleProgressOverlay (toggle) {
    if (toggle) {
      this.setState({ progressOverlay: ' stage-loading' })
    } else {
      this.setState({ progressOverlay: '' })
    }
  }

  render () {
    let mainDisplay = {}
    const files = this.state.files.length >= this.props.files.length ? this.state.files : this.props.files
    if (this.state.activeStage === 1) { // FIRST STAGE: UPLOADER
      mainDisplay = <Uploader
        ref={node => { this.refs.loader = node }}
        csvLoad={this.csvLoad}
        updateMeta={this.props.updateMeta}
        asyncSetState={this.asyncSetState}
        uploadLogUpdate={this.uploadLogUpdate}
        returnUUID={this.props.returnUUID}
        nextStage={this.nextStage}
        openModal={this.openModal}
        rewindStage={() => this.rewindStage(true)}
        accept={this.state.accept}
        files={files}
        settings={this.state.settings}
        batchConfig={this.props.batchConfig}
        defaultRows={this.state.defaultRows}
        defaultColumns={this.state.defaultColumns}
        defaultDescriptions={this.state.defaultDescriptions}
        defaultValidators={this.state.defaultValidators}
        clientID={this.state.settings.clientID}
        dataType={this.state.dataType}
        toggleProgressOverlay={this.toggleProgressOverlay}
        />
    } else if (this.state.activeStage === 2) { // SECOND STAGE: HEADER MATCHING
      mainDisplay = <HeaderMatch
        toggleProgressOverlay={this.toggleProgressOverlay}
        updateMeta={this.props.updateMeta}
        nextStage={this.nextStage}
        rewindStage={() => this.rewindStage(true)}
        rawCSV={this.state.rawCSV}
        previewData={this.state.previewData}
        defaultColumns={this.state.defaultColumns}
        settings={this.state.settings}
        returnUUID={this.props.returnUUID}
        defaultValidators={this.state.defaultValidators}
        defaultDescriptions={this.state.defaultDescriptions}
        dataType={this.state.dataType}
        shouldRememberHeader={this.state.shouldRememberHeader}
        />
    } else if (this.state.activeStage === 3) { // THIRD STAGE: COLUMN MATCHING
      mainDisplay = <ColumnMatch
        header={this.state.header}
        toggleProgressOverlay={this.toggleProgressOverlay}
        updateMeta={this.props.updateMeta}
        columnMeta={this.state.columnMeta}
        csvData={this.state.csvData}
        activeStage={this.state.activeStage}
        nextStage={this.nextStage}
        openModal={this.openModal}
        rewindStage={() => this.rewindStage(true)}
        settings={this.state.settings}
        returnUUID={this.props.returnUUID}
        allowCustom={this.state.settings.allowCustom}
        defaultValidators={this.state.defaultValidators}
        defaultDescriptions={this.state.defaultDescriptions}
        defaultColumns={this.state.defaultColumns}
        csvDataUpdate={this.csvDataUpdate}
        dataType={this.state.dataType}
        keyNames={this.state.keyNames}
        />
    } else if (this.state.activeStage === 4) { // FINAL STAGE: VALIDATION
      mainDisplay =
        <Review
          returnUUID={this.props.returnUUID}
          settings={this.state.settings}
          batchConfig={this.props.batchConfig}
          toggleProgressOverlay={this.toggleProgressOverlay}
          updateMeta={this.props.updateMeta}
          newData={this.state.newData}
          columns={this.state.newData.columns}
          columnMeta={this.state.columnMeta}
          rows={this.state.newData.rows}
          activeStage={this.state.activeStage}
          rewindStage={this.rewindStage}
          openModal={this.openModal}
          nextStage={this.nextStage}
          usedCustomColumns={this.state.usedCustomColumns}
          dataType={this.state.dataType}
          handshake={this.props.handshake}
          />
    }
    return (
      <div class='active-stage'>
        <div class={'stage-progress-overlay' + this.state.progressOverlay}>
          <span class='loading-indicator'>
            <i class='fa fa-spinner fa-pulse fa-3x fa-fw' />
            <h1 class='sr-only'>{'Loading...'}</h1>
          </span>
        </div>
        {mainDisplay}
      </div>
    )
  }
}
