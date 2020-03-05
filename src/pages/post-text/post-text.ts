import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform, AlertController, PopoverController, Content, LoadingController, } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Clipboard } from '@ionic-native/clipboard';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { SQLite } from '@ionic-native/sqlite';
import moment from 'moment-timezone'

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';

import { SetTextPage } from '../set-text/set-text';

@Component({
  selector: 'page-post-text',
  templateUrl: 'post-text.html',
  providers: [FunctProvider, ChangelanguageProvider, ChangefontProvider],
})
export class PostTextPage {
  @ViewChild(Content) content: Content;
  font: any;
  inputFont: any = '';
  textMyan: any = ["Posts", "ဒေတာ မရှိပါ။"];
  textEng: any = ["Post List", "No result found"];
  textData: any = [];
  post: any = [{ type: '', value: '', caption: '' }];
  newPost: any;
  imageArr: any = [];
  imageUpload: any = [];
  image: any = [];
  statusArr: any = ["Draft", "Pending"];
  typeArr: any = ["News", "Business", "Leadership", "Innovation", "General", "Investment", "Interview","Learners"];
  imageCount: any;
  postText: any;
  postText2: any = "";
  lastIndex: any = 0;
  popover: any;
  postText3: any = "";
  title: any = "";
  status: any;
  type: any;
  publishDate: any;
  scheduleTime: any;
  pinChecked: any;
  showPinDate: any;
  notiChecked: any;
  premiumChecked: any;
  pinStartDate: any;
  pinEndDate: any;
  today: any;
  filter: any = false;
  registerData: any;
  loading: any;
  finalscheduleTime: any;
  tempStartDate: any;
  tempEndDate: any;
  temppublishDate: any;
  scheduleTimes: any;
  public unregisterBackButtonAction: any;
  passData: any;
  array: any;
  array1: any = [];
  imageLink: any;
  editor: any;
  onEditorKeyup: any;
  array2: any;
  flag: any = false;
  isAlert: any = false;
  alertPopup: any;
  updbtn: boolean = true;
  imageNameArr: any = [];
  tempImageUpload: any = [];
  isLoading: any;
  caption: any;
  textValue: any;
  teacherArr: any = [];
  teacherData: any;
  selectLarner: any;
  new: any;
  passStatus: any;
  // userDate :any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public toastCtrl: ToastController,
    public platform: Platform, private file: File, public alertCtrl: AlertController, public datePipe: DatePipe, public sqlite: SQLite,
    public popoverCtrl: PopoverController, public datepipe: DatePipe, public funct: FunctProvider, public changeLanguage: ChangelanguageProvider,
    private transfer: Transfer, public storage: Storage, public loadingCtrl: LoadingController, public http: Http,
    public clipboard: Clipboard, public changefont: ChangefontProvider, public events: Events, private zone: NgZone, public alert: AlertController, ) {

    this.imageLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.passData = this.navParams.get("data");
    console.log("passData>" + JSON.stringify(this.passData));

    this.passStatus = this.navParams.get("status");
    console.log("passStatus>" + JSON.stringify(this.passStatus));

    if(this.passStatus == '1'){
      this.new = true;
    }
    else{
      this.new = false;
    }

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

    // this.getScheduleTimes();

  }

  getScheduleTimes() {
    this.http.get(this.funct.ipaddress2 + 'servicecontentmenu/getTimelist').map(res => res.json()).subscribe(data => {
      console.log("response schedule times = ", JSON.stringify(data));
      this.scheduleTimes = data.data;
      console.log("Schedule times .... ", JSON.stringify(this.scheduleTime));
      this.scheduleTime = this.scheduleTimes[0].value;
      console.log("Schedule times >>>>>>>", JSON.stringify(this.scheduleTime));
      if (this.passData != "" && this.passData != null && this.passData != undefined) {
        console.log("passdata not null");
        console.log("alertTiem>" + this.passData.alertTime);
        for (var i = 0; i < this.scheduleTimes.length; i++) {
          console.log("st value>" + this.scheduleTimes[i].value);
          if (this.passData.alertTime == this.scheduleTimes[i].value) {
            this.scheduleTime = this.scheduleTimes[i].value;
            console.log("st>" + this.scheduleTime);
            break;
          }
        }
      }
    }, error => {
      this.showToast("get schedule time fail");
    });
  }

  getTeacher() {
    this.http.get(this.funct.ipaddress2 + 'serviceTeacher/getTeacherComboData?syskey=' + this.registerData.syskey + '&sessionKey=' + this.registerData.sessionKey).map(res => res.json()).subscribe(result => {
      console.log("Response Teacher Data == " + JSON.stringify(result));
      if (result.data.length > 0) {
        this.teacherArr = result.data;
        //this.teacherData = this.teacherArr[0].value;
        this.teacherData = this.teacherArr.value;
        console.log("teacherData>>" + JSON.stringify(this.teacherArr));
        if (this.passData != "" && this.passData != null && this.passData != undefined) {
          console.log("passTeacherData not null");
          console.log("teacherData1>" + this.passData.n13);
          for (var i = 0; i < this.teacherArr.length; i++) {
            console.log("TD value>" + this.teacherArr[i].value);
            if (this.passData.n13 == this.teacherArr[i].value) {
              this.teacherData = this.teacherArr[i].value;
              console.log("TD>" + this.teacherData);
              break;
            }
          }
        }
      }
      else {
        console.log("No Result Data");
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B120");
    });
  }

  getPostListDetail() {

    
    if (this.passData != '' && this.passData != undefined && this.passData != null) {

      console.log("inputFont1 >>> ", this.inputFont);
      if (this.inputFont == "zg") {
        this.title = this.changefont.UnitoZg(this.passData.t1);
        console.log("title1 >> ", this.title);
      }
      else {
        this.title = this.passData.t1;
        console.log("title2 >> ", this.title);
      }
      console.log("title132>> ", this.title);

      console.log("alertTiem>" + this.passData.alertTime);
      let tempschedule = this.passData.alertTime;
      console.log("tempDate1>" + tempschedule);

      let tempscheduletime = tempschedule.substring(0, 2);
      console.log("tempscheduletime>" + tempscheduletime);
      let tempscheduletime1 = tempschedule.substring(2, 4);
      console.log("tempscheduletime1>" + tempscheduletime1);
      this.scheduleTime = tempscheduletime + ":" + tempscheduletime1;
      console.log("scheduleTime>" + this.scheduleTime);

      let temp1 = this.passData.alertDate;
      console.log("tempDate1>" + temp1);
      let year1 = temp1.substring(0, 4);
      let month1 = temp1.substring(4, 6);
      let day1 = temp1.substring(6, 8);
      let tempDate1 = year1 + "/" + month1 + "/" + day1;
      console.log("TempDate1 = ", JSON.stringify(tempDate1));
      this.publishDate = this.datepipe.transform(tempDate1, 'yyyy-MM-dd');
      console.log("TempDate1 >>>>>>", JSON.stringify(this.publishDate));

      if (this.passData.n7 == 'Publish') {
        this.status = this.passData.n7;
        this.flag = true;
        console.log("Status >>>>>>", JSON.stringify(this.status));
      }
      else {
        this.status = this.passData.n7;
        console.log("Status >>>>>>", JSON.stringify(this.status));
      }

      if (this.passData.n4 == 0) {
        this.type = this.typeArr[0];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 1) {
        this.type = this.typeArr[1];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 2) {
        this.type = this.typeArr[2];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 3) {
        this.type = this.typeArr[3];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 4) {
        this.type = this.typeArr[4];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 5) {
        this.type = this.typeArr[5];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 6) {
        this.type = this.typeArr[6];
        this.selectLarner = false;
      }
      else if (this.passData.n4 == 7) {
        this.type = this.typeArr[7];
        this.selectLarner = true;
      }

      if (this.passData.n9 == 1) {
        this.notiChecked = true;
      }
      else {
        this.notiChecked = false;
      }

      if (this.passData.n12 == 1) {
        this.pinChecked = true;
        this.showPinDate = true;

        let temp2 = this.passData.t12;
        let year2 = temp2.substring(0, 4);
        let month2 = temp2.substring(4, 6);
        let day2 = temp2.substring(6, 8);
        let tempDate2 = year2 + "/" + month2 + "/" + day2;
        this.pinStartDate = this.datepipe.transform(tempDate2, 'yyyy-MM-dd');

        let temp3 = this.passData.t13;
        let year3 = temp3.substring(0, 4);
        let month3 = temp3.substring(4, 6);
        let day3 = temp3.substring(6, 8);
        let tempDate3 = year3 + "/" + month3 + "/" + day3;
        this.pinEndDate = this.datepipe.transform(tempDate3, 'yyyy-MM-dd');
      }
      else {
        this.pinChecked = false;
        this.showPinDate = false;
      }

      if (this.passData.t4 == 'premium') {
        this.premiumChecked = true;

      }
      else {
        this.premiumChecked = false;
      }

      let temp = this.passData.t2;
      console.log("temp data1 == " + JSON.stringify(temp));
      this.array2 = temp.split("</p><p>");
      console.log("Array Data>>>>" + JSON.stringify(this.array2));

      this.array2[0] = this.array2[0].replace(/<p>/g, "");
      this.array2[this.array2.length - 1] = this.array2[this.array2.length - 1].replace(/<\/p>/g, "");
      console.log("temp data2 == " + JSON.stringify(this.array2));

      // this.postText = this.array2[0];
      if (this.inputFont == "zg") {
        this.postText = this.changefont.UnitoZg(this.array2[0]);
        console.log("this.postText1>>>>" + JSON.stringify(this.postText));
      }
      else {
        this.postText = this.array2[0];
        console.log("this.postText2>>>>" + JSON.stringify(this.postText));
      }

      this.post = [];
      for (let a = 1; a < this.array2.length; a++) {
        console.log("this.array2.length>>>>" + JSON.stringify(this.array2.length));
        if (this.array2[a] == "[#img]") {
          this.caption = "";
          console.log("pass data caption>> ", this.passData.uploadedPhoto[a-1].t5);
          if (this.inputFont == "zg") {
            this.caption = this.changefont.UnitoZg(this.passData.uploadedPhoto[a-1].t5);
            console.log("caption1 >> ", this.caption);
          }
          else {
            this.caption = this.passData.uploadedPhoto[a-1].t5;
            console.log("caption2 >> ", this.caption);
          }
          
          this.post.push({ type: 'img', value: this.imageLink + this.passData.uploadedPhoto[a-1].t7, caption: this.caption });
          console.log("Image Array >>>>>>> " + JSON.stringify(this.post));
        }
        else {

          if (this.inputFont == "zg") {
            this.textValue = this.changefont.UnitoZg(this.array2[a]);
          }
          else {
            this.textValue = this.array2[a];
          }
          this.post.push({ type: 'text', value: this.textValue, caption: '' });
        }
      }
      console.log("postedited>>" + JSON.stringify(this.post));
    }
    else {
      let date = new Date();
      this.today = this.datepipe.transform(date, 'yyyyMMdd');
      console.log("today>" + this.today);
      this.publishDate = this.changeDateFormat(new Date());
      console.log("PublishDate2 >> ", this.publishDate);
      this.scheduleTime = moment().format('HH:mm');
      this.scheduleTime = this.getRoundTime(this.scheduleTime, 10);  // Round up Time 
      console.log("Round up Time>" + JSON.stringify(this.scheduleTime));
    }

  }

  updatePost() {
    this.loading = this.loadingCtrl.create({
      content: "Updating...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    console.log("updateServer");
    console.log("Image Uploaded>>" + JSON.stringify(this.imageUpload));

    this.publishDate = this.datepipe.transform(this.publishDate, 'yyyyMMdd');
    console.log("PublishDate1 >> ", this.publishDate);
    console.log("st>" + this.scheduleTime);
    var time1 = [] = String(this.scheduleTime).split(":");
    console.log("ttt>" + time1);
    this.finalscheduleTime = time1[0] + time1[1];
    console.log("final>>" + this.finalscheduleTime);
    let msg = '';

    if (this.title == '' || this.title == null || this.title == undefined) {
      msg = "Please fill Title";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.title.length >= 500) {
      msg = "Title is exceed limited 500 characters count!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.status == '' || this.status == null || this.status == undefined) {
      msg = "Choose Status!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.type == '' || this.type == null || this.type == undefined) {
      msg = "Choose Type!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.publishDate == '' || this.publishDate == null || this.publishDate == undefined) {
      msg = "Choose Publish Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.finalscheduleTime == '' || this.finalscheduleTime == null || this.finalscheduleTime == undefined) {
      msg = "Choose Schedule Time!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.scheduleTime == '' || this.scheduleTime == null || this.scheduleTime == undefined) {
      msg = "Choose Schedule Time!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.pinChecked && (this.pinStartDate == '' || this.pinStartDate == null || this.pinStartDate == undefined)) {
      msg = "Choose Pinned Start Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.pinChecked && (this.pinEndDate == '' || this.pinEndDate == null || this.pinEndDate == undefined)) {
      msg = "Choose Pinned End Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.tempStartDate < this.today && this.pinChecked) {
      msg = "Pinned Start Date must be greater than or equal alertDate";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.tempEndDate < this.today || this.tempEndDate < this.tempStartDate) && this.pinChecked) {
      msg = "Pinned End Date must be greater than or equal Pinned Start Date";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.teacherData == '' || this.teacherData == null || this.teacherData == undefined) && this.selectLarner) {
      msg = "Choose Teacher!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.postText == '' || this.postText == null || this.postText == undefined) {
      msg = "Please fill Content!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else {

      console.log("Image Array1 >>> ", JSON.stringify(this.imageArr));
      console.log("post data>>>>>>>>>>>>>" + JSON.stringify(this.post));
      console.log("post data length >>>>>>>>>>>>>" + JSON.stringify(this.post.length));
      let cmsText = '';
      cmsText = cmsText + "<p>" + this.postText + "</p>";
      this.imageArr = [];
      for (let b = 1; b < this.post.length; b++) {
        if (this.post[b].type == 'img') {
          let obj = { value: '', imgdesc: '' };
          obj.value = this.post[b].value;
          obj.imgdesc = this.post[b].caption;
          this.imageArr.push(obj);
        }
      }
    console.log("Image Array12 >>> ", JSON.stringify(this.imageArr));

      for (let c = 0; c < this.post.length; c++) {
        if (this.post[c].type == 'text' && this.post[c].value != '' && this.post[c].value != undefined && this.post[c].value != null) {
          cmsText = cmsText + "<p>" + this.post[c].value + "</p>";
          console.log("new one text>>>" + cmsText);
        }
        else if (this.post[c].type == 'img' && this.post[c].value != '' && this.post[c].value != undefined && this.post[c].value != null && this.post[c].caption != undefined && this.post[c].caption != null) {
          cmsText = cmsText + "<p>[#img]</p>";
          console.log("new one img>>>>>>>>" + cmsText);
        }
        else {
          console.log("this is not image and text!");
        }
      }

      let t4 = '';
      if (this.premiumChecked) {
        t4 = "premium";
      }

      let n4;
      if (this.type == 'News') {
        n4 = 0;
      }
      else if (this.type == 'Business') {
        n4 = 1;
      }
      else if (this.type == 'Leadership') {
        n4 = 2;
      }
      else if (this.type == 'Innovation') {
        n4 = 3;
      }
      else if (this.type == 'General') {
        n4 = 4;
      }
      else if (this.type == 'Investment') {
        n4 = 5;
      }
      else if (this.type == 'Interview') {
        n4 = 6;
      }
      else if (this.type == 'Learners') {
        n4 = 7;
      }

      let n9;
      if (this.notiChecked) {
        n9 = 1;
      } else {
        n9 = 0;
      }

      let n7;
      if (this.status == 'Draft') {
        n7 = 1;
      }
      else if (this.status == 'Pending') {
        n7 = 2;
      }
      else {
        n7 = 5;
      }

      this.tempStartDate = this.datepipe.transform(this.pinStartDate, 'yyyyMMdd');
      this.tempEndDate = this.datepipe.transform(this.pinEndDate, 'yyyyMMdd');
      console.log("PinStartDate>>>>" + JSON.stringify(this.tempStartDate));
      console.log("PinEndDate>>>>" + JSON.stringify(this.tempEndDate));

      let n12;
      if (this.pinChecked) {
        n12 = 1;
      } else {
        n12 = 0;
        this.tempStartDate = "";
        this.tempEndDate = "";
      }

      console.log("upphoto>" + JSON.stringify(this.passData.uploadedPhoto));
      if (this.passData.uploadedPhoto != '' && this.passData.uploadedPhoto != null && this.passData.uploadedPhoto != undefined) {
        this.imageNameArr = [];
        this.tempImageUpload = [];
        for (let d = 0; d < this.passData.uploadedPhoto.length; d++) {
          var temp = [] = String(this.passData.uploadedPhoto[d].t7).split("/");
          this.imageNameArr[d] = temp[1];
          console.log("ImageUploadArray1>>>>>>" + JSON.stringify(this.imageNameArr));
          let obj = {
            "serial": d + 1,
            "name": temp[1],
            "desc": "",
            "order": "",
            "url": this.passData.uploadedPhoto[d].t7,
            "imgdesc": this.passData.uploadedPhoto[d].t5,
          }
          console.log("obj1===" + JSON.stringify(obj));
          this.tempImageUpload.push(obj);
          //this.imageNameArr.push(this.imageNameArr);
          console.log("ImageUploadArray2>>>>>>" + JSON.stringify(this.tempImageUpload));
        }

      }

      console.log("ImageUploadArray update post text page>>>>>>" + JSON.stringify(this.imageUpload));
      console.log("this.imageArr update post>>>>>>" + JSON.stringify(this.imageArr));
      console.log("this.imageArr length update post>>>>>>" + JSON.stringify(this.imageArr.length));
      let imageNameArray = "";
      for (let e = 0; e < this.imageUpload.length; e++) {
        console.log("ImageUploadArray3>>>>>>" + JSON.stringify(this.imageUpload.length));
        
        var temp1 = [] = String(this.imageUpload[e].name).split("/");
        this.imageNameArr[e] = temp1[1];
        imageNameArray = this.imageNameArr[e];
        console.log("ImageUploadArray4>>>>>>" + JSON.stringify(imageNameArray));
        console.log("PassData.uploadedPhoto.length>>>" + JSON.stringify(this.passData.uploadedPhoto.length));
        let desc;
        if(this.imageArr.length <= 0){
          desc = '';
        }
        else{
          desc = this.imageArr[this.imageArr.length - 1].imgdesc;
        }
        let obj1 = {
          "serial": this.passData.uploadedPhoto.length + 1,
          "name": temp1[1],
          "desc": "",
          "order": "",
          "url": this.imageUpload[e].name,
          "imgdesc": desc,
        }
        console.log("obj2>>>>>" + JSON.stringify(obj1));
        //tempImageUpload.push(obj1);

        this.tempImageUpload.push(obj1);
        this.imageNameArr.push(imageNameArray);
        console.log("ImageUploadArray5>>>>>>" + JSON.stringify(this.tempImageUpload));
        console.log("Image name Array>>>>>>" + JSON.stringify(this.imageNameArr));
      }

      let params = {
        "syskey": this.passData.syskey,
        "autokey": 0,
        "createdDate": "",
        "createdTime": "",
        "modifiedDate": "",
        "modifiedTime": "",
        "modifiedUserId": "",
        "modifiedUserName": "",
        "alertDate": this.publishDate,
        "alertTime": this.finalscheduleTime,
        "userId": this.registerData.t1,
        "userName": this.registerData.t2,
        "t1": this.title,
        "t2": cmsText,
        "t3": "",
        "t4": t4,
        "t5": "",
        "t6": "",
        "t7": "",
        "t8": "",
        "t9": "",
        "t10": "",
        "t11": "",
        "t12": this.tempStartDate,
        "t13": this.tempEndDate,
        "temp": "",
        "n1": 0,
        "n2": 0,
        "n3": 0,
        "n4": n4,
        "n5": this.registerData.syskey,
        "n6": 0,
        "n7": n7,
        "n8": 0,
        "n9": n9,
        "n10": 0,
        "n11": 0,
        "n12": n12,
        "n13": this.teacherData,
        "uploadlist": this.tempImageUpload,
        "resizelist": this.imageNameArr,
        "serialno": 0,
      }
      console.log("request postUpdate = ", JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'servicecontentmenu/saveNewContenMenu', params).map(res => res.json()).subscribe(data => {
        //this.loading.dismiss();
        console.log("response postUpdate = ", JSON.stringify(data));
        this.showToast(data.msgDesc);
        if (data.state == true) {
          this.navCtrl.pop();
        }
      }, error => {
        this.loading.dismiss();
        this.showToast("Save fail");
        console.log("signin error=" + error.status);
        this.getError(error, "B130");
      });
    }

  }

  ionViewCanEnter() {
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
      console.log("registerData Syskey = " + JSON.stringify(this.registerData.syskey));
      console.log("registerData t1 = " + JSON.stringify(this.registerData.t1));
      console.log("registerData t2 = " + JSON.stringify(this.registerData.t2));
      this.getTeacher();
    });

    // this.storage.get('textboxlan').then((textFont) => {
    //     console.log("storage >> ", textFont);
    //     this.inputFont = textFont;
    //     this.getPostListDetail();
    //   });

      
    this.storage.get('textboxlan').then((result) => {
      console.log("font == " + result);
      this.inputFont = result;
      console.log("this.inputFont == " + this.inputFont);
      if (result == '' || result == undefined || result == null) {
        this.inputFont = 'uni';
      }
      else {
        this.inputFont = result;
      }
      this.getPostListDetail();
    });

   //this.getPostListDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostTextPage');
    this.backButtonExit();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  changeDateFormat(result) {
    let tmpDate;
    if (result == "invalid date") result = new Date();
    tmpDate = result;
    tmpDate.setDate(tmpDate.getDate());
    return tmpDate.toISOString();
  }

  selectPhoto() {
    console.log('Photo gallery');
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 300,
      targetWidth: 300,
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log('Camera success');
      this.image = imageData;  // android
      this.updateUserImage(imageData);
    }, (error) => {
      console.error("Unable to open database", error);
    });
  }

  updateUserImage(imageData) {
    let currentName = '';
    let correctPath = '';
    if (imageData.indexOf('file:///') > -1) {
      if (imageData.indexOf('?') > -1) {
        currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        correctPath = imageData.substring(0, imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
      }
      else {
        currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      }
    }
    else {
      if (imageData.indexOf('?') > -1) {
        currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
        correctPath = 'file:///' + imageData.substring(0, imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
      }
      else {
        currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        correctPath = 'file:///' + imageData.substr(0, imageData.lastIndexOf('/') + 1);
      }
    }
    console.log("currentName == " + currentName);
    console.log("currentPath == " + correctPath);
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName()); // this.createImageName()
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log("namePaht == " + namePath + "   //// currentNmae == " + currentName + "   ////  newFileName == " + newFileName);
    console.log("this.file.datadirectory == " + this.file.dataDirectory);
    console.log("post>>>" + JSON.stringify(this.post));
    console.log("post len>>>" + this.post.length);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {

      if (this.post.length == 0) {
        this.post = [{ type: '', value: '', caption: '' }];
      }
      if (this.post.length != 1 && (this.post[this.post.length - 1]['value'] == '' || this.post[this.post.length - 1]['value'] == null || this.post[this.post.length - 1]['value'] == undefined)) {
        this.post.splice(this.post.length - 1, 1)
      }

      this.post.push({ type: 'img', value: this.file.dataDirectory + newFileName, caption: '' });
      this.post.push({ type: 'text', value: '', caption: '' });

      console.log("Select post=" + JSON.stringify(this.post));

      this.imageArr = [];
      for (let i = 1; i < this.post.length; i++) {
        if (this.post[i].type == 'img' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          let obj = { value: '', imgdesc: '' };
          obj.value = this.post[i].value;
          obj.imgdesc = this.post[i].caption;
          this.imageArr.push(obj);
        }
      }
      console.log("images array=" + JSON.stringify(this.imageArr));
      this.uploadImage();

    }, error => {
      alert('Error while storing file.' + JSON.stringify(error));
    });
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  editPhoto(ev, img, index) {
    console.log("img...." + img);
    this.popover = this.popoverCtrl.create(SetTextPage, { post: img });

    this.popover.present({
      ev: ev
    });

    let doDismiss = () => this.popover.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.popover.onDidDismiss(unregBackButton);

    this.popover.onWillDismiss(data => {
      console.log("Edit Photo");
      console.log("Selected Item is " + data);
      if (data == 1 || data == '1') {
        console.log("data1");
        console.log("photo>>>>" + this.post.length);
        console.log("Index >> ",index);
        if (this.passData != '' && this.passData != null && this.passData != undefined) {
          console.log("PassData Delete >> ", JSON.stringify(this.passData));
          console.log("this.passData.uploadedPhoto >> ", JSON.stringify(this.passData.uploadedPhoto));
          if(index < this.passData.uploadedPhoto.length){
            console.log("Less than");
            var fileName = String(this.passData.uploadedPhoto[index].t7).split("/").pop();
            // var temp = [] = String(this.passData.uploadedPhoto[index].t7).split("/");
            // var fileName = temp[1];
            var url1 = this.passData.uploadedPhoto[index].t7;
            console.log("Image Name = ", JSON.stringify(fileName));
            console.log("Image URl = ", JSON.stringify(url1));
  
            console.log("request image Requestmodule001/file/fileRemoveContent?fn=" + fileName + "&url=" + url1);
            this.http.get(this.funct.imglink + 'module001/file/fileRemoveContent?fn=' + fileName + '&url=' + url1).map(res => res.json()).subscribe(result => {
              console.log("response image Delete = ", JSON.stringify(result));
              if (result.code == "SUCCESS") {
                console.log("Post Delete >> ", JSON.stringify(this.post));
                this.showToast('Image Deleted Successful!');
                console.log("Index >> ", index);
                this.passData.uploadedPhoto.splice(index, 1);
                this.imageArr.splice(index,1);
                this.post.splice(index, 1);
              }
              else {
                let toast = this.toastCtrl.create({
                  message: "Failed post.",
                  duration: 5000,
                  position: 'bottom',
                  //  showCloseButton: true,
                  dismissOnPageChange: true,
                  // closeButtonText: 'OK's
                });
                toast.present(toast);
              }
              console.log("PassData >> ",JSON.stringify(this.passData));
            }, error => {
              console.log("signin error=" + error.status);
              this.getError(error, "B133");
            });
          }else{
            console.log("Index1111");
            this.post.splice(index, 1);
            this.imageArr.splice(index,1);
          }     

        }
        else {
          this.post.splice(index, 1);
          this.imageArr.splice(index,1);
        }
        console.log("After Post >> ", JSON.stringify(this.post));
      }
      else {

      }
    });
  }

  search() {
    this.filter = !this.filter;
    this.content.resize();
    this.scrollToTop();
  }

  scrollToTop() {
    setTimeout(() => {
      if (this.content._scroll) this.content.scrollToTop(0);
    }, 400);
  }

  uploadImage() {
    console.log("imageArr>>" + JSON.stringify(this.imageArr));
    var fileName = this.imageArr[this.imageArr.length - 1]["value"].split("/").pop();
    var type = 0;
    var url = this.funct.imglink + 'module001/file/fileupload?f=upload&fn=' + fileName + '&id=' + this.registerData.syskey + '&type=' + type;
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
    }

    console.log("imgup>" + JSON.stringify(this.imageUpload));
    const fileTransfer: TransferObject = this.transfer.create();
    fileTransfer.upload(this.imageArr[this.imageArr.length - 1]['value'], url, options).then((data) => {
      console.log("data response>>" + JSON.stringify(data));
      if (data.responseCode === 200) {
        console.log("image upload success=" + JSON.stringify(data));
        let resultResponse = JSON.parse(data.response);
        console.log("ResultResponse in post-text.ts >> ", resultResponse);
        let w = { name: '', imgdesc: '' };
        w['name'] = resultResponse.url;
        w['imgdesc'] = this.imageArr[this.imageArr.length - 1]['imgdesc'];
        this.imageUpload.push(w);
        console.log("imageUpload1>" + JSON.stringify(this.imageUpload));
      }
      else {
        console.log("image upload  fail");
      }
    }, (err) => {
      console.log("Error upload=" + JSON.stringify(err));
      this.presentToast('Oops! Something is wrong. Please check connection.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      dismissOnPageChange: true,
      position: 'bottom'
    });
    toast.present();
  }

  savePost1() {
    console.log("savepost");
    if (this.passData != '' && this.passData != null && this.passData != undefined) {
      console.log("Undefined PassData");
      this.updatePost();
    }
    else {
      console.log("Not Undefined PassData");
      this.savePost();
    }
  }

  savePost() {
    this.loading = this.loadingCtrl.create({
      content: "Saving...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    console.log("uploadserver");
    console.log("Image Uploaded>>" + JSON.stringify(this.imageUpload));
    this.tempStartDate = this.datepipe.transform(this.pinStartDate, 'yyyyMMdd');
    this.tempEndDate = this.datepipe.transform(this.pinEndDate, 'yyyyMMdd');
    this.publishDate = this.datepipe.transform(this.publishDate, 'yyyyMMdd');
    console.log("PublishDate2 >> ", this.publishDate);
    console.log("st>" + this.scheduleTime);
    var time1 = [] = String(this.scheduleTime).split(":");
    console.log("ttt>" + time1);
    this.finalscheduleTime = time1[0] + time1[1];
    console.log("final>>" + this.finalscheduleTime);

    let msg = '';

    if (this.title == '' || this.title == null || this.title == undefined) {
      msg = "Please fill Title";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.title.length >= 500) {
      msg = "Title is exceed limited 500 characters count!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.status == '' || this.status == null || this.status == undefined) {
      msg = "Choose Status!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.type == '' || this.type == null || this.type == undefined) {
      msg = "Choose Type!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.publishDate == '' || this.publishDate == null || this.publishDate == undefined) {
      msg = "Choose Publish Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.finalscheduleTime == '' || this.finalscheduleTime == null || this.finalscheduleTime == undefined) {
      msg = "Choose Schedule Time!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.scheduleTime == '' || this.scheduleTime == null || this.scheduleTime == undefined) {
      msg = "Choose Schedule Time!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.pinChecked && (this.pinStartDate == '' || this.pinStartDate == null || this.pinStartDate == undefined)) {
      msg = "Choose Pinned Start Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.pinChecked && (this.pinEndDate == '' || this.pinEndDate == null || this.pinEndDate == undefined)) {
      msg = "Choose Pinned End Date!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.tempStartDate < this.today && this.pinChecked) {
      msg = "Pinned Start Date must be greater than or equal alertDate";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.tempEndDate < this.today || this.tempEndDate < this.tempStartDate) && this.pinChecked) {
      msg = "Pinned End Date must be greater than or equal Pinned Start Date";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.teacherData == '' || this.teacherData == null || this.teacherData == undefined) && this.selectLarner) {
      msg = "Choose Teacher!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.postText == '' || this.postText == null || this.postText == undefined) {
      msg = "Please fill Content!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else {
      console.log("Image Array >>> ", JSON.stringify(this.imageArr));
      console.log("post data?????????" + JSON.stringify(this.post));
      let cmsText = '';
      cmsText = cmsText + "<p>" + this.postText + "</p>";
      this.imageArr = [];
      for (let j = 1; j < this.post.length; j++) {
        if (this.post[j].type == 'img') {
          let obj = { value: '', imgdesc: '' };
          obj.value = this.post[j].value;
          obj.imgdesc = this.post[j].caption;
          this.imageArr.push(obj);
        }
      }
      console.log("Image Array13 >>> ", JSON.stringify(this.imageArr));

      for (let z = 0; z < this.post.length; z++) {
        if (this.post[z].type == 'text' && this.post[z].value != '' && this.post[z].value != undefined && this.post[z].value != null) {
          cmsText = cmsText + "<p>" + this.post[z].value + "</p>";
          console.log("new one text>>>" + cmsText);
        }
        else if (this.post[z].type == 'img' && this.post[z].value != '' && this.post[z].value != undefined && this.post[z].value != null && this.post[z].caption != undefined && this.post[z].caption != null) {
          cmsText = cmsText + "<p>[#img]</p>";
          console.log("new one img>>>>>>>>" + cmsText);
        }
        else {
          console.log("this is not image and text!");
        }
      }

      console.log("Title>>>>" + JSON.stringify(this.title));
      console.log("Status>>>>" + JSON.stringify(this.status));
      console.log("Type>>>>" + JSON.stringify(this.type));
      console.log("Type>>>>" + JSON.stringify(this.publishDate));
      console.log("ScheduleTime>>>>" + JSON.stringify(this.finalscheduleTime));
      console.log("NotiChecked>>>>" + JSON.stringify(this.notiChecked));
      console.log("PinChecked>>>>" + JSON.stringify(this.pinChecked));
      console.log("PremiumChecked>>>>" + JSON.stringify(this.premiumChecked));
      console.log("PinStartDate>>>>" + JSON.stringify(this.tempStartDate));
      console.log("PinEndDate>>>>" + JSON.stringify(this.tempEndDate));
      console.log("PostText>>>>" + JSON.stringify(this.postText));
      console.log("PostText2>>>>" + JSON.stringify(this.postText2));
      console.log("ImageArray upload server>>>>" + JSON.stringify(this.imageArr));
      console.log("for t2>>" + JSON.stringify(cmsText));

      let t4 = '';
      if (this.premiumChecked) {
        t4 = "premium";
      }

      if (!this.pinChecked) {
        this.tempStartDate = '';
        this.tempEndDate = '';
      }

      let n4;
      if (this.type == 'News') {
        n4 = 0;
      }
      else if (this.type == 'Business') {
        n4 = 1;
      }
      else if (this.type == 'Leadership') {
        n4 = 2;
      }
      else if (this.type == 'Innovation') {
        n4 = 3;
      }
      else if (this.type == 'General') {
        n4 = 4;
      }
      else if (this.type == 'Investment') {
        n4 = 5;
      }
      else if (this.type == 'Interview') {
        n4 = 6;
      }
      else if (this.type == 'Learners') {
        n4 = 7;
      }

      let n7;
      if (this.status == 'Draft') {
        n7 = 1;
      }
      else if (this.status == 'Pending') {
        n7 = 2;
      }

      let n9;
      if (this.notiChecked) {
        n9 = 1;
      } else {
        n9 = 0;
      }

      let n12;
      if (this.pinChecked) {
        n12 = 1;
      } else {
        n12 = 0;
      }

      let tempImageUpload = [];
      let imageNameArr = [];
      console.log("ImageUploadArray length upload server>>>>>>" + JSON.stringify(this.imageUpload));
      console.log("ImageUploadArray length>>>>>>" + JSON.stringify(this.imageUpload.length));
      console.log("this.imageArr upload server>>>>>>" + JSON.stringify(this.imageArr));
      console.log("this.imageArr length upload server>>>>>>" + JSON.stringify(this.imageArr.length));
      for (let y = 0; y < this.imageUpload.length; y++) {
        var temp = [] = String(this.imageUpload[y].name).split("/");
        imageNameArr[y] = temp[1];
        console.log("ImageUploadArray>>>>>>" + JSON.stringify(imageNameArr));
        let obj = {
          "serial": y + 1,
          "name": temp[1],
          "desc": "",
          "order": "",
          "url": this.imageUpload[y].name,
          "imgdesc": this.imageArr[y].imgdesc
        }
        console.log("obj>" + JSON.stringify(obj));
        tempImageUpload.push(obj);
        console.log()
      }

      let params = {
        "syskey": 0,
        "autokey": 0,
        "createdDate": "",
        "createdTime": "",
        "modifiedDate": "",
        "modifiedTime": "",
        "modifiedUserId": "",
        "modifiedUserName": "",
        "alertDate": this.publishDate,
        "alertTime": this.finalscheduleTime,
        "userId": this.registerData.t1,
        "userName": this.registerData.t2,
        "t1": this.title,
        "t2": cmsText,
        "t3": "",
        "t4": t4,
        "t5": "",
        "t6": "",
        "t7": "",
        "t8": "",
        "t9": "",
        "t10": "",
        "t11": "",
        "t12": this.tempStartDate,
        "t13": this.tempEndDate,
        "temp": "",
        "n1": 0,
        "n2": 0,
        "n3": 0,
        "n4": n4,
        "n5": this.registerData.syskey,
        "n6": 0,
        "n7": n7,
        "n8": 0,
        "n9": n9,
        "n10": 0,
        "n11": 0,
        "n12": n12,
        "n13": this.teacherData,
        "uploadlist": tempImageUpload,
        "resizelist": imageNameArr,
        "serialno": 0,
      }

      console.log("request postData = ", JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'servicecontentmenu/saveNewContenMenu', params).map(res => res.json()).subscribe(data => {
        this.loading.dismiss();
        console.log("response postData = ", JSON.stringify(data));
        this.showToast(data.msgDesc);
        if (data.state == true) {
          this.navCtrl.pop();
        }
      }, error => {
        this.loading.dismiss();
        this.showToast("Save fail");
        console.log("signin error=" + error.status);
        this.getError(error, "B130");
      });
    }
    console.log("Oops!");
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true,
    });
    toast.present(toast);
  }

  pinChange(pin) {
    if (pin) {
      this.showPinDate = true;
    }
    else {
      this.showPinDate = false;
    }
  }

  typeChange(type) {
    if (type == "Learners") {
      this.selectLarner = true;
    }
    else {
      this.selectLarner = false;
    }
  }

  getRoundTime(time, minutesToRound) {
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    console.log("hours>>" + hours + " and minutes>>" + minutes);
    // Convert hours and minutes to time in minutes
    time = (hours * 60) + minutes;
    console.log("time>>" + time);
    let rounded = Math.round(time / minutesToRound) * minutesToRound;
    let rHr = '' + Math.floor(rounded / 60)
    let rMin = '' + rounded % 60;
    if (rHr.length == 1) {
      rHr = '0' + rHr;
    }

    if (rMin.length == 1) {
      rMin = rMin + '0';
    }

    let result = rHr + ":" + rMin;
    console.log("result>>" + result);
    return result;

  }

  deletePost() {
    this.alertPopup = this.alert.create({
      cssClass: this.font,
      message: 'ပိုစ်ဖျက်ရန်ရန်သေချာပါသလား?',
      buttons: [
        {
          text: "ပယ်ဖျက်ရန်",
          cssClass: 'alertButton',
          role: 'cancel',
          handler: () => {
            this.isAlert = false;
          }
        },
        {
          text: "သေချာပါသည်",
          cssClass: 'alertButton',
          handler: () => {
            this.deleteService();
            this.isAlert = false;
          }
        }
      ]
    })
    this.alertPopup.present();
    this.isAlert = true;
  }

  deleteService() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      //   duration: 3000
    });
    this.loading.present();
    console.log(" userData syskey == " + this.registerData.syskey);
    console.log(" post syskey == " + this.passData.syskey);
    this.isLoading = true;
    var paremeter = {
      t1: this.registerData.t1,
      t3: this.passData.t3,
      syskey: this.passData.syskey,
      userSyskey: this.registerData.syskey,
      sessionKey: this.registerData.sessionKey
    };

    console.log("request postDelete = ", JSON.stringify(paremeter));
    this.http.post(this.funct.ipaddress2 + 'servicecontentmenu/deleteContent', paremeter).map(res => res.json()).subscribe(result => {
      console.log("response postDelete = ", JSON.stringify(result));
      if (result.state) {
        console.log("Delete Successful");
        this.navCtrl.pop();
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Failed post.",
          duration: 5000,
          position: 'bottom',
          //  showCloseButton: true,
          dismissOnPageChange: true,
          // closeButtonText: 'OK's
        });
        toast.present(toast);
      }
      this.isLoading = false;
      this.loading.dismiss();
    }, error => {
      this.isLoading = false;
      console.log("signin error=" + error.status);
      this.getError(error, "B133");
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
      dismissOnPageChange: true,
    });
    toast.present(toast);
    console.log("Oops!");
  }

}


