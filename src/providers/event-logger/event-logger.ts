
// import { Injectable } from '@angular/core';
// import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

// /*
//   Generated class for the EventLoggerProvider provider.

//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class EventLoggerProvider {

//   constructor(public fba: FirebaseAnalytics) {
//     console.log('Hello EventLoggerProvider Provider');
//   }

//   fbevent(name:string,value:any){
//     console.log("name=="+name);
//     console.log("value=="+JSON.stringify(value));
//     this.fba.logEvent(name, { pram:value })
//     .then((res: any) => {console.log("log data"+res);})
//     .catch((error: any) => console.error("log error"+error));
//   }
// }


import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@Injectable()
export class EventLoggerProvider {

  constructor(public fba: FirebaseAnalytics) {
    console.log('Hello EventLoggerProvider Provider');
  }

  fbevent(name: string, value: any) {
    this.fba.logEvent(name, value)
      .then((res: any) => { console.log("name=>" + name + "/status=>" + res); })
      .catch((error: any) => console.error(error));
  }
}




