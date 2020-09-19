import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList, Dimensions, Switch, Alert, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import ProgressDialog from 'react-native-progress-dialog';
import { RNCamera, FaceDetector } from 'react-native-camera';
import RNFS from 'react-native-fs';
import moment from 'moment';
import global from '../global.js';

export default class TakePicture extends Component {

	constructor(props) {
		super(props);
		this.state = {
			camera: null,
			chooseDeviceDialogVisible: false,
			modalWidth: Dimensions.get('window').width-32-32,
			progressVisible: false,
			devices: [],
			coordinateActive: false,
			fileName: uniqid()+".jpg",
			editedFileName: "",
			fileNameDialogVisible: false,
			saveDialogVisible: false,
			myAccountChecked: true,
			gdChecked: false,
			dbChecked: false,
			skipChecked: false,
			selectedSaveOption: 0,
			savedImagePath: '',
			progressVisible: false
		};
	}

	componentDidMount() {
		if (currentDeviceUUID != null && currentDeviceUUID.trim() != "") {
			this.setState({chooseDeviceDialogVisible: false});
		} else {
			this.setState({chooseDeviceDialogVisible: true});
			this.getDevices();
		}
	}
	
	addDevice() {
		this.setState({chooseDeviceDialogVisible: false});
		this.props.navigation.navigate('AddDevice', {
			onBack: () => {
				this.getDevices();
			}
		});
	}

	getDevices() {
		this.setState({devices: []});
		this.setState({
			progressVisible: true,
			chooseDeviceDialogVisible: true,
			devices: []
		});
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
						this.state.devices.push({id: parseInt(device['id']), uuid: device['uuid'], device: device['device'], selected: selected,
							type: 'device'});
					}
					this.state.devices.push({type: 'add'});
					this.setState({
						progressVisible: false
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
				let devicesJSON = JSON.parse(response);
				for (let i=0; i<devicesJSON.length; i++) {
					let deviceJSON = devicesJSON[i];
					deviceJSON['type'] = 'device';
					this.state.devices.push(deviceJSON);
				}
				this.state.devices.push({type: 'add'});
				this.setState({
					progressVisible: false
				});
			});
		}
	}

	selectDevice(id, uuid, name) {
		currentDeviceID = id;
		currentDeviceUUID = uuid;
		currentDeviceName = name;
		log("CURRENT DEVICE NAME: "+currentDeviceName);
		this.setState({
			chooseDeviceDialogVisible: false
		});
	}

	editFileName() {
		log("EDITING FILE NAME");
		this.setState({
			fileNameDialogVisible: true,
			editedFileName: this.state.fileName
		});
		log("EDITED FILE NAME: "+this.state.editedFileName);
	}

	takePicture = async () => {
		if (this.state.camera) {
			log("CAMERA OBJECT EXISTS");
			const options = { quality: 1, base64: true };
			const data = await this.state.camera.takePictureAsync(options);
			// Example result path: file:///data/user/0/com.skinanalyzer/cache/Camera/3fa9fa46-ee71-4807-ae23-d856e4345530.jpg
			let path = data['uri'];
			log("SAVED PATH: "+path);
			this.setState({
				savedImagePath: path,
				saveDialogVisible: true
			});
		} else {
			log("CAMERA OBJECT NOT EXISTS");
		}
	}

	selectSaveToOption(index) {
		selectedSaveOption = index;
		log("SELECTING SAVE-TO OPTION: "+index);
		if (index == 0) {
			this.setState({
				myAccountChecked: true,
				gdChecked: false,
				dbChecked: false,
				skipChecked: false
			});
		} else if (index == 1) {
			this.setState({
				myAccountChecked: false,
				gdChecked: true,
				dbChecked: false,
				skipChecked: false
			});
		} else if (index == 2) {
			this.setState({
				myAccountChecked: false,
				gdChecked: false,
				dbChecked: true,
				skipChecked: false
			});
		} else if (index == 3) {
			this.setState({
				myAccountChecked: false,
				gdChecked: false,
				dbChecked: false,
				skipChecked: true
			});
		}
	}

	save() {
		this.setState({progressVisible: true});
		if (userID == 0) {
		} else {
			if (this.state.selectedSaveOption == 0) {
				// Save to my account
				log("SAVING TO MY ACCOUNT");
				var files = [
				{
    				name: 'file',
    				filename: uuidv4()+'.jpg',
    				filepath: this.state.savedImagePath.replace("file://", ""),
    				filetype: 'image/jpeg'
				}];
				RNFS.uploadFiles({
  					toUrl: API_URL+"/user/upload_skin_image",
					files: files,
					method: 'POST',
					headers: {
					},
					fields: {
						'user_id': ""+userID,
						'device_id': ""+currentDeviceID,
						'uuid': uuidv4(),
						'device_uuid': currentDeviceUUID,
						'session_uuid': currentSessionUUID,
						'name': this.state.fileName,
						'note': '',
						'points': '[]',
						'type': "0",
						'date': moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						'image_x': "0",
						'image_y': "0",
						'image_width': "0",
						'image_height': "0",
						'photo_num': "0",
						'storage_method': 'my_account'
					},
				}).promise.then((response) => {
					log("UPLOAD RESPONSE");
					log(response);
					this.setState({progressVisible: false});
					this.props.navigation.navigate('ImageList', {
						'updated': 1
					});
  				})
  				.catch((err) => {
    				if (err.description === "cancelled") {
					}
					console.log(err);
				});
			}
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<RNCamera
					ref={ref => {
						this.state.camera = ref;
					}}
					style={{ flex: 1 }}
					type={RNCamera.Constants.Type.back}
					flashMode={RNCamera.Constants.FlashMode.on}
					/ >
				<View style={{ position: 'absolute', left: 0, bottom: 32, alignItems: 'center', width: '100%' }}>
					<TouchableOpacity style={{ width: 40, height: 40 }}
						onPress={() => {
							this.takePicture();
						}}>
						<Image source={require('../assets/images/camera.png')} style={{ width: 40, height: 40 }} />
					</TouchableOpacity>
				</View>
				<View style={{ position: 'absolute', bottom: 16, right: 12, alignItems: 'center' }}>
					<TouchableOpacity style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
						borderRadius: 5 }}>
						<Image source={require('../assets/images/add_black.png')} style={{ width: 17, height: 17 }} />
					</TouchableOpacity>
					<Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 2 }}>0x0</Text>
					<TouchableOpacity style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
						borderRadius: 5, marginTop: 2 }}>
						<Image source={require('../assets/images/min_black.png')} style={{ width: 15, height: 2 }} />
					</TouchableOpacity>
					<Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 8 }}>COORD.</Text>
					<Switch
        				trackColor={{ false: "#767577", true: "#81b0ff" }}
        				thumbColor={this.state.coordinateActive ? "#f5dd4b" : "#f4f3f4"}
        				ios_backgroundColor="#3e3e3e"
        				style={{ marginTop: 2 }}
        				onValueChange={(value) => {
        					this.setState({coordinateActive: value});
        				}}
        				value={this.state.coordinateActive} />
				</View>
				<View style={{ position: 'absolute', left: 12, bottom: 100 }}>
        			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        				<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Name:</Text>
        				<Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 4 }}>{this.state.fileName}</Text>
        				<TouchableOpacity style={{ width: 25, height: 25, marginLeft: 4, alignItems: 'center', justifyContent: 'center' }}
        					onPress={() => this.editFileName()}>
        					<Image source={require('../assets/images/edit.png')} style={{ width: 15, height: 15 }} />
        				</TouchableOpacity>
        			</View>
       				<Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: 2 }}>Date: 2020-09-10 21:12:54</Text>
        			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        				<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Client name:</Text>
        				<Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 4 }}>{currentPatientName}</Text>
        			</View>
        			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        				<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Device: {currentDeviceName}</Text>
        				<TouchableOpacity style={{ width: 25, height: 25, marginLeft: 4, alignItems: 'center', justifyContent: 'center' }}>
        					<Image source={require('../assets/images/edit.png')} style={{ width: 15, height: 15 }} />
        				</TouchableOpacity>
        			</View>
        		</View>
				<Modal animationType="fade" transparent={true} visible={this.state.chooseDeviceDialogVisible}>
					<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}
						onPress={() => {
							this.setState({chooseDeviceDialogVisible: false});
							this.props.navigation.goBack();
						}}>
						<View style={{ width: this.state.modalWidth, marginLeft: 32, marginRight: 32, shadowColor: '#000000',
							shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, backgroundColor: '#FFFFFF',
							borderRadius: 8, padding: 16 }}>
							<Text style={{ color: '#000000', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>Choose Device</Text>
							<FlatList
								data={this.state.devices}
								renderItem={({item}) => {
									if (item.type == 'add') {
										return (
											<TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 35 }}
												onPress={() => this.addDevice()}>
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
												onPress={() => this.selectDevice(item.id, item.uuid, item.device)}>
												<Image source={require('../assets/images/check.png')} style={{ width: 18, height: 18,
													marginLeft: 0, opacity: opacity }} />
												<Text style={{ marginLeft: 8 }}>{item.device}</Text>
											</TouchableOpacity>
										);
									}
								}}
								keyExtractor={(item, index) => index.toString()}
								/>
							<View style={{ width: '100%', position: 'relative', height: 30 }}>
								<TouchableOpacity style={{ position: 'absolute', top: 0, right: 8, paddingLeft: 8, paddingRight: 8, height: 30,
									alignItems: 'center', justifyContent: 'center' }}
									onPress={() => {
										this.setState({chooseDeviceDialogVisible: false});
										this.props.navigation.goBack();
									}}>
									<Text style={{ color: bgColor, fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
				<Modal animationType="fade" transparent={true} visible={this.state.fileNameDialogVisible}>
					<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}
						onPress={() => {
							this.setState({fileNameDialogVisible: false});
						}}>
						<View style={{ width: this.state.modalWidth, marginLeft: 32, marginRight: 32, shadowColor: '#000000',
							shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, backgroundColor: '#FFFFFF',
							borderRadius: 8, padding: 8}}>
							<Text style={{ color: '#000000', fontSize: 18, fontWeight: 'bold', marginLeft: 12, marginTop: 8 }}>Edit file name</Text>
							<TextInput placeholder="Enter file name" placeholderTextColor="#88888855"
								value={this.state.editedFileName.substring(0, this.state.editedFileName.lastIndexOf('.jpg'))}
								onChangeText={(value) => {
									this.setState({editedFileName: value+".jpg"});
								}}
								style={{ backgroundColor: '#EEEEEE', marginTop: 8, marginLeft: 4, marginRight: 4, paddingLeft: 4, paddingRight: 4,
									height: 40 }} />
							<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 8, marginTop: 8 }}>
								<TouchableOpacity style={{ height: 30, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ color: '#3498db', fontWeight: 'bold', fontSize: 15 }}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ height: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}
									onPress={() => {
										this.setState({
											fileNameDialogVisible: false,
											fileName: this.state.editedFileName
										});
									}}>
									<Text style={{ color: '#3498db', fontWeight: 'bold', fontSize: 15 }}>Save</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
				<Modal animationType="fade" transparent={true} visible={this.state.saveDialogVisible}>
					<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}
						onPress={() => {
							this.setState({saveDialogVisible: false});
						}}>
						<View style={{ width: this.state.modalWidth, marginLeft: 32, marginRight: 32, shadowColor: '#000000',
							shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6, backgroundColor: '#FFFFFF',
							borderRadius: 8, padding: 8}}>
							<Text style={{
								color: '#000000',
								fontSize: 19,
								fontWeight: 'bold',
								marginLeft: 24,
								marginTop: 4
							}}>Save to...</Text>
							{/* MY ACCOUNT */}
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
								onPress={() => this.selectSaveToOption(0) }>
								<RadioButton
        							value="myaccount"
        							status={ this.state.myAccountChecked ? 'checked' : 'unchecked' }
        							color={flatBlue}
        							onPress={() => {
        								this.selectSaveToOption(0);
        							}} />
            					<Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>My Account</Text>
							</TouchableOpacity>
							{/* GD */}
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
								onPress={() => this.selectSaveToOption(1) }>
								<RadioButton
        							value="gd"
        							status={ this.state.gdChecked ? 'checked' : 'unchecked' }
        							color={flatBlue}
        							onPress={() => {
        								this.selectSaveToOption(1);
        							}} />
        						<Image source={require('../assets/images/gd.png')} style={{ width: 20, height: 20, marginLeft: 8 }} />
            					<Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Google Drive</Text>
							</TouchableOpacity>
							{/* DB */}
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
								onPress={() => this.selectSaveToOption(2) }>
								<RadioButton
        							value="db"
        							status={ this.state.dbChecked ? 'checked' : 'unchecked' }
        							color={flatBlue}
        							onPress={() => {
        								this.selectSaveToOption(2);
        							}} />
            					<Image source={require('../assets/images/db.png')} style={{ width: 25, height: 25, marginLeft: 8 }} />
            					<Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Dropbox</Text>
							</TouchableOpacity>
							{/* SKIP */}
							<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
								onPress={() => this.selectSaveToOption(3) }>
								<RadioButton
        							value="skip"
        							status={ this.state.skipChecked ? 'checked' : 'unchecked' }
        							color={flatBlue}
        							onPress={() => {
        								this.selectSaveToOption(3);
        							}} />
            					<Text style={{ color: '#000000', fontSize: 15, marginLeft: 8 }}>Skip</Text>
							</TouchableOpacity>
							<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 8 }}>
								<TouchableOpacity style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}
									onPress={() => {
										this.setState({
											saveDialogVisible: false
										});
									}}>
									<Text style={{ color: flatBlue, fontWeight: 'bold', fontSize: 15 }}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity style={{ height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}
									onPress={() => {
										this.setState({
											saveDialogVisible: false
										});
										this.save();
									}}>
									<Text style={{ color: flatBlue, fontWeight: 'bold', fontSize: 15 }}>OK</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				</Modal>
				<ProgressDialog label='Loading...' visible={this.state.progressVisible}/>
			</View>
		);
	}
}
