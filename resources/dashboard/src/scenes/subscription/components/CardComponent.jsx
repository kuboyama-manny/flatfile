import React, { Component } from 'react'
import { RSButton } from 'reactsymbols-kit'
import styles from './styles.scss'
import { CurrentCheckMark } from '../components/CheckMarkComponent'

class CardComponent extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        const { planRow, userNum, cardStatus, cardData } = this.props;

        return (
            <div className={cardStatus === planRow.id ? styles.activeStyle : styles.monthlyContainer} onClick={() =>this.props.onClick(planRow.id)}>
                <div className={styles.monthlyCardTitle}>
                    {planRow.name.toUpperCase()}
                </div>
                <div className={styles.monthlyBill}>
                    <span><span style={{ fontWeight: 500, fontSize: '28px' }}>${planRow && planRow.price}</span>/{planRow.interval}</span>
                </div>
                <div className={styles.monthlyUsers}>
                    <span>{userNum} USERS</span>
                </div>
                <hr />
                <div className={styles.Features}>
                    <div className={styles.FeaturesContent}>
                        {
                            planRow && planRow.features.map((feature, i) => <span key={i}>{feature}</span>)
                        }
                    </div>
                </div>
                { planRow.id === cardData.current_billing_plan && <CurrentCheckMark cardStatus={cardStatus} planRow={planRow} /> }
            </div>
        )
    }
}

export default CardComponent
