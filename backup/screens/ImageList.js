import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
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
			images: [],
			sessionUUID: currentSessionUUID,
			sessionName: currentSessionName,
			patientName: currentPatientName,
			sessionDate: '',
			progressVisible: false
		};
	}
	
	componentDidMount() {
		this.init();
	}
	
	componentWillReceiveProps() {
		log("componentWillReceiveProps()");
		this.init();
	}
	
	init() {
		this.getSessionInfo();
	}
	
	getSessionInfo() {
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.execeteSql("SELECT * FROM sessions WHERE uuid='"+currentSessionUUID+"'", [], (trx, sessions) => {
					if (sessions.rows.length > 0) {
						let session = sessions.rows.item(0);
						this.setState({
							sessionName: session['name'],
							sessionDate: session['date']
						});
					}
					this.setState({progressVisible: false});
					this.getImages();
				});
			});
		} else {
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
				let sessionJSON = JSON.parse(response);
				this.setState({
					sessionName: sessionJSON['name'],
					sessionDate: sessionJSON['date'],
					progressVisible: false
				});
				this.getImages();
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
	
	render() {
		return (
			<View style={{ backgroundColor: bgColor, flex: 1 }}>
				<Image source={require('../assets/images/menu.png')} style={{ position: 'absolute', left: 16, top: 16, width: 30, height: 30 }} />
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Image List</Text>
				</View>
				<View style={{ width: this.state.sessionWidth, marginTop: 32, marginLeft: 16, marginRight: 16, borderRadius: 5, shadowOffset: {
					width: 0, height: 2
				}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: '#FFFFFF', height: 40, flexDirection: 'row',
					justifyContent: 'space-between', position: 'absolute', left: 0, top: 36 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', height: 40, justifyContent: 'center' }}>
						<Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, marginLeft: 12 }}>Patient</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
						<Text style={{ color: '#000000', fontSize: 16 }}>{this.state.patientName}</Text>
						<Image source={require('../assets/images/right_2.png')} style={{ width: 12, height: 12, marginLeft: 2 }} />
					</View>
				</View>
				<View style={{ flex: 1, marginTop: 12, backgroundColor: lightBlue, borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
					alignItems: 'center', position: 'absolute', left: 16, top: 116, width: this.state.sessionWidth, height: 30 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>#{this.state.sessionName}</Text>
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginRight: 8 }}>
						{moment(this.state.sessionDate, 'YYYY-MM-DD HH:mm:ss').format('D MMMM YYYY')}
					</Text>
				</View>
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
							return (
								<TouchableOpacity style={{ flex: 1, height: 110, backgroundColor: '#00000066', justifyContent: 'center',
									alignItems: 'center', borderRadius: 8, marginLeft: 4, marginRight: 4, position: 'relative', marginTop: 8 }}
									onPress={() => {
										this.props.navigation.navigate('ViewImage', {
											img_url: API_URL+'/userdata/'+item.path,
											name: item.name,
											session_uuid: item.session_uuid,
											device_uuid: item.device_uuid
										});
									}}>
									<Image source={{uri: API_URL+'/userdata/'+item.path}} style={{ width: this.state.imageWidth, flex: 1,
										borderRadius: 8 }} />
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
					style={{ width: this.state.imageContainerWidth, position: 'absolute', left: 16, top: 180 }} />
				<ProgressDialog label='Loading...' visible={this.state.progressVisible}/>
			</View>
		);
	}
}
