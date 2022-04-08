import React, { Component } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import {
  CollapsibleList,
  MenuItem,
  Classes
} from '@blueprintjs/core'

import BreadcrumbsActions from './actions'

class Breadcrumbs extends Component {
  componentWillMount() {
    const { initialize } = this.props
    initialize()
  }

  renderBreadcrumb(props) {
    if (props.href != null) {
      return <Link className={Classes.BREADCRUMB} to={props.href}>{props.text}</Link>;
    }
    else {
      return <span className={classnames(Classes.BREADCRUMB, Classes.BREADCRUMB_CURRENT)}>{props.text}</span>;
    }
  }

  render() {
    const { navigationBreadcrumbs=[] } = this.props
    return (
      <CollapsibleList
        className={Classes.BREADCRUMBS}
        dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
        renderVisibleItem={props => this.renderBreadcrumb(props)}
        visibleItemCount={2}
      >
        {
          navigationBreadcrumbs.map((item, index) =>
            <MenuItem key={index} iconName={item.icon} text={item.name} href={item.href} />
          )
        }
      </CollapsibleList>
    )
  }
}

export default BreadcrumbsActions.connect(Breadcrumbs)
