import React, { Component } from 'react'
import Breadcrumb from 'logic/breadcrumb'
import CardContainer from 'elements/card'
import InvitationActions from './actions'
import { RSButton, RSInput, RSAlert, RSRadio } from 'reactsymbols-kit'
import Modal from 'react-modal'
import InvitationForm from 'scenes/invitation/components/InvitationForm'
import TableComponent from 'scenes/invitation/components/TableComponent'
import styles from './styles.scss'

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

class Invitation extends Component {
    constructor (props) {
        super(props)

        this.state = {
            deleteModalIsOpen: false,
            deleteMailedUserId: null,
            role: ''
        };

        this.deleteMailedUser = this.deleteMailedUser.bind(this)
        this.deleteMember = this.deleteMember.bind(this)
        this.deleteSelectedItem = this.deleteSelectedItem.bind(this)
        this.sendInvitationToEmail = this.sendInvitationToEmail.bind(this)
    }

    componentDidMount() {
        this.breadcrumb = Breadcrumb.register({
            icon: 'pt-icon-th-list',
            name: 'Manage team',
            href: '/invitation'
        });

        this.props.rootState.app.getAllTeamsInfo && this.props.getMembersInfos(this.props.rootState.app.getAllTeamsInfo.current_team_id);
        this.props.rootState.app.getAllTeamsInfo && this.props.getMailedUsers(this.props.rootState.app.getAllTeamsInfo.current_team_id);
    }

    componentWillReceiveProps(nextProps) {

        if(JSON.stringify(this.props.sendInvitationUsers) !== JSON.stringify(nextProps.sendInvitationUsers)) {
            this.props.getMailedUsers(this.props.rootState.app.getAllTeamsInfo.current_team_id);
        }

        if(JSON.stringify(this.props.deleteEmailResult) !== JSON.stringify(nextProps.deleteEmailResult)) {
            this.props.getMailedUsers(this.props.rootState.app.getAllTeamsInfo.current_team_id);
        }

        if(JSON.stringify(this.props.deleteSelectedOne) !== JSON.stringify(nextProps.deleteSelectedOne)) {
            this.props.getMembersInfos(this.props.rootState.app.getAllTeamsInfo.current_team_id);
        }
    }

    sendInvitationToEmail(data) {
        this.props.sendInvitation({ data: data, id: this.props.rootState.app.getAllTeamsInfo.current_team_id });
    }

    deleteMailedUser(id, role) {
        this.setState({ deleteModalIsOpen: true, deleteMailedUserId: id, role: role });
    };

    deleteMember(id, role) {
        this.setState({ deleteModalIsOpen: true, deleteMailedUserId: id, role: role });
    };

    deleteSelectedItem(id, role) {
        if(!!id === true && role === 'user') {
            this.props.deleteUserEmail(id);
            this.setState({ deleteModalIsOpen: false });
        }
        if(!!id === true && role === 'member') {
            this.props.deleteTeamMember({ memberId: id, teamId: this.props.rootState.app.getAllTeamsInfo.current_team_id });
            this.setState({ deleteModalIsOpen: false });
        }
    };

    getUserInitials(fullName) {
        var names = fullName.split(' '),
            initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };


    render () {

        const { deleteModalIsOpen, deleteMailedUserId, role } = this.state;
        const {
            membersInfos,
            mailedUsersInfos,
            sendInvitationUsersLoading,
            sendInvitationUsersError,
            deleteEmailResult,
            deleteEmailResultError,
            deleteSelectedOne,
            deleteSelectedOneError
        } = this.props;

        return (
            <div className={styles.container}>
                <Modal
                    isOpen={deleteModalIsOpen}
                    contentLabel="Mailed User Modal"
                    style={customStyles}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        <div className={styles.confirmMessage}>
                            <span>Remove user</span>
                        </div>
                        <p>Are you sure you want to remove this user?</p>
                        <div className={styles.buttonGroup}>
                            <RSButton value="Cancel" onClick={() => this.setState({ deleteModalIsOpen: false })} />
                            <RSButton value="Yes, Remove" onClick={() => this.deleteSelectedItem(deleteMailedUserId, role)}/>
                        </div>
                    </div>
                </Modal>
                <div className={styles.cardRow}>
                    <div className={styles.cardColumn}>
                          <CardContainer title="Send Invitation">
                              <RSAlert
                                  visible={typeof this.props.sendInvitationUsers === 'object' && sendInvitationUsersError === false}
                                  style={{ backgroundColor: '#d5edda', borderRadius: 0, padding: 0 }}>
                                  <p style={{ color: '#155724' }}>The invitation has been sent!</p>
                              </RSAlert>
                              <InvitationForm
                                  sendInvitationToEmail={this.sendInvitationToEmail}
                                  sendInvitationUsersError={sendInvitationUsersError}
                                  sendInvitationUsersLoading={sendInvitationUsersLoading}
                              />
                          </CardContainer>
                      </div>
                      <div className={styles.cardColumn}>
                          <CardContainer title="Pending invitations" table="true">
                              <RSAlert
                                  visible={typeof deleteEmailResult === 'object'}
                                  style={{ backgroundColor: '#d5edda', borderRadius: 0, padding: 0 }}>
                                  <p style={{ color: '#155724' }}>User was successfully removed</p>
                              </RSAlert>
                              <RSAlert
                                  visible={typeof deleteEmailResultError === 'object'}
                                  style={{ backgroundColor: '#f8d7da', borderRadius: 0, padding: 0 }}>
                                  <p style={{ color: '#721c24' }}>Sorry, we can't remove this user</p>
                              </RSAlert>
                              <TableComponent>
                                  { mailedUsersInfos && mailedUsersInfos.length > 0 &&
                                  <table>
                                      <thead>
                                          <tr>
                                              <th><span>Email address</span></th>
                                              <th style={{ width: '1px', textAlign: 'center' }}>Dismiss</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {
                                              mailedUsersInfos && mailedUsersInfos.length > 0 && mailedUsersInfos.map((user, i) => {
                                                  return (
                                                      <tr key={i}>
                                                          <td>
                                                              <span>{ user.email }</span>
                                                          </td>
                                                          <td style={{ textAlign: 'center' }}>
                                                              <i className="fa fa-trash" style={{ fontSize: '1rem' }} onClick={() =>this.deleteMailedUser(user.id, 'user')} />
                                                          </td>
                                                      </tr>
                                                  )
                                              })
                                          }
                                      </tbody>
                                  </table>
                                } { mailedUsersInfos && mailedUsersInfos.length <= 0 &&
                                  <div className={styles.noPendingUsers}>No pending invitations</div>
                                }
                            </TableComponent>
                        </CardContainer>
                    </div>
                </div>
                <CardContainer title="Team members" table="true">
                    <RSAlert
                        visible={typeof deleteSelectedOne === 'object'}
                        style={{ backgroundColor: '#d5edda', borderRadius: 0, padding: 0 }}>
                        <p style={{ color: '#155724' }}>User was successfully removed</p>
                    </RSAlert>
                    <RSAlert
                        visible={typeof deleteSelectedOneError === 'object'}
                        style={{ backgroundColor: '#f8d7da', borderRadius: 0, padding: 0 }}>
                        <p style={{ color: '#721c24' }}>Sorry, we can't remove this user</p>
                    </RSAlert>
                    <TableComponent>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th style={{ width: '1px', textAlign: 'center' }}>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    membersInfos && membersInfos.users.map((member, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <span style={{
                                                      backgroundColor: '#FAFBFC',
                                                      borderRadius: '48px',
                                                      display: 'inline-block',
                                                      fontSize: '0.9rem',
                                                      fontWeight: '500',
                                                      letterSpacing: '0.025em',
                                                      height: '48px',
                                                      marginRight: '10px',
                                                      lineHeight: '48px',
                                                      textAlign: 'center',
                                                      width: '48px'
                                                    }}>{ this.getUserInitials(member.name) }</span>
                                                    { member.name }
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    { member.pivot.role === 'member' &&
                                                        <i
                                                            className="fa fa-trash"
                                                            aria-hidden="true"
                                                            style={{ fontSize: '1rem' }}
                                                            onClick={() => this.deleteMember(member.id, 'member')}
                                                        />
                                                    }
                                                    { member.pivot.role !== 'member' &&
                                                        <i
                                                            className="fa fa-ban"
                                                            aria-hidden="true"
                                                            style={{ fontSize: '1rem', color: '#C2CAD4' }}
                                                        />
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </TableComponent>
                </CardContainer>
            </div>
        )
    }
}

export default InvitationActions.connect(Invitation)
