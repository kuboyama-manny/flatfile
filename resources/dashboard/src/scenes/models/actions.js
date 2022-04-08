import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import DataModel from 'api/data-model'

const reducers = {
  fetchDataModels: trackRequest(
    'models',
    async ({page, pageSize}) => DataModel.list({}, page, pageSize),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('models', reducers)
export default actionCreators
