import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { FCM } from '@ionic-native/fcm';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { TabsPage } from '../tabs/tabs';
import { ConfrimPhonePage } from '../confrim-phone/confrim-phone';
import { ChangePasswordPage } from '../change-password/change-password';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';
import { OtpConfrimPage } from '../otp-confrim/otp-confrim';
import { RegistrationPage } from '../registration/registration';


/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
  providers: [ChangelanguageProvider]
})
export class LogInPage {

  registerData: any;
  registerCredentials: any = { phone: '', password: '' };
  phonenum: any;
  loading: any;
  textMyan: any = ["ဖုန်းနံပါတ်", "လျို့ဝှက်နံပါတ်", "ဝင်ရောက်ရန်", "B2B Myanmar မှ ကြိုဆိုပါသည်။", "သင်၏လျို့ဝှက်နံပါတ်ကိုမေ့နေပါသလား?", "Log in With Fcebook"];
  textEng: any = ["phoneNo", "Password", "Register", "Welcome to B2B Myanmar", "Forgot Your Password?", " Log in With Fcebook"];
  textData: any = [];
  font: any;
  alertPopup: any;
  fcmToken: any = "";
  token: any = '';
  userData: any;
  fbuserData: any;
  isLoading: any;
  phone: any = '';
  password: any = '';
  stateNameeng: any = '';
  stateNamemyan: any = '';
  tspNameeng: any = '';
  tspNamemyan: any = '';
  state: any = '';
  township: any = '';
  gender: any = '';
  fbpicture: any = '';
  profile: any;
  photoName: any;
  focused: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public funct: FunctProvider, public events: Events, private _zone: NgZone,
    public http: Http, public storage: Storage, public platform: Platform,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public changeLanguage: ChangelanguageProvider, public alert: AlertController, public fcm: FCM,
    private fb: Facebook, public device: Device, private file: File, private transfer: FileTransfer, ) {

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
    });

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textEng, this.textMyan).then((data) => {
        this.textData = data;
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language=" + JSON.stringify(data));
      });
    });
  }

  ionViewDidEnter() {
    this.backButtonExit();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name)
      this.navCtrl.pop();
    });
  }

  goFocus(ev) {
    this.focused = true;
  }
  goBlur(ev) {
    this.focused = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }

  onSignIn() {
    console.log('SignInPage: onSignIn()');
  }

  facebookLogin() {
    this.fb.login(['email', 'public_profile']).then((res) => {
      console.log("authResponse" + JSON.stringify(res.authResponse));
      console.log('rta.status>>>> ' + res.status);
      if (res.status == 'connected') {
        console.log('Login Successful!');
        this.fb.api('me?fields=id,name,email,gender,picture.width(720).height(720).as(picture_large)', []).then(profile => {
          console.log("result profile>>>> " + JSON.stringify(profile));
          this.userData = { id: profile['id'], name: profile['name'], email: profile['email'], gender: profile['gender'], picture: profile['picture_large']['data']['url'] };
          console.log('SignInPage this.userData ' + JSON.stringify(this.userData));
          this.imageDownload(this.userData.picture);
        });
      }
      else {
        console.log("Fcebook Login failure: " + JSON.stringify(res.status));
      }
    })
      .catch(e => console.log('Error logging into Facebook', e));;
  }

  imageDownload(picture) {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let url = picture;
    console.log('url: ' + url);
    fileTransfer.download(url, this.file.externalRootDirectory + 'Android/data/com.b2bsite.siteb2b/cache/b2b.jpg', true).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.presentToast("Facebook Profile Downloaded Completed!");
      this.loading.dismiss();
      this.profile = entry.toURL();
      console.log("this.profile ==" + this.profile);
      this.updateUserImage(this.profile);
    });
  }

  updateUserImage(imageData) {
    let currentName = '';
    let correctPath = '';
    if (imageData.indexOf('file:///') > -1) {
      if (imageData.indexOf('?') > -1) {
        currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        correctPath = imageData.substring(0, imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
      }
      else {
        currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      }
    }
    else {
      if (imageData.indexOf('?') > -1) {
        currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        correctPath = 'file:///' + imageData.substring(0, imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
      }
      else {
        currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        correctPath = 'file:///' + imageData.substr(0, imageData.lastIndexOf('/') + 1);
      }
    }

    console.log("currentName == " + currentName);
    console.log("currentPath == " + correctPath);
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {

    console.log("namePaht == " + namePath + "   //// currentNmae == " + currentName + "   ////  newFileName == " + newFileName);
    console.log("this.file.datadirectory == " + this.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.profile = this.pathForImage(newFileName);
      console.log("photos=" + JSON.stringify(this.profile));
      this.saveProfile(this.profile);
    }, error => {
      alert('Error while storing file.' + JSON.stringify(error));
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  saveProfile(profile) {
    this.profile = profile;
    console.log("this.profile12344567 ==" + this.profile);

    if (this.profile != '' || this.profile != undefined) {
      this.photoName = this.profile.split("/").pop();

      //var type= '';
      //var url = this.funct.imglink + 'module001/file/mobileupload?type=' + type;

      var type = 0;
      var url = this.funct.imglink + 'module001/file/mobileuploadnewversion?type=' + type;    //Live apk

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.photoName,
        chunkedMode: false,
      }
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.upload(this.profile, url, options).then((data) => {
        console.log("data==" + JSON.stringify(data));
        console.log("Image Upload Success");
        this.saveFBUserRegister();
      },
        error => {
          console.log("signin error img=" + JSON.stringify(error));
          this.loading.dismiss();
          this.getError(error, "B000");
        });
    }
  }

  saveFBUserRegister() {

    this.fbpicture = this.profile.split("/").pop();
    console.log("this.fbpicture>>>> " + JSON.stringify(this.fbpicture));

    this.isLoading = true;
    let fcmToken;
    this.fcm.getToken().then(token => {
      console.log("getToken=" + token);
      if (token != null) {
        fcmToken = token;
      }
      else
        fcmToken = '';

      let params = {
        t1: this.phone,                                // phone Number
        t2: this.password,                             // password
        t3: this.userData.email,                                        // email
        t4: this.funct.appID,                          // appID
        t19: 'phone',                                   //type
        person: {
          t2: this.userData.name,                           // UserName
          t5: this.device.uuid,                        // deviceID
          t6: this.stateNameeng,                       // state Name (Eng)
          t7: this.stateNamemyan,                      // state Name (Myan)
          t8: this.tspNameeng,                         // township Name (Eng)
          t9: this.tspNamemyan,                        // township Name (Myan)
          t11: this.gender,                            // gender
          t12: this.state,                             // state (code)
          t13: this.township,                          // township (code)
          t14: fcmToken,                               // fcm token
          t15: this.funct.appName,                      // appName
          t16: this.fbpicture,        // User Image
          t17: this.funct.appType,                      // appType
          t18: this.funct.version,                       // version 
        }
      };
      console.log("request checkExistEmail=" + JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/checkExistEmail', params).map(res => res.json()).subscribe(result => {
        console.log("response checkExistEmail =" + JSON.stringify(result));
        if (result.syskey > 0) {
          this.storage.set('b2bregData', result);
          this.events.publish('register', result.t16);
          this._zone.run(() => {
            this.events.publish('register', result.t16);
            this.navCtrl.setRoot(TabsPage);
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Login fail!",
            duration: 5000,
            position: 'bottom',
            dismissOnPageChange: true,
          });
          toast.present(toast);
        }
        this.isLoading = false;
      },
        error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B104");
        });
    },
      error => {
        console.log("registeration token error !!!!!!!!");
      });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });
    toast.present();
  }

  onForgotPassword() {
    this.navCtrl.push(OtpConfrimPage, { pageStatus: 1 });
  }

  register() {
    let flag = false;
    let num = /^[0-9-\+]*$/;
    if (num.test(this.registerCredentials.phone)) {
      if (this.registerCredentials.phone.indexOf("+") == 0 && (this.registerCredentials.phone.length == "12" || this.registerCredentials.phone.length == "13" || this.registerCredentials.phone.length == "11")) {
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }
      else if (this.registerCredentials.phone.indexOf("7") == 0 && this.registerCredentials.phone.length == "9") {
        this.registerCredentials.phone = '+959' + this.registerCredentials.phone;
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }

      else if (this.registerCredentials.phone.indexOf("9") == 0 && this.registerCredentials.phone.length == "9") {
        this.registerCredentials.phone = '+959' + this.registerCredentials.phone;
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }
      else if (this.registerCredentials.phone.indexOf("+") != 0 && this.registerCredentials.phone.indexOf("7") != 0 && this.registerCredentials.phone.indexOf("9") != 0 && (this.registerCredentials.phone.length == "8" || this.registerCredentials.phone.length == "9" || this.registerCredentials.phone.length == "7")) {
        this.registerCredentials.phone = '+959' + this.registerCredentials.phone;
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }
      else if (this.registerCredentials.phone.indexOf("09") == 0 && (this.registerCredentials.phone.length == 10 || this.registerCredentials.phone.length == 11 || this.registerCredentials.phone.length == 9)) {
        this.registerCredentials.phone = '+959' + this.registerCredentials.phone.substring(2);
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }
      else if (this.registerCredentials.phone.indexOf("959") == 0 && (this.registerCredentials.phone.length == 11 || this.registerCredentials.phone.length == 12 || this.registerCredentials.phone.length == 10)) {
        this.registerCredentials.phone = '+959' + this.registerCredentials.phone.substring(3);
        this.phonenum = this.registerCredentials.phone;
        flag = true;
      }
      else {
        flag = false;
        let msg = '';
        if (this.platform.is('ios')) {
          msg = 'Invalid';
        }
        else if (this.platform.is('android')) {
          msg = "Invalid Phone number.";
        }
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
      }
    }
    else if (this.registerCredentials.phone == 'demo@mit.com' && this.registerCredentials.password == '111111') {
      flag = true;
      this.phonenum = this.registerCredentials.phone;
    }
    else {
      flag = true;
      this.phonenum = this.registerCredentials.phone;
    }
    if (flag) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
        //   duration: 3000
      });
      this.loading.present();
      this.fcm.getToken().then(token => {
        console.log("token get >>> ", token);
        this.fcmToken = token;
      },
        error => {
          console.log("registeration token error !!!!");
        });

      var paremeter = {
        t1: this.phonenum,
        t10: this.registerCredentials.password
      };

      console.log("request loginUser = ", JSON.stringify(paremeter));
      this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/loginUser', paremeter).map(res => res.json()).subscribe(result => {
        console.log("response loginUser =", JSON.stringify(result));
        if (result.state && result.data.length > 0) {
          if (result.data[0].t14 == "" || result.data[0].t14 != this.fcmToken) {
            this.fcm.getToken().then(token => {
              console.log("token get");
              if (token != null) {
                this.fcmToken = token;
              } else
                this.fcmToken = '';
              this.sendRegistrationToServer(this.fcmToken, result);
            },
              error => {
                console.log("registeration token error !!!!");
              });
          } else {
            this.storage.remove("b2bregData");
            this.storage.set('b2bregData', result.data[0]);
            this.events.publish('registerlogin', result.data[0].t16);
            this._zone.run(() => {
              this.navCtrl.setRoot(TabsPage);
            });
          }

        }
        else {
          let toast = this.toastCtrl.create({
            message: result.msg,
            duration: 10000,
            position: 'bottom',
            dismissOnPageChange: true,
          });
          toast.present(toast);
          if (result.msg == "Account does not exist, please register new account") {
            this.navCtrl.push(OtpConfrimPage);
          }
        }
        this.loading.dismiss();
      }, error => {
        this.loading.dismiss();
        console.log("signin error=" + error.status);
        this.getError(error, "B105");
      });
    }
  }

  sendRegistrationToServer(token, res) {
    console.log("tokennnn >>>", token);
    console.log("res in sendRegistrationToServer >> ", JSON.stringify(res));
    let parameter = {
      t14: token,
      syskey: res.data[0].syskey,
      sessionKey: res.data[0].sessionKey
    };
    console.log("request service001/updateRegToken >> ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'service001/updateRegToken', parameter).map(res => res.json()).subscribe(result => {
      console.log("response service001/updateRegToken >> " + JSON.stringify(result));
      if (result.state) {
        this.storage.remove("b2bregData");
        res.data[0].t14 = token;
        this.storage.set('b2bregData', res.data[0]);
        this.events.publish('registerlogin', res.data[0].t16);
        this._zone.run(() => {
          this.navCtrl.setRoot(TabsPage);
        });
        this.storage.remove("refreshToken");
      }
      else {
        let toast = this.toastCtrl.create({
          message: result.errMsg,
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
      }
    },
      error => {
        this.getError(error, "B102");
      });
  }

  onChange(s, i) {
    if (i == "09") {
      this.registerCredentials.phone = "+959";
    }
    else if (i == "959") {
      this.registerCredentials.phone = "+959";
    }
  }

  changePassword() {
    this.alertPopup = this.alert.create({
      cssClass: this.font,
      message: 'You need to Change Password.',
      buttons: [
        {
          text: "No",
          cssClass: 'alertButton',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: "Yes",
          cssClass: 'alertButton',
          handler: () => {
            this.navCtrl.push(ChangePasswordPage, {
              status: status,
            });
          }
        }
      ]
    })
    this.alertPopup.present();
    let doDismiss = () => this.alertPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.alertPopup.onDidDismiss(unregBackButton);
  }

  getError(error, status) {
    /* ionic App error
     ............001) url link worng, not found method (404)
     ............002) server not response (500)
     ............003) cross fillter not open (403)
     ............004) server stop (-1)
     ............005) app lost connection (0)
     */
    let code;
    if (error.status == 404) {
      code = '001';
    }
    else if (error.status == 500) {
      code = '002';
    }
    else if (error.status == 403) {
      code = '003';
    }
    else if (error.status == -1) {
      code = '004';
    }
    else if (error.status == 0) {
      code = '005';
    }
    else if (error.status == 502) {
      code = '006';
    }
    else {
      code = '000';
    }
    let msg = '';
    if (code == '005') {
      msg = "Please check internet connection!";
    }
    else {
      msg = "Can't connect right now. [" + code + ' - ' + status + "]";
    }
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true,
    });
    toast.present(toast);
    this.loading.dismiss();
    console.log("Oops!");
  }
}
