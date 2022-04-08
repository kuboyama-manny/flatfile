import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { RSButton, RSInput } from 'reactsymbols-kit'
import styles from '../styles.scss'

class CheckoutForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cardName: '',
            zipCode: ''
        };

        this.onChangeCardName = this.onChangeCardName.bind(this);
        this.onChangeZipCode = this.onChangeZipCode.bind(this)
    }

    handleSubmit = (event) => {
        event.preventDefault();

        var formData = {
            type: 'card',
            name: this.state.cardName || '',
            address_line1: '',
            address_line2: '',
            address_city: '',
            address_state: '',
            address_zip: this.state.zipCode || '',
            address_country: ''
        };

        this.props.stripe.createToken(formData).then(({ token }) => {
            const data = { stripe_token: token.id, id: this.props.data && this.props.data.id, ...formData};
            this.props.updateCardData(data)
        }).catch((error) => {
            console.log(error)
        })
    };

    onChangeCardName (value) {
        this.setState({ cardName: value })
    }

    onChangeZipCode (value) {
        this.setState({ zipCode: value })
    }

    render () {
        return (
            <div className="form">
                <form onSubmit={this.handleSubmit} ref="card">
                    <div className={styles.formContainer}>
                        <div className={styles.formContent}>
                            <div className={styles.textInputBox}>
                                <div className={styles.inputGroup}>
                                    <label>Cardholder's name</label>
                                    <RSInput type="text" name="cardName" onChange={(value) => this.onChangeCardName(value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Card number</label>
                                    <div className={styles.stripeCard}>
                                        <CardElement hidePostalCode={true} onBlur={()=>{}} onClick={()=>{}} onFocus={()=>{}} onReady={()=>{}} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Zip/Postal code</label>
                                    <RSInput type="text" name="zipCode" onChange={(value) => this.onChangeZipCode(value)} />
                                </div>
                                <div className={styles.formInput}>
                                    <RSButton type="submit" value='Update' />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default injectStripe(CheckoutForm, { withRef: false })
