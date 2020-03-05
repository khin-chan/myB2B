import { Component, ViewChild, NgZone, } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform, AlertController, PopoverController, Content, LoadingController, } from 'ionic-angular';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import moment from 'moment-timezone'

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';

import { SetTextPage } from '../set-text/set-text';

/**
 * Generated class for the PostVideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-post-video',
  templateUrl: 'post-video.html',
  providers: [FunctProvider, ChangelanguageProvider, ChangefontProvider],
})


export class PostVideoPage {
  @ViewChild(Content) content: Content;
  statusArr: any = ["Draft", "Pending"];
  //typeArr: any = ["Video"];
  type: any = ["Video"];
  statusTypeArr: any = ["Browse", "VimeoURL", "YoutubeURL"];
  statusType: any = ["Browse"];
  videoTypeArr: any = ["Premium", "Learners"];
  videoType: any;
  teacherArr: any = [];
  teacherData: any;
  filter: any = false;
  showPinDate: any;
  selectLarner: any;
  selectURL: any;
  browse: any;
  image: any = [];
  imageArr: any = [];
  imageUpload: any = [];
  imageNameArr: any = [];
  tempImageUpload: any = [];
  post: any = [{ type: '', value: '' }];
  videoPost: any = [{ value: '' }];
  tempVideoPost: any = [{ value: '' }];
  //videoPost: any='';
  registerData: any;
  imageLink: any;
  videoImgLink: any;
  textMyan: any = ["Posts", "ဒေတာ မရှိပါ။"];
  textEng: any = ["Post List", "No result found"];
  textData: any = [];
  font: any;
  inputFont: any = '';
  scheduleTime: any;
  scheduleTimes: any;
  passData: any;
  isLoading: any;
  loading: any;
  finalscheduleTime: any;
  tempStartDate: any;
  tempEndDate: any;
  publishDate: any;
  temppublishDate: any;
  pinStartDate: any;
  pinEndDate: any;
  title: any = "";
  pinChecked: any;
  today: any;
  status: any;
  postText: any;
  postText2: any = "";
  notiChecked: any;
  isAlert: any = false;
  alertPopup: any;
  durationTime: any = "";
  fileSize: any = "";
  urlLink: any = "";
  flag: any = false;
  videoArr: any = [];
  videoUpload: any = [];
  videoLink: any;
  latestConvertion: any;
  videoFileSize: any;
  array2: any = [];
  popover: any;
  disableSelector: boolean;
  new: any;
  passStatus: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public toastCtrl: ToastController,
    public platform: Platform, private file: File, public alertCtrl: AlertController, public sqlite: SQLite,
    public popoverCtrl: PopoverController, public datepipe: DatePipe, public funct: FunctProvider, public changeLanguage: ChangelanguageProvider,
    private transfer: Transfer, public storage: Storage, public loadingCtrl: LoadingController, public http: Http,
    public clipboard: Clipboard, public changefont: ChangefontProvider, public events: Events, private zone: NgZone, public alert: AlertController, ) {

    this.disableSelector = true;
    this.imageLink = this.funct.imglink + "upload/smallImage/contentImage/";
    this.videoLink = this.funct.imglink + "upload/video/";
    this.videoImgLink = this.funct.imglink + "upload/smallImage/videoImage/";

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
    
    //this.getScheduleTimes();
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

  changeDateFormat(result) {
    let tmpDate;
    if (result == "invalid date") result = new Date();
    tmpDate = result;
    tmpDate.setDate(tmpDate.getDate());
    return tmpDate.toISOString();
  }

  chooseVideo() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 300,
      targetWidth: 300,
    }
    this.camera.getPicture(options).then((data_uri) => {
      console.log('Video success');
      console.log("data_uri==" + JSON.stringify(data_uri));
      this.readVideoFileSize(data_uri);
    }, (error) => {
      console.error("Unable to open database", error);
    });
  }

  readVideoFileSize(data_uri) {
    console.log("data_uri>>>" + JSON.stringify(data_uri));
    if (!data_uri.includes('file://')) {
      data_uri = 'file://' + data_uri;
      console.log("data_uri link>>> " + JSON.stringify(data_uri));
    }
    return this.file.resolveLocalFilesystemUrl(data_uri)
      .then((entry: FileEntry) => {
        return new Promise((resolve) => {//, reject) => { 
          entry.file((file) => {
            let fileReader = new FileReader();
            fileReader.onloadend = () => {
              let blob = new Blob([fileReader.result], { type: file.type });
              resolve({ blob: blob, file: file });
              console.log("file>>" + JSON.stringify(file));
              this.videoFileSize = file.size / 1000000;
              console.log("fileSize>>" + JSON.stringify(this.videoFileSize));
              this.localStorageVideoFile(data_uri, this.videoFileSize);
            };
            fileReader.readAsArrayBuffer(file);
          });
        })
      })
      .catch((error) => {
        console.error("Unable to open File Size", error);
      });
  }

  localStorageVideoFile(data_uri, videoFileSize) {

    console.log("data_uri..." + JSON.stringify(data_uri));
    console.log("videoFileSize..." + JSON.stringify(videoFileSize));

    let currentName = '';
    let correctPath = '';

    if (data_uri.indexOf('?') > -1) {
      currentName = data_uri.substring(data_uri.lastIndexOf('/') + 1, data_uri.lastIndexOf('?'));
      correctPath = data_uri.substring(0, data_uri.lastIndexOf('/') + 1, data_uri.lastIndexOf('?'));
    }
    else {
      currentName = data_uri.substr(data_uri.lastIndexOf('/') + 1);
      correctPath = data_uri.substr(0, data_uri.lastIndexOf('/') + 1);
    }

    console.log("currentName == " + currentName);
    console.log("currentPath == " + correctPath);
    this.copyFileToLocalDir1(correctPath, currentName, this.createFileName1(), videoFileSize); // this.createImageName()
  }


  private copyFileToLocalDir1(namePath, currentName, newFileName, videoFileSize) {
    console.log("namePaht == " + namePath + "   //// currentNmae == " + currentName + "   ////  newFileName == " + newFileName + "//// videoFileSize ==" + videoFileSize);
    console.log("this.file.applicationDirectory == " + this.file.applicationDirectory);
    console.log("this.file.applicationStorageDirectory == " + this.file.applicationStorageDirectory);
    console.log("this.file.externalApplicationStorageDirectory == " + this.file.externalApplicationStorageDirectory);
    console.log("this.file.datadirectory == " + this.file.dataDirectory);

    this.file.copyFile(namePath, currentName, this.file.externalApplicationStorageDirectory, newFileName).then(success => {
      this.videoPost.push({ value: this.file.externalApplicationStorageDirectory + newFileName, });
      console.log("videoPost>>" + JSON.stringify(this.videoPost));
      this.videoArr = [];
      for (let i = 0; i < this.videoPost.length; i++) {
        if (this.videoPost[i].value != "" && this.videoPost[i].value != '' && this.videoPost[i].value != undefined && this.videoPost[i].value != null) {
          let obj = { value: '' };
          obj.value = this.videoPost[i].value;
          this.videoArr.push(obj);
        }
      }
      console.log("videoArr>>" + JSON.stringify(this.videoArr));
      this.videoFileSize = videoFileSize;
      console.log("tempVideoFileSize == " + JSON.stringify(this.videoFileSize));
      if (this.videoFileSize < 150.00) {
        this.uploadVideo();
      }
      else {
        alert('Choose Associated Video!');
      }
    }, error => {
      alert('Error while storing file.' + JSON.stringify(error));
    });
  }

  private createFileName1() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".mp4";
    return newFileName;
  }

  uploadVideo() {

    this.loading = this.loadingCtrl.create({
      content: "Uploading...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    console.log("videoArr>>" + JSON.stringify(this.videoArr));
    var fileName = this.videoArr[this.videoArr.length - 1]["value"].split("/").pop();
    console.log("fileName1>>" + JSON.stringify(fileName));
    console.log("fileName2>>" + JSON.stringify(this.videoArr[this.videoArr.length - 1]["value"]));
    var type = 10;
    var url = this.funct.imglink + 'module001/file/fileupload?f=upload&fn=' + fileName + '&id=' + this.registerData.syskey + '&type=' + type;
    console.log("url>>" + JSON.stringify(url));
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
    }

    const fileTransfer: TransferObject = this.transfer.create();
    fileTransfer.upload(this.videoArr[this.videoArr.length - 1]["value"], url, options).then((data) => {
      this.loading.dismiss();
      console.log("data response1>>" + JSON.stringify(data));
      if (data.responseCode === 200) {
        let resultResponse = JSON.parse(data.response);
        this.videoUpload[0] = resultResponse.fileName;
        console.log("videoUpload>" + JSON.stringify(this.videoUpload));
      }
      else {
        console.log("Video upload  fail");
      }
    }, (err) => {
      console.log("Error upload=" + JSON.stringify(err));
      this.presentToast('Oops! Something is wrong. Please check connection.');
    });
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
      console.log("imageData..." + JSON.stringify(imageData));
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
        this.post = [{ type: '', value: '' }];
      }
      if (this.post.length != 1 && (this.post[this.post.length - 1]['value'] == '' || this.post[this.post.length - 1]['value'] == null || this.post[this.post.length - 1]['value'] == undefined)) {
        this.post.splice(this.post.length - 1, 1)
      }

      this.post.push({ type: 'img', value: this.file.dataDirectory + newFileName, });
      this.post.push({ type: 'text', value: '' });

      console.log("Select post=" + JSON.stringify(this.post));

      this.imageArr = [];
      for (let i = 1; i < this.post.length; i++) {
        if (this.post[i].type == 'img' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          let obj = { value: '' };
          obj.value = this.post[i].value;
          this.imageArr.push(obj);
        }
      }
      console.log("images array=" + JSON.stringify(this.imageArr));
      this.uploadImage();

    }, error => {
      alert('Error while storing file.' + JSON.stringify(error));
    });
  }

  uploadImage() {
    console.log("imageArr>>" + JSON.stringify(this.imageArr));
    var fileName = this.imageArr[this.imageArr.length - 1]["value"].split("/").pop();
    console.log("fileName>>" + JSON.stringify(fileName));
    console.log("fileName3>>" + JSON.stringify(this.imageArr[this.imageArr.length - 1]["value"]));
    var type = 10;
    var url = this.funct.imglink + 'module001/file/fileupload?f=upload&fn=' + fileName + '&id=' + this.registerData.syskey + '&type=' + type;
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "multipart/form-data",
    }

    const fileTransfer: TransferObject = this.transfer.create();
    fileTransfer.upload(this.imageArr[this.imageArr.length - 1]['value'], url, options).then((data) => {
      console.log("data response>>" + JSON.stringify(data));
      if (data.responseCode === 200) {
        let resultResponse = JSON.parse(data.response);
        console.log("ResultResponse in post-text.ts >> ", resultResponse);
        let w = { name: '' };
        w['name'] = resultResponse.url;
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


  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  savePost1() {
    console.log("savepost");
    if (this.passData != '' && this.passData != null && this.passData != undefined) {
      this.updateVideoPost();
    }
    else {
      this.saveVideoPost();
    }
  }

  saveVideoPost() {
    this.loading = this.loadingCtrl.create({
      content: "Saving...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    console.log("uploadserver");
    console.log("Image Uploaded>>" + JSON.stringify(this.imageUpload));

    this.tempStartDate = this.datepipe.transform(this.pinStartDate, 'yyyyMMdd');
    this.tempEndDate = this.datepipe.transform(this.pinEndDate, 'yyyyMMdd');
    this.temppublishDate = this.datepipe.transform(this.publishDate, 'yyyyMMdd');
    console.log("temppublishDate >> ", this.temppublishDate);
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
    else if (this.statusType == '' || this.statusType == null || this.statusType == undefined) {
      msg = "Choose Status Type!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.urlLink == '' || this.urlLink == null || this.urlLink == undefined) && this.selectURL) {
      msg = "Choose URL Link!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.teacherData == '' || this.teacherData == null || this.teacherData == undefined) && this.selectLarner) {
      msg = "Choose Teacher!";
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
    else if (this.postText == '' || this.postText == null || this.postText == undefined) {
      msg = "Please fill Content!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.imageArr == '' || this.postText == null || this.postText == undefined || this.imageArr.length == 0) {
      msg = "Please fill Image!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if (this.statusType == "Browse" && (this.videoArr == '' || this.videoArr == null || this.videoArr == undefined || this.videoArr.length == 0)) {
      msg = "Please fill Video!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else {
      console.log("Image Array >>> ", JSON.stringify(this.imageArr));
      console.log("post data?????????" + JSON.stringify(this.post));
      let cmsText = '';
      cmsText = cmsText + "<p>" + this.postText + "</p>";
      this.imageArr = [];
      for (let i = 1; i < this.post.length; i++) {
        if (this.post[i].type == 'img') {
          let obj = { value: '' };
          obj.value = this.post[i].value;
          this.imageArr.push(obj);
        }
      }

      for (var i = 0; i < this.post.length; i++) {
        if (this.post[i].type == 'text' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          cmsText = cmsText + "<p>" + this.post[i].value + "</p>";
          console.log("new one text>>>" + cmsText);
        }
        else if (this.post[i].type == 'img' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          cmsText = cmsText + "<p>[#img]</p>";
          console.log("new one img>>>>>>>>" + cmsText);
        }
        else {
          console.log("this is not image and text!");
        }

      }


      console.log("Title>>>>" + JSON.stringify(this.title));
      console.log("Type>>>>" + JSON.stringify(this.type));
      console.log("Duration Time>>>>" + JSON.stringify(this.durationTime));
      console.log("File Size>>>>" + JSON.stringify(this.fileSize));
      console.log("Status>>>>" + JSON.stringify(this.status));
      console.log(" Video Type>>>>" + JSON.stringify(this.videoType));
      console.log("Publish Date>>>>" + JSON.stringify(this.publishDate));
      console.log("ScheduleTime>>>>" + JSON.stringify(this.finalscheduleTime));
      console.log("NotiChecked>>>>" + JSON.stringify(this.notiChecked));
      console.log("PinChecked>>>>" + JSON.stringify(this.pinChecked));
      console.log("PinStartDate>>>>" + JSON.stringify(this.tempStartDate));
      console.log("PinEndDate>>>>" + JSON.stringify(this.tempEndDate));
      console.log("PostText>>>>" + JSON.stringify(this.postText));
      console.log("PostText2>>>>" + JSON.stringify(this.postText2));
      console.log("ImageArray>>>>" + JSON.stringify(this.imageArr));
      console.log("for t2>>" + JSON.stringify(cmsText));
      console.log("for t2>>" + JSON.stringify(this.videoUpload));

      if (!this.pinChecked) {
        this.tempStartDate = '';
        this.tempEndDate = '';
      }

      let t3;
      if (this.type == 'Video') {
        t3 = "Video";
      }

      let t4;
      if (this.videoType == 'Premium') {
        t4 = "premium";
      }
      else if (this.videoType == 'Learners') {
        t4 = "learners";
      }
      else {
        t4 = "";
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

      let n10;
      if (this.selectURL && this.statusType == "VimeoURL") {
        n10 = 1;
      }
      else if (this.selectURL && this.statusType == "YoutubeURL") {
        n10 = 2;
      }
      else {
        n10 = 0;
      }



      let tempImageUpload = [];
      let imageNameArr = [];
      for (var i = 0; i < this.imageUpload.length; i++) {
        var temp = [] = String(this.imageUpload[i].name).split("/");
        imageNameArr[i] = temp[1];
        console.log("ImageUploadArray>>>>>>" + JSON.stringify(imageNameArr));
        let obj = {
          "serial": i + 1,
          "name": temp[1],
          "desc": "",
          "order": "",
          "url": this.imageUpload[i].name,
          "imgdesc": "",
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
        "alertDate": this.temppublishDate,
        "alertTime": this.finalscheduleTime,
        "userId": this.registerData.t1,
        "userName": this.registerData.t2,
        "t1": this.title,
        "t2": cmsText,
        "t3": t3,
        "t4": t4,
        "t5": "",
        "t6": this.fileSize,
        "t7": this.durationTime,
        "t8": this.urlLink,
        "t9": "",
        "t10": "",
        "t11": "",
        "t12": this.tempStartDate,
        "t13": this.tempEndDate,
        "temp": "",
        "n1": 0,
        "n2": 0,
        "n3": 0,
        "n4": 0,
        "n5": this.registerData.syskey,
        "n6": 0,
        "n7": n7,
        "n8": 0,
        "n9": n9,
        "n10": n10,
        "n11": 0,
        "n12": n12,
        "n13": this.teacherData,
        "uploadlist": tempImageUpload,
        "resizelist": imageNameArr,
        "videoUpload": this.videoUpload,
        "serialno": 0,
      }

      console.log("request postData = ", JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceVideo/saveVideo', params).map(res => res.json()).subscribe(data => {
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


  getPostVideoListDetail() {

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

      this.durationTime = this.passData.t7;
      this.fileSize = this.passData.t6;
      this.type = this.passData.t3;

      let temp1 = this.passData.alertDate;
      console.log("tempDate1>" + temp1);
      let year1 = temp1.substring(0, 4);
      let month1 = temp1.substring(4, 6);
      let day1 = temp1.substring(6, 8);
      let tempDate1 = year1 + "/" + month1 + "/" + day1;
      console.log("TempDate1 = ", JSON.stringify(tempDate1));
      this.publishDate = this.datepipe.transform(tempDate1, 'yyyy-MM-dd');
      console.log("TempDate1 >>>>>>", JSON.stringify(this.publishDate));

      console.log("alertTiem>" + this.passData.alertTime);
      let tempschedule = this.passData.alertTime;
      console.log("tempDate1>" + tempschedule);

      let tempscheduletime = tempschedule.substring(0, 2);
      console.log("tempscheduletime>" + tempscheduletime);
      let tempscheduletime1 = tempschedule.substring(2, 4);
      console.log("tempscheduletime1>" + tempscheduletime1);
      this.scheduleTime = tempscheduletime + ":" + tempscheduletime1;
      console.log("scheduleTime>" + this.scheduleTime);

      if (this.passData.t4 == 'premium' || this.passData.t4 == 'Premium') {
        this.videoType = this.videoTypeArr[0];
        this.selectLarner = false;
      }
      else if (this.passData.t4 == 'learners' || this.passData.t4 == 'Learners') {
        this.videoType = this.videoTypeArr[1];
        this.selectLarner = true;
      }
      else {
        this.videoType = "";
      }

      if (this.passData.n7 == 'Publish') {
        this.status = this.passData.n7;
        this.flag = true;
        console.log("Status >>>>>>", JSON.stringify(this.status));
      }
      else {
        this.status = this.passData.n7;
        console.log("Status >>>>>>", JSON.stringify(this.status));
      }

      if (this.passData.n9 == 1) {
        this.notiChecked = true;
      }
      else {
        this.notiChecked = false;
      }

      if (this.passData.n10 == 2) {
        this.statusType = this.statusTypeArr[2];
        this.selectURL = true;
        this.browse = false;
        this.urlLink = this.passData.videoUploadLink;
        console.log("statusType2 >>>>>>", JSON.stringify(this.statusType));
      }
      else if (this.passData.n10 == 1) {
        this.statusType = this.statusTypeArr[1];
        this.selectURL = true;
        this.browse = false;
        this.urlLink = this.passData.videoUploadLink;
        console.log("statusType1 >>>>>>", JSON.stringify(this.statusType));
      }
      else {
        this.statusType = this.statusTypeArr[0];
        this.selectURL = false;
        this.browse = true;
        console.log("statusType0 >>>>>>", JSON.stringify(this.statusType));
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

      this.videoPost = [];
      console.log("this.passData.uploadedPhoto.t2 " + JSON.stringify(this.passData.uploadedPhoto[0].t2));
      this.videoPost.push({ value: this.videoLink + this.passData.uploadedPhoto[0].t2 });
      console.log("passData videoPost>>>>" + JSON.stringify(this.videoPost));

      let temp = this.passData.t2;
      console.log("temp data1 == " + JSON.stringify(temp));
      this.array2 = temp.split("</p><p>");
      console.log("Array Data>>>>" + JSON.stringify(this.array2));

      this.array2[0] = this.array2[0].replace(/<p>/g, "");
      this.array2[this.array2.length - 1] = this.array2[this.array2.length - 1].replace(/<\/p>/g, "");
      console.log("temp data2 == " + JSON.stringify(this.array2));

      if (this.inputFont == "zg") {
        this.postText = this.changefont.UnitoZg(this.array2[0]);
        console.log("this.postText1>>>>" + JSON.stringify(this.postText))
      }
      else {
        this.postText = this.array2[0];
        console.log("this.postText2>>>>" + JSON.stringify(this.postText));
      }

      // this.postText = this.array2[0];

      this.post = [];
      for (var i = 1; i < this.array2.length; i++) {
        if (this.array2[i] == "[#img]") {
          console.log("this.passData.uploadedPhoto[i - 1].t7 == " + JSON.stringify(this.passData.uploadedPhoto[i - 1].t7));
          this.post.push({ type: 'img', value: this.videoImgLink + this.passData.uploadedPhoto[i - 1].t7, });
          console.log("Image Array >>>>>>> " + JSON.stringify(this.post));
        }
        else {
          this.post.push({ type: 'text', value: this.array2[i], });
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

  updateVideoPost() {
    this.loading = this.loadingCtrl.create({
      content: "Saving...",
      dismissOnPageChange: true,
    });
    this.loading.present();
    console.log("updateServer");
    console.log("Image Uploaded>>" + JSON.stringify(this.imageUpload));
    console.log("Video Uploaded>>" + JSON.stringify(this.videoUpload));

    this.temppublishDate = this.datepipe.transform(this.publishDate, 'yyyyMMdd');
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
    else if (this.statusType == '' || this.statusType == null || this.statusType == undefined) {
      msg = "Choose Status Type!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.urlLink == '' || this.urlLink == null || this.urlLink == undefined) && this.selectURL) {
      msg = "Choose URL Link!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else if ((this.teacherData == '' || this.teacherData == null || this.teacherData == undefined) && this.selectLarner) {
      msg = "Choose Teacher!";
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
    else if (this.postText == '' || this.postText == null || this.postText == undefined) {
      msg = "Please fill Content!";
      this.showToast(msg);
      this.loading.dismiss();
    }
    else {
      console.log("Image Array1 >>> ", JSON.stringify(this.imageArr));
      console.log("post data>>>>>>>>>>>>>" + JSON.stringify(this.post));
      let cmsText = '';
      cmsText = cmsText + "<p>" + this.postText + "</p>";
      this.imageArr = [];
      for (let i = 1; i < this.post.length; i++) {
        if (this.post[i].type == 'img') {
          let obj = { value: '' };
          obj.value = this.post[i].value;
          this.imageArr.push(obj);
        }
      }
      console.log("Image Arra2>>> ", JSON.stringify(this.imageArr));
      for (var i = 0; i < this.post.length; i++) {
        if (this.post[i].type == 'text' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          cmsText = cmsText + "<p>" + this.post[i].value + "</p>";
          console.log("new one text>>>" + cmsText);
        }
        else if (this.post[i].type == 'img' && this.post[i].value != '' && this.post[i].value != undefined && this.post[i].value != null) {
          cmsText = cmsText + "<p>[#img]</p>";
          console.log("new one img>>>>>>>>" + cmsText);
        }
        else {
          console.log("this is not image and text!");
        }
      }

      let t3;
      if (this.type == 'Video') {
        t3 = "Video";
      }

      let t4;
      if (this.videoType == 'Premium') {
        t4 = "premium";
      }
      else if (this.videoType == 'Learners') {
        t4 = "learners";
      }
      else {
        t4 = "";
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

      let n9;
      if (this.notiChecked) {
        n9 = 1;
      } else {
        n9 = 0;
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

      let n10;
      if (this.selectURL && this.statusType == "VimeoURL") {
        n10 = 1;
      }
      else if (this.selectURL && this.statusType == "YoutubeURL") {
        n10 = 2;
      }
      else {
        n10 = 0;
      }

      console.log("upphoto>" + JSON.stringify(this.passData.uploadedPhoto));
      if (this.passData.uploadedPhoto != '' && this.passData.uploadedPhoto != null && this.passData.uploadedPhoto != undefined) {
        this.imageNameArr = [];
        this.tempImageUpload = [];
        for (var i = 0; i < this.passData.uploadedPhoto.length; i++) {
          var temp = [] = String(this.passData.uploadedPhoto[i].t7).split("/");
          this.imageNameArr[i] = temp[1];
          console.log("ImageUploadArray1>>>>>>" + JSON.stringify(this.imageNameArr));
          let obj = {
            "serial": i + 1,
            "name": temp[1],
            "desc": "",
            "order": "",
            "url": this.passData.uploadedPhoto[i].t7,
            "imgdesc": "",
          }
          console.log("obj1===" + JSON.stringify(obj));
          this.tempImageUpload.push(obj);
          //this.imageNameArr.push(this.imageNameArr);
          console.log("ImageUploadArray2>>>>>>" + JSON.stringify(this.tempImageUpload));
        }

      }

      let imageNameArray = "";
      for (var i = 0; i < this.imageUpload.length; i++) {
        console.log("ImageUploadArray3>>>>>>" + JSON.stringify(this.imageUpload.length));
        var temp1 = [] = String(this.imageUpload[i].name).split("/");
        this.imageNameArr[i] = temp1[1];
        imageNameArray = this.imageNameArr[i];
        console.log("ImageUploadArray4>>>>>>" + JSON.stringify(imageNameArray));
        console.log("PassData.uploadedPhoto.length>>>" + JSON.stringify(this.passData.uploadedPhoto.length));
        let obj1 = {
          "serial": this.passData.uploadedPhoto.length + 1,
          "name": temp1[1],
          "desc": "",
          "order": "",
          "url": this.imageUpload[i].name,
          "imgdesc": "",
        }
        console.log("obj2>>>>>" + JSON.stringify(obj1));
        //tempImageUpload.push(obj1);

        this.tempImageUpload.push(obj1);
        this.imageNameArr.push(imageNameArray);
        console.log("ImageUploadArray5>>>>>>" + JSON.stringify(this.tempImageUpload));
        console.log("Image name Array>>>>>>" + JSON.stringify(this.imageNameArr));
      }

      console.log("video upload>" + JSON.stringify(this.passData.uploadedPhoto));
      this.videoUpload = [];
      if (this.passData.uploadedPhoto != '' && this.passData.uploadedPhoto != null && this.passData.uploadedPhoto != undefined) {
        this.videoUpload[0] = this.passData.uploadedPhoto[0].t2;
        console.log("videoUpload>" + JSON.stringify(this.videoUpload));
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
        "alertDate": this.temppublishDate,
        "alertTime": this.finalscheduleTime,
        "userId": this.registerData.t1,
        "userName": this.registerData.t2,
        "t1": this.title,
        "t2": cmsText,
        "t3": t3,
        "t4": t4,
        "t5": "",
        "t6": this.fileSize,
        "t7": this.durationTime,
        "t8": this.urlLink,
        "t9": "",
        "t10": "",
        "t11": "",
        "t12": this.tempStartDate,
        "t13": this.tempEndDate,
        "temp": "",
        "n1": 0,
        "n2": 0,
        "n3": 0,
        "n4": 0,
        "n5": this.registerData.syskey,
        "n6": 0,
        "n7": n7,
        "n8": 0,
        "n9": n9,
        "n10": n10,
        "n11": 0,
        "n12": n12,
        "n13": this.teacherData,
        "uploadlist": this.tempImageUpload,
        "resizelist": this.imageNameArr,
        "videoUpload": this.videoUpload,
        "serialno": 0,
      }

      console.log("request post update Data = ", JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceVideo/saveVideo', params).map(res => res.json()).subscribe(data => {
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

  pinChange(pin) {
    if (pin) {
      this.showPinDate = true;
    }
    else {
      this.showPinDate = false;
    }
  }

  videoTypeChange(videoType) {
    if (videoType == "Learners") {
      this.selectLarner = true;
    }
    else {
      this.selectLarner = false;
    }
  }

  statusTypeChange(statusType) {

    if (statusType == "VimeoURL" || statusType == "YoutubeURL") {
      this.selectURL = true;
      this.browse = false;

    }
    else {
      this.selectURL = false;
      this.browse = true;

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
          role: 'cancel',
          handler: () => {
            this.isAlert = false;
          }
        },
        {
          text: "သေချာပါသည်",
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

  ionViewCanEnter() {
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
      console.log("registerData Syskey = " + JSON.stringify(this.registerData.syskey));
      console.log("registerData t1 = " + JSON.stringify(this.registerData.t1));
      console.log("registerData t2 = " + JSON.stringify(this.registerData.t2));
      this.getTeacher();
    });

    this.storage.get('textboxlan')
      .then((result) => {
        console.log("storage >> ", result);
        this.inputFont = result;
        console.log("this.inputFont == " + this.inputFont);
        if (result == '' || result == undefined || result == null) {
          this.inputFont = 'uni';
        }
        else {
          this.inputFont = result;
        }
        this.getPostVideoListDetail();
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostVideoPage');
    this.backButtonExit();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
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
