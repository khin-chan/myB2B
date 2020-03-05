import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, PopoverController, NavParams, Content, ViewController, LoadingController, ToastController, Platform, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { CommentPage } from '../comment/comment';
import { SettingsPage } from '../settings/settings';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { TabsPage } from '../tabs/tabs';
import { SugvideoPage } from '../sugvideo/sugvideo';
import { PostLikePersonPage } from '../post-like-person/post-like-person';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

/**
 * Generated class for the LearnFormGuyuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-learn-form-guyu',
  templateUrl: 'learn-form-guyu.html',
  providers: [ChangelanguageProvider, ChangefontProvider]
})
export class LearnFormGuyuPage {
  @ViewChild(Content) content: Content;
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
  textMyan: any = ["Learning From Learners", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "ခု"];
  textEng: any = ["Learning From Learners", "Like", "Comment", "Share", "No result found", "Count"];
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
  bankPopup: any;
  passData: any;
  okData: any;
  paymentStr: any = '';
  bankStr: any = '';
  isAlert: any = false;
  showlikeStatus: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public cdata: DatacleanComponent,
    public navParams: NavParams, public popoverCtrl: PopoverController, public changefont: ChangefontProvider,
    public storage: Storage, public toastCtrl: ToastController, public http: Http, public funct: FunctProvider,
    public events: Events, public platform: Platform, public alert: AlertController, private appMinimize: AppMinimize,
    public changeLanguage: ChangelanguageProvider, public sanitizer: DomSanitizer, public logger: EventLoggerProvider,
    public sqlite: SQLite, public loadingCtrl: LoadingController, public datepipe: DatePipe, private _zone: NgZone,
    public fba: FirebaseAnalytics, ) {

    //this.pageStatus = this.navParams.get('pageStatus');
    this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";
    this.writerImg = this.funct.imglink + "upload/image/WriterImage";
    this.vLink = this.funct.imglink + "upload/video/";

    this.passData = this.navParams.get("data");
    console.log("passData>" + JSON.stringify(this.passData));

    this.billStatus = this.navParams.get("billstatus");
    console.log("Bank Payment>" + JSON.stringify(this.billStatus));

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
  }

  goNotiList() {
    //this.navCtrl.push(NotiListPage);
  }

/*   menuCount() {
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
  } */

  payPaymentList(data) {

    this.http.get(this.funct.ipaddress2 + 'serviceTeacher/getPaymentList?syskey=' + data.syskey + '&sessionKey=' + data.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("Response Paymaent List Data == " + JSON.stringify(result));
      if (result.data.length > 0 && result.state) {
        console.log("state true");
        this.paymentStr = '';
        for (var j = 0; j < result.data.length; j++) {

          this.paymentStr += result.data[j].month;
          this.paymentStr += " လလျှင် ";
          this.paymentStr += result.data[j].price;
          this.paymentStr += " ကျပ်";
          //this.paymentStr+=result[j].month + "လျှင် " + result[j].payment + "ကျပ်";

          if (j != result.data.length - 1) {
            this.paymentStr += '<br>- ';

          }
        }
        console.log("pay str1>" + this.paymentStr);
      }
      else {
        if (!result.sessionState) {
          this.cdata.sessionAlert();
        }
        else {
          this.nores = 0;
        }
      }
      this.isLoading = false;
    }, error => {
      this.getError(error, "B130");
    });
  }

  bankNameList(data) {

    this.http.get(this.funct.ipaddress2 + 'serviceTeacher/getBankAccount?syskey=' + data.syskey + '&sessionKey=' + data.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("Response Bank Account List Data == " + JSON.stringify(result));
      if (result.data.length > 0 && result.state) {
        console.log("state true");
        for (var k = 0; k < result.data.length; k++) {
          if (k != result.data.length - 1) {
            this.bankStr += "Bank - " + result.data[k].t1 + "<br> Bank Acc - " + result.data[k].t3 + "<br> Acc Name - " + result.data[k].t2 + "<br>";
            console.log("Bank String == " + JSON.stringify(this.bankStr));
          }
          else {
            this.bankStr += "Bank - " + result.data[k].t1 + "<br>" + "Bank Acc - " + result.data[k].t3 + "<br>" + "Acc Name - " + result.data[k].t2;
            console.log("Bank String1 == " + JSON.stringify(this.bankStr));
          }

        }

      }
      else {
        if (!result.sessionState) {
          this.cdata.sessionAlert();
        }
        else {
          this.nores = 0;
        }
      }
      this.isLoading = false;
    }, error => {
      this.getError(error, "B130");
    });

  }

  paymentBill() {
    console.log("ps>" + this.paymentStr);
    console.log("bs>" + this.bankStr);

    this.bankPopup = this.alert.create({
      subTitle: '<div>Learning From Learners ၏ ဝန်ဆောင်မှုကို <br> - ' + this.paymentStr + ' ဖြင့်ရယူနိုင်ပါသည်။ <br>' + this.bankStr + ' တွင်ငွေလွှဲနိုင်ပါသည်။ <div>',
      cssClass: this.font,
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'alertButton',
          handler: data => {
          }
        },
        {
          text: 'Ok',
          cssClass: 'alertButton',
          handler: data => {
            this.okStatus();
          }
        }
      ],
      enableBackdropDismiss: false

    });
    this.bankPopup.present();
    let doDismiss = () => this.bankPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.bankPopup.onDidDismiss(unregBackButton);
  }

  okStatus() {
    this.http.get(this.funct.ipaddress2 + 'serviceTeacher/setTeacherPayment?syskey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("Response OK Data == " + JSON.stringify(result));
      if (result.state) {
        this.okData = result.msgDesc;
        console.log("OK Data == " + JSON.stringify(this.okData));
        this.nores = 1;
      }
      else {
        if (!result.sessionState) {
          this.cdata.sessionAlert();
          this.nores = 0;
        }
        else {
          this.nores = 0;
        }
      }
      this.isLoading = false;
    }, error => {
      this.getError(error, "B130");
    });

  }
  
  ionViewDidEnter() {
    this.events.subscribe('notiStatus', status => {
      console.log("notistatus " + status);
      this.notiStatus = status;
    });
    this.backButtonExit();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      console.log("this.isAlert=" + this.isAlert);
      if (this.isAlert) {
        this.alertPopup.dismiss();
        this.isAlert = false;
      }
      else
        this.navCtrl.pop();
    });
  }

  getPinList(start, infiniteScroll) {
    //this.isLoading = true;
    this.end = this.end + 10;
    console.log("response general = ", JSON.stringify(this.end));
    let parameter = {
      start: start,
      end: this.end,
      size: 10,
    }
    console.log("response general = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceTeacher/getGuyuPinPostlist?syskey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey + '&gsysKey=' + this.passData.syskey, parameter).map(res => res.json()).subscribe(data => {
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
      "start": start,
      "end": this.end,
      "size": 10,
    }

    console.log("home page == " + JSON.stringify(parm));
    this.http.post(this.funct.ipaddress2 + 'serviceTeacher/getGuyuPostlist?syskey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey + '&gsysKey=' + this.passData.syskey, parm).map(res => res.json()).subscribe(data => {
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
    if (!this.billStatus) {
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
    console.log("bankPayment == " + this.billStatus);

    if (!this.billStatus) {
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
    this.fba.logEvent('page_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1 }).then((res: any) => {
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
    if (!this.billStatus) {
      this.paymentBill();
    }
    else {
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
    }
    
    this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1 }).then((res: any) => {
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
    console.log("data=" + JSON.stringify(data));
    if (!this.billStatus) {
      this.paymentBill();
    }
    else {
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
    }
  }

  getLike(data, k, status) {

    console.log("data in getLike learn from guyu page >> ", JSON.stringify(data));
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
    //data.t1, { pram: data.syskey });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LearnFormGuyuPage');
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      // this.menuCount();
      this.isLoading = true;
      this.payPaymentList(data);
      this.bankNameList(data);
      this.getPinList(this.start, '');
      console.log("registerData = " + JSON.stringify(this.registerData));
    });
    
  }

}
