import { linkActionsToStore } from 'store'
import Breadcrumb from 'logic/breadcrumb'

const reducers = {
  initialize: (state, payload, dispatch) => {
    Breadcrumb.onBreadcrumbChange(breadcrumbs => {
      dispatch(actionCreators.updateBreadcrumbs(breadcrumbs))
    })
  },
  updateBreadcrumbs: (state, navigationBreadcrumbs) => {
    return {
      ...state,
      navigationBreadcrumbs
    }
  }
}

const actionCreators = linkActionsToStore('app:breadcrumbs', reducers)
export default actionCreators
