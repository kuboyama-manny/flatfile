import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { RSButton, RSInput } from 'reactsymbols-kit'
import styles from './styles.scss'

class CheckoutForm extends Component {
    constructor (props) {
        super(props)

        this.state = {
            cardName: '',
            zipCode: ''
        }

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
            const data = { stripe_token: token.id, id: this.props.data.id, ...formData};
            this.props.updateCardData(data)
        }).catch((error) => {
            console.log(error)
        })
    };

    onChangeCardName (e) {
        this.setState({ cardName: e })
    }

    onChangeZipCode (e) {
        this.setState({ zipCode: e })
    }

    render () {
        return (
            <div className="form">
                <form onSubmit={this.handleSubmit} ref="card">
                    <div className={styles.formContainer}>
                        <div className={styles.formContent}>
                            <div className={styles.textInputBox}>
                                <div className={styles.formLabel}>
                                    <span>Cardholder's Name</span>
                                    <span>Card</span>
                                    <span>ZIP / Postal Code</span>
                                </div>
                                <div className={styles.formInput}>
                                    <RSInput type="text" name="cardName" onChange={(e) => this.onChangeCardName(e)} />
                                    <div className={styles.stripeCard}>
                                        <CardElement hidePostalCode={true} onBlur={()=>{}} onClick={()=>{}} onFocus={()=>{}} onReady={()=>{}} />
                                    </div>
                                    <RSInput type="text" name="zipCode" onChange={(e) => this.onChangeZipCode(e)} />
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
