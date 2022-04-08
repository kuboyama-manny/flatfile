var expect = require('chai').expect
const { navigateToImporterFrame } = require('./_helpers')

describe('Test Flatfile.io importer', function () {
  it('follows link to new page', function () {
    browser.url('/test')
    expect(browser.getTitle()).to.equal('flatfile.io')
  })

  it('opens importer', function () {
    navigateToImporterFrame(this)
  })
})
