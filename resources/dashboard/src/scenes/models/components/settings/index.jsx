import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { RSButton, RSFormLabel, RSCheckbox, RSInput, RSSelect, RSSelectOption } from 'reactsymbols-kit'
import { Slider, InputNumber } from 'antd'
import styles from '../../styles.scss'

import SettingsActions from './actions'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.submitUpdates = this.submitUpdates.bind(this)
    this.state = {
      name: props.model.name,
      fuzziness: props.model.fuzziness / 10,
      type: props.model.type,
      allowCustom: props.model.allow_custom
    }
  }

  componentDidMount() {
    const { breadcrumb, model } = this.props

    breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Settings'
    })
  }

  submitUpdates () {
    const { name, fuzziness, type, allowCustom } = this.state
    const data = {
      name,
      fuzziness: fuzziness * 10,
      type,
      allow_custom: allowCustom,
      id: this.props.model.id
    }
    const newModel = this.props.updateModel(data)
    console.log(newModel)
  }

  render () {
    return (
      <div className={`${styles['settings']} ${styles['flex-vertical-group']}`}>
        <div className={styles['flex-form-group']}>
          <RSInput
            value={this.state.name}
            type='text'
            disabled
            onChange={name => this.setState({name})} />
          <RSFormLabel>Model name</RSFormLabel>
        </div>
        <div className={styles['flex-form-group']}>
          <RSInput
            value={this.state.type}
            type='text'
            disabled
            onChange={type => this.setState({type})} />
          <RSFormLabel>Name of units stored by model</RSFormLabel>
        </div>
        <div className={styles['flex-form-group']}>
          <RSCheckbox
            checked={this.state.allowCustom}
            disabled
            onChange={(value, allowCustom, label) => this.setState({allowCustom})}
            value='Allow Custom Columns' />
          <RSFormLabel>Allow adding of columns during import</RSFormLabel>
        </div>
        <div className={styles['flex-form-group']}>
          <Slider
            min={0}
            max={1}
            disabled
            style={{width: '100px'}}
            onChange={fuzziness => this.setState({fuzziness})}
            value={this.state.fuzziness}
            step={0.1} />
          <InputNumber
            min={0}
            max={1}
            disabled
            step={0.1}
            value={this.state.fuzziness}
            onChange={fuzziness => this.setState({fuzziness})}
          />
          <RSFormLabel>Fuzziness matching strength</RSFormLabel>
        </div>
      </div>
    )
  }
}

export default SettingsActions.connect(Settings)
