import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import pluralize from 'pluralize'
import md5 from 'md5'
import Papa from 'papaparse'
import Fuse from 'fuse.js'
import 'font-awesome/css/font-awesome.css'
import HotTable from 'react-handsontable'
import { HotTableConfig } from 'config'
import { GenericButton, FooterBrand } from '../../lib/elements'
import { convertToLetters, updateBatchLog, storageAvailable } from '../../lib/functions'

export default class HeaderMatch extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.nextStage = props.nextStage.bind(this)
    this.returnUUID = props.returnUUID.bind(this)
    this.updateMeta = props.updateMeta.bind(this)
    this.toggleProgressOverlay = props.toggleProgressOverlay.bind(this)
    this.rewindStage = props.rewindStage.bind(this)
    this.fuzzyColumnData = this.fuzzyColumnData.bind(this)
    this.defaultColumnData = this.defaultColumnData.bind(this)
    this.state = {
      previewData: props.previewData,
      rawCSV: props.rawCSV,
      fuzziness: props.settings.fuzziness,
      settings: props.settings,
      defaultColumns: props.defaultColumns,
      defaultValidators: props.defaultValidators,
      defaultDescriptions: props.defaultDescriptions,
      dataType: props.dataType,
      shouldRememberHeader: props.shouldRememberHeader
    }
  }

  componentWillMount () {
    if (this.state.shouldRememberHeader) {
      const key = md5(JSON.stringify(this.state.previewData.data[0]))
      if (storageAvailable('localStorage') && typeof window.localStorage[key] !== 'undefined') {
        if (window.localStorage[key] === 'true') {
          this.fuzzyColumnData()
        } else if (window.localStorage[key] === 'false') {
          this.defaultColumnData()
        }
      }
    } else {
      this.setState({ shouldRememberHeader: true })
    }
  }

  componentWillUnmount () {
    this.refs = {}
  }

  componentDidMount () {
    this.toggleProgressOverlay(false)
  }

  defaultColumnData () {
    Papa.parse(this.state.rawCSV, {
      header: false,
      skipEmptyLines: true,
      complete: (results, file) => {
        let columnMeta = []
        let fields = []
        for (let i = 0; i < results.data[0].length; i++) {
          const suggestion = this.state.defaultColumns[i] ? this.state.defaultColumns[i].key : convertToLetters(i + 1)
          const validators = this.state.defaultColumns[i] ? this.state.defaultValidators[this.state.defaultColumns[i].key] : []
          const description = this.state.defaultColumns[i] ? this.state.defaultDescriptions[this.state.defaultColumns[i].key] : ''
          columnMeta.push({
            oldName: convertToLetters(i + 1),
            newName: suggestion,
            suggestedName: suggestion,
            isGenerated: true,
            duplicate: false,
            validators,
            description,
            matchState: suggestion === convertToLetters(i + 1) ? 'unmatched' : 'matched'
          })
          fields.push(suggestion)
        }
        results.meta.fields = fields
        let csvData = { ...results }
        csvData.data = []
        for (let i = 0, row = {}; i < results.data.length; i++) {
          for (let j = 0; j < columnMeta.length; j++) {
            row[columnMeta[j].suggestedName] = results.data[i][j]
          }
          csvData.data.push(row)
          row = {}
        }
        this.rememberHeader(false)
        const data = {
          imported_from_url: document.referrer,
          header_hash: md5(this.state.rawCSV.split(/\r\n|\r|\n/, 1)[0]),
          parsing_config: results.meta
        }
        this.updateMeta(data)
        updateBatchLog(this.returnUUID, data)
        this.nextStage({ columnMeta, csvData, header: false, activeStage: 3 })
      }
    })
  }

  fuzzyColumnData () {
    Papa.parse(this.state.rawCSV, {
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        let columnMeta = []
        let headersRaw = []
        let matchedFields = {}
        const searchOptions = {
          threshold: this.state.fuzziness,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['label', 'key', 'alternates']
        }
        const fuse = new Fuse(this.state.settings.fields, searchOptions)
        for (let i = 0; i < results.meta.fields.length; i++) {
          const searchResults = fuse.search(results.meta.fields[i])
          let suggestion = 'none'
          let validators = []
          let description = ''
          if (searchResults.length &&
            typeof (matchedFields[searchResults[0].key]) === 'undefined') {
            suggestion = searchResults[0].key
            validators = this.state.defaultValidators[searchResults[0].key]
            description = this.state.defaultDescriptions[searchResults[0].key]
            matchedFields[searchResults[0].key] = true
          }
          columnMeta.push({
            oldName: results.meta.fields[i],
            newName: suggestion,
            suggestedName: suggestion,
            duplicate: false,
            validators,
            description,
            matchState: suggestion === 'none' ? 'unmatched' : 'matched'
          })
          headersRaw.push({
            index: i,
            letter: convertToLetters(i + 1),
            value: results.meta.fields[i]
          })
        }
        this.rememberHeader(true)
        const data = {
          headers_raw: headersRaw,
          imported_from_url: document.referrer,
          header_hash: md5(this.state.rawCSV.split(/\r\n|\r|\n/, 1)[0]),
          parsing_config: results.meta
        }
        this.updateMeta(data)
        updateBatchLog(this.returnUUID, data)
        this.nextStage({ columnMeta, csvData: results, header: true, activeStage: 3 })
      }
    })
  }

  rememberHeader (header) {
    if (storageAvailable('localStorage')) {
      const key = md5(JSON.stringify(this.state.previewData.data[0]))
      window.localStorage.setItem(key, header)
    }
  }

  render () {
    return (
      <div class='header-match-stage'>
        <div class='scroll-block'>
          <div class='controlbar top'>
            <h1 class='primary-header'>Bulk Add {pluralize.plural(this.state.dataType)}</h1>
          </div>
          <div class='header-row-select'>
            <aside>
              <h4>Does this row contain column names?</h4>
              <GenericButton id='headerConfirm' title='Yes' classes={['green']} onClick={() => { this.fuzzyColumnData() }} />
              <GenericButton id='headerlessConfirm' title='No' classes={['dark']} onClick={() => { this.defaultColumnData() }} />
            </aside>
            <HotTable
              root='hot'
              ref={node => (this.refs.previewTable = node)}
              settings={{
                licenseKey: HotTableConfig.licenseKey,
                colHeaders: true,
                rowHeaders: true,
                columns: (index) => { return ({ readOnly: true }) },
                data: this.state.previewData.data,
                stretchH: 'all',
                rowHeights: '15px',
                wordWrap: false,
                preventOverflow: 'horizontal'
              }}
            />
          </div>
        </div>
        <div class='controlbar bottom'>
          <FooterBrand />
          <GenericButton id='cancel' title='Go Back' classes={['invert']} onClick={this.rewindStage} />
        </div>
      </div>
    )
  }
}
