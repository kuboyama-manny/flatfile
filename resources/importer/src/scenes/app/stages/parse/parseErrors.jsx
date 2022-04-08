import { h, Component, render } from 'preact' // eslint-disable-line no-unused-vars
import pluralize from 'pluralize'
import { GenericButton, FooterBrand } from '../../lib/elements'
import Handsontable from 'handsontable-pro'
import HotTable from 'react-handsontable'
import 'handsontable/dist/handsontable.full.css'
import 'font-awesome/css/font-awesome.css'
import { HotTableConfig } from 'config'
import { getWindowHeight } from '../../lib/functions'
import ErrorRowsParser from './errorRowsParser'

export default class ParseErrors extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.rewindStage = props.rewindStage.bind(this)
    this.csvDataUpdate = props.csvDataUpdate.bind(this)
    this.submitChanges = this.submitChanges.bind(this)
    this.customCellRenderer = this.customCellRenderer.bind(this)
    let columns = []
    columns.push({key: 'action', name: ''})
    columns.push({key: 'csvRow', name: 'Row'})
    columns.push({key: 'error', name: 'Error Message'})
    for (let i = 0; i < props.columnMeta.length; i++) {
      const key = props.header
        ? props.columnMeta[i]['oldName']
        : props.columnMeta[i]['suggestedName']
      columns.push({
        key: key,
        name: key
      })
    }
    if (Math.max.apply(Math, props.csvData.data.map((a) => { return Object.keys(a).length })) + 3 > columns.length) {
      columns.push({
        key: '__parsed_extra',
        name: 'Extra Column Data'
      })
    }
    const errors = new ErrorRowsParser(props.csvData.errors, columns, props.csvData)
    const rows = errors.getRows()
    if (!rows.length) { // if the only errors were non-row-specific, rows will be empty, so return to the match stage
      props.csvData.errors = []
      props.csvDataUpdate(props.csvData)
    }
    this.state = {
      csvData: props.csvData,
      errors: props.csvData.errors,
      dataType: props.dataType,
      rows,
      columns
    }
  }

  componentWillMount () {
    const windowHeight = getWindowHeight()
    const tableHeight = windowHeight - 565 > 200 ? windowHeight - 565 : 200
    this.setState({ tableHeight })
  }

  componentWillUnmount () {
    this.refs = {}
  }

  changeAction (row, action) {
    let rows = this.state.rows.slice()
    rows[row].action = action
    this.setState({ rows })
  }

  submitChanges () {
    let csvData = {...this.state.csvData}
    for (let i = this.state.rows.length - 1; i >= 0; i--) {
      if (this.state.rows[i].action === 'IGNORE') {
        csvData.data.splice(this.state.errors[i].row, 1)
      } else if (this.state.rows[i].action === 'INCLUDE') {
        csvData.data[this.state.errors[i].row] = this.state.rows[i]
        delete csvData.data[this.state.errors[i].row].action
        delete csvData.data[this.state.errors[i].row].error
        delete csvData.data[this.state.errors[i].row].csvRow
        delete csvData.data[this.state.errors[i].row].__parsed_extra
      }
    }
    csvData.errors = []
    this.csvDataUpdate(csvData)
  }

  customCellRenderer (instance, td, row, col, prop, value = '', cellProperties) {
    if (col === 0) {
      const action = value === 'INCLUDE' ? 'IGNORE' : 'INCLUDE'
      const title = action === 'INCLUDE' ? 'Include this row?' : 'Ignore this row?'
      Handsontable.dom.empty(td)
      render((<i title={title} className={value === 'INCLUDE' ? 'fa fa-trash' : 'fa fa-check-square'} onClick={() => this.changeAction(row, action)} />), td)
    } else {
      td.innerHTML = value
    }
    if (this.state.rows[row].action === 'IGNORE') {
      td.classList.add('row-ignored')
    }
    return td
  }

  render () {
    return (
      <div class='parse-error-stage'>
        <div class='scroll-block'>
          <div class='controlbar top'>
            <h1 class='primary-header'>Bulk Add {pluralize.plural(this.state.dataType)}</h1>
          </div>
          <div class='notice'>
            <h2 class='secondary-header'>Parsing Errors</h2>
            <p class='paragraph'>The CSV-to-JSON parser tracked some anomalies in your CSV file. The errors were not fatal, but you can review them below and choose to edit them before including them in your data set, or you can choose to ignore them and they will be skipped.</p>
          </div>
          <div class='parse-error-tables'>
            <HotTable
              root='hot'
              ref={node => { this.refs.errorTable = node }}
              settings={{
                licenseKey: HotTableConfig.licenseKey,
                colHeaders: (index) => {
                  if (index < this.state.columns.length) {
                    return this.state.columns[index].name
                  }
                },
                columns: (index) => {
                  if (index < this.state.columns.length) {
                    return {
                      data: this.state.columns[index].key,
                      renderer: this.customCellRenderer,
                      readOnly: index < 3,
                      disableVisualSelection: index < 3
                    }
                  }
                },
                data: this.state.rows,
                stretchH: 'all',
                undo: true,
                height: this.state.tableHeight,
                manualColumnResize: true,
                rowHeights: '15px',
                wordWrap: false,
                manualRowResize: true,
                contextMenu: {
                  callback: (key, options) => {
                    if (key === 'ignore') {
                      this.changeAction(options.start.row, 'IGNORE')
                    } else if (key === 'include') {
                      this.changeAction(options.start.row, 'INCLUDE')
                    }
                  },
                  items: {
                    'ignore': {name: 'Ignore this row'},
                    'include': {name: 'Include with edits'}
                  }
                }
              }}
            />
          </div>
        </div>
        <div class='controlbar bottom'>
          <FooterBrand />
          <GenericButton id='cancel' title='Go Back' classes={['invert']} onClick={this.rewindStage} />
          <GenericButton id='continue' title='Continue' classes={['blue']} onClick={this.submitChanges} />
        </div>
      </div>
    )
  }
}
