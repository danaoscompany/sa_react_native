import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Home from './screens/Home.js';
import SimpleUse from './screens/SimpleUse.js';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.navigation.navigate('SelectSession');
	}
	
	render() {
		return (
			<Drawer.Navigator initialRouteName="Home">
        		<Drawer.Screen name="Home" component={Home} />
        		<Drawer.Screen name="SimpleUse" component={SimpleUse} />
      		</Drawer.Navigator>
		);
	}
}
