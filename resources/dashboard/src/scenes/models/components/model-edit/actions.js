import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import DataModel from 'api/data-model'

const reducers = {
  fetchDataModel: trackRequest(
    'model',
    async id => DataModel.get(id),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('models:modelEdit', reducers)
export default actionCreators
