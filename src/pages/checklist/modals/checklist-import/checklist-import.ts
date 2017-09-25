import { Component, OnInit } from '@angular/core';
import { ViewController, IonicPage, Loading, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ChecklistStorageService, ChecklistService, IChecklist } from '../../';

@IonicPage()
@Component({
    selector: 'checklist-import',
    templateUrl: 'checklist-import.html',
})
export class ChecklistImportController implements OnInit {
    // Controller attributes.
    private _loading: Loading;

    // Page attributes.
    public checklistKey: string;

    /**
     * Constructor.
     */
    constructor(private _loadingController: LoadingController,
                private _toastController: ToastController,
                private _translate: TranslateService,
                private _viewController: ViewController,
                private _checklistStorageService: ChecklistStorageService,
                private _checklistService: ChecklistService) {
        // Do nothing.
    }

    /**
     * Import checklist.
     */
    public import(): void {
        if (this.checklistKey) {
            this.showLoading();
            this._checklistService.getChecklist(this.checklistKey).$ref.once('value', (ref: any) => {
                let value: IChecklist = ref.val();
                this.hideLoading();
                if (value) {
                    this._checklistStorageService.addChecklistKey(this.checklistKey);
                    this._toastController.create({
                        message: this._translate.instant('home.checklist.checklistImport.success'),
                        duration: 3000
                    }).present();
                    this.close();
                } else {
                    this._toastController.create({
                        message: this._translate.instant('home.checklist.checklistImport.error.notfount'),
                        duration: 3000
                    }).present();
                }
            }, (error: any) => {
                this.hideLoading();
                this._toastController.create({
                    message: this._translate.instant('global.error'),
                    duration: 3000
                }).present();
            })
        } else {
            this._toastController.create({
                message: this._translate.instant('home.checklist.checklistImport.error.checklistkey.required'),
                duration: 3000
            }).present();
        }
    }

    /**
     * Show loading dialog.
     */
    private showLoading(): void {
        this._loading = this._loadingController.create({
            content: this._translate.instant('global.lbl.loading'),
            dismissOnPageChange: true
        });
        this._loading.present();
    }

    /**
     * Hide loading dialog.
     */
    private hideLoading(): void {
        this._loading.dismiss();
    }

    /**
     * Close page.
     */
    public close(): void {
        this._viewController.dismiss();
    }

    /**
     * Post-constructor.
     */
    ngOnInit(): void {
        this._translate.setDefaultLang('en');
        this._translate.use(navigator.language);
    }
}  