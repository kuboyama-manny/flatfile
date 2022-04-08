import React, { Component } from 'react'
import { RSButton } from 'reactsymbols-kit'
import styles from './styles.scss'

class BaseComponent extends Component {
    constructor (props) {
        super(props)
    }
    render () {
        const { tabStatus } = this.props;

        return (
            <div className={styles.cardContainer}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div className={styles.titleHeader}>
                            <span>
                                Small startup? Big company? We've got a plan.
                            </span>
                        </div>
                        <div className={styles.titleContent}>
                            <span>
                                If the pricing options we have don't fit with your business model,<br />don't hesitate to reach out to our team to discuss a custom pricing schedule.
                            </span>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <RSButton className={tabStatus === 1 ? styles.activeTab : styles.normalTab} onClick={() =>this.props.handleActive(1)} value='Billed annually' />
                        <RSButton className={tabStatus === 2 ? styles.activeTab : styles.normalTab} onClick={() =>this.props.handleActive(2)} value='Billed monthly' />
                    </div>
                </div>
                <div className={styles.body}>
                    { this.props.children }
                </div>
            </div>
        )
    }
}

export default BaseComponent
