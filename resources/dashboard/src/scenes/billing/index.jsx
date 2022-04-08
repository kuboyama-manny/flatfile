import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import { RSButton, RSInput, RSAlert } from 'reactsymbols-kit'
import Breadcrumb from 'logic/breadcrumb'
import BillingActions from './actions'
import CardContainer from 'elements/card'
import styles from './styles.scss'

import BaseCard from './components/UpdateCardContainer'
import UpdateCardForm from './components/UpdateCardForm'

class Billing extends Component {
  constructor (props) {
    super(props)

    this.state = {
      successAlert: false,
      errorAlert: false,
      bankBrand: {}
    }

    this.updateCardData = this.updateCardData.bind(this)
    this.closeErrorAlert = this.closeErrorAlert.bind(this)
    this.closeSuccessAlert = this.closeSuccessAlert.bind(this)
  }

  componentDidMount () {
    this.breadcrumb = Breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Billing',
      href: '/billing'
    })

    this.props.rootState.app.getAllTeamsInfo && this.props.getCardInfos(this.props.rootState.app.getAllTeamsInfo.current_team_id)
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  componentWillReceiveProps (nextProps) {
    if (typeof nextProps.billingMethod === 'object') {
      this.setState({ successAlert: true })

      if (JSON.stringify(this.props.billingMethod) !== JSON.stringify(nextProps.billingMethod)) {
        this.props.getCardInfos(this.props.currentTeamID.current_team_id)
      }
    }

    if (typeof nextProps.billingMethodError === 'object') {
      this.setState({ errorAlert: true })
    }

    nextProps.billing && this.setState({ bankBrand: nextProps.billing })
  }

  updateCardData (data) {
    this.props.updateCardData(data)
  }

  closeSuccessAlert () {
    this.setState({ successAlert: false })
  }

  closeErrorAlert () {
    this.setState({ errorAlert: false })
  }

  render () {
    const { successAlert, errorAlert, bankBrand } = this.state

    return (
      <div className={styles.billing}>
        <BaseCard title='Update payment method' data={bankBrand}>
          <RSAlert
            visible={errorAlert}
            background={styles.errorAlert}
            requestClose={this.closeErrorAlert}
            style={{ backgroundColor: '#f8d7da', marginBottom: '20px' }}>
            <p style={{ color: '#721c24', paddingLeft: 0 }}>We had trouble updating your card. It's possible your card provider is preventing us from charging the card. Please contact your card provider or customer support.</p>
          </RSAlert>
          <RSAlert
            visible={successAlert}
            requestClose={this.closeSuccessAlert}
            style={{ backgroundColor: '#d5edda', marginBottom: '20px' }}>
            <p style={{ color: '#155724', paddingLeft: 0 }}>Your card has been updated.</p>
          </RSAlert>
          <StripeProvider apiKey='pk_test_Dt4NWEsLzOTXOxy5Y57o08ZR'>
            <Elements>
              <UpdateCardForm updateCardData={this.updateCardData} data={this.props.billing} />
            </Elements>
          </StripeProvider>
        </BaseCard>
        {/*<CardContainer title='Redeem coupon'>*/}
          {/*<form>*/}
            {/*<div className={styles.formContainer}>*/}
              {/*<div className={styles.formContent}>*/}
                {/*<div className={styles.textInputBox}>*/}
                  {/*<div className={styles.inputGroup}>*/}
                    {/*<label>Discount code</label>*/}
                    {/*<RSInput*/}
                        {/*type='text'*/}
                        {/*onChange={() => console.log()}*/}
                      {/*/>*/}
                  {/*</div>*/}
                  {/*<div className={styles.formInput}>*/}
                    {/*<RSButton onClick={() => console.log()} value='Apply to my account' />*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</form>*/}
        {/*</CardContainer>*/}
      </div>
    )
  }
}

export default BillingActions.connect(Billing)
