import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, IonicPage } from 'ionic-angular';

@Component({
    selector: 'checklist-edit',
    templateUrl: 'checklist-edit.html',
})
export class ChecklistEditController {
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    }
    public closeModal(){
        this.viewCtrl.dismiss();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ModalPage');
        console.log(this.navParams.get('message'));
    }
}  