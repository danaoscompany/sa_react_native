import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, FlatList, Dimensions, Switch, Alert, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { WebView } from 'react-native-webview';
import GDrive from "react-native-google-drive-api-wrapper";
import ProgressDialog from 'react-native-progress-dialog';
import * as Progress from 'react-native-progress';
import { RNCamera, FaceDetector } from 'react-native-camera';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import global from '../global.js';

export default class TakePicture extends Component {

	constructor(props) {
		super(props);
		this.state = {
			camera: null,
			chooseDeviceDialogVisible: false,
			modalWidth: Dimensions.get('window').width-32-32,
			dbModalWidth: Dimensions.get('window').width-16-16,
			dbModalHeight: Dimensions.get('window').height-32-32,
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
			gdToken: '',
			selectedSaveOption: 0,
			savedImagePath: '',
			progressVisible: false,
			webViewVisible: false,
			dbAccessTokenURL: '',
			dbAccessToken: '',
			currentZoomValue: 0.0
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
				trx.executeSql("SELECT * FROM devices", [], (trx, devices) => {
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
				log("ALL DEVICES:");
				log(response);
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

	changeDevice() {
		this.getDevices();
	}

	selectDevice(id, uuid, name, zoomValue) {
		currentDeviceID = id;
		currentDeviceUUID = uuid;
		currentDeviceName = name;
		this.setState({
			currentZoomValue: parseFloat(zoomValue),
			chooseDeviceDialogVisible: false
		});
		log("SELECTED ZOOM VALUE: "+this.state.currentZoomValue);
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
		this.setState({selectedSaveOption: index});
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
		let uuid = uuidv4();
		let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		if (this.state.selectedSaveOption != 3) {
			db.transaction((trx) => {
				trx.executeSql("INSERT INTO session_images (user_id, device_id, uuid, device_uuid, session_uuid, name, note, points, type, date, image_x, image_y, image_width, image_height, photo_num, storage_method) VALUES ("+userID+", "+deviceID+", '"+uuid+"', '"+currentDeviceUUID+"', '"+currentSessionUUID+"', '"+this.state.fileName+"', '', '[]', 0, '"+date+"', 0, 0, 0, 0, 0, 'my_account')", [], (trx, results) => {
				});
			});
		}
		if (userID != 0) {
			if (this.state.selectedSaveOption == 0) {
				// Save to my account
				log("SAVING TO MY ACCOUNT");
				this.setState({progressVisible: true});
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
						'date': date,
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
					imageListRefresh();
					this.props.navigation.navigate('ImageList');
  				})
  				.catch((err) => {
    				if (err.description === "cancelled") {
					}
					console.log(err);
				});
			} else if (this.state.selectedSaveOption == 1) {
				log("UPLOADING TO GOOGLE DRIVE...");
				this.setState({progressVisible: true});
				//AIzaSyCVNrhUiwzton_QFChN-ioIX2yllVyIYCQ
				GoogleSignin.configure({
					scopes: ['https://www.googleapis.com/auth/drive.file'], // what API you want to access on behalf of the user, default is email and profile
					webClientId: '920101946028-q2m2sfkkdpmqqa9vancr48p4rejoagu6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
					androidClientId: '920101946028-ceb2ukbu3kdo13ek41700haph9daqhjl.apps.googleusercontent.com',
					offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
					hostedDomain: '', // specifies a hosted domain restriction
				loginHint: '',
					forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
					accountName: '', // [Android] specifies an account name on the device that should be used
					iosClientId: '920101946028-rlm7mhb7ijp6d40lao8m3v5pujmo5aih.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
				});
				(async () => {
					try {
	    				await GoogleSignin.hasPlayServices();
	    				/*if (await GoogleSignin.isSignedIn()) {
	    					this.setState({gdToken: await AsyncStorage.getItem('gd_token')});
	    					this.uploadToGd();
	    				} else {*/
		    				const userInfo = await GoogleSignin.signIn();
		    				log("USER INFO:");
		    				log(userInfo);
		    				await GoogleSignin.getTokens().then((response) => {
		    					(async () => {
			    					let accessToken = response['accessToken'];
			    					this.setState({
			    						gdToken: accessToken
			    					});
			    					try {
										await AsyncStorage.setItem('gd_token', this.state.gdToken);
									} catch (e) {
									}
									this.uploadToGd();
		    					})();
		    				});
		  				//}
		  			} catch (error) {
		  				log(error);
		    			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
		      				// user cancelled the login flow
		    			} else if (error.code === statusCodes.IN_PROGRESS) {
		     				// operation (e.g. sign in) is in progress already
		    			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
		      				// play services not available or outdated
		    			} else {
		      				// some other error happened
		    			}
		  			}
				})();
			} else if (this.state.selectedSaveOption == 2) {
				this.setState({
					dbAccessTokenURL: 'https://www.dropbox.com/1/oauth2/authorize?client_id=dnaeosu4mc1dkhj&response_type=token&redirect_uri=https://acf0ca6bbb61.ngrok.io/dbcallback.php',
					webViewVisible: true
				});
			} else if (this.state.selectedSaveOption == 3) {
				let uuid = uuidv4();
				log("PREVIEW IMAGE UUID: "+uuid);
				log("PREVIEW IMAGE PATH: "+this.state.savedImagePath);
				var rootPath = "";
				var imagesPath = "";
				if (Platform.OS == 'android') {
					rootPath = RNFS.ExternalStorageDirectoryPath;
					imagesPath = rootPath+"/Android/data/com.skinanalyzer/preview_images";
				} else if (Platform.OS == 'ios') {
					rootPath = RNFS.MainBundlePath;
					imagesPath = rootPath+"/SkinAnalyzer/preview_images";
				}
				RNFS.exists(imagesPath).then((exists) => {
					if (!exists) {
						RNFS.mkdir(imagesPath);
					}
					let savePath = imagesPath+"/"+uuid+".jpg";
					RNFS.copyFile(this.state.savedImagePath, savePath);
					db.transaction((trx) => {
						let sql = "INSERT INTO preview_images (user_id, uuid, session_uuid, device_uuid, type, name, path, points, image_x, image_y, image_width, image_height, note, date, photo_num, local, storage_method) VALUES ("+userID+", '"+uuidv4()+"', '"+currentSessionUUID+"', '"+currentDeviceUUID+"', 0, '"+this.state.fileName+"', '"+savePath+"', '[]', 0, 0, 0, 0, '', '"+moment(new Date()).format('YYYY-MM-DD HH:mm:ss')+"', 0, 1, 'preview_only')";
						log("PREVIEW IMAGE SQL STATEMENT:");
						log(sql);
						trx.executeSql(sql);
						this.setState({progressVisible: false});
						previewImagesRefresh();
						this.props.navigation.navigate('PreviewImages');
					});
				});
			}
		}
	}

	async uploadToGd() {
		log("UPLOADING NOW TO GOOGLE DRIVE");
		let uuid = uuidv4();
		let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		await GDrive.setAccessToken(this.state.gdToken);
		await GDrive.init();
		RNFS.readFile(this.state.savedImagePath, 'base64')
			.then((base64Data) => {
				//log("FILE DATA IN BASE64");
				//log(base64Data);
				(async () => {
					let fileName = uuidv4()+".jpg";
					let response = await GDrive.files.createFileMultipart(
	     				base64Data,
	     				"image/jpeg", {
	         				parents: ["root"],
	         				name: fileName
	     				},
	     			true);
	     			log(response);
	     			let ok = response['ok'];
	     			if (ok) {
	     				let gdFileID = response['blobId'];
	     				var files = [
							{
    							name: 'file',
    							filename: uuidv4()+'.jpg',
    							filepath: this.state.savedImagePath.replace("file://", ""),
    							filetype: 'image/jpeg'
							}];
	     				RNFS.uploadFiles({
  							toUrl: API_URL+"/user/upload_to_gd",
							files: files,
							method: 'POST',
							headers: {
							},
							fields: {
								"user_id": ""+userID,
	     						"uuid": uuid,
	     						"device_uuid": currentDeviceUUID,
	     						"session_uuid": currentSessionUUID,
	     						"name": this.state.fileName,
	     						"note": "",
	     						"path": fileName,
	     						"points": "[]",
	     						"type": "0",
	     						"date": date,
	     						"gd_file_id": gdFileID,
	     						"image_x": "0",
	     						"image_y": "0",
	     						"image_width": "0",
	     						"image_height": "0",
	     						"photo_num": "0"
							}
						}).promise.then((response) => {
							log("UPLOAD RESPONSE");
							log(response);
							this.setState({progressVisible: false});
							imageListRefresh();
							this.props.navigation.navigate('ImageList');
  						})
  				.		catch((err) => {
    						if (err.description === "cancelled") {
							}
							log(err);
						});
	     			} else {
	     				this.setState({progressVisible: false});
	     				show("Upload failed");
	     			}
				})();
			});
	}
	
	zoomIn() {
		if (this.state.currentZoomValue < 1) {
			this.setState({
				currentZoomValue: this.state.currentZoomValue+0.1
			});
		}
		if (this.state.currentZoomValue >= 1) {
			this.setState({
				currentZoomValue: 1
			});
		}
	}
	
	zoomOut() {
		if (this.state.currentZoomValue > 0) {
			this.setState({
				currentZoomValue: this.state.currentZoomValue-0.1
			});
		}
		if (this.state.currentZoomValue <= 0) {
			this.setState({
				currentZoomValue: 0
			});
		}
	}

	uploadImageToDB() {
		log("UPLOADING IMAGE TO DB...");
		let uuid = uuidv4();
		let date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		db.transaction((trx) => {
			trx.executeSql("INSERT INTO session_images (user_id, uuid, device_uuid, session_uuid, name, note, points, type, date, image_x, image_y, image_width, image_height, photo_num, storage_method) VALUES ("+userID+", '"+uuid+"', '"+currentDeviceUUID+"', '"+currentSessionUUID+"', '"+this.state.fileName+"', '', '[]', 0, '"+date+"', 0, 0, 0, 0, 0, 'db')", [], (trx, results) => {
			});
		});
		if (userID != 0) {
			let fileName = uuidv4()+'.jpg';
			var files = [
				{
    				name: 'file',
    				filename: fileName,
    				filepath: this.state.savedImagePath.replace("file://", ""),
    				filetype: 'image/jpeg'
				}];
	     	RNFS.uploadFiles({
  				toUrl: API_URL+"/user/upload_to_db",
				files: files,
				method: 'POST',
				headers: {
				},
				fields: {
					"user_id": ""+userID,
	     			"uuid": uuid,
	     			"device_uuid": currentDeviceUUID,
	     			"session_uuid": currentSessionUUID,
	     			"name": this.state.fileName,
	     			"note": "",
	     			"path": fileName,
	     			"points": "[]",
	     			"type": "0",
	     			"date": date,
	     			"image_x": "0",
	     			"image_y": "0",
	     			"image_width": "0",
	     			"image_height": "0",
	     			"photo_num": "0"
				}
			}).promise.then((response) => {
				log("UPLOAD RESPONSE");
				log(response['body']);
				let uploadInfo = response['body'];
				let imageUUID = uploadInfo['uuid'];
				let dbFilePath = uploadInfo['path'];
				let fd = new FormData();
				fd.append("uuid", imageUUID);
				fd.append("path", dbFilePath);
				fetch(API_URL+"/user/update_db_file_path", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(response => response.text())
				.then(response => {
					this.setState({progressVisible: false});
					imageListRefresh();
					this.props.navigation.navigate('ImageList');
				});
  			})
  			.catch((err) => {
    			if (err.description === "cancelled") {
				}
				log(err);
			});
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
					zoom={this.state.currentZoomValue}
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
						borderRadius: 5 }}
						onPress={() => {
							this.zoomIn();
						}}>
						<Image source={require('../assets/images/add_black.png')} style={{ width: 17, height: 17 }} />
					</TouchableOpacity>
					<Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: 2 }}>{this.state.currentZoomValue.toFixed(1)}x</Text>
					<TouchableOpacity style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
						borderRadius: 5, marginTop: 2 }}
						onPress={() => {
							this.zoomOut();
						}}>
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
        			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
        				onPress={() => {
        					this.changeDevice();
        				}}>
        				<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Device: {currentDeviceName}</Text>
        				<View style={{ width: 25, height: 25, marginLeft: 4, alignItems: 'center', justifyContent: 'center' }}>
        					<Image source={require('../assets/images/edit.png')} style={{ width: 15, height: 15 }} />
        				</View>
        			</TouchableOpacity>
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
										log("SELECTED DEVICE ITEM: ");
										log(item);
										var opacity = 0;
										if (item.selected) {
											opacity = 1;
										}
										return (
											<TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 35 }}
												onPress={() => this.selectDevice(item.id, item.uuid, item.device, item.zoom_value)}>
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
				<Modal animationType="fade" transparent={true} visible={this.state.webViewVisible}>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000055' }}>
						<View style={{ width: this.state.dbModalWidth, height: 250, marginLeft: 32, marginRight: 32,
							shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6,
							backgroundColor: '#FFFFFF', borderRadius: 8, padding: 8}}>
							<WebView source={{ uri: this.state.dbAccessTokenURL }} style={{ position: 'absolute', left: 0, top: 0, width: '100%',
								height: '100%' }}
								injectedJavaScript={this.state.injectedJavascript}
								onMessage={event => {
									this.setState({
										dbAccessToken: event.nativeEvent.data,
										dbAccessTokenURL: ''
									});
									log("DB ACCESS TOKEN: "+this.state.dbAccessToken);
									alert("Access token: "+this.state.dbAccessToken);
									this.uploadImageToDB();
			    				}} />
			    			<View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
			    				<Text style={{ color: '#888888', fontSize: 23 }}>Uploading to Dropbox...</Text>
			    				<Progress.Circle size={50} indeterminate={true} style={{ marginTop: 16 }} />
			    			</View>
    					</View>
    				</View>
    			</Modal>
				<ProgressDialog label='Loading...' visible={this.state.progressVisible} />
			</View>
		);
	}
}
