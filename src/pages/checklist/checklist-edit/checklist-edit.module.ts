import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChecklistEditController } from '../';

@NgModule({
  declarations: [
    ChecklistEditController,
  ],
  imports: [
    IonicPageModule.forChild(ChecklistEditController),
  ],
})
export class ChecklistEditModule {}
