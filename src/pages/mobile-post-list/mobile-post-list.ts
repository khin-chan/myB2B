import { Component} from '@angular/core';
import { NavController, NavParams,Platform} from 'ionic-angular';
import { UserPostListPage } from '../user-post-list/user-post-list';
import { UserVideopostListPage } from '../user-videopost-list/user-videopost-list';


@Component({
  selector: 'page-mobile-post-list',
  templateUrl: 'mobile-post-list.html',
})
export class MobilePostListPage {

  constructor( public navCtrl: NavController,public navParams: NavParams,public platform: Platform,) {
  }

  ionViewDidLoad() {
     this.backButton();
  }

  backButton(){
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }
   

  goVideoPostList(){
    this.navCtrl.push(UserVideopostListPage);
  }

  goContentPostlist(){
    this.navCtrl.push(UserPostListPage);
  }

}
