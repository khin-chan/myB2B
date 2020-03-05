import { Injectable, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SQLite } from '@ionic-native/sqlite';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';

import { RegistrationPage } from '../../pages/registration/registration';
/*
  Generated class for the FunctProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FunctProvider {
  public uuid: any;
  public location: any;
  public latitude: any;
  public longitude: any;
  public version: any = "1.1.18";
  public appID: any = "004";
  public appType: any = "android";
  public appName: any = "B2B";
  public domain: any = "B2B001";
  public ipaddress1: any;
  public ipaddress2: any;
  public imglink: any;
  public msgLink1: any;
  public msgLink2: any;
  sessionPopup: any;
  font: any;
  db: any;
  textMyan: any = ["ပင်မစာမျက်နှာ", "ကြိုက်သည်", "မှတ်ချက်", "ဝေမျှမည်", "ဒေတာ မရှိပါ။", "အကြောင်းအရာများ", "ဗီဒီယို", "တွေ့ဆုံမေးမြန်းခြင်း", "ကြည့်ရန်", "ခု"];
  textEng: any = ["Home", "Like", "Comment", "Share", "No result found", "Article", "Videos", "Interview", "View", "Count"];

  state: any = { "data": [{ "value": 1000000, "engCaption": "KACHIN", "myanCaption": "ကချင်", "flag": false, "code": "01000000" }, { "value": 2000000, "engCaption": "KAYAR", "myanCaption": "ကယား", "flag": false, "code": "02000000" }, { "value": 3000000, "engCaption": "KAYIN", "myanCaption": "ကရင်", "flag": false, "code": "03000000" }, { "value": 4000000, "engCaption": "CHIN", "myanCaption": "ချင်း", "flag": false, "code": "04000000" }, { "value": 5000000, "engCaption": "SAGAING", "myanCaption": "စစ်ကိုင်း", "flag": false, "code": "05000000" }, { "value": 6000000, "engCaption": "TANINTHARYI", "myanCaption": "တနင်္သာရီ", "flag": false, "code": "06000000" }, { "value": 7000000, "engCaption": "BAGO", "myanCaption": "ပဲခူး", "flag": false, "code": "07000000" }, { "value": 9000000, "engCaption": "MAGWE", "myanCaption": "မကွေး", "flag": false, "code": "09000000" }, { "value": 10000000, "engCaption": "MANDALAY", "myanCaption": "မန္တလေး", "flag": false, "code": "10000000" }, { "value": 11000000, "engCaption": "MON", "myanCaption": "မွန်", "flag": false, "code": "11000000" }, { "value": 12000000, "engCaption": "RAKHAING", "myanCaption": "ရခိုင်", "flag": false, "code": "12000000" }, { "value": 13000000, "engCaption": "YANGON", "myanCaption": "ရန်ကုန်", "flag": false, "code": "13000000" }, { "value": 14000000, "engCaption": "SHAN", "myanCaption": "ရှမ်း", "flag": false, "code": "14000000" }, { "value": 17000000, "engCaption": "AYARWADDY", "myanCaption": "ဧရာဝတီ", "flag": false, "code": "17000000" }, { "value": 18000000, "engCaption": "NAYPYITAW", "myanCaption": "နေပြည်တော်", "flag": false, "code": "18000000" }] };

  district: any = [{ "code": "01000000", "data": [{ "value": 0, "engCaption": "MYITKYINAR", "myanCaption": "မြစ်ကြီးနား", "flag": false, "code": "01001001" }, { "value": 0, "engCaption": "WINEMAW", "myanCaption": "ဝိုင်းမော်", "flag": false, "code": "01001002" }, { "value": 0, "engCaption": "MOEKAUNG", "myanCaption": "မိုးကောင်း", "flag": false, "code": "01001004" }, { "value": 0, "engCaption": "MOENYIN", "myanCaption": "မိုးညှင်း", "flag": false, "code": "01001005" }, { "value": 0, "engCaption": "PHARKANT", "myanCaption": "ဖားကန့်", "flag": false, "code": "01001006" }, { "value": 0, "engCaption": "TANAING", "myanCaption": "တနိုင်း", "flag": false, "code": "01001007" }, { "value": 0, "engCaption": "SAWTLAW", "myanCaption": "ဆော့လော", "flag": false, "code": "01001009" }, { "value": 0, "engCaption": "PUTARO", "myanCaption": "ပူတာအို", "flag": false, "code": "01003001" }, { "value": 0, "engCaption": "SONPRABON", "myanCaption": "ဆွမ်ပရာဘွမ်", "flag": false, "code": "01003002" }, { "value": 0, "engCaption": "MACHANBAW", "myanCaption": "မချမ်းဘော", "flag": false, "code": "01003003" }, { "value": 0, "engCaption": "NAUNGMOON", "myanCaption": "နောင်မွန်း", "flag": false, "code": "01003005" }, { "value": 0, "engCaption": "BAMAW", "myanCaption": "ဗန်းမော်", "flag": false, "code": "01002001" }, { "value": 0, "engCaption": "SHWEKU", "myanCaption": "ရှင်ကူ", "flag": false, "code": "01002002" }, { "value": 0, "engCaption": "MOEMAUTH", "myanCaption": "မိုးမိတ်", "flag": false, "code": "01002003" }, { "value": 0, "engCaption": "MANSI", "myanCaption": "မန်စီ", "flag": false, "code": "01002004" }] }, { "code": "02000000", "data": [{ "value": 0, "engCaption": "LOIKAW", "myanCaption": "လွိုင်ကော်", "flag": false, "code": "02001001" }, { "value": 0, "engCaption": "DIMAWSO", "myanCaption": "ဒီမောဆို", "flag": false, "code": "02001002" }, { "value": 0, "engCaption": "PHRUSO", "myanCaption": "ဖရူဆို", "flag": false, "code": "02001003" }, { "value": 0, "engCaption": "SHARTAW", "myanCaption": "ရှားတော", "flag": false, "code": "02001004" }, { "value": 0, "engCaption": "BAWLAKAE", "myanCaption": "ဘောလ်ခဲ", "flag": false, "code": "02002001" }, { "value": 0, "engCaption": "PHARSAUNG", "myanCaption": "ဖားဆောင်း", "flag": false, "code": "02002002" }, { "value": 0, "engCaption": "MAESAE", "myanCaption": "မယ်စဲ့", "flag": false, "code": "02002003" }] }, { "code": "03000000", "data": [{ "value": 0, "engCaption": "PHARAN", "myanCaption": "ဘားအံ", "flag": false, "code": "03001001" }, { "value": 0, "engCaption": "HLAINGBWE", "myanCaption": "လှိုင်းဘွဲ့", "flag": false, "code": "03001002" }, { "value": 0, "engCaption": "PHARPUN", "myanCaption": "ဖာပွန်", "flag": false, "code": "03001003" }, { "value": 0, "engCaption": "THANTAUNG", "myanCaption": "သံတောင်", "flag": false, "code": "03001004" }, { "value": 0, "engCaption": "KAWKARAIT", "myanCaption": "ကော့ကရိတ်", "flag": false, "code": "03002001" }, { "value": 0, "engCaption": "KYARINNSEIKGYI", "myanCaption": "ကြာအင်းဆိပ်ကြီး", "flag": false, "code": "03002002" }, { "value": 0, "engCaption": "MYAWADDI", "myanCaption": "မြ၀တီ", "flag": false, "code": "03003001" }] }, { "code": "04000000", "data": [{ "value": 0, "engCaption": "MINTUP", "myanCaption": "မင်းတပ်", "flag": false, "code": "04002001" }, { "value": 0, "engCaption": "MATUPI", "myanCaption": "မတူပီ", "flag": false, "code": "04002002" }, { "value": 0, "engCaption": "KANPALAT", "myanCaption": "ကန်ပက်လက်", "flag": false, "code": "04002003" }, { "value": 0, "engCaption": "PALATWA", "myanCaption": "ပလက်၀", "flag": false, "code": "04002004" }] }, { "code": "05000000", "data": [{ "value": 0, "engCaption": "SHWEBO", "myanCaption": "ရွှေဘို", "flag": false, "code": "05002001" }, { "value": 0, "engCaption": "KHINOO", "myanCaption": "ခင်ဦး", "flag": false, "code": "05002002" }, { "value": 0, "engCaption": "WETLAT", "myanCaption": "ဝက်လက်", "flag": false, "code": "05002003" }, { "value": 0, "engCaption": "KANTBALU", "myanCaption": "ကန့်ဘလူ", "flag": false, "code": "05002004" }, { "value": 0, "engCaption": "KYUNHLA", "myanCaption": "ကျွန်းလှ", "flag": false, "code": "05002005" }, { "value": 0, "engCaption": "YAEOO", "myanCaption": "ရေဦး", "flag": false, "code": "05002006" }, { "value": 0, "engCaption": "DIPEYIN", "myanCaption": "ဒီပဲယင်း", "flag": false, "code": "05002007" }, { "value": 0, "engCaption": "TANTSAE", "myanCaption": "တန့်ဆည်", "flag": false, "code": "05002008" }, { "value": 0, "engCaption": "KATHAR", "myanCaption": "ကသာ", "flag": false, "code": "05004001" }, { "value": 0, "engCaption": "INNTAW", "myanCaption": "အင်းတော်", "flag": false, "code": "05004002" }, { "value": 0, "engCaption": "HTEECHAINT", "myanCaption": "ထီးချိုင့်", "flag": false, "code": "05004003" }, { "value": 0, "engCaption": "BANMOUTH", "myanCaption": "ဗန်းမောက်", "flag": false, "code": "05004004" }, { "value": 0, "engCaption": "KAWLIN", "myanCaption": "ကောလင်း", "flag": false, "code": "05004005" }, { "value": 0, "engCaption": "WUNTHYO", "myanCaption": "၀န်းသို", "flag": false, "code": "05004006" }, { "value": 0, "engCaption": "PINLAEBU", "myanCaption": "ပင်လယ်ဘူး", "flag": false, "code": "05004007" }, { "value": 0, "engCaption": "KALAY", "myanCaption": "ကလေး", "flag": false, "code": "05005001" }, { "value": 0, "engCaption": "KALAYWA", "myanCaption": "ကလေး၀", "flag": false, "code": "05005002" }, { "value": 0, "engCaption": "MINKIN", "myanCaption": "မင်းကင်း", "flag": false, "code": "05005003" }, { "value": 0, "engCaption": "KHANTEE", "myanCaption": "ခန္တီး", "flag": false, "code": "05006001" }, { "value": 0, "engCaption": "HONMALIN", "myanCaption": "ဟုမ္မလင်း", "flag": false, "code": "05006002" }, { "value": 0, "engCaption": "LAHAE", "myanCaption": "လဟယ်", "flag": false, "code": "05006004" }, { "value": 0, "engCaption": "MAWLIKE", "myanCaption": "မော်လိုက်", "flag": false, "code": "05007001" }, { "value": 0, "engCaption": "PHAUNGPYIN", "myanCaption": "ဖောင်းပြင်", "flag": false, "code": "05007002" }, { "value": 0, "engCaption": "MONYWAR", "myanCaption": "မုံရွာ", "flag": false, "code": "05003001" }, { "value": 0, "engCaption": "BUTALIN", "myanCaption": "ဘုတလင်", "flag": false, "code": "05003002" }, { "value": 0, "engCaption": "AHYARTAW", "myanCaption": "အရာတော်", "flag": false, "code": "05003003" }, { "value": 0, "engCaption": "CHAUNGOO", "myanCaption": "ချောင်းဦး", "flag": false, "code": "05003004" }, { "value": 0, "engCaption": "YINMARPIN", "myanCaption": "ယင်းမာပင်", "flag": false, "code": "05003005" }, { "value": 0, "engCaption": "KANI", "myanCaption": "ကနီ", "flag": false, "code": "05003006" }, { "value": 0, "engCaption": "SARLINGYI", "myanCaption": "ဆားလင်းကြီး", "flag": false, "code": "05003007" }, { "value": 0, "engCaption": "PEARL", "myanCaption": "ပုလဲ", "flag": false, "code": "05003008" }, { "value": 0, "engCaption": "TAMU", "myanCaption": "တမူး", "flag": false, "code": "05008001" }] }, { "code": "06000000", "data": [{ "value": 0, "engCaption": "DAWEI", "myanCaption": "ထား၀ယ်", "flag": false, "code": "06001001" }, { "value": 0, "engCaption": "LAUNGLON", "myanCaption": "လောင်းလုံ", "flag": false, "code": "06001002" }, { "value": 0, "engCaption": "THAYETCHAUNG", "myanCaption": "သရက်ချောင်း", "flag": false, "code": "06001003" }, { "value": 0, "engCaption": "YAYPHYU", "myanCaption": "ရေဖြူ", "flag": false, "code": "06001004" }, { "value": 0, "engCaption": "KAWTHAUNG", "myanCaption": "ကော့သောင်း", "flag": false, "code": "06003001" }, { "value": 0, "engCaption": "BOTEPYIN", "myanCaption": "ဘုတ်ပျင်း", "flag": false, "code": "06003002" }] }, { "code": "07000000", "data": [{ "value": 0, "engCaption": "BAGO", "myanCaption": "ပဲခူး", "flag": false, "code": "07001001" }, { "value": 0, "engCaption": "THANUTPIN", "myanCaption": "သနပ်ပင်", "flag": false, "code": "07001002" }, { "value": 0, "engCaption": "KAWA", "myanCaption": "က၀", "flag": false, "code": "07001003" }, { "value": 0, "engCaption": "WAW", "myanCaption": "ဝေါ", "flag": false, "code": "07001004" }, { "value": 0, "engCaption": "NYAUNGLAYPIN", "myanCaption": "ညောင်လေးပင်", "flag": false, "code": "07001005" }, { "value": 0, "engCaption": "KYAUKTAKHAR", "myanCaption": "ကျောက်တံခါး", "flag": false, "code": "07001006" }, { "value": 0, "engCaption": "DIKEOO", "myanCaption": "ဒိုက်ဦး", "flag": false, "code": "07001007" }, { "value": 0, "engCaption": "SHWEKYIN", "myanCaption": "ရွှေကျင်", "flag": false, "code": "07001008" }, { "value": 0, "engCaption": "TAUNGOO", "myanCaption": "တောင်ငူ", "flag": false, "code": "07002001" }, { "value": 0, "engCaption": "YAYTARSHAE", "myanCaption": "ရေတာရှည်", "flag": false, "code": "07002002" }, { "value": 0, "engCaption": "KYAUKGYI", "myanCaption": "ကျောက်ကြီး", "flag": false, "code": "07002003" }, { "value": 0, "engCaption": "PHYU", "myanCaption": "ဖြူး", "flag": false, "code": "07002004" }, { "value": 0, "engCaption": "OAKTWIN", "myanCaption": "အုတ်တွင်း", "flag": false, "code": "07002005" }, { "value": 0, "engCaption": "HTANTAPIN", "myanCaption": "ထန်းတပင်", "flag": false, "code": "07002006" }] }, { "code": "09000000", "data": [{ "value": 0, "engCaption": "MAGWE", "myanCaption": "မကွေး", "flag": false, "code": "09001001" }, { "value": 0, "engCaption": "YAYNANCHAUNG", "myanCaption": "ရေနံချောင်း", "flag": false, "code": "09001002" }, { "value": 0, "engCaption": "CHAUK", "myanCaption": "ချောက်", "flag": false, "code": "09001003" }, { "value": 0, "engCaption": "TAUNGTWINGYI", "myanCaption": "တောင်တွင်းကြီး", "flag": false, "code": "09001004" }, { "value": 0, "engCaption": "MYOTHIT", "myanCaption": "မြို့သစ်", "flag": false, "code": "09001005" }, { "value": 0, "engCaption": "NATMAUK", "myanCaption": "နတ်မောက်", "flag": false, "code": "09001006" }, { "value": 0, "engCaption": "PAKOKKU", "myanCaption": "ပခုက္ကူ", "flag": false, "code": "09004001" }, { "value": 0, "engCaption": "YAYSAKYO", "myanCaption": "ရေစကြို", "flag": false, "code": "09004002" }, { "value": 0, "engCaption": "MYAING", "myanCaption": "မြိုင်", "flag": false, "code": "09004003" }, { "value": 0, "engCaption": "PAUK", "myanCaption": "ပေါက်", "flag": false, "code": "09004004" }, { "value": 0, "engCaption": "SEIKPHYU", "myanCaption": "ဆိပ်ဖြူ", "flag": false, "code": "09004005" }, { "value": 0, "engCaption": "THAYET", "myanCaption": "သရက်", "flag": false, "code": "09003001" }, { "value": 0, "engCaption": "MINHLA", "myanCaption": "မင်းလှ", "flag": false, "code": "09003002" }, { "value": 0, "engCaption": "MINTONE", "myanCaption": "မင်းတုန်း", "flag": false, "code": "09003003" }, { "value": 0, "engCaption": "KANMA", "myanCaption": "ကံမ", "flag": false, "code": "09003004" }, { "value": 0, "engCaption": "AUNGLAN", "myanCaption": "အောင်လံ", "flag": false, "code": "09003005" }, { "value": 0, "engCaption": "SINPAUNGWAE", "myanCaption": "ဆင်ပေါင်ဝဲ", "flag": false, "code": "09003006" }, { "value": 0, "engCaption": "MINBU", "myanCaption": "မင်းဘူး", "flag": false, "code": "09002001" }, { "value": 0, "engCaption": "PWINTPHYU", "myanCaption": "ပွင့်ဖြူ", "flag": false, "code": "09002002" }, { "value": 0, "engCaption": "SALIN", "myanCaption": "စလင်း", "flag": false, "code": "09002004" }, { "value": 0, "engCaption": "SAYTOTETAYAR", "myanCaption": "စေတုတ္တရာ", "flag": false, "code": "09002005" }, { "value": 0, "engCaption": "SAW", "myanCaption": "ဆော", "flag": false, "code": "09005001" }, { "value": 0, "engCaption": "GANTGAW", "myanCaption": "ဂံ့ဂေါ", "flag": false, "code": "09005002" }, { "value": 0, "engCaption": "HTEELIN", "myanCaption": "ထီးလင်း", "flag": false, "code": "09005003" }] }, { "code": "10000000", "data": [{ "value": 0, "engCaption": "CHANMYATHARSI", "myanCaption": "ချမ်းမြသာစည်", "flag": false, "code": "10001001" }, { "value": 0, "engCaption": "AUNGMYAYTHARZAN", "myanCaption": "အောင်မြေသာဇံ", "flag": false, "code": "10001002" }, { "value": 0, "engCaption": "MAHARAUNGMYAY", "myanCaption": "မဟာအောင်မြေ", "flag": false, "code": "10001003" }, { "value": 0, "engCaption": "CHANAYETHARZAN", "myanCaption": "ချမ်းအေးသာစံ", "flag": false, "code": "10001004" }, { "value": 0, "engCaption": "PYAYGYITAGON", "myanCaption": "ပြည်ကြီးတံခွန်", "flag": false, "code": "10001005" }, { "value": 0, "engCaption": "AHMAYAPURA", "myanCaption": "အမရပူရ", "flag": false, "code": "10001006" }, { "value": 0, "engCaption": "PATHEINGYI", "myanCaption": "ပုသိမ်ကြီး", "flag": false, "code": "10001007" }, { "value": 0, "engCaption": "PYINOOLWIN", "myanCaption": "ပြင်ဦးလွင်", "flag": false, "code": "10002001" }, { "value": 0, "engCaption": "MATAYAR", "myanCaption": "မတ္တရာ", "flag": false, "code": "10002002" }, { "value": 0, "engCaption": "SINTKU", "myanCaption": "စဉ့်ကူ", "flag": false, "code": "10002003" }, { "value": 0, "engCaption": "MOEGYOKE", "myanCaption": "မိုးကုတ်", "flag": false, "code": "10002004" }, { "value": 0, "engCaption": "THAPATEKYIN", "myanCaption": "သပိတ်ကျင်း", "flag": false, "code": "10002005" }, { "value": 0, "engCaption": "KYAUKSAE", "myanCaption": "ကျောက်ဆည်", "flag": false, "code": "10003001" }, { "value": 0, "engCaption": "SINTKAING", "myanCaption": "စဉ့်ကိုင်", "flag": false, "code": "10003002" }, { "value": 0, "engCaption": "MYITTHAR", "myanCaption": "မြစ်သား", "flag": false, "code": "10003003" }, { "value": 0, "engCaption": "TATAROO", "myanCaption": "တံတားဦး", "flag": false, "code": "10003004" }, { "value": 0, "engCaption": "MYINCHAN", "myanCaption": "မြင်းခြံ", "flag": false, "code": "10004001" }, { "value": 0, "engCaption": "TAUNGTHAR", "myanCaption": "တောင်သာ", "flag": false, "code": "10004002" }, { "value": 0, "engCaption": "NWARHTOGYI", "myanCaption": "နွားထိုးကြီး", "flag": false, "code": "10004003" }, { "value": 0, "engCaption": "KYAUKPATAUNG", "myanCaption": "ကျောက်ပန်းတောင်း", "flag": false, "code": "10004004" }, { "value": 0, "engCaption": "NYANZUN", "myanCaption": "ငန်းဇွန်", "flag": false, "code": "10004005" }, { "value": 0, "engCaption": "MEIKHTILAR", "myanCaption": "မိတ္ထီလာ", "flag": false, "code": "10006001" }, { "value": 0, "engCaption": "MAHLAING", "myanCaption": "မလိုင်", "flag": false, "code": "10006002" }, { "value": 0, "engCaption": "THARSI", "myanCaption": "သာစည်", "flag": false, "code": "10006003" }, { "value": 0, "engCaption": "WANTWIN", "myanCaption": "၀မ်းတွင်း", "flag": false, "code": "10006004" }, { "value": 0, "engCaption": "NYAUNGOO", "myanCaption": "ညောင်ဦး", "flag": false, "code": "10007001" }, { "value": 0, "engCaption": "YAMAETHIN", "myanCaption": "ရမည်းသင်း", "flag": false, "code": "10005001" }, { "value": 0, "engCaption": "PYAWBWE", "myanCaption": "ပျော်ဘွယ်", "flag": false, "code": "10005002" }, { "value": 0, "engCaption": "TUPKONE", "myanCaption": "တပ်ကုန်း", "flag": false, "code": "10005003" }, { "value": 0, "engCaption": "PYINMANAR", "myanCaption": "ပျဉ်းမနား", "flag": false, "code": "10005004" }, { "value": 0, "engCaption": "LAEWAY", "myanCaption": "လယ်ဝေး", "flag": false, "code": "10005005" }] }, { "code": "11000000", "data": [{ "value": 0, "engCaption": "MAWLAMYAING", "myanCaption": "မော်လမြိုင်", "flag": false, "code": "11001001" }, { "value": 0, "engCaption": "KYAIKMAYAW", "myanCaption": "ကျိုက်မရော", "flag": false, "code": "11001002" }, { "value": 0, "engCaption": "CHAUNGSON", "myanCaption": "ချောင်းဆုံ", "flag": false, "code": "11001003" }, { "value": 0, "engCaption": "THANPHYUZAYAT", "myanCaption": "သံဖြူဇရပ်", "flag": false, "code": "11001004" }, { "value": 0, "engCaption": "MUDON", "myanCaption": "မုဒုံ", "flag": false, "code": "11001005" }, { "value": 0, "engCaption": "YAY", "myanCaption": "ရေး", "flag": false, "code": "11001006" }, { "value": 0, "engCaption": "THAHTON", "myanCaption": "သထုံ", "flag": false, "code": "11002001" }, { "value": 0, "engCaption": "PAUNG", "myanCaption": "ပေါင်", "flag": false, "code": "11002002" }, { "value": 0, "engCaption": "KYEIKEHTO", "myanCaption": "ကျိုက်ထို", "flag": false, "code": "11002003" }, { "value": 0, "engCaption": "BEELIN", "myanCaption": "ဘီးလင်း", "flag": false, "code": "11002004" }] }, { "code": "12000000", "data": [{ "value": 0, "engCaption": "SITTWE", "myanCaption": "စစ်တွေ", "flag": false, "code": "12001001" }, { "value": 0, "engCaption": "PONNARKYUN", "myanCaption": "ပုဏ္ဏားကျွန်း", "flag": false, "code": "12001002" }, { "value": 0, "engCaption": "PAUKTAW", "myanCaption": "ပေါက်တော", "flag": false, "code": "12001003" }, { "value": 0, "engCaption": "MYAYPONE", "myanCaption": "မြေပုံ", "flag": false, "code": "12001004" }, { "value": 0, "engCaption": "KYAUKTAW", "myanCaption": "ကျောက်တော်", "flag": false, "code": "12001005" }, { "value": 0, "engCaption": "MYAUKOO", "myanCaption": "မြောက်ဦး", "flag": false, "code": "12001006" }, { "value": 0, "engCaption": "MINPYAR", "myanCaption": "မင်းပြား", "flag": false, "code": "12001007" }, { "value": 0, "engCaption": "YATHAYTAUNG", "myanCaption": "ရသေ့တောင်", "flag": false, "code": "12001008" }, { "value": 0, "engCaption": "MAUNGTAW", "myanCaption": "မောင်းတော", "flag": false, "code": "12002001" }, { "value": 0, "engCaption": "BUTHEETAUNG", "myanCaption": "ဘူးသီးတောင်", "flag": false, "code": "12002002" }, { "value": 0, "engCaption": "KYAUKPHYU", "myanCaption": "ကျောက်ဖြူ", "flag": false, "code": "12003001" }, { "value": 0, "engCaption": "YANBYAE", "myanCaption": "ရမ်းဗြဲ", "flag": false, "code": "12003002" }, { "value": 0, "engCaption": "MANAUNG", "myanCaption": "မြန်အောင်", "flag": false, "code": "12003003" }, { "value": 0, "engCaption": "ANN", "myanCaption": "အမ်း", "flag": false, "code": "12003004" }, { "value": 0, "engCaption": "THANTWE", "myanCaption": "သံတွဲ", "flag": false, "code": "12004001" }, { "value": 0, "engCaption": "TAUNGKOTE", "myanCaption": "တောင်ကုတ်", "flag": false, "code": "12004002" }, { "value": 0, "engCaption": "GWA", "myanCaption": "ဂွ", "flag": false, "code": "12004003" }] }, { "code": "13000000", "data": [{ "value": 0, "engCaption": "THINGANGYUN", "myanCaption": "သင်္ဃန်းကျွန်း", "flag": false, "code": "13001001" }, { "value": 0, "engCaption": "MINGALARTAUNGNYUNT", "myanCaption": "မင်္ဂလာတောင်ညွန့်", "flag": false, "code": "13001002" }, { "value": 0, "engCaption": "TAMWE", "myanCaption": "တာမွေ", "flag": false, "code": "13001003" }, { "value": 0, "engCaption": "SOUTHOKKALARPA", "myanCaption": "တောင်ဥက္ကလာ", "flag": false, "code": "13001004" }, { "value": 0, "engCaption": "NORTHOKKALARPA", "myanCaption": "မြောက်ဥက္ကလာ", "flag": false, "code": "13001005" }, { "value": 0, "engCaption": "PAZUNTAUNG", "myanCaption": "ပုဇွန်တောင်", "flag": false, "code": "13001006" }, { "value": 0, "engCaption": "DAWPONE", "myanCaption": "ဒေါပုံ", "flag": false, "code": "13001007" }, { "value": 0, "engCaption": "BOTATAUNG", "myanCaption": "ဗိုလ်တထောင်", "flag": false, "code": "13001008" }, { "value": 0, "engCaption": "YANKIN", "myanCaption": "ရန်ကင်း", "flag": false, "code": "13001009" }, { "value": 0, "engCaption": "THARKAYTA", "myanCaption": "သာကေတ", "flag": false, "code": "13001010" }, { "value": 0, "engCaption": "DAGON(SOUTH)", "myanCaption": "ဒဂုံ(တောင်)", "flag": false, "code": "13001011" }, { "value": 0, "engCaption": "DAGON(NORTH)", "myanCaption": "ဒဂုံ(မြောက်)", "flag": false, "code": "13001012" }, { "value": 0, "engCaption": "DAGON(SEIKKAN)", "myanCaption": "ဒဂုံ(ဆိပ်ကမ်း)", "flag": false, "code": "13001013" }, { "value": 0, "engCaption": "DAGON(EAST)", "myanCaption": "ဒဂုံအရှေ့", "flag": false, "code": "13001014" }, { "value": 0, "engCaption": "THANLYIN", "myanCaption": "သန်လျင်", "flag": false, "code": "13003001" }, { "value": 0, "engCaption": "KHAYAN", "myanCaption": "ခရမ်း", "flag": false, "code": "13003002" }, { "value": 0, "engCaption": "THONEGWA", "myanCaption": "သုံးခွ", "flag": false, "code": "13003003" }, { "value": 0, "engCaption": "KYAUKTAN", "myanCaption": "ကျောက်တန်း", "flag": false, "code": "13003004" }, { "value": 0, "engCaption": "KAWTMU", "myanCaption": "ကော့မှုး", "flag": false, "code": "13003005" }, { "value": 0, "engCaption": "KWUNCHANKONE", "myanCaption": "ကွမ်းခြံကုန်း", "flag": false, "code": "13003006" }, { "value": 0, "engCaption": "TWUNTAY", "myanCaption": "တွံတေး", "flag": false, "code": "13003007" }, { "value": 0, "engCaption": "DALA", "myanCaption": "ဒလ", "flag": false, "code": "13003008" }, { "value": 0, "engCaption": "SEIKKYIKHANAUNGTO", "myanCaption": "ဆိပ်ကြီးခနောင်တို", "flag": false, "code": "13003009" }, { "value": 0, "engCaption": "KOKOKYUN", "myanCaption": "ကိုကိုးကျွန်း", "flag": false, "code": "13003010" }, { "value": 0, "engCaption": "INSEIN", "myanCaption": "အင်းစိန်", "flag": false, "code": "13004001" }, { "value": 0, "engCaption": "MINGALARDON", "myanCaption": "မင်္ဂလာဒုံ", "flag": false, "code": "13004002" }, { "value": 0, "engCaption": "TIKEKYI", "myanCaption": "တိုက်ကြီး", "flag": false, "code": "13004003" }, { "value": 0, "engCaption": "HTANTAPIN", "myanCaption": "ထန်းတပင်", "flag": false, "code": "13004004" }, { "value": 0, "engCaption": "MAWBI", "myanCaption": "မှော်ဘီ", "flag": false, "code": "13004005" }, { "value": 0, "engCaption": "HLEGU", "myanCaption": "လှည်းကူး", "flag": false, "code": "13004006" }, { "value": 0, "engCaption": "SHWEPYITHAR", "myanCaption": "ရွှေပြည်သာ", "flag": false, "code": "13004007" }, { "value": 0, "engCaption": "HLAINGTHARYAR", "myanCaption": "လှိုင်သာယာ", "flag": false, "code": "13004008" }, { "value": 0, "engCaption": "MAYANGONE", "myanCaption": "မရမ်းကုန်း", "flag": false, "code": "13002001" }, { "value": 0, "engCaption": "HLAING", "myanCaption": "လှိုင်", "flag": false, "code": "13002002" }, { "value": 0, "engCaption": "KAMAYUT", "myanCaption": "ကမာရွတ်", "flag": false, "code": "13002003" }, { "value": 0, "engCaption": "KYIMYINDAING", "myanCaption": "ကြည့်မြင်တိုင်", "flag": false, "code": "13002004" }, { "value": 0, "engCaption": "SANCHAUNG", "myanCaption": "စမ်းချောင်း", "flag": false, "code": "13002005" }, { "value": 0, "engCaption": "AHLONE", "myanCaption": "အလုံ", "flag": false, "code": "13002006" }, { "value": 0, "engCaption": "BAHAN", "myanCaption": "ဗဟန်း", "flag": false, "code": "13002007" }, { "value": 0, "engCaption": "DAGON", "myanCaption": "ဒဂုံ", "flag": false, "code": "13002008" }, { "value": 0, "engCaption": "LANMADAW", "myanCaption": "လမ်းမတော်", "flag": false, "code": "13002009" }, { "value": 0, "engCaption": "LATHA", "myanCaption": "လသာ", "flag": false, "code": "13002010" }, { "value": 0, "engCaption": "PABEDAN", "myanCaption": "ပန်းဘဲတန်း", "flag": false, "code": "13002011" }, { "value": 0, "engCaption": "KYAUKTATAR", "myanCaption": "ကျောက်တံတား", "flag": false, "code": "13002012" }, { "value": 0, "engCaption": "SEIKKAN", "myanCaption": "ဆိပ်ကမ်း", "flag": false, "code": "13002013" }] }, { "code": "14000000", "data": [{ "value": 0, "engCaption": "TAUNGGYI", "myanCaption": "တောင်ကြီး", "flag": false, "code": "14001001" }, { "value": 0, "engCaption": "HOPONE", "myanCaption": "ဟိုပုန်း", "flag": false, "code": "14001002" }, { "value": 0, "engCaption": "NYAUNGSHWE", "myanCaption": "ညောင်ရွှေ", "flag": false, "code": "14001003" }, { "value": 0, "engCaption": "SISAING", "myanCaption": "ဆီဆိုင်", "flag": false, "code": "14001004" }, { "value": 0, "engCaption": "KALAW", "myanCaption": "ကလော", "flag": false, "code": "14001005" }, { "value": 0, "engCaption": "PINTAYA", "myanCaption": "ပင်းတယ", "flag": false, "code": "14001006" }, { "value": 0, "engCaption": "YWARNYAN", "myanCaption": "ရွာငံ", "flag": false, "code": "14001007" }, { "value": 0, "engCaption": "YATSAUT", "myanCaption": "ရပ်စောက်", "flag": false, "code": "14001008" }, { "value": 0, "engCaption": "PINLAUNG", "myanCaption": "ပင်လောင်း", "flag": false, "code": "14001009" }, { "value": 0, "engCaption": "PAEKHONE", "myanCaption": "ဖယ်ခုံ", "flag": false, "code": "14001010" }, { "value": 0, "engCaption": "LOILIN", "myanCaption": "လွိုင်လင်", "flag": false, "code": "14002001" }, { "value": 0, "engCaption": "LAECHAR", "myanCaption": "လဲချား", "flag": false, "code": "14002002" }, { "value": 0, "engCaption": "NANTSAN(SOUTH)", "myanCaption": "နမ့်ဆမ်(တောင်)", "flag": false, "code": "14002003" }, { "value": 0, "engCaption": "MOENAE", "myanCaption": "မိုးနဲ", "flag": false, "code": "14002004" }, { "value": 0, "engCaption": "KUNHEIN", "myanCaption": "ကွန်ဟိန်း", "flag": false, "code": "14002005" }, { "value": 0, "engCaption": "LINKHAY", "myanCaption": "လင်းခေး", "flag": false, "code": "14002006" }, { "value": 0, "engCaption": "MAUTMAE", "myanCaption": "မောက်မယ်", "flag": false, "code": "14002007" }, { "value": 0, "engCaption": "MINEPAN", "myanCaption": "မိုင်းပမ်", "flag": false, "code": "14002008" }, { "value": 0, "engCaption": "KYAYTHEE", "myanCaption": "ကျေးသီး", "flag": false, "code": "14002009" }, { "value": 0, "engCaption": "MINEKAING", "myanCaption": "မိုင်းကိုင်", "flag": false, "code": "14002010" }, { "value": 0, "engCaption": "MINESHOE", "myanCaption": "မိုင်းရှုး", "flag": false, "code": "14002011" }] }, { "code": "17000000", "data": [{ "value": 0, "engCaption": "PATHEIN", "myanCaption": "ပုသိမ်", "flag": false, "code": "17001001" }, { "value": 0, "engCaption": "KANGYIDAUNT", "myanCaption": "ကန်ကြီးဒေါင့်", "flag": false, "code": "17001002" }, { "value": 0, "engCaption": "THARPAUNG", "myanCaption": "သာပေါင်း", "flag": false, "code": "17001003" }, { "value": 0, "engCaption": "NGAPUTAW", "myanCaption": "ငပုတော", "flag": false, "code": "17001004" }, { "value": 0, "engCaption": "KYONEPYAW", "myanCaption": "ကြုံပျော်", "flag": false, "code": "17001005" }, { "value": 0, "engCaption": "YAYKYI", "myanCaption": "ရေကြည်", "flag": false, "code": "17001006" }, { "value": 0, "engCaption": "KYAUNGKONE", "myanCaption": "ကျောင်းကုန်း", "flag": false, "code": "17001007" }, { "value": 0, "engCaption": "HINTHARDA", "myanCaption": "ဟင်္သာတ", "flag": false, "code": "17002001" }, { "value": 0, "engCaption": "ZALON", "myanCaption": "ဇလွန်", "flag": false, "code": "17002002" }, { "value": 0, "engCaption": "LAYMYATNYAR", "myanCaption": "လေးမျက်နှာ", "flag": false, "code": "17002003" }, { "value": 0, "engCaption": "MYANAUNG", "myanCaption": "မြန်အောင်", "flag": false, "code": "17002004" }, { "value": 0, "engCaption": "KYANKHIN", "myanCaption": "ကြံခင်း", "flag": false, "code": "17002005" }, { "value": 0, "engCaption": "INGAPU", "myanCaption": "အင်္ဂပူ", "flag": false, "code": "17002006" }, { "value": 0, "engCaption": "MYAUNGMYA", "myanCaption": "မြောင်းမြ", "flag": false, "code": "17003001" }, { "value": 0, "engCaption": "EINMAE", "myanCaption": "အိမ်မဲ", "flag": false, "code": "17003002" }, { "value": 0, "engCaption": "LATTPUTTAR", "myanCaption": "လပွတ္တာ", "flag": false, "code": "17003003" }, { "value": 0, "engCaption": "WARKHAEMA", "myanCaption": "ဝါးခယ်မ", "flag": false, "code": "17003004" }, { "value": 0, "engCaption": "MAWLAMYAINGKYUN", "myanCaption": "မော်လမြိုင်ကျွန်း", "flag": false, "code": "17003005" }, { "value": 0, "engCaption": "PYARPONE", "myanCaption": "ဖျာပုံ", "flag": false, "code": "17005001" }, { "value": 0, "engCaption": "BOKALAY", "myanCaption": "ဘိုကလေး", "flag": false, "code": "17005002" }, { "value": 0, "engCaption": "KYAIKLATT", "myanCaption": "ကျိုက်လတ်", "flag": false, "code": "17005003" }, { "value": 0, "engCaption": "DAYDAYE", "myanCaption": "ဒေးဒရဲ", "flag": false, "code": "17005004" }, { "value": 0, "engCaption": "MAAUPIN", "myanCaption": "မအူပင်", "flag": false, "code": "17004001" }, { "value": 0, "engCaption": "PANTANAW", "myanCaption": "ပန်းတနော်", "flag": false, "code": "17004002" }, { "value": 0, "engCaption": "NYAUNGTONE", "myanCaption": "ညောင်တုန်း", "flag": false, "code": "17004003" }, { "value": 0, "engCaption": "DANUPHYU", "myanCaption": "ဓနုဖြူ", "flag": false, "code": "17004004" }] }, { "code": "18000000", "data": [{ "value": 0, "engCaption": "PYINMANA", "myanCaption": "ပျဉ်းမနား", "flag": false, "code": "18001001" }, { "value": 0, "engCaption": "LEWE", "myanCaption": "လယ်ဝေး", "flag": false, "code": "18001002" }, { "value": 0, "engCaption": "TATKONE", "myanCaption": "တပ်ကုန်း", "flag": false, "code": "18001003" }, { "value": 0, "engCaption": "ZABUTHIRI", "myanCaption": "ဇဗ္ဗူသီရိ", "flag": false, "code": "18001004" }, { "value": 0, "engCaption": "OUTARATHIRI", "myanCaption": "ဥတ္တရသီရိ", "flag": false, "code": "18001005" }, { "value": 0, "engCaption": "POBBATHIRI", "myanCaption": "ပုဗ္ဗသီရိ", "flag": false, "code": "18001006" }, { "value": 0, "engCaption": "DATKHINATHIRI", "myanCaption": "ဒက္ခိဏသီရိ", "flag": false, "code": "18001007" }, { "value": 0, "engCaption": "ZAYARTHIRI", "myanCaption": "ဇေယျာသီရိ", "flag": false, "code": "18001008" }, { "value": 0, "engCaption": "NAYPYITAW", "myanCaption": "နေပြည်တော်", "flag": false, "code": "18001009" }] }];
  constructor(public datepipe: DatePipe, public sqlite: SQLite, public sanitizer: DomSanitizer,
    public storage: Storage/*,public navCtrl: NavController,public alert: AlertController,
              public platform:Platform*/) {

    //  apk

    this.ipaddress1 = "https://b2bservice.azurewebsites.net/api/v1/";
    this.ipaddress2 = "https://b2bservice.azurewebsites.net/api/v1/";
    this.imglink = "https://cmsb2b.azurewebsites.net/"; 

    // PE

    // this.ipaddress1 = "http://192.168.210.74:8080/b2bservice/api/v1/";
    // this.ipaddress2 = "http://192.168.210.74:8080/b2bservice/api/v1/";
    // this.imglink = "http://192.168.210.74:8090/cmsb2b/";

    // this.ipaddress1 = "http://192.168.210.74:9070/b2bservice/api/v1/";
    // this.ipaddress2 = "http://192.168.210.74:9070/b2bservice/api/v1/";
    // this.imglink =  "http://192.168.210.74:8090/cmsb2b/"; 

    console.log('Hello FunctProvider Provider');

    this.storage.get('language').then((font) => {
      if (font != "zg")
        this.font = 'uni';
      else
        this.font = font;
    });
  }

  setUuid(uuid) {
    this.uuid = uuid;
  }

  getUuid() {
    return Promise.resolve(this.uuid);
  }

  setLocation(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  getTransformDate(date) {
    if (date != null && date != '' && date != undefined) {
      const dt = date.substring(0, 4) + '/' + date.substring(4, 6) + "/" + date.substring(6, 8);
      const tranDate = this.datepipe.transform(dt, 'MMM dd yyyy');
      return tranDate;
    }
    else {
      const tranDate = '';
      return tranDate;
    }
  }

  getTimeTransformDate(time) {
    console.log("server time == " + time);
    const hour = time.substring(0, 2);
    const minute = time.substring(2, 4);
    let ampm = 'AM', lhour;

    console.log("hour == " + hour + " // minute == " + minute);
    if (hour == '00' && minute == '00') {
      lhour = 12;
    }
    else if (parseInt(hour) >= 12) {
      ampm = 'PM';
      if (parseInt(hour) > 12) {
        lhour = parseInt(hour) - 12;
      }
      else {
        lhour = hour;
      }
    }
    else {
      lhour = hour;
    }
    console.log("final changetime == " + lhour + ':' + minute + ' ' + ampm);
    return lhour + ':' + minute + ' ' + ampm;
  }

  getChangeCount(count) {
    let myanCount = count.toString();
    let strlength = myanCount.length;
    let temp;

    for (let i = 0; i < strlength; i++) {
      if (myanCount.indexOf("1") > -1) {
        temp = myanCount.replace("1", "၁");
        myanCount = temp;
      }
      if (myanCount.indexOf("2") > -1) {
        temp = myanCount.replace("2", "၂");
        myanCount = temp;
      }
      if (myanCount.indexOf("3") > -1) {
        temp = myanCount.replace("3", "၃");
        myanCount = temp;
      }
      if (myanCount.indexOf("4") > -1) {
        temp = myanCount.replace("4", "၄");
        myanCount = temp;
      }
      if (myanCount.indexOf("5") > -1) {
        temp = myanCount.replace("5", "၅");
        myanCount = temp;
      }
      if (myanCount.indexOf("6") > -1) {
        temp = myanCount.replace("6", "၆");
        myanCount = temp;
      }
      if (myanCount.indexOf("7") > -1) {
        temp = myanCount.replace("7", "၇");
        myanCount = temp;
      }
      if (myanCount.indexOf("8") > -1) {
        temp = myanCount.replace("8", "၈");
        myanCount = temp;
      }
      if (myanCount.indexOf("9") > -1) {
        temp = myanCount.replace("9", "၉");
        myanCount = temp;
      }
      if (myanCount.indexOf("0") > -1) {
        temp = myanCount.replace("0", "၀");
        myanCount = temp;
      }
    }
    console.log("count == " + myanCount);
    return myanCount;
  }

  corrigirUrlYoutube(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  getTimeDifference(date, time) {
    console.log("date == " + date);
    console.log("time == " + time);

    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);

    let serverdate = month + '/' + day + '/' + year;
    //system date

    let today = new Date();
    let thour = today.getHours();
    let tmin = today.getMinutes();

    let temp = this.datepipe.transform(today, 'MM/dd/yyyy');
    let aa = new Date(temp);
    let bb = new Date(serverdate);

    let timeDiff = Math.abs(aa.getTime() - bb.getTime());
    let diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    console.log("temp == " + temp + "serverdate == " + serverdate);
    console.log("diffDays == " + diffDays);
    console.log("thour == " + thour);
    let dtime;
    let parm;
    let arr, arr1;

    if (diffDays > 0) {
      if (diffDays == 7) {
        dtime = Math.floor(diffDays / 7);
        parm = "W";
      }
      else if (diffDays > 7) {
        dtime = '';
        parm = "W";
      }
      else {
        dtime = diffDays;
        parm = 'd';
      }
    }
    else {
      let full;
      arr = time.replace(':', ' ');
      arr1 = arr.split(' ');
      if (arr1[2] == 'pm' || arr1[2] == 'PM') {

        if (parseInt(arr1[0]) == 12) {
          full = parseInt(arr1[0]);
        }
        else {
          full = parseInt(arr1[0]) + 12;
        }
      }
      else {
        full = parseInt(arr1[0]);
      }
      console.log("full == " + full);

      let tal = (full * 3600) + (parseInt(arr1[1]) * 60);
      console.log("tal == " + tal);

      let ee = (thour * 3600) + (tmin * 60);
      console.log("ee == " + ee);

      dtime = Math.floor((ee - tal) / 60);

      console.log("dtime dtime == " + dtime);
      if (dtime == 0 || dtime < 0) {
        dtime = '';
        parm = 'Just now';
      }
      else if (dtime >= 60) {
        dtime = Math.floor(dtime / 60);
        parm = 'h';
      }
      else {
        parm = 'm';
      }
    }
    console.log('dtime ==' + dtime + "parm == " + parm);
    let answer = dtime + ' ' + parm;
    return answer;
  }

  getState() {
    return Promise.resolve(this.state);
  }

  getDistrict(code, status) {
    let district = [];
    for (let i = 0; i < this.district.length; i++) {
      if (code == this.district[i].code) {
        district = this.district[i].data;
        break;
      }
    }
    return Promise.resolve(district);
  }
}
