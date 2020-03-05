import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { LogInPage } from '../log-in/log-in';

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
  providers: [ChangelanguageProvider]
})
export class ForgetPasswordPage {
  registerPassword: any = { newPw: '', confirmPw: '' };
  textMyan: any = ["လုပ်ဆောင်ချက်များပြီးဆုံးပါတော့မည်။", "သင်၏ အကောင့်ကို လျို့ဝှက်နံပါတ်ဖြင့် အဆင့်မြှင့်ရန်", "လျို့ဝှက်နံပါတ် အသစ်ထည့်ရန်", "အတည်ပြု လျို့ဝှက်နံပါတ်", "ပယ်ဖျက်ရန်", "သိမ်းမည်", "လျို့ဝှက်နံပါတ် တူညီမှုရှိရပါမည်။"];
  textEng: any = ["You're almost done", "Secure your account with a password", "NEW PASSWORD", "CONFIRM PASSWORD", "Cancel", "Update", "Do Not Match Password"];
  textData: any = [];
  font: any;
  loading: any;
  phone: any;
  isAlert: any = false;
  alertPopup: any;
  requiredEqupassword: any = false;
  registerData: any;
  syskey: any;
  sessionKey: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public funct: FunctProvider, public alert: AlertController, private _zone: NgZone,
    public http: Http, public storage: Storage, public platform: Platform,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public changeLanguage: ChangelanguageProvider) {

    this.phone = this.navParams.get("data");
    this.syskey = this.navParams.get("syskey");
    this.sessionKey = this.navParams.get("sessionKey");

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
      console.log("Active Page=" + this.navCtrl.getActive().name);
      if (this.isAlert) {
        //this.alertPopup.dismiss();
        // this.isAlert = false;
      }
      else
        this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
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

      var paremeter = {
        t1: this.phone,
        t10: this.registerPassword.newPw
      };
      console.log("request forget password = ", JSON.stringify(paremeter));
      this.http.post(this.funct.ipaddress2 + 'service001/changeRegPassword', paremeter).map(res => res.json()).subscribe(result => {
        console.log("response forget password = ", JSON.stringify(result));
        if (result.state) {
          this.deletesession();
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Failed reset password.",
            duration: 5000,
            position: 'bottom',
            dismissOnPageChange: true,
          });
          toast.present(toast);
        }

        this.loading.dismiss();
      }, error => {
        console.log("signin error=" + error.status);
        this.getError(error, "B106");
      });
    }
    else {
      console.log("this.registerPassword.newPw == " + this.registerPassword.newPw);
      console.log("this.registerPassword.confirmPw == " + this.registerPassword.confirmPw);
      this.requiredEqupassword = true;
    }
  }

  deletesession() {
    this.http.get(this.funct.ipaddress2 + 'service001/setSessionExpire?profileKey=' + this.syskey + '&sessionKey=' + this.sessionKey).map(res => res.json()).subscribe(data => {
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
