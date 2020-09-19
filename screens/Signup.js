import React, { Component } from 'react';
import { Text, View, TextInput, ScrollView, Button, TouchableOpacity, Alert, LIST } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressDialog from 'react-native-progress-dialog';

export default class Signup extends Component {

	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			address: '',
			phone: '',
			email: '',
			username: '',
			password: '',
			repeatPassword: '',
			isAdmin: -1,
			singlePickerVisible: false,
			singlePickerSelectedItem: 0,
			selectRoleVisible: false,
			currentRole: 'Select Role',
			signupProgressVisible: false,
			/* FOR TESTING ONLY */
			/*firstName: 'Test',
			lastName: 'ReactNative',
			address: 'Indonesia',
			phone: '081123456789',
			email: 'test.reactnative@mail.com',
			username: 'test.reactnative',
			password: 'HaloDunia123',
			repeatPassword: 'HaloDunia123',
			isAdmin: -1,
			singlePickerVisible: false,
			singlePickerSelectedItem: 0,
			selectRoleVisible: false,
			currentRole: 'Select Role',
			signupProgressVisible: false*/
		};
	}

	render() {
	return (
		<View>
			<ScrollView style={{ backgroundColor: '#1679FA' }}>
				<LinearGradient colors={['#527bc9', '#669be7' ]} style={{ borderColor: '#FFFFFF', borderRadius: 20, borderWidth: 2,
					marginLeft: 24, marginTop: 52, marginBottom: 32, marginRight: 24, flex: 1, flexDirection: 'column', alignItems: 'center',
					padding: 16 }}>
					<Text style={{ color: '#FFFFFF', fontSize: 19 }}>REGISTRATION</Text>
					<TextInput
						placeholder='First Name'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 32, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(firstName) => this.setState({firstName})}
						value={this.state.firstName}
						/>
					<TextInput
						placeholder='Last Name'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(lastName) => this.setState({lastName})}
						value={this.state.lastName}
						/>
					<TextInput
						placeholder='Address'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(address) => this.setState({address})}
						value={this.state.address}
						/>
					<TextInput
						placeholder='Phone'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(phone) => this.setState({phone})}
						value={this.state.phone}
						/>
					<TextInput
						placeholder='Email'
						placeholderTextColor="#777777"
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(email) => this.setState({email})}
						value={this.state.email}
						/>
					<TextInput
						placeholder='Username'
						placeholderTextColor="#777777"
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(username) => this.setState({username})}
						value={this.state.username}
						/>
					<TextInput
						placeholder='Password'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(password) => this.setState({password})}
						value={this.state.password}
						/>
					<TextInput
						placeholder='Repeat Password'
						placeholderTextColor="#777777"
						color='#000000'
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, paddingLeft: 10, paddingRight: 10 }}
						onChangeText={(repeatPassword) => this.setState({repeatPassword})}
						value={this.state.repeatPassword}
						/>
					<TouchableOpacity
						style={{ backgroundColor: '#FFFFFF', width: '95%', height: 40, marginTop: 16, flexDirection: 'row', alignItems: 'center',
						paddingLeft: 10, paddingRight: 10 }}
						onPress={() => {
							this.setState({
								selectRoleVisible: true
							});
						}}>
						<Text style={{ color: '#000000', fontSize: 14 }}>{this.state.currentRole}</Text>
					</TouchableOpacity>
					<Modal isVisible={this.state.selectRoleVisible} transparent={true}>
        	  			<TouchableOpacity
        	  				style={{flex: 1, backgroundColor: '#00000000', justifyContent: 'center', alignItems: 'center' }}
        	  				onPress={() => {
        	  					this.setState({selectRoleVisible: false});
        	  				}}>
        	  				<View style={{ width: '100%', backgroundColor: '#FFFFFF' }}>
	    	        			<Text style={{ color: '#000000', fontSize: 19, marginLeft: 12, marginTop: 12 }}>Select Role</Text>
	    	        			<View style={{ width: '100%', height: 1, backgroundColor: '#48dbfb55', marginTop: 12 }} />
	    	        			<TouchableOpacity style={{ height: 55, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'}}
	    	        				onPress={() => {
	    	        					this.setState({
	    	        						currentRole: 'Admin',
	    	        						isAdmin: 1,
	    	        						selectRoleVisible: false
	    	        					});
	    	        				}}>
	    	        				<Text style={{ color: '#3498db', fontSize: 18 }}>Admin</Text>
	    	        			</TouchableOpacity>
	    	        			<View style={{ width: '100%', height: 1, backgroundColor: '#48dbfb55' }} />
	    	        			<TouchableOpacity style={{ height: 55, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}
	    	        				onPress={() => {
	    	        					this.setState({
	    	        						currentRole: 'Doctor',
	    	        						isAdmin: 0,
	    	        						selectRoleVisible: false
	    	        					});
	    	        				}}>
	    	        				<Text style={{ color: '#3498db', fontSize: 18 }}>Doctor</Text>
	    	        			</TouchableOpacity>
	    	        			<View style={{ width: '100%', height: 1, backgroundColor: '#48dbfb55' }} />
        	    			</View>
			        	</TouchableOpacity>
			        </Modal>
					<View style={{ width: '80%', flexDirection: 'row', justifyContent: 'center', marginTop: 48 }}>
						<View style={{ width: 120, height: 45 }}>
							<TouchableOpacity
								style={{ width: 120, height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center' }}
								onPress={() => {
									if (this.state.isAdmin == -1) {
										Alert.alert('Error', 'Please select user role.');
										return;
									}
									this.setState({signupProgressVisible: true});
									var formData = new FormData();
									formData.append('first_name', this.state.firstName);
									formData.append('last_name', this.state.lastName);
									formData.append('address', this.state.address);
									formData.append('phone', this.state.phone);
									formData.append('email', this.state.email);
									formData.append('username', this.state.username);
									formData.append('password', this.state.password);
									formData.append('is_admin', this.state.isAdmin);
									fetch('https://skinmed.id/sa/user/signup', {
										method: 'POST',
										body: formData,
										headers: {
											'Accept': 'application/json',
											'Content-Type': 'multipart/form-data'
										}
									})
									.then((response) => {
										return response.text()
									})
									.then((response) => {
										this.setState({signupProgressVisible: false});
										var obj = JSON.parse(response);
										var responseCode = parseInt(obj['response_code']);
										if (responseCode == -1) {
											Alert.alert('Error', 'Sorry, phone is already used.');
										} else if (responseCode == -2) {
											Alert.alert('Error', 'Sorry, email is already used.');
										} else if (responseCode == 1) {
											this.props.navigation.navigate('Login');
										}
									})
								} }>
								<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Register</Text>
							</TouchableOpacity>
						</View>
						<View style={{ width: 120, height: 45, marginLeft: 16 }}>
							<TouchableOpacity
								style={{ width: 120, height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center' }}
								onPress={() => this.props.navigation.navigate('Login') }
								>
								<Text style={{ color: '#FFFFFF', fontSize: 16 }}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</LinearGradient>
			</ScrollView>
			<ProgressDialog
				label='Signing up...'
				visible={this.state.signupProgressVisible} />
		</View>
	);
	}
}

const SHORT_LIST = ["Admin", "Doctor"];
