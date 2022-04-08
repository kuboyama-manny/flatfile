import React, { Component } from 'react'
import axios from 'axios'
import { checkStatus } from '../../../logic/functions'
import moment from 'moment'
import matchSorter from 'match-sorter'
import Papa from 'papaparse'
import { DebounceInput } from 'react-debounce-input'
import { RSInput } from 'reactsymbols-kit'
import { Radio, Timeline, Tag } from 'antd'
// import EditableTagGroup from '../../../elements/editableTagGroup'
import styles from '../styles.scss'
import BatchActions from './actions'

class BatchDetail extends Component {
  constructor (props) {
    super(props)
    this.loaded = false
    this.state = {
      view: 'empty',
      tags: [],
      search: '',
      memo: '',
      original: [],
      matched: [],
      reviewed: []
    }
  }

  componentWillMount () {
    const { fetchBatch, batchId, fetchRows } = this.props
    fetchBatch(batchId)
    fetchRows(batchId)
    this.updateBreadcrumbs(this.props)
  }

  componentDidUpdate (prevProps) {
    const { batch, rows, batchId } = this.props;
    (batchId !== prevProps.batchId || !this.loaded) && this.updateBreadcrumbs(this.props)
    if (batch && batch !== prevProps.batch) {
      const { uploads, manual } = batch
      manual && this.setState({ view: 'reviewed' })
      const headersMatched = batch.headers_matched
      const countColumns = batch.count_columns
      if (this.state.memo === '') {
        this.setState({ memo: batch.memo || '' })
      }
      if (
        !manual &&
        headersMatched &&
        headersMatched.length &&
        !this.state.matched.length
      ) {
        this.getMatched()
      }
      if (!manual && uploads && uploads.length && !this.state.original.length) {
        this.getOriginal(
          uploads.filter(upload => /csv/.test(upload.filename))[0].url
        )
      } else if (!manual && countColumns && !this.state.original.length) {
        this.getDummyOriginal(countColumns)
      }
    }
    if (rows && rows !== prevProps.rows && !this.state.reviewed.length) {
      this.getReviewed()
    }
  }

  convertToLetters (number) {
    const baseChar = 'A'.charCodeAt(0)
    let letters = ''
    do {
      number -= 1
      letters = String.fromCharCode(baseChar + number % 26) + letters
      number = (number / 26) >> 0
    } while (number > 0)
    return letters
  }

  componentWillUpdate (nextProps, nextState) {
    const { memo } = nextState
    if (this.props.batch && memo !== this.state.memo) {
      const { id } = this.props.batch
      this.props.updateBatch({ id, memo })
    }
  }

  updateBreadcrumbs (props) {
    const { breadcrumb, batch, batchId } = props

    this.breadcrumb = breadcrumb.register(
      batch && batchId === batch.id
        ? {
          icon: 'pt-icon-th-list',
          name: batch.filename || batch.id,
          href: `/batches/${batch.id}`
        }
        : {
          icon: 'pt-icon-th-list',
          name: 'Loading...'
        }
    )
    this.loaded = batch && batchId === batch.id
  }

  getReviewed () {
    const reviewed = this.props.rows.records.map(r => (
      {sequence: r.sequence, data: r.mapped}
    )).filter(r => r)
    this.setState({ reviewed })
  }

  getDummyOriginal (countColumns) {
    const original = Array(countColumns).fill(' ').reduce((a, c, i) => {
      a[0].data[this.convertToLetters(i + 1)] = c
      return a
    }, [{sequence: 0, data: {}}])
    this.setState({original, view: 'original'})
  }

  getOriginal (url) {
    axios
      .get(url)
      .then(checkStatus)
      .then(response => {
        Papa.parse(response.data, {
          header: false,
          skipEmptyLines: true,
          complete: (results, file) => {
            const original = results.data.map((row, i) =>
              row.reduce((a, c, i) => {
                a.data[this.convertToLetters(i + 1)] = c
                return a
              }, {sequence: i + 1, data: {}})
            )
            const view =
              this.state.view === 'empty' ? 'original' : this.state.view
            this.setState({ original, view })
          }
        })
      })
      .catch(error => {
        console.warn('fetching original file errored:', error)
        this.props.batch && this.getDummyOriginal(this.props.batch.count_columns)
      })
  }

  async getMatched () {
    const original = await this.returnOriginal()
    const matchState = this.props.batch.headers_matched.map(v => [
      this.convertToLetters(v.index + 1),
      v.matched_key
    ])
    const matched = original.map((row, i) => {
      const newrow = {sequence: i + 1, data: {}}
      newrow.data = Object.keys(row.data).reduce((a, v, i) => {
        const match = matchState.find(m => m[0] === v)
        if (match) {
          a[match[1]] = row.data[v]
        }
        return a
      }, {})
      return newrow
    })
    this.setState({ matched })
  }

  returnOriginal () {
    return new Promise(resolve => {
      let checkOriginal = () => {
        if (this.state.original.length) {
          return resolve(this.state.original)
        }
        setTimeout(checkOriginal, 50)
      }
      checkOriginal()
    })
  }

  render () {
    const { batch } = this.props
    const managed = batch ? batch.managed : false
    let details = {}
    if (batch) {
      const endUser = batch.end_user
      let endUserBlock = endUser ? {} : null
      if (endUser) {
        const userID =
          endUser.name && endUser.user_id ? (
            <span className={styles.marks}>{endUser.user_id}</span>
          ) : null
        const name = endUser.name ? (
          <h6>
            {endUser.name}
            {userID}
          </h6>
        ) : null
        const email = endUser.email ? <p>{endUser.email}</p> : null
        const companyID =
          endUser.company_name && endUser.company_id ? (
            <span className={styles.marks}>{endUser.company_id}</span>
          ) : null
        const companyName = endUser.company_name ? (
          <h6>
            {endUser.company_name}
            {companyID}
          </h6>
        ) : null
        const url = batch.imported_from_url ? (
          <p>{batch.imported_from_url}</p>
        ) : null

        const user =
          name || email ? (
            <div className={styles.userInfo}>
              <h5>User</h5>
              {name}
              {email}
            </div>
          ) : null
        const company =
          companyName || url ? (
            <div className={styles.companyInfo}>
              <h5>Company</h5>
              {companyName}
              {url}
            </div>
          ) : null
        endUserBlock = (
          <div className={`${styles.detailSection} ${styles.endUser}`}>
            {user}
            {company}
          </div>
        )
      }
      // const tags =
      //   <div className={styles.detailSection}>
      //     <h6>Tags</h6>
      //     <div className={styles['tag-wrapper']}><EditableTagGroup tags={this.state.tags} onChange={change => console.log(change)} /></div>
      //   </div>
      const {
        count_rows,
        count_columns,
        count_rows_invalid,
        count_rows_accepted
      } = batch
      const dashboardBlock = (
        <div className={`${styles.detailSection} ${styles.dashboard}`}>
          <div className={styles.row}>
            <div className={styles.col}>
              <h6>{new Intl.NumberFormat().format(count_rows)}</h6>
              <h5>ROWS</h5>
            </div>
            <div className={styles.col}>
              <h6>{new Intl.NumberFormat().format(count_columns)}</h6>
              <h5>COLUMNS</h5>
            </div>
            <div className={styles.col}>
              <h6>{new Intl.NumberFormat().format(count_rows_invalid)}</h6>
              <h5 className={styles.errors}>ERRORS</h5>
            </div>
            <div className={styles.col}>
              <h6>{new Intl.NumberFormat().format(count_rows_accepted)}</h6>
              <h5 className={styles.accpeted}>ACCEPTED ROWS</h5>
            </div>
          </div>
        </div>
      )

      const abandonedStatus =
        batch.status === 'abandoned' ? (
          <Timeline.Item color='red'>
            <div className={styles.statusInfo}>
              <div className={styles.statusValue}>Abandoned</div>
            </div>
          </Timeline.Item>
        ) : null
      const createdStatus = batch.filename ? (
        <Timeline.Item color='magenta'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>
              Uploaded file ({batch.filename})
            </div>
            <div className={styles.statusInfoTime}>
              {moment(batch.created_at).format('MM/DD/YYYY HH:mm:ss')}
            </div>
          </div>
        </Timeline.Item>
      ) : (
        <Timeline.Item color='magenta'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>Created at</div>
            <div className={styles.statusInfoTime}>
              {moment(batch.created_at).format('MM/DD/YYYY HH:mm:ss')}
            </div>
          </div>
        </Timeline.Item>
      )
      const matchedStatus = batch.matched_at ? (
        <Timeline.Item color='orange'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>
              Matched {batch.count_columns_matched} of {batch.count_columns}{' '}
              columns
            </div>
            <div className={styles.statusInfoTime}>
              {moment(batch.matched_at).format('MM/DD/YYYY HH:mm:ss')}
            </div>
          </div>
        </Timeline.Item>
      ) : null
      const submittedStatus = batch.submitted_at ? (
        <Timeline.Item color='blue'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>Submitted</div>
            <div className={styles.statusInfoTime}>
              {batch.submitted_at
                ? moment(batch.submitted_at).format('MM/DD/YYYY HH:mmA')
                : null}
            </div>
          </div>
        </Timeline.Item>
      ) : null
      const completedStatus = batch.handled_at ? (
        <Timeline.Item color='green'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>Completed</div>
            <div className={styles.statusInfoTime}>
              {moment(batch.handled_at).format('MM/DD/YYYY HH:mm:ss')}
            </div>
          </div>
        </Timeline.Item>
      ) : null
      const failedStatus = batch.failed_at ? (
        <Timeline.Item color='red'>
          <div className={styles.statusInfo}>
            <div className={styles.statusValue}>Failed</div>
            <div className={styles.statusInfoTime}>
              {moment(batch.failed_at).format('MM/DD/YYYY HH:mm:ss')}
            </div>
          </div>
        </Timeline.Item>
      ) : null
      const statusInfo = (
        <div className={styles.detailSection}>
          <Timeline>
            {createdStatus}
            {matchedStatus}
            {submittedStatus}
            {completedStatus}
            {failedStatus}
            {abandonedStatus}
          </Timeline>
        </div>
      )
      const memo = (
        <div className={`${styles.detailSection} ${styles.memo}`}>
          <h6>Batch Memo</h6>
          <div className='rs-element rs-input rs-textarea'>
            <DebounceInput
              minLength={2}
              value={this.state.memo}
              debounceTimeout={500}
              element='textarea'
              className='rs-element'
              onChange={event => this.setState({ memo: event.target.value })}
            />
          </div>
        </div>
      )
      details = (
        <div className={styles.sidebar}>
          <h4 className={styles.title}>Details</h4>
          {endUserBlock}
          {dashboardBlock}
          {statusInfo}
          {memo}
        </div>
      )
    }
    const data = this.state.view !== 'empty' ? this.state[this.state.view] : []
    let content = data.length ? (
      <table className='data-table'>
        <thead>
          <tr><th></th>{Object.keys(data[0].data).map((v, i) => <th key={i}>{v}</th>)}</tr>
        </thead>
        <tbody>
          {(this.state.search ? matchSorter(data, this.state.search, {
            keys: Object.keys(data[0].data).map(v => `data.${v}`)
          }) : data).map((row, i) => (
            <tr key={i}>
              <th>{row.sequence}</th>
              {Object.keys(row.data).map((cell, j) => (
                <td key={j}>
                  <span className={styles.tdTruncate}>
                    {row.data[cell]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className={styles.emptyData}>
        <h3>No data found</h3>
      </div>
    )
    if (this.props.rowsLoading || this.props.batchLoading) {
      content = (
        <div className={styles.emptyData}>
          <h3>Loading...</h3>
        </div>
      )
    }
    const notice = batch && data.length < 2 && !batch.manual && (!managed || !batch.uploads.length) ? (
      <div className={styles.emptyData}>
        <h3>Sorry, there is no data included with this batch</h3>
      </div>
    ) : (
      null
    )
    return (
      <div className={styles.batchDetail}>
        <div className={styles.column}>
          <div className={styles.bar}>
            <RSInput
              className={styles.search}
              value={this.state.search}
              iconName='MdSearch'
              placeholder='Search contents of file'
              type='text'
              onChange={search => this.setState({ search })}
            />
            {batch && !batch.manual ? (
              <Radio.Group
                value={this.state.view}
                onChange={e => this.setState({ view: e.target.value })}
              >
                <Radio.Button
                  disabled={!this.state.original.length && !managed}
                  value='original'
                >
                  Original File
                </Radio.Button>
                <Radio.Button
                  disabled={!this.state.matched.length && !managed}
                  value='matched'
                >
                  Matched
                </Radio.Button>
                <Radio.Button
                  disabled={!this.state.reviewed.length && !managed}
                  value='reviewed'
                >
                  Reviewed
                </Radio.Button>
              </Radio.Group>
            ) : (
              null
            )}
          </div>
          {content}
          {notice}
        </div>
        <div className={styles.column}>{batch ? details : null}</div>
      </div>
    )
  }
}

export default BatchActions.connect(BatchDetail)
