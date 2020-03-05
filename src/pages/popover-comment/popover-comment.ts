import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverCommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popover-comment',
  templateUrl: 'popover-comment.html',
})
export class PopoverCommentPage {
  admin : any = [{name: 'Copy',key:'1'},{name: 'Delete',key:'2'}, {name: 'Cancel',key:'3'}];
  admin1 : any = [{name: 'Copy',key:'1'}, {name: 'Cancel',key:'3'}];
  popoverItemList : any = [];
  passData : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
   this.passData = this.navParams.get('data');
        console.log("this.passData="+this.passData);
        if(this.passData == 0)
          this.popoverItemList = this.admin1;
        else
          this.popoverItemList = this.admin;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverCommentPage');
  }
 getAccess(s){
    this.viewCtrl.dismiss(s);
  }
}
