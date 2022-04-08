import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import UpdateCard from 'api/payment-method'

const reducers = {
  updateCardData: trackRequest(
    'billingMethod',
    data => UpdateCard.update(data),
    data => actionCreators.update(data)
  ),
  getCardInfos: trackRequest(
    'billing',
    data => UpdateCard.getCardInfos(data),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('billing', reducers, { currentTeamID: '' }, true)
export default actionCreators
