import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import moment from 'moment';
import global from '../global.js';

export default class ImageList extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			sessionWidth: Dimensions.get('window').width-16-16,
			imageContainerWidth: Dimensions.get('window').width-12-12,
			imageWidth: (Dimensions.get('window').width-12-12)/3-4-4,
			imageListHeight: Dimensions.get('window').height-220,
			images: [],
			sessionUUID: currentSessionUUID,
			sessionName: currentSessionName,
			patientUUID: '',
			patientName: '',
			sessionDate: '',
			progressVisible: false
		};
		imageListRefresh = this.refreshImages.bind(this);
	}
	
	componentDidMount() {
		log("ImageList screen");
		this.init();
	}
	
	componentWillReceiveProps() {
		this.init();
	}
	
	init() {
		this.getSessionInfo();
	}
	
	refreshImages() {
		log("REFRESHING IMAGES (2)...");
		this.getSessionInfo();
	}
	
	getSessionInfo() {
		log("GETTING SESSION INFO");
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				let sql = "SELECT * FROM sessions WHERE uuid='"+currentSessionUUID+"'";
				log("GET ALL SESSIONS SQL STATEMENT: "+sql);
				trx.executeSql(sql, [], (trx, sessions) => {
					log("SESSION INFO: "+sessions.rows.item(0));
					if (sessions.rows.length > 0) {
						let session = sessions.rows.item(0);
						log(session);
						this.setState({
							sessionName: session['name'],
							sessionDate: session['date'],
							patientUUID: session['patient_uuid']
						});
						trx.executeSql("SELECT * FROM patients WHERE uuid='"+this.state.patientUUID+"'", [], (trx, patients) => {
							if (patients.rows.length > 0) {
								let patient = patients.rows.item(0);
								this.setState({
									patientName: patient['name']
								});
							}
							this.setState({progressVisible: false});
							this.getImages();
						});
					}
				});
			});
		} else {
			log("USER ID IS NOT 0");
			log("CURRENT SESSION UUID: "+currentSessionUUID);
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
				log(response);
				let sessionJSON = JSON.parse(response);
				this.setState({
					sessionName: sessionJSON['name'],
					sessionDate: sessionJSON['date'],
					patientUUID: sessionJSON['patient_uuid']
				});
				let fd = new FormData();
				fd.append("uuid", this.state.patientUUID);
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
					this.setState({
						patientName: patient['name'],
						progressVisible: false
					});
					this.getImages();
				});
			});
		}
	}
	
	getImages() {
		log("GETTING IMAGES...");
		this.setState({
			images: []
		});
		let images = this.state.images;
		images.push({'type': 'add'});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM session_images", [], (trx, imageObjs) => {
					for (let i=0; i<imageObjs.rows.length; i++) {
						let image = imageObjs.rows.item(i);
						image['type'] = 'image';
						image['index'] = i+1;
						images.push(image);
					}
					log("ALL SESSION IMAGES:");
					log(images);
					this.setState({
						images: images,
						progressVisible: false
					});
					this.correctImageCount();
				});
			});
		} else {
			let fd = new FormData();
			fd.append("session_uuid", this.state.sessionUUID);
			fetch(API_URL+"/user/get_session_images_by_session_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("ALL SESSION IMAGES: ");
				log(response);
				let imagesJSON = JSON.parse(response);
				for (let i=0; i<imagesJSON.length; i++) {
					let imageJSON = imagesJSON[i];
					imageJSON['type'] = 'image';
					imageJSON['index'] = i+1;
					images.push(imageJSON);
				}
				this.setState({
					images: images
				});
				this.correctImageCount();
			});
		}
	}
	
	correctImageCount() {
		let images = this.state.images;
		if ((images.length%3) !=0) {
			for (let i=0; i<(images.length%3); i++) {
				images.push({'type': 'empty'});
			}
		}
		this.setState({images: images});
	}
	
	selectPatient() {
		this.props.navigation.navigate('SelectPatient', {
			onSelected: (uuid, name) => {
				this.setState({
					patientName: name,
					progressVisible: true
				});
				if (userID == 0) {
					db.transaction((trx) => {
						trx.executeSql("UPDATE sessions SET patient_uuid='"+uuid+"'", [], (trx, results) => {
							this.setState({progressVisible: false});
						});
					});
				} else {
					let fd = new FormData();
					fd.append("uuid", this.state.sessionUUID);
					fd.append("patient_uuid", uuid);
					fetch(API_URL+"/user/update_patient", {
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
		});
	}
	
	render() {
		return (
			<View style={{ backgroundColor: bgColor, flex: 1 }}>
				<Image source={require('../assets/images/menu.png')} style={{ position: 'absolute', left: 16, top: 16, width: 30, height: 30 }} />
				<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Image List</Text>
				</View>
				<TouchableOpacity style={{ width: this.state.sessionWidth, marginTop: 32, marginLeft: 16, marginRight: 16, borderRadius: 5,
					shadowOffset: {
						width: 0, height: 2
					}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: '#FFFFFF', height: 40, flexDirection: 'row',
					justifyContent: 'space-between', position: 'absolute', left: 0, top: 36 }}
					onPress={() => {
						this.selectPatient();
					}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', height: 40, justifyContent: 'center' }}>
						<Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, marginLeft: 12 }}>Patient</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
						<Text style={{ color: '#000000', fontSize: 16 }}>{this.state.patientName}</Text>
						<Image source={require('../assets/images/right_2.png')} style={{ width: 12, height: 12, marginLeft: 2 }} />
					</View>
				</TouchableOpacity>
				<View style={{ flex: 1, marginTop: 12, backgroundColor: lightBlue, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
					alignItems: 'center', position: 'absolute', left: 16, top: 116, width: this.state.sessionWidth, height: 30 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>#{this.state.sessionName}</Text>
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginRight: 8 }}>
						{moment(this.state.sessionDate, 'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY')}
					</Text>
				</View>
				<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 140 }}>
					<FlatList
						data={this.state.images}
						renderItem={({item}) => {
							if (item.type == 'add') {
								return (
									<TouchableOpacity style={{ flex: 1, height: 110, backgroundColor: '#00000055', justifyContent: 'center',
										alignItems: 'center', borderRadius: 8, marginLeft: 4, marginRight: 4, marginTop: 8 }}
										onPress={() => {
											this.props.navigation.navigate('TakePicture');
										}}>
										<Image source={require('../assets/images/add_white.png')} style={{ width: 80, height: 80 }} />
									</TouchableOpacity>
								);
							} else if (item.type == 'image') {
								let index = item.index;
								let storageMethod = item.storage_method;
								return (
									<TouchableOpacity style={{ flex: 1, height: 110, backgroundColor: '#00000066', justifyContent: 'center',
										alignItems: 'center', borderRadius: 8, marginLeft: 4, marginRight: 4, position: 'relative', marginTop: 8 }}
										onPress={() => {
											this.props.navigation.navigate('ViewImage', {
												img_url: API_URL+'/userdata/'+item.path,
												name: item.name,
												session_uuid: item.session_uuid,
												device_uuid: item.device_uuid,
												img_uuid: item.uuid
											});
										}}>
										<Image source={{uri: API_URL+'/userdata/'+item.path}} style={{ width: this.state.imageWidth, flex: 1,
											borderRadius: 8 }} />
										{ storageMethod == 'gd' &&
										<Image source={require('../assets/images/gd.png')} style={{ width: 23, height: 23, position: 'absolute',
											bottom: 8, right: 8 }} />
										}
										{ storageMethod == 'db' &&
										<Image source={require('../assets/images/db.png')} style={{ width: 23, height: 23, position: 'absolute',
											bottom: 8, right: 8 }} />
										}
									</TouchableOpacity>
								);
							} else if (item.type == 'empty') {
								return (
									<View style={{ flex: 1, height: 110, backgroundColor: '#00000000', justifyContent: 'center', alignItems: 'center',
										borderRadius: 8, marginLeft: 4, marginRight: 4, marginTop: 8 }}>
									</View>
								);
							}
						}}
						numColumns={3}
						keyExtractor={(item, index) => index.toString()}
						style={{ width: this.state.imageContainerWidth, height: this.state.imageListHeight }} />
				</View>
				<ProgressDialog label='Loading...' visible={this.state.progressVisible}/>
			</View>
		);
	}
}
