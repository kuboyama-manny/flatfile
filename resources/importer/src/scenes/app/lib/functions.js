import axios from 'axios'
import { PostConfig } from 'config'

export function getRealStringLength (string) {
  const element = document.createElement('span')
  element.appendChild(document.createTextNode(string))
  element.classList.add('char-ruler')
  document.getElementsByClassName('flatfile-root')[0].appendChild(element)
  const length = element.offsetWidth + 28
  element.parentNode.removeChild(element)
  return length
}

export function getRealElementHeight (string, width) {
  const element = document.createElement('span')
  element.appendChild(document.createTextNode(string))
  element.classList.add('char-height-ruler')
  element.style.width = `${width}px`
  document.getElementsByClassName('flatfile-root')[0].appendChild(element)
  const height = element.offsetHeight
  element.parentNode.removeChild(element)
  return height
}

export function removeElementsByClass (className) {
  const elements = document.getElementsByClassName(className)
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0])
  }
}

export function storageAvailable (type) {
  let storage
  try {
    storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return e instanceof DOMException && ( // eslint-disable-line no-undef
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
  }
}

export function emailValidator (value, callback) {
  callback(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) // eslint-disable-line no-useless-escape
}

export function convertToLetters (number) {
  const baseChar = ('A').charCodeAt(0)
  let letters = ''
  do {
    number -= 1
    letters = String.fromCharCode(baseChar + (number % 26)) + letters
    number = (number / 26) >> 0
  } while (number > 0)
  return letters
}

export function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export async function updateBatchLog (returnUUID, updates) {
  const uuid = await returnUUID()
  const response = await axios({
    method: 'patch',
    url: `${PostConfig.root_url}/public-api/batches/${uuid}`,
    headers: {'License-Key': window.FF_LICENSE_KEY},
    data: updates
  })
    .then(checkStatus)
    .then((response) => {
      return response.data
    })
    .then((data) => {
      // console.log('patch request succeeded with JSON response', data.data)
      return data.data
    }).catch((error) => {
      console.log('patch request failed', error)
    })
  return response
}

export function arrayDiff (a, b) {
  return a.filter((i) => b.indexOf(i) < 0)
}

export function getWindowHeight () {
  return (window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight)
}

export function getWindowWidth () {
  return (window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth)
}

export function precisionRound (number, precision) {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

export function processData (header, columnMeta, csvData, keyNames) {
  let newData = {
    rows: [],
    columns: []
  }
  let headersMatched = []
  for (let i = 0; i < csvData.meta.fields.length; i++) {
    if (!columnMeta[i].duplicate && (columnMeta[i].matchState === 'confirmed' || columnMeta[i].matchState === 'matched')) {
      const columnName = columnMeta[i].newName
      newData.columns.push({
        key: columnName,
        name: keyNames[columnName],
        validators: columnMeta[i].validators
      })
      headersMatched.push({
        index: i,
        value: header ? columnMeta[i].oldName : null,
        matched_key: columnName
      })
    }
  }
  for (let j = 0, row = {}; j < csvData.data.length; j++) {
    for (let k = 0; k < columnMeta.length; k++) {
      if (!columnMeta[k].duplicate && (columnMeta[k].matchState === 'confirmed' || columnMeta[k].matchState === 'matched')) {
        row[columnMeta[k].newName] = header ? csvData.data[j][columnMeta[k].oldName] : csvData.data[j][columnMeta[k].suggestedName]
      }
    }
    newData.rows.push(row)
    row = {}
  }
  return ({ newData, headersMatched })
}
