import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPageModule } from 'ionic-angular';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../../../../providers/translation-loader';

import { ChecklistImportController } from '../../';

@NgModule({
    declarations: [
        ChecklistImportController,
    ],
    imports: [
        IonicPageModule.forChild(ChecklistImportController),
        TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }
        })
    ],
})
export class ChecklistImportModule {}
