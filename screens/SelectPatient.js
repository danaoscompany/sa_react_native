import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import global from '../global.js';
import * as Progress from 'react-native-progress';
import { FloatingAction } from "react-native-floating-action";

const addActions = [
  {
    text: "Add",
    icon: require("../assets/images/add.png"),
    name: "add",
    position: 0
  }
];

export default class SelectPatient extends Component {

	constructor(props) {
		super(props);
		this.state = {
			patientData: [],
			lastArrayChar: '',
			patientMenuDialogWidth: Dimensions.get('window').width-32-32,
			patientMenuVisible: false,
			progressVisible: true,
			noPatientContainerVisible: true,
			selectedPatientUUID: ''
		};
		logout = logout.bind(this);
	}

	/*
	[{title: 'A', type: 'header'},
						{name: 'Aziyah', birthday: '1995-08-09', type: 'patient'},
						{name: 'Aziz', birthday: '1995-08-09', type: 'patient'},
						{title: 'B', type: 'header'},
						{name: 'Bunga', birthday: '1995-08-09', type: 'patient'},
						{title: 'C', type: 'header'},
						{name: 'Cika', birthday: '1995-08-09', type: 'patient'},
						{name: 'Celyn', birthday: '1995-08-09', type: 'patient'},
						{name: 'Celeria', birthday: '1995-08-09', type: 'patient'},
						{name: 'Chaka', birthday: '1995-08-09', type: 'patient'},
						{name: 'Chalya', birthday: '1995-08-09', type: 'patient'},
						{name: 'Caracia', birthday: '1995-08-09', type: 'patient'},
						{name: 'Carlissa', birthday: '1995-08-09', type: 'patient'}]
	*/

	componentDidMount() {
		this.getPatients();
	}

	getPatients() {
		this.setState({
			patientData: [],
			progressVisible: true
		});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM patients ORDER BY LOWER(name) ASC;", [], (trx, patients) => {
					for (let i=0; i<patients.rows.length; i++) {
						let patient = patients.rows.item(i);
						var name = patient['name'];
						if (name.charAt(0) != this.state.lastArrayChar) {
							this.setState({lastArrayChar: name.charAt(0)});
							this.state.patientData.push({id: parseInt(patient['id']), uuid: patient['uuid'], title: (""+this.state.lastArrayChar).toUpperCase(),
								type: 'header'});
						}
						this.state.patientData.push({uuid: patient['uuid'], name: name, birthday: patient['birthday'], type: 'patient'});
					}
					if (this.state.patientData.length == 0) {
						this.setState({
							noPatientContainerVisible: true
						});
					} else {
						this.setState({
							noPatientContainerVisible: false
						});
					}
					this.setState({
						progressVisible: false
					});
				});
			});
		} else {
			log("GETTING PATIENTS");
			var fd = new FormData();
			fd.append("user_id", userID);
			fetch(API_URL+'/user/get_patients_by_user_id', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				var patients = JSON.parse(response);
				log(patients);
				patients.sort(function(patient1,patient2) {
					return patient1['name']>patient2['name'];
				});
				for (var i=0; i<patients.length; i++) {
					var patient = patients[i];
					log("=============== PATIENT DATA ===============");
					log(patient);
					var name = patient['name'];
					if (name.charAt(0) != this.state.lastArrayChar) {
						this.setState({lastArrayChar: name.charAt(0)});
						this.state.patientData.push({id: parseInt(patient['id']), uuid: patient['uuid'], title: (""+this.state.lastArrayChar).toUpperCase(),
							type: 'header'});
					}
					this.state.patientData.push({uuid: patient['uuid'], name: name, birthday: patient['birthday'], type: 'patient'});
				}
				if (this.state.patientData.length == 0) {
					this.setState({
						noPatientContainerVisible: true
					});
				} else {
					this.setState({
						noPatientContainerVisible: false
					});
				}
				this.setState({
					progressVisible: false
				});
			});
		}
	}

	addAction(name) {
  		if (name == "add") {
  			this.addPatient();
  		}
    }

    addPatient() {
    	this.props.navigation.navigate('AddPatient', {
    		onAdded: () => {
    			this.getPatients();
    		}
    	});
    }
    
    editPatient() {
    	log("EDITED PATIENT UUID:");
    	log(this.state.selectedPatientUUID);
    	this.props.navigation.navigate('EditPatient', {
    		'uuid': this.state.selectedPatientUUID,
    		onEdited: () => {
    			this.getPatients();
    		}
    	});
    }
    
    deletePatient() {
    	Alert.alert("Confirmation", "Are you sure you want to delete this patient",
    	[
    		{
    			text: "Yes",
    			onPress: () => {
    				this.setState({progressVisible: true});
    				db.transaction((trx) => {
    					trx.executeSql("DELETE FROM patients WHERE uuid='"+this.state.selectedPatientUUID+"'", [], (trx, results) => {
    					});
    				});
    				if (userID != 0) {
    					let fd = new FormData();
    					fd.append("uuid", this.state.selectedPatientUUID);
    					fetch(API_URL+"/user/delete_patient_by_uuid", {
    						method: 'POST',
    						body: fd,
    						headers: {
    							'Content-Type': 'multipart/form-data'
    						}
    					})
    					.then(response => response.text())
    					.then(response => {
    						this.setState({progressVisible: false});
    						this.getPatients();
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

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<View style={{ flex: 1, marginBottom: 43 }}>
				<Image source={require('../assets/images/menu.png')} style={{ width: 30, height: 30, marginLeft: 12, marginTop: 12 }} />
				<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
					<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 12 }}>Choose Patient</Text>
				</View>
				<View style={{ flex: 1 }}>
				<FlatList
					contentContainerStyle={{ paddingBottom: 16 }}
					data={this.state.patientData}
					renderItem={({item}) => {
						if (item.type == 'patient') {
							return (
								<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, marginLeft: 12, marginRight: 12 }}
									onPress={() => {
										log("SELECTED PATIENT UUID: "+item.uuid);
										this.props.route.params.onSelected(item.uuid, item.name);
										this.props.navigation.goBack();
									}}
									onLongPress={() => {
										this.setState({
											selectedPatientUUID: item.uuid,
											patientMenuVisible: true
										});
									}}>
									<View style={{ width: 55, height: 55, alignItems: 'center', justifyContent: 'center', borderRadius: 5,
										backgroundColor: '#FFFFFF' }}>
										<Image source={require('../assets/images/user_4.png')} style={{ width: 50, height: 50 }} />
									</View>
									<View style={{ flexDirection: 'row', flex: 1 }}>
										<View style={{ width: '50%' }}>
											<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 16 }}>{item.name}</Text>
											<Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 16 }}>Date of Birth</Text>
										</View>
										<View style={{ width: 1, height: '100%', backgroundColor: '#64A6FC' }}>
										</View>
										<View style={{ width: '50%' }}>
											<Text style={{ color: '#FFFFFF', opacity: 0, fontSize: 16, fontWeight: 'bold', marginLeft: 16 }}>{item.name}</Text>
											<Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 16 }}>{item.birthday}</Text>
										</View>
									</View>
									<View style={{ position: 'absolute', top: 0, right: 0, height: '100%', justifyContent: 'center' }}>
										<Image source={require('../assets/images/right.png')} style={{ width: 17, height: 17 }} />
									</View>
								</TouchableOpacity>
							);
						} else if (item.type == 'header') {
							return (
								<View style={{ marginTop: 12, justifyContent: 'center', backgroundColor: lightBlue, height: 30 }}>
									<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginLeft: 12 }}>{item.title}</Text>
								</View>
							);
						}
					}}
					keyExtractor={(item, index) => index.toString()}
					/>
				</View>
				{ this.state.noPatientContainerVisible &&
      				<View style={{ position: 'absolute', left: 0, top: 0, flex: 1, width: '100%', height: '100%', alignItems: 'center',
      					justifyContent: 'center' }}>
      					<Text style={{ color: '#FFFFFF', fontSize: 15 }}>No Patient</Text>
      				</View>
      			}
				<FloatingAction actions={addActions} floatingIcon={require('../assets/images/add.png')} iconWidth={23} iconHeight={23} color='#FFFFFF'
		      		distanceToEdge={16} onPressItem={name => this.addAction(name) } />
		      	</View>
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
				<Modal animationType="fade" transparent={true} visible={this.state.patientMenuVisible} style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: '100%',
						height: '100%',
						flex: 1,
						backgroundColor: '#00000000',
						alignItems: 'center',
						justifyContent: 'center',
						margin: 0
					}}>
					<View style={{flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
						<View style={{
							width: this.state.patientMenuDialogWidth,
							margin: 32,
							backgroundColor: '#FFFFFF',
							borderRadius: 8,
							shadowColor: '#000000',
							shadowOffset: {width: 0, height: 3},
							shadowOpacity: 0.27,
							shadowRadius: 4.65,
							elevation: 6
						}}>
						<Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 18, marginLeft: 16, marginTop: 12 }}>Patient</Text>
						<TouchableOpacity style={{ width: '100%', height: 40, justifyContent: 'center', marginTop: 4 }}
							onPress={() => {
								this.setState({patientMenuVisible: false});
								this.editPatient();
							}}>
							<Text style={{ color: '#000000', fontSize: 15, marginLeft: 24 }}>Edit</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ width: '100%', height: 40, justifyContent: 'center' }}
							onPress={() => {
								this.setState({patientMenuVisible: false});
								this.deletePatient();
							}}>
							<Text style={{ color: '#000000', fontSize: 15, marginLeft: 24 }}>Delete</Text>
						</TouchableOpacity>
						</View>
					</View>
				</Modal>
				{ this.state.progressVisible &&
		      		<View style={{ flex: 1, backgroundColor: bgColor, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
			      		alignItems: 'center', justifyContent: 'center' }}>
			      		<Progress.Circle size={70} indeterminate={true} color='#FFFFFF' borderWidth={5} thickness={1} direction='counter-clockwise'
			      			strokeCap='round' />
			      	</View>
		      	}
			</View>
		);
	}
}
