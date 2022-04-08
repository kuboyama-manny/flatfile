import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import ReactHover from 'react-hover-observer'
import { convertToLetters } from '../../../lib/functions'
import FieldOptions from './fieldOptions'

export default function (props) {
  const nameIndex = 'edit-column-name-' + props.index
  const columnName = convertToLetters(props.index + 1) === props.columnMeta[props.index].oldName
    ? ''
    : props.columnMeta[props.index].oldName
  return (
    <thead>
      <tr>
        <th>{convertToLetters(props.index + 1)}</th>
        <th>{columnName}</th>
        <th>
          <ReactHover className={'unmatch-toggle-wrapper'} onClick={() => props.matcher.undoMatch(props.index)}>
            <UnmatchToggle unmatched={props.columnMeta[props.index].newName === 'none'} />
          </ReactHover>
          <FieldOptions
            matcher={props.matcher}
            columnName={props.columnMeta[props.index].newName}
            originalName={props.columnMeta[props.index].oldName}
            defaultName={props.columnMeta[props.index].newName}
            header={props.header}
            index={props.index}
            columnOptions={props.columnOptions}
            keyNames={props.keyNames}
            allowCustom={props.allowCustom}
            nameIndex={nameIndex} />
        </th>
      </tr>
    </thead>
  )
}

const UnmatchToggle = ({ isHovering = false, onClick, unmatched }) => {
  if (unmatched) {
    return <i class='fa fa-search' />
  }
  return (isHovering
    ? <button class='unmatch-toggle' onClick={onClick}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <path fill='#000' fill-rule='nonzero' d='M94.3 0c-1.5 0-3 .6-4 1.7L50 42 9.8 1.6c-2.3-2.3-6-2.3-8 0-2.4 2.2-2.4 5.8 0 8l40 40.3L2 90.2c-2.4 2.3-2.4 6 0 8 1 1.2 2.5 1.8 4 1.8 1.4 0 3-.6 4-1.7L50 58l40.2 40.3c1 1 2.6 1.7 4 1.7 1.5 0 3-.6 4-1.7 2.4-2.2 2.4-5.8 0-8L58.3 50 98 9.8c2.4-2.3 2.4-6 0-8-1-1.2-2.5-1.8-4-1.8z' />
      </svg>
    </button>
    : <i class='fa fa-search' />
  )
}
