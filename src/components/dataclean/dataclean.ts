import { Component } from '@angular/core';
import { AlertController, Platform, App } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

import { RegistrationPage } from '../../pages/registration/registration';


/**
 * Generated class for the DatacleanComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dataclean',
  templateUrl: 'dataclean.html'
})
export class DatacleanComponent {

  db: any;
  sessionPopup: any;
  font: any;
  constructor(public storage: Storage, public app: App,
    public alert: AlertController, public sqlite: SQLite, public platform: Platform) {

    this.storage.get('language').then((font) => {
      if (font != "zg")
        this.font = 'uni';
      else
        this.font = font;
    });
  }

  sessionAlert() {
    this.sessionPopup = this.alert.create({
      subTitle: '<div class="sessionalert"> Your session is time out. So you need to log out. <div>',
      cssClass: this.font,
      buttons: [
        // {
        //   text: 'Cancel',
        //   cssClass: 'alertButton',
        //   handler: data => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'Ok',
          cssClass: '',
          handler: data => {
            this.cleanData();
          }
        }
      ]
    });
    this.sessionPopup.present();
    // let doDismiss = () => this.sessionPopup.dismiss();
    // let unregBackButton = this.platform.registerBackButtonAction(doDismiss, 5);
    // this.sessionPopup.onDidDismiss(unregBackButton);  
  }

  cleanData() {
    this.sqlite.create({
      name: "b2b.db",
      location: "default"
    }).then((db) => {
      db.executeSql("DELETE FROM b2bData", []).then((data) => {      // clean home data
        console.log("Delete home data successfully", data);
        db.executeSql("DELETE FROM news", []).then((data) => {      // clean news data
          console.log("Delete news data successfully", data);
          db.executeSql("DELETE FROM business", []).then((data) => {      // clean business data
            console.log("Delete business data successfully", data);
            db.executeSql("DELETE FROM video", []).then((data) => {       // clean video data
              console.log("Delete video data successfully", data);
              db.executeSql("DELETE FROM leadership", []).then((data) => {      // clean leadership data
                console.log("Delete leadership data successfully", data);
                db.executeSql("DELETE FROM innovation", []).then((data) => {     // clean innovation data
                  console.log("Delete innovation data successfully", data);
                  db.executeSql("DELETE FROM general", []).then((data) => {     // clean general data
                    console.log("Delete general data successfully", data);
                    db.executeSql("DELETE FROM investment", []).then((data) => {    // clean investment data
                      console.log("Delete investment data successfully", data);
                      db.executeSql("DELETE FROM bvData", []).then((data) => {      // clean bv data
                        console.log("Delete bvData data successfully", data);
                        db.executeSql("DELETE FROM chatData", []).then((data) => {      // clean chat data
                          console.log("Delete myNoti data successfully", data);
                          this.storage.remove('b2bregData');
                          this.storage.set('b2bregData', true);
                          //this.navCtrl.setRoot(RegistrationPage);   
                          this.app.getRootNavs()[0].setRoot(RegistrationPage);
                        }, (error) => {
                          console.error("Unable to delete myNoti data", error);
                        });
                      }, (error) => {
                        console.error("Unable to delete bvData data", error);
                      });
                    }, (error) => {
                      console.error("Unable to delete investment data", error);
                    });
                  }, (error) => {
                    console.error("Unable to delete general data", error);
                  });
                }, (error) => {
                  console.error("Unable to delete innovation data", error);
                });
              }, (error) => {
                console.error("Unable to delete leadership data", error);
              });
            }, (error) => {
              console.error("Unable to delete video data", error);
            });
          }, (error) => {
            console.error("Unable to delete business data", error);
          });
        }, (error) => {
          console.error("Unable to delete news data", error);
        });
      }, (error) => {
        console.error("Unable to delete home data", error);
      });

    }, (error) => {
      console.error("Unable to open database", error);
    });
  }
}
