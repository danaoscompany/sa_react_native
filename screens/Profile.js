import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';

export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			profileInfoWidth: Dimensions.get('window').width-8-8,
			lineWidth: Dimensions.get('window').width-8-8-8-8,
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
			progressVisible: false
		};
		this.getProfileInfo();
	}
	
	componentWillReceiveProps() {
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
			log("COMPANY INFO: "+response);
			let user = JSON.parse(response);
			this.setState({
				firstName:this.getRealString(user['first_name']),
				lastName:this.getRealString(user['last_name']),
				email:this.getRealString(user['email']),
				phone:this.getRealString(user['phone']),
				address:this.getRealString(user['address']),
				city:this.getRealString(user['city']),
				province:this.getRealString(user['province']),
				company:this.getRealString(user['company_name']),
				companyCountry:this.getRealString(user['company_country']),
				companyStreet:this.getRealString(user['company_street']),
				companyZipCode:this.getRealString(user['company_zip_code']),
				companyCity:this.getRealString(user['company_city']),
				companyState:this.getRealString(user['company_state']),
				companyPhone:this.getRealString(user['company_phone'])
			});
			this.setState({progressVisible: false});
		});
	}
	
	getRealString(value) {
		if (value == null || value.trim() == "") {
			return "-";
		}
		return value;
	}
	
	goBack() {
		this.props.navigation.goBack();
	}
	
	editProfile() {
		this.props.navigation.navigate('EditProfile');
	}
	
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: blue }}>
				<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: blue, height: 50, position: 'relative' }}>
					<Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' }}>Profile</Text>
					<TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, width: 50, height: 50, justifyContent: 'center',
						alignItems: 'center' }}
						onPress={() => this.goBack()}>
						<Image source={require('../assets/images/back.png')} style={{ width: 18, height: 18 }} />
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View style={{ backgroundColor: '#00000055', position: 'relative', top: 30, left: 8, right: 8, width: this.state.profileInfoWidth }}>
						<View style={{ width: 50, height: 50, position: 'absolute', top: 0, right: 0 }}>
							<TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center',
								alignItems: 'center' }}
								onPress={() => this.editProfile()}>
								<Image source={require('../assets/images/edit.png')} style={{ width: 18, height: 18 }} />
							</TouchableOpacity>
						</View>
						<Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 'bold', marginLeft: 8, marginTop: 8 }}>Personal Information</Text>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 12,
							width: this.state.lineWidth }} />
						<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8, marginTop: 8 }}>Remaining Quota</Text>
						{/* FIRST NAME */}
						<View style={{ flexDirection: 'row', marginTop: 12 }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>First Name</Text>
							</View>
							<View style={{ width: this.state.lineWidth, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.firstName}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* LAST NAME */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Last Name</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.lastName}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* EMAIL */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Email</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.email}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* PHONE */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Phone</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.phone}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* ADDRESS */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Address</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.address}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* CITY */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>City</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.city}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* PROVINCE */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Province</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.province}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						<Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 'bold', marginLeft: 8, marginTop: 16 }}>Company Information</Text>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 8,
							width: this.state.lineWidth }} />
						{/* COMPANY */}
						<View style={{ flexDirection: 'row', marginTop: 4 }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Company</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
									<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.company}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY COUNTRY */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Country</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyCountry}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY STREET */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Street</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyStreet}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY ZIP CODE */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>ZIP Code</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyZipCode}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY CITY */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>City</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyCity}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY STATE */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>State</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyState}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* COMPANY PHONE */}
						<View style={{ flexDirection: 'row', marginBottom: 8 }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Phone</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.companyPhone}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* CITY */}
						<View style={{ flexDirection: 'row' }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>City</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.city}</Text>
							</View>
						</View>
						<View style={{ height: 1, backgroundColor: '#FFFFFF22', marginLeft: 8, marginRight: 8, marginTop: 2,
							width: this.state.lineWidth }} />
						{/* PROVINCE */}
						<View style={{ flexDirection: 'row', marginBottom: 8 }}>
							<View style={{ width: 110, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>Province</Text>
							</View>
							<View style={{ flex: 1, height: 30, justifyContent: 'center' }}>
								<Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 8 }}>{this.state.province}</Text>
							</View>
						</View>
					</View>
					<View style={{ width: '100%', alignItems: 'center', marginTop:45, marginBottom: 48 }}>
						<TouchableOpacity style={{ width: 100, height: 40, backgroundColor: '#00000055', borderRadius: 5, alignItems: 'center',
							justifyContent: 'center' }}
							onPress={() => {
								logout();
							}}>
							<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
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
