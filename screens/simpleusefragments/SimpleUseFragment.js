import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class SimpleUseFragment extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			menuHeaderWidth: Dimensions.get('window').width-48-48,
			menuWidth: Dimensions.get('window').width-16-16,
			sessionName: 'Search Session'
		};
	}
	
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#1679FA' }}>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity style={{ marginLeft: 16, marginTop: 16, width: 35, height: 35 }}>
						<Image source={require('../../assets/images/menu.png')} style={{ width: 35, height: 35 }} />
					</TouchableOpacity>
					<View style={{ flexDirection: 'column', marginLeft: 20, marginTop: 18 }}>
						<Image source={require('../../assets/images/user_3.png')} style={{ width: 40, height: 40 }} />
						<Text style={{ color: '#FFFFFF', fontSize: 13, marginTop: 2 }}>Profile</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'column', flex: 1, position: 'absolute', width: '100%', height: '100%', justifyContent: 'center',
					alignItems: 'center' }}>
					<View style={{ width: this.state.menuHeaderWidth, height: 55, backgroundColor: '#FFFFFF', borderRadius: 8, justifyContent: 'center' }}>
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 15 }}>{this.state.sessionName}</Text>
						</View>
					</View>
					<View style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8, justifyContent: 'center',
						marginTop: 8 }}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Choose Device</Text>
						</View>
					</View>
					<View style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8, justifyContent: 'center',
						marginTop: 8 }}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Take Photo</Text>
						</View>
					</View>
					<View style={{ width: this.state.menuWidth, height: 70, backgroundColor: '#FFFFFF', borderRadius: 8, justifyContent: 'center',
						marginTop: 8 }}>
						<LinearGradient colors={['#1679FA', '#0a92fd']} style={{ width: 30, height: 30, backgroundColor: '#00FF00',
							borderRadius: 5, marginLeft: 12 }} />
						<View style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, justifyContent: 'center',
							alignItems: 'center' }}>
							<Text style={{ color: '#000000', fontSize: 17 }}>Preview Only</Text>
						</View>
					</View>
				</View>
			</View>
		);
	}
}
