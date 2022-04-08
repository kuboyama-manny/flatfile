import React, { Component } from 'react'
import { RSIcon } from 'reactsymbols-kit'
import CardContainer from '../../../../elements/card'
import styles from './styles.scss'

class StatWidget extends Component {

  componentWillMount() {
    const {} = this.props
  }

  render() {
    const { icon, stat, name, color } = this.props
    return (
      <CardContainer>
        <div className={styles.statWidget}>
          <div className={`${styles.icon} ${styles[this.props.color]}`}>
            <RSIcon name={this.props.icon} size={22} color={'white'} />
          </div>
          <div className={styles.label}>
            <span className={styles.stat}>{this.props.stat}</span>
            <span className={styles.name}>{this.props.name}</span>
          </div>
        </div>
      </CardContainer>
    )
  }
}

export default StatWidget
