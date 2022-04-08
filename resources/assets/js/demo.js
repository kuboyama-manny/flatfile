import CodeMirror from 'codemirror'
import marked from 'marked'

// Codemirror setup
require('codemirror/mode/javascript/javascript')
var code = document.getElementById('basic')
var emailValidationTab = document.getElementById('email')
var emailValidation = document.getElementById('example-two')
var content = document.getElementById('example-one')
var primaryCodeMirror = CodeMirror(code, {
  autofocus: true,
  lineNumbers: true,
  lineWrapping: true,
  lint: true,
  gutters: ['CodeMirror-lint-markers'],
  mode: { name: 'javascript' },
  theme: 'oceanic-next',
  value: content.value
})
var emailValidationExample = CodeMirror(emailValidationTab, {
  autofocus: true,
  lineNumbers: true,
  lineWrapping: true,
  lint: true,
  gutters: ['CodeMirror-lint-markers'],
  mode: { name: 'javascript' },
  theme: 'oceanic-next',
  value: content.value
})
var jsonExample = document.getElementById('json-example')
var jsonOutput = document.getElementById('jsonOutput')
var outputCodeMirror = CodeMirror(jsonOutput, {
  autofocus: true,
  lineNumbers: true,
  lineWrapping: true,
  mode: { name: 'javascript' },
  theme: 'oceanic-next',
  value: jsonExample.value
})
// Documentation setup
fetch('/docs/fields.md')
  .then(response => response.text())
  .then(text => (document.getElementById('fieldDocs').innerHTML = marked(text)))
fetch('/docs/options.md')
  .then(response => response.text())
  .then(text => (document.getElementById('optionDocs').innerHTML = marked(text)))
// Intercom trigger
var helpBtn = document.getElementById('help')
helpBtn.onclick = function () {
  Intercom('showNewMessage')
}
// Toggle output/docs
var output = document.getElementById('output')
var documentation = document.getElementById('documentation')
output.onclick = function () {
  if (this.classList.contains('shut')) {
    this.classList.remove('shut')
    documentation.classList.add('shut')
  }
  outputCodeMirror.refresh()
}
documentation.onclick = function () {
  if (this.classList.contains('shut')) {
    this.classList.remove('shut')
    output.classList.add('shut')
  }
}
// Importer hooks
var openImporter = document.getElementsByClassName('open-importer')
var errContainer = document.getElementById('error-container')
var robotImporter = `
robotImporter.open()
setTimeout(function() {
  $('.example-file-container').addClass('show')
}, 2600)
robotImporter.on('complete', function (users, meta) {
  $('.example-file-container').removeClass('show')
  robotImporter.close()
  output.classList.remove('shut')
  documentation.classList.add('shut')
  outputCodeMirror.setValue(JSON.stringify(users, null, 2))
})
robotImporter.on('close', function () {
  $('.example-file-container').removeClass('show')
})
`
for (var i = 0; i < openImporter.length; i++) {
  openImporter[i].onclick = function () {
    var importer = document.getElementsByClassName('flatfile-component')[0]
    var demoCode = primaryCodeMirror.getValue()
    var lintErr = document.getElementById('lint-error')
    demoCode = demoCode.concat(robotImporter)
    if (importer) {
      $(importer).remove()
    }
    try {
      errContainer.classList.remove('show')
      eval(demoCode)
    } catch (e) {
      lintErr.innerHTML = e.message
      errContainer.classList.add('show')
    }
    errContainer.onclick = function () {
      errContainer.classList.remove('show')
    }
  }
}

$('.dismiss, #download').click(function () {
  $('.example-file-container').removeClass('show')
})
