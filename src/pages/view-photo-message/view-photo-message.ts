import { Component } from '@angular/core';
import {  NavController, NavParams , Platform , LoadingController , ToastController } from 'ionic-angular';//IonicPage,
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import {File} from '@ionic-native/file';
import { FunctProvider } from '../../providers/funct/funct';

/**
 * Generated class for the ViewPhotoMessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-view-photo-message',
  templateUrl: 'view-photo-message.html',
})

export class ViewPhotoMessagePage {
  passData: any;
  image: any;
  imageLink : any;
  senddate: any;
  sendtime: any;
  loading:any;
  contentImg:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public funct:FunctProvider,
              public platform:Platform,private transfer:Transfer,public toastCtrl: ToastController,
              public loadingCtrl:LoadingController,
              private file: File ) {
                
    this.passData = this.navParams.get("data");
    this.contentImg = this.navParams.get("contentImg");
    //this.imageLink = this.funct.imglink + "upload/image/chatImage/";
                
    if(this.contentImg == 'singlePhoto'){
      this.imageLink = this.funct.imglink;
      this.image =  this.passData;      
    }
    /*else if(this.contentImg == 'writerprofile'){
      this.image = this.passData;
      this.imageLink = this.image.substr(0, this.image.lastIndexOf('/') + 1);;
    }*/
    else{
      this.imageLink = this.funct.imglink + "upload/smallImage/ChatImage/";
      this.image =this.imageLink + this.passData.t3;
      this.senddate = this.funct.getTransformDate(this.passData.t7);
      this.sendtime = this.passData.t8;      
      console.log("this.passData=" + JSON.stringify(this.passData));
      console.log("senddate=" + this.senddate);
      console.log("sendtime=" + this.sendtime);
    }
  }

  ionViewDidEnter(){
    this.backButtonExit();
  }
  
  downLoadFile(image){
    console.log("dowload image == "+JSON.stringify(image));
    let fileURL;
    this.loading = this.loadingCtrl.create({
      content: 'Saving...',
    });
    this.loading.present();
    if (this.platform.is('android')) {
      fileURL = this.file.externalRootDirectory;
   }
   else{
      fileURL = this.file.dataDirectory;
   }
    console.log("this.file.externalRootDirectory == "+this.file.externalRootDirectory);
    this.file.checkDir(fileURL,'B2BImages').then((data) =>{
      console.log('Directory exists');
      this.file.checkFile(fileURL + 'B2BImages/' , this.image)
          .then((entry) => {
            console.log('file exists' + JSON.stringify(entry));
            if(entry){
                 this.presentToast("Saved Complete!");
                //this.isLoading = false;
            }
            else
               this.imageDownload(image);

          }, (error) => {
            console.log('does not exist' + JSON.stringify(error));
            this.imageDownload(image);
          });

    },(error) =>{
      console.log('Directory doesnt exist');
    this.file.createDir(fileURL,'B2BImages',true).then((res) =>{
      console.log("file create success");
      this.imageDownload(image);
    },(error) =>{
      console.log("file create error");
       this.presentToast("File can't create.");
       //this.isLoading = false;
      });
    });
  }
  
  imageDownload(image){
    let fileURL;
      if (this.platform.is('android')) {
        fileURL = this.file.externalRootDirectory;
      }
      else{
        fileURL = this.file.dataDirectory;
      }
    let tempimg = image.substr(image.lastIndexOf('/') + 1);
    let url =  image;
    console.log("image substring for img name == " +image.substr(image.lastIndexOf('/') + 1) +"url == "+url);
    const fileTransfer: TransferObject = this.transfer.create();
    var targetPath = fileURL+'B2BImages/'+ tempimg;
    fileTransfer.download(url, targetPath).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.presentToast("Save Complete!");
      this.loading.dismissAll();
      //this.viewFile(image);
      
    }, (error) => {
      this.presentToast("Download Fail!Check your file extension name.");
      console.log('download error: ' + JSON.stringify(error));
      this.loading.dismissAll();
    });
  }
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top'
    });
    toast.present();
  }

  backButtonExit(){
    this.platform.registerBackButtonAction(() => {
      console.log("Active Page=" + this.navCtrl.getActive().name);
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPhotoMessagePage');
  }

}
