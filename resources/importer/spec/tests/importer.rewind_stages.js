/* eslint no-undef: 0 */  // --> OFF
// const remote = require('selenium-webdriver/remote')
const expect = require('chai').expect
const {
  navigateToImporterFrame,
  enterText,
  checkText,
  goToHeaderMatchStage,
  goToMatchStage,
  clearLocalStorage,
  dialogResponse
} = require('./_helpers')

describe('stage rewinding', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('clears data on upload stage', function () {
    this.timeout(40000)
    enterText(1, 1, 'test')
    browser.click('#cancel')
    expect(checkText(1, 1)).to.equal('')
  })

  it('rewinds from review to upload stage if data was manually entered', function () {
    this.timeout(40000)
    enterText(1, 1, 'test')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#cancel')
    expect(browser.waitForVisible('.uploader-stage')).to.equal(true)
  })

  it('rewinds from header match step to upload stage', async function () {
    this.timeout(40000)
    goToHeaderMatchStage('robots.csv')
    browser.click('#cancel')
    expect(browser.waitForVisible('.uploader-stage')).to.equal(true)
  })

  it('rewinds from match step to header match step after header:true', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', false, true)
    browser.click('#cancel')
    expect(browser.waitForVisible('.header-match-stage')).to.equal(true)
  })

  it('rewinds from match step to header match step after header remembered:true', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.waitForVisible('.column-match-stage')
    browser.click('#cancel')
    expect(browser.waitForVisible('.header-match-stage')).to.equal(true)
  })

  it('rewinds from match step to header match step after header:false', function () {
    this.timeout(40000)
    clearLocalStorage()
    goToMatchStage('robots.csv', false, false)
    browser.click('#cancel')
    expect(browser.waitForVisible('.header-match-stage')).to.equal(true)
  })

  it('rewinds from match step to header match step after header remembered:false', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.waitForVisible('.column-match-stage')
    browser.click('#cancel')
    expect(browser.waitForVisible('.header-match-stage')).to.equal(true)
  })

  it('rewinds from review stage to match stage', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.waitForVisible('.column-match-stage')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    browser.click('#cancel')
    expect(browser.waitForVisible('.column-match-stage')).to.equal(true)
  })

  it('rewinds from review stage to match stage after confirming if edited', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.waitForVisible('.column-match-stage')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    enterText(1, 2, 'changes')
    browser.click('#cancel')
    dialogResponse(true)
    expect(browser.waitForVisible('.column-match-stage')).to.equal(true)
  })

  it('blocks rewinding from review stage to match stage after not confirming after editing', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.waitForVisible('.column-match-stage')
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    enterText(1, 2, 'changes')
    browser.click('#cancel')
    dialogResponse(false)
    expect(browser.waitForVisible('.column-match-stage', 100, true)).to.equal(true)
  })
})
