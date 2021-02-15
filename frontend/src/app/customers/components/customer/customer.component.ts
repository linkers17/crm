import { Component, OnInit } from '@angular/core';
import {select, Store} from "@ngrx/store";
import {getCustomerByIdAction} from "../../store/actions/getCustomer.action";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {GetCustomerInterface} from "../../types/getCustomer.interface";
import {currentCustomerSelector, isLoadingCustomersSelector} from "../../store/selectors";
import {removeCustomerAction} from "../../store/actions/removeCustomer.action";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  id: string;

  // selectors
  currentCustomer$: Observable<GetCustomerInterface[] | null>;
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeValues();
    this.store.dispatch(getCustomerByIdAction({id: this.id}));
  }

  initializeValues(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isLoading$ = this.store.pipe(select(isLoadingCustomersSelector));
    this.currentCustomer$ = this.store.pipe(select(currentCustomerSelector));
  }

  onRemove(id: string): void {
    this.store.dispatch(removeCustomerAction({id, redirect: true}));
  }
}
