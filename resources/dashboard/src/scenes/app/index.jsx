import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Modal } from 'antd'
import { RSInput, RSIcon, RSButton } from 'reactsymbols-kit'

import Breadcrumbs from './components/breadcrumbs'
import AccountMenu from './components/AccountMenu'

import Sidebar from 'scenes/sidebar'
import styles from './styles.scss'

import AppActions from './actions'
import Router from './router'

import Authentication from 'logic/authentication'
import TeamGroupContainer from './components/teamGroup'
import classNames from 'classnames/bind'
import autobindMethods from 'class-autobind-decorator'

const customStyles = {
  content: {
    border: '1px solid transparent',
    boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};

let teamName = ''
let cx = classNames.bind(styles)

@autobindMethods() // converts class methods to foo = () => {}
class App extends Component {
  componentWillMount () {
    Authentication.onInvalidateAccessToken(() => {
      this.forceUpdate() // force re-render when access token is expired
    })
  }

  componentDidMount () {
    this.props.getAllTeams()

    let config = {
      selector: `.${styles.navItemBadge}`,
      account: 'xaBE47'
    }
    window.Headway.init(config)
  }

  componentWillReceiveProps (nextProps) {
    if(JSON.stringify(this.props.getAllTeamsInfo) !== JSON.stringify(nextProps.getAllTeamsInfo)) {
      this.props.getLicenseLists({ team_id: nextProps.getAllTeamsInfo && nextProps.getAllTeamsInfo.current_team_id })
    }
  }

  showModal () {
    this.props.handleOpenModal()
  }

  handleModalOK () {
    var formData = {
      busy: true,
      errors: {
        errors: {}
      },
      name: teamName,
      slug: teamName.split(' ').join('-'),
      successful: false
    }
    this.props.addNewTeam(formData)
    window.location.href = `/api/v1/teams/${
      this.props.getAllTeamsInfo.current_team_id
    }/switch`
    this.props.handleCloseModal()
  }

  handleModalCancel () {
    this.props.handleCloseModal()
  }

  onChangeTeamName (value) {
    teamName = value
  }

  fetchAllLicenseUser () {
    this.props.openLicenseModal()
  }

  renderDashboard (props) {
    const { switchAnotherTeam, addNewTeamInTeams, getAllTeamsInfo } = this.props

    return (
      <div className={styles.frame}>
        <div className={styles.sidebar}>
          <div className={styles.navHeader}>
            <TeamGroupContainer
              teamInfos={this.props.getAllTeamsInfo}
              showModal={this.showModal}
              selectedOptionTeam={this.props.selectedOptionTeam}
              switchAnotherTeam={switchAnotherTeam}
              addNewTeamInTeams={addNewTeamInTeams}
            />
            <Modal
              title='Add team'
              onOk={this.handleModalOK}
              onCancel={this.handleModalCancel}
              visible={this.props.modalOpen}
            >
              <span style={{ marginRight: '5px' }}>Team Name</span>
              <RSInput
                type='text'
                name='teamName'
                onChange={value => this.onChangeTeamName(value)}
              />
            </Modal>
          </div>
          <div className={styles.scrollWrapper}>
            <Sidebar getLicenseLists={() =>this.fetchAllLicenseUser()} />
            <Modal
              visible={this.props.showLicenseKeyModal}
              onCancel={() => this.props.closeLicenseModal()}
              footer={null}
            >
              <div className={styles.modalContent}>
                <div className={styles.confirmMessage}>
                  <span>License key</span>
                </div>
                {
                  this.props.getAllLicenseLists && this.props.getAllLicenseLists.data.map((item, i) => <div className={styles.description} key={i}><span>{item.key}</span></div>)
                }
                <div className={styles.buttonGroup}>
                  <RSButton value="Got it" onClick={() => this.props.closeLicenseModal()} />
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div className={styles.content}>
          <div className={cx('navHeader', 'rightSide')}>
            <div>
              <Breadcrumbs />
            </div>
            <div className={styles.navItems}>
              <div className={styles.navItem}>
                <RSIcon name='MdHelp' size={24} tooltip='Font Icon' />
              </div>
              <div className={styles.navItemBadge}>
                <RSIcon name='MdNotifications' id='headway' size={24} />
              </div>
              <div className={styles.accDropdown}>
                <AccountMenu currentUserName={getAllTeamsInfo} {...props} />
              </div>
            </div>
          </div>
          <div className={styles.scrollWrapper}>
            <Router />
          </div>
        </div>
      </div>
    )
  }

  renderRedirectNotice () {
    return <h3>Redirecting, please wait...</h3>
  }

  render () {
    const { authenticatedRoute, loginCallback } = Authentication

    return (
      <BrowserRouter basename='/app'>
        <Switch>
          <Route path='/login-callback' component={loginCallback} />
          <Route path='/login-callback' component={loginCallback} />
          <Route
            component={authenticatedRoute(
              props => this.renderDashboard(props),
              () => this.renderRedirectNotice()
            )}
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default AppActions.connect(App)
