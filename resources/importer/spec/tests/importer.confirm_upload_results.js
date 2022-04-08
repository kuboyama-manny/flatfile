/* eslint no-undef: 0 */  // --> OFF
var expect = require('chai').expect
const {
  navigateToImporterFrame,
  replaceText,
  goToMatchStage,
  dialogSubmit,
  clearLocalStorage
} = require('./_helpers')

describe('final submission with default file and fuzzy matching', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('submits with expected output', function () {
    this.timeout(40000)
    clearLocalStorage()
    goToMatchStage('robots clean.csv', false, true)
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
    "sign": "Kill",
    "helmet-style": "octagonal"
  },
  {
    "name": "9 Sixty",
    "shield-color": "blue",
    "sign": "Rest",
    "helmet-style": "square"
  },
  {
    "name": "Rack 9823",
    "shield-color": "black",
    "sign": "Snar",
    "helmet-style": "triangle"
  },
  {
    "name": "10 Paws",
    "shield-color": "fuschia",
    "sign": "MAXX",
    "helmet-style": "hexagonal"
  }
]`
    )
  })

  it('submits with swapped column matching with expected output', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.$$('.Select-value')[0].click()
    let options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[2].click()
    browser.$$('.Select-value')[3].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[0].click()
    browser.$$('.Select-value')[2].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[4].click()
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    replaceText(1, 4, '1')
    replaceText(2, 4, '2')
    replaceText(3, 4, '3')
    replaceText(4, 4, '4')
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
    "helmet-style": "R32 Jingle Bells",
    "shield-color": "red",
    "id": "1",
    "name": "octagonal"
  },
  {
    "helmet-style": "9 Sixty",
    "shield-color": "blue",
    "id": "2",
    "name": "square"
  },
  {
    "helmet-style": "Rack 9823",
    "shield-color": "black",
    "id": "3",
    "name": "triangle"
  },
  {
    "helmet-style": "10 Paws",
    "shield-color": "fuschia",
    "id": "4",
    "name": "hexagonal"
  }
]`
    )
  })

  it('submits with ignored and unmatched columns with expected output', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.click('.col-body:nth-of-type(3) #ignored-2')
    const toggle = $('.col-body:nth-of-type(1) .unmatch-toggle-wrapper')
    toggle.moveToObject()
    toggle.$('.unmatch-toggle').click()
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
    "shield-color": "red",
    "name": "octagonal"
  },
  {
    "shield-color": "blue",
    "name": "square"
  },
  {
    "shield-color": "black",
    "name": "triangle"
  },
  {
    "shield-color": "fuschia",
    "name": "hexagonal"
  }
]`
    )
  })
})

describe('final submission with default file and headerless matching', function () {
  this.retries(2)

  beforeEach(function () {
    navigateToImporterFrame(this)
  })

  it('submits with expected output', function () {
    this.timeout(40000)
    clearLocalStorage()
    goToMatchStage('robots.csv', false, false)
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    replaceText(1, 5, 'four')
    replaceText(2, 5, 'four')
    replaceText(3, 5, 'four')
    replaceText(4, 5, 'four')
    replaceText(5, 5, 'four')
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
    "shield-color": "color",
    "helmet-style": "nick",
    "sign": "four"
  },
  {
    "name": "R32 Jingle Bells",
    "shield-color": "red",
    "helmet-style": "Killer",
    "sign": "four"
  },
  {
    "name": "9 Sixty",
    "shield-color": "blue",
    "helmet-style": "R2D2",
    "sign": "four"
  },
  {
    "name": "Rack 9823",
    "shield-color": "black",
    "helmet-style": "Snarlz",
    "sign": "four"
  },
  {
    "name": "10 Paws",
    "shield-color": "fuschia",
    "helmet-style": "MAXX",
    "sign": "four"
  }
]`
    )
  })

  it('submits with swapped column matching with expected output', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.$$('.Select-value')[0].click()
    let options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[2].click()
    browser.$$('.Select-value')[2].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[0].click()
    browser.$$('.Select-value')[3].click()
    options = browser.$('.Select-menu-outer').$$('.VirtualizedSelectOption')
    options[4].click()
    browser.click('#continue')
    browser.waitForVisible('.validation-edit-stage')
    replaceText(1, 5, '1')
    replaceText(2, 5, '2')
    replaceText(3, 5, '3')
    replaceText(4, 5, '4')
    replaceText(5, 5, '5')
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
    "helmet-style": "name",
    "shield-color": "color",
    "name": "nick",
    "id": "1"
  },
  {
    "helmet-style": "R32 Jingle Bells",
    "shield-color": "red",
    "name": "Killer",
    "id": "2"
  },
  {
    "helmet-style": "9 Sixty",
    "shield-color": "blue",
    "name": "R2D2",
    "id": "3"
  },
  {
    "helmet-style": "Rack 9823",
    "shield-color": "black",
    "name": "Snarlz",
    "id": "4"
  },
  {
    "helmet-style": "10 Paws",
    "shield-color": "fuschia",
    "name": "MAXX",
    "id": "5"
  }
]`
    )
  })

  it('submits with ignored and unmatched columns with expected output', function () {
    this.timeout(40000)
    goToMatchStage('robots.csv', true)
    browser.click('.col-body:nth-of-type(1) #ignored-0')
    const toggle = $('.col-body:nth-of-type(4) .unmatch-toggle-wrapper')
    toggle.moveToObject()
    toggle.$('.unmatch-toggle').click()
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
    "shield-color": "color",
    "name": "nick"
  },
  {
    "shield-color": "red",
    "name": "Killer"
  },
  {
    "shield-color": "blue",
    "name": "R2D2"
  },
  {
    "shield-color": "black",
    "name": "Snarlz"
  },
  {
    "shield-color": "fuschia",
    "name": "MAXX"
  }
]`
    )
  })
})
