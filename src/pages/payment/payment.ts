import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events, App, ToastController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Base64 } from '@ionic-native/base64';
import { Storage } from '@ionic/storage';
import { text } from '@angular/core/src/render3/instructions';
import { TabsPage } from '../tabs/tabs';
import { PremiumPage } from '../premium/premium';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var require: any;
declare var window;

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  status: any = '';
  showColor: any = '';
  checked: any = [];
  checkedIdx: any = 0;
  payment2C2P: any = {
    merchant_id: '',
    secret_key: '',
    payment_description: '',
    order_id: '',
    currency: '',
    amount: '',
    version: '',
    result_url_1: '',
    result_url_2: '',
    user_defined_2: '',
  }
  payment_url: any;
  params: any;
  hash_value: any;
  secret_key: any;
  blueData: any = { _body: '' };
  registerData: any = [];
  billStatus: any;
  passnotiPaymentStatus: any;
  pageType: any;

  order_id: any ="";
  amount: any ="";
  recordstatus = 0;
  paymentstatus: any =""; 
  payment_method: any =""; 
  user_defined_1 : any ="";

  categories: any = [{ name: '2500', checked: true, month:'1 Month' },
  { name: '8000', checked: false, month:'4 Months' },
  { name: '14000', checked: false, month:'8 Months' },
  { name: '18000', checked: false, month:'1 Year' },
  ];

  // categories: any = [{ name: '100', checked: true, month:'1 Month' },
  // { name: '200', checked: false, month:'4 Months' },
  // { name: '300', checked: false, month:'8 Months' },
  // { name: '400', checked: false, month:'1 Year' },
  // ];
  
  chooseAmount: any = Number(this.categories[0].name);
  amountlength: any = this.categories[0].name.length + 2;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private inappBrowser: InAppBrowser,
    public http: Http,
    public platform: Platform,
    private sanitizer: DomSanitizer,
    public httpClient: HttpClient,
    private base64: Base64,
    public storage: Storage,
    public events: Events,
    public app: App,
    public toastCtrl: ToastController,
  ) {

    this.passnotiPaymentStatus = this.navParams.get("notiPaymentStatus");
    console.log("passnotiPaymentStatus = " + JSON.stringify(this.passnotiPaymentStatus));

    this.storage.get('b2bregData').then((data) => {
      this.registerData = data;
      console.log("registerData = " + JSON.stringify(this.registerData));
    });

  }

  goBluePlanet() { // Done for BluePlanet

      //var URL = "https://bppay.blueplanet.com.mm/payment";
      var URL = "https://bppays.com/payment";
      
      let d = new Date();
      let n = d.getTime();
      let order = n.toString().substr(7);
      let amount = this.chooseAmount;
      var pageContent = "<html><head></head><body><form id='loadform' action='" + URL + "' method='post'>" +
        "<input type='hidden' name='merchant_id' value='f670e560-b438-11e9-93ee-a72551cc1ded'>" +
        "<input type='hidden' name='service_name' value='B2B Premium Subscription'>" +
        "<input type='hidden' name='password' value='hubmmB2B@2019'>" +
        "<input type='hidden' name='email' value='info@thehubmyanmar.com'>" +
        "<input type='hidden' name='amount' value='" + amount + "'>" +
        "<input type='hidden' name='order_id' value='" + order + "'>" +
        "<input type='hidden' name='userDefined' value='" + this.registerData.syskey + "'>" +
        "</form> <script type='text/javascript'>document.getElementById('loadform').submit();</script></body></html>";
      console.log('API pageContent : ', pageContent);

      var pageContentUrl = "data:text/html;base64," + btoa(pageContent);
      console.log('API Response : ', pageContentUrl);
      let options: InAppBrowserOptions = {
        zoom: "no",
        location: "yes",
        toolbarcolor: "#de1f26",
        hideurlbar: "yes",
        hidenavigationbuttons: "yes",
        hardwareback: "no",
        closebuttoncaption: "  X",
        clearcache: "yes",
      };
      const browser = this.inappBrowser.create(pageContentUrl, '_self', options);
      browser.on('loadstop').subscribe(event => {
        console.log("event.url = " + event.url);
        browser.insertCSS({ code: "toolbar{display: none;" });
      });
      browser.show();
    }

  go2C2P() {
      //Merchant's account information
      this.payment2C2P.merchant_id = "104104000000278";			//Get MerchantID when opening account with 2C2P
      // for production
      this.payment2C2P.secret_key = "30D6B5F469B2D35E1A9DCA0426689E855FAFFE31588CCFD2BAB4490714FBA2AB";	//Get SecretKey from 2C2P PGW Dashboard
      // for demo
      //this.payment2C2P.secret_key = "6C8D4204F2A7724EFF903F165B6AB702574AF33F6D870959B3D8B288A78833A6";
      //Transaction information
      this.payment2C2P.payment_description = 'B2B Premium Subscription';
      this.payment2C2P.user_defined_2 = 'B2B Premium Subscription';
      let d = new Date();
      let n = d.getTime();
      this.payment2C2P.order_id = n.toString().substr(1);
      this.payment2C2P.currency = "104"; //MMK
      let count = 12 - this.amountlength;
      let amt = '';
      for (var i = 0; i <= count; i++) {
        if (i != count) {
          amt += '0';
        }
        else {
          amt += this.chooseAmount + "00";
          this.payment2C2P.amount = amt; // 12 digits 
        }
      }
      console.log("this.payment2C2P.amount>>>> " + JSON.stringify(this.payment2C2P.amount));

      // this.payment2C2P.merchant_id = "JT01";			//Get MerchantID when opening account with 2C2P
      //this.payment2C2P.secret_key = "7jYcp4FxFdf0";	//Get SecretKey from 2C2P PGW Dashboard 


      //Transaction information
      /* this.payment2C2P.payment_description = '2 days 1 night hotel room';
      this.payment2C2P.order_id = '00000000010000091209';
      this.payment2C2P.currency = "104"; //MMK
      this.payment2C2P.amount = '000000000100'; // 12 digits  */

      //Request information
      this.payment2C2P.version = "8.5";
      // for production
      this.payment_url = "https://t.2c2p.com/RedirectV3/payment";
      //for demo
      //this.payment_url = "https://demo2.2c2p.com/2C2PFrontEnd/RedirectV3/payment";

      this.payment2C2P.result_url_1 = "";
      this.payment2C2P.result_url_2 = "";
      var CryptoJS = require("crypto-js");

      //Construct signature string
      this.params = this.payment2C2P.version + this.payment2C2P.merchant_id + this.payment2C2P.payment_description + this.payment2C2P.order_id + this.payment2C2P.currency + this.payment2C2P.amount + this.payment2C2P.result_url_1 + this.registerData.syskey + this.payment2C2P.user_defined_2;
      this.hash_value = CryptoJS.HmacSHA256(this.params, this.payment2C2P.secret_key).toString();	//Compute hash value
      console.log("request 2c2p hash_value =>", JSON.stringify(this.hash_value));
      var pageContent = "<html><head></head><body><form id='loadform' action='" + this.payment_url + "' method='post'>" +
        "<input type='hidden' name='version' value='" + this.payment2C2P.version + "'>" +
        "<input type='hidden' name='merchant_id' value='" + this.payment2C2P.merchant_id + "'>" +
        "<input type='hidden' name='currency' value='" + this.payment2C2P.currency + "'>" +
        "<input type='hidden' name='result_url_1' value=''>" +
        "<input type='hidden' name='result_url_2' value=''>" +
        "<input type='hidden' name='hash_value' value='" + this.hash_value + "'>" +
        "<input type='hidden' name='payment_description' value='" + this.payment2C2P.payment_description + "'>" +
        "<input type='hidden' name='order_id' value='" + this.payment2C2P.order_id + "'>" +
        "<input type='hidden' name='amount' value='" + this.payment2C2P.amount + "'>" +
        "<input type='hidden' name='user_defined_1' value='" + this.registerData.syskey + "'>" +
        "<input type='hidden' name='user_defined_2' value='" + this.payment2C2P.user_defined_2 + "'>" +
        "</form> <script type='text/javascript'>document.getElementById('loadform').submit();</script></body></html>";
      console.log('API pageContent : ', pageContent);
      var pageContentUrl = "data:text/html;base64," + btoa(pageContent);
      console.log('API Response : ', pageContentUrl);
      let options: InAppBrowserOptions = {
        zoom: "no",
        location: "yes",
        toolbarcolor: "#de1f26",
        hideurlbar: "yes",
        hidenavigationbuttons: "yes",
        hardwareback: "no",
        closebuttoncaption: "  X",
      };
      const browser = this.inappBrowser.create(pageContentUrl, '_self', options);
      browser.on('loadstop').subscribe(event => {
        browser.insertCSS({ code: "toolbar{display: none;" });
      });
      browser.show();
  }

  selection(cat) {
    console.log("cat >> " + JSON.stringify(cat));
    console.log("cat check>> " + cat.checked);
    if (cat.checked) {
      cat.checked = true;
      this.chooseAmount = Number(cat.name);
      console.log("this.amount>>>> " + JSON.stringify(this.chooseAmount));
      this.amountlength = cat.name.length + 2;
      console.log("length>>>> " + JSON.stringify(this.amountlength));
      this.categories.forEach(x => {
        if (x.name !== cat.name) {
          x.checked = !cat.checked;
        }
        console.log("if case disible>>" + x.checked);
      })
    }
    else {
      cat.checked = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
  }

  ionViewDidEnter() {
    this.backButtonExit();
  }

  goback() {
    if (this.passnotiPaymentStatus == "s1") {
      this.navCtrl.setRoot(TabsPage);
    }
    else {
      this.navCtrl.pop();
    }
  }

  backButtonExit() {
    if (this.passnotiPaymentStatus == "s1") {
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 1));
    }
    else {
      this.platform.registerBackButtonAction(() => {
        console.log("Active Page=" + this.navCtrl.getActive().name);
        this.navCtrl.pop();
      });
    }
  }

  ionViewCanLeave() {
    this.navCtrl.popToRoot();
  }

}



