import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import moment from 'moment';
import global from '../global.js';

export default class PreviewImages extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			sessionWidth: Dimensions.get('window').width-16-16,
			imageContainerWidth: Dimensions.get('window').width-12-12,
			imageWidth: (Dimensions.get('window').width-12-12)/3-4-4,
			PreviewImagesHeight: Dimensions.get('window').height-220,
			images: [],
			sessionUUID: currentSessionUUID,
			sessionName: currentSessionName,
			patientUUID: '',
			patientName: '',
			sessionDate: '',
			progressVisible: false
		};
	}
	
	componentDidMount() {
		previewImagesRefresh = this.previewImagesRefresh.bind(this);
		this.init();
	}
	
	componentWillReceiveProps() {
		this.init();
	}
	
	init() {
		this.getImages();
	}
	
	previewImagesRefresh() {
		log("REFRESHING PREVIEW IMAGES...");
		this.getImages();
	}
	
	getImages() {
		log("GETTING IMAGES...");
		this.setState({
			images: []
		});
		let images = this.state.images;
		images.push({'type': 'add'});
		db.transaction((trx) => {
			trx.executeSql("SELECT * FROM preview_images", [], (trx, imageObjs) => {
				log("ALL PREVIEW IMAGES:");
				for (let i=0; i<imageObjs.rows.length; i++) {
					let image = imageObjs.rows.item(i);
					image['type'] = 'image';
					image['index'] = i+1;
					images.push(image);
				}
				this.setState({
					images: images
				});
				log(images);
				this.correctImageCount();
			});
		});
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
					db.transaction((trx) => {
						trx.executeSql("UPDATE sessions SET patient_uuid='"+uuid+"'", [], (trx, results) => {
							this.setState({progressVisible: false});
						});
					});
				if (userID != 0) {
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
				<View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 40 }}>
					<FlatList
						data={this.state.images}
						renderItem={({item}) => {
							log("ITEM TYPE: "+item.type);
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
											log(item);
											this.props.navigation.navigate('ViewPreviewImage', {
												img_url:item.path,
												name: item.name,
												session_uuid: item.session_uuid,
												device_uuid: item.device_uuid,
												img_uuid: item.uuid
											});
										}}>
										<Image source={{uri: 'file://'+item.path}} style={{ width: this.state.imageWidth, flex: 1,
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
						style={{ width: this.state.imageContainerWidth, height: this.state.PreviewImagesHeight }} />
				</View>
				<ProgressDialog label='Loading...' visible={this.state.progressVisible}/>
			</View>
		);
	}
}
