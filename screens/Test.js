import React, { Component } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';

export default class Test extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	render() {
		return (
			<View>
				<Button
					title='Show Dialog'
					onPress={() => {
						Alert.alert('Select Role', '',
						[{
							text: 'Admin',
							style: 'cancel'
						},
						{
							text: 'Doctor'
						}])
					}} />
			</View>
		);
	}
}

const LONG_LIST = ['Admin', 'Doctor'];
