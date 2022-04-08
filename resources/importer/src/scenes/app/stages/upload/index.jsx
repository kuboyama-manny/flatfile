import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import Papa from 'papaparse'
import pluralize from 'pluralize'
import axios from 'axios'
import FormData from 'form-data'
import Dropzone from 'react-dropzone'
import 'font-awesome/css/font-awesome.css'
import HotTable from 'react-handsontable'
import { HotTableConfig, PostConfig } from 'config'
import { GenericButton, FooterBrand } from '../../lib/elements'
import { checkStatus, getRealElementHeight, updateBatchLog } from '../../lib/functions'

export default class Uploader extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.csvLoad = props.csvLoad.bind(this)
    this.updateMeta = props.updateMeta.bind(this)
    this.asyncSetState = props.asyncSetState.bind(this)
    this.returnUUID = props.returnUUID.bind(this)
    this.uploadLogUpdate = props.uploadLogUpdate.bind(this)
    this.toggleProgressOverlay = props.toggleProgressOverlay.bind(this)
    this.nextStage = props.nextStage.bind(this)
    this.openModal = props.openModal.bind(this)
    this.rewindStage = props.rewindStage.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.isInitialTableEmpty = this.isInitialTableEmpty.bind(this)
    this.submitPastedData = this.submitPastedData.bind(this)
    this.state = {
      files: props.files,
      batchConfig: props.batchConfig,
      settings: props.settings,
      accept: props.accept,
      initialColumns: props.defaultColumns.slice(),
      initialRows: props.defaultRows.slice(),
      defaultColumns: props.defaultColumns,
      defaultDescriptions: props.defaultDescriptions,
      defaultValidators: props.defaultValidators,
      clientID: props.clientID,
      dataType: props.dataType,
      tableHeight: 400
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.files > this.state.files) {
      this.setState({ files: nextProps.files })
      this.handleFiles(nextProps.files)
    }
  }

  componentWillUnmount () {
    this.refs = {}
  }

  componentDidMount () {
    this.toggleProgressOverlay(false)
  }

  onDrop (acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length) {
      this.uploadLogUpdate(this.state.clientID, 'File Uploader Button', 'Successfully uploaded', acceptedFiles)
      this.handleFiles(acceptedFiles)
    } else if (rejectedFiles.length) {
      this.uploadLogUpdate(this.state.clientID, 'File Uploader Button', 'Rejected due to wrong filetype', rejectedFiles)
      this.openModal(`The filetype was not accepted! Please upload a file with one of the following extensions: ${this.state.accept.replace(/,/g, ', ')}`)
    }
  }

  handleFiles (files) {
    const file = files[0]
    if (window.FileReader) {
      this.postLog(file.name, false, null, null, file)
      if (file.name.match(/(\.csv)|(\.tsv)$/)) {
        this.convertToTextFromCSV(file)
      } else {
        this.getCSVFromXLS(file)
      }
    } else {
      this.uploadLogUpdate(this.state.clientID, 'File Handler', 'Cannot read file as text due to lack of FileReader in the browser', files)
      this.openModal('FileReader is not supported in this browser.')
    }
  }

  async saveFileToS3 (file, url) {
    axios.put(url, file, { headers: {'Content-Type': 'text/csv'}, responseType: 'text' })
    .then(checkStatus)
    .then(async (response) => {
      const uuid = await this.returnUUID()
      axios.post(`${PostConfig.root_url}/public-api/batches/${uuid}/link-csv`, {},
        { headers: {'License-Key': window.FF_LICENSE_KEY} }
      )
      .then(checkStatus)
      .then((response) => {
        this.updateMeta({originalFile: response.data})
      }).catch((error) => {
        console.warn('post request failed to request link-csv', error)
      })
    }).catch((error) => {
      console.warn('post request failed to save file to S3', error)
    })
  }

  async getCSVFromXLS (file) {
    const uuid = await this.returnUUID()
    const data = new FormData()
    data.append('attachment', file)
    axios({
      method: 'post',
      url: `${PostConfig.root_url}/public-api/batches/${uuid}/transform-xls`,
      headers: {...data.getHeaders, 'License-Key': window.FF_LICENSE_KEY},
      data
    })
      .then(checkStatus)
      .then(async (response) => {
        const data = response.data.data
        // const errors = this.validateCSV({data: '', headers: {'content-type': 'something else'}}) // for testing
        const csv = await axios.get(data.csv.url)
        const errors = this.validateCSV(csv)
        if (errors.length) {
          throw new Error(errors.join(', '))
        } else {
          this.updateMeta({originalFile: data.original, csvFile: data.csv})
          this.previewCSV(csv.data)
        }
      })
      .catch((error) => {
        console.warn('xls conversion to csv errored:', error)
        this.openModal(
          <span>{`Sorry for the inconvenience. The XLS file you uploaded may be using features that make it difficult
            for us to extract the correct data. In order to continue, save your XLS file as a CSV and re-upload.
            Here are some instructions:`}
            <br /><br />
            <a target='_blank' href='https://www.ablebits.com/office-addins-blog/2014/04/24/convert-excel-csv/'>
              {'Read instructions on exporting a CSV from Excel '}&rarr;
            </a>
          </span>
        )
      })
  }

  validateCSV (response) {
    const errors = []
    if (!response.data.length) {
      errors.push('csv is empty')
    }
    if (!/(csv)|(x-comma-separated-values)/.test(response.headers['content-type'])) {
      errors.push('unexpected content-type')
    }
    return errors
  }

  convertToTextFromCSV (file) {
    window.URL.revokeObjectURL(file.preview)
    var reader = new window.FileReader()
    reader.onerror = (...args) => this.errorHandler(...args)
    reader.onload = (event) => { this.previewCSV(event.target.result) }
    reader.readAsText(file)
  }

  errorHandler (evt) {
    this.uploadLogUpdate(this.state.clientID, 'FileReader', 'FileReader cannot read the file: ' + evt.target.error)
    if (evt.target.error.name === 'NotReadableError') {
      this.openModal('Cannot read file!')
    }
  }

  previewCSV (rawCSV) {
    Papa.parse(rawCSV, {
      header: false,
      preview: 5,
      skipEmptyLines: true,
      complete: (results, file) => {
        this.submitFile(rawCSV, results)
      }
    })
  }

  postLog (filename, manual, countRows, countColumns, file) {
    const createdAt = new Date().toISOString()
    const data = {
      filename,
      manual,
      managed: this.state.settings.managed,
      created_at: createdAt
    }
    if (countRows && countColumns) {
      data.count_rows = countRows
      data.count_columns = countColumns
    }
    this.updateMeta(data)
    axios({
      method: 'post',
      url: `${PostConfig.root_url}/public-api/batches`,
      headers: {'License-Key': window.FF_LICENSE_KEY},
      data
    })
    .then(checkStatus)
    .then((response) => {
      if (filename.match(/(\.csv)|(\.tsv)$/) && this.state.settings.managed && response.headers['x-signed-upload-url']) {
        this.saveFileToS3(file, response.headers['x-signed-upload-url'])
      }
      return response.data
    })
    .then((data) => {
      if (data.errors) {
        console.warn('post request succeeded but license was invalid', data)
      } else {
        this.asyncSetState({ uuid: data.id })
        return data
      }
    }).catch((error) => {
      console.warn('post request failed', error)
    })
  }

  submitFile (rawCSV, results) {
    this.csvLoad()
    const data = {count_rows: rawCSV.split(/\r\n|\r|\n/).length, count_columns: results.data[0].length}
    updateBatchLog(this.returnUUID, data)
    this.updateMeta(data)
    this.nextStage({
      rawCSV,
      previewData: results,
      activeStage: 2
    })
  }

  submitPastedData () {
    const data = this.refs.initialTable.hotInstance.getData()
    const rows = data.reduce((acc, row) => {
      if (Object.keys(row).some(key => row[key])) {
        acc.push(this.state.defaultColumns.reduce((a, c, i) => {
          a[c.key] = typeof row[i] === 'string' ? row[i] : ''
          return a
        }, {}))
      }
      return acc
    }, [])
    const columnMeta = this.state.defaultColumns.map(col => {
      return {
        newName: col.key,
        matchState: 'confirmed',
        description: this.state.defaultDescriptions[col.key]
      }
    })
    if (rows.length) {
      this.postLog('', true, rows.length, this.state.defaultColumns.length)
      this.nextStage({
        newData: { rows, columns: this.state.defaultColumns },
        activeStage: 4,
        columnMeta
      })
    }
  }

  isInitialTableEmpty () {
    if (this.refs.initialTable) {
      return this.refs.initialTable.hotInstance.countEmptyCols() === this.state.defaultColumns.length
    }
  }

  render () {
    return (
      <div class='uploader-stage'>
        <div class='scroll-block'>
          <h1 class='primary-header'>Bulk Add {pluralize.plural(this.state.dataType)}</h1>
          <Dropzone
            style={{}}
            ref={node => { this.refs.dropZoneRef = node }}
            onDrop={this.onDrop}
            multiple={false}
            accept={this.props.accept} />
          <div class='notice'>
            <FileUploader accept={this.state.accept.replace(/,/g, ', ')} onClick={() => { this.refs.dropZoneRef.open() }} />
            <p class='notice-right paragraph'>{`You can upload any ${this.state.accept.replace(/,/g, ', ')} file with any set of columns as long as it has 1 record per row. The next step will allow you to match your spreadsheet columns to the right data points. You'll be able to clean up or remove any corrupted data before finalizing your report.`}</p>
          </div>
          <h2 class='secondary-header'>...or just manually enter your data here:</h2>
          <div class='handsontable-container'>
            <HotTable root='hot' ref={(node) => { this.refs.initialTable = node }} settings={{
              licenseKey: HotTableConfig.licenseKey,
              data: this.state.initialRows,
              colHeaders: (index) => {
                if (index < this.state.initialColumns.length) {
                  const colKey = this.state.initialColumns[index].key
                  const isRequired = this.state.defaultValidators[colKey].findIndex(v => v.validate === 'required') > -1
                  const colHeight = this.state.defaultDescriptions[colKey] && this.refs.initialTable.hotInstance
                  ? `${getRealElementHeight(this.state.defaultDescriptions[colKey], this.refs.initialTable.hotInstance.getColWidth(index))}px`
                  : '15px'
                  return this.state.defaultDescriptions[colKey] && this.refs.initialTable.hotInstance
                  ? `<span class='col-desc-wrapper'>
                    <div class='${isRequired ? 'col-required' : ''}'>${this.state.initialColumns[index].name}</div>
                    <div class='col-desc' style='max-width:${Math.min(300, this.refs.initialTable.hotInstance.getColWidth(index))}px;height:${colHeight}'>${this.state.defaultDescriptions[colKey]}</div>
                  </span>`
                  : `<span class='${isRequired ? 'col-required' : ''}'>${this.state.initialColumns[index].name}</span>`
                }
              },
              columns: (index) => {
                if (index < this.state.initialColumns.length) {
                  return {
                    data: this.state.initialColumns[index].key,
                    allowInvalid: true,
                    readOnly: false
                  }
                }
              },
              afterChange: (changes, source) => {
                if (this.refs.initialTable && changes) {
                  const { hotInstance } = this.refs.initialTable
                  const rowCount = hotInstance.countRows()
                  if (rowCount - 1 === (changes[0][0])) {
                    hotInstance.alter('insert_row')
                    const tableHeight = this.state.tableHeight + 40
                    this.setState({ tableHeight })
                  }
                }
              },
              height: this.state.tableHeight,
              copyPaste: true,
              manualColumnResize: true,
              manualRowResize: true,
              allowRemoveRow: true,
              observeChanges: true,
              undo: true,
              rowHeights: '15px',
              wordWrap: false,
              stretchH: 'all',
              contextMenu: ['row_above', 'row_below', 'remove_row', 'undo', 'redo'],
              renderAllRows: true,
              preventOverflow: 'horizontal'
            }} />
          </div>
        </div>
        <div class='controlbar bottom'>
          <FooterBrand />
          <GenericButton id='cancel' classes={['invert']} title='Clear Data' onClick={() => {
            if (!this.isInitialTableEmpty()) {
              this.rewindStage()
            }
          }} />
          <GenericButton id='continue' classes={['blue']} title='Continue' onClick={() => {
            if (this.isInitialTableEmpty()) {
              this.openModal('There is no data pasted to be submitted!')
            } else { this.submitPastedData() }
          }} />
        </div>
      </div>
    )
  }
}

export const FileUploader = (props) =>
  <div class='file-uploader'>
    <button onClick={props.onClick} class='button blue icon-upload'>Upload Data from File</button>
    <p>{`${props.accept} spreadsheets accepted.`}</p>
  </div>
