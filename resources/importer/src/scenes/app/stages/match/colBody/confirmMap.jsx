import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { convertToLetters } from '../../../lib/functions'
import { GenericButton } from '../../../lib/elements'

export default function (props) {
  const { oldName, newName, validators, matchState, duplicate, description, suggestedName } = props.columnMeta[props.index]
  const defaultName = oldName === convertToLetters(props.index + 1) ? newName : oldName
  const label = props.keyNames[newName] || newName
  let priorMatchList = []
  let priorMatch = ''
  for (let i = 0; i < props.columnMeta.length; i++) {
    if (props.columnMeta[i].newName === newName &&
      i !== props.index &&
      props.columnMeta[i].matchState !== 'ignored') {
      priorMatchList.push(convertToLetters(i + 1))
    }
  }
  if (priorMatchList) {
    priorMatch = priorMatchList.length > 1
      ? 'Columns ' + priorMatchList.join(', ') + ' have'
      : 'Column ' + priorMatchList[0] + ' has'
  }
  let validationReport = null
  if (validators.length && props.matcher.columnsInvalid && !duplicate) {
    if (props.matcher.columnsInvalid[newName] === 0) {
      validationReport = <li><i class='fa fa-check' />All values pass validation for this field</li>
    } else {
      validationReport = <li><i class='fa fa-warning' />{props.matcher.columnsInvalid[newName] / props.csvData.data.length * 100}% of rows fail validation (repair on next step)</li>
    }
  }
  if (matchState === 'matched') {
    const duplicateWarning = duplicate
      ? <li><i class='fa fa-warning' />{priorMatch} already been matched to {label}.</li>
      : null
    return (
      <aside class={`column-matched${duplicate ? ' duplicate' : ''}`}>
        <ul>
          <li>
            <i class='fa fa-check' />Matched to the <span class='suggested-fieldname'>{label}</span> field.
            {description ? <div class='field-description'>{description}</div> : null}
          </li>
          {duplicateWarning}
          <li><i class='fa fa-info-circle' />{props.columnFill[defaultName]} of your rows have a value for this column</li>
          {validationReport}
        </ul>
        <div class='confirm-box'>
          <GenericButton id={'confirmed-' + props.index} classes={['green']} tabIndex={(props.index + 1) * 3 + 1} title='Confirm mapping' onClick={() => props.matcher.confirmMatch(props.index)} />
          <GenericButton id={'ignored-' + props.index} classes={['invert']} tabIndex={(props.index + 1) * 3 + 2} title='Ignore this column' onClick={() => props.matcher.ignoreColumn(props.index)} />
        </div>
      </aside>
    )
  } else if (matchState === 'confirmed') {
    return (
      <aside class='column-confirmed'>
        <ul>
          <li><i class='fa fa-check' />Confirmed mapping</li>
        </ul>
        <GenericButton id={'matched-' + props.index} classes={['gray']} tabIndex={(props.index + 1) * 3 + 1} title='Edit' onClick={() => props.matcher.undoConfirm(props.index)} />
      </aside>
    )
  } else if (matchState === 'ignored') {
    return (
      <aside class='column-ignored'>
        <ul>
          <li><i class='fa fa-eye-slash' />Ignored</li>
        </ul>
        <GenericButton id={'unmatched-' + props.index} classes={['gray']} tabIndex={(props.index + 1) * 3 + 1} title='Edit' onClick={() => props.matcher.undoMatch(props.index)} />
      </aside>
    )
  } else if (matchState === 'unmatched') {
    return (
      <aside class='column-unmatched'>
        <ul>
          <li><i class='fa fa-warning' />{suggestedName === 'none' ? 'Unable to automatically match' : `No match selected. We suggest '${props.keyNames[suggestedName]}'`}</li>
          <li><i class='fa fa-info-circle' />{props.columnFill[defaultName]} of your rows have a value for this column</li>
        </ul>
        <div class='confirm-box'>
          <GenericButton id={'ignored-' + props.index} classes={['invert']} tabIndex={(props.index + 1) * 3 + 1} title='Ignore this column' onClick={() => props.matcher.ignoreColumn(props.index)} />
        </div>
      </aside>
    )
  } else if (matchState === 'locked') {
    return (
      <aside class={`column-locked${duplicate ? ' duplicate' : ''}`}>
        <ul>
          {description ? <li><i class='fa fa-info-circle' />{description}</li> : null}
          <li><i class='fa fa-warning' />{priorMatch} already been matched to {label}</li>
          <li><i class='fa fa-info-circle' />{props.columnFill[defaultName]} of your rows have a value for this column</li>
          {validationReport}
        </ul>
        <div class='confirm-box'>
          <GenericButton id={'confirmed-' + props.index} tabIndex={(props.index + 1) * 3 + 1} classes={['gray']} title='Confirm mapping' />
          <GenericButton id={'ignored-' + props.index} tabIndex={(props.index + 1) * 3 + 2} classes={['invert']} title='Ignore this column' onClick={() => props.matcher.ignoreColumn(props.index)} />
        </div>
      </aside>
    )
  }
}
