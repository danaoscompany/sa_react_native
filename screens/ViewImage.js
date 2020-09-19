import React, { Component } from 'react';
import { View, Text, Image, Platform, Alert } from 'react-native';
import Share from 'react-native-share';
import ProgressDialog from 'react-native-progress-dialog';
import global from '../global.js';

export default class ViewImage extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			imageURL: this.props.route.params.img_url,
			imageUUID: this.props.route.params.img_uuid,
			name: this.props.route.params.name,
			session_uuid: this.props.route.params.session_uuid,
			session_date: this.props.route.params.session_date,
			device_uuid: this.props.route.params.device_uuid,
			patientUUID: '',
			patientName: '',
			deviceName: '',
			progressVisible: true
		};
		mark = this.mark.bind(this);
		share = this.share.bind(this);
		deleteImage = this.deleteImage.bind(this);
	}

	componentDidMount() {
		log("DEVICE UUID: "+this.state.device_uuid);
		log("IMAGE UUID: "+this.state.imageUUID);
		this.getImageInfo();
	}
	
	getImageInfo() {
		this.setState({
			progressVisible: true
		});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM sessions WHERE uuid='"+this.state.session_uuid+"'", [], (trx, sessions) => {
					if (sessions.rows.length > 0) {
						let session = sessions.rows.item(0);
						let patientUUID = session['patient_uuid'];
						this.setState({
							patientUUID: patientUUID
						});
						trx.executeSql("SELECT * FROM patients WHERE uuid='"+patientUUID+"'", [], (trx, patients) => {
							if (patients.length > 0) {
								let patient = patients[0];
								this.setState({
									patientName: patient['name'],
									progressVisible: false
								});
							}
						});
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", this.state.imageUUID);
			fetch(API_URL+"/user/get_session_image_by_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("SESSION IMAGE");
				log(response);
				let sessionImage = JSON.parse(response);
				let deviceUUID = sessionImage['device_uuid'];
				log("DEVICE UUID: "+deviceUUID);
				let fd = new FormData();
				fd.append("uuid", this.state.session_uuid);
				fetch(API_URL+"/user/get_session_by_uuid", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(response => response.text())
				.then(response => {
					log("SESSION: "+response);
					let session = JSON.parse(response);
					let patientUUID = session['patient_uuid'];
					this.setState({
						patientUUID: patientUUID
					});
					let fd = new FormData();
					fd.append("uuid", patientUUID);
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
							patientName: patient['name']
						});
						log("GETTING DEVICE WITH UUID: "+deviceUUID);
						let fd = new FormData();
						fd.append("uuid", deviceUUID);
						fetch(API_URL+"/user/get_device_by_uuid", {
							method: 'POST',
							body: fd,
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						})
						.then(response => response.text())
						.then(response => {
							log("DEVICE: "+response);
							let device = JSON.parse(response);
							this.setState({
								deviceName: device['device'],
								progressVisible: false
							});
						});
					});
				});
			});
		}
	}

	mark() {
		this.props.navigation.navigate('Mark', {
			session_uuid: this.state.session_uuid,
			session_date: this.state.session_date,
			device_uuid: this.state.device_uuid,
			img_url: this.state.imageURL,
			img_uuid: this.state.imageUUID,
			name: this.state.name
		});
	}
	
	deleteImage() {
		Alert.alert("Confirmation", "Are you sure you want to delete this image?", [
			{
				text: "Yes",
				onPress: () => {
					this.setState({progressVisible: true});
					if (userID == 0) {
						db.transaction((trx) => {
							trx.executeSql("DELETE FROM session_images WHERE uuid='"+imageUUID+"'", [], (trx, results) => {
								this.setState({progressVisible: false});
								imageListRefresh();
								this.props.navigation.navigate('ImageList');
							});
						});
					} else {
						let fd = new FormData();
						fd.append("uuid", this.state.imageUUID);
						fetch(API_URL+"/user/delete_image_by_uuid", {
							method: 'POST',
							body: fd,
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						})
						.then(response => response.text())
						.then(response => {
							log("REFRESHING IMAGES...");
							this.setState({progressVisible: false});
							imageListRefresh();
							this.props.navigation.navigate('ImageList');
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
	
	async share() {
		const ShareResponse = await Share.open({ title: 'Share Image', message: 'Please check out the image I have uploaded:\n\n'+this.state.imageURL, excludedActivityTypes: [], failOnCancel: false });
		log("SHARE RESPONSE: "+JSON.stringify(ShareResponse));
	}

	render() {
		return (
			<View style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}>
				<Image source={{ uri: this.state.imageURL }} style={{ width: '100%', height: '100%' }} />
				<View style={{ position: 'absolute', left: 0, bottom: 0 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Name:</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 4 }}>{this.state.name}</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Client name:</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 4 }}>{this.state.patientName}</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Device:</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 4 }}>{this.state.deviceName}</Text>
					</View>
				</View>
				<ProgressDialog label='Loading...' visible={this.state.progressVisible}/>
			</View>
		);
	}
}
