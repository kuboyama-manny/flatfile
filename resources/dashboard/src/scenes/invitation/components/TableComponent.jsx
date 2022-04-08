import React, { Component } from 'react'
import styles from './styles.scss'

class TableComponent extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className={styles.tableContainer}>
                { this.props.children }
            </div>
        )
    }
}

export default TableComponent