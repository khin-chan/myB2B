import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FCM } from '@ionic-native/fcm';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';

import { OtpCodeConfrimPage } from '../otp-code-confrim/otp-code-confrim';

import { TabsPage } from '../tabs/tabs';
import { UserRegistrationPage } from '../user-registration/user-registration';
import { LogInPage } from '../log-in/log-in';
import { ConfrimPhonePage } from '../confrim-phone/confrim-phone';

/**
 * Generated class for the OtpConfrimPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-otp-confrim',
  templateUrl: 'otp-confrim.html',
  providers: [ChangelanguageProvider]
})
export class OtpConfrimPage {

  registerCredentials: any = { phone: '', };
  phonenum: any;
  loading: any;
  textMyan: any = ["ဖုန်းနံပါတ်", "ဝင်ရောက်ရန်", "B2B Myanmar မှ ကြိုဆိုပါသည်။", "Log in With Fcebook"];
  textEng: any = ["phoneNo", "Register", "Welcome to B2B Myanmar", "Log in With Fcebook"];
  textData: any = [];
  font: any;
  otpcode: any;
  token: any = '';
  smsponResult: any = [];
  smsData: any;
  passPageStatus: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform,
    public storage: Storage, public changeLanguage: ChangelanguageProvider, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, public http: Http, public funct: FunctProvider, private _zone: NgZone, public device: Device,
    public fcm: FCM, public alert: AlertController, public events: Events, private fb: Facebook, private file: File, private transfer: FileTransfer, ) {

    this.passPageStatus = this.navParams.get("pageStatus");
    console.log("passPageStatus in otpconfirm >> ", JSON.stringify(this.passPageStatus));

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

  goFocus(ev) {
    this.focused = true;
  }
  goBlur(ev) {
    this.focused = false;
  }

  onChange(s, i) {
    if (i == "09") {
      this.registerCredentials.phone = "+959";
    }
    else if (i == "959") {
      this.registerCredentials.phone = "+959";
    }
  }

  checkRegisterData() {

    if (this.passPageStatus == 1) {
      this.navCtrl.push(ConfrimPhonePage, {
        data: this.registerCredentials.phone,
        pageStatus: this.passPageStatus
      });
    }
    else {
      let params = {
        t1: this.registerCredentials.phone
      };
      console.log("request register=" + JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/checkExistPhno', params).map(res => res.json()).subscribe(data => {
        console.log("check mobile register =" + JSON.stringify(data));
        if (data.syskey > 0) {
          this.fcm.getToken().then(token => {
            console.error("token in registration >>>> ", token);
            this.token = token;
          })
          let alert = this.alert.create({
            // title: '',
            // enableBackdropDismiss: false,
            //message: 'Your account is already exist.Please Login!',
            cssClass: this.font,
            message: 'အကောင့်ဖွင့်ပြီးသား ရှိပါသည်။ Login ဝင်ပါ။',
            buttons: [
              {
                text: 'Cancel',
                cssClass: 'alertButton',
                handler: data => {
                  console.log('Cancel clicked');
                  this.navCtrl.pop();
                }
              },
              {
                text: 'OK',
                cssClass: 'alertButton',
                handler: () => {
                  console.log('OK clicked');
                  this.loading = this.loadingCtrl.create({
                    content: "Please wait...",
                    dismissOnPageChange: true
                  });
                  this.loading.present();
                  if (data.t14 == '' || this.token != data.t14) {
                    this.fcm.getToken().then(token => {
                      console.log("token=" + token);
                      if (token != null)
                        this.sendRegistrationToServer(token, data);
                      else {
                        this.storage.remove("b2bregData");
                        this.storage.set('b2bregData', data);
                        this._zone.run(() => {
                          this.navCtrl.push(LogInPage);
                        });

                      }
                    });
                  }
                  else {
                    this.storage.remove("b2bregData");
                    this.storage.set('b2bregData', data);
                    this._zone.run(() => {
                      this.navCtrl.push(LogInPage);
                    });
                  }
                }
              }]
          });
          alert.present();
        }
        else {
          this.sentPhoneOtp();
        }
      },
        error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B103");
          this.loading.dismiss();
        });
    }

  }

  sendRegistrationToServer(token, data) {
    let parameter = {
      t14: token,
      syskey: data.syskey,
      sessionKey: data.sessionKey,
    };
    this.http.post(this.funct.ipaddress2 + 'service001/updateRegToken', parameter).map(res => res.json()).subscribe(result => {
      console.log("updateRegID=" + JSON.stringify(result));
      if (result.state) {
        console.log("success token refresh");
        this.storage.remove("refreshToken");
        this.storage.remove("b2bregData");
        this.storage.set('b2bregData', data);
        this.events.publish('register', data.t16);
        this._zone.run(() => {
          //this.navCtrl.setRoot(LogInPage);
          this.navCtrl.push(LogInPage);
        });
        this.loading.dismiss();
      }
      else {
        let toast = this.toastCtrl.create({
          message: result.errMsg,
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
      }
    },
      error => {
        console.log("signin error=" + error.status);
        this.getError(error, "B102");
      });
  }

  sentPhoneOtp() {
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
      this.goSMSPoh(this.phonenum)
    }
  }

  goSMSPoh(phone) {

    console.log('SMSpoh phone>>' + JSON.stringify(phone));

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

    let param = {
      phone: phone,
      text: "as your verification code for B2B Myanmar",
      appname: this.funct.appName,
      domain: this.funct.domain
    }
    console.log('request sendmsg>>' + JSON.stringify(param));
    this.http.post(this.funct.ipaddress2 + 'serviceOTP/sendmsg', param).map(res => res.json()).subscribe(result => {
      console.log("response sendmsg>>" + JSON.stringify(result));
      if (result.state && result.response_status) {
        console.log('OTP sent successfully');       //atda
        // if (this.passPageStatus == '1') {
        //   this.navCtrl.push(OtpCodeConfrimPage, { phoneNo: phone, pageStatus: this.passPageStatus, type: 'phone' });
        // }
        // else {
        this.navCtrl.push(OtpCodeConfrimPage, { phoneNo: phone, type: 'phone' });
        // }
        this.loading.dismiss();
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Sent OTP fail!",
          duration: 3000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
      }
    },
      error => {
        console.log("error sendmsg=" + error.status);
        this.loading.dismiss();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpConfrimPage');
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

  /*   checkRegisterData(phone) {
  
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true,
      });
      this.loading.present();
  
      let params = {
        t1: phone
      };
      
      console.log("request register=" + JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/checkExistPhno', params).map(res => res.json()).subscribe(data => {
        console.log("check mobile register =" + JSON.stringify(data));
        if (data.syskey > 0) {
          this.fcm.getToken().then(token => {
            console.error("token in registration >>>> ", token);
            this.token = token;
          })
          let alert = this.alert.create({
            title: '',
            enableBackdropDismiss: false,
            message: 'Your account is already exist!',
            buttons: [{
              text: 'OK',
              cssClass: 'alertButton',
              handler: () => {
                console.log('OK clicked');
                this.loading = this.loadingCtrl.create({
                  content: "Please wait...",
                  dismissOnPageChange: true
                });
                this.loading.present();
                if (data.t14 == '' || this.token != data.t14) {
                  this.fcm.getToken().then(token => {
                    console.log("token=" + token);
                    if (token != null)
                      this.sendRegistrationToServer(token, data);
                    else {
                      this.storage.set('b2bregData', data);
                      this._zone.run(() => {
                        this.navCtrl.setRoot(TabsPage);
                      });
  
                    }
                  });
                }
                else {
                  this.storage.set('b2bregData', data);
                  this._zone.run(() => {
                    this.navCtrl.setRoot(TabsPage);
                  });
                }
              }
            }]
          });
          alert.present();
          this.loading.dismiss();
        }
        else {
          this.navCtrl.push(UserRegistrationPage, {
            data: phone,
          });
          this.loading.dismiss();
        }
      },
        error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B103");
          this.loading.dismiss();
        });
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
    } */
  /* 
    showToast(msg) {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 5000,
        position: 'bottom',
        dismissOnPageChange: true,
      });
  
      toast.present(toast);
    } */

  // getError(error, status) {
  //   /* ionic App error
  //    ............001) url link worng, not found method (404)
  //    ............002) server not response (500)
  //    ............003) cross fillter not open (403)
  //    ............004) server stop (-1)
  //    ............005) app lost connection (0)
  //    */
  //   let code;
  //   if (error.status == 404) {
  //     code = '001';
  //   }
  //   else if (error.status == 500) {
  //     code = '002';
  //   }
  //   else if (error.status == 403) {
  //     code = '003';
  //   }
  //   else if (error.status == -1) {
  //     code = '004';
  //   }
  //   else if (error.status == 0) {
  //     code = '005';
  //   }
  //   else if (error.status == 502) {
  //     code = '006';
  //   }
  //   else {
  //     code = '000';
  //   }
  //   let msg = '';
  //   if (code == '005') {
  //     msg = "Please check internet connection!";
  //   }
  //   else {
  //     msg = "Can't connect right now. [" + code + ' - ' + status + "]";
  //   }
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 5000,
  //     position: 'bottom',
  //     dismissOnPageChange: true,
  //   });
  //   toast.present(toast);
  //   this.loading.dismiss();
  //   console.log("Oops!");
  // }
}



