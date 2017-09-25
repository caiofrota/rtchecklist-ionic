import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams, IonicPage, Loading, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { IChecklistItem, IChecklistItemShopping, IChecklistItemCommitment, IChecklistItemAccount, EChecklistType, EChecklistItemAccountMoviment } from '../../';

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
    public date: Date;
    public dueDate: Date;
    public moviment: EChecklistItemAccountMoviment;

    /**
     * Constructor.
     */
    constructor(private _loadingController: LoadingController,
                private _navParams: NavParams,
                private _toastController: ToastController,
                private _translate: TranslateService,
                private _viewController: ViewController) {
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
                let newChecklistItem: IChecklistItem;
                if (this.checklistType == EChecklistType.SHOPPING) {
                    let checklistItem: IChecklistItemShopping = { name: this.name, checked: oldChecklistItem.checked };
                    checklistItem.quantity = (this.quantity) ? this.quantity : null;
                    checklistItem.value = (this.value) ? this.value : null;
                    newChecklistItem = checklistItem;
                } else if (this.checklistType == EChecklistType.COMMITMENT) {
                    let checklistItem: IChecklistItemCommitment = { name: this.name, checked: oldChecklistItem.checked };
                    checklistItem.date = (this.date) ? this.date : null;
                    newChecklistItem = checklistItem;
                } else if (this.checklistType == EChecklistType.ACCOUNTS) {
                    let checklistItem: IChecklistItemAccount = { name: this.name, checked: oldChecklistItem.checked };
                    checklistItem.dueDate = (this.dueDate) ? this.dueDate : null;
                    checklistItem.moviment = (this.moviment) ? this.moviment : null;
                    checklistItem.value = (this.value) ? this.value : null;
                    newChecklistItem = checklistItem;
                    console.log(newChecklistItem);
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
            this.checklistItem.once('value', (value) => {
                if (EChecklistType.SHOPPING == this.checklistType) {
                    let data: IChecklistItemShopping = value.val();
                    this.name = data.name;
                    this.quantity = data.quantity;
                    this.value = data.value;
                } else if (EChecklistType.COMMITMENT == this.checklistType) {
                    let data: IChecklistItemCommitment = value.val();
                    this.name = data.name;
                    this.date = data.date;
                } else if (EChecklistType.ACCOUNTS == this.checklistType) {
                    let data: IChecklistItemAccount = value.val();
                    this.name = data.name;
                    this.dueDate = data.dueDate;
                    this.moviment = data.moviment;
                    this.value = data.value;
                } else {
                    let data: IChecklistItem = value.val();
                    this.name = data.name;
                }
            });
        }
    }
}
