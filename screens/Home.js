import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Dimensions, Alert } from 'react-native';
import global from '../global.js';
import { AsyncStorage } from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import * as ImageManipulator from '@pontusab/react-native-image-manipulator';

export default class Home extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			autoSync: false,
			menuWidth: 0,
			newSessionBG: '#04427A',
			imagesBG: '#04427A'
		};
		logout = logout.bind(this);
		(async() => {
			try {
				await ImageManipulator.manipulateAsync('file:///storage/emulated/0/a.jpg', [{
					rotate: 90
				}], { compress: 1, format: ImageManipulator.SaveFormat.PNG });
			} catch (e) {
				log(e);
			}
		})();
	}
	
	errorCB(err) {
		console.log("SQL Error: " + err);
	};

	successCB() {
		console.log("SQL executed fine");
	};

	openCB() {
		console.log("Database OPENED");
	};
	
	componentDidMount() {
		log("[HOME] User ID: "+userID);
		if (userID == 0) {
			this.setState({
				newSessionBG: '#58C1F8',
				imagesBG: '#58C1F8'
			});
		}
		var menuWidth = (Dimensions.get('window').width-12-12)/2-4;
		this.setState({menuWidth});
		db.transaction((tx) => {
			tx.executeSql('SELECT * FROM `users`', [], (tx, results) => {
      			console.log("Query completed");
      			var len = results.rows.length;
      			for (let i = 0; i < len; i++) {
        			let row = results.rows.item(i);
        			console.log(`Name: ${row.first_name} ${row.last_name}, Username: ${row.username}, Email: ${row.email}, Password: ${row.password}`);
      			}
			});
		});
	}
	
	newSession() {
		if (userID != 0) {
			this.props.navigation.navigate('NewSession');
		}
	}
	
	images() {
		log("OPENING IMAGE LIST...");
		if (userID != 0) {
			this.props.navigation.navigate('SelectSession', {
				onSelected: (sessionUUID, patientUUID, sessionName) => {
					log("SELECTED SESSION UUID: "+sessionUUID+", PATIENT UUID: "+patientUUID+", NAME: "+sessionName);
					this.props.navigation.navigate('ImageList');
				}
			});
		}
	}
	
	changeDevice() {
		this.props.navigation.navigate('ChangeDevice', {
			action: 'select'
		});
	}
	
	profile() {
		if (userID == 0) {
			this.props.navigation.navigate('Login');
		} else {
			this.props.navigation.navigate('Profile');
		}
	}
	
	render() {
		return (
			<View style={{ backgroundColor: '#1679FA', flex: 1 }}>
				<ScrollView style={{ backgroundColor: '#1679FA' }}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity style={{ marginLeft: 16, marginTop: 16, width: 35, height: 35 }}>
							<Image source={require('../assets/images/menu.png')} style={{ width: 35, height: 35 }} />
						</TouchableOpacity>
						<TouchableOpacity style={{ flexDirection: 'column', marginLeft: 20, marginTop: 18 }}
							onPress={() => {
								this.profile();
							}}>
							<Image source={require('../assets/images/user_3.png')} style={{ width: 40, height: 40 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 2 }}>Profile</Text>
						</TouchableOpacity>
					</View>
					<Image source={require('../assets/images/logo.png')} style={{ width: 60, height: 40, position: 'absolute', top: 24, right: 16 }} />
					<View style={{ flex: 1, backgroundColor: '#55B6FA', marginLeft: 12, marginRight: 12, marginTop: 12 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 11, marginTop: 8, marginLeft: 12 }}>Synchronization</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 11, marginTop: 2, marginLeft: 12, marginBottom: 8 }}>Automatic Sync</Text>
						<View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, borderColor: '#1679FA', borderWidth: 1, flexDirection: 'row',
							padding: 2, position: 'absolute', top: 8, right: 12, alignItems: 'center' }}>
							<Text style={{ color: '#1679FA', fontSize: 11, fontWeight: 'bold', marginLeft: 8 }}>Manual</Text>
							<Switch value={this.state.autoSync} onValueChange={(newValue) => this.setState({autoSync: newValue})}
								thumbColor={'#1679FA'} trackColor={'#C2DAFC'} style={{ marginLeft: 2 }} />
							<Text style={{ color: '#1679FA', fontSize: 11, fontWeight: 'bold', marginLeft: -8, marginRight: 8 }}>Auto</Text>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginRight: 4 }}
							onPress={() => {
								this.props.navigation.navigate('SimpleUse');
							}}>
							<Image source={require('../assets/images/phone.png')} style={{ width: 70, height: 90, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Simple Use</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: this.state.newSessionBG, marginLeft: 4, marginRight: 12 }}
							onPress={() => this.newSession()}>
							<Image source={require('../assets/images/note.png')} style={{ width: 90, height: 100, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 0, marginBottom: 12 }}>New Session</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: this.state.imagesBG, marginRight: 4 }}
							onPress={() => this.images()}>
							<Image source={require('../assets/images/images.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Images</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginLeft: 4, marginRight: 12 }}
							onPress={() => {
								this.changeDevice();
							}}>
							<Image source={require('../assets/images/settings.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Change Device</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginRight: 4 }}
							onPress={() => {
								this.profile();
							}}>
							<Image source={require('../assets/images/profile.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Profile/Login</Text>
						</TouchableOpacity>
						<TouchableOpacity visible={false} style={{ display: 'none', width: this.state.menuWidth, flexDirection: 'column',
							alignItems: 'center', justifyContent: 'center', backgroundColor: '#04427A', marginLeft: 4, marginRight: 12 }}>
							<Image source={require('../assets/images/settings.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Settings</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#FFFFFF', flexDirection: 'row', height: 43 }}>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.props.navigation.navigate('Signup')}>
						<Image source={require('../assets/images/login.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.props.navigation.navigate('Home')}>
						<Image source={require('../assets/images/home.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => logout()}>
						<Image source={require('../assets/images/user_6.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
