import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { ForgetPasswordPage } from '../forget-password/forget-password';
import { OtpConfrimPage } from '../otp-confrim/otp-confrim';
import { OtpCodeConfrimPage } from '../otp-code-confrim/otp-code-confrim';
/**
 * Generated class for the ConfrimPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-confrim-phone',
  templateUrl: 'confrim-phone.html',
  providers: [ChangelanguageProvider]
})
export class ConfrimPhonePage {
  textMyan: any = ["လုပ်ဆောင်ချက်များပြီးဆုံးပါတော့မည်။", "သင်၏ ဖုန်းနံပါတ် ဟုတ်ပါသလား?", "လျို့ဝှက်နံပါတ် အသစ်ထည့်ရန်", "အတည်ပြု လျို့ဝှက်နံပါတ်", "ပယ်ဖျက်ရန်", "သေချာပါသည်", "လျို့ဝှက်နံပါတ် တူညီမှုရှိရပါမည်။", "လျို့ဝှက်နံပါတ်ပြောင်းရန်"];
  textEng: any = ["You're almost done", "Secure your account with a password", "NEW PASSWORD", "CONFIRM PASSWORD", "Cancel", "Update", "Change Password"];
  textData: any = [];
  font: any;
  phone: any;
  loading: any;
  registerPassword: any = { newPw: '', confirmPw: '' };
  passPageStatus: any;
  registerData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public funct: FunctProvider, public alert: AlertController, private _zone: NgZone,
    public http: Http, public storage: Storage, public platform: Platform,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public changeLanguage: ChangelanguageProvider) {

    this.phone = this.navParams.get("data");
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfrimPhonePage');
  }

  OnConfirmPhone() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
    var paremeter = { t1: this.phone };
    console.log("request confirm password = ", JSON.stringify(paremeter));
    this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/checkExistPhno', paremeter).map(res => res.json()).subscribe(result => {
      console.log("response confirm password for checkexistphono = ", JSON.stringify(result));
      this.registerData = result;
      console.log("checkexistphono this.registerData = ", JSON.stringify(this.registerData));
      if (result.syskey > 0) {
        this.goSMSPoh(this.phone);
        // this._zone.run(() => {
        //   this.navCtrl.push(OtpCodeConfrimPage, { phoneNo: this.phone, pageStatus: this.passPageStatus, type: 'phone' });
        // });
      }
      else {
        let toast = this.toastCtrl.create({
          // message: "Did not match phone number.",
          message: "Account doesn't exist, Please register!",
          duration: 10000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this._zone.run(() => {
          this.navCtrl.push(OtpConfrimPage);
        });
      }
      this.loading.dismiss();
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B103");
    });
  }

  goSMSPoh(phone) {

    // console.log('SMSpoh phone>>' + JSON.stringify(phone));

    // this.loading = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   dismissOnPageChange: true,
    // });
    // this.loading.present();

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
        this._zone.run(() => {
          this.navCtrl.push(OtpCodeConfrimPage, { phoneNo: this.phone, pageStatus: this.passPageStatus, type: 'phone' , syskey: this.registerData.syskey, sessionKey: this.registerData.sessionKey });
        });
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

  Oncancel() {
    this.navCtrl.pop();
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
      //  showCloseButton: true,
      dismissOnPageChange: true,
      // closeButtonText: 'OK'
    });
    toast.present(toast);
    this.loading.dismiss();
    // this.loading.dismiss();
    console.log("Oops!");
  }

}
