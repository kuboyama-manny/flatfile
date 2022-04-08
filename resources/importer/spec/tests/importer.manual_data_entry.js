/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  navigateToImporterFrame,
  enterRow,
  checkRow
} = require('./_helpers')

describe('manual data entry', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('enters data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', 'triangle', 'sign', '313'])
    expect(checkRow(1, 5)).to.have.ordered.members(['name', 'green', 'triangle', 'sign', '313'])
  })

  it('reviews data', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', 'triangle', 'sign', '313'])
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    expect(checkRow(1, 6)).to.have.ordered.members(['1', 'name', 'green', 'triangle', 'sign', '313'])
  })

  it('skips empty rows', function () {
    this.timeout(40000)
    enterRow(1, ['name', 'green', 'triangle', 'sign', '313'])
    enterRow(3, ['name2', 'green2', 'triangle2', 'sign2', '3132'])
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    expect(checkRow(1, 6)).to.have.ordered.members(['1', 'name', 'green', 'triangle', 'sign', '313'])
    expect(checkRow(2, 6)).to.have.ordered.members(['2', 'name2', 'green2', 'triangle2', 'sign2', '3132'])
  })
})
