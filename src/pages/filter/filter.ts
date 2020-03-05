import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Platform, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';
//import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EventLoggerProvider } from '../../providers/event-logger/event-logger';

import { CommentPage } from '../comment/comment';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { TabsPage } from '../tabs/tabs';
import { SugvideoPage } from '../sugvideo/sugvideo';
import { PostLikePersonPage } from '../post-like-person/post-like-person';
import { PaymentPage } from '../payment/payment';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
  providers: [ChangelanguageProvider]
})
export class FilterPage {
  rootNavCtrl: NavController;
  // textMyan : any = ["ရှာရန်","ဒေတာ မရှိပါ။","စာရေးဆရာနာမည်ဖြင့်ရှာရန်"];
  // textEng : any = ["Filter","No result found","Search by writer name"];
  textMyan: any = ["ရှာရန်", "ကြိုက်တယ်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "Enter search value", "ခု"];
  textEng: any = ["Filter", "Like", "Comment", "Share", "No result found", "Enter search value", "Count"];
  textData: any = [];
  font: any;
  pageTitle: any;
  noticount: any;
  registerData: any;
  eDate: any;
  sDate: any;
  date1: any;
  date2: any;
  nores: any;
  isLoading: any;
  start: any;
  end: any;
  menuList: any;
  pinmenuList: any;
  writers: any;
  writername: any;
  writerId: any;
  writerImage: any;
  imageLink: any;
  url: any;
  img: any = '';
  today: any;
  photoLink: any;
  videoImgLink: any;
  searchData: any;
  textFont: any;
  billStatus: any;
  loading: any;
  chekbillAlert: any;
  cutphno: any;
  callid: any;
  mptPopup: any;
  testRadiouni: boolean;
  testRadiozg: boolean;
  showlikeStatus: any;
  alertPopup: any;
  paymentStr: any = '';
  pickerType: any;

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
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController,
    public toastCtrl: ToastController, public changefont: ChangefontProvider,
    public changeLanguage: ChangelanguageProvider, public storage: Storage, public logger: EventLoggerProvider,
    public http: Http, public funct: FunctProvider, public platform: Platform, public sanitizer: DomSanitizer,
    public events: Events,
    private datePicker: DatePicker,
    public datepipe: DatePipe,
    //public fba: FirebaseAnalytics,
    public loadingCtrl: LoadingController, public cdata: DatacleanComponent) {

    let today = new Date();
    this.today = this.datepipe.transform(today, 'dd/MM/yyyy');

    this.rootNavCtrl = navParams.get('rootNavCtrl');
    this.imageLink = this.funct.imglink + "upload/image/WriterImage";
    this.photoLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";

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

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      this.menuList = [];
      this.pinmenuList = [];
      this.start = 0;
      this.end = 0;
      console.log("registerData = " + JSON.stringify(this.registerData));
    });

    this.events.subscribe('textboxlan', data => {
      this.textFont = data;
      if (this.textFont == 'zg') {
        // this.textData[1] = this.changefont.UnitoZg(this.textmyan[1]);
        this.testRadiozg = true;
        this.testRadiouni = false;
      }
      else {
        //this.textData[1] = this.textmyan[1];
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
          //this.textData[1] = this.changefont.UnitoZg(this.textmyan[1]);
          this.testRadiozg = true;
          this.testRadiouni = false;
        }
        else {
          //this.textData[1] = this.textmyan[1];
          this.testRadiouni = true;
          this.testRadiozg = false;
        }
      }
    });
  }

  startDate() {

    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    }).then(
      date => {
        this.date1 = date;
        console.log('Got date: ', date)
        this.sDate = this.datepipe.transform(date, 'MMM-dd-yyyy');
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  endDate() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    }).then(
      date => {
        this.date2 = date;
        console.log('Got date: ', date)
        this.eDate = this.datepipe.transform(date, 'MMM-dd-yyyy');
      },
      err => {
        console.log('Error occurred while getting date: ', err)
      }
    );
  }


  onInput(ev) {
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    this.start = 0;
    if (val && val.trim() != '') {
      this.isLoading = true;
      this.menuList = [];
      this.getData(this.start, '');
    }
  }

  getSearchData() {
    this.start = 0;
    this.end = 0;
    this.menuList = [];
    this.isLoading = true;
    this.getData(this.start, '');
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

  getData(start, infiniteScroll) {

    this.end = this.end + 10;
    let parm = {
      start: start,
      end: this.end
    }

    let temp3;
    let temp4;

    if (this.sDate != null && this.sDate != undefined) {
      let sdatetempArr = this.sDate.split("-");
      temp3 = sdatetempArr[2] + "/" + sdatetempArr[1] + "/" + sdatetempArr[0];
    }
    else {
      temp3 = '';
    }

    if (this.eDate != null && this.eDate != undefined) {
      let edatetempArr = this.eDate.split("-");
      temp4 = edatetempArr[2] + "/" + edatetempArr[1] + "/" + edatetempArr[0];
    }
    else {
      temp4 = '';
    }

    if (this.searchData == null || this.searchData == undefined) {
      this.searchData = '';
    }

    console.log("SYSKEY = " + this.writerId + "/ temp3 = " + temp3 + " /temp4 = " + temp4);

    if (this.searchData == '' && temp3 == '' && temp4 == '') {
      this.isLoading = false;
      this.nores = 0;
    }
    else {
      console.log("filter parm == " + JSON.stringify(parm));
      this.http.post(this.funct.ipaddress2 + "serviceArticle/searchArticleListByContentWriter?searchVal=" + this.searchData + "&startdate=" + temp3 + "&enddate=" + temp4 + "&usersk=" + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey, parm).map(res => res.json()).subscribe(data => {
        console.log("response search list =" + JSON.stringify(data));
        if (data.menu_arr_pin != null) {
          if (data.menu_arr_pin.length > 0) {
            for (let index = 0; index < data.menu_arr_pin.length; index++) {
              if (data.menu_arr_pin[index].menu_arr.length > 0) {
                console.log("data.menu_arr_pin[index].menu_arr.length " + data.menu_arr_pin[index].menu_arr.length);
                this.nores = 1;
                if (this.end == 10) {
                  this.pinmenuList = data.menu_arr_pin;
                  for (let i = 0; i < this.pinmenuList.length; i++) {
                    for (let j = 0; j < this.pinmenuList[i].menu_arr.length; j++) {
                      this.pinmenuList[i].menu_arr[j].modifiedDate = this.funct.getTransformDate(this.pinmenuList[i].menu_arr[j].modifiedDate);
                      this.pinmenuList[i].menu_arr[j].modifiedTime = this.funct.getTimeTransformDate(this.pinmenuList[i].menu_arr[j].modifiedTime);
                      //console.log("one obj ====== "+ JSON.stringify(this.pinmenuList[i].menu_arr[j]));
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
                        this.pinmenuList[i].menu_arr[j].t2 = data;
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
        this.getError(error, "B129");
      });
    }
  }

  clickLike(data, j, k, status) {
    console.log("data=" + JSON.stringify(data));
    // if ((data.t4 == 'premium') && !this.billStatus) {
    //   //this.fillBill();
    //   this.choosePayment();
    // }
    // else {
    if (status == 'pin') {
      if (!data.showLike) {
        this.pinmenuList[j].menu_arr[k].showLike = true;
        this.pinmenuList[j].menu_arr[k].n2 = this.pinmenuList[j].menu_arr[k].n2 + 1;
        this.pinmenuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.pinmenuList[j].menu_arr[k].n2);
        this.getLike(data, j, k, status);
      }
      else {
        this.pinmenuList[j].menu_arr[k].showLike = false;
        this.pinmenuList[j].menu_arr[k].n2 = this.pinmenuList[j].menu_arr[k].n2 - 1;
        this.pinmenuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.pinmenuList[j].menu_arr[k].n2);
        this.getUnlike(data, j, k, status);
      }
    }
    else {
      if (!data.showLike) {
        this.menuList[j].menu_arr[k].showLike = true;
        this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 + 1;
        this.menuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.menuList[j].menu_arr[k].n2);
        this.getLike(data, j, k, status);
      }
      else {
        this.menuList[j].menu_arr[k].showLike = false;
        this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 - 1;
        this.menuList[j].menu_arr[k].likeCount = this.funct.getChangeCount(this.menuList[j].menu_arr[k].n2);
        this.getUnlike(data, j, k, status);
      }
    }
    // }
  }

  getLike(data, j, k, status) {
    console.log("data in getLike filter page >> ", JSON.stringify(data));
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickLikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("response clickLike = ", JSON.stringify(result));
      if (result.state) {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showLike = true;
          this.showlikeStatus = true;
        }
        else {
          this.menuList[j].menu_arr[k].showLike = true;
          this.showlikeStatus = true;
        }

        // this.fba.logEvent('thumb_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1, 'type': this.showlikeStatus }).then((res: any) => {
        //   console.log("name=>" + name + "/status=>" + res);
        // })
        //   .catch((error: any) => console.error(error));
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showLike = false;
          this.pinmenuList[j].menu_arr[k].n2 = this.pinmenuList[j].menu_arr[k].n2 - 1;
        }
        else {
          this.menuList[j].menu_arr[k].showLike = false;
          this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 - 1;
        }
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }

  getUnlike(data, j, k, status) {
    let parameter = {
      key: data.syskey,
      userSK: this.registerData.syskey,
      type: data.t3
    }
    console.log("request clickLUnlike = ", JSON.stringify(parameter));
    this.http.get(this.funct.ipaddress2 + 'serviceArticle/clickUnlikeArticle?key=' + data.syskey + '&userSK=' + this.registerData.syskey + '&type=' + data.t3 + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(data => {
      console.log("response clickLUnlike = ", JSON.stringify(data));
      if (data.state) {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showLike = false;
        }
        else {
          this.menuList[j].menu_arr[k].showLike = false;
        }
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showLike = true;
          this.pinmenuList[j].menu_arr[k].n2 = this.pinmenuList[j].menu_arr[k].n2 + 1;
        }
        else {
          this.menuList[j].menu_arr[k].showLike = true;
          this.menuList[j].menu_arr[k].n2 = this.menuList[j].menu_arr[k].n2 + 1;
        }
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B112");
    });
  }

  clickBookMark(data, j, k, status) {
    console.log("data=" + JSON.stringify(data));
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (!data.showContent) {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showContent = true;
        } else {
          this.menuList[j].menu_arr[k].showContent = true;
        }
        this.saveContent(data, j, k);
      }
      else {
        if (status == 'pin') {
          this.pinmenuList[j].menu_arr[k].showContent = false;
        } else {
          this.menuList[j].menu_arr[k].showContent = false;
        }
        this.unsaveContent(data);
      }
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

  singlePhoto(i) {
    console.log("viewImage == " + JSON.stringify(i));
    this.navCtrl.push(ViewPhotoMessagePage, {
      data: i,
      contentImg: "singlePhoto"
    });
  }


  share(i) {
    console.log("this is share url == " + JSON.stringify(i) + "  //////////////  url === " + JSON.stringify(i.t8));
    // if ((i.t4 == 'premium') && !this.billStatus) {
    //   //this.fillBill();
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

    // this.fba.logEvent('share_click'.toLowerCase(), { 'pageName': i.t1, 'pageType': i.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1 }).then((res: any) => {
    //   console.log("name=>" + name + "/status=>" + res);
    // })
    //   .catch((error: any) => console.error(error));
  }

  paymentBill() {
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

  ionViewDidEnter() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }

  writerProfile(data) {
    if (data.t4 == 'premium' && !this.billStatus) {
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

  getLikePerson(i) {
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

  comment(data, title) {
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      if (this.nores != 0) {
        this.navCtrl.push(CommentPage, {
          data: data,
          title: title
        });
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
    //this.logger.fbevent(data.t1,{ pram: data.syskey});
    // this.fba.logEvent('page_click'.toLowerCase(), { 'pageName': data.t1, 'pageType': data.t3, 'personName': this.registerData.t2, 'personPhone': this.registerData.t1 }).then((res: any) => {
    //   console.log("name=>" + name + "/status=>" + res);
    // })
    //   .catch((error: any) => console.error(error));
    this.post(data);
  }

  post(data) {
    let parameter = {
      t1: this.registerData.t1,
      t3: data.t1,
      sessionKey: this.registerData.sessionKey,
      userSyskey: this.registerData.syskey,
      n1: data.syskey,

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

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end + 1;
        if (!this.isLoading) {
          this.getData(this.start, infiniteScroll);
        }
        console.log('Async operation has ended');
      }, 900);
    })
  }

  goVideoDetail(data) {
    if ((data.t4 == 'premium') && !this.billStatus) {
      //this.fillBill();
      //this.choosePayment();
      this.paymentBill();
    }
    else {
      this.navCtrl.push(SugvideoPage, {
        data: data,
      });
    }
    //data.t1,{ pram: data.syskey});
  }
}
