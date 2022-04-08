/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  navigateToImporterFrame,
  checkRow,
  enterText,
  goToHeaderMatchStage,
  dialogSubmit,
  clearLocalStorage
} = require('./_helpers')

describe('parsing single column', function () {
  this.retries(3)
  it('goes directly to match stage', function () {
    this.timeout(40000)
    navigateToImporterFrame(this)
    clearLocalStorage()
    goToHeaderMatchStage('single column.csv')
    browser.click('#headerConfirm')
    expect(browser.waitForVisible('.column-match-stage')).to.equal(true)
  })
})

describe('parsing error handling', function () {
  this.retries(3)

  beforeEach(function () {
    navigateToImporterFrame(this)
    clearLocalStorage()
    goToHeaderMatchStage('robots error.csv')
    browser.click('#headerConfirm')
    browser.waitForVisible('.parse-error-stage')
  })

  it('displays errors', function () {
    this.timeout(40000)
    expect(checkRow(1, 8)).to.have.ordered.members(['', '1', 'Too many fields: expected 4 fields but parsed 5', 'R32 Jingle Bells', 'red', 'Killer', 'octagonal', 'square'])
    expect(checkRow(2, 8)).to.have.ordered.members(['', '2', 'Too few fields: expected 4 fields but parsed 3', '9 Sixty', 'blue', 'R2D2', '', ''])
  })

  it('passes values as given if confirmed', function () {
    this.timeout(40000)
    browser.click('#continue')
    browser.waitForVisible('.column-match-stage')
    browser.click('#ignored-2')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#continue')
    dialogSubmit('include')
    browser.waitForVisible('#upload-success-modal-acknowledge')
    browser.click('#upload-success-modal-acknowledge')
    browser.frame()
    browser.waitForVisible('iframe', 500, true)
    browser.waitForValue('textarea#output')
    expect(browser.getValue('textarea#output')).to.equal(
`[
  {
    "name": "R32 Jingle Bells",
    "shield-color": "red",
    "helmet-style": "octagonal"
  },
  {
    "name": "9 Sixty",
    "shield-color": "blue",
    "helmet-style": ""
  },
  {
    "name": "Rack 9823",
    "shield-color": "black",
    "helmet-style": "triangle"
  },
  {
    "name": "10 Paws",
    "shield-color": "fuschia",
    "helmet-style": "hexagonal"
  }
]`
    )
  })

  it('deletes rows', function () {
    this.timeout(40000)
    browser.$$('td .fa-trash')[0].click()
    browser.click('#continue')
    browser.click('#ignored-2')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#continue')
    dialogSubmit('include')
    browser.waitForVisible('#upload-success-modal-acknowledge')
    browser.click('#upload-success-modal-acknowledge')
    browser.frame()
    browser.waitForVisible('iframe', 500, true)
    browser.waitForValue('textarea#output')
    expect(browser.getValue('textarea#output')).to.equal(
`[
  {
    "name": "9 Sixty",
    "shield-color": "blue",
    "helmet-style": ""
  },
  {
    "name": "Rack 9823",
    "shield-color": "black",
    "helmet-style": "triangle"
  },
  {
    "name": "10 Paws",
    "shield-color": "fuschia",
    "helmet-style": "hexagonal"
  }
]`
    )
  })

  it('edits data', function () {
    this.timeout(40000)
    enterText(2, 7, 'new triangle')
    browser.click('#continue')
    browser.click('#ignored-2')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#continue')
    dialogSubmit('include')
    browser.waitForVisible('#upload-success-modal-acknowledge')
    browser.click('#upload-success-modal-acknowledge')
    browser.frame()
    browser.waitForVisible('iframe', 500, true)
    browser.waitForValue('textarea#output')
    expect(browser.getValue('textarea#output')).to.equal(
`[
  {
    "name": "R32 Jingle Bells",
    "shield-color": "red",
    "helmet-style": "octagonal"
  },
  {
    "name": "9 Sixty",
    "shield-color": "blue",
    "helmet-style": "new triangle"
  },
  {
    "name": "Rack 9823",
    "shield-color": "black",
    "helmet-style": "triangle"
  },
  {
    "name": "10 Paws",
    "shield-color": "fuschia",
    "helmet-style": "hexagonal"
  }
]`
    )
  })
})
