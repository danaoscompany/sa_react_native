import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';

export default class EditProfile extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			inputWidth: Dimensions.get('window').width-16-16,
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			address: '',
			city: '',
			province: '',
			company: '',
			companyCountry: '',
			companyStreet: '',
			companyZipCode: '',
			companyCity: '',
			companyState: '',
			companyPhone: '',
			/*firstName: 'a',
			lastName: 'a',
			email: 'a@gmail.com',
			phone: '081123456789',
			address: 'a',
			city: 'a',
			province: 'a',
			company: 'a',
			companyCountry: 'a',
			companyStreet: 'a',
			companyZipCode: '61258',
			companyCity: 'a',
			companyState: 'a',
			companyPhone: '081123456789',*/
			progressVisible: false
		};
		this.getProfileInfo();
	}
	
	getProfileInfo() {
		this.setState({progressVisible: true});
		let fd = new FormData();
		fd.append("user_id", userID);
		fetch(API_URL+"/user/get_user_by_id", {
			method: 'POST',
			body: fd,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(response => response.text())
		.then(response => {
			let user = JSON.parse(response);
			this.setState({
				firstName:user['first_name'],
				lastName:user['last_name'],
				email:user['email'],
				phone:user['phone'],
				address:user['address'],
				city:user['city'],
				province:user['province'],
				company:user['company_name'],
				companyCountry:user['company_country'],
				companyStreet:user['company_street'],
				companyZipCode:user['company_zip_code'],
				companyCity:user['company_city'],
				companyState:user['company_state'],
				companyPhone:user['company_phone']
			});
			this.setState({progressVisible: false});
		});
	}
	
	getRealString(value) {
		if (value == null || value.trim() == "") {
			return "";
		}
		return value;
	}
	
	saveProfile() {
		let firstName = this.getRealString(this.state.firstName);
		let lastName = this.getRealString(this.state.lastName);
		let email = this.getRealString(this.state.email);
		let phone = this.getRealString(this.state.phone);
		let address = this.getRealString(this.state.address);
		let city = this.getRealString(this.state.city);
		let province = this.getRealString(this.state.province);
		let company = this.getRealString(this.state.company);
		let companyCountry = this.getRealString(this.state.companyCountry);
		let companyStreet = this.getRealString(this.state.companyStreet);
		let companyZipCode = this.getRealString(this.state.companyZipCode);
		let companyCity = this.getRealString(this.state.companyCity);
		let companyState = this.getRealString(this.state.companyState);
		let companyPhone = this.getRealString(this.state.companyPhone);
		log("FIRST NAME: "+firstName+", LAST NAME: "+lastName+", EMAIL: "+email+", PHONE: "+phone+", ADDRESS: "+address+", CITY: "+city+", PROVINCE: "+province+", COMPANY: "+company+", COUNTRY: "+companyCountry+", STREET: "+companyStreet+", ZIPCODE: "+companyZipCode+", CITY: "+companyCity+", STATE: "+companyState+", PHONE: "+companyPhone);
		if (firstName.trim() == "" || lastName.trim() == "" || email.trim() == "" || phone.trim() == "" || address.trim() == "" || city.trim() == "" || province.trim() == "" || company.trim() == "" || companyCountry.trim() == "" || companyStreet.trim() == "" || companyZipCode.trim() == "" || companyCity.trim() == "" || companyState.trim() == "" || companyPhone.trim() == "") {
			show("Please complete all data");
			return;
		}
		this.setState({progressVisible: false});
		let fd = new FormData();
		fd.append("id", userID);
		fd.append("first_name", firstName);
		fd.append("last_name", lastName);
		fd.append("email", email);
		fd.append("phone", phone);
		fd.append("address", address);
		fd.append("city", city);
		fd.append("province", province);
		fd.append("company_name", company);
		fd.append("company_country", companyCountry);
		fd.append("company_street", companyStreet);
		fd.append("company_zip_code", companyZipCode);
		fd.append("company_city", companyCity);
		fd.append("company_state", companyState);
		fd.append("company_phone", companyPhone);
		fetch(API_URL+"/user/update_user_details", {
			method: 'POST',
			body: fd,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(response => response.text())
		.then(response => {
			log("UPDATE PROFILE RESPONSE: "+response);
			this.setState({progressVisible: true});
			this.props.navigation.navigate('Profile', {
				updated: 1
			});
		});
	}
	
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: blue }}>
				<ScrollView>
					<View style={{ alignItems: 'center' }}>
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginTop: 32 }}>Personal Information</Text>
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.firstName}
							onChangeText={(value) => {
								this.setState({firstName: value});
							}}
							placeholder="Enter first name"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.lastName}
							onChangeText={(value) => {
								this.setState({lastName: value});
							}}
							placeholder="Enter last name"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.email}
							onChangeText={(value) => {
								this.setState({email: value});
							}}
							placeholder="Enter email"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.phone}
							onChangeText={(value) => {
								this.setState({phone: value});
							}}
							placeholder="Enter phone"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.address}
							onChangeText={(value) => {
								this.setState({address: value});
							}}
							placeholder="Enter address"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.city}
							onChangeText={(value) => {
								this.setState({city: value});
							}}
							placeholder="Enter city"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.province}
							onChangeText={(value) => {
								this.setState({province: value});
							}}
							placeholder="Enter province"
							placeholderTextColor="#99888888" />
						<Text style={{ color: '#FFFFFF', fontSize: 17, marginTop: 24 }}>Company Information</Text>
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.company}
							onChangeText={(value) => {
								this.setState({company: value});
							}}
							placeholder="Enter company name"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyCountry}
							onChangeText={(value) => {
								this.setState({companyCountry: value});
							}}
							placeholder="Enter company country"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyStreet}
							onChangeText={(value) => {
								this.setState({companyStreet: value});
							}}
							placeholder="Enter company street"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyZipCode}
							onChangeText={(value) => {
								this.setState({companyZipCode: value});
							}}
							placeholder="Enter company zip code"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyCity}
							onChangeText={(value) => {
								this.setState({companyCity: value});
							}}
							placeholder="Enter company city"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyState}
							onChangeText={(value) => {
								this.setState({companyState: value});
							}}
							placeholder="Enter company state"
							placeholderTextColor="#99888888" />
						<TextInput style={{ width: this.state.inputWidth, height: 50, color: '#000000', fontSize: 17, marginTop: 8,
							backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8 }}
							value={this.state.companyPhone}
							onChangeText={(value) => {
								this.setState({companyPhone: value});
							}}
							placeholder="Enter company phone"
							placeholderTextColor="#99888888" />
						<TouchableOpacity style={{ width: this.state.inputWidth, height: 50, color: blue, fontSize: 17, fontWeight: 'bold',
							marginTop: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', marginBottom: 32 }}
							onPress={() => this.saveProfile()}>
							<Text style={{ color: blue, fontSize: 17, fontWeight: 'bold' }}>Save</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<ProgressDialog
					label="Loading..."
					visible={this.state.progressVisible} />
			</View>
		);
	}
}
