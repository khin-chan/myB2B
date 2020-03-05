import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController, Platform, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

import { CommentPage } from '../comment/comment';
import { TabsPage } from '../tabs/tabs';
import { PostTextPage } from '../post-text/post-text';
import { PaymentPage } from '../payment/payment';

/**
 * Generated class for the UserPostListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-post-list',
  templateUrl: 'user-post-list.html',
  providers: [ChangelanguageProvider]
})
export class UserPostListPage {
  popover: any;
  items: any[];
  data: any = [];
  url: string = '';
  img: any = '';
  isLoading: any;
  registerData: any;
  menuList: any = [];
  editmenuList: any = [];
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
  textMyan: any = ["Content", "ဒေတာ မရှိပါ။"];
  textEng: any = ["Content", "No result found"];
  textData: any = [];
  passData: any = "tmn";
  billStatus: any;
  mptPopup: any;
  loading: any;
  chekbillAlert: any;
  cutphno: any;
  callid: any;
  statusArr: any = ["Draft", "Pending", "Publish"];

  constructor(public navCtrl: NavController, public alert: AlertController,
    public toastCtrl: ToastController, public navParams: NavParams, public logger: EventLoggerProvider,
    public changeLanguage: ChangelanguageProvider, public storage: Storage, public loadingCtrl: LoadingController,
    public http: Http, public funct: FunctProvider, public platform: Platform, public sanitizer: DomSanitizer,
    public events: Events, public datePicker: DatePicker, public datepipe: DatePipe, public cdata: DatacleanComponent,
    public fba: FirebaseAnalytics,) {

    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";
    //console.log("passdata in post list == " + JSON.stringify(this.passData));

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
    
   /*  this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = "+JSON.stringify(this.registerData));
      this.menuList = [];
      this.pinmenuList =[];
      this.start = 0;
      this.end = 0;
      this.isLoading = true;
      this.getList(this.start,'');
    }); */


  }

  getList(start, infiniteScroll) {
    this.end = this.end + 10;
    let parm = {
      start: start,
      end: this.end
    }

    console.log("request post list = " + JSON.stringify(this.registerData));
    this.http.post(this.funct.ipaddress2 + "serviceArticle/getPostListByContentWriter?usersk=" + this.registerData.syskey + "&userid=" + this.registerData.t1 + '&sessionKey=' + this.registerData.sessionKey + '&type=content', parm).map(res => res.json()).subscribe(data => {
      console.log("response post list =" + JSON.stringify(data));
      if (data.menu_arr_pin != null) {
        if (data.menu_arr_pin.length > 0) {
          for (let index = 0; index < data.menu_arr_pin.length; index++) {
            if (data.menu_arr_pin[index].menu_arr.length > 0) {
              console.log("data.menu_arr_pin[index].menu_arr.length " + data.menu_arr_pin[index].menu_arr.length);
              this.nores = 1;
              if (this.end == 10) {
                this.menuList = [];
                this.pinmenuList = data.menu_arr_pin;
                for (let i = 0; i < this.pinmenuList.length; i++) {
                  for (let j = 0; j < this.pinmenuList[i].menu_arr.length; j++) {
                    this.pinmenuList[i].menu_arr[j].modifiedDate = this.funct.getTransformDate(this.pinmenuList[i].menu_arr[j].modifiedDate);
                    this.pinmenuList[i].menu_arr[j].modifiedTime = this.funct.getTimeTransformDate(this.pinmenuList[i].menu_arr[j].modifiedTime);
                    //console.log("one obj ====== "+ JSON.stringify(this.pinmenuList[i].menu_arr[j]));
                    if (this.pinmenuList[i].menu_arr[j].n7 == 1){
                      this.pinmenuList[i].menu_arr[j].n7 = this.statusArr[0];
                      console.log("Draft =" + JSON.stringify(this.pinmenuList[i].menu_arr[j].n7));
                    }
                    else if (this.pinmenuList[i].menu_arr[j].n7 == 2){
                      this.pinmenuList[i].menu_arr[j].n7 = this.statusArr[1];
                      console.log("Pending =" + JSON.stringify(this.pinmenuList[i].menu_arr[j].n7));
                    }
                    else{
                      this.pinmenuList[i].menu_arr[j].n7 = this.statusArr[2];
                      console.log("Publish =" + JSON.stringify(this.pinmenuList[i].menu_arr[j].n7));
                    }
                      

                    if (this.pinmenuList[i].menu_arr[j].n6 != 1)
                      this.pinmenuList[i].menu_arr[j].showLike = false;
                    else
                      this.pinmenuList[i].menu_arr[j].showLike = true;
                    if (this.pinmenuList[i].menu_arr[j].n7 != 1)
                      this.pinmenuList[i].menu_arr[j].showContent = false;
                    else
                      this.pinmenuList[i].menu_arr[j].showContent = true;
                    if (this.pinmenuList[i].menu_arr[j].n2 != 0) {
                      this.pinmenuList[i].menu_arr[j].likeCount = this.funct.getChangeCount(this.pinmenuList[i].menu_arr[j].n2);
                    }
                    if (this.pinmenuList[i].menu_arr[j].n3 != 0) {
                      this.pinmenuList[i].menu_arr[j].commentCount = this.funct.getChangeCount(this.pinmenuList[i].menu_arr[j].n3);
                    }
                    //console.log("this.pinmenuList[i].menu_arr[j].t2.length == "+this.pinmenuList[i].menu_arr[j].t2.length);
                    if (this.pinmenuList[i].menu_arr[j].t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
                      this.pinmenuList[i].menu_arr[j].showread = true;
                    }
                    else
                      this.pinmenuList[i].menu_arr[j].showread = false;

                    if (this.pinmenuList[i].menu_arr[j].n10 == 1) {
                      if (this.pinmenuList[i].menu_arr[j].t8 != '') {
                        if (this.pinmenuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                          this.pinmenuList[i].menu_arr[j].videoLink = this.videoImgLink + this.pinmenuList[i].menu_arr[j].uploadedPhoto[0].t7;
                        }
                        else {
                          let temp = this.pinmenuList[i].menu_arr[j].t8;     // for video link
                          let str1 = temp.search("external/");
                          let str2 = temp.search(".sd");
                          if (str2 < 0) {
                            str2 = temp.search(".hd");
                          }
                          let res = temp.substring(str1 + 9, str2);
                          this.pinmenuList[i].menu_arr[j].videoLink = "https://i.vimeocdn.com/video/" + res + "_295x166.jpg";
                        }
                        //console.log("data.data[i].videoLink == "+this.pinmenuList[i].menu_arr[j].videoLink);
                        this.pinmenuList[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(this.pinmenuList[i].menu_arr[j].t8);
                      }
                    }
                    else if (this.pinmenuList[i].menu_arr[j].n10 == 2) {
                      if (this.pinmenuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                        this.pinmenuList[i].menu_arr[j].videoLink = this.videoImgLink + this.pinmenuList[i].menu_arr[j].uploadedPhoto[0].t7;
                      }
                      this.pinmenuList[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(this.pinmenuList[i].menu_arr[j].t8 + "?&autoplay=1");
                      console.log("data.data[i].t8 for youtube == " + this.pinmenuList[i].menu_arr[j].t8);
                    }
                    else {
                      if (this.pinmenuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                        if (this.pinmenuList[i].menu_arr[j].uploadedPhoto[0].t2 != '') {
                          this.pinmenuList[i].menu_arr[j].videoLink = this.videoImgLink + this.pinmenuList[i].menu_arr[j].uploadedPhoto[0].t7;
                          this.pinmenuList[i].menu_arr[j].videoStatus = true;
                        }
                        else {
                          this.pinmenuList[i].menu_arr[j].videoStatus = false;
                        }
                      }
                    }
                    this.changeLanguage.changelanguageText(this.font, this.pinmenuList[i].menu_arr[j].t1).then((data) => {
                      this.pinmenuList[i].menu_arr[j].t1 = data;
                    });
                    this.changeLanguage.changelanguageText(this.font, this.pinmenuList[i].menu_arr[j].t2).then((data) => {
                      //this.pinmenuList[i].menu_arr[j].t2 = data;
                      let temp = data;
                      console.log("temp data == " + JSON.stringify(temp));
                      if (temp.indexOf("[#img]") > -1) {
                        let tempArr = temp.split("</p><p>");
                        console.log("Array Data>>>>" + JSON.stringify(tempArr));
                        let temp1 = tempArr[0].replace(/<p>/g, "");
                        console.log("temp data2 == " + JSON.stringify(temp1));
                        this.pinmenuList[i].menu_arr[j]['temp_t2'] = temp1;
                        console.log("Edit PinmenuList == " + JSON.stringify(temp1));
                      }
                      else {
                        let tempArr = temp.split("</p>");
                        console.log("Array Data>>>>" + JSON.stringify(tempArr));
                        let temp1 = tempArr[0].replace(/<p>/g, "");
                        console.log("temp data2 == " + JSON.stringify(temp1));
                        this.pinmenuList[i].menu_arr[j]['temp_t2'] = temp1;
                        console.log("Edit PinmenuList == " + JSON.stringify(temp1));
                      }

                    });


                    // img
                    if (this.pinmenuList[i].menu_arr[j].t2.indexOf("<img ") > -1) {
                      this.pinmenuList[i].menu_arr[j].t2 = this.pinmenuList[i].menu_arr[j].t2.replace(/<img /g, "<i ");
                      //console.log("replace img == "+this.pinmenuList[i].menu_arr[j].t2);
                      this.pinmenuList[i].menu_arr[j].t2 = this.pinmenuList[i].menu_arr[j].t2.replace(/ \/>/g, "></i>");
                      //console.log("replace <i/> == "+this.pinmenuList[i].menu_arr[j].t2);
                    }

                    if (this.pinmenuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                      this.pinmenuList[i].menu_arr[j].shMsg = this.pinmenuList[i].menu_arr[j].t2;
                      if (this.pinmenuList[i].menu_arr[j].shMsg.indexOf('[#img]') > -1) {
                        this.pinmenuList[i].menu_arr[j].shMsg = this.pinmenuList[i].menu_arr[j].t2.replace(/\[#img\]/g, "");
                      }
                    }
                    else
                      this.pinmenuList[i].menu_arr[j].shMsg = this.pinmenuList[i].menu_arr[j].t2;

                    console.log("hahah");
                    console.log("fff>" + JSON.stringify(this.pinmenuList[i].menu_arr[j]));
                    console.log("len>" + this.pinmenuList[i].menu_arr[j].uploadedPhoto.length);
                    //update by jjp
                    if (this.pinmenuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                      let content = this.pinmenuList[i].menu_arr[j].t2;
                      console.log("content1>" + content);
                      content = content.substring(1);
                      console.log("content2>" + content);
                      content.split('>').pop().split('<')[0];
                      console.log("content3" + content);
                    }
                  }
                }
              }
            }
            else {
              console.log("this.end == " + this.end);
              if (this.end > 10) {
                if (infiniteScroll != '') {
                  infiniteScroll.complete();
                }
                if (this.pinmenuList.length > 0) {
                  this.nores = 1;
                }
              }
            }
          }
          console.log("menuList length == " + this.pinmenuList.length);
          console.log("pinmenulist>" + JSON.stringify(this.pinmenuList));

        }
        else {
          if (this.end > 10) {
            if (infiniteScroll != '') {
              infiniteScroll.complete();
            }
            if (this.pinmenuList.length > 0) {
              this.nores = 1;
            }
          }
          this.isLoading = false;
          console.log("data.pinmenu_arr is 0.");
        }
      }

      if (data.menu_arr != null) {
        if (data.menu_arr.length > 0) {
          for (let index = 0; index < data.menu_arr.length; index++) {
            if (data.menu_arr[index].menu_arr.length > 0) {
              this.nores = 1;
              if (this.end == 10) {
                this.menuList = data.menu_arr;
                for (let i = 0; i < this.menuList.length; i++) {
                  for (let j = 0; j < this.menuList[i].menu_arr.length; j++) {
                    this.menuList[i].menu_arr[j].modifiedDate = this.funct.getTransformDate(this.menuList[i].menu_arr[j].modifiedDate);
                    this.menuList[i].menu_arr[j].modifiedTime = this.funct.getTimeTransformDate(this.menuList[i].menu_arr[j].modifiedTime);
                    //console.log("one obj ====== "+ JSON.stringify(this.menuList[i].menu_arr[j]));
                    if (this.menuList[i].menu_arr[j].n7 == 1)
                      this.menuList[i].menu_arr[j].n7 = this.statusArr[0];
                    else if (this.menuList[i].menu_arr[j].n7 == 2)
                      this.menuList[i].menu_arr[j].n7 = this.statusArr[1];
                    else
                      this.menuList[i].menu_arr[j].n7 = this.statusArr[2];

                    if (this.menuList[i].menu_arr[j].n6 != 1)
                      this.menuList[i].menu_arr[j].showLike = false;
                    else
                      this.menuList[i].menu_arr[j].showLike = true;
                    if (this.menuList[i].menu_arr[j].n7 != 1)
                      this.menuList[i].menu_arr[j].showContent = false;
                    else
                      this.menuList[i].menu_arr[j].showContent = true;
                    if (this.menuList[i].menu_arr[j].n2 != 0) {
                      this.menuList[i].menu_arr[j].likeCount = this.funct.getChangeCount(this.menuList[i].menu_arr[j].n2);
                    }
                    if (this.menuList[i].menu_arr[j].n3 != 0) {
                      this.menuList[i].menu_arr[j].commentCount = this.funct.getChangeCount(this.menuList[i].menu_arr[j].n3);
                    }
                    //console.log("this.menuList[i].menu_arr[j].t2.length == "+this.menuList[i].menu_arr[j].t2.length);
                    if (this.menuList[i].menu_arr[j].t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
                      this.menuList[i].menu_arr[j].showread = true;
                    }
                    else
                      this.menuList[i].menu_arr[j].showread = false;

                    if (this.menuList[i].menu_arr[j].n10 == 1) {
                      if (this.menuList[i].menu_arr[j].t8 != '') {
                        if (this.menuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                          this.menuList[i].menu_arr[j].videoLink = this.videoImgLink + this.menuList[i].menu_arr[j].uploadedPhoto[0].t7;
                        }
                        else {
                          let temp = this.menuList[i].menu_arr[j].t8;     // for video link
                          let str1 = temp.search("external/");
                          let str2 = temp.search(".sd");
                          if (str2 < 0) {
                            str2 = temp.search(".hd");
                          }
                          let res = temp.substring(str1 + 9, str2);
                          this.menuList[i].menu_arr[j].videoLink = "https://i.vimeocdn.com/video/" + res + "_295x166.jpg";
                        }
                        //console.log("data.data[i].videoLink == "+this.menuList[i].menu_arr[j].videoLink);
                        this.menuList[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(this.menuList[i].menu_arr[j].t8);
                      }
                    }
                    else if (this.menuList[i].menu_arr[j].n10 == 2) {
                      if (this.menuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                        this.menuList[i].menu_arr[j].videoLink = this.videoImgLink + this.menuList[i].menu_arr[j].uploadedPhoto[0].t7;
                      }
                      this.menuList[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(this.menuList[i].menu_arr[j].t8 + "?&autoplay=1");
                      console.log("data.data[i].t8 for youtube == " + this.menuList[i].menu_arr[j].t8);
                    }
                    else {
                      if (this.menuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                        if (this.menuList[i].menu_arr[j].uploadedPhoto[0].t2 != '') {
                          this.menuList[i].menu_arr[j].videoLink = this.videoImgLink + this.menuList[i].menu_arr[j].uploadedPhoto[0].t7;
                          this.menuList[i].menu_arr[j].videoStatus = true;
                        }
                        else {
                          this.menuList[i].menu_arr[j].videoStatus = false;
                        }
                      }
                    }
                    this.changeLanguage.changelanguageText(this.font, this.menuList[i].menu_arr[j].t1).then((data) => {
                      this.menuList[i].menu_arr[j].t1 = data;
                    });
                    this.changeLanguage.changelanguageText(this.font, this.menuList[i].menu_arr[j].t2).then((data) => {
                      //this.menuList[i].menu_arr[j].t2 = data;
                      let temp = data;
                      console.log("temp data == " + JSON.stringify(temp));
                      if (temp.indexOf("[#img]") > -1) {
                        let tempArr = temp.split("</p><p>");
                        console.log("Array Data>>>>" + JSON.stringify(tempArr));
                        let temp1 = tempArr[0].replace(/<p>/g, "");
                        console.log("temp data2 == " + JSON.stringify(temp1));
                        this.menuList[i].menu_arr[j]['temp_t2'] = temp1;
                        console.log("Edit PinmenuList == " + JSON.stringify(temp1));
                      }
                      else {
                        let tempArr = temp.split("</p>");
                        console.log("Array Data>>>>" + JSON.stringify(tempArr));
                        let temp1 = tempArr[0].replace(/<p>/g, "");
                        console.log("temp data2 == " + JSON.stringify(temp1));
                        this.menuList[i].menu_arr[j]['temp_t2'] = temp1;
                        console.log("Edit PinmenuList == " + JSON.stringify(temp1));
                      }
                    });

                    // img
                    if (this.menuList[i].menu_arr[j].t2.indexOf("<img ") > -1) {
                      this.menuList[i].menu_arr[j].t2 = this.menuList[i].menu_arr[j].t2.replace(/<img /g, "<i ");
                      //console.log("replace img == "+this.menuList[i].menu_arr[j].t2);
                      this.menuList[i].menu_arr[j].t2 = this.menuList[i].menu_arr[j].t2.replace(/ \/>/g, "></i>");
                      //console.log("replace <i/> == "+this.menuList[i].menu_arr[j].t2);
                    }

                    if (this.menuList[i].menu_arr[j].uploadedPhoto.length > 0) {
                      this.menuList[i].menu_arr[j].shMsg = this.menuList[i].menu_arr[j].t2;
                      if (this.menuList[i].menu_arr[j].shMsg.indexOf('[#img]') > -1) {
                        this.menuList[i].menu_arr[j].shMsg = this.menuList[i].menu_arr[j].t2.replace(/\[#img\]/g, "");
                      }
                    }
                    else
                      this.menuList[i].menu_arr[j].shMsg = this.menuList[i].menu_arr[j].t2;
                  }
                }
                //console.log("menu list == " + JSON.stringify(this.menuList));
                //this.allData = [];
              }
              else if (this.end > 10) {
                let tempData = [];
                tempData = data.menu_arr;
                for (let i = 0; i < tempData.length; i++) {
                  //console.log("type one brfore==" + JSON.stringify(this.menuList[i].menu_arr));
                  for (let j = 0; j < tempData[i].menu_arr.length; j++) {
                    tempData[i].menu_arr[j].modifiedDate = this.funct.getTransformDate(tempData[i].menu_arr[j].modifiedDate);
                   tempData[i].menu_arr[j].modifiedTime = this.funct.getTimeTransformDate(tempData[i].menu_arr[j].modifiedTime);
                    //tempData[i].menu_arr[j].modifiedTime = tempData[i].menu_arr[j].modifiedTime;
                    //console.log("n3 ====== "+ this.menuList[i].menu_arr[j].n3);
                    if (tempData[i].menu_arr[j].n6 != 1)
                      tempData[i].menu_arr[j].showLike = false;
                    else
                      tempData[i].menu_arr[j].showLike = true;
                    if (tempData[i].menu_arr[j].n7 != 1)
                      tempData[i].menu_arr[j].showContent = false;
                    else
                      tempData[i].menu_arr[j].showContent = true;
                    if (tempData[i].menu_arr[j].n2 != 0) {
                      tempData[i].menu_arr[j].likeCount = this.funct.getChangeCount(tempData[i].menu_arr[j].n2);
                    }
                    if (tempData[i].menu_arr[j].n3 != 0) {
                      tempData[i].menu_arr[j].commentCount = this.funct.getChangeCount(tempData[i].menu_arr[j].n3);
                    }
                    if (tempData[i].menu_arr[j].t2.replace(/<\/?[^>]+(>|$)/g, "").length > 200) {
                      tempData[i].menu_arr[j].showread = true;
                    }
                    else
                      tempData[i].menu_arr[j].showread = false;

                    if (tempData[i].menu_arr[j].n10 == 1) {
                      if (tempData[i].menu_arr[j].t8 != '') {
                        if (tempData[i].menu_arr[j].uploadedPhoto.length > 0) {
                          tempData[i].menu_arr[j].videoLink = this.videoImgLink + tempData[i].menu_arr[j].uploadedPhoto[0].t7;
                        }
                        else {
                          let temp = tempData[i].menu_arr[j].t8;     // for video link
                          let str1 = temp.search("external/");
                          let str2 = temp.search(".sd");
                          if (str2 < 0) {
                            str2 = temp.search(".hd");
                          }
                          let res = temp.substring(str1 + 9, str2);
                          tempData[i].menu_arr[j].videoLink = "https://i.vimeocdn.com/video/" + res + "_295x166.jpg";
                        }
                        console.log("data.data[i].videoLink == " + tempData[i].menu_arr[j].videoLink);
                        tempData[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(tempData[i].menu_arr[j].t8);
                      }
                    }
                    else if (tempData[i].menu_arr[j].n10 == 2) {
                      if (tempData[i].menu_arr[j].uploadedPhoto.length > 0) {
                        tempData[i].menu_arr[j].videoLink = this.videoImgLink + tempData[i].menu_arr[j].uploadedPhoto[0].t7;
                      }
                      tempData[i].menu_arr[j].t8 = this.sanitizer.bypassSecurityTrustResourceUrl(tempData[i].menu_arr[j].t8 + "?&autoplay=1");
                      console.log("data.data[i].t8 for youtube == " + tempData[i].menu_arr[j].t8);
                    }
                    else {
                      if (tempData[i].menu_arr[j].uploadedPhoto.length > 0) {
                        if (tempData[i].menu_arr[j].uploadedPhoto[0].t2 != '') {
                          tempData[i].menu_arr[j].videoLink = this.videoImgLink + tempData[i].menu_arr[j].uploadedPhoto[0].t7;
                          tempData[i].menu_arr[j].videoStatus = true;
                        }
                        else {
                          tempData[i].menu_arr[j].videoStatus = false;
                        }
                      }
                    }
                    this.changeLanguage.changelanguageText(this.font, tempData[i].menu_arr[j].t1).then((data) => {
                      tempData[i].menu_arr[j].t1 = data;
                    });
                    this.changeLanguage.changelanguageText(this.font, tempData[i].menu_arr[j].t2).then((data) => {
                      tempData[i].menu_arr[j].t2 = data;
                    });

                    if (tempData[i].menu_arr[j].t2.indexOf("<img ") > -1) {
                      tempData[i].menu_arr[j].t2 = tempData[i].menu_arr[j].t2.replace(/<img /g, "<i ");
                      tempData[i].menu_arr[j].t2 = tempData[i].menu_arr[j].t2.replace(/ \/>/g, "></i>");
                    }
                    if (tempData[i].menu_arr[j].uploadedPhoto.length > 0) {
                      tempData[i].menu_arr[j].shMsg = tempData[i].menu_arr[j].t2;
                      if (tempData[i].menu_arr[j].shMsg.indexOf('[#img]') > -1) {
                        tempData[i].menu_arr[j].shMsg = tempData[i].menu_arr[j].t2.replace(/\[#img\]/g, "");
                      }
                    }
                    else {
                      tempData[i].menu_arr[j].shMsg = tempData[i].menu_arr[j].t2;
                    }
                    this.menuList[i].menu_arr.push(tempData[i].menu_arr[j]);
                  }
                }
                console.log("menuList>>" + JSON.stringify(this.menuList));
                //this.isLoading = false;
              }
              //this.allData = this.menuList;
              if (infiniteScroll != '') {
                infiniteScroll.complete();
              }
            }
            else {
              console.log("this.end == " + this.end);
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
          }
          console.log("menuList length == " + this.menuList.length);
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
          this.isLoading = false;
          console.log("data.menu_arr is 0.");
        }
      }
      this.isLoading = false;
      console.log("isLoading == " + this.isLoading);

    }, error => {
      console.log("signin error=" + error.status);
      if (this.end > 10) {
        this.end = this.start - 1;
        if (infiniteScroll != '') {
          infiniteScroll.complete();
        }
      }
      if (this.menuList.length > 0 || this.pinmenuList.length > 0) {
        this.nores = 1;
      }
      else if (this.pinmenuList.length > 0) {
        this.nores = 1;
      }
      else {
        this.isLoading = false;
        this.nores = 0;
      }
      this.isLoading = false;
      this.getError(error, "B121");
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

  comment(data) {
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      this.choosePayment();
    }
    else {
      this.navCtrl.push(CommentPage, {
        data: data,
        title: "detail"
      });
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

  ionViewCanEnter() {
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = "+JSON.stringify(this.registerData));
      this.menuList = [];
      this.pinmenuList =[];
      this.start = 0;
      this.end = 0;
      this.isLoading = true;
      this.getList(this.start,'');
    });

  }

  ionViewDidLoad() {
    console.log('UserPostListPage');
  }

  goDetail(i) {
    console.log("detail>>" + JSON.stringify(i));
    this.navCtrl.push(PostTextPage, { 
      data: i ,
      status : 1
    });
  }
  
  goContentPost(){
    this.navCtrl.push(PostTextPage);
  }

}
