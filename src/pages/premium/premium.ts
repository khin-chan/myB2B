import { Component, ViewChild } from '@angular/core';
import {
  NavController, ModalController, PopoverController, NavParams, Content, ViewController,
  LoadingController, ToastController, Platform, Events, AlertController, Slides
} from 'ionic-angular';
import { Http } from '@angular/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Observable } from 'Rxjs/rx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { CommentPage } from '../comment/comment';
import { SettingsPage } from '../settings/settings';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { TabsPage } from '../tabs/tabs';
import { SugvideoPage } from '../sugvideo/sugvideo';
import { PostLikePersonPage } from '../post-like-person/post-like-person';
import { PromotionPremiumPage } from '../promotion-premium/promotion-premium';
import { PaymentPage } from '../payment/payment';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { DatacleanComponent } from '../../components/dataclean/dataclean';


/**
 * Generated class for the PremiumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-premium',
  templateUrl: 'premium.html',
  providers: [ChangelanguageProvider, ChangefontProvider]
})
export class PremiumPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  rootNavCtrl: NavController;
  home: string = "home";
  popover: any;
  items: any[];
  data: any = [];
  url: string = '';
  img: any = '';
  vLink: any;
  isLoading: any;
  loading: any;
  menuList: any = [];
  pinmenuList: any = [];
  menu: any;
  parameter: any;
  nores: any;
  photoLink: any;
  videoImgLink: any;
  tabs: any = '';
  start: any = 0;
  end: any = 0;
  font: any;
  b2bdata: any = [];
  db: any;
  videoStatus: any = false;
  pageStatus: any = 1;
  textMyan: any = ["Premium", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "ခု"];
  textEng: any = ["Premium", "Like", "Comment", "Share", "No result found", "Count"];
  textData: any = [];
  noticount: any = 0;
  registerData: any;
  allData: any = [];
  getdeep: any = false;
  writerImg: any;
  alertPopup: any;
  mptPopup: any;
  notiStatus: any;
  chekbillAlert: any;
  billStatus: any;
  cutphno: any;
  callid: any;
  slideImg: any;
  slideData: any = [];
  premiumSlideImg: any = [];
  sliderObservable: any;
  promoSlider: any;
  flag: any = false;
  showlikeStatus: any;
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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public cdata: DatacleanComponent,
    public navParams: NavParams, public popoverCtrl: PopoverController, public changefont: ChangefontProvider,
    public storage: Storage, public toastCtrl: ToastController, public http: Http, public funct: FunctProvider,
    public events: Events, public platform: Platform, public alert: AlertController, private appMinimize: AppMinimize,
    public changeLanguage: ChangelanguageProvider, public sanitizer: DomSanitizer, public logger: EventLoggerProvider,
    public sqlite: SQLite, public loadingCtrl: LoadingController, public datepipe: DatePipe, private inAppBrowser: InAppBrowser,
    public fba: FirebaseAnalytics,) {

    //this.pageStatus = this.navParams.get('pageStatus');
    this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";
    this.writerImg = this.funct.imglink + "upload/image/WriterImage";
    this.vLink = this.funct.imglink + "upload/video/";
    this.slideImg = this.funct.imglink + "upload/smallImage/setupImage/";

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

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      this.menuCount();
      this.isLoading = true;
      this.getPinList(this.start, '');
      console.log("registerData = " + JSON.stringify(this.registerData));
    });

    this.storage.get('billStatus').then((data) => {
      this.billStatus = data;
      console.log("premium billStatus = " + JSON.stringify(this.billStatus));
    });

    this.getSlideImageList();
  }

  getSlideImageList() {
    this.http.get(this.funct.ipaddress2 + 'serviceimages/getImageList?type=premium').map(res => res.json()).subscribe(result => {
      console.log("response imagelist = ", JSON.stringify(result));

      if (result.data.length > 0) {
        this.flag = true;
        this.premiumSlideImg = result.data;
        console.log("this.premiumSlideImg = ", JSON.stringify(this.premiumSlideImg));
        this.slideData = [];
        for (var i = 0; i < this.premiumSlideImg.length; i++) {
          let obj = { syskey: '', image: '', link: '', postSyskey: '' };
          obj.syskey = this.premiumSlideImg[i].syskey;
          obj.image = this.premiumSlideImg[i].t7;
          obj.link = this.premiumSlideImg[i].t5;
          obj.postSyskey = this.premiumSlideImg[i].n2;
          console.log(" obj.image = ", JSON.stringify(obj.image));
          console.log(" obj.link = ", JSON.stringify(obj.link));
          this.slideData.push(obj);
          console.log("this.slideData = ", JSON.stringify(this.slideData));
        }
      }
      else {
        this.flag = false;
        console.log("No Result Data");
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  /*  promotionPremium(i) {
     console.log("data i=" + JSON.stringify(i));
     if (i.postSyskey == 0 && i.link != undefined && i.link != null && i.link != "") {
       const options: InAppBrowserOptions = {
         zoom: 'no'
       }
       console.log("slide link=" + JSON.stringify(i.link));
       if (i.link.includes('<a href=') || i.link.includes('https://') || i.link.includes('www')){
         let url = i.link;
         if (url.indexOf("<p>") > -1) {
           url = url.replace(/<p>/g, "");
           console.log("url2 == " + JSON.stringify(url));
           url = url.replace(/<\/p>/g, "");
           console.log("url3 == " + JSON.stringify(url));
 
           let urlLink = url.split('"');
           let urlLink1 = urlLink[0];
           let urlLink2 = urlLink[1];
           let urlLink3 = urlLink[2];
           console.log("urlLink1 == " + JSON.stringify(urlLink1));
           console.log("urlLink2 == " + JSON.stringify(urlLink2));
           console.log("urlLink3 == " + JSON.stringify(urlLink3));
           if (url != "" && url != null && url != undefined) {
             // Opening a URL and returning an InAppBrowserObject
             this.inAppBrowser.create(urlLink2, '_self', options);
             // //this.inAppBrowser.create("https://www.w3schools.com/php/", '_self', options);
           }
         }
         else if (url.indexOf("<a href=") > -1) {
           let url = i.link;
           console.log("url4 == " + JSON.stringify(url));
 
           let urlLink = url.split('"');
           let urlLink1 = urlLink[0];
           let urlLink2 = urlLink[1];
           let urlLink3 = urlLink[2];
           console.log("urlLink1 == " + JSON.stringify(urlLink1));
           console.log("urlLink2 == " + JSON.stringify(urlLink2));
           console.log("urlLink3 == " + JSON.stringify(urlLink3));
           if (url != "" && url != null && url != undefined) {
             this.inAppBrowser.create(urlLink2, '_self', options);
           }
         }
         else {
           let url = i.link;
           console.log("urlLink3 >> " + JSON.stringify(url));
           if (url != "" && url != null && url != undefined) {
             this.inAppBrowser.create(url, '_self', options);
           }
         }
       }
     }
     else if (i.postSyskey > 0) {
       this.navCtrl.push(PromotionPremiumPage, {
         passData: i
       });
     }
   } */

  promotionPremium(i) {

    console.log("data i=" + JSON.stringify(i));
    if (i.postSyskey == 0 && i.link != undefined && i.link != null && i.link != "") {
      if (i.link.startsWith('www')) {
        console.log('includes www');
        window.open('http://' + i.link, '_system');
      }
      else if (i.link.includes('.com') && !i.link.startsWith('http')) {
        console.log('includes .com not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.org') && !i.link.startsWith('http')) {
        console.log('includes .org not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.edu') && !i.link.startsWith('http')) {
        console.log('includes .edu not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.co') && !i.link.startsWith('http')) {
        console.log('includes .co not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.net') && !i.link.startsWith('http')) {
        console.log('includes .net not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if ((i.link.includes('http') || i.link.includes('https')) && !i.link.includes('www.')) {
        console.log("include http and not include www");
        let arr = i.link.split("://");
        console.log("link arr>" + arr + " and length is " + arr.length);
        let type = arr[0];
        let name = arr[1];
        console.log("link name>" + name);
        console.log("link full>" + type + '://www.' + name)
        window.open(type + '://www.' + name, '_system');
      }
      else {
        console.log('other');
        window.open(i.link, '_system');
      }
    }
    else if (i.postSyskey > 0) {
      console.log("postSyskey greater than 0");
      this.navCtrl.push(PromotionPremiumPage, {
        passData: i
      });
    }
  }


  goNotiList() {
    //this.navCtrl.push(NotiListPage);
  }

  menuCount() {
    let parameter = {
      t1: this.registerData.t1,
      t3: "Premium",
      sessionKey: this.registerData.sessionKey,
      userSyskey: this.registerData.syskey,
      n3: 1,
    }
    this.http.post(this.funct.ipaddress2 + 'serviceAppHistory/saveType', parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if (result.state) {
        console.log("Premium success menuCount >>>>>>>>");
      }
      else if (!result.sessionState) {
        this.cdata.sessionAlert();
      }
      else {
        console.log("Premium unsuccess menuCount >>>>>>>>");
      }
    },
      error => {
        this.getError(error, "B108");
      });
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
      this.paymentStr +=" ကျပ်";

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

  fillBill() {
    this.mptPopup = this.alert.create({
      subTitle: 'B2B Magazine ၏ Premium ဝန်ဆောင်မှုကို တစ်ပတ်လျှင် ၈၀၀ ကျပ်ဖြင့် ရယူနိုင်ပါသည်။',
      cssClass: this.font,
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //this.navCtrl.setRoot(TabsPage);         
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.checkBill();
          }
        }
      ]
      //enableBackdropDismiss: false

    });
    this.mptPopup.present();
    let doDismiss = () => this.mptPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.mptPopup.onDidDismiss(unregBackButton);
  }

  checkBill() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    let billip;
    let phno = this.registerData.t1;
    this.callid = this.registerData.t1.replace('+', '');
    console.log("call id == " + this.callid);
    this.cutphno = phno.substring(4, 5);
    console.log("cut operator == " + this.cutphno);
    //let smstext = "မင်္ဂလာပါ။လူကြီးမင်းသည်တစ်ပတ်စာဝန်ဆောင်မှုကိုဝယ်ယူပြီးဖြစ်ပါသည်။27/07/2018 အထိသုံးနိုင်ပါသည်။";
    let smstext = "Dear B2B customer, your service request successful. Use before";
    //let smstext="test msg";
    if (this.cutphno == '7') {
      billip = "telenore";
      this.chekbillAlert = this.alert.create({
        subTitle: 'If you want to test with bill payment, you must register with MPT Phno.',
        cssClass: this.font,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.navCtrl.setRoot(TabsPage);
            }
          }
        ]
      });
      this.chekbillAlert.present();
      let doDismiss = () => this.chekbillAlert.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.chekbillAlert.onDidDismiss(unregBackButton);
    }
    else if (this.cutphno == '9') {
      billip = "ooredoo";
      this.chekbillAlert = this.alert.create({
        subTitle: 'If you want to test with bill payment, you must register with MPT Phno.',
        cssClass: this.font,
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.navCtrl.setRoot(TabsPage);
            }
          }
        ]
      });
      this.chekbillAlert.present();
      let doDismiss = () => this.chekbillAlert.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.chekbillAlert.onDidDismiss(unregBackButton);
    }
    else {
      billip = "http://apiv2.blueplanet.com.mm/mptsdp/billingapi.php?u=b2bapp&p=6176ad840c3099c74ee924cdea48b0b9&k=B2BAPP&c=800&callerid=" + this.callid;
    }

    console.log("billip == " + billip);

    this.http.post(billip, '').map(res => res.json()).subscribe(data => {
      console.log("Data == " + JSON.stringify(data));
      console.log("data.result_code == " + JSON.stringify(data.result_code));
      if (data.result_code == 1) {
        //alert("Successful");      
        this.loading.dismiss();
        this.getBillValidate();
      }
      else if (data.result_code == 2) {
        alert("Bill not enough in user account.");
      }
      else if (data.result_code == 3) {
        alert("Bill request FAIL from MPT Gate");
      }
      else if (data.result_code == 4) {
        alert("Incorrect username, password, ip, keyword or amount");
      }
      else if (data.result_code == 5) {
        alert("Incomplete parameters");
      }
      this.loading.dismiss();

    }, error => {
      console.log("signin error=" + error.status);
      this.loading.dismiss();
    });
  }

  getBillValidate() {   //bill service      

    let today = new Date();
    let tempDate = this.datepipe.transform(today, 'yyyyMMdd');
    let parm = {
      syskey: this.registerData.syskey,
      t3: tempDate
    }
    console.log("billvalidate parm == " + JSON.stringify(parm));
    this.http.post(this.funct.ipaddress2 + 'service001/saveValidPayment?sessionKey=' + this.registerData.sessionKey, parm).map(res => res.json()).subscribe(data => {
      console.log("billmethod response == " + JSON.stringify(data));
      if (data.state == true) {
        let smsip;
        let date = data.msgCode;
        let year = date.slice(0, 4);
        let month = date.slice(4, 6);
        let day = date.slice(6, 8);
        let expireDate = day + '/' + month + '/' + year;
        let smstext = "Dear B2B customer, your service request successful. Use before " + expireDate;
        //let smstext="test msg";
        if (this.cutphno == '7') {
          smsip = "telenore";
        }
        else if (this.cutphno == '9') {
          smsip = "ooredoo";
        }
        else {
          smsip = "http://apiv2.blueplanet.com.mm/mptsdp/sendsmsapi.php?u=b2bapp&p=6176ad840c3099c74ee924cdea48b0b9&callerid=" + this.callid + "&k=B2BAPP&m=" + smstext;
        }

        console.log("smsip == " + smsip);
        this.http.post(smsip, '').map(res => res.json()).subscribe(result => {
          console.log("msg data == " + JSON.stringify(result));
          if (result.result_code == 1) {
            this.loading.dismiss();
            this.chekbillAlert = this.alert.create({
              subTitle: 'စာရင်းသွင်းခြင်းအောင်မြင်ပါသည်။',
              cssClass: this.font,
              buttons: [
                {
                  text: 'Ok',
                  handler: data => {
                    this.storage.set("billStatus", true);
                    this.billStatus = true;
                  }
                }
              ],
              enableBackdropDismiss: false
            });
            this.chekbillAlert.present();
            /*let doDismiss = () => this.chekbillAlert.dismiss();
            let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
            this.chekbillAlert.onDidDismiss(unregBackButton);      */
          }
          else if (result.result_code == 2) {
            alert("Send sms ERROR from MPT Gate.");
          }
          else if (result.result_code == 3) {
            alert("Incorrect username, password, ip or keyword.");
          }
          else if (result.result_code == 4) {
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
      this.getError(error, "B110");
    });
  }

  ionViewDidEnter() {

    console.log("Autoslides >> ", this.slides);
    this.sliderObservable = Observable.interval(5000).subscribe(x => {
      if (this.slides != undefined) {
        this.autoPlaySlider();
      }
    });

    this.events.subscribe('notiStatus', status => {
      console.log("notistatus " + status);
      this.notiStatus = status;
    });
    
    this.backButtonExit();
  }

  autoPlaySlider() {
    var slider_index = this.slides.getActiveIndex();
    console.log("slider_index = " + JSON.stringify(slider_index));
    if (slider_index < this.slideData.length) {
      this.slides.slideTo(slider_index + 1);
    }
    else {
      this.slides.startAutoplay();
      // var last_ndex =this.slides.getPreviousIndex();
      // console.log("last_ndex = " + JSON.stringify(last_ndex));
      // this.slides.slideTo(slider_index - last_ndex);
    }
  }

  ionViewDidLeave() {
    this.sliderObservable.unsubscribe();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }

  getPinList(start, infiniteScroll) {
    //this.isLoading = true;
    this.end = this.end + 10;
    console.log("response general = ", JSON.stringify(this.end));
    let parameter = {
      start: '',
      end: '',
      size: 10
    }

    console.log("response general = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceArticle/searchArticleListPin?searchVal=&userSK=' + this.registerData.syskey + '&mobile=' + this.registerData.t1 + '&firstRefresh=0&type=premium' + '&sessionKey=' + this.registerData.sessionKey, parameter).map(res => res.json()).subscribe(data => {
      console.log("response general pin = ", JSON.stringify(data));
      if (data.data.length > 0) {
        console.log("pin length == " + data.data.length);
        console.log("this.end == " + this.end);
        if (this.end == 10) {
          this.pinmenuList = [];
          this.nores = 1;
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].modifiedDate = this.funct.getTransformDate(data.data[i].modifiedDate);
            data.data[i].modifiedTime = this.funct.getTimeTransformDate(data.data[i].modifiedTime);
            if (data.data[i].n6 != 1)
              data.data[i].showLike = false;
            else
              data.data[i].showLike = true;
            if (data.data[i].n7 != 1)
              data.data[i].showContent = false;
            else
              data.data[i].showContent = true;
            if (data.data[i].n2 != 0) {
              data.data[i].likeCount = this.funct.getChangeCount(data.data[i].n2);
            }
            if (data.data[i].n3 != 0) {
              data.data[i].commentCount = this.funct.getChangeCount(data.data[i].n3);
            }
            if (data.data[i].t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
              data.data[i].showread = true;
            }
            else
              data.data[i].showread = false;

            if (data.data[i].t8 == '')
              data.data[i].videoStatus = false;

            this.changeLanguage.changelanguageText(this.font, data.data[i].t1).then((res) => {
              data.data[i].t1 = res;
            });
            this.changeLanguage.changelanguageText(this.font, data.data[i].t2).then((res) => {
              data.data[i].t2 = res;
            })
            if (data.data[i].t2.indexOf("<img ") > -1) {
              data.data[i].t2 = data.data[i].t2.replace(/<img /g, "<i ");
              console.log("replace img == " + data.data[i].t2);
              data.data[i].t2 = data.data[i].t2.replace(/ \/>/g, "></i>");
              console.log("replace <i/> == " + data.data[i].t2);
            }
            if (data.data[i].uploadedPhoto.length > 0) {
              data.data[i].shMsg = data.data[i].t2;
              if (data.data[i].shMsg.indexOf('[#img]') > -1) {
                data.data[i].shMsg = data.data[i].t2.replace(/\[#img\]/g, "");
              }
            }
            else {
              data.data[i].shMsg = data.data[i].t2;
            }

            this.pinmenuList.push(data.data[i]);
          }
        }
        this.getList(this.start, infiniteScroll);
        console.log("this.pinmenulength pin == " + this.pinmenuList.length);

      }
      else {
        this.getList(this.start, infiniteScroll);
        if (this.pinmenuList.length > 0) {
          this.nores = 1;
        }
      }
      //this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getList(this.start, infiniteScroll);
      if (this.pinmenuList.length > 0) {
        this.nores = 1;
      }
      //this.isLoading = false;
      this.getError(error, "B119");
    });
  }

  getList(start, infiniteScroll) {
    let parm = {
      start: start,
      end: this.end
    }

    console.log("home page == " + JSON.stringify(parm));
    this.http.post(this.funct.ipaddress2 + 'serviceArticle/searchArticleList?searchVal=&userSK=' + this.registerData.syskey + '&mobile=' + this.registerData.t1 + '&firstRefresh=0&type=premium' + '&sessionKey=' + this.registerData.sessionKey, parm).map(res => res.json()).subscribe(data => {
      console.log("response news = ", JSON.stringify(data));
      if (data.data.length > 0) {
        this.nores = 1;
        if (this.end == 10)
          this.menuList = [];
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].modifiedDate = this.funct.getTransformDate(data.data[i].modifiedDate);
          data.data[i].modifiedTime = this.funct.getTimeTransformDate(data.data[i].modifiedTime);
          if (data.data[i].n6 != 1)
            data.data[i].showLike = false;
          else
            data.data[i].showLike = true;
          if (data.data[i].n7 != 1)
            data.data[i].showContent = false;
          else
            data.data[i].showContent = true;
          if (data.data[i].n2 != 0) {
            data.data[i].likeCount = this.funct.getChangeCount(data.data[i].n2);
          }
          if (data.data[i].n3 != 0) {
            data.data[i].commentCount = this.funct.getChangeCount(data.data[i].n3);
          }
          if (data.data[i].t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
            data.data[i].showread = true;
          }
          else
            data.data[i].showread = false;

          if (data.data[i].n10 == 1) {
            if (data.data[i].uploadedPhoto.length > 0) {
              data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
            }
            else {
              let temp = data.data[i].t8;     // for video link
              let str1 = temp.search("external/");
              let str2 = temp.search(".sd");
              if (str2 < 0) {
                str2 = temp.search(".hd");
              }
              let res = temp.substring(str1 + 9, str2);
              data.data[i].videoLink = "https://i.vimeocdn.com/video/" + res + "_295x166.jpg";
            }
            console.log("data.data[i].videoLink == " + data.data[i].videoLink);
            data.data[i].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(data.data[i].t8);
          }
          else if (data.data[i].n10 == 2) {
            if (data.data[i].uploadedPhoto.length > 0) {
              data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
            }
            data.data[i].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(data.data[i].t8);
            console.log("data.data[i].t8 for youtube == " + data.data[i].t8);
          }
          else {
            if (data.data[i].uploadedPhoto.length > 0) {
              if (data.data[i].uploadedPhoto[0].t2 != '') {
                data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
                data.data[i].videoStatus = true;
              }
              else {
                data.data[i].videoStatus = false;
              }
            }
          }

          this.changeLanguage.changelanguageText(this.font, data.data[i].t1).then((res) => {
            data.data[i].t1 = res;
          });
          this.changeLanguage.changelanguageText(this.font, data.data[i].t2).then((res) => {
            data.data[i].t2 = res;
          });
          if (data.data[i].t2.indexOf("<img ") > -1) {
            data.data[i].t2 = data.data[i].t2.replace(/<img /g, "<i ");
            console.log("replace img == " + data.data[i].t2);
            data.data[i].t2 = data.data[i].t2.replace(/ \/>/g, "></i>");
            console.log("replace <i/> == " + data.data[i].t2);
          }
          if (data.data[i].uploadedPhoto.length > 0) {
            data.data[i].shMsg = data.data[i].t2;
            if (data.data[i].shMsg.indexOf('[#img]') > -1) {
              data.data[i].shMsg = data.data[i].t2.replace(/\[#img\]/g, "");
            }
          }
          else {
            data.data[i].shMsg = data.data[i].t2;
          }

          this.menuList.push(data.data[i]);
        }

        if (infiniteScroll != '') {
          infiniteScroll.complete();
        }
      }
      else {
        if (this.end > 10) {
          this.end = this.start - 1;
          if (infiniteScroll != '') {
            infiniteScroll.complete();
          }
          if (this.menuList.length > 0 || this.pinmenuList.length > 0) {
            this.nores = 1;
          }
        }
        else if (this.pinmenuList.length > 0) {
          this.nores = 1;
        }
        else {
          this.isLoading = false;
          this.nores = 0;
        }
      }
      this.isLoading = false;

    }, error => {
      console.log("signin error=" + error.status);
      if (this.end > 10) {
        this.end = this.start - 1;
        if (infiniteScroll != '') {
          infiniteScroll.complete();
        }
      }
      if (this.menuList.length > 0) {
        this.nores = 1;
      }
      else {
        this.isLoading = false;
        this.nores = 0;
      }
      this.isLoading = false;
      this.getError(error, "B117");
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.start = 0;
      this.end = 0;
      console.log('Async operation has ended');
      if (!this.isLoading) {
        this.getPinList(this.start, '');
        refresher.complete();
      }
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end + 1;
        if (!this.isLoading)
          this.getPinList(this.start, infiniteScroll);
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content._scroll) this.content.scrollToBottom(0);
    }, 400)
  }

  writerProfile(data) {
    if (!this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (this.pageStatus == 1) {
        this.navCtrl.push(WriterprofilePage, {
          data: data.perData
        });
      }
      else {
        this.navCtrl.push(WriterprofilePage, {
          data: data.perData
        });
      }
    }
  }

  getLikePerson(i) {
    if ((i.t4 == 'premium') && !this.billStatus) {
      // this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      this.navCtrl.push(PostLikePersonPage, {
        data: i.syskey
      })
    }
  }

  continue(i) {
    this.comment(i, 'detail');
  }

  comment(data, title) {
    console.log("billstatus == " + this.billStatus);
    if (!this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (this.nores != 0) {
        if (this.pageStatus == 1) {
          this.navCtrl.push(CommentPage, {
            data: data,
            title: title
          });
        }
        else {
          this.navCtrl.push(CommentPage, {
            data: data,
            title: title
          });
        }
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Please check internet connection!",
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK'
        });
        toast.present(toast);
      }
    }
    //this.logger.fbevent(data.t1, { pram: data.syskey });
    this.fba.logEvent('page_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, }).then((res: any) => {
      console.log("name=>" + name + "/status=>" + res);
    })
    .catch((error: any) => console.error(error));
    this.post(data);
  }

  post(data) {
    let parameter = {
      t1: this.registerData.t1,
      t3: data.t1,
      sessionKey: this.registerData.sessionKey,
      userSyskey: this.registerData.syskey,
      n1: data.syskey,
      n3: 2,

    }
    console.log("Data n1== " + data.n1);
    this.http.post(this.funct.ipaddress2 + 'serviceAppHistory/saveType', parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if (result.state) {
        console.log("Home success menuCount >>>>>>>>");
      }
      else if (!result.sessionState) {
        this.cdata.sessionAlert();
      }
      else {
        console.log("Home unsuccess menuCount >>>>>>>>");
      }
    },
      error => {
        this.getError(error, "B108");
      });
  }

  share(i) {
    console.log("this is share url == " + JSON.stringify(i));
    // if (!this.billStatus) {                               //atda
    //   // this.fillBill();
    //   this.choosePayment();
    // }
    // else {
      let sahareImg = this.funct.imglink + "image/B2B_LOGO.gif";
      if (i.uploadedPhoto.length > 0) {
        if (i.t8 != '' || i.uploadedPhoto[0].t2 != '')
          sahareImg = this.videoImgLink + i.uploadedPhoto[0].t7;
        else
          sahareImg = this.photoLink + i.uploadedPhoto[0].t7;
      }

      //let title = this.changefont.UnitoZg(i.t1);
      let title = i.t1;
      const Branch = window['Branch'];
      //  this.url = "https://b2b101.app.link/R87NzKABHL";

      var propertiesObj = {
        canonicalIdentifier: 'content/123',
        canonicalUrl: 'https://myanmarb2b.app/content/123',
        title: title,
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
        //alert('Response1: ' + JSON.stringify(res))
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
          //alert('Response2: ' + JSON.stringify(res.url));
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
    //}

    this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, }).then((res: any) => {
      console.log("name=>" + name + "/status=>" + res);
    })
    .catch((error: any) => console.error(error));
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
    this.isLoading = false;
    // this.loading.dismiss();
    console.log("Oops!");
  }

  clickLike(data, k, status) {
    // console.log("data=" + JSON.stringify(data));             //atda
    // if (!this.billStatus) {
    //   // this.fillBill();
    //   this.choosePayment();
    // }
    // else {
      if (status == 'pin') {
        if (!data.showLike) {
          this.pinmenuList[k].showLike = true;
          this.pinmenuList[k].n2 = this.pinmenuList[k].n2 + 1;
          this.pinmenuList[k].likeCount = this.funct.getChangeCount(this.pinmenuList[k].n2);
          this.getLike(data, k, status);
        }
        else {
          this.pinmenuList[k].showLike = false;
          this.pinmenuList[k].n2 = this.pinmenuList[k].n2 - 1;
          this.pinmenuList[k].likeCount = this.funct.getChangeCount(this.pinmenuList[k].n2);
          this.getUnlike(data, k, status);
        }
      }
      else {
        if (!data.showLike) {
          this.menuList[k].showLike = true;
          this.menuList[k].n2 = this.menuList[k].n2 + 1;
          this.menuList[k].likeCount = this.funct.getChangeCount(this.menuList[k].n2);
          this.getLike(data, k, status);
        }
        else {
          this.menuList[k].showLike = false;
          this.menuList[k].n2 = this.menuList[k].n2 - 1;
          this.menuList[k].likeCount = this.funct.getChangeCount(this.menuList[k].n2);
          this.getUnlike(data, k, status);
        }
      }
   // }
  }

  getLike(data, k, status) {

    console.log("data in getLike premium page >> ", JSON.stringify(data));
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: 'premium'
    }
    console.log("request clickLike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("response clickLike = ", JSON.stringify(result));
      if (result.state) {
        if (status == 'pin') {
          this.pinmenuList[k].showLike = true;
          this.showlikeStatus = true;
        }
        else {
          this.menuList[k].showLike = true;
          this.showlikeStatus = true;
        }

        this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.showlikeStatus }).then((res: any) => {
          console.log("name=>" + name + "/status=>" + res);
        })
        .catch((error: any) => console.error(error));
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[k].showLike = false;
          this.pinmenuList[k].n2 = this.pinmenuList[k].n2 - 1;
        }
        else {
          this.menuList[k].showLike = false;
          this.menuList[k].n2 = this.menuList[k].n2 - 1;
        }
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  getUnlike(data, k, status) {
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: 'premium'
    }
    console.log("request clickLUnlike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("response clickLUnlike = ", JSON.stringify(data));
      if (data.state) {
        if (status == 'pin') {
          this.pinmenuList[k].showLike = false;
        }
        else {
          this.menuList[k].showLike = false;
        }
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[k].showLike = true;
          this.pinmenuList[k].n2 = this.pinmenuList[k].n2 + 1;
        }
        else {
          this.menuList[k].showLike = true;
          this.menuList[k].n2 = this.menuList[k].n2 + 1;
        }
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B112");
    });
  }


  clickBookMark(data, k, status) {
    if (!this.billStatus) {
      // this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (!data.showContent) {
        if (status == 'pin') {
          this.pinmenuList[k].showContent = true;
        }
        else {
          this.menuList[k].showContent = true;
        }
        this.saveContent(data, k);
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[k].showContent = false;
        }
        else {
          this.menuList[k].showContent = false;
        }
        this.unsaveContent(data);
      }
    }
  }

  saveContent(data, k) {
    let parameter = {
      t1: data.t3,
      t4: this.registerData.t2,
      n1: this.registerData.syskey,
      n2: data.syskey,
      n3: 1,
      sessionKey: this.registerData.sessionKey
    }
    console.log("request saveContent parameter= ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/saveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response saveContent = ", JSON.stringify(data));
      // this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B113");
    });
  }

  unsaveContent(data) {
    console.log("request unsaveContent = ", JSON.stringify(data));
    let parameter = {
      t1: data.t3,
      t4: this.registerData.t2,
      n1: this.registerData.syskey,
      n2: data.syskey,
      n3: 0,
      sessionKey: this.registerData.sessionKey
    }
    console.log("request unsaveContent parameter = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/unsaveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response unsaveContent = ", JSON.stringify(data));
      //this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B114");
    });
  }

  getSettings() {
    this.navCtrl.push(SettingsPage);
  }

  singlePhoto(i) {
    console.log("viewImage == " + JSON.stringify(i));
    this.navCtrl.push(ViewPhotoMessagePage, {
      data: i,
      contentImg: "singlePhoto"
    });
  }

  goVideoDetail(data) {
    if (!this.billStatus) {
      // this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (this.pageStatus == 1) {
        this.navCtrl.push(SugvideoPage, {
          data: data
        });
      }
      else {
        this.navCtrl.push(SugvideoPage, {
          data: data
        });
      }
    }
    //this.logger.fbevent(data.t1, { pram: data.syskey });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PremiumPage');
  }

}
