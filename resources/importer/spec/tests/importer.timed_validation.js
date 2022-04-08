/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  navigateToImporterFrame,
  goToMatchStage
} = require('./_helpers')

describe('timed import', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('uploads and validates in under 2 minutes', function () {
    this.timeout(180000)
    // navigateToImporterFrame(this)
    goToMatchStage('robots basic 100k.csv', false, true)
    browser.click('#continue')
    expect(browser.waitForVisible('.validation-edit-stage', 60000)).to.equal(true)
  })
})
