import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, PopoverController, NavParams, Content, ViewController, ToastController, Platform, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SQLite } from '@ionic-native/sqlite';
import { AppMinimize } from '@ionic-native/app-minimize';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { CommentPage } from '../comment/comment';
import { SettingsPage } from '../settings/settings';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { WriterprofilePage } from '../writerprofile/writerprofile';;
import { SugvideoPage } from '../sugvideo/sugvideo';
import { PostLikePersonPage } from '../post-like-person/post-like-person';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { DatacleanComponent } from '../../components/dataclean/dataclean';
/**
 * 
 * Generated class for the BvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-bv',
  templateUrl: 'bv.html',
  providers: [ChangelanguageProvider]
})
export class BvPage {
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
  pageStatus: any;
  textMyan: any = ["Brand Voice", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "အကြောင်းအရာများ", "ဗီဒီယို", "တွေ့ဆုံမေးမြန်းခြင်း", "ကြည့်ရန်", "ခု"];
  textEng: any = ["Brand Voice", "Like", "Comment", "Share", "No result found", "Article", "Videos", "Interview", "View", "Count"];
  textData: any = [];
  noticount: any = 0;
  registerData: any;
  allData: any = [];
  getdeep: any = false;
  writerImg: any;
  notiStatus: any;
  showlikeStatus: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams, public logger: EventLoggerProvider,
    public popoverCtrl: PopoverController,
    public storage: Storage, public cdata: DatacleanComponent,
    public toastCtrl: ToastController,
    public http: Http, public changefont: ChangefontProvider,
    public funct: FunctProvider,
    public events: Events, private appMinimize: AppMinimize,
    public platform: Platform, public alert: AlertController,
    public changeLanguage: ChangelanguageProvider,
    public fba: FirebaseAnalytics,
    public sanitizer: DomSanitizer, public sqlite: SQLite) {

    this.pageStatus = this.navParams.get('pageStatus');
    this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";
    this.writerImg = this.funct.imglink + "upload/image/WriterImage";
    this.vLink = this.funct.imglink + "upload/video/";

    this.sqlite.create({
      name: "b2b.db",
      location: "default"
    }).then((db) => {
      this.db = db;
      this.selectData();
    }, (error) => {
      console.error("Unable to open database", error);
    })

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
    if (this.pageStatus == 1) {
      this.updateNotiCount();
    }
  }

  ionViewDidEnter() {
    this.events.subscribe('notiStatus', status => {
      console.log("notistatus " + status);
      this.notiStatus = status;
    })
    this.backButtonExit();
  }


  menuCount() {
    let parameter = {
      t1: this.registerData.t1,
      t3: "Brand Voice",
      sessionKey: this.registerData.sessionKey,
      userSyskey: this.registerData.syskey,
      n3: 1,
    }
    this.http.post(this.funct.ipaddress2 + 'serviceAppHistory/saveType', parameter).map(res => res.json()).subscribe(result => {
      console.log("return for menucount =" + JSON.stringify(result));
      if (result.state) {
        console.log("bv success menuCount >>>>>>>>");
      }
      else if (!result.sessionState) {
        this.cdata.sessionAlert();
      }
      else {
        console.log("bv unsuccess menuCount >>>>>>>>");
      }
    },
      error => {
        this.getError(error, "B108");
      });
  }

  goNotiList() {
    //this.navCtrl.push(NotiListPage);
  }

  updateNotiCount() {
    this.sqlite.create({
      name: "b2b.db",
      location: "default"
    }).then((db) => {
      db.executeSql("UPDATE notiCount SET count = 0 WHERE type = 'brandvoice'", []).then((data) => {
        console.log("update data successfully", data);
        this.events.publish('brandCount', 0);
      }, (error) => {
        console.error("Unable to update data", error);
      });
    });
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }


  getList(start, infiniteScroll) {
    this.end = this.end + 10;
    let parm = {
      start: start,
      end: this.end
    }

    console.log("home page == " + JSON.stringify(parm));
    this.http.post(this.funct.ipaddress2 + 'serviceConfiguration/getBrandVoiceList?usersk=' + this.registerData.syskey + '&phno=' + this.registerData.t1 + '&sessionKey=' + this.registerData.sessionKey, parm).map(res => res.json()).subscribe(data => {
      console.log("data.menu_arr == " + JSON.stringify(data.menu_arr));
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
                      this.menuList[i].menu_arr[j].t2 = data;
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
                this.allData = [];

                //if(this.allData.length < 11){
                for (let d = 0; d < this.menuList.length; d++) {
                  for (let h = 0; h < this.menuList[d].menu_arr.length; h++) {
                    this.allData.push(this.menuList[d].menu_arr[h]);
                  }
                }
                if (this.allData.length > 0) {
                  this.deleteData();
                }
                //}  
              }
              else if (this.end > 10) {
                let tempData = [];
                tempData = data.menu_arr;
                for (let i = 0; i < tempData.length; i++) {
                  //console.log("type one brfore==" + JSON.stringify(this.menuList[i].menu_arr));
                  for (let j = 0; j < tempData[i].menu_arr.length; j++) {
                    tempData[i].menu_arr[j].modifiedDate = this.funct.getTransformDate(tempData[i].menu_arr[j].modifiedDate);
                    tempData[i].menu_arr[j].modifiedTime = this.funct.getTimeTransformDate(tempData[i].menu_arr[j].modifiedTime);
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
                console.log("type one after=" + JSON.stringify(this.menuList));
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
          console.log("alldata length == " + this.allData.length);
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
      this.getError(error, "B116");
    });
  }

  insertData() {
    console.log("home all data length = ", this.allData.length);
    let c;
    if (this.allData.length > 5)
      c = 5;
    else
      c = this.allData.length;
    for (let i = 0; i < c; i++) {
      this.db.executeSql("INSERT INTO bvData(allData) VALUES (?)", [JSON.stringify(this.allData[i])]).then((data) => {
        console.log("Insert data successfully", data);
      }, (error) => {
        console.error("Unable to insert data", error);
      });
    }
  }

  deleteData() {
    this.db.executeSql("DELETE FROM bvData", []).then((data) => {
      console.log("Delete data successfully", data);
      this.insertData();
      //this.allData =[];
    }, (error) => {
      console.error("Unable to delete data", error);
    });
  }

  selectData() {
    this.menuList = [];
    this.pinmenuList = [];
    this.isLoading = true;
    this.db.executeSql("SELECT * FROM bvData ", []).then((data) => {
      console.log("length == " + data.rows.length);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log("data.rows.item(i).allData == " + data.rows.item(i).allData);
          this.b2bdata.push(JSON.parse(data.rows.item(i).allData));
        }
        console.log("data rows:::" + JSON.stringify(this.b2bdata));
        console.log("b2bdata length == " + this.b2bdata.length);
        this.menuList.push({ "menu_arr": this.b2bdata });
        console.log("menuList = " + JSON.stringify(this.menuList));
        this.nores = 1;
        this.b2bdata = [];
        this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          this.start = 0;
          this.end = 0;
          if (this.pageStatus == 1) {
            this.menuCount();
          }
          this.getList(this.start, '');
          console.log("registerData = " + JSON.stringify(this.registerData));
        });
      }
      else
        this.storage.get('b2bregData').then((data) => {
          this.registerData = data;
          this.start = 0;
          this.end = 0;
          this.menuList = [];
          this.pinmenuList = [];
          if (this.pageStatus == 1) {
            this.menuCount();
          }
          this.getList(this.start, '');
          console.log("registerData = " + JSON.stringify(this.registerData));
        });
    }, (error) => {

      this.storage.get('b2bregData').then((data) => {
        this.registerData = data;
        this.start = 0;
        this.end = 0;
        this.menuList = [];
        this.pinmenuList = [];
        if (this.pageStatus == 1) {
          this.menuCount();
        }
        this.getList(this.start, '');
        console.log("registerData = " + JSON.stringify(this.registerData));
      });
      console.error("Unable to select data", error);
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.start = 0;
      this.end = 0;
      console.log('Async operation has ended');
      if (!this.isLoading) {
        this.getList(this.start, '');
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
          this.getList(this.start, infiniteScroll);
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content._scroll) this.content.scrollToBottom(0);
    }, 400)
  }

  writerProfile(data) {
    if (this.pageStatus == 1) {
      this.navCtrl.push(WriterprofilePage, {
        data: data
      });
    }
    else {
      let localNavCtrl: boolean = false;
      if (localNavCtrl) {
        console.log("hello")
        this.navCtrl.push(WriterprofilePage, {
          data: data
        });
      } else {
        console.log("hi")
        this.rootNavCtrl.push(WriterprofilePage, {
          data: data
        });
      }
    }
  }

  getLikePerson(i) {
    if (this.pageStatus == 1) {
      this.navCtrl.push(PostLikePersonPage, {
        data: i.syskey
      })
    }
    else {
      let localNavCtrl: boolean = false;
      if (localNavCtrl) {
        this.navCtrl.push(PostLikePersonPage, {
          data: i.syskey
        })
      } else {
        this.rootNavCtrl.push(PostLikePersonPage, {
          data: i.syskey
        })
      }
    }
  }

  continue(i) {
    this.comment(i, 'detail');
  }

  comment(data, title) {
    if (this.nores != 0) {
      if (this.pageStatus == 1) {
        this.navCtrl.push(CommentPage, {
          data: data,
          title: title
        });
      }
      else {
        let localNavCtrl: boolean = false;
        if (localNavCtrl) {
          console.log("hello")
          this.navCtrl.push(CommentPage, {
            data: data,
            title: title
          });
        } else {
          console.log("hi")
          this.rootNavCtrl.push(CommentPage, {
            data: data,
            title: title
          });
        }
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
    // this.logger.fbevent(data.t1,{ pram: data.syskey});
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

  clickLike(data, j, k) {
    console.log("data=" + JSON.stringify(data));
    if (!data.showLike) {
      this.menuList[j].menu_arr[k].showLike = true;
      this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 + 1;
      this.menuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.menuList[j].menu_arr[k].n2);
      this.getLike(data, j, k);
    }
    else {
      this.menuList[j].menu_arr[k].showLike = false;
      this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 - 1;
      this.menuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.menuList[j].menu_arr[k].n2);
      this.getUnlike(data, j, k);
    }
  }

  getLike(data, j, k) {
    console.log("data in getLike bv page >> ", JSON.stringify(data));
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("response clickLike = ", JSON.stringify(result));
      if (result.state) {
        this.menuList[j].menu_arr[k].showLike = true;
        this.showlikeStatus = true;

        this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.showlikeStatus }).then((res: any) => {
          console.log("name=>" + name + "/status=>" + res);
        })
        .catch((error: any) => console.error(error));
      }
      else {
        this.menuList[j].menu_arr[k].showLike = false;
        this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 - 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  getUnlike(data, j, k) {
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLUnlike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("response clickLUnlike = ", JSON.stringify(data));
      if (data.state) {
        this.menuList[j].menu_arr[k].showLike = false;
      }
      else {
        this.menuList[j].menu_arr[k].showLike = true;
        this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 + 1;
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B112");
    });
  }

  clickBookMark(data, j, k) {
    console.log("data=" + JSON.stringify(data));
    if (!data.showContent) {
      this.menuList[j].menu_arr[k].showContent = true;
      this.saveContent(data, j, k);
    }
    else {
      this.menuList[j].menu_arr[k].showContent = false;
      this.unsaveContent(data);
    }
  }

  saveContent(data, j, k) {
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
    let localNavCtrl: boolean = false;
    if (localNavCtrl) {
      this.navCtrl.push(ViewPhotoMessagePage, {
        data: i,
        contentImg: "singlePhoto"
      });
    } else {
      this.rootNavCtrl.push(ViewPhotoMessagePage, {
        data: i,
        contentImg: "singlePhoto"
      });
    }
  }

  goVideoDetail(data) {
    if (this.pageStatus == 1) {
      this.navCtrl.push(SugvideoPage, {
        data: data
      });
    }
    else {
      let localNavCtrl: boolean = false;
      if (localNavCtrl) {
        this.navCtrl.push(SugvideoPage, {
          data: data
        });
      } else {
        this.rootNavCtrl.push(SugvideoPage, {
          data: data
        });
      }
    }
    //this.logger.fbevent(data.t1, { pram: data.syskey });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BvPage');
  }
}
