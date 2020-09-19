import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import global from '../global.js';
import moment from 'moment';
import ProgressDialog from 'react-native-progress-dialog';

export default class AddSession extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentPatientName: '<no patient selected>',
			patientSelected: false,
			selectedPatientUUID: "",
			sessionName: '',
			progressVisible: false
		};
		logout = logout.bind(this);
	}

	selectPatient() {
		this.props.navigation.navigate('SelectPatient', {onSelected: (patientUUID, patientName) => {
			log("PATIENT SELECTED: "+patientUUID);
			this.setState({selectedPatientUUID: patientUUID, currentPatientName: patientName});
		}});
	}

	addSession() {
		let uuid = uuidv4();
		let patientUUID = this.state.selectedPatientUUID;
		let sessionName = this.state.sessionName;
		let sessionDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		if (patientUUID == "") {
			alert("Please select patient");
			return;
		}
		if (sessionName == "") {
			alert("Please enter session name");
			return;
		}
		this.setState({progressVisible: true});
		log("SELECTED PATIENT UUID: "+patientUUID);
			db.transaction((trx) => {
				trx.executeSql("INSERT INTO sessions (uuid, name, date, device_uuid, patient_uuid) VALUES ('"+uuid+"', '"+sessionName+"', '"+sessionDate+"', '', '"+this.state.selectedPatientUUID+"')", [], (trx, results) => {
					this.setState({progressVisible: false});
					this.props.route.params.onAdded();
					this.props.navigation.goBack();
				});
			}, function(error) {
			});
		if (userID != 0) {
			let fd = new FormData();
			fd.append("user_id", userID);
			fd.append("uuid", uuid);
			fd.append("name", sessionName);
			fd.append("date", sessionDate);
			fd.append("device_uuid", "");
			fd.append("patient_uuid", patientUUID);
			fetch(API_URL+"/user/add_session", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("ADD SESSION RESPONSE: "+response);
				this.setState({progressVisible: false});
				this.props.route.params.onAdded();
				this.props.navigation.goBack();
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<Image source={require('../assets/images/menu.png')} style={{ width: 30, height: 30, marginLeft: 16, marginRight: 16, marginTop: 16 }} />
				<View style={{ width: '100%', marginTop: 48 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 12, marginTop: 16 }}>{this.state.currentPatientName}</Text>
					<TouchableOpacity style={{ backgroundColor: '#FFFFFF', borderRadius: 3, position: 'absolute', top: 0, right: 12, width: 90,
						height: 45, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.selectPatient() }>
						<Text style={{ color: blue, fontSize: 16 }}>Select</Text>
					</TouchableOpacity>
				</View>
				<Text style={{ color: '#FFFFFF', fontSize: 15, marginTop: 16, marginLeft: 12 }}>Session name:</Text>
				<TextInput style={{ backgroundColor: '#FFFFFF', height: 45, paddingLeft: 10, paddingRight: 10, marginTop: 4, marginLeft: 12,
					marginRight: 12 }}
					placeholder="Enter session name" placeholderTextColor="#888888" color="#000000"
					onChangeText={text => this.setState({sessionName: text})} />
				<TouchableOpacity style={{ backgroundColor: '#FFFFFF', height: 45, alignItems: 'center', justifyContent: 'center',
					marginLeft: 12, marginRight: 12, marginTop: 8 }}
					onPress={() => {
						this.addSession();
					}}>
					<Text style={{ color: blue, fontSize: 15, fontWeight: 'bold' }}>Add</Text>
				</TouchableOpacity>
				<ProgressDialog
					label="Adding session..."
					visible={this.state.progressVisible} />
				<View style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#FFFFFF', flexDirection: 'row', height: 43 }}>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.props.navigation.navigate('Signup')}>
						<Image source={require('../assets/images/login.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => this.props.navigation.navigate('Home')}>
						<Image source={require('../assets/images/home.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
					<TouchableOpacity style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}
						onPress={() => logout()}>
						<Image source={require('../assets/images/user_6.png')} style={{ width: 23, height: 23 }} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
