import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { TranslateService } from '@ngx-translate/core';

import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';

import { MyAppAdMobConfig } from '../providers/app.config';
import { HomeController } from '../pages/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomeController;
    admobId: any;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                keyboard: Keyboard,
                translate: TranslateService,
                AdMobPro: AdMobPro,
                appRate: AppRate) {
        translate.setDefaultLang('en');
        translate.use(navigator.language);

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            // Keyboard handle.
            keyboard.onKeyboardShow().subscribe(() => {
                document.body.classList.add('keyboard-is-open');
            });
            keyboard.onKeyboardHide().subscribe(() => {
                document.body.classList.remove('keyboard-is-open');
            });
            
            // AdMob.
            this.admobId = {
                banner: MyAppAdMobConfig.others.banner,
                interstitial: MyAppAdMobConfig.others.interstitial
            };
            if (/(android)/i.test(navigator.userAgent)) {
                this.admobId = {
                    banner: MyAppAdMobConfig.android.banner,
                    interstitial: MyAppAdMobConfig.android.interstitial
                };
            } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
                this.admobId = {
                    banner: MyAppAdMobConfig.ios.banner,
                    interstitial: MyAppAdMobConfig.ios.interstitial
                };
            }
            if(AdMobPro) {
                AdMobPro.createBanner({
                    adId: this.admobId.banner,
                    isTesting: false,
                    position: AdMobPro.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true
                });
            }

            // App rate.
            /**/
            appRate.preferences.usesUntilPrompt = 3;
            appRate.preferences.storeAppURL = {
                ios: '1287179217',
                android: 'market://details?id=com.fortdev.rtchecklist',
                windows: 'ms-windows-store://review/?ProductId=<store_id>'
            };
            appRate.promptForRating(false);
            /**/
        });
    }
}

