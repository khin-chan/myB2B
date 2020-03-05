import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ChangefontProvider } from '../changefont/changefont';

/*
  Generated class for the ChangelanguageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChangelanguageProvider {
  textFont : any = [];
  font:string;
  text : any;
  popoverItemList : any [] = [{name: '',key:0},{name: '',key:1}, {name: '',key:2},{name: '',key:3}];
  constructor(public changefont:ChangefontProvider, public http: Http) {
    console.log('Hello ChangelanguageProvider Provider');
  }

  changelanguage(lan, txtEng, txtMyan) {
    if (lan == 'uni') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.textFont[j] = txtMyan[j];
      }

    }
    else if (lan == 'zg') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.textFont[j] = this.changefont.UnitoZg(txtMyan[j]);
      }

    }
    else{
      for (let j = 0; j <  txtEng.length;j++) {
        this.textFont[j] = txtEng[j];
      }
    }
    return Promise.resolve(this.textFont);
  }

  changeLanguageArray(lan, txtEng, txtMyan){
    if (lan == 'uni') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.popoverItemList[j].name = txtMyan[j].name;
      }
    }
    else if (lan == 'zg') {
      for (let j = 0; j <  txtMyan.length;j++) {
        this.popoverItemList[j].name = this.changefont.UnitoZg(txtMyan[j].name);
      }
    }
    else{
      for (let j = 0; j <  txtEng.length;j++) {
        this.popoverItemList[j].name = txtEng[j].name;
      }
    }
    return Promise.resolve(this.popoverItemList);
  }

  changelanguageText(lan, txt) {
    if (lan == 'uni') {
      this.text = txt;
    }
    else if (lan == 'zg') {
      this.text = this.changefont.UnitoZg(txt);
    }
    else{
      this.text = txt;
    }
    return Promise.resolve(this.text);
  }

}
