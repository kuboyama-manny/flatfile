import React, { Component } from 'react'
import { RSSelect } from 'reactsymbols-kit'
import styles from './styles.scss'
import autobindMethods from 'class-autobind-decorator'

@autobindMethods()
class TeamGroupContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedTeam: this.props.teamInfos && {
        label: this.props.teamInfos.teams.find(
          item => item.id === this.props.teamInfos.current_team_id
        ).name,
        value: this.props.teamInfos.teams.find(
          item => item.id === this.props.teamInfos.current_team_id
        ).id
      },
      options:
        this.props.teamInfos &&
        this.props.teamInfos.teams.map(item => ({
          label: item.name,
          value: item.id
        }))
    }
  }

  handleChange = selectedOption => {
    if (selectedOption.value === 'add company') {
      this.props.showModal()
    } else {
      window.location.href = `/api/v1/teams/${selectedOption.value}/switch`
      this.setState({ selectedTeam: selectedOption })
    }
  }

  render () {
    const { selectedTeam, options } = this.state

    return (
      <div className={styles.selectContainer}>
        <RSSelect
          searchable={false}
          clearable={false}
          name='form-field-name'
          value={selectedTeam}
          onChange={this.handleChange}
          options={
            options && [
              ...options,
              {
                label: '+ Add another company',
                value: 'add company'
              }
            ]
          }
        />
      </div>
    )
  }
}

export default TeamGroupContainer
