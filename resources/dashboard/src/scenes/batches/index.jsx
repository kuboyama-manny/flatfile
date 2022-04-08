import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, Tag, Icon } from 'antd'
import { RSAlert } from 'reactsymbols-kit'
import 'react-table/react-table.css'
import styles from './styles.scss'
import Breadcrumb from 'logic/breadcrumb'
import BatchActions from './actions'
import BatchDetail from './batchDetail/'
import autobind from 'autobind-decorator'
import moment from 'moment'

class ImportBatches extends Component {
  columns = []
  state = {
    view: 'home',
    pagination: {}
  }

  // constructor () {
  //   super()
  //   // this.columns = []
  //   // this.state = {
  //   //   view: 'home'
  //   // }
  // }
  componentDidMount () {
    this.columns = [
      {
        title: '',
        dataIndex: 'managed',
        render: (text, record) => {
          if (record.managed) {
            return <Icon type='tool' />
          }
          return ''
        }
      },
      {
        title: 'User',
        dataIndex: 'end_user.name',
        render: (text, record) => {
          if (record.end_user) {
            return <span className={styles.overflowEllipsis}>
              <Tag>{record.end_user.user_id}</Tag>
              {' '}
              {record.end_user.name}
            </span>
          }
          return <span className='skeleton'>n/a</span>
        }
      },
      {
        title: 'Company',
        dataIndex: 'end_user.company_name',
        render: (text, record) => {
          if (record.end_user && record.end_user.company_id) {
            return <span className={styles.overflowEllipsis}>
              <Tag>{record.end_user.company_id}</Tag>
              {record.end_user.company_name}
            </span>
          }
          return <span className='skeleton'>n/a</span>
        }
      },
      {
        title: 'Filename',
        dataIndex: 'filename',
        render: (text) => {
          if (text) {
            return <span>
              <Icon type='file' />
              <span className={styles.fileName}>{text}</span>
            </span>
          }
          return <span className={styles.manualInput}>
            <Icon type='table' />
            <span>manual input by user</span>
          </span>
        }
      },
      {
        title: 'Rows',
        dataIndex: 'count_rows'
      },
      {
        title: 'Uploaded At',
        dataIndex: 'created_at',
        render: (text) => (
          <span className={styles.overflowEllipsis}>
            {moment(text).calendar()}
          </span>
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        // accessor: row => {
        //   return this.getStatus(row)
        // },
        render: (text, row) => {
          let status = this.getStatus(row)
          return <span className={`${styles.status} ${styles[status]}`}>
            {text}
          </span>
        }
      }
    ]
    this.updateRoute(this.props)
    this.fetchData({ page: 1, pageSize: 12 })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.updateRoute(this.props)
    }

    if (prevProps.batches !== this.props.batches) {
      let set = this.props.batches
      // debugger
      this.setState({
        pagination: {
          current: set.currentPage,
          pageSize: set.pageSize,
          total: set.totalCount
        }
      })
    }
  }

  updateRoute (props) {
    const id = props.match.params.id
    this.setState({ view: id ? 'batch_detail' : 'home', id })
    this.breadcrumb = Breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Batches',
      href: '/batches'
    })
  }

  @autobind
  handleTableChange (pagination, filters, sorter) {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetchData({ page: pagination.current, pageSize: pagination.pageSize })
  }

  @autobind
  async fetchData (params) {
    this.props.fetchBatches({ pageSize: 12, ...params })
  }

  getStatus (row) {
    let status = 'started'
    if (row.failed_at) {
      status = 'failed'
    } else if (row.handled_at) {
      status = 'completed'
    } else if (row.submitted_at) {
      status = 'submitted'
    }
    return status
  }

  @autobind
  goTo (row) {
    this.props.history.push(`/batches/${row.id}`)
  }

  render () {
    switch (this.state.view) {
      case 'batch_detail':
        return (
          <BatchDetail batchId={this.state.id} breadcrumb={this.breadcrumb} />
        )
      case 'home':
      default:
        return (
          <div className={styles.batchHome}>
            <RSAlert visible={Boolean(this.props.batchesError)}>
              <p>Sorry! Something bad happened!</p>
            </RSAlert>
            <div className='container'>
              <h2>Batch History</h2>
              <Table
                scroll={{x: true}}
                rowKey={record => record.id}
                pagination={this.state.pagination}
                loading={this.props.batchesLoading}
                className={styles.table}
                dataSource={this.props.batches ? this.props.batches.records : []}
                columns={this.columns}
                onChange={this.handleTableChange}
                onRow={(record) => ({ onClick: () => this.goTo(record) })}
              />
            </div>
          </div>
        )
    }
  }
}

export default withRouter(BatchActions.connect(ImportBatches))
