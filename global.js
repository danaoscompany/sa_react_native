import { Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Toast from 'react-native-simple-toast';
import { AsyncStorage } from '@react-native-community/async-storage';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';

global.bgColor = "#1679FA";
global.blue = "#1679FA";
global.lightBlue = "#64A6FC";
global.flatBlue = "#3498db";
global.userID = 0;
global.PROTOCOL = "http://";
//global.HOST = "192.168.43.182";
global.HOST = "admin.skinmed.id";
global.API_URL = PROTOCOL+HOST+"";
global.mark = null;
global.share = null;
global.deleteImage = null;
global.previewImagesRefresh = null;
global.imageListRefresh = null;
global.alert = function(message) {
	Alert.alert("Info", message);
};
global.log = function(message) {
	console.log(message);
};
global.uuidv4 = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
global.db = SQLite.openDatabase(
  	{
    	name: 'SQLite',
    	location: 'default',
    	createFromLocation: '~sa.db',
  	},
  	() => { },
  		error => {
    		console.log("ERROR: " + error);
		}
	);
global.currentSessionUUID = "";
global.currentSessionName = "";
global.currentSessionDate = "";
global.currentPatientUUID = "";
global.currentPatientName = "";
global.currentDeviceID = "";
global.currentDeviceUUID = "";
global.currentDeviceName = "";
global.currentZoomValue = 0.0;
global.uniqid = function() {
    var ts = String(new Date().getTime()), i = 0, out = '';
    for(i=0;i<ts.length;i+=2) {
       out += Number(ts.substr(i, 2)).toString(36);
    }
    return ('d'+out);
};
global.isAdmin = false;
global.show = function(message) {
	Toast.show(message);
};
global.logout = function() {
	if (userID == 0) {
		this.props.navigation.navigate('Login');
	} else {
		Alert.alert("Confirmation", "Are you sure you want to log out?", [
			{
				text: "Yes",
				onPress: () => {
					db.transaction((trx) => {
						trx.executeSql("DELETE FROM sessions", [], (trx, results) => {
							trx.executeSql("DELETE FROM patients", [], (trx, results) => {
								trx.executeSql("DELETE FROM devices", [], (trx, results) => {
									trx.executeSql("DELETE FROM session_images", [], (trx, results) => {
										trx.executeSql("DELETE FROM preview_images", [], (trx, results) => {
											trx.executeSql("DELETE FROM marks", [], (trx, results) => {
												(async () => {
													try {
														userID = 0;
														await AsyncStorage.setItem("email", "");
														await AsyncStorage.setItem("password", "");
														RNRestart.Restart();
													} catch (e) {
														log("ERROR: "+e);
													}
												})();
											});
										});
									});
								});
							});
						});
					});
				}
			},
			{
				text: "No",
				style: "cancel"
			}
		]);
	}
};
global.PDF_TEXT_ALIGNMENT_LEFT = 0;
global.PDF_TEXT_ALIGNMENT_CENTER = 1;
global.PDF_TEXT_ALIGNMENT_RIGHT = 2;
global.PDF_PAGE_WIDTH = 320;
global.PDF_PAGE_HEIGHT = 465;
global.PDF_CHAR_WIDTH = 10;
global.pdfDrawText = function(pdf, text, x, y, color, fontName) {
	var option = {
    	x: x,
    	y: PDF_PAGE_HEIGHT-y,
    	color: color,
    	fontName: 'Times New Roman Bold'
	};
	/*if (fontName != "") {
		option['fontName'] = fontName;
	}*/
	pdf.drawText(text, option);
};
global.pdfDrawTextWithAlignment = function(pdf, text, x, y, alignment, color) {
	var textX = x;
	if (alignment == PDF_TEXT_ALIGNMENT_LEFT) {
		textX = x;
	} else if (alignment == PDF_TEXT_ALIGNMENT_CENTER) {
		textX = (PDF_PAGE_WIDTH/2)-(text.length*PDF_CHAR_WIDTH/2)+x;
	} else if (alignment == PDF_TEXT_ALIGNMENT_RIGHT) {
		textX = PDF_PAGE_WIDTH-(text.length*PDF_CHAR_WIDTH)+x;
	}
	pdf.drawText(text, {
    	x: textX,
    	y: PDF_PAGE_HEIGHT-y,
    	color: color
	});
};
global.image1 = "data:image/jpeg;base64,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";
