import { Component , NgZone , ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController , LoadingController,Platform, Events , PopoverController } from 'ionic-angular';
import { Http, JsonpModule } from '@angular/http';
import { Content, TextInput} from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { unescapeIdentifier } from '@angular/compiler';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { SQLite } from '@ionic-native/sqlite';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { RegistrationPage } from '../registration/registration';
import { FirstStepPage } from '../first-step/first-step';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { ReplyCommentPage } from '../reply-comment/reply-comment';
import { LikepersonPage } from '../likeperson/likeperson';
import { TabsPage } from '../tabs/tabs';
import { PostLikePersonPage } from '../post-like-person/post-like-person';
import { PopoverCommentPage } from '../popover-comment/popover-comment';
import { PaymentPage } from '../payment/payment';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { FunctProvider } from '../../providers/funct/funct';

/**
 * Generated class for the PromotionPremiumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-promotion-premium',
  templateUrl: 'promotion-premium.html',
  providers: [FunctProvider,ChangelanguageProvider,ChangefontProvider]
})
export class PromotionPremiumPage {

  @ViewChild(Content) content: Content;
  currentPlayingVideo: HTMLVideoElement;

  passData : any;
  loading:any;
  textMyan: any = ["အသေးစိတ်အချက်အလက်","ဒေတာ မရှိပါ။","မှတ်ချက်ရေးရန် ...","ကြိုက်တယ်","မှတ်ချက်","မျှဝေမည်","အသေးစိတ်အချက်အလက်","မှတ်ချက် မရှိပါ။"];
  textEng: any = ["Replies","No Replies","Write a comment .....","comment","share","Detail","No comments"];
  textData : any = [];
  font : any ;
  nores : any;
  nores1 :any;
  detailData : any ;
  status:any;
  writerImg:any;
  array:any;
  array1:any =[];
  registerData:any;
  photoLink:any;
  videoImgLink:any;
  replyData:any =[];
  profileLink:any;
  passType:any;  
  mptPopup:any;
  alertPopup:any;
  billStatus:any = true;
  chekbillAlert:any;
  cutphno:any;
  callid:any;
  passNoti:any;
  comment:any;
  sendingstatus:any;
  textFont:any='';
  popover:any;
  db:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage,
    public loadingCtrl: LoadingController,public funct:FunctProvider,public changefont:ChangefontProvider,
    public platform:Platform,public event:Events,public sanitizer: DomSanitizer,public popoverCtrl:PopoverController,
    public http:Http,public toastCtrl:ToastController,public alert: AlertController,private inAppBrowser: InAppBrowser,
    public changeLanguage : ChangelanguageProvider,public datepipe: DatePipe,public fba: FirebaseAnalytics,
    private _zone: NgZone,public clipboard:Clipboard,private sqlite: SQLite) {

    this.passData = this.navParams.get("passData");    
    this.passType = this.navParams.get("type");  //for premium type
    console.log("single view data == "+JSON.stringify(this.passData));
   // console.log("single view type == "+JSON.stringify(this.passType));
     this.status = this.navParams.get("status");
    // console.log("single view status == "+JSON.stringify(this.status));
     this.writerImg = this.funct.imglink+"upload/image/WriterImage"; 
     this.photoLink = this.funct.imglink+"upload/smallImage/contentImage/";
     this.videoImgLink = this.funct.imglink+"upload/smallImage/videoImage/";
     this.profileLink = this.funct.imglink+"upload/image/userProfile";

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

    this.storage.get('textboxlan').then((result) => {
      console.log("font == "+result);
        this.textFont = result;
        if(result == '' || result == undefined || result == null){
         this.textFont ='uni';
       }
       else{
         this.textFont = result;
         if(this.textFont == 'zg'){
           this.textData[2] = this.changefont.UnitoZg(this.textMyan[2]);
         }
         else{
           this.textData[2] = this.textMyan[2];
         }
       }    
    });

    this.storage.get('b2bregData').then((data) => {
           this.registerData = data;
           if(this.registerData == undefined || this.registerData == null || this.registerData == ""){
            this.registerData.syskey = '';
            this.registerData.sessionKey = '';
            this.nores = 0;
            /*this._zone.run(() => {
              this.navCtrl.setRoot(FirstStepPage);
              });*/                  
              
          }
          /*else if(this.registerData == true){
            this._zone.run(() => {
              this.navCtrl.setRoot(RegistrationPage);
              });
          }*/
          else{
              this.getSingleViewData(); 
              console.log("Single View Data");
          }
          
          /*this.storage.get('billStatus').then((data) => {
            if(this.passType == 'premium' && data == false){
              this.fillBill();                  
            }  
            else{
              this.getSingleViewData();
              this.getCommentData();
            }   
          });*/
           
           console.log("single view get register data == "+JSON.stringify(this.registerData));
    });  
  }

  // openWebpage() {
  //   console.log("slide data="+JSON.stringify(this.passData.link));
  //   const options: InAppBrowserOptions = {
  //     zoom: 'no'
  //   }
  //   console.log("slide link="+JSON.stringify(this.passData.link));
  //   if(this.passData.link.includes('<a href=') || this.passData.link.includes('https://')){
  //     let url =this.passData.link;
  //     if(url.indexOf ("<p>") >-1){
  //       url = url.replace(/<p>/g, "");
  //       console.log("url2 == " + JSON.stringify(url));
  //       url= url.replace(/<\/p>/g, "");
  //       console.log("url3 == " + JSON.stringify(url));
    
  //       let urlLink = url.split('"');
  //       let urlLink1 = urlLink[0];
  //       let urlLink2 = urlLink[1];
  //       let urlLink3 = urlLink[2];
  //       console.log("urlLink1 == " + JSON.stringify(urlLink1));
  //       console.log("urlLink2 == " + JSON.stringify(urlLink2));
  //       console.log("urlLink3 == " + JSON.stringify(urlLink3));
  //       if (url != "" && url != null && url != undefined) {
  //         // Opening a URL and returning an InAppBrowserObject
  //        this.inAppBrowser.create(urlLink2, '_self', options);
  //        // //this.inAppBrowser.create("https://www.w3schools.com/php/", '_self', options);
  //        }
  //     }
  //     else if(url.indexOf("<a href=") >-1){
  //       let url =this.passData.link;
  //       console.log("url4 == " + JSON.stringify(url));

  //         let urlLink = url.split('"');
  //         let urlLink1 = urlLink[0];
  //         let urlLink2 = urlLink[1];
  //         let urlLink3 = urlLink[2];
  //         console.log("urlLink1 == " + JSON.stringify(urlLink1));
  //         console.log("urlLink2 == " + JSON.stringify(urlLink2));
  //         console.log("urlLink3 == " + JSON.stringify(urlLink3));
  //         if (url != "" && url != null && url != undefined) {
  //          this.inAppBrowser.create(urlLink2, '_self', options);
  //         }
  //     }
  //     else{
  //       let url =this.passData.link;
  //         console.log("urlLink3 >> " + JSON.stringify(url));
  //         if (url != "" && url != null && url != undefined) {
  //          this.inAppBrowser.create(url, '_self', options);
  //         }
  //       }
  //     }
  // }

  
  ionViewCanEnter(){
    if(this.registerData != undefined && this.registerData != null && this.registerData != ""){
      this.replyData =[];
      this.getCommentData();
    }
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
            //this.navCtrl.setRoot(TabsPage);
            this._zone.run(() => {
              this.navCtrl.setRoot(TabsPage);
              });
          }
        },
        {
          text: 'Ok',
          handler: data => {  
            this.checkBill();            
          }
        }
      ],
      enableBackdropDismiss: false
    });
      this.mptPopup.present(); 
      /*let doDismiss = () => this.mptPopup.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.mptPopup.onDidDismiss(unregBackButton);  */
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
                this._zone.run(() => {
                  this.navCtrl.setRoot(TabsPage);
                  });
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
                this._zone.run(() => {
                  this.navCtrl.setRoot(TabsPage);
                  });
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
                  this.getSingleViewData();
                }                      
              }
            ],
            enableBackdropDismiss: false
          });    
          this.chekbillAlert.present(); 
          /*let doDismiss = () => this.chekbillAlert.dismiss();
          let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
          this.chekbillAlert.onDidDismiss(unregBackButton);          */
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

ionViewDidEnter() {
  console.log('ionViewDidLoad SingleViewPage');
  this.backButtonExit();
}

share(i) {
  console.log("this is share url == "+JSON.stringify(i)+"  //////////////  url === "+JSON.stringify(i.t8));
  if(( i.t4 == 'premium') && !this.billStatus){
    //this.fillBill();
    this.choosePayment();
  }
  else{
   let sahareImg = this.funct.imglink+"image/B2B_LOGO.gif";
      if(i.uploadedPhoto.length>0){
        sahareImg = this.videoImgLink +  i.uploadedPhoto[0].t7;
      }

      //let title =this.changefont.UnitoZg(i.t1);
      let title = i.t1;
      const Branch = window['Branch'];
//  this.url = "https://b2b101.app.link/R87NzKABHL";

 var propertiesObj = {
   canonicalIdentifier: 'content/123',
   canonicalUrl: 'https://myanmarb2b.app/content/123',
   title:  title,
   //contentDescription: '' + Date.now(),
   contentImageUrl: sahareImg,
   price: 12.12,
   currency: 'GBD',
   contentIndexingMode: 'private',
   contentMetadata: {
     custom: 'data',
     testing: i.syskey,
     this_is: true
   }
 }

 // create a branchUniversalObj variable to reference with other Branch methods
 var branchUniversalObj = null
 Branch.createBranchUniversalObject(propertiesObj).then(function (res) {
   branchUniversalObj = res
     console.log('Response1: ' + JSON.stringify(res))
    // optional fields
       var analytics = {
         channel: 'facebook',
         feature: 'onboarding',
         campaign: 'content 123 launch',
         stage: 'new user',
         tags: ['one', 'two', 'three']
       }

       // optional fields
       var properties1 = {
         $desktop_url: 'https://myanmarb2b.app',
         $android_url: 'https://myanmarb2b.app/android',
         $ios_url: 'https://myanmarb2b.app/ios',
         $ipad_url: 'https://myanmarb2b.app/ipad',
         $deeplink_path: 'content/123',
         $match_duration: 2000,
         custom_string: i.syskey,
         custom_type: i.t4,
         custom_integer: Date.now(),
         custom_boolean: true
       }

       branchUniversalObj.generateShortUrl(analytics, properties1).then(function (res) {
      
          console.log('Response2: ' + JSON.stringify(res.url));
         // optional fields
         var analytics = {
           channel: 'facebook',
           feature: 'onboarding',
           campaign: 'content 123 launch',
           stage: 'new user',
           tags: ['one', 'two', 'three']
         }
         // optional fields
         var properties = {
           $desktop_url: 'https://myanmarb2b.app',
           custom_string: i.syskey,
           custom_type: i.t4,
           custom_integer: Date.now(),
           custom_boolean: true
         }

         var message = 'Check out this link'

         // optional listeners (must be called before showShareSheet)
         branchUniversalObj.onShareSheetLaunched(function (res) {
           // android only
           console.log(res)
         })
         branchUniversalObj.onShareSheetDismissed(function (res) {
           console.log(res)
         })
         branchUniversalObj.onLinkShareResponse(function (res) {
           console.log(res)
         })
         branchUniversalObj.onChannelSelected(function (res) {
           // android only
           console.log(res)
         })

         // share sheet
         branchUniversalObj.showShareSheet(analytics, properties, message)
       }).catch(function (err) {
         console.error('Error2: ' + JSON.stringify(err))
       })
    }).catch(function (err) {
      console.error('Error1: ' + JSON.stringify(err))
    })
  }

  this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, }).then((res: any) => {
    console.log("name=>" + name + "/status=>" + res);
  })
  .catch((error: any) => console.error(error));
}

getSingleViewData(){
 this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      //   duration: 3000
    });
     this.loading.present();      
   this.http.get(this.funct.ipaddress2 + 'serviceArticle/getArticleDataBySyskey?syskey='+this.passData.postSyskey+'&regsyskey='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
            console.log("response singleview data = " + JSON.stringify(result));
            if(result.data.length > 0){
              if((result.data[0].t3 == 'premium' || result.data[0].t4 =='premium') && !this.billStatus){
                //this.fillBill();
                this.choosePayment();
              }
              else{
                this.nores = 1 ;
                this.detailData = result.data[0];
                this.storage.remove('deepLinkData');
                
                this.detailData.modifiedDate = this.funct.getTransformDate(this.detailData.modifiedDate); 
                this.detailData.modifiedTime = this.funct.getTimeTransformDate(this.detailData.modifiedTime); 
                  if (this.detailData.n6 != 1)
                  this.detailData.showLike = false;
                  else
                  this.detailData.showLike = true;
                  if (this.detailData.n7 != 1)
                  this.detailData.showContent = false;
                  else
                  this.detailData.showContent = true;
                  if(this.detailData.n2 != 0){
                    this.detailData.likeCount = this.funct.getChangeCount(this.detailData.n2);
                  }
                  if(this.detailData.n3 !=0){
                    this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
                  }

                if(this.detailData.n10 == 1){
                  if (this.detailData.t8 != '') {
                    if(this.detailData.uploadedPhoto.length > 0){
                      this.detailData.videoLink = this.videoImgLink + this.detailData.uploadedPhoto[0].t7;
                    }
                    else{
                      let temp = this.detailData.t8;     // for video link
                      let str1 = temp.search("external/");
                      let str2 = temp.search(".sd");
                      if(str2 < 0){
                        str2 = temp.search(".hd");
                      }
                      let res = temp.substring(str1+9,str2);
                      this.detailData.videoLink = "https://i.vimeocdn.com/video/"+res+"_295x166.jpg";
                    }
                    console.log("data.data[i].videoLink == "+this.detailData.videoLink);
                    //this.detailData.t8 = this.sanitizer.bypassSecurityTrustResourceUrl(this.detailData.t8);
                }
               }
               else if(this.detailData.n10 == 2){
                 if(this.detailData.uploadedPhoto.length > 0){
                  this.detailData.videoLink = this.videoImgLink + this.detailData.uploadedPhoto[0].t7;
                 }                      
                 this.detailData.playvideoLink = this.funct.corrigirUrlYoutube(this.detailData.t8);
                  console.log("data.data[i].t8 for youtube == " + this.detailData.t8);
                }
               else{
                 if(this.detailData.uploadedPhoto.length > 0){
                   if(this.detailData.uploadedPhoto[0].t2 !=''){
                    this.detailData.videoLink = this.videoImgLink + this.detailData.uploadedPhoto[0].t7;
                    this.detailData.videoStatus = true;
                   }
                   else{
                    this.detailData.videoStatus = false;
                   }
                 }
               }

               if(this.detailData.t2.indexOf("<img ") >-1){
                this.detailData.t2 = this.detailData.t2.replace(/<img /g,"<i ");
                console.log("replace img == "+this.detailData.t2);
                this.detailData.t2 = this.detailData.t2.replace(/ \/>/g,"></i>");
                console.log("replace <i/> == "+this.detailData.t2);
              }
                let num = this.detailData.t2;
                this.array = num.split("[#img]");
                console.log("dat="+JSON.stringify(this.array))
                for(let i=0;i<this.array.length;i++){
                  console.log("i="+this.array[i])
                  let arr = {};
                  if(this.array[i]=="<p>"){
                  arr = {t1:"img",t2:this.photoLink + this.detailData.uploadedPhoto[i].t7,caption:this.detailData.uploadedPhoto[i].t5};
                  this.array1.push(arr);
                }
                else if(this.array[i]==""){
                  arr = {t1:"img",t2:this.photoLink + this.detailData.uploadedPhoto[i].t7,caption:this.detailData.uploadedPhoto[i].t5};
                  this.array1.push(arr);
                }
                else{
                  if(i!=this.array.length-1){
                  console.log("ii="+this.array[i])
                  let arr1 = {t1:"text",t2:this.array[i]};
                  arr = {t1:"img",t2:this.photoLink + this.detailData.uploadedPhoto[i].t7,caption:this.detailData.uploadedPhoto[i].t5};
                  this.array1.push(arr1);
                  this.array1.push(arr);
                }
                else{
                  arr = {t1:"text",t2:this.array[i]};
                  this.array1.push(arr);
                }
                }
              } 
              this.getCommentData();
              }                
            }
            else{
              this.nores = 0 ;
              this.storage.remove('deepLinkData');
            }
            this.loading.dismiss();
          },
            error => {
            this.nores = 0 ;
            this.storage.remove('deepLinkData');
            this.getError(error,"B131");
          });
}

getCommentData(){     //tmn
  this.http.get(this.funct.ipaddress2 + 'serviceQuestion/getCommentmobile?id='+this.passData.postSyskey+'&userSK='+this.registerData.syskey+'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
        console.log("return Commentfunt data = " + JSON.stringify(result));
        if(result.data.length > 0){
          this.nores1 = 1 ;
          this.updateNotiData();
          for(let i =0;i<result.data.length ;i++){
            result.data[i].differenceTime = this.funct.getTimeDifference(result.data[i].modifiedDate , result.data[i].modifiedTime);

            result.data[i].modifiedDate = this.funct.getTransformDate(result.data[i].modifiedDate);

            result.data[i].like = "Like";

              if (result.data[i].person.length > 0) {
                for (let k = 0; k < result.data[i].person.length; k++) {
                  if (result.data[i].person[k].syskey == this.registerData.syskey) {
                    result.data[i].like = "UnLike";
                    break;
                  }
                }
              }

            result.data[i].likeCount = result.data[i].person.length;
            result.data[i].replyCount = result.data[i].n3;
            if(result.data[i].n3 == 1){
              result.data[i].textreply = "reply";
            }
            else if(result.data[i].n3 > 1){
              result.data[i].textreply = "replies";
            }                         
          }
          this.replyData = result.data; 
          
          //this.scrollToBottom();
          console.log("replyData data = " + JSON.stringify(this.replyData));
        }
        else{
          this.nores1 = 0 ;                 
        }
      },
          error => {
        this.getError(error,"B122");
      });
}

saveComment(){
  if(this.comment != '' && this.comment != ' ' &&  this.comment.trim() != '') {
    this.sendingstatus = true;
    let parameter = {
      t1: "answer",
      t2: this.comment,
      n1: this.detailData.syskey,
      n5: this.registerData.syskey, 
      sessionKey:this.registerData.sessionKey
    }
 //   this.postcmt = {t3: this.registerData.t2 , t2: this.comment};
    console.log("requst saveComment=" + JSON.stringify(parameter));
  //  this.replyData.push(this.postcmt);
    this.scrollToBottom();
    this.http.post(this.funct.ipaddress2 + 'serviceQuestion/saveAnswer', parameter).map(res => res.json()).subscribe(result => {
          console.log("return saveComment data = " + JSON.stringify(result));
          if(result.state && result.data.length > 0){
              this.nores1 = 1 ;

            for(let i =0;i<result.data.length ;i++){
                result.data[i].differenceTime = this.funct.getTimeDifference(result.data[i].modifiedDate , result.data[i].modifiedTime);

                result.data[i].modifiedDate = this.funct.getTransformDate(result.data[i].modifiedDate);

                result.data[i].like = "Like";
                if (result.data[i].person.length > 0) {
                  for (let k = 0; k < result.data[i].person.length; k++) {
                    if (result.data[i].person[k].syskey == this.registerData.syskey) {
                      result.data[i].like = "UnLike";
                      break;
                    }
                  }
                }

              result.data[i].likeCount = result.data[i].person.length;
              result.data[i].replyCount = result.data[i].n3;
              if(result.data[i].n3 == 1){
                result.data[i].textreply = "reply";
              }
              else if(result.data[i].n3 > 1){
                result.data[i].textreply = "replies";
              }
            }
            
          this.replyData = result.data;
          this.scrollToBottom();
          this.comment = '';
          this.detailData.n3 = this.detailData.n3 + 1;
          this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
        }
          else{
            if(this.replyData.length>0)
              this.nores1 = 1;
            else
              this.nores1 = 0;
              let toast = this.toastCtrl.create({
                message: "Comment failed!",
                duration: 5000,
                position: 'bottom',
                //  showCloseButton: true,
                dismissOnPageChange: true,
                // closeButtonText: 'OK'
              });
              toast.present(toast);
          }
          this.sendingstatus = false;
          //this.isLoading = false;
          this.comment = '';
          this.content.resize();
          this.scrollToBottom();
        },
            error => {
          this.sendingstatus = false;
          this.comment = '';
          if(this.replyData.length>0)
            this.nores1 = 1;
          else
            this.nores1 = 0;
          this.getError(error,"B123");
        });
  }
  else{
    this.comment = '';
  }
}

updateNotiData(){
  this.sqlite.create({
     name:"b2b.db",
     location:"default"
   }).then((db) =>{
     this.db = db;
     db.executeSql("UPDATE myNoti SET noticountstatus=0 WHERE id= "+ this.passData.id,[]).then((data) => {
     console.log("update data successfully", data);
     }, (error) => {
       console.error("Unable to update data", error);
     });
   });
}

presentPopover(ev,d) {
  let st;
    if(d.n5 != this.registerData.syskey){
          st = 0;
        }else{
          st = 1;
        }
    this.popover = this.popoverCtrl.create(PopoverCommentPage, {
    data:st
    });

    this.popover.present({
      ev: ev
    });

    let doDismiss = () => this.popover.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.popover.onDidDismiss(unregBackButton);

    this.popover.onWillDismiss(data => {
      console.log("popover dismissed");
      console.log("Selected Item is " + data);
        if(data == "1"){
          let copytext = this.changefont.UnitoZg(d.t2);
        this.clipboard.copy(copytext);
      }
      else if(data == "2"){
        this.deleteComment(d);
      }
    });
}

deleteComment(d) {
  this.alertPopup = this.alert.create({
    cssClass: this.font,
    message: '<div class="deleteComment">Delete Comment?<div>',
    buttons: [
      {
        text: "No",
        cssClass: 'deleteCommentButton',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: "Yes",
        cssClass: 'deleteCommentButton1',
        handler: () => {
          this.getDeleteMsg(d);
        }
      }
    ]
  })
  this.alertPopup.present();
  let doDismiss = () => this.alertPopup.dismiss();
  let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
  this.alertPopup.onDidDismiss(unregBackButton);
}

getDeleteMsg(d){

  this.loading = this.loadingCtrl.create({
    content: "Please wait...",
    dismissOnPageChange :true
    //   duration: 3000
  });
  this.loading.present();
  console.log("request d.syskey =" + d.syskey);
  this.http.get(this.funct.ipaddress2 + "serviceQuestion/deleteComment?syskey="+d.syskey+'&sessionKey='+this.registerData.sessionKey+'&userSK='+this.registerData.syskey).map(res => res.json()).subscribe(result => {
    console.log("response process msg =" + JSON.stringify(result));
    if(result.state){
      this.getCommentData();
      this.detailData.n3 = this.detailData.n3 - 1;
      this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
      this.loading.dismiss();
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Delete Failed! Please try again.',
        duration: 5000,
        position: 'bottom',
        //  showCloseButton: true,
        dismissOnPageChange: true,
        // closeButtonText: 'OK'
      });
      toast.present(toast);
      this.loading.dismiss();
    }
  }, error => {
    console.log("signin error=" + error.status);
    this.getError(error,"B125");
    this.loading.dismiss();
  });
}

scrollToBottom() {
  setTimeout(() => {
    if (this.content._scroll) this.content.scrollToBottom(0);
  }, 400)
}

onFocus() {
  this.scrollToBottom();
}

dismiss(){    
  this.storage.get('b2bregData').then((data) => {
    console.log("dismiss ..............");
          console.log(" single view registerData = "+JSON.stringify(data));
          //if(this.status == 1){
            if(data == null || data == "" ){                
              this._zone.run(() => {
                this.navCtrl.setRoot(FirstStepPage);
                });
            }
            else if(data == true){
              this._zone.run(() => {
                this.navCtrl.setRoot(RegistrationPage);
                });                
            }
            else{
            //this.navCtrl.setRoot(TabsPage);
            this._zone.run(() => {
              this.navCtrl.setRoot(TabsPage);
              });
            }
          //}  
          //else{
           // this.navCtrl.setRoot(TabsPage);
          //}          
        });
  }

writerProfile(data){
  if(this.detailData.n10 == 2){
    this.detailData.playvideoLink = this.funct.corrigirUrlYoutube(this.detailData.t8);
  }
  if (this.currentPlayingVideo != undefined) {
    this.currentPlayingVideo.pause();
  }
      this.navCtrl.push(WriterprofilePage,{
        data : data
      });
  }

  singlePhoto(i){
    console.log("viewImage == "+JSON.stringify(i));
    this.navCtrl.push(ViewPhotoMessagePage,{
        data : i,
        contentImg:"singlePhoto"
      });
  }

backButtonExit(){
  this.platform.registerBackButtonAction(() => {
    console.log("Active Page=" + this.navCtrl.getActive().name);
    if(this.status == 1 || this.status == 2){
      this.dismiss();
      }
      else{
      this.navCtrl.pop();
      }
  });
}

clickLike(data){
  console.log("data="+JSON.stringify(data));
  if(!data.showLike){
    this.detailData.showLike = true;
    this.detailData.n2 = this.detailData.n2 + 1;
    this.detailData.likeCount = this.funct.getChangeCount(this.detailData.n2);
    this.getLike(data);
  }
  else{
    this.detailData.showLike = false;
    this.detailData.n2 = this.detailData.n2 - 1;
    this.detailData.likeCount = this.funct.getChangeCount(this.detailData.n2);
    this.getUnlike(data);
  }
}

getLike(data){

  console.log("data in getLike promotion premiun page >> ", JSON.stringify(data));
  let parameter = {
    key : data.syskey,
    userSK : this.registerData.syskey,
    type : data.t3
  }
  console.log("request clickLike = ", JSON.stringify(parameter));
  this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key='+data.syskey+'&userSK='+this.registerData.syskey+'&type='+data.t3 +'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
    console.log("response clickLike = ", JSON.stringify(result));
    if(result.state){
      this.detailData.showLike = true;

      this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.detailData.showLike }).then((res: any) => {
        console.log("name=>" + name + "/status=>" + res);
      })
      .catch((error: any) => console.error(error));
    }
    else{
      this.detailData.showLike = false;
      this.detailData.n2 = this.detailData.n2 - 1;
    }
  }, error => {
    console.log("signin error=" + error.status);
    this.getError(error,"B111");
  });
}

getUnlike(data){
  let parameter = {
    key : data.syskey,
    userSK : this.registerData.syskey,
    type : data.t3
  }
  console.log("request clickLUnlike = ", JSON.stringify(parameter));
  this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key='+data.syskey+'&userSK='+this.registerData.syskey+'&type='+data.t3 +'&sessionKey='+this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
    console.log("response clickLUnlike = ", JSON.stringify(data));
    if(data.state){
      this.detailData.showLike = false;
    }
    else{
      this.detailData.showLike = true;
      this.detailData.n2 = this.detailData.n2 + 1;
    }
  }, error => {
    console.log("signin error=" + error.status);
    this.getError(error,"B112");
  });
}

clickBookMark(data){
  console.log("data="+JSON.stringify(data));
  if(!data.showContent){
    this.detailData.showContent = true;
    this.saveContent(data);
  }
  else{
    this.detailData.showContent = false;
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
    sessionKey: this.registerData.sessionKey
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

likePerson(cmt){
  if(this.detailData.n10 == 2){
    this.detailData.playvideoLink = this.funct.corrigirUrlYoutube(this.detailData.t8);
  }
  if (this.currentPlayingVideo != undefined) {
    this.currentPlayingVideo.pause();
  }
  this.navCtrl.push(LikepersonPage,{
    data :cmt
  });
}

ClickReply(cmt){
  if(this.detailData.n10 == 2){
    this.detailData.playvideoLink = this.funct.corrigirUrlYoutube(this.detailData.t8);
  }
  if (this.currentPlayingVideo != undefined) {
    this.currentPlayingVideo.pause();
  }
  /*this._zone.run(() => {
    
  });*/
  this.navCtrl.push(ReplyCommentPage,{
    data : cmt,
    singleStatus:true
  });
}

changeLike(skey,index){
  this.replyData[index].likeCount = this.replyData[index].likeCount - 1;
  let parameter = {
    n1: this.registerData.syskey,
    n2: skey,
    sessionKey: this.registerData.sessionKey
  }
  console.log("requst saveComment=" + JSON.stringify(parameter));
  this.http.post(this.funct.ipaddress2 + 'serviceQuestion/saveCommentLike', parameter).map(res => res.json()).subscribe(data => {
      console.log("return likecomment data = " + JSON.stringify(data));
      console.log("data length == "+data.data.length);
      if( data.state && data.data.length > 0){
        for(let i =0;i<data.data.length ;i++){
          if (data.data[i].person.length > 0) {
                for (let k = 0; k < data.data[i].person.length; k++) {
                  if (data.data[i].person[k].syskey == this.registerData.syskey) {
                    this.replyData[index].like = "UnLike";
                    break;
                  }
                  else{
                    this.replyData[index].like = "Like";
                  }
                }                  
              }
              else{
                this.replyData[index].like = "Like";
              }                
               this.replyData[index].likeCount = data.data[i].person.length; 
               this.replyData[index].person = data.data[i].person; 
        }
      }
    },
      error => {
      this.getError(error,"B124");
    });
}

ionViewCanLeave(){
  // console.log("Now i am leaving="+ this.detailData.t2)
}

getLikePerson(i){  
  if(this.detailData.n10 == 2){
    this.detailData.playvideoLink = this.funct.corrigirUrlYoutube(this.detailData.t8);
  }
  if (this.currentPlayingVideo != undefined) {
    this.currentPlayingVideo.pause();
  }
  this.navCtrl.push(PostLikePersonPage,{
    data:i.syskey
  })
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

onPlayingVideo(event,index) {
  console.log("index="+index)
  event.preventDefault();
  if (this.currentPlayingVideo === undefined) {
    console.log("L");
    this.currentPlayingVideo = event.target;
    this.currentPlayingVideo.play();
  } else {
    console.log("A");
    if (event.target !== this.currentPlayingVideo) {
      this.currentPlayingVideo.pause();
      this.currentPlayingVideo = event.target;
    }
  }
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
     this.loading.dismiss();
    console.log("Oops!");
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionPremiumPage');
  }

}
