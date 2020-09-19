import React, { Component } from 'react';
import { Text, View, Button, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './screens/Main.js';
import Login from './screens/Login.js';
import Signup from './screens/Signup.js';
import Test from './screens/Test.js';
import Home from './screens/Home.js';
import ForgotPassword from './screens/ForgotPassword.js';
import SelectSession from './screens/SelectSession.js';
import AddSession from './screens/AddSession.js';
import EditSession from './screens/EditSession.js';
import AddDevice from './screens/AddDevice.js';
import ChangeDevice from './screens/ChangeDevice.js';
import SelectPatient from './screens/SelectPatient.js';
import AddPatient from './screens/AddPatient.js';
import EditPatient from './screens/EditPatient.js';
import SimpleUse from './screens/SimpleUse.js';
import NewSession from './screens/NewSession.js';
import DrawerNavigator from './DrawerNavigator.js';
import ModalTest from './screens/ModalTest.js';
import TakePicture from './screens/TakePicture.js';
import Profile from './screens/Profile.js';
import EditProfile from './screens/EditProfile.js';
import ImageList from './screens/ImageList.js';
import ViewImage from './screens/ViewImage.js';
import ViewPreviewImage from './screens/ViewPreviewImage.js';
import PreviewImages from './screens/PreviewImages.js';
import Mark from './screens/Mark.js';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {name: 'Skin Analyzer'};
	}
	
	componentDidMount() {
		console.disableYellowBox = true;
	}
	
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator mode="card" initialRouteName="MainNavigator">
					<Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
					<Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
					<Stack.Screen name="SimpleUse" component={SimpleUse} options={{ headerShown: false }} />
					<Stack.Screen name="NewSession" component={NewSession} options={{ headerShown: false }} />
					<Stack.Screen name="Home" component={Home} animationEnabled={true} animationTypeForReplace='push' options={{ headerShown: false }} />
					<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
					<Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
					<Stack.Screen name="Test" component={Test} options={{ headerShown: false }} />
					<Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
					<Stack.Screen name="SelectSession" component={SelectSession} options={{ headerShown: false }} />
					<Stack.Screen name="AddSession" component={AddSession} options={{ headerShown: false }} />
					<Stack.Screen name="EditSession" component={EditSession} options={{ headerShown: false }} />
					<Stack.Screen name="SelectPatient" component={SelectPatient} options={{ headerShown: false }} />
					<Stack.Screen name="AddPatient" component={AddPatient} options={{ headerShown: false }} />
					<Stack.Screen name="EditPatient" component={EditPatient} options={{ headerShown: false }} />
					<Stack.Screen name="AddDevice" component={AddDevice} options={{ headerShown: false }} />
					<Stack.Screen name="ChangeDevice" component={ChangeDevice} options={{ headerShown: false }} />
					<Stack.Screen name="TakePicture" component={TakePicture} options={{ headerShown: false }} />
					<Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
					<Stack.Screen name="ImageList" component={ImageList} options={{ headerShown: false }} />
					<Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile', headerShown: true, headerStyle: {
						backgroundColor: blue
					}, headerTitleStyle: {
						color: '#FFFFFF'
					}, headerTintColor: '#FFFFFF' }} />
					<Stack.Screen name="ViewImage" component={ViewImage} options={{ title: 'View Image', headerShown: true, headerStyle: {
							backgroundColor: blue
						}, headerTitleStyle: {
							color: '#FFFFFF'
						}, headerTintColor: '#FFFFFF', headerRight: () => (
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={{ width: 30, height: 30, marginRight: 6, alignItems: 'center', justifyContent: 'center' }}
								onPress={() => {
									mark();
								}}>
		            			<Image
		            				source={require('./assets/images/edit.png')}
		            				style={{ width: 22, height: 22 }} />
	              			</TouchableOpacity>
	              			<TouchableOpacity style={{ width: 30, height: 30, marginLeft: 6, marginRight: 6, alignItems: 'center',
	              				justifyContent: 'center' }}
								onPress={() => {
									deleteImage();
								}}>
		            			<Image
		            				source={require('./assets/images/delete.png')}
		            				style={{ width: 22, height: 22 }} />
	              			</TouchableOpacity>
	              			<TouchableOpacity style={{ width: 30, height: 30, marginLeft: 6, marginRight: 6, alignItems: 'center',
	              				justifyContent: 'center' }}
								onPress={() => {
									share();
								}}>
		            			<Image
		            				source={require('./assets/images/share.png')}
		            				style={{ width: 22, height: 22 }} />
	              			</TouchableOpacity>
              			</View>
          			)}} />
          			<Stack.Screen name="ViewPreviewImage" component={ViewPreviewImage} options={{ title: 'View Image', headerShown: true, headerStyle: {
							backgroundColor: blue
						}, headerTitleStyle: {
							color: '#FFFFFF'
						}, headerTintColor: '#FFFFFF', headerRight: () => (
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity style={{ width: 30, height: 30, marginRight: 6, alignItems: 'center', justifyContent: 'center' }}
								onPress={() => {
									mark();
								}}>
		            			<Image
		            				source={require('./assets/images/edit.png')}
		            				style={{ width: 22, height: 22 }} />
	              			</TouchableOpacity>
	              			<TouchableOpacity style={{ width: 30, height: 30, marginLeft: 6, marginRight: 6, alignItems: 'center',
	              				justifyContent: 'center' }}
								onPress={() => {
									deleteImage();
								}}>
		            			<Image
		            				source={require('./assets/images/delete.png')}
		            				style={{ width: 22, height: 22 }} />
	              			</TouchableOpacity>
              			</View>
          			)}} />
					<Stack.Screen name="PreviewImages" component={PreviewImages} options={{ headerShown: false }} />
					<Stack.Screen name="Mark" component={Mark} options={{ headerShown: false }} />
				</Stack.Navigator>
    		</NavigationContainer>
		);
	}
}
