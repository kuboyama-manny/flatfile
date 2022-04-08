export default class ErrorRowsParser {
  constructor (errors, columns, csvData) {
    this.errors = errors
    this.columns = columns
    this.csvData = csvData
  }

  getRows () {
    const rows = this.errors.reduce((rowsBuild, currentError, currentIndex, errors) => {
      if (typeof currentError.row === 'undefined') { // if the error is non-row-specific, ignore it
        return rowsBuild
      }
      const csvRowWithError = currentError.row // get what row of the CSV the current error is referring to
      const lastIndex = rowsBuild.length - 1 // get the index of the last added row to rowsBuild
      if (lastIndex > -1 && rowsBuild[lastIndex].csvRow === csvRowWithError + 1) { // if it's not the first element and the current error refers to the same error as the previous one
        rowsBuild[lastIndex].error = this.updateRowErrorMessage(currentError.message, rowsBuild[lastIndex].error)
      } else {
        rowsBuild.push(this.newRow(csvRowWithError, currentIndex))
      }
      return rowsBuild
    }, [])
    return rows
  }

  updateRowErrorMessage (newError, currentError) {
    const regex = new RegExp(newError + '(?: \\((\\d+)X times\\))?')  // eslint-disable-line no-useless-escape
    const results = regex.exec(currentError) // check if this error has already been applied to this row
    if (results) {
      let [, duplicateCount] = results
      duplicateCount = duplicateCount ? parseInt(duplicateCount) + 1 : 2 // get the number of times this error has been applied to this row
      const replaceRegex = new RegExp(newError + '( \\((\\d+)X times\\))?') // eslint-disable-line no-useless-escape
      const newMessage = currentError.replace(replaceRegex, newError + ' (' + duplicateCount + 'X times)')
      return newMessage
    } else {
      return currentError + ', ' + newError
    }
  }

  newRow (csvRowWithError, currentErrorIndex) {
    const row = this.columns.reduce((row, value, index) => {
      switch (value.key) {
        case 'action':
          return Object.assign({[value.key]: 'INCLUDE'}, row)
        case 'csvRow':
          return Object.assign({[value.key]: csvRowWithError + 1}, row)
        case 'error':
          return Object.assign({[value.key]: this.errors[currentErrorIndex].message}, row)
        default:
          return Object.assign({[value.key]: this.csvData.data[csvRowWithError][value.key] || ''}, row)
      }
    }, {})
    return row
  }
}
