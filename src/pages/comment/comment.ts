import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Events, Content, TextInput } from 'ionic-angular';
import {
  NavController, NavParams, PopoverController, Platform, LoadingController, ViewController,
  ToastController, ActionSheetController, Navbar, AlertController
} from 'ionic-angular';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Clipboard } from '@ionic-native/clipboard';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';

import { ReplyCommentPage } from '../reply-comment/reply-comment';
import { LikepersonPage } from '../likeperson/likeperson';
import { PopoverCommentPage } from '../popover-comment/popover-comment';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { SugvideoPage } from '../sugvideo/sugvideo';
import { PostLikePersonPage } from '../post-like-person/post-like-person';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
  providers: [FunctProvider, ChangelanguageProvider, ChangefontProvider]
})
export class CommentPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('loginButton') loginButton;
  //@ViewChild('chat_input') messageInput: TextInput;
  textMyan: any = ["မှတ်ချက်များ", "မှတ်ချက် မရှိပါ။", "မှတ်ချက်ရေးရန် ...", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "အသေးစိတ်အချက်အလက်"];
  textEng: any = ["Replies", "No Replies", "Write a comment .....", "comment", "share", "Detail"];
  textdata: string[] = [];
  font: string = '';
  passData: any;
  title: any = '';
  replyData: any = [];
  isLoading: any;
  time: any;
  comment: any = '';
  postcmt: any = { t3: '', t2: '' };
  popover: any;
  registerData: any = { t3: '' };
  loading: any;
  nores: any;
  photoLink: any;
  videoImgLink: any;
  textData: any = [];
  like: any = true;
  unlike: any = false;
  likeCount: any = 0;
  replyCount: any = 3;
  detailData: any;
  exit: any = false;
  url: any;
  cmtphotoLink: any;
  textreply: any;
  personlike: any = [];
  img: any = '';
  status: any = false;
  textFont: any = '';
  writerImg: any;
  errorimg: any = 'onError=\"this.src = \'/assets/images/imgErr.png\'\"';
  array: any;
  array1: any = [];
  arrlength: any;
  uploadLength: any;
  listenFunc: HTMLElement;
  tempimg: HTMLElementTagNameMap;
  imgContentLink: any;
  imageLink: any;
  testRadiouni: boolean;
  testRadiozg: boolean;
  alertPopup: any;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public storage: Storage, public alert: AlertController,
    public datePipe: DatePipe, public http: Http, public toastCtrl: ToastController, public changeLanguage: ChangelanguageProvider,
    public popoverCtrl: PopoverController, public platform: Platform, public funct: FunctProvider, public sanitizer: DomSanitizer,
    public clipboard: Clipboard, public changefont: ChangefontProvider, public events: Events,
    public fba: FirebaseAnalytics,
    elementRef: ElementRef, renderer: Renderer) {

    this.photoLink = this.funct.imglink + "upload/image/userProfile";
    this.writerImg = this.funct.imglink + "upload/image/WriterImage";
    this.imageLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";
    this.detailData = this.navParams.get('data');
    this.title = this.navParams.get('title');
    console.log("detailData = " + JSON.stringify(this.detailData));
    console.log("detailData.uploadedPhoto.length == " + this.detailData.uploadedPhoto.length);
    if (this.detailData.t2.indexOf("<img ") > -1) {
      this.detailData.t2 = this.detailData.t2.replace(/<img /g, "<i ");
      console.log("replace img == " + this.detailData.t2);
      this.detailData.t2 = this.detailData.t2.replace(/ \/>/g, "></i>");
      console.log("replace <i/> == " + this.detailData.t2);
    }
    let num = this.detailData.t2;
    console.log("comment num == " + JSON.stringify(num));
    this.array = num.split("[#img]");
    console.log("dat=" + JSON.stringify(this.array))
    for (let i = 0; i < this.array.length; i++) {
      console.log("i=" + this.array[i])
      let arr = {};
      if (this.array[i] == "<p>") {
        arr = { t1: "img", t2: this.imageLink + this.detailData.uploadedPhoto[i].t7, caption: this.detailData.uploadedPhoto[i].t5 };
        this.array1.push(arr);
        console.log("array of i is == <p>");
      }
      else if (this.array[i] == "") {
        arr = { t1: "img", t2: this.imageLink + this.detailData.uploadedPhoto[i].t7, caption: this.detailData.uploadedPhoto[i].t5 };
        this.array1.push(arr);
        console.log("array of i is == ''");
      }
      else {
        console.log("else case .............");
        if (i != this.array.length - 1) {
          console.log("ii=" + this.array[i])
          let arr1 = { t1: "text", t2: this.array[i] };
          arr = { t1: "img", t2: this.imageLink + this.detailData.uploadedPhoto[i].t7, caption: this.detailData.uploadedPhoto[i].t5 };
          this.array1.push(arr1);
          this.array1.push(arr);
        }
        else {
          console.log("else case i===this.array.length-1...........");
          arr = { t1: "text", t2: this.array[i] };
          this.array1.push(arr);
        }
      }
    }
    console.log("dat=" + JSON.stringify(this.array1));


    this.passData = this.navParams.get("data");
    console.log("passData = " + JSON.stringify(this.passData));
    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textEng, this.textMyan).then((data) => {
        this.textData = data;
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        for (let i = 0; i < this.replyData.length; i++) {
          this.changeLanguage.changelanguageText(this.font, this.replyData[i].t2).then((res) => {
            this.replyData[i].t2 = res;
          })
        }
        console.log("data language=" + JSON.stringify(data));
      });
    });

    this.events.subscribe('textboxlan', data => {
      console.log("textbox subscribe >>> ", data);
      this.textFont = data;
      if (this.textFont == 'zg') {
        this.textData[2] = this.changefont.UnitoZg(this.textMyan[2]);
        this.testRadiozg = true;
        this.testRadiouni = false;
      }
      else {
        this.textData[2] = this.textMyan[2];
        this.testRadiouni = true;
        this.testRadiozg = false;
      }
    });

    this.storage.get('textboxlan').then((result) => {
      console.log("font == " + result);
      this.textFont = result;
      /*this.changeLanguage.changelanguageText( this.textFont, this.textMyan[2]).then((res) => {
         this.textMyan[2] = res;
      })*/
      if (result == '' || result == undefined || result == null) {
        this.textFont = 'uni';
      }
      else {
        this.textFont = result;
        if (this.textFont == 'zg') {
          this.textData[2] = this.changefont.UnitoZg(this.textMyan[2]);
          this.testRadiozg = true;
          this.testRadiouni = false;
        }
        else {
          this.textData[2] = this.textMyan[2];
          this.testRadiouni = true;
          this.testRadiozg = false;
        }
      }
    });
  }

  singlePhoto(i) {
    console.log("viewImage == " + JSON.stringify(i));
    this.navCtrl.push(ViewPhotoMessagePage, {
      data: i,
      contentImg: "singlePhoto"
    });
  }


  ionViewWillEnter() {
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
      this.getCommentData();
    });

    this.backButtonExit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content._scroll) this.content.scrollToBottom(0);
    }, 400)
  }

  getCommentData() {     //tmn
    this.http.get(this.funct.ipaddress2 + 'serviceQuestion/getCommentmobile?id=' + this.passData.syskey + '&userSK=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("return Commentfunt data = " + JSON.stringify(result));
      this.isLoading = true;
      if (result.data.length > 0) {
        this.nores = 1;
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].differenceTime = this.funct.getTimeDifference(result.data[i].modifiedDate, result.data[i].modifiedTime);

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
          if (result.data[i].n3 == 1) {
            result.data[i].textreply = "reply";
          }
          else if (result.data[i].n3 > 1) {
            result.data[i].textreply = "replies";
          }
        }
        this.replyData = result.data;

        //this.scrollToBottom();
        console.log("replyData data = " + JSON.stringify(this.replyData));
      }
      else {
        this.nores = 0;
      }
      if (this.title == 'comment') {
        this.scrollToBottom();
      }
      this.isLoading = false;
    },
      error => {
        this.getError(error, "B122");
      });
  }

  onFocus() {
    this.scrollToBottom();
  }

  writerProfile(data) {
    this.navCtrl.push(WriterprofilePage, {
      data: data
    });
  }

  saveComment() {
    if (this.comment != '' && this.comment != ' ' && this.comment.trim() != '') {
      this.status = true;
      let parameter = {
        t1: "answer",
        t2: this.comment,
        n1: this.passData.syskey,
        n5: this.registerData.syskey,
        sessionKey: this.registerData.sessionKey
      }
      //   this.postcmt = {t3: this.registerData.t2 , t2: this.comment};
      console.log("requst saveComment=" + JSON.stringify(parameter));
      //  this.replyData.push(this.postcmt);
      this.scrollToBottom();
      this.http.post(this.funct.ipaddress2 + 'serviceQuestion/saveAnswer', parameter).map(res => res.json()).subscribe(result => {
        console.log("return saveComment data = " + JSON.stringify(result));
        if (result.state && result.data.length > 0) {
          this.nores = 1;

          for (let i = 0; i < result.data.length; i++) {
            result.data[i].differenceTime = this.funct.getTimeDifference(result.data[i].modifiedDate, result.data[i].modifiedTime);

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
            if (result.data[i].n3 == 1) {
              result.data[i].textreply = "reply";
            }
            else if (result.data[i].n3 > 1) {
              result.data[i].textreply = "replies";
            }
          }


          this.replyData = result.data;
          this.scrollToBottom();
          this.comment = '';
          this.detailData.n3 = this.detailData.n3 + 1;
          this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
        }
        else {
          if (this.replyData.length > 0)
            this.nores = 1;
          else
            this.nores = 0;
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
        this.status = false;
        this.isLoading = false;
        this.comment = '';
        this.content.resize();
        this.scrollToBottom();
      },
        error => {
          this.status = false;
          this.comment = '';
          if (this.replyData.length > 0)
            this.nores = 1;
          else
            this.nores = 0;
          this.getError(error, "B123");
        });
    }
    else {
      this.comment = '';
    }
  }

  changelanfont() {
    this.alertPopup = this.alert.create();
    this.alertPopup.setSubTitle('ဖောင့်အမျိုးအစား');
    this.alertPopup.setCssClass(this.font);

    this.alertPopup.addInput({
      type: 'radio',
      label: 'ယူနီ',
      value: 'uni',
      checked: this.testRadiouni
    });

    this.alertPopup.addInput({
      type: 'radio',
      label: 'ဇော်ဂျီ',
      value: 'zg',
      checked: this.testRadiozg
    });

    // this.alertPopup.addButton('Cancel');
    this.alertPopup.addButton({
      text: 'Cancel',
      handler: data => {
      }
    });
    this.alertPopup.addButton({
      text: 'OK',
      handler: data => {
        this.storage.set('textboxlan', data);
        this.events.publish('textboxlan', data);
        this.textFont = data;
        console.log("font data >>> ", data);
      }
    });
    this.alertPopup.present();
    let doDismiss = () => this.alertPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.alertPopup.onDidDismiss(unregBackButton);
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
      dismissOnPageChange: true,
    });
    toast.present(toast);
    this.isLoading = false;
    console.log("Oops!");
  }

  changeLike(skey, index) {
    this.replyData[index].likeCount = this.replyData[index].likeCount - 1;
    let parameter = {
      n1: this.registerData.syskey,
      n2: skey,
      sessionKey: this.registerData.sessionKey
    }
    console.log("requst saveComment=" + JSON.stringify(parameter));
    //this.scrollToBottom();
    this.http.post(this.funct.ipaddress2 + 'serviceQuestion/saveCommentLike', parameter).map(res => res.json()).subscribe(data => {
      console.log("return likecomment data = " + JSON.stringify(data));
      console.log("data length == " + data.data.length);
      if (data.state && data.data.length > 0) {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].person.length > 0) {
            for (let k = 0; k < data.data[i].person.length; k++) {
              if (data.data[i].person[k].syskey == this.registerData.syskey) {
                this.replyData[index].like = "UnLike";
                break;
              }
              else {
                this.replyData[index].like = "Like";
              }
            }
          }
          else {
            this.replyData[index].like = "Like";
          }
          this.replyData[index].likeCount = data.data[i].person.length;
          this.replyData[index].person = data.data[i].person;
        }
      }
    },
      error => {
        this.getError(error, "B124");
      });
  }

  likePerson(cmt) {
    console.log("this.personlike == " + JSON.stringify(this.personlike));
    this.navCtrl.push(LikepersonPage, {
      data: cmt
    });
  }

  ClickReply(cmt) {
    this.navCtrl.push(ReplyCommentPage, {
      data: cmt,
      detaildata: this.detailData
    });
  }

  clickLike(data) {
    console.log("data=" + JSON.stringify(data));
    if (!data.showLike) {
      this.detailData.showLike = true;
      this.detailData.n2 = this.detailData.n2 + 1;
      this.detailData.likeCount = this.funct.getChangeCount(this.detailData.n2);
      this.getLike(data);
    }
    else {
      this.detailData.showLike = false;
      this.detailData.n2 = this.detailData.n2 - 1;
      this.detailData.likeCount = this.funct.getChangeCount(this.detailData.n2);
      this.getUnlike(data);
    }
  }

  getLike(data) {
    console.log("data in getLike comment page >> ", JSON.stringify(data));
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("response clickLike = ", JSON.stringify(result));
      if (result.state) {
        this.detailData.showLike = true;

        this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.detailData.showLike }).then((res: any) => {
          console.log("name=>" + name + "/status=>" + res);
        })
          .catch((error: any) => console.error(error));
      }
      else {
        this.detailData.showLike = false;
        this.detailData.n2 = this.detailData.n2 - 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  getUnlike(data) {
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLUnlike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("response clickLUnlike = ", JSON.stringify(data));
      if (data.state) {
        this.detailData.showLike = false;
      }
      else {
        this.detailData.showLike = true;
        this.detailData.n2 = this.detailData.n2 + 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B112");
    });
  }

  clickBookMark(data) {
    console.log("data=" + JSON.stringify(data));
    if (!data.showContent) {
      this.detailData.showContent = true;
      this.saveContent(data);
    }
    else {
      this.detailData.showContent = false;
      this.unsaveContent(data);
    }
  }

  saveContent(data) {
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

  ionViewCanLeave() {
    // console.log("Now i am leaving="+ this.detailData.t2)
  }

  getLikePerson(i) {
    this.navCtrl.push(PostLikePersonPage, {
      data: i.syskey
    })
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

  share(i) {
    console.log("this is share url == " + JSON.stringify(i) + "  //////////////  url === " + JSON.stringify(i.t8));

    let sahareImg = this.funct.imglink + "image/B2B_LOGO.gif";
    if (i.uploadedPhoto.length > 0) {
      if (i.t8 != '' || i.uploadedPhoto[0].t2 != '')
        sahareImg = this.videoImgLink + i.uploadedPhoto[0].t7;
      else
        sahareImg = this.imageLink + i.uploadedPhoto[0].t7;
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
        var message = 'Check out this link';
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

    this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1 }).then((res: any) => {
      console.log("name=>" + name + "/status=>" + res);
    })
      .catch((error: any) => console.error(error));
  }

  goDetail(url) {
    this.navCtrl.push(SugvideoPage, {
      data: url
    });
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  presentPopover(ev, d) {
    let st;
    if (d.n5 != this.registerData.syskey) {
      st = 0;
    } else {
      st = 1;
    }
    this.popover = this.popoverCtrl.create(PopoverCommentPage, {
      data: st
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
      if (data == "1") {
        let copytext = this.changefont.UnitoZg(d.t2);
        this.clipboard.copy(copytext);
      }
      else if (data == "2") {
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

  getDeleteMsg(d) {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      //   duration: 3000
    });
    this.loading.present();
    console.log("request d.syskey =" + d.syskey);
    this.http.get(this.funct.ipaddress2 + "serviceQuestion/deleteComment?syskey=" + d.syskey + '&sessionKey=' + this.registerData.sessionKey + '&userSK=' + this.registerData.syskey).map(res => res.json()).subscribe(result => {
      console.log("response process msg =" + JSON.stringify(result));
      if (result.state) {
        this.getCommentData();
        this.detailData.n3 = this.detailData.n3 - 1;
        this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
        this.loading.dismiss();
      }
      else {
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
      this.getError(error, "B125");
      this.loading.dismiss();
    });
  }
}
