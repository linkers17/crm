import {Component, Input, OnInit} from '@angular/core';
import {BackendErrorsInterface} from "../../../../types/backendErrors.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-backend-error-messages',
  templateUrl: './backend-error-messages.component.html',
  styleUrls: ['./backend-error-messages.component.scss']
})
export class BackendErrorMessagesComponent implements OnInit {

  @Input('backendErrors') backendErrorsProps: BackendErrorsInterface;

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let backendError: string;
    if (Array.isArray(this.backendErrorsProps)) {
      backendError = this.backendErrorsProps.join('\n');
    } else {
      backendError = this.backendErrorsProps.toString();
    }
    this._snackBar.open(backendError, 'Закрыть',  {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'backend-errors'
    });
  }

}
