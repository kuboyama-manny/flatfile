import React, { Component } from 'react'
import { Link } from 'react-router'
import { RSButton, RSInput, RSAlert, RSRadio } from 'reactsymbols-kit'
import { StripeProvider } from 'react-stripe-elements'
import { Elements } from 'react-stripe-elements';
import Breadcrumb from 'logic/breadcrumb'
import _ from 'lodash'
import Modal from 'react-modal'
import BaseComponent from 'scenes/subscription/components/BaseComponent'
import CardComponent from 'scenes/subscription/components/CardComponent'
import CheckoutForm from 'scenes/subscription/components/CheckoutForm'
import SubscriptionActions from './actions'
import styles from './styles.scss';
import cardStyles from './components/styles.scss'
import { CurrentCheckMark } from './components/CheckMarkComponent'
import classNames from 'classnames'

const customStyles = {
  content: {
      border: '1px solid transparent',
      boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
  }
};

class Subscription extends Component {
    constructor (props) {
        super(props)

        this.state = {
            tabStatus: 2,
            plans: {},
            activePlans: [],
            cardStatus: '',
            paymentSelectable: false,
            cardData: {},
            successAlert: false,
            errorAlert: false,
            switchActive: false,
            freePlanCardDisabled: false,
            freeTrialEndData: null,
        };

        this.handleActive = this.handleActive.bind(this)
        this.paidPlansForActiveInterval = this.paidPlansForActiveInterval.bind(this)
        this.yearlyPlans = this.yearlyPlans.bind(this)
        this.monthlyPlans = this.monthlyPlans.bind(this)
        this.handleChangeCardStatus = this.handleChangeCardStatus.bind(this)
        this.closeSuccessAlert = this.closeSuccessAlert.bind(this)
        this.closeErrorAlert = this.closeErrorAlert.bind(this)
        this.closeUpdatePlanModal = this.closeUpdatePlanModal.bind(this)

        var cardClasses = classNames(
          'test',
          {
            'testTwo': true
          }
        );
    }

    componentWillMount() {
        this.breadcrumb = Breadcrumb.register({
            icon: 'pt-icon-th-list',
            name: 'Manage your plan',
            href: '/subscription'
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.cardStatus !== nextState.cardStatus) {
          this.setState({ successAlert: false, errorAlert: false })
        }
    }

    componentDidMount() {
        this.props.getPlans();
        this.props.rootState.app.getAllTeamsInfo && this.props.getCardInfos(this.props.rootState.app.getAllTeamsInfo.current_team_id);
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ plans: nextProps.plansForSubscription }, function () {
            this.state.plans && this.setState({ activePlans: this.paidPlansForActiveInterval(this.state.plans) })
        });
        nextProps.subscriptionPayment && this.setState({ cardData: nextProps.subscriptionPayment });
        nextProps.subscriptionPayment && nextProps.subscriptionPayment.subscriptions[0] && nextProps.subscriptionPayment.subscriptions[0].stripe_plan && this.setState({ switchActive: true });
        nextProps.subscriptionPayment && nextProps.subscriptionPayment.card_last_four && this.setState({ paymentSelectable: true });
        (nextProps.subscriptionPayment && (!!nextProps.subscriptionPayment.card_last_four === false)) && this.setState({ freeTrialEndData: nextProps.subscriptionPayment.trial_ends_at });

        if (typeof nextProps.subscribeForPlan === "object") {
            this.setState({ successAlert: true, switchActive: true, freePlanCardDisabled: true });
        }

        if (typeof nextProps.subscribeForPlanError === "object"){
            this.setState({ errorAlert: true })
        }

        if (typeof nextProps.updateForPlan === "object") {
            this.setState({ successAlert: true, freePlanCardDisabled: true });
        }

        if (typeof nextProps.updateForPlanError === "object") {
            this.setState({ errorAlert: true })
        }

        if (typeof nextProps.subscribeForPlan === 'object' || typeof nextProps.updateForPlan === 'object') {
            this.props.removeSubscribeForPlan();
            this.props.removeUpdateForPlan();
            this.props.getCardInfos(this.props.rootState.app.getAllTeamsInfo.current_team_id);
            this.closeUpdatePlanModal()
        }

    }

    paidPlansForActiveInterval(plans) {
        return _.filter(plans, plan => {
            return plan.active && plan.price > 0;
        });
    }

    yearlyPlans(plans) {
        return _.filter(plans, plan => {
            return plan.active && plan.interval === 'yearly';
        });
    }

    monthlyPlans(plans) {
        return _.filter(plans, plan => {
            return plan.active && plan.interval === 'monthly';
        });
    }

    handleActive(value) {
        this.setState({ tabStatus: value })
    }

    handleChangeCardStatus(value) {
        this.setState({ cardStatus: value, showUpdatePlanModal: true })
    }

    closeSuccessAlert () {
        this.setState({ successAlert: false })
    }

    closeErrorAlert () {
        this.setState({ errorAlert: false })
    }

    // updatePlan () {
    //     this.setState({ showUpdatePlanModal: true })
    // }

    closeUpdatePlanModal () {
        this.setState({ showUpdatePlanModal: false })
    }

    render() {
        const { tabStatus, activePlans, cardStatus, paymentSelectable, errorAlert, cardData, switchActive, freePlanCardDisabled, freeTrialEndData, showUpdatePlanModal } = this.state;
        return (
            <div className={styles.container}>
                <Modal
                    isOpen={showUpdatePlanModal}
                    contentLabel="Update plan"
                    style={customStyles}
                    overlayClassName={styles.overlay}
                    shouldCloseOnOverlayClick={true}
                >
                    <div className={styles.modalContent}>
                        <div className={styles.confirmMessage}>
                            <span>Update plan</span>
                        </div>
                        <RSAlert
                            visible={errorAlert}
                            requestClose={this.closeErrorAlert}
                            style={{ backgroundColor: '#f8d7da', marginTop: '15px', padding: '20px 25px' }}>
                            <p style={{ color: '#721c24', paddingLeft: 0 }}>We had trouble updating your card. It's possible your card provider is preventing us from charging the card. Please contact your card provider or customer support.</p>
                        </RSAlert>
                        {
                          (cardStatus !== 'basic' && cardStatus !== 'enterprise' && cardStatus !== '' && cardStatus !== cardData.current_billing_plan) &&
                          <div className={styles.enterprisePreview}>
                              <span className={styles.icon}>
                                  <i style={{ fontSize: '1.1rem' }} className="fa fa-credit-card-alt"></i>
                              </span>
                              <span className={styles.description}>
                                  <strong>{cardStatus}</strong>
                                  <p style={{ margin: '5px 0 0' }}>You're about to update your plan to {cardStatus}.</p>
                              </span>
                          </div>
                        }
                        {
                          (cardStatus !== 'basic' && cardStatus !== 'enterprise' && cardStatus !== '' && cardStatus === cardData.current_billing_plan) &&
                          <div className={styles.enterprisePreview}>
                              <span className={styles.icon}>
                                  <i style={{ fontSize: '1.1rem' }} className="fa fa-check-square-o"></i>
                              </span>
                              <span className={styles.description}>
                                  <strong>{cardStatus}</strong>
                                  <p style={{ margin: '5px 0 0' }}>You are currently on the {cardStatus} plan.</p>
                                  <div className={styles.buttonGroup}>
                                      <RSButton value="Got it" onClick={() => this.setState({ showUpdatePlanModal: false })} />
                                  </div>
                              </span>
                          </div>
                        }
                        {
                            (cardStatus !== 'basic' && cardStatus !== 'enterprise' && cardStatus !== '' && cardStatus !== cardData.current_billing_plan) &&
                            <div className={styles.stripeForm}>
                                <StripeProvider apiKey="pk_test_Dt4NWEsLzOTXOxy5Y57o08ZR">
                                    <Elements>
                                        <CheckoutForm paymentSelectable={paymentSelectable} cardStatus={cardStatus} subscribePlan={this.props.subscribePlan} updatePlan={this.props.updatePlan} data={cardData} switchActive={switchActive} updateForPlanLoading={this.props.updateForPlanLoading} />
                                    </Elements>
                                </StripeProvider>

                                <div className={styles.buttonGroup} style={{ marginTop: '-36px' }}>
                                    <RSButton type="submit" value={'Sign up for '+cardStatus} style={{ opacity: 0, pointerEvents: 'none' }}/>
                                    <RSButton value="Cancel" onClick={() => this.setState({ showUpdatePlanModal: false })} />
                                </div>
                            </div>
                        }
                        {
                            (cardStatus == 'basic' || cardStatus == 'enterprise' && cardStatus !== '' && cardStatus !== cardData.current_billing_plan) &&
                            <div>
                            <div className="{styles.stripeForm}">
                            {
                              (cardStatus == 'enterprise') &&
                              <div className={styles.enterprisePreview}>
                                  <span className={styles.icon}>
                                      <i className='fa fa-building'></i>
                                  </span>
                                  <span className={styles.description}>
                                      <strong>let's talk</strong>
                                      <p>Have a larger team? <a href="mailto:hello@flatfile.io">Contact us</a> for information about more enterpise options.</p>
                                      <RSButton value='Got it' onClick={() => this.setState({ showUpdatePlanModal: false })} />
                                  </span>
                              </div>
                            }
                            {
                              (cardStatus == 'basic') &&
                              <div className={styles.enterprisePreview}>
                                  <span className={styles.icon}>
                                      <i className='fa fa-leaf'></i>
                                  </span>
                                  <span className={styles.description}>
                                      <strong>free plan</strong>
                                      <p>The most basic plan allows you to import files with up to 1,000 rows, and allows for unlimited file uploads.</p>
                                      <RSButton value="Got it" onClick={() => this.setState({ showUpdatePlanModal: false })} />
                                  </span>
                              </div>
                            }
                            </div>
                        </div>
                        }
                    </div>
                </Modal>
                <BaseComponent title="Subscribe" tabStatus={tabStatus} handleActive={this.handleActive} className={styles.cardContainer}>
                    <div className={cardStyles.freeTrialDate}>
                        { freeTrialEndData && <span>You are currently within your free trial period. Your trial will expire on { freeTrialEndData }.</span> }
                    </div>
                    <div className={cardStyles.customerCardGroup}>
                        <div className={cardStatus === 'basic' ? cardStyles.activeStyle : cardStyles.monthlyContainer} onClick={() =>this.handleChangeCardStatus('basic')} disabled={freePlanCardDisabled}>
                            <div className={cardStyles.monthlyCardTitle}>
                                BASIC
                            </div>
                            <div className={cardStyles.monthlyBill}>
                                <span><span style={{ fontWeight: 500, fontSize: '28px' }}>free</span></span>
                            </div>
                            <div className={cardStyles.monthlyUsers}>
                                <span>1 USER</span>
                            </div>
                            <hr />
                            <div className={cardStyles.Features}>
                                <div className={cardStyles.FeaturesContent}>
                                    <span>1000 max rows</span>
                                    <span>Unlimited uploads</span>
                                </div>
                            </div>
                            { freeTrialEndData && <CurrentCheckMark cardStatus={cardStatus} cardData={cardData} /> }
                        </div>
                        {
                            (activePlans && tabStatus === 2) &&
                            this.monthlyPlans(activePlans).map((plan, i) =>
                                <CardComponent planRow={plan} key={i} userNum={10} cardStatus={cardStatus} cardData={cardData} onClick={this.handleChangeCardStatus} />)
                        }
                        {
                            (activePlans && tabStatus === 1) &&
                            this.yearlyPlans(activePlans).map((plan, i) =>
                                <CardComponent planRow={plan} key={i} userNum={10} cardStatus={cardStatus} cardData={cardData} onClick={this.handleChangeCardStatus} />)
                        }
                        <div className={cardStatus === 'enterprise' ? cardStyles.activeStyle : cardStyles.monthlyContainer} onClick={() => this.handleChangeCardStatus('enterprise')}>
                            <div className={cardStyles.monthlyCardTitle}>
                                ENTERPRISE
                            </div>
                            <div className={cardStyles.monthlyBill}>
                                <span><span style={{ fontWeight: 500, fontSize: '28px' }}>let's talk</span></span>
                            </div>
                            <div className={cardStyles.monthlyUsers}>
                                <span>UNLIMITED USERS</span>
                            </div>
                            <hr />
                            <div className={cardStyles.Features}>
                                <div className={cardStyles.FeaturesContent}>
                                    <span>Whitelabeling</span>
                                    <span>On-prem deployment</span>
                                    <span>HIPAA compliance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactUSLink}>
                        <span>Have a larger team? <a href="mailto:hello@flatfile.io">Contact us</a> for information about more enterpise options.</span>
                    </div>
                </BaseComponent>
            </div>
        )
    }
}

export default SubscriptionActions.connect(Subscription);
