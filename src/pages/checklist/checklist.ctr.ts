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
            title: 'Compartilhar Lista',
            message: 'Copie o código da lista e compartilhe com quem você quiser!',
            inputs: [
                {
                    name: 'checklistKey',
                    placeholder: 'Chave da lista.',
                    value: this.checklist.$ref.key
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data: any) => {  }
                },
                {
                    text: 'Copiar!',
                    handler: (data: any) => { 
                        this._clipboard.copy(data.checklistKey);
                        this._toastController.create({
                            message: "Chave copiada para a área de transferência!",
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
    public editChecklistItem_old(item: IChecklistItem): void {
        this.checklist.$ref.child('items').once('value', (data) => {
            let value: IChecklist = data.val();
            let items = value;
            this._alertController.create({
                title: 'Editar lista',
                inputs: [
                    {
                        label: 'Nome do item',
                        name: 'name',
                        placeholder: 'Nome do item.',
                        value: value[item.$key].name
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: (data: any) => {  }
                    },
                    {
                        text: 'Salvar',
                        handler: (data: any) => {
                            if (data.name) {
                                this._loading = this._loadingController.create({
                                    content: 'Carregando...',
                                    dismissOnPageChange: true
                                });
                                this._loading.present();
                                items[item.$key].name = data.name;
                                this.checklist.$ref.child('items').set(items).then((data: any) => {
                                    this._loading.dismiss();
                                    this._toastController.create({
                                        message: "O item foi renomeado!",
                                        duration: 3000
                                    }).present();
                                }, (error: any) => {
                                    this._loading.dismiss();
                                    this._toastController.create({
                                        message: "Não foi possível editar o item da lista!",
                                        duration: 3000
                                    }).present();
                                });
                            } else {
                                this.editChecklistItem(item);
                                this._toastController.create({
                                    message: 'O campo "Nome do item" é obrigatório.',
                                    duration: 3000
                                }).present();
                            }
                        }
                    }
                ]
            }).present();
        },
        (error) => {
            this._toastController.create({
                message: "Ocorreu um erro ao tentar recuperar as infomações da lista, entre em contato com o administrador!",
                duration: 3000
            }).present();
        })
    }

    /**
     * Show a popup confirming clear list.
     */
    public clearChecklist(): void {
        this._alertController.create({
            title: 'Limpar lista',
            message: 'Deseja realmente remover todos os itens da lista?',
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Limpar lista',
                    handler: () => {
                        this._loading = this._loadingController.create({
                            content: 'Carregando...',
                            dismissOnPageChange: true
                        });
                        this._loading.present();
                        this._checklistService.removeChecklistItems(this.checklist.$ref.key).then((data) => {
                            this._loading.dismiss();
                            this._toastController.create({
                                message: "A lista foi limpa com sucesso!",
                                duration: 3000
                            }).present();
                        }, (error) => {
                            this._loading.dismiss();
                            this._toastController.create({
                                message: "Não foi possível limpar a lista!",
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
        this._loading = this._loadingController.create({
            content: 'Carregando...',
            dismissOnPageChange: true
        });
        this._loading.present();
        this.checklist = this._navParams.get('checklist');
        this.checklistItems = this._checklistService.getChecklistItems(this.checklist);
        this.checklistItems.$ref.once('value', (value: any) => {
            this._loading.dismiss();
        }, (error: any) => {
            this._loading.dismiss();
        })
    }
}
