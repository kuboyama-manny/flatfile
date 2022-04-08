import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import Batch from 'api/batch'
import Row from 'api/row'
import EndUser from 'api/endUser'

const reducers = {
  fetchBatch: trackRequest(
    'batch',
    async id => Batch.get(id),
    data => actionCreators.update(data)
  ),
  updateBatch: trackRequest(
    'batch',
    async data => Batch.update(data),
    data => actionCreators.update(data)
  ),
  fetchRows: trackRequest(
    'rows',
    async id => Row.listFrom(id),
    data => actionCreators.update(data)
  ),
  'fetchEndUser': trackRequest(
    'endUser',
    async id => EndUser.get(id),
    data => actionCreators.update(data)
  )
}

const actionCreators = linkActionsToStore('batches:batchDetail', reducers)
export default actionCreators
