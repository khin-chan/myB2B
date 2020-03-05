import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { AppMinimize } from '@ionic-native/app-minimize';
import { PostTextPage } from '../post-text/post-text';
import { PostVideoPage } from '../post-video/post-video';


/**
 * Generated class for the MobilePostTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-mobile-post-type',
  templateUrl: 'mobile-post-type.html',
})
export class MobilePostTypePage {

  constructor( public navCtrl: NavController,public navParams: NavParams,public platform: Platform,
              private appMinimize: AppMinimize,) {
  }


  goContentPost(){
    this.navCtrl.push(PostTextPage);
  }

  goVideoPost(){
    this.navCtrl.push(PostVideoPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobilePostTypePage');
   this.backButton();
  }

  backButton(){
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
}
