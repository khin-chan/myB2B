import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, Events, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { FCM } from '@ionic-native/fcm';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { UserRegistrationPage } from '../user-registration/user-registration';
import { LogInPage } from '../log-in/log-in';
import { TabsPage } from '../tabs/tabs';
import { OtpConfrimPage } from '../otp-confrim/otp-confrim';

/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export const myConst = {
  blackboardApp: {
    ios: {
      storeUrl: 'itms-apps://itunes.apple.com/us/app/b2b-myanmar/id1437220641?ls=1&mt=8',
      appId: 'B2B Myanmar://'
    },
    android: {
      storeUrl: 'https://play.google.com/store/apps/details?id=com.b2bsite.siteb2b',
      appId: 'B2B Myanmar//'
    }
  }
}
//declare var window;

@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  providers: [FunctProvider, ChangelanguageProvider]
})
export class RegistrationPage {

  alertPopup: any;
  version: any;
  textMyanmar: any = ["B2B Myanmar မှ ကြိုဆိုပါသည်။", "အသုံးပြုရန်အတွက် အကောင့်တစ်ခု လိုအပ်ပါသည်။", "အကောင့်ဖွင့်ပြီးသား ဖြစ်ပါက"];
  textEnglish: any = ["Welcome to B2B Myanmar", "To use Necessary Account", " Account Already Exis"];
  textResult: any = [];
  txtfont: any = '';
  status: any;
  loading: any;
  token: any = '';
  userData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController,
    public menuCtrl: MenuController, public screenOrientation: ScreenOrientation, public http: Http,
    public platform: Platform, public funct: FunctProvider, public events: Events,
    public storage: Storage, public changeLanguage: ChangelanguageProvider, private _zone: NgZone,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public fcm: FCM) {

    this.status = this.navParams.get('status');

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textEnglish, this.textMyanmar).then((data) => {
        this.textResult = data;
        if (font != "zg")
          this.txtfont = 'uni';
        else
          this.txtfont = font;
        console.log("data font language=" + JSON.stringify(data));
      });
    });


    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.menuCtrl.swipeEnable(false);
    this.version = this.funct.version;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  ionViewDidEnter() {
    this.backButtonExit();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      if (this.status == 1) {
        this.navCtrl.pop();
      }
      else {
        this.platform.exitApp();
      }
    });
  }

  checkMobileVersion() {
    if (this.platform.is('android')) {
      window.open(myConst.blackboardApp.android.storeUrl, '_system');
    }
    else {
      window.open(myConst.blackboardApp.ios.storeUrl, '_system');
    }
  }

  accountLogin() { //atda
    this.navCtrl.push(OtpConfrimPage);
  }

  OnLogin() {
    this.navCtrl.push(LogInPage);
  }

  /* checkRegisterData(phone) {
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
                    this.events.publish('registerlogin', data.t16);
                    this._zone.run(() => {
                      this.navCtrl.setRoot(TabsPage);
                    });

                  }
                });
              }
              else {
                this.storage.set('b2bregData', data);
                this.events.publish('registerlogin', data.t16);
                //this.navCtrl.setRoot(TabsPage);
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

  getError(error, status) {
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
      //  showCloseButton: true,
      dismissOnPageChange: true,
      // closeButtonText: 'OK'
    });
    toast.present(toast);
    this.loading.dismiss();
    console.log("Oops!");
  } */
}
