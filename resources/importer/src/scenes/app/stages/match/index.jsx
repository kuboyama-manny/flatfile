import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import pluralize from 'pluralize'
import md5 from 'md5'
import '../../lib/polyfills'
import { convertToLetters, updateBatchLog, processData, storageAvailable } from '../../lib/functions'
import { ProgressHeader, GenericButton, FooterBrand } from '../../lib/elements'
import Matcher from './matcher'
import ParseErrors from '../parse/parseErrors'
import ColBody from './colBody'

export default class ColumnMatch extends Component {
  constructor (props) {
    super(props)
    let columnFill = {}
    for (let i = 0, c = 0; i < props.csvData.meta.fields.length; i++) {
      for (let j = 0; j < props.csvData.data.length; j++) {
        if (props.csvData.data[j][props.csvData.meta.fields[i]] !== '') { c++ }
      }
      columnFill[props.csvData.meta.fields[i]] = Math.round((c / props.csvData.data.length) * 100) + '%'
      c = 0
    }
    this.matcher = new Matcher({
      setState: (state) => this.setState(state),
      columnMeta: props.columnMeta,
      keyNames: props.keyNames,
      defaultValidators: props.defaultValidators,
      defaultDescriptions: props.defaultDescriptions,
      defaultColumns: props.defaultColumns,
      settings: props.settings,
      csvData: props.csvData,
      header: props.header
    })
    this.rewindStage = props.rewindStage.bind(this)
    this.updateMeta = props.updateMeta.bind(this)
    this.toggleProgressOverlay = props.toggleProgressOverlay.bind(this)
    this.openModal = props.openModal.bind(this)
    this.nextStage = props.nextStage.bind(this)
    this.csvDataUpdate = props.csvDataUpdate.bind(this)
    this.submitDataToValidation = this.submitDataToValidation.bind(this)
    this.returnUUID = props.returnUUID.bind(this)
    this.state = {
      header: props.header,
      settings: props.settings,
      columnMeta: this.matcher.columnMeta,
      csvData: props.csvData,
      columnFill: columnFill,
      activeStage: props.activeStage,
      defaultValidators: props.defaultValidators,
      defaultDescriptions: props.defaultDescriptions,
      defaultColumns: props.defaultColumns,
      allowCustom: props.allowCustom,
      customColumns: this.matcher.customColumns,
      columnOptions: this.matcher.columnOptions,
      keyNames: this.matcher.keyNames,
      dataType: props.dataType
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.columnMeta !== this.state.columnMeta) {
      this.setState({ columnMeta: nextProps.columnMeta })
    }
    if (nextProps.csvData.errors.length !== this.state.csvData.errors.length) {
      this.toggleProgressOverlay(false)
      this.setState({ csvData: nextProps.csvData })
    }
  }

  componentDidMount () {
    this.toggleProgressOverlay(false)
  }

  rememberMeta () {
    if (storageAvailable('localStorage')) {
      for (let i = 0; i < this.state.columnMeta.length; i++) {
        const obj = {newName: this.state.columnMeta[i].newName, matchState: this.state.columnMeta[i].matchState}
        window.localStorage.setItem(md5(this.state.columnMeta[i].oldName), JSON.stringify(obj))
      }
    }
  }

  submitDataToValidation () {
    const { newData, headersMatched } = processData(
      this.state.header,
      this.state.columnMeta,
      this.state.csvData,
      this.state.keyNames)
    let usedCustomColumns = []
    for (let i = 0; i < this.state.customColumns.length; i++) {
      for (let j = 0; j < newData.columns.length; j++) {
        if (newData.columns[j].key === this.state.customColumns[i]) { usedCustomColumns.push(this.state.customColumns[i]) }
      }
    }
    this.rememberMeta()
    updateBatchLog(
      this.returnUUID,
      {headers_matched: headersMatched, count_columns_matched: newData.columns.length, matched_at: new Date().toISOString()}
    )
    this.updateMeta({headers_matched: headersMatched, count_columns_matched: newData.columns.length})
    this.nextStage({ newData, columnMeta: this.state.columnMeta, keyNames: this.state.keyNames, usedCustomColumns, activeStage: 4 })
  }

  render () {
    if (this.state.csvData.errors.length && this.state.csvData.errors[0].type) {
      return <ParseErrors
        csvData={this.state.csvData}
        columnMeta={this.state.columnMeta}
        openModal={this.openModal}
        rewindStage={this.rewindStage}
        dataType={this.state.dataType}
        header={this.state.header}
        csvDataUpdate={this.csvDataUpdate} />
    } else {
      let duplicateColumns = this.state.columnMeta.reduce((a, v, i) => {
        if (v.duplicate) {
          a.push(convertToLetters(i + 1))
        }
        return a
      }, [])
      const reviewFunction = duplicateColumns.length
        ? () => { this.openModal('Sorry, there are a couple columns matched to duplicate fields:\n' + duplicateColumns.join(', ')) }
        : this.submitDataToValidation
      let bodies = []
      bodies = this.state.csvData.meta.fields.map((field, index) =>
        <ColBody
          key={index}
          index={index}
          matcher={this.matcher}
          columnMeta={this.state.columnMeta}
          column={this.state.csvData.meta.fields[index]}
          columnFill={this.state.columnFill}
          header={this.state.header}
          columnOptions={this.state.columnOptions}
          allowCustom={this.state.allowCustom}
          keyNames={this.state.keyNames}
          csvData={this.state.csvData} />
      )
      return (
        <div class='column-match-stage'>
          <div class='scroll-block'>
            <div class='controlbar top'>
              <h1 class='primary-header'>{'Bulk Add ' + this.state.csvData.data.length + ' ' + pluralize(this.state.dataType, this.state.csvData.data.length)}</h1>
              <ProgressHeader stage={this.state.activeStage} />
            </div>
            <div class='column-edit-table'>
              {bodies}
            </div>
          </div>
          <div class='controlbar bottom'>
            <FooterBrand />
            <GenericButton id='cancel' title='Go Back' classes={['invert']} onClick={this.rewindStage} />
            <GenericButton id='continue' title='Review' classes={['blue']} onClick={reviewFunction} />
          </div>
        </div>
      )
    }
  }
}
