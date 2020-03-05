import { Component , NgZone } from '@angular/core';
import { NavController ,ToastController , Platform , Events , AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';

import { HomePage } from '../home/home';
import { VideoPage } from '../video/video';
import { SettingsPage } from '../settings/settings';
import { NotiPage } from '../noti/noti';
import { BvPage } from '../bv/bv';
import { FilterPage } from '../filter/filter';
import { RegistrationPage } from '../registration/registration';
import { MobilePostTypePage } from '../mobile-post-type/mobile-post-type';
import { MobilePostListPage } from '../mobile-post-list/mobile-post-list';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';
import { SuperTabsController } from '../../providers/super-tabs-controller';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

@Component({
  templateUrl: 'tabs.html',
  providers: [ChangelanguageProvider]
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = VideoPage;
  tab3Root = BvPage;
  changeicon : any = 'md-add';
  textMyan : any = ["ပင်မစာမျက်နှာ","ဗီဒီယို","Brand Voice"];
  textEng : any = ["Home","Video","Brand Voice"];
  textData : any = [];
  font : any ;
  pageTitle: any;
  notiCount:any = 0;
  registerData:any;
  isAdmin :any;
  notiStatus:any;
  db:any;
  sessionPopup:any;
  valid:any=false;
  premiumUser : any = false;
  
  constructor(private superTabsCtrl: SuperTabsController,public navCtrl: NavController,
              public changeLanguage : ChangelanguageProvider,public storage:Storage,
              public sqlite:SQLite,private appMinimize: AppMinimize,public alert: AlertController,
              public http: Http,public funct:FunctProvider, public platform:Platform,
              public events:Events,public toastCtrl:ToastController,public badge:Badge,
              public cdata:DatacleanComponent) {

      this.sqlite.create({
        name:"b2b.db",
        location:"default"
      }).then((db) =>{
        this.db = db;
      });

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font,this.textEng,this.textMyan).then((data) => {
        this.textData = data;
        this.pageTitle = this.textData[0];
        if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language="+JSON.stringify(data));
      });
    });

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = "+JSON.stringify(this.registerData));

      this.updateNotiCount();
      this.selectCommentNoti();
      this.checkBillStatus();
      this.menuCount();      
      
      if(this.registerData.n2==0){
        this.valid=true;
      }else{
        this.valid=false;
      }
        this.storage.get('refreshToken').then((token) => {
          console.log("tab page token == "+token);
          if(token != null || token != undefined)
          this.sendRegistrationToServer(token);
        });
    }); 

    this.events.subscribe('notiCount',data => {
      console.log("noticount "+data);
      this.notiCount = data;
    })
        
    this.events.subscribe('notiStatus', status => {
      console.log("notistatus "+status);
      this.notiStatus = status;
    })
  }
  
  sendRegistrationToServer(token){
   let parameter = {
      t14: token,
      syskey : this.registerData.syskey, 
      sessionKey:this.registerData.sessionKey
    };
    this.http.post(this.funct.ipaddress2+'service001/updateRegToken',parameter).map(res => res.json()).subscribe(result => {
         console.log("updateRegID=" + JSON.stringify(result));
         if(result.state){
           console.log("success token refresh");
           this.storage.remove("refreshToken");
         }
         else{
           let toast = this.toastCtrl.create({
             message: result.errMsg,
             duration: 5000,
             position: 'bottom',                    
             //  showCloseButton: true,
             dismissOnPageChange: true,
             // closeButtonText: 'OK'
           });
           toast.present(toast);
         }

       },
        error => {
          this.getError(error,"B102");
        });    
  }

  goNotiList(){
    this.navCtrl.push(NotiPage);
  }

  checkBillStatus(){
    this.http.get(this.funct.ipaddress2 + 'service001/checkValidPayment?syskey='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(data =>{
      console.log("tabs billmethod response == "+JSON.stringify(data));
      if(data.state == true){
        this.storage.remove('billStatus');
        this.storage.set('billStatus',true);  
        this.events.publish('billStatus', true);  
        this.premiumUser = true;
        console.log("tabs this.premiumUser == " + JSON.stringify(this.premiumUser));
      }
      else{
        //this.storage.set('billStatus',false);
        this.storage.remove('billStatus');
        this.storage.set('billStatus',false);    // tempory
        this.events.publish('billStatus', false);
        this.premiumUser = false;
        console.log("Bill service error!!! return state false.");        
      }
    }, error => {
      this.storage.remove('billStatus');
      this.storage.set('billStatus',false);    // tempory
      this.events.publish('billStatus', false);
      this.premiumUser = false;
      this.getError(error,"B101");
    });
  }


  ionViewDidEnter(){          
    this.backButtonExit();
  }

  menuCount(){
    let parameter={
      t1:this.registerData.t1,
      t3:"Home",
      sessionKey:this.registerData.sessionKey,
      userSyskey:this.registerData.syskey,
      n3 : 1,
    }
    this.http.post(this.funct.ipaddress2+'serviceAppHistory/saveType',parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if(result.state){
        console.log("Home success menuCount >>>>>>>>");
      }
      else if(!result.sessionState){
        this.cdata.sessionAlert();
      }
      else{
        console.log("Home unsuccess menuCount >>>>>>>>");
      }
    },
      error => {
        this.getError(error,"B108");
      });        
  }

  updateNotiCount(){    
    this.db.executeSql("UPDATE notiCount SET count = 0 ",[]).then((data) => {
      console.log("update data successfully", data);
      this.events.publish('homeNoti', 0);
      }, (error) => {
        console.error("Unable to update data", error);
      });
   }

   selectCommentNoti(){
    this.db.executeSql( "SELECT COUNT(*) as Noticount FROM myNoti WHERE noticountstatus=1",[]).then((data)=>{
      console.log('Successful in noti.ts');
       console.log('Execute SQL in noti.ts >> ', JSON.stringify(data));
       //this.data = data;
       console.log("length == "+ data.rows.length);
       if(data.rows.length>0)
       {
         console.log('for loop in noti.ts == '+data.rows.item(0).Noticount);
         this.events.publish('notiCount',data.rows.item(0).Noticount);  
     }
     else{
           console.log("False");
        }
    }, (error) => {
      console.error("Unable to select data", error);
    });
  }

  //  sessionAlert(){
  //   this.sessionPopup =this.alert.create({
  //     subTitle: 'Your session is time out or your account is already used. So you need to log out.',
  //     cssClass:this.font,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Ok',
  //         handler: data => {
  //           this.cleanData();                  
  //         }
  //       }
  //     ]
  //   });
  //     this.sessionPopup.present(); 
  //     let doDismiss = () => this.sessionPopup.dismiss();
  //     let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
  //     this.sessionPopup.onDidDismiss(unregBackButton);  
  
  // }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }

  hideToolbar() {
    this.superTabsCtrl.showToolbar(false);
  }

  showToolbar() {
    this.superTabsCtrl.showToolbar(true);
  }

  onTabSelect(ev: any) {
  //  this.navCtrl.push(Chat);
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    if(ev.index == 0)
      this.pageTitle = this.textData[0];
    else if(ev.index == 1)
      this.pageTitle = this.textData[1];
    else if(ev.index == 2)
      this.pageTitle = this.textData[2];
  }

  goFilter(){
    this.navCtrl.push(FilterPage);
  }
  
  getError(error,status){
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
    // this.loading.dismiss();
    console.log("Oops!");
  }

  getSettings(){
    this.navCtrl.push(SettingsPage);
  }

  goAddPost(){
    this.navCtrl.push(MobilePostTypePage);
  }
  
  goPost(){
    this.navCtrl.push(MobilePostListPage);
    }
}
