import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import UpdateCard from 'api/payment-method'
import Invitation from 'api/invitation'

const reducers = {
    getMembersInfos: trackRequest(
        'membersInfos',
        data => UpdateCard.getCardInfos(data),
        data => actionCreators.update(data)
    ),
    getMailedUsers: trackRequest(
        'mailedUsersInfos',
        data => Invitation.getMailedUsers(data),
        data => actionCreators.update(data)
    ),
    sendInvitation: trackRequest(
        'sendInvitationUsers',
        data => Invitation.sendInvitationToEmail(data),
        data => actionCreators.update(data)
    ),
    deleteUserEmail: trackRequest(
        'deleteEmailResult',
        data => Invitation.deleteEmail(data),
        data => actionCreators.update(data)
    ),
    deleteTeamMember: trackRequest(
        'deleteSelectedOne',
        data => Invitation.deleteSelectedMember(data),
        data => actionCreators.update(data)
    )
};

const actionCreators = linkActionsToStore('invitation', reducers, {}, true);
export default actionCreators