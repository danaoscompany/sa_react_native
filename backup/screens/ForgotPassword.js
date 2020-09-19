import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressDialog from 'react-native-progress-dialog';

export default class ForgotPassword extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			loginProgressVisible: false,
			loginProgressText: 'Sending password reset email...'
		};
	}
	
	componentDidMount() {
	}
	
	render() {
		return (
			<View style={{ width: '100%', height: '100%', backgroundColor: '#1679FA' }}>
				<ScrollView>
					<LinearGradient colors={['#527bc9', '#669be7' ]} style={{ borderColor: '#FFFFFF', borderRadius: 20, borderWidth: 2,
						marginLeft: 24, marginTop: 24, marginRight: 24, flex: 1, flexDirection: 'column', alignItems: 'center', padding: 16 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 18 }}>FORGOT PASSWORD</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 18 }}>Please enter your email</Text>
						<View style={{ flex: 1, flexDirection: 'row', height: 45, marginLeft: 24, marginRight: 24, marginTop: 24 }}>
							<View style={{ width: 45, height: 45, backgroundColor: '#385e92', justifyContent: 'center', alignItems: 'center',
								borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
								<Image source={require('../assets/images/user_2.png')} style={{ width: 20, height: 20 }} />
							</View>
							<TextInput placeholder='Email' style={{ width: '100%', paddingLeft: 10, paddingRight: 10, height: 45,
								backgroundColor: '#FFFFFF', borderTopRightRadius: 5, borderBottomRightRadius: 5, fontSize: 16 }}
								onChangeText={(value) => this.setState({email: value})}
								value={this.state.email} />
						</View>
						<TouchableOpacity style={{ height: 45, backgroundColor: '#375F92', justifyContent: 'center', alignItems: 'center',
							paddingLeft: 16, paddingRight: 16, marginTop: 32 }} onPress={() => {
								let email = this.state.email;
								if (email == "") {
									Alert.alert("Error", "Please enter your email");
									return;
								}
								this.setState({loginProgressVisible: true});
							}}>
							<Text style={{ color: '#FFFFFF', fontSize: 17 }}>Reset Password</Text>
						</TouchableOpacity>
					</LinearGradient>
				</ScrollView>
				<ProgressDialog
					label={this.state.loginProgressText}
					visible={this.state.loginProgressVisible} />
			</View>
		);
	}
}
