import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import Subscription from 'api/subscription'
import UpdateCard from 'api/payment-method'

const reducers = {
    getPlans: trackRequest(
        'plansForSubscription',
        () => Subscription.getPlans(),
        data => actionCreators.update(data)
    ),
    getCardInfos: trackRequest(
        'subscriptionPayment',
        data => UpdateCard.getCardInfos(data),
        data => actionCreators.update(data)
    ),
    subscribePlan: trackRequest(
        'subscribeForPlan',
        data => Subscription.subscribePlan(data),
        data => actionCreators.update(data)
    ),
    updatePlan: trackRequest(
        'updateForPlan',
        data => Subscription.updatePlan(data),
        data => actionCreators.update(data)
    ),
    removeUpdateForPlan: state => {
        return {
          ...state,
          updateForPlan: ''
        }
    },
    removeSubscribeForPlan: state => {
        return {
          ...state,
          subscribeForPlan: ''
        }
    }
};

const actionCreators = linkActionsToStore('subscription', reducers, { subscribeForPlan: '', updateForPlan: '' }, true)
export default actionCreators