import { Component } from '@angular/core';
import { NavController, NavParams , Platform ,ToastController ,Events ,PopoverController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppMinimize } from '@ionic-native/app-minimize';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';

import { SettingsPage } from '../settings/settings';
import { WriterListDetailPage } from '../writer-list-detail/writer-list-detail';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

/**
 * Generated class for the WriterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-writer',
  templateUrl: 'writer.html',
  providers: [ChangelanguageProvider]
})
export class WriterPage {

  font : any ;
  textMyan : any = ["ရေးသားသူများ","ဒေတာ မရှိပါ။"];
  textEng : any = ["Writer","Not Result found"];
  textData : any = [];
  nores :any;
  registerData:any;
  start:any = 0;
  end:any = 0;
  menuList:any;
  noticount:any;
  isLoading:any;
  imageLink : any;
  notiStatus:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public platform:Platform,
              public storage:Storage,
              public toastCtrl: ToastController,
              public http: Http,private appMinimize: AppMinimize,
              public funct:FunctProvider,public cdata:DatacleanComponent,
              public changeLanguage : ChangelanguageProvider,
              public events : Events) {
    this.imageLink = this.funct.imglink+"upload/image/WriterImage";
    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font,this.textEng,this.textMyan).then((data) => {
        this.textData = data;
        if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language="+JSON.stringify(data));
      });
    });    

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      this.menuCount();
      console.log("registerData = "+JSON.stringify(this.registerData));
      this.start = 0;
      this.end = 0;
      this.menuList = [];
      this.getWtriterList(this.start,'');
    });

    //this.backButtonExit();
  }

  menuCount(){
    let parameter={
      t1:this.registerData.t1,
      t3:"Writer",
      sessionKey:this.registerData.sessionKey,
      userSyskey:this.registerData.syskey,
      n3: 1,
    }
    this.http.post(this.funct.ipaddress2+'serviceAppHistory/saveType',parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if(result.state){
        console.log("Writer success menuCount >>>>>>>>");
      }
      else if(!result.sessionState){
        this.cdata.sessionAlert();
      }
      else{
        console.log("Writer unsuccess menuCount >>>>>>>>");
      }
    },
        error => {
          this.getError(error,"B108");
        });
  }

  ionViewDidEnter(){
    this.events.subscribe('notiStatus', status => {
      console.log("notistatus "+status);
      this.notiStatus = status;
    });
    this.backButtonExit();
  }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }

  goNotiList(){
    //this.navCtrl.push(NotiListPage);
  }

  getWtriterList(start,infiniteScroll){
    this.isLoading = true;
    this.end = this.end + 10;
    let parameter = {
      start:start,
      end: this.end  
    }
    console.log("request list =" + JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2+"serviceContent/getContentWriterList?sessionKey="+this.registerData.sessionKey+"&syskey="+this.registerData.syskey, parameter).map(res => res.json()).subscribe(result => {
      console.log("response list =" + JSON.stringify(result));

      if(result.data.length>0){
        this.nores = 1;
        this.menuList = result.data;
      }
      else{
        this.nores = 0;
        this.isLoading = false;
      }

      this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.nores = 0;
      this.isLoading = false;
      this.getError(error,"B120");
    });
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
    this.isLoading = false;
    // this.loading.dismiss();
    console.log("Oops!");
  }
  

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end+1;
        this.getWtriterList(this.start,infiniteScroll);
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    })
  }

  getSettings(){
    this.navCtrl.push(SettingsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WriterPage');
  }

  viewService(i){
  this.navCtrl.push(WriterListDetailPage,{
    viewData:i
  });
  }
}
