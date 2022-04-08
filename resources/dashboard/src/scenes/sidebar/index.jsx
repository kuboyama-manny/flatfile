import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { RSIcon } from 'reactsymbols-kit'
import styles from './styles.scss'

export default class Sidebar extends Component {
  render () {
    return <div className={styles.sidebarGroup}>
      <h3 className={styles.linkHeader}>Manage</h3>
      <NavLink activeClassName={styles.activeLink} exact to='/'>
          <RSIcon name='MdHome' /> Overview</NavLink>
      <NavLink activeClassName={styles.activeLink} exact to='/batches'>
          <RSIcon name='MdReceipt' /> Import History</NavLink>
      <NavLink activeClassName={styles.activeLink} exact to='/models'>
          <RSIcon name='MdSettingsApplications' /> Data Models</NavLink>
      <h3 className={styles.linkHeader}>Account</h3>
      <div className={styles.licenseBtn} onClick={() =>this.props.getLicenseLists()}><RSIcon name="MdVerifiedUser" /><span> Licenses</span></div>
      <NavLink activeClassName={styles.activeLink} exact to='/invitation'>
          <RSIcon name='MdCheckCircle' /> Team</NavLink>
      <NavLink activeClassName={styles.activeLink} to='/billing'>
          <RSIcon name='FaCreditCard' /> Billing</NavLink>
      <NavLink activeClassName={styles.activeLink} to='/subscription'>
          <RSIcon name='MdCached' /> Subscription</NavLink>
      <NavLink activeClassName={styles.activeLink} exact to='/security'>
          <RSIcon name='MdLock' /> Profile settings</NavLink>
    </div>
  }
}
