import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { FunctProvider } from '../../providers/funct/funct';

/**
 * Generated class for the LikepersonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-likeperson',
  templateUrl: 'likeperson.html',
})
export class LikepersonPage {
  passData:any;
  photoLink:any;
  font : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
                public funct:FunctProvider,public storage:Storage) {
    this.photoLink = this.funct.imglink+"upload/image/userProfile";
    this.passData = this.navParams.get("data");

    console.log("like person pass data == "+JSON.stringify(this.passData));
    
     this.storage.get('language').then((font) => {
      if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LikepersonPage');
  }

}
