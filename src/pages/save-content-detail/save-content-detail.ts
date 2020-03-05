import { Component } from '@angular/core';
import { NavController, NavParams, ToastController , Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { SaveContentVideoPage } from '../save-content-video/save-content-video';
import { WriterprofilePage } from '../writerprofile/writerprofile';
import { ViewPhotoMessagePage } from '../view-photo-message/view-photo-message';

/**
 * Generated class for the SaveContentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-save-content-detail',
  templateUrl: 'save-content-detail.html',
  providers: [ChangelanguageProvider]
})
export class SaveContentDetailPage {

  detailData : any =[];
  showSave : any = {};
  //url:string = 'https://javebratt.com/social-sharing-with-ionic/';
  isLoading : any;
  registerData : any = {syskey:'',t6:''};
  userData :any;
  content : any;
  photoLink : any;
  font : any ;
  exit:any = false;
  textMyan : any = ["အသေးစိတ်အချက်အလက်","ကြိုက်သည်","မှတ်ချက်","မျှဝေမည်","ဒေတာ မရှိပါ"];
  textEng : any = ["Details", "Like","Comment","Share","No result found"];
  textData : any = [];
  imgArr:any = [];
  writerImg:any;
  array:any;
  array1:any =[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage:Storage,
              public http: Http,
              public toastCtrl: ToastController,
              public funct:FunctProvider,
              public changeLanguage : ChangelanguageProvider,public platform:Platform) {

    this.writerImg = this.funct.imglink+"upload/image/WriterImage";       
    this.photoLink = this.funct.imglink+"upload/smallImage/contentImage/";    

    this.storage.get('b2bregData').then((data) => {
      this.userData = data;
      console.log("userData = "+JSON.stringify(this.userData));

    });

    this.registerData = this.navParams.get('detailData');
    if(this.registerData.t6.indexOf("<img ") >-1){
      this.registerData.t6 = this.registerData.t6.replace(/<img /g,"<i ");
      console.log("replace img == "+this.registerData.t6);
      this.registerData.t6 = this.registerData.t6.replace(/ \/>/g,"></i>");
      console.log("replace <i/> == "+this.registerData.t6);
    }
    if (this.registerData.n6 != 1)
      this.registerData.showLike = false;
    else
      this.registerData.showLike = true;
    if (this.registerData.n7 != 1)
      this.registerData.showContent = false;
    else
      this.registerData.showContent = true;
    console.log("detailData =="+JSON.stringify(this.registerData));

    let num = this.registerData.t6;
    this.array = num.split("[#img]");
    console.log("dat="+JSON.stringify(this.array))
    for(let i=0;i<this.array.length;i++){
    console.log("i="+this.array[i])
    let arr = {};
    if(this.array[i]=="<p>"){
    arr = {t1:"img",t2:this.photoLink + this.registerData.uploadedPhoto[i].t7,caption:this.registerData.uploadedPhoto[i].t5};
    this.array1.push(arr);
    }
    else if(this.array[i]==""){
    arr = {t1:"img",t2:this.photoLink + this.registerData.uploadedPhoto[i].t7,caption:this.registerData.uploadedPhoto[i].t5};
    this.array1.push(arr);
    }
    else{
    if(i!=this.array.length-1){
      console.log("ii="+this.array[i])
      let arr1 = {t1:"text",t2:this.array[i]};
      arr = {t1:"img",t2:this.photoLink + this.registerData.uploadedPhoto[i].t7,caption:this.registerData.uploadedPhoto[i].t5};
      this.array1.push(arr1);
      this.array1.push(arr);
    }
    else{
        arr = {t1:"text",t2:this.array[i]};
        this.array1.push(arr);
      }
    }
    }

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font,this.textEng,this.textMyan).then((data) => {
        this.textData = data;
        if(font != "zg")
          this.font = 'uni';
        console.log("data language="+JSON.stringify(data));
      });
    });
    // hardware back button
  }
  
  singlePhoto(i){
    console.log("viewImage == "+JSON.stringify(i));
    this.navCtrl.push(ViewPhotoMessagePage,{
        data : i,
        contentImg:"singlePhoto"
      });
  }

  ionViewDidEnter(){
    this.backButtonExit();
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
      //  showCloseButton: true,
      dismissOnPageChange: true,
      // closeButtonText: 'OK'
    });
    toast.present(toast);
    this.isLoading = false;
    // this.loading.dismiss();
    console.log("Oops!");
  }

  clickBookMark(data){
    console.log("data="+JSON.stringify(data));
    if(!data){
      this.registerData.showContent = true;
      this.saveContent(this.registerData);
    }
    else{
      this.registerData.showContent = false;
      this.unsaveContent(this.registerData);
    }
  }

  saveContent(data){
    let parameter = {
      t1 : data.t1,
      t4 : this.userData.t2,
      n1 : this.userData.syskey,
      n2 : data.n2,  
      n3 : 1,
      sessionKey:this.registerData.sessionKey
    }
    console.log("request saveContent parameter= ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/saveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response saveContent = ", JSON.stringify(data));
      // this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B113");
    });
  }

  unsaveContent(data){
    console.log("request unsaveContent = ", JSON.stringify(data));
    let parameter = {
      t1 : data.t1,
      t4 : this.userData.t2,
      n1 : this.userData.syskey,
      n2 : data.n2,
      n3 : 0,
      sessionKey:this.registerData.sessionKey
    }
    console.log("request unsaveContent parameter = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceContent/unsaveContent', parameter).map(res => res.json()).subscribe(data => {
      console.log("response unsaveContent = ", JSON.stringify(data));

      //this.isLoading = false;
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error,"B114");
    });
  }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();

    });
  }
  
  writerProfile(data){
    this.navCtrl.push(WriterprofilePage,{
        data : data
       });
  }
  
  seeMoreData(index){
    this.imgArr[index].seeMore = false;
  }

  goDetail(url) {
    this.navCtrl.push(SaveContentVideoPage,{
      url: url
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaveContentDetailPage');

  }

}
