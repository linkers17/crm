import {Component, Input, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {BackendMessagesInterface} from "../../../../types/backendMessages.interface";

@Component({
  selector: 'app-success-messages',
  templateUrl: './success-messages.component.html',
  styleUrls: ['./success-messages.component.scss']
})
export class SuccessMessagesComponent implements OnInit {

  @Input('successMessages') successMessagesProps: BackendMessagesInterface;

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._snackBar.open(this.successMessagesProps.message, 'ОК',  {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'success-messages'
    });
  }

}
