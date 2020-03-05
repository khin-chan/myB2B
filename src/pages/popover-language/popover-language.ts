import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ViewController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FunctProvider } from '../../providers/funct/funct';
import { ChangefontProvider } from '../../providers/changefont/changefont';
/**
 * Generated class for the PopoverLanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-popover-language',
  templateUrl: 'popover-language.html',
  providers: [ChangefontProvider]
})
export class PopoverLanguagePage {
  headeritem : any ='';
  headeritemEng : any = 'Language';
  headeritemMyn: any = 'ဖောင့်အမျိုးအစား';
  textMyan:any=[{name: 'ယူနီ',key:'uni',check:false}, {name: 'ဇော်ဂျီ',key:'zg',check:false}];
  textEng:any=[ {name: 'Unicode',key:'uni',check:false},{name:'Zawgyi',key:'zg',check:false}];
  font : any ='';
  popoverItemList : any [] = [{name: '',key:'uni',check:false},{name: '',key:'zg',check:false}];
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,
              public changefont:ChangefontProvider,public events:Events,public storage:Storage,
              public platform: Platform) {
    
    this.storage.get('textboxlan').then((font) => {
      console.log('Your language is', font);
      if(font !=null && font !='' ){
        this.changelanguage(font);
      }
      else{
        this.changelanguage('uni');
      }      
    });
    
    this.events.subscribe('textboxlan', data => {
         this.changelanguage(data);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePopOver');
      this.backButtonExit();
  }

  backButtonExit(){
        this.platform.registerBackButtonAction(() => {
          console.log("Active Page=" + this.navCtrl.getActive().name);
          this.navCtrl.pop();
        });
  }

  getLanguage(key){  
  this.storage.get('textboxlan').then((font) => {
      console.log('Your language is', font);
      if(font !=null && font !='' ){
        this.storage.remove('textboxlan');
        this.storage.set('textboxlan', key);
        this.events.publish('textboxlan', key);
        this.font = key;
      }
      else{
        this.storage.set('textboxlan', key);
        this.events.publish('textboxlan', key);
        this.font = key;
      }      
  });    
 }
    
  changelanguage(lan) {
    if (lan == 'uni') {
      this.font = "uni";
      for (let j = 0; j <  this.textMyan.length;j++) {
        this.popoverItemList[j].name = this.textMyan[j].name;
      }
      this.headeritem = this.headeritemMyn;
      this.popoverItemList[0].check = true;
    }
    else if (lan == 'zg') {
      this.font = "zg";
      
      for (let j = 0; j <  this.textMyan.length;j++) {
        this.popoverItemList[j].name = this.changefont.UnitoZg(this.textMyan[j].name);
      }
      this.headeritem = this.changefont.UnitoZg(this.headeritemMyn);
      this.popoverItemList[1].check = true;
    }
    else{
      this.font='';
      for (let j = 0; j <  this.textEng.length;j++) {
        this.popoverItemList[j].name = this.textEng[j].name;
      }
      this.headeritem = this.headeritemEng;
    }
    
    /*this.storage.get('changelan').then((font) => {
      console.log('Your language is', font);
      if(font !=null && font !='' ){
        this.storage.remove('changelan');
        this.storage.set('changelan', font);
      }
      else{
        this.storage.set('changelan', font);
      }      
  });*/     
    
    console.log('Your text is', JSON.stringify(this.popoverItemList));
  }

  changeLanguage(s) {
    this.viewCtrl.dismiss(s);
  }
}
