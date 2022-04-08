import './polyfills'
import moment from 'moment'

export default class Validate {
  constructor (rows, columns) {
    this.validationState = rows
    this.errorRows = Array(rows.length).fill(true)
    this.rows = rows
    this.columns = columns
    this.columnsInvalid = []
  }

  set validationState (rows) {
    this._validationState = this.initValidationState(rows)
  }

  get validationState () {
    return this._validationState
  }

  resetValidationState (rows) {
    this.validationState = rows
    this.errorRows = Array(rows.length).fill(true)
  }

  initValidationState (rows) {
    return rows.map(row => {
      return Object.keys(row).map((key, col) => {
        return { value: row[key], errors: [], col }
      })
    })
  }

  validateTable () {
    const t0 = window.performance.now()
    this.errorRows = Array(this.rows.length).fill(true)
    this._validationState = this._validationState.map((row, i) => this.validateRow(row, i))
    this.columnsInvalid = this._validationState.reduce((acc, row, i) => {
      row.forEach(v => {
        const key = this.columns[v.col].key
        const increment = v.errors.length ? 1 : 0
        acc[key] = (acc[key] || 0) + increment
      })
      return acc
    }, {})
    const t1 = window.performance.now()
    return t1 - t0
  }

  validateRow (row, i) {
    let rowValid = true
    const newRow = row.map((cell, j) => {
      cell.errors = this.validateCell(i, j, cell.value)
      if (cell.errors.length) { rowValid = false }
      return cell
    })
    this.errorRows[i] = (typeof row[0].value === 'object' ? row[0].value.deleted : false) || rowValid
    return newRow
  }

  validateCell (row, col, value) {
    const column = this.columns[col]
    const validators = column.validators
    if (!validators.some(
      v => [
        'required',
        'required_without',
        'required_without_all',
        'required_with_all',
        'required_with'
      ].some(
        r => r === v.validate)) && value === '') {
      return []
    } else {
      return validators.reduce((errors, validator) => {
        let isValid = true
        switch (validator.validate) {
          case 'regex_matches':
            isValid = validator.regex.test(value)
            break
          case 'regex_excludes':
            isValid = !validator.regex.test(value)
            break
          case 'required':
            isValid = value !== ''
            break
          case 'required_without_all':
            isValid = (value !== '' || validator.fields.some(v => this.rows[row][v] !== ''))
            break
          case 'required_without':
            isValid = (value !== '' || validator.fields.every(v => this.rows[row][v] !== ''))
            break
          case 'required_with_all':
            isValid = (value !== '' || !validator.fields.every(v => this.rows[row][v] !== ''))
            break
          case 'required_with':
            isValid = (value !== '' || validator.fields.every(v => this.rows[row][v] === ''))
            break
          default:
          // do nothing
        }
        if (isValid) {
          return errors
        } else {
          errors.push(validator.error || 'Failed validation')
          return errors
        }
      }, [])
    }
  }

  updateCell (row, col, value) {
    this._validationState[row][col].value = value
    this.updateRow(row)
  }

  updateRow (row) {
    this.validateRow(this._validationState[row], row)
  }

  removeRow (index, amount) {
    this._validationState.splice(index, amount)
    this.errorRows.splice(index, amount)
  }

  createRow (index, cols) {
    this.errorRows.splice(index, 0, true)
    this._validationState.splice(index, 0, Array(cols).fill('').map((value, col) => { return {errors: [], value, col} }))
    this._validationState[index] = this.validateRow(this._validationState[index], index)
  }
}
