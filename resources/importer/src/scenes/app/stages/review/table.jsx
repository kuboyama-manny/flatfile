import { h, Component, render } from 'preact' // eslint-disable-line no-unused-vars
import Handsontable from 'handsontable-pro'
import HotTable from 'react-handsontable'
import 'handsontable/dist/handsontable.full.css'
import '../../lib/polyfills'
import { getWindowHeight, getWindowWidth, getRealStringLength, getRealElementHeight, removeElementsByClass } from '../../lib/functions'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { HotTableConfig } from 'config'

export default class HoT extends Component {
  constructor (props) {
    super(props)
    this.refs = {}
    this.t0 = props.t0
    this.t1 = 0
    this.customRenderer = this.customRenderer.bind(this)
    this.excludeRow = this.excludeRow.bind(this)
    this.columnWidths = []
    this.validate = props.validate
    this.onEdit = props.onEdit
    this.isReloading = props.isReloading
    this.state = {
      columns: props.columns,
      rows: props.rows,
      filteredRows: props.filteredRows,
      columnMeta: props.columnMeta,
      tableHeight: 500
    }
  }

  componentWillMount () {
    this.setColumnWidths()
    Handsontable.renderers.registerRenderer('ff.custom', this.customRenderer)
    const windowHeight = getWindowHeight()
    const tableHeight = windowHeight - 385 > 200 ? windowHeight - 385 : 200
    this.setState({ tableHeight })
  }

  componentWillReceiveProps (nextProps) {
    const { filteredRows } = this.state.filteredRows
    if (nextProps.filteredRows !== filteredRows) {
      this.setState({ filteredRows: nextProps.filteredRows })
    }
    if (nextProps.t0 !== this.t0) {
      this.t0 = nextProps.t0
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.filteredRows !== this.state.filteredRows || nextProps.t0 !== this.t0
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.rows !== this.validate.rows) {
      this.validate.rows = nextState.rows
    }
    if (nextState.columns !== this.validate.columns) {
      this.validate.columns = nextState.columns
    }
    if (nextProps.rows !== this.validate.rows) {
      this.validate.rows = nextProps.rows
    }
    if (nextProps.columns !== this.validate.columns) {
      this.validate.columns = nextProps.columns
    }
    this.isReloading(true)
  }

  componentWillUnmount () {
    this.refs = {}
  }

  setColumnWidths () {
    this.columnWidths = this.calculateColumnWidths()
  }

  getSampleRows () {
    const rowCount = this.state.rows.length
    let sampleRows = []
    sampleRows.push(this.state.columns.map(v => v.name + (v.validators.findIndex(v => v.validate === 'required') > -1 ? 'XrequiredX' : '')))
    const sampleNumber = rowCount > 1000 ? rowCount * 0.01 : rowCount
    if (rowCount > 1000) {
      for (let i = 0; i < sampleNumber; i++) {
        sampleRows.push(this.state.rows[Math.floor(Math.random() * rowCount)])
      }
    } else {
      sampleRows = [...sampleRows, ...this.state.rows]
    }
    return sampleRows
  }

  calculateColumnWidths (sampleRows) {
    const basicWidths = this.calculateBasicColumnWidths(this.getSampleRows())
    const totalWidth = basicWidths.reduce((a, v) => a + v)
    const tableWidth = getWindowWidth() - 160
    if (totalWidth < tableWidth) {
      return this.expandWidths(basicWidths, totalWidth, tableWidth)
    } else {
      return basicWidths
    }
  }

  expandWidths (basicWidths, totalWidth, tableWidth) {
    const columnWidths = basicWidths.map((v, i) => {
      if (i === 0) {
        return v
      } else {
        return v + ((tableWidth - totalWidth) / (basicWidths.length - 1))
      }
    })
    return columnWidths
  }

  calculateBasicColumnWidths (sampleRows) {
    return sampleRows.reduce((acc, row, i) => {
      acc = Object.keys(row).map((key, j) => {
        const value = key === '$meta' ? row[key].index.toString() : row[key]
        if (i > 0) {
          return acc[j].length > value.length ? acc[j] : value
        } else {
          return value
        }
      })
      return acc
    }, []).map(c => { return Math.min(getRealStringLength(c), 300) })
  }

  customRenderer (hotInstance, td, row, column, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    const meta = this.state.filteredRows[row].$meta
    const vState = this.validate.validationState[meta.index]
    if (prop === '$meta' && typeof meta.index === 'number') {
      td.innerHTML = meta.index + 1
    } else if (prop === '$meta' && typeof meta.index !== 'number') {
      td.innerHTML = 'All of your rows pass validation!'
      td.classList.add('valid-data-message')
    } else if (vState && vState[column].errors.length) {
      hotInstance.setCellMeta(row, column, 'valid', false)
      td.classList.add('htInvalid')
      while (td.firstChild) { td.removeChild(td.firstChild) }
      render((<CellErrorTooltip error={vState[column].errors.join(', ')} value={value} />), td)
    } else {
      hotInstance.setCellMeta(row, column, 'valid', true)
      td.classList.remove('htInvalid')
      td.innerHTML = value
    }
    if (meta.deleted) {
      td.classList.add('excluded')
      td.classList.remove('htInvalid')
    } else {
      td.classList.remove('excluded')
    }
    return td
  }

  excludeRow (i, deleted) {
    const { rows } = this.state
    rows[i].$meta.deleted = deleted
    this.t0 = window.performance.now()
    this.setState({ rows })
    const index = rows[i].$meta.index
    this.validate.updateCell(index, 0, {index, deleted})
    removeElementsByClass('tooltip')
    this.refs.table.hotInstance.render()
  }

  render () {
    return (
      <div class='handsontable-container'>
        <HotTable root='hot' ref={node => (this.refs.table = node)} settings={{
          licenseKey: HotTableConfig.licenseKey,
          data: this.state.filteredRows,
          colHeaders: (index) => {
            if (index < this.state.columns.length) {
              const col = this.state.columnMeta[index]
              const isRequired = this.state.columns[index].validators.findIndex(v => v.validate === 'required') > -1
              const colHeight = col.description
              ? `${getRealElementHeight(col.description, this.columnWidths[index])}px`
              : '15px'
              return col.description
              ? `<span class='col-desc-wrapper'>
                <div class='${isRequired ? 'col-required' : ''}'>${this.state.columns[index].name}</div>
                <div class='col-desc' style='max-width:${Math.min(300, this.columnWidths[index])}px;height:${colHeight}'>${col.description}</div>
              </span>`
              : `<span class='${isRequired ? 'col-required' : ''}'>${this.state.columns[index].name}</span>`
            }
          },
          columns: (index) => {
            if (index < this.state.columns.length) {
              if (this.state.columns[index].key === '$meta') {
                return {
                  data: '$meta',
                  readOnly: true,
                  copyable: false,
                  renderer: 'ff.custom',
                  disableVisualSelection: true
                }
              }
              return {
                data: this.state.columns[index].key,
                readOnly: false,
                renderer: 'ff.custom',
                allowEmpty: !this.state.columns[index].validators.findIndex(v => v.validate === 'required')
              }
            }
          },
          afterChange: (changes, source) => {
            if (this.refs.table && changes) {
              const hotInstance = this.refs.table.hotInstance
              this.onEdit()
              const row = changes[0][0]
              const trueRow = this.state.filteredRows[row].$meta.index
              const col = hotInstance.propToCol(changes[0][1])
              this.t0 = window.performance.now()
              this.validate.updateCell(trueRow, col, changes[0][3])
              removeElementsByClass('tooltip')
              hotInstance.render()
            }
          },
          beforePaste: (data, coords) => {
            const tableLength = this.refs.table.hotInstance.countRows()
            const overflowLength = tableLength - coords[0].endRow
            if (overflowLength > 0) {
              data.splice(overflowLength, data.length - overflowLength)
            }
          },
          afterPaste: (data, coords) => {
            const { startRow, endRow, startCol, endCol } = coords[0]
            for (let i = startRow, a = 0; i <= endRow; i++) {
              for (let j = startCol, b = 0; j <= endCol; j++) {
                this.validate.updateCell(this.state.filteredRows[i].$meta.index, j, data[a][b])
                b++
              }
              a++
            }
            removeElementsByClass('tooltip')
            this.refs.table.hotInstance.render()
          },
          afterRemoveRow: (index, amount) => {
            this.onEdit()
            this.validate.removeRow(index, amount)
          },
          afterScrollVertically: () => {
            const tooltips = document.getElementsByClassName('tooltip')
            for (let i = 0; i < tooltips.length; i++) {
              const element = tooltips.item(i)
              element.parentNode.removeChild(element)
            }
            removeElementsByClass('tooltip')
            this.t0 = window.performance.now()
          },
          afterScrollHorizontally: () => {
            this.t0 = window.performance.now()
          },
          afterRender: () => {
            this.isReloading(false)
            // console.info(`table rendered in ${window.performance.now() - this.t0}ms`) // uncomment for rendering performance benchmarks
          },
          contextMenu: {
            callback: (key, options) => {
              const hotInstance = this.refs.table.hotInstance
              if (key === 'exclude_row') {
                setTimeout(() => {
                  this.excludeRow(hotInstance.getSelected()[0], true)
                }, 100)
              } else if (key === 'include_row') {
                setTimeout(() => {
                  this.excludeRow(hotInstance.getSelected()[0], false)
                }, 100)
              }
            },
            items: {
              'exclude_row': {
                name: 'Exclude this row',
                disabled: () => {
                  return this.state.rows[this.refs.table.hotInstance.getSelected()[0]].$meta.deleted
                }
              },
              'include_row': {
                name: 'Include this row',
                disabled: () => {
                  return !this.state.rows[this.refs.table.hotInstance.getSelected()[0]].$meta.deleted
                }
              }
            }
          },
          hiddenColumn: 0,
          mergeCells: this.state.filteredRows.length ? true : [{row: 0, col: 0, rowspan: 1, colspan: this.state.columns.length}],
          minRows: 1,
          scrollV: 'auto',
          copyPaste: true,
          height: this.state.tableHeight,
          viewportRowRenderingOffset: 3,
          colWidths: this.columnWidths,
          autoColumnSize: false,
          manualColumnResize: true,
          manualRowResize: true,
          allowRemoveRow: true,
          rowHeights: '15px',
          wordWrap: false,
          undo: true,
          stretchH: 'all'
        }} />
      </div>
    )
  }
}

const CellErrorTooltip = (props) =>
  <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip`}>{props.error}</Tooltip>}>
    <span class='htInvalid-value'>{props.value}</span>
  </OverlayTrigger>
