import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm';
import { Device } from '@ionic-native/device';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { TabsPage } from '../tabs/tabs';
import { UserRegistrationPage } from '../user-registration/user-registration';
import { ConfrimPhonePage } from '../confrim-phone/confrim-phone';
import { ChangePasswordPage } from '../change-password/change-password';
import { timestamp } from 'Rxjs/operators';
import { ForgetPasswordPage } from '../forget-password/forget-password';


/**
 * Generated class for the OtpCodeConfrimPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-otp-code-confrim',
  templateUrl: 'otp-code-confrim.html',
  providers: [ChangelanguageProvider]
})
export class OtpCodeConfrimPage {

  loading: any;
  textMyan: any = ["လက်ခံရရှိသောကုဒ်ကို ရိုက်ထည့်ရန်", "ရှေ့ဆက်ရန်", "ကုဒ်မရရှိပါက"];
  textEng: any = ["Enter the code that was sent to", "Continue", "Resend OTP code"];
  textData: any = [];
  font: any;
  token: any = '';
  otpcode: any = "";
  phoneNo: any;
  email: any;
  phandemail: any;
  passPageStatus: any;
  passType: any;
  otpcode1: any;
  otpcode2: any;
  otpcode3: any;
  otpcode4: any;
  otpcode5: any;
  otpcode6: any;
  profile: any;
  registerData: any = [];

  @ViewChild('a1') a1;
  @ViewChild('a2') a2;
  @ViewChild('a3') a3;
  @ViewChild('a4') a4;
  @ViewChild('a5') a5;
  @ViewChild('a6') a6;

  values: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public changeLanguage: ChangelanguageProvider, public loadingCtrl: LoadingController,
    private transfer: Transfer,
    public http: Http, public funct: FunctProvider, public fcm: FCM, public alert: AlertController,
    private device: Device,
    public events: Events, private _zone: NgZone, public toastCtrl: ToastController, ) {

    this.profile = this.navParams.get("profile");
    console.log("passData profile>>" + JSON.stringify(this.profile));

    this.phoneNo = this.navParams.get("phoneNo");
    console.log("passData Phone in otpconfirm >> ", JSON.stringify(this.phoneNo));

    this.email = this.navParams.get("email");
    console.log("passData email in otpconfirm >> ", JSON.stringify(this.email));

    this.passPageStatus = this.navParams.get("pageStatus");
    console.log("passPageStatus in otpconfirm >> ", JSON.stringify(this.passPageStatus));

    this.passType = this.navParams.get("type");
    console.log("passType in otpconfirm >> ", JSON.stringify(this.passType));

    if (this.passType == "phone") {
      this.phandemail = this.phoneNo;
    }
    else {
      this.phandemail = this.email;
    }

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

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
    });

  }

  continueOtp() {

    this.otpcode = this.otpcode1 + this.otpcode2 + this.otpcode3 + this.otpcode4 + this.otpcode5;
    console.log("otpcode in continueOtp >> ", this.otpcode);

    if (this.otpcode != "" && this.otpcode != null && this.otpcode != undefined) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true,
      });
      this.loading.present();

      if (this.phoneNo == "demo@mit.com" && this.otpcode == "111111") {
        this._zone.run(() => {
          this.navCtrl.setRoot(TabsPage);
        });
      }
      else if (this.passType == 'email') {
        let param =
        {
          "phone": this.email,
          "text": "",
          "appname": "B2B Myanmar",
          "domain": this.funct.domain,
          "otpcode": this.otpcode
        }
        console.log('request checkOTPEmail>>' + JSON.stringify(param));
        this.http.post("http://connect.nirvasoft.com/apx/module001/serviceOTP/checkOTPEmail", param).map(res => res.json()).subscribe(result => {
          console.log("response checkOTPEmail>>" + JSON.stringify(result));
          if (result.state) {
            console.log("Email OTP Correct...");
            this.editProfile();
          }
          else {
            let toast = this.toastCtrl.create({
              message: "Invalid OTP code.",
              duration: 3000,
              position: 'bottom',
              dismissOnPageChange: true,
            });
            toast.present(toast);
          }
          this.loading.dismiss();
        },
          error => {
            this.loading.dismiss();
            console.log("error sendmsg=" + error.status);
          });
      }
      else if (this.passType == 'phone') {
        let param = {
          phone: this.phoneNo,
          appname: this.funct.appName,
          domain: this.funct.domain,
          otpcode: this.otpcode
        }
        console.log('request checkOTP>>' + JSON.stringify(param));
        this.http.post(this.funct.ipaddress2 + 'serviceOTP/checkOTP', param).map(res => res.json()).subscribe(result => {
          console.log("response checkOTP>>" + JSON.stringify(result));
          if (result.state) {
            console.log("SMSPoh OTP Correct...");
            if (this.passPageStatus == '1') {
              // this.navCtrl.push(ConfrimPhonePage, {
              //   data: this.phoneNo
              // });
              this.navCtrl.push(ForgetPasswordPage, { data: this.phoneNo, syskey: this.navParams.get("syskey"), sessionKey: this.navParams.get("sessionKey") });
            }
            else if (this.passPageStatus == '2') {
              this.navCtrl.push(ChangePasswordPage, { phone: this.phoneNo, profile: this.profile, gender: this.navParams.get("gender"), pageStatus: 2 });
            }
            else {
              // this.checkRegisterData(this.phoneNo);
              this.navCtrl.push(UserRegistrationPage, {
                data: this.phoneNo,
              });
            }
            this.loading.dismiss();
          }
          else {
            let toast = this.toastCtrl.create({
              message: "Invalid OTP code.",
              duration: 3000,
              position: 'bottom',
              dismissOnPageChange: true,
            });
            toast.present(toast);
          }
          this.loading.dismiss();
        },
          error => {
            this.loading.dismiss();
            console.log("error sendmsg=" + error.status);
          });
      }
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Enter OTP code',
        duration: 5000,
        position: 'bottom',
        dismissOnPageChange: true,
      });
      toast.present(toast);
    }
  }

  checkRegisterData(phone) {

    // this.loading = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   dismissOnPageChange: true,
    // });
    // this.loading.present();
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
                    this.storage.remove("b2bregData");
                    this.storage.set('b2bregData', data);
                    this._zone.run(() => {
                      this.navCtrl.setRoot(TabsPage);
                    });

                  }
                });
              }
              else {
                this.storage.remove("b2bregData");
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
          this.navCtrl.setRoot(TabsPage);
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

  onResendOtp() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

    let param = {
      phone: this.phoneNo,
      text: "as your verification code for B2B Myanmar",
      appname: this.funct.appName,
      domain: this.funct.domain
    }
    console.log('request sendmsg>>' + JSON.stringify(param));
    this.http.post(this.funct.ipaddress2 + 'serviceOTP/sendmsg', param).map(res => res.json()).subscribe(result => {
      console.log("response sendmsg>>" + JSON.stringify(result));
      if (result.state && result.response_status) {
        console.log("onResendOTP SMSPoh otp success");
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
        this.loading.dismiss();
        console.log("error sendmsg=" + error.status);
      });
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true,
    });

    toast.present(toast);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpCodeConfrimPage');
  }

  onKeyUp(event, index) {
    console.log("event>>" + event);
    console.log("index>>" + index);
    console.log("event.target.value>>" + event.target.value);

    if (event.keyCode == 8) {
      this.setFocus(index - 2);
    }
    else {
      this.values.push(event.target.value);
      this.setFocus(index);
    }
    console.log("this.values>>" + JSON.stringify(this.values));
    event.stopPropagation();
  }

  submit(e: Event) {

    this.values = [];
    this.a1.value = "";
    this.a2.value = "";
    this.a3.value = "";
    this.a4.value = "";
    this.a4.value = "";
    // this.a6.value = "";
    e.stopPropagation();

  }

  setFocus(index) {

    switch (index) {
      case 0:
        this.a1.setFocus();
        break;
      case 1:
        this.a2.setFocus();
        break;
      case 2:
        this.a3.setFocus();
        break;
      case 3:
        this.a4.setFocus();
        break;
      case 4:
        this.a5.setFocus();
        break;
      // case 5:
      //   this.a6.setFocus();
      //   break;
    }
  }

  editProfile() {

    console.log("this profile == " + this.profile);    //&&  this.requiredState == false && this.requiredTownship == false
    if (this.profile != '' || this.profile != undefined) {
      let photoName = this.profile.split("/").pop();
      var type;

      //type = '';
      // var url = this.funct.imglink + 'module001/file/mobileupload?type=' + type;

      if (this.registerData.n2 == 1) {       // Live apk
        type = 0;
      }
      else {
        type = 9;
      }
      var url = this.funct.imglink + 'module001/file/mobileuploadnewversion?type=' + type;    //Live apk

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: photoName,
        chunkedMode: false,
      }

      console.log("profileImg ==" + this.profile);
      console.log("photoName ==" + photoName);
      console.log("profile == " + this.profile);
      if (photoName == this.registerData.t16) {
        this.saveProfile();
      }
      else {
        const fileTransfer: TransferObject = this.transfer.create();
        fileTransfer.upload(this.profile, url, options).then((data) => {
          console.log("data==" + JSON.stringify(data));
          console.log("Image Upload Success");
          this.saveProfile();
        },
          error => {
            console.log("signin error img=" + JSON.stringify(error));
            this.getError(error, "B000");
          });
      }
    }
  }

  saveProfile() {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();

    this.registerData.t16 = this.profile.split("/").pop();
    this.registerData.t3 = this.email;
    let params = {
      person: {
        syskey: this.registerData.syskey,
        t1: this.registerData.t1,               // phone Number
        t2: this.registerData.t2,            // UserName
        t3: this.registerData.t3,                  // email
        t4: this.funct.appID,     // appID
        t5: this.registerData.t5,      // deviceID
        t6: this.registerData.t6,        // state Name (Eng)
        t7: this.registerData.t7,                   // state Name (Myan)
        t8: this.registerData.t8,                   // township Name (Eng)
        t9: this.registerData.t9,                   // township Name (Myan)
        t10: this.registerData.t10,                  // password
        t11: this.registerData.t11,                  // gender
        t12: this.registerData.t12,                  // state (code)
        t13: this.registerData.t13,                  // township (code)
        t14: this.registerData.t14,                      // fcm token
        t15: this.funct.appName,                // appName
        t16: this.registerData.t16,        // User Image
        t17: this.registerData.t17,  // appType
        t18: this.funct.version,  // version 
        t19: 'phone',             // type
        n2: this.registerData.n2, //user or content writer 
      },
      sessionKey: this.registerData.sessionKey
    }

    console.log("request updateProfileforupdate = ", JSON.stringify(params));
    this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/updateProfile', params).map(res => res.json()).subscribe(data => {
      console.log("response updateProfileforupdate = ", JSON.stringify(data));
      if (data.syskey > 0) {
        this.storage.get('b2bregData').then((result) => {
          if (result == null || result == '') {
            this.storage.set('b2bregData', data);
            this.events.publish('register', data.t16);
          }
          else {
            this.storage.remove('b2bregData');
            this.storage.set('b2bregData', data);
            this.events.publish('register', data.t16);
          }
        });
        let toast = this.toastCtrl.create({
          message: "Updated successfully.",
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
        this.navCtrl.setRoot(TabsPage);
      }
      else {
        let toast = this.toastCtrl.create({
          message: data.msgcode,
          duration: 10000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
        this.navCtrl.pop();
      }
    }, error => {
      this.loading.dismiss();
      console.log("signin error=" + error.status);
      this.getError(error, "B130");
    });
  }
}


