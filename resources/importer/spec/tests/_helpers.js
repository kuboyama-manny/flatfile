/* eslint no-undef: 0 */  // --> OFF
const path = require('path')
const expect = require('chai').expect

exports.navigateToImporterFrame = function (that) {
  that.timeout(30000)
  browser.url('/test')
  browser.waitForVisible('iframe')
  const importer = browser.element('iframe').value
  browser.frame(importer)
}

exports.dialogResponse = function (confirm) {
  const confirmDialog = $('.ReactModal__Content.ReactModal__Content--after-open.flatfile-modal.confirm')
  confirmDialog.waitForVisible()
  if (confirm) {
    confirmDialog.$('.flatfile-modal .controlbar span:nth-of-type(2) .button.blue').click()
  } else {
    confirmDialog.$('.flatfile-modal .controlbar span:nth-of-type(1) .button.invert').click()
  }
}

exports.dialogSubmit = function (choice) {
  const confirmDialog = $('.ReactModal__Content.ReactModal__Content--after-open.flatfile-modal.confirm')
  confirmDialog.waitForVisible()
  confirmDialog.$(`#final-close-${choice}`).click()
}

getInput = function (row, col) {
  const tableCell = $(`table.htCore > tbody > tr:nth-of-type(${row}) > td:nth-of-type(${col})`)
  tableCell.scroll()
  tableCell.click()
  tableCell.click()
  let holder
  $$('.handsontableInputHolder').forEach(v => {
    if (v.isVisible) {
      holder = v
    }
  })
  const input = holder.$('textarea.handsontableInput')
  if (!input.isVisible()) {
    tableCell.click()
    tableCell.click()
    input.waitForVisible()
  }
  return input
}

exports.enterText = function (row, col, value) {
  input = getInput(row, col)
  input.addValue(value + '\uE007')
}

exports.replaceText = function (row, col, value) {
  input = getInput(row, col)
  input.setValue(value)
  input.addValue('\uE007')
}

exports.enterRow = function (row, values) {
  values.forEach((v, i) => {
    exports.enterText(row, i + 1, v)
  })
}

exports.checkText = function (row, col) {
  return browser.getText(`table.htCore > tbody > tr:nth-of-type(${row}) > td:nth-of-type(${col})`)
}

exports.checkRow = function (row, cols) {
  let values = []
  for (let i = 0; i < cols; i++) {
    values.push(exports.checkText(row, i + 1))
  }
  return values
}

exports.goToHeaderMatchStage = function (filename) {
  const toUpload = path.join(__dirname, 'csv', filename)
  browser.chooseFile('input[type=\'file\']', toUpload)
  browser.waitForVisible('.header-match-stage')
}

exports.goToMatchStage = function (filename, cached, headerTrue) {
  if (cached) {
    const toUpload = path.join(__dirname, 'csv', filename)
    browser.chooseFile('input[type=\'file\']', toUpload)
  } else {
    exports.goToHeaderMatchStage(filename)
    if (headerTrue) {
      browser.click('#headerConfirm')
    } else {
      browser.click('#headerlessConfirm')
    }
  }
  browser.waitForVisible('.column-match-stage')
}

exports.clearLocalStorage = function () {
  const store = browser.localStorage()
  store.value.forEach(key => browser.localStorage('DELETE', key))
}

exports.testParsing = function (expectedPattern) {
  expect(browser.getText('.primary-header')).to.equal(expectedPattern.header)
  expectedPattern.colBodies.forEach((colBodyPattern, i) => new exports.TestColMatch(colBodyPattern, i).testAll())
}

exports.TestColMatch = class {
  constructor (colBodyPattern, index) {
    this.colBodyPattern = colBodyPattern
    this.i = index
    this.colBody = $(`.col-body:nth-of-type(${index + 1})`)
  }

  testAll () {
    this.testSuggestedMatch(this.i)
    this.testDescription(this.i)
    this.testCellPreviews(this.i)
    this.testPercentFill(this.i)
    this.testValidatePreview(this.i)
    this.testDuplicates(this.i)
  }

  testSuggestedMatch (i) {
    const suggestion = this.colBodyPattern.suggestedMatch
    expect(this.colBody.getText('.Select-value-label'), `.Select-value-label failing in colBody ${i}`)
      .to.equal(suggestion)
    expect(this.colBody.getText('.suggested-fieldname'), `.suggested-fieldname failing in colBody ${i}`)
      .to.equal(suggestion)
  }

  testDescription (i) {
    const description = this.colBodyPattern.description
    if (description) {
      expect(this.colBody.getText('.field-description'), `.field-description failing in colBody ${i}`)
        .to.equal(description)
    } else {
      expect(this.colBody.isExisting('.field-description'), `.field-description failing in colBody ${i}`)
        .to.equal(false)
    }
  }

  testCellPreviews (i) {
    expect(this.colBody.$$('td').map(v => v.getText()), `cell previews failing in colBody ${i}`)
      .to.have.deep.ordered.members(this.colBodyPattern.sampleCols)
  }

  testPercentFill (i) {
    expect(this.colBody.$$('li').filter(v =>
      v.getText() === this.colBodyPattern.percentFill
    ).length, `percentFill failing in colBody ${i}`)
      .to.equal(1)
  }

  testValidatePreview (i) {
    const { validatePreview } = this.colBodyPattern
    const countMatch = this.colBody.$$('li').filter(v =>
      v.getText() === validatePreview
    ).length
    if (validatePreview) {
      expect(countMatch, `validatePreview failing in colBody ${i}`).to.equal(1)
    } else {
      expect(countMatch, `validatePreview failing in colBody ${i}`).to.equal(0)
    }
  }

  testDuplicates (i) {
    const { duplicate } = this.colBodyPattern
    const duplicateMatch = this.colBody.$$('li').filter(v =>
      v.getText() === duplicate
    ).length
    if (duplicate) {
      expect(this.colBody.isExisting('.duplicate'), `duplicate class not present on colBody ${i}`).to.equal(true)
      expect(duplicateMatch, `duplicate check failing in colBody ${i}`).to.equal(1)
    } else {
      expect(duplicateMatch, `duplicate check failing in colBody ${i}`).to.equal(0)
    }
  }

  testLocked () {
    const i = this.i
    this.testDescription(i)
    this.testCellPreviews(i)
    this.testPercentFill(i)
    this.testValidatePreview(i)
    this.testDuplicates(i)
    expect(this.colBody.isExisting(`.gray#confirmed-${i}`), `locked button failing in colBody ${i}`)
      .to.equal(true)
  }

  testUnmatched () {
    const i = this.i
    this.testCellPreviews(i)
    this.testPercentFill(i)
    const suggestion = this.colBodyPattern.suggestedMatch
      ? `No match selected. We suggest '${this.colBodyPattern.suggestedMatch}'`
      : 'Unable to automatically match'
    expect(this.colBody.getText('.Select-placeholder'), `.Select-placeholder failing in colBody ${i}`)
      .to.equal('Lookup matching fields')
    expect(this.colBody.$$('.column-unmatched li')[0].getText(), `.suggested-fieldname failing in colBody ${i}`)
      .to.equal(suggestion)
  }
}
