import { createStore, applyMiddleware } from 'redux'
import { connect } from 'react-redux'
// import loggerMiddleware from 'redux-logger'

const consoleStyles = {
  label: 'color: blue; font-weight: bold;',
  action: 'color: darkred; font-weight: bold;'
}

const initialState = {}
const reducers = {}
let lastKnownRootState

export const linkActionsToStore = (namespace, localActions, localInitialState={}, rootStateRequired=false) => {
  reducers[namespace] = localActions
  initialState[namespace] = localInitialState
  if (lastKnownRootState) {
    lastKnownRootState[namespace] = localInitialState
  }

  const localActionCreators = {}

  // Ensure all stores have an update action/reducer
  if ('update' in localActions) {
    throw new Error('update() is a reserved action/reducer, you cannot make your own')
  }
  localActions.update = (state, payload) => ({ ...state, ...payload })

  // Ensure all stores have a connect() method
  if ('connect' in localActions) {
    throw new Error('connect() is a reserved action/reducer, you cannot make your own')
  }

  const mapRootStateToProps = rootState => {
    if(rootStateRequired === true) {
      return namespace in rootState ? {...rootState[namespace], rootState} : {...localInitialState, rootState}
    } else {
      return namespace in rootState ? rootState[namespace] : localInitialState
    }
  }

  const mapDispatchToProps = dispatch => {
    const boundActions = {}
    Object.keys(localActions).forEach(key => {
      boundActions[key] =
        payload => dispatch(localActionCreators[key](payload))
    })
    return boundActions
  }

  localActionCreators.connect = ComponentClass  => {
    return connect(mapRootStateToProps, mapDispatchToProps)(ComponentClass)
  }

  Object.keys(localActions).forEach(type => {
    localActionCreators[type] = payload => ({
      namespace, type, payload
    })
  })

  console.debug(`%cLinked ${namespace} actions:`, consoleStyles.action, Object.keys(localActions))

  return localActionCreators
}

let store
const dispatch = action => {
  setTimeout(() => store.dispatch(action))
}

const rootReducer = (rootState, action) => {
  lastKnownRootState = rootState

  if (!action) {
    return rootState
  }

  const { namespace, type, payload } = action

  if (!reducers[namespace] || !reducers[namespace][type]) {
    return rootState
  }

  const localState = rootState[namespace] || initialState[namespace]
  const newLocalState = reducers[namespace][type](localState, payload, dispatch)

  if (!newLocalState || newLocalState instanceof Promise) {
    console.debug(
      `%cAction: %c${namespace}.${type} %c// rootState.${namespace}:`,
      consoleStyles.label,
      consoleStyles.action,
      consoleStyles.label,
      localState,
      '🢂 No Change'
    )

    return rootState
  }

  const newRootState = { ...rootState, [namespace]: newLocalState }

  console.debug(
    `%cAction: %c${namespace}.${type} %c// rootState.${namespace}:`,
    consoleStyles.label,
    consoleStyles.action,
    consoleStyles.label,
    localState,
    '🢂',
    newLocalState
  )

  return newRootState
}

console.debug('%cInitial state:', consoleStyles.label, initialState)

store = createStore(
  rootReducer,
  initialState,
  // applyMiddleware(loggerMiddleware),
  typeof devToolsExtension === 'function' ? devToolsExtension() : undefined
)

export default store
