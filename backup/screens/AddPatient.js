import React, { Component } from 'react';
import { View, Text, Image, TextInput, Dimensions, Alert, TouchableOpacity, ImageBackground, Modal } from 'react-native';
//import { TouchableOpacity} from 'react-native-gesture-handler'
import global from '../global.js';
import ProgressDialog from 'react-native-progress-dialog';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class AddPatient extends Component {

	constructor(props) {
		super(props);
		this.state = {
			textInputWidth: 0,
			buttonWidth: 0,
			/*name: '',
			phone: '',
			address: '',
			city: '',
			province: '',
			birthday: new Date(),
			progressVisible: false,
			birthdayPickerVisible: false*/
			name: 'Patient One',
			phone: '081123456782',
			address: 'Address 2',
			city: 'City 2',
			province: 'Province 2',
			birthday: new Date(),
			progressVisible: false,
			birthdayPickerVisible: false
		};
		logout = logout.bind(this);
	}

	componentDidMount() {
		this.setState({
			textInputWidth: Dimensions.get('screen').width-12-150-12,
			buttonWidth: Dimensions.get('screen').width/2-24
		});
	}

	addPatient() {
		let uuid = uuidv4();
		let name = this.state.name;
		let phone = this.state.phone;
		let address = this.state.address;
		let city = this.state.city;
		let province = this.state.province;
		let birthday = moment(this.state.birthday.getTime()).format('YYYY-MM-DD');
		if (name == '' || phone == '' || address == '' || city == '' || province == '' || birthday == '') {
			alert("Please enter all fields!");
			return;
		}
		log("NAME: "+name+", PHONE: "+phone+", ADDRESS: "+address+", CITY: "+city+", PROVINCE: "+province+", BIRTHDAY: "+birthday);
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("INSERT INTO patients (uuid, name, phone, address, city, province, birthday) VALUES ('"+uuid+"', '"+name+"', '"+phone+"', '"+address+"', '"+city+"', '"+province+"', '"+birthday+"')", [], (trx, results) => {
					this.setState({progressVisible: false});
					this.props.route.params.onAdded();
					this.props.navigation.goBack();
				});
			}, function(error) {
				//log("ERROR EXECUTING SQL: "+error);
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", uuidv4());
			fd.append("user_id", userID);
			fd.append("name", name);
			fd.append("phone", phone);
			fd.append("address", address);
			fd.append("city", city);
			fd.append("province", province);
			fd.append("birthday", birthday);
			fetch(API_URL+"/user/add_patient", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
					})
					.then(response => response.text())
					.then(response => {
						log("ADD PATIENT RESPONSE: "+response);
						this.setState({progressVisible: false});
						this.props.route.params.onAdded();
						this.props.navigation.goBack();
					});
		}
	}

	goBack() {
		if (this.state.name != '' || this.state.phone != '' || this.state.address != '' || this.state.city != '' || this.state.province != '') {
			Alert.alert('Confirmation', 'Are you sure you want to trash your editing?',
				[
					{
					text: 'OK',
						onPress: () => {
							this.props.navigation.goBack();
						}
					},
					{
						text: 'Cancel',
						style: 'cancel'
					}
				]);
		} else {
			this.props.navigation.goBack();
		}
	}

	selectBirthday() {
		if (this.state.birthday == '') {
			this.setState({birthday: new Date()});
		}
		this.setState({
			birthdayPickerVisible: true
		});
	}

	profile() {
		if (userID == 0) {
			this.props.navigation.navigate('Login');
		} else {
			this.props.navigation.navigate('Profile');
		}
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: bgColor }}>
				<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>
					<Image source={require('../assets/images/menu.png')} style={{ width: 30, height: 30, marginLeft: 16, marginTop: 16 }} />
					<TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 16, marginTop: 24 }}
						onPress={() => {
							this.profile();
						}}>
						<Image source={require('../assets/images/user_5.png')} style={{ width: 35, height: 35 }} />
						<Text style={{ color: '#FFFFFF', fontSize: 15, marginTop: 2 }}>Profile</Text>
					</TouchableOpacity>
				</View>
				<View style={{ position: 'absolute', left: 0, top: 0, width: '100%', alignItems: 'center' }}>
					<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 16 }}>Add Patient</Text>
				</View>
				<Image source={require('../assets/images/logo.png')} style={{ width: 60, height: 40, position: 'absolute', top: 24, right: 16 }} />
				<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
					{/* NAME */}
					<View style={{ position: 'relative', width: '100%' }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>Name</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TextInput
								style={{ width: '100%', height: 40, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}
								placeholder='Enter patient name'
								placeholderTextColor='#FFFFFF55'
								selectionColor='#FFFFFF'
								color='#FFFFFF'
								value={this.state.name}
								onChangeText={(newValue) => this.setState({name: newValue})}
								/>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					{/* PHONE */}
					<View style={{ position: 'relative', width: '100%', marginTop: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>Phone</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TextInput
								style={{ width: '100%', height: 40, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}
								placeholder='Enter phone'
								placeholderTextColor='#FFFFFF55'
								selectionColor='#FFFFFF'
								color='#FFFFFF'
								value={this.state.phone}
								keyboardType='numeric'
								onChangeText={(newValue) => this.setState({phone: newValue})}
								/>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					{/* ADDRESS */}
					<View style={{ position: 'relative', width: '100%', marginTop: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>Address</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TextInput
								style={{ width: '100%', height: 40, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}
								placeholder='Enter address'
								placeholderTextColor='#FFFFFF55'
								selectionColor='#FFFFFF'
								color='#FFFFFF'
								value={this.state.address}
								onChangeText={(newValue) => this.setState({address: newValue})}
								/>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					{/* CITY */}
					<View style={{ position: 'relative', width: '100%', marginTop: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>City</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TextInput
								style={{ width: '100%', height: 40, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}
								placeholder='Enter city'
								placeholderTextColor='#FFFFFF55'
								selectionColor='#FFFFFF'
								color='#FFFFFF'
								value={this.state.city}
								onChangeText={(newValue) => this.setState({city: newValue})}
								/>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					{/* PROVINCE */}
					<View style={{ position: 'relative', width: '100%', marginTop: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>Province</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TextInput
								style={{ width: '100%', height: 40, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}
								placeholder='Enter province'
								placeholderTextColor='#FFFFFF55'
								selectionColor='#FFFFFF'
								color='#FFFFFF'
								value={this.state.province}
								onChangeText={(newValue) => this.setState({province: newValue})}
								/>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					{/* DATE OF BIRTH */}
					<View style={{ position: 'relative', width: '100%', marginTop: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginLeft: 12, marginTop: 8 }}>Date of Birth</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 15, position: 'absolute', left: 140, top: 8 }}>:</Text>
						<View style={{ position: 'absolute', left: 150, top: 0, width: this.state.textInputWidth }}>
							<TouchableOpacity style={{ width: '100%', height: 40, fontSize: 16, justifyContent: 'center' }}
								onPress={() => {
									this.selectBirthday();
								}}>
								<Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 10 }}>
									{moment(this.state.birthday, 'YYYY-MM-DD').format('DD MMMM YYYY')}
								</Text>
							</TouchableOpacity>
							<View style={{ flex: 1, height: 1, marginLeft: 12, backgroundColor: '#FFFFFF55' }} />
						</View>
					</View>
					<View style={{ width: '100%', flexDirection: 'row', marginTop: 16 }}>
						<View style={{ width: '50%', justifyContent: 'center' }}>
							<TouchableOpacity style={{ width: this.state.buttonWidth, alignItems: 'center', justifyContent: 'center',
								position: 'absolute', top: 0, right: 8 }}
								onPress={() => this.addPatient()}>
								<ImageBackground source={require('../assets/images/glossy_button.png')} style={{ width: 150, height: 70,
									position: 'relative' }}
									resizeMode="contain">
									<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center',
										alignItems: 'center' }}>
										<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Save</Text>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						</View>
						<View style={{ width: '50%', justifyContent: 'center' }}>
							<TouchableOpacity style={{ width: this.state.buttonWidth, alignItems: 'center', justifyContent: 'center',
								position: 'absolute', top: 0, right: 8 }}
								onPress={() => this.goBack()}>
								<ImageBackground source={require('../assets/images/glossy_button_red.png')} style={{ width: 150, height: 70,
									position: 'relative' }}
									resizeMode="contain">
									<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center',
										alignItems: 'center' }}>
										<Text style={{ color: '#FFFFFF', fontSize: 15 }}>Cancel</Text>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				{ this.state.progressVisible &&
					<ProgressDialog
						label="Adding patient..."
						visible={this.state.progressVisible} />
				}
				{ this.state.birthdayPickerVisible &&
					<DateTimePicker
	          			mode={'date'}
    	      			value={this.state.birthday}
    	      			display="default"
    	      			onChange={(event, date) => {
    	      				this.setState({
    	      					birthday: date,
    	      					birthdayPickerVisible: false
    	      				});
    	      			}}
        		/>
        		}
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
			</View>
		);
	}
}
