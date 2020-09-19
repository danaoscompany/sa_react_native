import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';

export default class HomeFragment extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			autoSync: false,
			menuWidth: (Dimensions.get('window').width-12-12)/2-4
		};
	}
	
	render() {
		return (
			<View style={{ backgroundColor: '#1679FA', flex: 1 }}>
				<ScrollView style={{ backgroundColor: '#1679FA' }}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity style={{ marginLeft: 16, marginTop: 16, width: 35, height: 35 }}>
							<Image source={require('../../assets/images/menu.png')} style={{ width: 35, height: 35 }} />
						</TouchableOpacity>
						<View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 18 }}>
							<Image source={require('../../assets/images/user_3.png')} style={{ width: 40, height: 40 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 2 }}>Profile</Text>
						</View>
					</View>
					<Image source={require('../../assets/images/logo.png')} style={{ width: 60, height: 40, position: 'absolute', top: 24, right: 16 }} />
					<View style={{ flex: 1, backgroundColor: '#55B6FA', marginLeft: 12, marginRight: 12, marginTop: 12 }}>
						<Text style={{ color: '#FFFFFF', fontSize: 11, marginTop: 8, marginLeft: 12 }}>Synchronization</Text>
						<Text style={{ color: '#FFFFFF', fontSize: 11, marginTop: 2, marginLeft: 12, marginBottom: 8 }}>Automatic Sync</Text>
						<View style={{ backgroundColor: '#FFFFFF', borderRadius: 20, borderColor: '#1679FA', borderWidth: 1, flexDirection: 'row',
							padding: 2, position: 'absolute', top: 8, right: 12, alignItems: 'center' }}>
							<Text style={{ color: '#1679FA', fontSize: 11, fontWeight: 'bold', marginLeft: 8 }}>Manual</Text>
							<Switch value={this.state.autoSync} onValueChange={(newValue) => this.setState({autoSync: newValue})}
								thumbColor={'#1679FA'} trackColor={'#C2DAFC'} style={{ marginLeft: 2 }} />
							<Text style={{ color: '#1679FA', fontSize: 11, fontWeight: 'bold', marginLeft: -8, marginRight: 8 }}>Auto</Text>
						</View>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginRight: 4 }}>
							<Image source={require('../../assets/images/phone.png')} style={{ width: 70, height: 90, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Simple Use</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginLeft: 4, marginRight: 12 }}>
							<Image source={require('../../assets/images/note.png')} style={{ width: 90, height: 100, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 0, marginBottom: 12 }}>New Session</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginRight: 4 }}>
							<Image source={require('../../assets/images/images.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Images</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginLeft: 4, marginRight: 12 }}>
							<Image source={require('../../assets/images/settings.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Settings</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, flexDirection: 'row', marginTop: 8, paddingLeft: 12, paddingRight: 12 }}>
						<TouchableOpacity style={{ width: this.state.menuWidth, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
							backgroundColor: '#04427A', marginRight: 4 }}>
							<Image source={require('../../assets/images/profile.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Profile/Login</Text>
						</TouchableOpacity>
						<TouchableOpacity visible={false} style={{ display: 'none', width: this.state.menuWidth, flexDirection: 'column',
							alignItems: 'center', justifyContent: 'center', backgroundColor: '#04427A', marginLeft: 4, marginRight: 12 }}>
							<Image source={require('../../assets/images/settings.png')} style={{ width: 80, height: 80, marginTop: 16 }} />
							<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 8, marginBottom: 12 }}>Settings</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}
