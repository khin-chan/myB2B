import { Component } from '@angular/core';
import { NavController, NavParams, Platform , AlertController , LoadingController , ToastController ,Events ,PopoverController} from 'ionic-angular';
import { Http } from '@angular/http';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';

import { SaveContentDetailPage } from '../save-content-detail/save-content-detail';
import { SettingsPage } from '../settings/settings';
import { SaveContentVideoPage } from '../save-content-video/save-content-video';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { PaymentPage } from '../payment/payment';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

/**
 * Generated class for the SaveContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-save-content',
  templateUrl: 'save-content.html',
  providers: [ChangelanguageProvider]
})
export class SaveContentPage {
  rootNavCtrl: NavController;
  isLoading : any;
  registerData : any = {syskey:'',t1:''};
  menuList : any;
  popover: any;
  start : any = 0;
  end : any = 0;
  nores : any;
  photoLink : any;
  videoImgLink:any;
  noticount:any;
  font : any ;
  textMyan : any = ["သိမ်းဆည်းထားသော","ကြိုက်သည်","မှတ်ချက်","ဝေမျှမည်","ဒေတာ မရှိပါ။","ကြည့်ရန်"];
  textEng : any = ["Save Content", "Like","Comment","Share","No result found","View"];
  textData : any = [];
  db:any;
  conData:any=[];
  contentData:any=[];
  isAdmin:any;
  offline : any = false;
  writerImg:any;
  billStatus:any;
  mptPopup:any;
  loading:any;
  chekbillAlert:any;
  cutphno:any;
  callid:any;
  alertPopup: any;
  paymentStr: any = '';

  paymentData: any = [
    { month: '၁', price: '၂,၅၀၀', status: '1' },
    { month: '၄', price: '၈,၀၀၀', status: '1' },
    { month: '၈', price: '၁၄,၀၀၀', status: '1' },
    { year: '၁',price: '၁၈,၀၀၀', status: '2' },
   ];

   paymentData1: any = [
    { month: '၁', price: '၁၀၀', status: '1' },
    { month: '၄', price: '၂၀၀', status: '1' },
    { month: '၈', price: '၃၀၀', status: '1' },
    { year: '၁',price: '၄၀၀', status: '2' },
   ]
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public platform:Platform,
              public storage:Storage,public alert: AlertController,public cdata:DatacleanComponent,
              public toastCtrl: ToastController,public loadingCtrl:LoadingController,
              public http: Http,private appMinimize: AppMinimize,public logger: EventLoggerProvider,
              public funct:FunctProvider,public datepipe: DatePipe,
              public changeLanguage : ChangelanguageProvider,
              public events : Events,public sqlite:SQLite,public sanitizer: DomSanitizer) {

    // ---------- for cache

    this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.writerImg = this.funct.imglink+"upload/image/WriterImage";
    this.photoLink = this.funct.imglink+"upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink+"upload/smallImage/videoImage/";

      this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          this.menuCount();
          console.log("registerData = "+JSON.stringify(this.registerData));
          this.start = 0;
          this.end = 0;
          this.menuList = [];
          this.isLoading = true;
          this.getList(this.start,'');
        });

        this.storage.get('billStatus').then((data) => {
          this.billStatus = data;      
        });
    
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
  }

  ionViewDidEnter(){
    this.backButtonExit();
  }

  goNotiList(){
    //this.navCtrl.push();
  }

  menuCount(){
    let parameter={
      t1:this.registerData.t1,
      t3:"Save Content",
      sessionKey:this.registerData.sessionKey,
      userSyskey:this.registerData.syskey,
      n3: 1,
    }
    this.http.post(this.funct.ipaddress2+'serviceAppHistory/saveType',parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if(result.state){
        console.log("Save content success menuCount >>>>>>>>");
      }
      else if(!result.sessionState){
        this.cdata.sessionAlert();
      }
      else{
        console.log("Save content unsuccess menuCount >>>>>>>>");
      }
    },
        error => {
          this.getError(error,"B108");
        });
  }


  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }

  getList(start, infiniteScroll ){
    //this.isLoading = true;
    this.end = this.end + 10;
    let parameter = {
      start:start,
      end: this.end,
      size : 10
    }

    console.log("response savecon = ", JSON.stringify(parameter));
      this.http.post(this.funct.ipaddress2 + 'serviceContent/searchContent?searchVal=&userSK='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey,parameter).map(res => res.json()).subscribe(data => {
      console.log("response savecon = ", JSON.stringify(data));
        if (data.data.length > 0){
          this.nores = 1;
          if(this.end == 10)
          this.menuList=[];
          for (let i = 0; i < data.data.length; i++) {  
            if( data.data[i].t8 !=''){
              if(data.data[i].uploadedPhoto.length > 0){
                data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
              }
              else{
                let temp = data.data[i].t8;     // for video link
                let str1 = temp.search("external/");
                let str2 = temp.search(".sd");
                if(str2 < 0){
                  str2 = temp.search(".hd");
                }
                let res = temp.substring(str1+9,str2);
                data.data[i].videoLink = "https://i.vimeocdn.com/video/"+res+"_295x166.jpg";
              }
              
              if(data.data[i].t8.indexOf("external/") > -1){
                data.data[i].n10 = 1;
              }
              else{
                data.data[i].n10 = 2;
              }
                console.log("data.data[i].videoLink == "+data.data[i].videoLink);
                data.data[i].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(data.data[i].t8);
             }
             else{
                if(data.data[i].uploadedPhoto.length > 0){
                  if(data.data[i].uploadedPhoto[0].t2 !=''){
                    data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
                    data.data[i].videoStatus = true;
                  }
                  else{
                    data.data[i].videoStatus = false;
                  }
                }
              }   
             
            data.data[i].modifiedDate = this.funct.getTransformDate(data.data[i].modifiedDate);
            if (data.data[i].t6.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
              data.data[i].showread = true;
            }
            else
              data.data[i].showread = false;
            if (data.data[i].n7 != 1)
              data.data[i].showContent = false;
            else
              data.data[i].showContent = true;
            this.changeLanguage.changelanguageText(this.font,data.data[i].t5).then((res) => {
              data.data[i].t5 = res;
            });
            this.changeLanguage.changelanguageText(this.font,data.data[i].t6).then((res) => {
              data.data[i].t6 = res;
            });
            if(data.data[i].t6.indexOf("<img ") >-1){
              data.data[i].t6 = data.data[i].t6.replace(/<img /g,"<i ");
              console.log("replace img == "+data.data[i].t6);
              data.data[i].t6 = data.data[i].t6.replace(/ \/>/g,"></i>");
              console.log("replace <i/> == "+data.data[i].t6);
            }
            if(data.data[i].uploadedPhoto.length > 0){
              data.data[i].shMsg = data.data[i].t6;
               if (data.data[i].shMsg.indexOf('[#img]') > -1) {
                data.data[i].shMsg = data.data[i].t6.replace(/\[#img\]/g,"");
              }
             }
             else{
              data.data[i].shMsg = data.data[i].t6; 
             }
           
            this.menuList.push(data.data[i]);
          }

          console.log("menu list 1 == "+ JSON.stringify(this.menuList[0]));

          if(infiniteScroll !=''){
            infiniteScroll.complete();
          }
        }
        else{
          if(this.end > 10){
            this.end = this.start - 1;
            if(infiniteScroll !=''){
              infiniteScroll.complete();
            }
            if(this.menuList.length > 0 ){
              this.nores = 1;
            }
          }
          else{
            this.isLoading = false;
            this.nores = 0;
          }          
        }
        this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      if(this.end > 10){
        if(infiniteScroll !=''){
          infiniteScroll.complete();
        }
        this.end = this.start - 1;          
      }
      if(this.menuList.length>0){
        this.nores = 1;
      }
      else{
        this.isLoading = false;
        this.nores = 0;
      }
      this.getError(error,"B132");
    });
  }

  insertData(inno){
    console.log("savecontent  data length = ", this.conData.length);
    for (let i = 0; i < inno; i++) {
      this.db.executeSql("INSERT INTO saveContent(allData) VALUES (?)", [JSON.stringify(this.conData[i])]).then((data) => {
        console.log("Insert data successfully", data);
      }, (error) => {
        console.error("Unable to insert data", error);
      });
    }
  }

  deleteData(inno){
    this.db.executeSql("DELETE FROM saveContent", []).then((data) => {
      console.log("Delete data successfully", data);
      this.insertData(inno);
    }, (error) => {
      console.error("Unable to delete data", error);
    });
  }

  selectData(){
    this.menuList =[];
    this.isLoading = true;
    this.db.executeSql("SELECT * FROM saveContent ", []).then((data) => {
      console.log("length == "+ data.rows.length);
      if(data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log("data.rows.item(i).allData == "+ data.rows.item(i).allData);
          this.contentData.push(JSON.parse(data.rows.item(i).allData));
          console.log("data rows:::" + JSON.stringify(this.contentData));
        }
        this.menuList = this.contentData;
        this.contentData =[];
        this.nores = 1;
        this.offline = true;
        this.isLoading = false;
        console.log("data rows:::" + JSON.stringify(this.menuList));
         this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          console.log("registerData = "+JSON.stringify(this.registerData));
          this.start = 0;
          this.end = 0;
          this.getList(this.start,'');
        });
      }
      else{
         this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          console.log("registerData = "+JSON.stringify(this.registerData));
          this.start = 0;
          this.end = 0;
          this.menuList = [];
          this.getList(this.start,'');
        });
      }
    }, (error) => {
         this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          console.log("registerData = "+JSON.stringify(this.registerData));
          this.start = 0;
          this.end = 0;
          this.menuList = [];
          this.getList(this.start,'');
        });
      console.error("Unable to select data", error);
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
      dismissOnPageChange: true,
    });
    toast.present(toast);
    this.isLoading = false;
    console.log("Oops!");
  }

  clickBookMark(data,k){
    console.log("data="+JSON.stringify(data));
    if((data.t3 == 'premium') && !this.billStatus){
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else{
      if(!data.showContent){
        this.menuList[k].showContent = true;
        this.saveContent(data,k);
      }
      else{
        this.menuList[k].showContent = false;
        this.unsaveContent(data);
      }
    }
      //console.log("menu list 2 == "+ JSON.stringify(this.menuList[0]));
  }

  saveContent(data,k){
    let parameter = {
      t1 : data.t1,
      t4 : this.registerData.t2,
      n1 : this.registerData.syskey,
      n2 : data.n1,  
      n3 : 1,
      sessionKey:this.registerData.sessionKey
    }
    console.log("request saveContent parameter= ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/saveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response saveContent = ", JSON.stringify(data));
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B113");
    });
  }

  unsaveContent(data){
    console.log("request unsaveContent = ", JSON.stringify(data));
    let parameter = {
      t1 : data.t1,
      t4 : this.registerData.t2,
      n1 : this.registerData.syskey,
      n2 : data.n2,
      n3 : 0,
      sessionKey:this.registerData.sessionKey
    }
    console.log("request unsaveContent parameter = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/unsaveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response unsaveContent = ", JSON.stringify(data));
      this.start=0;
      this.end = 0;
      this.menuList =[];
       this.getList(this.start,'');
      //this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B114");
    });
  }
  
  writerProfile(data){
  if(( data.t3 == 'premium') && !this.billStatus){
    //this.fillBill();
    //this.choosePayment();
    this.paymentBill();
  }
  else{
      console.log("hello")
      this.navCtrl.push(WriterprofilePage,{
        data : data.perData
       });
    }
  }

  continue(i){
     this.navCtrl.push(SaveContentDetailPage,{detailData:i});
     //this.logger.fbevent(i.t1,{ pram: i.syskey});
  }

  paymentBill() {
    this.paymentStr = '';

    for (var j = 0; j < this.paymentData.length; j++) {

      if(this.paymentData[j].status == "1"){
        this.paymentStr += '<p class="month">'+this.paymentData[j].month+'</p>';
        this.paymentStr += '<p class="month1"> လ</p>-';
      }
      else{
        this.paymentStr += '<p class="month">'+this.paymentData[j].year+'</p>';
        this.paymentStr += '<p class="month1"> နှစ်</p>-';
      }
     
      this.paymentStr += '<p class="price">'+ this.paymentData[j].price +'</p>';
      this.paymentStr += " ကျပ်";

      if (j != this.paymentData.length - 1) {
        this.paymentStr += '<br>';
      }
    }

    console.log("pay str1>" + this.paymentStr);

    this.alertPopup = this.alert.create({
      subTitle: '<div class="popUpStyle"> <span class="premiumTitle"> PREMIUM </span> <br><br> <span class="premiumsubBody"> မြန်မာ့စီးပွားထူးချွန်သူများနှင့် တွေ့ဆုံခြင်းများ၊ စီးပွားရေးစကားဝိုင်းများ၊ အထူးအင်တာဗျူးနှင့် ဆောင်းပါးများ၊ ကိုယ်ပိုင်လုပ်ငန်းလုပ်ကိုင်လိုသူများအတွက် လေ့လာရန် သင်ခန်းစာများ အပါအဝင် စီးပွားရေး၊ စီမံခန့်ခွဲမှုဆိုင်ရာ ဗဟုသုတနဲ့ အတွေးအမြင်များစွာ  ရရှိနိုင်မယ့် B2B Premium အစီအစဉ်ကို အောက်ပါနှုန်းထားများဖြင့် ဖတ်ရှုလေ့လာနိုင်ပါပြီ။ </span> <br><br> <span class="premiumsubTitle">' + this.paymentStr +  '</span><div>',
      buttons: [
        {
          text: 'BUY PREMIUM',
          cssClass: 'buttoncss',
          handler: data => {
            this.choosePayment();
          }
        }
      ]
    })
    this.alertPopup.present();
    let doDismiss = () => this.alertPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.alertPopup.onDidDismiss(unregBackButton);
  }


  choosePayment() {
    this.navCtrl.push(PaymentPage);
  }

  fillBill(){
    this.mptPopup =this.alert.create({
      subTitle: 'B2B Magazine ၏ Premium ဝန်ဆောင်မှုကို တစ်ပတ်လျှင် ၈၀၀ ကျပ်ဖြင့် ရယူနိုင်ပါသည်။',
      cssClass:this.font,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {

            this.checkBill();            
          }
        }
      ]
    });
      this.mptPopup.present(); 
      let doDismiss = () => this.mptPopup.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.mptPopup.onDidDismiss(unregBackButton);  
  }
  checkBill(){
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange :true,
    });
    this.loading.present();
      let billip;
      let phno = this.registerData.t1;
      this.callid = this.registerData.t1.replace('+','');
      console.log("call id == "+this.callid);
      this.cutphno = phno.substring(4,5);
      console.log("cut operator == "+this.cutphno);
      //let smstext = "မင်္ဂလာပါ။လူကြီးမင်းသည်တစ်ပတ်စာဝန်ဆောင်မှုကိုဝယ်ယူပြီးဖြစ်ပါသည်။27/07/2018 အထိသုံးနိုင်ပါသည်။";
      let smstext = "Dear B2B customer, your service request successful. Use before";
      //let smstext="test msg";
      if(this.cutphno == '7'){
        billip = "telenore";
        this.chekbillAlert =this.alert.create({
          subTitle: 'If you want to test with bill payment, you must register with MPT Phno.',
          cssClass:this.font,
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                //this.navCtrl.setRoot(TabsPage);
              }                      
            }
          ]
        });    
        this.chekbillAlert.present(); 
        let doDismiss = () => this.chekbillAlert.dismiss();
        let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
        this.chekbillAlert.onDidDismiss(unregBackButton); 
      }
      else if(this.cutphno == '9'){
        billip = "ooredoo";
        this.chekbillAlert =this.alert.create({
          subTitle: 'If you want to test with bill payment, you must register with MPT Phno.',
          cssClass:this.font,
          buttons: [
            {
              text: 'Ok',
              handler: data => {
                //this.navCtrl.setRoot(TabsPage);
              }                      
            }
          ]
        });    
        this.chekbillAlert.present(); 
        let doDismiss = () => this.chekbillAlert.dismiss();
        let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
        this.chekbillAlert.onDidDismiss(unregBackButton); 
      }
      else{
        billip = "http://apiv2.blueplanet.com.mm/mptsdp/billingapi.php?u=b2bapp&p=6176ad840c3099c74ee924cdea48b0b9&k=B2BAPP&c=800&callerid="+this.callid;
      }         
      
      console.log("billip == "+billip);

      this.http.post(billip, '').map(res => res.json()).subscribe(data => {
        if(data.result_code == 1){
          //alert("Successful");      
          this.loading.dismiss();    
          this.getBillValidate();   
        }
        else if(data.result_code == 2){
          alert("Bill not enough in user account.");
        }
        else if(data.result_code == 3){
          alert("Bill request FAIL from MPT Gate");
        }
        else if(data.result_code == 4){
          alert("Incorrect username, password, ip, keyword or amount");
        }
        else if(data.result_code == 5){
          alert("Incomplete parameters");
        }
        this.loading.dismiss();

      }, error => {
        console.log("signin error=" + error.status);
        this.loading.dismiss();
      });
}

getBillValidate(){   //bill service      

  let today = new Date();
  let tempDate = this.datepipe.transform(today,'yyyyMMdd');
  let parm ={
    syskey:this.registerData.syskey,
    t3:tempDate
  }
  console.log("billvalidate parm == "+JSON.stringify(parm));
  this.http.post(this.funct.ipaddress2 + 'service001/saveValidPayment?sessionKey='+this.registerData.sessionKey,parm).map(res => res.json()).subscribe(data =>{
    console.log("billmethod response == "+JSON.stringify(data));
    if(data.state == true){
      let smsip;
      let date = data.msgCode;
      let year = date.slice(0, 4);
      let month = date.slice(4, 6);
      let day = date.slice(6, 8);
      let expireDate = day +'/'+month +'/'+year;
      let smstext = "Dear B2B customer, your service request successful. Use before "+expireDate;
      //let smstext="test msg";
      if(this.cutphno == '7'){
        smsip = "telenore";
      }
      else if(this.cutphno == '9'){
        smsip ="ooredoo";
      }
      else{
        smsip = "http://apiv2.blueplanet.com.mm/mptsdp/sendsmsapi.php?u=b2bapp&p=6176ad840c3099c74ee924cdea48b0b9&callerid="+this.callid+"&k=B2BAPP&m="+smstext;
      }         
      
      console.log("    smsip == "+smsip);
      this.http.post(smsip, '').map(res => res.json()).subscribe(result => {
        console.log("msg data == "+JSON.stringify(result));
        if(result.result_code == 1){
          this.loading.dismiss();
          this.chekbillAlert =this.alert.create({
            subTitle: 'စာရင်းသွင်းခြင်းအောင်မြင်ပါသည်။',
            cssClass:this.font,
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                  this.storage.set("billStatus",true);
                  this.billStatus = true;
                }                      
              }
            ],
            enableBackdropDismiss: false
          });    
          this.chekbillAlert.present(); 
          /*let doDismiss = () => this.chekbillAlert.dismiss();
          let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
          this.chekbillAlert.onDidDismiss(unregBackButton);    */      
        }
        else if(result.result_code == 2){
          alert("Send sms ERROR from MPT Gate.");
        }
        else if(result.result_code == 3){
          alert("Incorrect username, password, ip or keyword.");
        }
        else if(result.result_code == 4){
          alert("Incomplete parameters.");
        }
        this.loading.dismiss();

      }, error => {
        console.log("signin error=" + error.status);
        this.loading.dismiss();
      });
    }
      //this.billStatus = true;
      }, error => {
    this.getError(error,"B110");
  });
}

  viewImage(i){
    this.navCtrl.push(SaveContentDetailPage,{detailData:i});
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.start =0;
      this.end = 0;
      this.menuList=[];
      console.log('Async operation has ended');
      if(!this.isLoading){
        this.getList(this.start,'');
        refresher.complete();
      }      
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end+1;
        if(!this.isLoading)
        this.getList(this.start,infiniteScroll);
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    });
  }

  goVideoDetail(data) {
    if(data.t3 == 'premium' && !this.billStatus){
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else{
      if(this.nores != 0){
          this.navCtrl.push(SaveContentVideoPage,{
            url: data
          });
      }
    }      
    //this.logger.fbevent(data.t1,{ pram: data.syskey});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaveContentPage');
  }
  
  getSettings(){
    this.navCtrl.push(SettingsPage);
  }
}
