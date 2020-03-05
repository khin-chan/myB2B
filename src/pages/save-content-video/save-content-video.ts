import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { NavController, NavParams, AlertController , PopoverController, ViewController, Platform,ToastController,Events, LoadingController } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { WriterprofilePage } from '../writerprofile/writerprofile';

/**
 * Generated class for the SaveContentVideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-save-content-video',
  templateUrl: 'save-content-video.html',
  providers: [ChangelanguageProvider]
})
export class SaveContentVideoPage {
  
  @ViewChild(Content) content: Content;
  @ViewChild('videoPlayer') videoplayer: any;
  rootNavCtrl: NavController;
   pageStatus: any;
   registerData : any;
   popover: any;
   start : any = 0;
   end : any = 0;
   nores : any;
   isLoading : any;
   url:any ='';
   menuList : any = [];
   font : any ;
   textMyan : any = ["ဗီဒီယို","ကြိုက်တယ်","မှတ်ချက်","ဝေမျှမည်","ဒေတာ မရှိပါ။","ကြည့်ရန်","ခု"];
   textEng : any = ["Video", "Like","Comment","Share","No result found","View","Count"];
   textData : any = [];
   videoLink: SafeResourceUrl;
   photoLink : any;
   noticount:any ;
   db:any;
   videoData:any=[];
   vData:any=[];
   img:any ='';

   youtubeurl: any = [];
  index: any;
  sContent: any;
   mDate: any;
   mTime: any;
   ulink: any;
   sLike: any;
   sCmt: any;
   lCount: any;
   onscroll: boolean = false;
  ind: any = 0;
  sread: any;
  para: any;

  scrTop: number=0;
  moreVdo: any = '';
  disabled: boolean = false;
  selectedTheme: String;
  passData:any;
  vLink:any;
  backcolor: string='#000000';
  buttonColor: string = '#000000';
  writerImg:any;

  constructor( public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public platform:Platform,
               public storage:Storage,
               public toastCtrl: ToastController,
               public http: Http,
               public funct:FunctProvider,public alert: AlertController,
               public changeLanguage : ChangelanguageProvider,
               public events : Events,
               public sanitizer: DomSanitizer,public sqlite:SQLite) {
    this.passData = this.navParams.get("url");
     this.vLink = this.funct.imglink+"upload/video/";
     this.writerImg = this.funct.imglink+"upload/image/WriterImage";
     
     console.log("video detail == "+JSON.stringify(this.passData));
     if(this.passData !='' && this.passData !='undefined' && this.passData !=null){
       if(this.passData.t8 !='' && this.passData.n10 ==1){
         this.ulink = this.passData.t8.changingThisBreaksApplicationSecurity;
       }
       else if(this.passData !='' && this.passData.n10 ==2){
        this.ulink = this.passData.t8.changingThisBreaksApplicationSecurity;
        this.ulink = this.funct.corrigirUrlYoutube(this.ulink);
      }
       else{
         if(this.passData.uploadedPhoto[0].t2 !=''){
            this.ulink =this.vLink + this.passData.uploadedPhoto[0].t2;
          }
       }
     }    

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
       console.log("registerData = "+JSON.stringify(this.registerData));
     });

     this.events.subscribe('language', language => {
       console.log("change language = "+language);
       this.changeLanguage.changelanguage(language,this.textEng,this.textMyan).then((data) => {
         this.textData = data;
         if(language != "zg")
           this.font = 'uni';
         else
           this.font = language;
         console.log("data language="+JSON.stringify(data));
       });
     })
  }
  
  ionViewDidEnter(){
      this.platform.registerBackButtonAction(() => {
        console.log("Active Page=" + this.navCtrl.getActive().name);
        this.navCtrl.pop();
      });

   }
   getError(error,status){
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
       dismissOnPageChange: true,
     });
     toast.present(toast);
     this.isLoading = false;
     console.log("Oops!");
   }


   ionViewDidLoad() {
     console.log('ionViewDidLoad VideoPage');
   }

  clickBookMark(data){
    console.log("data="+JSON.stringify(data));
    if(!data.showContent){
      this.passData.showContent = true;
      this.saveContent(data);
    }
    else{
      this.passData.showContent = false;
      this.unsaveContent(data);
    }
  }

  saveContent(data){
    let parameter = {
      t1 : data.t3,
      t4 : this.registerData.t2,
      n1 : this.registerData.syskey,
      n2 : data.syskey,
      n3 : 1,
      sessionKey:this.registerData.sessionKey

    }
    console.log("request saveContent parameter= ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/saveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response saveContent = ", JSON.stringify(data));
      // this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B113");
    });
  }

  unsaveContent(data){
    console.log("request unsaveContent = ", JSON.stringify(data));
    let parameter = {
      t1 : data.t3,
      t4 : this.registerData.t2,
      n1 : this.registerData.syskey,
      n2 : data.syskey, 
      n3 : 0,
      sessionKey:this.registerData.sessionKey

    }
    console.log("request unsaveContent parameter = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/unsaveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response unsaveContent = ", JSON.stringify(data));

      //this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B114");
    });
  }

  writerProfile(data){
      this.navCtrl.push(WriterprofilePage,{
          data : data
        });
    }

}
