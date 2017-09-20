import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AdMobPro } from '@ionic-native/admob-pro';

import { MyAppAdMobConfig } from '../providers/app.config';
import { HomeController } from '../pages/home';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomeController;
    admobId: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, AdMobPro: AdMobPro) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

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
                    autoShow: true
                });
            }
        });
    }
}

