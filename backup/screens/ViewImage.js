import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import global from '../global.js';

export default class ViewImage extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			imageURL: this.props.route.params.img_url,
			name: this.props.route.params.name,
			session_uuid: this.props.route.params.session_uuid,
			device_uuid: this.props.route.params.device_uuid,
			patientUUID: '',
			patientName: '',
			deviceName: '',
			progressVisible: true
		};
		mark = this.mark;
	}
	
	componentDidMount() {
		log("DEVICE UUID: "+this.state.device_uuid);
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
					let fd = new FormData();
					fd.append("uuid", this.state.device_uuid);
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
		}
	}

	mark() {
		this.props.navigation.navigate('Mark', {
			session_uuid: this.state.session_uuid
		});
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
