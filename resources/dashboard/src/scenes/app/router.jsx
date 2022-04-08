import React, { Component } from 'react'
import { Switch, Route, IndexRoute } from 'react-router-dom'

import Billing from 'scenes/billing'
import ImportBatches from 'scenes/batches'
import Models from 'scenes/models'
import Home from 'scenes/home'
import Subscription from 'scenes/subscription'
import Invitation from 'scenes/invitation'
import Security from 'scenes/security'

export default class Router extends Component {
  render () {
    return (
      <Switch>
        <Route
          exact
          path='/'
          component={Home}
        />
        <Route
          exact
          path='/batches'
          component={ImportBatches}
        />
        <Route
          exact
          path='/batches/:id'
          component={ImportBatches}
        />
        <Route
          exact
          path='/models'
          component={Models}
        />
        <Route
          exact
          path='/models/:id'
          component={Models}
        />
        <Route
          exact
          path='/invitation'
          component={Invitation}
        />
        <Route
          exact
          path='/security'
          component={Security}
        />
        <Route
          exact
          path='/billing'
          component={Billing}
        />
        <Route
          exact
          path='/subscription'
          component={Subscription}
        />
        <Route
          component={() => <h2>Not Found</h2>}
        />
      </Switch>
    )
  }
}
