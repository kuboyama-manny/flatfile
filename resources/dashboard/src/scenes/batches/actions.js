import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import Batch from 'api/batch'

const reducers = {
  fetchBatches: trackRequest(
    'batches',
    async ({page, pageSize}) => Batch.list({}, page, pageSize),
    data => actionCreators.update(data)
  ),
  fetchBatch: trackRequest(
    'batch',
    async id => Batch.get(id),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('batches', reducers)
export default actionCreators
