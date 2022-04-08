import React, { Component } from 'react'
import styles from './styles.scss'

class BaseComponent extends Component {
    constructor (props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { title, children, memberNum } = this.props;

        return (
            <div className={styles.cardContainer}>
                <div className={styles.cardHeader}>
                    <div className={styles.title}>
                        <span>{ title } { memberNum !== undefined ? `(${memberNum})` : null }</span>
                    </div>
                </div>
                <div className={styles.cardContent}>
                    { children }
                </div>
            </div>
        )
    }
}

export default BaseComponent
