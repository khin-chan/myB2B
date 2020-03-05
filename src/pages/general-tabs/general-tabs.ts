import { Component , NgZone } from '@angular/core';
import { NavController ,ToastController , Platform , Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';

import { GeneralPage } from '../general/general';
import { VideoPage } from '../video/video';
import { SettingsPage } from '../settings/settings';
import { BvPage } from '../bv/bv';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';
import { SuperTabsController } from '../../providers/super-tabs-controller';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

/**
 * Generated class for the GeneralTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-general-tabs',
  templateUrl: 'general-tabs.html',
  providers: [ChangelanguageProvider]
})
export class GeneralTabsPage {

  tab1Root = GeneralPage ;
  tab2Root = VideoPage;
  tab3Root = BvPage;
  changeicon : any = 'md-add';
  textMyan : any = ["အထွေထွေ","ဗီဒီယို","Brand Voice"];
  textEng : any = ["General","Video","Brand Voice"];
  textData : any = [];
  font : any ;
  pageTitle: any;
  noticount:any = 0;
  registerData:any;
  isAdmin :any;
  notiStatus:any;

  constructor(private superTabsCtrl: SuperTabsController,public navCtrl: NavController,public sqlite:SQLite,
              public changeLanguage : ChangelanguageProvider,public storage:Storage,public toastCtrl:ToastController,
              public http: Http,public funct:FunctProvider, public platform:Platform,public events:Events,
              private appMinimize: AppMinimize,public cdata:DatacleanComponent) {

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
      this.updateNotiCount();
      this.menuCount();
      console.log("registerData = "+JSON.stringify(this.registerData));
    });
    
  }

  ionViewDidEnter(){
    this.events.subscribe('notiStatus', status => {
      console.log("notistatus "+status);
      this.notiStatus = status;
    })
    this.backButtonExit();
  }

  goNotiList(){
    //this.navCtrl.push(NotiListPage);
  }

  menuCount(){
    let parameter={
      t1:this.registerData.t1,
      t3:"General",
      sessionKey:this.registerData.sessionKey,
      userSyskey:this.registerData.syskey,
      n3: 1,
    }
    this.http.post(this.funct.ipaddress2+'serviceAppHistory/saveType',parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if(result.state){
        console.log("general success menuCount >>>>>>>>");
      }
      else if(!result.sessionState){
        this.cdata.sessionAlert();
      }
      else{
        console.log("general unsuccess menuCount >>>>>>>>");
      }
    },
        error => {
          this.getError(error,"B108");
        });
  }

  updateNotiCount(){
    this.sqlite.create({
      name:"b2b.db",
      location:"default"
    }).then((db) =>{
      db.executeSql("UPDATE notiCount SET count = 0 WHERE type = 'general'",[]).then((data) => {
      console.log("update data successfully", data);
      this.events.publish('generalCount', 0);
      }, (error) => {
        console.error("Unable to update data", error);
      });
    });
   }

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

  getSettings(){
    this.navCtrl.push(SettingsPage);
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
      msg = "Can't connect right now. [" + code + ' - '+ status + "]";
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralTabsPage');
  }

}
