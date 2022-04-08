/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  navigateToImporterFrame,
  enterText,
  enterRow,
  dialogSubmit
} = require('./_helpers')

describe('final submission', function () {
  this.retries(3)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('submits only two values', function () {
    this.timeout(40000)
    enterText(1, 1, 'test')
    enterText(1, 4, 'rest')
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
    "name": "test",
    "shield-color": "",
    "helmet-style": "",
    "sign": "rest",
    "id": ""
  }
]`
    )
  })

  it('submits data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', 'triangle', 'sign', '313'])
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
    "name": "name",
    "shield-color": "green",
    "helmet-style": "triangle",
    "sign": "sign",
    "id": "313"
  }
]`
    )
  })

  it('submits multiple rows of data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', 'triangle', 'sign', '313'])
    enterRow(2, ['name2', 'blue', 'square', 'rest', '13'])
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#continue')
    dialogSubmit('include')
    browser.waitForVisible('#upload-success-modal-acknowledge')
    browser.click('#upload-success-modal-acknowledge')
    browser.frame()
    // browser.waitForVisible('iframe', 500, true)
    browser.waitForValue('textarea#output')
    expect(browser.getValue('textarea#output')).to.equal(
`[
  {
    "name": "name",
    "shield-color": "green",
    "helmet-style": "triangle",
    "sign": "sign",
    "id": "313"
  },
  {
    "name": "name2",
    "shield-color": "blue",
    "helmet-style": "square",
    "sign": "rest",
    "id": "13"
  }
]`
    )
  })

  it('submits partial data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', '', 'sign', '313'])
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
    "name": "name",
    "shield-color": "green",
    "helmet-style": "",
    "sign": "sign",
    "id": "313"
  }
]`
    )
  })

  it('submits multiple rows of partial data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', '', 'sign', '313'])
    enterRow(2, ['name2', 'blue', '', 'rest', ''])
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
    "name": "name",
    "shield-color": "green",
    "helmet-style": "",
    "sign": "sign",
    "id": "313"
  },
  {
    "name": "name2",
    "shield-color": "blue",
    "helmet-style": "",
    "sign": "rest",
    "id": ""
  }
]`
    )
  })
})
