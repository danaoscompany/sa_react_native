import React, { Component } from 'react';
import { View, Text, Image, Platform, Alert } from 'react-native';
import Share from 'react-native-share';
import ProgressDialog from 'react-native-progress-dialog';
import global from '../global.js';

export default class ViewPreviewImage extends Component {
	
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
		log("SESSION UUID: "+this.state.session_uuid);
		log("DEVICE UUID: "+this.state.device_uuid);
		log("IMAGE UUID: "+this.state.imageUUID);
		this.getImageInfo();
	}
	
	getImageInfo() {
		this.setState({
			progressVisible: false
		});
		db.transaction((trx) => {
			trx.executeSql("SELECT * FROM sessions WHERE uuid='"+this.state.session_uuid+"'", [], (trx, sessions) => {
				log("IMAGE SESSION:");
				log(sessions);
				log(sessions.rows.item(0));
				let patientUUID = "";
				if (sessions.rows.length > 0) {
					let session = sessions.rows.item(0);
					patientUUID = session['patient_uuid'];
					log("PATIENT UUID: "+patientUUID);
				}
				let sql = "SELECT * FROM preview_images WHERE uuid='"+this.state.imageUUID+"'";
				log("GET IMAGE SQL: "+sql);
				trx.executeSql(sql, [], (trx, images) => {
					log(images.rows.item(0));
					if (images.rows.length > 0) {
						let image = images.rows.item(0);
						let deviceUUID = image['device_uuid'];
						log("DEVICE UUID: "+deviceUUID);
						this.setState({
							patientUUID: patientUUID
						});
						if (patientUUID != null && patientUUID.trim() != "") {
							trx.executeSql("SELECT * FROM patients", [], (trx, patients) => {
								log("PATIENT:");
								log(patients.rows.item(0));
								if (patients.rows.length > 0) {
									let patient = patients.rows.item(0);
									this.setState({
										patientName: patient['name']
									});
								}
							});
						}
						let sql = "SELECT * FROM devices WHERE uuid='"+deviceUUID+"'";
						log("GET DEVICE INFO SQL STATEMENT: "+sql);
						trx.executeSql(sql, [], (trx, devices) => {
							log("DEVICE INFO");
							log(devices.rows.item(0));
							if (devices.rows.length > 0) {
								let device = devices.rows.item(0);
								this.setState({
									deviceName: device['device'],
									progressVisible: false
								});
							}
						});
					}	
				});
			});
		});
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
					db.transaction((trx) => {
						trx.executeSql("DELETE FROM preview_images WHERE uuid='"+this.state.imageUUID+"'", [], (trx, results) => {
							this.setState({progressVisible: false});
							previewImagesRefresh();
							this.props.navigation.navigate('PreviewImages');
						});
					});
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
				<Image source={{ uri: 'file://'+this.state.imageURL }} style={{ width: '100%', height: '100%' }} />
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
