import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams, IonicPage, Loading, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core';
import { ChecklistStorageService, ChecklistService, ChecklistController, IChecklistItem, IChecklistItemShopping, IChecklistItemCommitment, IChecklistItemAccount, EChecklistType } from '../../';

@IonicPage()
@Component({
    selector: 'checklist-item-edit',
    templateUrl: 'checklist-item-edit.html',
})
export class ChecklistItemEditController implements OnInit {
    // Controller attributes.
    private _loading: Loading;

    // Page attributes.
    public checklistType: EChecklistType = 0;
    public checklistItem: any;
    public name: string;
    public quantity: number;
    public value: number;

    /**
     * Constructor.
     */
    constructor(private _loadingController: LoadingController,
                private _navController: NavController,
                private _navParams: NavParams,
                private _toastController: ToastController,
                private _translate: TranslateService,
                private _viewController: ViewController,
                private _checklistStorageService: ChecklistStorageService,
                private _checklistService: ChecklistService) {
        // Do nothing.
    }

    /**
     * Save checklist.
     */
    public save(): void {
        if (this.name) {
            this.showLoading();
            this.checklistItem.once('value', (value: any) => {
                let oldChecklistItem: IChecklistItem = value.val();
                console.log(oldChecklistItem);
                let newChecklistItem: IChecklistItem;
                if (this.checklistType) {
                    let checklistItem: IChecklistItemShopping = { name: this.name, checked: oldChecklistItem.checked };
                    checklistItem.quantity = (this.quantity) ? this.quantity : null;
                    checklistItem.value = (this.value) ? this.value : null;
                    newChecklistItem = checklistItem;
                } else {
                    let checklistItem: IChecklistItemShopping = { name: this.name, checked: oldChecklistItem.checked };
                    newChecklistItem = checklistItem;
                }
                this.checklistItem.set(newChecklistItem).then((updated: any) => {
                    this.hideLoading();
                    this.close();
                    this._toastController.create({
                        message: this._translate.instant('checklist.itemedit.success'),
                        duration: 3000
                    }).present();
                }, (error: any) => {
                    this._toastController.create({
                        message: this._translate.instant('global.error'),
                        duration: 3000
                    }).present();
                });
            }, (error: any) => {
                this._toastController.create({
                    message: this._translate.instant('global.error'),
                    duration: 3000
                }).present();
            });
        } else {
            this._toastController.create({
                message: this._translate.instant('checklist.itemedit.error.name.checklistkey.required'),
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
        this.checklistItem = this._navParams.get('checklistItem');
        this.checklistType = this._navParams.get('checklistType');
        if (this.checklistItem) {
            console.log(this.checklistItem);
            this.checklistItem.once('value', (value) => {
                if (EChecklistType.SHOPPING == this.checklistType) {
                    let data: IChecklistItemShopping = value.val();
                    this.name = data.name;
                    this.quantity = data.quantity;
                    this.value = data.value;
                } else {
                    let data: IChecklistItem = value.val();
                    this.name = data.name;
                }
            });
        }
    }
}  