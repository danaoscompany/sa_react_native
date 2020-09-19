import React, {Component, useState} from 'react';
import {
	Button,
	Text,
	View,
	Image,
	Alert,
	FlatList,
	TouchableOpacity,
	Platform,
	BackHandler,
	Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {FloatingAction} from 'react-native-floating-action';
import global from '../global.js';
import resources from '../resources.js';
import moment from 'moment';
import ImageLoad from 'react-native-image-placeholder';
import * as Progress from 'react-native-progress';
import RNFS from 'react-native-fs';
import PDFLib, {PDFDocument, PDFPage} from 'react-native-pdf-lib';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'react-native-fetch-blob';
import ProgressDialog from 'react-native-progress-dialog';

const addActions = [
	{
		text: 'Add',
		icon: require('../assets/images/add.png'),
		name: 'add',
		position: 0,
	},
];

export default class SelectSession extends Component {

	constructor(props) {
		super(props);
		this.state = {
			noSessionContainerVisible: false,
			progressVisible: true,
			loadingProgressVisible: false,
			sessions: [],
			latestDate: '',
			progressThickness: 5,
			action: this.props.route.params.action,
			files: [
				/*{name: "...", type: "back"},
				{name: "Android", type: "folder"},
				{name: "DCIM", type: "folder"},
				{name: "Downloads", type: "folder"},
				{name: "Pictures", type: "folder"}*/
			],
			currentPath: RNFS.ExternalStorageDirectoryPath,
			folderPickerVisible: false,
			folderPickerDialogWidth: Dimensions.get('window').width - 32 - 32,
			folderPickerDialogHeight: Dimensions.get('window').height - 32 - 32,
			folderPickerHeight: '100%',
			selectedSessionUUID: '',
			selectedSessionName: '',
			selectedSessionUserID: 0,
			selectedSessionPatientUUID: '',
			selectedSession: null,
			locations: [
				{name: 'Palma left', x: 202, y: 132, width: 227, height: 161},
				{name: 'Palma Right', x: 1, y: 129, width: 29, height: 161},
				{name: 'Forearm Flexor Side Left', x: 171, y: 101, width: 203, height: 133},
				{name: 'Upper Arm Flexor Side Left', x: 149, y: 59, width: 175, height: 105},
				{name: 'Forearm Flexor Side Right', x: 3, y: 99, width: 62, height: 157},
				{name: 'Upper Arm Flexor Side Right', x: 18, y: 246, width: 150, height: 435},
				{name: 'Forearm Flexor Side Right', x: 45, y: 423, width: 162, height: 591},
				{name: 'Thumb Extensor Side Right', x: 75, y: 585, width: 195, height: 750},
				{name: 'Thigh Extensor Side Right', x: 65, y: 157, width: 109, height: 220},
				{name: 'Lower Reg Extensor Side Right', x: 47, y: 207, width: 91, height: 286},
				{name: 'Lower Reg Extensor Side Left', x: 143, y: 227, width: 185, height: 287},
				{name: 'Back Right', x: 37, y: 285, width: 67, height: 309},
				{name: 'Back Left', x: 161, y: 282, width: 191, height: 309},
				{name: 'Face', x: 93, y: 0, width: 137, height: 40},
				{name: 'Frontal', x: 93, y: 32, width: 143, height: 55},
				{name: 'Check Central Left', x: 66, y: 3, width: 285, height: 189},
				{name: 'Cervical', x: 72, y: 159, width: 282, height: 252},
				{name: 'Upper Arm Flexor Side Left', x: 141, y: 228, width: 270, height: 453},
				{name: 'Forearm Flexor Side Left', x: 141, y: 402, width: 237, height: 612},
				{name: 'Thumb Extensor Side Left', x: 102, y: 564, width: 237, height: 612},
				{name: 'Thigh Extensor Side Left', x: 69, y: 645, width: 234, height: 1071},
				{name: 'Lower Leg Flexor Side Left', x: 87, y: 1071, width: 249, height: 1476},
				{name: 'Left', x: 21, y: 1428, width: 264, height: 1527},
				{name: 'Left (2)', x: 3, y: 1308, width: 165, height: 1407},
				{name: 'Check Central Right', x: 15, y: 3, width: 216, height: 183},
				{name: 'Cervical', x: 39, y: 141, width: 195, height: 258},
				{name: 'Upper Arm Flexor Side Right', x: 45, y: 54, width: 83, height: 107},
				{name: 'Thorax', x: 81, y: 57, width: 143, height: 84},
				{name: 'Upper Abdomen', x: 87, y: 87, width: 144, height: 111},
				{name: 'Lower Abdomen', x: 90, y: 109, width: 139, height: 135},
				{name: 'Inguinal', x: 88, y: 134, width: 145, height: 160},
				{name: 'Thigh Extensor Side Left', x: 116, y: 151, width: 167, height: 224},
				{name: 'Thigh Extensor Side Right', x: 65, y: 157, width: 109, height: 220},
				{name: 'Lower Leg Flexor Side Right', x: 27, y: 1050, width: 165, height: 1431},
				{name: 'Right', x: 30, y: 1434, width: 279, height: 1527},
				{name: 'Right (2)', x: 99, y: 1317, width: 294, height: 1407},
				{name: 'Head', x: 450, y: 15, width: 612, height: 138},
				{name: 'Neck', x: 462, y: 162, width: 618, height: 204},
				{name: 'Upper Back', x: 357, y: 207, width: 687, height: 492},
				{name: 'Lower Back', x: 399, y: 489, width: 678, height: 654},
				{name: 'Glutaeal', x: 399, y: 642, width: 735, height: 828},
				{name: 'Thigh Flexor Side Left', x: 234, y: 831, width: 507, height: 1119},
				{name: 'Lower Lef Flexor Side Left', x: 210, y: 1044, width: 429, height: 1455},
				{name: 'Left', x: 192, y: 1413, width: 306, height: 1521},
				{name: 'Right', x: 795, y: 1431, width: 903, height: 1530},
				{name: 'Lower Leg Flexor Side Right', x: 675, y: 1104, width: 900, height: 1455},
				{name: 'Upper Leg Flexor Side Right', x: 555, y: 834, width: 819, height: 1140},
			],
		};
		logout = logout.bind(this);
		this.backHandler = this.backHandler.bind(this);
	}

	getRealX(a, b, c) {
		return b <= 0 ? a : (a * c) / b;
	}

	getRealY(a, b, c) {
		return b <= 0 ? a : (a * c) / b;
	}

	getLocationName(x, y) {
		for (let i = 0; i < this.state.locations.length; i++) {
			let location = this.state.locations[i];
			if (x >= parseInt(location['x']) && y >= parseInt(location['y']) && x < parseInt(location['x']) + parseInt(location['width']) && y < parseInt(location['y']) + parseInt(location['height'])) {
				return location['name'];
			}
		}
		return 'Some part of the body';
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.backHandler);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
	}

	backHandler() {
		this.goBack();
		return true;
	}

	componentDidMount() {
		if (Platform.OS == 'android') {
			this.setState({
				currentPath: RNFS.ExternalStorageDirectoryPath,
			});
		} else if (Platform.OS == 'ios') {
			this.setState({
				currentPath: RNFS.DocumentDirectoryPath,
			});
		}
		log('FOLDER PICKER HEIGHT: ' + this.state.folderPickerHeight);
		this.browseFolders();
		this.getSessions();
	}


	async browseFolders() {
		log('BROWSE FOLDERS... ' + await this.state.currentPath);
		RNFS.readDir(await this.state.currentPath).then((files) => {
			log('FILES SIZE: ' + files.length);
			(async () => {
				await this.setState({
					files: [],
				});
				log('THIS LINE 1');
				for (let i = 0; i < files.length; i++) {
					let file = files[i];
					if (file.isDirectory()) {
						await this.state.files.push({
							name: file['name'],
							path: file['path'],
							count: 0,
							type: 'folder',
							lastItem: (i == files.length - 1),
						});
						let path = file['path'];
						RNFS.readDir(path).then((files) => {
							var count = 0;
							for (let j = 0; j < files.length; j++) {
								let file = files[j];
								if (file.isDirectory()) {
									count++;
								}
							}
							this.updateFoldersCount(path, count);
						});
					}
				}
				if (await this.state.files.length > 0) {
					await this.state.files.sort((file1, file2) => {
						return file1['name'].localeCompare(file2['name']);
					});
					await this.state.files.splice(0, 0, {
						name: '...', path: await this.state.currentPath, type: 'back',
					});
				} else {
					await this.state.files.push({
						name: '...', path: await this.state.currentPath, type: 'back',
					});
				}
			})();
		});
	}

	updateFoldersCount(path, count) {
		for (let i = 0; i < this.state.files.length; i++) {
			let file = this.state.files[i];
			if (file['path'] == path) {
				this.state.files[i]['count'] = count;
			}
		}
	}

	getSessions() {
		log('Getting sessions...');
		this.setState({
			noSessionContainerVisible: false,
			progressVisible: true,
			sessions: [],
		});
		log('USER ID: ' + userID);
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql('SELECT * FROM sessions ORDER BY date DESC;', [], (trx, results) => {
					let sessionData = [
						/*{name: 'Session 1', date: '2020-09-08 10:00:00'},
						{name: 'Session 2', date: '2020-09-09 10:00:00'},
						{name: 'Session 3', date: '2020-09-10 10:00:00'},
						{name: 'Session 4', date: '2020-09-11 10:00:00'},
						   {name: 'Session 5', date: '2020-09-12 10:00:00'}*/
					];
					for (let i = 0; i < results.rows.length; i++) {
						var result = results.rows.item(i);
						result['type'] = 'session';
						result['images'] = [];
						var date = result['date'].substring(0, result['date'].indexOf(' '));
						let sessionUUID = result['uuid'];
						if (this.state.latestDate != date) {
							this.setState({latestDate: date});
							sessionData.push({type: 'header', date: result['date'], images: []});
						}
						//log("PATIENT UUID: "+result['patient_uuid']);
						let session = {
							type: 'session',
							uuid: result['uuid'],
							user_id: parseInt(result['user_id']),
							patient_uuid: result['patient_uuid'],
							name: result['name'],
							date: result['date'],
							images: [],
						};
						sessionData.push(session);
						db.transaction((trx) => {
							trx.executeSql('SELECT * FROM session_images WHERE session_uuid=\'' + sessionUUID + '\'', [], (trx, images) => {
								let sessionData = this.state.sessions;
								let imagesData = [];
								for (let j = 0; j < images.rows.length; j++) {
									var imageData = images.rows.item(j);
									imagesData.push(imageData);
								}
								//log("SESSION UUID: "+sessionUUID+", images: "+JSON.stringify(imagesData));
								//log("SESSION UUID: "+sessionUUID+", UPDATING AT POSITION: "+i+", IMAGES: "+imagesData.length);
								session['images'] = imagesData;
								this.setState({
									sessions: sessionData,
								});
							});
						});
					}
					/*sessionData.sort(function(session1, session2) {
					  var date1 = moment(session1['date'].substring(0, session1['date'].indexOf(' ')), 'YYYY-MM-DD');
						 var date2 = moment(session2['date'].substring(0, session2['date'].indexOf(' ')), 'YYYY-MM-DD');
					  return date1.isAfter(date2);
				  });*/
					this.setState({
						sessions: sessionData,
						progressVisible: false,
					});
					if (sessionData.length > 0) {
						this.setState({
							noSessionContainerVisible: false,
						});
					} else {
						this.setState({
							noSessionContainerVisible: true,
						});
					}
				});
			});
		} else {
			log("GETTING SESSIONS");
			let fd = new FormData();
			fd.append('user_id', userID);
			fd.append('device_uuid', '');
			fetch(API_URL+'/user/get_sessions', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}})
				.then(response => response.text())
				.then(response => {
					log(response);
					let sessionsJSON = JSON.parse(response);
					log('ALL SESSIONS');
					log(sessionsJSON);
					for (let i = 0; i < sessionsJSON.length; i++) {
						let sessionJSON = sessionsJSON[i];
						/*let session = {type: 'session', userID: parseInt(sessionJSON['user_id']), uuid: sessionJSON['uuid'],
							patientUUID: sessionJSON['patient_uuid'], name: sessionJSON['name'], date: sessionJSON['date'], images: []};*/
						sessionJSON['type'] = 'session';
						this.state.sessions.push(sessionJSON);
					}
					this.setState({
						progressVisible: false,
						noSessionContainerVisible: false
					});
					/*if (this.state.sessions.length == 0) {
						this.setState({
							noSessionContainerVisible: true,
						});
					} else {
						this.setState({
							noSessionContainerVisible: false,
						});
					}*/
				})
				.catch((error) => {
					log("GETTING SESSIONS ERROR: "+error);
				});
		}
	}

	addAction(name) {
		if (name == 'add') {
			this.addSession();
		}
	}

	addSession() {
		this.props.navigation.navigate('AddSession', {
			onAdded: () => {
				log('ON SESSION ADDED');
				this.getSessions();
			},
		});
	}

	download(uuid) {
		log('DOWNLOADING SESSION WITH UUID: ' + uuid);
		this.setState({selectedSessionUUID: uuid});
		Alert.alert('Confirmation', 'Are you sure you want to download this session?', [
			{
				text: 'Yes',
				onPress: () => {
					var selectedSession = null;
					for (let i = 0; i < this.state.sessions.length; i++) {
						let session = this.state.sessions[i];
						if (session['uuid'] == uuid) {
							selectedSession = session;
							break;
						}
					}
					log('SELECTED SESSION');
					log(selectedSession);
					if (selectedSession != null) {
						this.setState({
							selectedSession: selectedSession,
							selectedSessionName: selectedSession['name'],
							selectedSessionUserID: parseInt(selectedSession['user_id']),
							selectedSessionPatientUUID: selectedSession['patient_uuid'],
							folderPickerVisible: true,
						});
					}
				},
			},
			{
				text: 'No',
				style: 'cancel',
			},
		]);
	}

	selectSession(sessionUUID, patientUUID, sessionName) {
		currentSessionUUID = sessionUUID;
		currentPatientUUID = patientUUID;
		currentSessionName = sessionName;
		log("CURRENT PATIENT UUID: "+patientUUID);
		this.setState({progressVisible: true});
		//log("SELECTING SESSION");
		if (userID == 0) {
			//log("STARTING SQL TRANSACTION");
			db.transaction((trx) => {
				//log("EXECUTING SQL STATEMENT");
				trx.executeSql('SELECT * FROM patients WHERE uuid=\'' + currentPatientUUID + '\'', [], (trx, patients) => {
					//log("PATIENTS SIZE: "+patients.rows.length);
					if (patients.rows.length > 0) {
						let patient = patients.rows.item(0);
						currentPatientName = patient['name'];
						//log("CURRENT PATIENT NAME: "+currentPatientName);
						this.setState({progressVisible: false});
						this.props.route.params.onSelected(sessionUUID, patientUUID, sessionName);
						if (this.state.action == 'select') {
							this.props.navigation.goBack();
						} else if (this.state.action == 'take_picture') {
							this.props.navigation.navigate('TakePicture');
						}
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", currentPatientUUID);
			fetch(API_URL+"/user/get_patient_by_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("PATIENT: "+response);
				let patient = JSON.parse(response);
				currentPatientName = patient['name'];
				//log("CURRENT PATIENT NAME: "+currentPatientName);
				this.setState({progressVisible: false});
				this.props.route.params.onSelected(sessionUUID, patientUUID, sessionName);
				if (this.state.action == 'select') {
					this.props.navigation.goBack();
				} else if (this.state.action == 'take_picture') {
					this.props.navigation.navigate('TakePicture');
				}
			});
		}
	}

	editSession(uuid) {
		this.props.navigation.navigate('EditSession', {
			uuid: uuid,
			onSaved: () => {
				this.getSessions();
			},
		});
	}

	deleteSession(uuid) {
		Alert.alert('Confirmation', 'Are you sure you want to delete this session', [
			{
				text: 'Yes',
				onPress: () => {
					this.setState({progressVisible: true});
					if (userID == 0) {
						db.transaction((trx) => {
							trx.executeSql('DELETE FROM sessions WHERE uuid=\'' + uuid + '\'', [], (trx, results) => {
								this.setState({progressVisible: false});
								this.getSessions();
							});
						});
					} else {
						let fd = new FormData();
						fd.append('uuid', uuid);
						fetch(API_URL+'/user/delete_session', {
							method: 'POST',
							body: fd,
							headers: {
								'Content-Type': 'multipart/form-data',
							}
							})
							.then(response => response.text())
							.then(response => {
								this.setState({progressVisible: false});
								this.getSessions();
							});
					}
				},
			},
			{
				text: 'No',
				style: 'cancel',
			},
		]);
	}

	goBack() {
		if (this.state.folderPickerVisible) {
			(async () => {
				let path = item.path;
				log('CURRENT PATH: ' + path);
				if (path.endsWith('/')) {
					path = path.substring(0, path.length - 1);
				}
				path = path.substring(0, path.lastIndexOf('/'));
				log('PREVIOUS PATH: ' + path);
				await this.setState({
					currentPath: path,
				});
				this.browseFolders();
			})();
		} else {
			this.props.navigation.goBack();
		}
	}

	closeFolderPickerDialog() {
		this.setState({folderPickerVisible: false});
	}

	async saveStep3(pdfFolder, userName, patientName, markJSON) {
		log("MARK:");
		log(markJSON);
		log("SAVE STEP 3");
		let backPoints = [];
		let frontPoints = [];
		let leftPoints = [];
		let rightPoints = [];
		let backImageX = 0;
		let backImageY = 0;
		let backImageWidth = 0;
		let backImageHeight = 0;
		let frontImageX = 0;
		let frontImageY = 0;
		let frontImageWidth = 0;
		let frontImageHeight = 0;
		let leftImageX = 0;
		let leftImageY = 0;
		let leftImageWidth = 0;
		let leftImageHeight = 0;
		let rightImageX = 0;
		let rightImageY = 0;
		let rightImageWidth = 0;
		let rightImageHeight = 0;
		let pointX = 0;
		let pointY = 0;
		if (markJSON != null) {
			backPoints = JSON.parse(markJSON['back_points']);
			frontPoints = JSON.parse(markJSON['front_points']);
			leftPoints = JSON.parse(markJSON['left_points']);
			rightPoints = JSON.parse(markJSON['right_points']);
			backImageX = parseInt(markJSON['back_image_x']);
			backImageY = parseInt(markJSON['back_image_y']);
			backImageWidth = parseInt(markJSON['back_image_width']);
			backImageHeight = parseInt(markJSON['back_image_height']);
			frontImageX = parseInt(markJSON['front_image_x']);
			frontImageY = parseInt(markJSON['front_image_y']);
			frontImageWidth = parseInt(markJSON['front_image_width']);
			frontImageHeight = parseInt(markJSON['front_image_height']);
			leftImageX = parseInt(markJSON['left_image_x']);
			leftImageY = parseInt(markJSON['left_image_y']);
			leftImageWidth = parseInt(markJSON['left_image_width']);
			leftImageHeight = parseInt(markJSON['left_image_height']);
			rightImageX = parseInt(markJSON['right_image_x']);
			rightImageY = parseInt(markJSON['right_image_y']);
			rightImageWidth = parseInt(markJSON['right_image_width']);
			rightImageHeight = parseInt(markJSON['right_image_height']);
			log("FRONT IMAGE X, Y, WIDTH, HEIGHT: "+frontImageX+","+frontImageY+","+frontImageWidth+","+frontImageHeight);
			if (frontPoints.length > 0) {
				pointX = this.getRealX(parseInt(frontPoints[0]['x']) - frontImageX, frontImageWidth, 290);
				pointY = this.getRealY(parseInt(frontPoints[0]['y']) - frontImageY, frontImageHeight, 450);
			}
		}
		log("POINT X: "+pointX+", POINT Y: "+pointY);
		var fileName = 'Session-' + this.state.selectedSessionName + '-' + moment(new Date()).format('YYYYMMDDHHmmss');
		var imageURL = API_URL+'/userdata/' + this.state.selectedSession['images'][0]['path'];
		this.setState({
			loadingProgressVisible: true,
		});
		RNFetchBlob.config({
			fileCache: false,
		})
			.fetch('GET', imageURL)
			.then((resp) => {
				var base64Data = resp.base64();
				//log(base64Data);
				let documents = '<div>' +
					'<p style=\'text-align: center; font-size: 25;\'><b>Analyst Report Daily</b></p>' +
					'<img src=\'' + logo + '\' width=\'120\' height=\'80\' style=\'position: absolute; left: 70; top: 70;\'>' +
					'<img src=\'data:image/png;base64, ' + base64Data + '\' width=\'250\' height=\'250\' style=\'position: absolute; left: 250; top: 190;\'>' +
					'<img src=\''+API_URL+'/userdata/anatomy_2.png\' width=\'290\' height=\'450\' style=\'position: absolute; left: 60; top: 500;\'>' +
					'<p style=\'position: absolute; left: 380; top: 500; font-size: 24;\'>Session date: ' + moment(new Date()).format('DD MMMM YYYY') + '</p>' +
					'<p style=\'position: absolute; left: 380; top: 530; font-size: 24;\'>Doctor name: ' + userName + '</p>' +
					'<p style=\'position: absolute; left: 380; top: 560; font-size: 24;\'>Patient name: ' + patientName + '</p>' +
					'<p style=\'position: absolute; left: 380; top: 590; font-size: 24;\'>Description:</p>' +
					'<p style=\'position: absolute; left: 380; top: 620; font-size: 24;\'>Sign analysis in</p>';
				if (markJSON != null) {
					documents += '<p style=\'position: absolute; left: 380; top: 650; font-size: 24;\'>' + this.getLocationName(pointX, pointY) + '</p>';
					documents += '<img src=\''+API_URL+'/userdata/circle.png\' width=\'20\' height=\'20\' style=\'position: absolute; left: ' + (60 + pointX) + '; top: ' + (500 + pointY) + ';\'>';
				} else {
					documents += '<p style=\'position: absolute; left: 380; top: 650; font-size: 24;\'>Some part of the body</p>';
				}
				documents += '</div>';
				(async () => {
					let options = {
						html: documents,
						fileName: fileName,
						directory: pdfFolder,
					};
					log('SAVING NOW...');
					try {
						const results = await RNHTMLtoPDF.convert(options);
						log(results);
						this.setState({
							loadingProgressVisible: false,
						});
						if (Platform.OS == 'android') {
							pdfFolder = RNFS.ExternalStorageDirectoryPath + pdfFolder;
						}
						alert('PDF saved at ' + pdfFolder + '/' + fileName + '.pdf.');
					} catch (err) {
						log('ERROR SAVING PDF...');
						log(err);
					}
				})();
			});
	}

	async saveStep2(pdfFolder, userName, patientName) {
		log("SAVE STEP 2");
		if (userID == 0) {
			db.transaction((trx) => {
				let sql = "SELECT * FROM marks WHERE session_uuid='"+this.state.selectedSessionUUID+"'";
				log("SQL STATEMENT: "+sql);
				trx.executeSql(sql, [], (trx, marks) => {
					if (marks.rows.length > 0) {
						this.saveStep3(pdfFolder, userName, patientName, marks.rows.item(0));
					} else {
						this.saveStep3(pdfFolder, userName, patientName, null);
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append('session_uuid', this.state.selectedSessionUUID);
			fetch(API_URL+'/user/get_markings_by_session_uuid', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data',
				}})
				.then(response => response.text())
				.then(response => {
					log('GET MARKING RESPONSE');
					log(response);
					let marksJSON = JSON.parse(response);
					if (marksJSON.length > 0) {
						this.saveStep3(pdfFolder, userName, patientName, marksJSON[0]);
					} else {
						this.saveStep3(pdfFolder, userName, patientName, null);
					}
				});
		}
	}

	async saveStep1(pdfFolder, userName) {
		log("SAVE STEP 1");
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM patients WHERE uuid='"+this.state.selectedSessionPatientUUID+"'", [], (trx, patients) => {
					if (patients.length > 0) {
						let patient = patients[0];
						this.saveStep2(pdfFolder, userName, patient['name']);
					} else {
						this.saveStep2(pdfFolder, userName, "");
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append('uuid', this.state.selectedSessionPatientUUID);
			fetch(API_URL+'/user/get_patient_by_uuid', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data',
				}
				})
				.then(response => response.text())
				.then(response => {
					log('SESSION UUID');
					log(this.state.selectedSessionUUID);
					if (response == null || response == "null") {
						this.saveStep2(pdfFolder, userName, "");
					} else {
						let patient = JSON.parse(response);
						let patientName = patient['name'];
						this.saveStep2(pdfFolder, userName, patientName);
					}
				});
		}
	}

	async save(pdfFolder) {
		log('SAVING PDF...');
		log('USER ID: ' + this.state.selectedSessionUserID);
		if (userID == 0) {
			this.saveStep1(pdfFolder, "");
		} else {
			let fd = new FormData();
			fd.append('user_id', this.state.selectedSessionUserID);
			fetch(API_URL+'/user/get_user_by_id', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data',
				}})
				.then(response => response.text())
				.then(response => {
					let user = JSON.parse(response);
					let userName = user['first_name'] + ' ' + user['last_name'];
					this.saveStep1(pdfFolder, userName);
				});
		}
	}

	async selectFolder() {
		this.setState({
			folderPickerVisible: false,
			loadingProgressVisible: true,
		});
		let currentPath = this.state.currentPath;
		log('SELECTING FOLDER... ' + currentPath);
		let pdfFolder = currentPath;
		if (Platform.OS == 'android') {
			pdfFolder = pdfFolder.replace(RNFS.ExternalStorageDirectoryPath, '');
		}
		this.save(pdfFolder);
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: bgColor}}>
				<View style={{flex: 1, marginBottom: 43}}>
					<Image source={require('../assets/images/menu.png')}
						   style={{width: 30, height: 30, marginLeft: 16, marginTop: 16}}/>
					<View style={{width: '100%', alignItems: 'center', position: 'absolute'}}>
						<Text style={{color: '#FFFFFF', fontSize: 17, fontWeight: 'bold', marginTop: 16}}>Choose
							Session</Text>
					</View>
					<Modal animationType="slide" transparent={true} visible={this.state.folderPickerVisible} style={{
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
						<View style={{flex: 1, backgroundColor: '#00000055', width: '100%', height: '100%'}}>
							<View style={{
								flex: 1,
								margin: 32,
								backgroundColor: '#FFFFFF',
								borderRadius: 8,
								shadowColor: '#000000',
								shadowOffset: {width: 0, height: 3},
								shadowOpacity: 0.27,
								shadowRadius: 4.65,
								elevation: 6,
							}}>
								<Text style={{
									color: '#000000',
									fontSize: 19,
									fontWeight: 'bold',
									marginLeft: 24,
									marginTop: 16,
								}}>Select Folder</Text>
								<FlatList
									data={this.state.files}
									contentContainerStyle={{paddingBottom: 50}}
									style={{marginTop: 8, height: '100%', overflow: 'hidden'}}
									renderItem={({item}) => {
										if (item.type == 'back') {
											return (
												<View style={{width: '100%'}}>
													<TouchableOpacity style={{
														width: '100%',
														flexDirection: 'row',
														alignItems: 'center',
														marginTop: 4,
													}}
																	  onPress={() => {
																		  this.goBack();
																	  }}>
														<Image source={require('../assets/images/folder.png')}
															   style={{width: 30, height: 25, marginLeft: 8}}/>
														<View style={{marginLeft: 8, marginRight: 8}}>
															<Text style={{color: '#000000', fontSize: 15}}>...</Text>
															<Text style={{
																color: '#888888',
																fontSize: 15,
																marginTop: 2,
															}}>Back</Text>
														</View>
													</TouchableOpacity>
												</View>
											);
										} else if (item.type == 'folder') {
											var marginBottom = 0;
											if (item.lastItem) {
												log('LAST ITEM, name: ' + item.name + ', path: ' + item.path);
												marginBottom = 0;
											}
											return (
												<View style={{width: '100%', marginBottom: marginBottom}}>
													<TouchableOpacity style={{
														width: '100%',
														flexDirection: 'row',
														alignItems: 'center',
														marginTop: 4,
													}}
																	  onPress={() => {
																		  (async () => {
																			  log('SELECTED PATH: ' + item.path);
																			  await this.setState({
																				  currentPath: item.path,
																			  });
																			  this.browseFolders();
																		  })();
																	  }}>
														<Image source={require('../assets/images/folder.png')}
															   style={{width: 30, height: 25, marginLeft: 8}}/>
														<View style={{marginLeft: 8, marginRight: 8}}>
															<Text style={{
																color: '#000000',
																fontSize: 15,
															}}>{item.name}</Text>
															<Text style={{
																color: '#888888',
																fontSize: 15,
																marginTop: 2,
															}}>{item.count} folders</Text>
														</View>
													</TouchableOpacity>
												</View>
											);
										}
									}}
									keyExtractor={(item, index) => index.toString()}
								/>
								<View style={{
									position: 'absolute',
									left: 0,
									bottom: 0,
									width: '100%',
									height: 40,
									backgroundColor: '#FFFFFF',
									borderBottomRightRadius: 8,
									borderBottomLeftRadius: 8,
								}}>
									<View style={{flexDirection: 'row', position: 'absolute', bottom: 0, right: 0}}>
										<View style={{flexDirection: 'row'}}>
											<TouchableOpacity style={{
												height: 40,
												paddingLeft: 16,
												paddingRight: 16,
												alignItems: 'center',
												justifyContent: 'center',
											}}
															  onPress={() => this.closeFolderPickerDialog()}>
												<Text style={{
													color: bgColor,
													fontSize: 16,
													fontWeight: 'bold',
												}}>Cancel</Text>
											</TouchableOpacity>
										</View>
										<View style={{flexDirection: 'row'}}>
											<TouchableOpacity style={{
												height: 40,
												paddingLeft: 16,
												paddingRight: 16,
												alignItems: 'center',
												justifyContent: 'center',
											}}
															  onPress={() => this.selectFolder()}>
												<Text style={{
													color: bgColor,
													fontSize: 16,
													fontWeight: 'bold',
												}}>Save</Text>
											</TouchableOpacity>
										</    View>
									</View>
								</View>
							</View>
						</View>
					</Modal>
					<View style={{flex: 1}}>
						{this.state.noSessionContainerVisible &&
						<View style={{
							flex: 1,
							width: '100%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Text style={{color: '#FFFFFF', fontSize: 15}}>No Session</Text>
						</View>
						}
						{!this.state.noSessionContainerVisible &&
						<FlatList
							data={this.state.sessions}
							renderItem={({item}) => {
								if (item.type == 'header') {
									return (
										<View>
											<Text style={{
												color: '#FFFFFF',
												fontSize: 16,
												fontWeight: 'bold',
												marginLeft: 12,
												marginTop: 8,
											}}>{moment(item.date, 'YYYY-MM-DD').format('D MMMM YYYY')}</Text>
											<View style={{
												flex: 1,
												height: 1,
												backgroundColor: '#FFFFFF44',
												marginTop: 4,
												marginLeft: 12,
												marginRight: 12,
											}}/>
										</View>
									);
								} else if (item.type == 'session') {
									//log("CURRENT ITEM: ");
									//log(item);
									return (
										<View>
											<Text style={{
												color: '#FFFFFF',
												fontSize: 15,
												marginLeft: 12,
											}}>#{item.name}</Text>
											<Text style={{
												color: '#FFFFFF',
												fontSize: 15,
												position: 'absolute',
												top: 0,
												right: 12,
											}}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY HH:mm:ss')}</Text>
											<View style={{
												flex: 1,
												backgroundColor: '#FFFFFF',
												borderRadius: 5,
												marginTop: 8,
												marginLeft: 12,
												marginRight: 12,
												height: 190,
												position: 'relative',
											}}>
												<View style={{
													flexDirection: 'row',
													position: 'absolute',
													top: 12,
													right: 12,
												}}>
													<TouchableOpacity style={{
														width: 25,
														height: 25,
														alignItems: 'center',
														justifyContent: 'center',
													}}
																	  onPress={() => this.download(item.uuid)}>
														<Image source={require('../assets/images/download.png')}
															   style={{width: 14, height: 14}}/>
													</TouchableOpacity>
													<TouchableOpacity style={{
														width: 25,
														height: 25,
														alignItems: 'center',
														justifyContent: 'center',
														marginLeft: 12,
													}}
																	  onPress={() => {
																		  this.selectSession(item.uuid, item.patient_uuid, item.name);
																	  }}>
														<Image source={require('../assets/images/play.png')}
															   style={{width: 14, height: 14}}/>
													</TouchableOpacity>
													<TouchableOpacity style={{
														width: 25,
														height: 25,
														alignItems: 'center',
														justifyContent: 'center',
														marginLeft: 12,
													}}
																	  onPress={() => {
																		  this.editSession(item.uuid);
																	  }}>
														<Image source={require('../assets/images/edit_2.png')}
															   style={{width: 14, height: 14}}/>
													</TouchableOpacity>
													<TouchableOpacity style={{
														width: 25,
														height: 25,
														alignItems: 'center',
														justifyContent: 'center',
														marginLeft: 12,
													}}
																	  onPress={() => this.deleteSession(item.uuid)}>
														<Image source={require('../assets/images/delete_2.png')}
															   style={{width: 14, height: 14}}/>
													</TouchableOpacity>
												</View>
												{item.images.length == 0 &&
												<View style={{
													width: '100%',
													height: '100%',
													alignItems: 'center',
													justifyContent: 'center',
												}}>
													<Text style={{color: '#000000', fontSize: 16}}>No Images</Text>
												</View>
												}
												{item.images.length > 0 &&
												<View style={{marginTop: 52}}>
													<FlatList
														data={item.images}
														horizontal={true}
														showsHorizontalScrollIndicator={false}
														renderItem={({item}) => {
															return (
																<View style={{marginLeft: 4, marginRight: 4}}>
																	<ImageLoad source={{
																		uri: 'file:///storage/emulated/0/Android/data/com.skinmed.skinanalyzer/images/'
																			+ item.path,
																	}}
																			   style={{
																				   width: 120,
																				   height: 120,
																				   borderRadius: 8,
																			   }}
																			   loadingStyle={{
																				   size: 'large',
																				   color: 'blue',
																			   }}/>
																</View>
															);
														}}
														keyExtractor={(item, index) => index.toString()}
														style={{paddingLeft: 8, paddingRight: 100}}
													/>
												</View>
												}
											</View>
										</View>
									);
								}
							}}
							keyExtractor={(item, index) => index.toString()}
							style={{paddingBottom: 24}}
						/>
						}
						{this.state.progressVisible &&
						<View style={{
							flex: 1,
							backgroundColor: bgColor,
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<Progress.Circle size={70} indeterminate={true} color='#FFFFFF' borderWidth={5}
											 thickness={1} direction='counter-clockwise'
											 strokeCap='round'/>
						</View>
						}
					</View>
					<FloatingAction actions={addActions} floatingIcon={require('../assets/images/add.png')}
									iconWidth={23} iconHeight={23} color={'#FFFFFF'}
									distanceToEdge={16} onPressItem={name => this.addAction(name)}/>
				</View>
				<View style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					width: '100%',
					backgroundColor: '#FFFFFF',
					flexDirection: 'row',
					height: 43,
				}}>
					<TouchableOpacity style={{width: '33%', alignItems: 'center', justifyContent: 'center'}}
									  onPress={() => this.props.navigation.navigate('Signup')}>
						<Image source={require('../assets/images/login.png')} style={{width: 23, height: 23}}/>
					</TouchableOpacity>
					<TouchableOpacity style={{width: '33%', alignItems: 'center', justifyContent: 'center'}}
									  onPress={() => this.props.navigation.navigate('Home')}>
						<Image source={require('../assets/images/home.png')} style={{width: 23, height: 23}}/>
					</TouchableOpacity>
					<TouchableOpacity style={{width: '33%', alignItems: 'center', justifyContent: 'center'}}
									  onPress={() => logout()}>
						<Image source={require('../assets/images/user_6.png')} style={{width: 23, height: 23}}/>
					</TouchableOpacity>
				</View>
				<ProgressDialog label='Loading...' visible={this.state.loadingProgressVisible}/>
			</View>
		);
	}
}
