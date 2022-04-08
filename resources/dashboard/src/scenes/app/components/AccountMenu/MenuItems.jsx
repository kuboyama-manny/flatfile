import React, { Component } from 'react'
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core'
import autobind from 'autobind-decorator'

import styles from './styles.scss'

class MenuItems extends Component {
  @autobind
  handleClick (routerURL) {
    this.props.history.push(routerURL)
  }

  render () {
    return (
      <Menu className={styles.ptMenu}>
        <MenuItem
          icon='new-text-box'
          onClick={() => this.handleClick('/security')}
          text='Account settings'
        />
        <MenuItem
          icon='people'
          onClick={() => this.handleClick('/invitation')}
          text='Manage team'
        />
        <MenuItem
          icon='credit-card'
          onClick={() => this.handleClick('/billing')}
          text='Billing'
        />
        <MenuItem
          icon='bookmark'
          onClick={() => this.handleClick('/subscription')}
          text='Subscription'
        />
        <MenuDivider />
        <MenuItem icon='logout' text='Logout' />
      </Menu>
    )
  }
}

export default MenuItems
