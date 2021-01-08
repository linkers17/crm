import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessMessagesComponent } from './components/success-messages/success-messages.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";



@NgModule({
  declarations: [SuccessMessagesComponent],
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  exports: [
    SuccessMessagesComponent
  ]
})
export class SuccessMessagesModule { }
