import React, { Component } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

export default class Test extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
	        	<ReactNativeZoomableView
		    		maxZoom={1.5}
          			minZoom={0.5}
          			zoomStep={0.5}
          			bindToBorders={true}
          			style={{
          				position: 'absolute',
          				left: 0,
          				top: 0,
          				width: '100%',
          				height: '100%',
            			backgroundColor: 'blue',
            			justifyContent: 'flex-start',
            			zoomEnabled: false
          			}}
        			>
        			<View style={{ width: 100, height: 100, backgroundColor: '#00FF00' }} />
        		</ReactNativeZoomableView>
      		</View>
		);
	}
}

const LONG_LIST = ['Admin', 'Doctor'];
