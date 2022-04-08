import React, { Component } from 'react'
import { RSIcon } from 'reactsymbols-kit'
import MenuItems from './MenuItems'

import styles from './styles.scss'

class AccountMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menu: 'none'
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.getUserInitials = this.getUserInitials.bind(this)
  }

  toggleMenu () {
    if (this.state.menu === 'none') {
      this.setState({ menu: 'inline-block' })
    } else {
      this.setState({ menu: 'none' })
    }
  }

  getUserInitials (fullName) {
    let names = fullName.split(' ')
    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }
    return initials
  }

  render () {
    const { currentUserName } = this.props

    return (
      <div className={styles.accDropdown} onClick={this.toggleMenu.bind(this)}>
        <span className={styles.accPhoto}>
          {currentUserName && this.getUserInitials(currentUserName.name)}
        </span>
        {currentUserName && currentUserName.name}
        <RSIcon
          name='MdKeyboardArrowDown'
          size={20}
          style={{ marginLeft: '10px', display: 'inline-block' }}
        />
        <div style={{ display: this.state.menu }}>
          <MenuItems {...this.props} />
        </div>
      </div>
    )
  }
}

export default AccountMenu
