import { Input } from 'antd'
import React from 'react'
import debounce from 'lodash.debounce'

import './SearchPanel.scss'

export default class SearchPanel extends React.Component {
	state = {
		key: '',
	}

	newRequest = debounce(value => this.props.searchData(value, 1), 400)

	changeInputValue = evt => {
		this.setState({ key: evt.target.value })
		this.newRequest(evt.target.value)
	}

	render() {
		return (
			<Input
				onChange={this.changeInputValue}
				placeholder='Type to search...'
				value={this.state.key}
				autoFocus
			/>
		)
	}
}
