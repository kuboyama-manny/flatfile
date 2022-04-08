/**
 * trackRequest(key, makeRequest, updateAction)
 *
 * Arguments:
 *   key - the value you want to update the store with
 *   makeRequest - your data loader
 *   update - an action creator that updates redux (will be dispatched)
 */
export default (key, makeRequest, updateAction) => {
  return async (state, payload, dispatch) => {
    const dispatchUpdate = data => dispatch(updateAction(data))
    const loadingKey = `${key}Loading`
    const errorKey = `${key}Error`

    dispatchUpdate({ [loadingKey]: true, [errorKey]: false })

    try {
      const response = await makeRequest(payload)
      dispatchUpdate({ [loadingKey]: false, [key]: response })
      return response
    } catch (error) {
      dispatchUpdate({ [loadingKey]: false, [errorKey]: error })
    }
  }
}
