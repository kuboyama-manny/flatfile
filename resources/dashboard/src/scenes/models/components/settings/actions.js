import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import DataModel from 'api/data-model'

const reducers = {
  updateModel: trackRequest(
    'model',
    async data => DataModel.update(data),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('models:settings', reducers)
export default actionCreators
