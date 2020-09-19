import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import global from '../global.js';
import moment from 'moment';
import ProgressDialog from 'react-native-progress-dialog';

export default class EditSession extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentPatientName: '<no patient selected>',
			patientSelected: false,
			selectedPatientUUID: "",
			sessionName: '',
			sessionDate: '',
			progressVisible: false,
			editedSessionUUID: this.props.route.params.uuid
		};
		logout = logout.bind(this);
		this.getSessionData();
	}

	getSessionData() {
		log("EDITING SESSION DATA");
		this.setState({progressVisible: true});
		log("USER ID: "+userID);
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM sessions WHERE uuid='"+this.state.editedSessionUUID+"'", [], (trx, sessions) => {
					if (sessions.rows.length > 0) {
						let session = sessions.rows.item(0);
						this.setState({
							sessionName: session['name'],
							sessionDate: session['date'],
							selectedPatientUUID: session['patient_uuid']
						});
						db.transaction((trx) => {
							trx.executeSql("SELECT * FROM patients WHERE uuid='"+this.state.selectedPatientUUID+"'", [], (trx, patients) => {
								if (patients.rows.length > 0) {
									let patient = patients.rows.item(0);
									this.setState({
										currentPatientName: patient['name'],
										progressVisible: false
									});
								}
							});
						});
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", this.state.editedSessionUUID);
			fetch(API_URL+"/user/get_session_by_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then(response => response.text())
			.then(response => {
				let session = JSON.parse(response);
				this.setState({
					sessionName: session['name'],
					sessionDate: session['date'],
					selectedPatientUUID: session['patient_uuid']
				});
				let fd = new FormData();
				fd.append("uuid", session['patient_uuid']);
				fetch(API_URL+"/user/get_patient_by_uuid", {
					method: 'POST',
					body: fd,
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then(response => response.text())
				.then(response => {
					let patient = JSON.parse(response);
					this.setState({
						currentPatientName: patient['name'],
						progressVisible: false
					});
				});
			});
		}
	}

	selectPatient() {
		this.props.navigation.navigate('SelectPatient', {onSelected: (patientUUID, patientName) => {
			log("SELECTED PATIENT UUID: "+patientUUID);
			this.setState({selectedPatientUUID: patientUUID, currentPatientName: patientName});
		}});
	}

	saveSession() {
		let patientUUID = this.state.selectedPatientUUID;
		let sessionName = this.state.sessionName;
		log("EDITED SESSION NAME: "+sessionName);
		if (patientUUID == "") {
			alert("Please select patient");
			return;
		}
		if (sessionName == "") {
			alert("Please enter session name");
			return;
		}
		log("SAVING SESSION");
		this.setState({progressVisible: true});
		log("USER ID: "+userID);
			db.transaction((trx) => {
				//687e5840-08b7-4239-9f97-49081f025e3b
				let sql = "UPDATE sessions SET name='"+sessionName+"', patient_uuid='"+this.state.selectedPatientUUID+"' WHERE uuid='"+this.state.editedSessionUUID+"'";
				log("SQL STATEMENT: "+sql);
				trx.executeSql(sql, [], (trx, results) => {
					log("UPDATE SESSION SUCCEED");
					log("UPDATE SESSION RESULT: "+results);
					this.setState({progressVisible: false});
					this.props.route.params.onSaved();
					this.props.navigation.goBack();
				});
			}, function(error) {
				log(error);
			});
		if (userID != 0) {
			let fd = new FormData();
			fd.append("user_id", userID);
			fd.append("uuid", this.state.editedSessionUUID);
			fd.append("name", sessionName);
			fd.append("date", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
			fd.append("device_uuid", "");
			fd.append("patient_uuid", patientUUID);
			fetch(API_URL+"/user/update_session", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("UPDATE SESSION RESULT:");
				log(response);
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
					value={this.state.sessionName}
					onChangeText={text => this.setState({sessionName: text})} />
				<TouchableOpacity style={{ backgroundColor: '#FFFFFF', height: 45, alignItems: 'center', justifyContent: 'center',
					marginLeft: 12, marginRight: 12, marginTop: 8 }}
					onPress={() => {
						this.saveSession();
					}}>
					<Text style={{ color: blue, fontSize: 15, fontWeight: 'bold' }}>Save</Text>
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
