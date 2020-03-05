import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';

import { ChangePasswordPage } from '../change-password/change-password';
import { FirstStepPage } from '../first-step/first-step';
import { PopoverLanguagePage } from '../popover-language/popover-language';
/**
 * Generated class for the SubSettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sub-settings',
  templateUrl: 'sub-settings.html',
  providers: [ChangelanguageProvider]
})
export class SubSettingsPage {
  textmyan: any = ["အကောင့်ဖျက်ရန်", "လျို့ဝှက်နံပါတ်ပြောင်းရန်", "ဖောင့်အမျိုးအစား", "ကိုယ်ရေးအချက်အလက်မူဝါဒ"];  /*"လျို့ဝှက်နံပါတ်ပြောင်းရန်", ဘာသာစကား*/
  textmyantitle: any = ["ဆက်တင်များ"];
  items: any = [{ name: "Deactivate Account", icon: "ios-trash-outline", key: 0 },
  { name: "Change Password", icon: "ios-key-outline", key: 1 },
  { name: "Change Language", icon: "ios-globe-outline", key: 2 },
                /*{name:"Privacy Policy",icon:"ios-unlock-outline",key:3}*/];
  font: any;
  userDate: any;
  loading: any;
  isAlert: any = false;
  alertPopup: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController,
    public sqlite: SQLite, public storage: Storage, public changeLanguage: ChangelanguageProvider, public funct: FunctProvider,
    public platform: Platform, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.storage.get('b2bregData').then((data) => {
      this.userDate = data;

    });
    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textmyan, this.textmyan).then((data) => {
        for (let j = 0; j < this.items.length; j++) {
          this.items[j].name = data[j];
        }
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language=" + JSON.stringify(data));
        this.changeLanguage.changelanguage(font, this.textmyantitle, this.textmyantitle).then((res) => {
          this.textmyantitle = res;
        });
      });
    });
    this.backButtonExit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubSettingsPage');
  }

  clickItem(item) {
    if (item == 0)
      this.deactivateAcc();
    else if (item == 1)
      this.changePassword();
    else if (item == 2)
      this.changeLan();
  }

  deactivateAcc() {
    this.alertPopup = this.alert.create({
      cssClass: this.font,
      message: 'အကောင့်ဖျက်ရန်သေချာပါသလား?',
      buttons: [
        {
          text: "ပယ်ဖျက်ရန်",
          cssClass: 'alertButton',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: "သေချာပါသည်",
          cssClass: 'alertButton',
          handler: () => {
            this.deactivateService();
          }
        }
      ]
    })
    this.alertPopup.present();
    let doDismiss = () => this.alertPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.alertPopup.onDidDismiss(unregBackButton);
  }

  changePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }

  changeLan() {
    this.navCtrl.push(PopoverLanguagePage);
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  deactivateService() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      //   duration: 3000
    });
    this.loading.present();
    console.log(" userData syskey == " + this.userDate.syskey);

    var paremeter = {
      t1: this.userDate.t1,
      syskey: this.userDate.syskey,
      sessionKey: this.userDate.sessionKey
    };
    console.log("request deactivateUser = ", JSON.stringify(paremeter));
    this.http.post(this.funct.ipaddress2 + 'service001/deactivateRegUser', paremeter).map(res => res.json()).subscribe(result => {
      console.log("response deactivateUser = ", JSON.stringify(result));
      if (result.state) {
        this.http.get(this.funct.ipaddress2 + 'service001/setSessionExpire?profileKey=' + this.userDate.syskey + '&sessionKey=' + this.userDate.sessionKey).map(res => res.json()).subscribe(data => {
          console.log("status change == " + JSON.stringify(data));
          this.cleanData();
        }, error => {
          this.getError(error, "B107");
        });
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Failed deactivate user.",
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK'
        });
        toast.present(toast);
      }
      this.loading.dismiss();
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B133");
    });
  }

  getError(error, status) {
    /* ionic App error
     ............001) url link worng, not found method (404)
     ........... 002) server not response (500)
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

  cleanData() {
    this.sqlite.create({
      name: "b2b.db",
      location: "default"
    }).then((db) => {

      db.executeSql("DELETE FROM b2bData", []).then((data) => {      // clean home data
        console.log("Delete home data successfully", data);
        db.executeSql("DELETE FROM news", []).then((data) => {      // clean news data
          console.log("Delete news data successfully", data);
          db.executeSql("DELETE FROM business", []).then((data) => {      // clean business data
            console.log("Delete business data successfully", data);
            db.executeSql("DELETE FROM video", []).then((data) => {       // clean video data
              console.log("Delete video data successfully", data);
              db.executeSql("DELETE FROM leadership", []).then((data) => {      // clean leadership data
                console.log("Delete leadership data successfully", data);
                db.executeSql("DELETE FROM innovation", []).then((data) => {     // clean innovation data
                  console.log("Delete innovation data successfully", data);
                  db.executeSql("DELETE FROM general", []).then((data) => {     // clean general data
                    console.log("Delete general data successfully", data);
                    db.executeSql("DELETE FROM investment", []).then((data) => {    // clean investment data
                      console.log("Delete investment data successfully", data);
                      db.executeSql("DELETE FROM bvData", []).then((data) => {      // clean bv data
                        console.log("Delete bvData data successfully", data);
                        db.executeSql("DELETE FROM chatData", []).then((data) => {      // clean chat data
                          console.log("Delete chatData data successfully", data);
                          this.storage.remove('b2bregData');
                          this.storage.remove('billStatus');
                          this.navCtrl.setRoot(FirstStepPage);
                        }, (error) => {
                          console.error("Unable to delete chatData data", error);
                        });
                      }, (error) => {
                        console.error("Unable to delete bvData data", error);
                      });
                    }, (error) => {
                      console.error("Unable to delete investment data", error);
                    });
                  }, (error) => {
                    console.error("Unable to delete general data", error);
                  });
                }, (error) => {
                  console.error("Unable to delete innovation data", error);
                });
              }, (error) => {
                console.error("Unable to delete leadership data", error);
              });
            }, (error) => {
              console.error("Unable to delete video data", error);
            });
          }, (error) => {
            console.error("Unable to delete business data", error);
          });
        }, (error) => {
          console.error("Unable to delete news data", error);
        });
      }, (error) => {
        console.error("Unable to delete home data", error);
      });

    }, (error) => {
      console.error("Unable to open database", error);
    });
  }
}
