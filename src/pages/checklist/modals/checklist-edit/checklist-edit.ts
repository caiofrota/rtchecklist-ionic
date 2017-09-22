import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, IonicPage, Loading, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { ChecklistStorageService, ChecklistService, IChecklist, ChecklistController } from '../../';

@IonicPage()
@Component({
    selector: 'checklist-edit',
    templateUrl: 'checklist-edit.html',
})
export class ChecklistEditController {
    private _loading: Loading;

    // Page attributes.
    public title: string;
    public type: string;

    constructor(private _navCtrl: NavController,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private _toastCtrl: ToastController,
                private _loadingController: LoadingController,
                private _checklistStorageService: ChecklistStorageService,
                private _checklistService: ChecklistService) {
    }

    public save(){
        this._loading = this._loadingController.create({
            content: 'Carregando...',
            dismissOnPageChange: true
        });
        this._loading.present();
        if (this.title) {
            this._checklistService.createChecklist(this.title).subscribe(
                (checklist: FirebaseObjectObservable<IChecklist>) => {
                    this._checklistStorageService.addChecklistKey(checklist.$ref.key);
                    //this.loadItems();
                    this._navCtrl.push(ChecklistController, { checklist });
                    this._loading.dismiss();
                    let toast: any = this._toastCtrl.create({
                        message: 'Lista criada com sucesso.',
                        duration: 3000
                    });
                    toast.present();
                    this.close();
                },
                (error) => {
                    this._loading.dismiss();
                    let toast: any = this._toastCtrl.create({
                        message: 'Ocorreu um erro na criação da lista.',
                        duration: 3000
                    });
                    toast.present();
                }
            );
        } else {
            this._loading.dismiss();
            this._toastCtrl.create({
                message: 'O campo "Título da lista" é obrigatório.',
                duration: 3000
            }).present();
        }
    }

    /**
     * Close page.
     */
    public close(){
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
        
    }
}  