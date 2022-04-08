import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { RSAlert, RSFormLabel, RSButton, RSRadio, RSRadioGroup, RSCheckbox, RSInput, RSSelect, RSSelectOption } from 'reactsymbols-kit'
import styles from '../../styles.scss'

import DataHandlingActions from './actions'

class DataHandling extends Component {
  constructor (props) {
    super(props)
    this.state = {
      postUpload: 'download',
      sendMode: 'csv',
      batchSize: '100',
      rateLimit: '1/sec'
    }
  }

  componentDidMount () {
    const { breadcrumb, model } = this.props

    breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Processing'
    })
  }

  render () {
    const processOptions = [
      { value: 'download', label: 'Automatically Download', id: 1, endpoint: 'download endpoint' },
      { value: 'webhook', label: 'Send to webhook', id: 2, endpoint: 'webhook URL' },
      { value: 'zapier', label: 'Send records to Zapier', id: 3, endpoint: 'Zapier URL' },
      { value: 'nothing', label: 'Do nothing', id: 4, endpoint: '' },
      { value: 'api', label: 'POST to API', id: 5, endpoint: 'API URL' }
    ]
    return (
      <div className={`${styles['processing-edit']} ${styles.flex}`}>
        <div className={styles.col}>
          <RSFormLabel>
            After Upload
          </RSFormLabel>
          <RSSelect
            className={styles.select}
            value={this.state.postUpload}
            onChange={(postUpload) => this.setState({postUpload: postUpload.value})}
            options={processOptions} />
        </div>
        <div className={styles.col}>
          {this.state.postUpload === 'nothing' ?
          <RSAlert
            visible={this.state.postUpload === 'nothing'}
            requestClose={console.log('close')}
            level='info'>
            <p>Do nothing</p>
          </RSAlert>
          :
          <div>
            <RSFormLabel>
              {processOptions.find(v => v.value === this.state.postUpload).endpoint}
            </RSFormLabel>
            <RSInput type='text' />
            <RSRadioGroup
              selectedValue={this.state.sendMode}
              onChange={sendMode => this.setState({sendMode})}
              name='radio-group'>
              <div className={styles.flex}>
                <div className={styles['half-col']}>
                  <RSRadio
                    value='csv'
                    label='Send CSV file'
                  />
                </div>
                <div className={styles['half-col']}>
                  <RSRadio
                    value='json'
                    label='Send as JSON payload'
                  />
                </div>
              </div>
            </RSRadioGroup>
            <div className={styles.flex}>
              <div className={styles['half-col']} />
              <div className={styles['half-col']}>
                <RSFormLabel>
                  Batch size
                  <RSSelect
                    className={styles.select}
                    value={this.state.batchSize}
                    onChange={(batchSize) => this.setState({batchSize: batchSize.value})}
                    options={[
                      { value: '10', label: '10', id: 1 },
                      { value: '25', label: '25', id: 2 },
                      { value: '50', label: '50', id: 3 },
                      { value: '100', label: '100', id: 4 },
                      { value: '1000', label: '1000', id: 5 }
                    ]} />
                </RSFormLabel>
                <RSFormLabel>
                  Rate limit
                  <RSSelect
                    className={styles.select}
                    value={this.state.rateLimit}
                    onChange={(rateLimit) => this.setState({rateLimit: rateLimit.value})}
                    options={[
                      { value: '1/sec', label: '1/sec', id: 1 },
                      { value: '5/sec', label: '5/sec', id: 2 },
                      { value: '20/sec', label: '20/sec', id: 3 },
                      { value: '50/sec', label: '50/sec', id: 4 },
                      { value: '100/sec', label: '100/sec', id: 5 }
                    ]} />
                </RSFormLabel>
              </div>
            </div>
          </div>}
        </div>
      </div>
    )
  }
}

export default DataHandlingActions.connect(DataHandling)
