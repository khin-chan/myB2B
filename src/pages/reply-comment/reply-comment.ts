import { Component, ViewChild } from '@angular/core';
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

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';

import { PopoverCommentPage } from '../popover-comment/popover-comment';

/**
 * Generated class for the ReplyCommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-reply-comment',
  templateUrl: 'reply-comment.html',
  providers: [ChangelanguageProvider]
})
export class ReplyCommentPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Navbar) navBar: Navbar;
  //registerData:any;
  textMyan: any = ["ပြန်စာများ", "ပြန်စာ မရှိပါ။", "ပြန်စာရေးရန်......"];
  textEng: any = ["Replies", "No Replies", "Write a reply......."];
  //textData: string [] = [];
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
  textData: any = [];
  like: any = true;
  unlike: any = false;
  likeCount: any = 0;
  replyCount: any = 3;
  detailData: any;
  exit: any = false;
  url: any;
  cmtphotoLink: any;
  status: any = false;
  textFont: any;
  singleStatus: any = false;
  testRadiouni: boolean;
  testRadiozg: boolean;
  alertPopup: any;

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public storage: Storage, public alert: AlertController,
    public datePipe: DatePipe, public http: Http, public toastCtrl: ToastController, public changeLanguage: ChangelanguageProvider,
    public popoverCtrl: PopoverController, public platform: Platform, public funct: FunctProvider, public sanitizer: DomSanitizer,
    public clipboard: Clipboard, public changefont: ChangefontProvider, public events: Events) {

    this.photoLink = this.funct.imglink + "upload/image/userProfile";
    this.passData = this.navParams.get("data");
    console.log("reply comment pass data == " + JSON.stringify(this.passData));
    this.detailData = this.navParams.get('detaildata');
    console.log("detailData == " + JSON.stringify(this.detailData));
    this.singleStatus = this.navParams.get('singleStatus');
    console.log("singleStatus == " + JSON.stringify(this.singleStatus));
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      this.getCommentData();
      console.log("registerData = " + JSON.stringify(this.registerData));
    });

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textEng, this.textMyan).then((data) => {
        this.textData = data;
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;

        /*for(let i=0;i<this.replyData.length;i++){
          this.changeLanguage.changelanguageText(this.font, this.replyData[i].t2).then((res) => {
            this.replyData[i].t2 = res;
          })
        }*/
        console.log("data language=" + JSON.stringify(data));
      });
    });

    this.events.subscribe('textboxlan', data => {
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
      console.log('Your language is', result);
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

  getCommentData() {
    this.isLoading = true;//tmn
    this.http.get(this.funct.ipaddress2 + 'serviceQuestion/getCommentReplymobile?id=' + this.passData.syskey + '&userSK=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      //console.log("return Commentfunt data = " + JSON.stringify(result));

      if (result.data.length > 0) {
        this.nores = 1;
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].differenceTime = this.funct.getTimeDifference(result.data[i].modifiedDate, result.data[i].modifiedTime);
          result.data[i].modifiedDate = this.funct.getTransformDate(result.data[i].modifiedDate);
          result.data[i].like = "Like";
        }
        this.replyData = result.data;
        this.content.scrollToBottom();
        console.log("replyData data = " + JSON.stringify(this.replyData));
      }
      else {
        this.nores = 0;
      }
      this.isLoading = false;
    },
      error => {
        this.getError(error, "B126");
        this.nores = 0;
      });
  }

  onFocus() {
    this.content.resize();
    this.content.scrollToBottom();
  }

  saveCommentReply() {
    if (this.comment != '' && this.comment != ' ' && this.comment.trim() != '') {
      this.status = true;
      let parameter = {
        t1: "reply",
        t2: this.comment,
        n1: this.passData.syskey,
        n5: this.registerData.syskey,
        sessionKey: this.registerData.sessionKey
      }
      //   this.postcmt = {t3: this.registerData.t3 , t2: this.comment};
      console.log("requst saveComment=" + JSON.stringify(parameter));
      //  this.replyData.push(this.postcmt);
      this.content.scrollToBottom();
      this.http.post(this.funct.ipaddress2 + 'serviceQuestion/saveCommentReply', parameter).map(res => res.json()).subscribe(data => {
        console.log("return saveComment data = " + JSON.stringify(data));
        if (data.state && data.data.length > 0) {
          this.nores = 1;
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].differenceTime = this.funct.getTimeDifference(data.data[i].modifiedDate, data.data[i].modifiedTime);
            data.data[i].modifiedDate = this.funct.getTransformDate(data.data[i].modifiedDate);
            data.data[i].like = "Like";
          }
          this.replyData = data.data;
          this.comment = '';
          if (!this.singleStatus) {
            this.detailData.n3 = this.detailData.n3 + 1;
            this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
          }
          this.status = false;
        }
        else {
          if (this.replyData.length > 0)
            this.nores = 1;
          else
            this.nores = 0;
          let toast = this.toastCtrl.create({
            message: "Reply comment failed!",
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
        this.content.resize();
        this.content.scrollToBottom();
        console.log("this.status == " + this.status);
      },
        error => {
          this.status = false;
          this.comment = '';
          if (this.replyData.length > 0)
            this.nores = 1;
          else
            this.nores = 0;
          this.getError(error, "B127");
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

    //this.alertPopup.addButton('Cancel');
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
      //  showCloseButton: true,
      dismissOnPageChange: true,
      // closeButtonText: 'OK'
    });
    toast.present(toast);
    this.isLoading = false;
    // this.loading.dismiss();
    console.log("Oops!");
  }

  ionViewDidEnter() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReplyCommentPage');
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
        this.clipboard.copy(d.t2);
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
    this.http.get(this.funct.ipaddress2 + "serviceQuestion/deleteReplyComment?syskey=" + d.syskey + '&sessionKey=' + this.registerData.sessionKey + '&userSK=' + this.registerData.syskey).map(res => res.json()).subscribe(result => {
      console.log("response process msg =" + JSON.stringify(result));
      if (result.state) {
        this.getCommentData();
        this.loading.dismiss();
        if (!this.singleStatus) {
          this.detailData.n3 = this.detailData.n3 - 1;
          this.detailData.commentCount = this.funct.getChangeCount(this.detailData.n3);
        }
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
      this.getError(error, "B128");
      this.loading.dismiss();
    });
  }
}
