// eslint-disable-line no-unused-vars
import React, { Component } from 'react'
import styles from './styles.scss'

class CardContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  render () {
    const { title, table, children } = this.props
    if(this.props.title && this.props.title.length >= 1) {
      return (
        <div className={styles.cardContainer}>
          <div className={styles.cardTitle}>
            {this.props.title}
          </div>
          <div className={this.props.table ? styles.cardContentWithTable : styles.cardContent}>
            {children}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.cardContainer}>
          <div className={this.props.table ? styles.cardContentWithTable : styles.cardContent}>
            {children}
          </div>
        </div>
      );
    }
  }
}

export default CardContainer
