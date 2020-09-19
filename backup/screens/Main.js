import React, { Component } from 'react';
import { View, Text, PermissionsAndroid, BackHandler, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressDialog from 'react-native-progress-dialog';
import DeviceInfo from 'react-native-device-info';
import global from '../global.js';

export default class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loginProgressVisible: false
		};
	}

	componentDidMount() {
		(async () => {
			if (Platform.OS === 'android') {
				log("REQUESTING PERMISSIONS");
				const granted = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					PermissionsAndroid.PERMISSIONS.CAMERA
				]).then((result) => {
					log("PERMISSIONS RESULT");
					if (result['android.permission.WRITE_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] === 'granted') {
						log("PERMISSIONS ARE GRANTED");
						this.init();
					} else {
						log("PERMISSIONS ARE GRANTED");
						BackHandler.exitApp();
					    return;
					}
				});
			}
		})();
	}

	init() {
		// TODO remove/comment these two lines
		//this.props.navigation.navigate('Login');
		//return;
		(async () => {
			try {
				log("LOGGING IN...");
				AsyncStorage.getItem("email").then((email) => {
					AsyncStorage.getItem("password").then((password) => {
						let deviceID = DeviceInfo.getUniqueId();
						DeviceInfo.getDeviceName().then((deviceName) => {
							log("DEVICE NAME: "+deviceName);
							let fd = new FormData();
							fd.append("email", email);
							fd.append("password", password);
							fd.append("android_id", deviceID);
							fd.append("android_device", deviceName);
							log("ACCESSING https://admin.skinmed.id/user/login...");
							fetch(API_URL+"/user/login", {
								method: 'POST',
								body: fd,
								headers: {
									'Content-Type': 'multipart/form-data',
									'Accept': 'application/json'
								}
							})
							.then(response => response.text())
							.then(response => {
								log("Login response: "+response);
								var obj = JSON.parse(response);
								var responseCode = parseInt(obj['response_code']);
								this.setState({loginProgressVisible: false});
								if (responseCode == 1) {
									let userIDInt = parseInt(obj['id']);
									isAdmin = parseInt(obj['is_admin']);
									userID = userIDInt;
									log("[MAIN] User ID: "+userID);
									this.props.navigation.navigate('Home');
								} else if (responseCode == -1) {
									this.props.navigation.navigate('Login');
								} else if (responseCode == -2) {
									this.props.navigation.navigate('Login');
								} else if (responseCode == -3) {
									this.props.navigation.navigate('Login');
								}
							});
						});
					});
				});
			} catch (e) {}
		})();
	}

	render() {
		return (
			<View>
				<ProgressDialog
					label='Logging in...'
					visible={this.state.loginProgressVisible} />
			</View>
		);
	}
}
