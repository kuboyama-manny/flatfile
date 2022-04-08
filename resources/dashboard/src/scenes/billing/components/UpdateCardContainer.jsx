import React, { Component } from 'react'
import styles from './styles.scss'

class BaseComponent extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cardData: ''
        }

        this.selectCardBrand = this.selectCardBrand.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState({ cardData: nextProps.data })
    }

    selectCardBrand(cardBrand) {
        if (cardBrand === 'Visa') {
            return 'visa'
        }
        if (cardBrand === 'MasterCard') {
            return 'mastercard'
        }
        if (cardBrand === 'American Express') {
            return 'amex'
        }
        if (cardBrand === 'Discover') {
            return 'discover'
        }
        if (cardBrand === 'Diners Club') {
            return 'diners-club'
        }
        if (cardBrand === 'JCB') {
            return 'jcb'
        }
        if (cardBrand === 'UnionPay') {
            return 'stripe'
        }
    }

    render() {
        const { title, children } = this.props;
        const { cardData } = this.state;
        const cardBrand = this.selectCardBrand(cardData && cardData.card_brand);

        return (
            <div className={styles.cardContainer}>
                <div className={styles.cardTitle}>
                    <span>{ title }</span>
                    <div className={styles.showingCardNum}>
                        { cardData && <i className={`fa fa-cc-${cardBrand}`} aria-hidden="true"><span> {cardData.card_last_four && `************ ${cardData.card_last_four}`}</span></i> }
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
