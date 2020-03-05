import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FunctProvider } from '../../providers/funct/funct';

/**
 * Generated class for the PostLikePersonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-like-person',
  templateUrl: 'post-like-person.html',
})
export class PostLikePersonPage {
  passData:any;
  photoLink:any;
  font : any;
  registerData:any;
  personData:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http,
              public funct:FunctProvider,public storage:Storage,public toastCtrl: ToastController,
             public platform:Platform) {
                
    this.photoLink = this.funct.imglink+"upload/image/userProfile";
    this.storage.get('language').then((font) => {
      if(font != "zg")
          this.font = 'uni';
        else
          this.font = font;
    });
    this.passData = this.navParams.get("data");
    console.log("passData in post like person page == "+JSON.stringify(this.passData));
    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      if(this.passData !=null && this.passData !=undefined && this.passData !=''){
        this.getData(this.passData);
      }
      console.log("registerData = "+JSON.stringify(this.registerData));
    });
    
    this.backButtonExit();
  }

  getData(skey){
      let parameter = {
        n1: this.registerData.syskey,
        n2: skey,
        sessionKey: this.registerData.sessionKey
      }
      console.log("requst saveComment=" + JSON.stringify(parameter));
      this.http.post(this.funct.ipaddress2 + 'serviceArticle/getArticleLikePerson', parameter).map(res => res.json()).subscribe(data => {
          console.log("return like post person data = " + JSON.stringify(data));
          console.log("data length == "+data.data.length);
          if( data.state && data.data.length > 0){
            for(let i =0;i<data.data.length;i++){
              this.personData.push({
                name:data.data[i].t2,
                img:data.data[i].t16
              })
            }
          }
          console.log("personData = "+JSON.stringify(this.personData));
        },
          error => {
          this.getError(error,"B134");
        });
  }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
  }

  getError(error,status){
    /* ionic App error
     ............001) url link worng, not found method (404)
     ........... 002) server not response (500)
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
    let msg ='';
    if(code == '005'){
      msg = "Please check internet connection!";
    }
    else{
      msg = "Can't connect right now. [" + code + ' - ' + status + "]";
    }
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true,
    });
    toast.present(toast);
    console.log("Oops!");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostLikePersonPage');
  }

}
