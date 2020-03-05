import { Component, ViewChild, ElementRef } from '@angular/core';
import { Content } from 'ionic-angular';
import { NavController, NavParams, AlertController, LoadingController, PopoverController, ViewController, Platform, ToastController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Slides } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { CommentPage } from '../comment/comment';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { TabsPage } from '../tabs/tabs';
import { PostLikePersonPage } from '../post-like-person/post-like-person';
import { PaymentPage } from '../payment/payment';

@Component({
  selector: 'page-sugvideo',
  templateUrl: 'sugvideo.html',
})
export class SugvideoPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  currentPlayingVideo: HTMLVideoElement;

  rootNavCtrl: NavController;
  pageStatus: any;
  registerData: any;
  popover: any;
  start: any = 0;
  end: any = 0;
  nores: any;
  isLoading: any;
  url: any = '';
  menuList: any = [];
  font: any;
  textMyan: any = ["ဗီဒီယို", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "ကြည့်ရန်", "ခု"];
  textEng: any = ["Video", "Like", "Comment", "Share", "No result found", "View", "Count"];
  textData: any = [];
  playvideoLink: SafeResourceUrl;
  photoLink: any;
  videoImgLink: any;
  noticount: any;
  db: any;
  videoData: any = [];
  vData: any = [];
  vid: any;
  img: any = '';
  vLink: any;
  writerImg: any;
  playFlag: any;
  onscroll: any = false;
  videoStatus: any;
  billStatus: any;
  mptPopup: any;
  loading: any;
  chekbillAlert: any;
  cutphno: any;
  callid: any;
  passData: any;
  //videoIndex:any;
  singleIndex: any = 1;
  updateVideoList: any = [];
  youtubeStatus: any = false;
  updatearr: any = [];
  showlikeStatus: any;
  alertPopup: any;
  paymentStr: any = '';

  paymentData: any = [
    { month: '၁', price: '၂,၅၀၀', status: '1' },
    { month: '၄', price: '၈,၀၀၀', status: '1' },
    { month: '၈', price: '၁၄,၀၀၀', status: '1' },
    { year: '၁', price: '၁၈,၀၀၀', status: '2' },
  ];

  paymentData1: any = [
    { month: '၁', price: '၁၀၀', status: '1' },
    { month: '၄', price: '၂၀၀', status: '1' },
    { month: '၈', price: '၃၀၀', status: '1' },
    { year: '၁', price: '၄၀၀', status: '2' },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, public platform: Platform,
    public storage: Storage, public changefont: ChangefontProvider,
    public toastCtrl: ToastController, public logger: EventLoggerProvider,
    public http: Http, public alert: AlertController,
    public funct: FunctProvider, public loadingCtrl: LoadingController,
    public changeLanguage: ChangelanguageProvider, public fba: FirebaseAnalytics,
    public events: Events, public datepipe: DatePipe,
    public sanitizer: DomSanitizer, public sqlite: SQLite) {

    this.vid = document.getElementById("myPlayer");
    this.writerImg = this.funct.imglink + "upload/image/WriterImage";
    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";

    this.vLink = this.funct.imglink + "upload/video/";
    this.passData = this.navParams.get("data");

    if (this.passData.n10 == 1) {
      this.passData.playvideoLink = this.passData.t8.changingThisBreaksApplicationSecurity;
    }
    else if (this.passData.n10 == 2) {
      this.passData.playvideoLink = this.passData.t8.changingThisBreaksApplicationSecurity;
      this.passData.playvideoLink = this.funct.corrigirUrlYoutube(this.passData.playvideoLink);
    }
    else {
      this.passData.playvideoLink = this.vLink + this.passData.uploadedPhoto[0].t2;
    }
    if (this.passData != '' && this.passData != undefined) {
      if (this.passData.t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
        this.passData.seeMore = true;
      }
      else {
        this.passData.seeMore = false;
      }
    }

    //this.videoIndex =  this.navParams.get("index");

    this.videoStatus = this.navParams.get("videoStatus");
    if (this.videoStatus != 1) {
      this.videoStatus = this.passData.n1;
    }
    console.log("sugvideo passData == " + JSON.stringify(this.passData));
    console.log("sugvideo status == " + this.videoStatus);

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

    this.storage.get('billStatus').then((data) => {
      this.billStatus = data;
    });

    // this.storage.get('b2bregData').then((data) => {
    //   this.registerData = data;
    //   console.log("registerData = " + JSON.stringify(this.registerData));
    //   this.start = 0;
    //   this.end = 0;
    //   this.menuList = [];
    //   this.getList(this.start, '');
    //   this.isLoading = true;
    // });

    this.events.subscribe('language', language => {
      console.log("change language = " + language);
      this.changeLanguage.changelanguage(language, this.textEng, this.textMyan).then((data) => {
        this.textData = data;
        if (language != "zg")
          this.font = 'uni';
        else
          this.font = language;
        for (let i = 0; i < this.menuList.length; i++) {
          this.changeLanguage.changelanguageText(this.font, this.menuList[i].t2).then((res) => {
            this.menuList[i].t2 = res;
            console.log("video link" + this.menuList[i].t8);
          })
        }
        console.log("data language=" + JSON.stringify(data));
      });
    })
  }

  /*ionViewCanEnter(){
    this.storage.get('youtubelink').then((data) => {
      console.log("sugvideo viewcanenter youtubelink == "+JSON.stringify(data));
      if(data !='' && data !=null && data !=undefined){
        if(this.menuList.length > 0 && this.menuList !=undefined){
          this.menuList[data.index].playvideoLink = this.funct.corrigirUrlYoutube(data.value);
          //this.storage.remove('youtubelink');
        }   
      }
    });
  }

  ionViewWillLeave(){    
   // let listaFrames = document.getElementsByTagName("iframe");
      this.storage.get('youtubelink').then((data) => {
        console.log("sugvideo viewcanleave youtubelink == "+JSON.stringify(data));
        if(data !='' && data !=null && data !=undefined && this.youtubeStatus){
          if(this.menuList.length > 0 && this.menuList !=undefined){
            this.menuList[data.index].playvideoLink = this.funct.corrigirUrlYoutube(data.value);
            this.youtubeStatus = false;
          }   
        }
      });
  }*/

  ionViewWillEnter() {
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
      this.start = 0;
      this.end = 0;
      this.menuList = [];
      this.getList(this.start, '');
      this.isLoading = true;
    });
  }

  ionViewDidLoad() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  getList(start, infiniteScroll) {
    let updatearr = [];
    this.end = this.end + 10;
    let parameter = {
      start: start,
      end: this.end,
      size: 10
    }
    console.log("request video = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceVideo/searchVideo?searchVal=&userSK=' + this.registerData.syskey + '&mobile=' + this.registerData.t1 + '&firstRefresh=1' + '&videoStatus=' + this.videoStatus + '&sessionKey=' + this.registerData.sessionKey, parameter).map(res => res.json()).subscribe(data => {
      console.log("response video = ", JSON.stringify(data));
      if (data.data.length > 0) {
        this.nores = 1;
        updatearr.push(this.passData);
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].n10 == 1) {
            data.data[i].playvideoLink = data.data[i].t8;
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
            data.data[i].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(data.data[i].t8);
          }
          else if (data.data[i].n10 == 2) {
            if (data.data[i].uploadedPhoto.length > 0) {
              data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
            }
            //data.data[i].playvideoLink = data.data[i].t8;
            data.data[i].playvideoLink = this.funct.corrigirUrlYoutube(data.data[i].t8);
            console.log("n10 = 2 and sugyoutube link == " + data.data[i].playvideoLink);
          }
          else {
            if (data.data[i].uploadedPhoto.length > 0) {
              if (data.data[i].uploadedPhoto[0].t2 != '') {
                data.data[i].videoLink = this.videoImgLink + data.data[i].uploadedPhoto[0].t7;
                data.data[i].playvideoLink = this.vLink + data.data[i].uploadedPhoto[0].t2;
              }
            }
          }
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
            data.data[i].seeMore = true;
          }
          else {
            data.data[i].showread = false;
            data.data[i].seeMore = false;
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
              let temparr = data.data[i].t2.split("[#img]");
              console.log("temparr == " + temparr + "   ///   temparr length =    " + temparr.length);
              let str = '';
              for (let t = 0; t < temparr.length; t++) {
                str = str + temparr[t];
              }
              data.data[i].shMsg = str;
              console.log("str == " + str);
            }
            else {
              data.data[i].shMsg = data.data[i].t2;
            }
          }
          else {
            data.data[i].shMsg = data.data[i].t2;
          }
          if (data.data[i].syskey == this.passData.syskey) {
            updatearr = [];
            this.singleIndex = i;
            updatearr.push(data.data[i]);
            // this.menuList.push(data.data[i]);
            console.log("singleIndex == " + JSON.stringify(this.singleIndex));
            console.log("singleIndex == " + this.singleIndex);
            console.log("updateVideoList == " + JSON.stringify(updatearr));
          }
          else {
            this.menuList.push(data.data[i]);
          }
        }

        if (updatearr.length > 0) {
          this.menuList = updatearr.concat(this.menuList);
        }
        console.log("singleIndex == " + JSON.stringify(this.menuList));
        //console.log("singleIndex == "+this.menuList.length);

        if (infiniteScroll != '') {
          infiniteScroll.complete();
        }
      }
      else {
        if (this.end > 10) {
          if (infiniteScroll != '') {
            infiniteScroll.complete();
          }
          this.end = this.start - 1;
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
    }, error => {
      console.log("signin error=" + error.status);
      this.nores = 0;
      this.isLoading = false;
      this.getError(error, "B115");
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end + 1;
        if (!this.isLoading) {
          this.getList(this.start, infiniteScroll);
        }
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    })
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
      dismissOnPageChange: true,
    });
    toast.present(toast);
    this.isLoading = false;
    console.log("Oops!");
  }

  seeMoreData(index, i) {
    console.log("see=" + index)
    console.log("data=" + JSON.stringify(i));

    if ((i.t4 == 'premium') && !this.billStatus) {
      this.paymentBill();
    }
    else {
      if (this.menuList[index].seeMore)
        this.menuList[index].seeMore = false;
      else
        this.menuList[index].seeMore = true;
    }
  }

  clickLike(data, k) {
    console.log("data=" + JSON.stringify(data));
    // if((data.t4 == 'premium') && !this.billStatus){                   //atda
    //   //this.fillBill();
    //   this.choosePayment();
    // }
    //else{
    if (!data.showLike) {
      this.menuList[k].showLike = true;
      this.menuList[k].n2 = this.menuList[k].n2 + 1;
      this.menuList[k].likeCount = this.funct.getChangeCount(this.menuList[k].n2);
      this.getLike(data, k);
    }
    else {
      this.menuList[k].showLike = false;
      this.menuList[k].n2 = this.menuList[k].n2 - 1;
      this.menuList[k].likeCount = this.funct.getChangeCount(this.menuList[k].n2);
      this.getUnlike(data, k);
    }
    // }
  }

  getLike(data, k) {

    console.log("data in getLike sugvideo page >> ", JSON.stringify(data));
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: 'interview'
    }
    console.log("request clickLike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("response clickLike = ", JSON.stringify(result));
      if (result.state) {
        this.menuList[k].showLike = true;
        this.showlikeStatus = true;

        this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.showlikeStatus }).then((res: any) => {
          console.log("name=>" + name + "/status=>" + res);
        })
          .catch((error: any) => console.error(error));
      }
      else {
        this.menuList[k].showLike = false;
        this.menuList[k].n2 = this.menuList[k].n2 - 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  getUnlike(data, k) {
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: 'interview'
    }
    console.log("request clickLUnlike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("response clickLUnlike = ", JSON.stringify(data));
      if (data.state) {
        this.menuList[k].showLike = false;
      }
      else {
        this.menuList[k].showLike = true;
        this.menuList[k].n2 = this.menuList[k].n2 + 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B112");
    });
  }

  writerProfile(data, k) {
    if (data.n10 == 2) {
      this.youtubeStatus = true;
      this.menuList[k].playvideoLink = this.funct.corrigirUrlYoutube(data.t8);
      this.storage.set("youtubelink", { value: data.t8, index: k });
    }
    if (this.currentPlayingVideo != undefined) {
      this.currentPlayingVideo.pause();
    }
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      this.navCtrl.push(WriterprofilePage, {
        data: data.perData
      });
    }
  }

  getLikePerson(i, k) {
    if (i.n10 == 2) {
      this.menuList[k].playvideoLink = this.funct.corrigirUrlYoutube(i.t8);
    }
    if (this.currentPlayingVideo != undefined) {
      this.currentPlayingVideo.pause();
    }
    if ((i.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
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

  comment(data, k) {
    if (data.n10 == 2) {
      this.youtubeStatus = true;
      this.menuList[k].playvideoLink = this.funct.corrigirUrlYoutube(data.t8);
      this.storage.set("youtubelink", { value: data.t8, index: k });
    }
    if (this.currentPlayingVideo != undefined) {
      this.currentPlayingVideo.pause();
    }
    console.log("this is sag video page continue data" + JSON.stringify(data));
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      this.navCtrl.push(CommentPage, {
        data: data,
        title: 'comment'
      });
    }
    // this.logger.fbevent(data.t1,{ pram: data.syskey});
    this.fba.logEvent('page_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, }).then((res: any) => {
      console.log("name=>" + name + "/status=>" + res);
    })
      .catch((error: any) => console.error(error));
  }

  paymentBill() {

    console.log("paymentBill");

    this.paymentStr = '';

    for (var j = 0; j < this.paymentData.length; j++) {

      if (this.paymentData[j].status == "1") {
        this.paymentStr += '<p class="month">' + this.paymentData[j].month + '</p>';
        this.paymentStr += '<p class="month1"> လ</p>-';
      }
      else {
        this.paymentStr += '<p class="month">' + this.paymentData[j].year + '</p>';
        this.paymentStr += '<p class="month1"> နှစ်</p>-';
      }

      this.paymentStr += '<p class="price">' + this.paymentData[j].price + '</p>';
      this.paymentStr += " ကျပ်";

      if (j != this.paymentData.length - 1) {
        this.paymentStr += '<br>';
      }
    }

    console.log("pay str1>" + this.paymentStr);

    this.alertPopup = this.alert.create({
      subTitle: '<div class="popUpStyle"> <span class="premiumTitle"> PREMIUM </span> <br><br> <span class="premiumsubBody"> မြန်မာ့စီးပွားထူးချွန်သူများနှင့် တွေ့ဆုံခြင်းများ၊ စီးပွားရေးစကားဝိုင်းများ၊ အထူးအင်တာဗျူးနှင့် ဆောင်းပါးများ၊ ကိုယ်ပိုင်လုပ်ငန်းလုပ်ကိုင်လိုသူများအတွက် လေ့လာရန် သင်ခန်းစာများ အပါအဝင် စီးပွားရေး၊ စီမံခန့်ခွဲမှုဆိုင်ရာ ဗဟုသုတနဲ့ အတွေးအမြင်များစွာ  ရရှိနိုင်မယ့် B2B Premium အစီအစဉ်ကို အောက်ပါနှုန်းထားများဖြင့် ဖတ်ရှုလေ့လာနိုင်ပါပြီ။ </span> <br><br> <span class="premiumsubTitle">' + this.paymentStr + '</span><div>',
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
    else if (this.cutphno == '9') {
      billip = "ooredoo";
      this.chekbillAlert = this.alert.create({
        subTitle: 'If you want to test with bill payment, you must register with MPT Phno.',
        cssClass: this.font,
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
    else {
      billip = "http://apiv2.blueplanet.com.mm/mptsdp/billingapi.php?u=b2bapp&p=6176ad840c3099c74ee924cdea48b0b9&k=B2BAPP&c=800&callerid=" + this.callid;
    }

    console.log("billip == " + billip);

    this.http.post(billip, '').map(res => res.json()).subscribe(data => {
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

        console.log("    smsip == " + smsip);
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
            this.chekbillAlert.onDidDismiss(unregBackButton);    */
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

  share(i) {
    console.log("this is share url == " + JSON.stringify(i) + "  //////////////  url === " + JSON.stringify(i.t8));

    // if(( i.t4 == 'premium') && !this.billStatus){                     //atda
    //   //this.fillBill();
    //   this.choosePayment();
    // }
    // else{
    let sahareImg = this.funct.imglink + "image/B2B_LOGO.gif";
    if (i.uploadedPhoto.length > 0) {
      sahareImg = this.videoImgLink + i.uploadedPhoto[0].t7;
    }

    //let title =this.changefont.UnitoZg(i.t1);
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
    //}

    this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, }).then((res: any) => {
      console.log("name=>" + name + "/status=>" + res);
    })
      .catch((error: any) => console.error(error));
  }

  clickBookMark(data, k) {
    console.log("data=" + JSON.stringify(data));
    console.log("k == " + k);
    console.log("singleindex == " + this.singleIndex);
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (!data.showContent) {
        this.menuList[k].showContent = true;
        this.saveContent(data, k);
      }
      else {
        this.menuList[k].showContent = false;
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

  // paymentBill1(){
  //   console.log("paymentBill1...");
  //     this.paymentBill();
  // }

  onPlayingVideo(event, index) {
    console.log("index=" + index)
    // if ((i.t4 == 'premium') && !this.billStatus) {
    //   console.log("P");
    //   this.paymentBill();
    // }
    // else {
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
   // }
  }

}
