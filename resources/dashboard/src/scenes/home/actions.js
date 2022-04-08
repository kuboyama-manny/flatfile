import { linkActionsToStore } from 'store'

import DataModel from 'api/data-model'
import trackRequest from 'logic/track-request'

const reducers = {
  incrementCounter: state => {
    return {
      ...state,
      counter: (state.counter || 0) + 1
    }
  },

  // the manual process
  fetchDataModels: async (state, payload, dispatch) => {
    const update = data => dispatch(actionCreators.update(data))

    update({ dataModelsLoading: true, dataModelsError: false })

    try {
      const response = await DataModel.list()
      update({ dataModels: response, dataModelsLoading: false })
    }

    catch (error) {
      update({ dataModelsLoading: false, dataModelsError: error })
    }
  },

  // use trackRequest to automate all that
  fetchDataModelsAlternative: trackRequest(
    'dataModels', // also creates dataModelsLoading and dataModelsError automatically
    payload => DataModel.list(), // data loader
    data => actionCreators.update(data) // store updater action creator
  )
}

const actionCreators = linkActionsToStore('home', reducers, { counter: 100 })
export default actionCreators
