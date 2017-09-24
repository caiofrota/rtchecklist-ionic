import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams, IonicPage, Loading, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core';
import { ChecklistStorageService, ChecklistService, ChecklistController, IChecklist, EChecklistType } from '../../';

@IonicPage()
@Component({
    selector: 'checklist-edit',
    templateUrl: 'checklist-edit.html',
})
export class ChecklistEditController implements OnInit {
    // Controller attributes.
    private _loading: Loading;

    // Page attributes.
    public isEdit: boolean = false;
    public checklist: FirebaseObjectObservable<IChecklist>;
    public title: string;
    public type: EChecklistType = 0;
    public permanent: boolean;

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
    public save(){
        if (this.title) {
            this.showLoading();
            if (!this.isEdit) {
                // Create list.
                this._checklistService.createChecklist(this.title, this.type, this.permanent).subscribe(
                    (checklist: FirebaseObjectObservable<IChecklist>) => {
                        this._checklistStorageService.addChecklistKey(checklist.$ref.key);
                        this._navController.push(ChecklistController, { checklist });
                        this.hideLoading();
                        this._toastController.create({
                            message: this._translate.instant('home.checklist.checklistEdit.success.new'),
                            duration: 3000
                        }).present();
                        this.close();
                    },
                    (error) => {
                        this.hideLoading();
                        this._toastController.create({
                            message: this._translate.instant('global.error'),
                            duration: 3000
                        }).present();
                    }
                );
            } else {
                // Edit list.
                this.checklist.$ref.once('value', (value: any) => {
                    let data: IChecklist = value.val();
                    data.name = this.title;
                    data.type = (this.type > 0) ? this.type : null;
                    data.permanent = (this.permanent) ? true : false;
                    this.checklist.set(data).then((data: any) => {
                        this.hideLoading();
                        this._toastController.create({
                            message: this._translate.instant('home.checklist.checklistEdit.success.edit'),
                            duration: 3000
                        }).present();
                        this.close();
                    }, (error: any) => {
                        this.hideLoading();
                        this._toastController.create({
                            message: this._translate.instant('global.error'),
                            duration: 3000
                        }).present();
                    });
                }, (error: any) => {
                    this.hideLoading();
                    this._toastController.create({
                        message: this._translate.instant('global.error'),
                        duration: 3000
                    }).present();
                });
            }
        } else {
            this._toastController.create({
                message: this._translate.instant('home.checklist.checklistEdit.error.title.required'),
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
        this.checklist = this._navParams.get('checklist');
        if (this.checklist) {
            this.isEdit = true;
            this.checklist.$ref.once('value', (value) => {
                let data: IChecklist = value.val();
                if (data) {
                    this.title = data.name;
                    this.type = (data.type) ? data.type : 0;
                    this.permanent = data.permanent;
                }
            });
        }
    }
}  