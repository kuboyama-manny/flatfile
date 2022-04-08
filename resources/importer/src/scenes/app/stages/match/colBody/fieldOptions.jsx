import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import { Creatable } from 'react-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import VirtualizedSelect from 'react-virtualized-select'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      columnName: props.columnName,
      originalName: props.originalName,
      defaultName: props.defaultName,
      header: props.header,
      index: props.index,
      nameIndex: props.nameIndex,
      selectValue: props.defaultName,
      columnOptions: props.columnOptions,
      keyNames: props.keyNames,
      allowCustom: props.allowCustom
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.defaultName !== this.state.defaultName) {
      this.setState({ defaultName: nextProps.defaultName, selectValue: nextProps.defaultName })
    }
    if (nextProps.columnOptions !== this.state.columnOptions) {
      this.setState({ columnOptions: nextProps.columnOptions })
    }
    if (nextProps.keyNames !== this.state.keyNames) {
      this.setState({ keyNames: nextProps.keyNames })
    }
  }

  render () {
    const options = this.state.columnOptions.map((key, index) => {
      return ({label: this.state.keyNames[this.state.columnOptions[index]], value: this.state.columnOptions[index]})
    })
    if (this.state.allowCustom) {
      return (
        <VirtualizedSelect
          options={options}
          clearable={false}
          tabIndex={((this.state.index + 1) * 3).toString()}
          selectComponent={Creatable}
          placeholder='Lookup matching fields'
          onChange={(selectValue) => { this.props.matcher.changeColumnMatch(this.state.index, selectValue.value) }}
          value={this.state.selectValue}
        />
      )
    } else {
      return (
        <VirtualizedSelect
          options={options}
          clearable={false}
          tabIndex={((this.state.index + 1) * 3).toString()}
          placeholder='Lookup matching fields'
          onChange={(selectValue) => { this.props.matcher.changeColumnMatch(this.state.index, selectValue.value) }}
          value={this.state.selectValue}
        />
      )
    }
  }
}
