import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BackendErrorMessagesComponent} from "./components/backend-error-messages/backend-error-messages.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";



@NgModule({
  declarations: [
    BackendErrorMessagesComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  exports: [
    BackendErrorMessagesComponent
  ]
})
export class BackendErrorMessagesModule { }
