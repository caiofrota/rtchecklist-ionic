import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { Clipboard } from '@ionic-native/clipboard';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { createTranslateLoader } from '../providers/translation-loader';
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
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
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
        Keyboard,
        AdMobPro,
        AppRate,
        Clipboard,
        ChecklistStorageService,
        ChecklistService
    ]
})
export class AppModule {}
