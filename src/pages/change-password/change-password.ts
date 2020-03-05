import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Platform, AlertController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { LogInPage } from '../log-in/log-in';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  providers: [ChangelanguageProvider]
})
export class ChangePasswordPage {

  registerPassword: any = { newPw: '', confirmPw: '' };
  textMyan: any = ["လုပ်ဆောင်ချက်များပြီးဆုံးပါတော့မည်။", "သင်၏ အကောင့်ကို လျို့ဝှက်နံပါတ်ဖြင့် အဆင့်မြှင့်ရန်", "လျို့ဝှက်နံပါတ် အသစ်ထည့်ရန်", "အတည်ပြု လျို့ဝှက်နံပါတ်", "ပယ်ဖျက်ရန်", "သိမ်းမည်", "လျို့ဝှက်နံပါတ် တူညီမှုရှိရပါမည်။", "လျို့ဝှက်နံပါတ်ပြောင်းရန်"];
  textEng: any = ["You're almost done", "Secure your account with a password", "NEW PASSWORD", "CONFIRM PASSWORD", "Cancel", "Update", "Change Password"];
  textData: any = [];
  font: any;
  requiredEqupassword: any = false;
  loading: any;
  userData: any;
  isAlert: any = false;
  alertPopup: any;
  passStatus: any;
  profile: any;
  registerData: any = [];
  passphone: any;
  phoneNo: any;
  gender: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public funct: FunctProvider, public alert: AlertController, private _zone: NgZone,
    public http: Http, public storage: Storage, public platform: Platform,
    private transfer: Transfer, public events: Events,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public changeLanguage: ChangelanguageProvider) {

    this.gender = this.navParams.get("gender");
    console.log("passData gender>>" + JSON.stringify(this.gender));

    this.profile = this.navParams.get("profile");
    console.log("passData profile>>" + JSON.stringify(this.profile));

    this.passStatus = this.navParams.get("pageStatus");
    console.log("passStatus == " + JSON.stringify(this.passStatus));

    this.passphone = this.navParams.get("phone");
    console.log("passphone == " + JSON.stringify(this.passphone));

    this.storage.get('b2bregData').then((data) => {
      this.userData = data;
      this.registerData = data;
      console.log("this.registerData" + JSON.stringify(this.registerData));
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
      console.log("Active Page12=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  Oncancel() {
    this.navCtrl.pop();
  }

  OnUpdate() {

    if (this.registerPassword.newPw == this.registerPassword.confirmPw) {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();

      if (this.passStatus == '2') {
        this.phoneNo = this.passphone;
      }
      else {
        this.phoneNo = this.userData.t1;
      }

      if (this.phoneNo != "" && this.phoneNo != null && this.phoneNo != undefined && this.phoneNo != ' ') {

        var paremeter = {
          t1: this.phoneNo,
          t3: this.registerData.t3,
          t10: this.registerPassword.newPw,
          sessionKey: this.userData.sessionKey
        };
        console.log("request changePw = ", JSON.stringify(paremeter));
        this.http.post(this.funct.ipaddress2 + 'service001/changeRegPassword', paremeter).map(res => res.json()).subscribe(result => {
          console.log("response changePw = ", JSON.stringify(result));
          if (result.state) {
            if (this.passStatus == '2') {
              this.editProfile();
            }
            else {
              this.deletesession();
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
            this.navCtrl.popTo(this.navCtrl.getByIndex(1));
          }
          this.loading.dismiss();
        }, error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B106");
        });
      }
      else {
        let toast = this.toastCtrl.create({
          message: "To change password, Please update phone number first.",
          duration: 10000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.navCtrl.pop();
      }
      this.loading.dismiss();
    }
    else {
      this.requiredEqupassword = true;
    }
  }

  deletesession() {
    this.http.get(this.funct.ipaddress2 + 'service001/setSessionExpire?profileKey=' + this.userData.syskey + '&sessionKey=' + this.userData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("status change == " + JSON.stringify(data));
      this.alertPopup = this.alert.create({
        cssClass: this.font,
        message: 'You need to Log in again?',
        enableBackdropDismiss: false,
        buttons: [{
          text: "OK",
          cssClass: '',
          handler: () => {
            this.storage.set('b2bregData', true);
            this._zone.run(() => {
              this.navCtrl.setRoot(LogInPage);
            });
            this.isAlert = false;
          }
        }]
      })
      this.alertPopup.present();
      this.isAlert = true;
    }, error => {
      this.getError(error, "B107");
    });
  }

  getError(error, status) {
    /*ionic App error
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
    // this.loading.dismiss();
    console.log("Oops!");
  }

  editProfile() {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
    console.log("this profile == " + this.profile);
    if (this.profile != '' || this.profile != undefined) {
      let photoName = this.profile.split("/").pop();
      var type;

      // type = '';
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

    // this.loading = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   dismissOnPageChange: true
    // });
    // this.loading.present();

    this.registerData.t16 = this.profile.split("/").pop();
    let params = {
      person: {
        syskey: this.registerData.syskey,
        t1: this.phoneNo,               // phone Number
        t2: this.registerData.t2,            // UserName
        t3: this.registerData.t3,                  // email
        t4: this.funct.appID,     // appID
        t5: this.registerData.t5,      // deviceID
        t6: this.registerData.t6,        // state Name (Eng)
        t7: this.registerData.t7,                   // state Name (Myan)
        t8: this.registerData.t8,                   // township Name (Eng)
        t9: this.registerData.t9,                   // township Name (Myan)
        t10: this.registerPassword.newPw,                  // password
        t11: this.gender,                  // gender
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
        this.navCtrl.popTo(this.navCtrl.getByIndex(1));
      }
      this.loading.dismiss();
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B130");
      this.loading.dismiss();
    });
  }
}
