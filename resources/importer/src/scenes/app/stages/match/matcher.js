import md5 from 'md5'
import Validate from '../../lib/validate'
import { processData, storageAvailable } from '../../lib/functions'
import '../../lib/polyfills'

export default class {
  constructor (props) {
    this.setState = props.setState
    this.keyNames = props.keyNames
    this.defaultValidators = props.defaultValidators
    this.defaultDescriptions = props.defaultDescriptions
    this.defaultColumns = props.defaultColumns
    this.csvData = props.csvData
    this.header = props.header
    this.customColumns = []
    this.columnOptions = []
    this.validationLog = {}
    this.allowCustom = props.settings.allowCustom
    for (let i = 0; i < props.settings.fields.length; i++) {
      this.columnOptions.push(props.settings.fields[i].key)
    }
    this.columnMeta = props.columnMeta
  }

  set columnMeta (columnMeta) {
    this._columnMeta = columnMeta.reduce((acc, col, i) => {
      const md5key = md5(col.oldName)
      if (storageAvailable('localStorage') && window.localStorage[md5key]) {
        col = this.rehydrateColumn(col, md5key)
      }
      acc.push(col)
      return acc
    }, [])
    this.updateStates()
  }

  get columnMeta () {
    return this._columnMeta
  }

  rehydrateColumn (col, md5key) {
    const memName = JSON.parse(window.localStorage[md5key]).newName
    const memMatchState = JSON.parse(window.localStorage[md5key]).matchState
    if (this.columnOptions.indexOf(memName) === -1 && this.allowCustom && memName !== 'none') {
      this.addCustomColumn(memName)
      col.newName = memName
      col.matchState = memMatchState
      col.validators = []
      col.description = ''
    } else if (this.columnOptions.indexOf(memName) === -1 && !this.allowCustom && memName !== 'none') {
      return col
    } else {
      col.newName = memName
      col.matchState = memMatchState
      col.validators = this.defaultValidators[col.newName] || []
      col.description = this.defaultDescriptions[col.newName] || ''
    }
    return col
  }

  addCustomColumn (name) {
    this.columnOptions.push(name)
    this.customColumns.push(name)
    this.keyNames[name] = name
  }

  confirmMatch (index) {
    this._columnMeta[index].matchState = 'confirmed'
    this.updateStates()
    this.setState({...this._columnMeta})
  }

  undoConfirm (index) {
    this._columnMeta[index].matchState = 'matched'
    this.updateStates()
    this.setState({...this._columnMeta})
  }

  ignoreColumn (index) {
    this._columnMeta[index].matchState = 'ignored'
    this.updateStates()
    this.setState({...this._columnMeta})
  }

  undoMatch (index) {
    this._columnMeta[index].matchState = 'unmatched'
    this._columnMeta[index].newName = 'none'
    this._columnMeta[index].validators = []
    this._columnMeta[index].description = ''
    this.updateStates()
    this.setState({...this._columnMeta})
  }

  changeColumnMatch (index, value) {
    if (this.columnOptions.indexOf(value) === -1) {
      this.addCustomColumn(value)
    }
    if (this._columnMeta[index].newName !== value) {
      this._columnMeta[index].newName = value
      this._columnMeta[index].matchState = 'matched'
      this._columnMeta[index].validators = this.defaultValidators[value] || []
      this._columnMeta[index].description = this.defaultDescriptions[value] || ''
      this.updateStates()
      this.setState({...this._columnMeta, ...this.columnOptions, ...this.customColumns, ...this.keyNames})
    }
  }

  updateStates () {
    this.lockColumns()
    this.markMatchedDuplicates()
    this.updateValidation()
  }

  lockColumns () {
    this._columnMeta = this._columnMeta.reduce((acc, col) => {
      if (col.matchState === 'locked') {
        col.matchState = 'matched'
      }
      acc.push(col)
      return acc
    }, []) // unlock columns
    this._columnMeta = this._columnMeta.reduce((acc, col) => {
      if (col.matchState === 'matched' && this._columnMeta.some(c =>
        c.matchState === 'confirmed' && c.newName === col.newName
      )) {
        col.matchState = 'locked'
      }
      acc.push(col)
      return acc
    }, []) // lock only columns that need to be
  }

  markMatchedDuplicates () {
    const duplicateColumns = this.duplicateStates(['matched', 'confirmed', 'locked'])
    this._columnMeta = this._columnMeta.reduce((acc, col) => {
      if (duplicateColumns.indexOf(col.newName) > -1) {
        col.duplicate = true
      } else {
        col.duplicate = false
      }
      acc.push(col)
      return acc
    }, [])
  }

  updateValidation () {
    const matchStateKey = md5(this._columnMeta.reduce((acc, col) => { // reduce to configuration that tracks only what will change a validation
      if (!col.validators.length || !['matched', 'confirmed'].includes(col.matchState)) {
        acc += 'null'
      } else {
        acc += col.newName
      }
      return acc
    }, ''))
    if (!(matchStateKey in this.validationLog)) { // only validate and create new map of errors in columns if it hasn't been done for this configuration yet
      const { newData } = processData(
        this.header,
        this._columnMeta,
        this.csvData,
        this.keyNames)
      if (newData.columns.length && newData.rows.length) { // if no columns are matched, processData will return empty arrays
        const validate = new Validate(newData.rows, newData.columns)
        validate.validateTable()
        this.validationLog[matchStateKey] = validate.columnsInvalid
      } else {
        this.validationLog[matchStateKey] = []
      }
    }
    this.columnsInvalid = this.validationLog[matchStateKey]
  }

  countState (checkedStates) {
    const names = this._columnMeta.reduce((acc, col) => {
      if (checkedStates.indexOf(col.matchState) > -1) {
        acc.push(col.newName)
      }
      return acc
    }, [])
    return names.reduce((a, b) =>
      Object.assign(a, {[b]: (a[b] || 0) + 1}), {})
  }

  duplicateStates (checkedStates) {
    const countedStates = this.countState(checkedStates)
    return Object.keys(countedStates).filter(v => countedStates[v] > 1)
  }
}
