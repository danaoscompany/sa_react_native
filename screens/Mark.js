import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import ViewPager from '@react-native-community/viewpager';

export default class Mark extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			sessionUUID: this.props.route.params['session_uuid'],
			patientUUID: this.props.route.params['patient_uuid'],
			deviceUUID: this.props.route.params['device_uuid'],
			imageURL: this.props.route.params['img_url'],
			sessionImageUUID: this.props.route.params['img_uuid'],
			name: this.props.route.params['name'],
			noteInputContainerHeight: Dimensions.get('window').height-450-45,
			noteInputHeight: Dimensions.get('window').height-450-45-20,
			screenWidth: Dimensions.get('window').width,
			sessionDate: this.props.route.params['date'],
			frontPointX: 0,
			frontPointY: 0,
			frontPointVisible: false,
			backPointX: 0,
			backPointY: 0,
			backPointVisible: false,
			leftPointX: 0,
			leftPointY: 0,
			leftPointVisible: false,
			rightPointX: 0,
			rightPointY: 0,
			rightPointVisible: false,
			note: '',
			scrolling: false,
			currentPage: 0,
			progressVisible: true
		};
		this.viewPager = React.createRef();
	}
	
	componentDidMount() {
		log("IMAGE UUID: "+this.state.sessionImageUUID);
		this.getSessionInfo();
	}
	
	getSessionInfo() {
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM session_images WHERE session_uuid='"+this.state.sessionUUID+"'", [], (trx, images) => {
					if (images.rows.length > 0) {
						let image = images.rows.item(0);
						this.setState({
							note: image['note']
						});
					}
					trx.executeSql("SELECT * FROM sessions WHERE uuid='"+this.state.sessionUUID+"'", [], (trx, sessions) => {
						if (sessions.rows.length > 0) {
							let session = sessions.rows.item(0);
							this.setState({
								sessionDate: session['date']
							});
						}
						this.setState({
							progressVisible: false
						});
					});
				});
			});
		} else {
			log("SESSION IMAGE UUID: "+this.state.sessionImageUUID);
			let fd = new FormData();
			fd.append("uuid", this.state.sessionImageUUID);
			fetch(API_URL+"/user/get_session_image_by_uuid", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("IMAGE: "+response);
				let image = JSON.parse(response);
				this.setState({
					note: image['note']
				});
				let fd = new FormData();
				fd.append("session_uuid", this.state.sessionUUID);
				fetch(API_URL+"/user/get_markings_by_session_uuid", {
					method: 'POST',
					body: fd,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(response => response.text())
				.then(response => {
					log("MARKINGS: "+response);
					let marks = JSON.parse(response);
					if (marks.length > 0) {
						let mark = marks[0];
						try {
							let leftPoints = JSON.parse(mark['left_points']);
							let rightPoints = JSON.parse(mark['right_points']);
							let frontPoints = JSON.parse(mark['front_points']);
							let backPoints = JSON.parse(mark['back_points']);
							if (leftPoints.length > 0) {
								let leftPoint = leftPoints[0];
								this.setState({
									leftPointX: parseInt(leftPoint['x']),
									leftPointY: parseInt(leftPoint['y']),
									leftPointVisible: true,
									rightPointVisible: false,
									frontPointVisible: false,
									backPointVisible: false
								});
							}
							if (rightPoints.length > 0) {
								let rightPoint = rightPoints[0];
								this.setState({
									rightPointX: parseInt(rightPoint['x']),
									rightPointY: parseInt(rightPoint['y']),
									leftPointVisible: false,
									rightPointVisible: true,
									frontPointVisible: false,
									backPointVisible: false
								});
							}
							log("FRONT POINTS: "+JSON.stringify(frontPoints));
							if (frontPoints.length > 0) {		
								let frontPoint = frontPoints[0];		
								this.setState({		
									frontPointX: parseInt(frontPoint['x']),		
									frontPointY: parseInt(frontPoint['y']),		
									leftPointVisible: false,		
									rightPointVisible: false,		
									frontPointVisible: true,
									backPointVisible: false
								});
							}
							if (backPoints.length > 0) {
								let backPoint = backPoints[0];
								this.setState({
									backPointX: parseInt(backPoint['x']),
									backPointY: parseInt(backPoint['y']),
									leftPointVisible: false,
									rightPointVisible: false,
									frontPointVisible: false,
									backPointVisible: true
								});
							}
						} catch (e) {
							log(e);
						}
						let fd = new FormData();
						fd.append("uuid", this.state.sessionUUID);
						fetch(API_URL+"/user/get_session_by_uuid", {
							method: 'POST',
							body: fd,
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						})
						.then(response => response.text())
						.then(response => {
							let session = JSON.parse(response);
							this.setState({
								sessionDate: session['date']
							});
						});
					}
					this.setState({progressVisible: false});
				});
			});
		}
	}
	
	drawPointInFront(event) {
		this.setState({
			frontPointX: event.nativeEvent.locationX,
			frontPointY: event.nativeEvent.locationY,
			frontPointVisible: true,
			backPointVisible: false,
			leftPointVisible: false,
			rightPointVisible: false
		});
	}
	
	drawPointInBack(event) {
		this.setState({
			frontPointVisible: false,
			backPointX: event.nativeEvent.locationX,
			backPointY: event.nativeEvent.locationY,
			backPointVisible: true,
			leftPointVisible: false,
			rightPointVisible: false
		});
	}
	
	drawPointInLeft(event) {
		this.setState({
			frontPointVisible: false,
			backPointVisible: false,
			leftPointX: event.nativeEvent.locationX,
			leftPointY: event.nativeEvent.locationY,
			leftPointVisible: true,
			rightPointVisible: false
		});
	}
	
	drawPointInRight(event) {
		this.setState({
			frontPointVisible: false,
			backPointVisible: false,
			leftPointVisible: false,
			rightPointX: event.nativeEvent.locationX,
			rightPointY: event.nativeEvent.locationY,
			rightPointVisible: true
		});
	}
	
	goToNextImage() {
		log("GO TO NEXT PAGE");
		let currentPage = this.state.currentPage;
		if (currentPage < 3) {
			currentPage++;
		}
		this.setState({currentPage: currentPage});
		this.viewPager.current.setPage(currentPage);
	}
	
	goToPrevImage() {
		log("GO TO PREV PAGE");
		let currentPage = this.state.currentPage;
		if (currentPage > 0) {
			currentPage--;
		}
		this.setState({currentPage: currentPage});
		this.viewPager.current.setPage(currentPage);
	}
	
	reset() {
		this.setState({
			leftPointVisible: false,
			rightPointVisible: false,
			frontPointVisible: false,
			backPointVisible: false
		});
	}
	
	save() {
		let imageWidth = 292;
		let imageHeight = 402;
		let imageX = (this.state.screenWidth/2)-(imageWidth/2);
		let imageY = (450/2)-(imageHeight/2);
		let leftPoints = [];
		let rightPoints = [];
		let frontPoints = [];
		let backPoints = [];
		if (this.state.leftPointVisible) {
			leftPoints.push({'x': this.state.leftPointX, 'y': this.state.leftPointY});
		} else if (this.state.rightPointVisible) {
			rightPoints.push({'x': this.state.rightPointX, 'y': this.state.rightPointY});
		} else if (this.state.frontPointVisible) {
			frontPoints.push({'x': this.state.frontPointX, 'y': this.state.frontPointY});
		} else if (this.state.backPointVisible) {
			backPoints.push({'x': this.state.backPointX, 'y': this.state.backPointY});
		}
		log("SAVED FRONT POINTS: "+JSON.stringify(frontPoints));
		let uuid = uuidv4();
		this.setState({progressVisible: true});
		if (userID == 0) {
			db.transaction((trx) => {
				trx.executeSql("SELECT * FROM marks WHERE session_uuid='"+this.state.sessionUUID+"'", [], (trx, marks) => {
					if (marks.rows.length > 0) {
						trx.executeSql("UPDATE marks SET uuid='"+uuid+"', user_id="+userID+", session_image_uuid='"+this.state.sessionImageUUID+"', "
							+"note='"+note+"', session_uuid='"+this.state.sessionUUID+"', patient_uuid='"+this.state.patientUUID+"', "
							+"left_points='"+JSON.stringify(leftPoints)+"', left_image_x="+imageX+", left_image_y="+imageY+", "
							+"left_image_width="+imageWidth+", left_image_height="+imageHeight+", right_points='"+JSON.stringify(rightPoints)+"', "
							+"right_image_x="+imageX+", right_image_y="+imageY+", right_image_width="+imageWidth+", right_image_height="+imageHeight+", "
							+"front_points='"+JSON.stringify(frontPoints)+"', front_image_x="+imageX+", front_image_y="+imageY+", "
							+"front_image_width="+imageWidth+", front_image_height="+imageHeight+", back_points='"+JSON.stringify(backPoints)+"' "
							+"back_image_x="+imageX+", back_image_y="+backImageY+", back_image_width="+imageWidth+", back_image_height="+imageHeight+" "
							+"WHERE session_uuid='"+this.state.sessionUUID+"'", [], (trx, results) => {
						});
						this.setState({progressVisible: false});
					}
				});
			});
		} else {
			let fd = new FormData();
			fd.append("uuid", uuid);
			fd.append("user_id", userID);
			fd.append("session_image_uuid", this.state.sessionImageUUID);
			fd.append("note", this.state.note);
			fd.append("session_uuid", this.state.sessionUUID);
			fd.append("patient_uuid", this.state.patientUUID);
			fd.append("left_points", JSON.stringify(leftPoints));
			fd.append("left_image_x", imageX);
			fd.append("left_image_y", imageY);
			fd.append("left_image_width", imageWidth);
			fd.append("left_image_height", imageHeight);
			fd.append("right_points", JSON.stringify(rightPoints));
			fd.append("right_image_x", imageX);
			fd.append("right_image_y", imageY);
			fd.append("right_image_width", imageWidth);
			fd.append("right_image_height", imageHeight);
			fd.append("front_points", JSON.stringify(frontPoints));
			fd.append("front_image_x", imageX);
			fd.append("front_image_y", imageY);
			fd.append("front_image_width", imageWidth);
			fd.append("front_image_height", imageHeight);
			fd.append("back_points", JSON.stringify(backPoints));
			fd.append("back_image_x", imageX);
			fd.append("back_image_y", imageY);
			fd.append("back_image_width", imageWidth);
			fd.append("back_image_height", imageHeight);
			fetch(API_URL+"/user/update_image_points_and_note", {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => response.text())
			.then(response => {
				log("SAVE RESPONSE: "+response);
				this.setState({progressVisible: false});
				this.props.navigation.navigate('ViewImage', {
					img_url: this.state.imageURL,
					name: this.state.name,
					session_uuid: this.state.sessionUUID,
					device_uuid: this.state.deviceUUID
				});
			});
		}
	}
	
	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ position: 'relative', left: 0, top: 0, width: '100%', height: 450 }}>
					<ViewPager style={{ width: '100%', height: 450 }} initialPage={this.state.currentPage} scrollEnabled={false} onPageScroll={(evt) => {
						log("START SCROLL");
						if (!this.state.scrolling) {
							this.setState({scrolling: true});
						}
					}} onPageScrollStateChanged={(evt) => {
					}} onPageSelected={(evt) => {
						log("END SCROLL");
						if (this.state.scrolling) {
							this.setState({scrolling: false});
						}
					}}
					ref={this.viewPager}>
    	  				<TouchableOpacity key="front" style={{ backgroundColor: '#000000', width: '100%', height: 450 }}
    	  					activeOpacity={1} onPress={(evt) => {
    	  						this.drawPointInFront(evt);
    	  					}}>
    	  					<View style={{ width: '100%', height: 450, position: 'relative' }}>
		      					<Image source={require('../assets/images/anatomy_front.png')} style={{ width: '100%', height: 402, marginTop: 24,
		      						marginBottom: 24, }} resizeMode='contain' />
		      					{ this.state.frontPointVisible &&
		      						<View style={{ width: 10, height: 10, borderRadius:5, backgroundColor: '#FF0000', position: 'absolute',
		      							left: this.state.frontPointX, top: this.state.frontPointY }}>
		      						</View>
		      					}
    	  					</View>
    	  				</TouchableOpacity>
    	  				<TouchableOpacity key="back" style={{ backgroundColor: '#000000', width: '100%', height: 450 }}
    	  					activeOpacity={1} onPress={(evt) => {
    	  						this.drawPointInBack(evt);
    	  					}}>
    	  					<View style={{ width: '100%', height: 450, position: 'relative' }}>
		      					<Image source={require('../assets/images/anatomy_back.png')} style={{ width: '100%', height: 402, marginTop: 24,
		      						marginBottom: 24, }} resizeMode='contain' />
		      					{ this.state.backPointVisible &&
		      						<View style={{ width: 10, height: 10, borderRadius:5, backgroundColor: '#FF0000', position: 'absolute',
		      							left: this.state.backPointX, top: this.state.backPointY }}>
		      						</View>
		      					}
    	  					</View>
    	  				</TouchableOpacity>
    	  				<TouchableOpacity key="left" style={{ backgroundColor: '#000000', width: '100%', height: 450 }}
    	  					activeOpacity={1} onPress={(evt) => {
    	  						this.drawPointInLeft(evt);
    	  					}}>
    	  					<View style={{ width: '100%', height: 450, position: 'relative' }}>
		      					<Image source={require('../assets/images/anatomy_left.png')} style={{ width: '100%', height: 402, marginTop: 24,
		      						marginBottom: 24, }} resizeMode='contain' />
		      					{ this.state.leftPointVisible &&
		      						<View style={{ width: 10, height: 10, borderRadius:5, backgroundColor: '#FF0000', position: 'absolute',
		      							left: this.state.leftPointX, top: this.state.leftPointY }}>
		      						</View>
		      					}
    	  					</View>
    	  				</TouchableOpacity>
    	  				<TouchableOpacity key="right" style={{ backgroundColor: '#000000', width: '100%', height: 450 }}
    	  					activeOpacity={1} onPress={(evt) => {
    	  						this.drawPointInRight(evt);
      						}}>
      						<View style={{ width: '100%', height: 450, position: 'relative' }}>
	    	  					<Image source={require('../assets/images/anatomy_right.png')} style={{ width: '100%', height: 402, marginTop: 24,
	    	  						marginBottom: 24, }} resizeMode='contain' />
	    	  					{ this.state.rightPointVisible &&
	    	  						<View style={{ width: 10, height: 10, borderRadius:5, backgroundColor: '#FF0000', position: 'absolute',
	    	  							left: this.state.rightPointX, top: this.state.rightPointY }}>
	    	  						</View>
	    	  					}
      						</View>
      					</TouchableOpacity>
    				</ViewPager>
    				<View style={{ position: 'absolute', bottom: 12, right: 8, flexDirection: 'column' }}>
    					<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
	    					<TouchableOpacity style={{ width: 30, height: 30, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center',
	    						alignItems: 'center', marginLeft: 8 }}
	    						onPress={() => this.reset()}>
	    						<Image source={require('../assets/images/reset.png')} style={{ width: 17, height: 17 }} />
	    					</TouchableOpacity>
	    				</View>
	    				<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
	    					<TouchableOpacity style={{ width: 30, height: 30, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center',
	    						alignItems: 'center' }}
	    						onPress={() => this.goToPrevImage()}>
	    						<Image source={require('../assets/images/left.png')} style={{ width: 17, height: 17 }} />
	    					</TouchableOpacity>
	    					<TouchableOpacity style={{ width: 30, height: 30, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center',
	    						alignItems: 'center', marginLeft: 8 }}
	    						onPress={() => this.goToNextImage()}>
	    						<Image source={require('../assets/images/right_2.png')} style={{ width: 17, height: 17 }} />
	    					</TouchableOpacity>
	    				</View>
	    			</View>
    			</View>
    			<View style={{ width: '100%', height: this.state.noteInputContainerHeight, position: 'relative', backgroundColor: '#479E7B' }}>
    				<Text style={{ color: '#FFFFFF', fontSize: 16, marginTop: 4, marginLeft: 4 }}>{this.state.sessionDate}</Text>
    				<TextInput style={{ width: '100%', height: this.state.noteInputHeight, color: '#FFFFFF', fontSize: 17, textAlignVertical: 'top' }}
    					multiline={true}
    					value={this.state.note}
    					onChangeText={(value) => this.setState({note: value})} />
    				<TouchableOpacity style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 45, backgroundColor: blue,
    					justifyContent: 'center', alignItems: 'center' }}
    					onPress={() => this.save()}>
    					<Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>SAVE</Text>
    				</TouchableOpacity>
    			</View>
    			<ProgressDialog label='Loading...' visible={this.state.progressVisible} />
			</View>
		);
	}
}
