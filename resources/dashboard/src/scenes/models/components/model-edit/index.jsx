import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { RSTabGroup, RSTab } from 'reactsymbols-kit'
import styles from '../../styles.scss'

import Spinner from 'elements/spinner'

import ModelEditActions from './actions'
import FieldsEdit from '../fields-edit'
import DataHandling from '../data-handling'
import Settings from '../settings'

class ModelEdit extends Component {
  state = {
    stage: 0
  }

  componentWillMount () {
    const { fetchDataModel, modelId } = this.props
    fetchDataModel(modelId)
    this.updateBreadcrumbs(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateBreadcrumbs(nextProps)
  }

  updateBreadcrumbs(props) {
    const { breadcrumb, model, modelId } = props

    this.breadcrumb = breadcrumb.register(
      model && modelId === model.id ? {
        icon: 'pt-icon-th-list',
        name: model.name,
        href: `/models/${model.id}`
      } : {
        icon: 'pt-icon-th-list',
        name: 'Loading...'
      }
    )
  }

  renderStage() {
    const { stage } = this.state
    const { model, modelId } = this.props

    if (!model || modelId !== model.id) {
      return <Spinner />
    }

    switch (stage) {
      // case 2:
      //   return <MiddlewareEdit model={model} breadcrumb={this.breadcrumb} />
      case 2:
        return <DataHandling model={model} breadcrumb={this.breadcrumb} />
      case 1:
        return <FieldsEdit model={model} breadcrumb={this.breadcrumb} />
      default:
        return <Settings model={model} breadcrumb={this.breadcrumb} />
    }
  }

  render () {
    return (
      <div className={styles.modelWrapper}>
        <RSTabGroup
          selectedTab={0}
          onChange={stage => this.setState({ stage })}
          className={styles.tabrow}>
          <RSTab label='Settings' />
          <RSTab label='Fields' />
        </RSTabGroup>
        <div className={styles['model-edit']}>
          {this.renderStage()}
        </div>
      </div>
    )
  }
}

export default ModelEditActions.connect(ModelEdit)
