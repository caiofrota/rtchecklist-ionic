import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController, Loading, Modal } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core';
import { ChecklistController, ChecklistService, ChecklistStorageService, ChecklistEditController, IChecklist } from '../checklist';

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeController implements OnInit {
    // Controller attributes.
    private _loading: Loading;

    // Page attributes.
    filter: string;
    items: Array<FirebaseObjectObservable<IChecklist>>;
    filteredItems: Array<FirebaseObjectObservable<IChecklist>>;

    /**
     * Constructor.
     */
    constructor(private _alertController: AlertController,
                private _loadingController: LoadingController,
                private _modalController: ModalController,
                private _navController: NavController,
                private _toastController: ToastController,
                private _translate: TranslateService,
                private _checklistStorageService: ChecklistStorageService,
                private _checklistService: ChecklistService) {
        // Do nothing.
    }

    /**
     * Perform filter.
     */
    public filterItems(): void {
        this.filteredItems = [];
        this.items.forEach((item: FirebaseObjectObservable<IChecklist>): void => {
            item.subscribe((itemData: IChecklist) => {
                if (this.filter && this.filter.length > 0) {
                    if (itemData && itemData.name && itemData.name.toUpperCase().indexOf(this.filter.toUpperCase()) >= 0) {
                        this.filteredItems.push(item);
                    }
                } else {
                    this.filteredItems.push(item);
                }
            }).unsubscribe();
        });
    }

    /**
     * Load items.
     */
    public loadItems(): void {
        if (!this.items) {
            this.items = [];
        }
        this._checklistStorageService.getChecklistsKeys().forEach((key) => {
            if (key) {
                let exist: boolean = false;
                this.items.forEach((item) => {
                    // Checklist already exists.
                    if (item.$ref.key == key) {
                        exist = true;
                        return;
                    }
                });
                if (exist) {
                    return;
                }
                // Add checklist.
                let observable: FirebaseObjectObservable<IChecklist> = this._checklistService.getChecklist(key);
                this.items.push(observable);
                let subscription = observable.subscribe(
                    (data: IChecklist) => {
                        // Check if data exists.
                        if (!data['$exists']()) {
                            // If no, remove from keys.
                            this._checklistStorageService.removeChecklistKey(key);
                            subscription.unsubscribe();
                        }
                        this.loadItems();
                    },
                    (error: any) => {
                        this._toastController.create({
                            message: this._translate.instant('global.error'),
                            duration: 3000
                        });
                    }
                );
            }
        });
        // Remove inexistents.
        this.items.forEach((item: FirebaseObjectObservable<IChecklist>, i: number) => {
            if (!this._checklistStorageService.existsKey(item.$ref.key)) {
                this.items.splice(i, 1);
            }
        });
        if (!this.filteredItems) {
            this.filteredItems = this.items;
        }
    }

    /**
     * Show a modal page to create a checklist.
     */
    public createChecklist(): void {
        let modal: Modal = this._modalController.create(ChecklistEditController.name);
        modal.onDidDismiss(() => { this.loadItems() });
        modal.present();
    }

    /**
     * Show a popup to input a checklist key to import.
     */
    public importChecklist(): void {
        this._alertController.create({
            title: this._translate.instant('home.importlist.title'),
            message: this._translate.instant('home.importlist.description'),
            inputs: [{
                name: 'checklistKey',
                placeholder: this._translate.instant('home.importlist.checklistkey')
            }],
            buttons: [
                {
                    text: this._translate.instant('global.btn.cancel'),
                    handler: (data: any) => { }
                },
                {
                    text: this._translate.instant('global.btn.import'),
                    handler: (data: any) => {
                        if (data.checklistKey) {
                            this.showLoading();
                            this._checklistService.getChecklist(data.checklistKey).$ref.once('value', (ref: any) => {
                                let value: IChecklist = ref.val();
                                this.hideLoading();
                                if (value) {
                                    this._checklistStorageService.addChecklistKey(data.checklistKey);
                                    this.loadItems();
                                    this._toastController.create({
                                        message: this._translate.instant('home.importlist.success'),
                                        duration: 3000
                                    }).present();
                                } else {
                                    this._toastController.create({
                                        message: this._translate.instant('home.importlist.error.notfount'),
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
                            this.importChecklist();
                            this._toastController.create({
                                message: this._translate.instant('home.importlist.error.checklistkey.required'),
                                duration: 3000
                            }).present();
                        }
                    }
                }
            ]
        }).present();
    }

    /**
     * Remove checklist.
     * 
     * @param FirebaseObjectObservable<IChecklist> list List to be removed.
     */
    public removeList(checklist: FirebaseObjectObservable<IChecklist>): void {
        this._checklistStorageService.removeChecklistKey(checklist.$ref.key);
        this.loadItems();
    }

    /**
     * Edit checklist.
     * 
     * @param FirebaseObjectObservable<IChecklist> checklist Checklist
     */
    public editList(checklist: FirebaseObjectObservable<IChecklist>): void {
        this._navController.push(ChecklistController, { checklist: checklist });
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
     */
    ngOnInit(): void {
        this.loadItems();
    }
}
