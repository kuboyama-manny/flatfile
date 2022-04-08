/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  goToMatchStage,
  navigateToImporterFrame,
  clearLocalStorage,
  TestColMatch,
  checkRow
} = require('./_helpers')

describe('no matched columns', function () {
  this.retries(3)

  it('loads properly in match stage', function () {
    this.timeout(40000)
    navigateToImporterFrame(this)
    goToMatchStage('no matched columns.csv', false, true)
    const pattern1 = {
      suggestedMatch: '',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: '',
      validatePreview: ''
    }
    const pattern2 = {
      suggestedMatch: '',
      sampleCols: ['red', 'blue', 'black'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: '',
      validatePreview: ''
    }
    new TestColMatch(pattern1, 0).testUnmatched()
    new TestColMatch(pattern2, 1).testUnmatched()
  })
})

describe('column matching', function () {
  this.retries(3)

  beforeEach(function () {
    navigateToImporterFrame(this)
    goToMatchStage('robots.csv', false, true)
  })

  afterEach(function () {
    clearLocalStorage()
  })

  it('has correct match options', function () {
    this.timeout(40000)
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    expect(options.map(v => v.getText())).to.have.ordered.members([
      'Robot Name',
      'Shield Color',
      'Robot Helmet Style',
      'Call Sign',
      'Robot ID Code'
    ])
  })

  it('confirms matches', function () {
    this.timeout(40000)
    $$('.col-body').forEach((colBody, i) => {
      colBody.click(`#confirmed-${i}`)
    })
    expect($$('.column-confirmed').length).to.equal(4)
  })

  it('ignores matches', function () {
    this.timeout(40000)
    $$('.col-body').forEach((colBody, i) => {
      colBody.click(`#ignored-${i}`)
    })
    expect($$('.col-body.column-ignored').length).to.equal(4)
  })

  it('undoes matches', function () {
    this.timeout(40000)
    $$('.col-body').forEach((colBody, i) => {
      const toggle = colBody.$('.unmatch-toggle-wrapper')
      toggle.moveToObject()
      toggle.$('.unmatch-toggle').click()
    })
    expect($$('.column-unmatched').length).to.equal(4)
  })

  it('changes matches', function () {
    this.timeout(40000)
    const pattern = {
      suggestedMatch: 'Robot ID Code',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: 'Digital identity',
      percentFill: '100% of your rows have a value for this column',
      duplicate: '',
      validatePreview: '100% of rows fail validation (repair on next step)'
    }
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[4].click()
    new TestColMatch(pattern, 0).testAll()
  })

  it('creates new matches', function () {
    this.timeout(40000)
    const pattern = {
      suggestedMatch: 'test',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: '',
      validatePreview: ''
    }
    const selectWrapper = $$('.Select-multi-value-wrapper')[0]
    selectWrapper.$('.Select-value').click()
    const input = selectWrapper.$('input.Select-input')
    input.waitForEnabled()
    input.addValue('test' + '\uE007')
    new TestColMatch(pattern, 0).testAll()
  })

  it('indicates a pair of duplicate matches', function () {
    this.timeout(40000)
    const pattern1 = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Column C has already been matched to Call Sign.',
      validatePreview: ''
    }
    const pattern2 = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['Killer', 'R2D2', 'Snarlz'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Column A has already been matched to Call Sign.',
      validatePreview: ''
    }
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    new TestColMatch(pattern1, 0).testAll()
    new TestColMatch(pattern2, 2).testAll()
  })

  it('indicates three duplicate matches', function () {
    this.timeout(40000)
    const pattern1b = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Columns B, C have already been matched to Call Sign.',
      validatePreview: ''
    }
    const pattern2b = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['red', 'blue', 'black'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Columns A, C have already been matched to Call Sign.',
      validatePreview: ''
    }
    const pattern3b = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['Killer', 'R2D2', 'Snarlz'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Columns A, B have already been matched to Call Sign.',
      validatePreview: ''
    }
    browser.$$('.Select-value')[0].click()
    let options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.$$('.Select-value')[1].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    new TestColMatch(pattern1b, 0).testAll()
    new TestColMatch(pattern2b, 1).testAll()
    new TestColMatch(pattern3b, 2).testAll()
  })

  it('locks duplicates after confirm', function () {
    this.timeout(40000)
    const pattern = {
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Column C has already been matched to Call Sign',
      validatePreview: ''
    }
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.click('#confirmed-2')
    expect($$('.column-confirmed').length).to.equal(1)
    new TestColMatch(pattern, 0).testLocked()
  })

  it('unlocks duplicates after unconfirm', function () {
    this.timeout(40000)
    const pattern1 = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Column C has already been matched to Call Sign.',
      validatePreview: ''
    }
    const pattern2 = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['Killer', 'R2D2', 'Snarlz'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: 'Column A has already been matched to Call Sign.',
      validatePreview: ''
    }
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.click('#confirmed-2')
    browser.click('#matched-2')
    new TestColMatch(pattern1, 0).testAll()
    new TestColMatch(pattern2, 2).testAll()
  })

  it('disables duplicate indication after ignoring and unmatching other duplicates', function () {
    this.timeout(40000)
    const pattern1b = {
      suggestedMatch: 'Call Sign',
      sampleCols: ['R32 Jingle Bells', '9 Sixty', 'Rack 9823'],
      description: '',
      percentFill: '100% of your rows have a value for this column',
      duplicate: '',
      validatePreview: '100% of rows fail validation (repair on next step)'
    }
    const pattern2b = {
      suggestedMatch: 'Shield Color',
      sampleCols: ['red', 'blue', 'black'],
      percentFill: '100% of your rows have a value for this column'
    }
    browser.$$('.Select-value')[0].click()
    let options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.$$('.Select-value')[1].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.click('.duplicate #ignored-2')
    const toggle = $('.col-body:nth-of-type(2) .unmatch-toggle-wrapper')
    toggle.moveToObject()
    toggle.$('.unmatch-toggle').click()
    new TestColMatch(pattern1b, 0).testAll()
    new TestColMatch(pattern2b, 1).testUnmatched()
    expect(browser.isExisting('.col-body:nth-of-type(3) .column-ignored')).to.equal(true)
  })

  it('passes data through properly', function () {
    this.timeout(40000)
    browser.click('.col-body:nth-of-type(1) #confirmed-0')
    browser.click('.col-body:nth-of-type(2) #ignored-1')
    const toggle = $('.col-body:nth-of-type(4) .unmatch-toggle-wrapper')
    toggle.moveToObject()
    toggle.$('.unmatch-toggle').click()
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    expect(checkRow(1, 3)).to.have.ordered.members(['1', 'R32 Jingle Bells', 'Killer'])
    expect(checkRow(2, 3)).to.have.ordered.members(['2', '9 Sixty', 'R2D2'])
    expect(checkRow(3, 3)).to.have.ordered.members(['3', 'Rack 9823', 'Snarlz'])
    expect(checkRow(4, 3)).to.have.ordered.members(['4', '10 Paws', 'MAXX'])
  })

  it('blocks continue if duplicates present', function () {
    this.timeout(40000)
    browser.$$('.Select-value')[0].click()
    const options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.click('#continue')
    browser.waitForVisible('.flatfile-modal')
    expect(browser.getText('.flatfile-modal h4')).to.have.string('Sorry, there are a couple columns matched to duplicate fields: A, C')
  })

  it('does not block continuing if duplicates are ignored or unmatched', function () {
    this.timeout(40000)
    browser.$$('.Select-value')[0].click()
    let options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.$$('.Select-value')[1].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[3].click()
    browser.click('.duplicate #ignored-2')
    const toggle = $('.col-body:nth-of-type(2) .unmatch-toggle-wrapper')
    toggle.moveToObject()
    toggle.$('.unmatch-toggle').click()
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    expect(checkRow(1, 3)).to.have.ordered.members(['1', 'R32 Jingle Bells', 'octagonal'])
    expect(checkRow(2, 3)).to.have.ordered.members(['2', '9 Sixty', 'square'])
    expect(checkRow(3, 3)).to.have.ordered.members(['3', 'Rack 9823', 'triangle'])
    expect(checkRow(4, 3)).to.have.ordered.members(['4', '10 Paws', 'hexagonal'])
  })
})
