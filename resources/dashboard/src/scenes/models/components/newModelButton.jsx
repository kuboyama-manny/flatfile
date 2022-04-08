import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { RSButton, RSInput } from 'reactsymbols-kit'
import { Popover } from 'antd';
import styles from '../styles.scss'

export default class NewModel extends React.Component {
  constructor (props) {
    super(props)
    this.createNewModel = props.createNewModel.bind(this)
    this.state = {
      visible: false,
      name: ''
    }
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  render() {
    const form = (
      <div className={styles['flex-form-group']}>
        <RSInput
          value={this.state.name}
          type='text'
          onChange={name => this.setState({name})}
        />
        <RSButton
          value="Create Now"
          size="small"
          disabled={!this.state.name}
          onClick={() => this.createNewModel(this.props.history, this.state.name)}
        />
      </div>
    )
    return (
      <Popover
        content={form}
        trigger="click"
        title='New Model Name'
        placement="bottom"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <RSButton value="New Model" size="large"/>
      </Popover>
    );
  }
}
