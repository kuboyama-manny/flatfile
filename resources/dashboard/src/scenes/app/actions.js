import { linkActionsToStore } from 'store'
import trackRequest from 'logic/track-request'
import App from 'api/app'

const reducers = {
  getAllTeams: trackRequest(
      'getAllTeamsInfo',
      () => App.getAllTeam(),
      data => actionCreators.update(data)
  ),
  addNewTeam: trackRequest(
      'addNewTeamInTeams',
      data => App.addOneTeam(data),
      data => actionCreators.update(data)
  ),
  handleOpenModal: state => {
    return {
        ...state,
        modalOpen: true
    }
  },
  handleCloseModal: state => {
    return {
        ...state,
        modalOpen: false
    }
  },
  getLicenseLists: trackRequest(
    'getAllLicenseLists',
    (queryParam) => App.getAllLicenseUsers(queryParam),
    data => actionCreators.update(data)
  ),
  openLicenseModal: state => {
    return {
      ...state,
      showLicenseKeyModal: true
    }
  },
  closeLicenseModal: state => {
    return {
      ...state,
      showLicenseKeyModal: false
    }
  }
};

const actionCreators = linkActionsToStore('app', reducers, { modalOpen: false, showLicenseKeyModal: false });
export default actionCreators
