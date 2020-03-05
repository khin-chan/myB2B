import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-set-text',
  templateUrl: 'set-text.html',
})
export class SetTextPage {

  imgName : any;
  editPhotos : any = [{ name: 'Delete', key: 1 },{ name: 'Cancel', key: 2 }];
  popoverItemList : any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.imgName = this.navParams.get("post");
    console.log("Image Name to Edit in edit-photo.ts  >> ",this.imgName);
     if(this.imgName)
     this.popoverItemList=this.editPhotos; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetTextPage');
  }

  /* ionViewCanEnter(){
     this.imgName = this.navParams.get("photos");
     console.log("Image Name to Edit in edit-photo.ts  >> ",this.imgName);
  } */

  getAccess(s){
    this.viewCtrl.dismiss(s);
  }
}
