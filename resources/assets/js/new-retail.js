import $ from 'jquery'

$(document).ready(function () {
  var mobileMenu = $('.svg-container')
  var mobileList = $('ul.mobile')
  var navClose = $('#navClose')

  mobileMenu.click(function () {
    if (mobileList.hasClass('show')) {
      mobileList.removeClass('show')
      mobileList.addClass('hide')
    } else {
      mobileList.removeClass('hide')
      mobileList.addClass('show')
    }
  })

  navClose.click(function () {
    if (mobileList.hasClass('show')) {
      mobileList.removeClass('show')
      mobileList.addClass('hide')
    } else {
      mobileList.removeClass('hide')
      mobileList.addClass('show')
    }
  })
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  })
  $('#help-btn').click(function () {
    Intercom('showNewMessage')
    return false
  })
})
