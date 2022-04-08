import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import Security from 'api/security'

const reducers = {
    updatePassword: trackRequest(
        'updateNewPassword',
        data => Security.updateCurrentPassword(data),
        data => actionCreators.update(data)
    )
};

const actionCreators = linkActionsToStore('security', reducers);
export default actionCreators