import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, FlatList, TextInput, Dimensions, ImageBackground, Modal, Alert } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import global from '../global.js';

export default class AddDevice extends Component {

	constructor(props) {
		super(props);
		this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
		this.state = {
			noDeviceContainerVisible: false,
			progressVisible: false,
			deviceListVisible: true,
			devices: [/*{
				device: 'Device One', model: 'Device', type: 'One', uuid: 'abc123', zoom_value: 1, user_id: 1, index: 0
			}*/],
			deviceName: 'Device One',
			textInputWidth: parseInt(Dimensions.get('window').width)-12-150-10-12,
			zoomValueSelectorDialogWidth: Dimensions.get('window').width-32-32,
			zoomValueSelectorVisible: false,
			currentDeviceIndex: 0,
			zoomValues: [
				{
					index: 0,
					value: 1,
					text: '1x'
				},
				{
					index: 1,
					value: 1.1,
					text: '1.1x'
				},
				{
					index: 2,
					value: 1.2,
					text: '1.2x'
				},
				{
					index: 3,
					value: 1.3,
					text: '1.3x'
				},
				{
					index: 4,
					value: 1.4,
					text: '1.4x'
				},
				{
					index: 5,
					value: 1.5,
					text: '1.5x'
				},
				{
					index: 6,
					value: 1.6,
					text: '1.6x'
				},
				{
					index: 7,
					value: 1.7,
					text: '1.7x'
				},
				{
					index: 8,
					value: 1.8,
					text: '1.8x'
				},
				{
					index: 9,
					value: 1.9,
					text: '1.9x'
				},
				{
					index: 10,
					value: 2,
					text: '2x'
				}
			]
		};
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentDidMount() {
		this.getDevices();
	}

	handleBackButtonClick() {
		if (this.props.route.params.onBack) {
			this.props.route.params.onBack();
		}
		this.props.navigation.goBack();
		return true;
	}

	getDevices() {
		this.setState({
			progressVisible: true,
			devices: []
		});
		log("CURRENT USER ID: "+userID);
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM devices WHERE user_id="+userID, [], (trx, devices) => {
					for (let i=0; i<devices.rows.length; i++) {
						let device = devices.rows.item(i);
						device['index'] = 0;
						this.state.devices.push(device);
					}
					this.setState({progressVisible: false});
				});
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
					log("========= DEVICES =========");
					log(response);
					let devices = JSON.parse(response);
					for (let i=0; i<devices.length; i++) {
						let device = devices[i];
						device['index'] = 0;
						this.state.devices.push(device);
					}
					if (this.state.devices.length == 0) {
						this.setState({
							noDeviceContainerVisible: true,
							deviceListVisible: false
						});
					} else {
						this.setState({
							noDeviceContainerVisible: false,
							deviceListVisible: true
						});
					}
					this.setState({progressVisible: false});
				});
		}
	}

	addDevice() {
		if (isAdmin) {
			this.setState({progressVisible: true});
			let uuid = uuidv4();
			if (userID == 0) {
				db.transaction((trx) => {
					trx.executeSql("INSERT INTO devices (uuid, device, model, type, zoom_value) VALUES ('"+uuid+"', '', '', '', 0)",
						[], (trx, results) => {
							this.state.devices.push({
								'model': '', 'device': '', type: '', 'uuid': uuidv4(), 'user_id': userID, 'zoom_value': 0, index: this.state.devices.length
							});
							this.setState({
								noDeviceContainerVisible: false,
								deviceListVisible: true,
								progressVisible: false
							});
					});
				});
			} else {
				let fd = new FormData();
				fd.append("user_id", userID);
				fd.append("uuid", uuid);
				fd.append("device", "");
				fd.append("model", "");
				fd.append("type", "");
				fetch(API_URL+"/user/add_device", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
					})
					.then(response => response.text())
					.then(response => {
						this.state.devices.push({
							'model': '', 'device': '', type: '', 'uuid': uuid, 'user_id': userID, 'zoom_value': 0, index: this.state.devices.length
						});
						this.setState({
							noDeviceContainerVisible: false,
							deviceListVisible: true,
							progressVisible: false
						});
					});
			}
		} else {
			show("Sorry, only admin can add new device. Please login as admin.");
		}
	}

	profile() {
		if (userID == 0) {
			this.props.navigation.navigate('Login');
		} else {
			this.props.navigation.navigate('Profile');
		}
	}

	saveDevice(item) {
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("UPDATE devices SET device='"+item.device+"', model='"+item.model+"', type='"+item.type+"' WHERE uuid='"+item.uuid+"'",
					[], (trx, results) => {
						this.setState({progressVisible: false});
					});
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", item.uuid);
			fd.append("device", item.device);
			fd.append("model", item.model);
			fd.append("type", item.type);
			fd.append("zoom_value", item.zoom_value);
			fetch(API_URL+"/user/update_device_detail", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
				.then(response => response.text())
				.then(response => {
					this.setState({progressVisible: false});
				});
		}
	}

	deleteDevice(item) {
		Alert.alert("Confirmation", "Are you sure you want to delete this device", [
			{
				text: "Yes",
				onPress: () => {
					this.setState({progressVisible: true});
					if (userID == 0) {
						db.transaction((trx) => {
							trx.executeSql("DELETE FROM devices WHERE uuid='"+item.uuid+"'", [], (trx, results) => {
								this.setState({progressVisible: false});
							});
						});
					} else {
						let fd = new FormData();
						fd.append("uuid", item.uuid);
						fetch(API_URL+"/user/delete_device_by_uuid", {
							method: 'POST',
							body: fd,
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						})
							.then(response => response.text())
							.then(response => {
								this.setState({progressVisible: false});
								this.getDevices();
							});
					}
				}
			},
			{
				text: "No",
				style: "cancel"
			}
		]);
	}

	updateDeviceName(uuid, name) {
		log("UPDATING DEVICE "+uuid+" WITH NAME "+name);
		for (let i=0; i<this.state.devices.length; i++) {
			let device = this.state.devices[i];
			if (device['uuid'] == uuid) {
				this.state.devices[i]['device'] = name;
				break;
			}
		}
	}

	updateDeviceModel(uuid, model) {
		for (let i=0; i<this.state.devices.length; i++) {
			let device = this.state.devices[i];
			if (device['uuid'] == uuid) {
				this.state.devices[i]['model'] = model;
				break;
			}
		}
	}

	updateDeviceType(uuid, type) {
		for (let i=0; i<this.state.devices.length; i++) {
			let device = this.state.devices[i];
			if (device['uuid'] == uuid) {
				this.state.devices[i]['type'] = type;
				break;
			}
		}
	}

	updateDeviceZoomValue(uuid, zoomValue) {
		for (let i=0; i<this.state.devices.length; i++) {
			let device = this.state.devices[i];
			if (device['uuid'] == uuid) {
				this.state.devices[i]['zoom_value'] = zoomValue;
				break;
			}
		}
	}

	selectZoom(index) {
		this.setState({
			currentDeviceIndex: index,
			zoomValueSelectorVisible: true
		});
	}

	selectZoomValue(index) {
		log("SELECTING ZOOM VALUE INDEX: "+index);
		this.setState({
			zoomValueSelectorVisible: false
		});
		let devices = this.state.devices;
		//devices[this.state.currentDeviceIndex]['zoom_value'] = parseInt(this.state.zoomValues[index]['value']);
		devices[0]['zoom_value'] = this.state.zoomValues[index]['value'];
		this.setState({devices: devices});
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<Image source={require('../assets/images/menu.png')} style={{ width: 30, height: 30, marginLeft: 16, marginTop: 16 }} />
				<TouchableOpacity style={{ left: 64, top: 32, alignItems: 'center', position: 'absolute' }}
					onPress={() => {
						this.profile();
					}}>
					<Image source={require('../assets/images/user_5.png')} style={{ width: 35, height: 35 }} />
					<Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 2 }}>Profile</Text>
				</TouchableOpacity>
				{this.state.noDeviceContainerVisible &&
				<View style={{flex: 1, alignItems: 'center'}}>
					<View style={{width: '100%', height: 275}}>
						<Image source={require('../assets/images/sign.png')}
							   style={{position: 'absolute', top: 64, right: 24, width: 200, height: 200}}
							   resizeMode="contain"/>
					</View>
					<Text
						style={{color: '#FFFFFF', fontSize: 19, textAlign: 'center', marginLeft: 32, marginRight: 32}}>
						No device selected. If you are admin, you can add new device by clicking (+) button above.
					</Text>
				</View>
				}
				<TouchableOpacity style={{ position: 'absolute', top: 48, right: 12 }}
					onPress={() => this.addDevice()}>
					<Image source={require('../assets/images/glossy_circle.png')} style={{ width: 50, height: 50 }} />
					<View style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
						<Image source={require('../assets/images/add_white.png')} style={{ width: 25, height: 25 }} />
					</View>
				</TouchableOpacity>
				{this.state.deviceListVisible &&
				<FlatList
					style={{marginTop: 100}}
					data={this.state.devices}
					renderItem={({item}) => {
						let itemIndex = item.index;
						log("ITEM INDEX: "+itemIndex);
						let zoomValue = "" + parseInt(item['zoom_value']) + "x";
						log("CURRENT DEVICE UUID "+item.uuid+", NAME"+item.device);
						return (
							<View>
								<View style={{flexDirection: 'row', alignItems: 'center'}}>
									<View style={{width: 150, justifyContent: 'center'}}>
										<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 12}}>
											Device Name
										</Text>
									</View>

									<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 8}}>:</Text>
									<View style={{
										flexDirection: 'column',
										marginLeft: 10,
										width: this.state.textInputWidth
									}}>
										<TextInput style={{height: 40}} placeholder="Enter device name"
												   value={this.state.devices[itemIndex]['device']}
												   onChangeText={(value) => {
												   	//this.updateDeviceName(item.uuid, value);
												   	let devices = this.state.devices;
												   	devices[itemIndex]['device'] = value;
												   	this.setState({devices: devices});
												   }}
												   placeholderTextColor="#FFFFFF55" color="#FFFFFF"/>
										<View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF55'}}/>
									</View>
								</View>
								<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
									<View style={{width: 150, justifyContent: 'center'}}>
										<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 12}}>
											Device Model
										</Text>
									</View>
									<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 8}}>:</Text>
									<View style={{
										flexDirection: 'column',
										marginLeft: 10,
										width: this.state.textInputWidth
									}}>
										<TextInput style={{height: 40}} placeholder="Enter device model"
												   value={this.state.devices[itemIndex]['model']}
												   onChangeText={(value) => {
													let devices = this.state.devices;
												   	devices[itemIndex]['model'] = value;
												   	this.setState({devices: devices});
												   }}
												   placeholderTextColor="#FFFFFF55" color="#FFFFFF"/>
										<View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF55'}}/>
									</View>
								</View>
								<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
									<View style={{width: 150, justifyContent: 'center'}}>
										<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 12}}>
											Device Type
										</Text>
									</View>
									<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 8}}>:</Text>
									<View style={{
										flexDirection: 'column',
										marginLeft: 10,
										width: this.state.textInputWidth
									}}>
										<TextInput style={{height: 40}} placeholder="Enter device type"
												   value={this.state.devices[itemIndex]['type']}
												   onChangeText={(value) => {
													let devices = this.state.devices;
												   	devices[itemIndex]['type'] = value;
												   	this.setState({devices: devices});
												   }}
												   placeholderTextColor="#FFFFFF55" color="#FFFFFF"/>
										<View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF55'}}/>
									</View>
								</View>
								<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
									<View style={{width: 150, justifyContent: 'center'}}>
										<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 12}}>
											Default Zoom
										</Text>
									</View>
									<Text style={{color: '#FFFFFF', fontSize: 15, marginLeft: 8}}>:</Text>
									<View style={{
										flexDirection: 'column',
										marginLeft: 10,
										width: this.state.textInputWidth
									}}>
										<TouchableOpacity style={{height: 40, justifyContent: 'center'}}
											onPress={() => {
												this.selectZoom(itemIndex);
											}}>
											<Text style={{ color: '#FFFFFF' }}>{this.state.devices[itemIndex]['zoom_value']}x</Text>
										</TouchableOpacity>
										<View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF55'}}/>
									</View>
								</View>
								<View style={{width: '100%', flexDirection: 'row', marginTop: 16, height: 50}}>
									<View style={{width: '50%', justifyContent: 'center'}}>
										<TouchableOpacity style={{
											width: this.state.buttonWidth,
											alignItems: 'center',
											justifyContent: 'center',
											position: 'absolute',
											top: 0,
											right: 8
										}}
														  onPress={() => this.saveDevice(item)}>
											<ImageBackground source={require('../assets/images/glossy_button.png')}
															 style={{
																 width: 150, height: 70,
																 position: 'relative'
															 }}
															 resizeMode="contain">
												<View style={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													justifyContent: 'center',
													alignItems: 'center'
												}}>
													<Text style={{color: '#FFFFFF', fontSize: 15}}>Save</Text>
												</View>
											</ImageBackground>
										</TouchableOpacity>
									</View>
									<View style={{width: '50%', justifyContent: 'center'}}>
										<TouchableOpacity style={{
											width: this.state.buttonWidth,
											alignItems: 'center',
											justifyContent: 'center',
											position: 'absolute',
											top: 0,
											right: 8
										}}
														  onPress={() => this.deleteDevice(item)}>
											<ImageBackground source={require('../assets/images/glossy_button_red.png')}
															 style={{
																 width: 150, height: 70,
																 position: 'relative'
															 }}
															 resizeMode="contain">
												<View style={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													justifyContent: 'center',
													alignItems: 'center'
												}}>
													<Text style={{color: '#FFFFFF', fontSize: 15}}>Delete</Text>
												</View>
											</ImageBackground>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						);
					}}
					keyExtractor={(item, index) => index.toString()}/>
				}
				<Modal animationType="fade" transparent={true} visible={this.state.zoomValueSelectorVisible} style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
						flex: 1,
						backgroundColor: '#00000000',
						alignItems: 'center',
						justifyContent: 'center',
						margin: 0,
					}}>
					<View style={{flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
						<View style={{
							width: this.state.zoomValueSelectorDialogWidth,
							margin: 32,
							backgroundColor: '#FFFFFF',
							borderRadius: 16,
							shadowColor: '#000000',
							shadowOffset: {width: 0, height: 3},
							shadowOpacity: 0.27,
							shadowRadius: 4.65,
							elevation: 6
						}}>
						<FlatList
							data={this.state.zoomValues}
							renderItem={({item}) => {
								return (
									<TouchableOpacity style={{ height: 40, justifyContent: 'center', backgroundColor: '#FFFFFF' }}
										onPress={() => {
											this.selectZoomValue(item.index);
										}}>
										<Text style={{ color: '#000000', fontSize: 15, marginLeft: 16 }}>{item.text}</Text>
									</TouchableOpacity>
								);
							}}
							keyExtractor={(item, index) => index.toString()}
							style={{ borderRadius: 16 }} />
						</View>
					</View>
				</Modal>
				<ProgressDialog
					label="Loading..."
					visible={this.state.progressVisible} />
			</View>
		);
	}
}
