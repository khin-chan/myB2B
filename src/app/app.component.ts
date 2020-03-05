import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, Events, ToastController, AlertController, PopoverController, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone'
import 'rxjs/add/operator/map';

//import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FCM } from '@ionic-native/fcm';
import { Badge } from '@ionic-native/badge';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { RegistrationPage } from '../pages/registration/registration';
import { VideoPage } from '../pages/video/video';
import { BusinessPage } from '../pages/business/business';
import { SaveContentPage } from '../pages/save-content/save-content';
import { NewsPage } from '../pages/news/news';
import { EditPage } from '../pages/edit/edit';
import { FirstCreaterPage } from '../pages/first-creater/first-creater';
import { GeneralPage } from '../pages/general/general';
import { InvestmentPage } from '../pages/investment/investment';
import { LeadershipPage } from '../pages/leadership/leadership';
import { WriterPage } from '../pages/writer/writer';
import { BvPage } from '../pages/bv/bv';
import { LogInPage } from '../pages/log-in/log-in';
import { FirstStepPage } from '../pages/first-step/first-step';
import { NewsTabsPage } from '../pages/news-tabs/news-tabs';
import { BusinessTabsPage } from '../pages/business-tabs/business-tabs';
import { LeaderTabsPage } from '../pages/leader-tabs/leader-tabs';
import { InvestmentTabsPage } from '../pages/investment-tabs/investment-tabs';
import { InnovationTabsPage } from '../pages/innovation-tabs/innovation-tabs';
import { GeneralTabsPage } from '../pages/general-tabs/general-tabs';
import { SingleViewPage } from '../pages/single-view/single-view';
import { PremiumPage } from '../pages/premium/premium';
import { InterviewTabsPage } from '../pages/interview-tabs/interview-tabs';
import { SettingsPage } from '../pages/settings/settings';
import { NotiPage } from '../pages/noti/noti';
import { LearnFormGuyuPage } from '../pages/learn-form-guyu/learn-form-guyu';
import { TeacherListPage } from '../pages/teacher-list/teacher-list';

import { FunctProvider } from '../providers/funct/funct';
import { ChangefontProvider } from '../providers/changefont/changefont';

import { App } from 'ionic-angular/components/app/app';

//declare var Branch;
export const myConst = {
  blackboardApp: {
    ios: {
      storeUrl: 'itms-apps://itunes.apple.com/us/app/b2b-myanmar/id1437220641?ls=1&mt=8',
      appId: 'B2B Myanmar://'
    },
    android: {
      storeUrl: 'https://play.google.com/store/apps/details?id=com.b2bsite.siteb2b',
      appId: 'B2B Myanmar//'
    }
  }
}
@Component({
  templateUrl: 'app.html',
  providers: [ChangefontProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(NavController) navCtrl: NavController;
  @ViewChild(App) app: App;
  rootPage: any;
  username: any = 'Username';
  phone: any;
  name: any;
  imglnk: any;
  writerImglnk: any;
  font: string = '';
  registerData: any;
  userimage: any = "assets/images/user-icon.png";
  noticount: any = 0;
  db: any;
  topicNotiData: any;
  businessCount: any = 0;
  premiumCount: any = 0;
  videoCount: any = 0;
  newsCount: any = 0;
  leadershipCount: any = 0;
  innovationCount: any = 0;
  investmentCount: any = 0;
  generalCount: any = 0;
  brandCount: any = 0;
  interviewCount: any = 0;
  allCount: any = 0;
  notiStatus: any = false;
  alertPopup: any;
  testRadiouni: boolean = false;
  testRadiozg: boolean = false;
  premiumUser: any = false;
  popover: any;
  date: any;
  tempDate: any;
  tempDate1: any;
  time: any;

  // textEng: any = ["Home","Premium","Learning From Learners","Brand Voice","Video", "News", "Business","Interview","Leadership","Investment","Create","General","Writer","Save Content","Setting","Log Out","Chat","Article","Interview"];
  // textData : string [] = [];
  // textMyan : any = ["ပင်မစာမျက်နှာ","Premium","Learning From Learners","Brand Voice","ဗီဒီယို","သတင်း","စီးပွားရေး","အင်တာဗျူး","ခေါင်းဆောင်မှု", "ရင်းနှီးမြှုပ်နှံမှု","စွန့်ဦးတီထွင်မှု","အထွေထွေ","ရေးသားသူများ","သိမ်းဆည်းထားသော","ပြင်ဆင်ရန်","ထွက်ခွာရန်","ဆက်သွယ်ရန်", "အကြောင်းအရာများ","တွေ့ဆုံမေးမြန်းခြင်း"]; //uin

  textEng: any = ["Home", "Premium", "Brand Voice", "Video", "News", "Business", "Interview", "Leadership", "Investment", "Create", "General", "Save Content", "Setting", "Log Out", "Chat", "Article", "Interview"];
  textData: string[] = [];
  textMyan: any = ["ပင်မစာမျက်နှာ", "Premium", "Brand Voice", "ဗီဒီယို", "သတင်း", "စီးပွားရေး", "အင်တာဗျူး", "ခေါင်းဆောင်မှု", "ရင်းနှီးမြှုပ်နှံမှု", "စွန့်ဦးတီထွင်မှု", "အထွေထွေ", "သိမ်းဆည်းထားသော", "ပြင်ဆင်ရန်", "ထွက်ခွာရန်", "ဆက်သွယ်ရန်", "အကြောင်းအရာများ", "တွေ့ဆုံမေးမြန်းခြင်း"]; //uin
  pages: any = [{ title: 'Home', component: TabsPage, icon: 'ios-home', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Premium', component: PremiumPage, icon: '', color: '#FFFFFF', img: 'assets/images/cash-in-hand-filled.png', noti: this.premiumCount },
  //{ title: 'Learning From Learners', component: TeacherListPage, icon: 'ios-book', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Brand Voice', component: BvPage, icon: 'ios-megaphone', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Video', component: VideoPage, icon: 'ios-videocam', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'News', component: NewsTabsPage, icon: 'ios-paper', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Business', component: BusinessTabsPage, icon: 'ios-briefcase', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Interview', component: InterviewTabsPage, icon: 'ios-mic', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Leadership', component: LeaderTabsPage, icon: '', color: '#FFFFFF', img: 'assets/images/leadership.png', noti: 0 },
  { title: 'Investment', component: InvestmentTabsPage, icon: 'ios-cash', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Create', component: InnovationTabsPage, icon: 'md-laptop', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'General', component: GeneralTabsPage, icon: 'ios-document', color: '#FFFFFF', img: '', noti: 0 },
  // {title: 'Writer', component: WriterPage, icon: 'ios-people', color:'#FFFFFF',img:'',noti:0},
  { title: 'Save Content', component: SaveContentPage, icon: 'ios-bookmarks', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Setting', component: SettingsPage, icon: 'ios-cog', color: '#FFFFFF', img: '', noti: 0 },
  { title: 'Log Out', icon: 'md-log-out', color: '#FFFFFF' },
  ];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public funct: FunctProvider, public changefont: ChangefontProvider,
    //private androidPermissions: AndroidPermissions, 
    public storage: Storage, public sqlite: SQLite,
    public http: Http, public events: Events, private _zone: NgZone,
    public badge: Badge, public alert: AlertController,
    public fcm: FCM, public toastCtrl: ToastController, public file: File, private mobileAccessibility: MobileAccessibility,
    public popoverCtrl: PopoverController, public datepipe: DatePipe, ) {

    this.imglnk = this.funct.imglink + "upload/image/userProfile";
    this.writerImglnk = this.funct.imglink + "upload/image/WriterImage";

    var dateOffset = (24 * 60 * 60 * 1000) * 3; //3 days
    this.date = new Date();
    console.log('Today Date>>>', JSON.stringify(this.date));
    this.date.setTime(this.date.getTime() - dateOffset);
    console.log('Date Format1>>', JSON.stringify(this.date));

    this.tempDate1 = this.datepipe.transform(this.date, 'yyyyMMdd');
    console.log('Date Format2>>', JSON.stringify(this.tempDate1));

    this.initializeApp();

    this.getData();
  }

  getData() {

    this.events.subscribe('language', language => {
      console.log("change language = " + language);
      this.changelanguage(language);
    });

    this.events.subscribe('register', data => {
      console.log("register data in for userimage == " + data);
      if (data != 'user-icon.png' && data != 'Unknown.png') {
        this.file.checkFile(this.file.dataDirectory, data)
          .then((entry) => {
            console.log('file exists' + JSON.stringify(entry));
            if (entry) {
              this.userimage = this.file.dataDirectory + data;
            }
            else {
              this.storage.get('b2bregData').then((res) => {
                this.registerData = res;
                if (this.registerData.n2 == 1) {
                  this.userimage = this.imglnk + "/" + this.registerData.t16;
                  console.log("file mobile userimage == " + this.userimage);
                }
                else {
                  this.userimage = this.writerImglnk + "/" + this.registerData.t16;
                  console.log("file writer userimage == " + this.userimage);
                }
              });
            }

          }, (error) => {
            console.log('does not exist' + JSON.stringify(error));
          });
      }
      else{
        this.userimage = "assets/images/user-icon.png";
      }

      console.log("datadirectory == " + this.file.dataDirectory);
      this.storage.get('b2bregData').then((res) => {
        this.registerData = res;
        if (this.registerData != '' && this.registerData != undefined) {
          if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null && this.registerData.t3 != '' && this.registerData.t3 != undefined && this.registerData.t3 != null) {
            this.phone = this.registerData.t1;
          }
          else if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null) {
            this.phone = this.registerData.t1;
          }
          else {
            this.phone = this.registerData.t3;
          }
          this.name = this.registerData.t2;
        }
        this.checkBillStatus();
      });
    });

    this.events.subscribe('registerlogin', data => {
      console.log("register data in for userimage == " + data);
      this.storage.get('b2bregData').then((res) => {
        this.registerData = res;
        if (this.registerData != '' && this.registerData != undefined) {
          if (this.registerData.n2 == 1) {
            this.userimage = this.imglnk + "/" + data;
            console.log("file mobile userimage1>>>>> " + this.userimage);
          }
          else {
            this.userimage = this.writerImglnk + "/" + data;
            console.log("file writer userimage1>>>>> " + this.userimage);
          }
          if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null && this.registerData.t3 != '' && this.registerData.t3 != undefined && this.registerData.t3 != null) {
            this.phone = this.registerData.t1;
          }
          else if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null) {
            this.phone = this.registerData.t1;
          }
          else {
            this.phone = this.registerData.t3;
          }
          this.name = this.registerData.t2;
        }
        this.checkBillStatus();
      });
    });
    this.notiCountEvent();
  }

  setVersionUpdate() {                                     //new version atda

    let parm1 = {
      version: this.funct.version,
      t1: this.funct.appType,
    };

    console.log("request serviceregisterIO/Version >>>", JSON.stringify(parm1));
    this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/Version', parm1).map(res => res.json()).subscribe(result => {
      console.log("return versionMobile = " + JSON.stringify(result));
      if (result.state) {
        if (result.status == 1) {
          let confirm = this.alert.create({
            title: '<div class="newVersiontitle">' + result.msgCode + '<div>',
            message: result.msgDesc,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'CANCEL',
                cssClass: 'newVersionbutton',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'UPDATE',
                cssClass: 'newVersionbutton',
                handler: () => {
                  if (this.platform.is('android')) {
                    window.open(myConst.blackboardApp.android.storeUrl, '_system');
                  }
                  else {
                    window.open(myConst.blackboardApp.ios.storeUrl, '_system');
                  }
                }
              }
            ]
          });
          confirm.present();
        }
        else if (result.status == 99) {
          let confirm = this.alert.create({
            title: '<div class="newVersiontitle">' + result.msgCode + '<div>',
            message: result.msgDesc,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'UPDATE',
                cssClass: 'newVersionbutton',
                handler: () => {
                  if (this.platform.is('android')) {
                    window.open(myConst.blackboardApp.android.storeUrl, '_system');
                  }
                  else {
                    window.open(myConst.blackboardApp.ios.storeUrl, '_system');
                  }
                }
              }
            ]
          });
          confirm.present();
        }
      }
    },
      error => {
        console.log("signin error=" + error.status);
        this.getError(error, "B135");
      });
  }

  /* 
    setVersionUpdate() {
  
      let parm1 = {
        version: this.funct.version,
        t1: this.funct.appType,
      };
      console.log("request service001/readVersionMobile >>>", JSON.stringify(parm1));
      this.http.post(this.funct.ipaddress2 + 'service001/readVersionMobile', parm1).map(res => res.json()).subscribe(result => {
        console.log("return versionMobile = " + JSON.stringify(result));
        if (result.state) {
          if (result.status == 1) {
            let confirm = this.alert.create({
              title: result.msgCode,
              message: result.msgDesc,
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: 'CANCEL',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'UPDATE',
                  handler: () => {
                    if (this.platform.is('android')) {
                      window.open(myConst.blackboardApp.android.storeUrl, '_system');
                    }
                    else {
                      window.open(myConst.blackboardApp.ios.storeUrl, '_system');
                    }
                  }
                }
              ]
            });
            confirm.present();
          }
          else if (result.status == 99) {
            let confirm = this.alert.create({
              title: result.msgCode,
              message: result.msgDesc,
              enableBackdropDismiss: false,
              buttons: [
                {
                  text: 'UPDATE',
                  handler: () => {
                    if (this.platform.is('android')) {
                      window.open(myConst.blackboardApp.android.storeUrl, '_system');
                    }
                    else {
                      window.open(myConst.blackboardApp.ios.storeUrl, '_system');
                    }
                  }
                }
              ]
            });
            confirm.present();
          }
        }
      },
        error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B135");
        });
    }
   */

  checkBillStatus() {
    this.http.get(this.funct.ipaddress2 + 'service001/checkValidPayment?syskey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("app components billmethod response == " + JSON.stringify(data));
      if (data.state == true) {
        this.storage.set('billStatus', true);
        this.events.publish('billStatus', true);            //atda
        this.premiumUser = true;
        console.log("app components this.premiumUser == " + JSON.stringify(this.premiumUser));
      }
      else {
        //this.storage.set('billStatus',true);
        this.storage.set('billStatus', false);   // tempory
        this.events.publish('billStatus', false);     //atda
        console.log("Bill service error!!! return state false.");
        this.premiumUser = false;
      }
    }, error => {
      //this.storage.set('billStatus',true);
      this.storage.set('billStatus', false);   // tempory
      this.events.publish('billStatus', false);     //atda
      this.premiumUser = false;
      this.getError(error, "B101");
    });
  }

  notiCountEvent() {
    //business
    this.events.subscribe('businessCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("businessCount event data == " + data);
    });

    //home

    this.events.subscribe('homeNoti', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("home event data == " + data);
    });

    // premium

    this.events.subscribe('premiumCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("premiumCount event data == " + data);
    });

    //brandvoice

    this.events.subscribe('brandCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("brandCount event data == " + data);
    });

    // video
    this.events.subscribe('videoCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("videoCount event data == " + data);
    });

    //news

    this.events.subscribe('newsCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("newsCount event data == " + data);
    });

    //leadeship

    this.events.subscribe('leadershipCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("leadershipCount event data == " + data);
    });

    //Investment

    this.events.subscribe('investmentCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("investmentCount event data == " + data);
    });

    //innovation

    this.events.subscribe('innovationCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("innovationCount event data == " + data);
    });

    // interview

    this.events.subscribe('interviewCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("interviewCount event data == " + data);
    });

    //general
    this.events.subscribe('generalCount', data => {
      if (data == 0)
        this.selectNotiCount();
      else
        console.log("generalCount event data == " + data);
    });
  }

  edit() {
    this.nav.push(EditPage);
  }

  getOfflineDB() {
    // All data table
    this.db.executeSql("CREATE TABLE IF NOT EXISTS b2bData (allData TEXT)", {}).then((data) => {
      console.log("All Data TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create all data table", error);
    })

    //news table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS news (allData TEXT)", {}).then((data) => {
      console.log("News TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create news table", error);
    })

    // business table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS business (allData TEXT)", {}).then((data) => {
      console.log("Business TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create business table", error);
    })

    //interview

    this.db.executeSql("CREATE TABLE IF NOT EXISTS interview (allData TEXT)", {}).then((data) => {
      console.log("Interview TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create interview table", error);
    })

    //video table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS video (allData TEXT)", {}).then((data) => {
      console.log("Video TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create video table", error);
    })

    // leadership table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS leadership (allData TEXT)", {}).then((data) => {
      console.log("Leadership TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create leadership table", error);
    })

    // innovation table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS innovation (allData TEXT)", {}).then((data) => {
      console.log("Innovation TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create innovation table", error);
    })

    // general table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS general (allData TEXT)", {}).then((data) => {
      console.log("General TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create general table", error);
    })

    // investment table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS investment (allData TEXT)", {}).then((data) => {
      console.log("Investment TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create investment table", error);
    })

    // chat data table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS chatData (allData TEXT)", {}).then((data) => {
      console.log("chatData TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create chatData table", error);
    });

    // bv data table

    this.db.executeSql("CREATE TABLE IF NOT EXISTS bvData (allData TEXT)", {}).then((data) => {
      console.log("bvData TABLE CREATED ", data);
    }, (error) => {
      console.error("Unable to create bvData table", error);
    })

    // noti table
    this.db.executeSql("CREATE TABLE IF NOT EXISTS notiCount (type TEXT , text TEXT , count INTEGER)", {}).then((data) => {
      console.log("notiCount TABLE notiCount CREATED ", data);
      this.db.executeSql("DELETE FROM notiCount", []).then((data) => {
        console.log("Delete data successfully", data);
        //this.allData =[];
        this.db.executeSql("INSERT INTO notiCount(type,text,count) VALUES ('business','',0),('premium','',0),('Video','',0),('news','',0),('interview','',0),('leadership','',0),('innovation','',0),('investment','',0),('general','',0),('brandvoice','',0)", []).then((data) => {
          console.log("Insert data successfully", data);
        }, (error) => {
          console.error("Unable to insert data", error);
        });
      }, (error) => {
        console.error("Unable to delete data", error);
      });

    }, (error) => {
      console.error("Unable to create notiCount table", error);
    })

    // noti for comment

    this.db.executeSql("CREATE TABLE IF NOT EXISTS myNoti (id INTEGER PRIMARY KEY AUTOINCREMENT,postSyskey TEXT, postName TEXT, time TEXT, date TEXT, userPhoto TEXT,name TEXT,title TEXT,noticountstatus TEXT,notiStatus TEXT)", {}).then((data) => {
      console.log("User Data TABLE CREATED ", data);
    },
      (error) => {
        console.error("Unable to create user data table", error);
      });
  }

  selectNotiCount() {
    this.db.executeSql("SELECT * FROM notiCount ", []).then((data) => {
      let tempData = 0;
      console.log("length == " + data.rows.length);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log("selectNoticount == " + "// " + i + "// " + JSON.stringify(data.rows.item(i)))
          tempData = tempData + data.rows.item(i).count;
          if (data.rows.item(i).type == "business") {
            this.businessCount = data.rows.item(i).count;
            this.pages[5].noti = this.businessCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'premium') {
            this.premiumCount = data.rows.item(i).count;
            this.pages[1].noti = this.premiumCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'Video') {
            this.videoCount = data.rows.item(i).count;
            this.pages[3].noti = this.videoCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'news') {
            this.newsCount = data.rows.item(i).count;
            this.pages[4].noti = this.newsCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'interview') {
            this.interviewCount = data.rows.item(i).count;
            this.pages[6].noti = this.interviewCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'leadership') {
            this.leadershipCount = data.rows.item(i).count;
            this.pages[7].noti = this.leadershipCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'innovation') {
            this.innovationCount = data.rows.item(i).count;
            this.pages[9].noti = this.innovationCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'investment') {
            this.investmentCount = data.rows.item(i).count;
            this.pages[8].noti = this.investmentCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'general') {
            this.generalCount = data.rows.item(i).count;
            this.pages[10].noti = this.generalCount;
            this.notiStatus = true;
          }
          else if (data.rows.item(i).type == 'brandvoice') {
            this.brandCount = data.rows.item(i).count;
            this.pages[2].noti = this.brandCount;
            this.notiStatus = true;
          }
          else {
            console.log("select data for topic foreground count == " + data.rows.item(i).count);
          }
        }
        this.allCount = tempData;
        this.pages[0].noti = this.allCount;
        if (this.allCount > 0) {
          this.notiStatus = true;
          this.badge.set(this.allCount);
        }
        else {
          this.notiStatus = false;
          this.badge.clear();
        }
        this.events.publish('notiStatus', this.notiStatus);
      }
    }, (error) => {
      console.error("Unable to select data", error);
    });
  }

  // content noti

  insertNotiCount(notidata) {
    console.log("notidata.type == " + notidata.type);
    this.db.executeSql("UPDATE notiCount SET count = count + 1 WHERE type = (?)", [notidata.type]).then((data) => {
      console.log("update data successfully", data);
      this.selectNotiCount();
    }, (error) => {
      console.error("Unable to update data", error);
    });
  }

  // comment noti

  insertnoti(data) {
    console.log("insert date " + JSON.stringify(data.date));
    console.log("insert time " + JSON.stringify(data.time));
    this.db.executeSql("INSERT INTO myNoti (postSyskey,postName,time,date,userPhoto,name,title,noticountstatus,notiStatus) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)", [data.postSyskey, data.postName, data.time, data.date, data.userPhoto, data.name, data.title, 1, data.notiStatus]).then((result) => {
      console.log("Insert Noti Data Successful");
      this.deleteNotiData(data);
    }, (error) => {
      console.log("Insert Noti Data Fails");
    });
  }

  //comment noti delete

  deleteNotiData(data) {
    console.log("delete date " + JSON.stringify(data.date));
    console.log("delete temp " + JSON.stringify(this.tempDate1));
    this.db.executeSql("DELETE FROM myNoti WHERE date <=" + this.tempDate1, []).then((data) => {
      console.log("Delete data successfully", data);
      this.nav.setRoot(NotiPage, { status: 1 });
    }, (error) => {
      console.error("Unable to delete data", error);
    });
  }

  changelanfont() {
    this.alertPopup = this.alert.create({
      subTitle: 'ဖောင့်အမျိုးအစား',
      cssClass: this.font,
      inputs: [{
        type: 'radio',
        label: 'ယူနီ',
        value: 'uni',
        checked: this.testRadiouni
      },
      {
        type: 'radio',
        label: 'ဇော်ဂျီ',
        value: 'zg',
        checked: this.testRadiozg
      }],
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (data != '' && data != null && data != undefined) {
              this.storage.set('textboxlan', data);
            }
            else {
              this.changelanfont();
            }
            // Your code to handle the button click
          }
        }],
      enableBackdropDismiss: false
    });
    this.alertPopup.present();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      let tt = this.mobileAccessibility.usePreferredTextZoom(false);
      console.log("tt == " + tt);
      console.log("tt == " + JSON.stringify(tt));

      this.storage.get('b2bregData').then((data) => {
        console.log("registerData = " + JSON.stringify(data));
        if (data == null || data == "") {
          console.log("data >> " + JSON.stringify(data));
          this.rootPage = FirstStepPage;
          //this.getNotiFromServer();
        }
        else if (data == true) {

          this.rootPage = RegistrationPage;
          this.getNotiFromServer();
        }
        else if (data != undefined && data != null) {
          this.getNotiFromServer();
          this.registerData = data;
          //this.setVersionUpdate();
          // this.phone = this.registerData.t1;

          if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null && this.registerData.t3 != '' && this.registerData.t3 != undefined && this.registerData.t3 != null) {
            this.phone = this.registerData.t1;
          }
          else if (this.registerData.t1 != '' && this.registerData.t1 != undefined && this.registerData.t1 != null) {
            this.phone = this.registerData.t1;
          }
          else {
            this.phone = this.registerData.t3;
          }

          this.name = this.registerData.t2;

          if (this.registerData.n2 == 1) {
            this.userimage = this.imglnk + "/" + this.registerData.t16;
            console.log(" mobile user image >>>>>" + JSON.stringify(this.userimage));
          }
          else {
            this.userimage = this.writerImglnk + "/" + this.registerData.t16;
            console.log("writer user image >>>>>" + JSON.stringify(this.userimage));
          }

          if (this.registerData != undefined && this.registerData != null) {
            console.log("registerData ==" + JSON.stringify(this.registerData));
            this.checkBillStatus();
            this.tokenUpdate();
          }
          else {
            this.storage.set('billStatus', false);
          }
          this.rootPage = TabsPage;//MainHomePage HomePage

          // if(this.registerData.t16!= 'Unknown.png')
        }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.setVersionUpdate();
      this.storage.get('language').then((font) => {
        console.log('Your language is', font);
        if (font == null || font == '')
          this.changelanguage('uni');
        else
          this.changelanguage(font);
      });

      this.storage.get('textboxlan').then((font) => {
        console.log('Your textboxlan is', font);
        if (font == null || font == '' || font == undefined) {
          //this.changelanfont();
          this.storage.set('textboxlan', 'uni');
        }
        else {
          this.storage.set('textboxlan', font);
        }
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        console.log("Updating FCM token on backend", token);
        console.log("Updating FCM token on use", this.registerData);
        if (this.registerData != undefined && this.registerData != "" && this.registerData != null) {
          this.sendRegistrationToServer(token);
        }
        else {
          this.storage.remove("refreshToken")
          this.storage.set("refreshToken", token)
        }
      })
      //this.storage.set('billStatus', true); // tempory

      /*    this.fcm.getToken().then(token => {
           console.log("Updating FCM token on backend", token);
           console.log("Updating FCM token on use", this.registerData);
           if (this.registerData != undefined && this.registerData != "" && this.registerData != null) {
             this.sendRegistrationToServer(token);
           }
           else {
             this.storage.remove("refreshToken");
             this.storage.set("refreshToken", token);
           }
         }); */


      /*   this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
                success => console.log('Permission granted'),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
        );
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS); */
      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#e74f4f');

      }
      else {
        this.statusBar.backgroundColorByHexString('#e74f4f');
      }
      this.splashScreen.hide();
      this.branchInit();

      this.sqlite.create({
        name: "b2b.db",
        location: "default"
      }).then((db) => {
        this.db = db;
        this.getOfflineDB();
        this.selectNotiCount();
      });
    });

    this.platform.registerBackButtonAction(() => {
      this.nav.pop();
    });

    this.platform.resume.subscribe(() => {
      this.branchInitResume();
      console.log("this is resume");
      if (this.registerData != undefined && this.registerData != null) {
        this.checkBillStatus();
        this.getNotiFromServer();
      }
      else {
        this.storage.set('billStatus', true);
      }
    });
  }

  tokenUpdate() {
    this.fcm.getToken().then(token => {
      console.error("getToken=" + token);
      if (token != null) {
        this.sendRegistrationToServer(token);
      } else {
        console.log("fcm token null !!!!!!!!");
      }
    },
      error => {
        console.log("registeration token error !!!!!!!!");
      });
  }

  // Branch initialization
  branchInit() {
    // only on devices
    console.log("branch == " + this.platform);
    if (!this.platform.is('cordova')) { return }
    const Branch = window['Branch'];
    Branch.initSession(data => {
      if (data['+clicked_branch_link']) {
        // read deep link data on click
        this.storage.set("deepLinkData", { data: data.custom_string, type: data.custom_type });
        console.log('Deep Link Data:start ' + JSON.stringify(data))
      }
    });
  }

  branchInitResume() {
    // only on devices
    console.log("branch == " + this.platform.platforms());
    if (!this.platform.is('cordova')) { return }
    const Branch = window['Branch'];
    console.log("branch branch == " + Branch + "// " + JSON.stringify(Branch));
    Branch.initSession(data => {
      if (data['+clicked_branch_link']) {
        // read deep link data on click

        // this.events.publish("deepLinkData",data.custom_string);
        console.log('Deep Link Data: resume' + JSON.stringify(data))
        this._zone.run(() => {
          this.nav.setRoot(SingleViewPage, { data: data.custom_string, status: 1, type: data.custom_type });
        });
      }
    });
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
    console.log("Oops!");
  }

  /*getTokenFcm(){

    setTimeout(
      this.fcm.getToken().then(token=>{
        console.error("getToken=" + token);

        if (token != null) {
          alert(token);
          console.log("I got the token: " + token);
          if (this.registerData != undefined && this.registerData != "" && this.registerData != null)
          {
            this.sendRegistrationToServer(token);
          }
        }
      }), 1000);

    this.fcm.onTokenRefresh().subscribe(token=>{
      console.error("onToken=" + token);
      if(this.registerData != undefined && this.registerData != "" && this.registerData != null) {
        this.sendRegistrationToServer(token);
      }
    })

    this.getNotiFromServer();
  }*/

  sendRegistrationToServer(token) {
    let parameter = {
      t14: token,
      syskey: this.registerData.syskey,
      sessionKey: this.registerData.sessionKey
    };
    this.http.post(this.funct.ipaddress2 + 'service001/updateRegToken', parameter).map(res => res.json()).subscribe(result => {
      console.log("updateRegID=" + JSON.stringify(result));
      if (result.state) {
        console.log("success token refresh");
        this.storage.remove("refreshToken");
        this.storage.set("refreshToken", token);
      }
      else {
        let toast = this.toastCtrl.create({
          message: result.errMsg,
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK'
        });
        toast.present(toast);
      }
    },
      error => {
        this.getError(error, "B102");
      });
  }

  getNotiFromServer() {
    console.log("Notification ..................");
    let temp = this.fcm.subscribeToTopic('B2BContentsAndVideoNoti');   // for production
    //let temp = this.fcm.subscribeToTopic('B2BNotiTestingForVersion119');  //for demo
    console.log("temp == " + JSON.stringify(temp));
    this.fcm.onNotification().subscribe(data => {
      this.topicNotiData = data;
      //alert('message received')
      console.log("topic data == " + JSON.stringify(data));
      if (data.wasTapped) {
        console.info("Received in background = " + JSON.stringify(data));
        if (this.topicNotiData.syskey != null && this.topicNotiData.syskey != undefined && this.topicNotiData.syskey != '') {
          this.nav.setRoot(SingleViewPage, { data: this.topicNotiData.syskey, status: 1, type: data.custom_type });
          this.insertNotiCount(this.topicNotiData);
        }
        else {
          this.insertnoti(data);
          //this.nav.setRoot(NotiPage, { status: 1 });
        }
      } else {
        console.info("Received in foreground=" + JSON.stringify(data));
        if (this.topicNotiData.syskey != null && this.topicNotiData.syskey != undefined && this.topicNotiData.syskey != '') {
          this.notiStatus = true;
          this.insertNotiCount(this.topicNotiData);
        }
        else {
          this.insertnoti(data);
        }
      };
    });
  }

  openPage(page) {
    console.log("openpage function and page title == " + page.title);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    page.color = 'light';

    for (let p of this.pages) {
      if (p.title == page.title) {
        p.color = 'light';
      }
      else {
        p.color = '#FFFFFF';
      }

    }
    if (page.title.includes('ထွက်ခွာရန်') || page.title.includes('Log Out')) {
      console.log("Logout Page");
      this.alertPopup = this.alert.create({
        cssClass: this.font,
        message: 'ထွက်ခွာရန်သေချာပါသလား?',
        buttons: [
          {
            text: "ပယ်ဖျက်ရန်",
            cssClass: 'alertButton',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: "သေချာပါသည်",
            cssClass: 'alertButton',
            handler: () => {
              this.cleanCache();
            }
          }
        ]
      })
      this.alertPopup.present();
      let doDismiss = () => this.alertPopup.dismiss();
      let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
      this.alertPopup.onDidDismiss(unregBackButton);
    }
    else if (page.component == VideoPage) {
      this.nav.setRoot(page.component, { pageStatus: 1 });
    }
    else if (page.component == BvPage) {
      this.nav.setRoot(page.component, { pageStatus: 1 });
    }
    else
      this.nav.setRoot(page.component);
  }

  cleanCache() {
    console.log("Cleancache in app.component.ts");
    this.http.get(this.funct.ipaddress2 + 'service001/setSessionExpire?profileKey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("status change == " + JSON.stringify(data));
      this.cleanData();
    }, error => {
      this.getError(error, "B107");
      console.log("clean err");
    });
  }

  cleanData() {
    console.log("clenaData");
    this.sqlite.create({
      name: "b2b.db",
      location: "default"
    }).then((db) => {

      db.executeSql("DELETE FROM b2bData", []).then((data) => {      // clean home data
        console.log("Delete home data successfully", data);
        db.executeSql("DELETE FROM news", []).then((data) => {      // clean news data
          console.log("Delete news data successfully", data);
          db.executeSql("DELETE FROM business", []).then((data) => {      // clean business data
            console.log("Delete business data successfully", data);
            db.executeSql("DELETE FROM video", []).then((data) => {       // clean video data
              console.log("Delete video data successfully", data);
              db.executeSql("DELETE FROM leadership", []).then((data) => {      // clean leadership data
                console.log("Delete leadership data successfully", data);
                db.executeSql("DELETE FROM innovation", []).then((data) => {     // clean innovation data
                  console.log("Delete innovation data successfully", data);
                  db.executeSql("DELETE FROM general", []).then((data) => {     // clean general data
                    console.log("Delete general data successfully", data);
                    db.executeSql("DELETE FROM investment", []).then((data) => {    // clean investment data
                      console.log("Delete investment data successfully", data);
                      db.executeSql("DELETE FROM bvData", []).then((data) => {      // clean bv data
                        console.log("Delete bvData data successfully", data);
                        db.executeSql("DELETE FROM myNoti", []).then((data) => {      // clean chat data
                          console.log("Delete chatData data successfully", data);
                          this.storage.remove('b2bregData');
                          this.storage.set('b2bregData', true);
                          this.nav.setRoot(RegistrationPage);
                        }, (error) => {
                          console.error("Unable to delete chatData data", error);
                        });
                      }, (error) => {
                        console.error("Unable to delete bvData data", error);
                      });
                    }, (error) => {
                      console.error("Unable to delete investment data", error);
                    });
                  }, (error) => {
                    console.error("Unable to delete general data", error);
                  });
                }, (error) => {
                  console.error("Unable to delete innovation data", error);
                });
              }, (error) => {
                console.error("Unable to delete leadership data", error);
              });
            }, (error) => {
              console.error("Unable to delete video data", error);
            });
          }, (error) => {
            console.error("Unable to delete business data", error);
          });
        }, (error) => {
          console.error("Unable to delete news data", error);
        });
      }, (error) => {
        console.error("Unable to delete home data", error);
      });

    }, (error) => {
      console.error("Unable to open database", error);
    });
    console.log("success");
  }


  changelanguage(lan) {
    this.font = lan;
    if (lan == 'uni') {
      this.storage.set('language', "uni");
      let count = 0;
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].title = this.textMyan[count];
        count++;
      }
    }
    else if (lan == 'zg') {
      this.storage.set('language', "zg");
      let count = 0;
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].title = this.changefont.UnitoZg(this.textMyan[count]);
        count++;
      }
    }
    else {
      this.storage.set('language', "eng");
      let count = 0;
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].title = this.changefont.UnitoZg(this.textEng[count]);
        count++;
      }
    }
  }
}
