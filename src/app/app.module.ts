import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AdMobPro } from '@ionic-native/admob-pro';

import { Clipboard } from '@ionic-native/clipboard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { MyAppFirebaseConfig } from '../providers/app.config';
import { HomeController } from '../pages/home';
import { ChecklistController, ChecklistService, ChecklistStorageService } from '../pages/checklist';

import { MyApp } from './app.component';

@NgModule({
    declarations: [
        MyApp,
        HomeController,
        ChecklistController
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(MyAppFirebaseConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomeController,
        ChecklistController
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AdMobPro,
        Clipboard,
        ChecklistStorageService,
        ChecklistService
    ]
})
export class AppModule {}
