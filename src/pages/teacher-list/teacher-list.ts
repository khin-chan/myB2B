import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, Slides } from 'ionic-angular';
import { Observable } from 'Rxjs';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AppMinimize } from '@ionic-native/app-minimize';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { FunctProvider } from '../../providers/funct/funct';
import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';

import { DatacleanComponent } from '../../components/dataclean/dataclean';

import { LearnFormGuyuPage } from '../learn-form-guyu/learn-form-guyu';
import { PromotionLearnerPage } from '../promotion-learner/promotion-learner';

/**
 * Generated class for the TeacherListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-teacher-list',
  templateUrl: 'teacher-list.html',
  providers: [FunctProvider, ChangelanguageProvider]
})
export class TeacherListPage {

  @ViewChild(Slides) slides: Slides;
  imageLink: any;
  userData: any;
  font: any;
  textMyan: any = ["ဒေတာ မရှိပါ။"];
  textEng: any = ["No result found"];
  textData: any = [];
  teacherData: any = [];
  tempTeacher: any = [];
  array: any = [];
  nores: any;
  start: any = 0;
  end: any = 0;
  isLoading: any;
  billStatus: any;
  teachersyskey: any;
  showmoredata: boolean;
  doinfinite: any = false;
  slideData: any;
  slideImg: any;
  LearnerSlideImg: any = [];
  sliderObservable: any;
  flag: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public funct: FunctProvider,
    public http: Http, public storage: Storage, public changeLanguage: ChangelanguageProvider,
    public toastCtrl: ToastController, private inAppBrowser: InAppBrowser,
    public cdata: DatacleanComponent, public platform: Platform, private appMinimize: AppMinimize, private _zone: NgZone) {

    this.imageLink = this.funct.imglink + "upload/image/TeacherImage/";
    this.slideImg = this.funct.imglink + "upload/smallImage/setupImage/";

    this.storage.get('language').then((font) => {
      this.changeLanguage.changelanguage(font, this.textEng, this.textMyan).then((data) => {
        this.textData = data;
        if (font != "zg")
          this.font = 'uni';
        else
          this.font = font;
        console.log("data language=" + JSON.stringify(data));
      });
    });

    this.getSlideImageList();

  }

  getSlideImageList() {
    this.http.get(this.funct.ipaddress2 + 'serviceimages/getImageList?type=learners').map(res => res.json()).subscribe(result => {
      console.log("response imagelist = ", JSON.stringify(result));

      if (result.data.length > 0) {
        this.flag = true;
        this.LearnerSlideImg = result.data;
        console.log("this.teacherSlideImage = ", JSON.stringify(this.LearnerSlideImg));
        this.slideData = [];
        for (var i = 0; i < this.LearnerSlideImg.length; i++) {
          let obj = { syskey: '', image: '', link: '', postSyskey: '', };
          obj.syskey = this.LearnerSlideImg[i].syskey;
          obj.image = this.LearnerSlideImg[i].t7;
          obj.link = this.LearnerSlideImg[i].t5;
          obj.postSyskey = this.LearnerSlideImg[i].n2;
          console.log(" obj.image = ", JSON.stringify(obj.image));
          console.log(" obj.link = ", JSON.stringify(obj.link));
          this.slideData.push(obj);
          console.log("this.slideData = ", JSON.stringify(this.slideData));
        }
      }
      else {
        this.flag = false;
        console.log("No Result Data");
      }
    }, error => {
      console.log("signin error=" + error.status);
      this.getError(error, "B111");
    });
  }


  getTeacherListDetail(start, infiniteScroll) {
    console.log("start>" + start);
    console.log("end>" + this.end);
    if (!this.doinfinite) {
      this.isLoading = true;
    }
    this.end = this.end + 20;
    console.log("End list == " + JSON.stringify(this.end));
    let parameter = {
      "start": start,
      "end": this.end,
      //"size": 10,
    }
    console.log("request Data = ", JSON.stringify(parameter));
    this.http.post(this.funct.ipaddress2 + 'serviceTeacher/getGuyuList?syskey=' + this.userData.syskey + '&sessionKey=' + this.userData.sessionKey, parameter).map(res => res.json()).subscribe(result => {
      console.log("Response Teacher Data == " + JSON.stringify(result));
      this.doinfinite = false;
      this.isLoading = false;
      if (result.data.length < this.end) {
        this.showmoredata = false;
      }
      else {
        this.showmoredata = true;
      }
      if (result.data.length > 0 && result.state) {
        //let w = { t5: "row", data: [] };
        if (this.start == 0) {
          this.nores = 1;
          this.teacherData = result.data;
          console.log("teacherData>>" + JSON.stringify(this.teacherData));

          let w = { t5: "row", data: [] };
          for (let j = 0; j < this.teacherData.length; j++) {
            let arr2 = { syskey: this.teacherData[j].syskey, t1: this.teacherData[j].t1, t2: this.teacherData[j].t2, t3: this.imageLink + this.teacherData[j].t3, state: this.teacherData[j].state };
            console.log("arr2" + JSON.stringify(arr2));
            w.data.push(arr2);
            console.log("w object=" + JSON.stringify(w));
          }
          console.log("w object>>>>" + JSON.stringify(w));
          this.array.push(w);
          console.log("array1 in getchangerow>>" + JSON.stringify(this.array));

        }
        else if (this.start > 0) {
          console.log("before push Array >>>>>>>",JSON.stringify(this.array))
          this.tempTeacher = [];
          this.tempTeacher = result.data;
          console.log("TeacherData in start greater than 0 >>>",JSON.stringify(this.tempTeacher));
          for(let i=0;i< this.tempTeacher.length;i++){
           this.teacherData.push(result.data[i]);
          }
          // for(let j=0;j< this.tempTeacher.length;j++){
          //   let arr2 = { syskey: this.tempTeacher[j].syskey, t1: this.tempTeacher[j].t1, t2: this.tempTeacher[j].t2, t3: this.imageLink + this.tempTeacher[j].t3, state: this.tempTeacher[j].state };
          //   console.log("arr2" + JSON.stringify(arr2));
          //   w.data.push(arr2);
          // }
          // this.array.push(w); 
          // console.log("After pushing >>> ",JSON.stringify(this.array));
        }
        else {
          this.teacherData = result.data;
          this.nores = 1;
        }
      }
      else {
        this.nores = 0;
        // this.isLoading = false;
        this.showmoredata = false;
      }

      this.isLoading = false;
    }, error => {
      this.doinfinite = false;
      console.log("signin error=" + error.status);
      this.nores = 0;
      this.isLoading = false;
      this.getError(error, "B120");
    });
  }


  ionViewDidLoad() {
    this.storage.get('b2bregData').then((data) => {
      this.userData = data;
      console.log("registerData = " + JSON.stringify(this.userData));
      this.start = 0;
      this.end = 0;
      this.teacherData = [];
      this.getTeacherListDetail(this.start, '');
    });

    console.log('ionViewDidLoad TeacherListPage');
  }



  ionViewDidEnter() {
    console.log("Autoslides >> ", this.slides);
      this.sliderObservable = Observable.interval(5000).subscribe(x => {
        if(this.slides != undefined){
          this.autoPlaySlider();
        }        
      });
    this.backButtonExit();
  }

  autoPlaySlider() {
      var slider_index = this.slides.getActiveIndex();
      console.log("slider_index = " + JSON.stringify(slider_index));
      if (slider_index < this.slideData.length) {
        this.slides.slideTo(slider_index + 1);
      }
      else {
        this.slides.startAutoplay();
        // var last_ndex =this.slides.getPreviousIndex();
        // console.log("last_ndex = " + JSON.stringify(last_ndex));
        // this.slides.slideTo(last_ndex);
      }
  
  }

  ionViewDidLeave() {
    this.sliderObservable.unsubscribe();
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      //this.platform.exitApp();
      this.appMinimize.minimize();
    });
  }

  viewTeacherListDetail(i) {
    console.log("State== " + JSON.stringify(i.state));
    this._zone.run(() => {
      this.navCtrl.push(LearnFormGuyuPage, {
        data: i,
        billstatus: i.state
      });
    });
  }

  promotionLearner(i) {

    console.log("data i=" + JSON.stringify(i));
    if (i.postSyskey == 0 && i.link != undefined && i.link != null && i.link != "") {
      let searchlink = 'www.';
      if (i.link.startsWith('www')) {
        console.log('includes www');
        window.open('http://' + i.link, '_system');
      }
      else if (i.link.includes('.com') && !i.link.startsWith('http')) {
        console.log('includes .com not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.org') && !i.link.startsWith('http')) {
        console.log('includes .org not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.edu') && !i.link.startsWith('http')) {
        console.log('includes .edu not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.co') && !i.link.startsWith('http')) {
        console.log('includes .co not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if (i.link.includes('.net') && !i.link.startsWith('http')) {
        console.log('includes .net not http');
        window.open('http://www.' + i.link, '_system');
      }
      else if ((i.link.includes('http') || i.link.includes('https')) && !i.link.includes('www.')) {
        console.log("include http and not include www");
        let arr = i.link.split("://");
        console.log("link arr>" + arr + " and length is " + arr.length);
        let type = arr[0];
        let name = arr[1];
        console.log("link name>" + name);
        console.log("link full>" + type + '://www.' + name)
        window.open(type + '://www.' + name, '_system');
      }
      else {
        console.log('other');
        window.open(i.link, '_system');
      }
    }
    else if (i.postSyskey > 0) {
      console.log("postSyskey greater than 0");
      this.navCtrl.push(PromotionLearnerPage, {
        passData: i
      });
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.start = 0;
      this.end = 0;
      console.log('Async operation has ended');
      if (!this.isLoading) {
        this.getTeacherListDetail(this.start, '');
        refresher.complete();
      }
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    this.doinfinite = true;
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.start = this.end + 1;
        if (!this.isLoading)
          this.getTeacherListDetail(this.start, infiniteScroll);
        console.log('Async operation has ended');
        //infiniteScroll.complete();
      }, 900);
    });
  }

  getError(error, status) {
    /* ionic App error
     ............001) url link worng, not found method (404)
     ............002) server not response (500)
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
    let msg = '';
    if (code == '005') {
      msg = "Please check internet connection!";
    }
    else {
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


}
