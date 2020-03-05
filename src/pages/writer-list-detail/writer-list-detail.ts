import { Component } from '@angular/core';
import { NavController, NavParams , ToastController , Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { WriterPostListPage } from '../writer-post-list/writer-post-list';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';

/**
 * Generated class for the WriterListDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var window;
@Component({
  selector: 'page-writer-list-detail',
  templateUrl: 'writer-list-detail.html',
  providers: [ChangelanguageProvider]
})
export class WriterListDetailPage {

  textMyan: any = ["ဆက်သွယ်ရန်အချက်အလက်များ","အီးမေးလ်","ဖုန်းနံပါတ်","လိပ်စာ"];
  textEng: any = ["Contact Information","Email","Phone","Address"];
  textData: any = [];
  font: string = '';
  passData:any ;
  imageLink : any;
  isAlert : any = false;
  alertPopup : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage,
              public changeLanguage : ChangelanguageProvider,public toastCtrl: ToastController,public alert: AlertController,
              public platform:Platform, public funct:FunctProvider,public datepipe: DatePipe) {

    this.passData = this.navParams.get("viewData");

    if(this.passData != undefined && this.passData !='' && this.passData != null){
      if(this.passData.t11 == 1){
        this.passData.gender = 'Male';
      }
      else{
        this.passData.gender = 'Female';
      }

      if(this.passData.t7 !='' && this.passData.t7 != null && this.passData.t7 != undefined){
        this.passData.dob = this.datepipe.transform(this.passData.t7,'dd-MMM-yyyy');
      }
    }
    console.log("passData == "+JSON.stringify(this.passData));
    this.imageLink = this.funct.imglink+"upload/image/WriterImage";
    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font,this.textEng,this.textMyan).then((data) => {
        this.textData = data;
        if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language="+JSON.stringify(data));
      });
    });
  }

  ionViewDidEnter(){
      this.platform.registerBackButtonAction(() => {
        console.log("Active Page=" + this.navCtrl.getActive().name);
        if(this.isAlert){
          this.alertPopup.dismiss();
          this.isAlert = false;
        }
        else
          this.navCtrl.pop();
      });
  }

  phoneCall(passedNumber){
    if(passedNumber !='' && passedNumber !=null ){
      passedNumber = encodeURIComponent(passedNumber);
      console.log("call number>>"+passedNumber);
      window.location = "tel:"+passedNumber;
    }
    else{
      this.alertPopup = this.alert.create({
        cssClass:this.font,
        message:'ဆက်သွယ်ရန်ဖုန်းနံပါတ်မရှိပါ။',
        buttons: [ {
          text: "OK",
          cssClass: 'alertButton',
          role: 'cancel',
          handler: () => {
            this.isAlert = false;
          }
        }]
      })
      this.alertPopup.present();
      this.isAlert = true;
    }
  }

  viewProfile(img){
    this.navCtrl.push(ViewPhotoMessagePage,{
      data : this.imageLink + '/'+img,
      contentImg:"singlePhoto"
    });
  }

  showEmail(){
    let toast = this.toastCtrl.create({
      message: this.passData.t3,
      duration: 5000,
      position: 'middle',
      showCloseButton: true,
      dismissOnPageChange: true,
      cssClass: "yourCssClassName",
      closeButtonText: 'OK',
    });
    toast.present(toast);
  }
  
  showPost(){
    console.log("t1>"+this.passData.t1);
    this.navCtrl.push(WriterPostListPage,{
      data : this.passData.t1
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WriterListDetailPage');
  }
}
