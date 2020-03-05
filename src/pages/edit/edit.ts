import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, Platform, ToastController, Events, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { File } from '@ionic-native/file';
import { Crop } from '@ionic-native/crop';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';
import { EmailValidator } from '@angular/forms';
import { OtpCodeConfrimPage } from '../otp-code-confrim/otp-code-confrim';

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
  providers: [ChangelanguageProvider]
})
export class EditPage {
  profileImg: any;
  loading: any;
  isLoading: any;
  stateData: any;
  districtData: any;
  townshipData: any;
  villageData: any;
  state: any;
  district: any;
  township: any;
  village: any;
  divCode: any = [];
  code: any = [];
  town: any = [];
  status: boolean = false;
  registerData: any = [];
  divCount: any;
  photoName: any;
  textData: any = [];
  font: any;
  fontt3: any;
  imglnk: any;
  writerImglnk: any;
  profile: any;
  changeData: boolean = false;
  requiredProfile: any;
  requiredUsername: any;
  requiredPhone: any;
  requiredEmail: any;
  requiredState: any;
  requiredTownship: any;
  requiredGender: any;
  image: any;
  isAlert: any = false;
  alertPopup: any;
  textFont: any = '';
  testRadiouni: boolean = false;
  testRadiozg: boolean = false;
  tempFont: any = '';
  resultResponse: any = '';
  isemail: boolean = false;
  isphone: boolean = false;
  phonenum: any;
  userData: any;
  requestOTP: any = true;

  textmyan: any = ["ကိုယ်ရေးအချက်အလက်", "အမည်", "ဖုန်းနံပါတ်", "တိုင်းဒေသကြီး", "မြို့နယ်", "ရွာ", "ကျား / မ", "ပြင်ဆင်မည်", "အမည်လိုအပ်ပါသည်", "ဖုန်းနံပါတ်လိုအပ်ပါသည်",
    "တိုင်းဒေသကြီးလိုအပ်ပါသည်", "မြို့နယ်လိုအပ်ပါသည်", "ကျား, မလိုအပ်ပါသည်", "အီးမေး", "အီးမေးလိုအပ်ပါသည်"]
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera, public changefont: ChangefontProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform, public funct: FunctProvider,
    public http: Http, public storage: Storage, private _zone: NgZone,
    public events: Events, public alert: AlertController,
    public changeLanguage: ChangelanguageProvider,
    private transfer: Transfer, private file: File,
    private fb: Facebook,
    public cropService: Crop) {

    this.loading = true;
    this.imglnk = this.funct.imglink + "upload/image/userProfile";
    this.writerImglnk = this.funct.imglink + "upload/image/WriterImage";

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textmyan, this.textmyan).then((data) => {
        this.textData = data;
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language=" + JSON.stringify(data));
      });

    });

    this.storage.get('textboxlan').then((result) => {
      console.log('Your language is', result);
      this.textFont = result;
      if (this.textFont == 'zg') {
        this.textData[1] = this.changefont.UnitoZg(this.textmyan[1]);
        this.testRadiozg = true;
        this.testRadiouni = false;
      }
      else {
        this.textData[1] = this.textmyan[1];
        this.testRadiouni = true;
        this.testRadiozg = false;
      }
    });

    this.events.subscribe('textboxlan', data => {
      this.textFont = data;
      if (this.textFont == 'zg') {
        this.textData[1] = this.changefont.UnitoZg(this.textmyan[1]);
        this.registerData.t2 = this.changefont.UnitoZg(this.tempFont);
        this.testRadiozg = true;
        this.testRadiouni = false;
      }
      else {
        this.textData[1] = this.textmyan[1];
        this.registerData.t2 = this.tempFont;
        this.testRadiouni = true;
        this.testRadiozg = false;
      }
    });

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      if (this.registerData.t1 == '' || this.registerData.t1 == undefined || this.registerData.t1 == null || this.registerData.t1 == ' ') {
        this.isphone = false;
      }
      else{
        this.isphone = true;
      }
      if (this.registerData.t3 == '' || this.registerData.t3 == undefined || this.registerData.t3 == null || this.registerData.t3 == ' ') {
        this.isemail = false;
      }
      else{
        this.isemail = true;
      }
      console.log("registerData= " + JSON.stringify(this.registerData));
      this.tempFont = this.registerData.t2;
      if (this.registerData.t16 == 'Unknown.png' || this.registerData.t16 == 'user-icon.png') {
        this.profile = "assets/images/user-icon.png";
        this.loading = false;
      }
      else {
        if (this.registerData.n2 == 1) {
          this.profile = this.imglnk + "/" + this.registerData.t16;
          this.loading = false;
        }
        else {
          this.profile = this.writerImglnk + "/" + this.registerData.t16;
          this.loading = false;
        }

      }

      this.funct.getState().then((data) => {
        this.stateData = data.data;
        this.getDistrict(this.registerData.t12, 'false');
        console.log("dtatedata language=" + JSON.stringify(this.stateData));
      });

      console.log("registerData == " + JSON.stringify(this.registerData));

      if (this.textFont == 'zg') {
        //this.registerData.t2 = this.changefont.UnitoZg(this.registerData.t2);
        this.changeLanguage.changelanguageText(this.textFont, this.registerData.t2).then((res) => {
          this.registerData.t2 = res;
        });
      }
    });
  }

  ionViewDidEnter() {
    this.backButtonExit();
  }

  getDistrict(code, status) {
    this.townshipData = [];
    this.getSateName(code);
    this.funct.getDistrict(code, status).then((data) => {
      this.townshipData = data;
    });
    if (status == 'true') {
      this.registerData.t13 = '';
    }
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      // this.alert.dismiss();
      this.navCtrl.pop();
    });
  }

  imageEdit() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Languages',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take new picture',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.goCamera();
          }
        },
        {
          text: 'Select new from gallery',
          icon: !this.platform.is('ios') ? 'images' : null,
          handler: () => {
            this.goGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  goGallery() {
    console.log('Photo gallery');
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetHeight: 300,
      targetWidth: 300,
      allowEdit: true,
    }

    this.camera.getPicture(options).then((imageData) => {

      this.profile = imageData;
      console.error("goGallery profile", this.profile);
      this.updateUserImage(imageData);
      // If it's base64:
    }, (error) => {
      console.error("Unable to open database", error);
    });
  }

  goCamera() {
    console.log('Camera');
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log('Camera success');
      this.profile = imageData;  // android
      this.updateUserImage(imageData);

    }, (error) => {
      console.error("Unable to open database", error);
    });
  }

  facebookLogin() {
    this.fb.login(['email', 'public_profile']).then((res) => {
      console.log("authResponse" + JSON.stringify(res.authResponse));
      console.log('rta.status>>>> ' + res.status);
      if (res.status == 'connected') {
        console.log('Login Successful!');
        this.fb.api('me?fields=id,name,email,gender,picture.width(720).height(720).as(picture_large)', []).then(profile => {
          console.log("result profile>>>> " + JSON.stringify(profile));
          this.userData = { id: profile['id'], name: profile['name'], email: profile['email'], gender: profile['gender'], picture: profile['picture_large']['data']['url'] };
          console.log('SignInPage this.userData ' + JSON.stringify(this.userData));
          this.registerData.t3 = this.userData.email;
          console.log("Fcebook Login this.registerData.t3 " + JSON.stringify(this.registerData.t3));
          this.registerData.t2 = this.userData.name;
          console.log("Fcebook Login this.registerData.t2 " + JSON.stringify(this.registerData.t2));
          this.requestOTP = false;
          this.imageDownload(this.userData.picture);
        });
      }
      else{
          console.log("Fcebook Login failure: " + JSON.stringify(res.status));
      }
    })
      .catch(e => console.log('Error logging into Facebook', e));;
  }

  imageDownload(picture) {
    
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

   // const fileTransfer: FileTransferObject = this.transfer.create();
   const fileTransfer: TransferObject = this.transfer.create();
    let url = picture;
    console.log('url: ' + url);
    fileTransfer.download(url, this.file.externalRootDirectory + 'Android/data/com.b2bsite.siteb2b/cache/b2b.jpg', true).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.presentToast("Facebook Profile Downloaded Completed!");
      this.loading.dismiss();
      this.profile = entry.toURL();
      console.log("this.profile ==" + this.profile);
      this.updateUserImage(this.profile);
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
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    this.changeData = true;
  }

  saveChange() {
    this.changeData = true;
    console.log("this.changeData == " + this.changeData);
  }

  onChange(s, i) {
    if (i == "09") {
      this.registerData.t1 = "+959";
    }
    else if (i == "959") {
      this.registerData.t1 = "+959";
    }
  }


  Onpopup() {
    console.error("open opoup");
  }

  /*  ionViewCanLeave() {
     //let pro = this.profile.split("/").pop();
     if (this.changeData == true) {
       this.alertPopup = this.alert.create({
         cssClass: this.font,
         title: '',
         message: 'ကိုယ်ရေးအချက်အလက်များကို',
         buttons: [
           {
             text: "ပယ်ဖျက်ရန်",
             cssClass: 'alertButton',
             //role: 'cancel'
             handler: () => {
               this.changeData = false;
               this.navCtrl.pop();
             }
           },
           {
             text: "သိမ်းမည်",
             cssClass: 'alertButton',
             handler: () => {
               this.uploadProfilePhoto();
             }
           }]
       })
       this.alertPopup.present();
       let doDismiss = () => this.alertPopup.dismiss();
       let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
       this.alertPopup.onDidDismiss(unregBackButton);
       return false;
     }
     else {
       return true;
     }
 
     //console.log("this is edit page leave !!!!!!!");
   } */

  textValidation() {
    console.log("this.registerData textValidation == " + JSON.stringify(this.registerData));
    this.requiredPhone = false;
    this.requiredUsername = false;
    this.requiredState = false;
    this.requiredTownship = false;
    this.requiredGender = false;
    this.requiredEmail = false;
    let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.registerData.t2 == '' || this.registerData.t2 == undefined) {
      this.requiredUsername = true;
    }
    else if (this.registerData.t11 == '' || this.registerData.t11 == undefined) {
      this.requiredGender = true;
    }
    else if (!this.isphone || !this.isemail) {
      if (this.isphone && this.registerData.t3 != '' && this.registerData.t3 != null && this.registerData.t3 != undefined) {
        //check phone
        if (email.test(this.registerData.t3)) {
          this.requiredEmail = false;
          if(this.requestOTP){
            this.emailOTP(this.registerData.t3);
          }
         else{
          this.editProfile();
         }
        }
        else {
          this.presentToast("Your Email is Invalid!");
          this.requiredEmail = true;
        }
      }
      else if (this.isemail && this.registerData.t1 != '' && this.registerData.t1 != null && this.registerData.t1 != undefined) {
        //check emaili
        this.checkPhoneNo();
        //this.goSMSPoh(this.registerData.t1);
      }
      else{
        this.editProfile();
      }
    }
    else {
      this.editProfile();
    }
    /*     else if (this.registerData.t12 == '' || this.registerData.t12 == undefined) {
          this.requiredState = true;
        }
        else if (this.registerData.t13 == '' || this.registerData.t13 == undefined) {
          this.requiredTownship = true;
        } */
  }

  checkPhoneNo() {
    let flag = false;
    let num = /^[0-9-\+]*$/;
    if (num.test(this.registerData.t1)) {
      if (this.registerData.t1.indexOf("+") == 0 && (this.registerData.t1.length == "12" || this.registerData.t1.length == "13" || this.registerData.t1.length == "11")) {
        this.phonenum = this.registerData.t1;
        flag = true;
      }
      else if (this.registerData.t1.indexOf("7") == 0 && this.registerData.t1.length == "9") {
        this.registerData.t1 = '+959' + this.registerData.t1;
        this.phonenum = this.registerData.t1;
        flag = true;
      }

      else if (this.registerData.t1.indexOf("9") == 0 && this.registerData.t1.length == "9") {
        this.registerData.t1 = '+959' + this.registerData.t1;
        this.phonenum = this.registerData.t1;
        flag = true;
      }
      else if (this.registerData.t1.indexOf("+") != 0 && this.registerData.t1.indexOf("7") != 0 && this.registerData.t1.indexOf("9") != 0 && (this.registerData.t1.length == "8" || this.registerData.t1.length == "9" || this.registerData.t1.length == "7")) {
        this.registerData.t1 = '+959' + this.registerData.t1;
        this.phonenum = this.registerData.t1;
        flag = true;
      }
      else if (this.registerData.t1.indexOf("09") == 0 && (this.registerData.t1.length == 10 || this.registerData.t1.length == 11 || this.registerData.t1.length == 9)) {
        this.registerData.t1 = '+959' + this.registerData.t1.substring(2);
        this.phonenum = this.registerData.t1;
        flag = true;
      }
      else if (this.registerData.t1.indexOf("959") == 0 && (this.registerData.t1.length == 11 || this.registerData.t1.length == 12 || this.registerData.t1.length == 10)) {
        this.registerData.t1 = '+959' + this.registerData.t1.substring(3);
        this.phonenum = this.registerData.t1;
        flag = true;
      }
      else {
        flag = false;
        let msg = '';
        if (this.platform.is('ios')) {
          msg = 'Invalid';
        }
        else if (this.platform.is('android')) {
          msg = "Invalid Phone number.";
        }
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
      }
    }
    else {
      flag = true;
      this.phonenum = this.registerData.t1;
    }
    if (flag) {
      this.goSMSPoh(this.phonenum);
    }
  }

  editProfile(){
    //save prfile
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
    console.log("this profile == " + this.profile);    //&&  this.requiredState == false && this.requiredTownship == false
    if (this.profile != '' || this.profile != undefined) {
      this.photoName = this.profile.split("/").pop();
      var type;
      // type = '';
      //var url = this.funct.imglink + 'module001/file/mobileupload?type=' + type;

      if (this.registerData.n2 == 1) {       // Live apk
        type = 0;
      }
      else {
        type = 9;
      }

      var url = this.funct.imglink + 'module001/file/mobileuploadnewversion?type=' + type;    //Live apk

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.photoName,
        chunkedMode: false,
      }

      console.log("profileImg ==" + this.profile);
      console.log("photoName ==" + this.photoName);
      console.log("profile == " + this.profile);
      if (this.photoName == this.registerData.t16) {
        this.saveProfile();
      }
      else {
        const fileTransfer: TransferObject = this.transfer.create();
        fileTransfer.upload(this.profile, url, options).then((data) => {
            console.log("data==" + JSON.stringify(data));
            console.log("Image Upload Success");
            this.saveProfile();
          },
            error => {
              console.log("signin error img=" + JSON.stringify(error));
              this.loading.dismiss();
              this.getError(error, "B000");
            });
      }
    }
  }

  goSMSPoh(phone) {

    console.log('SMSpoh phone>>' + JSON.stringify(phone));

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

    let param = {
      phone: phone,
      text: "as your verification code for B2B Myanmar",
      appname: this.funct.appName,
      domain: this.funct.domain
    }
    console.log('request sendmsg>>' + JSON.stringify(param));
    this.http.post(this.funct.ipaddress2 + 'serviceOTP/sendmsg', param).map(res => res.json()).subscribe(result => {
      console.log("response sendmsg>>" + JSON.stringify(result));
      if (result.state && result.response_status) {
        console.log('OTP sent successfully');       //atda
        this.navCtrl.push(OtpCodeConfrimPage, { phoneNo: phone, pageStatus: 2, type: 'phone', profile: this.profile, gender: this.registerData.t11 });
        this.loading.dismiss();
      }
      else {
        let toast = this.toastCtrl.create({
          message: "Sent OTP fail!",
          duration: 3000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
      }
    },
      error => {
        console.log("error sendmsg=" + error.status);
        this.loading.dismiss();
      });
  }

  emailOTP(email) {

    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
    });
    this.loading.present();

    console.log('apx Email>>' + JSON.stringify(email));
    let params =
    {
      "phone": email,
      "text": "as your verification code for B2B Myanmar",
      "appname": "B2B Myanmar",
      "domain": this.funct.domain,
      "otpcode": ""
    }
    console.log("request param sentOTP>>", JSON.stringify(params));
    this.http.post("http://connect.nirvasoft.com/apx/module001/serviceOTP/sentOTPEmail", params).map(res => res.json()).subscribe(data => {
      console.log("response sentOTP data>>" + JSON.stringify(data));
      if (data.state) {
        console.log('Email OTP sent successfully');       //atda
        this.navCtrl.push(OtpCodeConfrimPage, { email: email, type: 'email', profile: this.profile, gender: this.registerData.t11 });
        this.loading.dismiss();
      } else {
        let toast = this.toastCtrl.create({
          message: "Sent OTP fail!",
          duration: 3000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.loading.dismiss();
      }
    },
      error => {
        console.log("error sendmsg=" + error.status);
        this.loading.dismiss();
      });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });
    toast.present();
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {

    console.log("namePaht == " + namePath + "   //// currentNmae == " + currentName + "   ////  newFileName == " + newFileName);
    console.log("this.file.datadirectory == " + this.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.profile = this.pathForImage(newFileName);
      console.log("photos=" + JSON.stringify(this.profile));
    }, error => {
      alert('Error while storing file.' + JSON.stringify(error));
    });
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  uploadProfilePhoto() {
    this.textValidation();
  }

  getSateName(code) {
    for (let i = 0; i < this.stateData.length; i++) {
      if (this.stateData[i].code == code) {
        this.registerData.t6 = this.stateData[i].engCaption;
        this.registerData.t7 = this.stateData[i].myanCaption;
        break;
      }
    }
  }

  getTspName(code) {
    for (let i = 0; i < this.townshipData.length; i++) {
      console.log(this.townshipData[i].code + "/" + code);
      if (this.townshipData[i].code == code) {
        this.registerData.t8 = this.townshipData[i].engCaption;
        this.registerData.t9 = this.townshipData[i].myanCaption;
        break;
      }
    }
  }

  saveProfile() {

    //this.textValidation();
    this.registerData.t16 = this.profile.split("/").pop();
    let params = {
      person: {
        syskey: this.registerData.syskey,
        t1: this.registerData.t1,               // phone Number
        t2: this.registerData.t2,            // UserName
        t3: this.registerData.t3,                  // email
        t4: this.funct.appID,     // appID
        t5: this.registerData.t5,      // deviceID
        t6: this.registerData.t6,        // state Name (Eng)
        t7: this.registerData.t7,                   // state Name (Myan)
        t8: this.registerData.t8,                   // township Name (Eng)
        t9: this.registerData.t9,                   // township Name (Myan)
        t10: this.registerData.t10,                  // password
        t11: this.registerData.t11,                  // gender
        t12: this.registerData.t12,                  // state (code)
        t13: this.registerData.t13,                  // township (code)
        t14: this.registerData.t14,                      // fcm token
        t15: this.funct.appName,                // appName
        t16: this.registerData.t16,        // User Image
        t17: this.registerData.t17,  // appType
        t18: this.funct.version,  // version 
        t19: 'phone',             // type
        n2: this.registerData.n2, //user or content writer 
      },
      sessionKey: this.registerData.sessionKey
    }

    console.log("request updateProfileforupdate = ", JSON.stringify(params));
    this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/updateProfile', params).map(res => res.json()).subscribe(data => {
      console.log("response updateProfileforupdate = ", JSON.stringify(data));
      if (data.syskey > 0) {
        if (this.registerData.n2 == 1) {
          this.profile = this.imglnk + "/" + data.t16;
          console.log("this.profile mobile user = ", JSON.stringify(this.profile));
        }
        else {
          this.profile = this.writerImglnk + "/" + data.t16;
          console.log("this.profile writer = ", JSON.stringify(this.profile));
        }
        this.storage.get('b2bregData').then((result) => {
          if (result == null || result == '') {
            this.storage.set('b2bregData', data);
            this.events.publish('register', data.t16);
          }
          else {
            this.storage.remove('b2bregData');
            this.storage.set('b2bregData', data);
            this.events.publish('register', data.t16);
          }
        });
        let toast = this.toastCtrl.create({
          message: "Updated successfully.",
          duration: 5000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.changeData = false;
        this.loading.dismiss();
        this.navCtrl.pop();
      }
      else {
        let toast = this.toastCtrl.create({
          message: data.msgcode,
          duration: 10000,
          position: 'bottom',
          dismissOnPageChange: true,
        });
        toast.present(toast);
        this.changeData = false;
        this.loading.dismiss();
      }
    }, error => {
      this.loading.dismiss();
      console.log("signin error=" + error.status);
      this.getError(error, "B130");
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
      }
    });
    this.alertPopup.present();
    let doDismiss = () => this.alertPopup.dismiss();
    let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    this.alertPopup.onDidDismiss(unregBackButton);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
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
}
