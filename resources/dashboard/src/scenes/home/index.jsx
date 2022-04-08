import React, { Component } from 'react'
import { RSButton, RSIcon } from 'reactsymbols-kit'
import { Line as LineChart } from 'react-chartjs'
import Breadcrumb from 'logic/breadcrumb'
import CardContainer from 'elements/card'
import StatWidget from './components/StatWidget'
import styles from './styles.scss'

import HomeActions from './actions'

class Home extends Component {

  constructor (props) {
    super(props)
    this.state = {
      chartData: {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    		datasets: [
          {
      			label: 'Users',
      			fillColor: 'rgba(220,220,220,0.1)',
      			strokeColor: 'rgba(220,220,220,1)',
      			pointColor: 'rgba(220,220,220,1)',
      			pointStrokeColor: '#fff',
      			pointHighlightFill: '#fff',
      			pointHighlightStroke: 'rgba(220,220,220,1)',
      			data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 24, 22, 32]
      		},
      		{
      			label: 'Rows imported',
      			fillColor: 'rgba(138,108,230,0.05)',
      			strokeColor: 'rgba(138,108,230,1)',
      			pointColor: 'rgba(138,108,230,1)',
      			pointStrokeColor: '#fff',
      			pointHighlightFill: '#fff',
      			pointHighlightStroke: 'rgba(151,187,205,1)',
      			data: [28, 48, 40, 19, 86, 27, 90, 88, 60, 42, 23, 20]
      		}
        ]
      },
      chartOptions: {
        bezierCurve: false,
        responsive: true,
        scaleShowVerticalLines: false,
        scaleOverride: true,
        scaleSteps: 5,
        scaleStepWidth: 20,
        scaleStartValue: 0,
        scaleLineColor: 'rgba(0,0,0,0)',
        tooltipYPadding: 10,
      	tooltipXPadding: 10,
      	tooltipCaretSize: 4,
      	tooltipCornerRadius: 4,
        tooltipFontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif',
        pointDotStrokeWidth: 1
      }
    }
  }

  componentDidMount () {
    this.breadcrumb = Breadcrumb.register({
      icon: 'pt-icon-th-list',
      name: 'Overview',
      href: '/'
    })
  }

  render () {

    console.log(this.state.chartData)

    const {
      counter,
      incrementCounter,
      dataModels,
      dataModelsLoading,
      dataModelsError,
      fetchDataModels,
      fetchDataModelsAlternative
    } = this.props

    return (
      <div className={styles.overview}>
        <div className={styles.widgetRow}>
          <div className={styles.col}>
            <StatWidget
              icon='MdFileUpload'
              stat='98'
              name='Imports'
              color='blue' />
          </div>
          <div className={styles.col}>
            <StatWidget
              icon='MdViewHeadline'
              stat='2,982,182'
              name='Rows imported'
              color='green' />
          </div>
          <div className={styles.col}>
            <StatWidget
              icon='MdError'
              stat='11'
              name='Errors'
              color='purple' />
          </div>
          <div className={styles.col}>
            <StatWidget
              icon='MdPeople'
              stat='43'
              name='Clients'
              color='orange' />
          </div>
        </div>
        <div className={styles.widgetRow}>
              <div className={styles.col65}>
                  <CardContainer title='Daily activity' table='true'>
                      <div style={{ padding: '30px' }}>
                          <LineChart data={this.state.chartData} options={this.state.chartOptions} height="120" />
                      </div>
                  </CardContainer>
              </div>
              <div className={styles.col}>
                  <CardContainer title='Abandoned imports' table='true' style={{ height: 'auto' }}>
                      <div className={styles.importList}>
                          <ul>
                              <li>
                                  <span className={styles.circle}>11</span>
                                  <span className={styles.info}>
                                      <p className={styles.title}>4800 rows imported, 93% rows matched</p>
                                      <p><a href="#"><strong>#00450</strong></a> was imported <a href="#"><strong>today</strong></a> at 11:00 AM</p>
                                  </span>
                              </li>
                              <li>
                                  <span className={styles.circle}>11</span>
                                  <span className={styles.info}>
                                      <p className={styles.title}>4800 rows imported, 93% rows matched</p>
                                      <p><a href="#"><strong>#00450</strong></a> was imported <a href="#"><strong>today</strong></a> at 11:00 AM</p>
                                  </span>
                              </li>
                              <li>
                                  <span className={styles.circle}>11</span>
                                  <span className={styles.info}>
                                      <p className={styles.title}>4800 rows imported, 93% rows matched</p>
                                      <p><a href="#"><strong>#00450</strong></a> was imported <a href="#"><strong>today</strong></a> at 11:00 AM</p>
                                  </span>
                              </li>
                              <li>
                                  <span className={styles.circle}>11</span>
                                  <span className={styles.info}>
                                      <p className={styles.title}>4800 rows imported, 93% rows matched</p>
                                      <p><a href="#"><strong>#00450</strong></a> was imported <a href="#"><strong>today</strong></a> at 11:00 AM</p>
                                  </span>
                              </li>
                          </ul>
                      </div>
                  </CardContainer>
              </div>
          </div>
      </div>
    )
  }
}

const mapRootStateToProps = rootState => rootState.home
const mapDispatchToProps = HomeActions.bindActionCreators

export default HomeActions.connect(Home)
