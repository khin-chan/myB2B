import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { CommentPage } from '../pages/comment/comment';
import { RegistrationPage } from '../pages/registration/registration';
import { UserRegistrationPage } from '../pages/user-registration/user-registration';
import { PopoverLanguagePage } from '../pages/popover-language/popover-language';
import { SettingsPage } from '../pages/settings/settings';
import { VideoPage } from '../pages/video/video';
import { BusinessPage } from '../pages/business/business';
import { SaveContentPage } from '../pages/save-content/save-content';
import { SaveContentDetailPage } from '../pages/save-content-detail/save-content-detail';
import { NewsPage } from '../pages/news/news';
import { EditPage } from '../pages/edit/edit';
import { ViewPhotoMessagePage } from '../pages/view-photo-message/view-photo-message';
import { ReplyCommentPage } from '../pages/reply-comment/reply-comment';
import { FirstCreaterPage } from '../pages/first-creater/first-creater';
import { GeneralPage } from '../pages/general/general';
import { InvestmentPage } from '../pages/investment/investment';
import { LeadershipPage } from '../pages/leadership/leadership';
import { WriterPage } from '../pages/writer/writer';
import { BvPage } from '../pages/bv/bv';
import { LogInPage } from '../pages/log-in/log-in';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { FirstStepPage } from '../pages/first-step/first-step';
import { SubSettingsPage } from '../pages/sub-settings/sub-settings';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { WriterListDetailPage } from '../pages/writer-list-detail/writer-list-detail';
import { ConfrimPhonePage } from '../pages/confrim-phone/confrim-phone';
import { NewsTabsPage } from '../pages/news-tabs/news-tabs';
import { BusinessTabsPage } from '../pages/business-tabs/business-tabs';
import { LeaderTabsPage } from '../pages/leader-tabs/leader-tabs';
import { InvestmentTabsPage } from '../pages/investment-tabs/investment-tabs';
import { InnovationTabsPage } from '../pages/innovation-tabs/innovation-tabs';
import { GeneralTabsPage } from '../pages/general-tabs/general-tabs';;
import { FilterPage } from '../pages/filter/filter';
import { LikepersonPage } from '../pages/likeperson/likeperson';
import { SugvideoPage } from '../pages/sugvideo/sugvideo';
import { PopoverCommentPage } from '../pages/popover-comment/popover-comment';
import { WriterPostListPage } from '../pages/writer-post-list/writer-post-list';
import { SingleViewPage } from '../pages/single-view/single-view';
import { SaveContentVideoPage } from '../pages/save-content-video/save-content-video';
import { WriterprofilePage } from '../pages/writerprofile/writerprofile';
import { PremiumPage } from '../pages/premium/premium';
import { PostLikePersonPage } from '../pages/post-like-person/post-like-person';
import { InterviewPage } from '../pages/interview/interview';
import { InterviewTabsPage } from '../pages/interview-tabs/interview-tabs';
import { NotipostPage } from '../pages/notipost/notipost';
import { NotiPage } from '../pages/noti/noti';
import { PostTextPage } from '../pages/post-text/post-text';
import { SetTextPage } from '../pages/set-text/set-text';
import { Autosize } from '../components/autosize';
import { UserPostListPage } from '../pages/user-post-list/user-post-list';
import { LearnFormGuyuPage } from '../pages/learn-form-guyu/learn-form-guyu';
import { TeacherListPage } from '../pages/teacher-list/teacher-list'
import { MobilePostTypePage } from '../pages/mobile-post-type/mobile-post-type';
import { MobilePostListPage } from '../pages/mobile-post-list/mobile-post-list';
import { UserVideopostListPage } from '../pages/user-videopost-list/user-videopost-list';
import { PostVideoPage } from '../pages/post-video/post-video';
import { PromotionLearnerPage } from '../pages/promotion-learner/promotion-learner';
import { NotiReplyCommentPage } from '../pages/noti-reply-comment/noti-reply-comment';
import { PromotionPremiumPage } from '../pages/promotion-premium/promotion-premium';
import { PaymentPage } from '../pages/payment/payment';
import { FCM } from '@ionic-native/fcm';
import { Badge } from '@ionic-native/badge';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Device } from '@ionic-native/device';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { Geolocation } from '@ionic-native/geolocation';
//import { SMS } from '@ionic-native/sms';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Transfer } from '@ionic-native/transfer';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DatePicker } from '@ionic-native/date-picker';
import { Clipboard } from '@ionic-native/clipboard';
import { Crop } from '@ionic-native/crop';
//import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { AppMinimize } from '@ionic-native/app-minimize';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { OrderPipe } from 'ngx-order-pipe';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Base64 } from'@ionic-native/base64';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { GlobalProvider } from '../providers/global/global';
import { ChangelanguageProvider } from '../providers/changelanguage/changelanguage';
import { ChangefontProvider } from '../providers/changefont/changefont';
import { SuperTabsController } from '../providers/super-tabs-controller';
import { EmojiProvider } from '../providers/emoji';
import { FunctProvider } from '../providers/funct/funct';
import { EventLoggerProvider } from '../providers/event-logger/event-logger';

import { TextAvatar } from '../components/text-avatar/text-avatar';
import { EmojiPickerComponent } from '../components/emoji-picker/emoji-picker';
import { DatacleanComponent } from '../components/dataclean/dataclean';
import { OtpConfrimPage } from '../pages/otp-confrim/otp-confrim';
import { OtpCodeConfrimPage } from '../pages/otp-code-confrim/otp-code-confrim';


@NgModule({
  declarations: [
    MyApp,
    Autosize,
    TabsPage,
    HomePage,
    TextAvatar,
    CommentPage,
    UserRegistrationPage,
    RegistrationPage,
    PopoverLanguagePage,
    SettingsPage,
    VideoPage,
    BusinessPage,
    SaveContentPage,
    SaveContentDetailPage,
    NewsPage,
    EditPage,
    EmojiPickerComponent,
    ViewPhotoMessagePage,
    ReplyCommentPage,
    FirstCreaterPage,
    GeneralPage,
    InvestmentPage,
    LeadershipPage,
    WriterPage,
    BvPage,
    LogInPage,
    ChangePasswordPage,
    FirstStepPage,
    SubSettingsPage,
    ForgetPasswordPage,
    WriterListDetailPage,
    ConfrimPhonePage,
    NewsTabsPage,
    BusinessTabsPage,
    LeaderTabsPage,
    InvestmentTabsPage,
    InnovationTabsPage,
    GeneralTabsPage,
    FilterPage,
    LikepersonPage,
    SugvideoPage,
    PopoverCommentPage,
    WriterPostListPage,
    SingleViewPage,
    SaveContentVideoPage,
    WriterprofilePage,
    PremiumPage,
    PostLikePersonPage,
    InterviewPage,
    InterviewTabsPage,
    DatacleanComponent,
    NotipostPage,
    NotiPage,
    PostTextPage,
    SetTextPage,
    UserPostListPage,
    MobilePostTypePage,
    MobilePostListPage,
    UserVideopostListPage,
    PostVideoPage,
    LearnFormGuyuPage,
    TeacherListPage,
    PromotionLearnerPage,
    NotiReplyCommentPage,
    PromotionPremiumPage,
    PaymentPage,
    OtpConfrimPage,
    OtpCodeConfrimPage
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    Ng2OrderModule,
    SuperTabsModule.forRoot(),
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    CommentPage,
    UserRegistrationPage,
    RegistrationPage,
    PopoverLanguagePage,
    SettingsPage,
    VideoPage,
    BusinessPage,
    SaveContentPage,
    SaveContentDetailPage,
    NewsPage,
    EditPage,
    ViewPhotoMessagePage,
    ReplyCommentPage,
    FirstCreaterPage,
    GeneralPage,
    InvestmentPage,
    LeadershipPage,
    WriterPage,
    BvPage,
    LogInPage,
    ChangePasswordPage,
    FirstStepPage,
    SubSettingsPage,
    ForgetPasswordPage,
    WriterListDetailPage,
    ConfrimPhonePage,
    NewsTabsPage,
    BusinessTabsPage,
    LeaderTabsPage,
    InvestmentTabsPage,
    InnovationTabsPage,
    GeneralTabsPage,
    FilterPage,
    LikepersonPage,
    SugvideoPage,
    PopoverCommentPage,
    WriterPostListPage,
    SingleViewPage,
    SaveContentVideoPage,
    WriterprofilePage,
    PremiumPage,
    PostLikePersonPage,
    InterviewPage,
    InterviewTabsPage,
    NotipostPage,
    NotiPage,
    PostTextPage,
    SetTextPage,
    UserPostListPage,
    LearnFormGuyuPage,
    MobilePostTypePage,
    MobilePostListPage,
    UserVideopostListPage,
    PostVideoPage,
    TeacherListPage,
    PromotionLearnerPage,
    NotiReplyCommentPage,
    PromotionPremiumPage,
    PaymentPage,
    OtpConfrimPage,
    OtpCodeConfrimPage
  ],
  
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    Camera,
    File,
    SQLite,
    FileTransfer,
    //AndroidPermissions,
    SuperTabsController,
    DatePipe,
    {
      provide: ErrorHandler, useClass: IonicErrorHandler
    },
    GlobalProvider,
    FunctProvider,
    EmojiProvider,
    ChangelanguageProvider,
    ChangefontProvider,
    ScreenOrientation,
    FCM,
    DatePicker,
    Clipboard,
    Badge,
    Crop,
    AppMinimize,
    MobileAccessibility,
    Transfer,
    DatacleanComponent,
    OrderPipe,
    EventLoggerProvider,
    FirebaseAnalytics,
    InAppBrowser,
    Base64,
    Facebook
  ]
})
export class AppModule { }
