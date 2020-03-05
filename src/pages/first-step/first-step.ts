import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { RegistrationPage } from '../registration/registration';
/**
 * Generated class for the FirstStepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-first-step',
  templateUrl: 'first-step.html',
  providers: [ChangelanguageProvider]
})
export class FirstStepPage {

  textMyan : any = ["စတင်ရန် အဆင်သင့်ဖြစ်ပါပြီလား?","ဆက်လက်လုပ်ဆောင်ရန်"];
  textEng : any = ["Ready to Start?","Continue"];
  textData : any = [];
  font:any;

  slides = [
    {
      title: "သတင်းနှင့် ဗဟုသုတအဖြာဖြာ",
      description: "<b>နောက်ဆုံးရ စီးပွားရေးဆိုင်ရာသတင်းတွေ၊ ဗဟုသုတရမယ့် ပင်ကိုယ်ရေးအတွေးအမြင်ဆောင်းပါးများ",
      image: "assets/images/newspaper.png",
    },
    {
      title: "စီးပွားရေးဆိုင်ရာ အင်တာဗျူးဗီဒီယိုများ",
      description: "<b>အောင်မြင်နေတဲ့ စီးပွားရေးလုပ်ငန်းရှင်တွေနဲ့ တွေ့ဆုံခြင်း၊ နယ်ပယ်ကဏ္ဍအလိုက် ကျွမ်းကျင်သူတွေရဲ့စကားဝိုင်း ဗီဒီယို များ",
      image: "assets/images/play-button.png",
    },
    {
      title: "စိတ်ဝင်စားဖွယ် ဆောင်းပါးများ",
      description: "<b>ခေါင်းဆောင်မှုနှင့် စီမံခန့်ခွဲမှုဆိုင်ရာဆောင်းပါးများ၊ စီးပွားရေးဆိုင်ရာ Special Reports ၊ Q&A ကဏ္ဍ၊ Snap Shot အင်တာဗျူးများ",
      image: "assets/images/open-magazine.png",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,public platform:Platform,
              public storage:Storage,public changeLanguage : ChangelanguageProvider) {

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
    this.backButtonExit();
  }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.platform.exitApp();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstStepPage');
  }

  OnContinue(){
    this.navCtrl.push(RegistrationPage,{
      status: 1
    })
  }

  skip(){
    this.navCtrl.push(RegistrationPage)
  }
}
