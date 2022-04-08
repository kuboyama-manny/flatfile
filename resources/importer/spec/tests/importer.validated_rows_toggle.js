/* eslint no-undef: 0 */  // --> OFF

var expect = require('chai').expect
const {
  navigateToImporterFrame,
  goToMatchStage,
  clearLocalStorage,
  checkRow
} = require('./_helpers')

describe('validated rows toggle', function () {
  this.retries(3)

  beforeEach(function () {
    navigateToImporterFrame(this)
    clearLocalStorage()
    goToMatchStage('robots basic 10.csv', false, true)
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
  })

  it('toggles to display only invalid rows', function () {
    this.timeout(40000)
    browser.click('.check-toggle')
    expect(checkRow(2, 5)).to.have.ordered.members(['3', '3Jaynell Danbury', 'Mauv2', 'cont', 'scelerisque'])
    expect(checkRow(5, 5)).to.have.ordered.members(['7', '7Camilla Dwire', 'Aquamarine5', 'Mult', 'accumsan'])
    expect(checkRow(7, 5)).to.have.ordered.members(['10', '0Raye Reubens', 'Teal7', 'ecoc', 'tortor'])
  })

  it('toggles back to display valid rows', function () {
    this.timeout(40000)
    browser.click('.check-toggle')
    browser.click('.check-toggle')
    expect(checkRow(2, 5)).to.have.ordered.members(['2', '2Rea Mathivet', 'Puce', 'back', 'vestibulum'])
    expect(checkRow(6, 5)).to.have.ordered.members(['6', '6Tamiko Britney', 'Blue', 'syst', 'ligula'])
    expect(checkRow(9, 5)).to.have.ordered.members(['9', '9Berrie Lorriman', 'Puce', 'Team', 'varius'])
  })
})
