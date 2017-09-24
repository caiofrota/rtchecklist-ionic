import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams, ToastController, Loading, Modal } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ChecklistService, ChecklistEditController, ChecklistItemEditController, IChecklist, IChecklistItem } from './'

/**
 * Checklist Controller.
 * 
 * @author Caio Frota <contato@caiofrota.com.br>
 * @version 1.0
 */
@Component({
    selector: 'checklist',
    templateUrl: 'checklist.html'
})
export class ChecklistController implements OnInit {
    // Controller attributes.
    private _loading: Loading;

    // Page attributes.
    itemValue: string;
    checklist: FirebaseObjectObservable<IChecklist>;
    checklistItems: FirebaseListObservable<IChecklistItem>;

    /**
     * Constructor.
     * 
     * @param NavController _navCtrl Navigation Controller.
     * @param NavParams _navParams Navigation Parameters.
     * @param ChecklistService _checklistService Checklist Service.
     */
    constructor(private _alertController: AlertController,
                private _clipboard: Clipboard,
                private _loadingController: LoadingController,
                private _modalController: ModalController,
                private _navParams: NavParams,
                private _toastController: ToastController,
                private _translate: TranslateService,
                private _checklistService: ChecklistService) {
        // Do nothing.
    }

    /**
     * Add checklist item.
     * 
     * @param string itemValue Item to be added.
     */
    public createChecklistItem(itemValue: string): void {
        if (itemValue != null) {
            this._checklistService.addChecklistItem(this.checklist.$ref.key, itemValue).subscribe();
            this.itemValue = '';
        }
    }

    /**
     * Remove checklist item.
     * 
     * @param any list Item to be removed.
     */
    public removeChecklistItem(item: IChecklistItem): void {
        this._checklistService.removeChecklistItem(this.checklist.$ref.key, item['$key']);
    }
    
    /**
     * Toggle checked item.
     * 
     * @param any list Item to be removed.
     */
    public toggleChecklistItemChecked(item: IChecklistItem): void {
        item.checked = !item.checked;
        this._checklistService.updateChecklistItem(this.checklist.$ref.key, item);
    }

    /**
     * Show a popup with checklist key to copy.
     */
    public shareChecklist(): void {
        this._alertController.create({
            title: this._translate.instant('checklist.sharelist.title'),
            message: this._translate.instant('checklist.sharelist.description'),
            inputs: [
                {
                    name: 'checklistKey',
                    placeholder: this._translate.instant('checklist.sharelist.checklistkey'),
                    value: this.checklist.$ref.key
                }
            ],
            buttons: [
                {
                    text: this._translate.instant('global.btn.cancel'),
                    handler: (data: any) => {  }
                },
                {
                    text: this._translate.instant('global.btn.copy'),
                    handler: (data: any) => { 
                        this._clipboard.copy(data.checklistKey);
                        this._toastController.create({
                            message: this._translate.instant('checklist.sharelist.copy.success'),
                            duration: 3000
                        }).present();
                    }
                }
            ]
        }).present();
    }

    /**
     * Show a popup with list informations.
     */
    public editChecklist(): void {
        let modal: Modal = this._modalController.create(ChecklistEditController.name, { checklist: this.checklist });
        modal.present();
    }

    /**
     * Show a popup with list informations.
     */
    public editChecklistItem(item: IChecklistItem): void {
        this.showLoading();
        this.checklist.$ref.once('value', (value) => {
            this.hideLoading();
            let data: IChecklist = value.val();
            if (data) {
                let modal: Modal = this._modalController.create(ChecklistItemEditController.name, { checklistType: data.type, checklistItem: this.checklist.$ref.child('items').child(item.$key) });
                modal.present();
            } else {
                this._toastController.create({
                    message: this._translate.instant('global.error'),
                    duration: 3000
                });
            }
        }, (error) => {
            this.hideLoading();
            this._toastController.create({
                message: this._translate.instant('global.error'),
                duration: 3000
            });
        });
    }

    /**
     * Show a popup confirming clear list.
     */
    public clearChecklist(): void {
        this._alertController.create({
            title: this._translate.instant('checklist.clearlist.title'),
            message: this._translate.instant('checklist.clearlist.description'),
            buttons: [
                {
                    text: this._translate.instant('global.btn.cancel')
                },
                {
                    text: this._translate.instant('global.btn.clear'),
                    handler: () => {
                        this.showLoading();
                        this._checklistService.removeChecklistItems(this.checklist.$ref.key).then((data) => {
                            this.hideLoading();
                            this._toastController.create({
                                message: this._translate.instant('checklist.clearlist.clear.cuccess'),
                                duration: 3000
                            }).present();
                        }, (error) => {
                            this.hideLoading();
                            this._toastController.create({
                                message: this._translate.instant('global.error'),
                                duration: 3000
                            }).present();
                        });
                    }
                }
            ]
        }).present();
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
     * Post-constructor.
     * 
     * Update checklist and checklistItems.
     */
    ngOnInit(): void {
        this.showLoading()
        this.checklist = this._navParams.get('checklist');
        this.checklistItems = this._checklistService.getChecklistItems(this.checklist);
        this.checklistItems.$ref.once('value', (value: any) => {
            this.hideLoading()
        }, (error: any) => {
            this.hideLoading()
        })
    }
}
