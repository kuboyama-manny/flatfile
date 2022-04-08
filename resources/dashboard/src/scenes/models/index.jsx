import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import ReactTable, { ReactTableDefaults } from 'react-table'
import { Link, Route } from 'react-router-dom'
import { RSButton, RSAlert, RSTabGroup, RSTab } from 'reactsymbols-kit'
import { Popover, Button } from 'antd';
import NewModel from './components/newModelButton'
import styles from './styles.scss'
import tableStyles from 'styles/react-table.scss'
import Breadcrumb from 'logic/breadcrumb'

import ModelsActions from './actions'
import DataModel from 'api/data-model'
import ModelEdit from './components/model-edit'

const columns = [{
  Header: 'Name',
  accessor: 'name'
}, {
  Header: '# Fields',
  id: 'fields_count',
  accessor: row => row.fields.length
}, {
  Header: '# Uploaded Files',
  accessor: 'files_count'
}, {
  Header: 'Actions',
  id: 'actions',
  Cell: cell => <Link to={`/models/${cell.row._original.id}`}><RSButton value='View' size='small' /></Link>
}]

class Models extends Component {
  constructor (props) {
    super(props)
    this.hideModelDialog = this.hideModelDialog.bind(this)
    this.handleVisibleChange = this.handleVisibleChange.bind(this)
    this.createNewModel = this.createNewModel.bind(this)
    this.state = {
      modelDialogVisible: false
    }
  }

  componentDidMount() {
    this.updateRoute(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateRoute(nextProps)
  }

  hideModelDialog () {
    this.setState({
      modelDialogVisible: false,
    });
  }

  handleVisibleChange (modelDialogVisible) {
    this.setState({ modelDialogVisible });
  }

  updateRoute(props) {
    const id = props.match.params.id
    this.setState({ view: id ? 'model_edit' : 'home', id })
    this.breadcrumb = Breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Data Models',
      href: '/models'
    })
  }

  fetchData (state) {
    this.props.fetchDataModels({ page: state.page + 1, pageSize: state.pageSize })
  }

  async createNewModel (history, name) {
    this.hideModelDialog()
    const model = await DataModel.create({
      name,
      type: 'Unit'
    })
    history.push(`/models/${model.id}`)
  }

  renderView () {
    switch (this.state.view) {
      case 'model_edit':
        return <ModelEdit modelId={this.state.id} breadcrumb={this.breadcrumb} />
      case 'home':
        return (
          <div className={styles.modelHome}>
            <RSAlert visible={Boolean(this.props.modelsError)} >
              <p>Sorry! Something bad happened!</p>
            </RSAlert>
            <div className="container">
              <h2>Your Models</h2>
              <ReactTable
                manual
                defaultPageSize={10}
                getTheadThProps={() => ({ className: tableStyles.tableTh })}
                getTrGroupProps={() => ({ className: tableStyles.tableTrGroup })}
                getTdProps={() => ({ className: tableStyles.tableTd })}
                getThProps={() => ({ className: tableStyles.tableTh })}
                className={tableStyles.table}
                data={this.props.models ? this.props.models.records : []}
                pages={this.props.models ? this.props.models.lastPage : -1}
                columns={columns}
                onFetchData={(state) => this.fetchData(state)} />
            </div>
          </div>
        )
    }
  }

  render() {
    return (
      <div className={styles.models} >
        {this.renderView()}
      </div>
    )
  }
}

export default ModelsActions.connect(Models)

// <Route render={
//   ({ history }) =>
//     <NewModel createNewModel={this.createNewModel} history={history} />
//   }
// />
