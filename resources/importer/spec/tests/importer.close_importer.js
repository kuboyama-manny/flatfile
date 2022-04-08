/* eslint no-undef: 0 */  // --> OFF
const expect = require('chai').expect
const {
  navigateToImporterFrame,
  dialogResponse,
  enterText
} = require('./_helpers')

describe('Importer close button', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('closes importer from blank upload stage', function () {
    browser.click('.flatfile-close-button')
    browser.frame()
    expect(browser.waitForVisible('iframe', 500, true)).to.equal(true)
  })

  it('confirms choice to close importer if data is in upload stage', function () {
    this.timeout(40000)
    enterText(1, 1, 'test')
    browser.click('.flatfile-close-button')
    dialogResponse(true)
    browser.frame()
    expect(browser.waitForVisible('iframe', 500, true)).to.equal(true)
  })

  it('cancels closing importer if popup is denied', function () {
    this.timeout(40000)
    enterText(1, 1, 'test')
    browser.click('.flatfile-close-button')
    dialogResponse(false)
    browser.frame()
    expect(browser.waitForVisible('iframe')).to.equal(true)
  })
})
