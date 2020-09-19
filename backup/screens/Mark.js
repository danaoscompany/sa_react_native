import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Mark extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			sessionUUID: this.props.route.params['session_uuid']
		};
	}
	
	render() {
		return (
			<View>
			</View>
		);
	}
}
