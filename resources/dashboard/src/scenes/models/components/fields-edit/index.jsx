import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { RSButton, RSCheckbox, RSInput, RSSelect, RSSelectOption } from 'reactsymbols-kit'
import JSONPretty from 'react-json-pretty'
import EditableTagGroup from '../../../../elements/editableTagGroup'
import { Creatable } from 'react-select'
import styles from '../../styles.scss'
import Spinner from 'elements/spinner'

import FieldsEditActions from './actions'

const fields = [{
  id: 0,
  name: 'field1',
  valueType: 'one',
  multipleValues: false,
  validation: 'numeric',
  hinting: ['one', 'two']
}, {
  id: 1,
  name: 'field2',
  valueType: 'one',
  multipleValues: false,
  validation: 'numeric',
  hinting: ['one', 'two']
}, {
  id: 2,
  name: 'field3',
  valueType: 'one',
  multipleValues: false,
  validation: 'numeric',
  hinting: ['one', 'two']
}, {
  id: 3,
  name: 'field4',
  valueType: 'one',
  multipleValues: false,
  validation: 'numeric',
  hinting: ['one', 'two']
}]

class FieldsEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fields: props.model ? props.model.fields : []

    }
  }

  componentDidMount() {
    const { breadcrumb, model } = this.props

    breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Fields'
    })
  }

  selectOption (option) {
    return (
      <RSSelectOption
        label={option.label}
      />
    )
  }

  updateField = (i, attr, value) => {
    const { fields } = this.state
    fields[i][attr] = value
    this.setState({ fields })
  }

  renderFieldList() {
    const { fields } = this.state

    return fields.map((v, i) =>
      <tr key={v.id}>
        <td><RSInput value={v.key} type='text' onChange={change => this.updateField(i, 'key', change)} /></td>
        <td><RSInput value={v.label} type='text' onChange={change => this.updateField(i, 'label', change)} /></td>
        <td className={styles.long}><RSSelect
          value={v.cast}
          onChange={change => this.updateField(i, 'cast', change.value)}
          options={[
            { value: 'string', label: 'String', id: 1 },
            { value: 'boolean', label: 'Boolean', id: 2 },
            { value: 'money', label: 'Money', id: 3 },
            { value: 'percentage', label: 'Percentage', id: 4 }
          ]} /></td>
        <td><RSCheckbox
          checked={v.multiple}
          onChange={(value, checked, label) => this.updateField(i, 'multiple', checked)}
          value='multiple_values' /></td>
        <td><RSCheckbox
          checked={v.required}
          onChange={(value, checked, label) => this.updateField(i, 'required', checked)}
          value='required' /></td>
        <td><RSInput value={v.validator || ''} type='text' onChange={change => this.updateField(i, 'validator', change)} /></td>
      </tr>
    )
  }
  // <td><EditableTagGroup tags={v.hints instanceof Array ? v.hints : JSON.parse(v.hints)} onChange={change => console.log(change)} /></td>

  addField = () => {
    const { fields } = this.state
    fields.push({
      id: Math.random().toString(36).substring(7),
      key: '',
      label: '',
      validator: '',
      required: false,
      multiple: false,
      cast: '',
      hints: []
    })
    this.setState({ fields })
  }

  render () {
    const { model } = this.props
    const fields = this.state.fields.map(field => {
      return {
        key: field.key,
        label: field.label,
        hints: field.hints,
        validator: field.validator,
        required: field.required,
        multiple: field.multiple,
        cast: field.cast
      }
    })
    if (!model) {
      return <Spinner />
    }

    return (
      <div className={styles['field-edit']}>
        {fields.length
          ? <JSONPretty id="json-pretty" json={fields} />
          : <h3>No fields yet</h3>}
      </div>
    )
  }
}

export default FieldsEditActions.connect(FieldsEdit)

//   <table className="uk-table">
//     <thead>
//         <tr>
//             <th>Key</th>
//             <th>Label</th>
//             <th>Typecast</th>
//             <th>Multiple</th>
//             <th>Required</th>
//             <th>Validation regex</th>
//             <th>Hinting</th>
//         </tr>
//     </thead>
//     <tbody>
//       {this.renderFieldList()}
//     </tbody>
// </table>
// <RSButton value='Add Field' onClick={this.addField} />
