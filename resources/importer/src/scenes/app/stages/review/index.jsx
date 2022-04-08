import { h, Component, render } from 'preact' // eslint-disable-line no-unused-vars
import pluralize from 'pluralize'
import Modal from 'react-modal'
import axios from 'axios'
import 'font-awesome/css/font-awesome.css'
import 'handsontable/dist/handsontable.full.css'
import '../../lib/polyfills'
import { PostConfig } from 'config'
import { updateBatchLog, checkStatus, storageAvailable } from '../../lib/functions'
import { ProgressHeader, GenericButton, FooterBrand } from '../../lib/elements'
import Validate from '../../lib/validate'
import HoT from './table'

export default class Review extends Component {
  constructor (props) {
    super(props)
    const data = props.newData
    const rows = data.rows.map((row, i) => {
      return {$meta: {deleted: false, index: i}, ...row}
    })
    const columnMeta = [{
      newName: '$meta',
      validators: [],
      description: '',
      matchState: 'ignored'
    }, ...props.columnMeta]
    const columns = [{ key: '$meta', name: '', validators: [] }, ...data.columns]
    this.refs = {}
    this.handshake = props.handshake
    this.updateMeta = props.updateMeta.bind(this)
    this.toggleValidatedRows = this.toggleValidatedRows.bind(this)
    this.toggleRemember = this.toggleRemember.bind(this)
    this.openModal = props.openModal.bind(this)
    this.toggleProgressOverlay = props.toggleProgressOverlay.bind(this)
    this.rewindStage = props.rewindStage.bind(this)
    this.openModalFinalVerify = this.openModalFinalVerify.bind(this)
    this.closeModalFinalVerify = this.closeModalFinalVerify.bind(this)
    this.nextStage = props.nextStage.bind(this)
    this.returnUUID = props.returnUUID.bind(this)
    this.finalSubmit = this.finalSubmit.bind(this)
    this.isReloading = this.isReloading.bind(this)
    this.validate = new Validate(rows, columns)
    this.validatedIn = this.validate.validateTable()
    this.state = {
      t0: window.performance.now(),
      modalFinalVerifyIsOpen: false,
      batchConfig: props.batchConfig,
      reloading: false,
      hasBeenEdited: false,
      columns,
      rows,
      filteredRows: rows,
      columnMeta,
      settings: props.settings,
      validated: false,
      hideValidatedRows: false,
      activeStage: props.activeStage,
      usedCustomColumns: props.usedCustomColumns,
      dataType: props.dataType,
      tableHeight: 500
    }
  }

  componentDidMount () {
    this.toggleProgressOverlay(false)
  }

  componentWillUnmount () {
    this.refs = {}
  }

  async reportErrorRowCount () {
    const errorRowCount = this.validate.errorRows.filter(v => !v).length
    updateBatchLog(
      this.returnUUID,
      {count_rows_invalid: errorRowCount}
    )
  }

  isReloading (reloading) {
    this.setState({ reloading })
  }

  getFilteredRows (hideValidatedRows) {
    return !hideValidatedRows ? this.state.rows : this.state.rows.filter((r, i) => !this.validate.errorRows[i])
  }

  setRowState ({hideValidatedRows}, extraState = {}) {
    this.setState({ hideValidatedRows, filteredRows: this.getFilteredRows(hideValidatedRows), reloading: true, ...extraState })
  }

  toggleValidatedRows () {
    const hideValidatedRows = !this.state.hideValidatedRows
    this.setRowState({ hideValidatedRows }, { t0: window.performance.now() })
  }

  toggleRemember (event) {
    const rememberEdits = !this.state.rememberEdits
    this.setState({ rememberEdits })
  }

  closeModalFinalVerify (choice) {
    switch (choice) {
      case 'ignore':
        this.setState({ modalFinalVerifyIsOpen: false })
        this.finalSubmit(false)
        break
      case 'include':
        this.setState({ modalFinalVerifyIsOpen: false })
        this.finalSubmit(true)
        break
      case 'cancel':
      default:
        if (this.validate.errorRows.filter(v => !v).length) {
          this.setRowState({hideValidatedRows: true}, {modalFinalVerifyIsOpen: false})
        } else {
          this.setState({ modalFinalVerifyIsOpen: false })
        }
    }
  }

  openModalFinalVerify () {
    this.setState({ modalFinalVerifyIsOpen: true, t0: window.performance.now() })
  }

  async finalSubmit (includeErrors) {
    const richData = this.managedRowsMap()
    if (this.state.settings.managed) {
      this.postRows(richData)
    }
    const rows = this.processRows(includeErrors)
    if (storageAvailable('localStorage')) {
      window.localStorage.setItem('flatfile_columns', JSON.stringify(this.state.columns))
      window.localStorage.setItem('flatfile_custom_columns', JSON.stringify(this.state.usedCustomColumns))
    }
    const submittedAt = new Date().toISOString()
    const countRowsAccepted = this.state.rows.length
    let importMeta = this.updateMeta({
      columns: this.state.columns,
      custom_columns: this.state.usedCustomColumns,
      count_rows_accepted: countRowsAccepted,
      submitted_at: submittedAt,
      validated_in: this.validatedIn
    })
    if (!importMeta.batchID) {
      const batchID = await this.returnUUID()
      importMeta = this.updateMeta({ batchID })
    }
    const data = { rows: rows, meta: importMeta }
    this.handshake.then(parent => {
      updateBatchLog(
        this.returnUUID,
        { count_rows_accepted: countRowsAccepted, submitted_at: submittedAt })
      if (this.state.batchConfig.expectsExpandedResults) {
        parent.results({results: richData, meta: importMeta})
      } else {
        parent.complete(data)
      }
    })
  }

  async postRows (data) {
    const uuid = await this.returnUUID()
    axios({
      method: 'post',
      url: `${PostConfig.root_url}/public-api/batches/${uuid}/import-rows`,
      headers: {'License-Key': window.FF_LICENSE_KEY},
      data: {data: data}
    })
      .then(checkStatus)
      .catch((error) => { console.warn('error attempting to post rows for managing:', error) })
  }

  managedRowsMap () {
    return this.state.rows.map((r, i) => {
      const data = {...r}
      delete data.$meta
      return {sequence: r.$meta.index + 1, deleted: r.$meta.deleted, valid: this.validate.errorRows[i], data}
    })
  }

  processRows (includeErrors) {
    return this.state.rows.reduce((acc, row) => {
      if (Object.keys(row).some(v => row[v]) &&
        !row.$meta.deleted &&
        (this.validate.errorRows[row.$meta.index] || !this.validate.errorRows[row.$meta.index] === includeErrors)) {
        let _custom = {}
        let newRow = Object.keys(row).reduce((acc, key) => {
          const meta = this.state.columnMeta.find(col => col.newName === key && (col.matchState === 'confirmed' || col.matchState === 'matched'))
          if (!meta || row.$meta.deleted) {
            return acc
          } else if ((meta.matchState === 'confirmed' || meta.matchState === 'matched') && this.state.usedCustomColumns.indexOf(key) > -1) {
            _custom[key] = row[key]
          } else if (meta.matchState === 'confirmed' || meta.matchState === 'matched') {
            acc[key] = row[key]
          }
          return acc
        }, {})
        if (this.state.usedCustomColumns.length) { newRow = Object.assign(newRow, { _custom }) }
        acc.push(newRow)
      }
      return acc
    }, [])
  }

  render () {
    const warningIcon = require('../../../../themes/simple/styles/images/warning.svg')
    const validationHandler =
      <div class='flex-start'>
        <label
          htmlFor='toggle-problems'
          data-line={this.state.hideValidatedRows}
          class='check-toggle' />
        <span>Only show rows with problems</span>
        <input
          id='toggle-problems'
          type='checkbox'
          name='toggle-problems'
          value='toggleProblems'
          checked={this.state.hideValidatedRows}
          onChange={this.toggleValidatedRows} />
      </div>
    const reloadIndicator =
      <div class='reload-indicator'>
        <i class='fa fa-spinner fa-pulse fa-fw' />
        <h6 class='sr-only'>{'Loading...'}</h6>
      </div>
    const header = 'Bulk Add ' + this.state.rows.length + ' ' + pluralize(this.state.dataType, this.state.rows.length)
    return (
      <div class='validation-edit-stage'>
        <div class='scroll-block'>
          <div class='controlbar top'>
            <h1 class='primary-header'>{header}</h1>
            <ProgressHeader stage={this.state.activeStage} />
          </div>
          <div class='controlbar top short flex-between'>{validationHandler}{this.state.reloading ? reloadIndicator : null}</div>
          <HoT
            columns={this.state.columns}
            rows={this.state.rows}
            filteredRows={this.state.filteredRows}
            columnMeta={this.state.columnMeta}
            validate={this.validate}
            ref={node => (this.refs.HoT = node)}
            t0={this.state.t0}
            isReloading={this.isReloading}
            onEdit={() => { this.setState({ hasBeenEdited: true }) }} />
        </div>
        <div class='controlbar bottom'>
          <FooterBrand />
          <GenericButton id='cancel' classes={['invert']} title='Go Back' onClick={() => this.rewindStage(!this.state.hasBeenEdited)} />
          <GenericButton id='continue' title='Complete' classes={['blue']} onClick={this.openModalFinalVerify} />
        </div>
        <Modal
          isOpen={this.state.modalFinalVerifyIsOpen}
          onRequestClose={() => this.closeModalFinalVerify(false)}
          className='flatfile-modal confirm'
          overlayClassName='flatfile-modal-overlay'
          contentLabel='Confirm Close'>
          {<SubmitOptions
            errorCount={this.validate.errorRows.filter(v => !v).length}
            allowInvalidSubmit={this.state.settings.allowInvalidSubmit}
            warningIcon={warningIcon}
            onClick={this.closeModalFinalVerify} />}
        </Modal>
      </div>
    )
  }
}

const SubmitOptions = (props) => {
  if (props.errorCount > 0 && props.allowInvalidSubmit) {
    return <AllowErrorsOptions errorCount={props.errorCount} onClick={props.onClick} warningIcon={props.warningIcon} />
  } else if (props.errorCount > 0) {
    return <ErrorsPresentOptions errorCount={props.errorCount} onClick={props.onClick} warningIcon={props.warningIcon} />
  } else {
    return <ValidSubmitOptions onClick={props.onClick} warningIcon={props.warningIcon} />
  }
}

const AllowErrorsOptions = (props) =>
  <div>
    <div className='modal-header'>
      <img src={props.warningIcon} />
      <h4>You have {props.errorCount} rows with unresolved format issues.</h4>
    </div>
    <ul>
      <li>
        <p>Review and fix the format issues.</p>
        <GenericButton id='final-close-cancel' title='Back' classes={['invert']} onClick={() => props.onClick('cancel')} />
      </li>
      <li>
        <p>Submit your data anyways (errors may occur).</p>
        <GenericButton id='final-close-ignore' title='Continue' classes={['blue']} onClick={() => props.onClick('ignore')} />
      </li>
    </ul>
  </div>

const ErrorsPresentOptions = (props) =>
  <div>
    <div className='modal-header'>
      <img src={props.warningIcon} />
      <h4>You have {props.errorCount} rows with unresolved format issues.</h4>
    </div>
    <ul>
      <li>
        <p>Review and fix the format issues.</p>
        <GenericButton id='final-close-cancel' title='Back' classes={['invert']} onClick={() => props.onClick('cancel')} />
      </li>
      <li>
        <p><u>Discard</u> {props.errorCount} rows with issues. Submit the rest.</p>
        <GenericButton id='final-close-ignore' title='Continue' classes={['blue']} onClick={() => props.onClick('ignore')} />
      </li>
    </ul>
  </div>

const ValidSubmitOptions = (props) =>
  <div>
    <div className='modal-header'>
      <img src={props.warningIcon} />
      <h4>Are you ready to submit?</h4>
    </div>
    <ul>
      <li>
        <GenericButton id='final-close-cancel' title='No' classes={['invert']} onClick={() => props.onClick('cancel')} />
      </li>
      <li>
        <GenericButton id='final-close-include' title='Yes' classes={['blue']} onClick={() => props.onClick('include')} />
      </li>
    </ul>
  </div>

// <label
//   htmlFor='toggle-remember'
//   data-line={this.state.rememberEdits}
//   class='check-toggle' />
// <span>Remember my fixes</span>
// <input
//   id='toggle-remember'
//   type='checkbox'
//   name='toggle-remember'
//   value='toggleRemember'
//   checked={this.state.rememberEdits}
//   onChange={this.toggleRemember} />
