import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Dimensions, Modal, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressDialog from 'react-native-progress-dialog';
import DocumentPicker from 'react-native-document-picker';
import global from '../global.js';

export default class NewSession extends Component {

	constructor(props) {
		super(props);
		this.state = {
			menuHeaderWidth: Dimensions.get('window').width-48-48,
			menuWidth: Dimensions.get('window').width-16-16,
			sessionName: 'Search Session',
			chooseDeviceDialogVisible: false,
			modalWidth: Dimensions.get('window').width-32-32,
			progressVisible: false,
			devices: [
				/*{name: 'Device One', type: 'device'},
				{name: 'Device Two', type: 'device'},
				{name: 'Device Three', type: 'device'},
				{type: 'add'}*/
			]
		};
		logout = logout.bind(this);
		/*log("SELECTING FILES...");
		(async() => {
			const res = await DocumentPicker.pick({
	        	type: [DocumentPicker.types.allFiles],
	        });
	        //Printing the log realted to the file
		    log('Files selected : ' + JSON.stringify(res));
		})();*/
	}

	componentDidMount() {
		if (currentSessionUUID != "") {
			this.setState({
				sessionName: 'Session: #'+currentSessionName
			});
		}
	}

	selectSession(action) {
		this.props.navigation.navigate('SelectSession', {
			onSelected: (uuid, patientUUID, name) => {
				this.setState({sessionName: "Session: #"+name});
			},
			action: action
		});
	}

	chooseDevice() {
		this.setState({progressVisible: true});
		this.setState({devices: []});
		log("CHOOSING DEVICE");
		if (userID == 0) {
			log("EXECUTING SQL");
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM devices ORDER BY LOWER(device) ASC", [], (trx, devices) => {
					log("DEVICES SIZE: "+devices.rows.length);
					for (let i=0; i<devices.rows.length; i++) {
						let device = devices.rows.item(i);
						log(device);
						var selected = false;
						if (currentDeviceUUID == device['uuid']) {
							selected = true;
						}
						this.state.devices.push({uuid: device['uuid'], name: device['device'], selected: selected, type: 'device'});
					}
					this.state.devices.push({type: 'add'});
					this.setState({
						progressVisible: false,
						chooseDeviceDialogVisible: true
					});
				});
			}, function(error) {
				log(error);
			});
		} else {
			let fd = new FormData();
			fd.append("user_id", userID);
			fetch(API_URL+"/user/get_devices_by_user_id", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
				.then(response => response.text())
				.then(response => {
					let devices = JSON.parse(response);
					for (let i=0; i<devices.length; i++) {
						let device = devices[i];
						log(device);
						var selected = false;
						if (currentDeviceUUID == device['uuid']) {
							selected = true;
						}
						this.state.devices.push({uuid: device['uuid'], name: device['device'], selected: selected, type: 'device'});
					}
					this.state.devices.push({type: 'add'});
					this.setState({
						progressVisible: false,
						chooseDeviceDialogVisible: true
					});
				});
		}
	}

	selectDevice(uuid) {
		currentDeviceUUID = uuid;
		this.setState({chooseDeviceDialogVisible: false});
	}

	manageDevices() {
		this.props.navigation.navigate('AddDevice', {
			onBack: () => {
			}
		});
	}

	takePicture() {
		if (currentSessionUUID == "") {
			this.selectSession('take_picture');
		} else {
			this.props.navigation.navigate('TakePicture');
		}
	}

	previewOnly() {
		if (currentDeviceUUID == '') {
			show("Please select device first");
			return;
		}
	}

	profile() {
		if (userID == 0) {
			this.props.navigation.navigate('Login');
		} else {
			this.props.navigation.navigate('Profile');
		}
	}
	
	create() {
		this.props.navigation.navigate('AddSession', {
			onAdded: () => {
			}
		});
	}
	
	location() {
		if (currentSessionUUID != null && currentSessionUUID.trim() != "") {
			this.setState({progressVisible: true});
			let fd = new FormData();
			fd.append("uuid", currentSessionUUID);
			fetch(API_URL+"/user/get_session_by_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				let session = JSON.parse(response);
				let patientUUID = session['patient_uuid'];
				let deviceUUID = session['device_uuid'];
				let sessionDate = session['date'];
				let fd = new FormData();
				fd.append("session_uuid", currentSessionUUID);
				fetch(API_URL+"/user/get_session_images_by_session_uuid", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(response => response.text())
				.then(response => {
					let images = JSON.parse(response);
					if (images.length > 0) {
						let image = images[0];
						let imageURL = API_URL+"/userdata/"+image['path'];
						let imageUUID = image['uuid'];
						let name = image['name'];
						this.props.navigation.navigate('Mark', {
							'session_uuid': currentSessionUUID,
							'patient_uuid': patientUUID,
							'device_uuid': deviceUUID,
							'img_url': imageURL,
							'img_uuid': image['uuid'],
							'name': image['name'],
							'date': sessionDate
						});
					}
					this.setState({progressVisible: false});
				});
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#1679FA' }}>
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
				<View style={{ flexDirection: 'column', flex: 1, position: 'absolute', width: '100%', height: '100%', justifyContent: 'center',
					alignItems: 'center' }}>
					<TouchableOpacity style={{ width: this.state.menuHeaderWidth, height: 55, backgroundColor: '#FFFFFF', borderRadius: 8,
						justifyContent: 'center' }}
						onPress={() => this.selectSession('select')}>
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 15 }}>{this.state.sessionName}</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8,
						justifyContent: 'center', marginTop: 8 }}
						onPress={() => {
							this.create();
						}}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Create</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8,
						justifyContent: 'center', marginTop: 8 }}
						onPress={() => this.location()}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Location</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8,
						justifyContent: 'center', marginTop: 8 }}
						onPress={() => {
							this.takePicture();
						}}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Take Photo</Text>
						</View>
					</TouchableOpacity>
				</View>
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

				<Modal animationType="fade" transparent={true} visible={this.state.chooseDeviceDialogVisible}>
					<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}
						onPress={() => this.setState({chooseDeviceDialogVisible: false})}>
						<View style={{ width: this.state.modalWidth, marginLeft: 32, marginRight: 32, shadowColor: '#000000',
							shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, backgroundColor: '#FFFFFF',
							borderRadius: 8, padding: 16 }}>
							<FlatList
								data={this.state.devices}
								renderItem={({item}) => {
									if (item.type == 'add') {
										return (
											<TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 35 }}
												onPress={() => {
													this.setState({chooseDeviceDialogVisible: false});
													this.manageDevices();
												}}>
												<Image source={require('../assets/images/phone_2.png')} style={{ width: 18, height: 18,
													marginLeft: 0 }} />
												<Text style={{ marginLeft: 8 }}>Manage Devices</Text>
											</TouchableOpacity>
										);
									} else if (item.type == 'device') {
										var opacity = 0;
										if (item.selected) {
											opacity = 1;
										}
										return (
											<TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 35 }}
												onPress={() => this.selectDevice(item.uuid)}>
												<Image source={require('../assets/images/check.png')} style={{ width: 18, height: 18,
													marginLeft: 0, opacity: opacity }} />
												<Text style={{ marginLeft: 8 }}>{item.name}</Text>
											</TouchableOpacity>
										);
									}
								}}
								keyExtractor={(item, index) => index.toString()}
								/>
						</View>
					</TouchableOpacity>
				</Modal>
				<ProgressDialog
					label="Loading..."
					visible={this.state.progressVisible} />
			</View>
		);
	}
}
