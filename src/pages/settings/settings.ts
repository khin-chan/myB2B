import { Component } from '@angular/core';
import { NavController, NavParams , AlertController , Platform , ToastController,Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';

import { EditPage } from '../edit/edit';
import { SubSettingsPage } from '../sub-settings/sub-settings';
import { LogInPage } from '../log-in/log-in';
import { RegistrationPage } from '../registration/registration';

//import { Language } from '../language/language';
/**
 * Generated class for the SettingsPage page.
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
declare var window;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [ChangelanguageProvider,FunctProvider]
})
export class SettingsPage {

  exit :any = false;
  textmyan : any = ["ကိုယ်ရေးအချက်အလက်","ဆက်တင်များ","ထွက်ခွာရန်","ဗားရှင်း","Expire"];
  items: any = [{name:"ကိုယ်ရေးအချက်အလက်",icon:"ios-person",img: '',key:0,color:'#FFFFFF'},
                {name:"ဆက်တင်များ",icon:"ios-cog",img: '',key:2,color:'#FFFFFF'},
                {name:"ထွက်ခွာရန်",icon:"md-log-out",img: '',key:3,color:'#FFFFFF'},
                {name:"ဗားရှင်း ",icon:"ios-flag",img: '',key:4,color:'#FFFFFF'},]; 
  textmyantitle : any = ["ပြင်ဆင်ခြင်း","ဤနေရာတွင် သင်၏ ကိုယ်ရေးအချက်အလက်များကို ပြင်ဆင်နိုင်ပါသည်။"];
  font : any;
  version : any;
  isAlert : any = false;
  alertPopup : any;
  registerData:any;
  isLoading:any = false;
  premiumUser : any = false;
  premiumExpiredate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController,
              public storage:Storage,public http: Http,public sqlite:SQLite,public events:Events,
              public changeLanguage : ChangelanguageProvider,private appMinimize: AppMinimize,
              public funct:FunctProvider,public alert: AlertController,public platform:Platform) {

    this.version = this.funct.version;   

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = "+JSON.stringify(this.registerData));
      this.checkBillStatus();
    });

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font,this.textmyan,this.textmyan).then((data) => {
        for (let j = 0; j <  this.items.length;j++) {
          this.items[j].name = data[j];
          console.log("name == "+this.items[j].name);
          if(j == 3){
            console.log("version name == "+this.items[j].name);
            this.items[j].name = this.items[j].name +" "+ this.funct.version;
          }          
        }
        if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language="+JSON.stringify(data));
        this.changeLanguage.changelanguage(font,this.textmyantitle,this.textmyantitle).then((res) => {
          this.textmyantitle = res;
        });
      });
    });

  }

  ionViewDidEnter(){
    this.backButtonExit();
  }

  itemTapped(data){
    if(data.key == 0){
      this.navCtrl.push(EditPage);
    }
    else if(data.key == 2){
      this.navCtrl.push(SubSettingsPage);
    }
    else if(data.key == 3){
     this.alertPopup = this.alert.create({
        cssClass:this.font,
        message:'ထွက်ခွာရန်သေချာပါသလား?',
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
            this.cleanCache();            
          }
        }]
      })
      this.alertPopup.present();
      let doDismiss = () => this.alertPopup.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.alertPopup.onDidDismiss(unregBackButton);
    }
    else if(data.key == 4){
      this.checkMobileVersion();
    }
    else if(data.key == 5){
     
    }
  }
  
  checkMobileVersion(){
    if (this.platform.is('android')) {
      window.open(myConst.blackboardApp.android.storeUrl, '_system');
    }
    else{
      window.open(myConst.blackboardApp.ios.storeUrl, '_system');
    }
  
    }

    checkBillStatus(){
      this.http.get(this.funct.ipaddress2 + 'service001/checkValidPayment?syskey='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(data =>{
        console.log("setting billmethod response == "+JSON.stringify(data));
        if(data.state == true){
          this.storage.set('billStatus',true);  
          this.events.publish('billStatus', true);  
          this.premiumUser = true;
          this.premiumExpiredate = this.funct.getTransformDate(data.todate);
          console.log("this.premiumExpiredate == "+JSON.stringify(this.premiumExpiredate));
          this.items.push({name:"Premium Expire Date:" +" "+ this.premiumExpiredate, icon:"", img: 'assets/images/expired-time.png', key:5, color:'#FFFFFF'});
        }
        else{
          this.storage.set('billStatus',false);    // tempory
          this.events.publish('billStatus', false);
          this.premiumUser = false;
          console.log("Bill service error!!! return state false.");        
        }
      }, error => {
        this.storage.set('billStatus',false);    // tempory
        this.events.publish('billStatus', false);
        this.premiumUser = false;
        this.getError(error,"B101");
      });
    }
    
    cleanCache(){      
      this.http.get(this.funct.ipaddress2 + 'service001/setSessionExpire?profileKey='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(data =>{
        console.log("status change == "+ JSON.stringify(data));
        this.cleanData();             
      }, error => {
        this.getError(error,"B107");
      });    
    }

  getError(error,status){
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
    
    let msg ='';
    if(code == '005'){
      msg = "Please check internet connection!";
    }
    else{
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
    this.isLoading = false;
    // this.loading.dismiss();
    console.log("Oops!");
  }

  cleanData(){
    
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
                        db.executeSql("DELETE FROM myNoti", []).then((data) => {      // clean chat data
                          console.log("Delete chatData data successfully", data);
                          this.storage.remove('b2bregData'); 
                          this.storage.set('b2bregData',true);     
                          this.navCtrl.setRoot(RegistrationPage);   
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

 backButtonExit(){
  this.platform.registerBackButtonAction(() => {
    console.log("Active Page=" + this.navCtrl.getActive().name);
    //this.platform.exitApp();
    this.appMinimize.minimize();
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
