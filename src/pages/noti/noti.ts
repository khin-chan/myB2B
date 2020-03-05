import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OrderPipe } from 'ngx-order-pipe';
import { SQLite } from '@ionic-native/sqlite';

import { RegistrationPage } from '../registration/registration';
import { FirstStepPage } from '../first-step/first-step';
import { TabsPage } from '../tabs/tabs';
import { DatePipe } from '@angular/common';
import { NotipostPage } from '../notipost/notipost';
import { ReplyCommentPage } from '../reply-comment/reply-comment';
import { NotiReplyCommentPage } from '../noti-reply-comment/noti-reply-comment';

import { ChangelanguageProvider } from '../../providers/changelanguage/changelanguage';
import { FunctProvider } from '../../providers/funct/funct';

/**
 * Generated class for the NotiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-noti',
  templateUrl: 'noti.html',
  providers: [FunctProvider, ChangelanguageProvider]
})
export class NotiPage {
  db: any;
  notis: any = [];
  order: string = 'id';
  data: any;
  status: any = '';
  font: any;
  textMyan: any = ["ဒေတာ မရှိပါ။"];
  textEng: any = ["No result found"];
  textData: any = [];
  date: any;
  temp: any;
  timeformat: any;
  dateformat: any;
  timestatus: any = true;
  imglnk: any;
  start: any = 0;
  end: any = 0;
  isLoading: any = false;
  id: any = [];
  startId: any = 0;
  endId: any = 0;
  nores: any;
  total: any = 0;


  constructor(public datepipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite,
    public storage: Storage, private _zone: NgZone, public events: Events, public platform: Platform,
    public changeLanguage: ChangelanguageProvider, public funct: FunctProvider, private orderPipe: OrderPipe,) {


    this.imglnk = this.funct.imglink + "upload/image/userProfile";
    this.date = new Date();
    this.temp = this.datepipe.transform(this.date, 'yyyyMMdd');
    console.log('Date Format', JSON.stringify(this.temp));
    console.log('Today Date', JSON.stringify(this.date));
    console.log(this.orderPipe.transform(this.notis, this.order));

    this.status = this.navParams.get("status");
    console.log('status>>>>>', JSON.stringify(this.status));

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
  }

  ionViewDidEnter() {
    this.startId = 0;
    this.endId = 10;
    this.notis = [];
    this.isLoading = true;
    this.getDBData(this.startId, '');
  }

  getDBData(startId, infiniteScroll) {
    
    this.startId = startId;
    let parameter = {
      startId: this.startId,
      endId: this.endId,
      //size : 10
    }
    console.log("response news = ", JSON.stringify(parameter));
    this.sqlite.create({
      name: 'b2b.db',
      location: 'default'
    }
    ).then((db) => {
      this.isLoading = true;    //OVER (ORDER BY id DESC)
      this.db = db;
      db.executeSql("SELECT (SELECT COUNT(*) FROM myNoti) Total,(SELECT COUNT(*) FROM myNoti WHERE noticountstatus=1) Noticount, * FROM myNoti order by id desc limit " + this.endId + " offset " + this.startId, []).then((data) => {
        console.log('Successful in noti.ts');
        console.log('Execute SQL in noti.ts >> ', JSON.stringify(data));
        console.log("length == " + data.rows.length);
        if (data.rows.length > 0) {
          this.nores = 1;
          this.total = data.rows.item(0).Total;
          for (var i = 0; i < data.rows.length; i++) {
            console.log('for loop in noti.ts');
            console.log("data.rows.item " + i + " == " + JSON.stringify(data.rows.item(i)));
            this.timeformat = this.funct.getTimeDifference(data.rows.item(i).date, data.rows.item(i).time);
            //this.dateformat='';
            // this.dateformat=this.funct.getTransformDate(data.rows.item(i).date);

            if (this.temp == data.rows.item(i).date) {
              console.log("TimeFormat", this.timeformat);
              let now = "Just now";
              if (this.timeformat.includes(now)) {
                console.log('timeFormat in if condi', this.timeformat)
                console.log("Just now");
                this.timestatus = false;
                this.timeformat = this.funct.getTimeDifference(data.rows.item(i).date, data.rows.item(i).time);
                this.dateformat = '';
              }
              else {
                console.log("TimeStatus");
                this.timestatus = true;
                this.timeformat = this.funct.getTimeDifference(data.rows.item(i).date, data.rows.item(i).time);
                this.dateformat = '';
              }
              //this.timestatus=true;
              console.log("match ...........");

            }
            else {
              console.log(" not match ...........");
              this.timestatus = false;
              this.timeformat = data.rows.item(i).time;
              this.dateformat = this.funct.getTransformDate(data.rows.item(i).date);

            }
            /*  if(this.timeformat == 'Just now'){
               this.timestatus = false;
               console.log("Time Status ago > ",this.timestatus)
             } */

            this.notis.push({
              Rid: data.rows.item(i).Rid,
              id: data.rows.item(i).id,
              postSyskey: data.rows.item(i).postSyskey,
              postName: data.rows.item(i).postName,
              time: this.timeformat,
              date: this.dateformat,
              userPhoto: data.rows.item(i).userPhoto,
              name: data.rows.item(i).name,
              title: data.rows.item(i).title,
              timestatus: this.timestatus,
              status: data.rows.item(i).noticountstatus,
              iconStatus: data.rows.item(i).notiStatus,
            });
          }
          this.events.publish('notiCount', data.rows.item(0).Noticount);
          //this.notis = tempNoti.concat(this.notis);
          if (infiniteScroll != '') {
            infiniteScroll.complete();
          }

          //this.notis = this.notis;
          console.log('Noti' + JSON.stringify(this.notis));
          this.isLoading = false;
        }
        else {
          console.log("False");
          if (infiniteScroll != '') {
            infiniteScroll.complete();
          }
          if (this.notis.length > 0) {
            this.nores = 1;
          }
          else {
            this.nores = 0;
          }

          this.isLoading = false;
        }
        // this.isLoading = false;
      }, (error) => {
        if (infiniteScroll != '') {
          infiniteScroll.complete();
        }
        if (this.notis.length > 0) {
          this.nores = 1;
        }
        else {
          this.nores = 0;
        }
        console.log('Error in login.ts' + JSON.stringify(error));
        this.isLoading = false;
      });
    }, (error) => {
      if (infiniteScroll != '') {
        infiniteScroll.complete();
      }
      console.log("error");
      this.isLoading = false;
    });
    this.backButtonExit();
  }

  dismiss() {
    this.storage.get('b2bregData').then((data) => {
      console.log("dismiss ..............");
      console.log(" single view registerData = " + JSON.stringify(data));
      //if(this.status == 1){
      if (data == null || data == "") {
        this._zone.run(() => {
          this.navCtrl.setRoot(FirstStepPage);
        });
      }
      else if (data == true) {
        this._zone.run(() => {
          this.navCtrl.setRoot(RegistrationPage);
        });
      }
      else {
        //this.navCtrl.setRoot(TabsPage);
        this._zone.run(() => {
          this.navCtrl.setRoot(TabsPage);
        });
      }
      //}  
      //else{
      // this.navCtrl.setRoot(TabsPage);
      //}          
    });
  }

  singleview(s) {
    console.log("Syskey=" + JSON.stringify(s));
    if (s.iconStatus == "reply") {
      this.navCtrl.push(NotiReplyCommentPage, {
        data: s,
        singleStatus:true
      });
    }
    else {
      this.navCtrl.push(NotipostPage, {
        data: s
      });
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      this.startId = 0;
      this.endId = 10;
      this.total = 0;
      this.notis = [];
      if (!this.isLoading) {
        this.getDBData(this.startId, '');
        refresher.complete();
      }
      console.log('Async refresher operation has ended');
    }, 2000);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.startId = this.startId + this.endId;
        if (!this.isLoading) {
          if (this.notis.length == this.total) {
            infiniteScroll.complete();
          }
          else {
            this.getDBData(this.startId, infiniteScroll);
          }
        }
        console.log('Async operation has ended');
      }, 900);
    })
  }

  backButtonExit() {
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotiPage');
  }

}
