import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { ChecklistController, ChecklistEditController, ChecklistService, ChecklistStorageService, IChecklist } from '../checklist';

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeController implements OnInit {
    private _loading: Loading;

    // Page attributes.
    filter: string;
    items: Array<FirebaseObjectObservable<IChecklist>>;
    filteredItems: Array<FirebaseObjectObservable<IChecklist>>;

    /**
     * Constructor.
     * 
     * @param NavController _navCtrl Navigation Controller.
     * @param ChecklistService _checklistService Checlist Service.
     * @param AlertController _alertController Alert controller.
     */
    constructor(private _alertController: AlertController,
                private _navCtrl: NavController,
                private _toastCtrl: ToastController,
                private _loadingController: LoadingController,
                private _modalController: ModalController,
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
                        this._toastCtrl.create({
                            message: 'Ocorreu um erro ao recuperar seus checklists.',
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

    public createChecklist_test(): void {
        console.log(ChecklistEditController.name);
        this._modalController.create(ChecklistEditController.name).present();
    }

    /**
     * Show a popup to input a checklist key to create.
     */
    public createChecklist(): void {
        let alert: any = this._alertController.create({
            title: 'Criar Lista',
            message: 'Insira o título da lista a ser criada.<br/>Ex: Lista de Compras',
            inputs: [{
                name: 'checklistTitle',
                placeholder: 'Título da lista.'
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data: any) => { }
                },
                {
                    text: 'Criar',
                    handler: (data: any) => {
                        this._loading = this._loadingController.create({
                            content: 'Carregando...',
                            dismissOnPageChange: true
                        });
                        this._loading.present();
                        if (data.checklistTitle) {
                            this._checklistService.createChecklist(data.checklistTitle).subscribe(
                                (checklist: FirebaseObjectObservable<IChecklist>) => {
                                    this._checklistStorageService.addChecklistKey(checklist.$ref.key);
                                    this.loadItems();
                                    this._navCtrl.push(ChecklistController, { checklist });
                                    this._loading.dismiss();
                                    let toast: any = this._toastCtrl.create({
                                        message: 'Lista criada com sucesso.',
                                        duration: 3000
                                    });
                                    toast.present();
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
                            this.createChecklist();
                            this._toastCtrl.create({
                                message: 'O campo "Título da lista" é obrigatório.',
                                duration: 3000
                            }).present();
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    /**
     * Show a popup to input a checklist key to import.
     */
    public importChecklist(): void {
        let prompt = this._alertController.create({
            title: 'Importar Lista',
            message: 'Cole o código da lista que deseja importar.<br/>Ex: -KsnibokCYzTcCG4tp8p',
            inputs: [{
                name: 'checklistKey',
                placeholder: 'Chave da lista.'
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: (data: any) => { }
                },
                {
                    text: 'Importar',
                    handler: (data: any) => {
                        this._loading = this._loadingController.create({
                            content: 'Carregando...',
                            dismissOnPageChange: true
                        });
                        this._loading.present();
                        console.log(data);
                        if (data.checklistKey) {
                            this._checklistService.getChecklist(data.checklistKey).$ref.once('value', (ref: any) => {
                                let value: IChecklist = ref.val();
                                if (value) {
                                    this._checklistStorageService.addChecklistKey(data.checklistKey);
                                    this.loadItems();
                                    this._loading.dismiss();
                                    this._toastCtrl.create({
                                        message: 'Lista importada com sucesso.',
                                        duration: 3000
                                    }).present();
                                } else {
                                    this._loading.dismiss();
                                    this._toastCtrl.create({
                                        message: 'A lista não foi encontrada.',
                                        duration: 3000
                                    }).present();
                                }
                            }, (error: any) => {
                                this._loading.dismiss();
                                this._toastCtrl.create({
                                    message: 'Ocorreu um erro ao tentar pesquisar a lista. Por favor, tente novamente.',
                                    duration: 3000
                                }).present();
                            })
                            
                        } else {
                            this._loading.dismiss();
                            this.importChecklist();
                            this._toastCtrl.create({
                                message: 'O campo "Chave da lista" é obrigatório.',
                                duration: 3000
                            }).present();
                        }
                    }
                }
            ]
        });
        prompt.present();
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
        this._navCtrl.push(ChecklistController, { checklist: checklist });
    }

    /**
     * Post-constructor.
     */
    ngOnInit(): void {
        this.loadItems();
    }
}
