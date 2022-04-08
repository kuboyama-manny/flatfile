/* eslint no-undef: 0 */  // --> OFF
const {
  navigateToImporterFrame,
  goToMatchStage,
  clearLocalStorage,
  testParsing
} = require('./_helpers')
const expectedMatch = require('./csv/robots.csv.js').expectedMatch

describe('parsing', function () {
  this.retries(3)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('parses as expected headerless', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', false, false)
    testParsing(expectedMatch.headerless)
  })

  it('parses as expected caching headerless', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    testParsing(expectedMatch.headerless)
  })

  it('parses as expected with a header row', function () {
    this.timeout(40000)
    clearLocalStorage()
    goToMatchStage('robots.csv', false, true)
    testParsing(expectedMatch.fuzzy)
  })

  it('parses as expected caching a header row', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    testParsing(expectedMatch.fuzzy)
  })
})
