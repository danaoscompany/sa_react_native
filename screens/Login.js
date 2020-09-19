import React, { useState, Component } from 'react';
import { Text, TextInput, Button, Image, View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressDialog from 'react-native-progress-dialog';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer, getAndroidId } from 'react-native-device-info';
import global from '../global.js';

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rememberMe: false,
			forgotPassword: false,
			loginProgressVisible: false,
			loginProgressText: 'Logging in...',
			passwordInvisible: true,
			email: '',
			password: ''
		};
	}

	componentDidMount() {
		(async () => {
			var rememberMeBoolean = await AsyncStorage.getItem('remember_me');
			this.setState({
				rememberMe: (rememberMeBoolean == 'true')
			});
		})();
	}

	skipRegistration() {
		this.props.navigation.navigate('Home');
	}

	render() {
	return (
	<View style={{ backgroundColor: '#1679FA', flex: 1 }}>
		<ScrollView style={{ backgroundColor: '#1679FA' }}>
			<LinearGradient colors={['#527bc9', '#669be7' ]} style={{ borderColor: '#FFFFFF', borderRadius: 20, borderWidth: 2,
				marginLeft: 24, marginTop: 24, marginRight: 24, flex: 1, flexDirection: 'column', alignItems: 'center' }}>
				<Text style={{ color: '#FFFFFF', fontSize: 20, marginTop: 10 }}>Member Login</Text>
				<Image source={require('../assets/images/user.png')} style={{ width: 40, height: 40, marginTop: 10 }} />
				<View style={{ flex: 1, flexDirection: 'row', height: 45, marginLeft: 40, marginRight: 40, marginTop: 16 }}>
					<View style={{ width: 45, height: 45, backgroundColor: '#385e92', justifyContent: 'center', alignItems: 'center',
						borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
						<Image source={require('../assets/images/user_2.png')} style={{ width: 20, height: 20 }} />
					</View>
					<TextInput placeholder='Email' style={{ width: '100%', paddingLeft: 10, paddingRight: 10, height: 45,
						backgroundColor: '#FFFFFF', borderTopRightRadius: 5, borderBottomRightRadius: 5, fontSize: 16 }}
						onChangeText={(value) => this.setState({email: value})}
						value={this.state.email} />
				</View>
				<View style={{ flex: 1, flexDirection: 'row', height: 45, marginLeft: 40, marginRight: 40, marginTop: 8 }}>
					<View style={{ width: 45, height: 45, backgroundColor: '#385e92', justifyContent: 'center', alignItems: 'center',
						borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
						<Image source={require('../assets/images/lock.png')} style={{ width: 20, height: 20 }} />
					</View>
					<View style={{ width: '100%' }}>
						<TextInput secureTextEntry={this.state.passwordInvisible} placeholder='Password' style={{ width: '100%', paddingLeft: 10,
							paddingRight: 10, height: 45, backgroundColor: '#FFFFFF', borderTopRightRadius: 5, borderBottomRightRadius: 5,
							fontSize: 16 }}
							onChangeText={(value) => this.setState({password: value})}
							value={this.state.password} />
						<TouchableOpacity style={{ width: 30, height: 30, marginTop: 10, marginRight: 5, position: 'absolute',
							right: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
								let passwordInvisible = this.state.passwordInvisible;
								passwordInvisible = !passwordInvisible;
								this.setState({passwordInvisible});
							}}>
							<Image source={require('../assets/images/view_password.png')} style={{ width: 20, height: 20 }} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
					<CheckBox
						disabled={false}
						value={this.state.rememberMe}
						tintColors={{ true: '#FFFFFF', false: '#FFFFFF' }}
 						onValueChange={(newValue) => {
 							this.setState({rememberMe: newValue});
 							(async () => {
	 							try {
	 								await AsyncStorage.setItem('remember_me', ""+newValue);
	 							} catch (e) {}
 							})();
 						}} />
 					<Text style={{ color: '#FFFFFF', marginLeft: 5 }}>Remember Me</Text>
 					<TouchableOpacity style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}
 						onPress={() => {
 							this.props.navigation.navigate('ForgotPassword');
 						}}>
						<CheckBox
							disabled={true}
							value={this.state.forgotPassword}
							tintColors={{ true: '#FFFFFF', false: '#FFFFFF' }}
	 						onValueChange={(newValue) => {
	 						}} />
	 					<Text style={{ color: '#FFFFFF', marginLeft: 5 }}>Forgot Password</Text>
	 				</TouchableOpacity>
				</View>
				<View style={{ width: '60%', marginTop: 10, marginBottom: 16, marginLeft: 16, marginRight: 16 }}>
					<TouchableOpacity
						style={{ height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center' }}
						onPress={() => {
							var email = this.state.email;
							var password = this.state.password;
							if (email == "" || password == "") {
								Alert.alert("Login", "Please enter email or password");
								return;
							}
							this.setState({
								loginProgressVisible: true
							});
							let deviceId = DeviceInfo.getUniqueId();
							DeviceInfo.getDeviceName().then(deviceName => {
								console.log("Device name: "+deviceName);
								let fd = new FormData();
								fd.append("email", email);
								fd.append("password", password);
								fd.append("android_id", deviceId);
								fd.append("android_device", deviceName);
								fetch(API_URL+"/user/login", {
									'method': 'POST',
									body: fd,
									headers: {
										'Accept': 'application/json',
										'Content-Type': 'multipart/form-data'
									}
								})
								.then(response => response.text())
								.then(data => {
									this.setState({
										loginProgressVisible: false
									});
									var obj = JSON.parse(data);
									var responseCode = parseInt(obj['response_code']);
									console.log("Response code: "+responseCode);
									if (responseCode == 1) {
										var userIDInt = parseInt(obj['id']);
										isAdmin = parseInt(obj['is_admin']);
										userID = userIDInt;
										(async () => {
											try {
												AsyncStorage.setItem("email", email);
												AsyncStorage.setItem("password", password);
											} catch (e) {}
											this.setState({loginProgressVisible: false});
											this.props.navigation.navigate('Home');
										})();
									} else if (responseCode == -1) {
										Alert.alert("Error", "Wrong combination of email and password");
									} else if (responseCode == -2) {
										Alert.alert("Error", "Wrong combination of username and password");
									} else if (responseCode == -3) {
										var deviceName = obj['android_device'];
										var userIDInt = parseInt(obj['id']);
										console.log("Device name: "+deviceName);
										Alert.alert("Error", "Sorry, the current session is active on "+deviceName+". Would you like to logout from this device?",
										[{
											text: 'Cancel',
											style: 'cancel'
										},
										{
											text: 'OK',
											onPress: () => {
												this.setState({
													loginProgressText: "Logging out from "+deviceName+"...",
													loginProgressVisible: true
												});
												let deviceID = DeviceInfo.getUniqueId();
												DeviceInfo.getDeviceName().then(deviceName => {
													let fd = new FormData();
													fd.append("user_id", userIDInt);
													fd.append("android_id", deviceID);
													fd.append("android_device", deviceName);
													fetch(API_URL+"/user/update_current_user_device", {
														method: 'POST',
														body: fd,
														headers: {
															'Content-Type': 'multipart/form-data',
															'Accept': 'application/json'
														}
													})
													.then(response => response.text())
													.then(response => {
														(async () => {
															try {
																AsyncStorage.setItem("email", email);
																AsyncStorage.setItem("password", password);
																userID = userIDInt;
															} catch (e) {}
															this.setState({loginProgressVisible: false});
															this.props.navigation.navigate('Home');
														})();
													});
												});
											}
										}]);
									}
								})
								.catch(function(error) {
									console.log(error.message);
								});
							});
						}}>
						<Text style={{ color: '#FFFFFF', fontSize: 17 }}>Login</Text>
					</TouchableOpacity>
				</View>
			</LinearGradient>
			<LinearGradient colors={['#527bc9', '#669be7' ]} style={{ borderColor: '#FFFFFF', borderRadius: 20, borderWidth: 2,
				marginLeft: 24, marginTop: 24, marginRight: 24, flex: 1, flexDirection: 'column', alignItems: 'center', padding: 16 }}>
				<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Are you not a member?</Text>
				<View style={{ width: '60%', marginTop: 24, marginBottom: 8, marginLeft: 16, marginRight: 16 }}>
					<TouchableOpacity
						style={{ height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center' }}
						onPress={() => this.props.navigation.navigate('Signup') }>
						<Text style={{ color: '#FFFFFF', fontSize: 17 }}>REGISTER NOW</Text>
					</TouchableOpacity>
				</View>
			</LinearGradient>
			<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
				<View style={{ width: '60%', justifyContent: 'center', marginTop: 24, marginBottom: 8, marginLeft: 16, marginRight: 16 }}>
					<TouchableOpacity
						style={{ height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center' }}
						onPress={() => this.skipRegistration() }>
						<Text style={{ color: '#FFFFFF', fontSize: 17 }}>Skip Registration</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
		<ProgressDialog
			label={this.state.loginProgressText}
			visible={this.state.loginProgressVisible} />
	</View>
	);
	}
}

var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
