import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, AlertController, LoadingController, Platform, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { FCM } from '@ionic-native/fcm';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../../providers/changefont/changefont';

import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the UserRegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
  providers: [ChangelanguageProvider]
})
export class UserRegistrationPage {

  isLoading: any;
  uuid: any;
  profileImg: any = "assets/images/user-icon.png";
  gender: any;
  userName: any;
  loading: any;
  params: any;
  phone: any;
  latitude: any;
  longitude: any;
  location: any;
  stateData: any;
  districtData: any;
  townshipData: any;
  villageData: any;
  state: any;
  district: any;
  township: any;
  village: any;
  stateNameeng: any;
  stateNamemyan: any;
  tspNameeng: any;
  tspNamemyan: any;
  code: any = [];
  textData: any = [];
  font: any;
  requiredUsername: any;
  requiredPhone: any;
  requiredPassword: any;
  requiredConpassword: any;
  requiredState: any;
  requiredTownship: any;
  requiredGender: any;
  image: any;
  password: any;
  conpassword: any;
  requiredEqupassword: any;
  textFont: any;
  alertPopup: any;
  textmyan: any = ["ကိုယ်ရေးအချက်အလက်", "အမည်", "ဖုန်းနံပါတ်", "တိုင်းဒေသကြီး", "မြို့နယ်", "ရွာ", "ကျား / မ", "သိမ်းမည်", "အမည်လိုအပ်ပါသည်", "ဖုန်းနံပါတ်လိုအပ်ပါသည်",
    "တိုင်းဒေသကြီးလိုအပ်ပါသည်", "မြို့နယ်လိုအပ်ပါသည်", "ကျား, မလိုအပ်ပါသည်", "လျို့ဝှက်နံပါတ်", "အတည်ပြု လျို့ဝှက်နံပါတ်", "လျို့ဝှက်နံပါတ် လိုအပ်ပါသည်။", "အတည်ပြု လျို့ဝှက်နံပါတ် လိုအပ်ပါသည်။", "လျို့ဝှက်နံပါတ် တူညီမှုရှိရပါမည်။"];

  testRadiouni: boolean = true;
  testRadiozg: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public storage: Storage, private _zone: NgZone,
    public http: Http,
    public funct: FunctProvider,
    public toastCtrl: ToastController,
    public events: Events, public changefont: ChangefontProvider,
    public changeLanguage: ChangelanguageProvider,
    private transfer: Transfer, private file: File,
    public device: Device, public alert: AlertController,
    public fcm: FCM) {
    //this.getLocation();
    this.funct.getState().then((data) => {
      this.stateData = data.data;
      console.log("dtatedata language=" + JSON.stringify(this.stateData));
    });
    this.phone = navParams.get('data');
    console.log("phone =" + this.phone);

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
      if (result == '' || result == undefined || result == null) {
        this.textFont = 'uni';
      }
      else {
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
      }
    });

    this.events.subscribe('textboxlan', data => {
      this.textFont = data;
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
  }

  ionViewDidEnter() {
    this.backButtonExit();
  }

  changelanfont() {
    this.alertPopup = this.alert.create();
    this.alertPopup.setSubTitle('ဖောင့်အမျိုးအစား');
    this.alertPopup.setCssClass(this.font);

    this.alertPopup.addInput({
      type: 'radio',
      label: 'မြန်မာ',
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

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  saveUserRegister() {
    this.isLoading = true;
    let fcmToken;
    this.fcm.getToken().then(token => {
      console.log("getToken=" + token);

      if (token != null) {
        fcmToken = token;
      }
      else
        fcmToken = '';

      let params = {
        t1: this.phone,                                // phone Number
        // t2: this.userName,                           // UserName
        t2: this.password,                             // password
        t3: '',                                        // email
        t4: this.funct.appID,                          // appID
        t19: 'phone',                                   //type
        person: {
          t2: this.userName,                           // UserName
          t5: this.device.uuid,                        // deviceID
          t6: this.stateNameeng,                       // state Name (Eng)
          t7: this.stateNamemyan,                      // state Name (Myan)
          t8: this.tspNameeng,                         // township Name (Eng)
          t9: this.tspNamemyan,                        // township Name (Myan)
          // t10: this.password,                        // password
          t11: this.gender,                            // gender
          t12: this.state,                             // state (code)
          t13: this.township,                          // township (code)
          t14: fcmToken,                               // fcm token
          t15: this.funct.appName,                      // appName
          t16: this.profileImg.split("/").pop(),        // User Image
          t17: this.funct.appType,                      // appType
          t18: this.funct.version,                       // version 
        }
      };
      console.log("request register=" + JSON.stringify(params));
      this.http.post(this.funct.ipaddress2 + 'serviceregisterIO/newregister', params).map(res => res.json()).subscribe(result => {
        console.log("response register =" + JSON.stringify(result));
        if (result.syskey > 0) {
          this.storage.set('b2bregData', result);
          this.events.publish('register', result.t16);
          this._zone.run(() => {
            this.events.publish('register', result.t16);
            this.navCtrl.setRoot(TabsPage);
          });
        }
        else {
          let toast = this.toastCtrl.create({
            message: "Registered fail!",
            duration: 5000,
            position: 'bottom',
            //  showCloseButton: true,
            dismissOnPageChange: true,
            // closeButtonText: 'OK'
          });
          toast.present(toast);
          this.loading.dismiss();
        }
        this.isLoading = false;
      },
        error => {
          console.log("signin error=" + error.status);
          this.getError(error, "B104");
        });
      //}
    },
      error => {
        console.log("registeration token error !!!!!!!!");
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
    this.isLoading = false;
    this.loading.dismiss();
    console.log("Oops!");
  }

  getDistrict(code) {
    this.getSateName(code);
    this.funct.getDistrict(code, '').then((data) => {
      this.townshipData = data;
    });
  }

  getSateName(code) {
    for (let i = 0; i < this.stateData.length; i++) {
      if (this.stateData[i].code == code) {
        this.stateNameeng = this.stateData[i].engCaption;
        this.stateNamemyan = this.stateData[i].myanCaption;
        break;
      }
    }
  }

  getTspName(code) {
    for (let i = 0; i < this.townshipData.length; i++) {
      console.log(this.townshipData[i].code + "/" + code);
      if (this.townshipData[i].code == code) {
        this.tspNameeng = this.townshipData[i].engCaption;
        this.tspNamemyan = this.townshipData[i].myanCaption;
        break;
      }
    }
  }

  /*getTownship(code){
    this.http.get(this.funct.ipaddress2 + 'serviceMessage/getTownshiplist?divcode='+code).map(res => res.json()).subscribe(result => {
      console.log("response township =" + JSON.stringify(result));

      for(let i=0;i<result.data.length;i++){
        this.townshipData.push(result.data[i]);
      }

      console.log("length =="+this.townshipData.length);
      console.log("townshipData =="+JSON.stringify(this.townshipData));

    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error);
    });
  }

  getVillage(code){
    this.getTspName(code);
    this.http.get(this.funct.ipaddress2 + 'serviceMessage/getVillagelist?divcode='+code).map(res => res.json()).subscribe(result => {
      console.log("response village =" + JSON.stringify(result));
      this.villageData = result.data;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error);
    });
  }*/

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
          role: 'cancel', // will always sort to be on the bottom
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
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true,
      });
      this.loading.present();
      this.profileImg = imageData; // android
      this.updateUserImage(imageData);

      // ios

      /*let currentName ='';
       let correctPath ='';
       if(imageData.indexOf('file:///')>-1){
         if(imageData.indexOf('?')>-1){
          currentName = imageData.substring(imageData.lastIndexOf('/') + 1,imageData.lastIndexOf('?'));
          correctPath = imageData.substring(0, imageData.lastIndexOf('/') + 1,imageData.lastIndexOf('?'));
          }
          else{
          currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
          correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
          }
       }
       else{
          if(imageData.indexOf('?')>-1){
            currentName = imageData.substring(imageData.lastIndexOf('/') + 1,imageData.lastIndexOf('?'));
            correctPath = 'file:///'+imageData.substring(0, imageData.lastIndexOf('/') + 1,imageData.lastIndexOf('?'));
            }
            else{
            currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
            correctPath = 'file:///'+imageData.substr(0, imageData.lastIndexOf('/') + 1);
            }
       }

       console.log("currentName == "+currentName);
       console.log("currentPath == "+correctPath);
       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());*/

      this.loading.dismiss();
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
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true,
      });
      this.loading.present();
      this.profileImg = imageData; // android
      this.updateUserImage(imageData);

      this.loading.dismiss();
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
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log("namePaht == " + namePath + "   //// currentNmae == " + currentName + "   ////  newFileName == " + newFileName);
    console.log("this.file.datadirectory == " + this.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      // this.photos[0] = newFileName;
      this.profileImg = this.pathForImage(newFileName);
      console.log("photos=" + JSON.stringify(this.profileImg));
      //this.saveProfile()
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

  textValidation() {
    this.requiredPhone = false;
    this.requiredUsername = false;
    this.requiredState = false;
    this.requiredTownship = false;
    this.requiredGender = false;
    this.requiredPassword = false;
    this.requiredConpassword = false;
    this.requiredEqupassword = false;

    if (this.userName == '' || this.userName == undefined) {
      this.requiredUsername = true;
    }
    if (this.phone == '' || this.phone == undefined) {
      this.requiredPhone = true;
    }
    if (this.state == '' || this.state == undefined) {
      this.requiredState = true;
    }
    if (this.township == '' || this.township == undefined) {
      this.requiredTownship = true;
    }
    if (this.gender == '' || this.gender == undefined) {
      this.requiredGender = true;
    }
    if (this.password == '' || this.password == undefined) {
      this.requiredPassword = true;
    }
    if (this.conpassword == '' || this.conpassword == undefined) {
      this.requiredConpassword = true;
    }
    else {
      if (this.conpassword != this.password) {
        this.requiredEqupassword = true;
      }
    }
  }

  uploadProfilePhoto() {
    this.textValidation();
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
      //   duration: 3000
    });
    this.loading.present();       //this.requiredState == false && this.requiredTownship == false &&
    if (this.requiredUsername == false && this.requiredPhone == false && this.requiredGender == false
      && this.requiredConpassword == false && this.requiredPassword == false && this.requiredEqupassword == false) {
      console.log("profileImg ==" + this.profileImg);
      console.log(" pp == " + this.profileImg.split("/").pop());
      if (this.profileImg.split("/").pop() != "user-icon.png") {

        //var type = '';
        //var url = this.funct.imglink + 'module001/file/mobileupload?type=' + type;

        var type = 0;
        var url = this.funct.imglink + 'module001/file/mobileuploadnewversion?type=' + type;    //live apk

        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: this.profileImg.split("/").pop(),
          chunkedMode: false,
        }
        const fileTransfer: TransferObject = this.transfer.create();
        fileTransfer.upload(this.profileImg, url, options)
          .then((data) => {

            console.log("data==" + JSON.stringify(data));
            console.log("Image Upload Success");
            this.saveUserRegister();
          },
            error => {
              console.log("signin error img=" + JSON.stringify(error));
              this.loading.dismiss();
              this.getError(error, "B000");
            });
      }
      else {
        this.saveUserRegister();
      }

    } else {
      console.log("some fields are empty!!");
      this.loading.dismiss();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegistrationPage');
  }

}
