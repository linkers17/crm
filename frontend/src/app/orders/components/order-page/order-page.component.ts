import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {BackendMessagesInterface} from "../../../shared/types/backendMessages.interface";
import {BackendErrorsInterface} from "../../../shared/types/backendErrors.interface";
import {select, Store} from "@ngrx/store";
import {errorCustomersSelector, successCustomersSelector} from "../../../customers/store/selectors";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {

  // selectors
  successMessages$: Observable<BackendMessagesInterface | null>;
  errorMessages$: Observable<BackendErrorsInterface | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.successMessages$ = this.store.pipe(select(successCustomersSelector));
    this.errorMessages$ = this.store.pipe(select(errorCustomersSelector));
  }

}
