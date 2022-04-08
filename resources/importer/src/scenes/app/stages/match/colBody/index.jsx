import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { convertToLetters } from '../../../lib/functions'
import TopRow from './topRow'
import ConfirmMap from './confirmMap'

export default function (props) {
  if (/(matched)|(unmached)|(locked)/i.test(props.columnMeta[props.index].matchState)) {
    let contentrows = []
    for (let i = 0; i < 3; i++) {
      if (props.csvData.data[i + 1]) {
        const offset = props.header ? 2 : 1
        contentrows.push(<ContentRow
          index={i + offset}
          data={props.csvData.data[i][props.column]}
          key={i} />)
      }
    }
    return (
      <div class='col-body'>
        <div class='column'>
          <table>
            <TopRow
              matcher={props.matcher}
              csvData={props.csvData}
              columnMeta={props.columnMeta}
              header={props.header}
              columnOptions={props.columnOptions}
              allowCustom={props.allowCustom}
              keyNames={props.keyNames}
              index={props.index} />
            <tbody>
              {contentrows}
            </tbody>
          </table>
        </div>
        <div class='column'>
          <ConfirmMap
            columnMeta={props.columnMeta}
            columnFill={props.columnFill}
            csvData={props.csvData}
            header={props.header}
            matcher={props.matcher}
            keyNames={props.keyNames}
            index={props.index} />
        </div>
      </div>
    )
  } else if (props.columnMeta[props.index].matchState === 'ignored') {
    return (
      <div class='col-body column-collapsed column-ignored'>
        <div class='column'>
          <div class='ignored-table'>
            <span>{convertToLetters(props.index + 1)}</span>
            <span>{props.columnMeta[props.index].oldName}</span>
          </div>
        </div>
        <div class='column'>
          <ConfirmMap
            columnMeta={props.columnMeta}
            columnFill={props.columnFill}
            csvData={props.csvData}
            header={props.header}
            matcher={props.matcher}
            keyNames={props.keyNames}
            index={props.index} />
        </div>
      </div>
    )
  } else {
    return (
      <div class='col-body column-collapsed'>
        <div class='column'>
          <table>
            <TopRow
              matcher={props.matcher}
              columnMeta={props.columnMeta}
              header={props.header}
              columnOptions={props.columnOptions}
              allowCustom={props.allowCustom}
              keyNames={props.keyNames}
              index={props.index} />
          </table>
        </div>
        <div class='column'>
          <ConfirmMap
            columnMeta={props.columnMeta}
            columnFill={props.columnFill}
            csvData={props.csvData}
            matcher={props.matcher}
            keyNames={props.keyNames}
            index={props.index} />
        </div>
      </div>
    )
  }
}

const ContentRow = (props) => <tr><th>{props.index}</th><td colSpan='2' >{props.data}</td></tr>
