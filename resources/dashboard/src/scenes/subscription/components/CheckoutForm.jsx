import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'
import { RSButton, RSInput } from 'reactsymbols-kit'
import styles from './styles.scss'

class CheckoutForm extends Component {
    constructor (props) {
        super(props)

        this.state = {
            cardName: '',
            zipCode: '',
            paymentStatus: (this.props.paymentSelectable === true ? 'old' : ''),
            paymentMethod: 0
        }

        this.onChangeCardName = this.onChangeCardName.bind(this);
        this.onChangeZipCode = this.onChangeZipCode.bind(this);
        this.handlePaymentStatus = this.handlePaymentStatus.bind(this)
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
            address_country: '',
            plan: this.props.cardStatus,
        };

        if(this.props.switchActive === true) {
            const data = { id: this.props.data && this.props.data.id, plan: this.props.cardStatus };
            this.props.updatePlan(data)
        }
        if(this.props.switchActive === false) {
            if(this.props.paymentSelectable === false || this.state.paymentStatus === 'new' || this.state.paymentStatus === '') {
                this.props.stripe.createToken(formData).then(({ token }) => {
                    const data = { stripe_token: token.id, id: this.props.data && this.props.data.id, use_existing_payment_method: 0, ...formData};
                    this.props.subscribePlan(data)
                }).catch((error) => {
                    console.log(error)
                })
            }
            if(this.state.paymentStatus === 'old') {
                const data = { id: this.props.data && this.props.data.id, use_existing_payment_method: 1, ...formData };
                this.props.subscribePlan(data)
            }
        }
    }
    ;

    onChangeCardName (value) {
        this.setState({ cardName: value })
    }

    onChangeZipCode (value) {
        this.setState({ zipCode: value })
    }

    handlePaymentStatus (e) {
        this.setState({ paymentStatus: e.currentTarget.value })
    }

    render () {
        const { paymentStatus } = this.state;
        const { paymentSelectable, updateForPlanLoading } = this.props;

        return (
            <div className="form">
                <form onSubmit={this.handleSubmit}>
                    <div className={styles.formContainer}>
                        <div className={styles.formContent}>
                            <div className={styles.inputGroup}>
                            {
                                paymentSelectable &&
                                <div className={styles.selectCard} style={{ marginTop: '10px' }}>
                                    <label>Payment method</label>
                                    <select value={paymentStatus} onChange={this.handlePaymentStatus}>
                                        <option value="old">Use existing card on file</option>
                                        <option value="new">Add a different payment method</option>
                                    </select>
                                </div>
                            }
                            </div>
                            <div className={styles.inputGroup}>
                            {
                                (paymentStatus === 'new' || paymentSelectable === false)?
                                    <div className="inputGroup">
                                        <div className={styles.cardName}>
                                            <label>Name on card</label>
                                            <RSInput placeholder="John Doe" type="text" name="cardName" onChange={(value) => this.onChangeCardName(value)} />
                                        </div>
                                    </div>:
                                    null
                            }
                            </div>
                            <div className={styles.inputRow}>
                              <div className={styles.inputGroup}>
                              {
                                  (paymentStatus === 'new' || paymentSelectable === false)?
                                      <div className={styles.stripeCardContent}>
                                          <label>Card number</label>
                                          <div className={styles.stripeCard}>
                                              <CardElement hidePostalCode={true} onBlur={()=>{}} onClick={()=>{}} onFocus={()=>{}} onReady={()=>{}} />
                                          </div>
                                      </div> :
                                      null
                              }
                              </div>
                              <div className={styles.inputGroup} style={{ flex: '1 0 35%' }}>
                              {
                                  (paymentStatus === 'new' || paymentSelectable === false)?
                                      <div className={styles.zipCode}>
                                          <label>Zip code</label>
                                          <RSInput placeholder="12345" type="text" name="zipCode" onChange={(value) => this.onChangeZipCode(value)} />
                                      </div> :
                                      null
                              }
                              </div>
                            </div>
                            <div className={styles.buttonGroup}>
                                <RSButton type="submit" value={updateForPlanLoading === true ? <i className="fa fa-spinner" aria-hidden="true" /> : `Sign up for ${this.props.cardStatus}`} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default injectStripe(CheckoutForm, { withRef: false })
