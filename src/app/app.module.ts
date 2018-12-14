import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CallNumber } from '@ionic-native/call-number';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterPage } from '../pages/register/register';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { RevrsePipe } from '../pipes/revrse/revrse';
import { ProfilePage } from '../pages/profile/profile';
import { EditPage } from '../pages/edit/edit';
import { ViewPage } from '../pages/view/view';
import { Geolocation } from '@ionic-native/geolocation';
import { MapPage } from '../pages/map/map';
import { ViewgpsPage } from '../pages/viewgps/viewgps';
import { DNS } from '@ionic-native/dns';
import { OneSignal } from '@ionic-native/onesignal';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';


// you dont have to hack it :)
var config = {
  apiKey: "AIzaSyDml8NAQEvBRQeO_YSY_miPCRmPcuFev9k",
  authDomain: "fakenews-id.firebaseapp.com",
  databaseURL: "https://fakenews-id.firebaseio.com",
  projectId: "fakenews-id",
  storageBucket: "fakenews-id.appspot.com",
  messagingSenderId: "1098066924806"
};

firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    RegisterPage,
    RevrsePipe,
    ProfilePage,
    EditPage,
    ViewPage,
    MapPage,
    ViewgpsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(config),
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ProfilePage,
    RegisterPage,
    EditPage,
    ViewPage,
    MapPage,
    ViewgpsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    DNS,
    GooglePlus,
    OneSignal,
    Geolocation,
    CallNumber,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
