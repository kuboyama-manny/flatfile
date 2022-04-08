import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import DataModel from 'api/data-model'

const reducers = {
}

const actionCreators = linkActionsToStore('models:dataHandling', reducers)
export default actionCreators
